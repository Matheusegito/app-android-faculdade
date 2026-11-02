
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, Alert } from 'react-native';

////////////////////// Cores ////////////////////// 

const CorVermelha = '#E2211C';
const CorFundo = '#F2F4F8';
const CorBranca = '#FFFFFF';
const CorCinza = '#777777';
const CorCinzaClaro = '#DCE2EC';
const CorBorda = '#DDDDDD';

/////////////////////////////////////////////////

export default function TelaLogin({ onLoginSucesso }){

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function realizarLogin() {

    if (username === 'admin' && password === 'senha'){
      onLoginSucesso();
    } 
    else{
      Alert.alert(
        'Login inválido',
        'Usuário ou senha incorretos!'
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor={CorVermelha}
        barStyle="light-content"
      />

      <View style={styles.header} />

      <View style={styles.content}>

        <Image
          source={require('../assets/ImagemGracieBarra.jpg')}
          style={styles.avatar}
        />

        <Text style={styles.title}>Bem-vindo!</Text>

        <Text style={styles.subtitle}>
          Faça login para continuar
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={realizarLogin}
        >
          <Text style={styles.buttonText}>
            ENTRAR
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.footer} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: CorFundo
  },

  header: {
    height: 65,
    backgroundColor: CorVermelha
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: CorCinzaClaro,
    borderWidth: 3,
    borderColor: CorVermelha,
    marginBottom: 25
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: CorVermelha
  },

  subtitle: {
    fontSize: 14,
    color: CorCinza,
    marginTop: 8,
    marginBottom: 30
  },

  input: {
    width: '100%',
    height: 52,
    backgroundColor: CorBranca,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: CorBorda,
    fontSize: 16
  },

  button: {
    width: '100%',
    height: 52,
    backgroundColor: CorVermelha,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },

  buttonText: {
    color: CorBranca,
    fontSize: 16,
    fontWeight: 'bold'
  },

  footer: {
    height: 55,
    backgroundColor: CorVermelha
  }
});
