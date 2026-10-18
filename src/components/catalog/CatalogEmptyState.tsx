import React from "react";
import { Button } from "@/components/ui/button";

interface CatalogEmptyStateProps {
  onClearFilters: () => void;
}

export const CatalogEmptyState: React.FC<CatalogEmptyStateProps> = ({
  onClearFilters,
}) => {
  return (
    <div
      role="region"
      aria-label="Nenhum resultado encontrado"
      className="w-full rounded-2xl border border-dashed border-border-dark bg-surface-card/40 p-8 sm:p-14 text-center font-mono space-y-4"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-surface-card border border-border-dark flex items-center justify-center text-2xl">
        🔍
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          Nenhum NFT encontrado
        </h3>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
          Não localizamos nenhuma obra correspondente aos filtros e parâmetros
          aplicados. Tente ajustar os termos de busca ou redefinir os filtros.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onClearFilters}
          className="text-xs font-bold px-6"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};
