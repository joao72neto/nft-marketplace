# Spec: Contratos e Mocks (NTF Marketplace GreenMint / Kurio)

> Spec da camada de contratos tipados, simulação de rede (MSW) e eventos em tempo real (Socket.IO). Herda integralmente o contexto, stack e regras globais de `_specs/base.spec.md` (especialmente RN-01 a RN-05, RN-10, RN-13, RN-15, RN-16, RN-20 a RN-22 e os cenários de CA-04) e respeita as decisões de infraestrutura e tokens já consolidadas em `_specs/fundation.spec.md`.
> **Esta spec define O QUE a camada deve fazer, sem código de implementação.**

---

## 1. Visão Geral

- **Objetivo:** Estabelecer uma camada de simulação de rede e contratos tipados completa, determinística e desacoplada da UI para o marketplace de NFTs GreenMint (Kurio). Utilizando Mock Service Worker (MSW) e `@mswjs/socket.io-binding`, esta camada emula todas as APIs REST e eventos de tempo real previstos pelo projeto, viabilizando o desenvolvimento independente, a execução determinística de testes E2E/regressão visual no Playwright e a demonstração completa na Vercel sem a necessidade de um backend real ou blockchain.
- **Público/Atores:**
  - **Colecionador / Visitante na Aplicação:** Interage com a aplicação sem perceber que o backend é simulado; todas as chamadas de rede e eventos em tempo real respondem como serviços reais de produção.
  - **Avaliador / Desenvolvedor:** Configura e alterna cenários de teste (sucesso, erros 4xx/5xx, timeouts, concorrência, latência) via variável de ambiente, parâmetro de URL ou painel de desenvolvimento, com capacidade de restaurar o estado inicial com um clique (reset).
  - **Mecanismo de Testes Automatizados (Playwright):** Dispara cenários determinísticos e eventos assíncronos controlados, validando a resiliência da interface sem flakiness.

---

## 2. Requisitos Funcionais (RF)

### Contratos REST
- **RF-01:** O sistema deve definir e expor endpoints REST simulados para todos os recursos essenciais do marketplace:
  - Sessão e Conta (`/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`)
  - Catálogo de NFTs (`/nfts`, `/nfts/:id`)
  - Favoritos (`/favorites`, `/favorites/:nftId`)
  - Carrinho (`/cart`, `/cart/items`, `/cart/items/:itemId`)
  - Cotação e Resumo (`/cart/quote`)
  - Pedidos e Checkout (`/orders`, `/orders/:id`)
  - Perfil do Colecionador (`/profile`, `/profile/password`)
  - Carteiras Digitais (`/wallets`, `/wallets/:id`)
- **RF-02:** Cada rota REST deve possuir tipagem estrita de parâmetros de URL, query params, corpo da requisição (`Request Body`), resposta de sucesso (`Response Body`) e catálogo de respostas de erro padronizadas.
- **RF-03:** A rota de criação de pedido (`POST /orders`) deve exigir obrigatoriamente um cabeçalho `Idempotency-Key` e aplicar a regra de idempotência: repetições com a mesma chave e mesmo corpo recuperam o pedido já gerado com o status atual; requisições com a mesma chave e corpo diferente devem ser rejeitadas com conflito (HTTP 409).
- **RF-04:** A listagem de catálogo (`GET /nfts`) deve suportar paginação, ordenação e múltiplos filtros combináveis (categoria, busca textual, status, faixa de preço), retornando metadados de paginação padronizados.

### Contratos Socket.IO e Tempo Real
- **RF-05:** O sistema deve suportar conexões Socket.IO através do protocolo nativo do MSW (`@mswjs/socket.io-binding`) e emitir os eventos de negócio:
  - `nft.updated`: notifica alterações de preço em ETH, disponibilidade e quantidade de edições restantes.
  - `order.updated`: notifica transições de estado do pedido (`confirmed` ou `refused`) e dados de transação gerados.
- **RF-06:** Cada evento Socket.IO deve conter identidade única (`eventId`), identificação do recurso (`resource`, `resourceId`), versão numérica incremental (`version`) e data/hora (`timestamp`).
- **RF-07:** O sistema deve prover um mecanismo determinístico de despacho de eventos para que cenários de teste ou o painel de desenvolvimento possam emitir `nft.updated` e `order.updated` para todos os clientes conectados.

### Fixtures e Estado Persistido
- **RF-08:** O sistema deve fornecer um conjunto determinístico de dados iniciais contendo:
  - Pelo menos 2 usuários com perfis distintos, dados realistas e senhas protegidas por hash simulado.
  - No mínimo 16 NFTs distribuídos em diferentes coleções, categorias, faixas de preço, estados de disponibilidade e tiragens.
  - Cupons de desconto nos estados: válido, expirado e inexistente.
  - Carteiras digitais pré-configuradas em diferentes redes simuladas.
- **RF-09:** O estado simulado deve persistir no `localStorage` do navegador, manter consistência entre todos os domínios (catálogo, carrinho, favoritos, carteiras, perfil e pedidos) e ser estritamente isolado por usuário.
- **RF-10:** O sistema deve prover uma função de **Reset** que limpa alterações em memória/armazenamento local e restaura o cenário para o estado determinístico inicial.

