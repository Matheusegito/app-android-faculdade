import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { listarProdutos } from '../src/servicos/produtos';
import { criarSolicitacao, listarSolicitacoes } from '../src/servicos/solicitacoes';
import { calcularValorTotal } from '../src/utilitarios/formatacao';

const professor = { id: 'u2', nome: 'Professor Ricardo', tipo: 'professor' };
const administrador = { id: 'u1', nome: 'Administrador', tipo: 'admin' };

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('a solicitação leva o preço do produto e o administrador vê o valor total', async () => {
  const produtos = await listarProdutos();
  const kimono = produtos.find((p) => p.id === 'p1'); // R$ 489,90

  const nova = await criarSolicitacao({ produto: kimono, quantidade: 3, observacao: '', usuario: professor });

  const vistaPeloAdmin = (await listarSolicitacoes(administrador)).find((s) => s.id === nova.id);
  expect(vistaPeloAdmin.precoUnitario).toBe(489.9);
  expect(calcularValorTotal(vistaPeloAdmin.quantidade, vistaPeloAdmin.precoUnitario)).toBeCloseTo(1469.7);
});

test('produto sem preço não tem valor total', () => {
  expect(calcularValorTotal(3, null)).toBeNull();
});
