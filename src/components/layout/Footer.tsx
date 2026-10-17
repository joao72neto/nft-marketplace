import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  UnionIcon,
  MetaMaskIcon,
  CoinbaseIcon,
  WalletConnectIcon,
} from "@/components/icons";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.ChangeEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-card border-t border-border-dark mt-auto text-foreground font-mono">
      {/* Bloco 1: Benefícios e Newsletter */}
      <div className="container max-w-300 mx-auto px-4 lg:px-0 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Benefícios de Confiança */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground">
                Segurança Total
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Custódia descentralizada e smart contracts auditados para
                transações seguras.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground">
                Criadores Reais
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Curadoria de artistas globais com verificação de autenticidade
                on-chain.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground">
                Alertas Exclusivos
              </h4>
              <p className="text-xs text-secondary-text leading-relaxed">
                Notificações instantâneas de novos drops, leilões e
                movimentações do mercado.
              </p>
            </div>
          </div>

          {/* Formulário de Newsletter */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-base font-bold text-foreground">
              Receba os lançamentos semanais
            </h4>
            <p className="text-xs text-secondary-text">
              Inscreva-se para receber atualizações de coleções raras antes do
              mercado geral.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-md bg-primary/10 border border-primary text-xs text-accent font-bold">
                ✓ Inscrição confirmada com sucesso!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Endereço de e-mail para newsletter"
                    className="bg-surface-dark border-border-dark focus-visible:border-primary text-xs h-11"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="h-11 px-5 text-xs font-bold"
                >
                  Enviar
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Bloco 2: Faixa Institucional de Contato */}
      <div className="bg-surface-dark py-8">
        <div className="container max-w-300 mx-auto px-4 lg:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-lg font-bold tracking-widest text-foreground">
                KURIO
              </span>
              <p className="text-xs text-secondary-text">
                O marketplace definitivo para colecionáveis digitais e obras
                raras.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-secondary-text">
              <span>contato@kurio.art</span>
              <span className="hidden sm:inline">•</span>
              <span>+55 11 4002-8922</span>
              <span className="hidden sm:inline">•</span>
              <span>Suporte 24/7 On-chain</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bloco 3: Colunas de Links, Redes Sociais e Carteiras */}
      <div className="container max-w-300 mx-auto px-4 lg:px-0 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">
              Meu Perfil
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/perfil"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Meus Colecionáveis
                </Link>
              </li>
              <li>
                <Link
                  to="/carteiras"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Minhas Carteiras
                </Link>
              </li>
              <li>
                <Link
                  to="/carrinho"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Carrinho de Compras
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">
              Explorar
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Todos os NFTs
                </Link>
              </li>
              <li>
                <Link
                  to="/mercado"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Mercado Secundário
                </Link>
              </li>
              <li>
                <Link
                  to="/criadores"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Criadores Verificados
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">
              Institucional
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/aprenda"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Guia do Colecionador
                </Link>
              </li>
              <li>
                <a
                  href="#termos"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#privacidade"
                  className="text-secondary-text hover:text-foreground transition-colors py-1 block"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-primary">
              Comunidade
            </h5>
            <p className="text-xs text-secondary-text">
              Participe das discussões e acompanhe novidades.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-10 w-10 min-h-11 min-w-11 rounded border border-border-dark bg-surface-dark text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook da Kurio"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-10 w-10 min-h-11 min-w-11 rounded border border-border-dark bg-surface-dark text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram da Kurio"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-10 w-10 min-h-11 min-w-11 rounded border border-border-dark bg-surface-dark text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="X (Twitter) da Kurio"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-10 w-10 min-h-11 min-w-11 rounded border border-border-dark bg-surface-dark text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="LinkedIn da Kurio"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href="#union"
                className="flex items-center justify-center h-10 w-10 min-h-11 min-w-11 rounded border border-border-dark bg-surface-dark text-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Comunidade Kurio Union"
              >
                <UnionIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé Final com Carteiras e Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border-dark">
          {/* Badge de Carteiras */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-border-soft bg-surface-dark text-[10px] uppercase tracking-wider text-secondary-text">
            <span className="font-bold text-foreground">
              Carteiras Suportadas:
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MetaMaskIcon size={14} /> MetaMask
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <WalletConnectIcon size={14} /> WalletConnect
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CoinbaseIcon size={14} /> Coinbase
              </span>
            </div>
          </div>

          <p className="text-xs text-secondary-color text-center md:text-right">
            © 2026 KURIO. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
