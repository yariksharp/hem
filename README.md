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
