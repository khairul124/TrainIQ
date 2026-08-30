"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Barcode, Camera, CameraOff, Search, CheckCircle, AlertCircle,
  Flame, Beef, Wheat, Droplets, Plus, Package, Loader2, X, RefreshCw
} from "lucide-react";

interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  image?: string;
  serving_size: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  ingredients?: string;
  nutriScore?: string;
}

interface Props {
  onLogFood: (food: {
    name: string; calories: number; protein: number;
    carbs: number; fat: number; mealType: "breakfast" | "lunch" | "dinner" | "snack";
  }) => void;
}

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type ScanMode = "camera" | "manual";

async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const resp = await fetch(
      `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
      { headers: { "User-Agent": "TrainIQ-App/1.0 (fitness-web-app)" } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.status !== "success" || !data.product) return null;
    const p = data.product;
    const n = p.nutriments || {};
    return {
      barcode,
      name: p.product_name || p.product_name_en || "Unknown Product",
      brand: p.brands || "",
      image: p.image_front_small_url || p.image_url,
      serving_size: p.serving_size || "100g",
      calories:   Math.round(n["energy-kcal_serving"] || n["energy-kcal_100g"] || 0),
      protein_g:  Math.round((n["proteins_serving"]   || n["proteins_100g"]   || 0) * 10) / 10,
      carbs_g:    Math.round((n["carbohydrates_serving"] || n["carbohydrates_100g"] || 0) * 10) / 10,
      fat_g:      Math.round((n["fat_serving"]         || n["fat_100g"]         || 0) * 10) / 10,
      fiber_g:    Math.round((n["fiber_serving"]        || n["fiber_100g"]       || 0) * 10) / 10,
      ingredients: p.ingredients_text?.slice(0, 200),
      nutriScore: p.nutriscore_grade?.toUpperCase(),
    };
  } catch { return null; }
}

const NUTRISCORE_COLOR: Record<string, string> = {
  A: "#00C853", B: "#64DD17", C: "#FFD600", D: "#FF6D00", E: "#D50000"
};

export function BarcodeScanner({ onLogFood }: Props) {
  const [mode, setMode] = useState<ScanMode>("manual");
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<BarcodeProduct | null>(null);
  const [error, setError] = useState("");
  const [logged, setLogged] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("lunch");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setCameraError("");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Try native BarcodeDetector
      if ("BarcodeDetector" in window) {
        const detector = new (window as any).BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"]
        });
        scanIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              stopCamera();
              handleLookup(barcodes[0].rawValue);
            }
          } catch {}
        }, 500);
      } else {
        setCameraError("Native barcode detection not supported in this browser. Use manual entry below.");
        stopCamera();
      }
    } catch (err: any) {
      setCameraError("Camera access denied or unavailable. Please use manual barcode entry.");
    }
  };

  const handleLookup = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setProduct(null);
    setLogged(false);
    try {
      const result = await lookupBarcode(trimmed);
      if (!result) {
        setError(`No product found for barcode "${trimmed}". Try scanning again or enter manually.`);
      } else {
        setProduct(result);
      }
    } catch {
      setError("Lookup failed. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(manualCode);
  };

  const handleLog = () => {
    if (!product) return;
    onLogFood({
      name: `${product.brand ? product.brand + " - " : ""}${product.name}`,
      calories: product.calories, protein: product.protein_g,
      carbs: product.carbs_g, fat: product.fat_g, mealType: selectedMeal,
    });
    setLogged(true);
  };

  const macroColor = { cal: "#FF6B6B", protein: "#6C63FF", carbs: "#FFB347", fat: "#00D9FF" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── Mode Tabs ── */}
      <div style={{ display: "flex", gap: 4, background: "#1A1A2E", borderRadius: 10, padding: 4, maxWidth: 340 }}>
        {([["camera", "📷 Camera Scan"], ["manual", "⌨️ Manual Entry"]] as [ScanMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); if (m !== "camera") stopCamera(); }}
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: mode === m ? "var(--gradient-primary)" : "transparent",
              color: mode === m ? "#fff" : "var(--text-secondary)",
              fontWeight: 600, fontSize: "0.82rem", transition: "all 0.2s",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Camera Mode ── */}
      {mode === "camera" && (
        <div style={{ borderRadius: 14, overflow: "hidden", background: "#0D0D1A", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position: "relative", minHeight: 220 }}>
            <video ref={videoRef} style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: cameraActive ? "block" : "none" }} muted playsInline />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {!cameraActive && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, gap: 14 }}>
                <Camera size={40} style={{ color: "var(--text-muted)" }} />
                <p style={{ color: "var(--text-secondary)", textAlign: "center", fontSize: "0.87rem" }}>
                  Point your camera at a barcode<br/>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Works best in Chrome / Edge</span>
                </p>
                <button onClick={startCamera} style={{
                  padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "var(--gradient-primary)", color: "#fff", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Camera size={16} /> Start Camera
                </button>
              </div>
            )}
            {cameraActive && (
              <>
                {/* Scan frame overlay */}
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none"
                }}>
                  <div style={{
                    width: 220, height: 100, border: "2px solid rgba(108,99,255,0.8)",
                    borderRadius: 8, boxShadow: "0 0 0 2000px rgba(0,0,0,0.4)",
                    position: "relative",
                  }}>
                    <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: "3px solid #6C63FF", borderLeft: "3px solid #6C63FF", borderRadius: "4px 0 0 0" }} />
                    <div style={{ position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTop: "3px solid #6C63FF", borderRight: "3px solid #6C63FF", borderRadius: "0 4px 0 0" }} />
                    <div style={{ position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottom: "3px solid #6C63FF", borderLeft: "3px solid #6C63FF", borderRadius: "0 0 0 4px" }} />
                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: "3px solid #6C63FF", borderRight: "3px solid #6C63FF", borderRadius: "0 0 4px 0" }} />
                    {/* Scan line */}
                    <div style={{ position: "absolute", left: 4, right: 4, height: 2, background: "var(--gradient-primary)", boxShadow: "0 0 8px rgba(108,99,255,0.8)", animation: "barcodeScan 1.8s ease-in-out infinite" }} />
                  </div>
                </div>
                <button onClick={stopCamera} style={{
                  position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <X size={16} />
                </button>
              </>
            )}
          </div>
          {cameraError && (
            <div style={{ padding: "10px 14px", background: "rgba(255,107,107,0.1)", borderTop: "1px solid rgba(255,107,107,0.2)", color: "var(--accent-red)", fontSize: "0.8rem", display: "flex", gap: 8, alignItems: "center" }}>
              <AlertCircle size={14} /> {cameraError}
            </div>
          )}
        </div>
      )}

      {/* ── Manual Entry ── */}
      {mode === "manual" && (
        <form onSubmit={handleManualSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            className="input" value={manualCode} onChange={e => setManualCode(e.target.value)}
            placeholder="Enter UPC/EAN barcode (e.g. 3017620422003)"
            style={{ flex: 1, fontFamily: "monospace", letterSpacing: 1 }}
          />
          <button type="submit" disabled={loading || !manualCode.trim()} style={{
            padding: "10px 18px", borderRadius: 10, border: "none",
            background: "var(--gradient-primary)", color: "#fff",
            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            opacity: (!manualCode.trim() || loading) ? 0.6 : 1,
          }}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={16} />}
            Lookup
          </button>
        </form>
      )}

      {/* ── Example barcodes ── */}
      {mode === "manual" && !product && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", alignSelf: "center" }}>Try:</span>
          {[
            { label: "Nutella", code: "3017620422003" },
            { label: "Coca-Cola", code: "5000112602999" },
            { label: "Heinz Ketchup", code: "0013000006408" },
          ].map(ex => (
            <button key={ex.code} onClick={() => { setManualCode(ex.code); handleLookup(ex.code); }}
              style={{
                fontSize: "0.73rem", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "var(--text-secondary)", cursor: "pointer",
              }}>
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 12 }}>
          <Loader2 size={16} style={{ color: "var(--accent-purple)", animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: "0.87rem", color: "var(--text-secondary)" }}>Looking up product in Open Food Facts database…</span>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, color: "var(--accent-red)", fontSize: "0.87rem" }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => { setError(""); setManualCode(""); setProduct(null); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      {/* ── Product Result ── */}
      {product && (
        <div style={{ background: "#1A1A2E", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, overflow: "hidden" }}>
          {/* Product header */}
          <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
            {product.image && (
              <img src={product.image} alt={product.name} style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 10, background: "#fff", padding: 4 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: "1rem" }}>{product.name}</span>
                {product.nutriScore && (
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 800, padding: "2px 10px", borderRadius: 20,
                    background: NUTRISCORE_COLOR[product.nutriScore] || "#555",
                    color: "#fff",
                  }}>
                    Nutri-Score {product.nutriScore}
                  </span>
                )}
              </div>
              {product.brand && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{product.brand}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Barcode size={12} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{product.barcode}</span>
                <span style={{ fontSize: "0.7rem", background: "rgba(0,217,255,0.1)", border: "1px solid rgba(0,217,255,0.2)", borderRadius: 20, padding: "1px 8px", color: "var(--accent-cyan)" }}>Open Food Facts</span>
              </div>
            </div>
          </div>

          {/* Nutrition facts */}
          <div style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 10 }}>Per serving: {product.serving_size}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              {[
                { icon: <Flame size={14} />, label: "Calories", value: `${product.calories} kcal`, color: macroColor.cal },
                { icon: <Beef size={14} />, label: "Protein", value: `${product.protein_g}g`, color: macroColor.protein },
                { icon: <Wheat size={14} />, label: "Carbs", value: `${product.carbs_g}g`, color: macroColor.carbs },
                { icon: <Droplets size={14} />, label: "Fat", value: `${product.fat_g}g`, color: macroColor.fat },
              ].map(m => (
                <div key={m.label} style={{
                  flex: 1, minWidth: 80, padding: "10px 12px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: "0.95rem", color: m.color }}>{m.value}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Meal selector + log button */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4, background: "#0D0D1A", borderRadius: 8, padding: 3 }}>
                {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map(m => (
                  <button key={m} onClick={() => setSelectedMeal(m)} style={{
                    padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: selectedMeal === m ? "var(--gradient-primary)" : "transparent",
                    color: selectedMeal === m ? "#fff" : "var(--text-muted)",
                    fontSize: "0.74rem", fontWeight: 600, textTransform: "capitalize", transition: "all 0.2s",
                  }}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={handleLog} disabled={logged} style={{
                flex: 1, minWidth: 140, padding: "10px 16px", borderRadius: 10, border: "none",
                background: logged ? "rgba(0,255,136,0.12)" : "var(--gradient-primary)",
                color: logged ? "var(--accent-green)" : "#fff",
                fontWeight: 700, fontSize: "0.85rem", cursor: logged ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {logged ? <><CheckCircle size={15} /> Added to {selectedMeal}</> : <><Plus size={15} /> Log to {selectedMeal}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes barcodeScan {
          0%   { top: 4px; } 50%  { top: calc(100% - 6px); } 100% { top: 4px; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
