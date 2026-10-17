import type { EthAmount } from "./common";

export type WalletProvider = "metamask" | "coinbase" | "walletconnect";

export interface WalletDTO {
  id: string;
  provider: WalletProvider;
  address: string;
  network: string;
  balanceEth: EthAmount;
  isPrimary: boolean;
}

export interface UpdateWalletsRequest {
  primaryWallet: WalletDTO;
  secondaryWallet?: WalletDTO | null;
}
