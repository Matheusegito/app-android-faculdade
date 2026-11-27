import { useCallback, useState } from 'react';
import { View, TextInput, FlatList, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Abas from '../componentes/Abas';
import ItemProduto from '../componentes/ItemProduto';
import ListaSaidas from '../componentes/ListaSaidas';
import SeletorOpcoes from '../componentes/SeletorOpcoes';
import BotaoFlutuante from '../componentes/BotaoFlutuante';
import { ListaVazia } from '../componentes/Avisos';
import { listarProdutos, excluirProduto, atualizarQuantidade } from '../servicos/produtos';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { categorias } from '../dados/dadosProdutos';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';

const abas = [
  { valor: 'produtos', rotulo: 'Produtos' },
  { valor: 'saidas', rotulo: 'Saídas' },
];

export default function Estoque({ navigation }) {
  const { usuario } = useSessao();
  const ehAdmin = ehAdministrador(usuario);

  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState('produtos');

  async function carregarProdutos() {
    setCarregando(true);
    try {
      setProdutos(await listarProdutos());
    } catch (erro) {
      avisarErroDeConexao('carregar os produtos');
    }
    setCarregando(false);
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

  // Depois de salvar no banco, atualiza só o produto alterado na lista,
  // sem precisar baixar tudo de novo.
  async function alterarQuantidade(produto, valor) {
    const novaQuantidade = Math.max(0, produto.quantidade + valor);
    try {
      await atualizarQuantidade(produto.id, novaQuantidade);
      setProdutos((lista) => lista.map((p) => (p.id === produto.id ? { ...p, quantidade: novaQuantidade } : p)));
    } catch (erro) {
      avisarErroDeConexao('atualizar a quantidade');
    }
  }

  function confirmarExclusao(produto) {
    Alert.alert('Excluir produto', `Deseja excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirProduto(produto.id);
            setProdutos((lista) => lista.filter((p) => p.id !== produto.id));
          } catch (erro) {
            avisarErroDeConexao('excluir o produto');
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Abas opcoes={abas} selecionada={aba} aoSelecionar={setAba} />

      {aba === 'saidas' ? (
        <ListaSaidas usuario={usuario} />
      ) : (
        <>
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
            keyboardShouldPersistTaps="handled"
            refreshing={carregando}
            onRefresh={carregarProdutos}
            ListEmptyComponent={carregando ? null : <ListaVazia mensagem="Nenhum produto encontrado." />}
            renderItem={({ item }) => (
              <ItemProduto
                produto={item}
                ehAdmin={ehAdmin}
                aoEditar={(produto) => navigation.navigate('FormularioProduto', { produto })}
                aoExcluir={confirmarExclusao}
                aoAlterarQuantidade={alterarQuantidade}
                aoSolicitar={(produto) => navigation.navigate('NovaSolicitacao', { produto })}
                aoRegistrarSaida={(produto) => navigation.navigate('RegistrarSaida', { produto })}
              />
            )}
          />

          {ehAdmin && <BotaoFlutuante onPress={() => navigation.navigate('FormularioProduto')} />}
        </>
      )}
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
