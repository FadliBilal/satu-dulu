-- ==============================================================================
-- SATUDULU — Add Username Column to Profiles & Update Trigger
-- ==============================================================================

-- 1. Add username column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- 2. Create unique index on username (ignoring nulls)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(LOWER(username)) WHERE username IS NOT NULL;

-- 3. Update handle_new_user trigger to save username from metadata or email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, username, occupation, timezone)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    'other',
    'Asia/Jakarta'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    updated_at = NOW();

  INSERT INTO public.execution_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
