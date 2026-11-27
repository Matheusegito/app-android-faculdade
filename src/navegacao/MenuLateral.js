import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Insights from '../telas/Insights';
import Estoque from '../telas/Estoque';
import Solicitacoes from '../telas/Solicitacoes';
import Usuarios from '../telas/Usuarios';
import { ehAdministrador } from '../servicos/autenticacao';
import { atualizarFotoUsuario } from '../servicos/usuarios';
import { monitorarEstoqueBaixo } from '../servicos/notificacoes';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';
import { escolherImagem } from '../utilitarios/imagem';

const Drawer = createDrawerNavigator();

function ConteudoDoMenu(props) {
  const { usuario, entrar, sair } = useSessao();
  const margens = useSafeAreaInsets();

  // Toque na foto: tira uma foto com a câmera ou escolhe da galeria, salva no Firestore
  // e atualiza a sessão para a foto nova aparecer na hora.
  async function trocarFoto() {
    const foto = await escolherImagem();
    if (!foto) return;

    try {
      await atualizarFotoUsuario(usuario.id, foto);
      entrar({ ...usuario, foto });
    } catch (erro) {
      avisarErroDeConexao('salvar a foto');
    }
  }

  function confirmarSaida() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.perfil}>
          <Image source={require('../../assets/ImagemGracieBarra.jpg')} style={styles.logo} />

          <View style={styles.cartaoUsuario}>
            <TouchableOpacity onPress={trocarFoto} accessibilityLabel="Trocar foto de perfil">
              {usuario?.foto ? (
                <Image source={{ uri: usuario.foto }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarVazio]}>
                  <Text style={styles.inicial}>{usuario?.nome?.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View style={styles.selo}>
                <Ionicons name="camera" size={12} color={cores.branco} />
              </View>
            </TouchableOpacity>

            <View style={styles.textosUsuario}>
              <Text style={styles.nome}>{usuario?.nome}</Text>
              <Text style={styles.tipo}>{ehAdministrador(usuario) ? 'Administrador' : 'Professor'}</Text>
            </View>
          </View>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={[styles.rodape, { paddingBottom: 15 + margens.bottom }]}>
        <TouchableOpacity style={styles.botaoSair} onPress={confirmarSaida}>
          <Ionicons name="log-out-outline" size={20} color={cores.vermelho} />
          <Text style={styles.textoSair}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function icone(nome) {
  return ({ color, size }) => <Ionicons name={nome} color={color} size={size} />;
}

export default function MenuLateral() {
  const { usuario } = useSessao();
  const ehAdmin = ehAdministrador(usuario);

  // Só o administrador recebe as notificações de estoque baixo.
  // O retorno do useEffect para o monitoramento quando ele sai do app.
  useEffect(() => {
    if (!ehAdmin) return;
    return monitorarEstoqueBaixo();
  }, [ehAdmin, usuario?.id]);

  return (
    <Drawer.Navigator
      initialRouteName="Insights"
      drawerContent={(props) => <ConteudoDoMenu {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: cores.vermelho },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: cores.vermelho,
        drawerActiveBackgroundColor: cores.vermelhoClaro,
        drawerInactiveTintColor: cores.texto,
      }}
    >
      <Drawer.Screen
        name="Insights"
        component={Insights}
        options={{ drawerIcon: icone('stats-chart-outline') }}
      />
      <Drawer.Screen
        name="Estoque"
        component={Estoque}
        options={{ drawerIcon: icone('cube-outline') }}
      />
      <Drawer.Screen
        name="Solicitacoes"
        component={Solicitacoes}
        options={{ title: 'Solicitação de reposição', drawerIcon: icone('repeat-outline') }}
      />

      {/* A tela de usuários nem é registrada para o professor */}
      {ehAdministrador(usuario) && (
        <Drawer.Screen
          name="Usuarios"
          component={Usuarios}
          options={{ title: 'Usuários', drawerIcon: icone('people-outline') }}
        />
      )}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  perfil: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 14,
  },
  cartaoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: cores.fundo,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarVazio: {
    backgroundColor: cores.vermelhoClaro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inicial: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.vermelho,
  },
  selo: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: cores.vermelho,
    borderWidth: 2,
    borderColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textosUsuario: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
  },
  tipo: {
    fontSize: 13,
    color: cores.vermelho,
    marginTop: 2,
  },
  rodape: {
    borderTopWidth: 1,
    borderTopColor: cores.borda,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: cores.vermelhoClaro,
  },
  textoSair: {
    color: cores.vermelho,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
