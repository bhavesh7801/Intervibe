import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Video, Sparkles } from 'lucide-react';

const WebcamPreview = ({ isRecording }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    const activeStream = streamRef.current || window.activeWebcamStream;
    if (activeStream) {
      try {
        activeStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {}
      streamRef.current = null;
      window.activeWebcamStream = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360 },
        audio: true
      });
      streamRef.current = userStream;
      window.activeWebcamStream = userStream;
      setStream(userStream);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      setupAudioAnalyser(userStream);
    } catch (err) {
      console.warn("Webcam access warning:", err);
      setError("Webcam stream unavailable. Using audio/text mode.");
    }
  };

  const setupAudioAnalyser = (mediaStream) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(mediaStream);
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn("Audio meter init error:", e);
    }
  };

  const toggleCamera = () => {
    const activeStream = streamRef.current || stream;
    if (activeStream) {
      const videoTrack = activeStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraOn;
        setCameraOn(!cameraOn);
      }
    }
  };

  const toggleMic = () => {
    const activeStream = streamRef.current || stream;
    if (activeStream) {
      const audioTrack = activeStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micOn;
        setMicOn(!micOn);
      }
    }
  };

  return (
    <div className="card-3d rounded-2xl p-4 sm:p-5 mb-6 overflow-hidden relative border border-rose-500/20 shadow-xl shadow-rose-500/5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2B2144]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Video size={14} className="text-rose-400" />
            Live Interview Video Feed
          </span>
        </div>

        {/* Camera / Mic Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2 rounded-xl transition-all ${
              micOn ? 'bg-[#1F1735] text-slate-300 hover:text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
            title={micOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {micOn ? <Mic size={15} /> : <MicOff size={15} />}
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className={`p-2 rounded-xl transition-all ${
              cameraOn ? 'bg-[#1F1735] text-slate-300 hover:text-white' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
            title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {cameraOn ? <Camera size={15} /> : <CameraOff size={15} />}
          </button>
        </div>
      </div>

      {/* Video Stream Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#090710] border border-[#2B2144] flex items-center justify-center">
        {error || !cameraOn ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-12 h-12 rounded-full bg-[#171227] flex items-center justify-center mb-2 text-slate-500">
              <CameraOff size={24} />
            </div>
            <p className="text-xs font-semibold">{error || 'Camera is turned off'}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        )}

        {/* REC & Audio Meter Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#0F0C1B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{isRecording ? 'Recording Voice' : 'Standby / Answering'}</span>
          </div>

          {/* Dynamic Audio Level Visualizer */}
          <div className="flex items-center gap-1.5 w-24">
            <Sparkles size={12} className="text-rose-400" />
            <div className="w-full bg-[#1A142A] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-cyan-400 h-1.5 rounded-full transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamPreview;
