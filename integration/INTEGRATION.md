# Triagr — Integration Plan (DO NOT START until the user says "start integration")

Precondition: the user has manually verified the frontend standalone and the backend standalone, and both progress trackers show their handoff packages complete.

## Who does what
Integration is done in the `frontend/` folder, by a frontend-agent session that the user explicitly switches to integration mode. The backend is treated as a finished, documented service. Backend changes found necessary go back to a backend session as new migrations.

## Steps
1. **Read** `backend/context/progress-tracker.md` handoff package and `backend/context/api-contracts.md` (final versions). Do not read backend internals beyond those.
2. **Confirm inputs from the user**: InsForge base URL and anon key (browser-safe values only). Never ask for or use service/admin keys.
3. **Frontend**: `npm install @insforge/sdk@latest`; add `NEXT_PUBLIC_INSFORGE_BASE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`; add `NEXT_PUBLIC_DATA_SOURCE=insforge` as a second value.
4. **Write adapters** in `infrastructure/insforge/`: `client.ts`, auth, scenarios, sessions (+events, scores, items), skills, each implementing the existing ports. Map snake_case rows to domain types. Convert SDK `{ data, error }` into `AppError`.
5. **Switch in `container.ts`** by `NEXT_PUBLIC_DATA_SOURCE`. Keep the mock path working as a fallback for demos.
6. **Verify end to end** with the smoke checklist: sign up, sign in, list scenarios, run a mock-simulation session, save, see score and explanations in history, second user cannot see first user's data.
7. **Fix mismatches** by editing adapters first. If a backend change is required, write it as a new migration in a backend session and update the contract.
8. **Update both progress trackers** and record the integration result.

## Simulation (later, separate phase)
Implement `RealSimulation` against `backend/context/simulation-seam.md` inside `/simulation`, then swap it in at `container.ts`. Needs a trusted write path on the backend (new migrations).

## CI/CD (later)
Jenkins pipelines per part: frontend `lint`, `build`, `test`; backend migrations + seed + contract test against a test InsForge project.
