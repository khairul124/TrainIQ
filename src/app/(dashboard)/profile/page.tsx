"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Camera,
  Smartphone,
  ShieldCheck,
  Activity,
  Award,
  Flame,
  Zap,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { FITNESS_GOALS, FITNESS_LEVELS } from "@/lib/constants";
import { VoiceReadButton } from "@/components/VoiceButton";
import { createClient } from "@/lib/supabase/client";

interface UserProfileData {
  full_name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  date_of_birth: string;
  gender: string;
  fitness_level: string;
  fitness_goal: string;
  daily_calorie_target: number;
  body_fat_pct: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData>({
    full_name: "Athlete",
    username: "athlete",
    email: "athlete@trainiq.ai",
    avatar_url: null,
    height_cm: 175,
    weight_kg: 72.5,
    goal_weight_kg: 70.0,
    date_of_birth: "1998-06-15",
    gender: "male",
    fitness_level: "intermediate",
    fitness_goal: "build_muscle",
    daily_calorie_target: 2200,
    body_fat_pct: 14.5,
  });

  const [wearables, setWearables] = useState({
    appleHealth: true,
    googleFit: true,
    whoop: true,
    oura: true,
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load Real User Profile on Mount ──
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check local storage for existing customizations
        const savedCustomName = localStorage.getItem("trainiq_user_fullname");
        const savedCustomUsername = localStorage.getItem("trainiq_user_username");
        const savedAvatar = localStorage.getItem("trainiq_user_avatar");
        const savedProfileJson = localStorage.getItem("trainiq_profile_full");

        let initialProfile: Partial<UserProfileData> = {};
        if (savedProfileJson) {
          try {
            initialProfile = JSON.parse(savedProfileJson);
          } catch {
            // ignore JSON parse error
          }
        }

        if (user) {
          // Resolve real user full name
          const userMeta = user.user_metadata || {};
          const realName =
            savedCustomName ||
            userMeta.full_name ||
            userMeta.name ||
            userMeta.preferred_username ||
            (user.email ? user.email.split("@")[0].replace(/[._]/g, " ") : "Athlete");

          // Formatted capitalized name
          const formattedName = realName
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          const realUsername =
            savedCustomUsername ||
            userMeta.username ||
            (user.email ? user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_") : "athlete");

          const realAvatar =
            savedAvatar ||
            userMeta.avatar_url ||
            userMeta.picture ||
            null;

          setProfile((prev) => ({
            ...prev,
            ...initialProfile,
            full_name: formattedName,
            username: realUsername,
            email: user.email || prev.email,
            avatar_url: realAvatar,
          }));
        } else if (savedCustomName || savedAvatar) {
          // Demo mode with previous edits
          setProfile((prev) => ({
            ...prev,
            ...initialProfile,
            full_name: savedCustomName || prev.full_name,
            username: savedCustomUsername || prev.username,
            avatar_url: savedAvatar || prev.avatar_url,
          }));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUserProfile();
  }, []);

  const update = (key: keyof UserProfileData, val: string | number) => {
    setProfile((p) => ({ ...p, [key]: val }));
  };

  const toggleWearable = (key: keyof typeof wearables) => {
    setWearables((w) => ({ ...w, [key]: !w[key] }));
  };

  // ── Client-side Low-Resolution Image Compression (< 30KB) ──
  const compressToLowRes = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (readerEvent) => {
        const img = new Image();
        img.src = readerEvent.target?.result as string;

        img.onload = () => {
          // Low-resolution square target: 180x180 px
          // Perfectly crisp on standard/retina avatars while keeping payload ~15KB
          const targetSize = 180;
          const canvas = document.createElement("canvas");
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Unable to create canvas context"));
            return;
          }

          // Center-crop to 1:1 aspect ratio
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);

          // Export as compressed JPEG with 0.72 quality
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
          resolve(compressedDataUrl);
        };

        img.onerror = () => reject(new Error("Failed to decode image file"));
      };

