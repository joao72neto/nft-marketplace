# Kurio — NFT Marketplace

Plataforma moderna de marketplace de NFTs com catálogo interativo, autenticação, filtros sincronizados via URL e simulação de dados. 

🔗 **Deploy em produção:** [https://nft-marketplace-jsn.vercel.app/](https://nft-marketplace-jsn.vercel.app/)

---

## 🚀 Tecnologias

O projeto foi construído utilizando as seguintes ferramentas e bibliotecas:

- **[React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/):** Base da aplicação com tipagem estática ponta a ponta.
- **[Vite](https://vite.dev/):** Ferramenta de build rápida e servidor de desenvolvimento com HMR.
- **[TanStack Router](https://tanstack.com/router):** Roteamento type-safe com gerenciamento e validação de parâmetros de busca (*search params*) na URL.
- **[TanStack Query (React Query v5)](https://tanstack.com/query):** Gerenciamento de estado assíncrono, cache e sincronização de dados.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Estilização utilitária com tema dark/cyberpunk e tipografia monoespaçada (*Roboto Mono*).
- **[Radix UI](https://www.radix-ui.com/):** Primitivas de interface acessíveis e não-estilizadas (Dialog, Slot, Separator).
- **[MSW (Mock Service Worker v2)](https://mswjs.io/):** Interceptação de requisições HTTP simulando uma API REST completa diretamente no navegador, dispensando backend externo para desenvolvimento e testes.
- **[Socket.IO Client](https://socket.io/):** Dependência e cliente configurados no projeto para futura comunicação via WebSockets (previsto para lances e atualizações de preços em tempo real).
- **[Axios](https://axios-http.com/):** Cliente HTTP para comunicação com os endpoints da API.

---

## ✨ Funcionalidades

- **Catálogo & Marketplace:** Listagem de NFTs com busca por nome/coleção, filtros por status, categoria e faixa de preço, ordenação e paginação.
- **Sincronização de Estado na URL:** Filtros e paginação refletidos na URL para fácil compartilhamento e navegação com histórico (*back/forward*).
- **Autenticação & Rotas Protegidas:** Sistema com modal de login rápido, tela dedicada de cadastro, recuperação de senha e proteção de rotas com redirecionamento inteligente.
- **Feedback Visual & UX:** Estados de carregamento com *skeletons*, tratamento de erros e interface totalmente responsiva para mobile e desktop.
- **Mocking Completo:** Armazenamento simulado em memória/IndexedDB com dados mockados de NFTs, criadores e usuários.

---

## 🔮 Próximos Passos (Roadmap)

- [ ] **Tempo Real com Socket.IO:** Ativação prática dos eventos de lances ao vivo e atualização dinâmica de status dos leilões.
- [ ] **Integração Web3:** Conexão com carteiras (MetaMask, WalletConnect) e transações on-chain.
- [ ] **Checkout & Pagamento:** Fluxo completo de compra e emissão de recibo de transação.

---

## 🛠️ Setup e Execução

### Pré-requisitos

- **Node.js** (versão 18+ recomendada)
- Gerenciador de pacotes: **npm**, **yarn** ou **pnpm**

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/nft-marketplace.git
   cd nft-marketplace
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento (Vite) |
| `npm run build` | Valida tipos via TypeScript e gera o build de produção |
| `npm run preview` | Executa localmente o build de produção para testes |
| `npm run typecheck` | Executa a verificação estática de tipos sem emitir arquivos |
| `npm run lint` | Executa o ESLint para análise de código e boas práticas |
| `npm test` | Executa os testes de contratos e mocks |

---

## 🌐 Deploy

A aplicação está publicada na Vercel:
👉 **[nft-marketplace-jsn.vercel.app](https://nft-marketplace-jsn.vercel.app/)**
