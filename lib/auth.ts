import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "aiw_session";
const STATE_COOKIE = "aiw_oauth_state";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const STATE_SECONDS = 60 * 10;
const DEFAULT_OWNER_LOGIN = "dakiemdarktharr";

export type OwnerSession = {
  id: string;
  login: string;
  avatarUrl: string;
};

function configuredOwnerLogin(): string {
  return (process.env.OWNER_GITHUB_LOGIN || DEFAULT_OWNER_LOGIN).trim();
}

function configuredOwnerId(): string | undefined {
  const value = process.env.OWNER_GITHUB_ID?.trim();
  if (value && !/^\d+$/.test(value)) throw new Error("OWNER_GITHUB_ID must be a numeric GitHub user ID");
  return value || undefined;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || new TextEncoder().encode(secret).byteLength < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 bytes");
  }
  return new TextEncoder().encode(secret);
}

function issuer(): string {
  const base = process.env.APP_URL || "http://localhost:3000";
  return new URL(base).origin;
}

function appBase(request: Request): string {
  if (!process.env.APP_URL && process.env.NODE_ENV === "production") throw new Error("APP_URL must be configured in production");
  const base = process.env.APP_URL || new URL(request.url).origin;
  const url = new URL(base);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("APP_URL must use HTTP or HTTPS");
  return url.origin;
}

