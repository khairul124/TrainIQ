"use client";
import { useState, useCallback } from "react";
import { Volume2, VolumeX, Mic, MicOff, AudioLines } from "lucide-react";
import { VoiceSystem } from "@/lib/voiceSystem";

// ─── Inline Read-Aloud Button ───────────────────────────
// Compact button that reads a text block aloud

interface VoiceReadButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}

export function VoiceReadButton({ text, label, size = "sm", style }: VoiceReadButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = useCallback(() => {
    if (speaking) {
      VoiceSystem.stop();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      VoiceSystem.speak(text, () => setSpeaking(false));
    }
  }, [speaking, text]);

  const isSmall = size === "sm";

  return (
    <button
      onClick={toggle}
      title={speaking ? "Stop reading" : "Read aloud"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: isSmall ? "4px 10px" : "6px 14px",
        borderRadius: isSmall ? 8 : 10,
        border: `1px solid ${speaking ? "rgba(108,99,255,0.4)" : "var(--border-color)"}`,
        background: speaking ? "rgba(108,99,255,0.12)" : "rgba(255,255,255,0.04)",
        color: speaking ? "var(--accent-purple)" : "var(--text-secondary)",
        fontSize: isSmall ? "0.7rem" : "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {speaking ? (
        <>
          <AudioLines size={isSmall ? 13 : 15} style={{ animation: "pulse 1s infinite" }} />
          {label ? "Stop" : "■ Stop"}
        </>
      ) : (
        <>
          <Volume2 size={isSmall ? 13 : 15} />
          {label || "🔊 Listen"}
        </>
      )}
    </button>
  );
}

// ─── Section Header with Voice ──────────────────────────
// Renders a section title + subtitle with a Listen button that reads it all

interface VoiceSectionHeaderProps {
  title: string;
  subtitle?: string;
  readText: string;       // full text to read aloud for this section
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function VoiceSectionHeader({ title, subtitle, readText, icon, children }: VoiceSectionHeaderProps) {
  return (
    <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon} {title}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <VoiceReadButton text={readText} size="md" label="🔊 Read Page" />
        {children}
      </div>
    </div>
  );
}

// ─── Floating Voice Mic Button ──────────────────────────
// A global-style floating mic button for speech-to-text on any page

interface VoiceMicProps {
  onTranscript: (text: string) => void;
  style?: React.CSSProperties;
}

export function VoiceMicButton({ onTranscript, style }: VoiceMicProps) {
  const [listening, setListening] = useState(false);

  const toggle = useCallback(() => {
    if (listening) {
      VoiceSystem.stopListening();
      setListening(false);
    } else {
      setListening(true);
      VoiceSystem.startListening(
        (transcript) => onTranscript(transcript),
        (err) => { console.warn("Mic error:", err); setListening(false); },
        () => setListening(false)
      );
    }
  }, [listening, onTranscript]);

  return (
    <button
      onClick={toggle}
      title={listening ? "Stop listening" : "Voice command"}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: listening
          ? "linear-gradient(135deg, #FF6B6B, #FF4757)"
          : "linear-gradient(135deg, #6C63FF, #00D9FF)",
        border: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: listening
          ? "0 4px 24px rgba(255,75,75,0.4)"
          : "0 4px 24px rgba(108,99,255,0.35)",
        zIndex: 1000,
        transition: "all 0.3s ease",
        animation: listening ? "pulse 1.5s infinite" : "none",
        ...style,
      }}
    >
      {listening ? <MicOff size={22} /> : <Mic size={22} />}
    </button>
  );
}
