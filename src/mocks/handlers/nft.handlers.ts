import { http, HttpResponse } from "msw";
import type { ApiErrorResponse, NftCategory, NftQueryParams, NftSortOption, NftStatus } from "@/contracts";
import { getNftById, listNfts } from "../db";
import { getActiveScenario } from "../scenarios/active-scenario";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { apiPath } from "./utils";

export const nftHandlers = [
  // GET /api/nfts
  http.get(apiPath("/nfts"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { scenario } = getActiveScenario();

    // Se cenário de catálogo vazio estiver ativo
    if (scenario === "empty-catalog") {
      return HttpResponse.json({
        items: [],
        pagination: {
          page: 1,
          limit: 8,
          totalItems: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const queryParams: NftQueryParams = {
      search: searchParams.get("search") || undefined,
      category: (searchParams.get("category") as NftCategory) || undefined,
      status: (searchParams.get("status") as NftStatus) || undefined,
      priceMin: searchParams.get("priceMin") || undefined,
      priceMax: searchParams.get("priceMax") || undefined,
      sort: (searchParams.get("sort") as NftSortOption) || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 8,
    };

    const paginated = listNfts(queryParams);
    return HttpResponse.json(paginated, { status: 200 });
  }),

  // GET /api/nfts/:id
  http.get(apiPath("/nfts/:id"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const id = params.id as string;
    const nft = getNftById(id);

    if (!nft) {
      const errorResponse: ApiErrorResponse = {
        code: "NOT_FOUND",
        message: `O NFT com identificador "${id}" não foi encontrado.`,
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    return HttpResponse.json(nft, { status: 200 });
  }),
];
