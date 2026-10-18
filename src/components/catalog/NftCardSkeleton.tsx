import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const NftCardSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="font-mono text-left">
      {/* Imagem Placeholder com bordas arredondadas */}
      <Skeleton className="aspect-square w-full rounded-[14px]" />

      {/* Título Placeholder */}
      <Skeleton className="h-4 w-3/4 mt-3" />

      {/* Preço Placeholder */}
      <Skeleton className="h-4 w-1/3 mt-2" />
    </div>
  );
};