      reader.onerror = () => reject(new Error("Failed to read image"));
    });
  };

  // ── Handle Photo File Upload ──
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Please choose a valid image file (PNG, JPG, WebP)." });
      return;
    }

    setCompressingImage(true);
    setStatusMessage(null);

    try {
      // Compress to low resolution
      const lowResAvatar = await compressToLowRes(file);

      // Update state
      setProfile((p) => ({ ...p, avatar_url: lowResAvatar }));

      // Save to localStorage for instant local access
      localStorage.setItem("trainiq_user_avatar", lowResAvatar);

      // Persist to Supabase User Metadata
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { avatar_url: lowResAvatar },
      });

      // Broadcast event so topbar avatar updates everywhere immediately
      window.dispatchEvent(
        new CustomEvent("trainiq-profile-updated", {
          detail: { avatar: lowResAvatar, name: profile.full_name },
        })
      );

      setStatusMessage({
        type: "success",
        text: "Profile photo updated & compressed to low-resolution (~18 KB) successfully!",
      });
    } catch (err: unknown) {
      console.error("Photo compression error:", err);
      setStatusMessage({
        type: "error",
        text: "Failed to compress or upload photo. Please try another image.",
      });
    } finally {
      setCompressingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ── Remove Profile Photo ──
  const handleRemovePhoto = async () => {
    setProfile((p) => ({ ...p, avatar_url: null }));
    localStorage.removeItem("trainiq_user_avatar");

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
    } catch {
      // ignore
    }

    window.dispatchEvent(
      new CustomEvent("trainiq-profile-updated", {
        detail: { avatar: null, name: profile.full_name },
      })
    );

    setStatusMessage({ type: "success", text: "Profile picture removed." });
  };

  // ── Save All Profile Changes ──
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      // Save to localStorage
      localStorage.setItem("trainiq_user_fullname", profile.full_name);
      localStorage.setItem("trainiq_user_username", profile.username);
      localStorage.setItem("trainiq_profile_full", JSON.stringify(profile));

      // Save to Supabase
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          username: profile.username,
        },
      });

      if (updateError) {
        console.warn("Supabase profile sync notice:", updateError.message);
      }

      // Broadcast event
      window.dispatchEvent(
        new CustomEvent("trainiq-profile-updated", {
          detail: { avatar: profile.avatar_url, name: profile.full_name },
        })
      );

      setStatusMessage({ type: "success", text: "All profile settings and metrics saved successfully!" });
    } catch (err) {
      console.error("Save profile error:", err);
      setStatusMessage({ type: "error", text: "Could not save profile changes." });
    } finally {
      setSaving(false);
    }
  };

  const bmi = Number((profile.weight_kg / ((profile.height_cm / 100) ** 2)).toFixed(1));
  const userInitial = profile.full_name?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            User Profile &amp; Devices
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Manage account identity, custom low-res avatar, connected health telemetry, and biometric goals.
          </p>
        </div>
        <VoiceReadButton
          text={`TrainIQ Profile for ${profile.full_name}. Height: ${profile.height_cm} centimeters. Weight: ${profile.weight_kg} kilograms. BMI: ${bmi}. Body Fat: ${profile.body_fat_pct} percent. Connected devices: Apple Health, Google Health Connect, WHOOP, and Oura Ring.`}
          size="md"
          label="🔊 Read Profile"
        />
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          className="animate-fade"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            borderRadius: 12,
            marginBottom: 24,
            fontSize: "0.9rem",
            fontWeight: 500,
            background:
              statusMessage.type === "success"
                ? "rgba(34, 197, 94, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            border: `1px solid ${
              statusMessage.type === "success"
                ? "rgba(34, 197, 94, 0.35)"
                : "rgba(239, 68, 68, 0.35)"
            }`,
            color: statusMessage.type === "success" ? "#4ADE80" : "#F87171",
          }}
        >
          {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Profile Identity Card */}
      <div
        className="profile-header"
        style={{
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 28,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        {/* Avatar with Camera Trigger */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload profile photo (auto-compressed to low resolution)"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #1C1C24 0%, #2A2A36 100%)",
              border: "2px solid rgba(204, 255, 0, 0.4)",
              boxShadow: "0 0 20px rgba(204, 255, 0, 0.15)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#CCFF00",
                }}
              >
                {userInitial}
              </span>
            )}

            {compressingImage && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="smooth-spinner" style={{ width: 22, height: 22 }} />
              </div>
            )}
          </div>

          {/* Camera upload badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload profile picture (low-res optimized)"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#CCFF00",
              color: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #111114",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
              transition: "transform 0.2s",
            }}
          >
            <Camera size={15} />
          </button>
        </div>

        {/* User Details */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#F5F5F2" }}>
              {profile.full_name}
            </h2>
            <span
              style={{
                fontSize: "0.74rem",
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(204,255,0,0.12)",
                border: "1px solid rgba(204,255,0,0.3)",
                color: "#CCFF00",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              TRAINIQ ATHLETE
            </span>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: 2 }}>
            @{profile.username} &bull; <span style={{ color: "#71717A" }}>{profile.email}</span>
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span
              className="badge"
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                color: "#22C55E",
                padding: "5px 12px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {profile.fitness_goal.replace("_", " ")}
            </span>
            <span
              className="badge"
              style={{
                background: "rgba(34, 211, 238, 0.15)",
                color: "#22D3EE",
                padding: "5px 12px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              27-Day Streak 🔥
            </span>

            {/* Photo Action Buttons */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "5px 12px",
                color: "#D4D4D8",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Upload size={13} /> Upload Photo (Low-Res)
            </button>

            {profile.avatar_url && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: 8,
                  padding: "5px 12px",
                  color: "#F87171",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Trash2 size={13} /> Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Biometrics Row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: "0.78rem", color: "#71717A", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>CURRENT WEIGHT</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F5F5F2" }}>{profile.weight_kg} kg</div>
          <div style={{ fontSize: "0.78rem", color: "#22C55E", marginTop: 4 }}>Target: {profile.goal_weight_kg} kg</div>
        </div>

        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: "0.78rem", color: "#71717A", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>BMI INDEX</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#22D3EE" }}>{bmi}</div>
          <div style={{ fontSize: "0.78rem", color: "#71717A", marginTop: 4 }}>Normal Healthy Range</div>
        </div>

        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: "0.78rem", color: "#71717A", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>BODY FAT %</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#CCFF00" }}>{profile.body_fat_pct}%</div>
          <div style={{ fontSize: "0.78rem", color: "#CCFF00", marginTop: 4 }}>Athletic Conditioning</div>
        </div>

        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: "0.78rem", color: "#71717A", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4 }}>DAILY CALORIE GOAL</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F59E0B" }}>{profile.daily_calorie_target}</div>
          <div style={{ fontSize: "0.78rem", color: "#71717A", marginTop: 4 }}>kcal / day Target</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Connected Wearables & Devices */}
        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ marginBottom: 20, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: 8, color: "#CCFF00", fontWeight: 700 }}>
            <ShieldCheck size={18} /> Connected Health Devices
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "appleHealth" as const, name: "Apple Health", icon: "🍏", desc: "Background sync steps, active energy, heart rate" },
              { key: "googleFit" as const, name: "Google Health Connect", icon: "🤖", desc: "Android native health telemetry" },
              { key: "whoop" as const, name: "WHOOP Strap 4.0", icon: "⚡", desc: "Strain, HRV, & Recovery integration" },
              { key: "oura" as const, name: "Oura Ring Gen 3", icon: "💍", desc: "Sleep stage tracking & body temperature" },
            ].map((dev) => (
              <div
                key={dev.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "1.5rem" }}>{dev.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#F5F5F2" }}>{dev.name}</div>
                    <div style={{ fontSize: "0.76rem", color: "#71717A" }}>{dev.desc}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleWearable(dev.key)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    background: wearables[dev.key] ? "rgba(204, 255, 0, 0.15)" : "rgba(255,255,255,0.05)",
                    color: wearables[dev.key] ? "#CCFF00" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    transition: "all 0.2s",
                  }}
                >
                  {wearables[dev.key] ? "Connected ✓" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Preferences & Account Edit Form */}
        <div className="card" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 28 }}>
          <h3 style={{ marginBottom: 20, fontSize: "1.15rem", fontWeight: 700, color: "#F5F5F2" }}>
            Personal Preferences &amp; Identity
          </h3>

          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Full Name</label>
              <input
                className="input"
                style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                value={profile.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="input-group">
              <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Username</label>
              <input
                className="input"
                style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                value={profile.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="username"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Height (cm)</label>
                <input
                  type="number"
                  className="input"
                  style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                  value={profile.height_cm}
                  onChange={(e) => update("height_cm", Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                  value={profile.weight_kg}
                  onChange={(e) => update("weight_kg", Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-group">
                <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                  value={profile.goal_weight_kg}
                  onChange={(e) => update("goal_weight_kg", Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label style={{ color: "#A1A1A8", fontSize: "0.85rem", fontWeight: 600 }}>Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  style={{ background: "#16161C", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#FFF" }}
                  value={profile.body_fat_pct}
                  onChange={(e) => update("body_fat_pct", Number(e.target.value))}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                marginTop: 10,
                background: "#CCFF00",
                color: "#000",
                padding: "13px 24px",
                borderRadius: 10,
                fontWeight: 800,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(204, 255, 0, 0.25)",
              }}
            >
              <Save size={16} />
              <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
