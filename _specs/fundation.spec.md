# Spec: Fundação (NTF Marketplace GreenMint / Kurio)

> Spec da etapa de fundação do projeto. Herda integralmente o contexto, stack e regras globais de `_specs/base.spec.md`. Foca exclusivamente em infraestrutura, tooling, sistema de design tokens extraídos do Figma, casca da aplicação (shell responsivo), componentes base, roteamento base + 404, instâncias de clientes (Axios e QueryClient) e deploy inicial. **NÃO inclui telas de negócio, contratos REST, MSW nem Socket.IO.**

---

## 1. Visão Geral

- **Objetivo:** Estabelecer a base arquitetural e visual do marketplace de NFTs GreenMint (Kurio), configurando o projeto React + TypeScript, ferramentas de lint e typecheck estrito, integração de design tokens fiéis ao Figma via Tailwind CSS e shadcn/ui, casca da aplicação (Header, Footer e navegação responsiva), rotas base com tela 404, clientes de infraestrutura (Axios e TanStack QueryClient) e deploy inicial contínuo.
- **Público/Atores:**
  - **Visitante / Colecionador:** Navega pela casca da aplicação, experimenta a responsividade (390px, 768px, 1440px), acessa rotas e recebe feedback visual coerente em URLs inexistentes (404).
  - **Desenvolvedor:** Utiliza tooling padronizado, componentes atômicos tipados e tokens pré-configurados para acelerar as specs seguintes.
  - **Avaliador:** Executa `lint`, `typecheck`, `build` e auditorias iniciais de acessibilidade e performance sem falhas nem dependências privadas.

---

## 2. Requisitos Funcionais (RF)

### Tooling, Tipagem e Infraestrutura

- **RF-01:** O projeto deve estar configurado com Vite, React 19 e TypeScript em modo estrito (`strict: true`), com comandos funcionais para `dev`, `build`, `preview`, `lint` e `typecheck`.
- **RF-02:** O linter (ESLint 9+ Flat Config) e a checagem de tipos (`tsc --noEmit`) devem rodar sem erros ou advertências a partir de um checkout limpo.
- **RF-03:** As fontes (`Roboto Mono` nos pesos 400, 500 e 700) e os ícones vetoriais devem ser servidos localmente sem dependência de requisições a CDNs externas em tempo de execução (conforme RN-23 e RN-24).

### Design System & Tokens do Figma

- **RF-04:** O Tailwind CSS e o tema do shadcn/ui devem mapear integralmente os tokens extraídos da inspeção do Figma (`Color/Ink`, `Color/Foreground`, `Color/Primary`, `Text/Accent`, `Color/Surface Card`, etc.).
- **RF-05:** Os estilos tipográficos devem reproduzir a escala observada no Figma (família única `Roboto Mono`, variando de `Tiny/9` a `Display/43`).
- **RF-06:** O sistema deve fornecer componentes primitivos do shadcn/ui estilizados com os tokens do projeto: `Button` (variantes primary, secondary, outline, ghost), `Input`, `Textarea`, `Card`, `Dialog` (Modal), `Sheet` (Drawer mobile), `Badge`, `Separator`, `DropdownMenu` e `Skeleton`.

### Casca da Aplicação (Shell) & Navegação Responsiva

- **RF-07:** O sistema deve prover um componente `Header` responsivo:
  - **Desktop (1440px):** Container centralizado de 1200px contendo logotipo "KURIO" com tracking tipográfico, links de navegação ("Início", "Mercado", "Criadores", "Aprenda"), indicador de rota ativa sublinhado com a cor primária (`Active=Home` ou `Active=Market`), ícone de busca, ícone de carrinho com badge de contagem numérica e botão de autenticação ("Entrar" / Perfil). Linha divisória inferior ultrafina (`0.3px` na cor primária).
  - **Mobile (390px - 414px):** Barra compacta com Logo KURIO, botão hambúrguer para acionar Drawer de navegação, ícone de busca e carrinho com badge.
  - **Tablet (768px):** Adaptação fluida do mobile expandido conforme RN-19, preservando acessibilidade de toque e legibilidade.
