"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowLeft, Clock, Flame, Dumbbell, ChevronRight,
  ChevronDown, ChevronUp, Zap, Target, Info, X,
  BookOpen, CheckCircle2, AlertCircle, Star, Volume2,
} from "lucide-react";
import {
  LOCATIONS, GYM_SPLIT_TYPES, EQUIPMENT_FILTERS,
  HOME_WORKOUTS, OUTDOOR_WORKOUTS, GYM_WORKOUT_DATA,
  WorkoutRoutine, WorkoutExercise, getFormImage,
} from "@/lib/workoutData";
import { VoiceReadButton } from "@/components/VoiceButton";
import { VoiceSystem } from "@/lib/voiceSystem";
import { CustomWorkoutBuilder } from "@/components/CustomWorkoutBuilder";

/* ─────────────────────────────────────────
   Design tokens
───────────────────────────────────────── */
const muscleColor: Record<string, { bg: string; border: string; text: string }> = {
  Chest:      { bg: "rgba(108,99,255,.15)", border: "rgba(108,99,255,.35)", text: "#6C63FF" },
  Back:       { bg: "rgba(0,217,255,.15)",  border: "rgba(0,217,255,.35)",  text: "#00D9FF" },
  Shoulders:  { bg: "rgba(255,179,71,.15)", border: "rgba(255,179,71,.35)", text: "#FFB347" },
  Biceps:     { bg: "rgba(0,255,136,.15)",  border: "rgba(0,255,136,.35)",  text: "#00FF88" },
  Triceps:    { bg: "rgba(255,107,107,.15)",border: "rgba(255,107,107,.35)",text: "#FF6B6B" },
  Legs:       { bg: "rgba(168,85,247,.15)", border: "rgba(168,85,247,.35)", text: "#A855F7" },
  Core:       { bg: "rgba(255,107,202,.15)",border: "rgba(255,107,202,.35)",text: "#FF6BCA" },
  Glutes:     { bg: "rgba(255,179,71,.15)", border: "rgba(255,179,71,.35)", text: "#FFB347" },
  Calves:     { bg: "rgba(0,217,255,.15)",  border: "rgba(0,217,255,.35)",  text: "#00D9FF" },
  "Full Body":{ bg: "rgba(108,99,255,.15)", border: "rgba(108,99,255,.35)", text: "#6C63FF" },
};
const mc = (g: string) => muscleColor[g] ?? muscleColor.Chest;

const diffStyle: Record<string, { bg: string; text: string; label: string }> = {
  beginner:     { bg: "rgba(0,255,136,.12)",    text: "#00FF88", label: "Beginner"     },
  intermediate: { bg: "rgba(108,99,255,.12)",   text: "#6C63FF", label: "Intermediate" },
  advanced:     { bg: "rgba(255,107,107,.12)",  text: "#FF6B6B", label: "Advanced"     },
};
const ds = (d: string) => diffStyle[d] ?? diffStyle.intermediate;

/* ─────────────────────────────────────────
   FORM GUIDE MODAL
───────────────────────────────────────── */
interface FormModalProps { ex: WorkoutExercise; onClose: () => void; }