function cookieFlags(maxAge: number, path = "/"): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `; Path=${path}; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const entry of cookieHeader.split(";")) {
    const separator = entry.indexOf("=");
    if (separator < 0 || entry.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(entry.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function clearCookie(name: string, path = "/"): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${name}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

function appendCookie(headers: Headers, value: string): void {
  headers.append("Set-Cookie", value);
}

function json(body: unknown, status = 200, headers = new Headers()): Response {
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(body), { status, headers });
}

export function jsonError(message: string, status: number, headers = new Headers()): Response {
  return json({ error: message }, status, headers);
}

/** Reject browser writes unless the request came from this exact web origin. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  try {
    return new URL(origin).origin === appBase(request);
  } catch {
    return false;
  }
}

export async function getOwnerSession(request: Request): Promise<OwnerSession | null> {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      issuer: issuer(),
      audience: "and-i-wonder-owner",
    });
    const session = ownerFromPayload(payload);
    if (!session) return null;
    const expectedId = configuredOwnerId();
    if (expectedId ? session.id !== expectedId : session.login.toLowerCase() !== configuredOwnerLogin().toLowerCase()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function ownerFromPayload(payload: JWTPayload): OwnerSession | null {
  if (typeof payload.sub !== "string" || !/^\d+$/.test(payload.sub)) return null;
  if (typeof payload.login !== "string" || typeof payload.avatarUrl !== "string") return null;
  let avatarUrl = "";
  try {
    const url = new URL(payload.avatarUrl);
    if (url.protocol === "https:" && url.hostname === "avatars.githubusercontent.com") avatarUrl = url.toString();
  } catch {
    return null;
  }
  return { id: payload.sub, login: payload.login, avatarUrl };
}

export async function createGithubLoginResponse(request: Request): Promise<Response> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId || !process.env.GITHUB_CLIENT_SECRET) return jsonError("GitHub sign-in is not configured.", 503);
  secretKey();
  configuredOwnerId();
  const state = randomBytes(32).toString("base64url");
  const callback = new URL("/api/auth/callback", appBase(request));
  const destination = new URL("https://github.com/login/oauth/authorize");
  destination.searchParams.set("client_id", clientId);
  destination.searchParams.set("redirect_uri", callback.toString());
  destination.searchParams.set("scope", "read:user");
  destination.searchParams.set("state", state);
  destination.searchParams.set("allow_signup", "false");

  const headers = new Headers({ Location: destination.toString(), "Cache-Control": "no-store" });
  appendCookie(headers, `${STATE_COOKIE}=${encodeURIComponent(state)}${cookieFlags(STATE_SECONDS, "/api/auth")}`);
  return new Response(null, { status: 302, headers });
}

function matchesState(request: Request, suppliedState: string | null): boolean {
  const cookieState = readCookie(request, STATE_COOKIE);
  if (!cookieState || !suppliedState) return false;
  const left = Buffer.from(cookieState);
  const right = Buffer.from(suppliedState);
  return left.length === right.length && timingSafeEqual(left, right);
}

type GithubUser = { id: number; login: string; avatar_url: string };

async function fetchGithubUser(code: string, request: Request): Promise<GithubUser> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("GitHub OAuth credentials are not configured");

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/api/auth/callback", appBase(request)).toString(),
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!tokenResponse.ok) throw new Error("GitHub token exchange failed");
  const tokenBody: unknown = await tokenResponse.json();
  if (!tokenBody || typeof tokenBody !== "object" || !("access_token" in tokenBody) || typeof tokenBody.access_token !== "string") {
    throw new Error("GitHub token exchange returned an invalid response");
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenBody.access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "And-I-Wonder",
    },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!userResponse.ok) throw new Error("GitHub user verification failed");
  const user: unknown = await userResponse.json();
  if (!user || typeof user !== "object" || !("id" in user) || !("login" in user) || !("avatar_url" in user)) {
    throw new Error("GitHub returned an invalid user response");
  }
  const candidate = user as GithubUser;
  if (!Number.isSafeInteger(candidate.id) || typeof candidate.login !== "string" || typeof candidate.avatar_url !== "string") {
    throw new Error("GitHub returned an invalid user profile");
  }
  return candidate;
}

export async function completeGithubLogin(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (url.searchParams.has("error") || !code || !matchesState(request, url.searchParams.get("state"))) {
    const headers = new Headers({ "Cache-Control": "no-store" });
    appendCookie(headers, clearCookie(STATE_COOKIE, "/api/auth"));
    return jsonError("GitHub sign-in could not be verified. Please try again.", 400, headers);
  }

  try {
    const githubUser = await fetchGithubUser(code, request);
    const expectedId = configuredOwnerId();
    const loginMatches = githubUser.login.toLowerCase() === configuredOwnerLogin().toLowerCase();
    if (expectedId ? String(githubUser.id) !== expectedId : !loginMatches) {
      const headers = new Headers({ "Cache-Control": "no-store" });
      appendCookie(headers, clearCookie(STATE_COOKIE, "/api/auth"));
      return jsonError("This GitHub account cannot edit the roadmap.", 403, headers);
    }

    const avatar = new URL(githubUser.avatar_url);
    if (avatar.protocol !== "https:" || avatar.hostname !== "avatars.githubusercontent.com") {
      throw new Error("GitHub returned an invalid avatar URL");
    }
    const token = await new SignJWT({ login: githubUser.login, avatarUrl: avatar.toString() })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(String(githubUser.id))
      .setIssuer(issuer())
      .setAudience("and-i-wonder-owner")
      .setIssuedAt()
      .setExpirationTime(`${SESSION_SECONDS}s`)
      .sign(secretKey());

    const headers = new Headers({ Location: new URL("/", appBase(request)).toString(), "Cache-Control": "no-store" });
    appendCookie(headers, `${SESSION_COOKIE}=${encodeURIComponent(token)}${cookieFlags(SESSION_SECONDS)}`);
    appendCookie(headers, clearCookie(STATE_COOKIE, "/api/auth"));
    return new Response(null, { status: 303, headers });
  } catch (error) {
    console.error("GitHub sign-in failed", error);
    const headers = new Headers({ "Cache-Control": "no-store" });
    appendCookie(headers, clearCookie(STATE_COOKIE, "/api/auth"));
    return jsonError("GitHub sign-in failed. Check the server OAuth configuration and try again.", 503, headers);
  }
}

export function logoutResponse(): Response {
  const headers = new Headers();
  appendCookie(headers, clearCookie(SESSION_COOKIE));
  headers.set("Cache-Control", "no-store");
  return json({ ok: true }, 200, headers);
}

export async function sessionResponse(request: Request): Promise<Response> {
  const owner = await getOwnerSession(request);
  return json(owner ? { authenticated: true, owner: { login: owner.login, avatarUrl: owner.avatarUrl } } : { authenticated: false });
}

export function authErrorResponse(message: string, status: number): Response {
  const headers = new Headers();
  appendCookie(headers, clearCookie(STATE_COOKIE, "/api/auth"));
  return jsonError(message, status, headers);
}
