import type { EthAmount } from "./common";

export type NftCategory = "novos-lancamentos" | "em-alta";

export type NftStatus = "all" | "on_sale" | "last_editions" | "sold_out";

export type NftSortOption =
  "price_asc" | "price_desc" | "recently_listed" | "most_viewed";

export interface NftAttributeDTO {
  traitType: string;
  value: string;
}

export interface NftEditionDTO {
  editionNumber: number;
  isAvailable: boolean;
  ownerAddress?: string;
}

export interface NftSummaryDTO {
  id: string;
  title: string;
  collection: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  priceEth: EthAmount;
  previousPriceEth?: EthAmount;
  category: NftCategory;
  availableEditions: number;
  totalEditions: number;
  isAvailable: boolean;
  version: number;
  viewsCount: number;
  createdAt: string;
}

export interface NftDetailDTO extends NftSummaryDTO {
  description: string;
  contractAddress: string;
  blockchain: string;
  tokenStandard: string;
  attributes: NftAttributeDTO[];
  editions: NftEditionDTO[];
}

export interface NftQueryParams {
  search?: string;
  category?: NftCategory | "all";
  status?: NftStatus;
  priceMin?: EthAmount;
  priceMax?: EthAmount;
  sort?: NftSortOption;
  page?: number;
  limit?: number;
}
