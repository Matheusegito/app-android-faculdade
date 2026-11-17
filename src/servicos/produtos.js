import { getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { colecaoProdutos, docProduto } from './colecoes';

export async function listarProdutos() {
  const snap = await getDocs(colecaoProdutos);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adicionarProduto(dados) {
  const ref = await addDoc(colecaoProdutos, dados);
  return { id: ref.id, ...dados };
}

export async function editarProduto(id, dados) {
  await updateDoc(docProduto(id), dados);
}

export async function excluirProduto(id) {
  await deleteDoc(docProduto(id));
}

export async function atualizarQuantidade(id, novaQuantidade) {
  await editarProduto(id, { quantidade: Math.max(0, novaQuantidade) });
}
