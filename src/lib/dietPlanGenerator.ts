// ============================================================
// Diet Plan Generator
// Calculates BMI, BMR, TDEE, macro targets, and assembles
// a personalised daily meal plan from the food database.
// ============================================================

import { DEMO_FOODS } from './constants';

// ---- Types ----

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose_weight' | 'maintain' | 'build_muscle';
export type BudgetTier = 'economy' | 'standard' | 'premium';

export interface UserProfile {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface BodyMetrics {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface PlanMeal {
  foodId: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: string;
  quantity: number;
  priceEst: string;
}

export interface MealSlot {
  label: string;
  icon: string;
  items: PlanMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCost: number;
}

export interface DietPlan {
  tier: BudgetTier;
  tierLabel: string;
  meals: MealSlot[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCost: number;
}

export interface GeneratedPlans {
  metrics: BodyMetrics;
  economy: DietPlan;
  standard: DietPlan;
  premium: DietPlan;
}

// ---- Activity multipliers (Mifflin-St Jeor) ----

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// ---- Calculations ----

export function calculateMetrics(profile: UserProfile): BodyMetrics {
  const { heightCm, weightKg, age, gender, activityLevel, goal } = profile;

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let bmiCategory: string;
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal Weight';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  bmr = Math.round(bmr);

  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIER[activityLevel]);

  let targetCalories: number;
  switch (goal) {
    case 'lose_weight':
      targetCalories = Math.round(tdee * 0.80);
      break;
    case 'build_muscle':
      targetCalories = Math.round(tdee * 1.15);
      break;
    default:
      targetCalories = tdee;
  }

  let proteinPerKg: number;
  switch (goal) {
    case 'build_muscle': proteinPerKg = 1.8; break;
    case 'lose_weight': proteinPerKg = 1.6; break;
    default: proteinPerKg = 1.4;
  }
  const proteinG = Math.round(weightKg * proteinPerKg);
  const proteinCals = proteinG * 4;

  const fatCals = targetCalories * 0.25;
  const fatG = Math.round(fatCals / 9);

  const carbCals = targetCalories - proteinCals - fatCals;
  const carbsG = Math.round(Math.max(0, carbCals / 4));

