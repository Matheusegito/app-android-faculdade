import 'react-native-gesture-handler';

import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Navegacao from './src/navegacao/Navegacao';
import { inicializarDados } from './src/servicos/armazenamento';
import { cores } from './src/utilitarios/cores';

export default function App() {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    inicializarDados().finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <ActivityIndicator size="large" color={cores.vermelho} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Navegacao />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
