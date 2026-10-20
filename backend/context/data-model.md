# Triagr Backend — Data Model

All tables live in `public`. Primary keys are `uuid` with `gen_random_uuid()` defaults unless stated. Timestamps are `timestamptz` default `now()`.

**VERIFY BEFORE WRITING POLICIES:** how InsForge exposes the current user's id inside RLS policies and what the auth user table is called. Read the InsForge Database/Authentication docs or call the InsForge MCP backend-metadata tool. The SQL below uses the placeholder `current_user_id()`; replace it with the real helper. Do not guess.

## Tables

### profiles
| Column | Type | Notes |
|---|---|---|
| user_id | uuid PK | equals the auth user id |
| display_name | text | |
| unit_label | text null | free text, optional |
| created_at | timestamptz | |

### scenarios (seeded, read-only to clients)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique | stable key, for example `bird-decoy-01` |
| title | text | |
| family | text | check in: `bird_decoy_confusion`, `multi_axis_raid`, `report_only_authority`, `rf_silent_infiltration` |
| summary | text | |
| learning_objectives | text[] | |
| difficulty | numeric(3,2) | 0.00 to 1.00 |
| time_limit_s | int | |
| default_seed | bigint | |
| config | jsonb | threat count, weather, light, sensor availability (descriptive only) |
| version | text | for example `1.0.0` |
| is_active | boolean | default true |

### sessions
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | owner |
| scenario_id | uuid FK scenarios | |
| seed | bigint | |
| status | text | check in: `in_progress`, `completed`, `abandoned` |
| started_at | timestamptz | |
| ended_at | timestamptz null | |
| sim_source | text | `mock` for the demo, `engine` later |
| scoring_pack | text | for example `standard_v1` |
| log_hash | text null | optional SHA-256 of canonical event log |

### events (append-only)
| Column | Type | Notes |
|---|---|---|
| id | bigserial PK | |
| session_id | uuid FK sessions | |
| tick | int | authoritative time |
| seq | int | order within tick |
| type | text | namespaced, for example `action.classify`, `track.init` |
| source | text | `trainee`, `sim`, `system` |
| visibility | text | check in: `trainee`, `instructor`, `truth` |
| payload | jsonb | |
Unique (session_id, tick, seq).

### scores (one per completed session)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid unique FK sessions | |
| user_id | uuid | |
| scoring_pack | text | |
| comp_detection, comp_classification, comp_identification, comp_rules, comp_execution, comp_team, comp_timeliness | numeric(4,3) | each 0 to 1 |
| s_raw | numeric(5,2) | 0 to 100 |
| penalty | numeric(5,2) | |
| s_final | numeric(5,2) | 0 to 100 after gates |
| gates | jsonb | list of fired safety gates |

### score_items (explainability)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| score_id | uuid FK scores | |
| rule_id | text | for example `CLS-003` |
| episode_id | text | track the rule applied to |
| event_time_s | numeric | |
| expected_branch | text | |
| selected_branch | text | |
| points_raw | numeric | |
| points_weighted | numeric | |
| penalty | numeric | |
| coaching_tag | text null | |
| evidence | jsonb | |

### learner_skill
| Column | Type | Notes |
|---|---|---|
| user_id | uuid | |
| skill | text | check in: `detect`, `classify`, `identify`, `roe`, `report`, `team` |
| theta | numeric | ability estimate, default 0 |
| updated_at | timestamptz | |
Primary key (user_id, skill).

## Scoring (reference for whoever implements it, from the R&D report)
`S_raw = 100 * (0.20*D + 0.20*C + 0.15*I + 0.20*R + 0.10*E + 0.10*B + 0.05*T)`; `S_final = clamp(S_raw - penalty, 0, 100)` then apply gates (for example: effect without authority caps S at 40). Weights sum to 1.00 and are tied to `scoring_pack`. Timeliness appears only in T, not inside other components.

## Row-level security (pattern)
Enable RLS on every table, then:
- `profiles`, `sessions`, `scores`, `learner_skill`: select/insert/update only where `user_id = current_user_id()`.
- `scenarios`: select for any authenticated user where `is_active`; no insert/update/delete from clients.
- `events`: select/insert allowed only when the parent session belongs to the user; no update/delete.
- `score_items`: select only when the parent score belongs to the user; insert from the same owner (demo) or trusted path (later).
Test each policy with two users before moving on.

## Seed data (minimum)
8 scenarios, 2 per family, difficulty spread 0.2 to 0.8, each with `default_seed`, `time_limit_s` between 180 and 300, and a plain-language summary. Content must stay generic: no real-system parameters.

## Migration files
```
migrations/20261020135856_profiles-scenarios.sql
migrations/20261020140312_sessions-events.sql
migrations/20261020140338_scores-items.sql
migrations/20261020140401_learner-skill.sql
migrations/20261020143249_rls-policies.sql
migrations/20261020151028_events-append-only-guard.sql
migrations/20261020152608_auth-profile-trigger.sql
seed/001_scenarios.sql
```
