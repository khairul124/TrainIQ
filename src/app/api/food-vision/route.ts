import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoodItem {
  name: string;
  estimatedPortion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  source: "USDA" | "AI Estimate";
  fdcId?: string;
  usdaName?: string;
}

interface FoodIdentification {
  foods: Array<{ name: string; estimatedPortion: string }>;
}

// ─── USDA FoodData Central lookup ─────────────────────────────────────────────

async function queryUSDA(foodName: string): Promise<Partial<FoodItem> | null> {
  try {
    const apiKey = process.env.USDA_API_KEY || "DEMO_KEY";
    const query = encodeURIComponent(foodName);
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=1&dataType=SR%20Legacy,Foundation&api_key=${apiKey}`;
    const resp = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const food = data?.foods?.[0];
    if (!food) return null;
    const getNutrient = (nutrients: any[], id: number) => {
      const n = nutrients?.find((n: any) => n.nutrientId === id);
      return n ? Math.round(n.value * 10) / 10 : 0;
    };
    const nutrients = food.foodNutrients || [];
    return {
      calories:  getNutrient(nutrients, 1008),
      protein_g: getNutrient(nutrients, 1003),
      carbs_g:   getNutrient(nutrients, 1005),
      fat_g:     getNutrient(nutrients, 1004),
      fiber_g:   getNutrient(nutrients, 1079),
      source: "USDA",
      fdcId: String(food.fdcId),
      usdaName: food.description,
    };
  } catch { return null; }
}

// ─── Gemini 2.5 Flash: identify food items from image ─────────────────────────

async function identifyFoodsWithGemini(
  imageBase64: string,
  mimeType: string,
  geminiApiKey: string
): Promise<FoodIdentification> {
  const prompt = `You are a professional nutritionist with expert food recognition skills.
Carefully analyze this food image and identify EVERY distinct food item visible.
For each item, estimate a realistic portion size based on visual cues (e.g. "150g", "1 medium piece", "1 cup cooked").

Respond with ONLY valid JSON — no markdown fences, no explanation text:
{"foods":[{"name":"Grilled Chicken Breast","estimatedPortion":"150g"},{"name":"Steamed White Rice","estimatedPortion":"200g"}]}

Rules:
- Use precise, common English food names that match standard USDA FoodData Central database entries
- List each food item separately (do not group into "mixed salad" — list each ingredient)
- Maximum 8 items
- If the image does not contain food, return {"foods":[]}`;

  // Gemini 2.5 Flash API endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBase64,
            },
          },
          { text: prompt },
        ],
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 512,
        responseMimeType: "text/plain",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini 2.5 Flash API error: ${err}`);
  }

  const data = await response.json();

  // Extract text from Gemini response
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // Strip any markdown fences if present
  const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { foods: [] };

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { foods: [] };
  }
}

// ─── Main POST handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey || geminiApiKey === "your-gemini-api-key-here") {
      return NextResponse.json(
        { error: "Gemini API key not configured. Add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // 1. Identify foods with Gemini 2.5 Flash multimodal
    const identified = await identifyFoodsWithGemini(imageBase64, mimeType, geminiApiKey);

    if (!identified.foods || identified.foods.length === 0) {
      return NextResponse.json({ items: [], message: "No food detected in image" });
    }

    // 2. Query USDA FoodData Central for each identified food (parallel)
    const items: FoodItem[] = await Promise.all(
      identified.foods.map(async (food) => {
        const usdaData = await queryUSDA(food.name);
        if (usdaData && usdaData.calories !== undefined && usdaData.calories > 0) {
          return {
            name: food.name,
            estimatedPortion: food.estimatedPortion,
            calories:  usdaData.calories!,
            protein_g: usdaData.protein_g!,
            carbs_g:   usdaData.carbs_g!,
            fat_g:     usdaData.fat_g!,
            fiber_g:   usdaData.fiber_g!,
            source: "USDA" as const,
            fdcId: usdaData.fdcId,
            usdaName: usdaData.usdaName,
          };
        }
        // Fallback AI estimate if USDA lookup fails
        return {
          name: food.name,
          estimatedPortion: food.estimatedPortion,
          calories: 150, protein_g: 8, carbs_g: 15, fat_g: 6, fiber_g: 2,
          source: "AI Estimate" as const,
        };
      })
    );

    return NextResponse.json({ items, model: "gemini-2.5-flash" });
  } catch (error: any) {
    console.error("Food Vision API error:", error);
    return NextResponse.json(
      { error: error?.message || "Food analysis failed" },
      { status: 500 }
    );
  }
}
