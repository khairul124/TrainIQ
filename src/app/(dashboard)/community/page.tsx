"use client";
import { useState } from "react";
import {
  Trophy, Users, Target, Clock, Plus, Check, Flame, Footprints,
  Dumbbell, Apple, Star, Share2, MessageCircle, Heart, Award,
  TrendingUp, Zap, Bell, Filter, ChevronRight, X
} from "lucide-react";
import { VoiceReadButton } from "@/components/VoiceButton";

// ─────────────────────────────────────────
// Data
// ─────────────────────────────────────────

interface Challenge {
  id: number;
  title: string;
  desc: string;
  type: "workouts" | "steps" | "streak" | "calories";
  participants: number;
  progress: number;
  userProgress: number;
  daysLeft: number;
  totalDays: number;
  emoji: string;
  joined: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  prize: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  workouts: number;
  avatar: string;
  isYou: boolean;
  trend: "up" | "down" | "same";
}

interface Post {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const initialChallenges: Challenge[] = [
  { id: 1, title: "30-Day Push-up Challenge", desc: "Do 100 push-ups daily for 30 days and build serious upper-body strength.", type: "workouts", participants: 234, progress: 60, userProgress: 60, daysLeft: 12, totalDays: 30, emoji: "💪", joined: true, difficulty: "Medium", prize: "🏅 Iron Arms Badge" },
  { id: 2, title: "10K Steps Daily", desc: "Walk 10,000 steps every day this month to boost your cardio health.", type: "steps", participants: 567, progress: 45, userProgress: 45, daysLeft: 18, totalDays: 30, emoji: "🚶", joined: true, difficulty: "Easy", prize: "👟 Step Master Badge" },
  { id: 3, title: "Clean Eating Week", desc: "No processed food for 7 days straight — reset your gut and energy.", type: "streak", participants: 189, progress: 85, userProgress: 85, daysLeft: 2, totalDays: 7, emoji: "🥗", joined: false, difficulty: "Hard", prize: "🥦 Clean Eater Badge" },
  { id: 4, title: "Summer Shred", desc: "Burn 500+ calories daily for 4 weeks through any exercise.", type: "calories", participants: 412, progress: 30, userProgress: 0, daysLeft: 21, totalDays: 28, emoji: "🔥", joined: false, difficulty: "Hard", prize: "🏆 Summer Shred Trophy" },
  { id: 5, title: "7-Day Yoga Flow", desc: "Complete one yoga session every day for a week to improve flexibility.", type: "streak", participants: 128, progress: 70, userProgress: 0, daysLeft: 5, totalDays: 7, emoji: "🧘", joined: false, difficulty: "Easy", prize: "🌿 Zen Master Badge" },
  { id: 6, title: "Olympic Lifting Month", desc: "Log 20 strength training sessions in 30 days to build raw power.", type: "workouts", participants: 92, progress: 55, userProgress: 0, daysLeft: 15, totalDays: 30, emoji: "🏋️", joined: false, difficulty: "Hard", prize: "💎 Elite Lifter Badge" },
];

const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Rahim Ahmed", points: 4520, workouts: 28, avatar: "R", isYou: false, trend: "same" },
  { rank: 2, name: "Fatima Khan", points: 4210, workouts: 26, avatar: "F", isYou: false, trend: "up" },
  { rank: 3, name: "Arif Hassan", points: 3890, workouts: 24, avatar: "A", isYou: false, trend: "down" },
  { rank: 4, name: "Nadia Sultana", points: 3650, workouts: 22, avatar: "N", isYou: false, trend: "up" },
  { rank: 5, name: "You", points: 3420, workouts: 20, avatar: "U", isYou: true, trend: "up" },
  { rank: 6, name: "Kamal Roy", points: 3100, workouts: 19, avatar: "K", isYou: false, trend: "down" },
  { rank: 7, name: "Shirin Islam", points: 2980, workouts: 17, avatar: "S", isYou: false, trend: "same" },
  { rank: 8, name: "Bashir Uddin", points: 2750, workouts: 16, avatar: "B", isYou: false, trend: "down" },
];

