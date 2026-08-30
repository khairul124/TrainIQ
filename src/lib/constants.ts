// ============================================================
// App Constants
// ============================================================

export const APP_NAME = 'TrainIQ';
export const APP_DESCRIPTION = 'Your AI-Powered Personal Fitness Platform';

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Core', 'Glutes', 'Calves', 'Full Body'
] as const;

export const EQUIPMENT_TYPES = [
  'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight',
  'Kettlebell', 'Resistance Band', 'None'
] as const;

export const WORKOUT_TYPES = [
  { value: 'strength', label: 'Strength', icon: '💪' },
  { value: 'cardio', label: 'Cardio', icon: '🏃' },
  { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { value: 'hiit', label: 'HIIT', icon: '🔥' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
] as const;

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍎' },
] as const;

export const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const FITNESS_GOALS = [
  { value: 'lose_weight', label: 'Lose Weight', icon: '⚖️' },
  { value: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { value: 'general_fitness', label: 'General Fitness', icon: '❤️' },
  { value: 'endurance', label: 'Endurance', icon: '🏃' },
  { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
] as const;

// Demo data for when Supabase isn't connected
export const DEMO_EXERCISES = [
  { id: '1', name: 'Barbell Bench Press', muscle_group: 'Chest', equipment: 'Barbell', difficulty: 'intermediate' as const, description: 'Classic chest exercise', instructions: 'Lie on bench, grip bar, lower to chest, press up', image_url: null, created_at: '' },
  { id: '2', name: 'Barbell Squat', muscle_group: 'Legs', equipment: 'Barbell', difficulty: 'intermediate' as const, description: 'King of leg exercises', instructions: 'Bar on back, squat down, drive up through heels', image_url: null, created_at: '' },
  { id: '3', name: 'Deadlift', muscle_group: 'Back', equipment: 'Barbell', difficulty: 'advanced' as const, description: 'Full body compound lift', instructions: 'Grip bar, drive through legs, extend hips', image_url: null, created_at: '' },
  { id: '4', name: 'Pull-ups', muscle_group: 'Back', equipment: 'Bodyweight', difficulty: 'intermediate' as const, description: 'Upper body pulling movement', instructions: 'Hang from bar, pull chin above bar', image_url: null, created_at: '' },
  { id: '5', name: 'Overhead Press', muscle_group: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate' as const, description: 'Shoulder pressing movement', instructions: 'Press barbell overhead from front rack position', image_url: null, created_at: '' },
  { id: '6', name: 'Dumbbell Curl', muscle_group: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner' as const, description: 'Bicep isolation exercise', instructions: 'Curl dumbbells up with controlled motion', image_url: null, created_at: '' },
  { id: '7', name: 'Tricep Dips', muscle_group: 'Triceps', equipment: 'Bodyweight', difficulty: 'intermediate' as const, description: 'Tricep compound movement', instructions: 'Lower body between parallel bars, press up', image_url: null, created_at: '' },
  { id: '8', name: 'Plank', muscle_group: 'Core', equipment: 'Bodyweight', difficulty: 'beginner' as const, description: 'Core stability exercise', instructions: 'Hold body straight in push-up position on forearms', image_url: null, created_at: '' },
  { id: '9', name: 'Lunges', muscle_group: 'Legs', equipment: 'Bodyweight', difficulty: 'beginner' as const, description: 'Unilateral leg exercise', instructions: 'Step forward, lower back knee to ground, push back', image_url: null, created_at: '' },
  { id: '10', name: 'Lat Pulldown', muscle_group: 'Back', equipment: 'Cable', difficulty: 'beginner' as const, description: 'Lat isolation exercise', instructions: 'Pull cable bar to upper chest', image_url: null, created_at: '' },
  { id: '11', name: 'Leg Press', muscle_group: 'Legs', equipment: 'Machine', difficulty: 'beginner' as const, description: 'Machine leg exercise', instructions: 'Push platform away with legs, control return', image_url: null, created_at: '' },
  { id: '12', name: 'Cable Fly', muscle_group: 'Chest', equipment: 'Cable', difficulty: 'intermediate' as const, description: 'Chest isolation exercise', instructions: 'Pull cables together in hugging motion', image_url: null, created_at: '' },
];

export const DEMO_FOODS = [
  // ═══════════════════════════════════════════
  // Economy / Budget-Friendly (Tier 1)
  // ═══════════════════════════════════════════
  { id: '1', name: 'Eggs (Whole)', calories: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11, fiber_g: 0, serving_size: '2 large', category: 'Protein', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.30' },
  { id: '2', name: 'Oatmeal', calories: 154, protein_g: 5, carbs_g: 27, fat_g: 2.6, fiber_g: 4, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.15' },
  { id: '3', name: 'Dal (Lentil Soup)', calories: 180, protein_g: 12, carbs_g: 30, fat_g: 1, fiber_g: 8, serving_size: '1 bowl', category: 'Protein', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.40' },
  { id: '4', name: 'Banana', calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4, fiber_g: 3.1, serving_size: '1 medium', category: 'Fruit', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.20' },
  { id: '5', name: 'Brown Rice', calories: 216, protein_g: 5, carbs_g: 45, fat_g: 1.8, fiber_g: 3.5, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.18' },
  { id: '6', name: 'Sweet Potato', calories: 103, protein_g: 2.3, carbs_g: 24, fat_g: 0.1, fiber_g: 3.8, serving_size: '1 medium', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.35' },
  { id: '7', name: 'Canned Tuna', calories: 120, protein_g: 26, carbs_g: 0, fat_g: 1, fiber_g: 0, serving_size: '1 can (100g)', category: 'Protein', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.85' },
  { id: '8', name: 'Peanut Butter', calories: 188, protein_g: 8, carbs_g: 6, fat_g: 16, fiber_g: 1.9, serving_size: '2 tbsp', category: 'Fats', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.25' },
  { id: 'e9', name: 'Whole Milk', calories: 149, protein_g: 8, carbs_g: 12, fat_g: 8, fiber_g: 0, serving_size: '1 cup (240ml)', category: 'Dairy', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.25' },
  { id: 'e10', name: 'Cabbage Stir-Fry', calories: 60, protein_g: 2, carbs_g: 10, fat_g: 1.5, fiber_g: 3, serving_size: '1 cup', category: 'Vegetables', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.30' },
  { id: 'e11', name: 'Apple', calories: 95, protein_g: 0.5, carbs_g: 25, fat_g: 0.3, fiber_g: 4.4, serving_size: '1 medium', category: 'Fruit', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.30' },
  { id: 'e12', name: 'White Bread (Toast)', calories: 140, protein_g: 4, carbs_g: 26, fat_g: 1.5, fiber_g: 1, serving_size: '2 slices', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'economy' as const, price_est: '$0.12' },

  // ═══════════════════════════════════════════
  // Standard / Balanced (Tier 2)
  // ═══════════════════════════════════════════
  { id: '9', name: 'Chicken Breast (Grilled)', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, fiber_g: 0, serving_size: '100g', category: 'Protein', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$2.00' },
  { id: '10', name: 'Greek Yogurt', calories: 100, protein_g: 17, carbs_g: 6, fat_g: 0.7, fiber_g: 0, serving_size: '170g', category: 'Dairy', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$1.50' },
  { id: '11', name: 'Biryani (Chicken)', calories: 850, protein_g: 35, carbs_g: 90, fat_g: 30, fiber_g: 2, serving_size: '1 plate', category: 'Mixed', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$4.50' },
  { id: '12', name: 'Quinoa', calories: 222, protein_g: 8, carbs_g: 39, fat_g: 3.6, fiber_g: 5, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$1.20' },
  { id: '13', name: 'Avocado', calories: 240, protein_g: 3, carbs_g: 12, fat_g: 22, fiber_g: 10, serving_size: '1 medium', category: 'Fats', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$1.80' },
  { id: '14', name: 'Almonds', calories: 164, protein_g: 6, carbs_g: 6, fat_g: 14, fiber_g: 3.5, serving_size: '28g (approx. 23 nuts)', category: 'Fats', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$1.10' },
  { id: 's7', name: 'Mixed Fruit Bowl', calories: 120, protein_g: 1.5, carbs_g: 30, fat_g: 0.5, fiber_g: 4, serving_size: '1 bowl (200g)', category: 'Fruit', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$2.00' },
  { id: 's8', name: 'Basmati Rice', calories: 210, protein_g: 4.5, carbs_g: 46, fat_g: 0.5, fiber_g: 1, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$0.40' },
  { id: 's9', name: 'Turkey Mince (Cooked)', calories: 170, protein_g: 28, carbs_g: 0, fat_g: 6, fiber_g: 0, serving_size: '100g', category: 'Protein', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$2.50' },
  { id: 's10', name: 'Broccoli (Steamed)', calories: 55, protein_g: 3.7, carbs_g: 11, fat_g: 0.6, fiber_g: 5, serving_size: '1 cup', category: 'Vegetables', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$0.80' },
  { id: 's11', name: 'Whole Wheat Pasta', calories: 220, protein_g: 8, carbs_g: 43, fat_g: 1.3, fiber_g: 5, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$0.50' },
  { id: 's12', name: 'Cottage Cheese', calories: 110, protein_g: 14, carbs_g: 4, fat_g: 4.5, fiber_g: 0, serving_size: '100g', category: 'Dairy', created_by: null, created_at: '', budget_tier: 'standard' as const, price_est: '$1.20' },

  // ═══════════════════════════════════════════
  // Premium / Gourmet (Tier 3)
  // ═══════════════════════════════════════════
  { id: '15', name: 'Salmon (Baked)', calories: 208, protein_g: 20, carbs_g: 0, fat_g: 13, fiber_g: 0, serving_size: '100g', category: 'Protein', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$7.50' },
  { id: '16', name: 'Ribeye Steak (Grilled)', calories: 290, protein_g: 25, carbs_g: 0, fat_g: 21, fiber_g: 0, serving_size: '100g', category: 'Protein', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$12.00' },
  { id: '17', name: 'Organic Fresh Blueberries', calories: 85, protein_g: 1.1, carbs_g: 21, fat_g: 0.5, fiber_g: 3.6, serving_size: '1 cup (150g)', category: 'Fruit', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$4.00' },
  { id: '18', name: 'Premium Whey Isolate', calories: 120, protein_g: 25, carbs_g: 1, fat_g: 0.5, fiber_g: 0, serving_size: '1 scoop (30g)', category: 'Protein', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$3.50' },
  { id: '19', name: 'Chia Seeds', calories: 138, protein_g: 4.7, carbs_g: 12, fat_g: 8.7, fiber_g: 9.8, serving_size: '2 tbsp (28g)', category: 'Superfoods', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$2.50' },
  { id: '20', name: 'King Prawns (Sautéed)', calories: 120, protein_g: 24, carbs_g: 0.2, fat_g: 2, fiber_g: 0, serving_size: '100g', category: 'Protein', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$9.00' },
  { id: 'p7', name: 'Wild Rice Blend', calories: 166, protein_g: 6.5, carbs_g: 35, fat_g: 0.5, fiber_g: 3, serving_size: '1 cup cooked', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$1.80' },
  { id: 'p8', name: 'Organic Greek Yogurt', calories: 130, protein_g: 15, carbs_g: 8, fat_g: 4.5, fiber_g: 0, serving_size: '170g', category: 'Dairy', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$3.00' },
  { id: 'p9', name: 'Extra Virgin Olive Oil', calories: 120, protein_g: 0, carbs_g: 0, fat_g: 14, fiber_g: 0, serving_size: '1 tbsp', category: 'Fats', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$0.80' },
  { id: 'p10', name: 'Organic Spinach Salad', calories: 45, protein_g: 3, carbs_g: 6, fat_g: 0.5, fiber_g: 3, serving_size: '1 cup', category: 'Vegetables', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$2.00' },
  { id: 'p11', name: 'Sweet Potato Mash', calories: 115, protein_g: 2, carbs_g: 27, fat_g: 0.2, fiber_g: 4, serving_size: '1 cup', category: 'Carbs', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$1.50' },
  { id: 'p12', name: 'Organic Avocado', calories: 240, protein_g: 3, carbs_g: 12, fat_g: 22, fiber_g: 10, serving_size: '1 medium', category: 'Fats', created_by: null, created_at: '', budget_tier: 'premium' as const, price_est: '$2.50' }
];
