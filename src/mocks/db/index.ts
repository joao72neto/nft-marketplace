import type {
  CartDTO,
  CreateOrderRequest,
  EthAmount,
  NftDetailDTO,
  NftQueryParams,
  NftSummaryDTO,
  OrderReceiptDTO,
  PaginatedResponse,
  QuoteResponse,
  UserProfileDTO,
  WalletDTO,
} from "@/contracts";
import {
  INITIAL_COUPONS,
  INITIAL_NFTS,
  INITIAL_USERS,
  INITIAL_USER_WALLETS,
  type MockUserRecord,
} from "../fixtures";
import type { GuestState, UserPrivateState } from "./schema";
import { clearMockStorage, getStoredItem, setStoredItem } from "./storage";

const CATALOG_KEY = "greenmint_mock_catalog";
const USERS_KEY = "greenmint_mock_users";
const GUEST_STATE_KEY = "greenmint_mock_guest_state";
const userStateKey = (userId: string) => `greenmint_mock_user_${userId}_state`;

// ==========================================
// Utilitários de Precisão Decimal em ETH (RN-01)
// ==========================================

export function parseEthToBigInt(ethStr: string): bigint {
  const parts = ethStr.trim().split(".");
  const integerPart = parts[0] || "0";
  let fractionalPart = parts[1] || "";
  if (fractionalPart.length > 18) {
    fractionalPart = fractionalPart.slice(0, 18);
  } else {
    fractionalPart = fractionalPart.padEnd(18, "0");
  }
  return BigInt(integerPart) * 1000000000000000000n + BigInt(fractionalPart);
}

export function formatBigIntToEth(wei: bigint): EthAmount {
  const isNegative = wei < 0n;
  const absWei = isNegative ? -wei : wei;
  const integerPart = absWei / 1000000000000000000n;
  const fractionalPart = (absWei % 1000000000000000000n)
    .toString()
    .padStart(18, "0");
  const trimmedFraction = fractionalPart.replace(/0+$/, "").slice(0, 4);
  const result =
    trimmedFraction.length > 0
      ? `${integerPart}.${trimmedFraction}`
      : integerPart.toString();
  return isNegative ? `-${result}` : result;
}

export function addEth(a: EthAmount, b: EthAmount): EthAmount {
  return formatBigIntToEth(parseEthToBigInt(a) + parseEthToBigInt(b));
}

export function multiplyEthByInt(eth: EthAmount, quantity: number): EthAmount {
  return formatBigIntToEth(parseEthToBigInt(eth) * BigInt(quantity));
}

// ==========================================
// Acesso ao Catálogo e Usuários
// ==========================================

function getCatalog(): NftDetailDTO[] {
  return getStoredItem<NftDetailDTO[]>(CATALOG_KEY, INITIAL_NFTS);
}

function saveCatalog(catalog: NftDetailDTO[]): void {
  setStoredItem(CATALOG_KEY, catalog);
}

function getUsers(): MockUserRecord[] {
  return getStoredItem<MockUserRecord[]>(USERS_KEY, INITIAL_USERS);
}

function saveUsers(users: MockUserRecord[]): void {
  setStoredItem(USERS_KEY, users);
}

export function findUserByEmail(email: string): MockUserRecord | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): MockUserRecord | undefined {
  return getUsers().find((u) => u.id === id);
}

export function addUser(user: MockUserRecord): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

// ==========================================
// Estado Privado do Usuário e Visitante (RN-13)
// ==========================================

export function getUserState(userId: string): UserPrivateState {
  const user = findUserById(userId);
  const defaultState: UserPrivateState = {
    favorites: userId === "usr_alice" ? ["nft-01", "nft-04"] : [],
    cart: { items: [], couponCode: null, updatedAt: new Date().toISOString() },
    wallets: INITIAL_USER_WALLETS[userId] || [],
    orders: [],
    profile: {
      id: userId,
      name: user?.name || "Colecionador",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || null,
      bio: user?.bio || "",
      updatedAt: user?.createdAt || new Date().toISOString(),
    },
  };

  return getStoredItem<UserPrivateState>(userStateKey(userId), defaultState);
}

export function saveUserState(userId: string, state: UserPrivateState): void {
  setStoredItem(userStateKey(userId), state);
}

export function getGuestState(): GuestState {
  const defaultGuest: GuestState = {
    cart: { items: [], couponCode: null, updatedAt: new Date().toISOString() },
  };
  return getStoredItem<GuestState>(GUEST_STATE_KEY, defaultGuest);
}

