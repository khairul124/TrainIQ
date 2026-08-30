"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, User, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/dbService";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");

    if (!isSupabaseConfigured()) {
      // Set demo mode cookie
      document.cookie = "demo_mode=true; path=/; max-age=86400";
      
      // Seed user profile locally if needed
      if (typeof window !== "undefined") {
        const defaultProfile = {
          id: 'demo-user-id',
          username: email.split('@')[0] || 'demouser',
          full_name: name || 'Demo User',
          avatar_url: null,
          date_of_birth: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          fitness_level: 'beginner',
          fitness_goal: 'general_fitness',
          daily_calorie_target: 2000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('fitnessgpt_profile', JSON.stringify(defaultProfile));
      }
      
      router.push("/dashboard");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    } catch { setError("Something went wrong"); setLoading(false); }
  };

  const handleDemoSignup = () => {
    document.cookie = "demo_mode=true; path=/; max-age=86400";
    router.push("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="liquid-glass-card animate-fade">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
            <img
              src="/trainiq-logo.png"
              alt="TrainIQ Logo"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid rgba(34, 197, 94, 0.4)",
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
              }}
            />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.5px", background: "linear-gradient(135deg, #FFF 50%, #22C55E 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TrainIQ</span>
          </Link>
        </div>

        <h1>Create Account</h1>
        <p className="subtitle">Start your Liquid Glass AI fitness journey</p>

        {!isSupabaseConfigured() && (
          <div style={{ 
            background: "rgba(108,99,255,0.12)", 
            border: "1px solid rgba(108,99,255,0.3)", 
            borderRadius: 12, 
            padding: "12px 16px", 
            color: "#A29BFF", 
            fontSize: "0.85rem", 
            marginBottom: 20,
            textAlign: "center",
            backdropFilter: "blur(10px)"
          }}>
            ⚡ Running in Demo Mode (Supabase Auth optional)
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(255,107,107,0.12)",
            border: "1px solid rgba(255,107,107,0.35)",
            borderRadius: 12,
            padding: "12px 16px",
            color: "#FF6B6B",
            fontSize: "0.85rem",
            marginBottom: 20,
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSignup}>
          <div className="input-group">
            <label style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="liquid-input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="liquid-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 42 }} required />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="liquid-input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 42, paddingRight: 42 }} minLength={8} required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="liquid-btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "22px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        <button className="liquid-btn-secondary" onClick={handleDemoSignup}>
          🚀 Instant Demo Mode Access
        </button>

        <div style={{ textAlign: "center", marginTop: 22, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

