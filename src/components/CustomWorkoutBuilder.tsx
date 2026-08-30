"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Play, CheckCircle2, Clock, Flame, Dumbbell, Calendar,
  Target, Award, Search, X, Check, Save, RotateCcw, Volume2, ShieldCheck, ChevronRight
} from "lucide-react";
import { getAllExercises, WorkoutExercise, getFormImage } from "@/lib/workoutData";
import { VoiceReadButton } from "@/components/VoiceButton";
import { VoiceSystem } from "@/lib/voiceSystem";

export interface CustomExerciseItem {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  customSets: number;
  customReps: string;
  targetWeightKg: number;
  restSeconds: number;
  visual?: string;
  instructions?: string[];
  tips?: string;
}

export interface CustomWorkoutDay {
  id: string;
  dayName: string;          // e.g. "Day 1 — Upper Body Push"
  exercises: CustomExerciseItem[];
}

export interface PersonalGoals {
  weeklyWorkoutsGoal: number;       // e.g. 5 workouts
  targetDurationMinutes: number;   // e.g. 45 min
  weeklyCaloriesGoal: number;      // e.g. 2000 cal
  weeklyVolumeGoalKg: number;      // e.g. 10000 kg
}

export interface CompletedSetLog {
  setNumber: number;
  repsDone: number;
  weightKg: number;
  completed: boolean;
}

export interface LoggedWorkoutSession {
  id: string;
  dayName: string;
  date: string;
  durationSeconds: number;
  caloriesBurned: number;
  totalVolumeKg: number;
  exercisesCompleted: {
    name: string;
    sets: CompletedSetLog[];
  }[];
}

const DEFAULT_GOALS: PersonalGoals = {
  weeklyWorkoutsGoal: 5,
  targetDurationMinutes: 45,
  weeklyCaloriesGoal: 2000,
  weeklyVolumeGoalKg: 10000,
};