- **RF-08:** O menu de navegação mobile (Drawer/Sheet) deve ser acessível por teclado, prender o foco (focus trap) enquanto aberto, fechar via tecla <kbd>Esc</kbd> ou clique no backdrop, e bloquear a rolagem do body.
- **RF-09:** O sistema deve prover um componente `Footer` global com os três blocos previstos no layout do Figma:
  1. Bloco de segurança/benefícios + formulário de newsletter (input com botão "Enviar" embutido).
  2. Faixa institucional de contato e slogan da marca.
  3. Colunas de navegação ("Meu perfil", "Central de ajuda", "Coleções"), links para redes sociais em botões quadrados com borda primária, badge de carteiras compatíveis e copyright.

### Roteamento Base e Páginas Auxiliares

- **RF-10:** O roteamento com TanStack Router deve conter o layout shell global e declarar todas as rotas previstas pela aplicação:
  - `/` (Início / Catálogo)
  - `/nft/$id` (Detalhes do NFT)
  - `/carrinho` (Carrinho de compras)
  - `/pagamento` (Checkout / Pagamento)
  - `/confirmacao` (Confirmação de pedido)
  - `/login` (Login)
  - `/cadastro` (Cadastro de conta)
  - `/perfil` (Perfil do colecionador)
  - `/carteiras` (Gestão de carteiras)
- **RF-11:** Qualquer URL inexistente deve renderizar uma página 404 temática, alinhada à identidade visual do Figma (fundo `Color/Ink`, card `Color/Surface Card`, mensagem amigável e botão CTA primário para retornar à página inicial `/`).

### Clientes de Infraestrutura

- **RF-12:** Deve existir uma instância configurada do cliente HTTP `Axios` (`apiClient`), com baseURL parametrizável via variável de ambiente (`VITE_API_URL` com fallback para `/api`), timeout padrão e tipagem base pronta para interceptores.
- **RF-13:** Deve existir uma instância configurada do `QueryClient` (TanStack Query) com políticas globais seguras (`staleTime`, controle de retries e garbage collection) para gerenciar o estado assíncrono nas próximas specs.

### Deploy Inicial

- **RF-14:** O projeto deve ser publicado em provedor de hospedagem estática (Vercel, Cloudflare Pages ou Netlify), com URL pública ativa, executando a casca, navegação e fallback de SPA (rewrites para que refresh em qualquer rota não gere 404 do servidor HTTP).

---

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio Herdadas e da Fundação

- **RN-F01 (Stack Obrigatória):** Proibido o uso de bibliotecas de UI concorrentes. A estilização deve utilizar Tailwind CSS combinado com componentes headless acessíveis (Radix UI / shadcn/ui).
- **RN-F02 (Herança de Contratos e Zero Mocking de Negócio):** Componentes da casca, botões e links não devem possuir mocks embutidos ou lógica fictícia de regras de negócio; a infraestrutura de dados simulados pertencerá à spec de contratos e mocks.
- **RN-F03 (Fidelidade aos Tokens):** Não utilizar cores genéricas do Tailwind (ex: `bg-blue-500`, `text-gray-200`). Todas as cores de superfície, bordas, textos e ações devem apontar para as variáveis e tokens definidos a partir do Figma.
- **RN-F04 (Layout Responsivo por Breakpoints):**
  - Mobile: de 320px a 767px (base de teste Playwright em 390px, design de prancheta em 414px).
  - Tablet: de 768px a 1023px (mobile expandido, layout fluido sem quebras ou overflow horizontal, conforme RN-19).
  - Desktop: a partir de 1024px (container centralizado `max-w-[1200px]`, prancheta de referência em 1440px com padding lateral de 120px).
