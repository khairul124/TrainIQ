-- ============================================================
-- FitnessGPT — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE, full_name TEXT, avatar_url TEXT,
  date_of_birth DATE, gender TEXT, height_cm NUMERIC, weight_kg NUMERIC,
  fitness_level TEXT DEFAULT 'beginner',
  fitness_goal TEXT DEFAULT 'general_fitness',
  daily_calorie_target INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises Library
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, muscle_group TEXT NOT NULL, equipment TEXT,
  description TEXT, instructions TEXT, difficulty TEXT DEFAULT 'intermediate',
  image_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL, notes TEXT, duration_minutes INTEGER,
  calories_burned INTEGER, workout_type TEXT DEFAULT 'strength',
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Sets
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER NOT NULL, reps INTEGER, weight_kg NUMERIC,
  duration_seconds INTEGER, rpe INTEGER, created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foods
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, calories INTEGER NOT NULL,
  protein_g NUMERIC, carbs_g NUMERIC, fat_g NUMERIC, fiber_g NUMERIC,
  serving_size TEXT, category TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Logs
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id),
  meal_type TEXT NOT NULL, quantity NUMERIC DEFAULT 1,
  logged_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Body Metrics
CREATE TABLE body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC, body_fat_pct NUMERIC, muscle_mass_kg NUMERIC,
  notes TEXT, measured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, challenge_type TEXT,
  target_value INTEGER, start_date TIMESTAMPTZ, end_date TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id), created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Participants
CREATE TABLE challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0, joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, badge_icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL, content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_workouts" ON workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_sets" ON workout_sets FOR ALL USING (workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid()));
CREATE POLICY "read_exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "read_foods" ON foods FOR SELECT USING (true);
CREATE POLICY "own_meals" ON meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_metrics" ON body_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "read_challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "own_participation" ON challenge_participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_achievements" ON achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_chats" ON chat_messages FOR ALL USING (auth.uid() = user_id);
