# Estoque Gracie Barra

Aplicativo Android de **gerenciamento de estoque** de uma academia de jiu-jitsu, feito como trabalho de faculdade. Controla produtos (kimonos, camisas, rash guards etc.), alerta sobre estoque baixo e permite que professores solicitem reposição ao administrador.

## Tecnologias

- React Native + Expo
- React Navigation (Stack e Drawer)
- Cloud Firestore (banco de dados)
- Jest (testes automatizados)

## Funcionalidades

O app tem dois perfis de usuário:

| Funcionalidade | Administrador | Professor |
|---|---|---|
| Painel de indicadores (Insights) | ✔ | ✔ (só as suas pendentes) |
| Consultar estoque, pesquisar e filtrar por categoria | ✔ | ✔ |
| Cadastrar, editar e excluir produtos (com foto) | ✔ | — |
| Ajustar a quantidade em estoque | ✔ | — |
| Criar solicitação de reposição | — | ✔ |
| Registrar saída de item para um aluno (desconta do estoque) | — | ✔ |
| Histórico de saídas (aba "Saídas" no Estoque) | ✔ (vê todas) | ✔ (só as suas) |
| Aprovar ou rejeitar solicitações (vê todas) | ✔ | — (vê só as suas) |
| Gerenciar usuários | ✔ | — |
| Notificação quando um produto fica com estoque baixo | ✔ | — |

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS) e o app **Expo Go** no celular Android (ou um emulador do Android Studio).

Antes da primeira execução, copie o arquivo `.env.example` para `.env` e preencha com a configuração do projeto no Firebase (Console do Firebase > Configurações do projeto > Seus apps). O `.env` não vai para o GitHub.

```bash
npm install
npm start
```

Escaneie o QR code com o Expo Go. Se o celular não conseguir conectar na rede local, use o modo túnel:

```bash
npx expo start --tunnel
```

### Login de demonstração

Na primeira abertura, o app cria os dados de demonstração no Firestore automaticamente.

## Gerar o APK

O APK é gerado na nuvem pelo EAS Build (precisa de uma conta Expo gratuita). O build não recebe o `.env`, então as mesmas variáveis precisam estar cadastradas no EAS uma vez, para o ambiente `preview`:

```bash
npm install -g eas-cli
eas login
eas env:create --environment preview --visibility plaintext --name EXPO_PUBLIC_FIREBASE_API_KEY --value "..."
# repita para as outras variáveis do .env.example
eas build -p android --profile preview
```

Ao terminar, o EAS mostra um link para baixar o `.apk` e instalar no celular.

## Testes

```bash
npm test
```

Os testes rodam contra um Firestore simulado em memória, sem acessar o banco real.

## Banco de dados

A modelagem das coleções (`usuarios`, `produtos` e `solicitacoes`) está em [docs/modelagem-de-dados.md](docs/modelagem-de-dados.md).

## Limitações conhecidas

- O login é feito pelo próprio app, comparando o hash SHA-256 da senha guardado no Firestore. Não usa o Firebase Authentication, então a separação entre administrador e professor não é imposta pelo servidor.
- Aprovar uma solicitação só altera o status, sem descontar do estoque.
- A foto do produto guarda apenas o caminho local do aparelho.