### Cenários Determinísticos e Condições de Rede
- **RF-11:** O sistema deve implementar todos os 12 cenários determinísticos exigidos em CA-04 (sucesso, vazio, latência variável/fora de ordem, falhas 4xx/5xx, queda de rede, sessão expirada, conflito de cadastro, cupons inválidos/expirados, preço alterado, edição esgotada, timeout de pedido e pagamento recusado).
- **RF-12:** As condições de rede simuladas (latência artificial, jitter de latência, taxa de erros e timeouts) devem ser parametrizáveis por cenário.
- **RF-13:** A seleção do cenário ativo deve ser configurável via três mecanismos: variável de ambiente (`VITE_MOCK_SCENARIO`), parâmetro de URL (`?scenario=...`) e painel de desenvolvimento na interface, respeitando a regra de precedência definida.

### Prova de Conceito e Ativação
- **RF-14:** A implementação da camada de mocks deve prever uma Prova de Conceito (PoC) mínima executável do Socket.IO com MSW como primeira etapa obrigatória antes da escrita dos handlers REST completos.
- **RF-15:** A camada de simulação deve ser ativada por configuração (`VITE_ENABLE_MOCKS=true`) e estar disponível no build de produção publicado na Vercel, coexistindo harmonicamente com o Service Worker do MSW e as regras de rewrite de SPA do `vercel.json`.

---

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### 3.1. Regras de Negócio Herdadas e Específicas

- **RN-CM01 (Herança RN-01 - ETH como String Decimal):** Todos os valores monetários em ETH em contratos REST e payloads Socket.IO devem trafegar estritamente como **strings decimais** (exemplo: `"0.45"`, `"1.20"`, `"15.0000"`), nunca como números em ponto flutuante (`float`/`double`). Quantidades de edições e itens no carrinho são sempre números inteiros.
- **RN-CM02 (Herança RN-02 - Autoridade da Cotação):** A API simulada de cotação (`/cart/quote`) é a única fonte da verdade para subtotais, descontos de cupons, taxas de rede estimadas e valor total a pagar. O cliente não pode recalcular esses valores por conta própria.
- **RN-CM03 (Herança RN-03 - Camada Exclusiva no MSW):** É expressamente proibido mockar dados dentro de componentes React, custom hooks ou interceptores do cliente Axios. Toda simulação de resposta, erro ou delay deve residir exclusivamente nos interceptores do MSW.
- **RN-CM04 (Herança RN-04 - Socket.IO Estrito):** Eventos de tempo real devem obrigatoriamente ser recebidos pelo cliente via biblioteca `socket.io-client`. É proibido despachar eventos diretamente em callbacks de componentes, stores ou caches do React Query.
- **RN-CM05 (Herança RN-05 - Identidade Estável e Versionamento):** Cada evento de tempo real possui um número de versão sequencial (`version`). Eventos recebidos com `version <= currentVersion` de um recurso devem ser descartados pelo cliente (descarte de duplicatas ou mensagens obsoletas). O estado nunca deve regredir para uma versão anterior.
- **RN-CM06 (Herança RN-07 - Senhas Protegidas):** Nenhuma credencial de usuário pode ser armazenada ou trafegada em texto plano no mock ou no `localStorage`. As senhas simuladas devem ser armazenadas com hash determinístico (ex: prefixo `hash_v1_...`).
- **RN-CM07 (Herança RN-10 - Idempotência em Pedidos):** Na criação de pedidos (`POST /orders`), se o cliente enviar uma `Idempotency-Key` já processada com exatamente o mesmo payload (mesmos itens, cotação e carteira), a API retorna HTTP 200/201 com o pedido previamente criado. Caso a mesma chave seja enviada com payload divergente, a API retorna HTTP 409 (Conflict).
- **RN-CM08 (Herança RN-13 - Estado Consistente e Isolamento em `localStorage`):** O mock deve manter consistência referencial entre catálogo, favoritos, carrinho, carteiras, perfil e pedidos. Os dados são persistidos no `localStorage` sob namespace isolado por usuário (`greenmint_mock_user_{userId}_state`). O reset restaura o snapshot inicial padrão.
- **RN-CM09 (Herança RN-15 - Seleção e Precedência de Cenários):** A determinação do cenário ativo segue estritamente a seguinte ordem de precedência:
  1. **1ª Precedência (Mais Alta):** Parâmetro de busca na URL (`?scenario=<nome-do-cenario>`). Permite que testes Playwright e links de demonstração forcem cenários isolados sem alterar o estado do navegador.
  2. **2ª Precedência (Intermediária):** Valor salvo no `localStorage` pelo Painel de Desenvolvimento (`greenmint_dev_scenario`).
  3. **3ª Precedência (Fallback):** Variável de ambiente `VITE_MOCK_SCENARIO` (padrão: `default`).
- **RN-CM10 (Herança RN-16 - Expiração Determinística):** Sessões de autenticação e cupons de desconto registram a data/hora exata de expiração (`expiresAt` no formato ISO 8601). O mock avalia a expiração através de um relógio virtual unificado, permitindo que os testes controlem o avanço do tempo sem depender do relógio do sistema operacional.
- **RN-CM11 (Herança RN-20 - Contratos Tipados Únicos):** Uma única pasta/módulo de tipos TypeScript (`contracts`) deve servir de fonte da verdade simultaneamente para os handlers MSW, fixtures, cliente Axios e testes automatizados.
- **RN-CM12 (Herança RN-22 - Ciclo de Vida e Reconciliação):** Mudanças geradas por chamadas REST (ex: compra confirmada diminuindo estoque) devem refletir imediatamente nas consultas REST subsequentes e disparar o respectivo evento Socket.IO (`nft.updated`). Após reconexão do socket, o cliente deve reconciliar os recursos em tela consultando a API REST.

---

### 3.2. Especificação Detalhada dos Contratos REST

#### Formato Padrão de Erro Tipado (RFC 7807 adaptada)
Todas as respostas de erro da API simulada seguem a estrutura padronizada:

