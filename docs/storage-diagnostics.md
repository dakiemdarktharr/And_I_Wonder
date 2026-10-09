# Atlas connectivity investigation — 8 October 2026

Status: production connectivity recovered on 8 October 2026. Both progress and note reads return HTTP 200. The user subsequently confirmed GitHub authorization and that the checkbox remained checked after reload.

## Recovery verification

After the user reconfirmed the active `0.0.0.0/0` entry, the existing deployment succeeded without another application or infrastructure change. Node 24, region `sin1`, and certificate validation remain unchanged. The exact underlying cause or propagation timing was not independently established.

- `GET /api/progress`: HTTP 200 with an empty progress snapshot.
- `GET /api/notes/Daily/2026-10/2026-10-07`: HTTP 200 with note, revision, and progress fields after database reads.
- `GET /api/auth/login`: HTTP 302 to GitHub with the canonical production callback.
- Unauthenticated `PATCH /api/progress`: HTTP 401, correctly denied before writes.

The owner sign-in and checkbox save/reload were subsequently confirmed by the user. This is distinct from the automated public-read and unauthorized-write checks above.

## Observations

- The user supplied a production `MongoServerSelectionError` with `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR` (alert 80). DNS discovery had found all three replica-set members. This message alone does not establish the root cause.
- From the user's Windows machine, Node 24.18 connected to all three members with valid certificates and TLS 1.3. An unauthenticated MongoDB `hello` returned `ok: 1`, a primary, and wire version 25. No database password was needed or disclosed.
- A temporary, expiring bearer-protected diagnostic ran in the same Vercel production environment. Unauthenticated requests returned 404 before network access. Responses contained fixed diagnostic categories and configuration booleans, never credentials or raw connection strings.
- Production configuration parsed successfully, matched the expected cluster, used SRV and TLS, retained certificate verification, included credentials, and had no proxy or custom SNI override.
- On Vercel in `sin1`, Node 24.21.0 / OpenSSL 3.5.7 failed both default TLS and explicitly limited TLS 1.2. A direct unauthenticated MongoDB connection to the known replica-set members failed with the same TLS category; the configured authenticated connection also failed.
- Repeating on Node 22.23.2 / OpenSSL 3.5.7 produced the same results. Changing Node major versions did not resolve the failure. Both deployed versions shared OpenSSL 3.5.7, so this is not an independent OpenSSL-version comparison.
- The project was restored to Node 24 and the temporary endpoint removed after these measurements. Certificate verification was never disabled.

## What follows from these observations

During the incident, the failure was reproducible on the Vercel-to-Atlas connection before password authentication, including without the application's SRV connection string. It was not evidence of a bad database password. Local connectivity succeeded, so the cluster was responding during the local test.

The user reports an active `0.0.0.0/0` entry. Tools could not inspect Atlas configuration, and Vercel log APIs returned 403. The successful production reads above supersede the earlier blocked status; no further network-setting change was made.

Do not disable TLS verification, reset credentials, or declare storage fixed based only on an error-category change. After connectivity is repaired, verify production reads and an owner-authorized save/reload flow.

Reference: [MongoDB Atlas connection troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).
