import { http, HttpResponse } from "msw";
import type { ApiErrorResponse, AuthResponse, LoginRequest, RegisterRequest, UserDTO } from "@/contracts";
import { addUser, findUserByEmail, mergeGuestCartIntoUser } from "../db";
import { getActiveScenario } from "../scenarios/active-scenario";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { authenticateRequest, createFakeJwt } from "./jwt.helper";
import { apiPath } from "./utils";

export const authHandlers = [
  // POST /api/auth/register
  http.post(apiPath("/auth/register"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { scenario } = getActiveScenario();
    const body = (await request.json()) as RegisterRequest;

    if (scenario === "register-conflict") {
      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: "O e-mail informado já está cadastrado na plataforma.",
        details: [{ field: "email", message: "E-mail já em uso por outro colecionador." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    if (!body.name || !body.email || !body.password) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "Todos os campos obrigatórios devem ser preenchidos.",
        details: [
          ...(!body.name ? [{ field: "name", message: "Nome é obrigatório." }] : []),
          ...(!body.email ? [{ field: "email", message: "E-mail é obrigatório." }] : []),
          ...(!body.password ? [{ field: "password", message: "Senha é obrigatória." }] : []),
        ],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    if (findUserByEmail(body.email)) {
      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: "O e-mail informado já está cadastrado.",
        details: [{ field: "email", message: "E-mail já em uso." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    const newUser: UserDTO = {
      id: `usr_${Date.now().toString(36)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      avatarUrl: null,
      bio: "",
      createdAt: new Date().toISOString(),
    };

    addUser({
      ...newUser,
      passwordHash: `hash_v1_${body.password}`,
    });

    const token = createFakeJwt(newUser);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    // Merge de carrinho se houver itens no visitante
    mergeGuestCartIntoUser(newUser.id);

    const response: AuthResponse = {
      user: newUser,
      token,
      expiresAt,
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  // POST /api/auth/login
  http.post(apiPath("/auth/login"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const body = (await request.json()) as LoginRequest;

    if (!body.email || !body.password) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "E-mail e senha são obrigatórios.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const userRecord = findUserByEmail(body.email);
    // Verificação simples de credenciais fictícias
    const isValidPassword =
      (userRecord?.id === "usr_alice" && body.password === "Senha123!") ||
      (userRecord?.id === "usr_bob" && body.password === "Senha456!") ||
      userRecord?.passwordHash === `hash_v1_${body.password}`;

    if (!userRecord || !isValidPassword) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: "Credenciais inválidas. Verifique seu e-mail e senha.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const token = createFakeJwt(userRecord);
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    // Merge de carrinho de visitante para o usuário logado (Decisão 4)
    mergeGuestCartIntoUser(userRecord.id);

    const response: AuthResponse = {
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        avatarUrl: userRecord.avatarUrl,
        bio: userRecord.bio,
        createdAt: userRecord.createdAt,
      },
      token,
      expiresAt,
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  // POST /api/auth/logout
  http.post(apiPath("/auth/logout"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // GET /api/auth/me
  http.get(apiPath("/auth/me"), async ({ request }) => {
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

    return HttpResponse.json(user, { status: 200 });
  }),
];
