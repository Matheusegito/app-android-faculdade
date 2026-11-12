import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import BotaoFlutuante from '../componentes/BotaoFlutuante';
import { AcessoNegado, ListaVazia } from '../componentes/Avisos';
import { listarUsuarios, excluirUsuario } from '../servicos/usuarios';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';

export default function Usuarios({ navigation }) {
  const { usuario: usuarioLogado } = useSessao();
  const [usuarios, setUsuarios] = useState([]);

  async function carregarUsuarios() {
    setUsuarios(await listarUsuarios());
  }

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [])
  );

  if (!ehAdministrador(usuarioLogado)) {
    return <AcessoNegado />;
  }

  function confirmarExclusao(usuario) {
    Alert.alert('Excluir usuário', `Deseja excluir "${usuario.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirUsuario(usuario.id);
          carregarUsuarios();
        },
      },
    ]);
  }

  function renderizarUsuario({ item }) {
    const admin = item.tipo === 'admin';
    const ehVoce = item.id === usuarioLogado.id;

    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.inicial}>{item.nome.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.nome}>
            {item.nome} {ehVoce && <Text style={styles.voce}>(você)</Text>}
          </Text>
          <Text style={styles.login}>@{item.usuario}</Text>
          <View style={[styles.etiqueta, admin && styles.etiquetaAdmin]}>
            <Text style={[styles.textoEtiqueta, admin && styles.textoEtiquetaAdmin]}>
              {admin ? 'Administrador' : 'Professor'}
            </Text>
          </View>
        </View>

        {/* Ninguém pode excluir a própria conta enquanto está logado */}
        {!ehVoce && (
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => confirmarExclusao(item)}>
            <Ionicons name="trash-outline" size={20} color={cores.vermelho} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={renderizarUsuario}
        ListEmptyComponent={<ListaVazia mensagem="Nenhum usuário cadastrado." />}
      />

      <BotaoFlutuante icone="person-add" onPress={() => navigation.navigate('NovoUsuario')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    padding: 14,
    paddingBottom: 110,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: cores.vermelhoClaro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inicial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.vermelho,
  },
  informacoes: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.texto,
  },
  voce: {
    fontWeight: 'normal',
    color: cores.textoSecundario,
  },
  login: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    backgroundColor: cores.fundo,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  etiquetaAdmin: {
    backgroundColor: cores.vermelhoClaro,
  },
  textoEtiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.textoSecundario,
  },
  textoEtiquetaAdmin: {
    color: cores.vermelho,
  },
  botaoExcluir: {
    padding: 8,
  },
});
