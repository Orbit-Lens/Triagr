# Triagr Frontend — Code Standards

## Language and tooling
- TypeScript `strict: true`. No `any` (use `unknown` + narrowing). No `@ts-ignore` without a comment explaining why.
- ESLint (Next.js config) and Prettier. `npm run lint` and `npm run build` must pass before any task is marked done.
- Path alias `@/*` to the frontend root.

## Naming and files
- Files and folders: `kebab-case`. React components: `PascalCase` export, one component per file.
- Hooks: `useThing` in `hooks/` inside the feature. Use cases: verb phrases (`startSession.ts`).
- Types and interfaces: `PascalCase`, no `I` prefix. Ports end with `Repository`, `Service` or `Port`.
- Constants: `SCREAMING_SNAKE_CASE` only for true constants.

## React and Next.js
- Server Components by default; add `'use client'` only where state, effects, browser APIs or the InsForge client are needed.
- Pages in `app/` stay thin; logic lives in `features/` and `application/`.
- No data fetching inside presentational components. Use hooks that call use cases.
- Keys are stable ids, never array indexes for dynamic lists.
- Avoid `useEffect` for derived state; compute during render.

## Architecture enforcement
- Follow the import rules in `architecture.md`. If a rule must be broken, stop and note it in `progress-tracker.md`.
- Never import `@insforge/sdk` outside `infrastructure/insforge`.
- Never reference mock data from components; go through `SimulationPort`.

## Error handling
- InsForge calls return `{ data, error }`; adapters convert `error` to typed `AppError` (`kind`: `auth | validation | not_found | network | unknown`). Do not throw raw SDK errors into the UI.
- Use `ErrorState` for page failures and `sonner` toasts for action failures.

## Validation
- Validate all form input and all data crossing the infrastructure boundary with zod schemas in `domain/schemas`.

## Determinism rule for the mock simulation
- Use the seeded PRNG in `lib/prng.ts` (for example mulberry32). Never call `Math.random()` or `Date.now()` inside simulation logic; use the tick counter. Same seed must produce the same events.

## Security
- Only public env vars (`NEXT_PUBLIC_*`) in the browser: base URL and anon key. No service or admin keys in the frontend.
- No `dangerouslySetInnerHTML`.
- Do not log tokens or user emails.

## Testing (light, demo scope)
- Unit tests (Vitest) for: seeded PRNG determinism, `MockSimulation` same-seed equality, score display mapping, zod schemas.
- One manual smoke checklist run per milestone (see `build-plan.md`).

## Git
Conventional commits (`feat:`, `fix:`, `chore:`). Small commits per task. Jenkins CI will be added later; keep `npm run lint`, `npm run build` and `npm test` as the three pipeline commands.

## Definition of done for every task
Typed, linted, builds, states handled, accessible, matches `ui-registry.md`, `progress-tracker.md` updated.
