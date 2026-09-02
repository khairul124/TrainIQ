"use client";

import React, { useEffect, useState, useRef } from "react";

interface SplineSceneProps {
  /** URL to the Spline scene (.splinecode file) */
  scene: string;
  /** CSS class to apply to the container */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Callback fired when the scene finishes loading */
  onLoad?: () => void;
}

/**
 * SplineScene — Production-ready Spline 3D Viewer for Next.js
 *
 * Uses the official Spline Viewer web component to avoid Turbopack Draco WASM
 * bundling conflicts during Next.js production builds, providing full WebGL
 * interactive 3D rendering with mouse/touch support.
 */
export function SplineScene({ scene, className, style, onLoad }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "spline-viewer-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.9.79/build/spline-viewer.js";
      document.head.appendChild(script);
    }

    const timer = setTimeout(() => {
      const viewer = containerRef.current?.querySelector("spline-viewer");
      if (viewer) {
        viewer.addEventListener("load", () => {
          setLoaded(true);
          onLoad?.();
        });
      }
    }, 400);

    // Fallback safety timeout so viewer is revealed even if load event already fired
    const fallbackTimer = setTimeout(() => {
      setLoaded(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [onLoad]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "rgba(10, 10, 14, 0.4)",
            zIndex: 2,
            backdropFilter: "blur(6px)",
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              border: "3px solid rgba(204, 255, 0, 0.2)",
              borderTopColor: "#CCFF00",
              borderRadius: "50%",
              animation: "spline-spin 0.8s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              color: "#CCFF00",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            INITIALIZING 3D ENGINE...
          </span>
        </div>
      )}

      {/* @ts-ignore - custom web component */}
      <spline-viewer
        url={scene}
        loading-anim-type="none"
        style={{
          width: "100%",
          height: "100%",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          display: "block",
        }}
      />

      <style jsx global>{`
        @keyframes spline-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default SplineScene;
