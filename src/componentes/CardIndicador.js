import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../utilitarios/cores';

export default function CardIndicador({ icone, valor, titulo, destaque }) {
  const corIcone = destaque ? cores.vermelho : cores.textoSecundario;

  return (
    <View style={styles.card}>
      <View style={[styles.circulo, destaque && styles.circuloDestaque]}>
        <Ionicons name={icone} size={20} color={corIcone} />
      </View>
      <Text style={[styles.valor, destaque && styles.valorDestaque]}>{valor}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  circulo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  circuloDestaque: {
    backgroundColor: cores.vermelhoClaro,
  },
  valor: {
    fontSize: 26,
    fontWeight: 'bold',
    color: cores.texto,
  },
  valorDestaque: {
    color: cores.vermelho,
  },
  titulo: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
});
