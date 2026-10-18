# Hem — rules for Claude Code

@AGENTS.md

- Styling: use the tokens in src/styles/tokens.css only. Never hard-code colours, fonts or spacing. No Tailwind.
- Never put secrets (API keys, passwords) in code, commits or prompts. Secrets live in .env.local and in Vercel.
- Never log CV contents or other personal data.
- Business logic lives in Next.js server code. Supabase is only database, auth and storage.
- Schema changes only through migration files in supabase/migrations/ — never edit tables by hand in the dashboard.
- One Jira story per session. Commit before every AI task so changes can be undone.
- This repo is public: no real CV content, no personal data.
- Product docs (not in this repo): D:\PM\HEM CV\hem-handoff-spec.md and D:\PM\HEM CV\hem-brand-kit\tokens.css (source of truth for the look).
