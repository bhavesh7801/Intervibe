import React from 'react';
import { Mic, MicOff, Volume2, AlertTriangle, Activity, RefreshCw, Sparkles } from 'lucide-react';

const VoiceRecorder = ({
  isRecording,
  isSupported,
  onStart,
  onStop,
  onRetrySpeech,
  transcript = '',
  interimTranscript = '',
  audioLevel = 0,
  errorMsg = null
}) => {
  if (!isSupported) {
    return (
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 text-amber-200" data-testid="voice-not-supported">
        <p className="font-semibold text-sm">Voice Input Not Supported</p>
        <p className="text-xs mt-1 text-amber-300/80">Please use Chrome, Edge, or Safari for voice recognition, or type your answer below.</p>
      </div>
    );
  }

  return (
    <div className="card-3d rounded-2xl p-4 sm:p-6 mb-6" data-testid="voice-recorder">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isRecording ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-[#2B2144] text-rose-400'
          }`}>
            <Volume2 size={20} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#E2E8F0]">Voice Answer Recording</h3>
            <p className="text-xs text-slate-400">Speak your answer directly into your microphone</p>
          </div>
        </div>

        <button
          type="button"
          onClick={isRecording ? onStop : onStart}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 w-full sm:w-auto ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 animate-pulse'
              : 'bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white shadow-md hover:shadow-rose-500/20'
          }`}
          data-testid="voice-toggle-btn"
        >
          {isRecording ? (
            <>
              <MicOff size={18} />
              Stop Recording
            </>
          ) : (
            <>
              <Mic size={18} />
              Start Recording
            </>
          )}
        </button>
      </div>

      {/* Error Message Banner with Retry and AI Whisper Transcribe Buttons */}
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isRecording && (
              <button
                type="button"
                onClick={onStop}
                className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-bold flex items-center gap-1.5 transition-colors border border-purple-500/40"
              >
                <Sparkles size={12} className="text-purple-300 animate-spin" />
                <span>Transcribe with AI</span>
              </button>
            )}
            {onRetrySpeech && (
              <button
                type="button"
                onClick={onRetrySpeech}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Recording Indicator, Reminder & Audio Level Visualizer */}
      {isRecording && (
        <div className="space-y-3 mb-4">
          {/* Live Recording Reminder Banner */}
          <div className="p-3 bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-purple-950/70 border border-purple-500/40 rounded-xl flex items-start gap-3 text-purple-200 text-xs animate-entrance" data-testid="voice-recording-reminder">
            <Sparkles size={18} className="text-purple-400 shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="font-bold text-white">Live Recording Active!</p>
              <p className="text-[11px] text-purple-200/90 mt-0.5 leading-relaxed">
                Spoken words are transcribing live as you talk. When you click <strong className="text-rose-400 font-bold">'Stop Recording'</strong>, your complete transcript will automatically appear in the Answer tab below for final review & AI evaluation.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl" data-testid="recording-indicator">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              </div>
              <span className="text-xs font-semibold text-rose-300">Listening... Speak into microphone</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
              <Activity size={14} className="animate-pulse text-rose-400" />
              <span>Mic: {audioLevel}%</span>
            </div>
          </div>

          {/* Animated Dynamic Waveform Visualizer */}
          <div className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#050814] rounded-xl border border-rose-500/30">
            {[35, 65, 85, 55, 100, 75, 45, 90, 80, 60, 95, 50, 70, 40].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-gradient-to-t from-rose-500 via-purple-500 to-cyan-400 rounded-full animate-waveform"
                style={{
                  height: `${Math.max(8, (h * Math.max(0.3, audioLevel / 100)))}px`,
                  animationDelay: `${(i % 5) * 0.15}s`
                }}
              />
            ))}
          </div>

          {/* Animated Volume Level Bar */}
          <div className="w-full bg-[#090710] h-2 rounded-full overflow-hidden border border-[#2B2144]">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 transition-all duration-75"
              style={{ width: `${Math.max(5, audioLevel)}%` }}
            />
          </div>
        </div>
      )}

      {/* Live Transcript Display Box */}
      <div className="bg-[#090710] rounded-xl p-4 min-h-[90px] border border-[#2B2144] flex flex-col justify-center">
        {transcript || interimTranscript ? (
          <p className="text-sm text-slate-200 leading-relaxed">
            <span>{transcript}</span>
            {interimTranscript && (
              <span className="text-rose-400 italic bg-rose-950/30 px-1 rounded ml-1 animate-pulse">
                {interimTranscript}
              </span>
            )}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic text-center">
            {isRecording ? "Start speaking your answer... Spoken words will appear here in real-time." : "Click 'Start Recording' and speak your answer."}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;