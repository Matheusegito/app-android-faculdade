import { View, Text, TextInput, StyleSheet } from 'react-native';

import { cores } from '../utilitarios/cores';

export default function CampoTexto({ rotulo, multiline, ...props }) {
  return (
    <View style={styles.container}>
      {rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <TextInput
        style={[styles.campo, multiline && styles.campoGrande]}
        placeholderTextColor={cores.textoSecundario}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 6,
  },
  campo: {
    height: 50,
    backgroundColor: cores.branco,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: 14,
    fontSize: 15,
    color: cores.texto,
  },
  campoGrande: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});
