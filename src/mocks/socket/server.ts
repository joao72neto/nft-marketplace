import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import {
  addActiveSocketClient,
  removeActiveSocketClient,
  emitMockSocketEvent,
} from "./emitter";
import { getCatalog, updateNftCatalogItem } from "../db";

export const socketLink = ws.link("*");

let simulationTimer: ReturnType<typeof setInterval> | null = null;

function startRealtimeSimulation() {
  if (simulationTimer) return;

  simulationTimer = setInterval(() => {
    const catalog = getCatalog();
    if (!catalog || catalog.length === 0) return;

    const targetNft =
      catalog[Math.floor(Math.random() * Math.min(4, catalog.length))];
    if (!targetNft) return;

    const currentPrice = parseFloat(targetNft.priceEth);
    const variation = (Math.random() * 0.1 - 0.05).toFixed(2);
    const newPrice = Math.max(
      0.1,
      Number((currentPrice + parseFloat(variation)).toFixed(2)),
    ).toString();
    const newEditions = Math.max(0, targetNft.availableEditions - 1);

    const updated = updateNftCatalogItem(targetNft.id, (nft) => ({
      ...nft,
      priceEth: newPrice,
      availableEditions:
        newEditions > 0 ? newEditions : targetNft.totalEditions,
    }));

    if (updated) {
      emitMockSocketEvent("nft.updated", {
        eventId: `evt_${Date.now()}`,
        resource: "nft",
        resourceId: updated.id,
        version: updated.version,
        timestamp: new Date().toISOString(),
        data: {
          priceEth: updated.priceEth,
          availableEditions: updated.availableEditions,
          totalEditions: updated.totalEditions,
          isAvailable: updated.isAvailable,
        },
      });
    }
  }, 35000);
}

export const socketHandler = socketLink.addEventListener(
  "connection",
  (connection) => {
    const { client } = toSocketIo(connection);

    addActiveSocketClient(client);
    startRealtimeSimulation();

    connection.client.addEventListener("close", () => {
      removeActiveSocketClient(client);
    });
  },
);

if (typeof window !== "undefined") {
  (
    window as unknown as { __simulateNftUpdate: () => void }
  ).__simulateNftUpdate = () => {
    const catalog = getCatalog();
    if (catalog.length > 0) {
      const first = catalog[0];
      const newPrice = (parseFloat(first.priceEth) + 0.05).toFixed(2);
      updateNftCatalogItem(first.id, (n) => ({ ...n, priceEth: newPrice }));
      emitMockSocketEvent("nft.updated", {
        eventId: `evt_manual_${Date.now()}`,
        resource: "nft",
        resourceId: first.id,
        version: Date.now(),
        timestamp: new Date().toISOString(),
        data: {
          priceEth: newPrice,
          availableEditions: first.availableEditions,
          totalEditions: first.totalEditions,
          isAvailable: first.isAvailable,
        },
      });
    }
  };
}
