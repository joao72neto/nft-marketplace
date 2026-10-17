import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";

export const socketClient: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
