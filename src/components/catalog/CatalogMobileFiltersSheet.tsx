import React from "react";
import type { NftCategory, NftStatus } from "@/contracts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CatalogSidebarFilters } from "./CatalogSidebarFilters";
import { Button } from "@/components/ui/button";

interface CatalogMobileFiltersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: NftCategory | undefined;
  onCategoryChange: (category: NftCategory | undefined) => void;
  selectedStatus: NftStatus | undefined;
  onStatusChange: (status: NftStatus | undefined) => void;
  priceMin: string | undefined;
  priceMax: string | undefined;
  onPriceChange: (min: string | undefined, max: string | undefined) => void;
  onClearFilters: () => void;
  totalResultsCount?: number;
}

export const CatalogMobileFiltersSheet: React.FC<CatalogMobileFiltersSheetProps> = ({
  open,
  onOpenChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  priceMin,
  priceMax,
  onPriceChange,
  onClearFilters,
  totalResultsCount,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[310px] sm:w-[350px] p-0 flex flex-col justify-between font-mono bg-surface-card"
      >
        <div className="overflow-y-auto p-5">
          <SheetHeader className="pb-4 border-b border-border-dark text-left">
            <SheetTitle className="text-base font-bold text-foreground tracking-wider uppercase">
              Filtrar Catálogo
            </SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <CatalogSidebarFilters
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              selectedStatus={selectedStatus}
              onStatusChange={onStatusChange}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceChange={onPriceChange}
              onClearFilters={onClearFilters}
            />
          </div>
        </div>

        <div className="p-4 border-t border-border-dark bg-ink/90 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClearFilters}
            className="flex-1 text-xs"
          >
            Limpar
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-xs font-bold"
          >
            Ver {totalResultsCount !== undefined ? `(${totalResultsCount})` : "Resultados"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