```json
{
  "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | TRANSIENT_ERROR | INSUFFICIENT_FUNDS | EXPIRED_RESOURCE",
  "message": "Descrição amigável em português do que ocorreu.",
  "details": [
    {
      "field": "nomeDoCampo",
      "message": "Motivo específico da validação do campo."
    }
  ],
  "timestamp": "2026-10-17T17:15:00.000Z"
}
```

#### Formato Padrão de Resposta Paginada
Listagens de coleções paginadas retornam a estrutura:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 8,
    "totalItems": 16,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### 3.2.1. Sessão e Conta (`/auth`)

1. **`POST /api/auth/register`**
   - **Descrição:** Realiza o cadastro de uma nova conta de colecionador.
   - **Corpo:** `{ "name": string, "email": string, "password": string }`
   - **Sucesso (201 Created):** `{ "user": UserDTO, "token": string }`
   - **Erros:**
     - 400 (Validation Error): campos ausentes ou senha fraca.
     - 409 (Conflict): e-mail já cadastrado no sistema (`code: "CONFLICT"`).

2. **`POST /api/auth/login`**
   - **Descrição:** Autentica o usuário com credenciais fictícias.
   - **Corpo:** `{ "email": string, "password": string }`
   - **Sucesso (200 OK):** `{ "user": UserDTO, "token": string, "expiresAt": string }`
   - **Erros:**
     - 401 (Unauthorized): e-mail ou senha incorretos (`code: "UNAUTHORIZED"`).

3. **`POST /api/auth/logout`**
   - **Descrição:** Invalida a sessão ativa.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `{ "success": true }`
   - **Erros:** 401 se token ausente ou expirado.

4. **`GET /api/auth/me`**
   - **Descrição:** Retorna os dados do colecionador autenticado.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `UserDTO`
   - **Erros:**
     - 401 (Unauthorized): sessão inválida ou expirada (`code: "UNAUTHORIZED"`).

---

#### 3.2.2. Catálogo e Detalhes de NFTs (`/nfts`)

1. **`GET /api/nfts`**
   - **Descrição:** Lista NFTs com suporte a busca, filtros combináveis, ordenação e paginação.
   - **Query Params:**
     - `search` (opcional): busca por título do NFT ou nome do criador.
     - `category` (opcional): categoria (ex: `"art"`, `"collectibles"`, `"music"`, `"photography"`).
     - `status` (opcional): `"all"`, `"on_sale"`, `"last_editions"`, `"sold_out"`.
     - `priceMin`, `priceMax` (opcional): strings decimais delimitando faixa em ETH.
     - `sort` (opcional): `"price_asc"`, `"price_desc"`, `"recently_listed"`, `"most_viewed"`.
     - `page` (default `1`), `limit` (default `8`).
   - **Sucesso (200 OK):** Resposta paginada contendo array de `NftSummaryDTO`.
   - **Erros:**
     - 400 (Bad Request): parâmetros de query inválidos.
     - 500/503 (Transient Error): quando cenário de falha simulada estiver ativo.

2. **`GET /api/nfts/:id`**
   - **Descrição:** Obtém todos os detalhes de um NFT individual.
   - **Parâmetros de Rota:** `id` (identificador único do NFT).
   - **Sucesso (200 OK):** `NftDetailDTO` (inclui galeria de imagens, descrição completa, histórico, atributos, lista de edições disponíveis e versão atual).
   - **Erros:**
     - 404 (Not Found): NFT inexistente (`code: "NOT_FOUND"`).

---

#### 3.2.3. Favoritos (`/favorites`)

1. **`GET /api/favorites`**
   - **Descrição:** Lista os IDs e resumos dos NFTs favoritados pelo usuário logado.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `{ "items": NftSummaryDTO[] }`
   - **Erros:** 401 se não autenticado.

2. **`POST /api/favorites/:nftId`**
   - **Descrição:** Adiciona um NFT aos favoritos do usuário.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK / 201 Created):** `{ "nftId": string, "isFavorite": true }`
   - **Erros:** 401 se não autenticado, 404 se NFT inexistente.

3. **`DELETE /api/favorites/:nftId`**
   - **Descrição:** Remove um NFT dos favoritos.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `{ "nftId": string, "isFavorite": false }`
   - **Erros:** 401 se não autenticado.

---

#### 3.2.4. Carrinho de Compras (`/cart`)

1. **`GET /api/cart`**
   - **Descrição:** Retorna os itens do carrinho e metadados. Funciona tanto para visitante (armazenado em chave local/sessão anônima) quanto colecionador logado.
   - **Sucesso (200 OK):** `{ "items": CartItemDTO[], "couponCode": string | null, "updatedAt": string }`

2. **`POST /api/cart/items`**
   - **Descrição:** Adiciona um NFT ao carrinho.
   - **Corpo:** `{ "nftId": string, "edition": number, "quantity": number }`
   - **Sucesso (201 Created):** `CartDTO` atualizado.
   - **Erros:**
     - 400 (Bad Request): quantidade inválida (menor que 1 ou não inteira).
     - 404 (Not Found): NFT ou edição inexistente.
     - 409 (Conflict): quantidade solicitada excede a disponibilidade restante da edição (`code: "CONFLICT"`).

3. **`PATCH /api/cart/items/:itemId`**
   - **Descrição:** Altera a quantidade de um item no carrinho.
   - **Corpo:** `{ "quantity": number }`
   - **Sucesso (200 OK):** `CartDTO` atualizado.
   - **Erros:** 400 se quantidade inválida, 404 se item ausente no carrinho, 409 se excede estoque.

