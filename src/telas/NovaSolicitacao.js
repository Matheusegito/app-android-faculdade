import { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';

import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';
import SeletorOpcoes from '../componentes/SeletorOpcoes';
import { AcessoNegado } from '../componentes/Avisos';
import { listarProdutos } from '../servicos/produtos';
import { criarSolicitacao } from '../servicos/solicitacoes';
import { ehProfessor } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';
import { formatarPreco, calcularValorTotal } from '../utilitarios/formatacao';

// Aberta de dois jeitos:
// - pelo botão "Solicitar reposição" de um produto no Estoque: o produto vem fixo e não pode ser trocado;
// - pelo botão + da tela de Solicitações: o professor escolhe o produto na lista.
export default function NovaSolicitacao({ navigation, route }) {
  const { usuario } = useSessao();
  const produtoFixo = route.params?.produto;

  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Com o produto fixo, a lista não é usada.
    if (produtoFixo) return;

    listarProdutos()
      .then(setProdutos)
      .catch(() => avisarErroDeConexao('carregar os produtos'));
  }, [produtoFixo]);

  if (!ehProfessor(usuario)) {
    return <AcessoNegado />;
  }

  async function enviar() {
    const produto = produtoFixo ?? produtos.find((p) => p.id === produtoId);
    const qtd = parseInt(quantidade, 10);

    if (!produto) {
      Alert.alert('Atenção', 'Escolha um produto.');
      return;
    }
    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade maior que zero.');
      return;
    }

    setEnviando(true);
    try {
      await criarSolicitacao({ produto, quantidade: qtd, observacao, usuario });
      Alert.alert('Solicitação enviada', 'O administrador vai analisar o seu pedido.');
      navigation.goBack();
    } catch (erro) {
      avisarErroDeConexao('enviar a solicitação');
      setEnviando(false);
    }
  }

  const opcoesProdutos = produtos.map((p) => ({ valor: p.id, rotulo: `${p.nome} (${p.tamanho})` }));

  // Prévia do valor que vai junto com a solicitação para o administrador.
  const produtoAtual = produtoFixo ?? produtos.find((p) => p.id === produtoId);
  const valorEstimado = calcularValorTotal(parseInt(quantidade, 10), produtoAtual?.preco);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        {produtoFixo ? (
          <View style={styles.resumo}>
            <Text style={styles.nomeProduto}>{produtoFixo.nome}</Text>
            <Text style={styles.detalhe}>
              {produtoFixo.categoria} · Tam. {produtoFixo.tamanho}
            </Text>
            <Text style={styles.detalhe}>
              Em estoque: <Text style={styles.negrito}>{produtoFixo.quantidade}</Text>
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.rotulo}>Produto</Text>
            <SeletorOpcoes opcoes={opcoesProdutos} selecionada={produtoId} aoSelecionar={setProdutoId} />
            <View style={styles.espaco} />
          </>
        )}

        <CampoTexto
          rotulo="Quantidade desejada"
          placeholder="Ex.: 5"
          keyboardType="number-pad"
          value={quantidade}
          onChangeText={setQuantidade}
        />

        {valorEstimado !== null && (
          <Text style={styles.valor}>
            Valor da solicitação: <Text style={styles.negrito}>{formatarPreco(valorEstimado)}</Text>
          </Text>
        )}

        <CampoTexto
          rotulo="Observação (opcional)"
          placeholder="Ex.: muitos alunos novos na turma kids"
          multiline
          value={observacao}
          onChangeText={setObservacao}
        />

        <Botao titulo="ENVIAR SOLICITAÇÃO" icone="send" onPress={enviar} carregando={enviando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 50,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 8,
  },
  espaco: {
    height: 8,
  },
  resumo: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  nomeProduto: {
    fontSize: 17,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 4,
  },
  detalhe: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  negrito: {
    fontWeight: 'bold',
    color: cores.texto,
  },
  valor: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: -6,
    marginBottom: 14,
  },
});
