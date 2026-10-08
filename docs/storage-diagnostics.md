# Atlas connectivity investigation — 8 October 2026

Status: unresolved. The learning site is available, but production storage returns `DB_TLS_FAILED`; successful persistence has not been verified.

## Observations

- The user supplied a production `MongoServerSelectionError` with `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR` (alert 80). DNS discovery had found all three replica-set members. This message alone does not establish the root cause.
- From the user's Windows machine, Node 24.18 connected to all three members with valid certificates and TLS 1.3. An unauthenticated MongoDB `hello` returned `ok: 1`, a primary, and wire version 25. No database password was needed or disclosed.
- A temporary, expiring bearer-protected diagnostic ran in the same Vercel production environment. Unauthenticated requests returned 404 before network access. Responses contained fixed diagnostic categories and configuration booleans, never credentials or raw connection strings.
- Production configuration parsed successfully, matched the expected cluster, used SRV and TLS, retained certificate verification, included credentials, and had no proxy or custom SNI override.
- On Vercel in `sin1`, Node 24.21.0 / OpenSSL 3.5.7 failed both default TLS and explicitly limited TLS 1.2. A direct unauthenticated MongoDB connection to the known replica-set members failed with the same TLS category; the configured authenticated connection also failed.
- Repeating on Node 22.23.2 / OpenSSL 3.5.7 produced the same results. Changing Node major versions did not resolve the failure. Both deployed versions shared OpenSSL 3.5.7, so this is not an independent OpenSSL-version comparison.
- The project was restored to Node 24 and the temporary endpoint removed after these measurements. Certificate verification was never disabled.

## What follows from these observations

The failure is reproducible on the Vercel-to-Atlas connection before password authentication, including without the application's SRV connection string. It is not evidence of a bad database password. Local connectivity succeeds, so the cluster was responding during the local test.

The user reports an active `0.0.0.0/0` entry. Atlas project scope and access-list configuration still need to be verified against the cluster actually used by production. If those are correct, further investigation needs Atlas network/service diagnostics. Current tools cannot inspect Atlas configuration, and Vercel log APIs returned 403.

Do not disable TLS verification, reset credentials, or declare storage fixed based only on an error-category change. After connectivity is repaired, verify production reads and an owner-authorized save/reload flow.

Reference: [MongoDB Atlas connection troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).
