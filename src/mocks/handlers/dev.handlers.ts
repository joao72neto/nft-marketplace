import { http, HttpResponse } from "msw";
import { resetDatabase } from "../db";
import { getActiveScenario, getNetworkConditions } from "../scenarios/active-scenario";
import { emitMockSocketEvent, getActiveSocketClientsCount } from "../socket/emitter";
import { apiPath } from "./utils";

export const devHandlers = [
  // POST /api/__dev/reset
  http.post(apiPath("/__dev/reset"), async () => {
    resetDatabase();
    return HttpResponse.json(
      {
        success: true,
        message: "Banco de dados simulado restaurado para o estado inicial das fixtures.",
      },
      { status: 200 }
    );
  }),

  // POST /api/__dev/events (Decisão 3: Disparo de eventos nos testes Playwright e painel)
  http.post(apiPath("/__dev/events"), async ({ request }) => {
    try {
      const body = (await request.json()) as { event: string; payload: unknown };
      if (!body.event || body.payload === undefined) {
        return HttpResponse.json(
          { error: "Os campos 'event' e 'payload' são obrigatórios." },
          { status: 400 }
        );
      }

      emitMockSocketEvent(body.event, body.payload);

      return HttpResponse.json(
        {
          success: true,
          event: body.event,
          clientsNotified: getActiveSocketClientsCount(),
        },
        { status: 200 }
      );
    } catch (e) {
      return HttpResponse.json(
        { error: "Payload inválido.", details: String(e) },
        { status: 400 }
      );
    }
  }),

  // GET /api/__dev/status
  http.get(apiPath("/__dev/status"), async () => {
    const active = getActiveScenario();
    const network = getNetworkConditions();
    return HttpResponse.json(
      {
        scenario: active.scenario,
        scenarioSource: active.source,
        network,
        activeSocketClients: getActiveSocketClientsCount(),
      },
      { status: 200 }
    );
  }),
];
