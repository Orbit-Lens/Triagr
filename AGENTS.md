# Triagr — Root Agent Instructions

This repo has three separate parts. You are working in exactly ONE of them per session.

```
triagr/
  frontend/     Next.js app. Has its own AGENTS.md. Self-contained.
  backend/      InsForge assets (SQL, seed, functions). Has its own AGENTS.md. Self-contained.
  simulation/   Empty. Not part of the current build.
  integration/  INTEGRATION.md. Used ONLY when the user explicitly starts the integration phase.
```

## Rules that apply everywhere
1. **Find out which part you are in** from the working folder or the user's first message. Then read that folder's `AGENTS.md` and follow its reading order. If it is unclear, ask one short question.
2. **No cross-part work.** Frontend sessions never edit, run, or read `backend/` internals. Backend sessions never edit or run `frontend/`. The only shared knowledge is the written contract (`backend/context/api-contracts.md`, `backend/context/simulation-seam.md`, mirrored as types in the frontend).
3. **No integration until told.** The user will build and manually verify each part alone, then explicitly start integration. Until then the frontend uses mock adapters only and the backend is tested without any UI.
4. **Project facts**: Triagr is a training-only drone and counter-drone threat simulation trainer. Demo scope. Stack: Next.js 16 + Tailwind v4 + shadcn/ui (frontend), InsForge (backend), Jenkins later. Not used: PostHog, BrowserBase, any Llama or OpenAI model.
5. **Safety content rule**: no real weapon, jamming, interception or exploit details; no real-system parameters; effects are virtual labels only.
6. **Truthfulness**: never invent API names. If something is marked VERIFY in `library-docs.md`, check the official docs (or the InsForge MCP) first and record the answer in the progress tracker.
7. **Progress memory lives in files**, not in chat. Every session starts by reading the progress tracker and ends by updating it.
