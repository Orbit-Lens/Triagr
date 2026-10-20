# Triagr Backend — Library Docs

Verified against public InsForge docs while preparing this file. Items marked **VERIFY** were not confirmed; check the docs or the InsForge MCP before relying on them. The docs publish a machine-readable index at `https://docs.insforge.dev/llms.txt` that lists all pages.

## What InsForge provides
Open-source backend platform. Per project: Postgres database (every table is automatically a typed REST and SDK endpoint, scoped by the auth JWT through row-level security; pgvector available), authentication (email/password and OAuth), storage (buckets), serverless edge functions, realtime (WebSocket pub/sub), a model gateway (not used here), and an MCP server that lets coding agents inspect and manage the backend.

## CLI
```bash
npx @insforge/cli db migrations up --all     # apply SQL migrations from the repo
npx @insforge/cli secrets get ANON_KEY       # print the anon key
```
Migrations are plain `.sql` files in your repo. **VERIFY** the full set of CLI commands (login, link project, create migration) with the quickstart and CLI docs. The Quickstart and MCP Setup pages in the docs explain connecting an AI agent to your project.

## InsForge MCP (for the agent)
Set up per the "MCP Setup" page. Use its backend-metadata tool to read real table names, column types, policies and available functions, then compare with `data-model.md`. This replaces guessing.

## TypeScript SDK reference (`@insforge/sdk`)
```ts
import { createClient } from '@insforge/sdk';
const insforge = createClient({ baseUrl: 'https://<app>.insforge.app', anonKey: '<anon>' });
```
- Auth: `signUp`, `signInWithPassword`, `signInWithOAuth`, `getCurrentUser`, `signOut`, `setProfile` (profile updates go through auth methods).
- Database: `insforge.database.from('table').select() / .insert(rows).select()`, update, delete, PostgREST operators, embedded joins, counts. The SDK validates types but does not auto-convert JS types.
- Storage: `insforge.storage.from('bucket').uploadAuto(file)`.
- Functions: `insforge.functions.invoke('slug', { body })`. Inside an edge function, import with `npm:@insforge/sdk` and create a client.
- All calls return `{ data, error }`.

## Database features relevant here
- Row-level security policies read the auth JWT; the same rule applies to REST, SDK, realtime and storage.
- Branching: isolated database branch for testing risky schema changes.
- pgvector: **not used** in this build.

## Authentication
- Email/password for the demo. OAuth providers need dashboard configuration; skip unless time remains.
- **VERIFY**: email verification settings (disable or handle for smooth demo sign-up), and whether a database trigger can create the `profiles` row on user creation.

## Not used (do not add)
PostHog, BrowserBase, model gateway or any Llama/OpenAI integration, pgvector, realtime (not needed for the demo).

## Jenkins (later)
Will run migration, seed and contract checks against a test InsForge project. Nothing to build now beyond keeping everything scriptable via the CLI.
