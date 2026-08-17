import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../api';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(async (text) => {
    if (!text) return;
    
    stop(); // Stop any currently playing audio

    try {
      setIsSpeaking(true);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/audio/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) throw new Error("TTS generation failed");
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (err) {
      console.error("Backend TTS failed:", err);
      setIsSpeaking(false);
    }
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported: true };
};
