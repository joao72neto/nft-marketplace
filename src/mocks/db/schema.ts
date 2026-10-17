import type {
  CartItemDTO,
  OrderReceiptDTO,
  WalletDTO,
  UserProfileDTO,
  NftDetailDTO,
} from "@/contracts";
import type { MockUserRecord } from "../fixtures/users";

export interface UserPrivateState {
  favorites: string[]; // IDs dos NFTs favoritados
  cart: {
    items: CartItemDTO[];
    couponCode: string | null;
    updatedAt: string;
  };
  wallets: WalletDTO[];
  orders: OrderReceiptDTO[];
  profile: UserProfileDTO;
}

export interface GuestState {
  cart: {
    items: CartItemDTO[];
    couponCode: string | null;
    updatedAt: string;
  };
}

export interface GlobalMockCatalogState {
  nfts: NftDetailDTO[];
  users: MockUserRecord[];
}
