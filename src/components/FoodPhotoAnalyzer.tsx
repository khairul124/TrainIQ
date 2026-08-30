"use client";
import { useState, useRef, useCallback } from "react";
import {
  Camera, Upload, X, Loader2, CheckCircle, AlertCircle,
  Flame, Beef, Wheat, Droplets, Plus, Database, Sparkles, ZoomIn
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface DetectedFood {
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

interface Props {
  onLogFood: (food: {
    name: string; calories: number; protein: number;
    carbs: number; fat: number; mealType: "breakfast" | "lunch" | "dinner" | "snack";
  }) => void;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// ─── Component ──────────────────────────────────────────────────────────────

export function FoodPhotoAnalyzer({ onLogFood }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<DetectedFood[]>([]);
  const [error, setError] = useState<string>("");
  const [logged, setLogged] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("lunch");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large — please use an image under 10MB");
      return;
    }
    setError("");
    setResults([]);
    setLogged(new Set());
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // Strip data:image/...;base64, prefix
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setScanning(true);
    setError("");
    setResults([]);
    try {
      const resp = await fetch("/api/food-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Analysis failed");
      if (!data.items || data.items.length === 0) {
        setError("No food detected. Try a clearer photo with visible food items.");
      } else {
        setResults(data.items);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleLog = (food: DetectedFood) => {
    onLogFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein_g,
      carbs: food.carbs_g,
      fat: food.fat_g,
      mealType: selectedMeal,
    });
    setLogged(prev => new Set(prev).add(food.name));
  };

  const handleClear = () => {
    setImagePreview(null);
    setImageBase64("");
    setResults([]);
    setError("");
    setLogged(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const macroColor = { cal: "#FF6B6B", protein: "#6C63FF", carbs: "#FFB347", fat: "#00D9FF" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Upload Zone ── */}
      {!imagePreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#6C63FF" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 16, padding: "48px 24px", textAlign: "center",
            cursor: "pointer", transition: "all 0.3s",
            background: dragging ? "rgba(108,99,255,0.08)" : "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📸</div>
          <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>
            Drop a food photo here
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 16 }}>
            or click to browse — JPG, PNG, WebP up to 10MB
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 20, padding: "4px 12px", color: "var(--accent-purple)" }}>
              🤖 AI Vision Recognition
            </span>
            <span style={{ fontSize: "0.75rem", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 20, padding: "4px 12px", color: "var(--accent-green)" }}>
              🌾 USDA Database
            </span>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </div>
      ) : (
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#0D0D1A" }}>
          {/* Preview image */}
          <img
            src={imagePreview}
            alt="Food preview"
            style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }}
          />
          {/* Scanning overlay */}
          {scanning && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(10,10,20,0.8)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
            }}>
              {/* Animated scan line */}
              <div style={{
                width: "80%", height: 2, background: "var(--gradient-primary)",
                boxShadow: "0 0 16px rgba(108,99,255,0.8)",
                animation: "scanLine 1.5s ease-in-out infinite",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700 }}>
                <Sparkles size={18} style={{ color: "var(--accent-purple)" }} />
                Analyzing with AI Vision…
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                Querying USDA nutrition database
              </p>
            </div>
          )}
          {/* Clear button */}
          <button
            onClick={handleClear}
            style={{
              position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Meal Type + Analyze Button ── */}
      {imagePreview && !scanning && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, background: "#1A1A2E", borderRadius: 10, padding: 4 }}>
            {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map(m => (
              <button
                key={m}
                onClick={() => setSelectedMeal(m)}
                style={{
                  padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: selectedMeal === m ? "var(--gradient-primary)" : "transparent",
                  color: selectedMeal === m ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.78rem", fontWeight: 600, textTransform: "capitalize", transition: "all 0.2s",
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={scanning}
            style={{
              flex: 1, minWidth: 160, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "var(--gradient-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
            }}
          >
            <Sparkles size={16} />
            Analyze Food
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
          borderRadius: 12, color: "var(--accent-red)", fontSize: "0.87rem",
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ── Results ── */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
              <CheckCircle size={18} style={{ color: "var(--accent-green)" }} />
              {results.length} food item{results.length > 1 ? "s" : ""} detected
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: "0.73rem", background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", borderRadius: 20, padding: "3px 10px", color: "var(--accent-green)" }}>
                {results.filter(r => r.source === "USDA").length} USDA verified
              </span>
            </div>
          </div>

          {results.map((food) => {
            const isLogged = logged.has(food.name);
            return (
              <div
                key={food.name}
                style={{
                  background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "16px 18px", transition: "all 0.2s",
                  opacity: isLogged ? 0.7 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{food.name}</span>
                      <span style={{
                        fontSize: "0.68rem", padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                        background: food.source === "USDA" ? "rgba(0,255,136,0.12)" : "rgba(108,99,255,0.12)",
                        color: food.source === "USDA" ? "var(--accent-green)" : "var(--accent-purple)",
                        border: `1px solid ${food.source === "USDA" ? "rgba(0,255,136,0.25)" : "rgba(108,99,255,0.25)"}`,
                      }}>
                        {food.source === "USDA" ? "🌾 USDA" : "🤖 AI"}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 10 }}>
                      Portion: {food.estimatedPortion}
                      {food.usdaName && food.usdaName !== food.name && (
                        <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>• DB: {food.usdaName.slice(0, 40)}</span>
                      )}
                    </p>
                    {/* Macros row */}
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {[
                        { icon: <Flame size={12} />, label: "kcal", value: food.calories, color: macroColor.cal },
                        { icon: <Beef size={12} />, label: "protein", value: `${food.protein_g}g`, color: macroColor.protein },
                        { icon: <Wheat size={12} />, label: "carbs", value: `${food.carbs_g}g`, color: macroColor.carbs },
                        { icon: <Droplets size={12} />, label: "fat", value: `${food.fat_g}g`, color: macroColor.fat },
                      ].map(m => (
                        <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: m.color }}>{m.icon}</span>
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: m.color }}>{m.value}</span>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Log button */}
                  <button
                    onClick={() => handleLog(food)}
                    disabled={isLogged}
                    style={{
                      padding: "8px 14px", borderRadius: 10, border: "none", cursor: isLogged ? "default" : "pointer",
                      background: isLogged ? "rgba(0,255,136,0.12)" : "var(--gradient-primary)",
                      color: isLogged ? "var(--accent-green)" : "#fff",
                      fontWeight: 700, fontSize: "0.78rem",
                      display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    {isLogged ? <><CheckCircle size={14} /> Logged</> : <><Plus size={14} /> Log to {selectedMeal}</>}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Total summary */}
          {results.length > 1 && (
            <div style={{
              background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
              borderRadius: 12, padding: "12px 16px",
              display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center",
            }}>
              <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--accent-purple)" }}>📊 Meal Total:</span>
              {[
                { label: "kcal", value: results.reduce((s, r) => s + r.calories, 0), color: macroColor.cal },
                { label: "protein", value: `${results.reduce((s, r) => s + r.protein_g, 0).toFixed(1)}g`, color: macroColor.protein },
                { label: "carbs", value: `${results.reduce((s, r) => s + r.carbs_g, 0).toFixed(1)}g`, color: macroColor.carbs },
                { label: "fat", value: `${results.reduce((s, r) => s + r.fat_g, 0).toFixed(1)}g`, color: macroColor.fat },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: m.color }}>{m.value}</span>
                  <span style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(-60px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