export function saveGuestState(state: GuestState): void {
  setStoredItem(GUEST_STATE_KEY, state);
}

// ==========================================
// Catálogo de NFTs (Busca, Filtros, Ordenação)
// ==========================================

export function listNfts(
  params: NftQueryParams = {},
): PaginatedResponse<NftSummaryDTO> {
  let list = [...getCatalog()];

  if (params.search && params.search.trim().length > 0) {
    const term = params.search.trim().toLowerCase();
    list = list.filter(
      (nft) =>
        nft.title.toLowerCase().includes(term) ||
        nft.collection.toLowerCase().includes(term) ||
        nft.creatorName.toLowerCase().includes(term),
    );
  }

  if (params.category && params.category !== "all") {
    list = list.filter((nft) => nft.category === params.category);
  }

  if (params.status && params.status !== "all") {
    if (params.status === "on_sale") {
      list = list.filter((nft) => nft.isAvailable && nft.availableEditions > 2);
    } else if (params.status === "last_editions") {
      list = list.filter(
        (nft) =>
          nft.isAvailable &&
          nft.availableEditions > 0 &&
          nft.availableEditions <= 2,
      );
    } else if (params.status === "sold_out") {
      list = list.filter(
        (nft) => !nft.isAvailable || nft.availableEditions === 0,
      );
    }
  }

  if (params.priceMin) {
    const minWei = parseEthToBigInt(params.priceMin);
    list = list.filter((nft) => parseEthToBigInt(nft.priceEth) >= minWei);
  }

  if (params.priceMax) {
    const maxWei = parseEthToBigInt(params.priceMax);
    list = list.filter((nft) => parseEthToBigInt(nft.priceEth) <= maxWei);
  }

  if (params.sort) {
    switch (params.sort) {
      case "price_asc":
        list.sort((a, b) =>
          parseEthToBigInt(a.priceEth) < parseEthToBigInt(b.priceEth) ? -1 : 1,
        );
        break;
      case "price_desc":
        list.sort((a, b) =>
          parseEthToBigInt(a.priceEth) > parseEthToBigInt(b.priceEth) ? -1 : 1,
        );
        break;
      case "recently_listed":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "most_viewed":
        list.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
    }
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 8);
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedItems = list.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function getNftById(id: string): NftDetailDTO | undefined {
  return getCatalog().find((n) => n.id === id);
}

export function updateNftCatalogItem(
  id: string,
  updater: (nft: NftDetailDTO) => NftDetailDTO,
): NftDetailDTO | undefined {
  const catalog = getCatalog();
  const index = catalog.findIndex((n) => n.id === id);
  if (index === -1) return undefined;

  const current = catalog[index];
  const updated = updater({
    ...current,
    version: current.version + 1,
  });
  catalog[index] = updated;
  saveCatalog(catalog);
  return updated;
}

// ==========================================
// Favoritos
// ==========================================

export function getUserFavorites(userId: string): NftSummaryDTO[] {
  const state = getUserState(userId);
  const catalog = getCatalog();
  return catalog.filter((n) => state.favorites.includes(n.id));
}

export function toggleUserFavorite(userId: string, nftId: string): boolean {
  const state = getUserState(userId);
  const isFav = state.favorites.includes(nftId);
  if (isFav) {
    state.favorites = state.favorites.filter((id) => id !== nftId);
  } else {
    state.favorites.push(nftId);
  }
  saveUserState(userId, state);
  return !isFav;
}

// ==========================================
// Carrinho de Compras e Merge (Decisão 4)
// ==========================================

export function getCart(userId: string | null): CartDTO {
  if (userId) {
    return getUserState(userId).cart;
  }
  return getGuestState().cart;
}

export function saveCart(userId: string | null, cart: CartDTO): void {
  if (userId) {
    const userState = getUserState(userId);
    userState.cart = cart;
    saveUserState(userId, userState);
  } else {
    const guestState = getGuestState();
    guestState.cart = cart;
    saveGuestState(guestState);
  }
}

export function addItemToCart(
  userId: string | null,
  nftId: string,
  edition: number,
  quantity: number,
): { success: boolean; cart: CartDTO; error?: string } {
  const nft = getNftById(nftId);
  if (!nft || !nft.isAvailable || nft.availableEditions <= 0) {
    return {
      success: false,
      cart: getCart(userId),
      error: "NFT indisponível ou esgotado.",
    };
  }

  const cart = getCart(userId);
  const existingIndex = cart.items.findIndex(
    (item) => item.nftId === nftId && item.edition === edition,
  );

  const currentQty =
    existingIndex >= 0 ? cart.items[existingIndex].quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > nft.availableEditions) {
    return {
      success: false,
      cart,
      error: `Quantidade excede o total de edições disponíveis (${nft.availableEditions}).`,
    };
  }

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({
      id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nftId,
      edition,
      quantity,
      priceEth: nft.priceEth,
      title: nft.title,
      collection: nft.collection,
      imageUrl: nft.imageUrl,
      availableEditions: nft.availableEditions,
    });
  }

  cart.updatedAt = new Date().toISOString();
  saveCart(userId, cart);
  return { success: true, cart };
}