4. **`DELETE /api/cart/items/:itemId`**
   - **Descrição:** Remove um item do carrinho.
   - **Sucesso (200 OK):** `CartDTO` atualizado.

5. **`DELETE /api/cart`**
   - **Descrição:** Esvazia completamente o carrinho.
   - **Sucesso (200 OK):** `{ "success": true, "items": [] }`

---

#### 3.2.5. Cotação do Pedido (`/cart/quote`)

1. **`POST /api/cart/quote`**
   - **Descrição:** Calcula o resumo financeiro oficial para finalização do pedido com base nos itens e cupom informado.
   - **Corpo:** `{ "items": [{ "nftId": string, "edition": number, "quantity": number }], "couponCode"?: string }`
   - **Sucesso (200 OK):**
     ```json
     {
       "subtotalEth": "1.25",
       "discountEth": "0.125",
       "networkFeeEth": "0.005",
       "totalEth": "1.130",
       "coupon": {
         "code": "KURIO10",
         "discountPercentage": 10,
         "isValid": true
       },
       "expiresAt": "2026-10-17T17:30:00.000Z"
     }
     ```
   - **Erros:**
     - 409 (Conflict): preço de algum item sofreu alteração ou edição esgotou desde a adição (`code: "CONFLICT"`, inclui detalhes do item afetado).
     - 422 (Unprocessable Entity): cupom inválido ou expirado (`code: "EXPIRED_RESOURCE"` ou `"VALIDATION_ERROR"`).

---

#### 3.2.6. Pedidos e Checkout (`/orders`)

1. **`POST /api/orders`**
   - **Descrição:** Cria e processa uma compra de NFTs com simulação de transação de carteira.
   - **Headers Requeridos:**
     - `Authorization: Bearer <token>`
     - `Idempotency-Key: <uuid-v4>` (obrigatório)
   - **Corpo:**
     ```json
     {
       "items": [{ "nftId": string, "edition": number, "quantity": number, "priceEth": string }],
       "walletId": string,
       "network": string,
       "quoteToken"?: string,
       "totalEth": string
     }
     ```
   - **Sucesso (201 Created / 200 OK):** `OrderReceiptDTO`
     - Status inicial retornado: `"confirmed"` (ou `"refused"` se cenário de recusa estiver ativo).
     - Identificador de transação simulada: `txHash` (ex: `"0x9a8f...4b12"`).
     - Snapshot imutável dos itens, carteira pagadora e valores em ETH.
   - **Erros:**
     - 400 (Bad Request): cabeçalho `Idempotency-Key` ausente ou campos inválidos.
     - 401 (Unauthorized): usuário não autenticado.
     - 409 (Conflict):
       - Mesma chave de idempotência reenviada com corpo divergente.
       - Preço do catálogo alterado durante a operação.
       - Edição esgotada antes da conclusão do pagamento.
     - 422 (Unprocessable Entity): pagamento recusado pela carteira ou saldo insuficiente simulado.
     - 504 / Timeout Simulado: se cenário de timeout estiver ativo.

2. **`GET /api/orders/:id`**
   - **Descrição:** Recupera o snapshot imutável do recibo de um pedido já gerado.
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `OrderReceiptDTO`
   - **Erros:** 401 se não autorizado, 404 se pedido não encontrado.

---

#### 3.2.7. Perfil e Carteiras (`/profile`, `/wallets`)

1. **`GET /api/profile`** & **`PUT /api/profile`**
   - **Descrição:** Consulta e atualiza dados do perfil (nome, biografia, e-mail e URL do avatar persistido).
   - **Headers:** `Authorization: Bearer <token>`
   - **Sucesso (200 OK):** `UserProfileDTO`
   - **Erros:** 400 para formatos inválidos, 401 se deslogado, 409 se e-mail em conflito.

2. **`PATCH /api/profile/password`**
   - **Descrição:** Altera a senha fictícia do usuário logado.
   - **Corpo:** `{ "currentPassword": string, "newPassword": string }`
   - **Sucesso (200 OK):** `{ "success": true }`
   - **Erros:** 400 para senha fraca, 401 para senha atual incorreta.

3. **`GET /api/wallets`** & **`PUT /api/wallets`**
   - **Descrição:** Gerencia as carteiras do colecionador (carteira principal e secundária).
   - **Corpo do PUT:** `{ "primaryWallet": WalletInfoDTO, "secondaryWallet"?: WalletInfoDTO }`
   - **Sucesso (200 OK):** `{ "wallets": WalletInfoDTO[] }`

---

### 3.3. Especificação dos Contratos de Eventos Socket.IO

Os eventos de tempo real operam sobre a conexão Socket.IO simulada pelo MSW e obedecem à estrutura canônica de envelopamento:

#### 1. Evento `nft.updated`
- **Nome do Evento:** `"nft.updated"`
- **Estrutura do Payload:**
  ```json
  {
    "eventId": "evt_nft_982319283",
    "resource": "nft",
    "resourceId": "nft-01",
    "version": 4,
    "timestamp": "2026-10-17T17:15:30.000Z",
    "data": {
      "priceEth": "0.55",
      "availableEditions": 2,
      "totalEditions": 50,
      "isAvailable": true
    }
  }
  ```
- **Regras de Processamento:**
  - Se `version <= currentResourceVersion`: evento é sumariamente ignorado.
  - Se o NFT estiver presente no catálogo ou na tela de detalhes: os dados de preço e edições restantes são atualizados de forma reativa.
  - Se o NFT estiver presente no carrinho de compras: a interface emite alerta não intrusivo (toast/banner acessível) e sinaliza que a cotação anterior expirou, exigindo revalidação antes do checkout.

