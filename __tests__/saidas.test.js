import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { listarProdutos } from '../src/servicos/produtos';
import { registrarSaida, listarSaidas } from '../src/servicos/saidas';

const professor = { id: 'u2', nome: 'Professor Ricardo', tipo: 'professor' };

async function buscarProduto(id) {
  const produtos = await listarProdutos();
  return produtos.find((p) => p.id === id);
}

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('registrarSaida desconta do estoque e guarda no histórico', async () => {
  const kimono = await buscarProduto('p1'); // começa com 8 unidades

  await registrarSaida({ produto: kimono, quantidade: 3, aluno: 'João Silva', usuario: professor });

  expect((await buscarProduto('p1')).quantidade).toBe(5);

  const saidas = await listarSaidas(professor);
  expect(saidas).toHaveLength(1);
  expect(saidas[0].aluno).toBe('João Silva');
  expect(saidas[0].quantidade).toBe(3);
});

test('não deixa registrar saída maior que o estoque', async () => {
  const uniforme = await buscarProduto('p7'); // só tem 1 unidade

  await expect(
    registrarSaida({ produto: uniforme, quantidade: 5, aluno: 'Ana', usuario: professor })
  ).rejects.toThrow('Só há 1 unidade(s)');

  expect((await buscarProduto('p7')).quantidade).toBe(1);
  expect(await listarSaidas(professor)).toHaveLength(0);
});
