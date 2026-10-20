-- Enforce events table immutability (append-only) at the database engine level

CREATE OR REPLACE FUNCTION public.prevent_events_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'events are append-only and cannot be updated or deleted'
        USING ERRCODE = 'check_violation';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_events_update ON public.events;
CREATE TRIGGER tr_prevent_events_update
    BEFORE UPDATE ON public.events
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.prevent_events_mutation();

DROP TRIGGER IF EXISTS tr_prevent_events_delete ON public.events;
CREATE TRIGGER tr_prevent_events_delete
    BEFORE DELETE ON public.events
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.prevent_events_mutation();
