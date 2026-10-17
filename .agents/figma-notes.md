# Notas de Inspeção do Figma (GreenMint NFT Marketplace)

Arquivo Figma: `https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge`
Página: `Marketplace de NFTs GreenMint` (`0:1`)

## Estrutura Geral Identificada

- **Desktop (9 frames)**: Largura padrão de 1440px, padding horizontal de 120px, gap de 96px entre seções principais, background `Color/Ink` (#140D0A).
  1. Desktop / Início (`2:2`)
  2. Desktop / Detalhes do NFT (`10:244`)
  3. Desktop / Carrinho de NFTs (`11:1278`)
  4. Desktop / Pagamento (`11:2862`)
  5. Desktop / Confirmação de Pedido (`11:4385`)
  6. Desktop / Login (`9:115`)
  7. Desktop / Cadastro (`9:1022`)
  8. Desktop / Perfil do Colecionador (`9:1238`)
  9. Desktop / Carteiras (`9:1670`)

- **Mobile (6 frames)**: Largura de 414px (artboard padrão Figma de 414x896 com borderRadius de 40px), background `Color/Ink` (#140D0A).
  1. Mobile / Início (`14:5226`)
  2. Mobile / Detalhes do NFT (`15:5536`)
  3. Mobile / Carrinho de NFTs (`16:360`)
  4. Mobile / Pagamento (`16:748`)
  5. Mobile / Login (`16:1022`)
  6. Mobile / Cadastro (`16:1228`)

---

### 1. Desktop / Início (`2:2`)

- **Dimensões e Layout**:
  - Largura: 1440px (fixa), Altura: hug (dinâmica).
  - Padding externo: 24px topo/base, 120px esquerda/direita (Container central de 1200px).
  - Gap entre seções principais: 96px.
  - Background (Fill): `Color/Ink` (#140D0A).
- **Cores Identificadas**:
  - `Color/Ink`: `#140D0A` (fundo geral e texto contrastante em botões primários).
  - `Color/Foreground`: `#F5F1EB` (texto principal, títulos, bordas sutis).
  - `Color/Primary`: `#D28A4C` (botões de ação, badges, indicador ativo de abas, destaques de borda).
  - `Text/Accent`: `#E89B55` (preços de NFTs, link de aba ativa, textos de destaque).
  - `Text/Secondary`: `#CFB28C` (subtítulos, descrições secundárias, contadores de coleção).
  - `Color/Secondary`: `#B39463` (preço riscado/antigo em promoções, textos secundários).
  - `Color/Surface Card`: `#241612` (fundo de cards de produto, sidebar de filtros, footer).
  - `Color/Surface Dark`: `#38220F` (fundo do input da newsletter, seção inferior do footer, caixas de carteiras).
  - `Color/Border`: `#3F2319` (bordas de paginação e divisórias de cards).
  - `Color/Border Soft`: `#55321F` (bordas de inputs e caixas de destaque).
  - Gradiente linear 1: `linear-gradient(145deg, rgba(210, 138, 76, 0.3) 0%, rgba(210, 138, 76, 0) 100%)`.
  - Gradiente linear 2: `linear-gradient(180deg, rgba(210, 138, 76, 0.1) 0%, rgba(210, 138, 76, 0.03) 100%)`.
- **Tipografia (Roboto Mono em 100% dos textos)**:
  - `Display/43 Bold`: 43px, line-height 70px, Bold (700) (Hero title: "SEJA DONO DO FUTURO...").
  - `Heading/24 Bold`: 24px, Bold (700) (Títulos de seções, blog e cards do footer).
  - `Body Large/18 Bold · lh 16`: 18px, lh 16px, Bold (700) (Títulos de cards, colunas do footer, botões de ação).
  - `Body Large/18 Bold · lh 24`: 18px, lh 24px, Bold (700) (Cards promocionais).
  - `Body Large/18 Regular`: 18px, lh 16px, Regular (400) (Preço riscado/antigo).
  - `Body Large/17 Bold`: 17px, lh 16px, Bold (700) (Itens de destaque do footer).
  - `Body Large/16 Bold · lh auto`: 16px, Bold (700) (Item ativo de navegação: "Início", títulos do blog).
  - `Body Large/16 Medium · lh auto`: 16px, Medium (500) (Texto do botão "Entrar").
  - `Body Large/16 Regular · lh auto`: 16px, Regular (400) (Links de navegação inativos: "Mercado", "Criadores", "Aprenda").
  - `Body Large/16 Regular · lh 16`: 16px, lh 16px, Regular (400) (Nomes dos NFTs nos cards).
  - `Body Large/16 Bold · lh 20`: 16px, lh 20px, Bold (700) (Botão "EXPLORAR", botão "Aplicar").
  - `Body/15 Medium`: 15px, Medium (500) (Abas do catálogo: "Todos os NFTs", "Novos lançamentos", "Em alta").
  - `Body/15 Regular · lh 40`: 15px, lh 40px, Regular (400) (Itens da lista de filtros).
  - `Body/15 Bold · lh 40`: 15px, lh 40px, Bold (700) (Contadores dos filtros: "(33)").
  - `Body/15 Regular · lh 16`: 15px, lh 16px, Regular (400) (Label do sort, texto do slider).
  - `Body/14 Bold · lh auto`: 14px, Bold (700), letter-spacing 0.1em (Logo "KURIO").
  - `Body/14 Medium · lh 16`: 14px, lh 16px, Medium (500), letter-spacing 0.1em (Subtítulo hero "Bem-vindo à Kurio").
  - `Body/14 Regular · lh 24`: 14px, lh 24px, Regular (400) (Descrições do hero e promoções).
  - `Body/14 Regular · lh 22`: 14px, lh 22px, Regular (400) (Descrições do footer e contatos).
  - `Body/14 Regular · lh 30`: 14px, lh 30px, Regular (400) (Listas verticais de links no footer e copyright).
  - `Body/14 Regular · lh 16`: 14px, lh 16px, Regular (400) (Placeholder do input de newsletter).
  - `Caption/13 Regular · lh 22`: 13px, lh 22px, Regular (400) (Nota da newsletter).
  - `Caption/12 Bold`: 12px, lh 14px, Bold (700).
  - `Tiny/10 Medium`: 10px, Medium (500) (Contador de itens do carrinho no badge).
  - `Tiny/9 Bold`: 9px, Bold (700), letter-spacing 0.0111em (Carteiras compatíveis).
- **Componentes Identificados**:
  - `Header With Divider` (`70504:3017`) / `Header Row` (`70486:560`):
    - Largura: 1200px.
    - Logo KURIO (14px Bold com tracking).
    - Nav links: "Início", "Mercado", "Criadores", "Aprenda" com gap 40px.
    - Active indicator: linha `strokes: Color/Primary` com `strokeWeight: 3px`.
    - Search Icon (20x20).
    - Cart button com badge (Badge: círculo 16x16 `Color/Primary`, borda 2px `Color/Ink`, texto 10px Medium).
    - Login button: 100x35px, background `Color/Primary`, borderRadius 6px, ícone logout 20x20, texto "Entrar".
    - Hairline divider: linha inferior `strokes: Color/Primary`, strokeWeight 0.3px.
  - `Hero Banner`:
    - Dimensões 1200x450px.
    - Imagem do NFT em destaque: 450x450px, borderRadius 24px.
    - Botão "EXPLORAR": 140x40px, borderRadius 6px, background `Color/Primary`.
  - `Sidebar de Filtros` (`Filters` `70485:381`):
    - Largura fixa 310px, padding 20px, background `Color/Surface Card`.
    - Acordeões/Grupos: Coleções, Faixa de preço (slider + botão "Aplicar" 8px 12px r:6px), Rede.
  - `Banner NFT em Destaque`:
    - 310x470px, background com gradiente sutil. Imagem interna com borderRadius 22px.
  - `Product Grid & Toolbar`:
    - Abas: "Todos os NFTs", "Novos lançamentos", "Em alta".
    - Dropdown / Sort: "Ordenar por: Listados recentemente" com linha sublinhada primária e ícone de seta.
    - Grid de NFTs: colunas com gap 72px / cards de 250px a 258px de largura, imagens com borderRadius 13px a 15px.
    - Paginação: botões quadrados 35x35px com borderRadius 4px. Página ativa com fill `Color/Primary` e texto `Color/Ink`; inativas com texto `Color/Foreground`; seta próxima com borda `Color/Border`.
  - `Cards Promocionais`:
    - Dois cards lado a lado com largura ~586px cada, borderRadius 17px/18px.
    - Botão CTA com seta curva Iconly.
  - `Blog / Diário da Cunhagem`:
    - Título centralizado 28px Bold.
    - 4 cards lado a lado (gap 24px), cada um com imagem de altura 195px, data/tempo de leitura, título 16px Bold, resumo e link CTA.
  - `Footer` (`70491:1286`):
    - Três blocos principais empilhados:
      1. Bloco de destaques/benefícios + newsletter (32px padding, background `Color/Surface Card`, input 40px altura com botão "Enviar" embutido).
      2. Linha de contato/marca (88px altura, background `Color/Surface Dark`, email, telefone).
      3. Colunas de links e redes sociais (236px altura, background `Color/Surface Card`, colunas "Meu perfil", "Central de ajuda", "Coleções", ícones de redes sociais 30x30px com borda primária, badge de carteiras compatíveis e copyright).

---

### 2. Desktop / Detalhes do NFT (`10:244`)

- **Dimensões e Layout**:
  - Largura: 1440px (fixa), Altura: hug.
  - Padding: 24px 120px (container 1200px). Gap entre seções: 96px. Fundo: `Color/Ink` (#140D0A).
- **Cores & Tokens Específicos Identificados**:
  - `Color/Surface Raised`: `#2F1D15` (fundo do botão circular de zoom/ação sobre a imagem do NFT).
  - Linhas divisórias ultrafinas: `Color/Primary` com `strokeWeight: 0.3px`.
- **Tipografia Específica**:
  - `Heading/28 Bold`: 28px, Bold (700) (Nome principal do NFT).
  - `Title/22 Bold`: 22px, Bold (700) (Preço principal do NFT: "1.19 ETH").
  - `Title/20 Regular · lh 10`: 20px, lh 28px, Regular (400) (Número de quantidade no seletor).
  - `Body Large/17 Bold`: 17px, lh 16px, Bold (700) (Abas de conteúdo e títulos de seção).
  - `Body Large/17 Regular · lh 16`: 17px, lh 16px, Regular (400) (Aba inativa de avaliações).
  - `Body/14 Bold · lh 20`: 14px, lh 20px, Bold (700) (Texto do botão "COMPRAR").
  - `Body/14 Medium · lh 20`: 14px, lh 20px, Medium (500) (Texto do botão "Favoritar").
  - `Body/14 Bold · lh 24`: 14px, lh 24px, Bold (700) (Labels de metadados técnicos: "Rede:", "Contrato:", "Direitos autorais:").
- **Componentes Identificados**:
  - `Header Row` com variante `Active=Market` (Item "Mercado" ativo com indicador inferior).
  - `Breadcrumb`: "Início / Mercado" (`Body/15 Bold · lh 16`).
  - `Galeria do Produto`:
    - Thumbnails: 4 miniaturas verticais de 100x100px (r:6px). Miniatura ativa com borda 1px `Color/Primary` e r:8px.
    - Imagem Principal: Container 444x444px (`Color/Surface Card`, r:6px), arte interna 404x404px (r:24px).
    - Botão de Zoom/Ação: Botão circular flutuante de 30x30px (`Color/Surface Raised`, borda 1px `Color/Border`).
  - `Painel de Compra & Ações`:
    - Preço + Rating (5 estrelas Iconly Bold + texto com contagem de avaliações).
    - Seletor de Edição: badges ovais pílula (`1/1`, `1/10`, `1/50`, `ABERTA`). Edição selecionada com borda 1px `Color/Primary` e texto `Text/Accent`; não selecionadas com borda `Color/Border` e texto `Text/Secondary`.
    - Seletor de Quantidade: Botões de incremento e decremento com ícone, número centralizado.
    - Botão "COMPRAR": 130x40px, sólido `Color/Primary`, texto `Color/Ink`, r:6px.
    - Botão "Favoritar": 130x40px, outline borda 1px `Color/Primary`, ícone de coração, texto `Text/Accent`, r:6px.
    - Metadados do Token: ID do token, Coleção, Atributos em `Color/Secondary`.
    - Compartilhar: Ícones de redes sociais (Linkedin, Mensagem, Twitter).
  - `Seção de Abas & Descrição`:
    - Abas: "Detalhes do NFT" (ativa) e "Avaliações de colecionadores (19)".
    - Descrição longa com detalhes de procedência, rede, contrato e royalties.
  - `Carrossel "Mais desta coleção"`:
    - Heading 17px Bold com linha primária.
    - Grid/Carrossel de cards relacionados (219px a 220px) e indicadores de carousel dots (dot ativo `Color/Primary`).

---

### 3. Desktop / Carrinho de NFTs (`11:1278`)

- **Dimensões e Layout**:
  - Largura: 1440px (fixa), Altura: hug. Padding: 24px 120px (container 1200px).
  - Background: `Color/Ink` (#140D0A). Gap entre seções: 96px.
  - Composição em 2 colunas: Lista de itens do carrinho (largura ~782px) + Resumo da carteira (largura 332px).
- **Cores & Tokens Identificados**:
  - `Color/Border`: `#3F2319` (divisórias e bordas sutis).
  - Raio de borda específico nos botões do carrinho/checkout: `borderRadius: 3px` (ex: botão "Aplicar", input de cupom e botão "Conectar e finalizar").
- **Tipografia Específica**:
  - `Body Large/17 Regular · lh 10`: 17px, lh 24px, Regular (400) (Número de quantidade no carrinho).
  - `Caption/12 Regular · lh 16`: 12px, lh 16px, Regular (400) (Placeholder cupom e label "Taxa estimada").
  - `Body/15 Bold · lh 16`: 15px, lh 16px, Bold (700) (Botão "Aplicar", "Conectar e finalizar", breadcrumb).
- **Componentes Identificados**:
  - `Header Row` (`Active=Market`).
  - `Breadcrumb`: "Início / Mercado / Carrinho".
  - `Tabela de Carrinho` (`Cart Table`):
    - Cabeçalho: "NFTs" (250px), "Preço" (77px), "Edições" (75px), "Total" (87px), ação Delete (24px).
    - Linha do Item: Altura 70px, background `Color/Surface Card`.
    - Thumbnail: 70x70px com `borderRadius: 6px`.
    - Metadados: Nome 16px Bold + ID do token 14px Regular (`Color/Secondary`).
    - Preço Unitário: 16px Bold (`Text/Secondary`).
    - Seletor de Quantidade: Botões [-] e [+] com valor centralizado.
    - Total do Item: 16px Bold (`Text/Accent`).
    - Ação de Remoção: Ícone `Iconly/Curved/Delete`.
  - `Resumo da Carteira` (`Wallet Summary`, 332px):
    - Título: "Resumo da carteira" (18px Bold) com linha divisória primária.
    - Bloco Cupom: Input com altura 40px, borda 1px `Color/Primary`, r:3px. Botão "Aplicar" integrado (102x40px, fill `Color/Primary`, texto `Color/Ink`).
    - Valores: Subtotal, Desconto do lançamento `(-) 00.00`, Taxa de rede + "Taxa estimada" (12px Accent).
    - Total: 16px Bold label + 18px Bold valor em `Text/Accent`.
    - Botão CTA: "Conectar e finalizar" (40px altura, 100% largura, fill `Color/Primary`, r:3px, texto 15px Bold).
    - Link: "Continuar explorando" (15px Regular `Text/Accent`).
  - `Seção "Colecionadores também viram"`:
    - Heading 17px Bold com linha primária e cards de produtos relacionados.

---

### 4. Desktop / Pagamento (`11:2862`)

- **Dimensões e Layout**:
  - Largura: 1440px (fixa), Altura: hug. Padding: 24px 120px (container 1200px). Fundo: `Color/Ink` (#140D0A).
  - Estrutura em 2 colunas: Formulário do Colecionador (~760px) + Seus NFTs / Revisão e Pagamento (405px).
- **Cores & Tokens Identificados**:
  - `Text/Coral`: `#F0805F` (cor de aviso/asterisco obrigatório em formulários).
  - Raio de borda dos inputs: `borderRadius: 3px` nos inputs e selects de dados; `borderRadius: 8px` no botão final "Confirmar compra".
- **Tipografia Específica**:
  - `Body/15 Regular · lh 15`: 15px, lh 15px, Regular (400) (Labels dos inputs: "Nome de exibição", "Rede", "Endereço da carteira", "E-mail", etc.).
  - `Body/14 Regular · lh 15`: 14px, lh 15px, Regular (400) (Placeholders de inputs e selects).
  - `Title/22 Regular`: 22px, lh 29px, Regular (400) (Valores e títulos em destaque).
- **Componentes Identificados**:
  - `Header Row` (`Active=Market`).
  - `Breadcrumb`: "Início / Mercado / Pagamento".
  - `Formulário de Coleta de Dados do Colecionador`:
    - Grid de 2 colunas de campos de formulário (inputs de altura 40px, borda 1px `Color/Border`, r:3px).
    - Campos: "Nome de exibição", "Rede" (Select dropdown com ícone de seta), "Endereço da carteira", "Tipo de carteira" (Select dropdown), "E-mail", "Nome de usuário", "Nome do perfil", "ENS ou carteira secundária (opcional)", "Código de indicação", "Nome ENS (.eth)".
    - Checkbox: "Usar outra carteira?" (círculo com borda primária 2px).
    - Textarea: "Observação do colecionador (opcional)" (altura 152px, r:3px, borda `Color/Border`).
  - `Painel de Revisão & Checkout` ("Seus NFTs", 405px):
    - Título "Seus NFTs" (17px Bold).
    - Lista de itens do recibo (cards com altura 70px, background `Color/Surface Card`, thumbnails 65-70px r:8px, Nome do NFT, Token ID, multiplicador de quantidade `(x 2)` e subtotal do item).
    - Link para código promocional: "Tem um código promocional? Aplique aqui".
    - Resumo de valores (Subtotal, Desconto do lançamento, Taxa de rede, Total em 18px Bold `Text/Accent`).
    - Bloco "Carteira e rede":
      - Seletor de carteiras estilo radio button em caixas de 45px de altura (MetaMask, Coinbase Wallet com rádio ativo preenchido `Color/Primary`).
      - Botão CTA: "Confirmar compra" (altura 45px, largura 100%, background `Color/Primary`, `borderRadius: 8px`, texto 15px Bold `Color/Ink`).

---

### 5. Desktop / Confirmação de Pedido (`11:4385`)

- **Dimensões e Layout**:
  - Largura: 1440px. Exibe a tela de pagamento em segundo plano coberta por um backdrop / overlay de confirmação (`fills: Color/Ink`).
  - Modal central: "Order Confirmation Modal", largura fixa 578px, background `Color/Surface Card`.
- **Cores & Tokens Identificados**:
  - `Color/Surface Card`: `#241612` (fundo do modal).
  - Linhas divisórias internas do modal: `Color/Primary` (1px altura / 1px largura nas divisórias verticais).
  - Borda inferior decorativa do modal: faixa sólida de 10px de altura em `Color/Primary`.
  - Raio de borda do botão do modal: `borderRadius: 5px`.
- **Tipografia Específica**:
  - `Body Large/16 Bold · lh 16`: 16px, lh 16px, Bold (700) (Mensagem de sucesso, cabeçalhos de tabela, botão "Ver no Etherscan").
  - `Body/15 Regular · lh 16`: 15px, lh 16px, Regular (400) (Valores de ID de transação, data, carteira).
  - `Body/14 Bold · lh 16`: 14px, lh 16px, Bold (700) (Labels de metadados: "ID da transação", "Data", "Total", "Carteira").
  - `Body/14 Regular · lh 22`: 14px, lh 22px, Regular (400) (Nota informativa de registro na rede).
- **Componentes Identificados**:
  - `Modal de Confirmação de Pedido` (`Order Confirmation Modal`, 578px):
    - Botão Fechar (`X` no canto superior direito).
    - Ícone de Sucesso: Gráfico 80x80px com texto "Seus NFTs agora estão na sua carteira".
    - Resumo da Transação em 4 colunas horizontais com divisórias verticais primárias:
      1. ID da transação ("0xA91F…E82C")
      2. Data ("29 Jul, 2026")
      3. Total ("26.846 ETH")
      4. Carteira ("MetaMask")
    - Tabela de Itens Comprados (Snapshot imutável do recibo):
      - Colunas: "NFTs", "Edições", "Subtotal".
      - Itens: 70px de altura, thumbnail 65-70px r:8px, Nome, ID, quantidade `(x 2)`, subtotal `Text/Accent`.
    - Resumo Financeiro: Taxa de rede + Total final.
    - Nota de Rodapé: Confirmação de transferência de custódia na Ethereum.
    - Botão CTA: "Ver no Etherscan" (padding 16px, fill `Color/Primary`, r:5px, texto 16px Bold `Color/Ink`).
    - Barra decorativa primária no rodapé (10px).

---

### 6. Desktop / Login (`9:115`)

- **Dimensões e Layout**:
  - Template: `EL-24679dc2` (Largura: 1440px, padding: `24px 120px 0px`, gap: `96px`, fill: `Color/Ink` #140D0A).
- **Cores & Tokens**:
  - `Color/Ink`: `#140D0A` (background geral da tela).
  - `Color/Surface Card`: `#241612` (card centralizado de autenticação).
  - `Color/Border`: `#3F2319` (borda dos inputs).
  - `Color/Primary`: `#D28A4C` (botão "Entrar" e foco de input).
  - `Color/Foreground`: `#F5F1EB` (labels e títulos).
  - `Text/Secondary`: `#CFB28C` (placeholders e links secundários).
- **Tipografia**:
  - `Heading/28 Bold` ou `Heading/24 Bold` no título do formulário ("Acesse sua conta").
  - `Body/15 Regular · lh 15` para labels de campo ("E-mail", "Senha").
  - `Body/14 Regular · lh 15` para placeholders.
  - `Body/15 Bold · lh 16` no botão de submissão ("Entrar").
  - `Caption/13 Regular` para o link "Esqueceu sua senha?".
- **Componentes Identificados**:
  - `Header Row` (`Active=Home` conforme especificação do componente `70486:560`).
  - Card central de Login (~460px de largura, padding 32px a 40px, borderRadius 8px a 12px).
  - Inputs (altura 40px, borderRadius 3px a 6px).
  - Botão "Entrar" (altura 40px a 45px, largura 100%, background `Color/Primary`, texto `Color/Ink`).
  - Link de alternância: "Ainda não tem conta? Criar conta" direcionando para `/cadastro`.
  - `Footer` padrão idêntico.

---

### 7. Desktop / Cadastro (`9:1022`)

- **Dimensões e Layout**:
  - Template: `EL-24679dc2` (Largura: 1440px, padding: `24px 120px 0px`, gap: `96px`, fill: `Color/Ink` #140D0A).
- **Cores & Tokens**:
  - Mesma identidade do card de autenticação do frame de Login (`Color/Surface Card` #241612 sobre `Color/Ink`).
  - `Text/Coral` (#F0805F) para indicador de campos obrigatórios e mensagens de erro.
- **Tipografia**:
  - Título 24px/28px Bold ("Crie sua conta de colecionador").
  - Labels em 15px Regular e botão de ação em 15px Bold.
- **Componentes Identificados**:
  - `Header Row` (`Active=Home`).
  - Formulário com campos: Nome completo, Nome de usuário, E-mail, Senha e Confirmação de senha.
  - Botão CTA: "Criar conta" (fill `Color/Primary`, texto `Color/Ink`).
  - Link: "Já possui uma conta? Entrar" direcionando para `/login`.
  - `Footer` padrão idêntico.

---

### 8. Desktop / Perfil do Colecionador (`9:1238`)

- **Dimensões e Layout**:
  - Template: `EL-ea8ade80` (Largura: 1440px, altura fixa base: 1080px, padding: `24px 120px`, gap: `96px`, fill: `Color/Ink` #140D0A).
- **Cores & Tokens**:
  - `Color/Surface Card`: `#241612` (container principal das configurações de perfil).
  - `Color/Border`: `#3F2319` (bordas de inputs e separadores).
  - `Color/Primary`: `#D28A4C` (botão "Salvar alterações" e anel de foco do avatar).
- **Tipografia**:
  - `Heading/28 Bold` ("Meu Perfil").
  - `Body Large/17 Bold` nos títulos de seções ("Dados pessoais", "Segurança da conta").
  - `Body/15 Regular · lh 15` para labels e inputs.
- **Componentes Identificados**:
  - `Header Row` (`Active=Home`).
  - Seção do Avatar (conforme RN-17): componente circular para foto de perfil com botão de upload ("Alterar foto") que gera preview temporário de `File` e persiste via API em PNG/JPEG.
  - Campos: Nome de exibição, E-mail (readonly ou editável com reautenticação), Bio/Descrição, Alteração de senha (senha atual, nova senha, confirmação).
  - Botão de ação: "Salvar alterações" (fill `Color/Primary`, r:6px a 8px).
  - `Footer` padrão.

---

### 9. Desktop / Carteiras (`9:1670`)

- **Dimensões e Layout**:
  - Template: `EL-ea8ade80` (Largura: 1440px, altura fixa base: 1080px, padding: `24px 120px`, gap: `96px`, fill: `Color/Ink` #140D0A).
- **Cores & Tokens**:
  - `Color/Surface Card`: `#241612` (cards de carteiras).
  - `Color/Surface Dark`: `#38220F` (tags de redes e status de conexão).
  - `Text/Accent`: `#E89B55` (destaque de endereço ativo e rede selecionada).
- **Tipografia**:
  - `Heading/28 Bold` ("Minhas Carteiras").
  - `Body Large/16 Bold` para títulos das carteiras (Carteira Principal, Carteira Secundária).
  - `Body/14 Regular` para hashes de endereços (estilo monospaçado explícito: `0x...`).
- **Componentes Identificados**:
  - `Header Row` (`Active=Home`).
  - Card da Carteira Principal (MetaMask): ícone do provider, endereço abreviado com botão de copiar, badge de rede ("Ethereum Mainnet"), saldo simulado em ETH e botão "Alterar carteira" ou "Desconectar".
  - Card da Carteira Secundária / ENS: input para vincular carteira secundária ou nome `.eth`.
  - Seletor de rede padrão: Radio group (Ethereum, Polygon, Solana).
  - `Footer` padrão.

---

### 10. Mobile / Início (`14:5226`)

- **Dimensões e Layout**:
  - Largura: 414px (viewport mobile base), Altura: 896px.
  - Padding: `40px 24px 0px`, gap: `16px`. Fundo: `Color/Ink` (#140D0A). Artboard com `borderRadius: 40px` (simulando tela de smartphone).
- **Cores & Tokens**:
  - Mantém 100% da paleta do Desktop (`Color/Ink`, `Color/Foreground`, `Color/Primary`, `Text/Accent`, `Color/Surface Card`).
- **Tipografia Adaptada**:
  - Display/Hero: Reduzido de 43px para ~28px a 32px Bold com line-height proporcional.
  - Headings: Reduzidos de 24px/28px para 20px/22px Bold.
  - Body: Mantém 14px e 15px Roboto Mono para legibilidade.
- **Componentes Identificados**:
  - `Header Mobile`:
    - Barra compacta: Logo KURIO, botão hambúrguer para Menu Drawer/Sheet, ícone de busca e ícone de carrinho com badge.
  - `Hero Mobile`:
    - Composição vertical: imagem do NFT hero empilhada abaixo do texto e do botão "EXPLORAR" (largura total 100%).
  - `Catálogo Mobile`:
    - Abas horizontais com scroll lateral ("Todos os NFTs", "Novos lançamentos", "Em alta").
    - Botão de filtro que aciona Sheet/Drawer lateral com os filtros de Coleções, Preço e Rede.
    - Grid de NFTs: cards em 1 coluna (largura 100% do container com padding 24px) ou 2 colunas compactas.
    - Paginação simplificada para mobile.
  - `Promos e Blog`:
    - Cards de blog e promoções empilhados verticalmente (1 coluna).
  - `Footer Mobile`:
    - Seções empilhadas verticalmente com links em acordeão ou lista vertical, input de newsletter 100% width com botão "Enviar".

---

### 11. Mobile / Detalhes do NFT (`15:5536`)

- **Dimensões e Layout**:
  - Largura: 414px, Altura: 896px. Gap: `-114px` (efeito de sobreposição do card de conteúdo sobre a imagem de destaque do topo).
  - Fundo: `Color/Ink` (#140D0A), borderRadius: 40px.
- **Componentes Identificados**:
  - Imagem do NFT em destaque no topo em largura total (full-width 414px).
  - Galeria de thumbnails abaixo ou carrossel horizontal de miniaturas.
  - Card de detalhes sobreposto (`gap: -114px` com `Color/Surface Card` ou fundo `Color/Ink` com cantos superiores arredondados).
  - Título 22px/24px Bold, Preço em destaque (`Text/Accent`), avaliação com estrelas.
  - Seletor de edição em pílulas compactas horizontais.
  - Barra de ações inferior (Bottom Action Bar fixa ou empilhada): Botões "COMPRAR" e "Favoritar" com altura 44-48px para toque acessível (touch target >= 44x44px).
  - Abas "Detalhes do NFT" e "Avaliações" em acordeão vertical ou abas compactas.

---

### 12. Mobile / Carrinho de NFTs (`16:360`)

- **Dimensões e Layout**:
  - Largura: 414px, Altura: 896px. Padding: `32px 0px 0px`, gap: `4px`.
  - Fundo: `Color/Ink` (#140D0A), borderRadius: 40px.
- **Componentes Identificados**:
  - Header mobile compacto com navegação e breadcrumb resumido.
  - Lista de itens do carrinho em cards verticais (layout empilhado em vez de tabela):
    - Cada item em um card `Color/Surface Card` de ~80px de altura: thumbnail 60x60px, Nome do NFT, Token ID, preço unitário, controle de quantidade [-] 1 [+] e botão de remoção (lixeira).
  - Seção de Cupom: Input + Botão "Aplicar" ocupando 100% da largura.
  - Resumo de valores (Subtotal, Taxa de rede, Total) em card fixado ou empilhado no final.
  - Botão CTA: "Conectar e finalizar" em largura total (100% w, altura 44px).

---

### 13. Mobile / Pagamento (`16:748`)

- **Dimensões e Layout**:
  - Largura: 414px, Altura: 896px. Padding: `32px 28px`.
  - Fundo: `Color/Ink` (#140D0A), borderRadius: 40px.
- **Componentes Identificados**:
  - Formulário de dados do colecionador em coluna única (inputs com largura 100% e altura 40px a 44px para facilitar o toque no mobile).
  - Seção "Seus NFTs" colapsada em Accordion ou lista compacta para economizar espaço de rolagem.
  - Seletor de Carteira em cards empilhados de 45px de altura (MetaMask, Coinbase Wallet com radio buttons acessíveis).
  - Botão CTA: "Confirmar compra" (100% largura, altura 45px, borderRadius 8px).

---

### 14. Mobile / Login (`16:1022`)

- **Dimensões e Layout**:
  - Template: `EL-7a59abaa` (Largura: 414px, Altura: 896px, padding: `80px 28px 24px`, gap: `40px`, borderRadius: 40px, fills: `Color/Ink`).
- **Componentes Identificados**:
  - Logo KURIO centralizado no topo com tracking 0.1em.
  - Título da tela: 20px/22px Bold ("Entrar").
  - Formulário vertical:
    - Campo E-mail (input full-width, borda `Color/Border`, r:3px a 6px).
    - Campo Senha (input full-width com ícone/ação de toggle de visibilidade).
    - Botão "Entrar" (largura total, background `Color/Primary`, texto `Color/Ink`, altura 44px).
    - Link "Criar conta" e "Esqueceu a senha?".

---

### 15. Mobile / Cadastro (`16:1228`)

- **Dimensões e Layout**:
  - Template: `EL-7a59abaa` (Largura: 414px, Altura: 896px, padding: `80px 28px 24px`, gap: `40px`, borderRadius: 40px, fills: `Color/Ink`).
- **Componentes Identificados**:
  - Estrutura idêntica ao Mobile / Login (template `EL-7a59abaa`), adicionando os campos de Nome completo e Confirmação de senha.
  - Botão "Criar conta" (100% largura, fill `Color/Primary`, texto `Color/Ink`, altura 44px).
  - Link de retorno para login ("Já possui uma conta? Entrar").

---

## Análise Consolidada de Design Tokens e Sistema Visual

### 1. Paleta de Cores e Tokens de Superfície

| Nome do Token Figma    | Hex / Valor | Função / Onde é Usada                                                                                 | Status / Observações |
| :--------------------- | :---------- | :---------------------------------------------------------------------------------------------------- | :------------------- |
| `Color/Ink`            | `#140D0A`   | Fundo principal da aplicação (body background) e texto sobre botões primários                         | Oficial Figma        |
| `Color/Foreground`     | `#F5F1EB`   | Texto primário, títulos, ícones de cabeçalho                                                          | Oficial Figma        |
| `Color/Primary`        | `#D28A4C`   | Cor de destaque primária: botões CTA, badges, underlines ativos, linhas de destaque                   | Oficial Figma        |
| `Text/Accent`          | `#E89B55`   | Preços de NFTs em destaque, links ativos, destaques secundários                                       | Oficial Figma        |
| `Text/Secondary`       | `#CFB28C`   | Descrições secundárias, legendas, contadores em listas de coleções                                    | Oficial Figma        |
| `Color/Secondary`      | `#B39463`   | Preços antigos riscados, placeholders, metadados secundários de cards                                 | Oficial Figma        |
| `Color/Surface Card`   | `#241612`   | Fundo de cards de produtos, sidebar de filtros, linhas do carrinho, blocos do footer, modal de recibo | Oficial Figma        |
| `Color/Surface Raised` | `#2F1D15`   | Superfície elevada (botão de zoom/ação flutuante sobre imagem de produto)                             | Oficial Figma        |
| `Color/Surface Dark`   | `#38220F`   | Fundo de inputs (newsletter), faixa central do footer, badge de carteiras                             | Oficial Figma        |
| `Color/Border`         | `#3F2319`   | Bordas padrão de containers, inputs de formulário, botões de paginação                                | Oficial Figma        |
| `Color/Border Soft`    | `#55321F`   | Borda sutil de caixas em destaque e badge de carteiras                                                | Oficial Figma        |
| `Text/Coral`           | `#F0805F`   | Indicador de campos obrigatórios (*), alertas de validação e erros                                    | Oficial Figma        |

### 2. Tipografia (100% Família `Roboto Mono`)

| Nome do Estilo / Token  | Tamanho | Peso          | Line-Height                      | Uso no Projeto                                                                             |
| :---------------------- | :------ | :------------ | :------------------------------- | :----------------------------------------------------------------------------------------- |
| `Display/43 Bold`       | 43px    | Bold (700)    | 70px                             | Título principal da Home (Hero Desktop)                                                    |
| `Heading/28 Bold`       | 28px    | Bold (700)    | auto / 32px                      | Título do Detalhe do NFT, Diário da Cunhagem, Títulos de Perfil e Carteiras                |
| `Heading/24 Bold`       | 24px    | Bold (700)    | auto / 28px                      | Títulos de seções, cabeçalhos de cards do footer                                           |
| `Title/22 Bold`         | 22px    | Bold (700)    | 16px / 24px                      | Preço principal na página de Detalhes                                                      |
| `Title/22 Regular`      | 22px    | Regular (400) | 29px                             | Título de destaque e valores de resumo                                                     |
| `Title/20 Regular`      | 20px    | Regular (400) | 28px / 10px                      | Contador do seletor de quantidade                                                          |
| `Body Large/18 Bold`    | 18px    | Bold (700)    | 16px / 24px                      | Preços de NFTs em cards, títulos de cards promocionais, cabeçalhos do footer               |
| `Body Large/18 Regular` | 18px    | Regular (400) | 16px                             | Preço anterior riscado em promoções                                                        |
| `Body Large/17 Bold`    | 17px    | Bold (700)    | 16px                             | Destaques do footer, títulos de blocos no checkout ("Perfil do colecionador", "Seus NFTs") |
| `Body Large/16 Bold`    | 16px    | Bold (700)    | auto / 16px / 20px               | Link ativo de navegação ("Início" / "Mercado"), títulos do blog, cabeçalhos de tabela      |
| `Body Large/16 Medium`  | 16px    | Medium (500)  | auto / 16px                      | Texto do botão "Entrar", labels de colunas de tabela                                       |
| `Body Large/16 Regular` | 16px    | Regular (400) | auto / 16px                      | Links de navegação inativos, nomes de NFTs nos cards                                       |
| `Body/15 Bold`          | 15px    | Bold (700)    | 16px / 40px                      | Contadores dos filtros `(33)`, botão "Aplicar", breadcrumbs, botão "Confirmar compra"      |
| `Body/15 Medium`        | 15px    | Medium (500)  | 16px                             | Abas de catálogo ("Todos os NFTs", "Novos lançamentos", "Em alta")                         |
| `Body/15 Regular`       | 15px    | Regular (400) | 15px / 16px / 40px               | Itens de lista de filtro, labels de formulário, textos gerais                              |
| `Body/14 Bold`          | 14px    | Bold (700)    | auto / 16px / 20px               | Logo "KURIO" (tracking 0.1em), botão "COMPRAR", labels de metadados                        |
| `Body/14 Medium`        | 14px    | Medium (500)  | 16px / 20px                      | Subtítulo do Hero, botão "Favoritar"                                                       |
| `Body/14 Regular`       | 14px    | Regular (400) | 15px / 16px / 22px / 24px / 30px | Descrições de produtos, textos do footer, placeholders de input, notas                     |
| `Caption/13 Regular`    | 13px    | Regular (400) | 22px                             | Notas auxiliares de newsletter e links                                                     |
| `Caption/12 Regular`    | 12px    | Regular (400) | 16px                             | Placeholders secundários e label "Taxa estimada"                                           |
| `Tiny/10 Medium`        | 10px    | Medium (500)  | auto                             | Badge numérico do carrinho                                                                 |
| `Tiny/9 Bold`           | 9px     | Bold (700)    | auto (ls 0.011em)                | Badge de carteiras compatíveis                                                             |

### 3. Grid, Espaçamentos e Breakpoints Observados

- **Breakpoints**:
  - `Desktop`: 1440px largura de prancheta. Container centralizado de 1200px com padding horizontal de 120px (`px-28` ou `max-w-[1200px] mx-auto px-4 lg:px-0`).
  - `Tablet`: 768px (Mobile expandido, conforme RN-19: mesma composição fluida aproveitando o espaço adicional, container com padding horizontal de 32px a 40px).
  - `Mobile`: 390px (conforme RN-22) / 414px (prancheta do Figma). Container com padding horizontal de 24px a 28px (`px-6` ou `px-7`).
- **Gaps e Espaçamentos Macro**:
  - Gap entre seções verticais (Desktop): 96px (`gap-24` ou `my-24`).
  - Gap entre seções verticais (Mobile): 32px a 40px (`gap-8` a `gap-10`).
  - Gaps de grid de cards: 24px a 48px no desktop, 16px no mobile.
  - Alturas de linha / Ritmo vertical: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 72px, 96px.

### 4. Raios de Borda (Border Radius) e Efeitos

- `r: 3px` / `rounded-sm`: Inputs de formulário do checkout, campo de cupom, botões compactos ("Aplicar", "Conectar e finalizar").
- `r: 4px` / `rounded`: Botões de paginação, ícones sociais do footer.
- `r: 5px` / `r: 6px` / `rounded-md`: Botão de login do header (100x35px r:6px), botão "EXPLORAR" (r:6px), botões "COMPRAR" / "Favoritar" (r:6px), thumbnails do carrinho (r:6px).
- `r: 8px` / `rounded-lg`: Cards do blog (r:8px), thumbnails de recibo (r:8px), botão "Confirmar compra" (r:8px).
- `r: 11px a 15px` / `rounded-xl`: Imagens dos cards de NFTs do catálogo e carrossel.
- `r: 17px / 18px` / `rounded-2xl`: Cards promocionais da home.
- `r: 22px / 24px` / `rounded-3xl`: Imagem do NFT em destaque no Hero (450x450 r:24px) e na página de detalhes (404x404 r:24px).
- `r: full` / `rounded-full`: Badges ovais de edição (`1/1`, `1/50`), badge de contador do carrinho, avatar do colecionador, botões de rádio e checkbox circular.
- **Efeitos e Sombras**:
  - `boxShadow: 0px 0px 20px 0px rgba(10, 6, 4, 0.45)` (input da newsletter no footer).
  - Gradiente linear de overlay: `linear-gradient(145deg, rgba(210, 138, 76, 0.3) 0%, rgba(210, 138, 76, 0) 100%)`.

### 5. Inconsistências Observadas entre Frames

1. **Raios de Borda dos Botões e Inputs**:
   - No Header e Hero, botões primários têm `borderRadius: 6px`.
   - No Carrinho e Checkout, botões primários e inputs têm `borderRadius: 3px`.
   - No botão "Confirmar compra" do Checkout, o raio é de `8px`.
   - No modal de confirmação, o botão "Ver no Etherscan" tem `borderRadius: 5px`.
   - _Resolução arquitetural recomendada para shadcn/Tailwind_: Adotar raio de curvatura padronizado por categoria de componente (ex: inputs com `rounded-md` ~6px e botões com `rounded-md` ~6px, preservando fidelidade sem gerar estilos avulsos e desnecessários).
2. **Variação de Tamanhos de Thumbnails**:
   - No carrinho, as miniaturas têm 70x70px com r:6px.
   - No checkout/recibo, miniaturas variam entre 65x65px, 66x66px e 70x70px com r:8px.
   - _Resolução_: Padronizar componente de thumbnail para 70x70px (ou 64x64px responsivo) com `object-cover`.
3. **Cores de Texto Secundário**:
   - `Text/Secondary` (#CFB28C) e `Color/Secondary` (#B39463) são por vezes alternadas em labels semelhantes entre frames (ex: ID do token em #B39463 no detalhe vs #CFB28C no carrinho).

### 6. Auditoria de Contraste e Acessibilidade (Meta: Accessibility ≥ 95)

1. **Fundo Primário (`#D28A4C`) com Texto Escuro (`#140D0A`)**:
   - Razão de contraste: ~`6.5:1` (Passa com folga nos critérios WCAG AA e AAA para texto normal e grande).
2. **Fundo Escuro (`#140D0A` / `#241612`) com Texto Claro (`#F5F1EB`)**:
   - Razão de contraste: > `14:1` (Excelente, aprovação AAA máxima).
3. **Ponto Crítico de Atenção**:
   - `Color/Secondary` (`#B39463`) sobre `Color/Surface Card` (`#241612`): contraste de ~`4.6:1`. Passa em AA para texto normal (> 4.5:1), mas exige atenção em tamanhos menores que 14px.
   - `Text/Accent` (`#E89B55`) sobre `Color/Ink` (`#140D0A`): contraste de ~`6.2:1` (Passa AA e AAA para títulos e botões).
   - Placeholders com `Color/Secondary`: para atingir Accessibility ≥ 95 no Lighthouse, garantir que o contraste do placeholder não seja rebaixado excessivamente por opacidade nativa dos navegadores.

### 7. Assets que Precisam ser Locais

- **Fontes**: Família completa `Roboto Mono` (pesos 400 Regular, 500 Medium, 700 Bold) hospedada localmente (`@fontsource/roboto-mono` ou WOFF2 em `/public/fonts/`) com `font-display: swap` para cumprir a RN-23 e RN-24.
- **Ícones SVG**:
  - `Iconly/Curved/Logout`
  - `Iconly/Curved/Delete`
  - `Iconly/Curved/Arrow - Right` e `Arrow - Right 2`
  - `Iconly/Two-tone/Arrow - Down 2`
  - `Iconly/Bold/Star`
  - Ícone de Carrinho, Ícone de Busca, Ícone de Coração (favoritar)
  - Ícones de redes sociais: Facebook, Instagram, Twitter/X, Linkedin
  - Ícones dos provedores de carteira: MetaMask, Coinbase Wallet, WalletConnect
- **Imagens**:
  - Coleção de obras de arte dos NFTs (imagens locais em `/public/assets/nfts/` ou servidas via mock MSW com dimensões reservadas para evitar CLS).
