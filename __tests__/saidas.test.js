import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { listarProdutos } from '../src/servicos/produtos';
import { registrarSaida } from '../src/servicos/saidas';

const professor = { id: 'u2', nome: 'Professor Ricardo', tipo: 'professor' };

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('não deixa o estoque ficar negativo ao registrar uma saída', async () => {
  const produtos = await listarProdutos();
  const uniforme = produtos.find((p) => p.id === 'p7'); // só tem 1 unidade

  await expect(
    registrarSaida({ produto: uniforme, quantidade: 5, aluno: 'Ana', usuario: professor })
  ).rejects.toThrow('Só há 1 unidade(s)');

  const depois = await listarProdutos();
  expect(depois.find((p) => p.id === 'p7').quantidade).toBe(1);
});
