import { http, HttpResponse } from "msw";
import type {
  ApiErrorResponse,
  CreateOrderRequest,
  OrderReceiptDTO,
} from "@/contracts";
import { createOrderWithIdempotency, getUserOrderById } from "../db";
import { getActiveScenario } from "../scenarios/active-scenario";
import { processScenarioMiddleware } from "../scenarios/middleware";
import { emitMockSocketEvent } from "../socket/emitter";
import { authenticateRequest } from "./jwt.helper";
import { apiPath } from "./utils";

export const orderHandlers = [
  // POST /api/orders
  http.post(apiPath("/orders"), async ({ request }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error: authError } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: authError || "Autenticação requerida para finalizar o pedido.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const idempotencyKey =
      request.headers.get("idempotency-key") ||
      request.headers.get("Idempotency-Key");

    if (!idempotencyKey) {
      const errorResponse: ApiErrorResponse = {
        code: "VALIDATION_ERROR",
        message:
          "Cabeçalho Idempotency-Key é obrigatório para criação de pedidos.",
        details: [{ field: "Idempotency-Key", message: "Cabeçalho ausente." }],
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const body = (await request.json()) as CreateOrderRequest;
    const { scenario } = getActiveScenario();

    // Cenário: Timeout no envio do pedido (EC-06)
    if (scenario === "order-timeout") {
      // Simula lentidão que estoura o timeout de 15s do cliente Axios
      await new Promise((resolve) => setTimeout(resolve, 16000));
      return HttpResponse.error();
    }

    // Cenário: Pagamento recusado (EC-11 / CA-04)
    if (scenario === "payment-refused") {
      const refusedOrder: OrderReceiptDTO = {
        id: `ord_refused_${Date.now().toString(36)}`,
        status: "refused",
        txHash: "0x0000000000000000000000000000000000000000",
        idempotencyKey,
        items: body.items.map((i) => ({
          nftId: i.nftId,
          title: "NFT",
          collection: "Kurio",
          imageUrl: "/assets/nfts/nft-01.png",
          edition: i.edition,
          quantity: i.quantity,
          priceEth: i.priceEth,
        })),
        subtotalEth: body.totalEth,
        discountEth: "0",
        networkFeeEth: "0.005",
        totalEth: body.totalEth,
        walletAddress: body.walletId,
        network: body.network,
        createdAt: new Date().toISOString(),
        version: 1,
        failureReason:
          "Transação recusada pela carteira: saldo insuficiente em ETH ou rejeição da assinatura.",
      };

      emitMockSocketEvent("order.updated", {
        eventId: `evt_ord_${Date.now()}`,
        resource: "order",
        resourceId: refusedOrder.id,
        version: 1,
        timestamp: new Date().toISOString(),
        data: {
          status: "refused",
          txHash: refusedOrder.txHash,
          failureReason: refusedOrder.failureReason,
        },
      });

      const errorResponse: ApiErrorResponse = {
        code: "INSUFFICIENT_FUNDS",
        message:
          "Pagamento não pôde ser concluído. Verifique o saldo de sua carteira e tente novamente.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 422 });
    }

    // Fluxo normal com controle de idempotência (RN-10)
    const result = createOrderWithIdempotency(user.id, idempotencyKey, body);

    if (result.conflict) {
      const errorResponse: ApiErrorResponse = {
        code: "CONFLICT",
        message:
          "Chave de idempotência já utilizada com parâmetros divergentes.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 409 });
    }

    // Emissão do evento de pedido confirmado via Socket.IO
    if (result.isNew) {
      emitMockSocketEvent("order.updated", {
        eventId: `evt_ord_${Date.now()}`,
        resource: "order",
        resourceId: result.order.id,
        version: result.order.version,
        timestamp: new Date().toISOString(),
        data: {
          status: "confirmed",
          txHash: result.order.txHash,
          failureReason: null,
        },
      });
    }

    const statusCode = result.isNew ? 201 : 200;
    return HttpResponse.json(result.order, { status: statusCode });
  }),

  // GET /api/orders/:id
  http.get(apiPath("/orders/:id"), async ({ request, params }) => {
    const middlewareResult = await processScenarioMiddleware(request);
    if (middlewareResult) return middlewareResult;

    const { user, error: authError } = authenticateRequest(request);
    if (!user) {
      const errorResponse: ApiErrorResponse = {
        code: "UNAUTHORIZED",
        message: authError || "Autenticação requerida.",
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 401 });
    }

    const orderId = params.id as string;
    const order = getUserOrderById(user.id, orderId);

    if (!order) {
      const errorResponse: ApiErrorResponse = {
        code: "NOT_FOUND",
        message: `Pedido "${orderId}" não encontrado.`,
        timestamp: new Date().toISOString(),
      };
      return HttpResponse.json(errorResponse, { status: 404 });
    }

    return HttpResponse.json(order, { status: 200 });
  }),
];
