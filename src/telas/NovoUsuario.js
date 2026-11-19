import { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';

import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';
import SeletorOpcoes from '../componentes/SeletorOpcoes';
import { AcessoNegado } from '../componentes/Avisos';
import { adicionarUsuario } from '../servicos/usuarios';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';

const tiposUsuario = [
  { valor: 'professor', rotulo: 'Professor' },
  { valor: 'admin', rotulo: 'Administrador' },
];

export default function NovoUsuario({ navigation }) {
  const { usuario: usuarioLogado } = useSessao();

  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('professor');
  const [salvando, setSalvando] = useState(false);

  if (!ehAdministrador(usuarioLogado)) {
    return <AcessoNegado />;
  }

  async function salvar() {
    if (!nome.trim() || !usuario.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha nome, usuário e senha.');
      return;
    }
    if (usuario.includes(' ')) {
      Alert.alert('Atenção', 'O nome de usuário não pode ter espaços.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setSalvando(true);
    try {
      await adicionarUsuario({ nome, usuario, senha, tipo });
      navigation.goBack();
    } catch (erro) {
      // Erro do Firebase = problema de conexão. Outro erro = nossa validação (ex.: usuário repetido).
      if (erro.name === 'FirebaseError') {
        avisarErroDeConexao('cadastrar o usuário');
      } else {
        Alert.alert('Não foi possível cadastrar', erro.message);
      }
    }
    setSalvando(false);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <CampoTexto rotulo="Nome" placeholder="Ex.: Ana Souza" value={nome} onChangeText={setNome} />
        <CampoTexto
          rotulo="Nome de usuário"
          placeholder="Ex.: ana.souza"
          autoCapitalize="none"
          autoCorrect={false}
          value={usuario}
          onChangeText={setUsuario}
        />
        <CampoTexto
          rotulo="Senha"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.rotulo}>Tipo de usuário</Text>
        <SeletorOpcoes opcoes={tiposUsuario} selecionada={tipo} aoSelecionar={setTipo} />
        <Text style={styles.ajuda}>
          {tipo === 'admin'
            ? 'Administradores têm acesso a todas as funções do app.'
            : 'Professores consultam o estoque e fazem solicitações de reposição.'}
        </Text>

        <Botao titulo="CADASTRAR USUÁRIO" onPress={salvar} carregando={salvando} />
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
  ajuda: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginBottom: 20,
  },
});
