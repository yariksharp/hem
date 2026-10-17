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

## Tech choices

- Next.js 16 with the App Router, TypeScript in strict mode
- Styling: plain CSS with the Hem design tokens (src/styles/tokens.css), no Tailwind
- Tests: Vitest

## Live site

Production: https://hem-three-peach.vercel.app (deploys automatically from main)

## Rollback

If a release is broken: Vercel → hem → Deployments → previous production deployment → ⋯ → Instant Rollback.
When the fix is merged: Undo Rollback (or Promote the newest deployment) so new pushes go live again.

## CI

Every push and pull request runs GitHub Actions (.github/workflows/ci.yml): lint, typecheck, unit tests and a production build on a clean Linux machine.
main is protected: a pull request can be merged only when this check is green.

## Backend

Supabase, Free plan, region: West EU (Ireland), eu-west-1 (EU, so CV data stays in the EU).
The database password and API keys are not in this repo. They live in a password manager, `.env.local` and Vercel.
