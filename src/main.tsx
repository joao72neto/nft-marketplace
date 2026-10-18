import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "@/lib/query-client";
import { router } from "@/router";
import { enableMocking } from "@/mocks/browser";
import { socketClient } from "@/lib/socket-client";
import { AuthProvider } from "@/features/auth/auth-context";
import { DevToolbar } from "@/components/dev/DevToolbar";
import "@/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento raiz #root não foi encontrado no DOM.");
}

enableMocking().finally(() => {
  socketClient.connect();

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <DevToolbar />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
});
