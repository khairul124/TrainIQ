// ============================================================
// FitnessGPT — Unified Database Service
// Handles Supabase queries and falls back to LocalStorage demo mode
// ============================================================

import { createClient as createBrowserClient } from './supabase/client';
import { 
  Profile, Exercise, Workout, WorkoutSet, Food, 
  MealLog, BodyMetric, Challenge, ChallengeParticipant, 
  Achievement, ChatMessage 
} from '../types';
import { DEMO_EXERCISES, DEMO_FOODS } from './constants';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url && 
    url.startsWith('https://') && 
    !url.includes('your-project-id') && 
    key && 
    key.length > 50 && 
    !key.includes('dummy-payload')
  );
}

// Local Storage Keys
const KEYS = {
  PROFILE: 'fitnessgpt_profile',
  WORKOUTS: 'fitnessgpt_workouts',
  WORKOUT_SETS: 'fitnessgpt_workout_sets',
  FOODS: 'fitnessgpt_foods',
  MEAL_LOGS: 'fitnessgpt_meal_logs',
  BODY_METRICS: 'fitnessgpt_body_metrics',
  CHALLENGES: 'fitnessgpt_challenges',
  PARTICIPATION: 'fitnessgpt_participation',
  ACHIEVEMENTS: 'fitnessgpt_achievements',
  CHAT_MESSAGES: 'fitnessgpt_chat_messages',
  SEEDED: 'fitnessgpt_seeded'
};

// Seed Data
const defaultProfile: Profile = {
  id: 'demo-user-id',
  username: 'demouser',
  full_name: 'Demo User',
  avatar_url: null,
  date_of_birth: '1998-06-15',
  gender: 'male',
  height_cm: 175,
  weight_kg: 72.5,
  fitness_level: 'intermediate',
  fitness_goal: 'build_muscle',
  daily_calorie_target: 2200,
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  updated_at: new Date().toISOString()
};

const defaultWorkouts: Workout[] = [
  { id: 'w1', user_id: 'demo-user-id', title: 'Upper Body Strength', notes: 'Felt great today, hit PR on bench press!', duration_minutes: 52, calories_burned: 420, workout_type: 'strength', completed_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: 'w2', user_id: 'demo-user-id', title: 'Morning HIIT', notes: 'Fasted cardio in the morning.', duration_minutes: 30, calories_burned: 350, workout_type: 'hiit', completed_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString() },
  { id: 'w3', user_id: 'demo-user-id', title: 'Leg Day', notes: 'Heavy squats. Legs are jelly.', duration_minutes: 65, calories_burned: 510, workout_type: 'strength', completed_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString() },
  { id: 'w4', user_id: 'demo-user-id', title: 'Yoga Flow', notes: 'Active recovery and stretching.', duration_minutes: 45, calories_burned: 180, workout_type: 'flexibility', completed_at: new Date(Date.now() - 74 * 3600 * 1000).toISOString(), created_at: new Date(Date.now() - 74 * 3600 * 1000).toISOString() },
];

