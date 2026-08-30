"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X, ArrowRight, Dumbbell, Utensils, Bot, TrendingUp, Zap, HelpCircle } from "lucide-react";
import { DEMO_EXERCISES, DEMO_FOODS } from "@/lib/constants";
import { VoiceSystem } from "@/lib/voiceSystem";

interface SearchResultItem {
  id: string;
  title: string;
  category: "Workout" | "Nutrition" | "AI Coach" | "Analytics" | "Community";
  snippet: string;
  whyItFits: string;
  url: string;
  actionLabel: string;
  icon: React.ReactNode;
}

export function SmartSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const router = useRouter();

  // Handle ESC and Ctrl+K keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Toggle
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Natural Language Semantic Matcher Engine
  useEffect(() => {
    if (!query.trim()) {
      // Default top suggestions when empty
      setResults([
        {
          id: "def-1",
          title: "AI Body & Diet Plan Generator",
          category: "AI Coach",
          snippet: "Upload height, weight, country, and optional photo vector for a complete 360 plan.",
          whyItFits: "Popular starter tool for custom macro targets and local country diets.",
          url: "/ai-coach",
          actionLabel: "Launch Assessment →",
          icon: <Bot size={18} className="text-purple" />,
        },
        {
          id: "def-2",
          title: "Economy ($) Budget Foods Sector",
          category: "Nutrition",
          snippet: "High-protein, low-cost staples like eggs, oats, lentils, and canned tuna.",
          whyItFits: "Best for users looking for high ROI nutrition on a budget.",
          url: "/nutrition",
          actionLabel: "View Budget Sector →",
          icon: <Utensils size={18} className="text-green" />,
        },
        {
          id: "def-3",
          title: "Push / Pull / Legs Gym Split",
          category: "Workout",
          snippet: "6-day hyper-targeted hypertrophic split with full form guides.",
          whyItFits: "Most popular muscle building workout routine.",
          url: "/workouts",
          actionLabel: "View Routine →",
          icon: <Dumbbell size={18} className="text-cyan" />,
        },
      ]);
      return;
    }

    const q = query.toLowerCase();
    const matched: SearchResultItem[] = [];

    // Match Exercises
    DEMO_EXERCISES.forEach((ex) => {
      if (
        ex.name.toLowerCase().includes(q) ||
        ex.muscle_group.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q)
      ) {
        matched.push({
          id: `ex-${ex.id}`,
          title: ex.name,
          category: "Workout",
          snippet: `${ex.muscle_group} exercise · ${ex.equipment} · Difficulty: ${ex.difficulty}`,
          whyItFits: `Directly targets ${ex.muscle_group} using ${ex.equipment}. Includes step-by-step form guide.`,
          url: "/workouts",
          actionLabel: "View Form Guide →",
          icon: <Dumbbell size={18} style={{ color: "var(--accent-cyan)" }} />,
        });
      }
    });

    // Match Foods
    DEMO_FOODS.forEach((food) => {
      if (
        food.name.toLowerCase().includes(q) ||
        food.category?.toLowerCase().includes(q) ||
        (q.includes("protein") && (food.protein_g || 0) > 15) ||
        (q.includes("cheap") && food.budget_tier === "economy")
      ) {
        matched.push({
          id: `food-${food.id}`,
          title: food.name,
          category: "Nutrition",
          snippet: `${food.calories} cal · P: ${food.protein_g}g · C: ${food.carbs_g}g · ${food.price_est} / serv`,
          whyItFits: `Fits query criteria with ${food.protein_g}g protein in the ${food.budget_tier || 'standard'} budget sector.`,
          url: "/nutrition",
          actionLabel: "Log Meal →",
          icon: <Utensils size={18} style={{ color: "var(--accent-green)" }} />,
        });
      }
    });

    // Match General Concepts
    if (q.includes("coach") || q.includes("ai") || q.includes("photo") || q.includes("country")) {
      matched.push({
        id: "ai-coach-custom",
        title: "AI Coach & Voice Assistant",
        category: "AI Coach",
        snippet: "Ask questions, talk with voice dictation, or run body assessment.",
        whyItFits: "Matches query for AI guidance and personalized coaching.",
        url: "/ai-coach",
        actionLabel: "Ask AI Coach →",
        icon: <Bot size={18} style={{ color: "var(--accent-purple)" }} />,
      });
    }

    setResults(matched.slice(0, 5));
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141424", // Solid opaque dark background (NO TEXT BLEED-THROUGH)
          border: "1px solid rgba(108, 99, 255, 0.4)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 640,
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(108, 99, 255, 0.3)",
          overflow: "hidden",
        }}
      >
        {/* Search Bar Input */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border-color)", gap: 12 }}>
          <Sparkles size={20} style={{ color: "var(--accent-purple)" }} />
          <input
            autoFocus
            className="input"
            placeholder="Search by intent, e.g. 'cheap high protein meals' or 'chest workout'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, border: "none", background: "none", fontSize: "1rem", color: "#fff", outline: "none" }}
          />
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ padding: 16, maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
            <span>{query ? `Semantic AI Matches (${results.length})` : "Suggested Quick Features"}</span>
            <span>Esc to close</span>
          </div>

          {results.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No semantic matches found for &quot;{query}&quot;. Try asking about workouts, meals, or AI coaching.
            </div>
          ) : (
            results.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r.url)}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-purple)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {r.icon}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>{r.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.snippet}</div>
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>{r.category}</span>
                </div>

                <div style={{ marginTop: 8, background: "rgba(108, 99, 255, 0.08)", border: "1px solid rgba(108, 99, 255, 0.2)", borderRadius: 8, padding: "8px 12px", fontSize: "0.75rem", color: "var(--accent-purple)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span><strong>Why it fits:</strong> {r.whyItFits}</span>
                  <span style={{ fontWeight: 700, color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8 }}>
                    {r.actionLabel}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
