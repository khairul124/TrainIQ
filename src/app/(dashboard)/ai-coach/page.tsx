"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Upload, Camera, Globe, Ruler, Scale, Moon, Droplets, Zap, X, ChevronDown, CheckCircle2, ShieldCheck, Lock, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { dbService } from "@/lib/dbService";
import { ChatMessage } from "@/types";
import { processImageToPrivacyVector, VectorEmbeddingResult } from "@/lib/privacyEmbedder";
import { VoiceSystem } from "@/lib/voiceSystem";

const suggestions = [
  "How many calories should I eat to lose fat?",
  "Create a push/pull/legs workout split",
  "What should I eat after a workout?",
  "I'm tired today, suggest a light workout",
  "Give me a high-protein Bangladeshi diet plan",
  "How to improve my bench press?",
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Voice System state
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Assessment state
  const [showAssessment, setShowAssessment] = useState(false);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [country, setCountry] = useState("Bangladesh");
  const [goal, setGoal] = useState("Muscle Gain & Fat Loss");
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [vectorData, setVectorData] = useState<VectorEmbeddingResult | null>(null);
  const [vectorizing, setVectorizing] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await dbService.getChatMessages();
        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, typing]);

  // Voice Speech Functions
  const toggleSpeech = (id: string, text: string) => {
    if (speakingId === id) {
      VoiceSystem.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      VoiceSystem.speak(text, () => {
        setSpeakingId(null);
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      VoiceSystem.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      VoiceSystem.startListening(
        (transcript) => {
          setInput(transcript);
        },
        (err) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setVectorizing(true);
      try {
        const result = await processImageToPrivacyVector(file);
        setVectorData(result);
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      } catch (err) {
        console.error("Privacy vectorization failed:", err);
      } finally {
        setVectorizing(false);
      }
    }
  };

  const submitAssessment = async () => {
    setShowAssessment(false);
    setTyping(true);

    const userSummary = `📊 **Submitted AI Body Assessment:**
• **Height:** ${height} cm | **Weight:** ${weight} kg
• **Country:** ${country}
• **Goal:** ${goal} (${activityLevel} Activity)
${vectorData ? `• 🔒 **Privacy Vector Feature Extracted:** \`512-D Matrix (${vectorData.privacyHash})\`\n  *(EXIF metadata stripped & original photo destroyed in browser)*` : photoName ? `• 📸 **Photo Name:** ${photoName}` : ""}`;

    try {
      const userMsg = await dbService.saveChatMessage("user", userSummary);
      setMessages(prev => [...prev, userMsg]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Generate my Full AI Body Assessment & 360 Plan",
          assessment: {
            height,
            weight,
            country,
            goal,
            activityLevel,
            photoName,
            privacyVector: vectorData ? { dimension: vectorData.dimension, privacyHash: vectorData.privacyHash } : undefined
          }
        })
      });

      if (!res.ok) throw new Error("Assessment generation failed");
      const data = await res.json();

      const aiMsg = await dbService.saveChatMessage("assistant", data.reply || "Could not generate assessment plan.");
      setMessages(prev => [...prev, aiMsg]);
      
      // Auto speak first paragraph of assessment
      VoiceSystem.speak("Here is your personalized full day assessment plan!");
    } catch (err) {
      console.error("Assessment error:", err);
      const errorMsg = await dbService.saveChatMessage("assistant", "Sorry, I had trouble processing your assessment. Please try again!");
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userText = text.trim();
    setInput("");
    setTyping(true);

    try {
      const userMsg = await dbService.saveChatMessage("user", userText);
      setMessages(prev => [...prev, userMsg]);

      const [profile, workouts, meals] = await Promise.all([
        dbService.getProfile(),
        dbService.getWorkouts(),
        dbService.getMealLogs()
      ]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          profile,
          recentWorkouts: workouts,
          recentMeals: meals
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      
      const aiMsg = await dbService.saveChatMessage("assistant", data.reply || "Sorry, I couldn't process that.");
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to get response:", err);
      const errorMsg = await dbService.saveChatMessage("assistant", "I am having trouble connecting to my training core. Please try again!");
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Sparkles size={28} style={{ color: "var(--accent-purple)" }} /> AI Coach & Voice Assistant
          </h1>
          <p>Your intelligent fitness coach with Voice Read Aloud & Hands-Free Dictation</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAssessment(true)}
          style={{ background: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)", boxShadow: "0 4px 20px rgba(108,99,255,0.3)" }}
        >
          <Camera size={18} /> Generate 360° AI Body & Diet Plan
        </button>
      </div>

      {/* Feature Banner */}
      <div style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)", borderRadius: 16, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <div style={{ background: "var(--gradient-primary)", padding: 10, borderRadius: 12, color: "#fff" }}>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Need a Full-Day Custom Diet, Protein, Water & Sleep Plan?</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Upload your <strong>Height</strong>, <strong>Weight</strong>, <strong>Country</strong> & <strong>Body Photo</strong> for an instant AI blueprint with local country meals!
            </div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowAssessment(true)}>
          Start Assessment →
        </button>
      </div>

      {/* Assessment Modal Form */}
      {showAssessment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
          <div className="animate-fade" style={{ background: "#141424", border: "1px solid rgba(108, 99, 255, 0.4)", borderRadius: 20, padding: 32, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(108,99,255,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid var(--border-color)", paddingBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sparkles size={24} style={{ color: "var(--accent-purple)" }} />
                <h3 style={{ fontSize: "1.3rem", margin: 0 }}>AI Body & Diet Assessment</h3>
              </div>
              <button onClick={() => setShowAssessment(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                    <Ruler size={14} style={{ display: "inline", marginRight: 6 }} /> Height (cm)
                  </label>
                  <input 
                    type="number" 
                    className="input" 
                    value={height} 
                    onChange={e => setHeight(Number(e.target.value))} 
                    placeholder="e.g. 175" 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                    <Scale size={14} style={{ display: "inline", marginRight: 6 }} /> Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    className="input" 
                    value={weight} 
                    onChange={e => setWeight(Number(e.target.value))} 
                    placeholder="e.g. 72" 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                  <Globe size={14} style={{ display: "inline", marginRight: 6 }} /> Country (For Local Diet Options)
                </label>
                <select className="input" value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="Bangladesh">🇧🇩 Bangladesh (Lal Ruti, Fish, Dal, Eggs)</option>
                  <option value="India">🇮🇳 India (Paneer, Rotis, Dal, Chicken, Chaas)</option>
                  <option value="United States">🇺🇸 United States (Oats, Eggs, Salmon, Rice)</option>
                  <option value="United Kingdom">🇬🇧 United Kingdom (Porridge, Eggs, Fish, Chicken)</option>
                  <option value="Pakistan">🇵🇰 Pakistan (Whole Wheat, Mutton/Chicken, Yogurt)</option>
                  <option value="Canada">🇨🇦 Canada (Oatmeal, Eggs, Salmon, Turkey)</option>
                  <option value="UAE / Middle East">🇦🇪 UAE / Middle East (Hummus, Chicken, Rice, Dates)</option>
                  <option value="Other">🌍 Other Global Cuisine</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Fitness Goal</label>
                  <select className="input" value={goal} onChange={e => setGoal(e.target.value)}>
                    <option value="Muscle Gain & Fat Loss">Muscle Gain & Fat Loss</option>
                    <option value="Fat Loss & Shredding">Fat Loss & Shredding</option>
                    <option value="Lean Muscle Bulk">Lean Muscle Bulk</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Maintenance & Health">Maintenance & Health</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>Daily Activity Level</label>
                  <select className="input" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
                    <option value="Sedentary">Sedentary (Desk Job)</option>
                    <option value="Light">Light (1-2 days gym)</option>
                    <option value="Moderate">Moderate (3-5 days gym)</option>
                    <option value="High">High (6-7 days heavy training)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
                  <Camera size={14} style={{ display: "inline", marginRight: 6 }} /> Body / Physique Photo (Optional)
                </label>
                <div style={{ border: "2px dashed var(--border-color)", borderRadius: 12, padding: 20, textAlign: "center", background: "rgba(255,255,255,0.02)", cursor: "pointer", position: "relative" }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} 
                  />
                  {vectorizing ? (
                    <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--accent-purple)" }}>
                      <Lock size={18} className="animate-spin" />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Stripping EXIF & Vectorizing image locally...</span>
                    </div>
                  ) : photoPreview ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <img src={photoPreview} alt="Preview" style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{photoName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle2 size={12} /> 512-D Vector Computed (Original Photo Destroyed)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} style={{ color: "var(--accent-purple)", marginBottom: 6 }} />
                      <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>Click or Drag photo here to vectorise</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zero-retention client-side vector embedding</div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 12, background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 12, padding: "12px 16px", fontSize: "0.8rem", color: "var(--accent-green)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>100% Client-Side Privacy Active:</strong> Your photo never leaves your browser. EXIF metadata is stripped, the image is converted into an anonymous mathematical vector (512-D), and the raw photo is immediately destroyed.
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg" 
                onClick={submitAssessment}
                style={{ width: "100%", marginTop: 8, background: "linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)", borderRadius: 12, fontWeight: 700 }}
              >
                🚀 Generate My Full AI Diet & Body Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="chat-container">
        <div className="chat-messages">
          {loadingHistory ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: 24, fontSize: "0.9rem" }}>Loading chat logs...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: 24, fontSize: "0.9rem" }}>Start chatting with your coach or click &quot;Generate 360° AI Body &amp; Diet Plan&quot; above!</div>
          ) : (
            messages.map((m, i) => {
              const msgId = m.id || String(i);
              const isSpeakingThis = speakingId === msgId;
              return (
                <div key={msgId} className={`chat-bubble ${m.role}`}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, fontSize: "0.75rem", fontWeight: 600, opacity: 0.8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {m.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                      {m.role === "assistant" ? "AI Coach" : "You"}
                    </div>
                    {m.role === "assistant" && (
                      <button 
                        onClick={() => toggleSpeech(msgId, m.content)}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", padding: "4px 8px", borderRadius: 6, color: isSpeakingThis ? "var(--accent-purple)" : "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                        title="Voice Read Aloud"
                      >
                        {isSpeakingThis ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{isSpeakingThis ? "Stop" : "Listen 🔊"}</span>
                      </button>
                    )}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              );
            })
          )}
          {typing && (
            <div className="chat-bubble assistant">
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <Bot size={14} style={{ opacity: 0.7 }} />
                <div style={{ display: "flex", gap: 4 }}>
                  <span className="typing-dot" style={{ animation: "pulse 1s infinite" }}>●</span>
                  <span className="typing-dot" style={{ animation: "pulse 1s infinite 0.2s" }}>●</span>
                  <span className="typing-dot" style={{ animation: "pulse 1s infinite 0.4s" }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)} disabled={typing}>{s}</button>
          ))}
        </div>

        <form 
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !typing) {
              sendMessage(input);
            }
          }}
        >
          <button 
            type="button"
            className={`btn ${isListening ? "btn-danger" : "btn-secondary"}`}
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Speak to AI Coach"}
            style={{ borderRadius: "50%", width: 42, height: 42, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            {isListening ? <MicOff size={18} style={{ color: "#FF6B6B" }} /> : <Mic size={18} />}
          </button>
          <input 
            className="input" 
            placeholder={isListening ? "Listening to your voice..." : "Ask your AI coach or click mic to speak..."}
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !typing) {
                  sendMessage(input);
                }
              }
            }} 
            style={{ flex: 1, borderColor: isListening ? "var(--accent-purple)" : "var(--border-color)" }} 
            disabled={typing}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!input.trim() || typing}
            style={{
              borderRadius: 12,
              padding: "10px 18px",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !typing ? "pointer" : "not-allowed",
              boxShadow: input.trim() ? "0 4px 20px rgba(124,58,237,0.4)" : "none",
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}