#### 2. Evento `order.updated`
- **Nome do Evento:** `"order.updated"`
- **Estrutura do Payload:**
  ```json
  {
    "eventId": "evt_ord_192837465",
    "resource": "order",
    "resourceId": "ord_882194",
    "version": 2,
    "timestamp": "2026-10-17T17:15:32.000Z",
    "data": {
      "status": "confirmed",
      "txHash": "0x4b7c9e1208fa7d82361b2e887a02c5f11903",
      "reason": null
    }
  }
  ```
- **Regras de Processamento:**
  - Notifica a transição de um pedido em processamento pendente para `confirmed` ou `refused`.
  - Se `confirmed`: desbloqueia o modal de confirmação com recibo e aciona a limpeza no carrinho apenas dos itens comprados (RN-09).
  - Se `refused`: exibe estado de falha na tela de pagamento, preserva todos os itens do carrinho e permite ao usuário tentar novamente (EC-11).

#### 3. Protocolo de Reconciliação Pós-Reconexão
- Quando o `socket.io-client` sofre desconexão (queda de rede ou sleep do navegador) e restabelece a conexão (`connect` ou `reconnect`):
  1. O cliente não assume que os eventos perdidos serão reenfileirados pelo mock.
  2. O cliente dispara automaticamente consultas de reconciliação REST via TanStack Query para os recursos atualmente visíveis na tela (invalidação de queries ativas: detalhes do NFT aberto, itens e cotação do carrinho, ou status do pedido em andamento).

---

### 3.4. Fixtures Determinísticas

O mock deve inicializar com dados 100% determinísticos e estáticos para evitar flutuações em testes de regressão visual e E2E:

1. **Usuários Simulados:**
   - **Usuário 1 (Alice Colecionadora - Padrão):**
     - E-mail: `alice@greenmint.io`
     - Senha simulada: `Senha123!` (armazenada como hash `hash_v1_alice_valid`)
     - Perfil: Alice Vance, avatar temático Kurio.
     - Carteiras: MetaMask (`0x71C836e4922e921b7736413a2aC4D5aDb2849A1`, Rede Ethereum Mainnet, saldo fictício 4.50 ETH) como principal; Coinbase Wallet (`0x34B2931aC384812893812C4119028471289199C2`, Polygon) como secundária.
     - Favoritos iniciais: `["nft-01", "nft-04"]`.
   - **Usuário 2 (Bob Iniciante):**
     - E-mail: `bob@greenmint.io`
     - Senha simulada: `Senha456!` (armazenada como hash `hash_v1_bob_valid`)
     - Perfil: Bob Martinez, sem avatar personalizado.
     - Carteiras: Sem carteiras cadastradas previamente (para testar fluxo de adição no checkout).
     - Favoritos iniciais: `[]`.

2. **Catálogo de NFTs (Mínimo de 16 itens):**
   - Variedade rica para cobrir paginação (8 itens/página = 2 páginas completas), filtros por categoria (`art`, `collectibles`, `music`, `photography`) e status (`on_sale`, `last_editions`, `sold_out`).
   - Preços em ETH variados: de `"0.05"` a `"12.50"` ETH.
   - Exemplos de itens-chave:
     - `nft-01`: "Cyber Ape #1042" | Categoria: `art` | Preço: `"0.45"` ETH | Edições: `1/50` (últimas unidades).
     - `nft-02`: "Kurio Genesis Cube" | Categoria: `collectibles` | Preço: `"1.20"` ETH | Edições: `1/1` (peça única exclusiva).
     - `nft-03`: "Echoes of Silence" | Categoria: `music` | Preço: `"0.15"` ETH | Edições: `10/100`.
     - `nft-04`: "Neon Tokyo Drift" | Categoria: `photography` | Preço: `"0.85"` ETH | Edições: `0/25` (esgotado, para testar estado indisponível).
   - Metadados estáveis: imagens locais em `/assets/nfts/`, dimensões pré-computadas (largura x altura) para evitar layout shift (RN-24).

3. **Cupons de Desconto:**
   - `KURIO10`: Válido | 10% de desconto | Data de expiração: `2030-12-31T23:59:59Z`.
   - `VERAO2026`: Expirado | 20% de desconto | Data de expiração: `2026-01-01T00:00:00Z` (para testar validação temporal de EC-09 e RN-16).
   - Qualquer outro código: Inexistente (retorna 422).

---

### 3.5. Estado Simulado, Persistência e Reset

- **Estrutura no `localStorage`:**
  - Chave de estado anônimo/visitante: `greenmint_mock_guest_state`
  - Chave de estado de usuário autenticado: `greenmint_mock_user_{userId}_state`
  - Chave de preferência de cenário: `greenmint_dev_scenario`
  - Chave de condições de rede: `greenmint_dev_network`
- **Isolamento por Usuário (RN-13):**
  - O catálogo compartilhado tem seu estoque atualizado globalmente no mock.
  - Favoritos, carrinho, carteiras cadastradas, perfil e pedidos pertencem estritamente ao namespace do usuário logado.
  - Ao fazer logout ou trocar de usuário, o estado privado anterior permanece isolado e inacessível pela nova sessão.
- **Mecanismo de Reset Determinístico:**
  - Deve ser exposta uma função de reset (e rota utilitária `POST /api/__dev/reset`) que limpa as chaves no `localStorage` e recarrega os dados padrão das fixtures, restaurando um ponto de partida limpo e previsível.

---

### 3.6. Cenários Determinísticos e Condições de Rede (CA-04 e RN-15)

O sistema deve disponibilizar os 12 cenários a seguir:

