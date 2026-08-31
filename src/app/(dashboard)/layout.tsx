"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, Dumbbell, Utensils, TrendingUp, Bot, Users, UserCircle, Search, Bell, Menu, X, LogOut, Sparkles } from "lucide-react";
import { AdaptiveUIProvider, AdaptiveUISwitcher } from "@/components/AdaptiveUI";
import { MagicMouse } from "@/components/MagicMouse";
import { OnboardingAgent } from "@/components/OnboardingAgent";
import { SmartSearchModal } from "@/components/SmartSearchModal";

import { GoogleSheetsSyncBadge } from "@/components/GoogleSheetsSyncBadge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/ai-coach", label: "AI Coach", icon: Bot },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl + K / Cmd + K shortcut to toggle Smart Search AI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AdaptiveUIProvider>
      <div className="dashboard-layout">
        {/* Magic Mouse Helper Overlay */}
        <MagicMouse />

        {/* Smart Search Modal */}
        <SmartSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Onboarding Agent Assistant */}
        <OnboardingAgent />

        {/* Overlay */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, display: "none" }} className="mobile-overlay" />}

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <Link href="/" className="sidebar-logo" style={{ gap: 10, textDecoration: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <img
              src="/trainiq-logo.png"
              alt="TrainIQ Logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid rgba(34, 197, 94, 0.4)",
                boxShadow: "0 0 14px rgba(34, 197, 94, 0.3)",
              }}
            />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, letterSpacing: "-0.03em", fontSize: "1.35rem", background: "linear-gradient(135deg, #FFF 50%, #22C55E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TrainIQ
            </span>
          </Link>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <item.icon size={20} className="icon" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <Link href="/login" className="sidebar-link" onClick={() => {
              document.cookie = "demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            }}>
              <LogOut size={20} className="icon" />
              Sign Out / Switch Account
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="main-content">
          <header className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="menu-toggle btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "var(--text-primary)", display: "none" }}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div
                className="topbar-search"
                onClick={() => setSearchOpen(true)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
              >
                <Search size={16} style={{ color: "var(--text-muted)" }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ask TrainIQ AI or search (Ctrl + K)...</span>
                <span style={{ padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-color)", fontSize: "0.7rem", color: "var(--text-muted)" }}>Ctrl K</span>
              </div>
            </div>
            <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Google Sheets Live Sync Badge */}
              <GoogleSheetsSyncBadge />

              {/* Connected Wearables Badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", borderRadius: 20,
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-green)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
                <span>🍏 Apple Health &bull; 🤖 Fit</span>
              </div>

              {/* Adaptive UI Mode Switcher */}
              <AdaptiveUISwitcher />

              <button className="btn btn-ghost btn-icon" style={{ position: "relative" }}>
                <Bell size={20} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--accent-red)" }} />
              </button>
              <Link
                href="/profile"
                className="topbar-avatar"
                style={{
                  background: "var(--gradient-primary)",
                  fontWeight: 800,
                  textDecoration: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
                }}
                title="Your Profile & Account Settings"
              >
                K
              </Link>
            </div>
          </header>
          <main className="page-content animate-fade">
            {children}
          </main>
        </div>

        {/* Native Mobile Bottom Navigation Bar (Visible <= 768px) */}
        <nav className="mobile-bottom-nav">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-bottom-link ${pathname === item.href ? "active" : ""}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <style>{`
          @media (max-width: 768px) {
            .menu-toggle { display: flex !important; }
            .mobile-overlay { display: block !important; }
          }
        `}</style>
      </div>
    </AdaptiveUIProvider>
  );
}

