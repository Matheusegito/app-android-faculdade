import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CardIndicador from '../componentes/CardIndicador';
import { ListaVazia } from '../componentes/Avisos';
import { listarProdutos } from '../servicos/produtos';
import { listarSolicitacoes } from '../servicos/solicitacoes';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { statusSolicitacao } from '../dados/dadosSolicitacoes';
import { estaComEstoqueBaixo } from '../utilitarios/formatacao';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';

export default function Insights() {
  const { usuario } = useSessao();
  const [produtos, setProdutos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarResumo() {
    if (!usuario) return;

    setCarregando(true);
    try {
      setProdutos(await listarProdutos());
      setSolicitacoes(await listarSolicitacoes(usuario));
    } catch (erro) {
      avisarErroDeConexao('carregar o resumo do estoque');
    }
    setCarregando(false);
  }

  // Recarrega os dados sempre que a tela volta a aparecer.
  useFocusEffect(
    useCallback(() => {
      carregarResumo();
    }, [usuario])
  );

  // Enquanto os dados ainda não chegaram, mostra "–" em vez de 0.
  const aindaSemDados = carregando && produtos.length === 0;
  const exibir = (numero) => (aindaSemDados ? '–' : numero);

  const totalUnidades = produtos.reduce((soma, p) => soma + p.quantidade, 0);
  const produtosEstoqueBaixo = produtos.filter(estaComEstoqueBaixo);
  const pendentes = solicitacoes.filter((s) => s.status === statusSolicitacao.pendente).length;

  const cabecalho = (
    <View>
      <Text style={styles.saudacao}>Olá, {usuario?.nome}!</Text>
      <Text style={styles.subtitulo}>Resumo do estoque da academia</Text>

      <View style={styles.linhaCards}>
        <CardIndicador icone="pricetags-outline" valor={exibir(produtos.length)} titulo="Produtos cadastrados" />
        <CardIndicador icone="cube-outline" valor={exibir(totalUnidades)} titulo="Unidades disponíveis" />
      </View>
      <View style={styles.linhaCards}>
        <CardIndicador
          icone="alert-circle-outline"
          valor={exibir(produtosEstoqueBaixo.length)}
          titulo="Com estoque baixo"
          destaque={produtosEstoqueBaixo.length > 0}
        />
        <CardIndicador
          icone="time-outline"
          valor={exibir(pendentes)}
          titulo={ehAdministrador(usuario) ? 'Solicitações pendentes' : 'Minhas pendentes'}
          destaque={pendentes > 0}
        />
      </View>

      <Text style={styles.tituloSecao}>Produtos com estoque baixo</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={produtosEstoqueBaixo}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={cabecalho}
      refreshing={carregando}
      onRefresh={carregarResumo}
      ListEmptyComponent={carregando ? null : <ListaVazia mensagem="Nenhum produto com estoque baixo." />}
      renderItem={({ item }) => (
        <View style={styles.itemBaixo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nomeProduto}>{item.nome}</Text>
            <Text style={styles.detalhe}>
              {item.categoria} · Tam. {item.tamanho}
            </Text>
          </View>
          <Text style={styles.quantidade}>
            {item.quantidade}/{item.quantidadeMinima}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 14,
    paddingBottom: 40,
  },
  saudacao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
    marginHorizontal: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  linhaCards: {
    flexDirection: 'row',
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 6,
  },
  itemBaixo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: cores.vermelho,
  },
  nomeProduto: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
  },
  detalhe: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  quantidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.vermelho,
  },
});
