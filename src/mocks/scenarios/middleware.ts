import { HttpResponse } from "msw";
import type { ApiErrorResponse } from "@/contracts";
import { getActiveScenario, getNetworkConditions } from "./active-scenario";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function processScenarioMiddleware(
  request: Request,
): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/__dev")) {
    return null;
  }

  const { scenario } = getActiveScenario();
  const network = getNetworkConditions();

  if (scenario === "network-failure") {
    await sleep(200);
    return HttpResponse.error();
  }

  const shouldFailTransient =
    scenario === "transient-errors"
      ? Math.random() < 0.5
      : Math.random() * 100 < network.failureRate;

  if (shouldFailTransient) {
    await sleep(150);
    const errorBody: ApiErrorResponse = {
      code: "TRANSIENT_ERROR",
      message:
        "Falha transitória na comunicação com o servidor simulado. Tente novamente.",
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(errorBody, { status: 503 });
  }

  let delay = network.latencyMs;
  if (scenario === "variable-latency") {
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
