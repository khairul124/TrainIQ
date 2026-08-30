"use client";
import { TrendingUp, TrendingDown, Award, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { VoiceReadButton } from "@/components/VoiceButton";

const weightData = [
  { date: "W1", weight: 75.2 }, { date: "W2", weight: 74.8 }, { date: "W3", weight: 74.5 },
  { date: "W4", weight: 74.1 }, { date: "W5", weight: 73.6 }, { date: "W6", weight: 73.2 },
  { date: "W7", weight: 72.9 }, { date: "W8", weight: 72.5 },
];

const workoutFreq = [
  { week: "W1", count: 3 }, { week: "W2", count: 4 }, { week: "W3", count: 5 },
  { week: "W4", count: 4 }, { week: "W5", count: 6 }, { week: "W6", count: 5 },
  { week: "W7", count: 5 }, { week: "W8", count: 5 },
];

const prs = [
  { exercise: "Bench Press", value: "85kg × 5", date: "2 days ago", emoji: "🏋️" },
  { exercise: "Squat", value: "120kg × 3", date: "1 week ago", emoji: "🦵" },
  { exercise: "Deadlift", value: "140kg × 2", date: "2 weeks ago", emoji: "💀" },
  { exercise: "Pull-ups", value: "15 reps", date: "3 days ago", emoji: "💪" },
  { exercise: "5K Run", value: "23:45", date: "1 week ago", emoji: "🏃" },
];

const streakDays = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];

export default function ProgressPage() {
  const progressSummary = `Progress Overview. You've lost 2.7 kilograms over 8 weeks. You've completed 37 total workouts with 5 personal records. Your current streak is 12 days. Personal records include: Bench Press at 85 kilograms for 5 reps, Squat at 120 kilograms for 3 reps, Deadlift at 140 kilograms for 2 reps, Pull-ups at 15 reps, and 5K Run in 23 minutes 45 seconds.`;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Progress</h1>
          <p>Track your fitness journey and celebrate milestones</p>
        </div>
        <VoiceReadButton text={progressSummary} size="md" label="🔊 Read Progress" />
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)" }}><TrendingDown size={22} /></div>
          <div className="stat-card-value">-2.7kg</div>
          <div className="stat-card-label">Weight Lost (8 weeks)</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "rgba(108,99,255,0.15)", border: "1px solid rgba(108,99,255,0.3)" }}><TrendingUp size={22} /></div>
          <div className="stat-card-value">37</div>
          <div className="stat-card-label">Total Workouts</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "rgba(255,179,71,0.12)", border: "1px solid rgba(255,179,71,0.3)" }}><Award size={22} /></div>
          <div className="stat-card-value">5</div>
          <div className="stat-card-label">Personal Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: "rgba(0,217,255,0.12)", border: "1px solid rgba(0,217,255,0.3)" }}><Calendar size={22} /></div>
          <div className="stat-card-value">12</div>
          <div className="stat-card-label">Current Streak</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        {/* Weight Chart */}
        <div className="chart-card">
          <h3>Weight Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#55556A" fontSize={12} />
              <YAxis stroke="#55556A" fontSize={12} domain={[71, 76]} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F0F0F5" }} />
              <Line type="monotone" dataKey="weight" stroke="#6C63FF" strokeWidth={3} dot={{ fill: "#6C63FF", r: 4 }} activeDot={{ r: 6, fill: "#00D9FF" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Frequency */}
        <div className="chart-card">
          <h3>Workout Frequency</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workoutFreq}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="#55556A" fontSize={12} />
              <YAxis stroke="#55556A" fontSize={12} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#F0F0F5" }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00D9FF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {/* Personal Records */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: "1.1rem" }}>🏆 Personal Records</h3>
          {prs.map((pr, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < prs.length - 1 ? "1px solid var(--border-color)" : "none" }}>
              <span style={{ fontSize: "1.5rem" }}>{pr.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{pr.exercise}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{pr.date}</div>
              </div>
              <VoiceReadButton text={`Personal record: ${pr.exercise}, ${pr.value}, achieved ${pr.date}`} />
              <span className="badge badge-success">{pr.value}</span>
            </div>
          ))}
        </div>

        {/* Streak Calendar */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: "1.1rem" }}>📅 Streak Calendar (June)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>{d}</div>
            ))}
            {streakDays.map((active, i) => (
              <div key={i} style={{
                aspectRatio: "1", borderRadius: 6,
                background: active ? "var(--gradient-primary)" : "var(--bg-secondary)",
                border: `1px solid ${active ? "rgba(108,99,255,0.3)" : "var(--border-color)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", color: active ? "#fff" : "var(--text-muted)"
              }}>{i + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
