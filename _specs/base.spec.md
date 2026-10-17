# Spec: base (NTF Marketplace)

> Spec-mãe do projeto. Define escopo, stack, regras globais e a ordem de execução. Cada feature listada na seção 6 ganha sua própria spec em `_specs/[feature].spec.md`, que herda tudo o que está aqui. Em caso de conflito, a spec da feature vence apenas se for mais restritiva.

## 1. Visão Geral

- **Objetivo:** Entregar um marketplace de NFTs em React + TypeScript, fiel ao layout do Figma, cobrindo descoberta, compra e conta do colecionador em desktop e mobile. Tudo (API, auth, carteiras, pagamento, tempo real) roda com dados simulados via MSW; nada de blockchain, extensão de carteira ou gateway de pagamento reais.
- **Avaliação:** fidelidade visual, qualidade das interações, integração com APIs, estado assíncrono, tempo real, acessibilidade e performance.
- **Público/Atores:**
  - Visitante (não autenticado): navega, busca, filtra, monta carrinho.
  - Colecionador (autenticado): favorita, faz checkout, gerencia perfil e carteiras.
  - Sistema simulado: handlers MSW (REST) e servidor Socket.IO simulado que emite eventos.
  - Avaliador: roda os cenários de falha, os testes Playwright e a auditoria Lighthouse.

## 2. Requisitos Funcionais (RF)

### Descoberta

- **RF-01:** O sistema deve exibir na Início destaques e catálogo, com busca, filtros combináveis, ordenação e paginação, levando à tela de detalhe do NFT.
- **RF-02:** Busca, filtros, ordenação e paginação devem viver na URL (search params) e sobreviver a refresh e navegação pelo histórico.
- **RF-03:** O detalhe do NFT deve exibir galeria, informações, seleção de edição, quantidade, favoritar e comprar/adicionar ao carrinho.
- **RF-04:** O usuário autenticado deve poder favoritar/desfavoritar NFTs, com persistência por usuário.

### Carrinho

- **RF-05:** O sistema deve permitir adicionar, alterar quantidade e remover itens, respeitando disponibilidade por NFT e edição.
- **RF-06:** O carrinho deve persistir após refresh e os itens do visitante devem ser preservados ao autenticar.
- **RF-07:** O usuário deve poder aplicar e remover cupom, com tratamento de código inválido ou expirado.
- **RF-08:** O resumo deve exibir subtotal, desconto, taxa de rede e total exatamente como retornados pela API de cotação.

### Pagamento e pedido

- **RF-09:** A tela de pagamento deve coletar dados do colecionador, permitir escolher carteira cadastrada e rede, simular conexão/recusa/desconexão da carteira e oferecer revisão antes do envio.
- **RF-10:** Antes de confirmar, o sistema deve revalidar preço, disponibilidade, cupom e taxas; qualquer mudança exige nova confirmação explícita do usuário.
- **RF-11:** A criação do pedido deve ser idempotente (chave de idempotência) e impedir duplicidade por clique repetido ou reenvio após timeout.
- **RF-12:** O pedido deve ter os estados pendente, confirmado e recusado, recuperáveis após refresh ou reconexão. Confirmado e recusado são terminais.
- **RF-13:** A tela de confirmação só aparece para pedido efetivamente confirmado e mostra o recibo (snapshot do pedido): resultado, id da transação, itens, taxas e total.

### Conta

- **RF-14:** O sistema deve oferecer cadastro, login, logout e sessão recuperável após refresh, com retorno ao fluxo anterior após login.
- **RF-15:** O perfil deve permitir editar dados, avatar e senha.
- **RF-16:** A tela de carteiras deve permitir cadastrar e editar carteira principal e secundária.

### Tempo real

