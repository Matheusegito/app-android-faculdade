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

export default function NovaSolicitacao({ navigation, route }) {
  const { usuario } = useSessao();

  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState(route.params?.produtoId ?? null);
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarProdutos().then(setProdutos);
  }, []);

  if (!ehProfessor(usuario)) {
    return <AcessoNegado />;
  }

  async function enviar() {
    const produto = produtos.find((p) => p.id === produtoId);
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
    await criarSolicitacao({ produto, quantidade: qtd, observacao, usuario });
    setEnviando(false);

    Alert.alert('Solicitação enviada', 'O administrador vai analisar o seu pedido.');
    navigation.goBack();
  }

  const opcoesProdutos = produtos.map((p) => ({ valor: p.id, rotulo: `${p.nome} (${p.tamanho})` }));

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.rotulo}>Produto</Text>
        <SeletorOpcoes opcoes={opcoesProdutos} selecionada={produtoId} aoSelecionar={setProdutoId} />

        <View style={styles.espaco} />

        <CampoTexto
          rotulo="Quantidade desejada"
          placeholder="Ex.: 5"
          keyboardType="number-pad"
          value={quantidade}
          onChangeText={setQuantidade}
        />

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
});
