import type { CouponDTO } from "@/contracts";

export const INITIAL_COUPONS: Record<string, CouponDTO> = {
  KURIO10: {
    code: "KURIO10",
    discountPercentage: 10,
    isValid: true,
    expiresAt: "2030-12-31T23:59:59.000Z",
  },
  VERAO2026: {
    code: "VERAO2026",
    discountPercentage: 20,
    isValid: false,
    expiresAt: "2026-01-01T00:00:00.000Z",
  },
};
