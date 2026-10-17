import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RoutePlaceholderPage } from "@/pages/RoutePlaceholderPage";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <RoutePlaceholderPage
      title="Catálogo & Destaques de NFTs"
      description="Bem-vindo à Kurio. Navegue pelas coleções verificadas, novos lançamentos e drops exclusivos."
      routePath="/"
    />
  ),
});

const marketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mercado",
  component: () => (
    <RoutePlaceholderPage
      title="Mercado Secundário & Filtros"
      description="Explore todas as obras disponíveis para compra imediata ou lances."
      routePath="/mercado"
    />
  ),
});

const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: () => (
    <RoutePlaceholderPage
      title="Detalhes do Ativo Digital"
      description="Visualização da obra, histórico de transações on-chain, atributos e criador."
      routePath="/nft/$id"
    />
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carrinho",
  component: () => (
    <RoutePlaceholderPage
      title="Carrinho de Compras"
      description="Revise os colecionáveis selecionados antes de prosseguir para o pagamento."
      routePath="/carrinho"
    />
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pagamento",
  component: () => (
    <RoutePlaceholderPage
      title="Checkout & Pagamento"
      description="Conecte sua carteira Web3 ou escolha seu método de pagamento preferido."
      routePath="/pagamento"
    />
  ),
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmacao",
  component: () => (
    <RoutePlaceholderPage
      title="Confirmação de Transação"
      description="Recibo de aquisição e confirmação da cunhagem ou transferência no smart contract."
      routePath="/confirmacao"
    />
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <RoutePlaceholderPage
      title="Conectar Carteira / Login"
      description="Acesse sua conta ou assine uma mensagem criptográfica com sua carteira."
      routePath="/login"
    />
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cadastro",
  component: () => (
    <RoutePlaceholderPage
      title="Criar Conta de Colecionador"
      description="Cadastre-se na Kurio para colecionar, cunhar e negociar ativos digitais."
      routePath="/cadastro"
    />
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: () => (
    <RoutePlaceholderPage
      title="Perfil do Colecionador"
      description="Gerencie sua coleção, histórico de atividades e configurações de perfil."
      routePath="/perfil"
    />
  ),
});

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carteiras",
  component: () => (
    <RoutePlaceholderPage
      title="Minhas Carteiras Web3"
      description="Vincule carteiras MetaMask, WalletConnect ou Coinbase à sua conta."
      routePath="/carteiras"
    />
  ),
});

const creatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/criadores",
  component: () => (
    <RoutePlaceholderPage
      title="Criadores Verificados"
      description="Conheça os principais artistas e estúdios que publicam suas coleções na Kurio."
      routePath="/criadores"
    />
  ),
});

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/aprenda",
  component: () => (
    <RoutePlaceholderPage
      title="Aprenda sobre NFTs e Web3"
      description="Guias e tutoriais para iniciantes e colecionadores experientes."
      routePath="/aprenda"
    />
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  marketRoute,
  nftDetailRoute,
  cartRoute,
  checkoutRoute,
  confirmationRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
  creatorsRoute,
  learnRoute,
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
