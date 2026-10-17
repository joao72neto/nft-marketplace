import { setupServer } from "msw/node";
import { handlers } from "../handlers/index.js";
import { resetDatabase } from "../db/index.js";
import assert from "node:assert";

const server = setupServer(...handlers);
server.listen({ onUnhandledRequest: "error" });

async function runTests() {
  console.log(
    "=== Iniciando Verificação Automatizada de Contratos e Mocks ===",
  );
  resetDatabase();

  const BASE_URL = "http://localhost:3000";

  // 1. GET /api/nfts (Paginação e Contratos)
  {
    console.log("1. Testando GET /api/nfts...");
    const res = await fetch(`${BASE_URL}/api/nfts?page=1&limit=8`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.items.length, 8);
    assert.strictEqual(data.pagination.page, 1);
    assert.strictEqual(data.pagination.totalItems, 16);
    assert.strictEqual(typeof data.items[0].priceEth, "string");
    console.log("  -> OK (8 itens retornados, ETH como string decimal)");
  }

  // 2. GET /api/nfts/:id (Detalhes e 404)
  {
    console.log("2. Testando GET /api/nfts/:id...");
    const resFound = await fetch(`${BASE_URL}/api/nfts/nft-01`);
    assert.strictEqual(resFound.status, 200);
    const nft = await resFound.json();
    assert.strictEqual(nft.id, "nft-01");
    assert.strictEqual(nft.title, "Cyber Ape #1042");

    const resNotFound = await fetch(`${BASE_URL}/api/nfts/inexistente`);
    assert.strictEqual(resNotFound.status, 404);
    const errorData = await resNotFound.json();
    assert.strictEqual(errorData.code, "NOT_FOUND");
    console.log("  -> OK (Detalhe encontrado e 404 para inexistente)");
  }

  // 3. Autenticação e Sessão
  let aliceToken = "";
  {
    console.log("3. Testando /api/auth/me sem token (esperado 401)...");
    const resNoAuth = await fetch(`${BASE_URL}/api/auth/me`);
    assert.strictEqual(resNoAuth.status, 401);

    console.log(
      "3.1. Testando POST /api/auth/login com credenciais de Alice...",
    );
    const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alice@greenmint.io",
        password: "Senha123!",
      }),
    });
    assert.strictEqual(resLogin.status, 200);
    const authData = await resLogin.json();
    assert.ok(authData.token);
    assert.strictEqual(authData.user.email, "alice@greenmint.io");
    aliceToken = authData.token;

    console.log("3.2. Testando GET /api/auth/me com token de Alice...");
    const resMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resMe.status, 200);
    const meData = await resMe.json();
    assert.strictEqual(meData.id, "usr_alice");

    console.log(
      "3.3. Testando POST /api/auth/register com e-mail já existente (esperado 409)...",
    );
    const resConflict = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice Fake",
        email: "alice@greenmint.io",
        password: "SenhaForte123!",
      }),
    });
    assert.strictEqual(resConflict.status, 409);

    console.log("3.4. Testando POST /api/auth/register com novo usuário...");
    const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Carlos Teste",
        email: "carlos@greenmint.io",
        password: "SenhaForte123!",
      }),
    });
    assert.strictEqual(resReg.status, 201);
    const regData = await resReg.json();
    assert.ok(regData.token);
    assert.strictEqual(regData.user.email, "carlos@greenmint.io");

    console.log("3.5. Testando POST /api/auth/logout...");
    const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resLogout.status, 200);

    console.log(
      "  -> OK (Fluxos de autenticação, registro, conflito e logout)",
    );
  }

  // 4. Favoritos
  {
    console.log("4. Testando GET /api/favorites...");
    const resFavs = await fetch(`${BASE_URL}/api/favorites`, {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resFavs.status, 200);
    const favs = await resFavs.json();
    assert.ok(favs.items.length >= 2);

    console.log("4.1. Testando POST /api/favorites/nft-05...");
    const resAddFav = await fetch(`${BASE_URL}/api/favorites/nft-05`, {
      method: "POST",
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resAddFav.status, 200);
    const favResult = await resAddFav.json();
    assert.strictEqual(favResult.isFavorite, true);

    console.log("4.2. Testando DELETE /api/favorites/nft-05...");
    const resDelFav = await fetch(`${BASE_URL}/api/favorites/nft-05`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resDelFav.status, 200);
    console.log("  -> OK (Favoritos: leitura, adição e remoção)");
  }

  // 5. Carrinho e Cotação
  {
    console.log("5. Testando POST /api/cart/items...");
    const resAdd = await fetch(`${BASE_URL}/api/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ nftId: "nft-01", edition: 49, quantity: 1 }),
    });
    assert.strictEqual(resAdd.status, 201);
    const cart = await resAdd.json();
    assert.strictEqual(cart.items.length, 1);
    const itemId = cart.items[0].id;

    console.log("5.1. Testando PATCH /api/cart/items/:itemId...");
    const resPatch = await fetch(`${BASE_URL}/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({ quantity: 2 }),
    });
    assert.strictEqual(resPatch.status, 200);
    const updatedCart = await resPatch.json();
    assert.strictEqual(updatedCart.items[0].quantity, 2);

    console.log("5.2. Testando POST /api/cart/quote com cupom KURIO10...");
    const resQuote = await fetch(`${BASE_URL}/api/cart/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        items: [{ nftId: "nft-01", edition: 49, quantity: 2 }],
        couponCode: "KURIO10",
      }),
    });
    assert.strictEqual(resQuote.status, 200);
    const quote = await resQuote.json();
    assert.strictEqual(typeof quote.subtotalEth, "string");
    assert.strictEqual(typeof quote.totalEth, "string");
    assert.strictEqual(quote.coupon?.code, "KURIO10");

    console.log("5.3. Testando DELETE /api/cart/items/:itemId...");
    const resDelItem = await fetch(`${BASE_URL}/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resDelItem.status, 200);

    console.log("  -> OK (Carrinho: inserção, patch, cotação e remoção)");
  }

  // 6. Pedido com Idempotência (RN-10)
  let createdOrderId = "";
  {
    console.log("6. Testando criação de pedido com Idempotency-Key...");
    const idempotencyKey = "key-test-uuid-12345";
    const orderPayload = {
      items: [
        {
          nftId: "nft-01",
          edition: 49,
          quantity: 1,
          priceEth: "0.45",
        },
      ],
      walletId: "0x71C836e4922e921b7736413a2aC4D5aDb2849A1",
      network: "Ethereum Mainnet",
      totalEth: "0.410",
    };

    const resOrder1 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(orderPayload),
    });
    assert.strictEqual(resOrder1.status, 201);
    const order1 = await resOrder1.json();
    assert.ok(order1.id);
    assert.strictEqual(order1.status, "confirmed");
    createdOrderId = order1.id;

    console.log(
      "6.1. Reenviando com MESMA chave e MESMO payload (esperado 200 com mesmo ID)...",
    );
    const resOrder2 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(orderPayload),
    });
    assert.strictEqual(resOrder2.status, 200);
    const order2 = await resOrder2.json();
    assert.strictEqual(order2.id, order1.id);

    console.log(
      "6.2. Reenviando com MESMA chave e payload DIVERGENTE (esperado 409 Conflict)...",
    );
    const divergentPayload = { ...orderPayload, totalEth: "9.999" };
    const resOrder3 = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(divergentPayload),
    });
    assert.strictEqual(resOrder3.status, 409);

    console.log("6.3. Testando GET /api/orders/:id com o pedido criado...");
    const resGetOrder = await fetch(
      `${BASE_URL}/api/orders/${createdOrderId}`,
      {
        headers: { Authorization: `Bearer ${aliceToken}` },
      },
    );
    assert.strictEqual(resGetOrder.status, 200);
    const getOrderData = await resGetOrder.json();
    assert.strictEqual(getOrderData.id, createdOrderId);
    assert.ok(getOrderData.txHash);
    console.log(
      "  -> OK (Idempotência rigorosamente comprovada e recibo imutável consultado)",
    );
  }

  // 7. Carteiras
  {
    console.log("7. Testando GET /api/wallets e PUT /api/wallets...");
    const resWallets = await fetch(`${BASE_URL}/api/wallets`, {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resWallets.status, 200);
    const walletsData = await resWallets.json();
    assert.ok(walletsData.wallets.length >= 1);

    const resPutWallets = await fetch(`${BASE_URL}/api/wallets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        primaryWallet: {
          id: "0x71C836e4922e921b7736413a2aC4D5aDb2849A1",
          provider: "metamask",
          network: "Ethereum Mainnet",
          balanceEth: "5.000",
        },
      }),
    });
    assert.strictEqual(resPutWallets.status, 200);
    console.log("  -> OK (Carteiras consultadas e atualizadas)");
  }

  // 8. Perfil e Senha
  {
    console.log(
      "8. Testando GET /api/profile, PUT /api/profile e PATCH /api/profile/password...",
    );
    const resProfile = await fetch(`${BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${aliceToken}` },
    });
    assert.strictEqual(resProfile.status, 200);
    const profile = await resProfile.json();
    assert.strictEqual(profile.email, "alice@greenmint.io");

    const resPutProfile = await fetch(`${BASE_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        name: "Alice Vance Updated",
        bio: "NFT Collector & Web3 Enthusiast",
      }),
    });
    assert.strictEqual(resPutProfile.status, 200);
    const updatedProfile = await resPutProfile.json();
    assert.strictEqual(updatedProfile.name, "Alice Vance Updated");

    console.log(
      "8.1. Testando PATCH /api/profile/password com senha inválida (esperado 401)...",
    );
    const resBadPass = await fetch(`${BASE_URL}/api/profile/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        currentPassword: "SenhaIncorreta!",
        newPassword: "NovaSenha123!",
      }),
    });
    assert.strictEqual(resBadPass.status, 401);

    console.log(
      "8.2. Testando PATCH /api/profile/password com senha correta...",
    );
    const resGoodPass = await fetch(`${BASE_URL}/api/profile/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aliceToken}`,
      },
      body: JSON.stringify({
        currentPassword: "Senha123!",
        newPassword: "NovaSenha123!",
      }),
    });
    assert.strictEqual(resGoodPass.status, 200);
    console.log("  -> OK (Perfil e alteração de senha)");
  }

  // 9. Dev Status & Events
  {
    console.log(
      "9. Testando GET /api/__dev/status e POST /api/__dev/events...",
    );
    const resStatus = await fetch(`${BASE_URL}/api/__dev/status`);
    assert.strictEqual(resStatus.status, 200);
    const statusData = await resStatus.json();
    assert.ok(statusData.scenario);

    const resEvent = await fetch(`${BASE_URL}/api/__dev/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "nft.updated",
        payload: {
          eventId: "test_evt_1",
          resource: "nft",
          resourceId: "nft-01",
          version: 2,
        },
      }),
    });
    assert.strictEqual(resEvent.status, 200);
    console.log("  -> OK (Dev status e disparo de eventos)");
  }

  // 10. Reset do Mock
  {
    console.log("10. Testando POST /api/__dev/reset...");
    const resReset = await fetch(`${BASE_URL}/api/__dev/reset`, {
      method: "POST",
    });
    assert.strictEqual(resReset.status, 200);
    console.log("  -> OK (Reset restaurou banco de dados)");
  }

  console.log("=== TODOS OS TESTES PASSARAM COM SUCESSO! ===");
  server.close();
}

runTests().catch((err) => {
  console.error("FALHA NOS TESTES:", err);
  server.close();
  process.exit(1);
});
