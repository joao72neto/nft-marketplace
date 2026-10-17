import type { NftSummaryDTO } from "./nft";

export interface FavoriteItemDTO {
  nftId: string;
  nft: NftSummaryDTO;
  addedAt: string;
}

export interface ToggleFavoriteResponse {
  nftId: string;
  isFavorite: boolean;
}
