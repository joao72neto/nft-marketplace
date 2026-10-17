import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { addActiveSocketClient, removeActiveSocketClient } from "./emitter";

export const socketLink = ws.link("*");

export const socketHandler = socketLink.addEventListener("connection", (connection) => {
  const { client } = toSocketIo(connection);

  addActiveSocketClient(client);

  connection.client.addEventListener("close", () => {
    removeActiveSocketClient(client);
  });
});
