export type ScenarioId =
  | "default"
  | "empty-catalog"
  | "variable-latency"
  | "transient-errors"
  | "network-failure"
  | "expired-session"
  | "register-conflict"
  | "coupon-expired"
  | "price-changed"
  | "edition-sold-out"
  | "order-timeout"
  | "payment-refused";

export interface NetworkConditions {
  latencyMs: number;
  jitterMs: number;
  failureRate: number; // 0 a 100
}
