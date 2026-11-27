import { getDocs, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { colecaoProdutos, docProduto } from './colecoes';

// Escuta a coleção em tempo real: chama aoMudar com a lista toda a cada alteração.
// Devolve a função que encerra a escuta.
export function observarProdutos(aoMudar) {
  return onSnapshot(
    colecaoProdutos,
    (snap) => aoMudar(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    () => console.warn('Conexão em tempo real com os produtos perdida.')
  );
}

export async function listarProdutos() {
  const snap = await getDocs(colecaoProdutos);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function adicionarProduto(dados) {
  if (dados.quantidade < 0) {
    throw new Error('A quantidade não pode ser negativa.');
  }

  const ref = await addDoc(colecaoProdutos, dados);
  return { id: ref.id, ...dados };
}

export async function editarProduto(id, dados) {
  if (dados.quantidade < 0) {
    throw new Error('A quantidade não pode ser negativa.');
  }

  await updateDoc(docProduto(id), dados);
}

export async function excluirProduto(id) {
  await deleteDoc(docProduto(id));
}

export async function atualizarQuantidade(id, novaQuantidade) {
  await editarProduto(id, { quantidade: Math.max(0, novaQuantidade) });
}
