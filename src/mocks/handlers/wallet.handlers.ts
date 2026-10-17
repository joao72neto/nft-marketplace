import { http, HttpResponse } from "msw";
import type { ApiErrorResponse, UpdateWalletsRequest, WalletDTO } from "@/contracts";
import { getUserState, updateUserWallets } from "../db";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { authenticateRequest } from "./jwt.helper";
import { apiPath } from "./utils";

export const walletHandlers = [
  // GET /api/wallets
  http.get(apiPath("/wallets"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: error || "Não autenticado.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const state = getUserState(user.id);
    return HttpResponse.json({ wallets: state.wallets }, { status: 200 });
  }),

  // PUT /api/wallets
  http.put(apiPath("/wallets"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: error || "Não autenticado.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const body = (await request.json()) as UpdateWalletsRequest;
    if (!body.primaryWallet) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "Carteira principal é obrigatória.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const walletsList: WalletDTO[] = [{ ...body.primaryWallet, isPrimary: true }];
    if (body.secondaryWallet) {
      walletsList.push({ ...body.secondaryWallet, isPrimary: false });
    }

    const updated = updateUserWallets(user.id, walletsList);
    return HttpResponse.json({ wallets: updated }, { status: 200 });
  }),
];
