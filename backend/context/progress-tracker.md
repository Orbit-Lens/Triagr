# Triagr Backend — Progress Tracker

Update after every task. The agent reads this first in every session.

## Current status
- Active block: B6 Hardening
- Last updated: 2026-10-20
- Blockers: none

## Decisions log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-20 | Backend is InsForge only, no custom server | User choice |
| 2026-10-20 | PostHog removed; no Llama/OpenAI; Jenkins later | User choice |
| 2026-10-20 | Contract defined for the future simulation, not built | Simulation added later |
| 2026-10-20 | Frontend and backend built separately; NO integration until the user starts it. Backend verified without any UI via contract-test script | User workflow: build each alone, verify manually, then integrate |
| 2026-10-20 | Added AGENTS.md, prd.md, instructions.md; session-start reading order defined in AGENTS.md | Agents lose chat memory; files are the memory |
| 2026-10-20 | Linked project 61fcbb8a-9213-4025-9b11-e9894cb7c38c (Triagr) and verified CLI/auth | B0 setup complete |
| 2026-10-20 | Migration filenames follow InsForge CLI format `<YYYYMMDDHHMMSS>_<name>.sql` | InsForge CLI enforces timestamp prefix |
| 2026-10-20 | Block B1 core schema applied cleanly (7 tables, indexes, constraints) | B1 complete |
| 2026-10-20 | Block B2 RLS applied cleanly; append-only triggers added for events; two-user isolation test passed all 17 checks | B2 complete |
| 2026-10-20 | Block B3: Profile auto-provisioning implemented via database trigger `on_auth_user_created` | Automatic profiles on sign-up |
| 2026-10-20 | Block B4: Seed of 8 scenarios across 4 families applied idempotently | Scenario catalog ready |
| 2026-10-20 | Block B5: Contract test suite created and verified (22/22 tests passed); docs reconciled | Contract verified |
| 2026-10-20 | Block B6: Indexes verified; backend/README.md rebuild guide created; no secrets in repo | Hardening complete |
| 2026-10-20 | Block B7: `finalize-session` edge function built, unit tested, and deployed to live InsForge | Stretch complete |
| 2026-10-20 | Block B8: Integration handoff package documented | Backend standalone phase complete |

## Checklist
- [x] B0 Project + MCP
- [x] B1 Core schema
- [x] B2 RLS
- [x] B3 Auth setup
- [x] B4 Seed
- [x] B5 Contract tests + docs reconciliation
- [x] B6 Hardening
- [x] B7 Stretch (optional)
- [x] B8 Integration handoff package

## Items to verify and record answers here
- Current-user helper used inside RLS policies: `auth.uid()`
- Auth user table name: `auth.users` (reference as `auth.users(id)`)
- Sign-up and sign-in argument shapes: `insforge.auth.signUp({ email, password, name? })` and `insforge.auth.signInWithPassword({ email, password })`
- Email verification setting chosen: Controlled via `insforge.toml` (`require_email_verification = false` for seamless testing)
- Profile creation approach: Database trigger `on_auth_user_created` on `auth.users` automatically provisions `profiles` row on sign-up
- CLI commands confirmed: `npx @insforge/cli db migrations up --all`, `npx @insforge/cli db query "<sql>"`, `npx @insforge/cli secrets get <KEY>`, `npx @insforge/cli metadata`, `npx @insforge/cli functions deploy`

## Integration Handoff Package (for frontend & integration agent)
- **Environment variables required for client:**
  - `NEXT_PUBLIC_INSFORGE_URL` (mapped from `INSFORGE_PROJECT_URL`)
  - `NEXT_PUBLIC_INSFORGE_ANON_KEY` (mapped from `INSFORGE_ANON_KEY`)
- **Live Database Tables:**
  - `profiles`: `user_id` (PK), `display_name`, `unit_label`, `created_at`
  - `scenarios`: `id` (PK), `slug`, `title`, `family`, `summary`, `learning_objectives`, `difficulty`, `time_limit_s`, `default_seed`, `config`, `version`, `is_active`
  - `sessions`: `id` (PK), `user_id`, `scenario_id`, `seed`, `status`, `started_at`, `ended_at`, `sim_source`, `scoring_pack`, `log_hash`
  - `events`: `id` (PK), `session_id`, `tick`, `seq`, `type`, `source`, `visibility`, `payload` (append-only)
  - `scores`: `id` (PK), `session_id`, `user_id`, `scoring_pack`, `comp_detection`, `comp_classification`, `comp_identification`, `comp_rules`, `comp_execution`, `comp_team`, `comp_timeliness`, `s_raw`, `penalty`, `s_final`, `gates`
  - `score_items`: `id` (PK), `score_id`, `rule_id`, `episode_id`, `event_time_s`, `expected_branch`, `selected_branch`, `points_raw`, `points_weighted`, `penalty`, `coaching_tag`, `evidence`
  - `learner_skill`: `user_id`, `skill`, `theta`, `updated_at` (PK: user_id, skill)
- **Active Edge Functions:**
  - `finalize-session`: `POST` with body `{ session_id, components, penalty?, gates?, score_items? }` -> `{ score_id, s_final, gates }`
- **Auth Flow:**
  - `signUp({ email, password, name })`: automatically provisions `profiles` row
  - `signInWithPassword({ email, password })`: returns session JWT
- **Verification Status:**
  - All 22 PRD contract tests PASS
  - 17/17 RLS isolation assertions PASS
  - 6/6 scoring unit tests PASS

## Next exact step
Ready for integration phase whenever user initiates "start integration".
