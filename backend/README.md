# Triagr Backend

Backend services, database migrations, seed data, and API contracts for the **Triagr** counter-drone simulation trainer, built with **InsForge** (PostgreSQL-based BaaS).

---

## Architecture Overview

- **Platform:** InsForge (PostgreSQL database, Auth, Storage, Edge Functions, Realtime)
- **Security:** Strict Row-Level Security (RLS) on all tables with default-deny policies.
- **Data Invariants:**
  - `scenarios` are read-only for authenticated clients.
  - `events` are strictly append-only (guarded by database engine-level triggers).
  - `sessions`, `scores`, `score_items`, and `learner_skill` are strictly isolated by `auth.uid()`.
  - Automatic profile provisioning on sign-up via `on_auth_user_created` trigger on `auth.users`.

---

## Directory Layout

```text
backend/
├── context/               # Architecture, PRD, Data Model, Contracts, Build Plan
├── migrations/            # Ordered, numbered PostgreSQL migrations
│   ├── 20261020135856_profiles-scenarios.sql
│   ├── 20261020140312_sessions-events.sql
│   ├── 20261020140338_scores-items.sql
│   ├── 20261020140401_learner-skill.sql
│   ├── 20261020143249_rls-policies.sql
│   ├── 20261020151028_events-append-only-guard.sql
│   └── 20261020152608_auth-profile-trigger.sql
├── seed/                  # Idempotent scenario catalog seeds
│   └── 001_scenarios.sql  # 8 scenarios across 4 tactical families
├── functions/             # InsForge serverless edge functions
│   └── finalize-session/  # Deterministic session scoring function
├── scripts/               # Verification & test scripts
│   ├── package.json       # @insforge/sdk dependency
│   ├── test-isolation.mjs # Two-user RLS isolation tests
│   └── contract-test.mjs  # Complete 22-check PRD contract verification
├── insforge.toml          # Declarative InsForge platform config
├── .env.example           # Environment template (no secrets)
└── README.md              # Rebuild & operational guide
```

---

## Rebuild from Scratch Sequence

Follow this exact command sequence to rebuild the Triagr backend from scratch on any clean InsForge project:

### 1. Authenticate & Link Project
```bash
# Authenticate CLI with your user API key
npx @insforge/cli login --user-api-key <YOUR_USER_API_KEY>

# Link local directory to your InsForge project
npx @insforge/cli link --project-id <YOUR_PROJECT_ID>
```

### 2. Configure Environment
Populate `.env` with the project URL and anonymous key (obtained via `npx @insforge/cli secrets get ANON_KEY`):
```ini
INSFORGE_PROJECT_URL=https://<project-id>.<region>.insforge.app
INSFORGE_ANON_KEY=anon_<your_anon_key>
```

Apply platform settings:
```bash
npx @insforge/cli config apply --yes
```

### 3. Apply All Migrations
Run the database migrations in order:
```bash
npx @insforge/cli db migrations up --all
```
This applies the 7 schema, RLS, immutability guard, and auth trigger migrations.

### 4. Seed the Scenario Catalog
Import the 8 core scenario catalog definitions:
```bash
npx @insforge/cli db import seed/001_scenarios.sql
```

### 5. Run Verification & Contract Tests
Install test dependencies and run the automated test suite:
```bash
cd scripts
npm install
node contract-test.mjs
```
Expected output:
```text
====================================================
TOTAL CHECKS: 22
PASSED:       22
FAILED:       0
====================================================
```

---

## Database Tables & Schema

| Table | Primary Key | Description | RLS Policy |
|---|---|---|---|
| `profiles` | `user_id` (uuid) | User profile (name, unit label) | Owner only (`user_id = auth.uid()`) |
| `scenarios` | `id` (uuid) | Trainer scenario catalog | Authenticated SELECT only (read-only) |
| `sessions` | `id` (uuid) | Training simulation sessions | Owner only (`user_id = auth.uid()`) |
| `events` | `id` (bigserial) | Simulation event timeline | Append-only by session owner |
| `scores` | `id` (uuid) | Evaluated score summaries | Owner only, unique per session |
| `score_items` | `id` (uuid) | Rule-level explainability items | Linked to parent score owner |
| `learner_skill` | `(user_id, skill)` | Trainee skill ability estimates | Owner only (`user_id = auth.uid()`) |

---

## Tactical Scenario Families (Seeded)

1. **`bird_decoy_confusion`** (2 scenarios):
   - `bird-decoy-alpha`: Avian Flocking vs. Micro-UAS Decoy (Diff: 0.25, 180s)
   - `bird-decoy-bravo`: Thermal Decoy Infiltration in Urban Canopy (Diff: 0.55, 240s)
2. **`multi_axis_raid`** (2 scenarios):
   - `multi-axis-delta`: Converging Quadcopter Swarm on Perimeter (Diff: 0.65, 240s)
   - `multi-axis-echo`: Coordinated Low-Altitude Saturation Raid (Diff: 0.80, 300s)
3. **`report_only_authority`** (2 scenarios):
   - `report-only-golf`: VIP Transit Corridor Surveillance Only (Diff: 0.30, 200s)
   - `report-only-hotel`: Foreign Diplomatic Airspace Incursion (Diff: 0.50, 240s)
4. **`rf_silent_infiltration`** (2 scenarios):
   - `rf-silent-kilo`: Autonomous Waypoint Glider Infiltration (Diff: 0.60, 260s)
   - `rf-silent-lima`: Dark Autonomous Swarm Night Penetration (Diff: 0.75, 280s)
