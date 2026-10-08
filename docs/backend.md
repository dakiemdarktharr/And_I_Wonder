# Backend setup and API

The app keeps the learning material in the repository and uses MongoDB for owner edits and progress. Everyone can read the notes and public progress. Evidence text is private to the authenticated GitHub owner. The server returns `503` when MongoDB is not configured or unavailable; it never reports an unsaved change as saved.

## Environment

Configure these variables in local `.env.local` and in the Vercel project settings. Keep secrets in the server environment; never prefix them with `NEXT_PUBLIC_`.

| Variable | Purpose |
| --- | --- |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | Server-only GitHub OAuth App secret |
| `AUTH_SECRET` | At least 32 random bytes used to sign owner sessions; generate a fresh value for each environment |
| `OWNER_GITHUB_LOGIN` | Expected owner login; defaults to `dakiemdarktharr` |
| `OWNER_GITHUB_ID` | Stable numeric GitHub user ID; recommended, currently `174160458` |
| `APP_URL` | Canonical app origin, such as `https://your-app.vercel.app` |
| `MONGODB_URI` | MongoDB connection string, with credentials scoped to this app database |
| `MONGODB_DB` | Database name; defaults to `and_i_wonder` |

Set the GitHub OAuth App callback URL to `<APP_URL>/api/auth/callback`. The OAuth app needs only the public `read:user` scope. Add the same environment variables separately to the Vercel environments where owner sign-in should work. Use an OAuth app callback that exactly matches the selected environment's `APP_URL`.

`AUTH_SECRET` can be generated locally with `openssl rand -base64 48`. Do not commit `.env.local`, OAuth credentials, the MongoDB URI, or session tokens. Give the MongoDB application user read/write access only to the configured database.

## Routes

| Route | Access | Result |
| --- | --- | --- |
| `GET /api/auth/login` | Public | Starts GitHub OAuth with a random, HTTP-only state cookie |
| `GET /api/auth/callback` | GitHub redirect | Exchanges the code on the server, checks the GitHub user ID/login, and sets a signed HTTP-only session |
| `POST /api/auth/logout` | Same-origin browser request | Clears the session cookie |
| `GET /api/auth/session` | Public | Returns `{ "authenticated": false }` or `{ "authenticated": true, "owner": { "login", "avatarUrl" } }` |
| `GET /api/progress` | Public | Returns `{ "notes": { [noteId]: { "checked", "status", "actualMinutes", "updatedAt" } } }`; owner sessions also receive `evidence` |
| `PATCH /api/progress` | Owner session and same-origin request | Saves checkbox, status, time, or private evidence fields |
| `GET /api/notes/<vault-relative-id>` | Public | Returns `{ "note", "revision", "progress }`; private `progress.evidence` is included only for the owner |
| `PATCH /api/notes/<vault-relative-id>` | Owner session and same-origin request | Updates Markdown with optimistic revision checking, or separately updates private evidence |
| `GET /api/notes/<vault-relative-id>?download=md` | Public | Downloads the English Markdown note; use `&lang=vi` for Vietnamese |

Note IDs are vault-relative paths without `.md`, for example `Daily/2026-10/2026-10-07` or `Projects/P01`. Markdown checkboxes receive positional IDs in document order: `<noteId>::0`, `<noteId>::1`, and so on. Both language bodies must keep the same checkbox order and count.

Example checkbox update:

```json
{
  "noteId": "Daily/2026-10/2026-10-07",
  "taskId": "Daily/2026-10/2026-10-07::0",
  "checked": true
}
```

Allowed statuses are `planned`, `in-progress`, `done`, and `blocked`. `actualMinutes` is an integer from 0 to 1440. Evidence is plain text with a 10,000 character limit. The UI should render it as text, never as HTML.

Markdown edits require the revision returned by the note GET response:

```json
{
  "body": "Updated Markdown...",
  "expectedRevision": "<64 character SHA-256 revision from GET>"
}
```

The Markdown API rejects unsafe HTML patterns and edits that change the number of checkboxes. A stale `expectedRevision` returns HTTP `409` with the latest revision so the editor can reload before retrying. Evidence updates use `{ "evidence": "..." }` in a separate PATCH to the same note route, or `PATCH /api/progress` with `noteId` and `evidence`.

## Storage and privacy

The `progress` collection stores task booleans, status, actual minutes, evidence, and update time by note ID. The `noteEdits` collection stores the owner's Markdown overrides and current revision. The first owner write creates a unique index on each collection's `noteId`. GitHub access tokens are used only during the server-side code exchange and are not saved in the browser or database; the browser receives only a short-lived signed session cookie with `HttpOnly`, `SameSite=Lax`, and `Secure` in production.

Every write checks the exact app origin and the signed owner identity. Set `OWNER_GITHUB_ID` so authorization remains tied to the account's stable numeric ID even if its login changes. Public progress responses omit evidence entirely. Note reads include private evidence only after verifying the owner session.

## Local checks

From the app directory:

```powershell
npm run typecheck
npm test
```

## Redesigned daily agendas

Study-day agenda tasks use IDs `<noteId>::lesson0` through `<noteId>::lesson3`. They are validated separately from the original Markdown task indices and are unavailable on rest days. The same MongoDB progress collection stores both namespaces without reinterpreting imported checkbox history. Public snapshots omit private evidence; both languages use the same IDs.
