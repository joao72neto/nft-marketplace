import React, { useState } from "react";
import type { NftCategory, NftStatus } from "@/contracts";

export interface CatalogSidebarFiltersProps {
  selectedCategory?: NftCategory | string | undefined;
  onCategoryChange: (category: NftCategory | undefined) => void;
  selectedStatus?: NftStatus | undefined;
  onStatusChange?: (status: NftStatus | undefined) => void;
  selectedNetwork?: string | undefined;
  onNetworkChange?: (network: string | undefined) => void;
  priceMin?: string | undefined;
  priceMax?: string | undefined;
  onPriceChange: (min: string | undefined, max: string | undefined) => void;
  onClearFilters: () => void;
}

interface FilterItem {
  label: string;
  value: string;
  count: number;
}

const COLLECTIONS_LIST: FilterItem[] = [
  { label: "Arte digital", value: "art", count: 33 },
  { label: "Fotografia", value: "photography", count: 12 },
  { label: "Música", value: "music", count: 65 },
  { label: "Arte 3D", value: "3d", count: 39 },
  { label: "Colecionáveis", value: "collectibles", count: 23 },
  { label: "Generativa", value: "generative", count: 17 },
  { label: "Jogos", value: "games", count: 19 },
  { label: "Assinaturas", value: "subscriptions", count: 13 },
  { label: "Utilidade", value: "utility", count: 18 },
];

const NETWORKS_LIST: FilterItem[] = [
  { label: "Ethereum", value: "ethereum", count: 119 },
  { label: "Polygon", value: "polygon", count: 78 },
  { label: "Solana", value: "solana", count: 86 },
];

const MIN_LIMIT = 0.01;
const MAX_LIMIT = 20.0;

