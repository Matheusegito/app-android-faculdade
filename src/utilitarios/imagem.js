import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Foto quadrada e comprimida, igual para câmera e galeria.
const opcoes = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
};

async function tirarFoto() {
  // A câmera precisa de permissão explícita do usuário.
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Câmera bloqueada', 'Permita o acesso à câmera nas configurações do celular para tirar fotos.');
    return null;
  }
  return ImagePicker.launchCameraAsync(opcoes);
}

// Pergunta se a foto vem da câmera ou da galeria.
// Devolve a URI da imagem escolhida, ou null se o usuário cancelar.
export function escolherImagem() {
  return new Promise((resolve) => {
    const abrir = (origem) => async () => {
      try {
        const resultado = origem === 'camera' ? await tirarFoto() : await ImagePicker.launchImageLibraryAsync(opcoes);
        resolve(resultado && !resultado.canceled ? resultado.assets[0].uri : null);
      } catch (erro) {
        resolve(null);
      }
    };

    Alert.alert(
      'Foto',
      'De onde vem a foto?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
        { text: 'Galeria', onPress: abrir('galeria') },
        { text: 'Câmera', onPress: abrir('camera') },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}