- **RF-17:** O evento `nft.updated` deve atualizar preço e disponibilidade no catálogo, detalhe e carrinho, e o usuário deve ser avisado quando afetar o carrinho.
- **RF-18:** O evento `order.updated` deve atualizar o estado do pedido e apresentar confirmação ou recusa.
- **RF-19:** Após reconexão, o cliente deve reconciliar os recursos ativos com a API REST.

### Mocks, UI, testes e entrega

- **RF-20:** Toda a API (REST + eventos) deve ser simulada na camada de rede com MSW, com cenários configuráveis e reproduzíveis, ativáveis por configuração e disponíveis no build de demonstração.
- **RF-21:** Componentes de dados devem ter skeleton com shimmer (catálogo, detalhe, resumo do carrinho) e estados de vazio, erro, sucesso e atualização em segundo plano.
- **RF-22:** Todas as telas devem funcionar em 390, 768 e 1440 px (tablet = mobile expandido); perfil, carteiras e confirmação também em mobile, mesmo sem frame no Figma (ver RN-18 e RN-19).
- **RF-23:** O projeto deve entregar testes E2E e regressão visual com Playwright e auditoria Lighthouse (3 medições por página/perfil, mediana).
- **RF-24:** O projeto deve ser publicado (URL pública) e documentado (README.md e ARCHITECTURE.md).

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Stack obrigatória (uso efetivo, não decorativo)

| Responsabilidade          | Tecnologia                                                                      |
| ------------------------- | ------------------------------------------------------------------------------- |
| Interface / Linguagem     | React / TypeScript                                                              |
| Roteamento                | TanStack Router (rotas, search params, proteção de rotas privadas)              |
| Estado remoto             | TanStack Query (queries, mutations, cache)                                      |
| Cliente HTTP              | Axios (todas as chamadas REST passam por ele)                                   |
| Tempo real                | Socket.IO (`socket.io-client`)                                                  |
| Estilização / Componentes | Tailwind CSS / shadcn/ui, adaptado à identidade do Figma                        |
| Mocking                   | MSW (REST + Socket.IO via `@mswjs/socket.io-binding` ou equivalente compatível) |
| Testes                    | Playwright (E2E + regressão visual)                                             |
| Auditoria                 | Lighthouse                                                                      |

Build tool, organização de pastas e bibliotecas complementares são livres.

### Regras de Negócio

