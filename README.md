# And I Wonder

A Vietnamese/English quant learning studio, built from the **Road to Quant** Obsidian curriculum. Public visitors can read; the configured GitHub owner can save progress and edit the original Markdown notes.

Production address: **https://and-i-wonder-quant.vercel.app**

## Learning experience

- Three animated portals: Daily, Projects, Resources. Hovered objects jump out, land, then dissolve. Reduced-motion preferences disable these effects.
- A monthly calendar covering **7 October 2026–6 October 2028**: 731 days, 523 four-hour study sessions and 208 weekend rest days.
- Self-contained bilingual daily lessons with definitions, data-matched charts and reasoning diagrams, worked examples, four study blocks, exercises, hidden hints and sample answers. References are optional.
- Five project quest lines and a free-resource library of book covers, research scrolls and video cassettes.
- The 899 imported Markdown notes retain checklists, links, wikilinks, callouts, code, tables, math and note embeds. Original daily plans remain available in a collapsed reference panel.
- Search, Markdown downloads, owner study logs and revision-checked Markdown editing. Both languages share progress.

This is a structured learning curriculum, not an academic qualification. It does not claim that completing a fixed number of hours is equivalent to a PhD.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Reading the published curriculum works without credentials. MongoDB is required for progress and Markdown overrides; GitHub OAuth is required to edit. Missing storage produces an explicit sync error rather than a false success.

See [backend setup](docs/backend.md) for environment variables and API contracts. Set `APP_URL` to the exact local/deployed origin and register `<APP_URL>/api/auth/callback` with the GitHub OAuth App. A separate OAuth App is convenient for local development.

Production credentials belong in Vercel environment variables. Never add `NEXT_PUBLIC_` to any secret. The database user should have `readWrite` only on `and_i_wonder`.

## Validation

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm start
npm run test:e2e
```

Use `TEST_BASE_URL` to test another local port or a deployment. Browser tests cover English/Vietnamese persistence, portal navigation, month navigation, lesson answers, read-only guest controls, search, library destinations, responsive widths and rollback after a failed owner save. The failed-save test uses an explicit mock; it is not evidence of a live MongoDB write.

## Content and progress

`data/notes.json` is the curated Obsidian import. `scripts/import_obsidian.py` reads only the chosen Road to Quant folder and never modifies the vault. Check its command-line help before reimporting. Imported translations preserve original wiki targets and checkbox order.

The lesson modules are in the `data/lessons-*.json` files imported by `lib/lessons.ts`. Their schema is `lib/lesson-types.ts`. Each module has five sequential sessions. The original schedule starts on Wednesday, so sessions run Wednesday, Thursday, Friday, Monday, Tuesday. The last week uses only its first three sessions.

Original Markdown task IDs use `<noteId>::0`, `::1`, etc. New lesson agenda IDs use `<noteId>::lesson0` through `::lesson3`; redesigning the course does not overwrite the meaning of an imported task. Calendar completion uses the four lesson blocks or an explicit `done` status. Owner evidence is omitted from public API responses.

Progress and note overrides are stored in MongoDB. This is an import/export workflow: browser changes do not automatically write into the local Obsidian vault. Obsidian community plugins are not executed in the browser; the roadmap's `.base` dashboard links to the web calendar.

Book-cover designs and portal illustrations are original SVG/CSS compositions. The library links to free official resources; it does not bundle third-party books or redistribute publisher PDFs.

## Deployment

The Vercel project is `and-i-wonder`. The GitHub repository is `dakiemdarktharr/And_I_Wonder`. Production uses the custom Vercel subdomain above because the shorter `and-i-wonder.vercel.app` name was already taken.

After changing environment variables, deploy again for the new values to take effect. Production sign-in should be tested at the canonical production URL, which must also match the OAuth callback configuration.