const initialPosts: Post[] = [
  { id: 1, user: "Rahim Ahmed", avatar: "R", time: "2 min ago", content: "Just crushed my 28th workout this month! 💪 Feeling unstoppable. Who else is on the 30-Day Push-up Challenge?", likes: 24, comments: 6, liked: false },
  { id: 2, user: "Fatima Khan", avatar: "F", time: "15 min ago", content: "Day 6 of the Clean Eating Week challenge — honestly didn't think I could do it but feeling incredible! 🥗 Almost there!", likes: 41, comments: 12, liked: true },
  { id: 3, user: "Nadia Sultana", avatar: "N", time: "1 hr ago", content: "Hit my 10,000 steps while exploring the city on a walk 🚶 This challenge has changed my daily routine completely!", likes: 18, comments: 3, liked: false },
  { id: 4, user: "Arif Hassan", avatar: "A", time: "3 hrs ago", content: "New Personal Record! 120kg bench press today 🏋️ 8 months of training paying off. Don't give up on your goals!", likes: 67, comments: 15, liked: false },
];

const achievements = [
  { icon: "🔥", title: "10-Day Streak", earned: true, desc: "Complete 10 days in a row" },
  { icon: "🏋️", title: "100 Workouts", earned: true, desc: "Log 100 total workouts" },
  { icon: "💪", title: "First PR", earned: true, desc: "Set your first personal record" },
  { icon: "🥇", title: "Top 5 Finish", earned: false, desc: "Finish top 5 in a challenge" },
  { icon: "🎯", title: "Goal Crusher", earned: true, desc: "Hit your weekly goal 4 weeks in a row" },
  { icon: "🌟", title: "Early Bird", earned: false, desc: "Work out before 7am for 7 days" },
  { icon: "🏆", title: "Challenge Champ", earned: false, desc: "Win a community challenge" },
  { icon: "❤️", title: "Consistency King", earned: true, desc: "30 consecutive active days" },
];

const typeIcons: Record<string, React.ReactNode> = {
  workouts: <Dumbbell size={13} />,
  steps: <Footprints size={13} />,
  streak: <Flame size={13} />,
  calories: <Zap size={13} />,
};

const difficultyColor: Record<string, string> = {
  Easy: "var(--accent-green)",
  Medium: "var(--accent-orange)",
  Hard: "var(--accent-red)",
};

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────