- **RN-01:** Valores em ETH trafegam como strings decimais e mantêm precisão em cálculos e exibição (nunca float). Quantidades são inteiras. Qualquer biblioteca decimal que cumpra esse papel é aceita.
- **RN-02:** A cotação da API é a referência para finalizar o pedido; o cliente não recalcula totais por conta própria.
- **RN-03:** Componentes, hooks e o cliente Axios não contêm respostas fictícias nem caminhos alternativos de negócio; todo mock vive na camada MSW.
- **RN-04:** Eventos de tempo real passam obrigatoriamente pelo `socket.io-client`; nunca chamar setters, callbacks ou cache diretamente para simulá-los.
- **RN-05:** Eventos carregam identidade estável, recurso afetado e versão. O cliente ignora duplicatas e eventos antigos e nunca regride um estado mais recente.
- **RN-06:** Checkout, perfil, carteiras, favoritos e pedidos exigem autenticação. Logout e troca de usuário limpam cache privado e subscriptions da sessão anterior.
- **RN-07:** Senhas não são armazenadas em claro (nem no mock); apenas credenciais fictícias.
- **RN-08:** O recibo é um snapshot imutável; mudanças posteriores no catálogo não o alteram.
- **RN-09:** Após compra confirmada, remover do carrinho apenas os itens e quantidades comprados; em falha, preservar tudo.
- **RN-10:** Mutations de pedido aceitam chave de idempotência: mesma chave + mesmo conteúdo recupera o mesmo pedido; mesma chave + conteúdo diferente gera conflito.
- **RN-11:** Pelo menos uma interação deve usar atualização otimista com rollback em falha (candidato natural: favoritos).
- **RN-12:** Páginas fora de escopo (editoriais, suporte, atividade, ofertas, downloads) não são entregues; links/ações relacionadas têm comportamento coerente e não aparentam sucesso funcional.
- **RN-13:** O estado dos mocks (catálogo, favoritos, carrinho, perfil, carteiras, pedidos, sessão) persiste em `localStorage`, isolado por usuário, e o reset restaura integralmente um cenário conhecido.
- **RN-14 (eliminatórios, nunca violar):** (a) não usar a stack de fato; (b) fluxos só visuais; (c) compra confirmada sem resposta da simulação; (d) dados expostos entre usuários; (e) eventos simulados direto na UI; (f) ausência de testes E2E executáveis.
- **RN-15 (seleção de cenário):** O cenário ativo pode ser escolhido pelos três meios: variável de ambiente (define o padrão), parâmetro de URL e painel de desenvolvimento na interface. Os três devem funcionar no ambiente de dev, no deploy e nos testes; a regra de precedência é definida na spec de mocks.
- **RN-16 (expiração):** Sessão e cupom guardam o horário em que expiram, e uma função única de verificação decide se estão expirados, lendo o horário atual de um único ponto (para facilitar o controle do relógio nos testes). A API simulada é a autoridade e valida a expiração em cada requisição; a verificação no cliente existe para antecipar o feedback.
- **RN-17 (avatar):** Apenas PNG ou JPEG são aceitos, com limite de tamanho (valor definido na spec de perfil, por causa do limite do `localStorage`). Ao escolher a imagem, o `File` fica no estado do React e o usuário vê um preview temporário; descartar a seleção libera o preview. Ao confirmar, o arquivo é enviado à API simulada, que o persiste no perfil do usuário, e a partir daí o avatar vem da API (sobrevive a refresh e é isolado por usuário). Tipo inválido, arquivo grande demais ou falha da API exibem erro e mantêm o avatar anterior.
- **RN-18 (frames do Figma):** Desktop tem os 9 frames (Início, Detalhes, Carrinho, Pagamento, Confirmação, Login, Cadastro, Perfil, Carteiras). Mobile tem 6 (Início, Detalhes, Carrinho, Pagamento, Login, Cadastro). Confirmação, Perfil e Carteiras no mobile não têm frame: seguem a identidade visual e os padrões de componentes do restante do mobile.
- **RN-19 (tablet):** Não há frame de tablet. A largura de 768 px usa o layout mobile expandido (mesma composição, aproveitando o espaço extra).
- **RN-20 (contratos tipados):** Transporte, estado e interface compartilham os mesmos tipos de contrato. Handlers MSW, fixtures, cliente Axios e testes usam essa mesma fonte de verdade.
- **RN-21 (cache e consultas):** As chaves de consulta incluem o usuário (quando privadas) e os parâmetros da consulta, de modo que dados de um usuário ou de uma busca nunca sirvam a outro. A política de cache, retries e sincronização é definida e documentada.
- **RN-22 (ciclo de vida do tempo real):** Listeners e subscriptions do Socket.IO são liberados ao fim do ciclo de vida da tela ou da sessão, e eventos de uma sessão anterior são ignorados. Mudanças no estado simulado aparecem tanto nas respostas REST quanto nos eventos correspondentes.
- **RN-23 (assets e desvios do Figma):** Imagens e fontes do Figma ficam acessíveis localmente. Qualquer substituição de asset, ajuste de acessibilidade ou desvio do layout é registrado no `ARCHITECTURE.md`.
- **RN-24 (performance desde o início):** Imagens com dimensões reservadas, fontes que não bloqueiam a renderização e JavaScript inicial enxuto são tratados desde a fundação, não só no fim. A auditoria roda com imagens, fontes e funcionalidades reais, sem simplificações feitas só para pontuar.

### Casos de Borda & Tratamento de Erros

