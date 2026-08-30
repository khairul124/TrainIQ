"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Zap, Brain, Dumbbell, Utensils, TrendingUp, Users, Shield,
  ChevronRight, Sparkles, Lock, Volume2, Globe, CheckCircle2, ArrowRight, ShieldCheck,
  MousePointer, Compass, Search, DollarSign, Play, Heart, Moon, Activity, Star, ChevronDown, ChevronUp, ScanLine, Smartphone
} from "lucide-react";

export default function KivoLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ background: "#09090B", color: "#FFF", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* ── Navigation Bar ── */}
      <nav className="landing-nav" style={{
        position: "sticky", top: 0, zIndex: 1000, backdropFilter: "blur(20px)",
        background: "rgba(9, 9, 11, 0.8)", borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Link href="/" className="landing-logo" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit", cursor: "pointer" }}>
          <img
            src="/trainiq-logo.png"
            alt="TrainIQ Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid rgba(34, 197, 94, 0.4)",
              boxShadow: "0 0 16px rgba(34, 197, 94, 0.35)",
            }}
          />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #FFF 50%, #22C55E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            TrainIQ
          </span>
        </Link>

        <div className="landing-nav-links" style={{ display: "flex", gap: 28, alignItems: "center", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          <a href="#features" style={{ transition: "color 0.2s" }}>Features</a>
          <a href="#bento" style={{ transition: "color 0.2s" }}>Platform</a>
          <a href="#wearables" style={{ transition: "color 0.2s" }}>Wearables</a>
          <a href="#pricing" style={{ transition: "color 0.2s" }}>Pricing</a>
          <a href="#faq" style={{ transition: "color 0.2s" }}>FAQ</a>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/login" className="btn btn-secondary btn-sm" style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            Log In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm" style={{ padding: "8px 20px", borderRadius: 10, background: "var(--gradient-primary)", fontWeight: 700, boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero" style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        {/* Glow ambient circle */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 300, background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(34,211,238,0.05) 50%, transparent 70%)",
          pointerEvents: "none", zIndex: 0
        }} />

        <div className="hero-content animate-fade" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 30,
            background: "rgba(124, 58, 237, 0.12)", border: "1px solid rgba(124, 58, 237, 0.3)",
            color: "var(--accent-purple)", fontSize: "0.83rem", fontWeight: 600, marginBottom: 24
          }}>
            <Sparkles size={14} style={{ color: "#7C3AED" }} /> Next-Gen AI Fitness Platform &bull; Powered by Gemini 2.5
          </div>

          <h1 style={{ fontSize: "4.2rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24 }}>
            The Future of Fitness<br />
            <span style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #22D3EE 50%, #22C55E 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Starts Here.</span>
          </h1>

          <p style={{ fontSize: "1.25rem", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 720, margin: "0 auto 36px" }}>
            Track workouts, analyse nutrition, monitor recovery, and get AI-powered coaching. Experience Apple-level minimalism with WHOOP &amp; Oura intelligence.
          </p>

          <div className="hero-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{
              padding: "16px 36px", borderRadius: 14, background: "linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)",
              fontWeight: 800, fontSize: "1.05rem", boxShadow: "0 10px 40px rgba(124,58,237,0.5)",
              display: "flex", alignItems: "center", gap: 10
            }}>
              Start Free <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" className="btn btn-secondary btn-lg" style={{
              padding: "16px 32px", borderRadius: 14, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)", fontWeight: 700, fontSize: "1.05rem",
              display: "flex", alignItems: "center", gap: 10
            }}>
              <Play size={18} fill="#FFF" /> Watch Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, color: "var(--text-muted)", fontSize: "0.88rem" }}>
            <div style={{ display: "flex" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <span>Rated 4.9/5 by 50,000+ athletes &amp; coaches</span>
          </div>
        </div>
      </section>

      {/* ── Bento Grid Showcase Section ── */}
      <section id="bento" style={{ padding: "60px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: "#7C3AED", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Comprehensive Intelligence
          </span>
          <h2 style={{ fontSize: "2.8rem", fontWeight: 800, marginTop: 8 }}>
            Engineered for Peak Human Performance
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 20 }}>
          {/* Tile 1: AI Coach */}
          <div style={{
            gridColumn: "span 8", background: "#121218", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 32, position: "relative", overflow: "hidden"
          }}>
            <div style={{ height: 3, background: "var(--gradient-primary)", position: "absolute", top: 0, left: 0, right: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#7C3AED", marginBottom: 12, fontWeight: 700 }}>
              <Brain size={20} />
              <span>AI Coach &amp; Voice Assistant</span>
            </div>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 10 }}>Multimodal AI Trainer &amp; Voice Guide</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: 500, lineHeight: 1.6 }}>
              Bilingual English &amp; Bangla natural voice AI. Hover over any element with Magic Mouse cursor helper to get instant answers tailored to your precise state.
            </p>
            <div style={{ marginTop: 24, padding: 16, background: "rgba(124,58,237,0.1)", borderRadius: 16, border: "1px solid rgba(124,58,237,0.25)" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#22D3EE", marginBottom: 4 }}>💬 Voice AI Coach Prompt:</div>
              <div style={{ fontSize: "0.9rem", color: "#FFF" }}>&ldquo;Adjust my meal plan for high protein budget prep under $4 today.&rdquo;</div>
            </div>
          </div>

          {/* Tile 2: Recovery & Sleep */}
          <div style={{
            gridColumn: "span 4", background: "#121218", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#22C55E", marginBottom: 12, fontWeight: 700 }}>
                <Activity size={20} />
                <span>WHOOP / Oura Recovery</span>
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>Recovery Score: 92%</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Optimal strain capacity. Prime day for heavy powerlifting PRs.</p>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <div style={{ flex: 1, padding: 12, background: "rgba(34,197,94,0.1)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#22C55E" }}>8h 24m</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Sleep Score 94</div>
              </div>
              <div style={{ flex: 1, padding: 12, background: "rgba(34,211,238,0.1)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#22D3EE" }}>68 ms</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>HRV Status</div>
              </div>
            </div>
          </div>

          {/* Tile 3: Nutrition Scanner */}
          <div style={{
            gridColumn: "span 5", background: "#121218", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 32
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#22D3EE", marginBottom: 12, fontWeight: 700 }}>
              <ScanLine size={20} />
              <span>Multimodal Vision Scanner</span>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>Photo &amp; Barcode Nutrition</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>
              Gemini 2.5 Flash photo recognition verified against <strong>USDA FoodData Central</strong> + <strong>Open Food Facts</strong> 2M+ product barcode database.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: 20, background: "rgba(34,211,238,0.15)", color: "#22D3EE" }}>📸 Photo AI</span>
              <span style={{ fontSize: "0.75rem", padding: "4px 12px", borderRadius: 20, background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>📦 Barcode API</span>
            </div>
          </div>

          {/* Tile 4: Workout Tracking */}
          <div style={{
            gridColumn: "span 7", background: "#121218", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 32
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#EC4899", marginBottom: 12, fontWeight: 700 }}>
              <Dumbbell size={20} />
              <span>Custom Workout Studio</span>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8 }}>Netflix-Style Routines &amp; Live Timer</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 16 }}>
              Build consecutive day-to-day routines, customize sets &amp; reps, track live session stopwatch time, and log total volume lifted in kg.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["Strength", "Cardio", "HIIT", "Yoga", "Pilates", "Mobility"].map(cat => (
                <span key={cat} style={{ fontSize: "0.78rem", padding: "6px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Wearables Integration Showcase ── */}
      <section id="wearables" style={{ padding: "60px 24px", background: "#0D0D12", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: "#22C55E", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Seamless Ecosystem Sync
          </span>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: 8, marginBottom: 32 }}>
            Connected to All Your Health Devices
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { name: "Apple Health", icon: "🍏", desc: "Background Step & Calorie Sync" },
              { name: "Google Health Connect", icon: "🤖", desc: "Android Native Biometrics" },
              { name: "WHOOP Strap", icon: "⚡", desc: "Strain & Recovery Integration" },
              { name: "Oura Ring", icon: "💍", desc: "Sleep Stage & Body Temp" },
            ].map(w => (
              <div key={w.name} style={{
                background: "#141420", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: "20px 28px", width: 220, textAlign: "center"
              }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{w.icon}</div>
                <div style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>{w.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers Section ── */}
      <section id="pricing" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: "#22D3EE", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Transparent Plans
          </span>
          <h2 style={{ fontSize: "2.8rem", fontWeight: 800, marginTop: 8 }}>
            Invest in Your Health Performance
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {/* Free Tier */}
          <div style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32 }}>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 4 }}>Starter</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>$0 <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/forever</span></div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>Essential workout tracking and basic AI nutrition scanner.</p>
            <Link href="/signup" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", borderRadius: 12, padding: 12, fontWeight: 700 }}>
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div style={{ background: "#141424", border: "2px solid #7C3AED", borderRadius: 24, padding: 32, position: "relative", boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}>
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--gradient-primary)", padding: "4px 16px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 800 }}>MOST POPULAR</div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 4, color: "#7C3AED" }}>TrainIQ Pro</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>$14 <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/month</span></div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>Full Gemini 2.5 vision scanner, WHOOP recovery score &amp; Unlimited AI Voice Coach.</p>
            <Link href="/signup" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: 12, padding: 12, fontWeight: 800, background: "var(--gradient-primary)" }}>
              Get TrainIQ Pro
            </Link>
          </div>

          {/* Elite Tier */}
          <div style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32 }}>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 4, color: "#22D3EE" }}>TrainIQ Elite</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>$29 <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/month</span></div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24 }}>1-on-1 AI human coach synthesis, priority API routing &amp; custom data export.</p>
            <Link href="/signup" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", borderRadius: 12, padding: 12, fontWeight: 700 }}>
              Join Elite
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" style={{ padding: "60px 24px 100px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { q: "How does the Multimodal Food Scanner work?", a: "Simply upload a meal photo or scan a product barcode. Gemini 2.5 Flash identifies food items in the image, then queries USDA FoodData Central and Open Food Facts (2M+ products) for exact calories and macronutrients." },
            { q: "Can I sync Apple Health & Google Health Connect?", a: "Yes! TrainIQ automatically syncs steps, active calories, heart rate, and sleep data seamlessly in real-time." },
            { q: "Is the AI Voice Coach available in multiple languages?", a: "Yes, TrainIQ Voice Coach automatically detects and responds in both English and Bangla with natural text-to-speech audio guidance." },
            { q: "Can I customize my own workout routines?", a: "Absolutely. Use our Custom Workout Studio to build consecutive day-to-day routines, set target reps & weights, and track live stopwatch session duration." }
          ].map((item, idx) => (
            <div key={idx} style={{ background: "#121218", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: "100%", padding: "20px 24px", background: "none", border: "none",
                  color: "#FFF", textAlign: "left", fontWeight: 700, fontSize: "1rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
                }}
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} style={{ color: "#7C3AED" }} /> : <ChevronDown size={18} style={{ color: "var(--text-muted)" }} />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: "0 24px 20px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "40px 32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12, textDecoration: "none", color: "inherit", cursor: "pointer" }}>
          <img
            src="/trainiq-logo.png"
            alt="TrainIQ Logo"
            style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(34, 197, 94, 0.3)" }}
          />
          <span style={{ fontWeight: 800, color: "#FFF", fontSize: "1.1rem" }}>TrainIQ</span>
        </Link>
        <p>&copy; {new Date().getFullYear()} TrainIQ Inc. All rights reserved. Powered by Gemini 2.5 &amp; Groq AI.</p>
      </footer>
    </div>
  );
}
