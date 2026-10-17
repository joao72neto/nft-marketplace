import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon, LogoutIcon, CartIcon } from "@/components/icons";

interface MobileNavProps {
  cartCount?: number;
}

export function MobileNav({ cartCount = 0 }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Mercado", href: "/mercado" },
    { label: "Criadores", href: "/criadores" },
    { label: "Aprenda", href: "/aprenda" },
  ];

  const userLinks = [
    { label: "Meu Perfil", href: "/perfil" },
    { label: "Minhas Carteiras", href: "/carteiras" },
    {
      label: "Carrinho",
      href: "/carrinho",
      badge: cartCount > 0 ? cartCount : undefined,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-11 w-11 min-h-11 min-w-11 text-foreground hover:text-primary"
          aria-label="Abrir menu de navegação"
        >
          <MenuIcon size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-75 sm:w-87.5 flex flex-col justify-between"
      >
        <div>
          <SheetHeader className="pb-6 border-b border-border-dark text-left">
            <SheetTitle className="font-mono text-xl font-bold tracking-widest text-foreground">
              KURIO
            </SheetTitle>
          </SheetHeader>

          <nav
            className="flex flex-col py-6 space-y-1"
            aria-label="Navegação mobile principal"
          >
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center min-h-11 px-3 py-2 text-base font-mono rounded-md transition-colors ${
                    isActive
                      ? "text-accent font-bold bg-surface-raised"
                      : "text-foreground hover:text-accent hover:bg-surface-raised/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border-dark">
            <span className="text-xs font-mono uppercase tracking-wider text-secondary-text px-3 mb-2 block">
              Minha Conta
            </span>
            <div className="flex flex-col space-y-1">
              {userLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between min-h-11 px-3 py-2 text-sm font-mono text-foreground hover:text-accent hover:bg-surface-raised/40 rounded-md transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {item.label === "Carrinho" && <CartIcon size={18} />}
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className="h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-ink text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-dark">
          <Button
            asChild
            variant="primary"
            size="lg"
            className="w-full justify-center"
          >
            <Link to="/login" onClick={() => setOpen(false)}>
              <LogoutIcon size={18} />
              <span>Entrar</span>
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