- **RN-F05 (Performance e Fontes sem Layout Shift):** A fonte `Roboto Mono` deve ser carregada com `font-display: swap` e métricas consistentes para evitar CLS (Cumulative Layout Shift = 0) e render blocking (meta LCP).
- **RN-F06 (Acessibilidade WCAG AA/AAA):** Todos os elementos interativos devem ter área de clique mínima de 44x44px em telas sensíveis ao toque (mobile), foco visível acessível por teclado (`focus-visible`), contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande/elementos de UI, e atributos `aria-label` em botões apenas com ícone.

### Casos de Borda & Tratamento de Erros

- **EC-F01 (Acesso direto a rotas no deploy):** O servidor de deploy deve rotear todas as requisições não encontradas para `index.html` (rewrite SPA), garantindo que refresh em rotas como `/carrinho` ou `/pagamento` carregue a aplicação e deixe o roteador gerenciar a rota.
- **EC-F02 (Rota Inexistente / 404):** A rota 404 deve ser exibida no corpo principal do shell (preservando Header e Footer) e conter um CTA claro "Voltar para o Início" que restaura a navegação.
- **EC-F03 (Drawer Mobile e Scroll Lock):** Ao abrir o menu mobile, o scroll do documento raiz (`html`/`body`) deve ser travado. Ao fechar (seja por clique no overlay, botão de fechar ou tecla Esc), o scroll deve ser restaurado imediatamente.
- **EC-F04 (Badge de Carrinho Vazio):** Quando o contador do carrinho for 0 (ou inexistente nesta fase), o badge deve permanecer oculto ou não quebrar o alinhamento do ícone de carrinho no header.
- **EC-F05 (Redução de Movimento):** Para usuários com a configuração `prefers-reduced-motion: reduce`, transições de gavetas, modais e efeitos visuais devem ocorrer instantaneamente sem animações desnecessárias.

---

## 4. Design Tokens Inspecionados do Figma

> Dados consolidados a partir da inspeção minuciosa dos 9 frames Desktop e 6 frames Mobile do arquivo Figma GreenMint (Kurio), registrados preliminarmente em `.agents/figma-notes.md`.

### 4.1. Paleta de Cores e Superfícies

| Nome do Token                     | Hex / Valor              | Função e Onde é Usado                                                             | Origem no Figma                    |
| :-------------------------------- | :----------------------- | :-------------------------------------------------------------------------------- | :--------------------------------- |
| `color-ink` (`background`)        | `#140D0A`                | Fundo principal da aplicação (`body`), texto contrastante em botões primários     | Oficial (`Color/Ink`)              |
| `color-foreground` (`foreground`) | `#F5F1EB`                | Texto principal, títulos, ícones de cabeçalho, bordas de destaque                 | Oficial (`Color/Foreground`)       |
| `color-primary` (`primary`)       | `#D28A4C`                | Botões de ação principais, badges, underline de abas ativas, linhas divisórias    | Oficial (`Color/Primary`)          |
| `text-accent`                     | `#E89B55`                | Preços de NFTs em destaque, links ativos, contadores selecionados                 | Oficial (`Text/Accent`)            |
| `text-secondary`                  | `#CFB28C`                | Descrições secundárias, legendas, contadores em listas de coleções                | Oficial (`Text/Secondary`)         |
| `color-secondary`                 | `#B39463`                | Preços antigos riscados, placeholders, metadados secundários de cards             | Oficial (`Color/Secondary`)        |
| `surface-card` (`card`)           | `#241612`                | Fundo de cards de produtos, sidebar de filtros, linhas do carrinho, footer, modal | Oficial (`Color/Surface Card`)     |
| `surface-raised`                  | `#2F1D15`                | Superfície elevada (botão flutuante de zoom/ação sobre a imagem do NFT)           | Oficial (`Color/Surface Raised`)   |
| `surface-dark`                    | `#38220F`                | Fundo de inputs (newsletter), faixa central do footer, badge de carteiras         | Oficial (`Color/Surface Dark`)     |
| `color-border` (`border`)         | `#3F2319`                | Bordas padrão de containers, inputs de formulário, botões de paginação            | Oficial (`Color/Border`)           |
| `border-soft`                     | `#55321F`                | Borda sutil de caixas em destaque e badge de carteiras                            | Oficial (`Color/Border Soft`)      |
| `text-coral` (`destructive`)      | `#F0805F`                | Indicador de campos obrigatórios (*), alertas de validação e estados de erro      | Oficial (`Text/Coral`)             |
| `overlay-backdrop`                | `rgba(20, 13, 10, 0.85)` | Fundo semitransparente escurecido de modais e drawers                             | Dedução baseada no frame `11:4385` |

