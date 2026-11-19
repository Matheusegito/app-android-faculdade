import { getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { colecaoUsuarios, docUsuario } from './colecoes';
import { gerarHash } from '../utilitarios/criptografia';

export async function listarUsuarios() {
  const snap = await getDocs(colecaoUsuarios);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function adicionarUsuario({ nome, usuario, senha, tipo }) {
  const nomeUsuario = usuario.trim().toLowerCase();

  // O Firestore não tem campo "único", então conferimos antes de criar.
  const existente = await getDocs(query(colecaoUsuarios, where('usuario', '==', nomeUsuario)));
  if (!existente.empty) {
    throw new Error('Já existe um usuário com esse nome de usuário.');
  }

  const dados = {
    nome: nome.trim(),
    usuario: nomeUsuario,
    senhaHash: await gerarHash(senha),
    tipo,
  };

  const ref = await addDoc(colecaoUsuarios, dados);
  return { id: ref.id, ...dados };
}

export async function excluirUsuario(id) {
  await deleteDoc(docUsuario(id));
}
