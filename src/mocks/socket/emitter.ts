type SocketIoClient = {
  emit: (event: string, ...data: unknown[]) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
};

const activeClients = new Set<SocketIoClient>();

export function addActiveSocketClient(client: SocketIoClient): void {
  activeClients.add(client);
  console.info(`[MSW Socket.IO] Cliente conectado. Total de conexões ativas: ${activeClients.size}`);
}

export function removeActiveSocketClient(client: SocketIoClient): void {
  activeClients.delete(client);
  console.info(`[MSW Socket.IO] Cliente desconectado. Restantes: ${activeClients.size}`);
}

export function emitMockSocketEvent(event: string, data: unknown): void {
  if (activeClients.size === 0) {
    console.warn(`[MSW Socket.IO] Nenhum cliente conectado para receber o evento "${event}".`);
    return;
  }

  console.info(`[MSW Socket.IO] Disparando evento "${event}" para ${activeClients.size} cliente(s):`, data);

  for (const client of activeClients) {
    try {
      client.emit(event, data);
    } catch (error) {
      console.error(`[MSW Socket.IO] Falha ao emitir evento "${event}":`, error);
    }
  }
}

export function getActiveSocketClientsCount(): number {
  return activeClients.size;
}
