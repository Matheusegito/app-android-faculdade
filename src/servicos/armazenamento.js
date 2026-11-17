import { getDocs, setDoc } from 'firebase/firestore';

import { colecaoUsuarios, colecaoProdutos, colecaoSolicitacoes, docUsuario, docProduto, docSolicitacao } from './colecoes';
import { usuariosIniciais } from '../dados/dadosUsuarios';
import { produtosIniciais } from '../dados/dadosProdutos';
import { solicitacoesIniciais } from '../dados/dadosSolicitacoes';

// Grava os dados de demonstração no Firestore só quando a coleção está vazia,
// para não apagar o que já foi alterado. É isto que cria as coleções na primeira abertura.
async function popularSeVazia(colecao, referenciaDoc, itens) {
  const snap = await getDocs(colecao);
  if (!snap.empty) return;

  for (const { id, ...dados } of itens) {
    await setDoc(referenciaDoc(id), dados);
  }
}

export async function inicializarDados() {
  await popularSeVazia(colecaoUsuarios, docUsuario, usuariosIniciais);
  await popularSeVazia(colecaoProdutos, docProduto, produtosIniciais);
  await popularSeVazia(colecaoSolicitacoes, docSolicitacao, solicitacoesIniciais);
}