### 4.2. Tipografia (Família Exclusiva: `Roboto Mono`)

| Nome do Estilo / Token | Tamanho | Peso          | Line-Height        | Uso Específico Identificado                                        |
| :--------------------- | :------ | :------------ | :----------------- | :----------------------------------------------------------------- |
| `font-display`         | 43px    | Bold (700)    | 70px               | Título do Hero na página inicial Desktop                           |
| `font-heading-lg`      | 28px    | Bold (700)    | auto / 32px        | Título no detalhe do NFT, Diário da Cunhagem, Perfil, Carteiras    |
| `font-heading-md`      | 24px    | Bold (700)    | auto / 28px        | Títulos de seções, cabeçalhos de cards do footer                   |
| `font-title-lg`        | 22px    | Bold (700)    | 16px / 24px        | Preço principal na página de Detalhes do NFT                       |
| `font-title-md`        | 22px    | Regular (400) | 29px               | Destaques numéricos e subtítulos de resumo                         |
| `font-title-sm`        | 20px    | Regular (400) | 28px / 10px        | Número no seletor de quantidade                                    |
| `font-body-xl-bold`    | 18px    | Bold (700)    | 16px / 24px        | Preços em cards, títulos de promos, cabeçalhos do footer           |
| `font-body-xl-regular` | 18px    | Regular (400) | 16px               | Preço anterior riscado em promoções                                |
| `font-body-lg-bold`    | 17px    | Bold (700)    | 16px               | Destaques do footer, títulos de blocos no checkout                 |
| `font-body-md-bold`    | 16px    | Bold (700)    | auto / 20px        | Link ativo de navegação ("Início"/"Mercado"), títulos blog         |
| `font-body-md-medium`  | 16px    | Medium (500)  | auto / 16px        | Texto do botão "Entrar", labels de colunas de tabela               |
| `font-body-md-regular` | 16px    | Regular (400) | auto / 16px        | Links de navegação inativos, nomes de NFTs nos cards               |
| `font-body-sm-bold`    | 15px    | Bold (700)    | 16px / 40px        | Contadores dos filtros `(33)`, botão "Aplicar", "Confirmar compra" |
| `font-body-sm-medium`  | 15px    | Medium (500)  | 16px               | Abas do catálogo ("Todos os NFTs", "Novos lançamentos", "Em alta") |
| `font-body-sm-regular` | 15px    | Regular (400) | 15px / 16px        | Itens de lista de filtro, labels de formulário, textos gerais      |
| `font-body-xs-bold`    | 14px    | Bold (700)    | auto / 20px        | Logotipo "KURIO" (tracking 0.1em), botão "COMPRAR"                 |
| `font-body-xs-medium`  | 14px    | Medium (500)  | 16px / 20px        | Subtítulo do Hero, botão "Favoritar"                               |
| `font-body-xs-regular` | 14px    | Regular (400) | 15px / 22px / 24px | Descrições de produto, textos do footer, placeholders              |
| `font-caption-md`      | 13px    | Regular (400) | 22px               | Notas da newsletter e textos de apoio                              |
| `font-caption-sm`      | 12px    | Regular (400) | 16px               | Placeholders secundários e label "Taxa estimada"                   |
| `font-tiny-md`         | 10px    | Medium (500)  | auto               | Badge numérico do carrinho de compras                              |
| `font-tiny-sm`         | 9px     | Bold (700)    | auto               | Badge de carteiras compatíveis (tracking 0.011em)                  |

