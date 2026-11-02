import 'react-native-gesture-handler';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import TelaLogin from './components/TelaLogin';
import TelaMenuPrincipal from './components/TelaMenuPrincipal';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('login');

  if (telaAtual === 'menu') {
    return (
      <NavigationContainer>
        <TelaMenuPrincipal
          onLogout={() => setTelaAtual('login')}
        />
      </NavigationContainer>
    );
  }

  return (
    <TelaLogin
      onLoginSucesso={() => setTelaAtual('menu')}
    />
  );
}