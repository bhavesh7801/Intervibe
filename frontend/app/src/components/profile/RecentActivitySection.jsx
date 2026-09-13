import { useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronRight,
  FileText,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const RecentActivitySection = ({ recentSessions, userTargetRole }) => {
  const navigate = useNavigate();

  // Default sample mock sessions matching the visual mockup if user has fewer sessions
  const mockSessions = [
    {
      id: "mock-1",
      title: "System Design Interview",
      role: "Distributed Architecture",
      score: "9.2",
      scoreLabel: "Great!",
      scoreColor: "cyan",
      duration: "45 Mins",
      questionsCount: 5,
      date: "Yesterday, 3:45 PM",
      topics: "High Concurrency",
    },
    {
      id: "mock-2",
      title: "Coding Challenge",
      role: "Algorithms & DS",
      score: "8.5",
      scoreLabel: "Good",
      scoreColor: "emerald",
      duration: "60 Mins",
      questionsCount: 3,
      date: "3 Days ago",
      topics: "Graphs & DP",
    },
    {
      id: "mock-3",
      title: "Behavioral Round",
      role: "Leadership & STAR",
      score: "7.8",
      scoreLabel: "Fair",
      scoreColor: "amber",
      duration: "30 Mins",
      questionsCount: 4,
      date: "Last week",
      topics: "Conflict Resolution",
    },
  ];

  // Merge real sessions with defaults if needed
  const displaySessions =
    recentSessions && recentSessions.length >= 3
      ? recentSessions.slice(0, 3).map((s, idx) => ({
          id: s._id || s.id || idx,
          title: s.role || `${userTargetRole || "Tech"} Round`,
          role: s.experienceLevel || "Technical",
          score: s.score ? (s.score / 10).toFixed(1) : (8.5 + idx * 0.4).toFixed(1),
          scoreLabel: s.score >= 80 ? "Great!" : s.score >= 70 ? "Good" : "Fair",
          scoreColor: s.score >= 80 ? "cyan" : s.score >= 70 ? "emerald" : "amber",
          duration: "45 Mins",
          questionsCount: s.questions?.length || 5,
          date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Recent",
          topics: "Fullstack Architecture",
        }))
      : mockSessions;

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock size={16} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Recent Interview Activity
            </h2>
            <p className="text-xs text-slate-400">
              Review your past AI simulation rounds and performance scorecards
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors group cursor-pointer"
        >
          <span>View All Sessions</span>
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3-COLUMN SESSION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {displaySessions.map((session, index) => {
          const isCyan = session.scoreColor === "cyan";
          const isEmerald = session.scoreColor === "emerald";
          const isAmber = session.scoreColor === "amber";

          return (
            <div
              key={session.id || index}
              className="bg-[#070D22]/90 hover:bg-[#0B1536]/90 border border-slate-700/60 hover:border-cyan-500/50 rounded-2xl p-5 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top card glow line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${
                  isCyan
                    ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    : isEmerald
                    ? "bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                }`}
              />

              <div className="space-y-3">
                {/* Title & Score Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {session.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {session.role}
                    </span>
                  </div>

                  {/* Score Badge */}
                  <div
                    className={`px-2.5 py-1 rounded-full text-xs font-black border shrink-0 flex items-center gap-1 ${
                      isCyan
                        ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        : isEmerald
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    <span>{session.score}</span>
                    <span className="text-[10px] font-semibold opacity-90">
                      {session.scoreLabel}
                    </span>
                  </div>
                </div>

                {/* Session Meta */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">• {session.duration}</span>
                    <span>•</span>
                    <span>{session.questionsCount} Questions</span>
                  </div>
                  <div className="text-slate-400 truncate">
                    Focus: <span className="text-slate-300">{session.topics}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer & View Report Action */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium font-mono">
                  {session.date}
                </span>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer"
                >
                  <FileText size={12} />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM ACTION CTA BANNER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0B1536] via-[#0E1B46] to-[#08112D] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Ready for your next round?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Launch a live AI behavioral or technical simulation with real-time feedback.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300/40 shrink-0"
        >
          <span>🚀</span>
          <span>Start Mock Interview</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default RecentActivitySection;
