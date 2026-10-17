import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { socketHandler } from "./socket/server";

export const worker = setupWorker(...handlers, socketHandler);

/**
 * Inicia o Mock Service Worker antes do render da aplicação.
 * Em desenvolvimento e demonstração (Vercel), os mocks ficam ativos por padrão,
 * a menos que explicitamente desativados via VITE_ENABLE_MOCKS=false.
 */
export async function enableMocking(): Promise<void> {
  const isExplicitlyDisabled = import.meta.env.VITE_ENABLE_MOCKS === "false";
  if (isExplicitlyDisabled) {
    console.info("[MSW] Mocks desativados explicitamente por VITE_ENABLE_MOCKS=false.");
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
    console.info("[MSW] Camada de contratos e mocks iniciada com sucesso.");
  } catch (error) {
    console.error("[MSW] Falha ao registrar o Mock Service Worker:", error);
  }
}
