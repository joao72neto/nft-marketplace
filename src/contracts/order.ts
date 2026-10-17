import type { EthAmount } from "./common";

export type OrderStatus = "pending" | "confirmed" | "refused";

export interface OrderItemSnapshotDTO {
  nftId: string;
  title: string;
  collection: string;
  imageUrl: string;
  edition: number;
  quantity: number;
  priceEth: EthAmount;
}

export interface CreateOrderRequest {
  items: Array<{
    nftId: string;
    edition: number;
    quantity: number;
    priceEth: EthAmount;
  }>;
  walletId: string;
  network: string;
  quoteExpiresAt?: string;
  totalEth: EthAmount;
}

export interface OrderReceiptDTO {
  id: string;
  status: OrderStatus;
  txHash: string;
  idempotencyKey: string;
  items: OrderItemSnapshotDTO[];
  subtotalEth: EthAmount;
  discountEth: EthAmount;
  networkFeeEth: EthAmount;
  totalEth: EthAmount;
  walletAddress: string;
  network: string;
  createdAt: string;
  version: number;
  failureReason?: string | null;
}
