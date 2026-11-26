import { __limpar } from 'firebase/firestore';

import { inicializarDados } from '../src/servicos/armazenamento';
import { fazerLogin } from '../src/servicos/autenticacao';

beforeEach(async () => {
  __limpar();
  await inicializarDados();
});

test('login do administrador com credenciais válidas', async () => {
  const usuario = await fazerLogin('admin', '123456');

  expect(usuario.usuario).toBe('admin');
});
