import { produtosQueFicaramComEstoqueBaixo } from '../src/utilitarios/formatacao';

// Base da notificação para o administrador: só avisa do produto que acabou de ficar baixo.
test('avisa só dos produtos que acabaram de ficar com estoque baixo', () => {
  const baixosAntes = new Set(['p2']); // o p2 já estava baixo, então já foi avisado

  const produtos = [
    { id: 'p1', quantidade: 2, quantidadeMinima: 3 }, // acabou de ficar baixo
    { id: 'p2', quantidade: 1, quantidadeMinima: 3 }, // continua baixo
    { id: 'p3', quantidade: 9, quantidadeMinima: 3 }, // normal
  ];

  const avisos = produtosQueFicaramComEstoqueBaixo(baixosAntes, produtos);

  expect(avisos.map((p) => p.id)).toEqual(['p1']);
});
