-- Block B3: Automatic profile creation trigger on auth.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, unit_label)
    VALUES (
        NEW.id,
        COALESCE(NULLIF(NEW.profile->>'name', ''), split_part(NEW.email, '@', 1)),
        NULL
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
