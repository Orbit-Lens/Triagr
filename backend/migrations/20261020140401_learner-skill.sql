-- Block B1: Core schema - Learner Skill

-- 1. learner_skill table
CREATE TABLE IF NOT EXISTS public.learner_skill (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill text NOT NULL CHECK (skill IN (
        'detect',
        'classify',
        'identify',
        'roe',
        'report',
        'team'
    )),
    theta numeric NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, skill)
);

-- Index for skill queries by user
CREATE INDEX IF NOT EXISTS idx_learner_skill_user ON public.learner_skill(user_id);
