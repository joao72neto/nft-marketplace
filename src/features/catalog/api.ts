import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse, NftSummaryDTO, NftQueryParams } from "@/contracts";

export async function getCatalogNfts(
  params: NftQueryParams,
  signal?: AbortSignal,
): Promise<PaginatedResponse<NftSummaryDTO>> {
  const response = await apiClient.get<PaginatedResponse<NftSummaryDTO>>("/nfts", {
    params,
    signal,
  });
  return response.data;
}
