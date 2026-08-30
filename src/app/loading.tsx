"use client";
import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0A0A0F",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Animated Glowing Dual Spinner */}
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {/* Outer Ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#6C63FF",
            borderRightColor: "#00D9FF",
            animation: "spinSmooth 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
            filter: "drop-shadow(0 0 12px rgba(108,99,255,0.6))",
          }}
        />
        {/* Inner Ring */}
        <div
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderBottomColor: "#00FF88",
            borderLeftColor: "#FFB347",
            animation: "spinSmooth 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse",
            filter: "drop-shadow(0 0 8px rgba(0,255,136,0.6))",
          }}
        />
        {/* Center Logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/trainiq-logo.png"
            alt="TrainIQ"
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Loading Label */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "1.2rem",
            background: "linear-gradient(135deg, #FFF, #8A8A9A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 0.5,
          }}
        >
          TrainIQ AI
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span>Loading workspace environment...</span>
        </div>
      </div>

      <style>{`
        @keyframes spinSmooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