- **EC-01:** Catálogo: resultado vazio, falha de API e respostas fora de ordem são tratados; resposta obsoleta é descartada ou cancelada; mudar filtro reinicia a paginação.
- **EC-02:** Detalhe: acesso direto por URL, NFT inexistente (estado "não encontrado"), edição indisponível e limite de quantidade.
- **EC-03:** Rota inexistente exibe tela 404; acesso direto/refresh funciona em qualquer rota prevista, inclusive no deploy.
- **EC-04:** Sessão expira durante navegação ou checkout: o contexto é preservado e o usuário retoma após novo login.
- **EC-05:** Preço alterado ou edição esgotada durante a compra: bloquear confirmação, informar a mudança e exigir nova confirmação.
- **EC-06:** Timeout após criação do pedido: recuperar o mesmo pedido via idempotência, sem criar outro.
- **EC-07:** Queda de conexão com pedido pendente: ao reconectar ou recarregar, recuperar o estado sem nova compra.
- **EC-08:** Cadastro com conflito (e-mail já existente) e erros de validação vindos da API são exibidos associados ao campo.
- **EC-09:** Cupom inválido ou expirado exibe mensagem clara e não altera o resumo.
- **EC-10:** Botões de ação ficam desabilitados e com feedback acessível enquanto a mutation roda.
- **EC-11:** Pagamento recusado: mostra a falha, preserva o carrinho e permite nova tentativa.
- **EC-12:** Skeletons preservam as dimensões do conteúdo (sem layout shift) e respeitam `prefers-reduced-motion`.
- **EC-13:** Erros da API são tipados e distinguem: validação, sessão inválida, sem permissão, inexistente, conflito de disponibilidade e falha transitória.
- **EC-14:** Respostas obsoletas ou fora de ordem em qualquer consulta (busca, detalhe, carrinho, cotação) nunca sobrescrevem dados mais recentes.

## 4. Critérios de Aceite (Definition of Done)

- **CA-01:** Todas as telas da tabela do enunciado (Início, Detalhe, Carrinho, Pagamento, Confirmação, Login, Cadastro, Perfil, Carteiras) existem, são navegáveis e funcionais com dados simulados.
- **CA-02:** Compra completa funciona do catálogo ao recibo confirmado, passando por login, carrinho, cupom, checkout e pedido.
- **CA-03:** Cenário de tempo real funciona: NFT no carrinho muda de preço/disponibilidade via Socket.IO, a UI avisa, o resumo atualiza e o checkout bloqueia cotação desatualizada.
- **CA-04:** Todos os cenários determinísticos de MSW do enunciado existem (sucesso/vazio, latência variável e fora de ordem, falhas 4xx/5xx e de conexão, sessão expirada/não autorizado, conflito de cadastro, cupom inválido/expirado, preço alterado/esgotado, timeout pós-pedido, pagamento confirmado/recusado), com ao menos 2 usuários e fixtures variadas para filtros e paginação.
- **CA-05:** Layout aderente ao Figma e sem overflow horizontal em 390, 768 e 1440 px.
- **CA-06:** Navegação por teclado, foco visível, foco controlado em diálogos/drawers, labels e erros associados aos campos, alt em imagens relevantes e anúncio de feedback de mutations e eventos em tempo real.
- **CA-07:** Testes Playwright cobrem os 12 grupos de fluxos do enunciado em Chromium (desktop + mobile), com regressão visual de início, detalhe, carrinho e pagamento (baselines versionadas, dados estáveis), estado isolado por teste, relógio, latência e disparo de eventos controlados nos cenários sensíveis a tempo, relatório HTML e traces de falha.
- **CA-08:** Lighthouse em início e detalhe (mobile + desktop), mediana de 3 execuções, com metas Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90, mais LCP/CLS/TBT registrados e justificativa de qualquer meta não atingida. Configuração, relatórios HTML/JSON, versões das ferramentas e condições de execução são versionados.
- **CA-09:** Deploy público funcional (mocks e Socket.IO funcionando, refresh e acesso direto às rotas), correspondendo ao código do repositório.
- **CA-10:** `README.md` (setup, variáveis de ambiente, credenciais fictícias, seleção/reset de cenários, comandos, como reproduzir falhas) e `ARCHITECTURE.md` (contratos REST e eventos, política de sessão, estado do carrinho, cache/retries/sincronização, reconciliação REST × Socket.IO, transporte usado no Socket.IO simulado e suas limitações, desvios do Figma) escritos.
- **CA-11:** Código, lockfile, assets, mocks, fixtures, testes e configuração de auditoria entregues; comandos disponíveis e funcionando a partir de um checkout limpo, sem depender de serviços privados: dev com mocks, build, preview, typecheck, lint, testes Playwright e auditoria Lighthouse.