  return { bmi, bmiCategory, bmr, tdee, targetCalories, proteinG, carbsG, fatG };
}

// ---- Helper: find a food by name from a tier ----

type FoodItem = typeof DEMO_FOODS[number];

function findFood(tier: BudgetTier, name: string): FoodItem | undefined {
  return DEMO_FOODS.find(f => f.budget_tier === tier && f.name.toLowerCase().includes(name.toLowerCase()));
}

function findByCategory(tier: BudgetTier, category: string): FoodItem[] {
  return DEMO_FOODS.filter(f => f.budget_tier === tier && f.category === category);
}

function pick(arr: FoodItem[], index: number): FoodItem {
  return arr[index % arr.length];
}

function parsePriceNumber(p: string): number {
  return parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
}

function makePlanMeal(food: FoodItem, qty: number): PlanMeal {
  return {
    foodId: food.id,
    name: food.name,
    calories: food.calories,
    proteinG: food.protein_g,
    carbsG: food.carbs_g,
    fatG: food.fat_g,
    servingSize: food.serving_size,
    quantity: qty,
    priceEst: food.price_est,
  };
}

function buildSlot(label: string, icon: string, items: PlanMeal[]): MealSlot {
  const totalCalories = Math.round(items.reduce((s, i) => s + i.calories * i.quantity, 0));
  const totalProtein = Math.round(items.reduce((s, i) => s + i.proteinG * i.quantity, 0));
  const totalCost = Number(items.reduce((s, i) => s + parsePriceNumber(i.priceEst) * i.quantity, 0).toFixed(2));
  return { label, icon, items, totalCalories, totalProtein, totalCost };
}

// ---- Calorie scaler ----
// After building a realistic base plan, we scale quantities slightly
// so the total hits the calorie target within ~5%.

function scalePlan(slots: MealSlot[], targetCal: number): MealSlot[] {
  const currentCal = slots.reduce((s, m) => s + m.totalCalories, 0);
  if (currentCal === 0) return slots;

  const ratio = targetCal / currentCal;

  // Only scale if we're off by more than 5%
  if (ratio > 0.95 && ratio < 1.05) return slots;

  // Clamp the ratio so quantities stay realistic (0.5 – 4 servings)
  const clampedRatio = Math.max(0.6, Math.min(2.0, ratio));

  return slots.map(slot => {
    const scaledItems = slot.items.map(item => {
      const newQty = Math.round(item.quantity * clampedRatio * 2) / 2; // round to 0.5
      return { ...item, quantity: Math.max(0.5, Math.min(4, newQty)) };
    });
    return buildSlot(slot.label, slot.icon, scaledItems);
  });
}

// ════════════════════════════════════════════════════════════
// ECONOMY PLAN — realistic meals a budget-conscious person eats
// ════════════════════════════════════════════════════════════

function buildEconomyPlan(targetCal: number): DietPlan {
  const tier: BudgetTier = 'economy';

  // Breakfast: Oatmeal + Eggs + Banana + Peanut Butter toast  (~560 cal)
  const breakfast = buildSlot('Breakfast', '🌅', [
    makePlanMeal(findFood(tier, 'Oatmeal')!, 1),
    makePlanMeal(findFood(tier, 'Eggs')!, 1),
    makePlanMeal(findFood(tier, 'Banana')!, 1),
    makePlanMeal(findFood(tier, 'White Bread')!, 1),
  ]);

  // Lunch: Dal + Brown Rice + Cabbage Stir-Fry  (~580 cal)
  const lunch = buildSlot('Lunch', '☀️', [
    makePlanMeal(findFood(tier, 'Dal')!, 1.5),
    makePlanMeal(findFood(tier, 'Brown Rice')!, 1),
    makePlanMeal(findFood(tier, 'Cabbage')!, 1),
  ]);

  // Dinner: Canned Tuna + Sweet Potato + Peanut Butter  (~500 cal)
  const dinner = buildSlot('Dinner', '🌙', [
    makePlanMeal(findFood(tier, 'Canned Tuna')!, 1),
    makePlanMeal(findFood(tier, 'Sweet Potato')!, 1.5),
    makePlanMeal(findFood(tier, 'Peanut Butter')!, 1),
  ]);

  // Snack: Apple + Milk + Peanut Butter  (~430 cal)
  const snack = buildSlot('Snack', '🍎', [
    makePlanMeal(findFood(tier, 'Apple')!, 1),
    makePlanMeal(findFood(tier, 'Whole Milk')!, 1),
    makePlanMeal(findFood(tier, 'Peanut Butter')!, 0.5),
  ]);

  const slots = scalePlan([breakfast, lunch, dinner, snack], targetCal);
  return finalizePlan(tier, 'Economy / Budget-Friendly', slots);
}

// ════════════════════════════════════════════════════════════
// STANDARD PLAN — balanced everyday meals
// ════════════════════════════════════════════════════════════

function buildStandardPlan(targetCal: number): DietPlan {
  const tier: BudgetTier = 'standard';

  // Breakfast: Greek Yogurt + Quinoa + Mixed Fruit Bowl  (~442 cal)
  const breakfast = buildSlot('Breakfast', '🌅', [
    makePlanMeal(findFood(tier, 'Greek Yogurt')!, 1),
    makePlanMeal(findFood(tier, 'Quinoa')!, 1),
    makePlanMeal(findFood(tier, 'Mixed Fruit')!, 1),
  ]);

  // Lunch: Chicken Breast + Basmati Rice + Broccoli + Avocado  (~700 cal)
  const lunch = buildSlot('Lunch', '☀️', [
    makePlanMeal(findFood(tier, 'Chicken Breast')!, 1.5),
    makePlanMeal(findFood(tier, 'Basmati Rice')!, 1),
    makePlanMeal(findFood(tier, 'Broccoli')!, 1),
    makePlanMeal(findFood(tier, 'Avocado')!, 0.5),
  ]);

  // Dinner: Turkey Mince + Whole Wheat Pasta + Cottage Cheese  (~500 cal)
  const dinner = buildSlot('Dinner', '🌙', [
    makePlanMeal(findFood(tier, 'Turkey Mince')!, 1),
    makePlanMeal(findFood(tier, 'Whole Wheat Pasta')!, 1),
    makePlanMeal(findFood(tier, 'Cottage Cheese')!, 1),
  ]);

  // Snack: Almonds + Mixed Fruit  (~284 cal)
  const snack = buildSlot('Snack', '🍎', [
    makePlanMeal(findFood(tier, 'Almonds')!, 1),
    makePlanMeal(findFood(tier, 'Mixed Fruit')!, 1),
  ]);

  const slots = scalePlan([breakfast, lunch, dinner, snack], targetCal);
  return finalizePlan(tier, 'Standard / Medium Salary', slots);
}

// ════════════════════════════════════════════════════════════
// PREMIUM PLAN — gourmet, high-quality ingredients
// ════════════════════════════════════════════════════════════

function buildPremiumPlan(targetCal: number): DietPlan {
  const tier: BudgetTier = 'premium';

  // Breakfast: Organic Greek Yogurt + Blueberries + Chia Seeds + Whey Isolate  (~473 cal)
  const breakfast = buildSlot('Breakfast', '🌅', [
    makePlanMeal(findFood(tier, 'Organic Greek Yogurt')!, 1),
    makePlanMeal(findFood(tier, 'Blueberries')!, 1),
    makePlanMeal(findFood(tier, 'Chia Seeds')!, 1),
    makePlanMeal(findFood(tier, 'Whey Isolate')!, 1),
  ]);

  // Lunch: Salmon + Wild Rice + Spinach Salad + Olive Oil  (~693 cal)
  const lunch = buildSlot('Lunch', '☀️', [
    makePlanMeal(findFood(tier, 'Salmon')!, 1.5),
    makePlanMeal(findFood(tier, 'Wild Rice')!, 1),
    makePlanMeal(findFood(tier, 'Spinach')!, 1),
    makePlanMeal(findFood(tier, 'Olive Oil')!, 1),
  ]);

  // Dinner: Ribeye Steak + Sweet Potato Mash + Organic Avocado  (~645 cal)
  const dinner = buildSlot('Dinner', '🌙', [
    makePlanMeal(findFood(tier, 'Ribeye')!, 1),
    makePlanMeal(findFood(tier, 'Sweet Potato Mash')!, 1),
    makePlanMeal(findFood(tier, 'Organic Avocado')!, 1),
  ]);

  // Snack: King Prawns + Blueberries  (~205 cal)
  const snack = buildSlot('Snack', '🍎', [
    makePlanMeal(findFood(tier, 'King Prawns')!, 1),
    makePlanMeal(findFood(tier, 'Blueberries')!, 1),
  ]);

  const slots = scalePlan([breakfast, lunch, dinner, snack], targetCal);
  return finalizePlan(tier, 'Premium / Gourmet', slots);
}

// ---- Finalize plan with totals ----

function finalizePlan(tier: BudgetTier, tierLabel: string, slots: MealSlot[]): DietPlan {
  const totalCalories = slots.reduce((s, m) => s + m.totalCalories, 0);
  const totalProtein = slots.reduce((s, m) => s + m.totalProtein, 0);
  const totalCarbs = Math.round(slots.reduce((s, m) => s + m.items.reduce((a, i) => a + i.carbsG * i.quantity, 0), 0));
  const totalFat = Math.round(slots.reduce((s, m) => s + m.items.reduce((a, i) => a + i.fatG * i.quantity, 0), 0));
  const totalCost = Number(slots.reduce((s, m) => s + m.totalCost, 0).toFixed(2));

  return { tier, tierLabel, meals: slots, totalCalories, totalProtein, totalCarbs, totalFat, totalCost };
}

// ---- Public API ----

export function generateDietPlans(profile: UserProfile): GeneratedPlans {
  const metrics = calculateMetrics(profile);

  return {
    metrics,
    economy: buildEconomyPlan(metrics.targetCalories),
    standard: buildStandardPlan(metrics.targetCalories),
    premium: buildPremiumPlan(metrics.targetCalories),
  };
}
