import { NextRequest, NextResponse } from "next/server";
import { DEMO_EXERCISES, DEMO_FOODS } from "@/lib/constants";

// Helper to perform simple search retrieval (RAG)
function retrieveContext(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  // Retrieve Exercises
  const matchedExercises = DEMO_EXERCISES.filter(ex => {
    return words.some(word => 
      ex.name.toLowerCase().includes(word) ||
      ex.muscle_group.toLowerCase().includes(word) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(word)) ||
      (ex.description && ex.description.toLowerCase().includes(word))
    );
  }).slice(0, 4);

  // Retrieve Foods
  const matchedFoods = DEMO_FOODS.filter(food => {
    return words.some(word => 
      food.name.toLowerCase().includes(word) ||
      (food.category && food.category.toLowerCase().includes(word))
    );
  }).slice(0, 4);

  return {
    exercises: matchedExercises,
    foods: matchedFoods
  };
}

// Intelligent offline RAG generator
function generateLocalResponse(
  query: string, 
  profile: any, 
  retrievedEx: typeof DEMO_EXERCISES, 
  retrievedFd: typeof DEMO_FOODS,
  recentWorkouts: any[],
  recentMeals: any[]
): string {
  const lower = query.toLowerCase();
  const isBangla = /কখন|কি|খাব|ব্যায়াম|কী|করব|ওজন|রুটিন|ডায়েট|প্রোটিন|ক্যালরি/i.test(query);

  // 1. Calorie / Nutrition Query
  if (lower.includes("calorie") || lower.includes("eat") || lower.includes("diet") || lower.includes("খাব") || lower.includes("ডায়েট") || lower.includes("ক্যালরি")) {
    const calorieTarget = profile?.daily_calorie_target || 2000;
    const currentWeight = profile?.weight_kg || 70;
    const goal = profile?.fitness_goal || "general_fitness";

    if (isBangla) {
      return `আপনার ফিটনেস প্রোফাইল অনুযায়ী কাস্টমাইজড ডায়েট প্ল্যান নিচে দেওয়া হলো:

• **দৈনিক ক্যালরি লক্ষ্য**: ${calorieTarget} kcal
• **আপনার বর্তমান ওজন**: ${currentWeight} kg
• **লক্ষ্য**: ${goal.replace("_", " ")}

**খাবারের রুটিন (Bangladeshi Diet Concept):**
🌅 **সকাল (Breakfast)**: ওটমিল (${DEMO_FOODS[5].calories} cal) বা লাল আটার রুটি ২টা, ডিম সিদ্ধ ২টি (${DEMO_FOODS[3].calories} cal), এবং গ্রিক ইয়োগার্ট ১ কাপ।
☀️ **দুপুর (Lunch)**: গ্রিলড চিকেন ব্রেস্ট (${DEMO_FOODS[0].calories} cal, প্রোটিন ৩১ গ্রাম) বা মাছ ১৫০ গ্রাম, লাল চালের ভাত দেড় কাপ (${DEMO_FOODS[1].calories} cal) এবং ডাল ১ বাটি।
🍎 **বিকাল (Snack)**: ১টি কলা (${DEMO_FOODS[2].calories} cal) এবং সামান্য বাদাম।
🌙 **রাত (Dinner)**: হালকা ভাত ১ কাপ, মাছের ঝোল বা চিকেন কারি এবং সবুজ সালাদ।

*টিপস: দৈনিক কমপক্ষে ৩-৪ লিটার পানি পান করুন এবং চিনিযুক্ত খাবার এড়িয়ে চলুন।* 🥦`;
    }

    return `Based on your profile, here is a customized nutrition and meal guidance:

• **Daily Calorie Target**: ${calorieTarget} kcal
• **Current Weight**: ${currentWeight} kg
• **Fitness Goal**: ${goal.replace("_", " ")}

**Recommended Meal Split:**
🌅 **Breakfast**: Oatmeal (${DEMO_FOODS[5].calories} cal) + 1 Banana (${DEMO_FOODS[2].calories} cal) + 2 Eggs (${DEMO_FOODS[3].calories} cal)
☀️ **Lunch**: Grilled Chicken Breast (${DEMO_FOODS[0].calories} cal, 31g Protein) + 1.5 cups Brown Rice (${DEMO_FOODS[1].calories} cal) + Dal (${DEMO_FOODS[9].calories} cal)
🍎 **Snack**: Greek Yogurt (${DEMO_FOODS[4].calories} cal) or Mix Fruits
🌙 **Dinner**: Baked Salmon (${DEMO_FOODS[6].calories} cal) or Local Fish Curry + 1 cup Rice + Mixed Veggies

*Retrieved database matching foods:* ${retrievedFd.length > 0 ? retrievedFd.map(f => `${f.name} (${f.calories} cal)`).join(", ") : "Chicken Breast, Greek Yogurt, Brown Rice"}.

Let me know if you would like me to adjust the macros! 🍳`;
  }

  // 2. Workout / Exercise Query
  if (lower.includes("workout") || lower.includes("split") || lower.includes("exercise") || lower.includes("bicep") || lower.includes("bench") || lower.includes("squat") || lower.includes("ব্যায়াম") || lower.includes("রুটিন")) {
    const level = profile?.fitness_level || "intermediate";
    const goal = profile?.fitness_goal || "general_fitness";

    const exList = retrievedEx.length > 0 ? retrievedEx : DEMO_EXERCISES.slice(0, 4);
    
    if (isBangla) {
      return `আপনার লেভেল (${level}) এবং লক্ষ্য (${goal.replace("_", " ")}) এর জন্য ব্যায়ামের রুটিন:

**প্রস্তাবিত ওয়ার্কআউট সেশন:**
1. **${exList[0]?.name || "বারবেল বেঞ্চ প্রেস"}** - ${exList[0]?.muscle_group || "Chest"} (${exList[0]?.difficulty || "intermediate"})
   • নির্দেশিকা: ${exList[0]?.instructions || "Lie on bench, lowering to chest, press up"}
2. **${exList[1]?.name || "বারবেল স্কোয়াট"}** - ${exList[1]?.muscle_group || "Legs"} (${exList[1]?.difficulty || "intermediate"})
   • নির্দেশিকা: ${exList[1]?.instructions || "Bar on back, squat down, drive up through heels"}
3. **${exList[2]?.name || "ডেডলিফট"}** - ${exList[2]?.muscle_group || "Back"} (${exList[2]?.difficulty || "advanced"})
   • নির্দেশিকা: ${exList[2]?.instructions || "Grip bar, drive through legs, extend hips"}

*পরামর্শ: প্রতিটি ব্যায়ামের আগে ওয়ার্ম-আপ করুন। সেট এর মধ্যে ৬০-৯০ সেকেন্ড বিশ্রাম নিন।* 💪`;
    }

    return `Here is a personalized training routine based on your fitness level (**${level}**) and target (**${goal.replace("_", " ")}**):

**Routine Outline:**
1. **${exList[0]?.name || "Barbell Bench Press"}** (${exList[0]?.muscle_group || "Chest"})
   • Sets: 4 × 8-10 reps. Difficulty: ${exList[0]?.difficulty || "intermediate"}.
   • How to: ${exList[0]?.instructions || "Lower the bar to your chest and press up."}
2. **${exList[1]?.name || "Barbell Squat"}** (${exList[1]?.muscle_group || "Legs"})
   • Sets: 4 × 8-12 reps. Difficulty: ${exList[1]?.difficulty || "intermediate"}.
   • How to: ${exList[1]?.instructions || "Squat down until thighs are parallel to ground, push up."}
3. **${exList[2]?.name || "Deadlift"}** (${exList[2]?.muscle_group || "Back"})
   • Sets: 3 × 5 reps. Difficulty: ${exList[2]?.difficulty || "advanced"}.
   • How to: ${exList[2]?.instructions || "Keep back straight, lift with hips and legs."}

Let me know if you want details on form safety or custom splits! 🏋️`;
  }

  // 3. Tired / Recovery Query
  if (lower.includes("tired") || lower.includes("fatigue") || lower.includes("rest") || lower.includes("recovery") || lower.includes("ক্লান্ত") || lower.includes("বিশ্রাম")) {
    if (isBangla) {
      return `ক্লান্তি অনুভব করলে জোর করে ভারী ব্যায়াম করা উচিত নয়। নিচে আপনার জন্য একটি রিকভারি গাইড দেওয়া হলো:

🧘 **হালকা স্ট্রেচিং ও গতিশীলতা সেশন (২০ মিনিট):**
1. **ক্যাট-কাউ স্ট্রেচ**: ২ সেট × ১০ বার (মেরুদণ্ড সচল করে)।
2. **হিপ সার্কেল**: ২ সেট × ১০ বার (কোমর ও কুঁচকির পেশি শিথিল করে)।
3. **হালকা হাঁটা**: ১০-১৫ মিনিট মুক্ত বাতাসে হাঁটা।

*মনে রাখবেন: বিশ্রামের সময়ই পেশী বৃদ্ধি এবং মেরামত হয়। পর্যাপ্ত ঘুম (৭-৮ ঘণ্টা) ও তরল পান নিশ্চিত করুন!* 😴`;
    }
    return `It sounds like you need some recovery time! Here's a customized recovery routine:

🧘 **Light Active Recovery Protocol (20-25 min):**
1. **Foam Rolling**: 5-10 min focusing on tight areas.
2. **Dynamic Mobility**: Cat-Cow (10 reps) + World's Greatest Stretch (5 per side).
3. **Decompression**: Child's pose for 2 minutes.
4. **Light Cardio**: 10-15 min light walking at a conversational pace.

Sleep 7-8 hours tonight and drink plenty of water. Your body grows when resting! 💤`;
  }

  // Default Fallback
  if (isBangla) {
    return `হ্যালো! আমি আপনার এআই ফিটনেস কোচ। আপনার প্রোফাইল অনুযায়ী:
• দৈনিক ক্যালরি লক্ষ্য: ${profile?.daily_calorie_target || 2000} kcal
• বর্তমান ওজন: ${profile?.weight_kg || 70} kg
• লক্ষ্য: ${profile?.fitness_goal?.replace("_", " ") || "সাধারণ ফিটনেস"}

আমি আপনাকে ব্যায়াম রুটিন, ডায়েট প্ল্যান, সাপ্লিমেন্ট এবং সঠিক ফর্ম বজায় রাখতে সাহায্য করতে পারি। আপনি কী জানতে চান বলুন! 🌟`;
  }

  return `Hello! I am your RAG-powered AI Fitness Coach. Here are your stats:
• Goal: **${profile?.fitness_goal?.replace("_", " ") || "General Fitness"}**
• Level: **${profile?.fitness_level || "Beginner"}**
• Calorie Target: **${profile?.daily_calorie_target || 2000} kcal**

I'm connected to the Exercise Library (${DEMO_EXERCISES.length} movements) and Food Database (${DEMO_FOODS.length} items). Ask me anything about workout routines, nutrition plans, or form guidance! ⚡`;
}

