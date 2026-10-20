# Triagr Frontend — UI Rules

## General
1. Use shadcn/ui components first. Build a custom component only if none fits (see `ui-registry.md`).
2. Style only with Tailwind utilities and tokens from `ui-tokens.md`. No inline hex colours, no CSS modules, no extra UI libraries.
3. Compose class names with `cn()` from `lib/utils`.
4. Every screen needs loading (Skeleton), empty, and error states.
5. Mobile first, verified at 375, 768, 1280 px. The session console is desktop/tablet only; show a friendly "use a larger screen" notice below 768 px.

## Accessibility (mandatory)
- All interactive elements keyboard reachable with visible focus ring.
- Icon-only buttons have `aria-label`.
- Colour never the only signal (see tokens).
- Radar sweep and animated charts respect `prefers-reduced-motion`.
- Forms: labels bound to inputs, errors announced with `aria-live`.
- Session console keyboard shortcuts: `M` mark, `C` classify, `P` prioritise, `W` warn, `R` request support, `Esc` cancel. Document them in a help dialog.

## Layout rules
- Authenticated shell: left Sidebar (collapsible), top bar with theme toggle and user menu, content area max width 1280 px (console uses full width).
- Marketing pages use a centred container, no sidebar.

## Session console rules (training validity)
- Show only trainee-visible information: noisy positions, uncertainty rings, class probability bars, confidence, contradictions. Never show ground truth during the session.
- Destructive or irreversible actions (selecting a virtual effect) need a confirm dialog; the confirm step is logged as an event.
- Always label the ROE card as "Training set" so it is never confused with real doctrine.
- Show a small persistent "Training simulation, no real-world effect" badge in the console header.

## Content and tone
Plain, respectful, non-sensational. Use "threat", "track", "assessment". Avoid gamified language such as "kill", "destroy", "score points" in UI copy; use "assessment", "effect", "result".

## Forms
react-hook-form + zod resolver. Validate on blur and submit. Disable submit while pending. Show InsForge error messages mapped to friendly text.

## Data display
- Tables: shadcn Table, sortable only where useful, monospace for IDs.
- Charts: shadcn Chart (Recharts). Always include axis labels and accessible text summary.
- Dates: `date-fns`, local time, relative for under 24 h.

## Definition of a finished screen
Typed props, no `any`, no unused imports, states handled, accessible names present, no hard-coded colours, works in both themes.
