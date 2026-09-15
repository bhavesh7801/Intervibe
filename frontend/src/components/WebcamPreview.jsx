import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Video, Mic, Volume2 } from 'lucide-react';

export const WebcamPreview = ({ className = '', isEnabled = true }) => {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 360 },
            audio: false
          });
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStreamActive(true);
          }
        }
      } catch (err) {
        console.warn('Camera preview not available:', err);
        setCameraError('Camera inactive / preview mode');
        setStreamActive(false);
      }
    };

    if (isEnabled && !cameraOff) {
      startCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isEnabled, cameraOff]);

  return (
    <div className={`relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 flex flex-col items-center justify-center ${className}`}>
      {/* Video element */}
      {!cameraOff && streamActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
      ) : (
        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center gap-3 p-6 text-slate-400 bg-slate-950">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700">
            <CameraOff size={28} className="text-slate-400" />
          </div>
          <span className="text-xs font-semibold">{cameraError || 'Camera is turned off'}</span>
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-white">
          <div className={`w-2 h-2 rounded-full ${streamActive && !cameraOff ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{streamActive && !cameraOff ? 'Candidate Feed' : 'Offline'}</span>
        </div>
      </div>

      {/* Camera Toggle Button */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCameraOff(!cameraOff)}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700 transition-colors cursor-pointer text-xs"
          title={cameraOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {cameraOff ? <CameraOff size={15} /> : <Camera size={15} />}
        </button>
      </div>

      {/* AI Eye Contact Guideline Box */}
      {streamActive && !cameraOff && (
        <div className="absolute inset-x-1/4 top-1/6 bottom-1/4 border-2 border-dashed border-white/20 rounded-2xl pointer-events-none flex items-start justify-center p-2">
          <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Align Face Here</span>
        </div>
      )}
    </div>
  );
};

export default WebcamPreview;
