import type { EthAmount } from "./common";

export interface BaseSocketEvent<TResource extends string, TData> {
  eventId: string;
  resource: TResource;
  resourceId: string;
  version: number;
  timestamp: string;
  data: TData;
}

export type NftUpdatedEvent = BaseSocketEvent<
  "nft",
  {
    priceEth: EthAmount;
    availableEditions: number;
    totalEditions: number;
    isAvailable: boolean;
  }
>;

export type AuthSessionExpiredEvent = BaseSocketEvent<
  "auth",
  {
    reason: string;
  }
>;
