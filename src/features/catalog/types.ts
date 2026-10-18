import type { NftCategory, NftSortOption, NftStatus } from "@/contracts";

export interface CatalogSearchParams {
  search?: string;
  category?: NftCategory;
  status?: NftStatus;
  priceMin?: string;
  priceMax?: string;
  sort?: NftSortOption;
  page?: number;
}
