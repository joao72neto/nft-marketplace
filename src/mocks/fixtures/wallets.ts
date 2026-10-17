import type { WalletDTO } from "@/contracts";

export const INITIAL_USER_WALLETS: Record<string, WalletDTO[]> = {
  usr_alice: [
    {
      id: "wlt_alice_1",
      provider: "metamask",
      address: "0x71C836e4922e921b7736413a2aC4D5aDb2849A1",
      network: "Ethereum Mainnet",
      balanceEth: "4.5000",
      isPrimary: true,
    },
    {
      id: "wlt_alice_2",
      provider: "coinbase",
      address: "0x34B2931aC384812893812C4119028471289199C2",
      network: "Polygon",
      balanceEth: "1.2500",
      isPrimary: false,
    },
  ],
  usr_bob: [],
};
