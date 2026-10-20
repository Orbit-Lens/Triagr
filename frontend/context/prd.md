# Triagr Frontend — Product Requirements Document (Demo, Standalone)

## 1. Purpose
Deliver a polished, fully clickable demo web app for Triagr, a training-only drone and counter-drone threat simulation trainer. In this phase it runs entirely on **mock data and mock auth** so it can be built and verified without the backend. The real backend and simulation connect later through ports and adapters.

## 2. Users
| Persona | Need in the demo |
|---|---|
| Trainee | Sign in, pick a scenario, run a mock session, understand the score and why |
| Reviewer (demo audience) | See the full decision-chain flow and an explainable result quickly |

## 3. Goals and success criteria
- G1 Complete journey in under 3 minutes of demo time: landing → sign in → scenario → session → results → history.
- G2 Every score deduction is explained (rule id, time, expected vs selected).
- G3 Same seed reproduces the same mock session events.
- G4 `npm run lint && npm run build` pass; no console errors; works in dark and light themes.
- G5 Swapping mock adapters for real ones later changes only `infrastructure/` and `container.ts`.

## 4. Functional requirements
Priority: **M** must, **S** should, **C** could.

### Auth (mock)
| ID | Requirement | Acceptance | P |
|---|---|---|---|
| FE-A1 | Sign up with display name, email, password | zod validation; account saved in localStorage mock store; lands on dashboard | M |
| FE-A2 | Sign in / sign out | Wrong credentials show a friendly error; session persists on refresh | M |
| FE-A3 | Route guard for `(app)` routes | Signed-out visit redirects to `/sign-in` | M |
| FE-A4 | OAuth buttons | Visual only, disabled with tooltip "available after backend integration" | C |

### Marketing
| FE-M1 | Landing page: hero, features, how it works, CTA | Responsive, both themes | M |

### Dashboard
| FE-D1 | Skill summary (6 skills) as radar chart + cards | Reads from mock learner data | M |
| FE-D2 | Recent sessions (last 5) | Links to results | M |
| FE-D3 | Recommended next scenario | Rule: closest difficulty to (average skill level + small step) | S |

### Scenarios
| FE-S1 | Library with family filter and difficulty sort | 8 mock scenarios, 4 families | M |
| FE-S2 | Scenario detail: summary, objectives, difficulty meter, time limit, Start | Start creates a session id and navigates to console | M |

### Session console (mock simulation)
| FE-C1 | Picture panel with tracks, uncertainty rings, shapes per class, selectable | Only trainee-visible data shown | M |
| FE-C2 | Track table: id, class, confidence, quality, contradiction flag | Selection syncs with picture panel | M |
| FE-C3 | Action bar: mark, classify, prioritise, warn, request support, select virtual effect | Each action recorded as an event; effect needs confirm dialog | M |
| FE-C4 | Report panel (who/where/what/when/action) | Validated; stored as event | M |
| FE-C5 | Mission clock, pause/resume, hard time limit | Session ends at limit or on End button | M |
| FE-C6 | Training badge and ROE card labelled "Training set" | Always visible | M |
| FE-C7 | Deterministic mock: same seed gives same event sequence | Unit test passes | M |
| FE-C8 | Keyboard shortcuts and help dialog | M C P W R Esc | S |

### Results
| FE-R1 | Final score, 7 component bars, penalties, gate flags | Uses formula in `backend/context/data-model.md` reference (same weights) | M |
| FE-R2 | Explanation list per deduction | Fields: rule id, event time, expected, selected, points, coaching tag | M |
| FE-R3 | Truth reveal: compare what the trainee saw with ground truth | Shown only after session end | S |

### History and profile
| FE-H1 | Session list with score and date | Reads mock repository | M |
| FE-H2 | Score trend chart | Accessible text summary included | S |
| FE-P1 | Profile page: edit display name | Persists in mock store | S |
| FE-P2 | Avatar upload | Not in standalone mode | C |

## 5. Non-functional requirements
- Performance: console renders 60 fps at 10 tracks on a normal laptop; initial page load reasonable.
- Accessibility: keyboard reachable, visible focus, aria labels, colour never the only signal, reduced-motion respected.
- Responsive: dashboard, scenarios, history to 375 px; console desktop/tablet only with a notice below 768 px.
- Quality: TypeScript strict, no `any`, unit tests for PRNG, mock simulation determinism, scoring mapping, schemas.
- Security: no secrets in the app; no `dangerouslySetInnerHTML`.

## 6. Mock data requirements
- 8 scenarios mirroring the backend seed shape (slug, title, family, summary, objectives, difficulty, time limit, default seed, config).
- Mock repositories implement the same ports the real adapters will: `AuthService`, `ScenarioRepository`, `SessionRepository`, `SkillRepository`, `SimulationPort`.
- Data shapes match `backend/context/data-model.md` and `simulation-seam.md` (copy the types into `domain/`).

## 7. Out of scope
Real backend calls, real simulation, 3D, VR, multi-user, instructor console, LMS/xAPI, LLM features, analytics tooling, file uploads.

## 8. Assumptions and risks
| Item | Handling |
|---|---|
| Real backend shapes may differ slightly | Types live in `domain/`; adapters map. Integration phase reconciles. |
| Time (about 4 h) | Follow the cut order in `build-plan.md`. |
| Scoring realism | Demo scoring is rule-based and simple; explainability is the priority. |

## 9. Acceptance for the standalone phase
All **M** items pass the smoke checklist in `build-plan.md`; user manually approves before integration.
