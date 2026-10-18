import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { NftSummaryDTO } from "@/contracts";
import heroFallback from "@/assets/hero.png";

const BLOG_IMAGES = [
  "/assets/blog/blog-1.png",
  "/assets/blog/blog-2.png",
  "/assets/blog/blog-3.png",
  "/assets/blog/blog-4.png",
];

const getImageForNft = (id: string, index?: number): string => {
  if (typeof index === "number") {
    return BLOG_IMAGES[Math.abs(index) % BLOG_IMAGES.length];
  }
  const match = id.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    return BLOG_IMAGES[(num - 1) % BLOG_IMAGES.length];
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % BLOG_IMAGES.length;
  }
  return BLOG_IMAGES[hash];
};

interface NftCardProps {
  nft: NftSummaryDTO;
  index?: number;
  isHighlight?: boolean;
}

export const NftCard: React.FC<NftCardProps> = ({
  nft,
  index,
  isHighlight,
}) => {
  const chosenImage = getImageForNft(nft.id, index);
  const [imgSrc, setImgSrc] = useState(chosenImage);

  return (
    <article
      data-testid={`nft-card-${nft.id}`}
      className={`group font-mono text-left transition-all duration-500 rounded-[14px] ${
        isHighlight
          ? "ring-2 ring-primary bg-primary/10 p-1.5 shadow-[0_0_20px_rgba(210,138,76,0.6)] animate-pulse"
          : ""
      }`}
    >
      <Link
        to="/nft/$id"
        params={{ id: nft.id }}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[14px]"
      >
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

        <h3 className="mt-3 text-[16px] text-foreground font-normal truncate group-hover:text-accent transition-colors">
          {nft.title}
        </h3>

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
