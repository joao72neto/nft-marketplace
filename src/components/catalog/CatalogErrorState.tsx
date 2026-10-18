import React from "react";
import { Button } from "@/components/ui/button";

interface CatalogErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const CatalogErrorState: React.FC<CatalogErrorStateProps> = ({
  message = "Ocorreu uma falha temporária ao carregar o catálogo de NFTs.",
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="w-full rounded-2xl border border-coral/30 bg-coral/5 p-8 sm:p-12 text-center font-mono space-y-4"
    >
      <div className="w-14 h-14 mx-auto rounded-full bg-coral/20 border border-coral/40 flex items-center justify-center text-coral text-xl font-bold">
        !
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          Falha na comunicação com o catálogo
        </h3>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
          {message}
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onRetry}
          className="text-xs font-bold px-6 border-coral/50 text-coral hover:bg-coral/10 hover:text-coral"
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};
