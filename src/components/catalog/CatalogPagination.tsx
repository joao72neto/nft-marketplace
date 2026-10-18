import React from "react";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Navegação entre páginas de NFTs"
      className="flex items-center justify-end gap-2 font-mono pt-8"
    >
      {/* Botão Anterior (apenas se página > 1) */}
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="w-[35px] h-[35px] min-w-[35px] rounded-[4px] border border-border text-foreground hover:border-primary/50 text-xs font-bold flex items-center justify-center transition-colors"
          aria-label="Página anterior"
        >
          &lt;
        </button>
      )}

      {/* Lista de Páginas */}
      <div className="flex items-center gap-2">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? "page" : undefined}
              className={`w-[35px] h-[35px] min-w-[35px] rounded-[4px] text-xs font-bold flex items-center justify-center transition-colors ${
                isCurrent
                  ? "bg-primary text-ink shadow-sm"
                  : "border border-border text-foreground hover:border-primary/50 bg-transparent"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Botão Próximo */}
      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="w-[35px] h-[35px] min-w-[35px] rounded-[4px] border border-border text-foreground hover:border-primary/50 text-xs font-bold flex items-center justify-center transition-colors"
          aria-label="Próxima página"
        >
          &gt;
        </button>
      )}
    </nav>
  );
};

