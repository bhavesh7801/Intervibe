import React from 'react';
import { Mic, MicOff, Square, Play, RotateCcw, Download } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder.js';

export const VoiceRecorder = ({ onRecordingComplete, maxSeconds = 120 }) => {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    volumeLevel,
    permissionError,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStop = () => {
    stopRecording();
    if (onRecordingComplete && audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `interview_recording_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {isRecording ? 'Recording Voice Answer...' : audioUrl ? 'Voice Answer Recorded' : 'Audio Input'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          {formatTime(recordingTime)} / {formatTime(maxSeconds)}
        </span>
      </div>

      {permissionError && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {permissionError}
        </div>
      )}

      {/* Dynamic Waveform Visualizer simulation */}
      <div className="h-16 w-full bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center gap-1 px-4 overflow-hidden">
        {isRecording ? (
          Array.from({ length: 28 }).map((_, i) => {
            const dynamicHeight = Math.max(12, Math.min(54, (volumeLevel / 100) * 50 * (Math.sin(i * 0.4 + Date.now() * 0.005) + 1.2)));
            return (
              <div
                key={i}
                className="w-1.5 bg-rose-500 rounded-full transition-all duration-75"
                style={{ height: `${dynamicHeight}px` }}
              />
            );
          })
        ) : audioUrl ? (
          <div className="w-full flex items-center justify-center gap-3">
            <audio controls src={audioUrl} className="w-full max-w-sm h-10" />
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Click record below to speak your response</span>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        {!isRecording && !audioUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
          >
            <Mic size={16} />
            <span>Start Recording Answer</span>
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={handleStop}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Square size={14} className="text-rose-400" />
            <span>Finish Answer</span>
          </button>
        )}

        {audioUrl && !isRecording && (
          <>
            <button
              type="button"
              onClick={resetRecording}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Re-record</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAudio}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Save audio file"
            >
              <Download size={14} />
              <span>Save Audio</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
