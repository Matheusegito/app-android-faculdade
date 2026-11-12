import { listarUsuarios } from './usuarios';
import { gerarHash } from '../utilitarios/criptografia';

// Login local apenas para demonstração. Na versão final, isto deve ser
// substituído pelo Firebase Authentication (signInWithEmailAndPassword).

export async function fazerLogin(nomeUsuario, senha) {
  const usuarios = await listarUsuarios();
  const usuario = usuarios.find((u) => u.usuario === nomeUsuario.trim().toLowerCase());

  if (!usuario) {
    return null;
  }

  const hashDigitado = await gerarHash(senha);
  if (hashDigitado !== usuario.senhaHash) {
    return null;
  }

  // O hash não precisa ficar na sessão.
  const { senhaHash, ...dadosDaSessao } = usuario;
  return dadosDaSessao;
}

export function ehAdministrador(usuario) {
  return usuario?.tipo === 'admin';
}

export function ehProfessor(usuario) {
  return usuario?.tipo === 'professor';
}
