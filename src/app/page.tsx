"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  Activity,
  Dumbbell,
  Bot,
  Utensils,
  TrendingUp,
  Shield,
  Menu,
  X,
  Play,
  RotateCcw,
  Zap,
} from "lucide-react";

// Goal selector data for Section 11
interface GoalData {
  id: string;
  title: string;
  weeklyTarget: string;
  calories: string;
  protein: string;
  focus: string;
  desc: string;
}

const GOALS: GoalData[] = [
  {
    id: "muscle",
    title: "BUILD MUSCLE",
    weeklyTarget: "4 WORKOUTS / WEEK",
    calories: "2,650 KCAL",
    protein: "180G PROTEIN",
    focus: "Hypertrophy & Progressive Overload",
    desc: "Targeted volume blocks optimized for myofibrillar protein synthesis and steady compound lift progression.",
  },
  {
    id: "fatloss",
    title: "LOSE FAT",
    weeklyTarget: "5 WORKOUTS / WEEK",
    calories: "2,100 KCAL",
    protein: "190G PROTEIN",
    focus: "Metabolic Conditioning & Lean Retention",
    desc: "High-density strength circuits combined with strict protein pacing to preserve lean tissue in a controlled deficit.",
  },
  {
    id: "strength",
    title: "GET STRONGER",
    weeklyTarget: "3-4 WORKOUTS / WEEK",
    calories: "2,800 KCAL",
    protein: "175G PROTEIN",
    focus: "Neuromuscular Power & Rate of Force",
    desc: "Low-rep heavy compound focus (Squat, Bench, Deadlift, Overhead Press) with auto-regulated RPE tracking.",
  },
  {
    id: "fitness",
    title: "IMPROVE FITNESS",
    weeklyTarget: "4 WORKOUTS / WEEK",
    calories: "2,400 KCAL",
    protein: "160G PROTEIN",
    focus: "Cardiovascular Threshold & Work Capacity",
    desc: "Hybrid programming combining functional multi-planar resistance training with aerobic base building.",
  },
  {
    id: "athletic",
    title: "ATHLETIC PERFORMANCE",
    weeklyTarget: "5 WORKOUTS / WEEK",
    calories: "2,750 KCAL",
    protein: "170G PROTEIN",
    focus: "Explosiveness, Agility & Movement Quality",
    desc: "Periodized athletic routines emphasizing rotational power, plyometrics, and functional kinetic chain integrity.",
  },
  {
    id: "health",
    title: "GENERAL HEALTH",
    weeklyTarget: "3 WORKOUTS / WEEK",
    calories: "2,250 KCAL",
    protein: "150G PROTEIN",
    focus: "Longevity, Joint Mobility & Postural Balance",
    desc: "Balanced full-body resistance training and daily step pacing engineered for sustainable lifelong vitality.",
  },
];

