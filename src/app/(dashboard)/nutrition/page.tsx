"use client";
import { useState } from "react";
import {
  Plus, Search, Flame, Beef, Wheat, Droplets, Trash2, Sparkles,
  DollarSign, Heart, Ruler, Weight, Activity, Target, ChevronDown,
  ChevronUp, Zap, ClipboardList, ArrowRight, User, Calendar,
  Camera, Barcode, ScanLine
} from "lucide-react";
import { DEMO_FOODS, MEAL_TYPES } from "@/lib/constants";
import { Food } from "@/types";
import {
  generateDietPlans, calculateMetrics,
  type UserProfile, type GeneratedPlans, type DietPlan, type BodyMetrics,
  type Gender, type ActivityLevel, type Goal, type BudgetTier
} from "@/lib/dietPlanGenerator";
import { VoiceReadButton } from "@/components/VoiceButton";
import { VoiceSystem } from "@/lib/voiceSystem";
import { FoodPhotoAnalyzer } from "@/components/FoodPhotoAnalyzer";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { GoogleSheetsService } from "@/lib/googleSheetsService";

// ──────────────────────────────────────────────
// Logged Meal interface (for manual tracker)
// ──────────────────────────────────────────────

interface LoggedMeal {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  price_est: string;
  budget_tier: 'economy' | 'standard' | 'premium';
}

const initialLoggedMeals: LoggedMeal[] = [
  { id: "m1", foodId: "2", name: "Oatmeal", calories: 154, protein: 5, carbs: 27, fat: 2.6, quantity: 1, mealType: "breakfast", price_est: "$0.15", budget_tier: "economy" },
  { id: "m2", foodId: "4", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, quantity: 1, mealType: "breakfast", price_est: "$0.20", budget_tier: "economy" },
  { id: "m3", foodId: "10", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, quantity: 1, mealType: "breakfast", price_est: "$1.50", budget_tier: "standard" },
  { id: "m4", foodId: "9", name: "Chicken Breast (Grilled)", calories: 165, protein: 31, carbs: 0, fat: 3.6, quantity: 1.5, mealType: "lunch", price_est: "$2.00", budget_tier: "standard" },
  { id: "m5", foodId: "5", name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, quantity: 1, mealType: "lunch", price_est: "$0.18", budget_tier: "economy" },
  { id: "m6", foodId: "4", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, quantity: 1, mealType: "snack", price_est: "$0.20", budget_tier: "economy" }
];

// ──────────────────────────────────────────────
// Diet Plan Card sub-component
// ──────────────────────────────────────────────

