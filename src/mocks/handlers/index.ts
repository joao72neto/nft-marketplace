import { authHandlers } from "./auth.handlers";
import { nftHandlers } from "./nft.handlers";
import { favoritesHandlers } from "./favorites.handlers";
import { cartHandlers } from "./cart.handlers";
import { orderHandlers } from "./order.handlers";
import { profileHandlers } from "./profile.handlers";
import { walletHandlers } from "./wallet.handlers";
import { devHandlers } from "./dev.handlers";

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
  ...devHandlers,
];
