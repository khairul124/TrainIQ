"use client";
import { useState } from "react";
import { Flame, Dumbbell, TrendingUp, Zap, Plus, Bot, Utensils, Trophy, Heart, Moon, Activity, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { VoiceReadButton } from "@/components/VoiceButton";

const stats = [
  { label: "WHOOP Recovery", value: "92%", change: "Optimal Strain Capacity", positive: true, icon: <Activity size={22} />, color: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)" },
  { label: "Sleep Score", value: "94 / 100", change: "8h 24m • Deep 2.1h", positive: true, icon: <Moon size={22} />, color: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)" },
  { label: "Calories Today", value: "1,847", change: "153 remaining", positive: true, icon: <Flame size={22} />, color: "rgba(34,211,238,0.15)", border: "rgba(34,211,238,0.3)" },
  { label: "Current Streak", value: "12 Days 🔥", change: "Personal Record!", positive: true, icon: <Zap size={22} />, color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
];

const quickActions = [
  { label: "Start Workout", icon: <Plus size={18} />, href: "/workouts", gradient: "var(--gradient-primary)" },
  { label: "Log Meal", icon: <Utensils size={18} />, href: "/nutrition", gradient: "var(--gradient-success)" },
  { label: "Ask AI Coach", icon: <Bot size={18} />, href: "/ai-coach", gradient: "var(--gradient-warm)" },
  { label: "View Challenges", icon: <Trophy size={18} />, href: "/community", gradient: "var(--gradient-danger)" },
];

const recentActivity = [
  { type: "workout", title: "Upper Body Hypertrophy", detail: "8 exercises • 52 min • 420 cal", time: "2 hours ago", emoji: "💪" },
  { type: "meal", title: "Grilled Salmon + Quinoa", detail: "Lunch • 580 cal • 46g protein", time: "4 hours ago", emoji: "🐟" },
  { type: "achievement", title: "12-Day Consistency Streak!", detail: "Earned WHOOP Prime Badge", time: "Yesterday", emoji: "🏆" },
  { type: "workout", title: "Morning HIIT Cardio", detail: "30 min HIIT • 350 cal burned", time: "Yesterday", emoji: "🏃" },
];

export default function DashboardPage() {
  const dashboardSummary = `TrainIQ Dashboard Overview. Your WHOOP Recovery score is 92 percent with optimal strain capacity. Your Oura sleep score is 94 out of 100 with 8 hours 24 minutes of total sleep. You have logged 1,847 calories today with 153 remaining, and your current streak is 12 days. Apple Health and Google Fit background sync is active.`;

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: "0.8rem", padding: "3px 10px", borderRadius: 20, background: "rgba(124,58,237,0.15)", color: "#7C3AED", fontWeight: 700, border: "1px solid rgba(124,58,237,0.3)" }}>
              ✨ TrainIQ 2.5 AI Dashboard
            </span>
          </div>
          <h1>Performance Command Center</h1>
          <p>Real-time biometric recovery, sleep stages, nutrition, and daily strain analysis.</p>
        </div>
        <VoiceReadButton text={dashboardSummary} size="md" label="🔊 Read Summary" />
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i} style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="stat-card-icon" style={{ background: s.color, border: `1px solid ${s.border}` }}>{s.icon}</div>
            <div className="stat-card-value" style={{ fontSize: "1.8rem", fontWeight: 800 }}>{s.value}</div>
            <div className="stat-card-label" style={{ fontWeight: 600 }}>{s.label}</div>
            <div className={`stat-card-change ${s.positive ? "positive" : "negative"}`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* WHOOP / Oura Biometrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* Oura Sleep Breakdown Card */}
        <div style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7C3AED", fontWeight: 700, fontSize: "0.95rem" }}>
              <Moon size={18} />
              <span>Oura Ring Sleep Breakdown</span>
            </div>
            <span style={{ fontSize: "0.75rem", background: "rgba(124,58,237,0.15)", color: "#7C3AED", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Optimal</span>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#22D3EE" }}>2h 10m</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Deep Sleep (25%)</div>
            </div>
            <div style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#7C3AED" }}>1h 45m</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>REM Sleep (21%)</div>
            </div>
            <div style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 12, textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#22C55E" }}>4h 29m</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Light Sleep (54%)</div>
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={14} style={{ color: "#22C55E" }} />
            <span>Resting Heart Rate: <strong>52 bpm</strong> &bull; HRV: <strong>68 ms</strong> (Prime readiness)</span>
          </div>
        </div>

        {/* Connected Health Integrations Card */}
        <div style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22C55E", fontWeight: 700, fontSize: "0.95rem" }}>
              <ShieldCheck size={18} />
              <span>Connected Wearables &amp; Health Hub</span>
            </div>
            <span style={{ fontSize: "0.75rem", background: "rgba(34,197,94,0.15)", color: "#22C55E", padding: "2px 8px", borderRadius: 12, fontWeight: 700 }}>Live Sync</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.2rem" }}>🍏</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Apple Health</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Steps, Active Energy, Stand Hours</div>
                </div>
              </div>
              <span style={{ fontSize: "0.73rem", color: "#22C55E", fontWeight: 700 }}>Connected</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.2rem" }}>🤖</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Google Health Connect</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Heart Rate, Oxygen Saturation</div>
                </div>
              </div>
              <span style={{ fontSize: "0.73rem", color: "#22C55E", fontWeight: 700 }}>Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16, fontSize: "1.1rem" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {quickActions.map((a, i) => (
            <Link key={i} href={a.href} className="btn" style={{ background: a.gradient, color: "#fff", padding: "14px 24px", borderRadius: 12, fontWeight: 600 }}>
              {a.icon} {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 style={{ marginBottom: 20, fontSize: "1.1rem" }}>Recent Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recentActivity.map((act, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.4rem" }}>{act.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{act.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{act.detail}</div>
                </div>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