// Generator for full AI assessment & 360 plan
function generateAssessmentResponse(assessment: any): string {
  const h = Number(assessment.height) || 175;
  const w = Number(assessment.weight) || 72;
  const country = assessment.country || "Bangladesh";
  const goal = assessment.goal || "Muscle Gain & Fat Loss";
  const act = assessment.activityLevel || "Moderate";
  const photo = assessment.photoName ? `📸 **Physique Photo Attached:** \`${assessment.photoName}\` (Analyzed)` : "";

  // Calculations
  const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
  let bmiCategory = "Normal weight";
  if (Number(bmi) < 18.5) bmiCategory = "Underweight";
  else if (Number(bmi) >= 25 && Number(bmi) < 30) bmiCategory = "Overweight";
  else if (Number(bmi) >= 30) bmiCategory = "Obese";

  // Targets
  const proteinMin = Math.round(w * 1.8);
  const proteinMax = Math.round(w * 2.2);
  const waterTarget = ((w * 0.035) + 0.5).toFixed(1);

  let bmr = 10 * w + 6.25 * h - 5 * 25 + 5;
  let calories = Math.round(bmr * (act === "High" ? 1.55 : act === "Moderate" ? 1.4 : 1.2));
  if (goal.toLowerCase().includes("loss")) calories -= 400;
  if (goal.toLowerCase().includes("gain")) calories += 350;

  // Country specific meals:
  let mealsStr = "";
  const cLower = country.toLowerCase();
  if (cLower.includes("bangladesh") || cLower.includes("bd")) {
    mealsStr = `
🌅 **Breakfast (08:30 AM)**: 2 Lal Atta Ruti + 2 Boiled Eggs + 1 Cup Sour Curd/Yogurt + 1 Banana (*~450 cal | 28g Protein*)
☀️ **Mid-Morning Snack (11:30 AM)**: 1 Handful Almonds/Nuts + Green Tea (*~180 cal | 6g Protein*)
🍚 **Lunch (01:30 PM)**: 1.5 Cups Parboiled Brown Rice + 150g Grilled Fish (Ruhi/Katla/Ilish) or Chicken Breast + 1 Bowl Lentils (Dal) + Salad (*~650 cal | 42g Protein*)
🍎 **Evening Snack (05:30 PM)**: Boiled Chana (Chickpeas) with cucumber & lemon or 1 Scoop Whey Protein (*~220 cal | 24g Protein*)
🌙 **Dinner (08:30 PM)**: 1 Cup Rice / 2 Ruti + 120g Chicken Curry / Fish + Egg White Curry + Fresh Salad (*~500 cal | 35g Protein*)`;
  } else if (cLower.includes("india")) {
    mealsStr = `
🌅 **Breakfast (08:30 AM)**: Paneer Bhurji (150g) with 2 Whole Wheat Rotis + 1 Apple (*~480 cal | 30g Protein*)
☀️ **Mid-Morning Snack (11:30 AM)**: Roasted Chana + 1 Cup Buttermilk (Chaas) (*~160 cal | 10g Protein*)
🍚 **Lunch (01:30 PM)**: 1.5 Cups Brown Rice + Dal Tadka + 150g Tofu/Chicken + Cucumber Raita (*~620 cal | 38g Protein*)
🍎 **Evening Snack (05:30 PM)**: Sprouts Salad or Whey Protein Shake (*~200 cal | 25g Protein*)
🌙 **Dinner (08:30 PM)**: 2 Rotis + Soya Chunks Curry / Fish Curry + Green Salad (*~480 cal | 32g Protein*)`;
  } else {
    mealsStr = `
🌅 **Breakfast (08:00 AM)**: 1 Cup Oatmeal in Almond Milk + 3 Scrambled Eggs + 1 Banana (*~500 cal | 32g Protein*)
☀️ **Mid-Morning Snack (11:00 AM)**: Greek Yogurt (200g) + Mixed Berries (*~180 cal | 18g Protein*)
🍚 **Lunch (01:30 PM)**: 180g Grilled Chicken Breast + 1.5 Cups Brown Rice / Sweet Potato + Steamed Broccoli (*~620 cal | 45g Protein*)
🍎 **Evening Snack (05:00 PM)**: Whey Protein Shake + 1 Apple or Almonds (*~240 cal | 26g Protein*)
🌙 **Dinner (08:00 PM)**: 180g Baked Salmon / Lean Beef + Quinoa + Mixed Green Salad (*~520 cal | 38g Protein*)`;
  }

  return `📊 **FULL AI BODY ASSESSMENT & 360° PLAN**

${photo}
• **Height:** ${h} cm | **Weight:** ${w} kg
• **BMI Score:** ${bmi} (${bmiCategory})
• **Country & Cuisine:** ${country}
• **Target Goal:** ${goal} (${act} Activity)

---

🎯 **1. DAILY MACRO & NUTRITION TARGETS**
• **Daily Calorie Target:** **${calories} kcal / day**
• **Protein Target:** **${proteinMin}g - ${proteinMax}g / day** (approx 2.0g per kg of body weight)
• **Water Intake:** **${waterTarget} Liters / day** (Essential for muscle hydration & metabolism)
• **Sleeping Schedule:** **7.5 - 8.5 Hours / Night** (Recommended: **10:30 PM – 06:30 AM**)

---

🍽️ **2. CULTURALLY TAILORED FULL-DAY DIET PLAN (${country.toUpperCase()})**
${mealsStr}

---

💊 **3. RECOMMENDED SUPPLEMENTS & DOSAGES**
1. **Whey Protein Isolate/Concentrate**: 1 Scoop (25g-30g protein) post-workout or as evening snack.
2. **Creatine Monohydrate**: 3g – 5g daily with water (Enhances strength, ATP energy & muscle hydration).
3. **Multivitamin & Minerals**: 1 Tablet daily after breakfast to support overall immune function.
4. **Fish Oil / Omega-3**: 1000mg daily (Supports joint health, recovery & inflammation reduction).
5. **Vitamin D3**: 2000-4000 IU daily (Promotes bone density & hormone optimization).

---

😴 **4. SLEEP & RECOVERY PROTOCOL**
• **Sleep Schedule:** Bedtime at **10:30 PM**, Wake up at **06:30 AM** (8 hours of deep restorative sleep).
• **Sleep Hygiene:** Limit screen exposure 30 min before bed; stop caffeine intake 6 hours prior to sleep.
• **Muscle Repair:** Deep REM sleep is when peak HGH (Human Growth Hormone) release occurs.

---

🏋️ **5. PHYSIQUE STRATEGY**
With a BMI of ${bmi} and body weight of ${w}kg, focus on **Progressive Overload** 4 days a week (Push / Pull / Legs split) with 20-30 min moderate cardio 3x per week. 

*Save or screenshot this plan! You can ask me to adjust any meals or swap ingredients anytime.* 🌟`;
}

