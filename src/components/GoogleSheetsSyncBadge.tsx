"use client";
import { useState, useEffect } from "react";
import { Table, CheckCircle2, ExternalLink, Download, RefreshCw, FileSpreadsheet, Sparkles, X, ChevronRight } from "lucide-react";
import { GoogleSheetsService } from "@/lib/googleSheetsService";

export function GoogleSheetsSyncBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("Just now");
  const [activeTab, setActiveTab] = useState<"workouts" | "nutrition" | "diet">("workouts");
  const [workouts, setWorkouts] = useState(GoogleSheetsService.getWorkouts());
  const [nutrition, setNutrition] = useState(GoogleSheetsService.getNutrition());
  const [dietPlans, setDietPlans] = useState(GoogleSheetsService.getDietPlans());

  useEffect(() => {
    setWorkouts(GoogleSheetsService.getWorkouts());
    setNutrition(GoogleSheetsService.getNutrition());
    setDietPlans(GoogleSheetsService.getDietPlans());
  }, [isOpen]);

  const handleSyncNow = async () => {
    setSyncing(true);
    await GoogleSheetsService.triggerCloudSync();
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 600);
  };

  const handleDownloadExcel = () => {
    GoogleSheetsService.downloadExcelSpreadsheet(activeTab);
  };

  return (
    <>
      {/* ── Topbar Badge Trigger ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 20,
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34D399",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        title="Google Sheets & Excel Cloud Sync"
      >
        <FileSpreadsheet size={14} style={{ color: "#10B981" }} />
        <span className="hide-mobile">Google Sheets</span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
      </button>

      {/* ── Google Sheets Sync & Excel Export Modal ── */}
      {isOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div className="liquid-glass-card animate-fade" style={{
            width: "100%", maxWidth: 850, maxHeight: "90vh",
            background: "#0D0E15", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 16px rgba(16,185,129,0.4)"
                }}>
                  <FileSpreadsheet size={22} color="#FFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    Google Sheets &amp; Excel Sync
                    <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 20, background: "rgba(16,185,129,0.2)", color: "#34D399", border: "1px solid rgba(16,185,129,0.4)" }}>
                      Live Active
                    </span>
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    Spreadsheet: <strong style={{ color: "#FFF" }}>TrainIQ - Fitness &amp; Health Log</strong> &bull; Last sync: {lastSync}
                  </p>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Actions Bar */}
            <div style={{
              padding: "12px 24px", background: "rgba(0,0,0,0.2)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)"
            }}>
              {/* Spreadsheet Tabs */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setActiveTab("workouts")}
                  className={`btn btn-sm ${activeTab === "workouts" ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: 8, fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  🏋️ Workouts_Log ({workouts.length})
                </button>
                <button
                  onClick={() => setActiveTab("nutrition")}
                  className={`btn btn-sm ${activeTab === "nutrition" ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: 8, fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  🥗 Nutrition_Log ({nutrition.length})
                </button>
                <button
                  onClick={() => setActiveTab("diet")}
                  className={`btn btn-sm ${activeTab === "diet" ? "btn-primary" : "btn-secondary"}`}
                  style={{ borderRadius: 8, fontSize: "0.8rem", padding: "6px 12px" }}
                >
                  🤖 AI_Diet_Plans ({dietPlans.length})
                </button>
              </div>

              {/* Sync / Export Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleSyncNow}
                  disabled={syncing}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 8, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <RefreshCw size={14} className={syncing ? "spin" : ""} />
                  {syncing ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: 8, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6, color: "#34D399" }}
                  title="Download offline CSV / Excel Spreadsheet"
                >
                  <Download size={14} />
                  Download Excel (.csv)
                </button>
                <a
                  href="https://docs.google.com/spreadsheets"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 8, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #10B981, #059669)" }}
                >
                  <ExternalLink size={14} />
                  Open Google Sheet ↗
                </a>
              </div>
            </div>

            {/* Table Preview */}
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {activeTab === "workouts" && (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "10px 12px" }}>Date</th>
                      <th style={{ padding: "10px 12px" }}>Workout</th>
                      <th style={{ padding: "10px 12px" }}>Exercise</th>
                      <th style={{ padding: "10px 12px" }}>Sets</th>
                      <th style={{ padding: "10px 12px" }}>Reps</th>
                      <th style={{ padding: "10px 12px" }}>Weight (kg)</th>
                      <th style={{ padding: "10px 12px" }}>Volume (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((w, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                        <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{w.date}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{w.workoutName}</td>
                        <td style={{ padding: "10px 12px", color: "#A78BFA" }}>{w.exerciseName}</td>
                        <td style={{ padding: "10px 12px" }}>{w.sets}</td>
                        <td style={{ padding: "10px 12px" }}>{w.reps}</td>
                        <td style={{ padding: "10px 12px" }}>{w.weightKg} kg</td>
                        <td style={{ padding: "10px 12px", color: "#34D399", fontWeight: 700 }}>{w.totalVolumeKg} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "nutrition" && (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "10px 12px" }}>Date</th>
                      <th style={{ padding: "10px 12px" }}>Meal</th>
                      <th style={{ padding: "10px 12px" }}>Food Item</th>
                      <th style={{ padding: "10px 12px" }}>Calories</th>
                      <th style={{ padding: "10px 12px" }}>Protein</th>
                      <th style={{ padding: "10px 12px" }}>Carbs</th>
                      <th style={{ padding: "10px 12px" }}>Fats</th>
                      <th style={{ padding: "10px 12px" }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrition.map((n, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                        <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>{n.date}</td>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{n.mealType}</td>
                        <td style={{ padding: "10px 12px" }}>{n.foodItem}</td>
                        <td style={{ padding: "10px 12px", color: "#FBBF24", fontWeight: 700 }}>{n.calories} kcal</td>
                        <td style={{ padding: "10px 12px", color: "#34D399" }}>{n.proteinG}g</td>
                        <td style={{ padding: "10px 12px", color: "#60A5FA" }}>{n.carbsG}g</td>
                        <td style={{ padding: "10px 12px", color: "#F472B6" }}>{n.fatsG}g</td>
                        <td style={{ padding: "10px 12px", fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "diet" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {dietPlans.map((d, idx) => (
                    <div key={idx} style={{
                      padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, color: "#A78BFA" }}>🎯 Goal: {d.goal}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{d.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: "0.85rem" }}>
                        <span>🔥 <strong>{d.dailyCalories}</strong> kcal/day</span>
                        <span style={{ color: "#34D399" }}>🍗 Protein: <strong>{d.proteinTargetG}g</strong></span>
                        <span style={{ color: "#60A5FA" }}>🍚 Carbs: <strong>{d.carbsTargetG}g</strong></span>
                        <span style={{ color: "#F472B6" }}>🥑 Fats: <strong>{d.fatsTargetG}g</strong></span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 8 }}>
                        <strong>Meal Breakdown:</strong> {d.mealBreakdown}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        <strong>Regional Staples:</strong> {d.regionalFoods}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: "0.8rem", color: "var(--text-muted)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Auto-sync triggers automatically every time you log an exercise set, food scan, or AI diet plan.</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
