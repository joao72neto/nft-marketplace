const memoryFallbackStore = new Map<string, string>();

/**
 * Lê uma chave do localStorage com fallback transparente em memória.
 */
export function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    }
  } catch (error) {
    console.warn(
      `[Mock DB Storage] Falha ao ler "${key}" do localStorage. Utilizando memória.`,
      error,
    );
  }

  const memoryItem = memoryFallbackStore.get(key);
  if (memoryItem !== undefined) {
    try {
      return JSON.parse(memoryItem) as T;
    } catch {
      return defaultValue;
    }
  }

  return defaultValue;
}

/**
 * Grava uma chave no localStorage com fallback transparente em memória.
 */
export function setStoredItem<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, serialized);
      return;
    }
  } catch (error) {
    console.warn(
      `[Mock DB Storage] Falha ao gravar "${key}" no localStorage (cota ou bloqueio). Utilizando memória.`,
      error,
    );
  }

  memoryFallbackStore.set(key, serialized);
}

/**
 * Remove uma chave do localStorage e da memória.
 */
export function removeStoredItem(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Silencia erros de exclusão
  }
  memoryFallbackStore.delete(key);
}

/**
 * Limpa todas as chaves iniciadas pelo prefixo "greenmint_mock_".
 */
export function clearMockStorage(): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("greenmint_mock_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }
  } catch (error) {
    console.warn(
      "[Mock DB Storage] Erro ao limpar chaves do localStorage.",
      error,
    );
  }

  for (const key of memoryFallbackStore.keys()) {
    if (key.startsWith("greenmint_mock_")) {
      memoryFallbackStore.delete(key);
    }
  }
}
