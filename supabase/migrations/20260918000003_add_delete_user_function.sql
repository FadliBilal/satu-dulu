-- Migration: Add delete_user_account function
-- Allows an authenticated user to permanently delete their own account and all cascaded data

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna tidak terautentikasi.';
  END IF;

  -- 1. Cascade delete user data across tables
  DELETE FROM public.task_events WHERE user_id = current_user_id;
  DELETE FROM public.focus_sessions WHERE user_id = current_user_id;
  DELETE FROM public.daily_reflections WHERE user_id = current_user_id;
  DELETE FROM public.commitments WHERE user_id = current_user_id;
  DELETE FROM public.daily_plans WHERE user_id = current_user_id;
  DELETE FROM public.inbox_items WHERE user_id = current_user_id;
  DELETE FROM public.profiles WHERE user_id = current_user_id;

  -- 2. Delete the user from auth.users
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;
