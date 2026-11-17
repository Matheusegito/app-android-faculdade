# Modelagem de dados

Banco: **Cloud Firestore** (NoSQL, orientado a documentos).

O app tem 3 entidades, e cada uma vira uma coleção na raiz do Firestore:
`usuarios`, `produtos` e `solicitacoes`. Categoria e status são listas fixas
no código e não têm coleção própria.

## Relacionamentos

```
usuarios (professor) 1 ──── N solicitacoes N ──── 1 produtos
```

- Um professor faz várias solicitações.
- Um produto pode aparecer em várias solicitações.
- O administrador só altera o status da solicitação. A versão atual não registra quem decidiu.

---

## Coleção `usuarios`

Pessoas que acessam o app.

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | ID do documento (gerado pelo Firestore, não é um campo salvo). |
| nome | string | Nome de exibição. Ex.: "Professor Ricardo". |
| usuario | string | Nome de login, em minúsculas. Deve ser único. |
| senhaHash | string | Hash SHA-256 da senha. A senha em texto nunca é salva. |
| tipo | string | Perfil de acesso: `admin` ou `professor`. |

## Coleção `produtos`

Itens controlados no estoque.

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | ID do documento (gerado pelo Firestore, não é um campo salvo). |
| nome | string | Nome do produto. Ex.: "Kimono Branco". |
| categoria | string | Uma de: `Kimono`, `Camisa`, `Calça`, `Uniforme`, `Rash guard`, `Outros`. |
| tamanho | string | Tamanho do item. Ex.: "A2", "M", "Único". |
| quantidade | number | Quantidade atual em estoque. Inteiro, 0 ou mais. |
| quantidadeMinima | number | Limite de alerta. Se `quantidade <= quantidadeMinima`, o estoque é considerado baixo. Inteiro, 0 ou mais. |
| preco | number ou null | Preço unitário em reais. Opcional. |
| foto | string ou null | URI da imagem do produto. Opcional. |

## Coleção `solicitacoes`

Pedidos de reposição feitos pelos professores.

| Campo | Tipo | Descrição |
|---|---|---|
| id | string | ID do documento (gerado pelo Firestore, não é um campo salvo). |
| produtoId | string | ID do produto solicitado (referência a `produtos`). |
| produtoNome | string | Cópia de "nome (tamanho)" do produto no momento do pedido. |
| quantidade | number | Quantidade desejada. Inteiro, maior que 0. |
| observacao | string | Justificativa do pedido. Pode ser vazia. |
| professorId | string | ID do professor que fez o pedido (referência a `usuarios`). |
| professorNome | string | Cópia do nome do professor no momento do pedido. |
| status | string | Situação do pedido: `Pendente`, `Aprovada` ou `Rejeitada`. |
| data | string | Data e hora de criação, em formato ISO 8601. |

---

## Decisões de modelagem

- **Coleções na raiz, sem subcoleções.** A visão do professor (só as dele) é uma consulta com `where('professorId', '==', id)`.
- **Dados duplicados de propósito.** `produtoNome` e `professorNome` ficam copiados na solicitação. A lista aparece sem buscar em outras coleções, e o histórico não muda se o produto for renomeado ou excluído.
- **Unicidade do login.** O Firestore não tem restrição de valor único. O app confere se o `usuario` já existe antes de criar.
- **Data como string ISO.** Simplifica a ordenação e a formatação no app. O tipo `Timestamp` do Firestore seria uma alternativa.
- **Foto.** Hoje guarda só a URI local do aparelho. Para compartilhar a imagem entre usuários seria preciso o Firebase Storage.
- **Criação das coleções.** O Firestore cria a coleção quando o primeiro documento é gravado. A carga inicial do app cria as três com os dados de demonstração.

## Possíveis evoluções

- Registrar quem decidiu e quando: campos `decididaPor` e `dataDecisao` em `solicitacoes`.
- Coleção `movimentacoes` (produtoId, tipo de entrada ou saída, quantidade, data, usuarioId) para ter histórico do estoque.
- Descontar do estoque ao aprovar uma solicitação (hoje só o status muda).
