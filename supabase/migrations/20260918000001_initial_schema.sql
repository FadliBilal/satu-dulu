-- ==============================================================================
-- SATUDULU — Production Database Schema & Row Level Security (RLS)
-- Tagline: "Decide what matters. Do it one at a time."
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occupation TEXT NOT NULL DEFAULT 'other' CHECK (occupation IN ('student', 'developer', 'designer', 'marketer', 'freelancer', 'entrepreneur', 'employee', 'other')),
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- 2. INBOX ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inbox_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- 3. DAILY PLANS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'committed', 'completed', 'replanned', 'archived')),
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_user_daily_plan UNIQUE (user_id, plan_date)
);

-- ------------------------------------------------------------------------------
-- 4. COMMITMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_plan_id UUID NOT NULL REFERENCES public.daily_plans(id) ON DELETE CASCADE,
  inbox_item_id UUID REFERENCES public.inbox_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  why_it_matters TEXT,
  priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 6),
  estimated_duration INTEGER NOT NULL DEFAULT 30, -- minutes
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'carried_forward', 'cancelled')),
  completed_at TIMESTAMPTZ,
  focus_seconds INTEGER NOT NULL DEFAULT 0,
  rollover_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- 5. TASK EVENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.task_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commitment_id UUID NOT NULL REFERENCES public.commitments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'prioritized', 'committed', 'started', 'completed', 'carried_forward', 'replanned', 'cancelled')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- 6. FOCUS SESSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commitment_id UUID NOT NULL REFERENCES public.commitments(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- 7. DAILY REFLECTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_plan_id UUID NOT NULL REFERENCES public.daily_plans(id) ON DELETE CASCADE,
  reflection_reason TEXT CHECK (reflection_reason IN ('unexpected_work', 'underestimated_effort', 'too_many_commitments', 'distraction', 'low_energy', 'other')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_plan_reflection UNIQUE (daily_plan_id)
);

-- ------------------------------------------------------------------------------
-- 8. EXECUTION STATS (MATERIALIZED VIEW / CACHE TABLE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.execution_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_momentum INTEGER NOT NULL DEFAULT 0,
  best_streak_days INTEGER NOT NULL DEFAULT 0,
  total_perfect_days INTEGER NOT NULL DEFAULT 0,
  longest_focus_seconds INTEGER NOT NULL DEFAULT 0,
  historical_completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  total_commitments_completed INTEGER NOT NULL DEFAULT 0,
  total_focus_seconds BIGINT NOT NULL DEFAULT 0,
  execution_profile TEXT NOT NULL DEFAULT 'The Consistent',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_inbox_items_user_status ON public.inbox_items(user_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON public.daily_plans(user_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_commitments_plan_priority ON public.commitments(daily_plan_id, priority);
CREATE INDEX IF NOT EXISTS idx_commitments_user_status ON public.commitments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_task_events_user_type ON public.task_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_commitment ON public.focus_sessions(commitment_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_stats ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- INBOX ITEMS
CREATE POLICY "Users can view own inbox" ON public.inbox_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inbox" ON public.inbox_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inbox" ON public.inbox_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inbox" ON public.inbox_items FOR DELETE USING (auth.uid() = user_id);

-- DAILY PLANS
CREATE POLICY "Users can view own daily plans" ON public.daily_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily plans" ON public.daily_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily plans" ON public.daily_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily plans" ON public.daily_plans FOR DELETE USING (auth.uid() = user_id);

-- COMMITMENTS
CREATE POLICY "Users can view own commitments" ON public.commitments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own commitments" ON public.commitments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own commitments" ON public.commitments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own commitments" ON public.commitments FOR DELETE USING (auth.uid() = user_id);

-- TASK EVENTS
CREATE POLICY "Users can view own events" ON public.task_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON public.task_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FOCUS SESSIONS
CREATE POLICY "Users can view own focus sessions" ON public.focus_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own focus sessions" ON public.focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own focus sessions" ON public.focus_sessions FOR UPDATE USING (auth.uid() = user_id);

-- DAILY REFLECTIONS
CREATE POLICY "Users can view own reflections" ON public.daily_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reflections" ON public.daily_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reflections" ON public.daily_reflections FOR UPDATE USING (auth.uid() = user_id);

-- EXECUTION STATS
CREATE POLICY "Users can view own stats" ON public.execution_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.execution_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.execution_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- TRIGGER: Create profile and initial stats on auth.users signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, occupation, timezone)
  VALUES (NEW.id, NEW.id, 'other', 'Asia/Jakarta');

  INSERT INTO public.execution_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
