import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RoutePlaceholderPage } from "@/pages/RoutePlaceholderPage";
import { HomePage } from "@/pages/HomePage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginRedirect } from "@/components/auth/LoginRedirect";

import type { CatalogSearchParams } from "@/features/catalog/types";
import type { NftCategory, NftSortOption, NftStatus } from "@/contracts";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): CatalogSearchParams => ({
    search: typeof search.search === "string" ? search.search : undefined,
    category:
      typeof search.category === "string"
        ? (search.category as NftCategory)
        : undefined,
    status:
      typeof search.status === "string"
        ? (search.status as NftStatus)
        : undefined,
    priceMin: typeof search.priceMin === "string" ? search.priceMin : undefined,
    priceMax: typeof search.priceMax === "string" ? search.priceMax : undefined,
    sort:
      typeof search.sort === "string"
        ? (search.sort as NftSortOption)
        : undefined,
    page: search.page ? Number(search.page) : undefined,
  }),
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
    <ProtectedRoute>
      <RoutePlaceholderPage
        title="Checkout & Pagamento"
        description="Conecte sua carteira Web3 ou escolha seu método de pagamento preferido."
        routePath="/pagamento"
      />
    </ProtectedRoute>
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
  component: LoginRedirect,
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: string; reason?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    reason: typeof search.reason === "string" ? search.reason : undefined,
  }),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cadastro",
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/perfil",
  component: () => (
    <ProtectedRoute>
      <RoutePlaceholderPage
        title="Perfil do Colecionador"
        description="Gerencie sua coleção, histórico de atividades e configurações de perfil."
        routePath="/perfil"
      />
    </ProtectedRoute>
  ),
});

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carteiras",
  component: () => (
    <ProtectedRoute>
      <RoutePlaceholderPage
        title="Minhas Carteiras Web3"
        description="Vincule carteiras MetaMask, WalletConnect ou Coinbase à sua conta."
        routePath="/carteiras"
      />
    </ProtectedRoute>
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
