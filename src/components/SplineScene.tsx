"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  /** URL to the Spline scene (.splinecode file) */
  scene: string;
  /** CSS class to apply to the Spline canvas */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** Callback fired when the scene finishes loading */
  onLoad?: (app: any) => void;
}

/**
 * SplineScene — Production-ready lazy-loaded Spline 3D wrapper
 *
 * IMPORTANT: The parent container MUST have explicit width and height.
 * The Spline canvas expands to fill its parent.
 */
export function SplineScene({ scene, className, style, onLoad }: SplineSceneProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", ...style }}>
      <Suspense
        fallback={
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                border: "3px solid rgba(204, 255, 0, 0.2)",
                borderTopColor: "#CCFF00",
                borderRadius: "50%",
                animation: "spline-spin 0.8s linear infinite",
              }}
            />
          </div>
        }
      >
        <Spline scene={scene} className={className} onLoad={onLoad} />
      </Suspense>

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
