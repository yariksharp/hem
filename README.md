# Hem

Hem tailors a CV to a specific job ad with AI. Personal project, in development.

## Run it on your computer

You need Node.js 24 and Git.

    npm install     # download the libraries (first time only)
    npm run dev     # start the app on http://localhost:3000

## Checks

    npm run lint    # ESLint: likely bugs
    npm run format  # Prettier: code style
    npm test        # Vitest: unit tests
    npm run build   # production build (needed before the integration tests)
    npm run test:e2e  # Playwright: integration tests in a real browser

## Tech choices

- Next.js 16 with the App Router, TypeScript in strict mode
- Styling: plain CSS with the Hem design tokens (src/styles/tokens.css), no Tailwind
- Unit tests: Vitest, next to the code in `src/` (`*.test.ts`)
- Integration tests: Playwright (Chromium), in `e2e/`. Chosen because it drives a real browser against the real build, so it covers what unit tests can't: redirects, cookies, sign-in with Supabase and keyboard use.

## Integration tests

They run against the production build on port 3100, started by Playwright itself.

First time only: `npx playwright install chromium` downloads the test browser.

The sign-in tests use a **separate test account**, never your own:

1. Supabase → Authentication → Users → Add user → Create new user, tick **Auto Confirm User**.
2. Put its email and password in `.env.local` as `E2E_EMAIL` and `E2E_PASSWORD`.
3. Add the same two as GitHub secrets (repo → Settings → Secrets and variables → Actions), plus `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Without `E2E_EMAIL` / `E2E_PASSWORD` the account tests are skipped locally. In CI they are required.
Traces, videos and screenshots are switched off so the test password is never recorded.

## Live site

Production: https://hem-three-peach.vercel.app (deploys automatically from main)

## Rollback

If a release is broken: Vercel → hem → Deployments → previous production deployment → ⋯ → Instant Rollback.
When the fix is merged: Undo Rollback (or Promote the newest deployment) so new pushes go live again.

## CI

Every push and pull request runs GitHub Actions (.github/workflows/ci.yml): lint, typecheck, unit tests, a production build and the Playwright integration tests on a clean Linux machine.
main is protected: a pull request can be merged only when this check is green.

## Backend

Supabase, Free plan, region: West EU (Ireland), eu-west-1 (EU, so CV data stays in the EU).
The database password and API keys are not in this repo. They live in a password manager, `.env.local` and Vercel.

Business logic lives in Next.js server code. Supabase is only the database, auth and storage.
Health check: `/api/health` returns `{ "ok": true }` when the app can reach the database.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Add the same variables in Vercel → hem → Settings → Environment Variables.

| Variable                        | What it is                                                                |
| ------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_ENV`           | Which environment the app runs in                                         |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (Dashboard → Project Settings → API)                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key. Safe in the browser because RLS protects data |

Never add the service-role key with a `NEXT_PUBLIC_` name.

### Database changes (migrations)

The database schema changes only through SQL files in `supabase/migrations/`. Never edit tables by hand in the dashboard.

    npx supabase migration new add_something   # creates an empty SQL file in supabase/migrations/
    # write the SQL in that file, commit it, open a pull request
    npx supabase migration list                # shows which migrations are applied (local vs remote)
    npx supabase db push                       # applies new migrations to the linked Supabase project

`db push` asks for the database password (from the password manager). Run it after the pull request is merged.

### Free plan pausing

On the Free plan, Supabase pauses a project after 7 days with little activity. When it's paused, the app can't reach the database and `/api/health` fails.

To restore it: Supabase dashboard → your organization → the `hem` project → **Resume project**. Data and settings come back as they were. A paused project can be resumed from the dashboard for up to a year; after that only a downloaded backup is left. Paid plans don't pause.
