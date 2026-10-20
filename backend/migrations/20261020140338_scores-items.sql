-- Block B1: Core schema - Scores and Score Items

-- 1. scores table (one per completed session)
CREATE TABLE IF NOT EXISTS public.scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL UNIQUE REFERENCES public.sessions(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scoring_pack text NOT NULL DEFAULT 'standard_v1',
    comp_detection numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_detection >= 0 AND comp_detection <= 1),
    comp_classification numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_classification >= 0 AND comp_classification <= 1),
    comp_identification numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_identification >= 0 AND comp_identification <= 1),
    comp_rules numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_rules >= 0 AND comp_rules <= 1),
    comp_execution numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_execution >= 0 AND comp_execution <= 1),
    comp_team numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_team >= 0 AND comp_team <= 1),
    comp_timeliness numeric(4,3) NOT NULL DEFAULT 0 CHECK (comp_timeliness >= 0 AND comp_timeliness <= 1),
    s_raw numeric(5,2) NOT NULL DEFAULT 0 CHECK (s_raw >= 0 AND s_raw <= 100),
    penalty numeric(5,2) NOT NULL DEFAULT 0,
    s_final numeric(5,2) NOT NULL DEFAULT 0 CHECK (s_final >= 0 AND s_final <= 100),
    gates jsonb NOT NULL DEFAULT '[]'::jsonb
);

-- Indexes for scores
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON public.scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_session_id ON public.scores(session_id);

-- 2. score_items table (explainability)
CREATE TABLE IF NOT EXISTS public.score_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    score_id uuid NOT NULL REFERENCES public.scores(id) ON DELETE CASCADE,
    rule_id text NOT NULL,
    episode_id text NOT NULL,
    event_time_s numeric NOT NULL,
    expected_branch text NOT NULL,
    selected_branch text NOT NULL,
    points_raw numeric NOT NULL DEFAULT 0,
    points_weighted numeric NOT NULL DEFAULT 0,
    penalty numeric NOT NULL DEFAULT 0,
    coaching_tag text NULL,
    evidence jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Index for score items by score
CREATE INDEX IF NOT EXISTS idx_score_items_score_id ON public.score_items(score_id);