const defaultWorkoutSets: WorkoutSet[] = [
  // Bench press sets
  { id: 's1', workout_id: 'w1', exercise_id: '1', set_number: 1, reps: 10, weight_kg: 70, duration_seconds: null, rpe: 8, created_at: new Date().toISOString() },
  { id: 's2', workout_id: 'w1', exercise_id: '1', set_number: 2, reps: 8, weight_kg: 75, duration_seconds: null, rpe: 8, created_at: new Date().toISOString() },
  { id: 's3', workout_id: 'w1', exercise_id: '1', set_number: 3, reps: 6, weight_kg: 80, duration_seconds: null, rpe: 9, created_at: new Date().toISOString() },
  { id: 's4', workout_id: 'w1', exercise_id: '1', set_number: 4, reps: 5, weight_kg: 85, duration_seconds: null, rpe: 10, created_at: new Date().toISOString() },
  // Bicep curl sets
  { id: 's5', workout_id: 'w1', exercise_id: '6', set_number: 1, reps: 12, weight_kg: 14, duration_seconds: null, rpe: 8, created_at: new Date().toISOString() },
  { id: 's6', workout_id: 'w1', exercise_id: '6', set_number: 2, reps: 10, weight_kg: 16, duration_seconds: null, rpe: 9, created_at: new Date().toISOString() },
  // Tricep dips sets
  { id: 's7', workout_id: 'w1', exercise_id: '7', set_number: 1, reps: 12, weight_kg: 0, duration_seconds: null, rpe: 7, created_at: new Date().toISOString() },
  { id: 's8', workout_id: 'w1', exercise_id: '7', set_number: 2, reps: 10, weight_kg: 0, duration_seconds: null, rpe: 8, created_at: new Date().toISOString() },
  // Squat sets
  { id: 's9', workout_id: 'w3', exercise_id: '2', set_number: 1, reps: 8, weight_kg: 100, duration_seconds: null, rpe: 8, created_at: new Date().toISOString() },
  { id: 's10', workout_id: 'w3', exercise_id: '2', set_number: 2, reps: 6, weight_kg: 110, duration_seconds: null, rpe: 9, created_at: new Date().toISOString() },
  { id: 's11', workout_id: 'w3', exercise_id: '2', set_number: 3, reps: 3, weight_kg: 120, duration_seconds: null, rpe: 10, created_at: new Date().toISOString() },
];

