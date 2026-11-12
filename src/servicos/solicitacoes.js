import { CHAVES, lerDados, salvarDados, gerarId } from './armazenamento';
import { statusSolicitacao } from '../dados/dadosSolicitacoes';

// FIREBASE: trocar o conteúdo destas funções por chamadas ao Firestore
// (coleção "solicitacoes").

// O administrador vê todas as solicitações; o professor vê só as dele.
export async function listarSolicitacoes(usuario) {
  const solicitacoes = await lerDados(CHAVES.solicitacoes);
  const visiveis =
    usuario.tipo === 'admin'
      ? solicitacoes
      : solicitacoes.filter((s) => s.professorId === usuario.id);

  return visiveis.sort((a, b) => new Date(b.data) - new Date(a.data));
}

export async function criarSolicitacao({ produto, quantidade, observacao, usuario }) {
  const solicitacoes = await lerDados(CHAVES.solicitacoes);

  const novaSolicitacao = {
    id: gerarId(),
    produtoId: produto.id,
    produtoNome: `${produto.nome} (${produto.tamanho})`,
    quantidade,
    observacao: observacao.trim(),
    professorId: usuario.id,
    professorNome: usuario.nome,
    status: statusSolicitacao.pendente,
    data: new Date().toISOString(),
  };

  await salvarDados(CHAVES.solicitacoes, [...solicitacoes, novaSolicitacao]);
  return novaSolicitacao;
}

// Nesta primeira versão aprovar/rejeitar só muda o status, sem mexer no estoque.
export async function atualizarStatusSolicitacao(id, novoStatus) {
  const solicitacoes = await lerDados(CHAVES.solicitacoes);
  const atualizadas = solicitacoes.map((s) => (s.id === id ? { ...s, status: novoStatus } : s));

  await salvarDados(CHAVES.solicitacoes, atualizadas);
}
