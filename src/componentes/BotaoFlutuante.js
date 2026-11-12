import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores } from '../utilitarios/cores';

export default function BotaoFlutuante({ onPress, icone = 'add' }) {
  const margens = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.botao, { bottom: 24 + margens.bottom }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icone} size={28} color={cores.branco} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: cores.vermelho,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
