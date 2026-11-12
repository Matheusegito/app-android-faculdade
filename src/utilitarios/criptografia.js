import * as Crypto from 'expo-crypto';

// SHA-256 da senha. Serve para demonstrar o uso de hash no trabalho;
// não é segurança de produção (para isso usaremos o Firebase Authentication).
export async function gerarHash(senha) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, senha);
}
