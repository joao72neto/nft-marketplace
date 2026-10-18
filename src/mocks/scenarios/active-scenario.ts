import type { NetworkConditions, ScenarioId } from "./types";

const DEV_SCENARIO_KEY = "greenmint_dev_scenario";
const DEV_NETWORK_KEY = "greenmint_dev_network";

const VALID_SCENARIOS: Set<ScenarioId> = new Set([
  "default",
  "empty-catalog",
  "variable-latency",
  "transient-errors",
  "network-failure",
  "expired-session",
  "register-conflict",
  "coupon-expired",
  "price-changed",
  "edition-sold-out",
  "order-timeout",
  "payment-refused",
]);

/**
 * Determina o cenário ativo respeitando a regra de precedência RN-15:
 * 1. URL search param (?scenario=...)
 * 2. localStorage do Painel Dev (greenmint_dev_scenario)
 * 3. Variável de ambiente VITE_MOCK_SCENARIO (padrão: "default")
 */
export function getActiveScenario(): {
  scenario: ScenarioId;
  source: "url" | "storage" | "env";
} {
  if (typeof window !== "undefined" && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("scenario") as ScenarioId | null;
    if (fromUrl && VALID_SCENARIOS.has(fromUrl)) {
      return { scenario: fromUrl, source: "url" };
    }
  }

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const fromStorage = window.localStorage.getItem(
        DEV_SCENARIO_KEY,
      ) as ScenarioId | null;
      if (fromStorage && VALID_SCENARIOS.has(fromStorage)) {
        return { scenario: fromStorage, source: "storage" };
      }
    } catch {
      // Ignora falhas de leitura
    }
  }

  const fromEnv =
    (import.meta.env?.VITE_MOCK_SCENARIO as ScenarioId) || "default";
  if (VALID_SCENARIOS.has(fromEnv)) {
    return { scenario: fromEnv, source: "env" };
  }

  return { scenario: "default", source: "env" };
}

export function setActiveDevScenario(scenario: ScenarioId): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(DEV_SCENARIO_KEY, scenario);
    } catch (e) {
      console.warn("Falha ao salvar cenário no localStorage", e);
    }
  }
}

export function getNetworkConditions(): NetworkConditions {
  const defaultConditions: NetworkConditions = {
    latencyMs: 80,
    jitterMs: 20,
    failureRate: 0,
  };
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(DEV_NETWORK_KEY);
      if (saved) {
        return { ...defaultConditions, ...JSON.parse(saved) };
      }
    } catch {
      // Retorna defaults
    }
  }
  return defaultConditions;
}

export function setNetworkConditions(
  conditions: Partial<NetworkConditions>,
): void {
  const current = getNetworkConditions();
  const updated = { ...current, ...conditions };
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(DEV_NETWORK_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Falha ao salvar condições de rede no localStorage", e);
    }
  }
}
