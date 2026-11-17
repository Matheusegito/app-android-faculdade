import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { fazerLogin } from '../src/servicos/autenticacao';
import { listarUsuarios } from '../src/servicos/usuarios';

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('login do administrador com credenciais válidas', async () => {
  const usuario = await fazerLogin('admin', '123456');

  expect(usuario).not.toBeNull();
  expect(usuario.usuario).toBe('admin');
  expect(usuario.tipo).toBe('admin');
  expect(usuario.senhaHash).toBeUndefined();
});

test('login com senha errada é recusado', async () => {
  const usuario = await fazerLogin('admin', 'senha-errada');

  expect(usuario).toBeNull();
});

test('senhas não ficam salvas em texto puro', async () => {
  const salvo = JSON.stringify(await listarUsuarios());

  expect(salvo).not.toContain('123456');
  expect(salvo).toContain('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');
});
