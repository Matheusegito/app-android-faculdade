import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Insights from '../telas/Insights';
import Estoque from '../telas/Estoque';
import Solicitacoes from '../telas/Solicitacoes';
import Usuarios from '../telas/Usuarios';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';

const Drawer = createDrawerNavigator();

function ConteudoDoMenu(props) {
  const { usuario, sair } = useSessao();
  const margens = useSafeAreaInsets();

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
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.tipo}>{ehAdministrador(usuario) ? 'Administrador' : 'Professor'}</Text>
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
    marginBottom: 10,
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
