import React, { useState, useEffect } from "react";
import type { NftCategory, NftSortOption } from "@/contracts";
import { Button } from "@/components/ui/button";

interface CatalogToolbarProps {
  searchQuery: string;
  onSearchChange: (search: string) => void;
  selectedCategory: NftCategory | undefined;
  onCategoryChange: (category: NftCategory | undefined) => void;
  selectedSort: NftSortOption | undefined;
  onSortChange: (sort: NftSortOption) => void;
  onOpenMobileFilters: () => void;
  activeFiltersCount: number;
}

const CATEGORIES: { label: string; value: NftCategory | undefined }[] = [
  { label: "Todos os NFTs", value: undefined },
  { label: "Novos lançamentos", value: "novos-lancamentos" },
  { label: "Em alta", value: "em-alta" },
];

const SORT_OPTIONS: { label: string; value: NftSortOption }[] = [
  { label: "Listados recentemente", value: "recently_listed" },
  { label: "Menor preço", value: "price_asc" },
  { label: "Maior preço", value: "price_desc" },
  { label: "Mais populares", value: "most_viewed" },
];

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort = "recently_listed",
  onSortChange,
  onOpenMobileFilters,
  activeFiltersCount,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalSearch(searchQuery);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, onSearchChange]);

  return (
    <div className="space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 border-border-dark bg-surface-card hover:bg-surface-raised h-11 px-4 text-xs font-bold"
          >
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="h-5 min-w-5 px-1 rounded-full bg-primary text-ink text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary border-b border-primary font-bold shadow-md"
                    : " hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline">Ordenar por:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value as NftSortOption)}
            className="h-11 px-3 rounded-md border border-border-dark bg-surface-card text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
            aria-label="Critério de ordenação"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
