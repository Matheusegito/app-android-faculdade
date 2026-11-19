import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../telas/Login';
import MenuLateral from './MenuLateral';
import FormularioProduto from '../telas/FormularioProduto';
import NovaSolicitacao from '../telas/NovaSolicitacao';
import NovoUsuario from '../telas/NovoUsuario';
import RegistrarSaida from '../telas/RegistrarSaida';
import { SessaoContexto } from '../contexto/SessaoContexto';
import { ehAdministrador, ehProfessor } from '../servicos/autenticacao';
import { cores } from '../utilitarios/cores';

const Stack = createNativeStackNavigator();

// Sem ninguém logado, o Stack só tem a tela de Login.
// Depois do login, o Stack passa a ter o menu lateral (Drawer) e as telas de formulário.
// Ao sair, o usuário volta a ser null e o app retorna para o Login automaticamente.
export default function Navegacao() {
  const [usuario, setUsuario] = useState(null);

  const sessao = {
    usuario,
    entrar: setUsuario,
    sair: () => setUsuario(null),
  };

  return (
    <SessaoContexto.Provider value={sessao}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: cores.vermelho },
            headerTintColor: cores.branco,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {!usuario ? (
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Principal" component={MenuLateral} options={{ headerShown: false }} />

              {ehAdministrador(usuario) && (
                <>
                  <Stack.Screen
                    name="FormularioProduto"
                    component={FormularioProduto}
                    options={({ route }) => ({
                      title: route.params?.produto ? 'Editar produto' : 'Novo produto',
                    })}
                  />
                  <Stack.Screen name="NovoUsuario" component={NovoUsuario} options={{ title: 'Novo usuário' }} />
                </>
              )}

              {ehProfessor(usuario) && (
                <>
                  <Stack.Screen
                    name="NovaSolicitacao"
                    component={NovaSolicitacao}
                    options={{ title: 'Nova solicitação' }}
                  />
                  <Stack.Screen
                    name="RegistrarSaida"
                    component={RegistrarSaida}
                    options={{ title: 'Registrar saída' }}
                  />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SessaoContexto.Provider>
  );
}