export function updateCartItemQuantity(
  userId: string | null,
  itemId: string,
  quantity: number,
): { success: boolean; cart: CartDTO; error?: string } {
  const cart = getCart(userId);
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, cart, error: "Item não encontrado no carrinho." };
  }

  const nft = getNftById(item.nftId);
  if (!nft) {
    return { success: false, cart, error: "NFT correspondente não existe." };
  }

  if (quantity > nft.availableEditions) {
    return {
      success: false,
      cart,
      error: `Quantidade solicitada excede a disponibilidade restante (${nft.availableEditions}).`,
    };
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.id !== itemId);
  } else {
    item.quantity = quantity;
  }

  cart.updatedAt = new Date().toISOString();
  saveCart(userId, cart);
  return { success: true, cart };
}

export function removeCartItem(userId: string | null, itemId: string): CartDTO {
  const cart = getCart(userId);
  cart.items = cart.items.filter((i) => i.id !== itemId);
  cart.updatedAt = new Date().toISOString();
  saveCart(userId, cart);
  return cart;
}

export function clearCart(userId: string | null): CartDTO {
  const cart: CartDTO = {
    items: [],
    couponCode: null,
    updatedAt: new Date().toISOString(),
  };
  saveCart(userId, cart);
  return cart;
}

export function mergeGuestCartIntoUser(userId: string): CartDTO {
  const guestCart = getGuestState().cart;
  if (guestCart.items.length === 0) {
    return getUserState(userId).cart;
  }

  const userState = getUserState(userId);
  const userCart = userState.cart;

  for (const guestItem of guestCart.items) {
    const nft = getNftById(guestItem.nftId);
    if (!nft || !nft.isAvailable || nft.availableEditions <= 0) continue;

    const existingIndex = userCart.items.findIndex(
      (ui) => ui.nftId === guestItem.nftId && ui.edition === guestItem.edition,
    );

    if (existingIndex >= 0) {
      const combinedQty =
        userCart.items[existingIndex].quantity + guestItem.quantity;
      userCart.items[existingIndex].quantity = Math.min(
        combinedQty,
        nft.availableEditions,
      );
    } else {
      userCart.items.push({
        ...guestItem,
        quantity: Math.min(guestItem.quantity, nft.availableEditions),
        availableEditions: nft.availableEditions,
      });
    }
  }

  userCart.updatedAt = new Date().toISOString();
  saveUserState(userId, userState);
  clearCart(null);
  return userCart;
}

// ==========================================
// Cotação e Cupons
// ==========================================

export function calculateQuote(
  items: Array<{ nftId: string; quantity: number }>,
  couponCode?: string | null,
): { success: boolean; quote?: QuoteResponse; error?: string } {
  let subtotalWei = 0n;

  for (const item of items) {
    const nft = getNftById(item.nftId);
    if (!nft) {
      return { success: false, error: `NFT ${item.nftId} não encontrado.` };
    }
    const itemTotalWei = parseEthToBigInt(nft.priceEth) * BigInt(item.quantity);
    subtotalWei += itemTotalWei;
  }

  const subtotalEth = formatBigIntToEth(subtotalWei);
  let discountEth = "0";
  let appliedCoupon = null;

  if (couponCode && couponCode.trim().length > 0) {
    const code = couponCode.trim().toUpperCase();
    const coupon = INITIAL_COUPONS[code];

    if (!coupon) {
      return { success: false, error: "Cupom inválido ou inexistente." };
    }

    const isExpired = new Date(coupon.expiresAt).getTime() <= Date.now();
    if (isExpired || !coupon.isValid) {
      return { success: false, error: "Cupom expirado." };
    }

    const discountWei =
      (subtotalWei * BigInt(coupon.discountPercentage)) / 100n;
    discountEth = formatBigIntToEth(discountWei);
    appliedCoupon = coupon;
  }

  // Taxa de rede fixa simulada em 0.005 ETH
  const networkFeeEth = "0.005";
  const networkFeeWei = parseEthToBigInt(networkFeeEth);
  const discountWei = parseEthToBigInt(discountEth);
  const totalWei = subtotalWei - discountWei + networkFeeWei;
  const totalEth = formatBigIntToEth(totalWei < 0n ? 0n : totalWei);

  // Expiração da cotação em 15 minutos
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    success: true,
    quote: {
      subtotalEth,
      discountEth,
      networkFeeEth,
      totalEth,
      coupon: appliedCoupon,
      expiresAt,
    },
  };
}

