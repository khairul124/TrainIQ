// ============================================================
// FitnessGPT — Type Definitions
// ============================================================

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  fitness_goal: 'lose_weight' | 'build_muscle' | 'general_fitness' | 'endurance' | 'flexibility';
  daily_calorie_target: number;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string | null;
  description: string | null;
  instructions: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image_url: string | null;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  duration_minutes: number | null;
  calories_burned: number | null;
  workout_type: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'sports';
  completed_at: string;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  rpe: number | null;
  created_at: string;
  exercise?: Exercise;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  serving_size: string | null;
  category: string | null;
  created_by: string | null;
  created_at: string;
  budget_tier?: 'economy' | 'standard' | 'premium';
  price_est?: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  logged_at: string;
  created_at: string;
  food?: Food;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  notes: string | null;
  measured_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: 'steps' | 'workouts' | 'streak' | 'calories';
  target_value: number;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  participant_count?: number;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  current_value: number;
  joined_at: string;
  profile?: Profile;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  badge_icon: string;
  earned_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Dashboard specific types
export interface DashboardStats {
  workoutsThisWeek: number;
  caloriesToday: number;
  currentStreak: number;
  weightTrend: number;
}

export interface WeeklyData {
  day: string;
  workouts: number;
  calories: number;
}
