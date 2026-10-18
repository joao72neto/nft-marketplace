import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const NftCardSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="font-mono text-left">
      <Skeleton className="aspect-square w-full rounded-[14px]" />

      <Skeleton className="h-4 w-3/4 mt-3" />

      <Skeleton className="h-4 w-1/3 mt-2" />
    </div>
  );
};
