// No Jest não existe o módulo nativo do celular, então usamos versões de teste.

// Mesmo SHA-256 do expo-crypto, mas calculado pelo Node.
jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: async (algoritmo, texto) =>
    require('crypto').createHash('sha256').update(texto).digest('hex'),
}));

// Firestore falso, em memória, para os testes não dependerem da internet.
jest.mock('firebase/app', () => ({ initializeApp: () => ({}) }));

jest.mock('firebase/firestore', () => {
  const bancos = {};
  let contador = 0;

  const tabela = (nome) => (bancos[nome] = bancos[nome] || new Map());
  const documento = (id, dados) => ({ id, data: () => ({ ...dados }) });

  return {
    initializeFirestore: () => ({}),
    collection: (db, nome) => ({ nome }),
    doc: (db, nome, id) => ({ nome, id }),
    where: (campo, operador, valor) => ({ campo, operador, valor }),
    query: (colecao, ...filtros) => ({ nome: colecao.nome, filtros }),

    getDocs: async (ref) => {
      let linhas = [...tabela(ref.nome).entries()];
      for (const { campo, valor } of ref.filtros ?? []) {
        linhas = linhas.filter(([, dados]) => dados[campo] === valor);
      }
      const docs = linhas.map(([id, dados]) => documento(id, dados));
      return { docs, empty: docs.length === 0 };
    },
    addDoc: async (colecao, dados) => {
      const id = `auto${++contador}`;
      tabela(colecao.nome).set(id, { ...dados });
      return { id };
    },
    setDoc: async (ref, dados) => {
      tabela(ref.nome).set(ref.id, { ...dados });
    },
    getDoc: async (ref) => {
      const dados = tabela(ref.nome).get(ref.id);
      return { id: ref.id, exists: () => dados !== undefined, data: () => ({ ...dados }) };
    },
    updateDoc: async (ref, dados) => {
      const atual = { ...tabela(ref.nome).get(ref.id) };
      for (const [campo, valor] of Object.entries(dados)) {
        // increment(n) soma n ao valor que já está salvo
        atual[campo] = valor?.__incremento !== undefined ? (atual[campo] ?? 0) + valor.__incremento : valor;
      }
      tabela(ref.nome).set(ref.id, atual);
    },
    increment: (n) => ({ __incremento: n }),
    deleteDoc: async (ref) => {
      tabela(ref.nome).delete(ref.id);
    },

    // Só existe no mock: limpa o "banco" entre os testes.
    __limpar: () => Object.keys(bancos).forEach((nome) => delete bancos[nome]),
  };
});
