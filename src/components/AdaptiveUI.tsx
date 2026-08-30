"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { Zap, Flame, Dumbbell, DollarSign, Home, ChevronDown, Check } from "lucide-react";

export type UIIntentMode = "balanced" | "fat_loss" | "powerlifting" | "budget_prep" | "home_express";

interface IntentProfile {
  id: UIIntentMode;
  name: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
  primaryAction: { label: string; href: string };
  recommendedMealTier: "economy" | "standard" | "premium";
  focusTag: string;
}

export const INTENT_PROFILES: Record<UIIntentMode, IntentProfile> = {
  balanced: {
    id: "balanced",
    name: "Balanced Fitness",
    badge: "⚖️ Standard Mode",
    icon: "⚡",
    color: "#6C63FF",
    description: "Default balanced view for overall health, strength & moderate nutrition tracking.",
    primaryAction: { label: "Start Workout", href: "/workouts" },
    recommendedMealTier: "standard",
    focusTag: "General Fitness",
  },
  fat_loss: {
    id: "fat_loss",
    name: "Fat Loss Shred",
    badge: "🔥 Calorie Deficit Active",
    icon: "🔥",
    color: "#FF6B6B",
    description: "Adaptive layout prioritizing calorie burn, lean protein, and deficit tracking.",
    primaryAction: { label: "Log Deficit Meal", href: "/nutrition" },
    recommendedMealTier: "standard",
    focusTag: "High Calorie Burn",
  },
  powerlifting: {
    id: "powerlifting",
    name: "Heavy Powerlifter",
    badge: "💪 Strength & PR Focus",
    icon: "🏋️",
    color: "#FFB347",
    description: "Layout customized for max strength, 1RM records, and heavy barbell split routines.",
    primaryAction: { label: "View Barbell Splits", href: "/workouts" },
    recommendedMealTier: "premium",
    focusTag: "Progressive Overload",
  },
  budget_prep: {
    id: "budget_prep",
    name: "Budget Meal Prep",
    badge: "🟢 Economy Sector ($)",
    icon: "💲",
    color: "#00FF88",
    description: "UI shaped around high-nutrition, low-cost budget foods under $3-$5 per day.",
    primaryAction: { label: "Explore Budget Foods", href: "/nutrition" },
    recommendedMealTier: "economy",
    focusTag: "High ROI Nutrition",
  },
  home_express: {
    id: "home_express",
    name: "20-Min Home Express",
    badge: "🏠 No-Equipment Fast Track",
    icon: "⏱️",
    color: "#00D9FF",
    description: "Layout centered on zero-equipment bodyweight routines and quick workouts.",
    primaryAction: { label: "Start Home Routine", href: "/workouts" },
    recommendedMealTier: "standard",
    focusTag: "Time-Saving Workouts",
  },
};

interface AdaptiveContextType {
  activeIntent: UIIntentMode;
  setIntent: (mode: UIIntentMode) => void;
  profile: IntentProfile;
}

const AdaptiveContext = createContext<AdaptiveContextType>({
  activeIntent: "balanced",
  setIntent: () => {},
  profile: INTENT_PROFILES.balanced,
});

export const useAdaptiveUI = () => useContext(AdaptiveContext);

export function AdaptiveUIProvider({ children }: { children: React.ReactNode }) {
  const [activeIntent, setActiveIntent] = useState<UIIntentMode>("balanced");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fitnessgpt_ui_intent") as UIIntentMode;
    if (saved && INTENT_PROFILES[saved]) {
      setActiveIntent(saved);
    }
  }, []);

  const setIntent = (mode: UIIntentMode) => {
    setActiveIntent(mode);
    localStorage.setItem("fitnessgpt_ui_intent", mode);
  };

  return (
    <AdaptiveContext.Provider value={{ activeIntent, setIntent, profile: INTENT_PROFILES[activeIntent] }}>
      {children}
    </AdaptiveContext.Provider>
  );
}

export function AdaptiveUISwitcher() {
  const { activeIntent, setIntent, profile } = useAdaptiveUI();
  const [open, setOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".adaptive-ui-switcher")) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: "relative" }} className="adaptive-ui-switcher">
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 14px",
          borderRadius: 12,
          background: "rgba(108, 99, 255, 0.15)",
          border: `1px solid ${profile.color}66`,
          color: "var(--text-primary)",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{profile.icon}</span>
        <span>{profile.name}</span>
        <ChevronDown size={14} style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div
          className="animate-fade"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 300,
            background: "#161626", // Solid opaque dark background (NO TEXT BLEED-THROUGH)
            border: "1px solid rgba(108, 99, 255, 0.4)",
            borderRadius: 16,
            padding: 14,
            zIndex: 10000,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(108, 99, 255, 0.25)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-purple)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <span>✨ Adaptive UI Modes</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(Object.keys(INTENT_PROFILES) as UIIntentMode[]).map((key) => {
              const item = INTENT_PROFILES[key];
              const isSelected = activeIntent === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setIntent(key);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: isSelected ? "rgba(108, 99, 255, 0.22)" : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isSelected ? item.color : "rgba(255, 255, 255, 0.06)"}`,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: "#fff",
                  }}
                >
                  <span style={{ fontSize: "1.2rem", marginTop: 2 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: isSelected ? item.color : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {item.name}
                      {isSelected && <Check size={14} style={{ color: item.color }} />}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.35 }}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
