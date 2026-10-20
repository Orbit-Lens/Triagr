# Triagr Frontend — Architecture

## Principle
Clean architecture with dependencies pointing inward only: `app` → `features` → `application` → `domain`. `infrastructure` implements ports declared in `application`. The domain knows nothing about React, Next.js or InsForge.

## Folder structure
```
frontend/
  app/                         Next.js routes only (thin: compose features, no logic)
    (marketing)/page.tsx
    (auth)/sign-in/page.tsx
    (auth)/sign-up/page.tsx
    (app)/layout.tsx           authenticated shell (sidebar + topbar)
    (app)/dashboard/page.tsx
    (app)/scenarios/page.tsx
    (app)/scenarios/[id]/page.tsx
    (app)/session/[id]/page.tsx
    (app)/history/page.tsx
    (app)/profile/page.tsx
  components/ui/               shadcn generated components (do not hand-edit logic)
  components/shared/           app-wide presentational components
  features/                    one folder per feature: components, hooks, local state
    auth/ dashboard/ scenarios/ session-console/ results/ history/ profile/
  application/                 use cases and ports (pure TypeScript)
    ports/                     ScenarioRepository, SessionRepository, AuthService, SimulationPort
    use-cases/                 startSession, finishSession, listScenarios, ...
  domain/                      entities, value objects, scoring display types, zod schemas
  infrastructure/
    mock/                      mock adapters (localStorage/in-memory): auth, scenarios, sessions, skills  [STANDALONE PHASE]
    insforge/                  client.ts + adapters implementing the ports  [INTEGRATION PHASE ONLY, do not create yet]
    simulation/
      mock-simulation.ts       seeded fake simulation (demo)
      real-simulation.ts       placeholder, throws NotImplemented until /simulation is ready
  lib/                         utils (cn, formatters, seeded PRNG)
  styles/ or app/globals.css   tokens
  middleware / proxy           route protection (see library-docs for the Next.js 16 note)
```

## Dependency rules
- `domain` imports nothing from the project.
- `application` imports only `domain`.
- `features` import `application`, `domain`, `components`. Never import `infrastructure` directly; get adapters from one composition file `infrastructure/container.ts`.
- Only `infrastructure/insforge/*` may import `@insforge/sdk`, and that folder does not exist until the integration phase.
- Only `infrastructure/simulation/*` knows how simulation data is produced.

## The simulation seam (most important design point)
```ts
// application/ports/simulation-port.ts
export interface SimulationPort {
  start(config: { scenarioId: string; seed: number }): Promise<void>;
  subscribe(handler: (event: SimEvent) => void): () => void;   // returns unsubscribe
  sendAction(action: TraineeAction): void;
  pause(): void; resume(): void;
  stop(): Promise<SessionSummary>;
}
```
- `SimEvent` and `TraineeAction` are defined in `domain/` and mirror `backend/context/simulation-seam.md`. Keep them identical.
- Demo uses `MockSimulation` (seeded PRNG, fixed tick, noisy tracks, a few false alarms). Same seed gives the same event sequence.
- Later the real adapter will talk to the simulation service over WebSocket. Only `container.ts` changes.
- The UI never receives ground truth. Mock adapter must also expose only trainee-visible tracks to the UI; ground truth stays inside the adapter and goes only to the results screen.

## Data flow
UI event → feature hook → use case → port → adapter (InsForge or Mock) → result → React Query cache → UI.
Session console: SimulationPort events → Zustand session store (ephemeral) → components. On stop, the summary is saved through `SessionRepository` to InsForge.

## State management
- Server state (scenarios, sessions, scores): TanStack Query.
- Ephemeral session state: Zustand store, reset on each session.
- Form state: react-hook-form + zod.
- No global store for server data.

## Auth and route protection
Standalone: mock auth service (localStorage). Integration: InsForge session via SDK. Authenticated route group `(app)` checks the current user on the client and redirects to `/sign-in`; keep a single `useAuth` hook. Server-side protection is optional for the demo.

## Environment variables
Standalone phase: only `NEXT_PUBLIC_DATA_SOURCE=mock`. Integration phase adds `NEXT_PUBLIC_INSFORGE_BASE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY` and a second `NEXT_PUBLIC_DATA_SOURCE` value. Never commit `.env.local`. Provide `.env.example`.