export const CatalogSidebarFilters: React.FC<CatalogSidebarFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedNetwork,
  onNetworkChange,
  priceMin,
  priceMax,
  onPriceChange,
  onClearFilters,
}) => {
  const [internalNetwork, setInternalNetwork] = useState<string | undefined>(
    selectedNetwork,
  );

  const [sliderMin, setSliderMin] = useState<number>(() => {
    const parsed = Number(priceMin);
    return !isNaN(parsed) && parsed >= MIN_LIMIT ? parsed : 0.02;
  });

  const [sliderMax, setSliderMax] = useState<number>(() => {
    const parsed = Number(priceMax);
    return !isNaN(parsed) && parsed <= MAX_LIMIT ? parsed : 12.3;
  });

  const [prevPriceMin, setPrevPriceMin] = useState(priceMin);
  const [prevPriceMax, setPrevPriceMax] = useState(priceMax);

  if (priceMin !== prevPriceMin) {
    setPrevPriceMin(priceMin);
    const parsed = Number(priceMin);
    setSliderMin(!isNaN(parsed) && parsed >= MIN_LIMIT ? parsed : 0.02);
  }

  if (priceMax !== prevPriceMax) {
    setPrevPriceMax(priceMax);
    const parsed = Number(priceMax);
    setSliderMax(!isNaN(parsed) && parsed <= MAX_LIMIT ? parsed : 12.3);
  }

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), sliderMax - 0.01);
    setSliderMin(Number(val.toFixed(2)));
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), sliderMin + 0.01);
    setSliderMax(Number(val.toFixed(2)));
  };

  const handleApplyPrice = () => {
    onPriceChange(sliderMin.toFixed(2), sliderMax.toFixed(2));
  };

  const handleNetworkSelect = (val: string) => {
    const nextVal = (selectedNetwork || internalNetwork) === val ? undefined : val;
    setInternalNetwork(nextVal);
    onNetworkChange?.(nextVal);
  };

  const handleCategorySelect = (val: string) => {
    if (selectedCategory === val) {
      onCategoryChange(undefined);
    } else {
      onCategoryChange(val as NftCategory);
    }
  };

  const formatEth = (val: number) => {
    return val.toFixed(2).replace(".", ",");
  };

  const minPercent = Math.max(
    0,
    Math.min(100, ((sliderMin - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100),
  );
  const maxPercent = Math.max(
    0,
    Math.min(100, ((sliderMax - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100),
  );

  const hasActiveFilters = Boolean(
    selectedCategory ||
      (priceMin && priceMin !== "0.02") ||
      (priceMax && priceMax !== "12.30") ||
      internalNetwork,
  );

  return (
    <aside
      aria-label="Filtros do catálogo"
      className="w-full lg:w-[310px] shrink-0 bg-surface-card rounded-2xl p-6 space-y-7 font-mono text-left"
    >
      {/* Seção Coleções */}
      <div>
        <h3 className="text-[18px] font-bold text-foreground tracking-tight mb-2">
          Coleções
        </h3>
        <div className="space-y-0.5">
          {COLLECTIONS_LIST.map((item) => {
            const isSelected = selectedCategory === item.value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleCategorySelect(item.value)}
                className={`w-full flex items-center justify-between h-10 text-[15px] transition-colors ${
                  isSelected
                    ? "text-accent font-bold"
                    : "text-secondary-text hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={
                    isSelected ? "text-accent font-bold" : "text-secondary-text"
                  }
                >
                  ({item.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção Faixa de preço */}
      <div className="space-y-4 pt-1">
        <h3 className="text-[18px] font-bold text-foreground tracking-tight">
          Faixa de preço
        </h3>

        {/* Dual Slider interativo com track e div redonda com bg-primary */}
        <div className="relative w-full h-6 flex items-center">
          {/* Track de fundo */}
          <div className="absolute w-full h-[3px] bg-primary/20 rounded-full" />

          {/* Track ativo colorido */}
          <div
            className="absolute h-[3px] bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />

          {/* Indicadores visuais: div redonda pintada com primary */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-surface-card shadow pointer-events-none transition-transform"
            style={{ left: `${minPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-surface-card shadow pointer-events-none transition-transform"
            style={{ left: `${maxPercent}%` }}
          />

          {/* Inputs range para controle e acessibilidade */}
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={0.01}
            value={sliderMin}
            onChange={handleMinSliderChange}
            aria-label="Preço mínimo em ETH"
            className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 z-20"
          />
          <input
            type="range"
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={0.01}
            value={sliderMax}
            onChange={handleMaxSliderChange}
            aria-label="Preço máximo em ETH"
            className="absolute w-full h-full opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 z-20"
          />
        </div>

        {/* Texto do valor */}
        <p className="text-[15px] text-foreground tracking-wide">
          Preço: {formatEth(sliderMin)} - {formatEth(sliderMax)} ETH
        </p>

        {/* Botão Aplicar */}
        <div>
          <button
            type="button"
            onClick={handleApplyPrice}
            className="px-5 py-2 rounded-md bg-primary hover:bg-accent text-ink font-bold text-sm tracking-wide transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Seção Rede */}
      <div className="pt-1">
        <h3 className="text-[18px] font-bold text-foreground tracking-tight mb-2">
          Rede
        </h3>
        <div className="space-y-0.5">
          {NETWORKS_LIST.map((item) => {
            const currentNetwork = selectedNetwork || internalNetwork;
            const isSelected = currentNetwork === item.value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNetworkSelect(item.value)}
                className={`w-full flex items-center justify-between h-10 text-[15px] transition-colors ${
                  isSelected
                    ? "text-accent font-bold"
                    : "text-secondary-text hover:text-foreground"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={
                    isSelected ? "text-accent font-bold" : "text-secondary-text"
                  }
                >
                  ({item.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opção para limpar filtros ativos quando houver */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setInternalNetwork(undefined);
              setSliderMin(0.02);
              setSliderMax(12.3);
              onClearFilters();
            }}
            className="text-xs text-primary hover:text-accent hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </aside>
  );
};

