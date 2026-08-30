"use client";
import { useState, useEffect, useCallback } from "react";
import { MousePointer, Sparkles, X, HelpCircle, ArrowRight, Zap } from "lucide-react";
import { VoiceSystem } from "@/lib/voiceSystem";

interface ContextualHelp {
  title: string;
  explanation: string;
  tip: string;
  actionLabel?: string;
  actionUrl?: string;
}

// Preset contextual dictionary for hover elements
const CONTEXT_HELP: Record<string, ContextualHelp> = {
  "stat-card": {
    title: "Fitness Metric Card",
    explanation: "Tracks your real-time weekly progress, calories, streak, or body weight trend.",
    tip: "Hover or click to dive deeper into history charts under Progress.",
    actionLabel: "View Progress Charts →",
    actionUrl: "/progress",
  },
  "sidebar-link": {
    title: "Module Navigation",
    explanation: "Switches between core TrainIQ engines: Workouts, Nutrition, Progress, AI Coach, Community, and Profile.",
    tip: "Use keyboard shortcuts or Alt+M anytime to trigger AI Magic Mouse.",
  },
  "topbar-search": {
    title: "AI Smart Search",
    explanation: "Natural language search engine powered by semantic vector matching.",
    tip: "Type things like 'cheap protein' or 'home chest workout' to get AI-guided results.",
    actionLabel: "Press Ctrl + K to Open",
  },
  "btn-primary": {
    title: "Primary Quick Action",
    explanation: "Launches major workflows like starting a workout, logging meals, or running AI assessment.",
    tip: "Pro Tip: Voice dictation is available on all primary inputs!",
  },
  "feature-card": {
    title: "Fitness Engine Module",
    explanation: "One of the 6 specialized AI modules powering your transformation.",
    tip: "Click to launch this module directly.",
  },
  "challenge-card": {
    title: "Community Challenge",
    explanation: "Group goal with live progress tracking and community badges.",
    tip: "Join to boost your consistency score on the global leaderboard!",
    actionLabel: "Go to Community →",
    actionUrl: "/community",
  },
  "food-item": {
    title: "Food Database Entry",
    explanation: "Includes calories, macros (Protein/Carbs/Fat), budget tier ($/$$/$$$), and estimated cost.",
    tip: "Click + to log this food to your daily tracker.",
  },
};

export function MagicMouse() {
  const [enabled, setEnabled] = useState(true);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [activeHelp, setActiveHelp] = useState<ContextualHelp | null>(null);
  const [visibleHelp, setVisibleHelp] = useState<ContextualHelp | null>(null);
  const [targetName, setTargetName] = useState<string>("");
  const [minimized, setMinimized] = useState(false);
  const [showDelayTimer, setShowDelayTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Track mouse movement and find closest data-ai-help or class match
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (!elem) return;

    // If hovering over the tooltip panel itself, keep it visible but don't block
    if (elem.closest(".magic-mouse-panel")) return;

    // Check for custom attribute first
    const customHelp = elem.getAttribute("data-ai-help");
    const customTitle = elem.getAttribute("data-ai-title");
    if (customHelp) {
      const newHelp: ContextualHelp = {
        title: customTitle || "AI Element Assistant",
        explanation: customHelp,
        tip: "Magic Mouse context active based on your cursor location.",
      };
      setActiveHelp(newHelp);
      setTargetName(elem.tagName.toLowerCase());
      return;
    }

    // Check class names
    let matchedKey: string | null = null;
    for (const key of Object.keys(CONTEXT_HELP)) {
      if (elem.classList.contains(key) || elem.closest(`.${key}`)) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      setActiveHelp(CONTEXT_HELP[matchedKey]);
      setTargetName(matchedKey);
    } else {
      setActiveHelp(null);
    }
  }, []);

  // Debounce showing the tooltip so quick hovers/clicks aren't blocked
  useEffect(() => {
    if (showDelayTimer) clearTimeout(showDelayTimer);
    if (activeHelp) {
      const timer = setTimeout(() => setVisibleHelp(activeHelp), 400);
      setShowDelayTimer(timer);
    } else {
      setVisibleHelp(null);
    }
    return () => { if (showDelayTimer) clearTimeout(showDelayTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHelp]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, handleMouseMove]);

  // Hide tooltip on any click so it never blocks interaction
  useEffect(() => {
    const handleClick = () => {
      setVisibleHelp(null);
      setActiveHelp(null);
    };
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Small Floating Cursor Companion Indicator — pointer-events: none so clicks pass through */}
      {visibleHelp && !minimized && (
        <div
          style={{
            position: "fixed",
            left: Math.min(pos.x + 18, typeof window !== "undefined" ? window.innerWidth - 320 : 600),
            top: Math.min(pos.y + 18, typeof window !== "undefined" ? window.innerHeight - 240 : 400),
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="animate-fade magic-mouse-panel"
        >
          <div
            style={{
              background: "rgba(18, 18, 28, 0.95)",
              border: "1px solid rgba(108, 99, 255, 0.4)",
              borderRadius: 16,
              padding: "14px 18px",
              width: 280,
              boxShadow: "0 10px 40px rgba(108, 99, 255, 0.25), 0 4px 12px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
              color: "var(--text-primary)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-purple)", fontWeight: 700, fontSize: "0.82rem" }}>
                <Sparkles size={14} className="animate-pulse" />
                <span>Magic Mouse AI</span>
              </div>
              <div style={{ display: "flex", gap: 4, pointerEvents: "auto" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); VoiceSystem.speak(`${visibleHelp.title}. ${visibleHelp.explanation}`); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.7rem" }}
                  title="Read Aloud"
                >
                  🔊
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setVisibleHelp(null); setActiveHelp(null); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4, color: "#fff" }}>
              {visibleHelp.title}
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4, margin: "0 0 8px 0" }}>
              {visibleHelp.explanation}
            </p>
            <div style={{ fontSize: "0.72rem", color: "var(--accent-green)", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", padding: "6px 8px", borderRadius: 8 }}>
              💡 {visibleHelp.tip}
            </div>

            {visibleHelp.actionUrl && (
              <a
                href={visibleHelp.actionUrl}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 8,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--accent-cyan)",
                  textDecoration: "none",
                  pointerEvents: "auto",
                }}
              >
                {visibleHelp.actionLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
