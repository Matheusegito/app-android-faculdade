export const statusSolicitacao = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
};

export const solicitacoesIniciais = [
  {
    id: 's1',
    produtoId: 'p2',
    produtoNome: 'Kimono Azul (A3)',
    quantidade: 5,
    precoUnitario: 489.9,
    observacao: 'Turma adulta da noite está procurando bastante.',
    professorId: 'u2',
    professorNome: 'Professor Ricardo',
    status: 'Pendente',
    data: '2026-11-05T19:30:00.000Z',
  },
  {
    id: 's2',
    produtoId: 'p9',
    produtoNome: 'Rash Guard Manga Curta (G)',
    quantidade: 4,
    precoUnitario: 189.9,
    observacao: '',
    professorId: 'u2',
    professorNome: 'Professor Ricardo',
    status: 'Aprovada',
    data: '2026-11-01T14:00:00.000Z',
  },
  {
    id: 's3',
    produtoId: 'p11',
    produtoNome: 'Protetor Bucal (Único)',
    quantidade: 20,
    precoUnitario: 29.9,
    observacao: 'Para o campeonato interno.',
    professorId: 'u2',
    professorNome: 'Professor Ricardo',
    status: 'Rejeitada',
    data: '2026-10-28T10:15:00.000Z',
  },
];
