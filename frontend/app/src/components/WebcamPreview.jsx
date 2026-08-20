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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera access requires HTTPS or localhost. If on HTTP, please enable microphone/camera permissions in your browser settings.");
        return;
      }

      let userStream = null;

      // Tier 1: Try user-facing camera without conflicting audio
      try {
        userStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
      } catch (tier1Err) {
        console.warn("Tier 1 camera init failed, attempting fallback:", tier1Err);
        // Tier 2: Standard video fallback
        userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = userStream;
      window.activeWebcamStream = userStream;
      setStream(userStream);
      setCameraOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera permission denied. Please click the lock/camera icon in your browser's address bar to allow access.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No camera device detected on your system. Continuing in audio/text mode.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError("Camera is currently in use by another application (Zoom, Teams, etc.).");
      } else {
        setError("Camera stream unavailable. Click 'Retry Camera' below to grant permission.");
      }
    }
  };

  const toggleCamera = async () => {
    if (!cameraOn) {
      await startCamera();
    } else {
      stopCamera();
      setCameraOn(false);
    }
  };

  const toggleMic = () => {
    setMicOn(!micOn);
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
            onClick={toggleCamera}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              cameraOn && !error 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
            }`}
            title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {cameraOn && !error ? (
              <>
                <Camera size={14} />
                <span>Camera On</span>
              </>
            ) : (
              <>
                <CameraOff size={14} />
                <span>Enable Camera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Stream Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#090710] border border-[#2B2144] flex items-center justify-center">
        {error || !cameraOn ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-3 max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-[#171227] border border-[#2B2144] flex items-center justify-center text-slate-400">
              <CameraOff size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                {error ? 'Camera Unavailable' : 'Camera is currently off'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {error || 'Click Enable Camera above to turn on your front-facing video feed during mock sessions.'}
              </p>
            </div>
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-1.5 rounded-xl bg-[#1F1735] hover:bg-[#2F2350] border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Camera size={13} />
              <span>Retry Camera Permission</span>
            </button>
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
