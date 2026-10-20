# Triagr Frontend — Build Plan (4-hour demo)

Built **standalone**, in parallel with (but never connected to) the backend plan. All data comes from mock adapters behind ports. Connecting the real InsForge backend is a later integration phase that only the user can start.

## Timebox (frontend agent)
| Block | Time | Goal | Exit check |
|---|---|---|---|
| F0 Setup | 0:00–0:20 | Next.js 16, Tailwind v4, shadcn init, folders per `architecture.md`, providers, theme, `.env.example` | `npm run dev` shows blank themed page |
| F1 Domain + ports | 0:20–0:40 | Types, zod schemas, ports, seeded PRNG, `container.ts` with in-memory adapters | Unit tests for PRNG pass |
| F2 Shell + marketing | 0:40–1:10 | AppShell, sidebar, landing page, theme toggle | Landing and shell render in both themes |
| F3 Auth | 1:10–1:40 | Sign-in/up forms, `useAuth`, route guard, mock auth adapter | Can register, log in, log out on the mock store |
| F4 Scenarios | 1:40–2:15 | Library, filters, detail, DifficultyMeter | 8 mock scenarios listed and filterable |
| F5 Session console | 2:15–3:15 | MockSimulation, store, PicturePanel, TrackTable, ActionBar, ReportPanel, ConfirmEffectDialog | Full mock session runs 2–3 minutes, ends with summary |
| F6 Results + history | 3:15–3:40 | ScoreSummary, explanation list, trend chart, history, save to mock store | Session saved and visible in history |
| F7 Dashboard + polish | 3:40–4:00 | Dashboard, profile, empty/error states, a11y pass, `build` green | Smoke checklist passes |

If time runs short, cut in this order: profile avatar upload, OAuth, trend chart, keyboard shortcuts. Never cut the session console, results, or auth.

## Detailed tasks
**F1** — `domain`: `Scenario`, `Session`, `Track`, `SimEvent`, `TraineeAction`, `ScoreResult`, `ScoreItem`, `SkillLevel`. `lib/prng.ts` (mulberry32). Ports as in `architecture.md`.

**F5 MockSimulation spec**
- Fixed tick of 50 ms (20 per second is fine for the demo), fake time from tick count.
- Scenario config picks 2–4 threat tracks plus 1–2 non-threat (bird) tracks and 1 false alarm, all from the seed.
- Emit trainee-visible tracks with position noise, class probabilities that sharpen as evidence accumulates, and occasional contradiction flags.
- Accept actions (mark, classify, prioritise, warn, request support, select effect) and record them as events.
- Keep ground truth internal; on `stop()` compute a deterministic `SessionSummary` with simple rule-based scoring (components and penalties as in the backend `data-model.md`), including explanation items.
- Hard cap session at the scenario time limit.

**F6** — Save via `SessionRepository.save(summary)` (mock adapter); show the same summary object locally even if saving fails (toast the failure).

## Smoke checklist (run at F3, F6, F7)
1. Sign up, sign out, sign in.
2. Open scenarios, filter, open detail.
3. Run a session, perform at least one classification and one report.
4. See score and explanations.
5. Session appears in history.
6. Refresh the page: still signed in, data persists (localStorage mock store).
7. Toggle theme; no unreadable text.
8. `npm run lint && npm run build` pass.

## Handoff to the future simulation
Replace `MockSimulation` with `RealSimulation` implementing `SimulationPort`. No other file should change. Record any deviation in `progress-tracker.md`.
