import { getDoc, getDocs, addDoc, updateDoc, query, where, increment } from 'firebase/firestore';
import { colecaoSaidas, docProduto } from './colecoes';

// Saída = item que saiu do estoque, por exemplo um kimono entregue a um aluno.

// O administrador vê todas as saídas; o professor vê só as que ele registrou.
export async function listarSaidas(usuario) {
  const consulta =
    usuario.tipo === 'admin'
      ? colecaoSaidas
      : query(colecaoSaidas, where('professorId', '==', usuario.id));

  const snap = await getDocs(consulta);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.data) - new Date(a.data));
}

export async function registrarSaida({ produto, quantidade, aluno, usuario }) {
  // Confere a quantidade atual no banco, que pode ter mudado desde que a tela abriu.
  const atual = await getDoc(docProduto(produto.id));
  if (!atual.exists()) {
    throw new Error('Este produto não existe mais no estoque.');
  }

  const disponivel = atual.data().quantidade;
  if (quantidade > disponivel) {
    throw new Error(`Só há ${disponivel} unidade(s) deste produto em estoque.`);
  }

  // increment() desconta direto no banco, sem sobrescrever o valor que está lá.
  await updateDoc(docProduto(produto.id), { quantidade: increment(-quantidade) });

  const novaSaida = {
    produtoId: produto.id,
    produtoNome: `${produto.nome} (${produto.tamanho})`,
    quantidade,
    aluno: aluno.trim(),
    professorId: usuario.id,
    professorNome: usuario.nome,
    data: new Date().toISOString(),
  };

  const ref = await addDoc(colecaoSaidas, novaSaida);
  return { id: ref.id, ...novaSaida };
}
