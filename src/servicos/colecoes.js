import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

// Nomes das coleções do Firestore
export const NOMES = {
  usuarios: 'usuarios',
  produtos: 'produtos',
  solicitacoes: 'solicitacoes',
};

// Referências das coleções
export const colecaoUsuarios = collection(db, NOMES.usuarios);
export const colecaoProdutos = collection(db, NOMES.produtos);
export const colecaoSolicitacoes = collection(db, NOMES.solicitacoes);

// Referência de um documento específico (para editar e excluir)
export const docUsuario = (id) => doc(db, NOMES.usuarios, id);
export const docProduto = (id) => doc(db, NOMES.produtos, id);
export const docSolicitacao = (id) => doc(db, NOMES.solicitacoes, id);
