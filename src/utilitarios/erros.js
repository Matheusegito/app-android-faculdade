import { Alert } from 'react-native';

// Usado quando o Firebase não responde (sem internet, por exemplo).
export function avisarErroDeConexao(acao) {
  Alert.alert('Erro de conexão', `Não foi possível ${acao}. Verifique a internet e tente novamente.`);
}
