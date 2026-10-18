import React, { useState, useMemo } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import type {
  NftCategory,
  NftSortOption,
  NftStatus,
  NftQueryParams,
} from "@/contracts";
import type { CatalogSearchParams } from "@/features/catalog/types";
import { useCatalogQuery } from "@/features/catalog/hooks/useCatalogQuery";
import { HeroBanner } from "@/components/catalog/HeroBanner";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { CatalogSidebarFilters } from "@/components/catalog/CatalogSidebarFilters";
import { CatalogMobileFiltersSheet } from "@/components/catalog/CatalogMobileFiltersSheet";
import { NftCard } from "@/components/catalog/NftCard";
import { NftCardSkeleton } from "@/components/catalog/NftCardSkeleton";
import { CatalogEmptyState } from "@/components/catalog/CatalogEmptyState";
import { CatalogErrorState } from "@/components/catalog/CatalogErrorState";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { PromoCardsSection } from "@/components/catalog/PromoCardsSection";
import { MintDiaryBlogSection } from "@/components/catalog/MintDiaryBlogSection";

export const HomePage: React.FC = () => {
  const routerState = useRouterState();
  const navigate = useNavigate();

  const searchParams = useMemo<CatalogSearchParams>(() => {
    const rawSearch = routerState.location.search as Record<string, unknown>;
    return {
      search:
        typeof rawSearch.search === "string" ? rawSearch.search : undefined,
      category:
        typeof rawSearch.category === "string"
          ? (rawSearch.category as NftCategory)
          : undefined,
      status:
        typeof rawSearch.status === "string"
          ? (rawSearch.status as NftStatus)
          : undefined,
      priceMin:
        typeof rawSearch.priceMin === "string" ? rawSearch.priceMin : undefined,
      priceMax:
        typeof rawSearch.priceMax === "string" ? rawSearch.priceMax : undefined,
      sort:
        typeof rawSearch.sort === "string"
          ? (rawSearch.sort as NftSortOption)
          : undefined,
      page: rawSearch.page ? Number(rawSearch.page) : undefined,
    };
  }, [routerState.location.search]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parâmetros consolidados
  const queryParams: NftQueryParams = {
    search: searchParams.search || undefined,
    category: searchParams.category || undefined,
    status: searchParams.status || undefined,
    priceMin: searchParams.priceMin || undefined,
    priceMax: searchParams.priceMax || undefined,
    sort: searchParams.sort || "recently_listed",
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 8,
  };

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useCatalogQuery(queryParams);

  const updateSearch = (
    newParams: Partial<CatalogSearchParams>,
    resetPage = true,
  ) => {
    const current = (routerState.location.search || {}) as CatalogSearchParams;
    const next: CatalogSearchParams = {
      ...current,
      ...newParams,
    };
    if (resetPage) {
      delete next.page;
    }
    (Object.keys(next) as (keyof CatalogSearchParams)[]).forEach((key) => {
      if (
        next[key] === undefined ||
        next[key] === "" ||
        (key === "page" && next[key] === 1)
      ) {
        delete next[key];
      }
    });

    navigate({
      to: "/",
      search: next,
    });
  };

  const handleSearchChange = (search: string) => {
    updateSearch({ search: search.trim() || undefined });
  };

  const handleCategoryChange = (category: NftCategory | undefined) => {
    updateSearch({ category });
  };

  const handleStatusChange = (status: NftStatus | undefined) => {
    updateSearch({ status });
  };

  const handlePriceChange = (
    priceMin: string | undefined,
    priceMax: string | undefined,
  ) => {
    updateSearch({ priceMin, priceMax });
  };

  const handleSortChange = (sort: NftSortOption) => {
    updateSearch({ sort }, false);
  };

  const handlePageChange = (page: number) => {
    updateSearch({ page }, false);
    const el = document.getElementById("catalogo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    navigate({
      to: "/",
      search: {},
    });
    setIsMobileFiltersOpen(false);
  };

  const activeFiltersCount = [
    searchParams.category,
    searchParams.status,
    searchParams.priceMin || searchParams.priceMax,
  ].filter(Boolean).length;

  return (
    <div className="space-y-12 lg:space-y-16">
      <HeroBanner />

      <section
        id="catalogo"
        aria-label="Catálogo de NFTs"
        className="container max-w-300 mx-auto px-4 lg:px-0 space-y-8 scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="hidden lg:block shrink-0 space-y-8">
            <CatalogSidebarFilters
              selectedCategory={searchParams.category}
              onCategoryChange={handleCategoryChange}
              selectedStatus={searchParams.status}
              onStatusChange={handleStatusChange}
              priceMin={searchParams.priceMin}
              priceMax={searchParams.priceMax}
              onPriceChange={handlePriceChange}
              onClearFilters={handleClearFilters}
            />

            <div className="w-full lg:w-77.5 space-y-3 font-mono text-left">
              <div className="space-y-0.5">
                <span className="text-[14px] font-bold tracking-wider text-accent block">
                  NFT EM DESTAQUE
                </span>
                <h4 className="text-[14px] font-bold tracking-wider text-foreground block">
                  OFERTA LIMITADA
                </h4>
              </div>
              <div className="w-full rounded-[22px] overflow-hidden bg-surface-card">
                <img
                  src="/assets/sidebar/featured-nft.png"
                  alt="NFT em Destaque - Oferta Limitada"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <CatalogToolbar
              searchQuery={searchParams.search || ""}
              onSearchChange={handleSearchChange}
              selectedCategory={searchParams.category}
              onCategoryChange={handleCategoryChange}
              selectedSort={searchParams.sort || "recently_listed"}
              onSortChange={handleSortChange}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              activeFiltersCount={activeFiltersCount}
            />

            {isPlaceholderData && (
              <div
                aria-live="polite"
                className="text-xs text-secondary font-mono flex items-center gap-1.5 justify-end"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Atualizando catálogo...</span>
              </div>
            )}

            {isError && (
              <CatalogErrorState
                message={error instanceof Error ? error.message : undefined}
                onRetry={() => refetch()}
              />
            )}

            {isLoading && !isError && (
              <div
                aria-busy="true"
                aria-label="Carregando NFTs"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <NftCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && data?.items.length === 0 && (
              <CatalogEmptyState onClearFilters={handleClearFilters} />
            )}

            {!isLoading && !isError && data && data.items.length > 0 && (
              <>
                <div
                  data-testid="nfts-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10"
                >
                  {data.items.map((nft, idx) => (
                    <NftCard key={nft.id} nft={nft} index={idx} />
                  ))}
                </div>

                <CatalogPagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>

        <CatalogMobileFiltersSheet
          open={isMobileFiltersOpen}
          onOpenChange={setIsMobileFiltersOpen}
          selectedCategory={searchParams.category}
          onCategoryChange={handleCategoryChange}
          selectedStatus={searchParams.status}
          onStatusChange={handleStatusChange}
          priceMin={searchParams.priceMin}
          priceMax={searchParams.priceMax}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
          totalResultsCount={data?.pagination.totalItems}
        />
      </section>

      <PromoCardsSection />
      <MintDiaryBlogSection />
    </div>
  );
};
