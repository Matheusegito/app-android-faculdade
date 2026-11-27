export function formatarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return '';
  }
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

export function formatarData(dataIso) {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

// Valor total de uma solicitação (quantidade × preço). null quando o produto não tem preço.
export function calcularValorTotal(quantidade, precoUnitario) {
  if (precoUnitario === null || precoUnitario === undefined || !(quantidade > 0)) {
    return null;
  }
  return quantidade * precoUnitario;
}

export function estaComEstoqueBaixo(produto) {
  return produto.quantidade <= produto.quantidadeMinima;
}
