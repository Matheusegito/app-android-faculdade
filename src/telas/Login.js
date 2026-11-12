import { useState } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';
import { fazerLogin } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { cores } from '../utilitarios/cores';

export default function Login() {
  const { entrar } = useSessao();
  const margens = useSafeAreaInsets();

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function realizarLogin() {
    if (!usuario.trim() || !senha) {
      setErro('Preencha o usuário e a senha.');
      return;
    }

    setErro('');
    setCarregando(true);
    const usuarioLogado = await fazerLogin(usuario, senha);
    setCarregando(false);

    if (usuarioLogado) {
      entrar(usuarioLogado);
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.faixa, { height: 50 + margens.top }]} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/ImagemGracieBarra.jpg')} style={styles.logo} />

          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>Faça login para continuar</Text>

          <View style={styles.formulario}>
            <CampoTexto
              placeholder="Usuário"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <CampoTexto
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              onSubmitEditing={realizarLogin}
            />

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Botao titulo="ENTRAR" onPress={realizarLogin} carregando={carregando} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.faixa, { height: 40 + margens.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  faixa: {
    backgroundColor: cores.vermelho,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: cores.vermelho,
    marginBottom: 25,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.vermelho,
  },
  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 8,
    marginBottom: 30,
  },
  formulario: {
    width: '100%',
  },
  erro: {
    color: cores.vermelho,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
