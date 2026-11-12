import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

import { cores } from '../utilitarios/cores';

// Lista de "chips" para escolher uma opção.
// opcoes pode ser ['A', 'B'] ou [{ valor: 'a', rotulo: 'A' }].
// horizontal = true deixa os chips numa linha só, com rolagem.
export default function SeletorOpcoes({ opcoes, selecionada, aoSelecionar, horizontal }) {
  const chips = opcoes.map((opcao) => {
    const valor = typeof opcao === 'string' ? opcao : opcao.valor;
    const rotulo = typeof opcao === 'string' ? opcao : opcao.rotulo;
    const ativo = valor === selecionada;

    return (
      <TouchableOpacity
        key={valor}
        style={[styles.chip, ativo && styles.chipAtivo]}
        onPress={() => aoSelecionar(valor)}
      >
        <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>{rotulo}</Text>
      </TouchableOpacity>
    );
  });

  if (horizontal) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linha}>
        {chips}
      </ScrollView>
    );
  }

  return <View style={styles.grade}>{chips}</View>;
}

const styles = StyleSheet.create({
  linha: {
    paddingVertical: 4,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    marginRight: 8,
    marginBottom: 8,
  },
  chipAtivo: {
    backgroundColor: cores.vermelho,
    borderColor: cores.vermelho,
  },
  textoChip: {
    fontSize: 13,
    color: cores.texto,
  },
  textoChipAtivo: {
    color: cores.branco,
    fontWeight: 'bold',
  },
});
