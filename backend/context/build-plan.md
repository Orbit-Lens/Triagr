# Triagr Backend — Build Plan (4-hour demo)

Built **standalone**: no frontend is involved and none is assumed. Verification uses SQL, the InsForge dashboard/CLI and a contract-test script. Integration with the frontend happens later and only when the user starts it. See `instructions.md` for the detailed block procedures (these are the authoritative steps).

## Timebox (backend agent)
| Block | Time | Goal | Exit check |
|---|---|---|---|
| B0 Project + MCP | 0:00–0:20 | Create InsForge project, connect MCP and CLI, repo skeleton, `.env.example`, verify the items marked VERIFY in `library-docs.md` | MCP metadata call works; anon key available |
| B1 Core schema | 0:20–0:50 | Migrations 001–004 (profiles, scenarios, sessions, events, scores, score_items, learner_skill) | Tables visible in dashboard/metadata |
| B2 RLS | 0:50–1:20 | Migration 005, find the correct current-user helper, enable RLS everywhere | Contract tests 1–5 pass with two users |
| B3 Auth setup | 1:20–1:45 | Email/password enabled, decide verification setting, profile creation approach (trigger or client insert) | Test user can sign up/in via the SDK script and has a profile row |
| B4 Seed | 1:45–2:15 | 8 scenarios across 4 families | 8 rows, re-run adds none |
| B5 Contract tests + docs | 2:15–2:55 | `scripts/contract-test.mjs` with two users; reconcile `data-model.md` and `api-contracts.md` with the live schema | All checks PASS; docs match metadata |
| B6 Hardening | 2:55–3:25 | Indexes, constraint review, no keys in repo, `backend/README.md` rebuild steps | Rebuild from scratch works |
| B7 Stretch | 3:25–3:45 | Optional `finalize-session` edge function | Done or recorded as deferred |
| B8 Handoff package | 3:45–4:00 | Final schema, function slugs, auth shapes, test results written to the tracker | Tracker complete |

Priority order if time runs short: schema, RLS, seed, auth, contract tests, handoff. Defer the edge function.

## Task details
**B2 RLS** — Follow the pattern in `data-model.md`. Test as user A and user B. Record the exact helper expression used in `progress-tracker.md`.

**B4 Seed families and counts**
- `bird_decoy_confusion` ×2, `multi_axis_raid` ×2, `report_only_authority` ×2, `rf_silent_infiltration` ×2.
- Difficulty values spread between 0.2 and 0.8. Time limit 180–300 s. Plain-language summaries and 2–3 learning objectives each.

**B6** — Typical fixes found by the contract test: missing grants/policies, column type mismatches (timestamps, numeric), embedded join naming, batch insert size.

## Verification checklist (run at B2, B5, B6)
1. Clean apply of all migrations.
2. Two-user isolation test passes.
3. Scenarios readable, not writable.
4. Events append-only.
5. Score unique per session.
6. Docs match the live schema.

## Handoff to the future simulation
Follow `simulation-seam.md`. Plan a trusted write path and a `sim_time_s` decision as new migrations at connection time.
