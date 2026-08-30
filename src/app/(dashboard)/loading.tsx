"use client";

export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "8px 0" }}>
      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="skeleton-box" style={{ width: 220, height: 32, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 340, height: 16, borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="skeleton-box" style={{ width: 120, height: 38, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: 140, height: 38, borderRadius: 10 }} />
        </div>
      </div>

      {/* Top 4 Stat Cards Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "#141424",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="skeleton-box" style={{ width: 90, height: 14, borderRadius: 4 }} />
              <div className="skeleton-box" style={{ width: 36, height: 36, borderRadius: 10 }} />
            </div>
            <div className="skeleton-box" style={{ width: 110, height: 28, borderRadius: 6 }} />
            <div className="skeleton-box" style={{ width: 150, height: 12, borderRadius: 4 }} />
          </div>
        ))}
      </div>

      {/* Middle Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Main Chart Skeleton */}
        <div
          style={{
            background: "#141424",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 300,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="skeleton-box" style={{ width: 160, height: 20, borderRadius: 6 }} />
            <div className="skeleton-box" style={{ width: 100, height: 30, borderRadius: 8 }} />
          </div>
          <div className="skeleton-box" style={{ flex: 1, width: "100%", borderRadius: 12, minHeight: 220 }} />
        </div>

        {/* Side Panel Skeleton */}
        <div
          style={{
            background: "#141424",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div className="skeleton-box" style={{ width: 140, height: 20, borderRadius: 6 }} />
          <div className="skeleton-box" style={{ width: "100%", height: 60, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: "100%", height: 60, borderRadius: 10 }} />
          <div className="skeleton-box" style={{ width: "100%", height: 60, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  );
}