| ID do Cenário | Nome / Identificador | Comportamento Simulado | Efeito Esperado na Interface |
| :--- | :--- | :--- | :--- |
| **01** | `default` | Catálogo completo populado, respostas 200/201 instantâneas ou com delay realista suave (80ms). | Fluxo nominal completo sem erros. |
| **02** | `empty-catalog` | `GET /nfts` retorna array vazio de itens (`totalItems: 0`). | Exibe estado vazio temático com mensagem amigável e sugestão de limpar filtros. |
| **03** | `variable-latency` | Latência randômica entre 300ms e 2500ms com respostas propositalmente invertidas em requisições concorrentes. | Testa descarte de respostas obsoletas (race conditions) no catálogo e busca. |
| **04** | `transient-errors` | 50% das chamadas a qualquer endpoint retornam HTTP 500 ou 503 com `TRANSIENT_ERROR`. | Testa política de retries do TanStack Query e botões de "Tentar novamente". |
| **05** | `network-failure` | Simula falha de conexão na camada de rede (sem resposta HTTP / `NetworkError`). | Exibe banner/toast de erro de conexão com opção de tentar reconectar. |
| **06** | `expired-session` | Chamadas autenticadas retornam HTTP 401 com `code: "UNAUTHORIZED"` informando expiração de sessão. | Usuário é redirecionado para login preservando rota anterior para retorno. |
| **07** | `register-conflict`| `POST /auth/register` sempre responde HTTP 409 com mensagem de e-mail já existente. | Exibe mensagem de erro associada diretamente ao campo de e-mail. |
| **08** | `coupon-expired` | Qualquer cupom inserido é tratado como expirado (HTTP 422 com `code: "EXPIRED_RESOURCE"`). | Exibe alerta claro de cupom expirado sem alterar o resumo do carrinho. |
| **09** | `price-changed` | Durante a cotação ou confirmação de compra, o preço de um dos itens sobe em 0.10 ETH (HTTP 409 + emissão de `nft.updated`). | Bloqueia compra, avisa que o preço mudou e exige revalidação explícita do usuário. |
| **10** | `edition-sold-out`| Ao tentar cotar ou comprar, a edição solicitada esgota (HTTP 409 + emissão de `nft.updated` com `availableEditions: 0`). | Bloqueia compra e indica item esgotado no carrinho. |
| **11** | `order-timeout` | `POST /orders` sofre delay maior que o timeout do cliente (ou aborta a resposta), mas o pedido é persistido internamente como pendente. | Usuário vê erro/timeout e ao reenviar com a mesma `Idempotency-Key` recupera o pedido criado. |
| **12** | `payment-refused` | `POST /orders` conclui a gravação, mas o status gerado é `"refused"` (ou evento `order.updated` emite recusa por saldo insuficiente). | Exibe tela de falha amigável, mantém os itens no carrinho e permite nova tentativa. |

#### Condições de Rede Configuráveis
Além do cenário, o painel de dev ou query params podem injetar modificadores globais:
- `latency`: delay artificial fixo em milissegundos (ex: `1000`).
- `jitter`: variação randômica de latência (ex: `±400ms`).
- `failureRate`: porcentagem de falhas simuladas (de `0%` a `100%`).

---

### 3.7. Arquitetura Socket.IO com MSW (`@mswjs/socket.io-binding`)

Esta seção detalha o ponto de maior risco arquitetural do projeto e define a estratégia para garantir estabilidade:

1. **Protocolo e Interceptação no MSW:**
   - O Mock Service Worker intercepta tráfego WebSocket em nível de navegador através do interceptor `ws.link(url, { protocol: new SocketIo() })`.
   - **Transports Suportados:** **Apenas `websocket`**. O `@mswjs/socket.io-binding` atua estritamente sobre a API WebSocket nativa do navegador. Ele **NÃO** intercepta o handshake inicial por HTTP Long-Polling (`/socket.io/?EIO=...`).
   - **Requisito Obrigatório no Cliente (`socket.io-client`):** A inicialização da conexão deve obrigatoriamente forçar o transporte puro via WebSocket:
     ```typescript
     // Requisito mandatório do cliente Socket.IO
     io(SOCKET_URL, {
       transports: ['websocket'], // Pula long-polling e conecta direto no interceptor WebSocket
       autoConnect: true,
     })
     ```
2. **Mecanismo de Despacho de Eventos:**
   - O mock mantém um registro interno (`activeClients`) dos clientes conectados via evento de conexão do binding.
   - É disponibilizado um despachante de eventos centralizado no mock (ex: `emitMockSocketEvent(eventName, payload)`).
   - Ao ser acionado (por uma mutação REST, por um cenário ativo ou por um gatilho de teste), o despachante envia a mensagem serializada no formato Socket.IO para todos os clientes ativos.
3. **Limitações Conhecidas do `@mswjs/socket.io-binding`:**
   - Suporte restrito ao namespace padrão (`/`). Não utilizar múltiplos namespaces (ex: `/orders` separado de `/nfts`).
   - Não suporta callbacks de confirmação nativos (*acknowledgements*) do Socket.IO; a comunicação no mock deve operar no padrão evento-dados (`socket.emit(event, data)`).
   - Suporte exclusivo a payloads de texto/JSON (sem buffers binários).
4. **Prova de Conceito (PoC) Mínima Obrigatória:**
   - **Passo 1 da implementação técnica:** Antes de implementar as dezenas de rotas REST, o projeto deve montar uma PoC mínima:
     1. Configurar o Service Worker com um handler WebSocket contendo o protocolo `SocketIo`.
     2. Instanciar o cliente `socket.io-client` com `transports: ['websocket']`.
     3. Emitir do mock um evento de teste `nft.updated`.
     4. Comprovar no console do navegador / teste que o cliente recebeu o evento com a assinatura correta.

