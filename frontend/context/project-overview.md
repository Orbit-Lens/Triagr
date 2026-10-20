# Triagr Frontend — Project Overview

## What Triagr is
Triagr is an AI-enabled drone and counter-drone threat simulation trainer. Trainees practise the decision chain: detect, classify, identify, prioritise, decide, act or report, assess. It is a training tool, not a game and not operational software.

## Scope of THIS build (read first)
- Demo only, built in about 4 hours, frontend and backend in parallel by two AI agents.
- The simulation engine does NOT exist yet. It will be added later in `/simulation` and connected afterwards.
- The frontend must therefore work end to end with a **mock simulation adapter** (seeded, deterministic fake data) behind a `SimulationPort` interface. Swapping in the real simulation later must not change any UI code.
- No real weapons, jamming, interception, or real-system parameters anywhere. All effects are virtual labels.

## Repo layout
```
triagr/
  frontend/     <- this document set (Next.js)
  backend/      <- InsForge project assets (migrations, functions, seed)
  simulation/   <- empty for now
```

## Demo user journey (must all work)
1. Landing page explains the product.
2. Sign up / sign in (email + password; OAuth only if time remains).
3. Dashboard: skill summary cards, recent sessions, recommended next scenario.
4. Scenario library: filter by family and difficulty, open a scenario detail.
5. Session console (mock): a radar-style picture panel with noisy tracks, track table, action bar (mark, classify, prioritise, warn, request support), report panel. Driven by the mock adapter.
6. Session end: score breakdown with an explanation per deduction (rule id, event time, expected vs selected).
7. History page: past sessions, trend chart of score over time.
8. Profile page.

## Non-goals for the demo
3D rendering, VR, multi-user crews, instructor console, LMS/xAPI, real adaptive engine (show a simple recommended difficulty only), analytics tooling, LLM features.

## Stack (fixed)
Next.js 16 (App Router, TypeScript), Tailwind CSS v4, shadcn/ui, InsForge (via `@insforge/sdk`) for auth, database and storage. CI/CD with Jenkins is added later, not now. No PostHog. No Llama or OpenAI models.

## Definition of done (demo)
`npm run build` passes, all 8 journey steps work **standalone on mock adapters (mock auth, mock data, mock simulation)**, no console errors, responsive down to tablet width. Connecting the real InsForge backend is a separate later integration phase started only by the user; see `../AGENTS.md`.
