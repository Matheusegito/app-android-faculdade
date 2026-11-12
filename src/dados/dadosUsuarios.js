// Usuários de demonstração. A senha dos dois é "123456".
// Guardamos apenas o hash SHA-256 da senha, nunca a senha original.

export const usuariosIniciais = [
  {
    id: 'u1',
    nome: 'Administrador',
    usuario: 'admin',
    senhaHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tipo: 'admin',
  },
  {
    id: 'u2',
    nome: 'Professor Ricardo',
    usuario: 'professor',
    senhaHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    tipo: 'professor',
  },
];