function DietPlanCard({ plan, accent, badgeClass }: { plan: DietPlan; accent: string; badgeClass: string }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      background: "var(--bg-card)", border: `1px solid ${accent}33`,
      borderRadius: "var(--radius-lg)", padding: 0, overflow: "hidden",
      transition: "all 0.3s", position: "relative"
    }}>
      {/* Top accent bar */}
      <div style={{ height: 3, background: accent }} />

      <div style={{ padding: "20px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`badge ${badgeClass}`} style={{ fontSize: "0.75rem" }}>{plan.tierLabel}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              ~{plan.totalCalories} cal • ${plan.totalCost}/day
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <VoiceReadButton
              text={`${plan.tierLabel} diet plan. Total calories: ${plan.totalCalories}. Protein: ${plan.totalProtein} grams. Carbs: ${plan.totalCarbs} grams. Fat: ${plan.totalFat} grams. Daily cost: $${plan.totalCost}.`}
            />
            <button
              className="btn btn-ghost btn-sm"
              style={{ padding: 4 }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Compact macro bar */}
        <div style={{ display: "flex", gap: 16, fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: expanded ? 16 : 0 }}>
          <span>🔥 {plan.totalCalories} cal</span>
          <span>🥩 {plan.totalProtein}g protein</span>
          <span>🌾 {plan.totalCarbs}g carbs</span>
          <span>🫒 {plan.totalFat}g fat</span>
        </div>

        {/* Meals */}
        {expanded && (
          <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {plan.meals.map((slot) => (
              <div key={slot.label} style={{
                background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
                padding: 14, border: "1px solid var(--border-color)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{slot.icon}</span> {slot.label}
                  </h4>
                  <div style={{ display: "flex", gap: 8, fontSize: "0.7rem" }}>
                    <span className="badge badge-warning" style={{ padding: "1px 8px", fontSize: "0.65rem" }}>{slot.totalCalories} cal</span>
                    <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>${slot.totalCost}</span>
                  </div>
                </div>

                {slot.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", background: "var(--bg-card)", borderRadius: 6,
                    marginBottom: idx < slot.items.length - 1 ? 6 : 0,
                    border: "1px solid var(--border-color)"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                        {item.servingSize} × {item.quantity} — P: {Math.round(item.proteinG * item.quantity)}g · C: {Math.round(item.carbsG * item.quantity)}g · F: {Math.round(item.fatG * item.quantity)}g
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>{Math.round(item.calories * item.quantity)} cal</div>
                      <div style={{ fontSize: "0.6rem", color: "var(--accent-green)" }}>{item.priceEst}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export default function NutritionPage() {
  // ---- Diet Plan Generator state ----
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('build_muscle');
  const [generatedPlans, setGeneratedPlans] = useState<GeneratedPlans | null>(null);
  const [showPlanGenerator, setShowPlanGenerator] = useState(true);
  const [showFoodTracker, setShowFoodTracker] = useState(true);
  const [showSmartScanner, setShowSmartScanner] = useState(true);
  const [scannerTab, setScannerTab] = useState<"photo" | "barcode">("photo");

  // ---- Food Tracker state (existing) ----
  const [foodsList, setFoodsList] = useState<Food[]>(DEMO_FOODS);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(initialLoggedMeals);
  const [search, setSearch] = useState("");
  const [activeBudgetTab, setActiveBudgetTab] = useState<'all' | 'economy' | 'standard' | 'premium'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [loggingFoodId, setLoggingFoodId] = useState<string | null>(null);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState(150);
  const [newFoodProtein, setNewFoodProtein] = useState(10);
  const [newFoodCarbs, setNewFoodCarbs] = useState(15);
  const [newFoodFat, setNewFoodFat] = useState(5);
  const [newFoodServing, setNewFoodServing] = useState("100g");
  const [newFoodCategory, setNewFoodCategory] = useState("Protein");
  const [newFoodBudgetTier, setNewFoodBudgetTier] = useState<'economy' | 'standard' | 'premium'>('standard');
  const [newFoodPrice, setNewFoodPrice] = useState("1.50");

  // ---- Handlers ----

  // Called by FoodPhotoAnalyzer and BarcodeScanner to add a scanned food to the meal log
  const handleScannerLog = (food: {
    name: string; calories: number; protein: number;
    carbs: number; fat: number; mealType: "breakfast" | "lunch" | "dinner" | "snack";
  }) => {
    const newLogged: LoggedMeal = {
      id: Math.random().toString(36).substring(2, 9),
      foodId: "scanner_" + Date.now(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      quantity: 1,
      mealType: food.mealType,
      price_est: "$0.00",
      budget_tier: "standard",
    };
    setLoggedMeals(prev => [newLogged, ...prev]);

    // Auto-sync scanned meal to Google Sheets
    const capitalizedMeal = (food.mealType.charAt(0).toUpperCase() + food.mealType.slice(1)) as "Breakfast" | "Lunch" | "Dinner" | "Snack";
    GoogleSheetsService.logNutrition({
      date: new Date().toISOString().split("T")[0],
      mealType: capitalizedMeal,
      foodItem: food.name,
      calories: food.calories,
      proteinG: food.protein,
      carbsG: food.carbs,
      fatsG: food.fat,
      source: "Photo Vision AI",
    });
  };

  const handleGeneratePlan = () => {
    const profile: UserProfile = { heightCm, weightKg, age, gender, activityLevel, goal };
    const plans = generateDietPlans(profile);
    setGeneratedPlans(plans);

    // Auto-sync AI Diet Plan to Google Sheets
    if (plans.standard) {
      GoogleSheetsService.logDietPlan({
        date: new Date().toISOString().split("T")[0],
        goal: goal === "build_muscle" ? "Muscle Gain" : goal === "lose_weight" ? "Fat Loss" : "Maintenance",
        dailyCalories: plans.standard.totalCalories,
        proteinTargetG: plans.standard.totalProtein,
        carbsTargetG: plans.standard.totalCarbs,
        fatsTargetG: plans.standard.totalFat,
        mealBreakdown: plans.standard.meals.map(m => `${m.label}: ${m.totalCalories} kcal (${m.items.map(i => i.name).join(", ")})`).join(" | "),
        regionalFoods: "Standard & Economy regional staple options",
      });
    }
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    const newFood: Food = {
      id: Math.random().toString(36).substring(2, 9),
      name: newFoodName, calories: Number(newFoodCalories),
      protein_g: Number(newFoodProtein), carbs_g: Number(newFoodCarbs),
      fat_g: Number(newFoodFat), fiber_g: 0, serving_size: newFoodServing,
      category: newFoodCategory, created_by: "user",
      created_at: new Date().toISOString(),
      budget_tier: newFoodBudgetTier,
      price_est: `$${Number(newFoodPrice).toFixed(2)}`
    };
    setFoodsList([newFood, ...foodsList]);
    setNewFoodName("");
    setShowAdd(false);
  };

  const handleLogFood = (food: Food, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const newLogged: LoggedMeal = {
      id: Math.random().toString(36).substring(2, 9),
      foodId: food.id, name: food.name, calories: food.calories,
      protein: food.protein_g || 0, carbs: food.carbs_g || 0,
      fat: food.fat_g || 0, quantity: 1, mealType,
      price_est: food.price_est || "$0.00",
      budget_tier: food.budget_tier || 'standard'
    };
    setLoggedMeals([...loggedMeals, newLogged]);
    setLoggingFoodId(null);

    // Auto-sync manual meal to Google Sheets
    const capitalizedMeal = (mealType.charAt(0).toUpperCase() + mealType.slice(1)) as "Breakfast" | "Lunch" | "Dinner" | "Snack";
    GoogleSheetsService.logNutrition({
      date: new Date().toISOString().split("T")[0],
      mealType: capitalizedMeal,
      foodItem: food.name,
      calories: food.calories,
      proteinG: food.protein_g || 0,
      carbsG: food.carbs_g || 0,
      fatsG: food.fat_g || 0,
      source: "Manual",
    });
  };

  const handleDeleteLoggedMeal = (id: string) => {
    setLoggedMeals(loggedMeals.filter(m => m.id !== id));
  };

  // ---- Computed values ----

  const totalCal = Math.round(loggedMeals.reduce((s, m) => s + m.calories * m.quantity, 0));
  const totalPro = Number(loggedMeals.reduce((s, m) => s + m.protein * m.quantity, 0).toFixed(1));
  const totalCarbs = Number(loggedMeals.reduce((s, m) => s + m.carbs * m.quantity, 0).toFixed(1));
  const totalFat = Number(loggedMeals.reduce((s, m) => s + m.fat * m.quantity, 0).toFixed(1));
  const parsePrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
  const totalDailyCost = Number(loggedMeals.reduce((s, m) => s + parsePrice(m.price_est) * m.quantity, 0).toFixed(2));
  const calorieTarget = generatedPlans ? generatedPlans.metrics.targetCalories : 2000;

  const filteredFoods = foodsList.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchBudget = activeBudgetTab === 'all' || f.budget_tier === activeBudgetTab;
    return matchSearch && matchBudget;
  });

  // Live BMI preview
  const liveBmi = Number((weightKg / ((heightCm / 100) ** 2)).toFixed(1));
  const liveBmiCategory = liveBmi < 18.5 ? 'Underweight' : liveBmi < 25 ? 'Normal' : liveBmi < 30 ? 'Overweight' : 'Obese';

  // ──────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Nutrition Engine</h1>
          <p>Enter your body details to get a personalised diet plan, or track meals manually</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <VoiceReadButton
            text={`Nutrition Engine. Your current daily intake: ${totalCal} calories out of ${calorieTarget} target, ${totalPro} grams protein, ${totalCarbs} grams carbs, ${totalFat} grams fat. Estimated daily food cost: $${totalDailyCost}.`}
            size="md"
            label="🔊 Read Stats"
          />
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPlanGenerator(!showPlanGenerator)}>
            <ClipboardList size={16} /> {showPlanGenerator ? 'Hide' : 'Show'} Plan Generator
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus size={16} /> Add Custom Food
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SECTION 0 — SMART FOOD SCANNER
          ════════════════════════════════════════ */}
      <div style={{ marginBottom: 40 }}>
        {/* Scanner section header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 18, flexWrap: "wrap", gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(0,217,255,0.15), rgba(108,99,255,0.15))",
              border: "1px solid rgba(0,217,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <ScanLine size={20} style={{ color: "var(--accent-cyan)" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", margin: 0 }}>🔬 Smart Food Scanner</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                Photo recognition via AI + USDA database &nbsp;|&nbsp; Barcode → Open Food Facts
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowSmartScanner(!showSmartScanner)}>
            {showSmartScanner ? "Hide" : "Show"} Scanner
          </button>
        </div>

        {showSmartScanner && (
          <div className="animate-fade" style={{
            background: "#141424", border: "1px solid rgba(0,217,255,0.2)",
            borderRadius: "var(--radius-lg)", overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(0,217,255,0.05)"
          }}>
            {/* Top gradient accent */}
            <div style={{ height: 3, background: "linear-gradient(90deg, #6C63FF, #00D9FF, #00FF88)" }} />

            {/* Tab switcher */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {(["photo", "barcode"] as const).map(tab => (
                <button key={tab} onClick={() => setScannerTab(tab)} style={{
                  flex: 1, padding: "14px 20px", border: "none", cursor: "pointer",
                  background: scannerTab === tab ? "rgba(108,99,255,0.1)" : "transparent",
                  color: scannerTab === tab ? "var(--accent-purple)" : "var(--text-secondary)",
                  fontWeight: 700, fontSize: "0.87rem",
                  borderBottom: scannerTab === tab ? "2px solid var(--accent-purple)" : "2px solid transparent",
                  transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  {tab === "photo" ? <><Camera size={16} /> 📸 Photo Analyzer</> : <><Barcode size={16} /> 📦 Barcode Scanner</>}
                </button>
              ))}
            </div>

            {/* Scanner content */}
            <div style={{ padding: 24 }}>
              {/* Source badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {scannerTab === "photo" ? (
                  <>
                    <span style={{ fontSize: "0.73rem", background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.3)", borderRadius: 20, padding: "3px 10px", color: "#4285F4" }}>✨ Gemini 2.5 Flash Vision</span>
                    <span style={{ fontSize: "0.73rem", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 20, padding: "3px 10px", color: "var(--accent-green)" }}>🌾 USDA FoodData Central</span>
                  </>
                ) : (
                  <span style={{ fontSize: "0.73rem", background: "rgba(0,217,255,0.08)", border: "1px solid rgba(0,217,255,0.2)", borderRadius: 20, padding: "3px 10px", color: "var(--accent-cyan)" }}>📦 Open Food Facts — 2M+ products, free</span>
                )}
              </div>

              {scannerTab === "photo"
                ? <FoodPhotoAnalyzer onLogFood={handleScannerLog} />
                : <BarcodeScanner onLogFood={handleScannerLog} />
              }
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          SECTION 1 — DIET PLAN GENERATOR
          ════════════════════════════════════════ */}

      {showPlanGenerator && (
        <div className="animate-fade" style={{ marginBottom: 40 }}>
          {/* Input Form */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)", padding: 28, marginBottom: 24,
            position: "relative", overflow: "hidden"
          }}>
            {/* Accent top border */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gradient-primary)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "var(--radius-sm)",
                background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Zap size={20} style={{ color: "var(--accent-purple)" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: 2 }}>AI Diet Plan Generator</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Enter your body stats and get 3 personalised meal plans for Economy, Standard &amp; Premium budgets
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 14, marginBottom: 20 }}>
              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Ruler size={13} /> Height (cm)
                </label>
                <input
                  id="diet-height" className="input" type="number" min={100} max={250}
                  value={heightCm} onChange={e => setHeightCm(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Weight size={13} /> Weight (kg)
                </label>
                <input
                  id="diet-weight" className="input" type="number" min={30} max={250}
                  value={weightKg} onChange={e => setWeightKg(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={13} /> Age
                </label>
                <input
                  id="diet-age" className="input" type="number" min={10} max={100}
                  value={age} onChange={e => setAge(Number(e.target.value))}
                />
              </div>

              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <User size={13} /> Gender
                </label>
                <select id="diet-gender" className="input" value={gender} onChange={e => setGender(e.target.value as Gender)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Activity size={13} /> Activity Level
                </label>
                <select id="diet-activity" className="input" value={activityLevel} onChange={e => setActivityLevel(e.target.value as ActivityLevel)}>
                  <option value="sedentary">Sedentary (office job)</option>
                  <option value="light">Light (1-3 days/wk)</option>
                  <option value="moderate">Moderate (3-5 days/wk)</option>
                  <option value="active">Active (6-7 days/wk)</option>
                  <option value="very_active">Very Active (athlete)</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Target size={13} /> Goal
                </label>
                <select id="diet-goal" className="input" value={goal} onChange={e => setGoal(e.target.value as Goal)}>
                  <option value="lose_weight">⚖️ Lose Weight</option>
                  <option value="maintain">❤️ Maintain</option>
                  <option value="build_muscle">💪 Build Muscle</option>
                </select>
              </div>
            </div>

            {/* Live BMI preview bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16, padding: "12px 16px",
              background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)", marginBottom: 20
            }}>
              <Heart size={16} style={{ color: "var(--accent-pink)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Live BMI:</span>
              <span style={{
                fontWeight: 800, fontSize: "1.1rem",
                color: liveBmi < 18.5 ? "var(--accent-cyan)" : liveBmi < 25 ? "var(--accent-green)" : liveBmi < 30 ? "var(--accent-orange)" : "var(--accent-red)"
              }}>
                {liveBmi}
              </span>
              <span className={`badge ${liveBmi < 18.5 ? 'badge-primary' : liveBmi < 25 ? 'badge-success' : liveBmi < 30 ? 'badge-warning' : 'badge-danger'}`}
                style={{ fontSize: "0.65rem" }}
              >
                {liveBmiCategory}
              </span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {heightCm}cm / {weightKg}kg / {age}y / {gender}
              </span>
            </div>

            <button
              id="generate-diet-plan"
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={handleGeneratePlan}
            >
              <Sparkles size={18} /> Generate My Diet Plan <ArrowRight size={18} />
            </button>
          </div>

          {/* ──── Generated Results ──── */}
          {generatedPlans && (
            <div className="animate-fade">
              {/* Body Metrics Summary */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12, marginBottom: 24
              }}>
                {[
                  { label: "BMI", value: generatedPlans.metrics.bmi, sub: generatedPlans.metrics.bmiCategory, color: generatedPlans.metrics.bmi < 25 ? "var(--accent-green)" : "var(--accent-orange)" },
                  { label: "BMR", value: `${generatedPlans.metrics.bmr}`, sub: "cal/day at rest", color: "var(--accent-cyan)" },
                  { label: "TDEE", value: `${generatedPlans.metrics.tdee}`, sub: "total expenditure", color: "var(--accent-purple)" },
                  { label: "Target", value: `${generatedPlans.metrics.targetCalories}`, sub: `cal/day (${goal === 'lose_weight' ? '-20%' : goal === 'build_muscle' ? '+15%' : 'maintenance'})`, color: "var(--accent-orange)" },
                  { label: "Protein", value: `${generatedPlans.metrics.proteinG}g`, sub: "daily target", color: "var(--accent-red)" },
                  { label: "Carbs", value: `${generatedPlans.metrics.carbsG}g`, sub: "daily target", color: "var(--accent-cyan)" },
                  { label: "Fat", value: `${generatedPlans.metrics.fatG}g`, sub: "daily target", color: "var(--accent-green)" },
                ].map((m, i) => (
                  <div key={i} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)", padding: "16px 14px", textAlign: "center",
                    position: "relative", overflow: "hidden"
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color }} />
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: 2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* 3 Tier Plans */}
              <h3 style={{ fontSize: "1.15rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <ClipboardList size={18} style={{ color: "var(--accent-purple)" }} />
                Your Personalised Daily Meal Plans
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                <DietPlanCard plan={generatedPlans.economy} accent="var(--accent-green)" badgeClass="badge-success" />
                <DietPlanCard plan={generatedPlans.standard} accent="var(--accent-cyan)" badgeClass="badge-primary" />
                <DietPlanCard plan={generatedPlans.premium} accent="var(--accent-orange)" badgeClass="badge-warning" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          SECTION 2 — FOOD TRACKER (existing)
          ════════════════════════════════════════ */}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={22} style={{ color: "var(--accent-orange)" }} />
          Daily Food Tracker
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowFoodTracker(!showFoodTracker)}>
          {showFoodTracker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showFoodTracker ? " Collapse" : " Expand"}
        </button>
      </div>

      {showFoodTracker && (
        <div className="animate-fade">
          {/* Macro & Budget Overview */}
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <div className="stat-card" style={{ display: "flex", flexDirection: "column" }}>
              <div className="stat-card-icon" style={{ background: "rgba(255,179,71,0.12)", border: "1px solid rgba(255,179,71,0.3)" }}><Flame size={22} /></div>
              <div className="stat-card-value">{totalCal}</div>
              <div className="stat-card-label">Calories</div>
              <div style={{ marginTop: 8, height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (totalCal / calorieTarget) * 100)}%`, height: "100%", background: "var(--gradient-warm)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{Math.max(0, calorieTarget - totalCal)} remaining</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)" }}><Beef size={22} /></div>
              <div className="stat-card-value">{totalPro}g</div>
              <div className="stat-card-label">Protein</div>
              <div style={{ marginTop: 8, height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (totalPro / 150) * 100)}%`, height: "100%", background: "var(--gradient-danger)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Target: 150g</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.3)" }}><Wheat size={22} /></div>
              <div className="stat-card-value">{totalCarbs}g</div>
              <div className="stat-card-label">Carbs</div>
              <div style={{ marginTop: 8, height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #00D9FF, #6C63FF)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Target: 220g</div>
            </div>

            <div className="stat-card" style={{ position: "relative" }}>
              <div className="stat-card-icon" style={{ background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)", position: "relative" }}>
                <DollarSign size={22} style={{ color: "var(--accent-green)" }} />
              </div>
              <div className="stat-card-value" style={{ color: "var(--accent-green)" }}>${totalDailyCost}</div>
              <div className="stat-card-label">Today&apos;s Est. Spend</div>
              <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                {totalDailyCost <= 5 ? (
                  <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>Economy Tier Diet</span>
                ) : totalDailyCost <= 15 ? (
                  <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>Medium Salary Tier</span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: "0.65rem" }}>Premium Tier Diet</span>
                )}
              </div>
            </div>
          </div>

          {/* Add Custom Food */}
          {showAdd && (
            <div className="card-glass animate-fade" style={{ marginBottom: 32, padding: 24, border: "1px solid var(--accent-purple)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} style={{ color: "var(--accent-purple)" }} /> Create Custom Food Item
              </h3>
              <form onSubmit={handleAddCustomFood}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
                  <div className="input-group">
                    <label>Food Name</label>
                    <input className="input" placeholder="e.g. Canned Kidney Beans" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <select className="input" value={newFoodCategory} onChange={e => setNewFoodCategory(e.target.value)}>
                      <option value="Protein">Protein</option>
                      <option value="Carbs">Carbs</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Fruit">Fruit</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fats">Healthy Fats</option>
                      <option value="Superfoods">Superfoods</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Serving Size</label>
                    <input className="input" placeholder="e.g. 100g, 1 cup" value={newFoodServing} onChange={e => setNewFoodServing(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Salary/Budget Sector</label>
                    <select className="input" value={newFoodBudgetTier} onChange={e => setNewFoodBudgetTier(e.target.value as 'economy' | 'standard' | 'premium')}>
                      <option value="economy">Economy / Budget-Friendly (Low Salary)</option>
                      <option value="standard">Standard / Balanced (Medium Salary)</option>
                      <option value="premium">Premium / Gourmet (High Salary / Rich)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Est. Cost per serving ($)</label>
                    <input className="input" type="number" step="0.01" min="0" placeholder="e.g. 0.40" value={newFoodPrice} onChange={e => setNewFoodPrice(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 16, marginBottom: 20 }}>
                  <div className="input-group">
                    <label>Calories</label>
                    <input className="input" type="number" value={newFoodCalories} onChange={e => setNewFoodCalories(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Protein (g)</label>
                    <input className="input" type="number" value={newFoodProtein} onChange={e => setNewFoodProtein(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Carbs (g)</label>
                    <input className="input" type="number" value={newFoodCarbs} onChange={e => setNewFoodCarbs(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Fat (g)</label>
                    <input className="input" type="number" value={newFoodFat} onChange={e => setNewFoodFat(Number(e.target.value))} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">Create Food</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid-2">
            {/* Today's Meals */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: "1.1rem" }}>Today&apos;s Meals</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Estimated cost: <strong style={{ color: "var(--accent-green)" }}>${totalDailyCost}</strong>
                </span>
              </div>

              {MEAL_TYPES.map(mt => {
                const meals = loggedMeals.filter(m => m.mealType === mt.value);
                const totalMealCal = Math.round(meals.reduce((a, m) => a + m.calories * m.quantity, 0));
                const totalMealCost = Number(meals.reduce((a, m) => a + parsePrice(m.price_est) * m.quantity, 0).toFixed(2));

                return (
                  <div className="meal-section" key={mt.value} style={{ background: "var(--bg-secondary)", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 16, border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h4 style={{ fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{mt.icon}</span>
                        <span>{mt.label}</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>({totalMealCal} cal)</span>
                      </h4>
                      {totalMealCost > 0 && (
                        <span style={{ fontSize: "0.75rem", color: "var(--accent-green)" }}>${totalMealCost}</span>
                      )}
                    </div>

                    {meals.length === 0 ? (
                      <div style={{ padding: "16px", background: "var(--bg-card)", border: "1px dashed var(--border-color)", borderRadius: 8, fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
                        No meals logged yet
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {meals.map((m) => (
                          <div className="food-item" key={m.id} style={{ margin: 0, padding: "10px 14px" }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                                {m.name}
                                {m.budget_tier === 'economy' && <span style={{ color: "var(--accent-green)", fontSize: "0.65rem", fontWeight: 800 }}>$</span>}
                                {m.budget_tier === 'standard' && <span style={{ color: "var(--accent-cyan)", fontSize: "0.65rem", fontWeight: 800 }}>$$</span>}
                                {m.budget_tier === 'premium' && <span style={{ color: "var(--accent-orange)", fontSize: "0.65rem", fontWeight: 800 }}>$$$</span>}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                                P: {m.protein}g • Qty: {m.quantity} | Est: {m.price_est}
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span className="badge badge-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>{Math.round(m.calories * m.quantity)} cal</span>
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: 4, width: 28, height: 28, minHeight: 28, color: "var(--accent-red)" }}
                                onClick={() => handleDeleteLoggedMeal(m.id)}
                                title="Remove log"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Food Database */}
            <div>
              <h3 style={{ marginBottom: 20, fontSize: "1.1rem" }}>Food Budget Sectors</h3>

              {/* Segmented Filter Control */}
              <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", padding: 4, marginBottom: 16, border: "1px solid var(--border-color)", gap: 4 }}>
                {([
                  { key: 'all' as const, label: 'All Tiers', bg: 'var(--bg-card-hover)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' },
                  { key: 'economy' as const, label: 'Economy ($)', bg: 'rgba(0,255,136,0.12)', color: 'var(--accent-green)', borderColor: 'rgba(0,255,136,0.3)' },
                  { key: 'standard' as const, label: 'Moderate ($$)', bg: 'rgba(0,217,255,0.12)', color: 'var(--accent-cyan)', borderColor: 'rgba(0,217,255,0.3)' },
                  { key: 'premium' as const, label: 'Premium ($$$)', bg: 'rgba(255,179,71,0.12)', color: 'var(--accent-orange)', borderColor: 'rgba(255,179,71,0.3)' },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    className="btn btn-sm"
                    style={{
                      flex: 1, padding: "6px 0", borderRadius: 4,
                      background: activeBudgetTab === tab.key ? tab.bg : 'transparent',
                      color: activeBudgetTab === tab.key ? tab.color : 'var(--text-secondary)',
                      border: activeBudgetTab === tab.key ? `1px solid ${tab.borderColor}` : 'none'
                    }}
                    onClick={() => setActiveBudgetTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ position: "relative", marginBottom: 16 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input className="input" placeholder="Search foods in this sector..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, width: "100%" }} />
              </div>

              {/* Budget Insight Note */}
              <div style={{
                background: activeBudgetTab === 'economy' ? "rgba(0,255,136,0.04)" : activeBudgetTab === 'standard' ? "rgba(0,217,255,0.04)" : activeBudgetTab === 'premium' ? "rgba(255,179,71,0.04)" : "var(--bg-glass)",
                border: `1px solid ${activeBudgetTab === 'economy' ? "rgba(0,255,136,0.15)" : activeBudgetTab === 'standard' ? "rgba(0,217,255,0.15)" : activeBudgetTab === 'premium' ? "rgba(255,179,71,0.15)" : "var(--border-color)"}`,
                padding: 12, borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 16
              }}>
                {activeBudgetTab === 'all' && <span>💡 Select a budget sector tab above to filter foods for your spending level.</span>}
                {activeBudgetTab === 'economy' && <span>🟢 <strong>Economy Sector:</strong> High-nutrition, low-cost staples like eggs, oats, lentils, and canned tuna.</span>}
                {activeBudgetTab === 'standard' && <span>🔵 <strong>Moderate Sector:</strong> Balanced essentials — chicken breast, yogurt, quinoa, avocados.</span>}
                {activeBudgetTab === 'premium' && <span>🟡 <strong>Premium Sector:</strong> Gourmet picks — salmon, ribeye, organic berries, premium whey.</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto", paddingRight: 4 }}>
                {filteredFoods.length === 0 ? (
                  <div style={{ padding: "30px", color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center" }}>
                    No foods found matching filters.
                  </div>
                ) : (
                  filteredFoods.map(f => (
                    <div
                      className="food-item"
                      key={f.id}
                      style={{
                        flexDirection: "column", alignItems: "stretch", gap: 8,
                        borderColor: loggingFoodId === f.id ? "var(--accent-purple)" : "var(--border-color)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8 }}>
                            {f.name}
                            {f.budget_tier === 'economy' && <span className="badge badge-success" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>Economy</span>}
                            {f.budget_tier === 'standard' && <span className="badge badge-primary" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>Moderate</span>}
                            {f.budget_tier === 'premium' && <span className="badge badge-warning" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>Premium</span>}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                            P: {f.protein_g}g • C: {f.carbs_g}g • F: {f.fat_g}g | {f.serving_size}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ textAlign: "right" }}>
                            <span className="badge badge-warning" style={{ fontSize: "0.75rem", display: "block" }}>{f.calories} cal</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--accent-green)", fontWeight: 600, display: "block", marginTop: 2 }}>{f.price_est} / serv</span>
                          </div>

                          {loggingFoodId !== f.id ? (
                            <button className="btn btn-primary btn-sm" style={{ padding: "4px 8px" }} onClick={() => setLoggingFoodId(f.id)}>
                              <Plus size={14} />
                            </button>
                          ) : (
                            <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", color: "var(--accent-purple)" }} onClick={() => setLoggingFoodId(null)}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {loggingFoodId === f.id && (
                        <div className="animate-fade" style={{ display: "flex", gap: 6, padding: "8px 0 4px 0", borderTop: "1px solid var(--border-color)", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginRight: "auto" }}>Log to:</span>
                          <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", fontSize: "0.7rem" }} onClick={() => handleLogFood(f, 'breakfast')}>🌅 Breakfast</button>
                          <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", fontSize: "0.7rem" }} onClick={() => handleLogFood(f, 'lunch')}>☀️ Lunch</button>
                          <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", fontSize: "0.7rem" }} onClick={() => handleLogFood(f, 'dinner')}>🌙 Dinner</button>
                          <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px", fontSize: "0.7rem" }} onClick={() => handleLogFood(f, 'snack')}>🍎 Snack</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
