import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "@/components/icons";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-card border-t border-border-dark mt-auto text-foreground font-mono text-left">
      <div className="container max-w-300 mx-auto px-4 lg:px-0 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary text-ink font-bold flex items-center justify-center text-sm">
              W
            </div>
            <h4 className="text-[15px] font-bold text-foreground">
              Segurança da carteira
            </h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Proteja sua carteira e colecione arte digital verificada com
              confiança.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary text-ink font-bold flex items-center justify-center text-sm">
              C
            </div>
            <h4 className="text-[15px] font-bold text-foreground">
              Criadores em destaque
            </h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Conheça artistas, estúdios e comunidades que moldam a cultura
              digital na rede.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary text-ink font-bold flex items-center justify-center text-sm">
              D
            </div>
            <h4 className="text-[15px] font-bold text-foreground">
              Alertas de lançamentos
            </h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Receba calendários de cunhagem, novidades de listas de acesso e
              análises do mercado.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[15px] font-bold text-foreground">
              Antecipe-se ao próximo lançamento
            </h4>
            {subscribed ? (
              <div className="p-2.5 rounded-md bg-primary/20 text-accent font-bold text-xs">
                ✓ E-mail cadastrado com sucesso!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="digite seu e-mail..."
                  required
                  aria-label="Digite seu e-mail"
                  className="flex-1 min-w-0 h-10 px-3 rounded-md bg-surface-dark border border-border-dark text-xs text-foreground placeholder:text-secondary-color focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-md bg-primary hover:bg-accent text-ink font-bold text-xs transition-colors shrink-0"
                >
                  Enviar
                </button>
              </form>
            )}
            <p className="text-xs text-secondary-text leading-relaxed">
              Receba lançamentos selecionados, histórias de criadores e
              novidades do mercado.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark py-6 border-y border-border-dark">
        <div className="container max-w-300 mx-auto px-4 lg:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <span className="font-bold tracking-widest text-foreground text-sm">
              KURIO
            </span>
            <span className="text-secondary-text">
              Feito para colecionadores, criadores e cultura
            </span>
            <span className="text-secondary-text">contato@email.com</span>
            <span className="text-secondary-text">+55 11 4002 8922</span>
          </div>
        </div>
      </div>

      <div className="container max-w-300 mx-auto px-4 lg:px-0 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h5 className="text-[15px] font-bold text-foreground">
              Meu perfil
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/perfil"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Meu perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Minha coleção
                </Link>
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Atividade
                </Link>
              </li>
              <li>
                <Link
                  to="/criadores"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Estúdio do criador
                </Link>
              </li>
              <li>
                <Link
                  to="/favoritos"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Lista de interesse
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[15px] font-bold text-foreground">
              Central de ajuda
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/aprenda"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Central de ajuda
                </Link>
              </li>
              <li>
                <Link
                  to="/aprenda"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Como comprar NFTs
                </Link>
              </li>
              <li>
                <Link
                  to="/carteiras"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Carteira e segurança
                </Link>
              </li>
              <li>
                <Link
                  to="/aprenda"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Política do mercado
                </Link>
              </li>
              <li>
                <Link
                  to="/aprenda"
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Denunciar item
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[15px] font-bold text-foreground">Coleções</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/"
                  search={{ category: "novos-lancamentos" }}
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Arte digital
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  search={{ category: "em-alta" }}
                  className="text-secondary-text hover:text-foreground transition-colors"
                >
                  Fotografia
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h5 className="text-[15px] font-bold text-foreground">
                Redes sociais
              </h5>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-border-dark flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-border-dark flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={14} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-border-dark flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <TwitterIcon size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-border-dark flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={14} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-border-dark flex items-center justify-center text-secondary-text hover:text-primary hover:border-primary transition-colors text-xs font-bold"
                  aria-label="YouTube"
                >
                  ▶
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-[15px] font-bold text-foreground">
                Carteiras compatíveis
              </h5>
              <div className="inline-block px-3 py-1.5 rounded-full border border-border-dark bg-surface-dark text-[9px] font-bold uppercase tracking-widest text-secondary-text">
                METAMASK &nbsp;•&nbsp; WALLETCONNECT &nbsp;•&nbsp; COINBASE
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border-dark/30 text-center">
          <p className="text-xs text-secondary-text">
            © 2026 Kurio. Propriedade digital para todos.
          </p>
        </div>
      </div>
    </footer>
  );
}