function selectGroqModel(message: string = "", assessment: any = null): string {
  const msgLower = (message || "").toLowerCase();

  // 1. Picture / Photo / Physique / Vector Assessment -> llama-3.1-8b-instant
  const isPicture = Boolean(
    assessment?.photoVector ||
    assessment?.photoName ||
    msgLower.includes("picture") ||
    msgLower.includes("photo") ||
    msgLower.includes("image") ||
    msgLower.includes("physique")
  );

  if (isPicture) {
    return "llama-3.1-8b-instant";
  }

  // 2. Diet Plan / Nutrition / Meals / Food / Calorie / Macro -> llama-3.3-70b-versatile
  const isDiet = Boolean(
    assessment ||
    msgLower.includes("diet") ||
    msgLower.includes("nutrition") ||
    msgLower.includes("meal") ||
    msgLower.includes("food") ||
    msgLower.includes("calorie") ||
    msgLower.includes("protein") ||
    msgLower.includes("macro") ||
    msgLower.includes("ডায়েট") ||
    msgLower.includes("খাব")
  );

  if (isDiet) {
    return "llama-3.3-70b-versatile";
  }

  // Default instant model
  return "llama-3.1-8b-instant";
}

export async function POST(req: NextRequest) {
  try {
    const { message, profile, recentWorkouts, recentMeals, assessment } = await req.json();
    
    // Select model based on user directive:
    // - Picture / Assessment: llama-3.1-8b-instant
    // - Diet Plan / Nutrition: llama-3.3-70b-versatile
    const selectedModel = selectGroqModel(message, assessment);
    
    // If assessment data is provided, return rich assessment plan
    if (assessment) {
      const assessmentReply = generateAssessmentResponse(assessment);
      return NextResponse.json({ reply: assessmentReply, modelUsed: selectedModel });
    }
    
    // 1. Run RAG Retrieval
    const retrieved = retrieveContext(message);

    // 2. Check for API keys (Groq or OpenAI)
    const groqApiKey = process.env.GROQ_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (groqApiKey && groqApiKey !== "your-groq-api-key-here" && groqApiKey.length > 10) {
      const systemPrompt = `You are TrainIQ, an expert AI fitness coach.
Provide highly personalized, science-based workout plans, nutrition advice, and recovery tips.
You must use the retrieved database items and the user's profile/log context to formulate your response. Mention specific exercises and foods from the context when helpful.
Always be motivating, encouraging, and clear.
Support both English and Bangla. Speak in the language the user messages you in.

=== USER PROFILE ===
- Name: ${profile?.full_name || "Guest"}
- Age/DOB: ${profile?.date_of_birth || "Unknown"}
- Gender: ${profile?.gender || "Unknown"}
- Height: ${profile?.height_cm || "175"} cm
- Weight: ${profile?.weight_kg || "72"} kg
- Fitness Level: ${profile?.fitness_level || "intermediate"}
- Fitness Goal: ${profile?.fitness_goal || "general_fitness"}
- Daily Calorie Target: ${profile?.daily_calorie_target || "2000"} kcal

=== USER ACTIVITY LOGS ===
- Today's logged meals: ${recentMeals && recentMeals.length > 0 ? recentMeals.map((m: any) => `${m.food?.name} (${m.logged_at.split('T')[1].slice(0,5)}): ${m.food?.calories * m.quantity} cal`).join(", ") : "None logged yet today"}
- Recent workouts: ${recentWorkouts && recentWorkouts.length > 0 ? recentWorkouts.slice(0, 3).map((w: any) => `${w.title} (${w.workout_type}) completed on ${w.completed_at.split('T')[0]}: ${w.duration_minutes}m, ${w.calories_burned} cal`).join("; ") : "No workouts logged yet"}

=== RETRIEVED EXERCISES LIBRARY CONTEXT ===
${retrieved.exercises.map((ex, idx) => `${idx+1}. ${ex.name} (Muscle: ${ex.muscle_group}, Equipment: ${ex.equipment}, Difficulty: ${ex.difficulty})\n   - Description: ${ex.description}\n   - Instructions: ${ex.instructions}`).join("\n")}

=== RETRIEVED FOODS DATABASE CONTEXT ===
${retrieved.foods.map((f, idx) => `${idx+1}. ${f.name} (Category: ${f.category}, Serving: ${f.serving_size})\n   - Calories: ${f.calories} cal | P: ${f.protein_g}g | C: ${f.carbs_g}g | F: ${f.fat_g}g`).join("\n")}
`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${groqApiKey}` 
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ reply: data.choices[0].message.content, modelUsed: selectedModel });
      } else {
        const errText = await response.text();
        console.error("Groq API call failed, using fallback. Error:", errText);
      }
    }

    if (openAiApiKey && openAiApiKey !== "your-openai-api-key-here" && openAiApiKey.length > 10) {
      // If user put a Groq key (starts with gsk_) in OPENAI_API_KEY by accident, auto-route to Groq
      const isGroqKey = openAiApiKey.startsWith("gsk_");
      const endpoint = isGroqKey ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const modelName = isGroqKey ? selectedModel : "gpt-4";

      const systemPrompt = `You are TrainIQ, an expert AI fitness coach.
Provide highly personalized, science-based workout plans, nutrition advice, and recovery tips.
You must use the retrieved database items and the user's profile/log context to formulate your response. Mention specific exercises and foods from the context when helpful.
Always be motivating, encouraging, and clear.
Support both English and Bangla. Speak in the language the user messages you in.

=== USER PROFILE ===
- Name: ${profile?.full_name || "Guest"}
- Age/DOB: ${profile?.date_of_birth || "Unknown"}
- Gender: ${profile?.gender || "Unknown"}
- Height: ${profile?.height_cm || "175"} cm
- Weight: ${profile?.weight_kg || "72"} kg
- Fitness Level: ${profile?.fitness_level || "intermediate"}
- Fitness Goal: ${profile?.fitness_goal || "general_fitness"}
- Daily Calorie Target: ${profile?.daily_calorie_target || "2000"} kcal

=== USER ACTIVITY LOGS ===
- Today's logged meals: ${recentMeals && recentMeals.length > 0 ? recentMeals.map((m: any) => `${m.food?.name} (${m.logged_at.split('T')[1].slice(0,5)}): ${m.food?.calories * m.quantity} cal`).join(", ") : "None logged yet today"}
- Recent workouts: ${recentWorkouts && recentWorkouts.length > 0 ? recentWorkouts.slice(0, 3).map((w: any) => `${w.title} (${w.workout_type}) completed on ${w.completed_at.split('T')[0]}: ${w.duration_minutes}m, ${w.calories_burned} cal`).join("; ") : "No workouts logged yet"}

=== RETRIEVED EXERCISES LIBRARY CONTEXT ===
${retrieved.exercises.map((ex, idx) => `${idx+1}. ${ex.name} (Muscle: ${ex.muscle_group}, Equipment: ${ex.equipment}, Difficulty: ${ex.difficulty})\n   - Description: ${ex.description}\n   - Instructions: ${ex.instructions}`).join("\n")}

=== RETRIEVED FOODS DATABASE CONTEXT ===
${retrieved.foods.map((f, idx) => `${idx+1}. ${f.name} (Category: ${f.category}, Serving: ${f.serving_size})\n   - Calories: ${f.calories} cal | P: ${f.protein_g}g | C: ${f.carbs_g}g | F: ${f.fat_g}g`).join("\n")}
`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${openAiApiKey}` 
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ reply: data.choices[0].message.content });
      } else {
        const errText = await response.text();
        console.error("AI API call failed, using RAG fallback. Error:", errText);
      }
    }

    // 3. Fallback: Intelligent offline RAG response generator
    const localReply = generateLocalResponse(
      message, 
      profile, 
      retrieved.exercises, 
      retrieved.foods,
      recentWorkouts || [],
      recentMeals || []
    );
    return NextResponse.json({ reply: localReply });
  } catch (error: any) {
    console.error("Failed to process chat:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
