import type { EthAmount } from "./common";

export interface CartItemDTO {
  id: string;
  nftId: string;
  edition: number;
  quantity: number;
  priceEth: EthAmount;
  title: string;
  collection: string;
  imageUrl: string;
  availableEditions: number;
}

export interface CartDTO {
  items: CartItemDTO[];
  couponCode: string | null;
  updatedAt: string;
}

export interface AddToCartRequest {
  nftId: string;
  edition: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
