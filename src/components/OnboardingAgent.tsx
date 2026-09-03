"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Sparkles, X, ChevronRight, CheckCircle2, ArrowRight, Compass, ShieldCheck, Dumbbell, Utensils, Target } from "lucide-react";
import { VoiceSystem } from "@/lib/voiceSystem";

interface OnboardingStep {
  title: string;
  desc: string;
  route: string;
  highlight: string;
  actionText: string;
}

export function OnboardingAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = questionnaire, 1..4 = interactive tour
  const [goal, setGoal] = useState("fat_loss");
  const [experience, setExperience] = useState("intermediate");
  const [location, setLocation] = useState("gym");
  const router = useRouter();

  useEffect(() => {
    // Check if first-time user
    const completed = localStorage.getItem("fitnessgpt_onboarded");
    if (!completed) {
      // Auto open for new visitors after 1 second
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const tourSteps: OnboardingStep[] = [
    {
      title: "Step 1: Your AI Command Dashboard",
      desc: "Here is your central hub for weekly workouts, calorie targets, streak counts, and recent achievements.",
      route: "/dashboard",
      highlight: "Dashboard overview with real-time stats",
      actionText: "Next: Explore AI Coach →",
    },
    {
      title: "Step 2: AI Coach & 360 Assessment",
      desc: "Ask any training question or generate a complete 360° body & diet plan tailored with zero-retention image privacy.",
      route: "/ai-coach",
      highlight: "Voice read-aloud & privacy-preserving vector embedding",
      actionText: "Next: Smart Workouts →",
    },
    {
      title: "Step 3: Tailored Workouts & Form Guides",
      desc: "Pick your training location (Gym, Home, Outdoor). Every single exercise features a full step-by-step form guide.",
      route: "/workouts",
      highlight: "Form guides & location splits",
      actionText: "Next: Nutrition Engine →",
    },
    {
      title: "Step 4: AI Nutrition & Budget Sectors",
      desc: "Generate 3 personalized diet plans for Economy ($), Moderate ($$), and Premium ($$$) budgets.",
      route: "/nutrition",
      highlight: "Budget food sectors & calorie calculator",
      actionText: "Finish Tour & Start Training 🚀",
    },
  ];

  const handleStartTour = () => {
    setStep(1);
    localStorage.setItem("fitnessgpt_onboarded", "true");
    router.push(tourSteps[0].route);
    VoiceSystem.speak(`Welcome to TrainIQ! Step 1: ${tourSteps[0].title}. ${tourSteps[0].desc}`);
  };

  const handleNextStep = () => {
    if (step < tourSteps.length) {
      const nextIdx = step;
      const nextStepObj = tourSteps[nextIdx];
      setStep(nextIdx + 1);
      router.push(nextStepObj.route);
      VoiceSystem.speak(`${nextStepObj.title}. ${nextStepObj.desc}`);
    } else {
      setIsOpen(false);
      VoiceSystem.speak("Onboarding complete! Enjoy training with TrainIQ.");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("fitnessgpt_onboarded", "true");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setStep(0);
          setIsOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 900,
          background: "#1A1A2E",
          border: "1px solid var(--accent-purple)",
          borderRadius: 30,
          padding: "8px 16px",
          color: "var(--text-primary)",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 8px 30px rgba(0,0,0,0.7), 0 0 16px rgba(108,99,255,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Bot size={16} style={{ color: "var(--accent-purple)" }} />
        <span>AI Onboarding Guide</span>
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="animate-fade"
        style={{
          background: "#141424",
          border: "1px solid rgba(108, 99, 255, 0.4)",
          borderRadius: 24,
          padding: 32,
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(108,99,255,0.2)",
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        {step === 0 ? (
          /* Questionnaire */
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "var(--gradient-primary)", padding: 10, borderRadius: 14, color: "#fff" }}>
                <Bot size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Meet Your AI Onboarding Agent</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                  Let&apos;s build your custom guided path based on your goals
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "24px 0" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                  1. What is your main fitness objective?
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { id: "fat_loss", label: "🔥 Fat Loss & Shredding" },
                    { id: "muscle_gain", label: "💪 Build Lean Muscle" },
                    { id: "strength", label: "🏋️ Power & Strength" },
                    { id: "health", label: "🌱 General Health" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className="btn btn-sm"
                      style={{
                        padding: "10px",
                        borderRadius: 10,
                        background: goal === g.id ? "rgba(108, 99, 255, 0.18)" : "var(--bg-secondary)",
                        border: `1px solid ${goal === g.id ? "var(--accent-purple)" : "var(--border-color)"}`,
                        color: goal === g.id ? "var(--accent-purple)" : "var(--text-primary)",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                  2. Training Location Preference
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { id: "gym", label: "🏋️ Commercial Gym" },
                    { id: "home", label: "🏠 Home Workouts" },
                    { id: "outdoor", label: "🌳 Outdoor / Park" },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setLocation(loc.id)}
                      className="btn btn-sm"
                      style={{
                        padding: "10px 4px",
                        borderRadius: 10,
                        background: location === loc.id ? "rgba(0, 217, 255, 0.15)" : "var(--bg-secondary)",
                        border: `1px solid ${location === loc.id ? "var(--accent-cyan)" : "var(--border-color)"}`,
                        color: location === loc.id ? "var(--accent-cyan)" : "var(--text-primary)",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                      }}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartTour}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", background: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)", borderRadius: 12, fontWeight: 700 }}
            >
              🚀 Generate My Interactive Guided Tour
            </button>
          </div>
        ) : (
          /* Step-by-Step Walkthrough Overlay */
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
                Step {step} of {tourSteps.length}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i + 1 === step ? "var(--accent-purple)" : "var(--bg-secondary)",
                    }}
                  />
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: "1.3rem", marginBottom: 8, color: "#fff" }}>
              {tourSteps[step - 1].title}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              {tourSteps[step - 1].desc}
            </p>

            <div style={{ background: "rgba(108, 99, 255, 0.08)", border: "1px solid rgba(108, 99, 255, 0.25)", borderRadius: 12, padding: 14, marginBottom: 24, fontSize: "0.8rem", color: "var(--accent-purple)" }}>
              🎯 <strong>Highlighted Action:</strong> {tourSteps[step - 1].highlight}
            </div>

            <button
              onClick={handleNextStep}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", borderRadius: 12, fontWeight: 700 }}
            >
              {tourSteps[step - 1].actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
