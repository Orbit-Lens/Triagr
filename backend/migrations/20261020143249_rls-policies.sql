-- Block B2: Row-Level Security (RLS) Policies
-- All tables default-deny; policies grant least privilege using auth.uid()

-- ============================================================================
-- 1. profiles
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_owner_select ON public.profiles;
CREATE POLICY profiles_owner_select
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS profiles_owner_insert ON public.profiles;
CREATE POLICY profiles_owner_insert
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS profiles_owner_update ON public.profiles;
CREATE POLICY profiles_owner_update
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 2. scenarios (read-only to signed-in trainees, client cannot write)
-- ============================================================================
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS scenarios_authenticated_select ON public.scenarios;
CREATE POLICY scenarios_authenticated_select
    ON public.scenarios
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- No INSERT, UPDATE, or DELETE policies for clients on scenarios (default deny)

-- ============================================================================
-- 3. sessions
-- ============================================================================
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sessions_owner_select ON public.sessions;
CREATE POLICY sessions_owner_select
    ON public.sessions
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS sessions_owner_insert ON public.sessions;
CREATE POLICY sessions_owner_insert
    ON public.sessions
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS sessions_owner_update ON public.sessions;
CREATE POLICY sessions_owner_update
    ON public.sessions
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 4. events (append-only, owner of parent session only)
-- ============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS events_session_owner_select ON public.events;
CREATE POLICY events_session_owner_select
    ON public.events
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.id = events.session_id
          AND s.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS events_session_owner_insert ON public.events;
CREATE POLICY events_session_owner_insert
    ON public.events
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.id = events.session_id
          AND s.user_id = auth.uid()
    ));

-- No UPDATE or DELETE policies for events (append-only)

-- ============================================================================
-- 5. scores
-- ============================================================================
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS scores_owner_select ON public.scores;
CREATE POLICY scores_owner_select
    ON public.scores
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS scores_owner_insert ON public.scores;
CREATE POLICY scores_owner_insert
    ON public.scores
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS scores_owner_update ON public.scores;
CREATE POLICY scores_owner_update
    ON public.scores
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 6. score_items (explainability rows linked to parent score)
-- ============================================================================
ALTER TABLE public.score_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS score_items_score_owner_select ON public.score_items;
CREATE POLICY score_items_score_owner_select
    ON public.score_items
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.scores sc
        WHERE sc.id = score_items.score_id
          AND sc.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS score_items_score_owner_insert ON public.score_items;
CREATE POLICY score_items_score_owner_insert
    ON public.score_items
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.scores sc
        WHERE sc.id = score_items.score_id
          AND sc.user_id = auth.uid()
    ));

-- ============================================================================
-- 7. learner_skill
-- ============================================================================
ALTER TABLE public.learner_skill ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS learner_skill_owner_select ON public.learner_skill;
CREATE POLICY learner_skill_owner_select
    ON public.learner_skill
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS learner_skill_owner_insert ON public.learner_skill;
CREATE POLICY learner_skill_owner_insert
    ON public.learner_skill
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS learner_skill_owner_update ON public.learner_skill;
CREATE POLICY learner_skill_owner_update
    ON public.learner_skill
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
