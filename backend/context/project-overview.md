# Triagr Backend — Project Overview

## What Triagr is
Triagr is an AI-enabled drone and counter-drone threat simulation trainer (training only). Trainees practise detect, classify, identify, prioritise, decide, act/report, assess.

## Scope of THIS build (read first)
- Demo only, about 4 hours, built in parallel with the frontend by a separate agent.
- Backend is **InsForge** (open-source backend platform: Postgres database with REST/SDK access, auth, storage, edge functions, realtime). There is no custom server to write. The "backend" folder holds versioned assets: SQL migrations, seed data, edge functions, and docs.
- The simulation engine is NOT part of this build. It will live in `/simulation` and connect later. The backend only defines the **contract** for data the simulation will produce (see `simulation-seam.md`).
- No PostHog. No Llama or OpenAI models. No LLM features. Jenkins CI/CD comes later.

## Repo layout
```
triagr/
  frontend/
  backend/
    context/        <- this document set
    migrations/     SQL files, applied in order
    seed/           seed SQL for scenarios
    functions/      InsForge edge functions (optional for the demo)
    .env.example
  simulation/       <- empty for now
```

## Backend responsibilities for the demo
1. Auth: email/password users (OAuth optional).
2. Store and serve scenarios (seeded, read-only for trainees).
3. Store sessions, events and scores per user, with row-level security so users see only their own data.
4. Store per-skill learner levels and expose a simple "recommended next scenario" rule (can be computed in the frontend from `learner_skill` for the demo).
5. Provide a stable data contract the real simulation can later write to.

## Non-goals for the demo
Instructor roles, crews, LMS/xAPI export, real adaptive engine, tamper-evident audit chain, content-pack signing, encryption beyond platform defaults.

## Definition of done (demo)
- Migrations apply cleanly from empty with the InsForge CLI.
- Seed creates at least 8 scenarios across 4 families.
- A signed-in user can create a session, write events and a score, and read them back; a different user cannot read them.
- Contract documented in `api-contracts.md` matches the real tables (verify with InsForge metadata).
