# Triagr Frontend — Library Docs

Verified against public docs while preparing this file. Where a detail could not be confirmed it is marked **VERIFY**. When in doubt, read the official docs; do not guess APIs.

## Setup commands
```bash
npx create-next-app@latest frontend      # TypeScript, Tailwind, ESLint, App Router: Yes
cd frontend
npx shadcn@latest init                   # detects Next.js, uses Tailwind v4 setup
npx shadcn@latest add button card input label form ...   # see ui-registry.md
npm install @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
npm install next-themes lucide-react date-fns
npm install -D vitest
```
- Current create-next-app produces a Next.js 16 project with the App Router. The Tailwind v4 setup keeps tokens in `globals.css`; no `tailwind.config.ts` is needed.
- If shadcn init complains about peer dependencies, read its error and the shadcn docs; do not blindly force.

## Next.js 16 notes
- App Router, Server Components by default.
- **VERIFY**: Next.js 16 renamed the `middleware` file convention to `proxy`. Check the Next.js 16 upgrade docs before adding route-protection code, and use whichever convention the installed version expects.

## InsForge TypeScript SDK (`@insforge/sdk`) — INTEGRATION PHASE ONLY
Do NOT install or use this while building standalone. It is documented here for the later integration phase, when the user explicitly starts it (`npm install @insforge/sdk@latest`, then add real adapters under `infrastructure/insforge`).
Client creation (browser-safe values only):
```ts
import { createClient } from '@insforge/sdk';
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,   // optional per docs, needed for public requests
});
```
Get the anon key with `npx @insforge/cli secrets get ANON_KEY` or from the InsForge dashboard (API Keys).

Auth (all return `{ data, error }`):
- `insforge.auth.signUp({...})`, `insforge.auth.signInWithPassword({...})`, `insforge.auth.signInWithOAuth({...})`
- `insforge.auth.getCurrentUser()`, `insforge.auth.signOut()`
- Profile data changes use auth methods such as `insforge.auth.setProfile()`, not direct table writes to the user record.
- **VERIFY** exact argument shapes (for example `{ email, password }`, redirect option names) in the SDK docs or the InsForge MCP before coding.

Database (PostgREST-style, Supabase-like builder):
```ts
const { data, error } = await insforge.database.from('scenarios').select();
const { data, error } = await insforge.database.from('sessions').insert({...}).select();
```
Supports chainable PostgREST operators (filters, ordering, joins, counts). The SDK validates types but does not convert JS types automatically (for example dates), so serialise explicitly.

Storage: `insforge.storage.from('<bucket>').uploadAuto(file)` (avatar upload is optional in the demo).
Functions: `insforge.functions.invoke('<slug>', { body })` includes the signed-in user token automatically.
Realtime exists (WebSocket pub/sub) but is **not needed** for the demo.
Do NOT use `insforge.ai.*`; no LLM features in this build.

There is also an InsForge MCP server that agents can use to read backend metadata. Use it to confirm table names and column types from the backend agent's work instead of assuming.

## shadcn/ui
- Command is `npx shadcn@latest ...` (the older `shadcn-ui` package name is deprecated).
- Components are copied into `components/ui`; you own the code.
- Charts: shadcn Chart wraps Recharts. `sonner` is the toast solution.

## TanStack Query
Create one `QueryClient` in a client `Providers` component along with ThemeProvider. Query keys: `['scenarios']`, `['scenario', id]`, `['sessions']`, `['session', id]`, `['skills']`.

## Zustand
One store `useSessionStore` for the live console (tracks, selected track, actions log, clock, paused). Reset on mount and unmount.

## react-hook-form + zod
Schemas in `domain/schemas`; use `zodResolver`.

## next-themes
`ThemeProvider attribute="class" defaultTheme="dark" enableSystem`. Add `suppressHydrationWarning` on `<html>`.

## Recharts via shadcn Chart
Radar chart for skills, line chart for score trend. Always provide an accessible text summary next to a chart.

## Not used (do not add)
PostHog, BrowserBase, any Llama or OpenAI SDK, three.js (reserved for the future simulation view), Redux.
