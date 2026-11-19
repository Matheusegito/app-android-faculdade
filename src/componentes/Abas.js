import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { cores } from '../utilitarios/cores';

// Abas no topo da tela. opcoes: [{ valor: 'produtos', rotulo: 'Produtos' }, ...]
export default function Abas({ opcoes, selecionada, aoSelecionar }) {
  return (
    <View style={styles.container}>
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === selecionada;
        return (
          <TouchableOpacity
            key={opcao.valor}
            style={[styles.aba, ativa && styles.abaAtiva]}
            onPress={() => aoSelecionar(opcao.valor)}
          >
            <Text style={[styles.texto, ativa && styles.textoAtivo]}>{opcao.rotulo}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: cores.branco,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  abaAtiva: {
    borderBottomColor: cores.vermelho,
  },
  texto: {
    fontSize: 15,
    color: cores.textoSecundario,
  },
  textoAtivo: {
    color: cores.vermelho,
    fontWeight: 'bold',
  },
});
