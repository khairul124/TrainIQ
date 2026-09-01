"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    } catch { setError("Something went wrong during account creation. Please check your Supabase configuration."); setLoading(false); }
  };

  const handleGoogleSignup = async () => {
    setLoading(true); setError("");

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
          },
        },
      });
    } catch {
      setError("Failed to initialize Google Sign In");
      setLoading(false);
    }
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
        <p className="subtitle">Start your AI fitness journey with Google Sheets Sync</p>

        {/* ── Google Sign Up Button ── */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "13px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#FFF",
            fontSize: "0.92rem",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 20,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Sign up with Google (Syncs to Google Sheets)
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, color: "var(--text-muted)", fontSize: "0.8rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

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

        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
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
