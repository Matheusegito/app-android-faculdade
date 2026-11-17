import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { listarProdutos, adicionarProduto, excluirProduto } from '../src/servicos/produtos';

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('adicionarProduto inclui o novo produto na lista do estoque', async () => {
  const antes = await listarProdutos();

  const novo = await adicionarProduto({
    nome: 'Kimono Preto',
    categoria: 'Kimono',
    tamanho: 'A1',
    quantidade: 4,
    quantidadeMinima: 2,
    preco: 499.9,
    foto: null,
  });

  const depois = await listarProdutos();
  expect(depois).toHaveLength(antes.length + 1);
  expect(depois).toContainEqual(novo);
  expect(novo.id).toBeDefined();
});

test('excluirProduto remove o produto da lista', async () => {
  await excluirProduto('p1');

  const produtos = await listarProdutos();
  expect(produtos.find((p) => p.id === 'p1')).toBeUndefined();
});
