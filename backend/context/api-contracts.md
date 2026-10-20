# Triagr Backend — API Contracts

The frontend talks to InsForge only through `@insforge/sdk`. Tables are exposed automatically as REST/SDK endpoints (PostgREST style), so the contract is the tables in `data-model.md` plus the operations below. Names here are the contract: if the backend deviates, update this file and record the change in this folder's `progress-tracker.md`. The frontend is not touched in the standalone phase; the user carries changes over at integration time.

SDK response shape everywhere: `{ data, error }`.

## Auth
| Operation | SDK call | Notes |
|---|---|---|
| Sign up | `insforge.auth.signUp(...)` | Creates the auth user. A database trigger (`on_auth_user_created`) automatically provisions the `profiles` row. |
| Sign in | `insforge.auth.signInWithPassword(...)` | |
| OAuth (optional) | `insforge.auth.signInWithOAuth(...)` | Only if configured in the dashboard |
| Current user | `insforge.auth.getCurrentUser()` | |
| Sign out | `insforge.auth.signOut()` | |
*Note: Argument shapes confirmed: `signUp({ email, password, name? })`, `signInWithPassword({ email, password })`. Profile creation is fully handled by database trigger.*

## Database operations (client side)
| Use case | Operation | Table | Rules |
|---|---|---|---|
| List scenarios | select, filter by `family`, order by `difficulty` | scenarios | any signed-in user |
| Scenario detail | select where `id` | scenarios | |
| Start session | insert `{ scenario_id, seed, sim_source, scoring_pack, status: 'in_progress' }` then `.select()` | sessions | `user_id` set to current user (default or policy check) |
| Append events (batch) | insert array | events | only into own session |
| Finish session | update `{ status: 'completed', ended_at, log_hash }` where id | sessions | owner only |
| Save score | insert score row, then insert `score_items` array | scores, score_items | owner only, one score per session |
| History | select sessions with joined score (PostgREST embed) ordered by `started_at desc` | sessions, scores | own rows only |
| Session detail (results) | select score, then its score_items | scores, score_items | |
| Skills | select where user | learner_skill | own rows |
| Update skills | upsert `(user_id, skill)` | learner_skill | own rows |
| Profile | select / update | profiles | own row |

## Edge function (stretch)
`finalize-session`
- Invoke: `insforge.functions.invoke('finalize-session', { body: { session_id } })`
- Request: `{ "session_id": "uuid" }`
- Response: `{ "score_id": "uuid", "s_final": 75.55, "gates": [] }`
- Errors: `403` not owner, `404` no session, `409` already scored.
Demo can skip this and let the frontend save the mock scorer's output.

## Error mapping (frontend adapters)
| Condition | App error kind |
|---|---|
| Auth failure / expired token | `auth` |
| Constraint or validation failure | `validation` |
| No row | `not_found` |
| Fetch failure | `network` |
| Anything else | `unknown` |

## Contract tests (backend agent, manual for the demo)
1. User A inserts a session; User B cannot select it.
2. Client cannot insert into `scenarios`.
3. Client cannot update or delete an `events` row.
4. Second `scores` insert for the same session fails.
5. Invalid `family` or `status` value is rejected.
