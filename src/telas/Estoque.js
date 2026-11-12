import { useCallback, useState } from 'react';
import { View, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ItemProduto from '../componentes/ItemProduto';
import SeletorOpcoes from '../componentes/SeletorOpcoes';
import BotaoFlutuante from '../componentes/BotaoFlutuante';
import { ListaVazia } from '../componentes/Avisos';
import { listarProdutos, excluirProduto, atualizarQuantidade } from '../servicos/produtos';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { categorias } from '../dados/dadosProdutos';
import { cores } from '../utilitarios/cores';

export default function Estoque({ navigation }) {
  const { usuario } = useSessao();
  const ehAdmin = ehAdministrador(usuario);

  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  async function carregarProdutos() {
    setProdutos(await listarProdutos());
  }

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  const produtosFiltrados = produtos.filter((p) => {
    const nomeConfere = p.nome.toLowerCase().includes(pesquisa.trim().toLowerCase());
    const categoriaConfere = categoria === 'Todas' || p.categoria === categoria;
    return nomeConfere && categoriaConfere;
  });

  async function alterarQuantidade(produto, valor) {
    await atualizarQuantidade(produto.id, produto.quantidade + valor);
    carregarProdutos();
  }

  function confirmarExclusao(produto) {
    Alert.alert('Excluir produto', `Deseja excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirProduto(produto.id);
          carregarProdutos();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <View style={styles.pesquisa}>
          <Ionicons name="search" size={18} color={cores.textoSecundario} />
          <TextInput
            style={styles.campoPesquisa}
            placeholder="Pesquisar por nome"
            placeholderTextColor={cores.textoSecundario}
            value={pesquisa}
            onChangeText={setPesquisa}
          />
        </View>
        <SeletorOpcoes
          horizontal
          opcoes={['Todas', ...categorias]}
          selecionada={categoria}
          aoSelecionar={setCategoria}
        />
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<ListaVazia mensagem="Nenhum produto encontrado." />}
        renderItem={({ item }) => (
          <ItemProduto
            produto={item}
            ehAdmin={ehAdmin}
            aoEditar={(produto) => navigation.navigate('FormularioProduto', { produto })}
            aoExcluir={confirmarExclusao}
            aoAlterarQuantidade={alterarQuantidade}
            aoSolicitar={(produto) => navigation.navigate('NovaSolicitacao', { produtoId: produto.id })}
          />
        )}
      />

      {ehAdmin && <BotaoFlutuante onPress={() => navigation.navigate('FormularioProduto')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  filtros: {
    backgroundColor: cores.branco,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  pesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
  },
  campoPesquisa: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: cores.texto,
  },
  lista: {
    padding: 14,
    paddingBottom: 110,
  },
});
