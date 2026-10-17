/**
 * Retorna o padrão de rota compatível tanto com o navegador quanto com Node.js (testes e SSR).
 * Exemplo: apiPath("/nfts") -> "* /api/nfts"
 */
export const apiPath = (path: string): string => `*/api${path}`;
