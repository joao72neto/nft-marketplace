import type { EthAmount } from "./common";

export interface CouponDTO {
  code: string;
  discountPercentage: number;
  isValid: boolean;
  expiresAt: string;
}

export interface QuoteItemRequest {
  nftId: string;
  edition: number;
  quantity: number;
}

export interface QuoteRequest {
  items: QuoteItemRequest[];
  couponCode?: string | null;
}

export interface QuoteResponse {
  subtotalEth: EthAmount;
  discountEth: EthAmount;
  networkFeeEth: EthAmount;
  totalEth: EthAmount;
  coupon: CouponDTO | null;
  expiresAt: string;
}
