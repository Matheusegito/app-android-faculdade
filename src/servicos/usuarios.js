import { CHAVES, lerDados, salvarDados, gerarId } from './armazenamento';
import { gerarHash } from '../utilitarios/criptografia';

// FIREBASE: trocar o conteúdo destas funções por chamadas ao Firestore
// (coleção "usuarios") e ao Firebase Authentication.

export async function listarUsuarios() {
  return lerDados(CHAVES.usuarios);
}

export async function adicionarUsuario({ nome, usuario, senha, tipo }) {
  const usuarios = await listarUsuarios();
  const nomeUsuario = usuario.trim().toLowerCase();

  if (usuarios.some((u) => u.usuario === nomeUsuario)) {
    throw new Error('Já existe um usuário com esse nome de usuário.');
  }

  const novoUsuario = {
    id: gerarId(),
    nome: nome.trim(),
    usuario: nomeUsuario,
    senhaHash: await gerarHash(senha),
    tipo,
  };

  await salvarDados(CHAVES.usuarios, [...usuarios, novoUsuario]);
  return novoUsuario;
}

export async function excluirUsuario(id) {
  const usuarios = await listarUsuarios();
  await salvarDados(CHAVES.usuarios, usuarios.filter((u) => u.id !== id));
}