const defaultMealLogs: MealLog[] = [
  // Today's meals
  { id: 'm1', user_id: 'demo-user-id', food_id: '6', meal_type: 'breakfast', quantity: 1, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Oatmeal
  { id: 'm2', user_id: 'demo-user-id', food_id: '3', meal_type: 'breakfast', quantity: 1, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Banana
  { id: 'm3', user_id: 'demo-user-id', food_id: '5', meal_type: 'breakfast', quantity: 1, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Greek Yogurt
  { id: 'm4', user_id: 'demo-user-id', food_id: '1', meal_type: 'lunch', quantity: 1.5, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Chicken Breast
  { id: 'm5', user_id: 'demo-user-id', food_id: '2', meal_type: 'lunch', quantity: 1, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Brown Rice
  { id: 'm6', user_id: 'demo-user-id', food_id: '3', meal_type: 'snack', quantity: 1, logged_at: new Date().toISOString(), created_at: new Date().toISOString() }, // Banana
];

const defaultBodyMetrics: BodyMetric[] = [
  { id: 'bm1', user_id: 'demo-user-id', weight_kg: 75.2, body_fat_pct: 18.5, muscle_mass_kg: 58.2, notes: 'Start of tracking', measured_at: new Date(Date.now() - 7 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm2', user_id: 'demo-user-id', weight_kg: 74.8, body_fat_pct: 18.2, muscle_mass_kg: 58.1, notes: null, measured_at: new Date(Date.now() - 6 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm3', user_id: 'demo-user-id', weight_kg: 74.5, body_fat_pct: 18.0, muscle_mass_kg: 58.3, notes: null, measured_at: new Date(Date.now() - 5 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm4', user_id: 'demo-user-id', weight_kg: 74.1, body_fat_pct: 17.7, muscle_mass_kg: 58.4, notes: null, measured_at: new Date(Date.now() - 4 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm5', user_id: 'demo-user-id', weight_kg: 73.6, body_fat_pct: 17.5, muscle_mass_kg: 58.2, notes: 'Feeling leaner', measured_at: new Date(Date.now() - 3 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm6', user_id: 'demo-user-id', weight_kg: 73.2, body_fat_pct: 17.2, muscle_mass_kg: 58.5, notes: null, measured_at: new Date(Date.now() - 2 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm7', user_id: 'demo-user-id', weight_kg: 72.9, body_fat_pct: 17.0, muscle_mass_kg: 58.6, notes: null, measured_at: new Date(Date.now() - 1 * 7 * 24 * 3600 * 1000).toISOString() },
  { id: 'bm8', user_id: 'demo-user-id', weight_kg: 72.5, body_fat_pct: 16.8, muscle_mass_kg: 58.8, notes: 'Target goal within reach!', measured_at: new Date().toISOString() },
];

const defaultChallenges: Challenge[] = [
  { id: 'c1', title: '30-Day Push-up Challenge', description: 'Do 100 push-ups daily for 30 days', challenge_type: 'workouts', target_value: 30, start_date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), end_date: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(), created_by: 'system', created_at: new Date().toISOString() },
  { id: 'c2', title: '10K Steps Daily', description: 'Walk 10,000 steps every day this month', challenge_type: 'steps', target_value: 10000, start_date: new Date().toISOString(), end_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(), created_by: 'system', created_at: new Date().toISOString() },
  { id: 'c3', title: 'Clean Eating Week', description: 'No processed food for 7 days straight', challenge_type: 'streak', target_value: 7, start_date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), end_date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), created_by: 'system', created_at: new Date().toISOString() },
  { id: 'c4', title: 'Summer Shred', description: 'Burn 500+ calories daily for 4 weeks', challenge_type: 'calories', target_value: 500, start_date: new Date().toISOString(), end_date: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(), created_by: 'system', created_at: new Date().toISOString() },
];

const defaultParticipation: ChallengeParticipant[] = [
  { id: 'cp1', challenge_id: 'c1', user_id: 'demo-user-id', current_value: 18, joined_at: new Date().toISOString() }, // 60% of 30 days
  { id: 'cp3', challenge_id: 'c3', user_id: 'demo-user-id', current_value: 6, joined_at: new Date().toISOString() },   // 85% of 7 days
];

const defaultAchievements: Achievement[] = [
  { id: 'a1', user_id: 'demo-user-id', title: '10-Day Streak', description: 'Log activity 10 days in a row', badge_icon: '🔥', earned_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
  { id: 'a2', user_id: 'demo-user-id', title: '100 Workouts', description: 'Complete 100 fitness sessions', badge_icon: '🏋️', earned_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() },
  { id: 'a3', user_id: 'demo-user-id', title: 'First PR', description: 'Set your first Personal Record', badge_icon: '💪', earned_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
  { id: 'a4', user_id: 'demo-user-id', title: 'Consistency King', description: 'Log activity consistently', badge_icon: '❤️', earned_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() },
];

const defaultChatMessages: ChatMessage[] = [
  { id: 'ch1', user_id: 'demo-user-id', role: 'assistant', content: "Hey! 👋 I'm your AI Fitness Coach. I can help with workout splits, customized Bangladeshi diet plans, recovery suggestions, and tracking guidance. What would you like to achieve today?", created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() }
];

// Seed storage helper
export function seedLocalStorage() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.SEEDED)) return;

  localStorage.setItem(KEYS.PROFILE, JSON.stringify(defaultProfile));
  localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(defaultWorkouts));
  localStorage.setItem(KEYS.WORKOUT_SETS, JSON.stringify(defaultWorkoutSets));
  localStorage.setItem(KEYS.FOODS, JSON.stringify(DEMO_FOODS));
  localStorage.setItem(KEYS.MEAL_LOGS, JSON.stringify(defaultMealLogs));
  localStorage.setItem(KEYS.BODY_METRICS, JSON.stringify(defaultBodyMetrics));
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(defaultChallenges));
  localStorage.setItem(KEYS.PARTICIPATION, JSON.stringify(defaultParticipation));
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(defaultChatMessages));
  localStorage.setItem(KEYS.SEEDED, 'true');
}

// Ensure local storage is seeded when file is imported in browser
if (typeof window !== 'undefined') {
  seedLocalStorage();
}

// Getter and Setter helpers for LocalStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Database Service Adapter
export const dbService = {
  // Auth
  async getCurrentUser(): Promise<{ id: string; email?: string }> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) return data.user;
    }
    return { id: 'demo-user-id', email: 'demo@fitnessgpt.com' };
  },

  // Profile
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error || !data) {
        // Create profile if not exists
        const newProf: Profile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          full_name: user.user_metadata?.full_name || 'User',
          avatar_url: null,
          date_of_birth: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          fitness_level: 'beginner',
          fitness_goal: 'general_fitness',
          daily_calorie_target: 2000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert(newProf);
        return newProf;
      }
      return data;
    }
    return getLocal<Profile>(KEYS.PROFILE, defaultProfile);
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', user.id).select().single();
      if (error) throw error;
      return data;
    }
    const current = getLocal<Profile>(KEYS.PROFILE, defaultProfile);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocal(KEYS.PROFILE, updated);
    return updated;
  },

  // Exercises Library
  async getExercises(): Promise<Exercise[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('exercises').select('*').order('name', { ascending: true });
      if (error) throw error;
      return data;
    }
    // Return all library exercises
    return DEMO_EXERCISES.map(e => ({
      ...e,
      difficulty: e.difficulty as 'beginner' | 'intermediate' | 'advanced',
      created_at: new Date().toISOString()
    }));
  },

  // Workouts
  async getWorkouts(): Promise<(Workout & { sets?: (WorkoutSet & { exercise?: Exercise })[] })[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_sets (
            *,
            exercise:exercises (*)
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data as any;
    }
    
    const workouts = getLocal<Workout[]>(KEYS.WORKOUTS, defaultWorkouts);
    const sets = getLocal<WorkoutSet[]>(KEYS.WORKOUT_SETS, defaultWorkoutSets);
    const exercises = DEMO_EXERCISES;

    // Attach sets & exercises
    const enriched = workouts.map(w => {
      const wSets = sets.filter(s => s.workout_id === w.id)
        .map(s => {
          const exercise = exercises.find(ex => ex.id === s.exercise_id);
          return {
            ...s,
            exercise: exercise ? { ...exercise, difficulty: exercise.difficulty as any, created_at: '' } : undefined
          };
        });
      return { ...w, sets: wSets };
    });

    return enriched.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  },

  async createWorkout(title: string, notes: string, duration_minutes: number, calories_burned: number, workout_type: Workout['workout_type'], sets: Omit<WorkoutSet, 'id' | 'workout_id' | 'created_at'>[]): Promise<Workout> {
    const user = await this.getCurrentUser();
    const workoutId = Math.random().toString(36).substring(2, 9);
    
    const newWorkout: Workout = {
      id: workoutId,
      user_id: user.id,
      title,
      notes,
      duration_minutes,
      calories_burned,
      workout_type,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      // Insert Workout
      const { data: wData, error: wErr } = await supabase.from('workouts').insert(newWorkout).select().single();
      if (wErr) throw wErr;

      // Insert Sets
      const setsToInsert = sets.map((s, idx) => ({
        ...s,
        workout_id: wData.id,
        set_number: idx + 1
      }));
      if (setsToInsert.length > 0) {
        const { error: sErr } = await supabase.from('workout_sets').insert(setsToInsert);
        if (sErr) throw sErr;
      }
      return wData;
    }

    // Local Storage save
    const currentWorkouts = getLocal<Workout[]>(KEYS.WORKOUTS, defaultWorkouts);
    const currentSets = getLocal<WorkoutSet[]>(KEYS.WORKOUT_SETS, defaultWorkoutSets);

    const newSets: WorkoutSet[] = sets.map((s, idx) => ({
      ...s,
      id: Math.random().toString(36).substring(2, 9),
      workout_id: workoutId,
      set_number: idx + 1,
      created_at: new Date().toISOString()
    }));

    setLocal(KEYS.WORKOUTS, [newWorkout, ...currentWorkouts]);
    setLocal(KEYS.WORKOUT_SETS, [...newSets, ...currentSets]);

    // Check & trigger achievements
    // Complete first workout achievement
    await this.checkAndAwardAchievement('First PR', 'Set your first Personal Record');
    if (currentWorkouts.length + 1 >= 5) {
      await this.checkAndAwardAchievement('10-Day Streak', 'Log activity 10 days in a row');
    }

    return newWorkout;
  },

  // Foods database
  async getFoods(): Promise<Food[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('foods').select('*').order('name', { ascending: true });
      if (error) throw error;
      return data;
    }
    return getLocal<Food[]>(KEYS.FOODS, DEMO_FOODS);
  },

  async createFood(food: Omit<Food, 'id' | 'created_at' | 'created_by'>): Promise<Food> {
    const user = await this.getCurrentUser();
    const newFood: Food = {
      ...food,
      id: Math.random().toString(36).substring(2, 9),
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('foods').insert(newFood).select().single();
      if (error) throw error;
      return data;
    }

    const currentFoods = getLocal<Food[]>(KEYS.FOODS, DEMO_FOODS);
    setLocal(KEYS.FOODS, [newFood, ...currentFoods]);
    return newFood;
  },

  // Meal Logs
  async getMealLogs(dateStr?: string): Promise<(MealLog & { food?: Food })[]> {
    const filterDate = dateStr ? new Date(dateStr) : new Date();
    
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*, food:foods(*)')
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay)
        .lte('logged_at', endOfDay);
        
      if (error) throw error;
      return data as any;
    }

    const logs = getLocal<MealLog[]>(KEYS.MEAL_LOGS, defaultMealLogs);
    const foods = getLocal<Food[]>(KEYS.FOODS, DEMO_FOODS);

    // Filter by same date (Year-Month-Day)
    const targetYMD = filterDate.toISOString().split('T')[0];
    const filtered = logs.filter(l => l.logged_at.split('T')[0] === targetYMD);

    return filtered.map(l => ({
      ...l,
      food: foods.find(f => f.id === l.food_id)
    }));
  },

  async logMeal(foodId: string, mealType: MealLog['meal_type'], quantity: number): Promise<MealLog> {
    const user = await this.getCurrentUser();
    const newLog: MealLog = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      food_id: foodId,
      meal_type: mealType,
      quantity,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('meal_logs').insert(newLog).select().single();
      if (error) throw error;
      return data;
    }

    const currentLogs = getLocal<MealLog[]>(KEYS.MEAL_LOGS, defaultMealLogs);
    setLocal(KEYS.MEAL_LOGS, [newLog, ...currentLogs]);
    return newLog;
  },

  async deleteMealLog(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('meal_logs').delete().eq('id', id);
      if (error) throw error;
      return;
    }
    const currentLogs = getLocal<MealLog[]>(KEYS.MEAL_LOGS, defaultMealLogs);
    const filtered = currentLogs.filter(l => l.id !== id);
    setLocal(KEYS.MEAL_LOGS, filtered);
  },

  // Body Metrics
  async getBodyMetrics(): Promise<BodyMetric[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase.from('body_metrics').select('*').eq('user_id', user.id).order('measured_at', { ascending: true });
      if (error) throw error;
      return data;
    }
    return getLocal<BodyMetric[]>(KEYS.BODY_METRICS, defaultBodyMetrics).sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime());
  },

  async logBodyMetric(weight_kg: number, body_fat_pct?: number, muscle_mass_kg?: number, notes?: string): Promise<BodyMetric> {
    const user = await this.getCurrentUser();
    const newMetric: BodyMetric = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      weight_kg,
      body_fat_pct: body_fat_pct || null,
      muscle_mass_kg: muscle_mass_kg || null,
      notes: notes || null,
      measured_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('body_metrics').insert(newMetric).select().single();
      if (error) throw error;
      
      // Also update weight in user profile
      await supabase.from('profiles').update({ weight_kg }).eq('id', user.id);
      return data;
    }

    const currentMetrics = getLocal<BodyMetric[]>(KEYS.BODY_METRICS, defaultBodyMetrics);
    setLocal(KEYS.BODY_METRICS, [...currentMetrics, newMetric]);

    // Update weight in profile
    const profile = getLocal<Profile>(KEYS.PROFILE, defaultProfile);
    setLocal(KEYS.PROFILE, { ...profile, weight_kg });

    return newMetric;
  },

  // Challenges
  async getChallenges(): Promise<(Challenge & { joined?: boolean; current_value?: number })[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: challenges, error: cErr } = await supabase.from('challenges').select('*');
      if (cErr) throw cErr;

      if (!user) return challenges;

      const { data: userParticipation, error: pErr } = await supabase.from('challenge_participants').select('*').eq('user_id', user.id);
      if (pErr) return challenges;

      return challenges.map(c => {
        const part = userParticipation.find(p => p.challenge_id === c.id);
        return {
          ...c,
          joined: !!part,
          current_value: part?.current_value || 0
        };
      });
    }

    const challenges = getLocal<Challenge[]>(KEYS.CHALLENGES, defaultChallenges);
    const participations = getLocal<ChallengeParticipant[]>(KEYS.PARTICIPATION, defaultParticipation);

    return challenges.map(c => {
      const part = participations.find(p => p.challenge_id === c.id);
      return {
        ...c,
        joined: !!part,
        current_value: part ? part.current_value : 0
      };
    });
  },

  async joinChallenge(challengeId: string): Promise<ChallengeParticipant> {
    const user = await this.getCurrentUser();
    const newPart: ChallengeParticipant = {
      id: Math.random().toString(36).substring(2, 9),
      challenge_id: challengeId,
      user_id: user.id,
      current_value: 0,
      joined_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('challenge_participants').insert(newPart).select().single();
      if (error) throw error;
      return data;
    }

    const currentParts = getLocal<ChallengeParticipant[]>(KEYS.PARTICIPATION, defaultParticipation);
    // Avoid double joins
    if (currentParts.some(p => p.challenge_id === challengeId)) {
      return currentParts.find(p => p.challenge_id === challengeId)!;
    }
    const updated = [...currentParts, newPart];
    setLocal(KEYS.PARTICIPATION, updated);
    return newPart;
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase.from('achievements').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    }
    return getLocal<Achievement[]>(KEYS.ACHIEVEMENTS, defaultAchievements);
  },

  async checkAndAwardAchievement(title: string, description: string): Promise<void> {
    const earned = await this.getAchievements();
    if (earned.some(a => a.title === title)) return;

    const user = await this.getCurrentUser();
    const newAchievement: Achievement = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      title,
      description,
      badge_icon: title === 'First PR' ? '💪' : title === '10-Day Streak' ? '🔥' : '🏆',
      earned_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      await supabase.from('achievements').insert(newAchievement);
      return;
    }

    const current = getLocal<Achievement[]>(KEYS.ACHIEVEMENTS, defaultAchievements);
    setLocal(KEYS.ACHIEVEMENTS, [...current, newAchievement]);
  },

  // Chat Messages
  async getChatMessages(): Promise<ChatMessage[]> {
    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase.from('chat_messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
    return getLocal<ChatMessage[]>(KEYS.CHAT_MESSAGES, defaultChatMessages).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async saveChatMessage(role: ChatMessage['role'], content: string): Promise<ChatMessage> {
    const user = await this.getCurrentUser();
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      role,
      content,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.from('chat_messages').insert(newMsg).select().single();
      if (error) throw error;
      return data;
    }

    const currentMsgs = getLocal<ChatMessage[]>(KEYS.CHAT_MESSAGES, defaultChatMessages);
    const updated = [...currentMsgs, newMsg];
    setLocal(KEYS.CHAT_MESSAGES, updated);
    return newMsg;
  }
};
