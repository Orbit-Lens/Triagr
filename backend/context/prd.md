# Triagr Backend — Product Requirements Document (Demo, Standalone)

## 1. Purpose
Provide the InsForge backend for the Triagr demo: authenticated users, seeded scenarios, and secure storage of sessions, events, scores and learner skills. It must be verifiable **without the frontend**, and expose a stable contract the frontend and the future simulation connect to.

## 2. Consumers
| Consumer | Phase | Uses |
|---|---|---|
| Frontend app | Integration phase | Auth, tables via `@insforge/sdk` |
| Simulation service | Later | Trusted writes of events and summaries (see `simulation-seam.md`) |
| Developer/tester | Now | Dashboard, CLI, contract-test script |

## 3. Goals and success criteria
- G1 Clean apply of all migrations on an empty project; re-run safe.
- G2 Two-user isolation: a user can read and write only their own sessions, events, scores, skills, profile.
- G3 Scenarios readable by signed-in users, not writable by clients.
- G4 Events append-only for clients.
- G5 Contract in `api-contracts.md` exactly matches the live schema (checked via InsForge metadata).
- G6 Everything reproducible from the repo (migrations, seed, scripts) so Jenkins can run it later.

## 4. Functional requirements
Priority: **M** must, **S** should, **C** could.

### Identity and profiles
| ID | Requirement | Acceptance | P |
|---|---|---|---|
| BE-A1 | Email/password sign-up and sign-in enabled | Test user can sign up and in using the SDK from the test script | M |
| BE-A2 | `profiles` row per user | Created by trigger if supported, otherwise documented client insert | M |
| BE-A3 | Profile readable/updatable only by owner | Isolation test | M |
| BE-A4 | OAuth providers | Not configured in demo | C |

### Scenarios
| BE-S1 | `scenarios` table with constraints (family, difficulty 0–1) | Invalid family rejected | M |
| BE-S2 | Seed of 8 scenarios, 2 per family, idempotent | Re-running seed adds no duplicates | M |
| BE-S3 | Client read-only | Insert/update/delete by client fails | M |

### Sessions and events
| BE-E1 | `sessions` owned by user, status enum, scenario FK | Cross-user select returns nothing | M |
| BE-E2 | `events` insert-only, unique (session_id, tick, seq), owner-of-session check | Update/delete by client fails; foreign session insert fails | M |
| BE-E3 | Indexes for `events(session_id,type)` and `sessions(user_id, started_at desc)` | Present in schema | S |

### Scores and explainability
| BE-R1 | `scores` one per session, components 0–1, s_final 0–100 | Second score for same session fails | M |
| BE-R2 | `score_items` with rule_id, times, expected/selected, points, coaching_tag, evidence | Insert and read by owner only | M |
| BE-R3 | `scoring_pack` stored with each score | Column populated | M |

### Learner model
| BE-L1 | `learner_skill` per (user, skill) with allowed skill names | Upsert by owner works; other user blocked | M |

### Simulation readiness
| BE-X1 | Event types and summary format documented in `simulation-seam.md` and accepted by the schema | JSON examples from the doc insert successfully (sample test) | M |
| BE-X2 | Trusted write path design noted, not built | Documented only | S |

### Stretch
| BE-F1 | `finalize-session` edge function computing a score from events | Matches the documented formula on a fixture | C |

## 5. Non-functional requirements
- Security: RLS on all tables, default deny; no secrets in git; no admin credentials in any doc intended for the frontend.
- Integrity: constraints and foreign keys; cascade deletes for child rows.
- Performance (demo): common queries use indexes; history query returns in well under a second with hundreds of rows.
- Operability: migrations numbered, idempotent where practical; one command sequence to rebuild from scratch (documented in `instructions.md`).
- Privacy: only display name and optional unit label stored beyond auth; no analytics tooling.

## 6. Data and content requirements
Schema exactly as `data-model.md`. Seed content is generic, training-only, with no real-system parameters.

## 7. Out of scope
Frontend code, instructor/crew roles, LMS/xAPI export, real adaptive engine, audit hash chain, pack signing, realtime, pgvector, model gateway, PostHog.

## 8. Test plan (no UI needed)
1. Clean apply of migrations and seed.
2. Re-run migrations and seed: no error, no duplicates.
3. Two-user isolation test across profiles, sessions, events, scores, score_items, learner_skill.
4. Client cannot write scenarios; cannot update/delete events.
5. Constraint tests (bad enum values, duplicate score, duplicate event key).
6. Sample payload tests with the JSON from `simulation-seam.md`.
Automate 3–6 in `scripts/contract-test` (Node script using the SDK with two test users). Exact SDK argument shapes must be verified first.

## 9. Assumptions and risks
| Item | Handling |
|---|---|
| RLS current-user helper name unknown | Verify via docs/MCP in block B0/B2 before policies |
| Email verification may block automated test users | Decide setting in B3; document |
| Profile trigger support uncertain | Fallback: client inserts profile after sign-up; document in contract |

## 10. Acceptance for the standalone phase
All **M** items pass the test plan; docs match the live schema; user manually approves before integration.
