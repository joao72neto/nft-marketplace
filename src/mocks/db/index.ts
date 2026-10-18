import type {
  EthAmount,
  NftDetailDTO,
  NftQueryParams,
  NftSummaryDTO,
  PaginatedResponse,
} from "@/contracts";
import { INITIAL_NFTS, INITIAL_USERS, type MockUserRecord } from "../fixtures";
import { clearMockStorage, getStoredItem, setStoredItem } from "./storage";

const CATALOG_KEY = "greenmint_mock_catalog";
const USERS_KEY = "greenmint_mock_users";

// ==========================================
// Utilitários de Precisão Decimal em ETH
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

// ==========================================
// Acesso ao Catálogo e Usuários
// ==========================================

export function getCatalog(): NftDetailDTO[] {
  return getStoredItem<NftDetailDTO[]>(CATALOG_KEY, INITIAL_NFTS);
}

export function saveCatalog(catalog: NftDetailDTO[]): void {
  setStoredItem(CATALOG_KEY, catalog);
}

export function getUsers(): MockUserRecord[] {
  return getStoredItem<MockUserRecord[]>(USERS_KEY, INITIAL_USERS);
}

export function saveUsers(users: MockUserRecord[]): void {
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
// Restauração / Reset do Banco Simulado
// ==========================================

export function resetDatabase(): void {
  clearMockStorage();
  saveCatalog(INITIAL_NFTS);
  saveUsers(INITIAL_USERS);
  console.log(
    "[Mock DB] Banco de dados simulado restaurado para o estado inicial das fixtures.",
  );
}
