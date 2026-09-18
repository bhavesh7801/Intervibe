import React, { useState, useEffect } from 'react';
import { useFavicon } from '../context/FaviconContext.jsx';
import {
  Sparkles,
  Mic,
  Cpu,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Smile,
  Eye,
  RefreshCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export const FaviconPlayground = ({ isOpen, onClose, floating = true }) => {
  const { status, badge, setStatus, setBadge, setEmoji, triggerFlash } = useFavicon();
  const [activeTab, setActiveTab] = useState('modes');
  const [customBadge, setCustomBadge] = useState('3');
  const [customEmoji, setCustomEmoji] = useState('🚀');
  const [minimized, setMinimized] = useState(false);

  const EMOJI_OPTIONS = ['🎙️', '🚀', '🔥', '💡', '🤖', '⚡', '🏆', '🎯', '✨', '💻'];

  const MODES = [
    {
      id: 'idle',
      label: 'Ambient Idle',
      description: 'Breathing Intervibe gradient crystal with subtle glow pulse',
      icon: Sparkles,
      color: 'from-rose-500 to-purple-600'
    },
    {
      id: 'recording',
      label: 'Voice Recording',
      description: 'Pulsing crimson radar rings & recording indicator for live answers',
      icon: Mic,
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'processing',
      label: 'AI Evaluating',
      description: 'Rotating neon gradient cyber orbit while AI generates feedback',
      icon: Cpu,
      color: 'from-purple-500 to-cyan-500'
    },
    {
      id: 'waveform',
      label: 'Audio Equalizer',
      description: 'Real-time multi-bar sound wave frequency equalizer',
      icon: BarChart2,
      color: 'from-rose-500 to-sky-500'
    },
    {
      id: 'success',
      label: 'Test Passed / Accepted',
      description: 'Emerald victory glow with high-contrast checkmark',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'error',
      label: 'Alert / Error',
      description: 'Attention-grabbing crimson badge for warnings or errors',
      icon: AlertTriangle,
      color: 'from-rose-600 to-red-700'
    }
  ];

  if (isOpen === false) return null;

  return (
    <div
      className={`${
        floating
          ? 'fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl'
          : 'w-full'
      } rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden transition-all duration-300 shadow-[0_20px_50px_rgba(225,29,72,0.15)]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-transparent border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Interactive Favicon
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Check your browser tab to see real-time updates!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {floating && (
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={minimized ? 'Expand' : 'Minimize'}
            >
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {!minimized && (
        <div className="p-5 space-y-5">
          {/* Live Tab Simulation Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 pl-2 border-l border-slate-300 dark:border-slate-800">
                Browser Tab Simulation
              </span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 animate-pulse flex items-center justify-center text-[10px] text-white font-bold">
                  {status === 'recording'
                    ? '🔴'
                    : status === 'success'
                    ? '✓'
                    : status === 'processing'
                    ? '⚡'
                    : status === 'error'
                    ? '!'
                    : '✦'}
                </div>
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-1 bg-rose-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow">
                    {badge}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {status === 'recording'
                    ? '🎙️ Intervibe — Recording Answer...'
                    : status === 'processing'
                    ? '⚡ Intervibe — AI Evaluating...'
                    : status === 'success'
                    ? '✓ Intervibe — Solution Accepted!'
                    : 'Intervibe — AI Interview Platform'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mode Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5 block">
              Favicon Dynamic States
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const Icon = m.icon;
                const isActive = status === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setStatus(m.id);
                      setEmoji(null);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 font-semibold shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shrink-0 shadow-sm`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs truncate">{m.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges & Flash Triggers */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-rose-500" />
                Notification Badge
              </label>
              {badge && (
                <button
                  onClick={() => setBadge(null)}
                  className="text-[11px] text-rose-500 hover:underline font-medium"
                >
                  Clear Badge
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {['1', '3', '7', '99+'].map((count) => (
                <button
                  key={count}
                  onClick={() => setBadge(count)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                    badge === count
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>

            {/* Custom Emoji Favicon */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-purple-500" />
                Custom Emoji Tab Favicon
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    onClick={() => setEmoji(em)}
                    className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm transition-transform hover:scale-110 active:scale-95"
                    title={`Set favicon to ${em}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick 3-Second Flash Test */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => triggerFlash('success', 3000)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Flash Success (3s)
              </button>
              <button
                onClick={() => triggerFlash('error', 3000)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Flash Error (3s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaviconPlayground;
