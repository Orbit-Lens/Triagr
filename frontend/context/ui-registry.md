# Triagr Frontend — UI Registry

Single source of truth for which components exist. Add new entries here before building anything custom.

## shadcn/ui components to install
Install with `npx shadcn@latest add <names>`:

`button card input label form select checkbox switch tabs table badge dialog alert-dialog sheet dropdown-menu popover tooltip separator skeleton progress scroll-area sidebar avatar sonner chart toggle-group slider textarea command collapsible breadcrumb`

(`sonner` replaces the older toast component. If a name fails to add, check the current shadcn docs rather than guessing.)

## Custom components (build in `components/shared` or the feature folder)
| Component | Location | Purpose | Props (summary) |
|---|---|---|---|
| `AppShell` | components/shared | Sidebar + topbar layout | children |
| `ThemeToggle` | components/shared | next-themes switch | none |
| `PageHeader` | components/shared | Title, description, actions | title, description?, actions? |
| `EmptyState` | components/shared | Empty list message with action | icon, title, description, action? |
| `ErrorState` | components/shared | Error with retry | message, onRetry |
| `StatCard` | features/dashboard | KPI tile | label, value, hint?, trend? |
| `SkillRadar` | features/dashboard | Skill ability chart (Recharts radar) | skills[] |
| `ScenarioCard` | features/scenarios | Scenario summary and CTA | scenario |
| `DifficultyMeter` | features/scenarios | 0–1 difficulty as 5 segments + label | value |
| `PicturePanel` | features/session-console | SVG/canvas radar picture, tracks, uncertainty rings, sectors | tracks[], selectedId, onSelect |
| `TrackTable` | features/session-console | Track list with class, confidence, contradiction flag | tracks[], selectedId, onSelect |
| `ClassProbBars` | features/session-console | Class probability bars for a track | probs |
| `ActionBar` | features/session-console | Mark/Classify/Prioritise/Warn/Request/Select effect | disabled, onAction |
| `RoeCard` | features/session-console | Training ROE summary | roe |
| `ReportPanel` | features/session-console | Structured report form (who/where/what/when/action) | onSubmit |
| `MissionClock` | features/session-console | Elapsed time, paused state | seconds, paused |
| `ConfirmEffectDialog` | features/session-console | Confirm virtual effect | track, effect, onConfirm |
| `ScoreSummary` | features/results | Final score, component bars, gate flags | score |
| `ScoreExplanationList` | features/results | Rows: rule id, time, expected vs selected, points | items[] |
| `ScoreTrendChart` | features/history | Score over sessions | points[] |
| `SessionTable` | features/history | Past sessions list | sessions[] |

## Icons
`lucide-react` only.

## Pages and the components they use
| Route | Main components |
|---|---|
| `/` | marketing sections (Hero, Features, HowItWorks, Footer) using Card, Button |
| `/sign-in`, `/sign-up` | Form, Input, Button, Separator |
| `/dashboard` | StatCard, SkillRadar, SessionTable (recent), ScenarioCard (recommended) |
| `/scenarios` | ScenarioCard grid, ToggleGroup filters, Select |
| `/scenarios/[id]` | PageHeader, DifficultyMeter, Badge, Button (Start) |
| `/session/[id]` | PicturePanel, TrackTable, ActionBar, RoeCard, ReportPanel, MissionClock |
| `/history` | ScoreTrendChart, SessionTable |
| `/profile` | Form, Avatar |
