# Spec: Sessão, Autenticação e Catálogo Inicial (Itens 03 e 04)

> Spec unificada cobrindo os itens **03 (`sessao-auth`)** e **04 (`catalogo-inicio`)** da tabela "6 - Ordem da Execução e Specs Derivadas" de [_specs/base.spec.md](file:///home/savior/coding/nft-marketplace/_specs/base.spec.md).  
> Herda integralmente o contexto, stack obrigatória (React 19, TypeScript estrito, TanStack Router, TanStack Query, Axios, Tailwind CSS, shadcn/ui, MSW e Playwright), os tokens de design consolidados em [_specs/fundation.spec.md](file:///home/savior/coding/nft-marketplace/_specs/fundation.spec.md) e a camada de simulação de rede e contratos definida em [_specs/contratos-e-mocks.spec.md](file:///home/savior/coding/nft-marketplace/_specs/contratos-e-mocks.spec.md).  
> **Esta spec foca no "O QUE" a interface e o estado devem realizar, sem código de implementação.**

---

## 1. Visão Geral

- **Objetivo:** Implementar o fluxo completo de autenticação e gestão de sessão de colecionadores (Cadastro, Login, Logout, Persistência de sessão, Expiração de token, Proteção de rotas com retorno ao fluxo anterior e Isolamento rigoroso de cache) em conjunto com a tela principal de descoberta do marketplace (Início / Catálogo, Hero Banner em destaque, busca textual com debounce, filtros combináveis de categoria, status e preço, ordenação e paginação sincronizadas bidirecionalmente na URL via search params, skeletons com shimmer sem layout shift e estados de erro/vazio).
- **Público/Atores:**
  - **Visitante (Não Autenticado):** Navega pela página inicial, explora o Hero em destaque, executa buscas textuais, combina filtros de categoria e preço, visualiza cards de NFTs paginados, tenta acessar áreas restritas e é direcionado para autenticação preservando o destino pretendido.
  - **Colecionador (Autenticado):** Realiza login ou cadastro com validação imediata, visualiza sua identidade no cabeçalho da aplicação (nome, avatar e menu de conta), acessa diretamente rotas protegidas (`/perfil`, `/carteiras`, `/pagamento`), navega pelo catálogo com sessão preservada e executa logout seguro com limpeza completa de dados privados.
  - **Sistema de Mocks / API:** Responde às requisições REST de autenticação (`/api/auth/*`) e catálogo (`/api/nfts`), validando tokens JWT simulados, regras de expiração, conflitos de cadastro e metadados de paginação.
  - **Avaliador e Mecanismo de Testes (Playwright):** Valida os fluxos E2E de autenticação, proteção e redirecionamento de rotas, navegação por histórico/search params e renderização responsiva nos viewports de 1440px (desktop), 768px (tablet) e 390px (mobile).

---

## 2. Requisitos Funcionais (RF)

### 2.1. Sessão, Autenticação e Rotas Protegidas (`sessao-auth` - Item 03)

- **RF-01 (Tela e Formulário de Login - `/login`):**
  - O sistema deve apresentar um card centralizado em desktop (~460px de largura sobre fundo `Color/Ink`) e tela dedicada em mobile contendo os campos **E-mail** e **Senha**.
  - O formulário deve validar localmente o preenchimento obrigatório e o formato de e-mail antes da submissão.
  - A ação de submissão ("Entrar") deve disparar autenticação via `POST /api/auth/login`. Em caso de sucesso, o token JWT simulado e os dados do usuário devem ser persistidos no estado da aplicação.
  - O formulário deve oferecer link de navegação para a tela de cadastro (`/cadastro`) e link de ação para recuperação de senha com feedback amigável no ambiente simulado.
- **RF-02 (Tela e Formulário de Cadastro - `/cadastro`):**
  - O sistema deve apresentar formulário de registro contendo os campos: **Nome completo**, **E-mail**, **Senha** e **Confirmação de senha**.
  - O formulário deve validar que a senha possui no mínimo 8 caracteres, contém letras e números, e que a confirmação é idêntica à senha informada.
  - A submissão ("Criar conta") deve disparar `POST /api/auth/register`. Em caso de sucesso, o usuário é automaticamente autenticado e direcionado para a rota pretendida ou para a Home.
  - Conflito de e-mail já existente (HTTP 409 da API) deve ser exibido diretamente associado ao campo de e-mail (conforme EC-08 da spec base).
- **RF-03 (Persistência e Revalidação de Sessão):**
  - O token de autenticação e as informações básicas da sessão devem sobreviver ao refresh da página (`localStorage`), respeitando o isolamento por usuário (conforme RN-13).
  - Ao carregar a aplicação, caso exista um token armazenado, o sistema deve validar a sessão em segundo plano via `GET /api/auth/me`. Se válido, hidrata o perfil; se inválido ou expirado, limpa a sessão local de forma graciosa.
- **RF-04 (Expiração de Sessão no Cliente e no Servidor):**
  - A sessão deve armazenar o timestamp de expiração (`exp` do JWT simulado). Uma função unificada de verificação temporal deve inspecionar a validade do token (conforme RN-16 da spec base).
  - Quando a API simulada retornar HTTP 401 por token expirado ou quando a inspeção local detectar expiração durante o uso, a aplicação deve encerrar a sessão ativa e redirecionar o usuário para o login informando o motivo.
- **RF-05 (Proteção de Rotas e Retorno ao Fluxo Anterior):**
  - As rotas restritas (`/perfil`, `/carteiras`, `/pagamento`) devem ser protegidas pelo TanStack Router.
  - Tentativas de acesso direto por visitantes não autenticados devem redirecionar para `/login?redirect=[rota_pretendida]`.
  - Após login ou cadastro bem-sucedido, o usuário deve ser redirecionado automaticamente para a URL indicada em `redirect`. Se não houver parâmetro `redirect`, o redirecionamento padrão deve ser para a página inicial (`/`).
- **RF-06 (Logout e Limpeza Estrita de Dados):**
  - O sistema deve disponibilizar a ação de "Sair" (Logout) acessível no menu de usuário do Header.
  - Ao acionar logout, a aplicação deve invocar `POST /api/auth/logout`, remover credenciais e tokens locais, limpar todo o cache privado do TanStack Query (`queryClient.clear()` ou invalidação seletiva de chaves de usuário) e desconectar subscriptions ativas do Socket.IO (conforme RN-06 e RN-22).
- **RF-07 (Estado Autenticado no Cabeçalho - Header):**
  - **Visitante (Deslogado):** O Header deve exibir o botão de ação "Entrar" estilizado conforme o Figma (com fundo `Color/Primary`, texto contrastante `Color/Ink` e ícone de login).
  - **Colecionador (Logado):** O botão "Entrar" deve ser substituído pelo componente de perfil do usuário, exibindo avatar (ou fallback com iniciais do nome), nome abreviado e menu dropdown com links diretos para "Meu Perfil" (`/perfil`), "Minhas Carteiras" (`/carteiras`) e a opção "Sair" (Logout).

---

### 2.2. Descoberta, Início e Catálogo de NFTs (`catalogo-inicio` - Item 04)

- **RF-08 (Hero Banner e Destaque Principal):**
  - A página inicial (`/`) deve conter a seção Hero com título de grande impacto (`Display/43 Bold`), subtítulo institucional da Kurio ("Bem-vindo à Kurio"), descrição e botão de ação primária "EXPLORAR" com rolagem suave até a grade do catálogo.
  - O Hero deve apresentar em destaque o card do NFT principal da coleção com imagem de proporções fixas (evitando CLS), título, criador, valor atual em ETH e link direto para visualização de detalhes (`/nft/:id`).
- **RF-09 (Barra de Descoberta, Busca e Filtros Combináveis):**
  - O sistema deve fornecer uma barra de ferramentas e painel de filtros contendo:
    1. **Busca Textual:** Campo de entrada com ícone de lupa para pesquisa por título do NFT ou nome da coleção, com debounce de digitação (350ms).
    2. **Filtro por Categorias (Abas):** Seleção entre "Todos os NFTs", "Arte", "Colecionáveis", "Música" e "Fotografia".
    3. **Filtro por Status de Disponibilidade:** Seleção entre "À venda" (`on_sale`), "Últimas edições" (`last_editions`) e "Esgotado" (`sold_out`).
    4. **Filtro por Faixa de Preço (ETH):** Entradas numéricas ou slider para definição de preço mínimo (`priceMin`) e preço máximo (`priceMax`) em ETH.
    5. **Ordenação (Sort Dropdown):** Opções de ordenação por "Mais recentes" (`recent`), "Menor preço" (`price_asc`), "Maior preço" (`price_desc`) e "Mais populares" (`popular`).
- **RF-10 (Sincronização Bidirecional com a URL - Search Params):**
  - Todos os parâmetros de busca, filtros, ordenação e página ativa devem viver estritamente na URL como search params do TanStack Router (`?search=...&category=...&status=...&priceMin=...&priceMax=...&sort=...&page=...`) (conforme RF-02 da spec base).
  - Recarregar a página (F5), compartilhar a URL ou navegar pelos botões "Voltar" e "Avançar" do navegador deve restaurar exatamente a visualização, os filtros e a página correspondentes.
  - Qualquer alteração em filtros ou no termo de busca deve reiniciar automaticamente a paginação para a página 1 (conforme EC-01).
- **RF-11 (Grid Responsivo de Cards de NFT):**
  - A listagem de NFTs deve ser renderizada em grid responsivo (3 a 4 colunas em desktop 1440px, 2 colunas em tablet 768px e 1 coluna em mobile 390px).
  - Cada card de NFT deve conter:
    - Imagem do NFT com proporção reservada (`aspect-square`), cantos arredondados fiéis ao Figma (`borderRadius: 13px-15px`) e carregamento otimizado.
    - Tag/Badge com categoria ou indicador de status.
    - Nome do NFT e coleção.
    - Preço em ETH exibido obrigatoriamente como string decimal com precisão (ex: `"0.45 ETH"`, `"1.20 ETH"`).
    - Tiragem de edições disponíveis e total (ex: `"49/50 edições"`).
    - Ação de clique levando à tela de detalhes (`/nft/:id`).
- **RF-12 (Paginação Determinística):**
  - A barra inferior do catálogo deve renderizar controles de paginação baseados nos metadados retornados pela API (`PaginationMeta`): botões "Anterior", números de página e botão "Próximo".
  - A página ativa deve ser visualmente destacada com preenchimento `Color/Primary` e texto `Color/Ink`.
  - Botões inativos (ex: "Anterior" na página 1 ou "Próximo" na última página) devem estar desabilitados com indicação acessível (`aria-disabled="true"`).
- **RF-13 (Estados de Carregamento - Skeletons com Shimmer):**
  - Durante o carregamento inicial da listagem ou na troca de filtros/páginas, o sistema deve exibir cards de esqueleto (Skeletons) com efeito de pulso/shimmer (conforme RF-21 da spec base).
  - A estrutura dos skeletons deve replicar a volumetria exata dos cards reais (área da imagem, linhas de texto e preços), garantindo Cumulative Layout Shift igual a zero (CLS = 0).
- **RF-14 (Estado de Catálogo Vazio - Empty State):**
  - Quando a combinação de filtros ou busca resultar em zero NFTs (ou sob ativação do cenário `empty-catalog`), o sistema deve exibir uma área visual temática de catálogo vazio.
  - A mensagem deve informar com clareza a ausência de resultados e oferecer um botão CTA "Limpar Filtros" que restaura os filtros para o padrão da aplicação.
- **RF-15 (Tratamento de Falha e Erro no Catálogo):**
  - Se a requisição de NFTs falhar (ex: cenários `transient-errors` ou `network-failure`), a interface deve exibir um card amigável de erro informando a falha de conexão e fornecendo um botão "Tentar Novamente" com retry manual acessível.
- **RF-16 (Atualização em Segundo Plano - Background Refetching):**
  - Durante revalidações em segundo plano (quando dados anteriores já existem em cache), a interface deve manter a lista atual visível sem desmontar componentes ou exibir skeletons agressivos, apresentando apenas um indicador sutil e não intrusivo de sincronização.
- **RF-17 (Seções Complementares da Home):**
  - A Home deve exibir as seções estáticas/editoriais previstas no layout do Figma:
    - Cards promocionais de destaque ("Cunhe sua Coleção", "Benefícios GreenMint") com CTAs visuais.
    - Seção editorial/blog ("Diário da Cunhagem") com cards de artigos informativos com links coerentes sem simular falsos fluxos de negócio (conforme RN-12).

---

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### 3.1. Regras de Negócio

- **RN-01 (Valores em ETH como String Decimal):** Todos os valores monetários em ETH exibidos no catálogo, Hero e cards devem ser manipulados e apresentados como strings decimais exatas (ex: `"0.45"`, nunca float `0.4500000001`), preservando a precisão visual definida em RN-01 da spec base.
- **RN-02 (Zero Mocks Embutidos na Interface):** Nenhum componente de tela, hook ou utilitário pode conter dados falsos chumbados (hardcoded). Toda a comunicação deve passar estritamente pelo cliente `apiClient` e TanStack Query consumindo a camada MSW já implementada (conforme RN-03 e RN-20).
- **RN-03 (Isolamento Estrito de Cache por Usuário):** As query keys do TanStack Query devem ser compostas com identificadores seguros: consultas públicas de catálogo utilizam os search params como chave (`['nfts', queryParams]`); consultas privadas de usuário utilizam o ID do usuário autenticado (`['user', userId, ...]`), garantindo que dados de uma sessão nunca vazem para outra (conforme RN-06, RN-14d e RN-21).
- **RN-04 (Credenciais e Senhas Não Armazenadas em Claro):** Em conformidade com RN-07 da spec base, nenhuma senha em texto claro é armazenada no `localStorage` ou trafegada fora do payload HTTPS/REST simulado.
- **RN-05 (Prevenção de Respostas Fora de Ordem e Obsoletas):** Quando o usuário digita no campo de busca ou alterna filtros rapidamente, o TanStack Query deve cancelar requisições anteriores em andamento (`AbortSignal`). Respostas lentas ou fora de ordem recebidas da rede nunca devem sobrescrever os resultados dos filtros atuais ativos (conforme EC-01 e EC-14).
- **RN-06 (Adaptação Responsiva Estrita - 390px, 768px e 1440px):**
  - **Desktop (1440px):** Container de 1200px centralizado, Hero em 2 colunas, sidebar de filtros fixa à esquerda (310px) e grid de catálogo à direita em 3 colunas.
  - **Tablet (768px):** Mobile expandido fluido (conforme RN-19), Hero adaptado e barra superior de filtros com acionador de Drawer lateral.
  - **Mobile (390px - 414px):** Layout vertical fluido, navegação em Drawer, filtros de busca em Sheet lateral deslizante e grid de catálogo em 1 coluna (ou 2 colunas compactas), com área de toque mínima de 44x44px em todos os controles e zero overflow horizontal (conforme CA-05 e RN-F06).
- **RN-07 (Acessibilidade WCAG AA/AAA):** Todos os campos de formulário devem possuir elementos `<label>` nativos ou programaticamente vinculados, mensagens de erro associadas via `aria-describedby` e `aria-invalid="true"`, foco gerenciado para o primeiro campo com erro na submissão e skeletons demarcados com `aria-busy="true"` (conforme CA-06).
- **RN-08 (Respeito a `prefers-reduced-motion`):** As animações de shimmer dos skeletons, transições de gavetas e rolagem do botão "EXPLORAR" devem ser desativadas ou simplificadas quando o usuário tiver a preferência de redução de movimento ativa (conforme EC-12).

---

### 3.2. Casos de Borda & Tratamento de Erros

- **EC-01 (Conflito no Cadastro - E-mail Já Cadastrado):**
  - Ao submeter o formulário de cadastro com um e-mail já existente (ex: `alice@greenmint.io`), a API responde com HTTP 409 (`CONFLICT`).
  - O sistema deve manter todos os campos preenchidos, focar automaticamente o campo de e-mail e exibir mensagem de erro destacada: *"Este e-mail já está cadastrado no GreenMint."* (conforme EC-08).
- **EC-02 (Credenciais Incorretas no Login):**
  - Ao submeter e-mail inexistente ou senha incorreta (HTTP 401), exibir mensagem amigável no topo do card de login: *"E-mail ou senha incorretos. Verifique suas credenciais."*
  - O campo de senha deve ser limpo e focado, enquanto o e-mail digitado permanece preservado.
- **EC-03 (Validação Síncrona Preventiva):**
  - Botões de envio em Login e Cadastro não devem disparar chamadas de rede se houver erros de validação síncrona (e-mail mal formatado, campos vazios ou senhas divergentes), sinalizando visualmente os campos faltantes.
- **EC-04 (Prevenção de Cliques Múltiplos - Double Submit):**
  - Enquanto a mutação de login ou cadastro estiver em trânsito (`isPending`), o botão de ação deve permanecer desabilitado com indicador visual de carregamento acessível (ex: spinner e texto *"Acessando..."* / *"Criando conta..."*), impedindo requisições concorrentes (conforme EC-10).
- **EC-05 (Sessão Expirada com Retenção de Contexto):**
  - Se o token do colecionador expirar durante a navegação, a próxima requisição privada resultará em HTTP 401.
  - A aplicação deve limpar o token inválido, salvar a rota atual e redirecionar para `/login?redirect=[rota_atual]&reason=expired`, exibindo aviso: *"Sua sessão expirou. Por favor, faça login novamente para continuar."* (conforme EC-04).
- **EC-06 (Filtros sem Resultados Combinados):**
  - Se a combinação de múltiplos filtros (ex: categoria "Música" + preço entre 10 e 12 ETH + status "Esgotado") retornar zero registros, a página não deve quebrar: deve apresentar o estado vazio amigável com botão funcional para resetar os filtros ativos.
- **EC-07 (Busca Textual com Espaços e Caracteres Especiais):**
  - Termos de busca devem sofrer `trim()` antes de serem aplicados à URL e à consulta, evitando requisições desnecessárias por espaços vazios.
- **EC-08 (Troca de Filtro em Páginas Avançadas):**
  - Se o usuário estiver na página 4 do catálogo e aplicar um filtro que reduza o resultado total para 1 página, o sistema deve resetar imediatamente para `page=1`, prevenindo visualização de lista vazia artificial (conforme EC-01).
- **EC-09 (Falha Temporária da API no Catálogo):**
  - Se a requisição `GET /api/nfts` falhar (HTTP 500/503 ou offline), exibir o card de erro com o botão "Tentar Novamente". Ao clicar em "Tentar Novamente", o TanStack Query dispara refetch manual sem recarregar o navegador.

---

## 4. Critérios de Aceite (Definition of Done)

- [x] **CA-01 (Fluxo Completo de Autenticação):** Visitante consegue criar uma nova conta em `/cadastro`, fazer login em `/login` com credenciais fictícias válidas (ex: Alice Vance) e efetuar logout pelo menu do Header, com token persistido em `localStorage` e recuperado após refresh.
- [x] **CA-02 (Proteção de Rotas e Retorno ao Fluxo):** Acesso a rotas restritas (`/perfil`, `/carteiras`, `/pagamento`) sem login redireciona para `/login?redirect=...`. Ao autenticar com sucesso, o colecionador é redirecionado imediatamente para a rota que tentou acessar.
- [x] **CA-03 (Validação e Mensagens de Erro na Auth):** Tentativa de cadastro com e-mail existente exibe erro HTTP 409 associado ao campo de e-mail; login incorreto exibe alerta de erro 401; botões de ação ficam desabilitados durante o envio com feedback acessível.
- [x] **CA-04 (Isolamento de Sessão e Limpeza de Cache):** Ação de logout remove o token local, invalida o cache privado do TanStack Query e restaura o estado de visitante no Header, impedindo vazamento de dados entre usuários diferentes.
- [x] **CA-05 (Descoberta e Catálogo Sincronizado na URL):** A página inicial (`/`) lista os NFTs mockados; termos de busca (com debounce), filtros de categoria, status, faixa de preço, ordenação e paginação vivem sincronizados nos search params da URL e sobrevivem ao refresh e ao histórico do navegador (botões voltar/avançar).
- [x] **CA-06 (Skeletons com Shimmer sem Layout Shift):** Carregamento do catálogo renderiza skeletons com shimmer mantendo as dimensões exatas dos cards reais de NFT, registrando Cumulative Layout Shift zero (CLS = 0).
- [x] **CA-07 (Estados de Vazio e Erro):** Combinações de filtros sem resultados ou cenário `empty-catalog` exibem Empty State com botão funcional "Limpar Filtros"; cenários de falha (`transient-errors` ou `network-failure`) exibem mensagem amigável e botão de retry.
- [x] **CA-08 (Fidelidade Visual e Responsividade):** Telas de Início, Login e Cadastro fiéis aos tokens do Figma, tipografia `Roboto Mono` e espaçamentos em 1440px (desktop), 768px (tablet) e 390px (mobile), sem transbordamento horizontal.
- [x] **CA-09 (Acessibilidade WCAG):** Formulários com rótulos vinculados, foco acessível nos campos com erro, navegação por teclado e conformidade com `prefers-reduced-motion`.
- [x] **CA-10 (Testes Automatizados Playwright):** Suíte de testes E2E executável cobrindo: login com sucesso, login com credenciais inválidas, cadastro com conflito 409, proteção de rota e redirecionamento, busca com debounce e filtros combinados na URL, e paginação no catálogo.

---

## 5. Perguntas Adicionais / Pontos em Aberto

- **Preservação e Merge de Carrinho de Visitante:**  
  *Contexto:* Conforme definido na Decisão 4 da spec de mocks, itens adicionados ao carrinho pelo visitante devem ser mesclados com o carrinho do usuário após o login. Esta spec foca no fluxo de autenticação e retorno de rota; o acionamento explícito da rotina de merge (`mergeGuestCartIntoUserCart`) deve ser integrado quando a spec de carrinho (`carrinho` - Item 06) for executada ou já na finalização do login?  

  *(Recomendação: O hook de autenticação já deve acionar o merge silencioso de carrinho no sucesso do login).*

R: Pode acionar o merge de forma silenciosa no login.

- **Abertura de Filtros no Mobile:**  
  *Contexto:* No frame Desktop do Figma, a sidebar de filtros é visível à esquerda com 310px. No Mobile (390px/414px), não há espaço horizontal suficiente.  
  *(Recomendação: Os filtros no mobile devem ser abertos através de um botão "Filtros" que dispara um Drawer/Sheet lateral deslizante inferior ou lateral com o mesmo conteúdo da sidebar).*
R: Sim, o figma na verdade já possui um botão de filtros, é possível ver com mais detalhes no link do frame específico abaixo: 

https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=14-5226&t=o8lPqR2TAXx9PfsU-4

- **Comportamento de "Esqueceu sua Senha":**  
  *Contexto:* O layout do Figma exibe o link "Esqueceu sua senha?". Como o sistema opera com ambiente 100% simulado sem envio de e-mails reais, qual  deve ser a resposta da interface ao clicar no link?  
  *(Recomendação: Exibir um Dialog ou Toast informativo contextualizando que em ambiente simulado de avaliação as credenciais de teste são pré-definidas, informando as senhas padrão de Alice e Bob).*
R: pode fazer de forma 100% simulada com Dialog.