export default function TrainIQLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Section 05: Interactive Workout Tracker State
  const [workoutSet, setWorkoutSet] = useState(3);
  const totalSets = 4;
  const [workoutWeight, setWorkoutWeight] = useState(80);
  const [workoutReps, setWorkoutReps] = useState(8);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  // Section 11: Active Goal Personalization
  const [activeGoal, setActiveGoal] = useState<GoalData>(GOALS[0]);

  // Section 09: Streak Days Active
  const [streakDays, setStreakDays] = useState([true, true, true, true, true, true, true]);

  // Scroll detection for minimal navbar translucency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCompleteSet = () => {
    if (workoutSet < totalSets) {
      setWorkoutSet((prev) => prev + 1);
    } else {
      setWorkoutCompleted(true);
      setTimeout(() => {
        setWorkoutSet(1);
        setWorkoutCompleted(false);
      }, 2500);
    }
  };

  return (
    <div className="trainiq-landing">
      {/* ============================================================ */}
      {/* GLOBAL NAVIGATION                                            */}
      {/* ============================================================ */}
      <nav className={`trainiq-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Brand Left */}
          <Link href="/" className="nav-brand">
            <img
              src="/trainiq-logo.png"
              alt="TrainIQ Logo"
              className="nav-logo-img"
            />
            <span className="nav-brand-text">TRAINIQ</span>
          </Link>

          {/* Nav Center */}
          <div className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#workouts">Workouts</a>
            <a href="#ai-coach">AI Coach</a>
            <a href="#nutrition">Nutrition</a>
            <a href="#progress">Progress</a>
          </div>

          {/* Nav Right */}
          <div className="nav-actions">
            <Link href="/login" className="nav-btn-text">
              Sign In
            </Link>
            <Link href="/signup" className="nav-btn-primary">
              <span>Get Started</span>
              <ArrowUpRight size={15} />
            </Link>
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="nav-mobile-menu">
            <a href="#overview" onClick={() => setMobileMenuOpen(false)}>Overview</a>
            <a href="#workouts" onClick={() => setMobileMenuOpen(false)}>Workouts</a>
            <a href="#ai-coach" onClick={() => setMobileMenuOpen(false)}>AI Coach</a>
            <a href="#nutrition" onClick={() => setMobileMenuOpen(false)}>Nutrition</a>
            <a href="#progress" onClick={() => setMobileMenuOpen(false)}>Progress</a>
            <div className="nav-mobile-buttons">
              <Link href="/login" className="nav-btn-text" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="nav-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/* SECTION 01 — HERO (CINEMATIC B&W PHOTOGRAPH)                 */}
      {/* ============================================================ */}
      <header className="hero-section" id="overview">
        {/* Cinematic B&W Gym Background Image */}
        <div className="hero-bg-container">
          <img
            src="/gym-hero.png"
            alt="TrainIQ Strength Facility"
            className="hero-bg-img"
          />
          <div className="hero-vignette" />
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-meta">
            <span className="section-index-tag">01 / TRAINIQ</span>
            <div className="live-indicator">
              <span className="live-dot" />
              <span>AI COACH ACTIVE &bull; PERFORMANCE ENGINE READY</span>
            </div>
          </div>

          <h1 className="hero-headline">
            TRAIN SMARTER.<br />
            <span className="hero-headline-accent">PERFORM BETTER.</span>
          </h1>

          <p className="hero-subtext">
            An AI-powered fitness platform built around your workouts, nutrition,
            recovery, and real performance data. Your training. Your data. Your edge.
          </p>

          <div className="hero-cta-group">
            <Link href="/signup" className="btn-hero-primary">
              <span>START TRAINING</span>
              <ArrowRight size={17} />
            </Link>
            <a href="#problem" className="btn-hero-secondary">
              <span>EXPLORE TRAINIQ</span>
            </a>
          </div>

          {/* Quick Metrics Ticker at bottom of hero */}
          <div className="hero-footer-metrics">
            <div className="metric-item">
              <span className="metric-value">98.4%</span>
              <span className="metric-label">FORM ACCURACY</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">3.2×</span>
              <span className="metric-label">PROGRESSION SPEED</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">100%</span>
              <span className="metric-label">SHEETS AUTONOMY</span>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* SECTION 02 — THE PROBLEM                                     */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="problem">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">02 / THE PROBLEM</span>
            <span className="section-subtitle-tag">THE SYSTEM DEFICIT</span>
          </div>

          <div className="asymmetric-grid-2">
            <div className="grid-left-col">
              <h2 className="editorial-huge-title">
                MOST PEOPLE DON&apos;T NEED ANOTHER WORKOUT PLAN.
              </h2>
              <p className="editorial-lead-body">
                They need a system that understands them. TrainIQ brings training,
                nutrition, progress, and intelligent guidance together into one
                personalized fitness experience.
              </p>
            </div>

            <div className="grid-right-col">
              <div className="numbered-statements">
                <div className="statement-row">
                  <span className="statement-num">01</span>
                  <div className="statement-content">
                    <h3 className="statement-title">Random workouts create random results.</h3>
                    <p className="statement-desc">
                      Following static PDF routines or switching exercises without progressive overload
                      leaves your muscular adaptation to pure chance.
                    </p>
                  </div>
                </div>

                <div className="statement-row">
                  <span className="statement-num">02</span>
                  <div className="statement-content">
                    <h3 className="statement-title">Tracking without insight doesn&apos;t create progress.</h3>
                    <p className="statement-desc">
                      Logging numbers in notes apps without intelligent volume analysis, recovery correlation,
                      and automatic target recalculation is just busywork.
                    </p>
                  </div>
                </div>

                <div className="statement-row">
                  <span className="statement-num">03</span>
                  <div className="statement-content">
                    <h3 className="statement-title">Consistency becomes easier when your plan adapts to you.</h3>
                    <p className="statement-desc">
                      When your day changes, TrainIQ dynamically recalibrates your training session in seconds
                      rather than letting you skip it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 03 — TRAINIQ CORE FEATURES (THE SYSTEM)              */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="system">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">03 / THE SYSTEM</span>
            <span className="section-subtitle-tag">FOUR PILLARS OF PERFORMANCE</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 860, marginBottom: 56 }}>
            EVERYTHING YOU NEED TO LEVEL UP.
          </h2>

          <div className="features-editorial-grid">
            {/* Block 01 */}
            <div className="feature-editorial-card">
              <div className="card-top-meta">
                <span className="card-large-num">01</span>
                <Bot size={22} className="card-icon-accent" />
              </div>
              <h3 className="card-title">AI PERSONAL COACH</h3>
              <p className="card-desc">
                An intelligent coach that understands your goals, training history, performance, and progress.
              </p>
              <ul className="card-bullets">
                <li>Personalized recommendations</li>
                <li>Live session workout adjustments</li>
                <li>Real-time performance insights</li>
                <li>Intelligent progression pacing</li>
              </ul>
            </div>

            {/* Block 02 */}
            <div className="feature-editorial-card">
              <div className="card-top-meta">
                <span className="card-large-num">02</span>
                <Dumbbell size={22} className="card-icon-accent" />
              </div>
              <h3 className="card-title">SMART WORKOUTS</h3>
              <p className="card-desc">
                Build and follow structured workouts based on your goals with progressive overload baked in.
              </p>
              <ul className="card-bullets">
                <li>Curated biomechanical exercise library</li>
                <li>Real-time sets, reps &amp; RPE logging</li>
                <li>Precise rest intervals &amp; timers</li>
                <li>Automated progressive overload calculation</li>
              </ul>
            </div>

            {/* Block 03 */}
            <div className="feature-editorial-card">
              <div className="card-top-meta">
                <span className="card-large-num">03</span>
                <Utensils size={22} className="card-icon-accent" />
              </div>
              <h3 className="card-title">NUTRITION</h3>
              <p className="card-desc">
                Keep your nutrition strictly aligned with your training volume, expenditure, and goals.
              </p>
              <ul className="card-bullets">
                <li>Dynamic calorie &amp; macro targeting</li>
                <li>Photo food scanner vision analysis</li>
                <li>Meal timing &amp; protein distribution</li>
                <li>Hydration &amp; electrolyte insights</li>
              </ul>
            </div>

            {/* Block 04 */}
            <div className="feature-editorial-card">
              <div className="card-top-meta">
                <span className="card-large-num">04</span>
                <TrendingUp size={22} className="card-icon-accent" />
              </div>
              <h3 className="card-title">PERFORMANCE</h3>
              <p className="card-desc">
                Turn raw workout data into actionable, measurable athletic progress over time.
              </p>
              <ul className="card-bullets">
                <li>Strength progression curves</li>
                <li>Personal record (1RM) forecasting</li>
                <li>Weekly volume &amp; fatigue trends</li>
                <li>Direct private Google Sheets cloud sync</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 04 — AI COACH EXPERIENCE                             */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="ai-coach">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">04 / AI COACH</span>
            <span className="section-subtitle-tag">ADAPTIVE INTELLIGENCE</span>
          </div>

          <div className="asymmetric-grid-2" style={{ alignItems: "center" }}>
            <div className="grid-left-col">
              <h2 className="editorial-huge-title">
                A COACH THAT LEARNS HOW YOU TRAIN.
              </h2>
              <p className="editorial-lead-body">
                Static spreadsheets don&apos;t care if you slept 5 hours or have a tight schedule.
                TrainIQ adapts instantly — preserving the stimulus that drives muscle growth and strength.
              </p>
              <div className="coach-features-list">
                <div className="coach-feature-pill">
                  <Check size={14} className="accent-text" />
                  <span>Real-time session time adjustment</span>
                </div>
                <div className="coach-feature-pill">
                  <Check size={14} className="accent-text" />
                  <span>Injury &amp; equipment substitution</span>
                </div>
                <div className="coach-feature-pill">
                  <Check size={14} className="accent-text" />
                  <span>Autoregulation based on daily fatigue</span>
                </div>
              </div>
            </div>

            {/* Realistic AI Coach UI Mockup */}
            <div className="grid-right-col">
              <div className="ai-interface-card">
                <div className="ai-card-header">
                  <div className="ai-coach-avatar">
                    <Bot size={18} />
                  </div>
                  <div>
                    <span className="ai-coach-name">TRAINIQ AI COACH</span>
                    <span className="ai-coach-status">&bull; ONLINE &bull; GEMINI 2.5 ACTIVE</span>
                  </div>
                </div>

                {/* Conversation Body */}
                <div className="ai-dialogue-body">
                  {/* User Message */}
                  <div className="ai-bubble-user">
                    <p>&ldquo;I only have 35 minutes today.&rdquo;</p>
                    <span className="ai-timestamp">17:42</span>
                  </div>

                  {/* Assistant Message */}
                  <div className="ai-bubble-agent">
                    <p>
                      Let&apos;s shorten today&apos;s session without sacrificing your primary strength target.
                      I&apos;ve dropped accessory volume and condensed rest periods to keep mechanical tension high.
                    </p>

                    {/* Adjusted Plan Card */}
                    <div className="adjusted-plan-box">
                      <div className="adjusted-plan-header">
                        <span className="adjusted-plan-tag">TODAY&apos;S ADJUSTED SESSION</span>
                        <span className="adjusted-plan-time">ESTIMATED: 35 MIN</span>
                      </div>
                      <div className="adjusted-exercises">
                        <div className="adj-row">
                          <span className="adj-name">Bench Press</span>
                          <span className="adj-sets">3 &times; 6 reps</span>
                        </div>
                        <div className="adj-row">
                          <span className="adj-name">Incline Dumbbell Press</span>
                          <span className="adj-sets">3 &times; 8 reps</span>
                        </div>
                        <div className="adj-row">
                          <span className="adj-name">Cable Fly</span>
                          <span className="adj-sets">2 &times; 12 reps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 05 — WORKOUT EXPERIENCE (INTERACTIVE REP TRACKER)    */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="workouts">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">05 / TRAIN</span>
            <span className="section-subtitle-tag">PRECISION EXECUTION</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 860, marginBottom: 48 }}>
            EVERY REP COUNTS.
          </h2>

          <div className="asymmetric-grid-2" style={{ alignItems: "center" }}>
            {/* Interactive Live Workout HUD */}
            <div className="grid-left-col">
              <div className="workout-hud-card">
                <div className="hud-top-bar">
                  <div>
                    <span className="hud-muscle-target">CHEST + TRICEPS</span>
                    <h3 className="hud-exercise-name">BENCH PRESS</h3>
                  </div>
                  <div className="hud-progress-pill">
                    <span>PROGRESS: {Math.round((workoutSet / totalSets) * 100)}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="hud-progress-track">
                  <div
                    className="hud-progress-fill"
                    style={{ width: `${(workoutSet / totalSets) * 100}%` }}
                  />
                </div>

                {/* Set & Weight Metrics */}
                <div className="hud-metric-row">
                  <div className="hud-metric-box">
                    <span className="hud-metric-label">ACTIVE SET</span>
                    <span className="hud-metric-number">
                      SET 0{workoutSet} <span className="hud-sub">/ 0{totalSets}</span>
                    </span>
                  </div>
                  <div className="hud-metric-box">
                    <span className="hud-metric-label">TARGET WEIGHT</span>
                    <span className="hud-metric-number">{workoutWeight} KG</span>
                  </div>
                  <div className="hud-metric-box">
                    <span className="hud-metric-label">TARGET REPS</span>
                    <span className="hud-metric-number">{workoutReps} REPS</span>
                  </div>
                </div>

                {/* Rest Timer Banner */}
                <div className="hud-rest-banner">
                  <span className="rest-label">RECOMMENDED REST</span>
                  <span className="rest-timer">01:24</span>
                </div>

                {/* Interactive Action Button */}
                <button
                  type="button"
                  onClick={handleCompleteSet}
                  className="hud-complete-btn"
                >
                  {workoutCompleted ? (
                    <span className="btn-check-content">
                      <CheckCircle2 size={18} /> SET SAVED TO GOOGLE SHEETS!
                    </span>
                  ) : (
                    <span>[ COMPLETE SET 0{workoutSet} ]</span>
                  )}
                </button>
              </div>
            </div>

            <div className="grid-right-col">
              <div className="workout-explanation">
                <h3 className="explanation-title">Real-Time Progression Engine</h3>
                <p className="explanation-body">
                  No guesswork between sets. TrainIQ calculates your target weight and reps based on your last session&apos;s
                  Rate of Perceived Exertion (RPE).
                </p>
                <div className="explanation-features">
                  <div className="exp-item">
                    <span className="exp-bullet">&bull;</span>
                    <div>
                      <strong>Micro-Overload Increments:</strong> Auto-recommends +1.25kg to +2.5kg jumps as soon as rep ceilings are hit.
                    </div>
                  </div>
                  <div className="exp-item">
                    <span className="exp-bullet">&bull;</span>
                    <div>
                      <strong>Active Rest Counting:</strong> Sound &amp; haptic cues let you know precisely when your ATP-CP system has regenerated.
                    </div>
                  </div>
                  <div className="exp-item">
                    <span className="exp-bullet">&bull;</span>
                    <div>
                      <strong>Direct Cloud Sync:</strong> Each completed set is logged to your personal Google Sheet in the background.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 06 — PERSONALIZED DASHBOARD DATA                     */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="progress">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">06 / YOUR DATA</span>
            <span className="section-subtitle-tag">ANALYTIC DIRECTION</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 940, marginBottom: 56 }}>
            YOUR BODY LEAVES DATA. TRAINIQ TURNS IT INTO DIRECTION.
          </h2>

          <div className="dashboard-preview-container">
            <div className="dashboard-grid-stats">
              {/* Stat 1 */}
              <div className="dash-metric-card">
                <span className="dash-metric-tag">STRENGTH GAIN</span>
                <span className="dash-metric-val accent-text">+12.8%</span>
                <span className="dash-metric-sub">Past 30 Days Compound Index</span>
              </div>

              {/* Stat 2 */}
              <div className="dash-metric-card">
                <span className="dash-metric-tag">CONSISTENCY</span>
                <span className="dash-metric-val">87%</span>
                <span className="dash-metric-sub">Scheduled Sessions Met</span>
              </div>

              {/* Stat 3 */}
              <div className="dash-metric-card">
                <span className="dash-metric-tag">DAILY ENERGY</span>
                <span className="dash-metric-val">2,340</span>
                <span className="dash-metric-sub">/ 2,500 kcal Target</span>
              </div>

              {/* Stat 4 */}
              <div className="dash-metric-card">
                <span className="dash-metric-tag">PROTEIN PACING</span>
                <span className="dash-metric-val">164g</span>
                <span className="dash-metric-sub">/ 180g Daily Goal</span>
              </div>

              {/* Stat 5 */}
              <div className="dash-metric-card">
                <span className="dash-metric-tag">COMPLETED WORKOUTS</span>
                <span className="dash-metric-val">4 / 5</span>
                <span className="dash-metric-sub">This Week&apos;s Target</span>
              </div>
            </div>

            {/* Performance Trend Graph (Minimal SVG) */}
            <div className="performance-graph-box">
              <div className="graph-header">
                <div>
                  <span className="graph-title">COMPOUND STRENGTH PROGRESSION (SQUAT / BENCH / DEADLIFT)</span>
                  <p className="graph-desc">Normalized mechanical output vs. calculated volume load</p>
                </div>
                <span className="graph-badge">ALL-TIME HIGH</span>
              </div>

              <div className="graph-svg-wrapper">
                <svg viewBox="0 0 800 180" className="performance-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <path
                    d="M 0,160 Q 150,140 280,105 T 520,70 T 800,25 L 800,180 L 0,180 Z"
                    fill="url(#curveGradient)"
                  />
                  {/* Line */}
                  <path
                    d="M 0,160 Q 150,140 280,105 T 520,70 T 800,25"
                    fill="none"
                    stroke="#CCFF00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Milestone Dots */}
                  <circle cx="280" cy="105" r="5" fill="#CCFF00" />
                  <circle cx="520" cy="70" r="5" fill="#CCFF00" />
                  <circle cx="800" cy="25" r="6" fill="#CCFF00" />
                </svg>
              </div>

              <div className="graph-x-axis">
                <span>WEEK 01</span>
                <span>WEEK 04</span>
                <span>WEEK 08</span>
                <span>WEEK 12</span>
                <span>TODAY (PEAK)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 07 — PROGRESS TIMELINE                               */}
      {/* ============================================================ */}
      <section className="editorial-section border-top">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">07 / PROGRESS</span>
            <span className="section-subtitle-tag">MILESTONE TRAJECTORY</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 860, marginBottom: 56 }}>
            SEE THE WORK BECOME THE RESULT.
          </h2>

          <div className="progress-timeline-wrapper">
            <div className="timeline-months-bar">
              <span className="month-tag past">JAN</span>
              <span className="month-arrow">&rarr;</span>
              <span className="month-tag past">FEB</span>
              <span className="month-arrow">&rarr;</span>
              <span className="month-tag past">MAR</span>
              <span className="month-arrow">&rarr;</span>
              <span className="month-tag past">APR</span>
              <span className="month-arrow">&rarr;</span>
              <span className="month-tag current">MAY</span>
              <span className="month-arrow">&rarr;</span>
              <span className="month-tag future">JUN</span>
            </div>

            <div className="milestones-grid">
              <div className="milestone-card">
                <span className="milestone-badge">MILESTONE 01</span>
                <h3 className="milestone-title">FIRST 100 KG BENCH</h3>
                <p className="milestone-desc">Achieved in Week 7 after progressive 2.5kg wave cycle.</p>
              </div>

              <div className="milestone-card">
                <span className="milestone-badge">MILESTONE 02</span>
                <h3 className="milestone-title">27-DAY WORKOUT STREAK</h3>
                <p className="milestone-desc">Zero missed recovery windows and steady daily protein pacing.</p>
              </div>

              <div className="milestone-card">
                <span className="milestone-badge">MILESTONE 03</span>
                <h3 className="milestone-title">NEW PERSONAL RECORD</h3>
                <p className="milestone-desc">210 kg Deadlift verified with clean bar velocity.</p>
              </div>

              <div className="milestone-card">
                <span className="milestone-badge">MILESTONE 04</span>
                <h3 className="milestone-title">50 COMPLETED SESSIONS</h3>
                <p className="milestone-desc">All historical lifting logs automatically archived to Google Sheets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 08 — NUTRITION DASHBOARD                             */}
      {/* ============================================================ */}
      <section className="editorial-section border-top" id="nutrition">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">08 / NUTRITION</span>
            <span className="section-subtitle-tag">FUEL &amp; COMPOSITION</span>
          </div>

          <div className="asymmetric-grid-2">
            <div className="grid-left-col">
              <h2 className="editorial-huge-title">
                YOU CAN&apos;T OUTTRAIN YOUR NUTRITION.
              </h2>
              <p className="editorial-lead-body">
                TrainIQ pairs precision macro pacing with your exact workout energy expenditure.
                Snap photos of meals to let our Gemini Vision engine log ingredients and macros instantly.
              </p>

              <div className="macro-breakdown-row">
                <div className="macro-pill">
                  <span className="macro-name">CALORIES</span>
                  <span className="macro-val">2,340</span>
                </div>
                <div className="macro-pill">
                  <span className="macro-name">PROTEIN</span>
                  <span className="macro-val accent-text">164g</span>
                </div>
                <div className="macro-pill">
                  <span className="macro-name">CARBS</span>
                  <span className="macro-val">210g</span>
                </div>
                <div className="macro-pill">
                  <span className="macro-name">FATS</span>
                  <span className="macro-val">72g</span>
                </div>
              </div>
            </div>

            {/* Meal Cards Display */}
            <div className="grid-right-col">
              <div className="meals-editorial-stack">
                <div className="meal-card-item">
                  <div className="meal-time-tag">08:00 &bull; BREAKFAST</div>
                  <h4 className="meal-dish">Oatmeal with Whey &amp; Blueberries</h4>
                  <span className="meal-macros">580 kcal &bull; 44g Protein &bull; 68g Carbs &bull; 12g Fat</span>
                </div>

                <div className="meal-card-item">
                  <div className="meal-time-tag">13:15 &bull; LUNCH</div>
                  <h4 className="meal-dish">Grilled Chicken Breast, Brown Rice &amp; Broccoli</h4>
                  <span className="meal-macros">720 kcal &bull; 56g Protein &bull; 75g Carbs &bull; 16g Fat</span>
                </div>

                <div className="meal-card-item">
                  <div className="meal-time-tag">19:30 &bull; DINNER</div>
                  <h4 className="meal-dish">Atlantic Salmon with Roasted Sweet Potatoes</h4>
                  <span className="meal-macros">680 kcal &bull; 46g Protein &bull; 52g Carbs &bull; 28g Fat</span>
                </div>

                <div className="meal-card-item">
                  <div className="meal-time-tag">21:45 &bull; POST-WORKOUT SNACK</div>
                  <h4 className="meal-dish">Greek Yogurt with Chia Seeds &amp; Almonds</h4>
                  <span className="meal-macros">360 kcal &bull; 28g Protein &bull; 15g Carbs &bull; 16g Fat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 09 — ACCOUNTABILITY / CONSISTENCY                    */}
      {/* ============================================================ */}
      <section className="editorial-section border-top">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">09 / CONSISTENCY</span>
            <span className="section-subtitle-tag">HABIT DISCIPLINE</span>
          </div>

          <div className="streak-editorial-card">
            <div className="streak-meta-col">
              <span className="streak-small-label">DISCIPLINE OVER INTENSITY</span>
              <h2 className="streak-huge-title">
                MOTIVATION GETS YOU STARTED. CONSISTENCY CHANGES YOU.
              </h2>
              <div className="streak-stats-row">
                <div className="streak-stat-item">
                  <span className="stat-number accent-text">27 DAYS</span>
                  <span className="stat-label">CURRENT ACTIVE STREAK</span>
                </div>
                <div className="streak-stat-item">
                  <span className="stat-number">4 / 5</span>
                  <span className="stat-label">WORKOUTS THIS WEEK</span>
                </div>
                <div className="streak-stat-item">
                  <span className="stat-number">92%</span>
                  <span className="stat-label">MONTHLY ADHERENCE</span>
                </div>
              </div>
            </div>

            {/* Interactive Day Grid */}
            <div className="streak-calendar-box">
              <div className="calendar-header">
                <span>WEEK 04 &bull; CURRENT COMMITMENT</span>
                <span className="streak-fire">
                  <Flame size={16} className="accent-text" /> 27 DAY ACTIVE
                </span>
              </div>
              <div className="days-row">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <div key={idx} className="day-box">
                    <span className="day-name">{day}</span>
                    <div className="day-check active">
                      <Check size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10 — HOW TRAINIQ WORKS (5 EDITORIAL STEPS)           */}
      {/* ============================================================ */}
      <section className="editorial-section border-top">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">10 / HOW IT WORKS</span>
            <span className="section-subtitle-tag">THE 5-STEP LOOP</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 860, marginBottom: 56 }}>
            AN ADAPTIVE PERFORMANCE PROTOCOL.
          </h2>

          <div className="steps-editorial-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3 className="step-title">SET YOUR GOAL</h3>
              <p className="step-desc">
                Tell TrainIQ your target (hypertrophy, fat loss, raw strength, or athletic conditioning).
              </p>
            </div>

            <div className="step-card">
              <span className="step-num">02</span>
              <h3 className="step-title">TRAIN</h3>
              <p className="step-desc">
                Follow intelligent progressive overload sessions structured around your exact equipment.
              </p>
            </div>

            <div className="step-card">
              <span className="step-num">03</span>
              <h3 className="step-title">TRACK</h3>
              <p className="step-desc">
                Every rep, kilo, food item, and sleep metric automatically converts into real performance data.
              </p>
            </div>

            <div className="step-card">
              <span className="step-num">04</span>
              <h3 className="step-title">ADAPT</h3>
              <p className="step-desc">
                TrainIQ continuously adjusts volume and calories based on your body&apos;s real biofeedback.
              </p>
            </div>

            <div className="step-card">
              <span className="step-num">05</span>
              <h3 className="step-title">PROGRESS</h3>
              <p className="step-desc">
                Watch personal records compound week after week with undeniable, measurable proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11 — DYNAMIC PERSONALIZATION                         */}
      {/* ============================================================ */}
      <section className="editorial-section border-top">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">11 / PERSONALIZATION</span>
            <span className="section-subtitle-tag">INDIVIDUAL ARCHITECTURE</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 940, marginBottom: 44 }}>
            NO TWO ATHLETES SHOULD TRAIN THE SAME WAY.
          </h2>

          <p className="editorial-lead-body" style={{ marginBottom: 40 }}>
            Select your primary objective to see how the TrainIQ engine automatically recalibrates
            volume, frequency, and macro targets:
          </p>

          {/* Goal Selectors (Pills) */}
          <div className="goal-selector-pills">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setActiveGoal(goal)}
                className={`goal-pill ${activeGoal.id === goal.id ? "active" : ""}`}
              >
                {goal.title}
              </button>
            ))}
          </div>

          {/* Dynamic Active Goal Card */}
          <div className="active-goal-display">
            <div className="goal-meta-col">
              <span className="goal-protocol-tag">SELECTED PROTOCOL &bull; {activeGoal.title}</span>
              <h3 className="goal-focus-title">{activeGoal.focus}</h3>
              <p className="goal-desc-body">{activeGoal.desc}</p>
            </div>

            <div className="goal-specs-grid">
              <div className="spec-card">
                <span className="spec-label">WEEKLY TARGET</span>
                <span className="spec-value">{activeGoal.weeklyTarget}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">CALORIE BASE</span>
                <span className="spec-value">{activeGoal.calories}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">PROTEIN FLOOR</span>
                <span className="spec-value accent-text">{activeGoal.protein}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 12 — SOCIAL PROOF / RESULTS                          */}
      {/* ============================================================ */}
      <section className="editorial-section border-top">
        <div className="editorial-container">
          <div className="section-header-row">
            <span className="section-index-tag">12 / RESULTS</span>
            <span className="section-subtitle-tag">VERIFIED ATHLETES</span>
          </div>

          <h2 className="editorial-huge-title" style={{ maxWidth: 880, marginBottom: 56 }}>
            BUILT FOR PEOPLE WHO ARE SERIOUS ABOUT PROGRESS.
          </h2>

          <div className="testimonials-editorial-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;I stopped guessing what to do in the gym. TrainIQ finally made my training feel structured and purposeful every single day.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AC</div>
                <div>
                  <span className="author-name">Alex Cole</span>
                  <span className="author-sub">Competitive Powerlifter &bull; +28kg Compound Total</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;The AI coach adjusting my workout on the fly when I only have 30 minutes is the single reason my consistency hit 92% this year.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div>
                  <span className="author-name">Marcus Reed</span>
                  <span className="author-sub">Tech Executive &amp; Hybrid Athlete</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-quote">
                &ldquo;Having all sets, reps, and nutrition synced directly to my private Google Sheet gives me full data ownership without locked silos.&rdquo;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SL</div>
                <div>
                  <span className="author-name">Sophia Lin</span>
                  <span className="author-sub">CrossFit Coach &amp; Nutritionist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 13 — PREMIUM CTA                                     */}
      {/* ============================================================ */}
      <section className="cta-cinematic-section border-top">
        <div className="cta-bg-wrapper">
          <img
            src="/gym-hero.png"
            alt="TrainIQ Performance Arena"
            className="cta-bg-img"
          />
          <div className="cta-vignette" />
        </div>

        <div className="cta-content-box">
          <span className="section-index-tag" style={{ color: "#CCFF00" }}>13 / START</span>
          <h2 className="cta-huge-title">
            YOUR NEXT LEVEL<br />
            STARTS TODAY.
          </h2>
          <p className="cta-subtitle">
            Stop guessing. Start training with purpose. Your edge is waiting.
          </p>
          <div className="cta-btn-group">
            <Link href="/signup" className="btn-hero-primary">
              <span>START TRAINING NOW</span>
              <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="btn-hero-secondary">
              <span>SIGN IN TO PORTAL</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 14 — FOOTER                                          */}
      {/* ============================================================ */}
      <footer className="trainiq-footer border-top">
        <div className="editorial-container">
          <div className="footer-top-row">
            {/* Brand Left */}
            <div className="footer-brand-col">
              <div className="footer-logo">
                <img
                  src="/trainiq-logo.png"
                  alt="TrainIQ Logo"
                  className="footer-logo-img"
                />
                <span className="footer-brand-title">TRAINIQ</span>
              </div>
              <p className="footer-brand-tagline">
                Train Smarter. Perform Better.
              </p>
              <p className="footer-brand-statement">
                &ldquo;Built for people who refuse to stay the same.&rdquo;
              </p>
            </div>

            {/* Links Columns */}
            <div className="footer-links-grid">
              <div className="footer-col">
                <span className="footer-col-header">PRODUCT</span>
                <a href="#overview">Overview</a>
                <a href="#workouts">Workouts</a>
                <a href="#ai-coach">AI Coach</a>
                <a href="#nutrition">Nutrition</a>
                <a href="#progress">Progress</a>
              </div>

              <div className="footer-col">
                <span className="footer-col-header">COMPANY</span>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>

              <div className="footer-col">
                <span className="footer-col-header">ACCOUNT</span>
                <Link href="/login">Sign In</Link>
                <Link href="/signup">Create Account</Link>
                <Link href="/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <span className="copyright-text">
              &copy; {new Date().getFullYear()} TrainIQ Inc. All rights reserved.
            </span>
            <span className="footer-built-tag">
              Engineered with Gemini 2.5 &bull; Google Sheets Engine
            </span>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* SCOPED EDITORIAL STYLING                                     */}
      {/* ============================================================ */}
      <style jsx>{`
        /* ── Base Container & Reset ── */
        .trainiq-landing {
          background-color: #080808;
          color: #F5F5F2;
          font-family: var(--font-body, "Inter", system-ui, sans-serif);
          overflow-x: hidden;
          line-height: 1.55;
          letter-spacing: -0.01em;
        }

        .border-top {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .editorial-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .section-index-tag {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #CCFF00;
          text-transform: uppercase;
        }

        .section-subtitle-tag {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #71717A;
          text-transform: uppercase;
        }

        .editorial-huge-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: clamp(2.4rem, 4.5vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.06;
          color: #F5F5F2;
          text-transform: uppercase;
        }

        .editorial-lead-body {
          font-size: 1.18rem;
          color: #A1A1A8;
          line-height: 1.65;
          max-width: 580px;
        }

        .accent-text {
          color: #CCFF00 !important;
        }

        /* ── Navigation ── */
        .trainiq-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 20px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .trainiq-nav.scrolled {
          background: rgba(8, 8, 8, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 0;
        }

        .nav-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #FFF;
        }

        .nav-logo-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nav-brand-text {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-weight: 800;
          font-size: 1.45rem;
          letter-spacing: 0.12em;
          color: #FFF;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .nav-links a {
          color: #A1A1A8;
          font-size: 0.92rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #FFF;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-btn-text {
          color: #A1A1A8;
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-btn-text:hover {
          color: #FFF;
        }

        .nav-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: #F5F5F2;
          color: #080808;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-btn-primary:hover {
          background: #CCFF00;
          color: #000;
          transform: translateY(-1px);
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #FFF;
          cursor: pointer;
        }

        .nav-mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px 32px;
          background: #111;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-mobile-menu a {
          color: #D4D4D8;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
        }

        .nav-mobile-buttons {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        /* ── Hero Section ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: flex-end;
          padding: 160px 0 60px;
          overflow: hidden;
          background: #000;
        }

        .hero-bg-container {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: grayscale(100%) contrast(110%) brightness(88%);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(8, 8, 8, 0.65) 0%,
            rgba(8, 8, 8, 0.25) 40%,
            rgba(8, 8, 8, 0.88) 85%,
            #080808 100%
          );
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          width: 100%;
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 30px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #A1A1A8;
          letter-spacing: 0.08em;
          backdrop-filter: blur(10px);
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #CCFF00;
          box-shadow: 0 0 10px #CCFF00;
        }

        .hero-headline {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: clamp(3.2rem, 7.8vw, 7.2rem);
          font-weight: 800;
          line-height: 0.96;
          letter-spacing: -0.04em;
          color: #F5F5F2;
          margin-bottom: 28px;
          text-transform: uppercase;
        }

        .hero-headline-accent {
          color: #CCFF00;
          text-shadow: 0 0 40px rgba(204, 255, 0, 0.25);
        }

        .hero-subtext {
          font-size: clamp(1.05rem, 1.6vw, 1.35rem);
          color: #A1A1A8;
          max-width: 740px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 64px;
        }

        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          background: #CCFF00;
          color: #000;
          font-weight: 800;
          font-size: 0.96rem;
          letter-spacing: 0.04em;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 6px 24px rgba(204, 255, 0, 0.25);
        }

        .btn-hero-primary:hover {
          background: #E5FF4D;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(204, 255, 0, 0.35);
        }

        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #F5F5F2;
          font-weight: 600;
          font-size: 0.94rem;
          border-radius: 8px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .hero-footer-metrics {
          display: flex;
          align-items: center;
          gap: 32px;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-item {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.7rem;
          font-weight: 800;
          color: #F5F5F2;
          letter-spacing: -0.02em;
        }

        .metric-label {
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #71717A;
        }

        .metric-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ── Editorial Section Common ── */
        .editorial-section {
          padding: 120px 0;
          position: relative;
        }

        .asymmetric-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
        }

        /* ── Section 02: Numbered Statements ── */
        .numbered-statements {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .statement-row {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .statement-num {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.4rem;
          font-weight: 800;
          color: #CCFF00;
          letter-spacing: 0.08em;
          flex-shrink: 0;
          line-height: 1.2;
        }

        .statement-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #F5F5F2;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .statement-desc {
          font-size: 0.95rem;
          color: #8E8E98;
          line-height: 1.6;
        }

        /* ── Section 03: Feature Editorial Cards ── */
        .features-editorial-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .feature-editorial-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 36px 28px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .feature-editorial-card:hover {
          border-color: rgba(204, 255, 0, 0.3);
          transform: translateY(-4px);
          background: #15151A;
        }

        .card-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .card-large-num {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 2.2rem;
          font-weight: 800;
          color: #44444F;
        }

        .card-icon-accent {
          color: #CCFF00;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: #F5F5F2;
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .card-desc {
          font-size: 0.92rem;
          color: #8E8E98;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .card-bullets {
          margin-top: auto;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 20px;
        }

        .card-bullets li {
          font-size: 0.85rem;
          color: #D4D4D8;
          position: relative;
          padding-left: 14px;
        }

        .card-bullets li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #CCFF00;
        }

        /* ── Section 04: AI Interface ── */
        .coach-features-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
        }

        .coach-feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: #D4D4D8;
        }

        .ai-interface-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .ai-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 24px;
          background: #16161C;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .ai-coach-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(204, 255, 0, 0.15);
          border: 1px solid #CCFF00;
          color: #CCFF00;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-coach-name {
          display: block;
          font-size: 0.92rem;
          font-weight: 700;
          color: #F5F5F2;
        }

        .ai-coach-status {
          font-size: 0.74rem;
          color: #CCFF00;
          letter-spacing: 0.06em;
        }

        .ai-dialogue-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ai-bubble-user {
          align-self: flex-end;
          background: #1D1D24;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px 14px 2px 14px;
          padding: 14px 18px;
          max-width: 80%;
        }

        .ai-bubble-user p {
          font-size: 0.96rem;
          color: #FFF;
          font-weight: 500;
        }

        .ai-timestamp {
          display: block;
          font-size: 0.72rem;
          color: #71717A;
          text-align: right;
          margin-top: 4px;
        }

        .ai-bubble-agent {
          align-self: flex-start;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px 14px 14px 2px;
          padding: 20px;
          max-width: 95%;
        }

        .ai-bubble-agent p {
          font-size: 0.95rem;
          color: #D4D4D8;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .adjusted-plan-box {
          background: #0B0B0E;
          border: 1px solid rgba(204, 255, 0, 0.25);
          border-radius: 10px;
          padding: 16px;
        }

        .adjusted-plan-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .adjusted-plan-tag {
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #CCFF00;
        }

        .adjusted-plan-time {
          font-size: 0.75rem;
          color: #A1A1A8;
        }

        .adjusted-exercises {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .adj-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
        }

        .adj-name {
          color: #F5F5F2;
          font-weight: 600;
        }

        .adj-sets {
          color: #CCFF00;
          font-family: monospace;
          font-weight: 600;
        }

        /* ── Section 05: Workout HUD ── */
        .workout-hud-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
        }

        .hud-top-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .hud-muscle-target {
          font-size: 0.76rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.1em;
        }

        .hud-exercise-name {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.8rem;
          font-weight: 800;
          color: #F5F5F2;
          letter-spacing: -0.01em;
          margin-top: 2px;
        }

        .hud-progress-pill {
          padding: 6px 14px;
          background: rgba(204, 255, 0, 0.1);
          border: 1px solid rgba(204, 255, 0, 0.25);
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #CCFF00;
          letter-spacing: 0.05em;
        }

        .hud-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 28px;
        }

        .hud-progress-fill {
          height: 100%;
          background: #CCFF00;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hud-metric-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .hud-metric-box {
          background: #17171E;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          padding: 16px;
        }

        .hud-metric-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .hud-metric-number {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.5rem;
          font-weight: 800;
          color: #F5F5F2;
        }

        .hud-sub {
          font-size: 0.9rem;
          color: #71717A;
          font-weight: 500;
        }

        .hud-rest-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .rest-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #8E8E98;
          letter-spacing: 0.05em;
        }

        .rest-timer {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: #CCFF00;
        }

        .hud-complete-btn {
          width: 100%;
          padding: 16px;
          background: #F5F5F2;
          color: #080808;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hud-complete-btn:hover {
          background: #CCFF00;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(204, 255, 0, 0.3);
        }

        .btn-check-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .workout-explanation {
          display: flex;
          flex-direction: column;
        }

        .explanation-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 2rem;
          font-weight: 800;
          color: #F5F5F2;
          margin-bottom: 16px;
        }

        .explanation-body {
          font-size: 1.05rem;
          color: #A1A1A8;
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .explanation-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .exp-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.94rem;
          color: #D4D4D8;
          line-height: 1.5;
        }

        .exp-bullet {
          color: #CCFF00;
          font-size: 1.3rem;
          line-height: 1;
        }

        /* ── Section 06: Dashboard Data ── */
        .dashboard-preview-container {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          padding: 40px;
        }

        .dashboard-grid-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .dash-metric-card {
          background: #16161C;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
        }

        .dash-metric-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .dash-metric-val {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 2.1rem;
          font-weight: 800;
          color: #F5F5F2;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .dash-metric-sub {
          font-size: 0.78rem;
          color: #8E8E98;
        }

        .performance-graph-box {
          background: #0B0B0E;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 28px;
        }

        .graph-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .graph-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #F5F5F2;
          letter-spacing: 0.06em;
        }

        .graph-desc {
          font-size: 0.8rem;
          color: #71717A;
          margin-top: 2px;
        }

        .graph-badge {
          padding: 4px 12px;
          background: rgba(204, 255, 0, 0.12);
          border: 1px solid rgba(204, 255, 0, 0.3);
          border-radius: 20px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #CCFF00;
          letter-spacing: 0.08em;
        }

        .graph-svg-wrapper {
          width: 100%;
          height: 140px;
        }

        .performance-svg {
          width: 100%;
          height: 100%;
        }

        .graph-x-axis {
          display: flex;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.74rem;
          font-weight: 600;
          color: #71717A;
          letter-spacing: 0.06em;
        }

        /* ── Section 07: Progress Timeline ── */
        .progress-timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .timeline-months-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 18px 24px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow-x: auto;
        }

        .month-tag {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .month-tag.past {
          color: #8E8E98;
        }

        .month-tag.current {
          color: #CCFF00;
          text-shadow: 0 0 16px rgba(204, 255, 0, 0.4);
        }

        .month-tag.future {
          color: #44444F;
        }

        .month-arrow {
          color: #44444F;
        }

        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .milestone-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 28px 22px;
          display: flex;
          flex-direction: column;
        }

        .milestone-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: #CCFF00;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }

        .milestone-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.25rem;
          font-weight: 800;
          color: #F5F5F2;
          margin-bottom: 8px;
        }

        .milestone-desc {
          font-size: 0.88rem;
          color: #8E8E98;
          line-height: 1.55;
        }

        /* ── Section 08: Nutrition ── */
        .macro-breakdown-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 36px;
        }

        .macro-pill {
          background: #16161C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px 12px;
          text-align: center;
        }

        .macro-name {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .macro-val {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.5rem;
          font-weight: 800;
          color: #F5F5F2;
        }

        .meals-editorial-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .meal-card-item {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 20px 24px;
          transition: border-color 0.2s;
        }

        .meal-card-item:hover {
          border-color: rgba(255, 255, 255, 0.16);
        }

        .meal-time-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #CCFF00;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .meal-dish {
          font-size: 1.05rem;
          font-weight: 700;
          color: #F5F5F2;
          margin-bottom: 4px;
        }

        .meal-macros {
          font-size: 0.82rem;
          color: #8E8E98;
        }

        /* ── Section 09: Streak Consistency ── */
        .streak-editorial-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .streak-small-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.12em;
        }

        .streak-huge-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: clamp(1.8rem, 3.2vw, 2.8rem);
          font-weight: 800;
          color: #F5F5F2;
          line-height: 1.15;
          margin: 12px 0 28px;
          text-transform: uppercase;
        }

        .streak-stats-row {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .streak-stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.8rem;
          font-weight: 800;
          color: #F5F5F2;
        }

        .stat-label {
          font-size: 0.74rem;
          font-weight: 600;
          color: #71717A;
          letter-spacing: 0.08em;
        }

        .streak-calendar-box {
          background: #16161C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 24px;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: #8E8E98;
          margin-bottom: 18px;
        }

        .streak-fire {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #CCFF00;
          font-weight: 700;
        }

        .days-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .day-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .day-name {
          font-size: 0.74rem;
          font-weight: 700;
          color: #71717A;
        }

        .day-check {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1C1C24;
          color: #71717A;
        }

        .day-check.active {
          background: #CCFF00;
          color: #000;
          font-weight: 800;
        }

        /* ── Section 10: How It Works ── */
        .steps-editorial-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }

        .step-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
        }

        .step-num {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 2rem;
          font-weight: 800;
          color: #CCFF00;
          margin-bottom: 16px;
        }

        .step-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #F5F5F2;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }

        .step-desc {
          font-size: 0.88rem;
          color: #8E8E98;
          line-height: 1.55;
        }

        /* ── Section 11: Personalization ── */
        .goal-selector-pills {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .goal-pill {
          padding: 12px 22px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #8E8E98;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .goal-pill:hover {
          color: #FFF;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .goal-pill.active {
          background: #F5F5F2;
          color: #000;
          border-color: #F5F5F2;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
        }

        .active-goal-display {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 16px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .goal-protocol-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #CCFF00;
        }

        .goal-focus-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.8rem;
          font-weight: 800;
          color: #F5F5F2;
          margin: 8px 0 12px;
        }

        .goal-desc-body {
          font-size: 1.05rem;
          color: #A1A1A8;
          line-height: 1.6;
        }

        .goal-specs-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .spec-card {
          background: #16161C;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spec-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #71717A;
          letter-spacing: 0.08em;
        }

        .spec-value {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F5F5F2;
        }

        /* ── Section 12: Testimonials ── */
        .testimonials-editorial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .testimonial-quote {
          font-size: 1.05rem;
          color: #D4D4D8;
          line-height: 1.65;
          margin-bottom: 28px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1D1D24;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.88rem;
          color: #CCFF00;
        }

        .author-name {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: #F5F5F2;
        }

        .author-sub {
          font-size: 0.76rem;
          color: #71717A;
        }

        /* ── Section 13: Premium CTA ── */
        .cta-cinematic-section {
          position: relative;
          min-height: 75vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 100px 32px;
          overflow: hidden;
          background: #000;
        }

        .cta-bg-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .cta-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: grayscale(100%) contrast(110%) brightness(55%);
        }

        .cta-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(8, 8, 8, 0.4) 0%,
            rgba(8, 8, 8, 0.85) 75%,
            #080808 100%
          );
        }

        .cta-content-box {
          position: relative;
          z-index: 2;
          max-width: 860px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-huge-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-size: clamp(2.8rem, 6.5vw, 5.6rem);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.03em;
          color: #F5F5F2;
          margin: 16px 0 24px;
          text-transform: uppercase;
        }

        .cta-subtitle {
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
          color: #A1A1A8;
          margin-bottom: 40px;
        }

        .cta-btn-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* ── Section 14: Footer ── */
        .trainiq-footer {
          background: #050507;
          padding: 80px 0 40px;
        }

        .footer-top-row {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 64px;
          padding-bottom: 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-logo-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-brand-title {
          font-family: var(--font-heading, "Outfit", sans-serif);
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: 0.12em;
          color: #FFF;
        }

        .footer-brand-tagline {
          font-size: 0.95rem;
          font-weight: 600;
          color: #CCFF00;
          margin-bottom: 12px;
        }

        .footer-brand-statement {
          font-size: 0.88rem;
          color: #71717A;
          font-style: italic;
          max-width: 320px;
          line-height: 1.5;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-col-header {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #F5F5F2;
          margin-bottom: 8px;
        }

        .footer-col a {
          color: #8E8E98;
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #FFF;
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 32px;
          font-size: 0.8rem;
          color: #55555F;
        }

        /* ============================================================ */
        /* RESPONSIVE BREAKPOINTS                                       */
        /* ============================================================ */

        @media (max-width: 1024px) {
          .features-editorial-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .steps-editorial-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .milestones-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .testimonials-editorial-grid {
            grid-template-columns: 1fr;
          }

          .active-goal-display {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .editorial-section {
            padding: 80px 0;
          }

          .nav-links,
          .nav-actions .nav-btn-text,
          .nav-actions .nav-btn-primary {
            display: none;
          }

          .nav-mobile-toggle {
            display: block;
          }

          .asymmetric-grid-2 {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-footer-metrics {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .metric-divider {
            display: none;
          }

          .features-editorial-grid {
            grid-template-columns: 1fr;
          }

          .steps-editorial-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid-stats {
            grid-template-columns: 1fr;
          }

          .streak-editorial-card {
            grid-template-columns: 1fr;
            padding: 28px 20px;
          }

          .streak-stats-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-top-row {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom-row {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
