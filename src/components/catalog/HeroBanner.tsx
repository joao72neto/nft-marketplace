import React from "react";
import { Button } from "@/components/ui/button";

export const HeroBanner: React.FC = () => {
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById("catalogo");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Destaque principal da Kurio"
      className="relative pt-6 pb-12 lg:py-16 font-mono overflow-hidden"
    >
      <div className="container max-w-300 mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="block mb-5">Bem-vindo à Kurio</span>

            <h1 className="text-3xl sm:text-4xl lg:text-[43px] font-bold text-foreground leading-[1.2] lg:leading-13 tracking-tight">
              SEJA DONO DO FUTURO DIGITAL
            </h1>

            <p className="text-sm sm:text-base text-secondary-text max-w-xl leading-relaxed">
              Descubra, colecione e negocie NFTs exclusivos de criadores
              renomados em nossa plataforma descentralizada e segura.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleScrollToCatalog}
                className="h-12 px-8 text-base font-bold tracking-wider"
              >
                EXPLORAR
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-ink border border-border-dark mb-4">
              <img
                src="/assets/blog/blog-2.png"
                alt="Cyber Ape #1042 - Coleção Destaque"
                className="w-full h-full object-cover"
                loading="eager"
                width={420}
                height={420}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
