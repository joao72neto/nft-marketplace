import { http, HttpResponse } from "msw";
import type { ApiErrorResponse, ChangePasswordRequest, UpdateProfileRequest } from "@/contracts";
import { findUserById, getUserState, updateUserProfile } from "../db";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { authenticateRequest } from "./jwt.helper";
import { apiPath } from "./utils";

export const profileHandlers = [
  // GET /api/profile
  http.get(apiPath("/profile"), async ({ request }) => {
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
    return HttpResponse.json(state.profile, { status: 200 });
  }),

  // PUT /api/profile
  http.put(apiPath("/profile"), async ({ request }) => {
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

    const body = (await request.json()) as UpdateProfileRequest;

    // Validação de tamanho do avatar se for Data URL (limite de ~150KB)
    if (body.avatarUrl && body.avatarUrl.length > 200000) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "O avatar fornecido excede o limite máximo permitido de 150KB.",
        details: [{ field: "avatarUrl", message: "Tamanho de imagem excessivo." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const updated = updateUserProfile(user.id, {
      name: body.name ? body.name.trim() : user.name,
      bio: body.bio !== undefined ? body.bio.trim() : undefined,
      avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl : undefined,
    });

    return HttpResponse.json(updated, { status: 200 });
  }),

  // PATCH /api/profile/password
  http.patch(apiPath("/profile/password"), async ({ request }) => {
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

    const body = (await request.json()) as ChangePasswordRequest;
    if (!body.currentPassword || !body.newPassword) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "Senha atual e nova senha são obrigatórias.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const userRecord = findUserById(user.id);
    const isCurrentValid =
      (user.id === "usr_alice" && body.currentPassword === "Senha123!") ||
      (user.id === "usr_bob" && body.currentPassword === "Senha456!") ||
      userRecord?.passwordHash === `hash_v1_${body.currentPassword}`;

    if (!isCurrentValid) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: "A senha atual informada está incorreta.",
        details: [{ field: "currentPassword", message: "Senha incorreta." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    if (userRecord) {
      userRecord.passwordHash = `hash_v1_${body.newPassword}`;
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
