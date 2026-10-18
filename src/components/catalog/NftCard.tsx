import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { NftSummaryDTO } from "@/contracts";
import heroFallback from "@/assets/hero.png";

interface NftCardProps {
  nft: NftSummaryDTO;
}

export const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const [imgSrc, setImgSrc] = useState(nft.imageUrl || heroFallback);

  return (
    <article
      data-testid={`nft-card-${nft.id}`}
      className="group font-mono text-left"
    >
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[14px]"
      >
        {/* Imagem do NFT com proporção reservada e bordas arredondadas */}
        <div className="relative aspect-square w-full rounded-[14px] overflow-hidden bg-surface-card">
          <img
            src={imgSrc}
            alt={nft.title}
            onError={() => setImgSrc(heroFallback)}
            loading="lazy"
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Título do NFT */}
        <h3 className="mt-3 text-[16px] text-foreground font-normal truncate group-hover:text-accent transition-colors">
          {nft.title}
        </h3>

        {/* Preço em ETH e Preço anterior riscado se houver */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[16px] font-bold text-accent">
            {nft.priceEth} ETH
          </span>
          {nft.previousPriceEth && (
            <span className="text-[16px] font-normal text-secondary line-through">
              {nft.previousPriceEth} ETH
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};

