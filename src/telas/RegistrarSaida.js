import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';

import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';
import { AcessoNegado } from '../componentes/Avisos';
import { registrarSaida } from '../servicos/saidas';
import { ehProfessor } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { avisarErroDeConexao } from '../utilitarios/erros';
import { cores } from '../utilitarios/cores';

// Aberta pelo botão "Registrar saída" de um produto na tela de Estoque.
export default function RegistrarSaida({ navigation, route }) {
  const { usuario } = useSessao();
  const produto = route.params?.produto;

  const [aluno, setAluno] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [salvando, setSalvando] = useState(false);

  if (!ehProfessor(usuario) || !produto) {
    return <AcessoNegado />;
  }

  async function salvar() {
    const qtd = parseInt(quantidade, 10);

    if (!aluno.trim()) {
      Alert.alert('Atenção', 'Informe o nome do aluno.');
      return;
    }
    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      await registrarSaida({ produto, quantidade: qtd, aluno, usuario });
      Alert.alert('Saída registrada', `${qtd} unidade(s) de ${produto.nome} para ${aluno.trim()}.`);
      navigation.goBack();
    } catch (erro) {
      // Erro do Firebase = problema de conexão. Outro erro = nossa validação (ex.: estoque insuficiente).
      if (erro.name === 'FirebaseError') {
        avisarErroDeConexao('registrar a saída');
      } else {
        Alert.alert('Não foi possível registrar', erro.message);
      }
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.resumo}>
          <Text style={styles.nomeProduto}>{produto.nome}</Text>
          <Text style={styles.detalhe}>
            {produto.categoria} · Tam. {produto.tamanho}
          </Text>
          <Text style={styles.detalhe}>
            Em estoque: <Text style={styles.negrito}>{produto.quantidade}</Text>
          </Text>
        </View>

        <CampoTexto
          rotulo="Nome do aluno"
          placeholder="Ex.: João Silva"
          value={aluno}
          onChangeText={setAluno}
        />
        <CampoTexto
          rotulo="Quantidade"
          keyboardType="number-pad"
          value={quantidade}
          onChangeText={setQuantidade}
        />

        <Botao titulo="REGISTRAR SAÍDA" icone="arrow-down-circle-outline" onPress={salvar} carregando={salvando} />
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
});
