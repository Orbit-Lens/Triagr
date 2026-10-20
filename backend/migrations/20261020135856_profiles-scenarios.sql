-- Block B1: Core schema - Profiles and Scenarios

-- 1. profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name text NOT NULL DEFAULT '',
    unit_label text NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. scenarios table (seeded, read-only to clients)
CREATE TABLE IF NOT EXISTS public.scenarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    family text NOT NULL CHECK (family IN (
        'bird_decoy_confusion',
        'multi_axis_raid',
        'report_only_authority',
        'rf_silent_infiltration'
    )),
    summary text NOT NULL,
    learning_objectives text[] NOT NULL DEFAULT '{}',
    difficulty numeric(3,2) NOT NULL CHECK (difficulty >= 0.00 AND difficulty <= 1.00),
    time_limit_s int NOT NULL,
    default_seed bigint NOT NULL,
    config jsonb NOT NULL DEFAULT '{}'::jsonb,
    version text NOT NULL DEFAULT '1.0.0',
    is_active boolean NOT NULL DEFAULT true
);

-- Index for scenario lookups and family filtering
CREATE INDEX IF NOT EXISTS idx_scenarios_family ON public.scenarios(family);
CREATE INDEX IF NOT EXISTS idx_scenarios_slug ON public.scenarios(slug);
