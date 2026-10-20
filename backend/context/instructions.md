# Triagr Backend — Build Instructions (Standalone, step by step)

Use with `prd.md` (what), `data-model.md` (schema), `api-contracts.md` (interface). Work block by block. After each block: apply, test, update docs and `progress-tracker.md`.

## Ground rules for this phase
- No frontend involved. Verify with SQL, the InsForge dashboard/CLI, and a Node contract-test script.
- Never guess InsForge specifics. Resolve VERIFY items first (below) and record answers in the tracker.
- Migrations are numbered `.sql` files; never edit an applied one; add a new migration.

## Block B0 — Project, tooling, VERIFY pass (20 min)
1. Create an InsForge project (user does this in the InsForge dashboard and shares nothing sensitive in chat; keys go to `backend/.env`, which is git-ignored).
2. Connect the InsForge MCP per the docs ("MCP Setup" page) and confirm a backend-metadata call works.
3. Confirm CLI usage from the docs (Quickstart, CLI). Known from docs: `npx @insforge/cli db migrations up --all` applies migrations; `npx @insforge/cli secrets get ANON_KEY` prints the anon key.
4. Resolve and record in the tracker:
   - current-user helper for RLS policies, and the auth user table name
   - sign-up and sign-in SDK argument shapes
   - email verification default and how to relax it for test users
   - whether a trigger can create `profiles` on user creation
5. Create `backend/` skeleton: `migrations/ seed/ functions/ scripts/ .env.example .gitignore`.
Check: tracker has all four answers; MCP metadata call works.

## Block B1 — Core schema (30 min)
Create, from `data-model.md`:
- `001_profiles_scenarios.sql`
- `002_sessions_events.sql`
- `003_scores_items.sql`
- `004_learner_skill.sql`
Use `create table if not exists`, check constraints for enums, foreign keys with `on delete cascade` for child rows, and the indexes in `code-standards.md`. Apply with the CLI.
Check: tables exist per metadata; re-apply is safe.

## Block B2 — RLS (30 min)
1. `005_rls_policies.sql` using the verified helper. Enable RLS on all tables, then policies per the pattern in `data-model.md`. Name policies by intent.
2. Create two test users (A and B).
3. Run isolation tests (see Block B5 script or manual): A cannot see B's rows in any table; clients cannot write `scenarios`; cannot update/delete `events`; cannot insert events into another user's session.
Check: all isolation tests pass. Do not move on until they do.

## Block B3 — Auth settings and profiles (25 min)
Enable email/password, set verification behaviour for easy testing, implement profile creation (trigger if verified, otherwise document the client-insert flow in `api-contracts.md`).
Check: a new test user ends up with a `profiles` row by the documented path.

## Block B4 — Seed (30 min)
`seed/001_scenarios.sql`, idempotent (`on conflict (slug) do nothing`). 8 scenarios, 2 per family:
`bird_decoy_confusion`, `multi_axis_raid`, `report_only_authority`, `rf_silent_infiltration`.
Difficulties spread 0.2–0.8, time limits 180–300 s, default seeds, plain-language summaries, 2–3 objectives each, `config` jsonb with descriptive values only (threat counts, light, weather, sensor availability). Generic content only.
Check: 8 rows; re-running adds none.

## Block B5 — Contract tests and docs reconciliation (40 min)
1. Install the SDK in `backend/scripts` (its own `package.json`): `npm install @insforge/sdk@latest`.
2. Write `scripts/contract-test.mjs` that, with two test users, checks every item in the PRD test plan (isolation, read-only scenarios, append-only events, unique score per session, enum rejects, sample payloads from `simulation-seam.md`). Print PASS/FAIL per check; exit non-zero on failure. Credentials come from env vars, not the file.
3. Run it. Fix schema or policies until all pass.
4. Reconcile docs: update `data-model.md` and `api-contracts.md` with any real differences (names, types, auth argument shapes, profile flow).
Check: script all PASS; docs match metadata.

## Block B6 — Hardening (30 min)
Indexes, constraint review, check `history` style query (sessions joined with scores) performance, review that no service key appears anywhere in the repo, write `backend/README.md` with the exact command sequence to rebuild from scratch.

## Block B7 — Stretch (optional)
`functions/finalize-session`: input `{ session_id }`, reads events, computes score with the documented weights, writes `scores` and `score_items`, returns `{ score_id, s_final, gates }`. Put scoring in a pure module with a fixture test. Skip if time is short and record "deferred".

## Block B8 — Integration handoff package (15 min)
In the tracker record: final table and column list, function slugs, auth argument shapes, profile flow, test results, base URL variable name (do NOT write real keys), and known limitations. This is what the integration phase uses.

## Rebuild-from-scratch sequence (document in README)
1. Create project and connect CLI/MCP. 2. Apply migrations 001–005. 3. Apply seed. 4. Run the contract test. 5. (Optional) deploy function.

## Common mistakes to avoid
- Policies referencing a guessed helper name.
- Forgetting RLS on a child table (`events`, `score_items`).
- Letting clients insert into `scenarios` through a permissive policy.
- Editing an applied migration instead of adding a new one.
- Putting keys in files that are committed.
- Docs drifting from the live schema.

## Suggested kickoff prompt for a new chat
"Read AGENTS.md and follow its start-of-session reading order. Summarise the state from progress-tracker.md in 5 lines, then continue with the next unchecked task."