const DEFAULT_DAYS: CustomWorkoutDay[] = [
  {
    id: "day-1",
    dayName: "Day 1 — Chest & Triceps",
    exercises: [
      { id: "e1", name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell", customSets: 4, customReps: "10-12", targetWeightKg: 60, restSeconds: 90, visual: "🏋️" },
      { id: "e2", name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbell", customSets: 3, customReps: "10", targetWeightKg: 22, restSeconds: 60, visual: "🛋️" },
      { id: "e3", name: "Cable Tricep Pushdown", muscleGroup: "Triceps", equipment: "Cable", customSets: 3, customReps: "12-15", targetWeightKg: 25, restSeconds: 45, visual: "⚡" },
    ],
  },
  {
    id: "day-2",
    dayName: "Day 2 — Back & Biceps",
    exercises: [
      { id: "e4", name: "Pull-ups", muscleGroup: "Back", equipment: "Bodyweight", customSets: 4, customReps: "8-10", targetWeightKg: 0, restSeconds: 90, visual: "📊" },
      { id: "e5", name: "Seated Cable Row", muscleGroup: "Back", equipment: "Cable", customSets: 3, customReps: "12", targetWeightKg: 45, restSeconds: 60, visual: "🚣" },
      { id: "e6", name: "Dumbbell Bicep Curl", muscleGroup: "Biceps", equipment: "Dumbbell", customSets: 3, customReps: "12", targetWeightKg: 14, restSeconds: 45, visual: "💪" },
    ],
  },
  {
    id: "day-3",
    dayName: "Day 3 — Legs & Abs",
    exercises: [
      { id: "e7", name: "Barbell Squat", muscleGroup: "Legs", equipment: "Barbell", customSets: 4, customReps: "10-12", targetWeightKg: 70, restSeconds: 120, visual: "🦵" },
      { id: "e8", name: "Leg Press", muscleGroup: "Legs", equipment: "Machine", customSets: 4, customReps: "12", targetWeightKg: 120, restSeconds: 90, visual: "⚙️" },
      { id: "e9", name: "Plank Hold", muscleGroup: "Core", equipment: "Bodyweight", customSets: 3, customReps: "45s", targetWeightKg: 0, restSeconds: 30, visual: "🧱" },
    ],
  },
];

export function CustomWorkoutBuilder() {
  const [activeTab, setActiveTab] = useState<"builder" | "tracker" | "goals" | "history">("builder");
  const [customDays, setCustomDays] = useState<CustomWorkoutDay[]>(DEFAULT_DAYS);
  const [goals, setGoals] = useState<PersonalGoals>(DEFAULT_GOALS);
  const [history, setHistory] = useState<LoggedWorkoutSession[]>([]);

  // Selected day in Builder mode
  const [selectedDayId, setSelectedDayId] = useState<string>("day-1");

  // Exercise Picker Modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState("all");

  // Active Session State
  const [activeSessionDayId, setActiveSessionDayId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [sessionLogs, setSessionLogs] = useState<Record<string, CompletedSetLog[]>>({});

  // Toast notice
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Master exercise database
  const allDatabaseExercises = getAllExercises();

  // Load local state
  useEffect(() => {
    try {
      const savedDays = localStorage.getItem("fitnessgpt_custom_workout_days");
      if (savedDays) setCustomDays(JSON.parse(savedDays));

      const savedGoals = localStorage.getItem("fitnessgpt_workout_goals");
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedHistory = localStorage.getItem("fitnessgpt_workout_history");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {}
  }, []);

  // Save state helpers
  const saveDays = (days: CustomWorkoutDay[]) => {
    setCustomDays(days);
    localStorage.setItem("fitnessgpt_custom_workout_days", JSON.stringify(days));
  };

  const saveGoalsState = (newGoals: PersonalGoals) => {
    setGoals(newGoals);
    localStorage.setItem("fitnessgpt_workout_goals", JSON.stringify(newGoals));
    showToast("🎯 Personal Workout Goals Saved!");
  };

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // BUILDER HANDLERS
  const handleAddDay = () => {
    const newId = `day-${Date.now()}`;
    const newDayName = `Day ${customDays.length + 1} — Custom Split`;
    const updated = [...customDays, { id: newId, dayName: newDayName, exercises: [] }];
    saveDays(updated);
    setSelectedDayId(newId);
    showToast(`✨ Created "${newDayName}"`);
  };

  const handleDeleteDay = (id: string) => {
    if (customDays.length <= 1) {
      showToast("Cannot delete the only remaining day.");
      return;
    }
    const updated = customDays.filter(d => d.id !== id);
    saveDays(updated);
    if (selectedDayId === id) setSelectedDayId(updated[0].id);
    showToast("Day removed.");
  };

  const handleUpdateDayName = (id: string, name: string) => {
    saveDays(customDays.map(d => d.id === id ? { ...d, dayName: name } : d));
  };

  const handleAddExerciseToDay = (ex: WorkoutExercise) => {
    const newItem: CustomExerciseItem = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      equipment: ex.equipment,
      customSets: ex.sets || 3,
      customReps: ex.reps || "10-12",
      targetWeightKg: 20,
      restSeconds: ex.restSeconds || 60,
      visual: ex.visual || "🏋️",
      instructions: ex.instructions,
      tips: ex.tips,
    };

    saveDays(customDays.map(d => {
      if (d.id === selectedDayId) {
        return { ...d, exercises: [...d.exercises, newItem] };
      }
      return d;
    }));

    setPickerOpen(false);
    showToast(`Added ${ex.name} to routine!`);
  };

  const handleUpdateExercise = (dayId: string, exId: string, field: keyof CustomExerciseItem, val: any) => {
    saveDays(customDays.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          exercises: d.exercises.map(item => item.id === exId ? { ...item, [field]: val } : item),
        };
      }
      return d;
    }));
  };

  const handleRemoveExercise = (dayId: string, exId: string) => {
    saveDays(customDays.map(d => {
      if (d.id === dayId) {
        return { ...d, exercises: d.exercises.filter(item => item.id !== exId) };
      }
      return d;
    }));
  };

  // TRACKER HANDLERS
  const startActiveSession = (dayId: string) => {
    const dayObj = customDays.find(d => d.id === dayId);
    if (!dayObj || dayObj.exercises.length === 0) {
      showToast("Please add at least 1 exercise to this day before starting!");
      return;
    }

    setActiveSessionDayId(dayId);
    setTimerSeconds(0);
    setTimerRunning(true);

    // Pre-populate set logs
    const initialLogs: Record<string, CompletedSetLog[]> = {};
    dayObj.exercises.forEach(ex => {
      const setsArr: CompletedSetLog[] = [];
      for (let i = 1; i <= ex.customSets; i++) {
        setsArr.push({
          setNumber: i,
          repsDone: parseInt(ex.customReps) || 10,
          weightKg: ex.targetWeightKg || 0,
          completed: false,
        });
      }
      initialLogs[ex.id] = setsArr;
    });

    setSessionLogs(initialLogs);
    setActiveTab("tracker");
    VoiceSystem.speak(`Starting workout session for ${dayObj.dayName}. Focus on good form and stay hydrated!`);
  };

  const toggleSetComplete = (exId: string, setIdx: number) => {
    setSessionLogs(prev => {
      const currentSets = [...(prev[exId] || [])];
      currentSets[setIdx] = {
        ...currentSets[setIdx],
        completed: !currentSets[setIdx].completed,
      };
      return { ...prev, [exId]: currentSets };
    });
  };

  const updateSetValues = (exId: string, setIdx: number, field: "repsDone" | "weightKg", val: number) => {
    setSessionLogs(prev => {
      const currentSets = [...(prev[exId] || [])];
      currentSets[setIdx] = {
        ...currentSets[setIdx],
        [field]: val,
      };
      return { ...prev, [exId]: currentSets };
    });
  };

  const finishActiveSession = () => {
    const activeDay = customDays.find(d => d.id === activeSessionDayId);
    if (!activeDay) return;

    setTimerRunning(false);

    // Calculate metrics
    let totalVolume = 0;
    let setsCompletedCount = 0;
    const completedExArr: { name: string; sets: CompletedSetLog[] }[] = [];

    activeDay.exercises.forEach(ex => {
      const sets = sessionLogs[ex.id] || [];
      sets.forEach(s => {
        if (s.completed) {
          totalVolume += s.repsDone * s.weightKg;
          setsCompletedCount++;
        }
      });
      completedExArr.push({ name: ex.name, sets });
    });

    const mins = Math.max(1, Math.round(timerSeconds / 60));
    const estimatedCal = Math.round(mins * 7.5 + setsCompletedCount * 8);

    const newLogSession: LoggedWorkoutSession = {
      id: `sess-${Date.now()}`,
      dayName: activeDay.dayName,
      date: new Date().toISOString().split("T")[0],
      durationSeconds: timerSeconds,
      caloriesBurned: estimatedCal,
      totalVolumeKg: totalVolume,
      exercisesCompleted: completedExArr,
    };

    const updatedHistory = [newLogSession, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("fitnessgpt_workout_history", JSON.stringify(updatedHistory));

    setActiveSessionDayId(null);
    setActiveTab("history");

    VoiceSystem.speak(`Great job! Workout complete in ${mins} minutes. You burned approximately ${estimatedCal} calories with a total volume of ${totalVolume} kilograms.`);
    showToast(`🏆 Workout Saved! ${mins} min • ${estimatedCal} cal • ${totalVolume} kg volume`);
  };

  // Filtering for Exercise Picker
  const filteredExercises = allDatabaseExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === "all" || ex.muscleGroup.toLowerCase() === selectedMuscleFilter.toLowerCase();
    return matchesSearch && matchesMuscle;
  });

  const selectedDayObj = customDays.find(d => d.id === selectedDayId) || customDays[0];

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className="animate-fade" style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: "#1A1A2E", border: "1px solid rgba(108, 99, 255, 0.5)",
          borderRadius: "var(--radius-md)", padding: "14px 20px",
          color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 600,
          boxShadow: "0 8px 40px rgba(0,0,0,0.8), 0 0 20px rgba(108,99,255,0.2)"
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
            🛠️ Custom Workout Studio &amp; Active Tracker
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Build custom day-to-day consecutive routines, customize sets &amp; reps, set personal targets, and track live workout time.
          </p>
        </div>

        <VoiceReadButton
          text="Custom Workout Studio. Here you can build custom consecutive routines, set custom target sets, reps, and weights, start live timed workout sessions, and track personal goals."
          size="md"
          label="🔊 Studio Guide"
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "var(--bg-secondary)", padding: 4, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", flexWrap: "wrap" }}>
        {[
          { id: "builder", label: "📅 Custom Day-to-Day Builder", icon: <Calendar size={15} /> },
          { id: "tracker", label: `⏱️ Active Tracker ${timerRunning ? `(${formatTime(timerSeconds)})` : ""}`, icon: <Clock size={15} /> },
          { id: "goals", label: "🎯 Personal Workout Goals", icon: <Target size={15} /> },
          { id: "history", label: "🏆 Session History", icon: <Award size={15} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1, minWidth: 140, padding: "10px 14px", borderRadius: 10,
              background: activeTab === tab.id ? "var(--gradient-primary)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
              fontWeight: 600, fontSize: "0.82rem", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.3s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 1. BUILDER TAB */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {activeTab === "builder" && (
        <div>
          {/* Days bar */}
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 12, marginBottom: 20, alignItems: "center" }}>
            {customDays.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                style={{
                  padding: "10px 18px", borderRadius: 12, whiteSpace: "nowrap",
                  background: selectedDayId === day.id ? "rgba(108,99,255,0.18)" : "var(--bg-card)",
                  border: `1px solid ${selectedDayId === day.id ? "var(--accent-purple)" : "var(--border-color)"}`,
                  color: selectedDayId === day.id ? "#fff" : "var(--text-secondary)",
                  fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                }}
              >
                <span>{day.dayName}</span>
                <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>{day.exercises.length} ex</span>
              </button>
            ))}
            <button
              onClick={handleAddDay}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 12, padding: "10px 16px", whiteSpace: "nowrap" }}
            >
              <Plus size={16} /> Add Consecutive Day
            </button>
          </div>

          {/* Active Selected Day Box */}
          {selectedDayObj && (
            <div className="card" style={{ padding: 24, border: "1px solid rgba(108,99,255,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <input
                    value={selectedDayObj.dayName}
                    onChange={e => handleUpdateDayName(selectedDayObj.id, e.target.value)}
                    style={{
                      background: "none", border: "none", borderBottom: "1px solid var(--border-color)",
                      fontSize: "1.25rem", fontWeight: 700, color: "#fff", outline: "none", padding: "4px 0", flex: 1
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => startActiveSession(selectedDayObj.id)}
                    style={{ fontWeight: 700 }}
                  >
                    <Play size={16} /> Start Live Workout Session
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDeleteDay(selectedDayObj.id)}
                    style={{ color: "var(--accent-red)" }}
                  >
                    <Trash2 size={16} /> Remove Day
                  </button>
                </div>
              </div>

              {/* Exercises Table / List */}
              {selectedDayObj.exercises.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  <Dumbbell size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ fontSize: "0.9rem" }}>No exercises added to this routine day yet.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setPickerOpen(true)}>
                    <Plus size={16} /> Add Exercise from Master Database
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {selectedDayObj.exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      style={{
                        background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                        borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{ex.visual || "🏋️"}</span>

                      <div style={{ minWidth: 160, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{ex.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: 6, marginTop: 2 }}>
                          <span className="badge badge-primary" style={{ fontSize: "0.6rem" }}>{ex.muscleGroup}</span>
                          <span>· {ex.equipment}</span>
                        </div>
                      </div>

                      {/* Customize Sets */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>SETS</label>
                        <input
                          type="number"
                          min={1} max={10}
                          value={ex.customSets}
                          onChange={e => handleUpdateExercise(selectedDayObj.id, ex.id, "customSets", parseInt(e.target.value) || 1)}
                          style={{
                            width: 60, padding: "6px 8px", background: "var(--bg-card)",
                            border: "1px solid var(--border-color)", borderRadius: 8, color: "#fff", textAlign: "center", fontWeight: 700
                          }}
                        />
                      </div>

                      {/* Customize Reps */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>REPS</label>
                        <input
                          type="text"
                          value={ex.customReps}
                          onChange={e => handleUpdateExercise(selectedDayObj.id, ex.id, "customReps", e.target.value)}
                          style={{
                            width: 80, padding: "6px 8px", background: "var(--bg-card)",
                            border: "1px solid var(--border-color)", borderRadius: 8, color: "#fff", textAlign: "center", fontWeight: 700
                          }}
                        />
                      </div>

                      {/* Customize Target Weight (kg) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>TARGET (KG)</label>
                        <input
                          type="number"
                          min={0} max={400}
                          value={ex.targetWeightKg}
                          onChange={e => handleUpdateExercise(selectedDayObj.id, ex.id, "targetWeightKg", parseFloat(e.target.value) || 0)}
                          style={{
                            width: 75, padding: "6px 8px", background: "var(--bg-card)",
                            border: "1px solid var(--border-color)", borderRadius: 8, color: "#fff", textAlign: "center", fontWeight: 700
                          }}
                        />
                      </div>

                      {/* Voice Read Button */}
                      <VoiceReadButton text={`${ex.name}. Target: ${ex.customSets} sets of ${ex.customReps} reps at ${ex.targetWeightKg} kilograms.`} />

                      {/* Delete Exercise */}
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => handleRemoveExercise(selectedDayObj.id, ex.id)}
                        style={{ color: "var(--text-muted)" }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    className="btn btn-secondary"
                    onClick={() => setPickerOpen(true)}
                    style={{ marginTop: 12, justifyContent: "center", padding: "12px" }}
                  >
                    <Plus size={16} /> Add Exercise to {selectedDayObj.dayName}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 2. ACTIVE TRACKER TAB */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {activeTab === "tracker" && (
        <div className="card" style={{ padding: 28, border: "1px solid var(--border-glow)" }}>
          {!activeSessionDayId ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Clock size={48} style={{ color: "var(--accent-purple)", marginBottom: 16 }} />
              <h3 style={{ fontSize: "1.3rem", marginBottom: 8 }}>No Active Session Running</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 20 }}>
                Select a routine day from your Custom Builder to launch live time tracking and set logging!
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {customDays.map(d => (
                  <button
                    key={d.id}
                    className="btn btn-primary"
                    onClick={() => startActiveSession(d.id)}
                  >
                    <Play size={16} /> Start {d.dayName}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Active Timer Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-color)", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>LIVE WORKOUT ACTIVE</span>
                  <h3 style={{ fontSize: "1.4rem", marginTop: 4 }}>
                    {customDays.find(d => d.id === activeSessionDayId)?.dayName}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 12, padding: "8px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>WORKOUT TIME</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-purple)", fontFamily: "var(--font-heading)" }}>
                      {formatTime(timerSeconds)}
                    </div>
                  </div>

                  <button
                    className="btn btn-success btn-lg"
                    onClick={finishActiveSession}
                    style={{ fontWeight: 800 }}
                  >
                    🏆 Complete &amp; Save Workout
                  </button>
                </div>
              </div>

              {/* Set-by-Set Logging Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {customDays.find(d => d.id === activeSessionDayId)?.exercises.map((ex) => {
                  const sets = sessionLogs[ex.id] || [];
                  return (
                    <div key={ex.id} style={{ background: "var(--bg-secondary)", borderRadius: 16, padding: 20, border: "1px solid var(--border-color)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: "1.05rem", display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{ex.visual || "🏋️"}</span>
                          <span>{ex.name}</span>
                          <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>{ex.muscleGroup}</span>
                        </div>
                        <VoiceReadButton text={`Perform ${ex.customSets} sets of ${ex.name}. Target weight ${ex.targetWeightKg} kilograms.`} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sets.map((s, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex", alignItems: "center", gap: 16, padding: "10px 14px",
                              background: s.completed ? "rgba(0,255,136,0.1)" : "var(--bg-card)",
                              border: `1px solid ${s.completed ? "rgba(0,255,136,0.3)" : "var(--border-color)"}`,
                              borderRadius: 10, flexWrap: "wrap"
                            }}
                          >
                            <span style={{ width: 60, fontWeight: 700, fontSize: "0.85rem", color: s.completed ? "var(--accent-green)" : "var(--text-muted)" }}>
                              Set {s.setNumber}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Reps:</span>
                              <input
                                type="number"
                                value={s.repsDone}
                                onChange={e => updateSetValues(ex.id, idx, "repsDone", parseInt(e.target.value) || 0)}
                                style={{ width: 65, padding: "4px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 6, color: "#fff", fontWeight: 700, textAlign: "center" }}
                              />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Weight (kg):</span>
                              <input
                                type="number"
                                value={s.weightKg}
                                onChange={e => updateSetValues(ex.id, idx, "weightKg", parseFloat(e.target.value) || 0)}
                                style={{ width: 75, padding: "4px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 6, color: "#fff", fontWeight: 700, textAlign: "center" }}
                              />
                            </div>

                            <button
                              onClick={() => toggleSetComplete(ex.id, idx)}
                              className={`btn btn-sm ${s.completed ? "btn-success" : "btn-secondary"}`}
                              style={{ marginLeft: "auto" }}
                            >
                              {s.completed ? "✓ Completed" : "Mark Set Complete"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 3. GOALS TAB */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {activeTab === "goals" && (
        <div className="card" style={{ padding: 28, border: "1px solid var(--border-glow)" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 6 }}>🎯 Personal Workout Target Goals</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>
            Set your own target metrics for weekly frequency, session duration, volume, and calorie burn targets.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 28 }}>
            <div className="input-group">
              <label>Weekly Workouts Goal (Sessions)</label>
              <input
                type="number"
                className="input"
                value={goals.weeklyWorkoutsGoal}
                onChange={e => setGoals({ ...goals, weeklyWorkoutsGoal: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="input-group">
              <label>Target Session Duration (Minutes)</label>
              <input
                type="number"
                className="input"
                value={goals.targetDurationMinutes}
                onChange={e => setGoals({ ...goals, targetDurationMinutes: parseInt(e.target.value) || 15 })}
              />
            </div>

            <div className="input-group">
              <label>Weekly Calories Burn Target (kcal)</label>
              <input
                type="number"
                className="input"
                value={goals.weeklyCaloriesGoal}
                onChange={e => setGoals({ ...goals, weeklyCaloriesGoal: parseInt(e.target.value) || 500 })}
              />
            </div>

            <div className="input-group">
              <label>Weekly Total Volume Target (kg)</label>
              <input
                type="number"
                className="input"
                value={goals.weeklyVolumeGoalKg}
                onChange={e => setGoals({ ...goals, weeklyVolumeGoalKg: parseInt(e.target.value) || 1000 })}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => saveGoalsState(goals)}>
            <Save size={16} /> Save Personal Target Goals
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 4. HISTORY TAB */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 16 }}>🏆 Completed Workout Sessions History</h3>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
              No completed sessions logged yet. Start a live workout session from the builder!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {history.map(sess => (
                <div key={sess.id} style={{ background: "var(--bg-secondary)", borderRadius: 14, padding: 18, border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>{sess.dayName}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{sess.date}</div>
                  </div>

                  <div style={{ display: "flex", gap: 16, fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--accent-purple)" }}>⏱️ {formatTime(sess.durationSeconds)}</span>
                    <span style={{ color: "var(--accent-orange)" }}>🔥 {sess.caloriesBurned} cal</span>
                    <span style={{ color: "var(--accent-green)" }}>🏋️ {sess.totalVolumeKg} kg volume</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* EXERCISE PICKER MODAL */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {pickerOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20
          }}
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="animate-fade"
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg-card)", border: "1px solid var(--border-glow)",
              borderRadius: 20, maxWidth: 640, width: "100%", maxHeight: "80vh",
              display: "flex", flexDirection: "column", overflow: "hidden", padding: 24
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Dumbbell size={20} style={{ color: "var(--accent-purple)" }} /> Select Workout Exercise
              </h3>
              <button onClick={() => setPickerOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="input"
                placeholder="Search exercise name or muscle group..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 38, width: "100%" }}
              />
            </div>

            {/* Muscle Filter Pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 16 }}>
              {["all", "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Core", "Full Body", "Cardio"].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMuscleFilter(m)}
                  style={{
                    padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600,
                    background: selectedMuscleFilter === m ? "var(--gradient-primary)" : "var(--bg-secondary)",
                    color: selectedMuscleFilter === m ? "#fff" : "var(--text-muted)",
                    border: "none", cursor: "pointer", whiteSpace: "nowrap"
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredExercises.map(ex => (
                <div
                  key={ex.name}
                  onClick={() => handleAddExerciseToDay(ex)}
                  style={{
                    padding: "12px 16px", background: "var(--bg-secondary)", borderRadius: 12,
                    border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-purple)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "1.4rem" }}>{ex.visual || "🏋️"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{ex.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ex.muscleGroup} · {ex.equipment}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ padding: "4px 12px", fontSize: "0.75rem" }}>
                    + Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
