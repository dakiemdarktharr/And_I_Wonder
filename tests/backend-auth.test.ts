import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { SignJWT } from "jose";
import { completeGithubLogin, createGithubLoginResponse, getOwnerSession, isSameOrigin } from "@/lib/auth";

const originalEnv = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  APP_URL: process.env.APP_URL,
  OWNER_GITHUB_LOGIN: process.env.OWNER_GITHUB_LOGIN,
  OWNER_GITHUB_ID: process.env.OWNER_GITHUB_ID,
};
const secret = "test-only-secret-that-is-at-least-32-bytes-long";

before(() => {
  process.env.AUTH_SECRET = secret;
  process.env.APP_URL = "https://quant.example";
  process.env.OWNER_GITHUB_LOGIN = "dakiemdarktharr";
  process.env.OWNER_GITHUB_ID = "174160458";
});

after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

async function sessionCookie({
  id = "174160458",
  login = "dakiemdarktharr",
  expires = "1h",
}: { id?: string; login?: string; expires?: string } = {}): Promise<string> {
  const token = await new SignJWT({ login, avatarUrl: "https://avatars.githubusercontent.com/u/174160458?v=4" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(id)
    .setIssuer("https://quant.example")
    .setAudience("and-i-wonder-owner")
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(new TextEncoder().encode(secret));
  return `aiw_session=${encodeURIComponent(token)}`;
}

test("a valid signed owner session resolves only to the configured GitHub ID", async () => {
  const owner = await getOwnerSession(new Request("https://quant.example/api/auth/session", {
    headers: { cookie: await sessionCookie() },
  }));
  assert.deepEqual(owner, {
    id: "174160458",
    login: "dakiemdarktharr",
    avatarUrl: "https://avatars.githubusercontent.com/u/174160458?v=4",
  });
});

test("tampered, expired, and non-owner cookies are rejected", async () => {
  const wrongId = await getOwnerSession(new Request("https://quant.example", {
    headers: { cookie: await sessionCookie({ id: "174160459" }) },
  }));
  delete process.env.OWNER_GITHUB_ID;
  const wrongLogin = await getOwnerSession(new Request("https://quant.example", {
    headers: { cookie: await sessionCookie({ login: "someone-else" }) },
  }));
  process.env.OWNER_GITHUB_ID = "174160458";
  const expired = await getOwnerSession(new Request("https://quant.example", {
    headers: { cookie: await sessionCookie({ expires: "-1s" }) },
  }));
  const tampered = await getOwnerSession(new Request("https://quant.example", {
    headers: { cookie: `${await sessionCookie()}x` },
  }));
  assert.equal(wrongId, null);
  assert.equal(wrongLogin, null);
  assert.equal(expired, null);
  assert.equal(tampered, null);
});

test("same-origin write guard requires the configured origin and rejects cross-site fetches", () => {
  assert.equal(isSameOrigin(new Request("https://quant.example/api/progress", {
    method: "PATCH", headers: { origin: "https://quant.example", "sec-fetch-site": "same-origin" },
  })), true);
  assert.equal(isSameOrigin(new Request("https://quant.example/api/progress", {
    method: "PATCH", headers: { origin: "https://evil.example" },
  })), false);
  assert.equal(isSameOrigin(new Request("https://quant.example/api/progress", { method: "PATCH" })), false);
  assert.equal(isSameOrigin(new Request("https://quant.example/api/progress", {
    method: "PATCH", headers: { origin: "https://quant.example", "sec-fetch-site": "cross-site" },
  })), false);
});

test("GitHub OAuth binds the callback to its state cookie and keeps the access token server-side", async () => {
  const originalFetch = globalThis.fetch;
  const originalClientId = process.env.GITHUB_CLIENT_ID;
  const originalClientSecret = process.env.GITHUB_CLIENT_SECRET;
  process.env.GITHUB_CLIENT_ID = "test-client-id";
  process.env.GITHUB_CLIENT_SECRET = "server-only-test-secret";
  let tokenExchanges = 0;
  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url === "https://github.com/login/oauth/access_token") {
      tokenExchanges += 1;
      assert.match(String(init?.body), /server-only-test-secret/);
      return Response.json({ access_token: "private-github-access-token" });
    }
    assert.equal(url, "https://api.github.com/user");
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer private-github-access-token");
    return Response.json({
      id: 174160458,
      login: "dakiemdarktharr",
      avatar_url: "https://avatars.githubusercontent.com/u/174160458?v=4",
    });
  }) as typeof fetch;

  try {
    const login = await createGithubLoginResponse(new Request("https://quant.example/api/auth/login"));
    assert.equal(login.status, 302);
    const authorization = new URL(login.headers.get("location") || "");
    assert.equal(authorization.origin, "https://github.com");
    assert.equal(authorization.searchParams.get("client_id"), "test-client-id");
    const setCookie = login.headers.get("set-cookie") || "";
    const state = /aiw_oauth_state=([^;,]+)/.exec(setCookie)?.[1];
    assert.ok(state);

    const rejected = await completeGithubLogin(new Request(`https://quant.example/api/auth/callback?code=abc&state=wrong`, {
      headers: { cookie: setCookie.split(";")[0] },
    }));
    assert.equal(rejected.status, 400);
    assert.equal(tokenExchanges, 0);

    const callback = await completeGithubLogin(new Request(`https://quant.example/api/auth/callback?code=abc&state=${state}`, {
      headers: { cookie: setCookie.split(";")[0] },
    }));
    assert.equal(callback.status, 303);
    assert.equal(new URL(callback.headers.get("location") || "").origin, "https://quant.example");
    assert.equal(tokenExchanges, 1);
    const cookies = callback.headers.get("set-cookie") || "";
    assert.doesNotMatch(cookies, /private-github-access-token/);
    const sessionToken = /aiw_session=([^;,]+)/.exec(cookies)?.[1];
    assert.ok(sessionToken);
    const owner = await getOwnerSession(new Request("https://quant.example", {
      headers: { cookie: `aiw_session=${sessionToken}` },
    }));
    assert.equal(owner?.id, "174160458");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalClientId === undefined) delete process.env.GITHUB_CLIENT_ID;
    else process.env.GITHUB_CLIENT_ID = originalClientId;
    if (originalClientSecret === undefined) delete process.env.GITHUB_CLIENT_SECRET;
    else process.env.GITHUB_CLIENT_SECRET = originalClientSecret;
  }
});

test("owner login fallback remains case-insensitive when stable ID is not configured", async () => {
  delete process.env.OWNER_GITHUB_ID;
  const owner = await getOwnerSession(new Request("https://quant.example", {
    headers: { cookie: await sessionCookie({ id: "999", login: "DaKiEmDarkTharr" }) },
  }));
  assert.equal(owner?.id, "999");
  process.env.OWNER_GITHUB_ID = "174160458";
});
