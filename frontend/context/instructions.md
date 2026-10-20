# Triagr Frontend — Build Instructions (Standalone, step by step)

Use with `prd.md` (what) and `architecture.md` (how). Work block by block. After each block: lint, build, manual check, update `progress-tracker.md`.

## Ground rules for this phase
- Mock adapters only. No `@insforge/sdk`, no keys, no network calls to any backend.
- Switch for the future: `NEXT_PUBLIC_DATA_SOURCE=mock` (only value supported now). `infrastructure/container.ts` reads it and returns adapters. Later, `insforge` will be added as a second value.
- One task at a time. Small commits.

## Block F0 — Setup (20 min)
1. `npx create-next-app@latest frontend` (TypeScript, Tailwind, ESLint, App Router: yes). If the folder `frontend/` already exists with `context/`, create the app in a temp folder and move the files in, so `context/` and `AGENTS.md` are kept.
2. `npx shadcn@latest init`, then add the components listed in `ui-registry.md`.
3. Install: `@tanstack/react-query zustand react-hook-form zod @hookform/resolvers next-themes lucide-react date-fns` and dev `vitest`. Do not install `@insforge/sdk` yet.
4. Create the folders from `architecture.md`. Add `.env.example` with `NEXT_PUBLIC_DATA_SOURCE=mock`.
5. Add `Providers` (ThemeProvider, QueryClientProvider), set dark default.
6. Apply tokens from `ui-tokens.md` to `app/globals.css`.
Check: `npm run dev` shows themed blank page; lint and build pass.

## Block F1 — Domain, ports, mock data (20 min)
1. `domain/`: entities and zod schemas (`Scenario`, `Session`, `Track`, `SimEvent`, `TraineeAction`, `ScoreResult`, `ScoreItem`, `SkillLevel`, `AppError`). Field names follow `backend/context/data-model.md` and `simulation-seam.md` (snake_case in persisted shapes; map to camelCase only if you add an explicit mapper, and record it).
2. `application/ports/`: `AuthService`, `ScenarioRepository`, `SessionRepository`, `SkillRepository`, `SimulationPort`.
3. `lib/prng.ts` (mulberry32) with unit test: same seed same sequence.
4. `infrastructure/mock/`: in-memory/localStorage adapters, 8 scenarios (2 per family, difficulty 0.2–0.8, time limit 180–300 s).
5. `infrastructure/container.ts` exposes adapters.
Check: tests pass; no feature imports `infrastructure` directly.

## Block F2 — Shell and marketing (30 min)
AppShell (sidebar, topbar, theme toggle, user menu), landing page sections, `PageHeader`, `EmptyState`, `ErrorState`. Both themes verified.

## Block F3 — Mock auth (30 min)
Sign-up and sign-in forms (react-hook-form + zod), `useAuth` hook over `AuthService`, route guard for `(app)` group, sign-out. Passwords in the mock store are demo-only; do not pretend this is secure and do not reuse real passwords. Show a small "demo mode" note on the auth pages.
Check: register, refresh stays signed in, sign out, guard redirects.

## Block F4 — Scenarios (35 min)
Library grid with `ToggleGroup` family filter and difficulty sort, detail page, `DifficultyMeter`, Start button creating a mock session and routing to `/session/[id]`.

## Block F5 — Session console (60 min)
1. `MockSimulation` implementing `SimulationPort`: 50 ms ticks from the tick counter, seeded generation of 2–4 threats, 1–2 birds, 1 false alarm; noisy visible tracks; class probabilities that sharpen with time; occasional contradiction flag; ground truth kept internal.
2. `useSessionStore` (Zustand): tracks, selected id, events log, clock, paused, ended.
3. `PicturePanel` (SVG), `TrackTable`, `ClassProbBars`, `ActionBar`, `RoeCard`, `ReportPanel`, `MissionClock`, `ConfirmEffectDialog`.
4. Actions create events; effect selection requires confirm; session ends at time limit or End button; `stop()` returns a deterministic summary with components, penalties, gates and explanation items.
5. Unit test: same seed gives identical event list; different seeds differ.
Check: a full session runs, ends, and navigates to results.

## Block F6 — Results and history (30 min)
`ScoreSummary`, `ScoreExplanationList`, optional truth reveal; save summary via `SessionRepository` (mock); history table and trend chart with text summary.

## Block F7 — Dashboard, profile, polish (20 min)
Dashboard cards, radar, recent sessions, recommended scenario; profile edit; empty and error states everywhere; accessibility pass; keyboard shortcuts if time; final `lint`, `build`, `test`, smoke checklist from `build-plan.md`.

## Scoring in the mock (keep simple and explainable)
Use the weights from the backend data model: D 0.20, C 0.20, I 0.15, R 0.20, E 0.10, B 0.10, T 0.05; `S = clamp(S_raw − penalty, 0, 100)`; then gates. Team (B) can be a fixed neutral value in single-user demo. Every deduction yields a `ScoreItem` with a rule id. Keep rules in a data file, not scattered in components.

## Common mistakes to avoid
- Putting data access inside components.
- Showing ground truth during the session.
- Using `Math.random()` or `Date.now()` in simulation code.
- Importing a mock adapter directly in a feature (go through the container).
- Hard-coded colours; missing loading/empty/error states; `any` types.
- Inventing library APIs: check `library-docs.md` and official docs.

## Handoff package for the integration phase (prepare at the end)
In `progress-tracker.md` list: ports and their method signatures, domain types, mock-to-real field mapping notes, env variable names to add (`NEXT_PUBLIC_INSFORGE_BASE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`), and any assumptions about the backend that need checking.

## Suggested kickoff prompt for a new chat
"Read AGENTS.md and follow its start-of-session reading order. Summarise the state from progress-tracker.md in 5 lines, then continue with the next unchecked task."
