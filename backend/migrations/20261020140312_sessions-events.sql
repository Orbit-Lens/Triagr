-- Block B1: Core schema - Sessions and Events

-- 1. sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_id uuid NOT NULL REFERENCES public.scenarios(id) ON DELETE RESTRICT,
    seed bigint NOT NULL,
    status text NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    started_at timestamptz NOT NULL DEFAULT now(),
    ended_at timestamptz NULL,
    sim_source text NOT NULL DEFAULT 'mock',
    scoring_pack text NOT NULL DEFAULT 'standard_v1',
    log_hash text NULL
);

-- Index for sessions: history queries ordered by started_at desc
CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON public.sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_scenario_id ON public.sessions(scenario_id);

-- 2. events table (append-only)
CREATE TABLE IF NOT EXISTS public.events (
    id bigserial PRIMARY KEY,
    session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    tick int NOT NULL,
    seq int NOT NULL,
    type text NOT NULL,
    source text NOT NULL CHECK (source IN ('trainee', 'sim', 'system')),
    visibility text NOT NULL CHECK (visibility IN ('trainee', 'instructor', 'truth')),
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT uq_events_session_tick_seq UNIQUE (session_id, tick, seq)
);

-- Index for events filtering by session and type
CREATE INDEX IF NOT EXISTS idx_events_session_type ON public.events(session_id, type);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.events(session_id);
