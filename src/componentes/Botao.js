import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../utilitarios/cores';

// variante: 'primario' (vermelho), 'secundario' (contorno) ou 'perigo'
export default function Botao({ titulo, onPress, variante = 'primario', icone, carregando, desabilitado, estilo }) {
  const corTexto = variante === 'primario' ? cores.branco : cores.vermelho;

  return (
    <TouchableOpacity
      style={[styles.botao, styles[variante], (desabilitado || carregando) && styles.desabilitado, estilo]}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={18} color={corTexto} style={styles.icone} />}
          <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primario: {
    backgroundColor: cores.vermelho,
  },
  secundario: {
    backgroundColor: cores.branco,
    borderWidth: 1.5,
    borderColor: cores.vermelho,
  },
  perigo: {
    backgroundColor: cores.vermelhoClaro,
  },
  desabilitado: {
    opacity: 0.6,
  },
  icone: {
    marginRight: 8,
  },
  texto: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
