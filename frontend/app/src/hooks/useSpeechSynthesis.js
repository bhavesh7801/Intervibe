import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSupport, setHasSupport] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSupport(true);
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        const maleKeywords = ['male', 'david', 'mark', 'alex', 'daniel', 'aaron', 'arthur', 'brian'];
        const femaleKeywords = ['female', 'samantha', 'zira', 'karen', 'victoria', 'tessa', 'ava', 'susan', 'allison'];
        
        // Strictly filter out male voices and keep only English
        const filteredVoices = availableVoices.filter(v => {
          if (!v.lang.startsWith('en')) return false;
          const nameLower = v.name.toLowerCase();
          if (maleKeywords.some(mk => nameLower.includes(mk))) return false;
          return true;
        });
        
        setVoices(filteredVoices);
        
        // 1. Try to find explicitly female voices or known female names
        let preferred = filteredVoices.find(v => 
          femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
        );
        
        // 2. Fallback to Google US English which is female by default
        if (!preferred) {
          preferred = filteredVoices.find(v => v.name.includes('Google US English'));
        }
        
        // 3. Final fallbacks
        if (!preferred) {
          preferred = filteredVoices.find(v => v.name.includes('Google')) || filteredVoices[0];
        }
        
        setSelectedVoice(preferred || null);
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn("Speech Synthesis error:", e);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [selectedVoice]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    hasSupport,
    speak,
    stop,
    voices,
    selectedVoice,
    setSelectedVoice
  };
};
