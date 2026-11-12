import { CHAVES, lerDados, salvarDados, gerarId } from './armazenamento';

// FIREBASE: trocar o conteúdo destas funções por chamadas ao Firestore
// (coleção "produtos"). As telas não precisam mudar.

export async function listarProdutos() {
  return lerDados(CHAVES.produtos);
}

export async function adicionarProduto(dados) {
  const produtos = await listarProdutos();
  const novoProduto = { id: gerarId(), ...dados };

  await salvarDados(CHAVES.produtos, [...produtos, novoProduto]);
  return novoProduto;
}

export async function editarProduto(id, dados) {
  const produtos = await listarProdutos();
  const atualizados = produtos.map((p) => (p.id === id ? { ...p, ...dados } : p));

  await salvarDados(CHAVES.produtos, atualizados);
}

export async function excluirProduto(id) {
  const produtos = await listarProdutos();
  await salvarDados(CHAVES.produtos, produtos.filter((p) => p.id !== id));
}

export async function atualizarQuantidade(id, novaQuantidade) {
  await editarProduto(id, { quantidade: Math.max(0, novaQuantidade) });
}
