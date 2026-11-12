import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../utilitarios/cores';

// Mensagem mostrada quando uma lista está vazia.
export function ListaVazia({ mensagem }) {
  return (
    <View style={styles.container}>
      <Ionicons name="file-tray-outline" size={42} color={cores.borda} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

// Mostrada quando alguém tenta abrir uma tela sem ter permissão.
export function AcessoNegado() {
  return (
    <View style={[styles.container, styles.telaCheia]}>
      <Ionicons name="lock-closed-outline" size={48} color={cores.vermelho} />
      <Text style={styles.titulo}>Acesso restrito</Text>
      <Text style={styles.texto}>Você não tem permissão para acessar esta tela.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
  },
  telaCheia: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 12,
  },
  texto: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
  },
});
