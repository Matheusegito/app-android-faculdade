// No Jest não existe o módulo nativo do celular, então usamos versões de teste.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mesmo SHA-256 do expo-crypto, mas calculado pelo Node.
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: async (algoritmo, texto) =>
    require('crypto').createHash('sha256').update(texto).digest('hex'),
}));
