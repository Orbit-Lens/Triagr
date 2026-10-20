# Triagr FRONTEND — Agent Instructions

You are the **frontend agent**. Your whole world is the `frontend/` folder. Do not open, edit, or run anything in `../backend` or `../simulation`.

## Mode: STANDALONE (until the user says "start integration")
- All data comes from **mock adapters** (in-memory + `localStorage`), including mock authentication.
- Do NOT install or import `@insforge/sdk`. Do NOT create real InsForge calls. Do NOT ask for InsForge URLs or keys.
- Build the architecture so that real adapters can be dropped in later without touching features (ports and adapters, see `context/architecture.md`).
- The user will test the frontend manually and then decide when to integrate.

## Start of EVERY session (new chat = no memory, so do this first)
Read in this order, fully, before writing code:
1. `AGENTS.md` (this file)
2. `context/progress-tracker.md` — what is done, what is next, decisions, blockers. **This is your memory.**
3. `context/project-overview.md`
4. `context/prd.md`
5. `context/architecture.md`
6. `context/code-standards.md`
7. `context/ui-tokens.md`, `context/ui-rules.md`, `context/ui-registry.md`
8. `context/library-docs.md`
9. `context/build-plan.md`
10. `context/instructions.md` — step-by-step procedure for the current block

Then reply with a 5-line summary: current block, last completed task, next task, blockers, anything you will verify. Wait for the user's go-ahead unless they already gave a task.

## Working loop (every task)
1. Pick the next unchecked task in `progress-tracker.md` (or the one the user names).
2. Say in one sentence what you will build.
3. Implement it exactly per the context files. Reuse `ui-registry.md` components; add new ones to the registry first.
4. Run `npm run lint` and `npm run build` (and `npm test` once tests exist). Fix failures.
5. Update `context/progress-tracker.md`: tick the task, add decisions, deviations, known issues, date.
6. Give the user a short result: what changed, how to check it manually, what is next.

## Hard rules
- Follow `architecture.md` import directions. No `@insforge/sdk` anywhere in standalone mode.
- Never show ground truth in the trainee UI. Never use `Math.random()` or `Date.now()` in simulation logic; use the seeded PRNG and tick counter.
- No `any`. No hard-coded colours. shadcn/ui first. Handle loading, empty, and error states.
- Do not add libraries that are not in `library-docs.md` without asking. Never add PostHog, BrowserBase, Llama or OpenAI packages.
- Do not change the stack or folder structure without asking and logging the decision.
- If a context file is wrong or contradicts another, stop, tell the user, and propose a fix. Do not silently pick one.
- Do not mark a task done if lint or build fails.
- Training only: no real weapon or jamming details, effects are virtual labels.

## If the user asks for something outside the frontend
Say it belongs to the backend or integration phase, note it in the tracker under "Cross-part notes", and continue frontend work.

## End of session
Make sure `progress-tracker.md` has: current block, what was finished, exact next step, open questions. The next chat will rely on it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
