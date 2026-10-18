import type { NftDetailDTO } from "@/contracts";
import type { MockUserRecord } from "../fixtures/users";

export interface GlobalMockCatalogState {
  nfts: NftDetailDTO[];
  users: MockUserRecord[];
}
