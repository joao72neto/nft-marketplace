import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SearchIcon, CartIcon, LogoutIcon } from "@/components/icons";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth, useAuthModal } from "@/features/auth";
import { UserMenu } from "@/components/layout/UserMenu";

interface HeaderProps {
  cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isAuthenticated, isLoading } = useAuth();
  const { openLoginModal } = useAuthModal();

  const isHome = currentPath === "/";
  const isMarket = currentPath.startsWith("/mercado");

  return (
    <header className="sticky top-0 z-40 w-full bg-ink/95 backdrop-blur-md">
      <div className="container max-w-300 mx-auto px-4 lg:px-0">
        <div className="flex h-20 items-center justify-between gap-4 border-b border-primary/20">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center font-mono text-xl font-bold tracking-widest text-foreground hover:text-accent transition-colors select-none py-2"
              aria-label="Ir para a página inicial"
            >
              KURIO
            </Link>
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Navegação principal"
            >
              <Link
                to="/"
                className={`relative py-2 text-sm font -mono transition-colors min-h-11 flex items-center ${
                  isHome
                    ? "text-foreground font-bold"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                Início
                {isHome && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>

              <Link
                to="/mercado"
                className={`relative py-2 text-sm font-mono transition-colors min-h-11 flex items-center ${
                  isMarket
                    ? "text-foreground font-bold"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                Mercado
                {isMarket && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>

              <Link
                to="/criadores"
                className="py-2 text-sm font-mono text-foreground/80 hover:text-foreground transition-colors min-h-11 flex items-center"
              >
                Criadores
              </Link>

              <Link
                to="/aprenda"
                className="py-2 text-sm font-mono text-foreground/80 hover:text-foreground transition-colors min-h-11 flex items-center"
              >
                Aprenda
              </Link>
            </nav>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              className="flex items-center justify-center h-11 w-11 min-h-11 min-w-11 rounded-md text-foreground hover:text-accent hover:bg-surface-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Buscar NFTs"
            >
              <SearchIcon size={20} />
            </button>

            <Link
              to="/carrinho"
              className="relative flex items-center justify-center h-11 w-11 min-h-11 min-w-11 rounded-md text-foreground hover:text-accent hover:bg-surface-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Carrinho de compras"
            >
              <CartIcon size={22} />
              {cartCount > 0 && (
                <Badge variant="counter" className="absolute -top-1 -right-1">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="gap-2 px-5"
                    onClick={() => openLoginModal()}
                  >
                    <LogoutIcon size={18} />
                    <span>Entrar</span>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              className="flex items-center justify-center h-11 w-11 min-h-11 min-w-11 rounded-md text-foreground hover:text-accent transition-colors"
              aria-label="Buscar NFTs"
            >
              <SearchIcon size={20} />
            </button>

            <Link
              to="/carrinho"
              className="relative flex items-center justify-center h-11 w-11 min-h-11 min-w-11 rounded-md text-foreground hover:text-accent transition-colors"
              aria-label="Carrinho de compras"
            >
              <CartIcon size={22} />
              {cartCount > 0 && (
                <Badge variant="counter" className="absolute -top-1 -right-1">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <MobileNav cartCount={cartCount} />
          </div>
        </div>
      </div>
      <Separator variant="hairline" />
    </header>
  );
}