export default function CommunityPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState<"all" | "workouts" | "steps" | "streak" | "calories">("all");
  const [viewTab, setViewTab] = useState<"challenges" | "leaderboard" | "achievements" | "feed">("challenges");
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [showPostInput, setShowPostInput] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New challenge form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<Challenge["type"]>("workouts");
  const [newDays, setNewDays] = useState(7);
  const [newDifficulty, setNewDifficulty] = useState<Challenge["difficulty"]>("Medium");
  const [newPrize, setNewPrize] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = (id: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nowJoined = !c.joined;
      showToast(nowJoined ? `✅ Joined "${c.title}"!` : `Left "${c.title}"`);
      return { ...c, joined: nowJoined, participants: nowJoined ? c.participants + 1 : c.participants - 1 };
    }));
  };

  const handleLogProgress = (id: number, delta: number) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newProgress = Math.min(100, Math.max(0, c.userProgress + delta));
      showToast(`📈 Progress updated to ${newProgress}%`);
      return { ...c, userProgress: newProgress };
    }));
  };

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
    }));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now(),
      user: "You",
      avatar: "U",
      time: "Just now",
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setShowPostInput(false);
    showToast("📣 Post shared with the community!");
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const c: Challenge = {
      id: Date.now(),
      title: newTitle,
      desc: newDesc,
      type: newType,
      participants: 1,
      progress: 0,
      userProgress: 0,
      daysLeft: newDays,
      totalDays: newDays,
      emoji: newType === "workouts" ? "🏋️" : newType === "steps" ? "🚶" : newType === "streak" ? "🔥" : "⚡",
      joined: true,
      difficulty: newDifficulty,
      prize: newPrize || "🎖️ Community Badge",
    };
    setChallenges(prev => [c, ...prev]);
    setNewTitle(""); setNewDesc(""); setNewPrize("");
    setShowCreateChallenge(false);
    showToast(`🚀 Challenge "${c.title}" created!`);
  };

  const filteredChallenges = challenges.filter(c =>
    activeTab === "all" || c.type === activeTab
  );
  const joinedChallenges = challenges.filter(c => c.joined);

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="animate-fade" style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: "#1A1A2E", border: "1px solid rgba(108, 99, 255, 0.5)",
          borderRadius: "var(--radius-md)", padding: "14px 20px",
          color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 500,
          boxShadow: "0 8px 40px rgba(0,0,0,0.8), 0 0 20px rgba(108,99,255,0.2)",
          backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", gap: 10
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Community Hub</h1>
          <p>Compete, connect, and crush goals with fellow athletes</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <VoiceReadButton
            text={`Community Hub. You have ${joinedChallenges.length} active challenges. There are ${challenges.length} total challenges available including ${challenges.filter(c => c.type === 'workouts').length} workout challenges and ${challenges.filter(c => c.type === 'steps').length} step challenges. Your leaderboard rank is number 5 with 3,420 points.`}
            size="md"
            label="🔊 Community Summary"
          />
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPostInput(true)}>
            <Share2 size={15} /> Share Update
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateChallenge(true)}>
            <Plus size={15} /> Create Challenge
          </button>
        </div>
      </div>

      {/* My Active Challenges — always visible summary */}
      {joinedChallenges.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,217,255,0.05))",
          border: "1px solid rgba(108,99,255,0.2)", borderRadius: "var(--radius-lg)",
          padding: "20px 24px", marginBottom: 28
        }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, color: "var(--accent-purple)" }}>
            <Zap size={16} /> My Active Challenges ({joinedChallenges.length})
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {joinedChallenges.map(c => (
              <div key={c.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)", padding: "12px 16px", minWidth: 200, flex: "1 1 200px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{c.emoji} {c.title}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.daysLeft}d left</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${c.userProgress}%`, height: "100%", background: "var(--gradient-primary)", borderRadius: 3, transition: "width 0.4s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{c.userProgress}% complete</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-secondary btn-sm" style={{ padding: "2px 8px", fontSize: "0.65rem" }} onClick={() => handleLogProgress(c.id, -10)}>−</button>
                    <button className="btn btn-primary btn-sm" style={{ padding: "2px 8px", fontSize: "0.65rem" }} onClick={() => handleLogProgress(c.id, 10)}>+ Log</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nav tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg-secondary)", padding: 4, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
        {([
          { key: "challenges", label: "Challenges", icon: <Target size={15} /> },
          { key: "leaderboard", label: "Leaderboard", icon: <Trophy size={15} /> },
          { key: "achievements", label: "Achievements", icon: <Award size={15} /> },
          { key: "feed", label: "Activity Feed", icon: <MessageCircle size={15} /> },
        ] as const).map(tab => (
          <button
            key={tab.key}
            className="btn btn-sm"
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 4, gap: 6,
              background: viewTab === tab.key ? "var(--gradient-primary)" : "transparent",
              color: viewTab === tab.key ? "#fff" : "var(--text-secondary)",
              border: "none", fontSize: "0.8rem"
            }}
            onClick={() => setViewTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ CHALLENGES TAB ═══════════════ */}
      {viewTab === "challenges" && (
        <div>
          {/* Create Challenge Modal */}
          {showCreateChallenge && (
            <div className="card-glass animate-fade" style={{ marginBottom: 24, padding: 24, border: "1px solid var(--accent-purple)", position: "relative" }}>
              <button onClick={() => setShowCreateChallenge(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", color: "var(--text-muted)", border: "none" }}><X size={18} /></button>
              <h3 style={{ fontSize: "1.1rem", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} style={{ color: "var(--accent-purple)" }} /> Create New Challenge
              </h3>
              <form onSubmit={handleCreateChallenge}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 16 }}>
                  <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Challenge Title</label>
                    <input className="input" placeholder="e.g. 21-Day Burpee Blast" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Description</label>
                    <input className="input" placeholder="Describe the challenge goal..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Challenge Type</label>
                    <select className="input" value={newType} onChange={e => setNewType(e.target.value as Challenge["type"])}>
                      <option value="workouts">💪 Workouts</option>
                      <option value="steps">🚶 Steps</option>
                      <option value="streak">🔥 Streak</option>
                      <option value="calories">⚡ Calories</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Duration (days)</label>
                    <input className="input" type="number" min={1} max={90} value={newDays} onChange={e => setNewDays(Number(e.target.value))} />
                  </div>
                  <div className="input-group">
                    <label>Difficulty</label>
                    <select className="input" value={newDifficulty} onChange={e => setNewDifficulty(e.target.value as Challenge["difficulty"])}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Prize / Badge</label>
                    <input className="input" placeholder="e.g. 🏅 Burpee King Badge" value={newPrize} onChange={e => setNewPrize(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowCreateChallenge(false)}>Cancel</button>
                  <button className="btn btn-primary" type="submit">🚀 Create Challenge</button>
                </div>
              </form>
            </div>
          )}

          {/* Filter bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <Filter size={13} /> Filter:
            </span>
            {(["all", "workouts", "steps", "streak", "calories"] as const).map(t => (
              <button
                key={t}
                className="btn btn-sm"
                style={{
                  padding: "5px 14px", borderRadius: "var(--radius-full)",
                  background: activeTab === t ? "var(--gradient-primary)" : "var(--bg-card)",
                  color: activeTab === t ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${activeTab === t ? "transparent" : "var(--border-color)"}`,
                  fontSize: "0.78rem", textTransform: "capitalize"
                }}
                onClick={() => setActiveTab(t)}
              >
                {t === "all" ? "All Types" : t === "steps" ? "🚶 Steps" : t === "workouts" ? "💪 Workouts" : t === "streak" ? "🔥 Streak" : "⚡ Calories"}
              </button>
            ))}
          </div>

          {/* Challenge Cards */}
          <div className="grid-2">
            {filteredChallenges.map(c => (
              <div key={c.id} className="challenge-card" style={{
                border: c.joined ? "1px solid rgba(108,99,255,0.35)" : "1px solid var(--border-color)",
                position: "relative", overflow: "hidden"
              }}>
                {c.joined && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--gradient-primary)" }} />
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <span style={{ fontSize: "1.6rem" }}>{c.emoji}</span>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: 3 }}>{c.title}</h4>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{c.desc}</p>
                    </div>
                  </div>
                  <VoiceReadButton text={`${c.title}. ${c.desc}. ${c.participants} athletes joined. ${c.daysLeft} days left. Difficulty: ${c.difficulty}. Prize: ${c.prize}. ${c.joined ? `Your progress: ${c.userProgress}%.` : 'Not yet joined.'}`} />
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span className="badge badge-primary" style={{ fontSize: "0.65rem", padding: "2px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                    {typeIcons[c.type]} {c.type}
                  </span>
                  <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: "var(--radius-full)", border: `1px solid ${difficultyColor[c.difficulty]}`, color: difficultyColor[c.difficulty] }}>
                    {c.difficulty}
                  </span>
                  {c.joined && <span className="badge badge-success" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>✓ Joined</span>}
                </div>

                <div style={{ display: "flex", gap: 16, fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {c.participants.toLocaleString()} athletes</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {c.daysLeft} days left</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>🎁 {c.prize}</span>
                </div>

                {/* Community progress */}
                <div style={{ marginBottom: 2, display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  <span>Community</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="challenge-progress" style={{ marginBottom: c.joined ? 6 : 12 }}>
                  <div className="challenge-progress-bar" style={{ width: `${c.progress}%` }} />
                </div>

                {/* User progress — only if joined */}
                {c.joined && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--accent-purple)", marginBottom: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={10} /> Your Progress</span>
                      <span>{c.userProgress}%</span>
                    </div>
                    <div style={{ height: 5, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${c.userProgress}%`, height: "100%", background: "var(--gradient-primary)", borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {c.joined ? (
                    <>
                      <div style={{ display: "flex", gap: 4, flex: 1 }}>
                        <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: "0.72rem" }} onClick={() => handleLogProgress(c.id, -10)}>− Progress</button>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: "0.72rem" }} onClick={() => handleLogProgress(c.id, 10)}>+ Log Progress</button>
                      </div>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: "0.7rem", color: "var(--accent-red)", padding: "6px 10px" }} onClick={() => handleJoin(c.id)}>Leave</button>
                    </>
                  ) : (
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: "0.8rem" }} onClick={() => handleJoin(c.id)}>
                      <ChevronRight size={14} /> Join Challenge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ LEADERBOARD TAB ═══════════════ */}
      {viewTab === "leaderboard" && (
        <div className="card animate-fade">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
              <Trophy size={20} style={{ color: "#FFD700" }} /> Global Leaderboard
            </h3>
            <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>This Month</span>
          </div>

          {/* Stats summary */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {[
              { label: "Your Rank", value: "#5", color: "var(--accent-purple)" },
              { label: "Your Points", value: "3,420", color: "var(--accent-cyan)" },
              { label: "Workouts", value: "20", color: "var(--accent-green)" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "14px", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-heading)" }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {initialLeaderboard.map(u => (
            <div key={u.rank} className="leaderboard-row" style={{
              background: u.isYou ? "rgba(108,99,255,0.08)" : "transparent",
              borderRadius: u.isYou ? "var(--radius-sm)" : 0,
              border: u.isYou ? "1px solid rgba(108,99,255,0.2)" : "none",
              marginBottom: u.isYou ? 2 : 0,
            }}>
              <span className={`leaderboard-rank ${u.rank === 1 ? "gold" : u.rank === 2 ? "silver" : u.rank === 3 ? "bronze" : ""}`}>#{u.rank}</span>
              <div className="topbar-avatar" style={{ width: 36, height: 36, fontSize: "0.8rem", flexShrink: 0 }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6 }}>
                  {u.name}
                  {u.isYou && <span className="badge badge-primary" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>You</span>}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{u.workouts} workouts this month</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.7rem", color: u.trend === "up" ? "var(--accent-green)" : u.trend === "down" ? "var(--accent-red)" : "var(--text-muted)" }}>
                  {u.trend === "up" ? "▲" : u.trend === "down" ? "▼" : "—"}
                </span>
                <span className="badge badge-primary" style={{ fontSize: "0.8rem" }}>{u.points.toLocaleString()} pts</span>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(108,99,255,0.06)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center" }}>
            💡 Complete workouts and challenges to earn points and climb the leaderboard!
          </div>
        </div>
      )}

      {/* ═══════════════ ACHIEVEMENTS TAB ═══════════════ */}
      {viewTab === "achievements" && (
        <div className="animate-fade">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: "1.1rem" }}>🏅 Your Achievements</h3>
            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
              {achievements.filter(a => a.earned).length}/{achievements.length} Earned
            </span>
          </div>

          {/* Progress */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span>Achievement Progress</span>
              <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>{achievements.filter(a => a.earned).length}/{achievements.length}</span>
            </div>
            <div style={{ height: 8, background: "var(--bg-secondary)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(achievements.filter(a => a.earned).length / achievements.length) * 100}%`, height: "100%", background: "var(--gradient-success)", borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
            {achievements.map((a, i) => (
              <div
                key={i}
                className="achievement-badge"
                style={{
                  opacity: a.earned ? 1 : 0.4,
                  background: a.earned ? "var(--bg-card)" : "var(--bg-secondary)",
                  border: a.earned ? "1px solid rgba(0,255,136,0.25)" : "1px solid var(--border-color)",
                  position: "relative", overflow: "hidden"
                }}
              >
                {a.earned && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--gradient-success)" }} />}
                <div className="achievement-icon">{a.icon}</div>
                <div className="achievement-title">{a.title}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4, textAlign: "center", lineHeight: 1.4 }}>{a.desc}</div>
                {a.earned && <span style={{ fontSize: "0.65rem", color: "var(--accent-green)", marginTop: 6, fontWeight: 700 }}>✓ Earned</span>}
                {!a.earned && <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 6 }}>🔒 Locked</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ ACTIVITY FEED TAB ═══════════════ */}
      {viewTab === "feed" && (
        <div className="animate-fade">
          {/* Post composer */}
          {showPostInput ? (
            <div className="card" style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: "0.9rem", marginBottom: 12 }}>Share with the community</h4>
              <textarea
                className="input"
                style={{ width: "100%", minHeight: 90, resize: "vertical", marginBottom: 12 }}
                placeholder="Share your workout, achievement, or motivation..."
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPostInput(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handlePost}>
                  <Share2 size={14} /> Post
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ width: "100%", marginBottom: 20, justifyContent: "flex-start", padding: "14px 20px", color: "var(--text-muted)" }}
              onClick={() => setShowPostInput(true)}
            >
              <Share2 size={16} /> Share your progress, achievements or thoughts...
            </button>
          )}

          {/* Posts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {posts.map(p => (
              <div key={p.id} className="card" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div className="topbar-avatar" style={{ width: 40, height: 40, flexShrink: 0, fontSize: "0.9rem" }}>{p.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.user}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{p.time}</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-primary)", marginBottom: 14 }}>{p.content}</p>
                <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ gap: 6, color: p.liked ? "var(--accent-red)" : "var(--text-secondary)", fontSize: "0.8rem" }}
                    onClick={() => handleLike(p.id)}
                  >
                    <Heart size={14} fill={p.liked ? "currentColor" : "none"} /> {p.likes}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ gap: 6, color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                    <MessageCircle size={14} /> {p.comments} Comments
                  </button>
                  <VoiceReadButton text={`${p.user} posted ${p.time}: ${p.content}`} />
                  <button className="btn btn-ghost btn-sm" style={{ gap: 6, color: "var(--text-secondary)", fontSize: "0.8rem", marginLeft: "auto" }}>
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
