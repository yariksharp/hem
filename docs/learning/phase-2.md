# Phase 2 — what I learned

Written about a week after Sprint 1 from memory, then reviewed with Claude against the
real repo, Jira and GitHub history. Where my first version was wrong or vague, the
corrected version is below and the gap is listed at the end.

## Epics, stories, acceptance criteria

An epic is a big chunk of functionality, for example "Project foundation and delivery
pipeline" (HEM-1) or "Auth and account settings" (HEM-4). A story is one thing a user can
do, written as "As … I want … so that …". Acceptance criteria are the checks that must
all be true before the story is done. Example: HEM-18 (repo skeleton) sits under HEM-1,
its criteria include "`npm test` passes one sample test", and its subtasks HEM-29..34
were the steps to get there.

## Client and server

The client is what runs on the user's device, usually the browser. The server is a
computer somewhere else that receives requests and sends responses over HTTP. Requests
have methods: GET reads, POST sends new data, PUT/PATCH change data, DELETE removes it.
Status codes tell the result: 2xx success, 4xx the request was wrong (client side),
5xx the server failed. In Hem, `/api/health` answers a GET with 200 `{ ok: true }`, or
503 if it can't reach Supabase. Next.js mixes both in one codebase: files marked
`"use server"` (like `src/features/auth/actions.ts`) only run on the server, so secrets
and the sign-in call stay off the browser. In HEM-59 we fixed a bug where a sign-in
submitted before JavaScript loaded went as a GET and put the password in the URL; it is
a POST now.

## Git and GitHub: commit, branch, remote, push, pull request

Git is version control on my PC; GitHub is a website that hosts a copy of the repo.

- **Commit:** a saved snapshot of my changes with a message, stored locally. Nobody else
  sees it yet.
- **Branch:** a separate line of commits, so I can work on one thing without touching
  `main`. Example: `hem-59-sign-in-tests`.
- **Remote:** the copy on GitHub, called `origin` (`github.com/yariksharp/hem`).
- **Push:** upload my local commits to the remote (`git push -u origin <branch>`).
- **Pull:** the opposite, download new commits from the remote (`git pull`).
- **Pull request (PR):** a request on GitHub to merge my branch into `main`. CI runs on
  it and Vercel builds a preview. "Pull request" and `git pull` are different things.
- **Merge:** the PR's changes go into `main`. We squash, so the whole branch becomes one
  commit on `main`, e.g. `0e77f95 … (HEM-59) (#16)`.

`main` is protected (HEM-42): no direct pushes, only PRs with green CI. The first commits
in the history (before `e5267b9 Add CI workflow`) have no `(#N)` because they were pushed
straight to `main` before the protection existed.

**The whole flow, as a new developer on the team:**

1. Install Git, then `git clone` the repo, `npm install`, and copy `.env.example` to
   `.env.local` with the real values.
2. Before each piece of work: `git switch main`, `git pull` (get everything merged since
   last time), then `git switch -c <feature-branch>`. One branch = one change I can
   explain in a sentence, merged within a few days (in Hem: one subtask).
3. Change files and commit as I go. Each commit is a snapshot I can go back to. The
   branch stays only on my PC until I push.
4. `git push`: the branch appears on GitHub. Then open a PR into `main`.
5. CI starts on its own (lint, typecheck, unit tests, build, Playwright) and Vercel builds
   a preview. In a team, a reviewer looks at the PR at the same time. In Hem there is no
   reviewer (0 required approvals), so the green `ci` check is the only gate.
6. When everything is green, Merge puts the branch into `main` and production updates.
   Delete the branch.
7. `git switch main` and `git pull` (not push!) to bring the merged result to my PC.

Push sends commits **up** to GitHub; pull brings them **down**.

If two people change the same lines, Git can't merge by itself (a merge conflict) and
someone chooses by hand. A branch that's never merged never reaches production.

## Environments: local, preview, production

Same code, different settings. **Local** is my PC (`npm run dev`, localhost:3000,
values from `.env.local`, which Git ignores). **Preview** is a temporary Vercel copy
built for every push to a branch that isn't `main`, with its own URL in the PR.
**Production** is the real site, built from `main`: https://hem-three-peach.vercel.app.
In HEM-38, `NEXT_PUBLIC_APP_ENV` showed `local`, `preview` or `production` on the page.
`NEXT_PUBLIC_` values are visible in the browser, so never use that prefix for secrets.

A preview is a real, working website built from my branch, not a picture. Ours are
protected by Vercel Authentication, so only I can open them. There is only one Supabase
project, so if a preview has the Supabase variables, it uses the same database as
production, and sign-in there changes real data.

## Hosting, DNS and HTTPS

Hosting is where the site runs; for Hem that's Vercel. A domain registrar (like GoDaddy)
is where you buy a name; that's a separate job, though some companies do both. DNS is
the internet's phone book: it turns a name like `hem-three-peach.vercel.app` into the IP
address of a server. Our address is a free `*.vercel.app` subdomain; `hem.cv` comes
later. HTTPS is HTTP with encryption (TLS): nobody between the browser and the server
can read or change the traffic, and a certificate proves the site is really who it says.
Vercel issues the certificate automatically; the padlock in the browser shows it works.

## CI/CD

**CI (continuous integration):** every push and PR runs `.github/workflows/ci.yml` on a
fresh Linux machine in GitHub Actions: install, lint, typecheck, unit tests (Vitest),
build, then Playwright integration tests. If any step fails, the `ci` check is red and
the PR can't be merged. It's automatic checking, not a human code review. In the
red/green drill (HEM-43, PR #3) I broke `toBe(2)` to `toBe(3)`, saw red and the blocked
Merge button, fixed it, saw green and merged.

**CD (continuous deployment):** after a merge to `main`, Vercel builds and publishes
production automatically, with no manual step. We already have it through the Vercel
GitHub connection from HEM-19. And because `main` only accepts green PRs, only checked
code reaches production. If something still breaks, I can roll back to the previous
deployment in Vercel.

## Managed backend

A managed backend means someone else runs the servers, backups and updates, and I just
use the service. Supabase gives Hem a Postgres database, sign-in (Auth) and file storage.
Our rule: the business logic does **not** live in Supabase; it lives in our Next.js
server code. Table changes go only through SQL files in `supabase/migrations/`. The first
one creates `master_cv` with row-level security, so a signed-in user can only see their
own rows. The project is in the EU (Ireland), on the Free plan, which pauses after a week
without use.

## What is still unclear to me

- Git was the weakest part: before the review I mixed up push, pull and pull request,
  and I still reached for `git push` at the end instead of `git pull`. I want to
  practise the loop until I can do it without the recipe.
- Whether the Supabase variables in Vercel are set for Preview, so whether sign-in
  works on a preview at all. Not checked yet.
- What exactly a TLS certificate is and how the browser checks it.
- I didn't know what CD meant even though we already have it (Vercel auto-deploy).
- On 29 Oct `/api/health` in production returned 503: Supabase had most likely paused
  the project after a week without use (README "pause rule"). I resumed it from the
  dashboard. I want a way to notice this without checking by hand.
- How Vercel runs our server code (serverless functions, not one always-on computer).
- How the Supabase session and cookies keep me signed in after a reload (`src/proxy.ts`).
