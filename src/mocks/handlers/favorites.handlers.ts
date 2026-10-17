import { http, HttpResponse } from "msw";
import type { ApiErrorResponse, ToggleFavoriteResponse } from "@/contracts";
import { getUserFavorites, toggleUserFavorite } from "../db";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { authenticateRequest } from "./jwt.helper";
import { apiPath } from "./utils";

export const favoritesHandlers = [
  // GET /api/favorites
  http.get(apiPath("/favorites"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: error || "Autenticação necessária para acessar favoritos.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const items = getUserFavorites(user.id);
    return HttpResponse.json({ items }, { status: 200 });
  }),

  // POST /api/favorites/:nftId
  http.post(apiPath("/favorites/:nftId"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: error || "Autenticação necessária para favoritar NFTs.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const nftId = params.nftId as string;
    const isFavorite = toggleUserFavorite(user.id, nftId);

    const response: ToggleFavoriteResponse = {
      nftId,
      isFavorite,
    };
    return HttpResponse.json(response, { status: 200 });
  }),

  // DELETE /api/favorites/:nftId
  http.delete(apiPath("/favorites/:nftId"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: error || "Autenticação necessária.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const nftId = params.nftId as string;
    toggleUserFavorite(user.id, nftId);

    const response: ToggleFavoriteResponse = {
      nftId,
      isFavorite: false,
    };
    return HttpResponse.json(response, { status: 200 });
  }),
];
