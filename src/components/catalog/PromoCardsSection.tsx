import React from "react";
import { Link } from "@tanstack/react-router";

export const PromoCardsSection: React.FC = () => {
  return (
    <section
      aria-label="Campanhas Promocionais"
      className="py-12 lg:py-16 font-mono text-left"
    >
      <div className="container max-w-300 mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border-dark bg-surface-card p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-full sm:w-[200px] h-[200px] shrink-0 rounded-xl overflow-hidden bg-ink">
              <img
                src="/assets/promo/promo-genesis.png"
                alt="Lançamentos gênesis de edição limitada"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full space-y-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                  Lançamentos gênesis <br className="hidden sm:inline" /> de
                  edição limitada
                </h3>
                <p className="text-xs text-secondary-text leading-relaxed mt-2">
                  Colecione edições escassas diretamente dos criadores antes da
                  revelação pública.
                </p>
              </div>
              <div>
                <Link
                  to="/mercado"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary hover:bg-accent text-ink font-bold text-xs tracking-wide transition-colors"
                >
                  <span>Explorar</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border-dark bg-surface-card p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="w-full sm:w-[200px] h-[200px] shrink-0 rounded-xl overflow-hidden bg-ink">
              <img
                src="/assets/promo/promo-curated.png"
                alt="Arte digital selecionada e muito mais"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between h-full space-y-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                  Arte digital selecionada <br className="hidden sm:inline" /> e
                  muito mais
                </h3>
                <p className="text-xs text-secondary-text leading-relaxed mt-2">
                  Explore novos artistas, coleções verificadas e obras digitais
                  que definem a cultura.
                </p>
              </div>
              <div>
                <Link
                  to="/mercado"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary hover:bg-accent text-ink font-bold text-xs tracking-wide transition-colors"
                >
                  <span>Explorar</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
