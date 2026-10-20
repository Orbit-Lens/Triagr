# Triagr Backend — Architecture

## Shape
```
Frontend (Next.js)  --@insforge/sdk-->  InsForge
                                          |- Auth
                                          |- Postgres (tables + RLS)
                                          |- Storage (optional avatars)
                                          |- Edge functions (optional)
Simulation (later)  --writes events/summary-->  same Postgres via a trusted path
```

## Clean architecture inside an InsForge project
There is no application server, so the layers map like this:
| Layer | Where it lives | Rule |
|---|---|---|
| Domain rules | SQL constraints, enums/check constraints, pure SQL functions | Business invariants are enforced in the database where possible |
| Access policy | RLS policies | Default deny; every table has RLS enabled |
| Use cases | Edge functions (only where logic must be trusted, for example scoring) | Thin, one responsibility each |
| Interface | Tables as REST/SDK endpoints, plus function slugs | Documented in `api-contracts.md` |
| Config | `.env`, InsForge dashboard/CLI | No secrets in git |

## Principles
1. **Contract first.** Schema and function I/O are defined in the context files before implementation. The future frontend integration builds against `api-contracts.md`.
2. **Default deny.** RLS on every table. Scenarios readable by any signed-in user, writable by nobody from the client. User-owned tables restricted to the owner.
3. **Append-only events.** `events` rows are inserted, never updated or deleted by clients.
4. **Scoring is deterministic.** Scores are a pure function of the event log plus the scoring pack version. For the demo the frontend mock computes it; later it moves to a trusted function or the simulation service. The stored `scoring_pack` column records which rules produced a score.
5. **Ground truth stays out of trainee-readable rows during a live session.** Store ground-truth summaries only in `score_items.evidence` after the session ends.
6. **Migrations are plain `.sql` files in the repo**, ordered by filename prefix, applied with the InsForge CLI (`npx @insforge/cli db migrations up --all`). Never edit an applied migration; add a new one.

## Environments
Demo uses a single InsForge project. Keys: base URL and anon key go to the frontend; any service/admin key stays out of the frontend and out of git. Branching (isolated database copies) exists in InsForge for risky schema work if needed.

## Edge functions (stretch, only if time allows)
- `finalize-session`: input `{ session_id }`; reads events, computes a score with a simple rule set, writes `scores` and `score_items`. Demo can skip this if the frontend mock scorer saves results directly.
Functions are invoked from the frontend with `insforge.functions.invoke(slug, { body })`.

## Future connection to the simulation
The simulation service will run server-side, authenticate with a privileged credential, and write `events` and a final `session_summary` for a given `session_id`. RLS must allow that trusted path while still blocking clients from forging events (see `simulation-seam.md`).

## CI/CD (later)
Jenkins pipeline will: lint SQL, apply migrations to a test project, run seed, run contract tests. Keep migrations idempotent where practical (`if not exists`).
