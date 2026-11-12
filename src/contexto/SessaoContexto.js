import { createContext, useContext } from 'react';

// Guarda o usuário logado para qualquer tela conseguir saber quem está usando o app.
export const SessaoContexto = createContext({
  usuario: null,
  entrar: () => {},
  sair: () => {},
});

export function useSessao() {
  return useContext(SessaoContexto);
}