### 4.3. Espaçamentos, Grid e Containers por Breakpoint

| Breakpoint | Viewport Alvo                    | Largura do Container  | Padding Horizontal                              | Gaps Típicos                                        |
| :--------- | :------------------------------- | :-------------------- | :---------------------------------------------- | :-------------------------------------------------- |
| `Desktop`  | ≥ 1024px (ref. 1440px)           | `1200px` centralizado | `120px` na prancheta / `max-w-[1200px] mx-auto` | Seções: `96px`; Cards: `24px` a `48px`              |
| `Tablet`   | 768px a 1023px (ref. 768px)      | Fluido (100% largura) | `32px` a `40px`                                 | Seções: `48px`; Cards: `16px` a `24px`              |
| `Mobile`   | 320px a 767px (ref. 390px/414px) | Fluido (100% largura) | `24px` a `28px`                                 | Seções: `32px` a `40px`; Elementos: `12px` a `16px` |

### 4.4. Raios de Borda (Border Radius), Bordas e Sombras

| Classificação   | Valor Figma                       | Uso Mapeado no Projeto                                                                  |
| :-------------- | :-------------------------------- | :-------------------------------------------------------------------------------------- |
| `rounded-sm`    | `3px` / `4px`                     | Inputs de formulário, campo de cupom, botões compactos ("Aplicar", paginação)           |
| `rounded-md`    | `5px` / `6px`                     | Botão de login do header, botão "EXPLORAR", botões "COMPRAR"/"Favoritar", thumbnails    |
| `rounded-lg`    | `8px`                             | Cards de blog, botão "Confirmar compra", thumbnails de recibo do modal                  |
| `rounded-xl`    | `12px` - `15px`                   | Imagens de cards do catálogo e cards promocionais                                       |
| `rounded-2xl`   | `18px` - `24px`                   | Imagem em destaque do Hero (450x450) e imagem de detalhes do produto (404x404)          |
| `rounded-full`  | `9999px`                          | Badges de contagem do carrinho, badges ovais de edição (`1/1`, `1/50`), botões de rádio |
| `shadow-subtle` | `0 0 20px 0 rgba(10, 6, 4, 0.45)` | Input da newsletter no footer e elevações de cards                                      |
| `border-fine`   | `0.3px` a `1px` sólida            | Divisórias e bordas nos tons `Color/Border` (#3F2319) e `Color/Primary` (#D28A4C)       |

### 4.5. Componentes Recorrentes e Variantes Base

| Componente Base    | Variantes Mapeadas                                                                                                                        | Especificações / Props                                                                           |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `Button`           | `primary` (fill #D28A4C, texto #140D0A), `outline` (borda 1px #D28A4C, texto #E89B55), `secondary` (fill #241612), `ghost` (transparente) | Alturas: `sm` (32px), `md` (40px), `lg` (45px); estados `loading` (spinner) e `disabled`         |
| `Input`            | `default`, `newsletter` (com botão acoplado), `search` (com ícone de lupa)                                                                | Altura: 40px; borda #3F2319; foco #D28A4C; placeholder #B39463; tipografia Roboto Mono 14px/15px |
| `Card`             | `default` (fundo #241612, borda #3F2319), `highlight` (gradiente sutil)                                                                   | Padding: 16px a 24px; borderRadius: 8px a 12px                                                   |
| `Badge`            | `counter` (círculo 16x16 primário no carrinho), `edition` (pílula selecionável), `tag` (status de rede)                                   | Variantes ativa (borda primária e texto acentuado) e inativa (borda discreta)                    |
| `Dialog` / `Modal` | `confirmation` (Modal de recibo com 578px de largura, backdrop escuro, barra decorativa de 10px)                                          | Acessibilidade Radix UI: focus trap, tecla Esc, aria-describedby                                 |
| `Sheet` / `Drawer` | `navigation` (Menu mobile lateral que desliza da direita/esquerda com links e ações)                                                      | Fechamento por overlay, suporte a gestos e transições suaves                                     |
| `Separator`        | `hairline` (0.3px primário sob o header), `standard` (1px nos blocos do footer e tabelas)                                                 | Orientação horizontal ou vertical                                                                |

### 4.6. Inconsistências Identificadas entre Frames e Decisões de Padronização

1. **Divergência de Raios de Borda**:
   - _Figma_: Variação arbitrária entre 3px, 5px, 6px e 8px em botões semelhantes entre diferentes frames (ex: 6px no botão "Entrar", 3px no botão "Aplicar", 5px no botão "Etherscan", 8px no botão "Confirmar compra").
   - _Decisão Arquitetural_: Padronizar botões interativos principais com `rounded-md` (6px) e inputs de dados com `rounded-sm` (4px) a `rounded-md` (6px), mantendo harmonia visual e eliminando microvariações acidentais.
2. **Duplicidade de Tokens de Texto Secundário**:
   - _Figma_: Uso alternado de `Text/Secondary` (`#CFB28C`) e `Color/Secondary` (`#B39463`) para funções análogas de texto de apoio.
   - _Decisão Arquitetural_: Mapear `text-muted-foreground` preferencialmente para `#CFB28C` (maior contraste) e reservar `#B39463` para texto riscado de promoções, placeholders e metadados secundários.
3. **Variações em Thumbnails do Recibo**:
   - _Figma_: Miniaturas no frame de Pagamento medem 65x65, 66x66 e 70x70px.
   - _Decisão Arquitetural_: Padronizar o componente de miniatura em 70x70px com `object-fit: cover` e `rounded-lg` (8px).

### 4.7. Auditoria de Contraste e Acessibilidade (Meta: Accessibility ≥ 95)

- **Texto Principal sobre Fundo**: `#F5F1EB` sobre `#140D0A` possui contraste superior a `14.5:1` (Aprovado WCAG AAA).
- **Botão Primário**: Texto escuro `#140D0A` sobre fundo primário `#D28A4C` possui contraste de `6.5:1` (Aprovado WCAG AAA para texto normal e grande).
- **Texto Acentuado**: Preços `#E89B55` sobre `#140D0A` possuem contraste de `6.2:1` (Aprovado WCAG AA e AAA para fontes em negrito ≥ 14px).
- **Atenção em Acessibilidade**: `Color/Secondary` (`#B39463`) sobre fundo `#241612` possui contraste de `4.6:1`. Para garantir pontuação ≥ 95 no Lighthouse, qualquer texto com essa cor não deve ser renderizado em tamanho inferior a 14px, e campos de entrada de texto devem usar labels explícitos associados via `htmlFor`.

### 4.8. Assets Locais a Exportar e Versionar

- **Fontes**: Arquivos WOFF2 de `Roboto Mono` (pesos 400, 500, 700) instalados via `@fontsource/roboto-mono` ou em `/public/fonts/`.
- **Ícones SVG**:
  - `Iconly/Curved/Logout` (ícone de saída no header)
  - `Iconly/Curved/Delete` (ícone de lixeira no carrinho)
  - `Iconly/Curved/Arrow - Right` e `Arrow - Right 2` (navegação)
  - `Iconly/Two-tone/Arrow - Down 2` (seta de ordenação)
  - `Iconly/Bold/Star` (avaliações do NFT)
  - `Cart Icon`, `Search Icon`, `Heart Icon` (ações do header e favoritos)
  - Redes Sociais: Facebook, Instagram, Twitter/X, Linkedin
  - Provedores de Carteira: MetaMask, Coinbase Wallet, WalletConnect
- **Imagens**:
  - Logo vetorial KURIO
  - Obras de arte dos NFTs de exemplo (armazenadas em `/public/assets/nfts/` com atributos explícitos de largura e altura para prevenção de CLS).

---

## 5. Critérios de Aceite (Definition of Done)

- [ ] **CA-F01 (Tooling & Qualidade de Código):** `npm run build`, `npm run lint` e `npm run typecheck` executam e completam com código de saída 0 sem warnings ou erros.
- [ ] **CA-F02 (Design Tokens & Tailwind):** O arquivo de configuração do Tailwind e os estilos globais contêm todas as variáveis e classes utilitárias mapeadas a partir dos tokens do Figma (`Color/Ink`, `Color/Foreground`, `Color/Primary`, etc.).
- [ ] **CA-F03 (Header Fiel e Responsivo):** O Header é renderizado no topo de todas as páginas da fundação, exibindo o logo KURIO, links de navegação, ícones de ação e carrinho com badge. Em desktop apresenta largura máxima de 1200px com linha divisória fina; em mobile (390px-414px) apresenta menu lateral (Drawer) funcional acessível por teclado.
- [ ] **CA-F04 (Footer Fiel):** O Footer exibe integralmente as 3 seções do Figma (newsletter com input embutido, contatos institucionais, colunas de links, redes sociais, badge de carteiras e copyright), adaptando-se sem overflow em 390px, 768px e 1440px.
- [ ] **CA-F05 (Componentes Base shadcn/ui):** Primitivos `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Sheet` e `Separator` existem no projeto, utilizam a fonte `Roboto Mono` e os tokens definidos, prontos para consumo.
- [ ] **CA-F06 (Rotas & Tratamento 404):** O roteamento TanStack Router gerencia as rotas base declaradas no layout shell. Acessar uma rota desconhecida (ex: `/rota-inexistente`) exibe a tela 404 estilizada com link funcional para `/`.
- [ ] **CA-F07 (Clientes Axios e QueryClient):** Instâncias exportadas de `apiClient` (Axios) e `queryClient` (TanStack Query) estão criadas e integradas ao `App` via provedor `QueryClientProvider`.
- [ ] **CA-F08 (Assets e Fontes Locais):** A fonte `Roboto Mono` e os ícones essenciais carregam localmente sem chamadas a CDNs externas, com `font-display: swap`.
- [ ] **CA-F09 (Deploy Inicial Ativo):** O projeto está implantado em URL pública e acessível, com SPA fallback ativo para que refresh em qualquer rota não retorne erro HTTP do servidor.
- [ ] **CA-F10 (Acessibilidade e Semântica):** Marcação HTML semântica (`<header>`, `<nav>`, `<main>`, `<footer>`), foco visível por teclado e atributos `aria-label` presentes em botões apenas com ícone.

---

## 6. Perguntas Adicionais / Pontos em Aberto

1. **Plataforma de Deploy Preferencial:** Para o deploy inicial da fundação, há preferência explícita por Vercel, Netlify ou Cloudflare Pages? _(Recomendação padrão: Vercel ou Netlify pelo suporte nativo e simples a rewrites de SPA via `vercel.json` ou `_redirects`)._
   R: Segue com o Deploy na Vercel.

2. **Estratégia de Ícones:** Deseja utilizar ícones SVG avulsos em componentes React (ex: `lucide-react` estilizado no padrão Iconly) ou exportar diretamente os SVGs exatos do Figma para componentes dedicados? _(Recomendação: Componentes SVG locais baseados nos vetores do Figma para fidelidade máxima)._
   R: Exportar os SVGs exatos do figma.

3. **Persistência Temporária do Badge de Carrinho no Shell:** Como a spec de carrinho virá adiante, o badge de contagem no header deve inicializar com valor 0 oculto ou exibir o valor estático visual do Figma (`Badge Count = 6`) até a integração do estado real? _(Recomendação: inicializar com badge condicional ou valor default zero para evitar exibição de dados incoerentes)._
   R: Inicie a badge com o valor default 0.
