# Triagr Frontend — Progress Tracker

Update after every task. The agent reads this first in every session.

## Current status
- Active block: F5 Session Console (Mock Simulation Seam)
- Last updated: 2026-10-20
- Blockers: none

## Decisions log
| Date | Decision | Reason |
|---|---|---|
| 2026-10-20 | Stack: Next.js 16, Tailwind v4, shadcn/ui, InsForge SDK | User choice |
| 2026-10-20 | PostHog removed; no Llama/OpenAI; Jenkins later | User choice |
| 2026-10-20 | Mock simulation behind SimulationPort | Real simulation comes later |
| 2026-10-20 | Frontend and backend built separately; NO integration until the user starts it. Frontend uses mock adapters incl. mock auth; no `@insforge/sdk` yet | User workflow: build each alone, verify manually, then integrate |
| 2026-10-20 | Added AGENTS.md, prd.md, instructions.md; session-start reading order defined in AGENTS.md | Agents lose chat memory; files are the memory |
| 2026-10-20 | F0 completed: Next.js 16, Tailwind v4, shadcn UI components installed, custom tokens applied, providers configured, vitest set up, clean folder structure created | Block F0 Setup completion |
| 2026-10-20 | Implemented Sign-in & Sign-up pages matching `signup_signin_page.jpg` layout with solid black plane background (`bg-black`), Triagr winged insignia emblem, dual-tab Login/Sign Up card, React Hook Form + Zod, and MockAuthService with localStorage | User request to prioritize exact Auth layout |
| 2026-10-20 | Replaced static background with looped Cloudinary drone video playing at 0.85x speed with smooth cross-fade loop transition and backdrop-blur glassmorphic card | User request for animated drone video background |
| 2026-10-20 | Block F1 implemented: Domain entities (`Scenario`, `Session`, `ScoreBreakdown`), seeded Mulberry32 PRNG, application ports (`ScenarioRepository`, `SessionRepository`), mock adapters with localStorage persistence, and unit tests | Domain & Ports completion |
| 2026-10-20 | Block F2 Shell & F7 Dashboard built: AppShell with Left Sidebar navigation pill indicators and Topbar role switcher; Trainee Dashboard matching `trainee_dashboard.jpg` (4 metric cards, recommended banner, recent activity list, overall progress radial gauge) | Design specification matching |
| 2026-10-20 | Block F4 Scenarios built: Scenario selection grid matching `scenario_selection.jpg` (family tabs: All, Recon, Swarm, Counter-Drone, Night, Custom; 5 tactical scenario cards + custom scenario creator) | Design specification matching |
| 2026-10-20 | Block F6 History built: Session history view matching `session_history.jpg` (All/Completed/In Progress filters, table with score color bands, duration, replay action, pagination) | Design specification matching |
| 2026-10-20 | Profile & Settings built matching `profile.jpg` (Avatar badge, editable name/email/role, notification toggle, theme selector, language selector) | Design specification matching |
| 2026-10-20 | Added Instructor Dashboard (`instructor_dashboard.jpg`) and Admin Panel (`admin_panel.jpg`) accessible via the Topbar Role Switcher | Complete multi-role design coverage |

## Checklist
- [x] F0 Setup
- [x] F1 Domain + ports
- [x] F2 Shell + marketing
- [x] F3 Auth
- [x] F4 Scenarios
- [ ] F5 Session console (live radar & simulation view)
- [x] F6 Results + history
- [x] F7 Dashboard + polish

## Cross-part notes (for the integration phase, do not act on now)
- Real adapters to write later: auth, scenarios, sessions/events/scores, skills.
- Confirm table and column names and auth argument shapes from the backend tracker.

## Next exact step
Implement Block F5 (Session Console: MockSimulation, live radar PicturePanel, TrackTable, ActionBar, and ReportPanel).

## Deviations from the architecture
(none)

## Known issues
(none)
