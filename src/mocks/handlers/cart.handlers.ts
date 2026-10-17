import { http, HttpResponse } from "msw";
import type { AddToCartRequest, ApiErrorResponse, QuoteRequest, UpdateCartItemRequest } from "@/contracts";
import {
  addItemToCart,
  calculateQuote,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  updateNftCatalogItem,
} from "../db";
import { getActiveScenario } from "../scenarios/active-scenario";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { emitMockSocketEvent } from "../socket/emitter";
import { authenticateRequest } from "./jwt.helper";
import { apiPath } from "./utils";

export const cartHandlers = [
  // GET /api/cart
  http.get(apiPath("/cart"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user } = authenticateRequest(request);
    const cart = getCart(user ? user.id : null);
    return HttpResponse.json(cart, { status: 200 });
  }),

  // POST /api/cart/items
  http.post(apiPath("/cart/items"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user } = authenticateRequest(request);
    const body = (await request.json()) as AddToCartRequest;

    if (!body.nftId || !body.quantity || body.quantity <= 0) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "Dados de adição inválidos. Quantidade deve ser positiva.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const result = addItemToCart(user ? user.id : null, body.nftId, body.edition, body.quantity);
    if (!result.success) {
      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: result.error || "Não foi possível adicionar o item ao carrinho.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    return HttpResponse.json(result.cart, { status: 201 });
  }),

  // PATCH /api/cart/items/:itemId
  http.patch(apiPath("/cart/items/:itemId"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user } = authenticateRequest(request);
    const itemId = params.itemId as string;
    const body = (await request.json()) as UpdateCartItemRequest;

    if (body.quantity === undefined || body.quantity < 0) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: "Quantidade deve ser maior ou igual a zero.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const result = updateCartItemQuantity(user ? user.id : null, itemId, body.quantity);
    if (!result.success) {
      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: result.error || "Não foi possível atualizar a quantidade.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    return HttpResponse.json(result.cart, { status: 200 });
  }),

  // DELETE /api/cart/items/:itemId
  http.delete(apiPath("/cart/items/:itemId"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user } = authenticateRequest(request);
    const itemId = params.itemId as string;
    const cart = removeCartItem(user ? user.id : null, itemId);
    return HttpResponse.json(cart, { status: 200 });
  }),

  // DELETE /api/cart
  http.delete(apiPath("/cart"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user } = authenticateRequest(request);
    const cart = clearCart(user ? user.id : null);
    return HttpResponse.json(cart, { status: 200 });
  }),

  // POST /api/cart/quote
  http.post(apiPath("/cart/quote"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { scenario } = getActiveScenario();
    const body = (await request.json()) as QuoteRequest;

    // Cenário: Cupom expirado
    if (scenario === "coupon-expired" && body.couponCode) {
      const errorResponse: ApiErrorResponse = {
        code: "EXPIRED_RESOURCE",
        message: "O cupom de desconto informado está expirado e não pode ser aplicado.",
        details: [{ field: "couponCode", message: "Cupom expirado." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 422 });
    }

    // Cenário: Preço alterado durante compra (RN-17 / EC-05)
    if (scenario === "price-changed" && body.items.length > 0) {
      const targetItem = body.items[0];
      const updatedNft = updateNftCatalogItem(targetItem.nftId, (nft) => ({
        ...nft,
        priceEth: (parseFloat(nft.priceEth) + 0.1).toFixed(2),
      }));

      if (updatedNft) {
        emitMockSocketEvent("nft.updated", {
          eventId: `evt_price_${Date.now()}`,
          resource: "nft",
          resourceId: updatedNft.id,
          version: updatedNft.version,
          timestamp: new Date().toISOString(),
          data: {
            priceEth: updatedNft.priceEth,
            availableEditions: updatedNft.availableEditions,
            totalEditions: updatedNft.totalEditions,
            isAvailable: updatedNft.isAvailable,
          },
        });
      }

      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: "O preço de um dos itens no carrinho sofreu alteração. A cotação foi recalculada.",
        details: [{ field: targetItem.nftId, message: "Preço atualizado para nova cotação." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    // Cenário: Edição esgotada durante checkout
    if (scenario === "edition-sold-out" && body.items.length > 0) {
      const targetItem = body.items[0];
      const updatedNft = updateNftCatalogItem(targetItem.nftId, (nft) => ({
        ...nft,
        availableEditions: 0,
        isAvailable: false,
      }));

      if (updatedNft) {
        emitMockSocketEvent("nft.updated", {
          eventId: `evt_soldout_${Date.now()}`,
          resource: "nft",
          resourceId: updatedNft.id,
          version: updatedNft.version,
          timestamp: new Date().toISOString(),
          data: {
            priceEth: updatedNft.priceEth,
            availableEditions: 0,
            totalEditions: updatedNft.totalEditions,
            isAvailable: false,
          },
        });
      }

      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message: "A edição selecionada acabou de se esgotar.",
        details: [{ field: targetItem.nftId, message: "Item sem estoque disponível." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    const calcResult = calculateQuote(body.items, body.couponCode);
    if (!calcResult.success || !calcResult.quote) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message: calcResult.error || "Não foi possível gerar a cotação.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 422 });
    }

    return HttpResponse.json(calcResult.quote, { status: 200 });
  }),
];