## 5. Decisões Tomadas e Pontos em Aberto

### Decisões já tomadas

- Persistência dos mocks em `localStorage` (RN-13).
- Seleção de cenário pelos três meios: ambiente, URL e painel de dev (RN-15).
- Expiração de sessão e cupom por horário guardado + função de verificação (RN-16).
- Avatar PNG/JPEG: `File` temporário no estado só até confirmar, depois persistido pela API simulada (RN-17).
- Frames disponíveis e adaptação para telas sem frame (RN-18); tablet segue o mobile expandido (RN-19).
- Biblioteca de ETH decimal livre (RN-01).

### Pontos em aberto

- Detalhes técnicos não cobertos aqui (transporte do Socket.IO nos mocks, disparo dos eventos, publicação do build com MSW, limites do avatar, entre outros) ficam para as specs derivadas da seção 6.

## 6. Ordem de Execução e Specs Derivadas

Cada item vira `_specs/[nome].spec.md`, seguido de plan e implementação. **Testes Playwright de cada feature são escritos junto com ela** (não deixar para o final), e o deploy é feito logo após a fundação para validar cedo o MSW em produção.

| #   | Spec                | Escopo resumido                                                                                                               | Prioridade |
| --- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 01  | `fundation`          | Projeto, tooling (lint, typecheck), Tailwind + shadcn + tokens do Figma, rotas base + 404, Axios, QueryClient, deploy inicial | P0         |
| 02  | `contratos-e-mocks` | Tipos dos contratos REST/eventos, handlers MSW, fixtures, estado persistido, cenários, reset, binding Socket.IO               | P0         |
| 03  | `sessao-auth`       | Cadastro, login, logout, expiração, rotas protegidas, retorno ao fluxo, limpeza de cache                                      | P0         |
| 04  | `catalogo-inicio`   | Home, busca/filtros/ordem/paginação na URL, skeletons, estados de vazio/erro                                                  | P0         |
| 05  | `detalhe-favoritos` | Detalhe do NFT, edição/quantidade, favoritos com update otimista e rollback                                                   | P0         |
| 06  | `carrinho`          | Itens, cupom, resumo com cotação, persistência, merge visitante → usuário                                                     | P0         |
| 07  | `tempo-real`        | Cliente Socket.IO, `nft.updated`, deduplicação/versão, reconexão e reconciliação                                              | P0         |
| 08  | `checkout-pedido`   | Pagamento, carteira/rede, revalidação, idempotência, `order.updated`, confirmação/recibo                                      | P0         |
| 09  | `perfil-carteiras`  | Perfil, avatar (PNG/JPEG), senha, carteiras principal/secundária                                                              | P1         |
| 10  | `a11y-responsivo`   | Passada de acessibilidade, tablet (mobile expandido), zoom, reduced motion, regressão visual                                  | P1         |
| 11  | `lighthouse-docs`   | Auditoria (3 medições, medianas), README, ARCHITECTURE, ajustes finais                                                        | P1         |

P0 cobre os critérios eliminatórios e a maior parte dos pontos; P1 só depois que o fluxo de compra ponta a ponta estiver funcionando e testado.