function FormModal({ ex, onClose }: FormModalProps) {
  const formImg = getFormImage(ex.name);
  const muscle  = mc(ex.muscleGroup);
  const diff    = ds(ex.difficulty);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,.75)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn .25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 760,
          maxHeight: "90vh", overflowY: "auto",
          background: "var(--bg-secondary)",
          border: `1px solid ${muscle.border}`,
          borderRadius: 24,
          boxShadow: `0 0 60px ${muscle.bg}, 0 24px 60px rgba(0,0,0,.5)`,
          animation: "slideIn .3s ease",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            position: "sticky", top: 0, zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 28px",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 48, height: 48, borderRadius: 14, fontSize: "1.6rem",
                background: muscle.bg, border: `1px solid ${muscle.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {ex.visual}
            </span>
            <div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: 4 }}>{ex.name}</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: muscle.bg, color: muscle.text }}>
                  {ex.muscleGroup}
                </span>
                <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: diff.bg, color: diff.text }}>
                  {diff.label}
                </span>
                <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: "rgba(255,179,71,.1)", color: "#FFB347" }}>
                  <Dumbbell size={11} style={{ display: "inline", marginRight: 4 }} />{ex.equipment}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              color: "var(--text-secondary)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "28px 28px 32px" }}>

          {/* ── Stats strip ── */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28,
            }}
          >
            {[
              { label: "Sets",      value: `${ex.sets}`,      icon: <CheckCircle2 size={18} />, color: "#6C63FF" },
              { label: "Reps",      value: ex.reps,            icon: <Zap size={18} />,          color: "#00FF88" },
              { label: "Rest",      value: `${ex.restSeconds}s`,icon: <Clock size={18} />,       color: "#FFB347" },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 14, padding: "16px 12px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: stat.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  {stat.icon}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Form Image ── */}
          {formImg ? (
            <div
              style={{
                position: "relative", width: "100%", borderRadius: 18, overflow: "hidden",
                border: `1px solid ${muscle.border}`,
                background: "rgba(0,0,0,.4)",
                marginBottom: 28, aspectRatio: "16/7",
                boxShadow: `0 0 40px ${muscle.bg}`,
              }}
            >
              <Image
                src={formImg}
                alt={`${ex.name} form guide`}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "40px 20px 16px",
                  background: "linear-gradient(to top, rgba(10,10,15,.9), transparent)",
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)",
                }}
              >
                <BookOpen size={14} /> Proper Form Guide
              </div>
            </div>
          ) : (
            /* Fallback illustrated banner when no photo */
            <div
              style={{
                width: "100%", borderRadius: 18, overflow: "hidden",
                border: `1px solid ${muscle.border}`,
                background: `linear-gradient(135deg, ${muscle.bg}, rgba(0,0,0,.3))`,
                marginBottom: 28, padding: "40px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                boxShadow: `0 0 40px ${muscle.bg}`,
              }}
            >
              <span style={{ fontSize: "5rem" }}>{ex.visual}</span>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: muscle.text }}>
                {ex.name}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Target: {ex.muscleGroup} · {ex.equipment}
              </div>
            </div>
          )}

          {/* ── Step-by-step instructions ── */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                fontWeight: 700, fontSize: "0.95rem", marginBottom: 16,
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Target size={18} style={{ color: muscle.text }} />
                Step-by-Step Instructions
              </div>
              <VoiceReadButton
                text={`${ex.name}. Here are the step by step instructions. ${ex.instructions.map((s, i) => `Step ${i+1}: ${s}`).join(". ")}. Pro tip: ${ex.tips}`}
                size="md"
                label="🔊 Read All Steps"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ex.instructions.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 18px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 12,
                    animation: `fadeIn .3s ease ${i * 80}ms both`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28, height: 28, borderRadius: 8,
                      background: muscle.bg, border: `1px solid ${muscle.border}`,
                      color: muscle.text, fontWeight: 800, fontSize: "0.82rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7, paddingTop: 2, flex: 1 }}>
                    {step}
                  </span>
                  <VoiceReadButton text={`Step ${i+1}: ${step}`} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Common mistakes ── */}
          <div
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "16px 20px",
              background: "rgba(255,179,71,.06)",
              border: "1px solid rgba(255,179,71,.2)",
              borderRadius: 14, marginBottom: 16,
            }}
          >
            <AlertCircle size={18} style={{ color: "#FFB347", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#FFB347", marginBottom: 4 }}>
                Common Mistake to Avoid
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {getCommonMistake(ex.name)}
              </div>
            </div>
          </div>

          {/* ── Pro tip ── */}
          <div
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "16px 20px",
              background: "rgba(0,255,136,.06)",
              border: "1px solid rgba(0,255,136,.2)",
              borderRadius: 14,
            }}
          >
            <Info size={18} style={{ color: "#00FF88", flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#00FF88", marginBottom: 4 }}>
                Coach&apos;s Pro Tip
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {ex.tips}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* common mistake lookup ──────────────────────────────────── */
function getCommonMistake(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("squat"))         return "Letting the knees cave inward or heels rise off the floor. Keep chest up and drive knees out.";
  if (n.includes("deadlift"))      return "Rounding the lower back under load. Always brace your core and maintain a neutral spine before pulling.";
  if (n.includes("bench") || n.includes("chest press")) return "Flaring elbows too wide (90°) which stresses shoulders. Tuck elbows to about 45-75°.";
  if (n.includes("curl"))          return "Swinging the torso to lift the weight. Keep your upper arms pinned to your sides throughout.";
  if (n.includes("row"))           return "Using momentum and jerking the weight up. Control every rep — squeeze the back on the way up.";
  if (n.includes("press") && n.includes("shoulder")) return "Arching the lower back excessively. Brace your core and keep your ribcage down.";
  if (n.includes("plank"))         return "Letting the hips sag or pike up. Your body should form a perfectly straight line from head to heels.";
  if (n.includes("lunge"))         return "Letting the front knee cave inward. Keep it tracking over your second toe throughout the movement.";
  if (n.includes("pull"))          return "Pulling with the arms instead of the back. Initiate by depressing your shoulder blades first.";
  if (n.includes("extension"))     return "Flaring the elbows outward. Keep elbows pointing forward and stationary throughout the movement.";
  return "Using too much weight too soon. Prioritise clean form over heavy loads — progressive overload works best with perfect technique.";
}

/* ─────────────────────────────────────────
   EXERCISE CARD (expandable row, opens modal)
───────────────────────────────────────── */
function ExerciseCard({
  ex, index, onOpenForm,
}: { ex: WorkoutExercise; index: number; onOpenForm: (e: WorkoutExercise) => void }) {
  const [open, setOpen] = useState(false);
  const muscle = mc(ex.muscleGroup);
  const diff   = ds(ex.difficulty);

  return (
    <div
      className="animate-fade"
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${open ? muscle.border : "var(--border-color)"}`,
        borderRadius: 16, overflow: "hidden",
        transition: "border-color .3s ease",
        animationDelay: `${index * 55}ms`,
        animationFillMode: "both",
      }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 18px", cursor: "pointer",
        }}
        onClick={() => setOpen(o => !o)}
      >
        <span
          style={{
            width: 44, height: 44, borderRadius: 12, fontSize: "1.3rem",
            background: muscle.bg, border: `1px solid ${muscle.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {ex.visual}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "0.93rem", marginBottom: 3 }}>{ex.name}</div>
          <div style={{ display: "flex", gap: 10, fontSize: "0.78rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
            <span>{ex.sets} sets × {ex.reps}</span>
            <span>· Rest {ex.restSeconds}s</span>
          </div>
        </div>

        {/* badges */}
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, background: muscle.bg, color: muscle.text, whiteSpace: "nowrap" }}>
          {ex.muscleGroup}
        </span>
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, background: diff.bg, color: diff.text, whiteSpace: "nowrap", textTransform: "capitalize" }}>
          {ex.difficulty}
        </span>
        {open ? <ChevronUp size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
               : <ChevronDown size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
      </div>

      {/* ── Expanded quick info ── */}
      {open && (
        <div
          style={{
            padding: "0 18px 18px",
            borderTop: "1px solid var(--border-color)",
            animation: "fadeIn .2s ease",
          }}
        >
          {/* equipment */}
          <div style={{ display: "flex", gap: 8, margin: "14px 0 12px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(255,179,71,.08)", color: "#FFB347", fontSize: "0.75rem", fontWeight: 600 }}>
              <Dumbbell size={12} /> {ex.equipment}
            </span>
          </div>

          {/* quick instructions preview */}
          <div style={{ marginBottom: 14 }}>
            {ex.instructions.slice(0, 2).map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: muscle.bg, color: muscle.text, fontSize: "0.72rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
            {ex.instructions.length > 2 && (
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", paddingLeft: 32 }}>
                +{ex.instructions.length - 2} more steps…
              </div>
            )}
          </div>

          {/* CTA — open full form guide */}
          <button
            onClick={e => { e.stopPropagation(); onOpenForm(ex); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 20px", borderRadius: 12,
              background: `linear-gradient(135deg, ${muscle.text}22, ${muscle.text}0a)`,
              border: `1px solid ${muscle.border}`,
              color: muscle.text, fontWeight: 700, fontSize: "0.85rem",
              cursor: "pointer", transition: "all .25s ease", width: "100%",
              justifyContent: "center",
            }}
          >
            <BookOpen size={16} />
            View Full Form Guide
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ROUTINE CARD
───────────────────────────────────────── */
function RoutineCard({
  routine, onOpenForm,
}: { routine: WorkoutRoutine; onOpenForm: (e: WorkoutExercise) => void }) {
  const [expanded, setExpanded] = useState(false);
  const diff = ds(routine.difficulty);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "24px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <h4 style={{ fontSize: "1.1rem" }}>{routine.name}</h4>
          <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, background: diff.bg, color: diff.text, textTransform: "capitalize" }}>
            {routine.difficulty}
          </span>
        </div>
        <p style={{ fontSize: "0.87rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
          {routine.description}
        </p>
        <div style={{ display: "flex", gap: 20, fontSize: "0.82rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {routine.duration} min</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Flame size={14} /> {routine.calories} cal</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Dumbbell size={14} /> {routine.exercises.length} exercises</span>
        </div>

        <button
          onClick={() => setExpanded(o => !o)}
          style={{
            marginTop: 18, display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            background: expanded ? "rgba(108,99,255,.12)" : "var(--bg-glass)",
            border: `1px solid ${expanded ? "rgba(108,99,255,.35)" : "var(--border-color)"}`,
            color: expanded ? "var(--accent-purple)" : "var(--text-secondary)",
            fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "all .3s",
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? "Hide Exercises" : `View All ${routine.exercises.length} Exercises`}
        </button>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {routine.exercises.map((ex, i) => (
            <ExerciseCard key={`${routine.id}-${i}`} ex={ex} index={i} onOpenForm={onOpenForm} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function WorkoutsPage() {
  const [viewMode, setViewMode]         = useState<"presets" | "custom">("presets");
  const [location, setLocation]       = useState<string | null>(null);
  const [split, setSplit]             = useState<string | null>(null);
  const [equipment, setEquipment]     = useState<string>("dumbbell");
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [modalEx, setModalEx]         = useState<WorkoutExercise | null>(null);

  const openForm  = useCallback((ex: WorkoutExercise) => setModalEx(ex), []);
  const closeForm = useCallback(() => setModalEx(null), []);

  function goBack() {
    if (split) { setSplit(null); setActiveDayIdx(0); }
    else       { setLocation(null); }
  }

  const locationMeta = LOCATIONS.find(l => l.id === location);
  const gymEntry = location === "gym" && split
    ? GYM_WORKOUT_DATA.find(e => e.splitId === split && e.equipmentId === equipment)
    : null;

  /* breadcrumb */
  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: "Workouts", onClick: () => { setLocation(null); setSplit(null); setActiveDayIdx(0); } },
  ];
  if (locationMeta) crumbs.push({ label: locationMeta.name, onClick: location === "gym" ? () => { setSplit(null); setActiveDayIdx(0); } : undefined });
  if (split) { const sm = GYM_SPLIT_TYPES.find(s => s.id === split); if (sm) crumbs.push({ label: sm.name }); }

  /* routines for home/outdoor */
  const flatRoutines = location === "home" ? HOME_WORKOUTS : location === "outdoor" ? OUTDOOR_WORKOUTS : [];
  const showFlat = (location === "home" || location === "outdoor");

  return (
    <>
      {/* ── Form Guide Modal ── */}
      {modalEx && <FormModal ex={modalEx} onClose={closeForm} />}

      <div>
        {/* Page header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1>Workouts</h1>
            <p>Choose your training environment, customize your own routines, and track live workout time</p>
          </div>
          <VoiceReadButton
            text="Welcome to Workouts. Choose between Preset Programs or Custom Workout Studio where you can create your own consecutive daily schedules, customize sets, reps, and target weights, start live timed workout sessions, and set personal target goals."
            size="md"
            label="🔊 Page Guide"
          />
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "var(--bg-secondary)", padding: 6, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", maxWidth: 540 }}>
          <button
            onClick={() => setViewMode("presets")}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              background: viewMode === "presets" ? "var(--gradient-primary)" : "transparent",
              color: viewMode === "presets" ? "#fff" : "var(--text-secondary)",
              fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            🎬 Netflix-Style Library
          </button>
          <button
            onClick={() => setViewMode("custom")}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 10,
              background: viewMode === "custom" ? "var(--gradient-primary)" : "transparent",
              color: viewMode === "custom" ? "#fff" : "var(--text-secondary)",
              fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            🛠️ Custom Studio &amp; Tracker
          </button>
        </div>

        {/* Netflix-style Category Filter Chips */}
        {viewMode === "presets" && (
          <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Categories:</span>
            {["All", "Strength 🏋️", "Cardio 🏃", "HIIT ⚡", "Yoga 🧘", "Stretching 🤸", "Pilates 🩰", "Mobility 🔄"].map((cat, idx) => (
              <button
                key={cat}
                style={{
                  padding: "6px 14px", borderRadius: 20,
                  background: idx === 0 ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${idx === 0 ? "#7C3AED" : "rgba(255,255,255,0.08)"}`,
                  color: idx === 0 ? "#7C3AED" : "var(--text-secondary)",
                  fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Render Custom Studio if selected */}
        {viewMode === "custom" ? (
          <div className="animate-fade">
            <CustomWorkoutBuilder />
          </div>
        ) : (
          <div className="animate-fade">


        {/* Breadcrumb */}
        {location && (
          <div className="animate-fade" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            <button
              onClick={goBack}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 10,
                background: "var(--bg-glass)", border: "1px solid var(--border-color)",
                color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer", transition: "all .3s",
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />}
                {c.onClick && i < crumbs.length - 1 ? (
                  <button onClick={c.onClick} style={{ background: "none", border: "none", color: "var(--accent-purple)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>{c.label}</button>
                ) : (
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: i === crumbs.length - 1 ? "var(--text-primary)" : "var(--text-secondary)" }}>{c.label}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* ══ LEVEL 1 — Location picker ══ */}
        {!location && (
          <div className="animate-fade">
            <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Where do you want to train?</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: "0.92rem" }}>
              Pick a training environment — we&apos;ll provide tailored workouts with full form guides for every exercise.
            </p>
            <div className="grid-3">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => { setLocation(loc.id); setSplit(null); setActiveDayIdx(0); }}
                  className="workout-location-card"
                  style={{
                    position: "relative", overflow: "hidden",
                    background: loc.bgColor, border: `1px solid ${loc.borderColor}`,
                    borderRadius: 20, padding: "36px 28px 28px",
                    textAlign: "left", cursor: "pointer",
                    transition: "all .4s ease", color: "var(--text-primary)",
                  }}
                >
                  <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, background: loc.gradient, borderRadius: "50%", opacity: .1, filter: "blur(40px)" }} />
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 16 }}>{loc.icon}</span>
                  <h4 style={{ fontSize: "1.2rem", marginBottom: 8 }}>{loc.name}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 18 }}>{loc.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                    {loc.features.map(f => (
                      <span key={f} style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", fontSize: "0.72rem", fontWeight: 500, color: "var(--text-secondary)" }}>{f}</span>
                    ))}
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600, background: loc.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Explore <ChevronRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ LEVEL 2 — Gym split picker ══ */}
        {location === "gym" && !split && (
          <div className="animate-fade">
            <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Choose Your Split</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: 28, fontSize: "0.92rem" }}>
              Select a workout split based on your training frequency and goals. Every exercise includes a detailed form guide.
            </p>
            <div className="grid-2">
              {GYM_SPLIT_TYPES.map(sp => (
                <button
                  key={sp.id}
                  onClick={() => { setSplit(sp.id); setActiveDayIdx(0); }}
                  style={{
                    position: "relative", overflow: "hidden",
                    background: "var(--bg-card)", border: "1px solid var(--border-color)",
                    borderRadius: 18, padding: "30px 26px",
                    textAlign: "left", cursor: "pointer",
                    transition: "all .35s ease", color: "var(--text-primary)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = sp.color + "66";
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = `0 8px 30px ${sp.color}22`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--border-color)";
                    el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: sp.color, borderRadius: "50%", opacity: .06, filter: "blur(30px)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <span style={{ width: 48, height: 48, borderRadius: 14, background: sp.color + "18", border: `1px solid ${sp.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                      {sp.icon}
                    </span>
                    <h4 style={{ fontSize: "1.1rem" }}>{sp.name}</h4>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>{sp.description}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 600, color: sp.color }}>
                    Select Split <ChevronRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ LEVEL 3 — Equipment + days + routines ══ */}
        {location === "gym" && split && (
          <div className="animate-fade">
            {/* Equipment tabs */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: "1.05rem", marginBottom: 14 }}>Equipment Preference</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {EQUIPMENT_FILTERS.map(eq => {
                  const active = equipment === eq.id;
                  return (
                    <button
                      key={eq.id}
                      onClick={() => { setEquipment(eq.id); setActiveDayIdx(0); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 22px", borderRadius: 14,
                        background: active ? "rgba(108,99,255,.14)" : "var(--bg-card)",
                        border: `1px solid ${active ? "rgba(108,99,255,.4)" : "var(--border-color)"}`,
                        color: active ? "var(--accent-purple)" : "var(--text-secondary)",
                        fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", transition: "all .3s",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{eq.icon}</span>
                      <span>{eq.label}</span>
                      {active && <Zap size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day tabs */}
            {gymEntry && (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  {gymEntry.days.map((day, i) => {
                    const active = activeDayIdx === i;
                    return (
                      <button
                        key={day.dayLabel}
                        onClick={() => setActiveDayIdx(i)}
                        style={{
                          padding: "10px 20px", borderRadius: 12,
                          background: active ? "var(--gradient-primary)" : "var(--bg-card)",
                          border: `1px solid ${active ? "transparent" : "var(--border-color)"}`,
                          color: active ? "#fff" : "var(--text-secondary)",
                          fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", transition: "all .3s",
                        }}
                      >
                        {day.dayLabel}
                      </button>
                    );
                  })}
                </div>
                {gymEntry.days[activeDayIdx]?.routines.map(r => (
                  <RoutineCard key={r.id} routine={r} onOpenForm={openForm} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ══ Home & Outdoor flat routines ══ */}
        {showFlat && (
          <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Star size={18} style={{ color: "var(--accent-orange)" }} />
              <h3 style={{ fontSize: "1.05rem" }}>
                {location === "home" ? "Home Workout Programs" : "Outdoor / Park Programs"}
              </h3>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.88rem" }}>
              {location === "home"
                ? "No equipment required — every exercise includes a form guide with step-by-step instructions."
                : "Use park fixtures and open space — tap any exercise for a full form guide."}
            </p>
            {flatRoutines.map(r => (
              <RoutineCard key={r.id} routine={r} onOpenForm={openForm} />
            ))}
          </div>
        )}
          </div>
        )}
      </div>
    </>
  );
}

