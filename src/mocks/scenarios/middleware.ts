import { HttpResponse } from "msw";
import type { ApiErrorResponse } from "@/contracts";
import { getActiveScenario, getNetworkConditions } from "./active-scenario";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processScenarioMiddleware(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  // Não intercepta chamadas internas de dev (__dev)
  if (url.pathname.startsWith("/api/__dev")) {
    return null;
  }

  const { scenario } = getActiveScenario();
  const network = getNetworkConditions();

  // 1. Simulação de falha de conexão de rede total (Network Error)
  if (scenario === "network-failure") {
    await sleep(200);
    return HttpResponse.error();
  }

  // 2. Erros transitórios 500/503 (scenario ou taxa de falhas configurada)
  const shouldFailTransient =
    scenario === "transient-errors" ? Math.random() < 0.5 : Math.random() * 100 < network.failureRate;

  if (shouldFailTransient) {
    await sleep(150);
    const errorBody: ApiErrorResponse = {
      code: "TRANSIENT_ERROR",
      message: "Falha transitória na comunicação com o servidor simulado. Tente novamente.",
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(errorBody, { status: 503 });
  }

  // 3. Aplicação de latência e jitter
  let delay = network.latencyMs;
  if (scenario === "variable-latency") {
    // Latência variável randômica entre 300ms e 2000ms para provocar respostas fora de ordem
    delay = Math.floor(Math.random() * 1700) + 300;
  } else if (network.jitterMs > 0) {
    const jitter = Math.floor((Math.random() * 2 - 1) * network.jitterMs);
    delay = Math.max(10, delay + jitter);
  }

  if (delay > 0) {
    await sleep(delay);
  }

  return null;
}
