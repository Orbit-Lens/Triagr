# Triagr Frontend — UI Tokens

Visual direction: calm, professional training console. Dark by default (ops-room feel) with a working light theme. Not militaristic imagery, no weapons iconography, no gore. Data-dense but readable.

## How tokens are applied
Tailwind CSS v4: tokens live in `app/globals.css` as CSS variables, exposed to utilities via `@theme inline`. shadcn/ui `init` generates the base variables; override the values below rather than inventing new names. No `tailwind.config.ts` is required for v4.

## Colour tokens (OKLCH values are suggestions; keep contrast at WCAG AA or better)
| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | near-black blue-grey | off-white | page |
| `--foreground` | light grey | near-black | text |
| `--card` | slightly lighter than background | white | panels |
| `--primary` | teal/cyan | deep teal | primary actions, selected track |
| `--secondary` | slate | light slate | secondary actions |
| `--muted` / `--muted-foreground` | slate / mid grey | light grey / mid grey | helper text |
| `--destructive` | red | red | errors, safety-gate flags |
| `--border`, `--input`, `--ring` | subtle slate | light slate | outlines, focus |

## Semantic domain colours (add as custom vars, also provide icon + label, never colour alone)
| Token | Meaning |
|---|---|
| `--track-unknown` | unclassified track (amber) |
| `--track-hostile` | assessed hostile (red) |
| `--track-friendly` | friendly (blue) |
| `--track-neutral` | benign / non-threat (green) |
| `--track-tentative` | tentative or low quality track (grey, dashed ring) |
| `--score-good / --score-warn / --score-bad` | score bands |

Colour-blind safety: every semantic colour must be paired with a distinct shape or label (circle, diamond, square, triangle) in the picture panel and track table.

## Typography
- Sans: Geist via `next/font` (Next.js default) or Inter. One family only.
- Mono: Geist Mono or JetBrains Mono for track IDs, coordinates, timers.
- Scale: 12 / 14 / 16 / 20 / 24 / 32 px. Body 14 px in dense panels, 16 px elsewhere.

## Spacing, radius, elevation
- 4 px base grid. Panel padding 16 px. Page gutters 16 px mobile, 24 px desktop.
- Radius: `--radius` 0.5rem (shadcn default family). Panels `rounded-lg`, chips `rounded-full`.
- Elevation: borders over shadows. One soft shadow level for popovers only.

## Motion
150–200 ms ease-out for hover and panel transitions. Respect `prefers-reduced-motion`: disable radar sweep animation and chart transitions.

## Iconography
`lucide-react`, 16 px in dense UI, 20 px elsewhere. Stroke width 1.75. Drone-related icons: use generic ones (radar, crosshair-free, eye, radio, ear, flag, shield-check).
