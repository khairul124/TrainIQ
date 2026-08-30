"use client";
import { useState } from "react";
import { Save, Camera, Smartphone, ShieldCheck, Activity, Award, Flame, Zap } from "lucide-react";
import { FITNESS_GOALS, FITNESS_LEVELS } from "@/lib/constants";
import { VoiceReadButton } from "@/components/VoiceButton";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "Demo Athlete", username: "kivo_athlete", email: "athlete@kivo.ai",
    height_cm: 175, weight_kg: 72.5, goal_weight_kg: 70.0, date_of_birth: "1998-06-15",
    gender: "male", fitness_level: "intermediate", fitness_goal: "build_muscle",
    daily_calorie_target: 2200, body_fat_pct: 14.5,
  });

  const [wearables, setWearables] = useState({
    appleHealth: true,
    googleFit: true,
    whoop: true,
    oura: true,
  });

  const update = (key: string, val: string | number) => setProfile(p => ({ ...p, [key]: val }));
  const toggleWearable = (key: keyof typeof wearables) => setWearables(w => ({ ...w, [key]: !w[key] }));

  const bmi = Number((profile.weight_kg / ((profile.height_cm / 100) ** 2)).toFixed(1));

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>User Profile &amp; Devices</h1>
          <p>Manage account settings, connected health devices, and personal metrics.</p>
        </div>
        <VoiceReadButton
          text={`TrainIQ Profile. Name: ${profile.full_name}. Height: ${profile.height_cm} centimeters. Weight: ${profile.weight_kg} kilograms. BMI: ${bmi}. Body Fat: ${profile.body_fat_pct} percent. Connected devices: Apple Health, Google Health Connect, WHOOP, and Oura Ring.`}
          size="md"
          label="🔊 Read Profile"
        />
      </div>

      {/* Profile Header */}
      <div className="profile-header" style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <div className="profile-avatar" style={{ background: "var(--gradient-primary)", fontWeight: 800 }}>K</div>
          <button style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #121218" }}>
            <Camera size={12} color="#fff" />
          </button>
        </div>
        <div>
          <h2 style={{ fontSize: "1.5rem" }}>{profile.full_name}</h2>
          <p style={{ color: "var(--text-secondary)" }}>@{profile.username}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span className="badge badge-primary" style={{ background: "rgba(124,58,237,0.2)", color: "#7C3AED" }}>TrainIQ Pro Member</span>
            <span className="badge badge-success">{profile.fitness_goal.replace("_", " ")}</span>
            <span className="badge" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE" }}>12-Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Key Biometrics Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card" style={{ background: "#121218", textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>Current Weight</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{profile.weight_kg} kg</div>
          <div style={{ fontSize: "0.72rem", color: "#22C55E" }}>Target: {profile.goal_weight_kg} kg</div>
        </div>
        <div className="card" style={{ background: "#121218", textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>BMI Index</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#22D3EE" }}>{bmi}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Normal Healthy Range</div>
        </div>
        <div className="card" style={{ background: "#121218", textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>Body Fat %</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#7C3AED" }}>{profile.body_fat_pct}%</div>
          <div style={{ fontSize: "0.72rem", color: "#7C3AED" }}>Athletic Cut</div>
        </div>
        <div className="card" style={{ background: "#121218", textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>Daily Calorie Goal</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#F59E0B" }}>{profile.daily_calorie_target}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>kcal / day</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Connected Wearables & Devices */}
        <div className="card" style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ marginBottom: 20, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8, color: "#22C55E" }}>
            <ShieldCheck size={18} /> Connected Health Devices
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "appleHealth" as const, name: "Apple Health", icon: "🍏", desc: "Background sync steps, active energy, heart rate" },
              { key: "googleFit" as const, name: "Google Health Connect", icon: "🤖", desc: "Android native health telemetry" },
              { key: "whoop" as const, name: "WHOOP Strap 4.0", icon: "⚡", desc: "Strain, HRV, & Recovery integration" },
              { key: "oura" as const, name: "Oura Ring Gen 3", icon: "💍", desc: "Sleep stage tracking & body temperature" },
            ].map(dev => (
              <div key={dev.key} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.5rem" }}>{dev.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{dev.name}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{dev.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleWearable(dev.key)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: wearables[dev.key] ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                    color: wearables[dev.key] ? "#22C55E" : "var(--text-muted)",
                    fontWeight: 700, fontSize: "0.75rem", transition: "all 0.2s"
                  }}
                >
                  {wearables[dev.key] ? "Connected ✓" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="card" style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ marginBottom: 20, fontSize: "1.1rem" }}>Personal Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label>Full Name</label>
              <input className="input" value={profile.full_name} onChange={e => update("full_name", e.target.value)} />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input className="input" value={profile.username} onChange={e => update("username", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label>Height (cm)</label>
                <input type="number" className="input" value={profile.height_cm} onChange={e => update("height_cm", Number(e.target.value))} />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input type="number" className="input" value={profile.weight_kg} onChange={e => update("weight_kg", Number(e.target.value))} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8, background: "var(--gradient-primary)", padding: "12px 24px", borderRadius: 12, fontWeight: 700 }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
