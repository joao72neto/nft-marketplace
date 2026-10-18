import { authHandlers } from "./auth.handlers";
import { nftHandlers } from "./nft.handlers";

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
];
