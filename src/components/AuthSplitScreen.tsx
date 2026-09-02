"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthSplitScreenProps {
  initialMode?: "signin" | "signup";
}

export default function AuthSplitScreen({ initialMode = "signin" }: AuthSplitScreenProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // Handle Mode Switch
  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newMode === "signin" ? "/login" : "/signup");
    }
  };

  // Sign In with Email/Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please verify your credentials.");
      setLoading(false);
    }
  };

  // Sign Up with Email/Password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError, data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim() || "Athlete",
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/dashboard");
      } else {
        setSuccessMsg("Account created successfully! Check your email to confirm or sign in.");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please check your connection.");
      setLoading(false);
    }
  };

  // Google OAuth with Google Sheets Scopes
  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError("");

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initialize Google Authentication.");
      setGoogleLoading(false);
    }
  };

  // Instant Demo Mode Access
  const handleDemoAccess = () => {
    document.cookie = "demo_mode=true; path=/; max-age=86400";
    router.push("/dashboard");
  };

  // Forgot Password Trigger
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotStatus(null);

    try {
      const supabase = createClient();
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      });

      if (resetErr) {
        setForgotStatus(`Error: ${resetErr.message}`);
      } else {
        setForgotStatus("Password reset instructions sent! Please check your inbox.");
      }
    } catch {
      setForgotStatus("Failed to send reset link. Please try again later.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="trainiq-auth-wrapper">
      {/* ============================================================ */}
      {/* LEFT SIDE — 55% BLACK & WHITE GYM PHOTOGRAPH HERO            */}
      {/* ============================================================ */}
      <aside className="trainiq-auth-hero" aria-label="TrainIQ Brand Visual">
        {/* Background Gym Photograph */}
        <img
          src="/gym-hero.png"
          alt="TrainIQ Strength Training Facility"
          className="trainiq-hero-image"
        />

        {/* Minimal Subtle Vignette (preserves original B&W equipment clarity) */}
        <div className="trainiq-hero-vignette" />

        {/* Top Branding Section */}
        <div className="trainiq-hero-brand">
          <Link href="/" className="trainiq-brand-link">
            <img
              src="/trainiq-logo.png"
              alt="TrainIQ Logo"
              className="trainiq-brand-logo"
            />
            <div className="trainiq-brand-text">
              <span className="trainiq-brand-title">TRAINIQ</span>
              <span className="trainiq-brand-tagline">Train Smarter. Transform Faster.</span>
            </div>
          </Link>
        </div>

        {/* Bottom Motivational Content */}
        <div className="trainiq-hero-footer">
          <div className="trainiq-hero-quote-box">
            <span className="trainiq-hero-quote-bar" />
            <div>
              <p className="trainiq-hero-quote">
                &ldquo;Build strength. Build discipline. Become your best.&rdquo;
              </p>
              <p className="trainiq-hero-quote-sub">
                AI Form Tracking &bull; WHOOP &amp; Oura Sync &bull; Google Sheets Engine
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* RIGHT SIDE — 45% PREMIUM MINIMAL AUTHENTICATION             */}
      {/* ============================================================ */}
      <main className="trainiq-auth-main">
        {/* Mobile Header Banner (visible only on phones) */}
        <div className="trainiq-mobile-brand">
          <Link href="/" className="trainiq-brand-link">
            <img
              src="/trainiq-logo.png"
              alt="TrainIQ Logo"
              className="trainiq-brand-logo-small"
            />
            <span className="trainiq-brand-title">TRAINIQ</span>
          </Link>
        </div>

        <div className="trainiq-auth-container">
          {/* Top Pill Toggle: [ Sign In ] [ Sign Up ] */}
          <div className="trainiq-toggle-container" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              onClick={() => switchMode("signin")}
              className={`trainiq-toggle-pill ${mode === "signin" ? "active" : ""}`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={`trainiq-toggle-pill ${mode === "signup" ? "active" : ""}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Header */}
          <div className="trainiq-form-header">
            <h1 className="trainiq-heading">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="trainiq-subheading">
              {mode === "signin"
                ? "Continue your training journey."
                : "Start your journey with TrainIQ."}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="trainiq-google-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>
              {googleLoading
                ? "Connecting with Google..."
                : mode === "signin"
                ? "Continue with Google (Syncs to Sheets)"
                : "Sign up with Google (Syncs to Sheets)"}
            </span>
          </button>

          {/* Divider */}
          <div className="trainiq-divider">
            <span className="trainiq-divider-line" />
            <span className="trainiq-divider-text">
              or {mode === "signin" ? "sign in" : "sign up"} with email
            </span>
            <span className="trainiq-divider-line" />
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="trainiq-alert error animate-fade" role="alert">
              <AlertCircle size={17} className="trainiq-alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="trainiq-alert success animate-fade" role="status">
              <CheckCircle2 size={17} className="trainiq-alert-icon" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dynamic Form Area with Smooth Transition */}
          <div className="trainiq-form-card">
            {mode === "signin" ? (
              /* ================= SIGN IN FORM ================= */
              <form onSubmit={handleSignIn} className="trainiq-form animate-fade">
                <div className="trainiq-field">
                  <label htmlFor="signin-email" className="trainiq-label">
                    Email Address
                  </label>
                  <div className="trainiq-input-box">
                    <Mail size={17} className="trainiq-input-icon" />
                    <input
                      id="signin-email"
                      type="email"
                      className="trainiq-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="trainiq-field">
                  <div className="trainiq-label-row">
                    <label htmlFor="signin-password" className="trainiq-label">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotEmail(email);
                        setForgotStatus(null);
                      }}
                      className="trainiq-forgot-link"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="trainiq-input-box">
                    <Lock size={17} className="trainiq-input-icon" />
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      className="trainiq-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="trainiq-pw-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="trainiq-submit-btn"
                >
                  {loading ? (
                    <span className="trainiq-btn-loading">
                      <span className="trainiq-spinner" /> Signing in...
                    </span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            ) : (
              /* ================= SIGN UP FORM ================= */
              <form onSubmit={handleSignUp} className="trainiq-form animate-fade">
                <div className="trainiq-field">
                  <label htmlFor="signup-name" className="trainiq-label">
                    Full Name
                  </label>
                  <div className="trainiq-input-box">
                    <User size={17} className="trainiq-input-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      className="trainiq-input"
                      placeholder="Alexander Cole"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                <div className="trainiq-field">
                  <label htmlFor="signup-email" className="trainiq-label">
                    Email Address
                  </label>
                  <div className="trainiq-input-box">
                    <Mail size={17} className="trainiq-input-icon" />
                    <input
                      id="signup-email"
                      type="email"
                      className="trainiq-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="trainiq-field">
                  <label htmlFor="signup-password" className="trainiq-label">
                    Password
                  </label>
                  <div className="trainiq-input-box">
                    <Lock size={17} className="trainiq-input-icon" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      className="trainiq-input"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="trainiq-pw-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="trainiq-field">
                  <label htmlFor="signup-confirm" className="trainiq-label">
                    Confirm Password
                  </label>
                  <div className="trainiq-input-box">
                    <Lock size={17} className="trainiq-input-icon" />
                    <input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      className="trainiq-input"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="trainiq-pw-toggle"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="trainiq-submit-btn"
                >
                  {loading ? (
                    <span className="trainiq-btn-loading">
                      <span className="trainiq-spinner" /> Creating account...
                    </span>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Instant Demo Mode Option */}
          <div className="trainiq-demo-section">
            <div className="trainiq-demo-divider">
              <span>or test immediately</span>
            </div>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="trainiq-demo-btn"
            >
              <Sparkles size={15} style={{ color: "#22D3EE" }} />
              <span>Instant Demo Mode Access</span>
            </button>
          </div>

          {/* Bottom Switch Link */}
          <div className="trainiq-footer-switch">
            {mode === "signin" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="trainiq-switch-link"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="trainiq-switch-link"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* FORGOT PASSWORD MODAL                                        */}
      {/* ============================================================ */}
      {showForgotModal && (
        <div className="trainiq-modal-overlay animate-fade">
          <div className="trainiq-modal-card">
            <h3 className="trainiq-modal-title">Reset Password</h3>
            <p className="trainiq-modal-desc">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>

            {forgotStatus && (
              <div
                className={`trainiq-alert ${forgotStatus.startsWith("Error") ? "error" : "success"}`}
                style={{ marginBottom: 16 }}
              >
                <span>{forgotStatus}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="trainiq-field" style={{ marginBottom: 20 }}>
                <label className="trainiq-label">Your Email</label>
                <div className="trainiq-input-box">
                  <Mail size={16} className="trainiq-input-icon" />
                  <input
                    type="email"
                    className="trainiq-input"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="trainiq-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="trainiq-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="trainiq-modal-confirm"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCOPED COMPONENT STYLING                                     */}
      {/* ============================================================ */}
      <style jsx>{`
        /* ── Split Screen Wrapper ── */
        .trainiq-auth-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background: #09090B;
          color: #EDEDED;
          font-family: var(--font-body, "Inter", system-ui, sans-serif);
          overflow-x: hidden;
        }

        /* ── Left Side: 55% Gym Photograph Hero ── */
        .trainiq-auth-hero {
          position: relative;
          width: 55%;
          min-height: 100vh;
          overflow: hidden;
          background: #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
        }

        .trainiq-hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          /* Preserves pure crisp black-and-white look */
          filter: grayscale(100%) contrast(108%) brightness(96%);
          z-index: 1;
        }

        /* Subtle gradient overlay: darkens ONLY top and bottom for readability */
        .trainiq-hero-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.15) 30%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.85) 100%
          );
          pointer-events: none;
        }

        /* Hero Brand Top */
        .trainiq-hero-brand {
          position: relative;
          z-index: 3;
        }

        .trainiq-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: #FFF;
        }

        .trainiq-brand-logo {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 24px rgba(34, 197, 94, 0.35);
        }

        .trainiq-brand-logo-small {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
        }

        .trainiq-brand-text {
          display: flex;
          flex-direction: column;
        }

        .trainiq-brand-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-weight: 800;
          font-size: 1.7rem;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .trainiq-brand-tagline {
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.78);
          letter-spacing: 0.02em;
          margin-top: 3px;
        }

        /* Hero Footer Bottom */
        .trainiq-hero-footer {
          position: relative;
          z-index: 3;
          max-width: 520px;
        }

        .trainiq-hero-quote-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: rgba(12, 12, 16, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 20px 24px;
          border-radius: 16px;
        }

        .trainiq-hero-quote-bar {
          width: 3px;
          height: 44px;
          background: #22C55E;
          border-radius: 2px;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
          flex-shrink: 0;
        }

        .trainiq-hero-quote {
          font-size: 1.05rem;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 1.45;
          letter-spacing: -0.01em;
        }

        .trainiq-hero-quote-sub {
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 6px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── Right Side: 45% Authentication ── */
        .trainiq-auth-main {
          width: 45%;
          min-height: 100vh;
          background: #0B0B0F;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          position: relative;
        }

        .trainiq-mobile-brand {
          display: none;
          margin-bottom: 28px;
        }

        .trainiq-auth-container {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
        }

        /* ── Top Pill Toggle [ Sign In ] [ Sign Up ] ── */
        .trainiq-toggle-container {
          display: flex;
          background: #15151C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 32px;
        }

        .trainiq-toggle-pill {
          flex: 1;
          padding: 10px 16px;
          border-radius: 9px;
          background: transparent;
          border: none;
          color: #8E8E9F;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }

        .trainiq-toggle-pill:hover {
          color: #FFF;
        }

        .trainiq-toggle-pill.active {
          background: #23232E;
          color: #FFF;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        /* ── Form Header ── */
        .trainiq-form-header {
          margin-bottom: 24px;
        }

        .trainiq-heading {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .trainiq-subheading {
          font-size: 0.95rem;
          color: #8E8E9F;
          line-height: 1.4;
        }

        /* ── Google OAuth Button ── */
        .trainiq-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 13px 20px;
          border-radius: 12px;
          background: #14141B;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .trainiq-google-btn:hover:not(:disabled) {
          background: #1A1A24;
          border-color: rgba(255, 255, 255, 0.22);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
        }

        .trainiq-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ── Divider ── */
        .trainiq-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 22px 0;
        }

        .trainiq-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .trainiq-divider-text {
          font-size: 0.8rem;
          color: #71717A;
          text-transform: lowercase;
        }

        /* ── Alert Notifications ── */
        .trainiq-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.86rem;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .trainiq-alert.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #F87171;
        }

        .trainiq-alert.success {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ADE80;
        }

        .trainiq-alert-icon {
          flex-shrink: 0;
        }

        /* ── Form Inputs ── */
        .trainiq-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .trainiq-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .trainiq-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #D4D4D8;
        }

        .trainiq-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .trainiq-forgot-link {
          background: none;
          border: none;
          color: #A1A1AA;
          font-size: 0.82rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .trainiq-forgot-link:hover {
          color: #FFF;
          text-decoration: underline;
        }

        .trainiq-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .trainiq-input-icon {
          position: absolute;
          left: 15px;
          color: #71717A;
          pointer-events: none;
        }

        .trainiq-input {
          width: 100%;
          height: 48px;
          padding: 0 16px 0 44px;
          background: #14141B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #FFFFFF;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.25s ease;
        }

        .trainiq-input:focus {
          border-color: #22C55E;
          background: #171720;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }

        .trainiq-input::placeholder {
          color: #52525B;
        }

        .trainiq-pw-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #71717A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .trainiq-pw-toggle:hover {
          color: #D4D4D8;
        }

        /* ── Submit Button ── */
        .trainiq-submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 11px;
          background: #FFFFFF;
          border: none;
          color: #000000;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 6px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trainiq-submit-btn:hover:not(:disabled) {
          background: #F4F4F5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }

        .trainiq-submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .trainiq-btn-loading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trainiq-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── Demo Section ── */
        .trainiq-demo-section {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .trainiq-demo-divider {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .trainiq-demo-divider span {
          font-size: 0.75rem;
          color: #52525B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .trainiq-demo-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 11px;
          color: #D4D4D8;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .trainiq-demo-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(34, 211, 238, 0.3);
          color: #FFF;
        }

        /* ── Footer Switch ── */
        .trainiq-footer-switch {
          margin-top: 26px;
          text-align: center;
          font-size: 0.88rem;
          color: #8E8E9F;
        }

        .trainiq-switch-link {
          background: none;
          border: none;
          color: #22C55E;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          padding: 0 4px;
          transition: color 0.2s;
        }

        .trainiq-switch-link:hover {
          color: #4ADE80;
          text-decoration: underline;
        }

        /* ── Modal Overlay ── */
        .trainiq-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .trainiq-modal-card {
          width: 100%;
          max-width: 420px;
          background: #14141B;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .trainiq-modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #FFF;
          margin-bottom: 8px;
        }

        .trainiq-modal-desc {
          font-size: 0.88rem;
          color: #8E8E9F;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .trainiq-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .trainiq-modal-cancel {
          padding: 10px 18px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9px;
          color: #D4D4D8;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .trainiq-modal-cancel:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #FFF;
        }

        .trainiq-modal-confirm {
          padding: 10px 20px;
          background: #22C55E;
          border: none;
          border-radius: 9px;
          color: #000;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .trainiq-modal-confirm:hover:not(:disabled) {
          background: #16A34A;
        }

        /* ============================================================ */
        /* RESPONSIVENESS & BREAKPOINTS                                 */
        /* ============================================================ */

        /* Tablet (768px - 1024px) */
        @media (max-width: 1024px) {
          .trainiq-auth-hero {
            width: 45%;
            padding: 36px;
          }
          .trainiq-auth-main {
            width: 55%;
            padding: 36px 28px;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 768px) {
          .trainiq-auth-wrapper {
            flex-direction: column;
            overflow-y: auto;
          }

          /* Compact top image banner on phone */
          .trainiq-auth-hero {
            width: 100%;
            min-height: 220px;
            height: 220px;
            padding: 24px;
            justify-content: flex-end;
          }

          .trainiq-hero-footer {
            display: none;
          }

          .trainiq-hero-brand {
            margin-bottom: auto;
          }

          .trainiq-brand-logo {
            width: 44px;
            height: 44px;
          }

          .trainiq-brand-title {
            font-size: 1.45rem;
          }

          .trainiq-brand-tagline {
            font-size: 0.78rem;
          }

          /* Main Auth Form */
          .trainiq-auth-main {
            width: 100%;
            min-height: auto;
            padding: 32px 20px 60px;
            justify-content: flex-start;
          }

          .trainiq-mobile-brand {
            display: none; /* Already visible in top hero banner */
          }

          .trainiq-auth-container {
            max-width: 100%;
          }

          .trainiq-heading {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
