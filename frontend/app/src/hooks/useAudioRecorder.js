import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../apiClient';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioChunks = useRef([]);
  const accumulatedTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);
  const hasNetworkErrorRef = useRef(false);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mediaSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsSupported(!!SpeechRecognition || mediaSupported);
  }, []);

  const startRecording = useCallback(async () => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMsg(null);
    accumulatedTranscriptRef.current = '';
    audioChunks.current = [];
    isRecordingRef.current = true;
    hasNetworkErrorRef.current = false;

    // 1. Initialize Web Speech Recognition FIRST for zero-latency live word streaming
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        recognition.onresult = (event) => {
          let fullFinal = '';
          let currentInterim = '';

          for (let i = 0; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              fullFinal += transcriptChunk + ' ';
            } else {
              currentInterim += transcriptChunk;
            }
          }

          const trimmedFinal = fullFinal.trim();
          if (trimmedFinal) {
            accumulatedTranscriptRef.current = trimmedFinal;
            setTranscript(trimmedFinal);
          }
          setInterimTranscript(currentInterim.trim());
        };

        recognition.onerror = (event) => {
          console.warn("Web SpeechRecognition event:", event.error);
          if (event.error === 'not-allowed') {
            hasNetworkErrorRef.current = true;
            setErrorMsg("Microphone access blocked by browser settings.");
          } else {
            // On 'network', 'no-speech', 'aborted', or 'audio-capture', auto-retry immediately while recording
            if (isRecordingRef.current) {
              setTimeout(() => {
                if (isRecordingRef.current && recognitionRef.current) {
                  try { recognitionRef.current.start(); } catch (e) {}
                }
              }, 200);
            }
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current && !hasNetworkErrorRef.current) {
            try {
              recognition.start();
            } catch (e) {}
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("SpeechRecognition init exception:", e);
      }
    }

    // 2. Request microphone permission & start AudioContext volume meter + MediaRecorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Start Web Audio API Volume Meter
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        } catch (audioCtxErr) {
          // Silent fallback for audio context
        }

        // Start MediaRecorder for audio blob storage with 250ms timeslices
        if (window.MediaRecorder) {
          let mimeType = 'audio/webm';
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          }

          const recorderOptions = mimeType ? { mimeType } : {};
          mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);
          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunks.current.push(event.data);
            }
          };
          mediaRecorderRef.current.start(250); // Collect chunk slice every 250ms
        }
      } catch (err) {
        setErrorMsg("Microphone permission denied. Please allow microphone access in browser settings.");
        isRecordingRef.current = false;
        return;
      }
    }

    // 3. Interval live audio slice transcriber (every 3 seconds) as backup real-time stream
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (!isRecordingRef.current) return;
      if (audioChunks.current && audioChunks.current.length > 0) {
        const sliceBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        if (sliceBlob.size > 3000) {
          try {
            const data = await api.transcribeAudio(sliceBlob);
            if (data && data.transcript && data.transcript.trim() && isRecordingRef.current) {
              const liveWhisperText = data.transcript.trim();
              if (liveWhisperText.length > accumulatedTranscriptRef.current.length) {
                accumulatedTranscriptRef.current = liveWhisperText;
                setTranscript(liveWhisperText);
              }
            }
          } catch (e) {
            // Silent fallback for interval slice
          }
        }
      }
    }, 3000);

    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      isRecordingRef.current = false;
      setIsRecording(false);
      setAudioLevel(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const finalTranscript = (accumulatedTranscriptRef.current + ' ' + interimTranscript).trim();
      setInterimTranscript('');

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          if (mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
          }
          const blobType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunks.current, { type: blobType });
          resolve({ audioBlob, transcript: finalTranscript });
        };
        mediaRecorderRef.current.stop();
      } else {
        const audioBlob = audioChunks.current.length > 0 ? new Blob(audioChunks.current, { type: 'audio/webm' }) : null;
        resolve({ audioBlob, transcript: finalTranscript });
      }
    });
  }, [interimTranscript]);

  const retrySpeechRecognition = useCallback(() => {
    hasNetworkErrorRef.current = false;
    setErrorMsg(null);
    if (isRecordingRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  }, []);

  return {
    isRecording,
    isSupported,
    startRecording,
    stopRecording,
    retrySpeechRecognition,
    transcript,
    interimTranscript,
    audioLevel,
    errorMsg,
    setTranscript
  };
};