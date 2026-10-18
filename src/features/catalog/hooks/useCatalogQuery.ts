import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { NftQueryParams } from "@/contracts";
import { getCatalogNfts } from "../api";

export function useCatalogQuery(params: NftQueryParams) {
  return useQuery({
    queryKey: ["nfts", params],
    queryFn: ({ signal }) => getCatalogNfts(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });
}
