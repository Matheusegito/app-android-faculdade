import AsyncStorage from '@react-native-async-storage/async-storage';

import { usuariosIniciais } from '../dados/dadosUsuarios';
import { produtosIniciais } from '../dados/dadosProdutos';
import { solicitacoesIniciais } from '../dados/dadosSolicitacoes';

// Por enquanto os dados ficam salvos no próprio celular (AsyncStorage).
// Quando o Firebase for integrado, este arquivo deixa de ser usado
// e os arquivos de serviço passam a conversar direto com o banco.

export const CHAVES = {
  usuarios: '@estoque_gb:usuarios',
  produtos: '@estoque_gb:produtos',
  solicitacoes: '@estoque_gb:solicitacoes',
};

export async function lerDados(chave) {
  const texto = await AsyncStorage.getItem(chave);
  return texto ? JSON.parse(texto) : [];
}

export async function salvarDados(chave, dados) {
  await AsyncStorage.setItem(chave, JSON.stringify(dados));
}

// Grava os dados de demonstração só na primeira vez que o app abre,
// para não apagar o que o usuário já alterou.
export async function inicializarDados() {
  const dadosIniciais = [
    [CHAVES.usuarios, usuariosIniciais],
    [CHAVES.produtos, produtosIniciais],
    [CHAVES.solicitacoes, solicitacoesIniciais],
  ];

  for (const [chave, dados] of dadosIniciais) {
    const existente = await AsyncStorage.getItem(chave);
    if (existente === null) {
      await salvarDados(chave, dados);
    }
  }
}

export function gerarId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}
