import { getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { colecaoSolicitacoes, docSolicitacao } from './colecoes';
import { statusSolicitacao } from '../dados/dadosSolicitacoes';

// O administrador vê todas as solicitações; o professor vê só as dele.
export async function listarSolicitacoes(usuario) {
  const consulta =
    usuario.tipo === 'admin'
      ? colecaoSolicitacoes
      : query(colecaoSolicitacoes, where('professorId', '==', usuario.id));

  const snap = await getDocs(consulta);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.data) - new Date(a.data));
}

export async function criarSolicitacao({ produto, quantidade, observacao, usuario }) {
  const nova = {
    produtoId: produto.id,
    produtoNome: `${produto.nome} (${produto.tamanho})`,
    quantidade,
    observacao: observacao.trim(),
    professorId: usuario.id,
    professorNome: usuario.nome,
    status: statusSolicitacao.pendente,
    data: new Date().toISOString(),
  };

  const ref = await addDoc(colecaoSolicitacoes, nova);
  return { id: ref.id, ...nova };
}

// Nesta primeira versão aprovar/rejeitar só muda o status, sem mexer no estoque.
export async function atualizarStatusSolicitacao(id, novoStatus) {
  await updateDoc(docSolicitacao(id), { status: novoStatus });
}
