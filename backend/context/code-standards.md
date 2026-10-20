# Triagr Backend — Code Standards

## SQL
- `snake_case` for tables, columns, functions, policies. Tables plural, primary key `id` (uuid) except where stated in `data-model.md`.
- One concern per migration file, numbered `NNN_description.sql`, never edit an applied migration.
- Prefer `create table if not exists`, `create index if not exists`, `drop policy if exists` followed by create, so reruns are safe.
- Every table: primary key, NOT NULL where sensible, check constraints for enumerations, foreign keys with explicit `on delete` behaviour (`cascade` for child rows such as events and score_items).
- Index foreign keys used in filters: `events(session_id, type)`, `sessions(user_id, started_at desc)`, `scores(user_id)`.
- RLS enabled on every table in the same migration that creates it or in `005_rls_policies.sql`; no table ships without policies.
- Policy names describe intent: `sessions_owner_select`.
- No dynamic SQL built from user input.

## Seeds
- Idempotent: `insert ... on conflict (slug) do nothing`.
- Generic content only. No real-system technical parameters, no operational doctrine.

## Edge functions (if built)
- TypeScript, one function per folder, slug equals folder name in kebab-case.
- Validate input with zod (or equivalent) at the top; return typed JSON and correct HTTP status codes.
- Use the user's token (do not use elevated credentials unless required); never log tokens or personal data.
- Pure scoring logic in a separate module with unit tests, so it can move to the simulation service later.

## Secrets and config
- `.env.example` lists variable names only. `.env` is git-ignored.
- Service/admin credentials never leave the backend folder, never reach the frontend.

## Git
Conventional commits (`feat(db):`, `fix(rls):`, `chore:`). Small commits per migration.

## Verification before marking a task done
1. Migration applies from a clean database with the InsForge CLI.
2. Re-running it does not fail.
3. Relevant contract tests in `api-contracts.md` pass with two test users.
4. `data-model.md` and `api-contracts.md` still match reality. Update them if not.
5. `progress-tracker.md` updated.

## Privacy and data handling
Store minimal personal data (display name, unit label). Pseudonymous in any future research export. No analytics tooling in this build.
