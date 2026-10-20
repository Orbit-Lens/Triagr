# Triagr BACKEND — Agent Instructions

You are the **backend agent**. Your whole world is the `backend/` folder and the InsForge project it targets. Do not open, edit, or run anything in `../frontend` or `../simulation`.

## Mode: STANDALONE (until the user says "start integration")
- The backend is verified **without any UI**: SQL checks, the InsForge CLI/dashboard, and a small contract-test script using two test users.
- Do not write frontend code. Do not assume the frontend exists. The only coupling is the written contract (`context/api-contracts.md`, `context/simulation-seam.md`).
- Keep the contract accurate: if reality differs from the docs, fix the docs.

## Start of EVERY session (new chat = no memory, so do this first)
Read in this order, fully, before doing anything:
1. `AGENTS.md` (this file)
2. `context/progress-tracker.md` — what is done, what is next, VERIFY answers, decisions. **This is your memory.**
3. `context/project-overview.md`
4. `context/prd.md`
5. `context/architecture.md`
6. `context/data-model.md`
7. `context/api-contracts.md`
8. `context/simulation-seam.md`
9. `context/code-standards.md`
10. `context/library-docs.md`
11. `context/build-plan.md`
12. `context/instructions.md` — step-by-step procedure for the current block

Then reply with a 5-line summary: current block, last completed task, next task, blockers, what you will verify. Wait for the user's go-ahead unless they already gave a task.

## Working loop (every task)
1. Pick the next unchecked task in `progress-tracker.md` (or the one the user names).
2. Say in one sentence what you will do.
3. Resolve any **VERIFY** item that the task depends on (official docs or InsForge MCP metadata) and record the answer in the tracker before writing SQL that relies on it.
4. Implement as a numbered migration file or seed or function; never edit an applied migration, add a new one.
5. Apply it and run the checks in `instructions.md` (clean apply, re-run safe, contract tests).
6. Update `context/data-model.md` / `context/api-contracts.md` if reality changed, then `context/progress-tracker.md`.
7. Give the user a short result: what changed, how to verify manually, what is next.

## Hard rules
- RLS on every table, default deny. Never ship a table without policies.
- Events are append-only for clients. Scenarios are read-only for clients.
- No secrets in git. Service or admin keys never leave `backend/` and never go into any frontend file or doc.
- Never invent InsForge API names or CLI commands. Check docs or MCP.
- No PostHog, BrowserBase, pgvector, model gateway, or any Llama/OpenAI usage.
- Seeds and content are generic and training-only: no real-system parameters, no operational doctrine.
- If a context file is wrong or contradicts another, stop, tell the user, propose a fix.
- Do not stop at "it applies": run the two-user isolation test before calling RLS done.

## If the user asks for something outside the backend
Say it belongs to the frontend or integration phase, note it in the tracker under "Cross-part notes", and continue backend work.

## End of session
Make sure `progress-tracker.md` has: current block, what was finished, exact next step, open questions, answers to VERIFY items. The next chat relies on it.

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **Triagr** (API base `https://4k39ig7s.ap-southeast.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