// ==========================================
// Pedidos e Idempotência (RN-10)
// ==========================================

export function createOrderWithIdempotency(
  userId: string,
  idempotencyKey: string,
  payload: CreateOrderRequest,
): { isNew: boolean; order: OrderReceiptDTO; conflict?: boolean } {
  const userState = getUserState(userId);
  const existingOrder = userState.orders.find(
    (o) => o.idempotencyKey === idempotencyKey,
  );

  if (existingOrder) {
    // Mesma chave: comparar conteúdo
    const sameTotal = existingOrder.totalEth === payload.totalEth;
    const sameItemsCount = existingOrder.items.length === payload.items.length;
    if (sameTotal && sameItemsCount) {
      return { isNew: false, order: existingOrder };
    }
    // Mesma chave com payload divergente: 409 Conflict
    return { isNew: false, order: existingOrder, conflict: true };
  }

  // Abater estoque dos NFTs comprados
  for (const item of payload.items) {
    updateNftCatalogItem(item.nftId, (nft) => {
      const remaining = Math.max(0, nft.availableEditions - item.quantity);
      return {
        ...nft,
        availableEditions: remaining,
        isAvailable: remaining > 0,
      };
    });
  }

  const newOrder: OrderReceiptDTO = {
    id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    status: "confirmed",
    txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    idempotencyKey,
    items: payload.items.map((i) => {
      const nft = getNftById(i.nftId);
      return {
        nftId: i.nftId,
        title: nft?.title || "NFT",
        collection: nft?.collection || "Kurio",
        imageUrl: nft?.imageUrl || "/assets/nfts/nft-01.png",
        edition: i.edition,
        quantity: i.quantity,
        priceEth: i.priceEth,
      };
    }),
    subtotalEth: payload.totalEth,
    discountEth: "0",
    networkFeeEth: "0.005",
    totalEth: payload.totalEth,
    walletAddress: payload.walletId,
    network: payload.network,
    createdAt: new Date().toISOString(),
    version: 1,
  };

  userState.orders.unshift(newOrder);

  // Limpar do carrinho os itens comprados (RN-09)
  const purchasedNftIds = payload.items.map((i) => i.nftId);
  userState.cart.items = userState.cart.items.filter(
    (i) => !purchasedNftIds.includes(i.nftId),
  );

  saveUserState(userId, userState);
  return { isNew: true, order: newOrder };
}

export function getUserOrderById(
  userId: string,
  orderId: string,
): OrderReceiptDTO | undefined {
  return getUserState(userId).orders.find((o) => o.id === orderId);
}

// ==========================================
// Perfil e Carteiras
// ==========================================

export function updateUserProfile(
  userId: string,
  data: Partial<UserProfileDTO>,
): UserProfileDTO {
  const userState = getUserState(userId);
  userState.profile = {
    ...userState.profile,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Sincroniza usuário geral
  const users = getUsers();
  const uIndex = users.findIndex((u) => u.id === userId);
  if (uIndex >= 0) {
    users[uIndex].name = userState.profile.name;
    if (data.avatarUrl !== undefined) {
      users[uIndex].avatarUrl = data.avatarUrl;
    }
    if (data.bio !== undefined) {
      users[uIndex].bio = data.bio;
    }
    saveUsers(users);
  }

  saveUserState(userId, userState);
  return userState.profile;
}

export function updateUserWallets(
  userId: string,
  wallets: WalletDTO[],
): WalletDTO[] {
  const userState = getUserState(userId);
  userState.wallets = wallets;
  saveUserState(userId, userState);
  return wallets;
}

// ==========================================
// Reset Determinístico (RN-13)
// ==========================================

export function resetDatabase(): void {
  clearMockStorage();
  saveCatalog(INITIAL_NFTS);
  saveUsers(INITIAL_USERS);
  console.info(
    "[Mock DB] Banco de dados simulado restaurado para o estado inicial das fixtures.",
  );
}
