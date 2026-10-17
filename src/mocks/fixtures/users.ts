import type { UserDTO } from "@/contracts";

export interface MockUserRecord extends UserDTO {
  passwordHash: string;
}

export const INITIAL_USERS: MockUserRecord[] = [
  {
    id: "usr_alice",
    name: "Alice Vance",
    email: "alice@greenmint.io",
    passwordHash: "hash_v1_alice_valid", // "Senha123!"
    avatarUrl: "/assets/nfts/nft-01.png",
    bio: "Colecionadora de arte generativa e entusiasta do ecossistema Kurio GreenMint.",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "usr_bob",
    name: "Bob Martinez",
    email: "bob@greenmint.io",
    passwordHash: "hash_v1_bob_valid", // "Senha456!"
    avatarUrl: null,
    bio: "Novo colecionador explorando os primeiros lançamentos.",
    createdAt: "2026-02-01T14:30:00.000Z",
  },
];