---

### 3.8. Ativação dos Mocks e Build de Demonstração (Vercel)

1. **Ativação por Configuração:**
   - Variável de ambiente `VITE_ENABLE_MOCKS`:
     - Se `true` (ou se estiver em ambiente de desenvolvimento sem API real configurada), o mock service worker é iniciado.
     - No build de demonstração para a Vercel, `VITE_ENABLE_MOCKS=true` fica habilitado nas variáveis de ambiente do projeto.
2. **Inicialização Assíncrona Segura:**
   - O Service Worker do MSW (`worker.start({ onUnhandledRequest: 'bypass' })`) é uma operação assíncrona.
   - A inicialização do React (`root.render()`) deve aguardar a resolução do `worker.start()`. Isso impede que as primeiras requisições disparadas por componentes da UI aconteçam antes do Service Worker assumir o controle do tráfego de rede.
3. **Convivência com Rewrites da Vercel:**
   - O arquivo `mockServiceWorker.js` é gerado na pasta `public/` do projeto.
   - Durante o `build`, o Vite copia o arquivo para `dist/mockServiceWorker.js`.
   - Na Vercel, arquivos estáticos existentes na pasta `dist/` são servidos diretamente antes da avaliação das regras de `rewrites` do `vercel.json` (`"source": "/(.*)", "destination": "/index.html"`).
   - A spec valida que requisições para `/mockServiceWorker.js` recebam `HTTP 200` com `Content-Type: application/javascript`, garantindo o registro perfeito do worker em produção.

---

### 3.9. Casos de Borda & Tratamento de Erros (Edge Cases)

- **EC-CM01 (Chave de Idempotência Divergente):** Se um pedido for enviado com uma `Idempotency-Key` existente mas com total em ETH ou itens diferentes, a API deve retornar HTTP 409 com código `"CONFLICT"` e mensagem explicativa.
- **EC-CM02 (Race Condition e Respostas Fora de Ordem):** Quando o cenário `variable-latency` estiver ativo, requisições lentas não podem sobrescrever dados de requisições rápidas mais recentes no catálogo (garantido pela política de cancelamento de queries do Axios/TanStack Query).
- **EC-CM03 (Concorrência de Estoque):** Se dois clientes tentarem adquirir a última edição de um NFT simultaneamente, o primeiro confirma e o segundo recebe HTTP 409 ("Edição esgotada").
- **EC-CM04 (Queda Súbita do Mock WebSocket):** Caso a conexão do socket caia, o cliente deve entrar em modo de reconexão automática sem travar a interface e disparar reconciliação REST ao reconectar.
- **EC-CM05 (Reset em Sessão Ativa):** Ao executar o Reset do mock, o estado do usuário logado é restaurado para as fixtures iniciais e a UI é notificada para invalidar todas as queries ativas do TanStack Query.
- **EC-CM06 (Tentativa de Compra com Sessão Expirada):** Se o token do usuário expirar durante a permanência na tela de pagamento, a confirmação do pedido retorna HTTP 401 e a aplicação preserva o rascunho do pedido no redirecionamento.
- **EC-CM07 (Avatar Muito Grande ou Tipo Inválido):** O upload de avatar no perfil só aceita PNG ou JPEG e valida tamanho máximo (compatível com a cota do `localStorage`), retornando HTTP 400 em caso de violação.
- **EC-CM08 (Eventos Obsoletos do Socket):** Se o cliente receber um evento `nft.updated` com versão inferior ou igual à versão já conhecida pelo cache, o evento é sumariamente descartado sem re-renderizar componentes.
- **EC-CM09 (Persistência Offline sem Travamento):** Se o `localStorage` estiver bloqueado ou atingir quota, o mock deve registrar aviso no console e manter o estado em memória para evitar quebras em tempo de execução.
- **EC-CM10 (Parâmetro de Cenário Inválido na URL):** Caso seja fornecido um cenário inexistente na URL (ex: `?scenario=inexistente`), o sistema deve aplicar fallback silencioso para o cenário `default` e logar uma advertência no console.

---

## 4. Critérios de Aceite (Definition of Done)

- [ ] **CA-CM01 (Contratos Tipados Completos):** Todos os DTOs, payloads de requisição/resposta REST e interfaces de eventos Socket.IO estão tipados em TypeScript estrito em módulo compartilhado (`contracts`), com valores em ETH como string decimal.
- [ ] **CA-CM02 (Prova de Conceito Socket.IO Executada com Sucesso):** Existe uma PoC funcional onde o cliente `socket.io-client` conecta com sucesso via `transports: ['websocket']` ao interceptor MSW e recebe um evento `nft.updated` emitido pelo mock.
- [ ] **CA-CM03 (Handlers REST Mapeados):** Todos os endpoints descritos em 3.2 estão implementados no MSW cobrindo códigos HTTP 200, 201, 400, 401, 403, 404, 409, 422 e 500/503.
- [ ] **CA-CM04 (Idempotência Funcional):** A rota `POST /orders` valida a `Idempotency-Key`, retornando o mesmo pedido para repetições idênticas e HTTP 409 para payloads divergentes.
- [ ] **CA-CM05 (Fixtures Ricas e Determinísticas):** As fixtures contêm ao menos 16 NFTs (variando preços, categorias, edições e status), 2 usuários com credenciais seguras, cupons nos 3 estados e carteiras configuradas.
- [ ] **CA-CM06 (Persistência e Isolamento em `localStorage`):** Mudanças no catálogo, favoritos, carrinho, pedidos e perfil persistem após refresh e são estritamente isoladas entre os usuários Alice e Bob.
- [ ] **CA-CM07 (Mecanismo de Reset Operante):** O comando/ação de Reset restaura integralmente o estado das fixtures e zera alterações locais.
- [ ] **CA-CM08 (12 Cenários Determinísticos Operantes):** Todos os 12 cenários de CA-04 estão implementados e reproduzíveis sob demanda.
- [ ] **CA-CM09 (Precedência de Cenários Respeitada):** A precedência `URL search param` > `Painel Dev` > `Variável de Ambiente` funciona de forma consistente.
- [ ] **CA-CM10 (Condições de Rede Parametrizáveis):** Latência artificial e taxa de falhas podem ser ajustadas dinamicamente sem necessidade de rebuild.
- [ ] **CA-CM11 (Build de Produção na Vercel com Mocks):** A aplicação compila (`npm run build`) e roda em preview/Vercel com o Service Worker do MSW ativo, respondendo às requisições e aos eventos WebSocket.
- [ ] **CA-CM12 (Zero Mocks na UI):** Nenhuma resposta mockada, delay artificial ou lógica fictícia de dados reside em componentes, hooks ou na instância do Axios.

---

## 5. Decisões Tomadas e Pontos em Aberto

### Decisões Consolidadas

1. **Armazenamento de Avatar no Mock (Opção A):**
   - O avatar enviado em `PUT /profile` (PNG/JPEG) é convertido para Data URL (Base64 compactada/redimensionada com limite estrito de ~100KB) e persistido diretamente no namespace do usuário no `localStorage`. Isso assegura que o avatar sobrevive a refreshes e mantém isolamento por perfil.

2. **Formato do Token de Sessão Simulado (JWT):**
   - A autenticação emite um JWT simulado codificado em Base64 (payload com `sub`, `email`, `role`, `iat`, `exp`), permitindo que a camada de autorização do cliente inspecione a expiração de forma padronizada sem necessitar de verificação de assinatura criptográfica pesada.

3. **Estratégia de Disparo de Eventos nos Testes Playwright (Opção A):**
   - O Mock Service Worker disponibiliza o endpoint utilitário `POST /api/__dev/events` (aceitando `{ event: string, payload: any }`). Os testes E2E do Playwright e o painel de desenvolvimento disparam eventos em tempo real (`nft.updated`, `order.updated`) através de requisições HTTP para este endpoint, que por sua vez utiliza o despachante WebSocket para emitir os frames a todos os clientes conectados.

4. **Regra de Merge de Carrinho Visitante → Usuário (Merge com Soma):**
   - Ao realizar login com itens no carrinho de visitante, o sistema une os itens anônimos ao carrinho prévio do usuário logado: itens repetidos têm suas quantidades somadas (limitadas ao estoque disponível da respectiva edição) e itens novos são anexados, recalculando a cotação imediatamente.

---

## 6. Plano de Implementação em Passos Pequenos e Ordenados

Para assegurar uma construção incremental e mitigar o principal risco técnico logo no início, a implementação deve ser dividida nos seguintes passos:

1. **Passo 1: Prova de Conceito (PoC) Mínima do Socket.IO com MSW**
   - Instalar `@mswjs/socket.io-binding` e `socket.io-client`.
   - Criar interceptor WebSocket simples no MSW vinculado ao protocolo `SocketIo`.
   - Criar cliente de teste que conecta forçando `transports: ['websocket']`.
   - Emitir evento `"nft.updated"` a partir do mock e validar o recebimento com payload intacto.

2. **Passo 2: Definição dos Contratos Tipados Compartilhados**
   - Criar o módulo `contracts/` contendo todas as interfaces TypeScript (DTOs de Usuário, NFT, Carrinho, Cotação, Pedido, Carteiras, Erros e Eventos Socket.IO).
   - Garantir valores em ETH tipados estritamente como strings decimais.

3. **Passo 3: Fixtures Determinísticas**
   - Criar fixtures estáticas com 16 NFTs categorizados, 2 usuários com senhas hash, cupons e carteiras.
   - Criar assets locais correspondentes e metadados de imagem (largura/altura).

4. **Passo 4: Motor de Estado Simulado, Persistência e Reset**
   - Implementar módulo de gerenciamento de estado persistente em `localStorage`.
   - Implementar isolamento por namespace de usuário e o mecanismo de Reset.

5. **Passo 5: Handlers REST no MSW (Dividido por Domínio)**
   - Autenticação e Sessão (`/auth/*`).
   - Catálogo e Detalhes de NFTs (`/nfts` e `/nfts/:id`) com paginação e filtros.
   - Favoritos (`/favorites/*`).
   - Carrinho e Cotação (`/cart/*`, `/cart/quote`).
   - Pedidos com Idempotência (`/orders/*`).
   - Perfil e Carteiras (`/profile`, `/wallets`).

6. **Passo 6: Motor de Cenários e Condições de Rede**
   - Implementar os 12 cenários de CA-04 com suporte a latência, jitter, erros transitórios e falhas de rede.
   - Implementar leitor de cenários com a precedência definida (URL > LocalStorage > Env).
   - Criar Painel de Desenvolvimento básico para alternar cenários e acionar o Reset.

7. **Passo 7: Ativação Global e Integração no Build de Produção**
   - Integrar inicialização assíncrona do MSW no ponto de entrada da aplicação (`main.tsx`).
   - Validar compatibilidade do Service Worker no build de produção (`npm run build` && `npm run preview`) e deploy na Vercel com os rewrites existentes.
