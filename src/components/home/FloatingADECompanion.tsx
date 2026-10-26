'use client';

import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  MessageCircle,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Send,
  Loader2,
  Sparkles,
  GraduationCap,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { matchStaticResponse, LOCAL_ADE_ROUTES, normalizeText, isLikelyEnglish } from '../../lib/adeLocalRouting';

// Error Boundary de seguridad para garantizar que nunca ocurra pantalla en blanco
class ADEErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('ADE Error Boundary safely caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function FloatingADECompanionInner() {
  const { language, setLanguage } = useLanguage();
  const currentLang = language === 'en' ? 'en' : 'es';

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Control Freemium (4 turnos gratis por visitante)
  const [sessionToken, setSessionToken] = useState<string>('');
  const [turnsRemaining, setTurnsRemaining] = useState<number>(4);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'ade' | 'user'; text: string }>>([
    {
      role: 'ade',
      text:
        currentLang === 'en'
          ? "Hello! I am ADE, your virtual admissions advisor and tutor at American Dream English. Let's practice or ask me about our Live Campus and Digital Store!"
          : "¡Hola! Soy ADE, tutora virtual y asesora de admisiones de American Dream English. ¿Te gustaría practicar en vivo o conocer nuestro Campus y Tienda Digital?"
    }
  ]);

  // Control de primera interacción obligatoria en inglés nativo
  const FIRST_GREETING_TEXT = "Hello! Welcome to American Dream English. Ready to practice your English speaking skills today?";
  const FIRST_GREETING_AUDIO = '/audio/ade/en-hello.mp3';

  const [hasInteracted, setHasInteracted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('ade_first_interaction_done'));
    }
    return false;
  });

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Reconocimiento de voz persistente y temporizador de silencio
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const shouldListenRef = useRef<boolean>(false);
  const [listeningTranscript, setListeningTranscript] = useState<string>('');
  const [voiceStatusMessage, setVoiceStatusMessage] = useState<string>('');
  
  // Grabación por MediaRecorder y Analizador VAD (Universal para Mozilla Firefox, Safari, iOS y Android)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const vadIntervalRef = useRef<any>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Memoria de turno inmediato y prevención de repetición consecutiva de audios
  const [lastResolvedIntent, setLastResolvedIntent] = useState<string | null>(null);
  const [lastAudioPlayed, setLastAudioPlayed] = useState<string | null>(null);
  const lastResolvedIntentRef = useRef<string | null>(null);
  const lastAudioPlayedRef = useRef<string | null>(null);

  // Reiniciar la sesión de práctica sin necesidad de abrir F12 ni borrar manualmente
  const handleResetSession = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ade_turns_remaining');
        sessionStorage.removeItem('ade_first_interaction_done');
        const newToken = 'ade_guest_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
        localStorage.setItem('ade_session_token', newToken);
        setSessionToken(newToken);
      }
    } catch (e) {}
    setHasInteracted(false);
    setTurnsRemaining(10);
    setIsLimitReached(false);
    setVoiceStatusMessage('');
    lastResolvedIntentRef.current = null;
    lastAudioPlayedRef.current = null;
    setLastResolvedIntent(null);
    setLastAudioPlayed(null);
    setMessages((prev) => [
      ...prev,
      {
        role: 'ade',
        text:
          currentLang === 'en'
            ? "Session refreshed! What would you like to practice or explore today?"
            : "¡Práctica renovada! ¿Qué te gustaría practicar o consultar sobre American Dream English hoy?"
      }
    ]);
  };
  
  // Detección de arrastre vs clic sin conflictos de puntero
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Inicialización de sessionToken y turnos en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      let token = localStorage.getItem('ade_session_token');
      if (!token) {
        token = 'ade_guest_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
        localStorage.setItem('ade_session_token', token);
      }
      setSessionToken(token);

      const savedTurns = localStorage.getItem('ade_turns_remaining');
      if (savedTurns !== null) {
        const remaining = parseInt(savedTurns, 10);
        setTurnsRemaining(isNaN(remaining) ? 10 : remaining);
      }
    } catch (e) {
      setSessionToken('guest_' + Date.now());
    }
  }, []);

  // Auto-scroll en el chat
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isChatOpen]);

  // =========================================================================
  // SISTEMA DE VOZ INTELIGENTE (CACHÉ SUPABASE / ELEVENLABS / FALLBACK)
  // =========================================================================
  const speakFemaleVoice = async (
    text: string,
    langToUse: 'en' | 'es' = 'en',
    intentKey?: string,
    cachedAudioUrl?: string | null
  ) => {
    try {
      stopSpeaking();
      setIsSpeaking(true);

      // Si no viene cachedAudioUrl explícito, verificar automáticamente si coincide con una ruta estática
      let finalAudioUrl = cachedAudioUrl;
      let finalIntentKey = intentKey;

      if (!finalAudioUrl) {
        const detectedEnglish = isLikelyEnglish(text);
        const searchLang = detectedEnglish ? 'en' : (langToUse === 'en' && !text.match(/[¿¡áéíóúñ]/i) ? 'en' : 'es');
        const localMatch = matchStaticResponse(text, searchLang, lastResolvedIntentRef.current, lastAudioPlayedRef.current);
        if (localMatch) {
          finalAudioUrl = localMatch.audioUrl;
          finalIntentKey = localMatch.id;
        } else {
          const norm = normalizeText(text);
          const candidateRoutes = searchLang === 'en'
            ? LOCAL_ADE_ROUTES.filter((r) => r.lang === 'en')
            : LOCAL_ADE_ROUTES.filter((r) => r.lang === 'es');
          const route = candidateRoutes.find((r) => normalizeText(r.text) === norm);
          if (route) {
            finalAudioUrl = route.audioUrl;
            finalIntentKey = route.id;
          }
        }
      }

      if (finalIntentKey) {
        lastResolvedIntentRef.current = finalIntentKey;
        setLastResolvedIntent(finalIntentKey);
      }
      if (finalAudioUrl) {
        lastAudioPlayedRef.current = finalAudioUrl;
        setLastAudioPlayed(finalAudioUrl);
      }

      // 1. Audio local estático pregrabado (/audio/ade/*.mp3) - Cero consumo, voz de alta fidelidad
      if (finalAudioUrl) {
        try {
          const audio = new Audio(finalAudioUrl);
          currentAudioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = (e) => {
            console.warn('Error reproduciendo audio local:', finalAudioUrl, e);
            setIsSpeaking(false);
          };
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Play promise rejected en audio local:', err);
              setIsSpeaking(false);
            });
          }
          return;
        } catch (err) {
          console.warn('Fallo inicializando Audio local:', err);
          setIsSpeaking(false);
        }
      }

      // 2. Si no es un audio estático local, consultar /api/tts (ElevenLabs / Cache backend)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            text,
            lang: langToUse,
            isAudioEnabled: true,
            intentKey: finalIntentKey
          })
        });

        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type') || '';

        // Si el backend devuelve JSON con cachedAudioUrl
        if (res.ok && contentType.includes('application/json')) {
          const jsonData = await res.json();
          if (jsonData.cachedAudioUrl) {
            const audio = new Audio(jsonData.cachedAudioUrl);
            currentAudioRef.current = audio;
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => setIsSpeaking(false);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => setIsSpeaking(false));
            }
            return;
          }
        }

        // Si el backend devuelve el MP3 binario directo de ElevenLabs
        if (res.ok && contentType.includes('audio/mpeg')) {
          const audioBlob = await res.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => setIsSpeaking(false));
          }
          return;
        }
      } catch (err) {
        // Fallback silencioso: responder únicamente en texto sin activar voz robótica
      }

      // 3. Prohibición total de voz sintética robótica del sistema operativo.
      // Si no hay MP3 pregrabado ni respuesta de ElevenLabs, ADE responde solo en texto.
      setIsSpeaking(false);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setIsSpeaking(false);
  };

  // =========================================================================
  // RECONOCIMIENTO DE VOZ POR MICRÓFONO
  // =========================================================================
  // =========================================================================
  // RECONOCIMIENTO DE VOZ UNIVERSAL Y VAD (CHROME, EDGE, FIREFOX, SAFARI, MÓVIL)
  // =========================================================================
  const stopVoiceInput = () => {
    shouldListenRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    // Detener MediaRecorder (Firefox, Safari, etc.) si está grabando
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    // Detener SpeechRecognition nativo si estaba activo
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setIsListening(false);
  };

  // Motor universal para navegadores sin SpeechRecognition nativo (como Mozilla Firefox)
  const startMediaRecorderFallback = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setVoiceStatusMessage(
        currentLang === 'en'
          ? 'Microphone access is not supported on this browser.'
          : 'El acceso al micrófono no está disponible en este navegador.'
      );
      setTimeout(() => setVoiceStatusMessage(''), 6000);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Limpiar analizador VAD
        if (vadIntervalRef.current) {
          clearInterval(vadIntervalRef.current);
          vadIntervalRef.current = null;
        }
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch (e) {}
          audioContextRef.current = null;
        }

        // Liberar pistas del micrófono para apagar el indicador de grabación del navegador
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        const audioBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        if (audioBlob.size < 1200) {
          setIsListening(false);
          setIsTranscribing(false);
          setListeningTranscript('');
          return;
        }

        setIsListening(false);
        setIsTranscribing(true);
        setListeningTranscript(
          currentLang === 'en' ? 'Transcribing your voice with ADE...' : 'Transcribiendo tu voz con ADE...'
        );

        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          formData.append('lang', currentLang);

          const res = await fetch('/api/stt', {
            method: 'POST',
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            const text = (data?.text || '').trim();
            if (text) {
              setListeningTranscript('');
              setIsTranscribing(false);
              sendMessage(text, true);
              return;
            }
          }
        } catch (sttErr) {
          console.warn('Error en transcripción MediaRecorder:', sttErr);
        } finally {
          setIsTranscribing(false);
          setListeningTranscript('');
        }
      };

      recorder.start(250);
      setIsListening(true);
      setListeningTranscript(
        currentLang === 'en'
          ? 'Listening... Speak now, tap to stop'
          : 'Te escucho... Habla ahora, clic para parar'
      );

      // VAD (Detección de voz y silencio) con Web Audio API para Firefox y Safari
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let hasDetectedSpeech = false;
          let lastSpeechTime = Date.now();

          vadIntervalRef.current = setInterval(() => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
              if (vadIntervalRef.current) clearInterval(vadIntervalRef.current);
              return;
            }

            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;

            // Umbral de habla
            if (avg > 14) {
              hasDetectedSpeech = true;
              lastSpeechTime = Date.now();
            } else if (hasDetectedSpeech) {
              // Si ya habló y luego hubo más de 2.5s de silencio continuo -> detener automáticamente
              if (Date.now() - lastSpeechTime > 2500) {
                stopVoiceInput();
              }
            }
          }, 150);
        } catch (vadErr) {
          console.warn('AudioContext VAD warning:', vadErr);
        }
      }

      // Temporizador de inactividad de 6 segundos máximo si nadie habló
      silenceTimerRef.current = setTimeout(() => {
        stopVoiceInput();
      }, 6000);
    } catch (err: any) {
      console.warn('Error al iniciar MediaRecorder en Firefox:', err);
      setIsListening(false);
      setIsTranscribing(false);
      setVoiceStatusMessage(
        currentLang === 'en'
          ? '⚠️ Microphone blocked. Please allow microphone access in your browser settings.'
          : '⚠️ Micrófono bloqueado. Permite el acceso al micrófono en los permisos de tu navegador.'
      );
      setTimeout(() => setVoiceStatusMessage(''), 6000);
    }
  };

  const startVoiceInput = () => {
    if (isTranscribing) return;

    if (isListening) {
      stopVoiceInput();
      const captured = finalTranscriptRef.current.trim();
      if (captured) {
        sendMessage(captured, true);
        finalTranscriptRef.current = '';
        setListeningTranscript('');
      }
      return;
    }

    if (typeof window === 'undefined') return;

    stopSpeaking();
    setVoiceStatusMessage('');

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      startMediaRecorderFallback();
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;

      recognition.lang = currentLang === 'en' ? 'en-US' : 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      shouldListenRef.current = true;
      finalTranscriptRef.current = '';
      setListeningTranscript('');
      setIsListening(true);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let fullAccumulated = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            fullAccumulated += (fullAccumulated ? ' ' : '') + text;
          } else {
            interim += text;
          }
        }

        const currentSaid = (fullAccumulated || interim).trim();
        if (currentSaid) {
          finalTranscriptRef.current = fullAccumulated || currentSaid;
          setListeningTranscript(currentSaid);

          // DETECCIÓN AUTOMÁTICA DE SILENCIO (VAD cortesía 2.5s)
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (shouldListenRef.current && finalTranscriptRef.current.trim()) {
              shouldListenRef.current = false;
              stopVoiceInput();
              const textToSend = finalTranscriptRef.current.trim();
              if (textToSend) {
                finalTranscriptRef.current = '';
                setListeningTranscript('');
                sendMessage(textToSend, true);
              }
            }
          }, 2500);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          shouldListenRef.current = false;
          setIsListening(false);
          setVoiceStatusMessage(
            currentLang === 'en'
              ? '⚠️ Microphone blocked. Click the lock icon in the URL bar to allow it.'
              : '⚠️ Micrófono bloqueado. Haz clic en el candado en la barra de URL para permitirlo.'
          );
          setTimeout(() => setVoiceStatusMessage(''), 6000);
          return;
        }

        if (event.error === 'audio-capture') {
          shouldListenRef.current = false;
          setIsListening(false);
          setVoiceStatusMessage(
            currentLang === 'en'
              ? '⚠️ No microphone found. Please connect a headset or mic.'
              : '⚠️ No se encontró micrófono conectado en tu equipo.'
          );
          setTimeout(() => setVoiceStatusMessage(''), 6000);
          return;
        }

        if (event.error === 'network') {
          shouldListenRef.current = false;
          setIsListening(false);
          startMediaRecorderFallback();
          return;
        }
      };

      recognition.onend = () => {
        const textCaptured = finalTranscriptRef.current.trim();
        if (textCaptured) {
          shouldListenRef.current = false;
          setIsListening(false);
          finalTranscriptRef.current = '';
          setListeningTranscript('');
          sendMessage(textCaptured, true);
        } else if (shouldListenRef.current) {
          try {
            recognition.start();
          } catch (e) {
            shouldListenRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();

      // Temporizador de inactividad de 6 segundos máximo si no hubo habla o silencio continuo
      silenceTimerRef.current = setTimeout(() => {
        if (shouldListenRef.current) {
          shouldListenRef.current = false;
          stopVoiceInput();
          const textCaptured = finalTranscriptRef.current.trim();
          if (textCaptured) {
            finalTranscriptRef.current = '';
            setListeningTranscript('');
            sendMessage(textCaptured, true);
          }
        }
      }, 6000);

    } catch (err) {
      console.warn('Fallback a MediaRecorder tras error en SpeechRec:', err);
      shouldListenRef.current = false;
      setIsListening(false);
      startMediaRecorderFallback();
    }
  };

  // Patrón reactivo de estados de voz para UX de máxima fluidez
  type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

  const voiceState: VoiceState = isListening
    ? 'listening'
    : isTranscribing || isLoading
    ? 'processing'
    : isSpeaking
    ? 'speaking'
    : 'idle';

  // Toggle de un solo clic: Clic para hablar / Clic para detener
  const handleToggleVoice = () => {
    // Si ADE está hablando, un clic detiene el sonido
    if (voiceState === 'speaking') {
      stopSpeaking();
      return;
    }

    // Si está en estado transitorio procesando, ignorar clics repetitivos
    if (voiceState === 'processing') return;

    // Si está escuchando o grabando, segundo clic detiene inmediatamente y envía
    if (voiceState === 'listening') {
      stopVoiceInput();
      const captured = finalTranscriptRef.current.trim();
      if (captured) {
        sendMessage(captured, true);
        finalTranscriptRef.current = '';
        setListeningTranscript('');
      }
      return;
    }

    // Si es la PRIMERA VEZ que el usuario interactúa, saludar obligatoriamente en inglés nativo
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ade_first_interaction_done', 'true');
        }
      } catch (e) {}
      setLanguage('en');
      setMessages((prev) => [...prev, { role: 'ade', text: FIRST_GREETING_TEXT }]);
      speakFemaleVoice(FIRST_GREETING_TEXT, 'en', 'en-hello', FIRST_GREETING_AUDIO);
      return;
    }

    // Estado Inactivo: Un solo clic arranca el micrófono inmediatamente
    startVoiceInput();
  };

  const sendMessage = async (textToSend: string, isVoice: boolean = false) => {
    if (!textToSend.trim() || isLoading) return;

    // FILTRO DE SILENCIO / RUIDO / AUDIO NO RECONOCIDO (< 3 caracteres legibles)
    const legibleChars = textToSend.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
    if (legibleChars.length < 3) {
      if (isVoice) {
        const notice =
          currentLang === 'en'
            ? "I couldn't hear you clearly, please try speaking again."
            : 'No te alcancé a escuchar con claridad, por favor intenta de nuevo.';
        setMessages((prev) => [...prev, { role: 'ade', text: notice }]);
        setVoiceStatusMessage(notice);
        setTimeout(() => setVoiceStatusMessage(''), 4000);
      }
      setIsLoading(false);
      return;
    }

    const userMsg = textToSend.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);

    // 1. EVALUAR PRIMERO CON matchStaticResponse (COSTO CERO - OMISIÓN 100% DE APIS EXTERNAS)
    const detectedEnglish = isLikelyEnglish(userMsg);
    const hasSpanishHints = Boolean(userMsg.match(/[¿¡áéíóúñ]/i));
    const effectiveMsgLang: 'en' | 'es' = detectedEnglish && !hasSpanishHints ? 'en' : 'es';
    if (effectiveMsgLang !== currentLang) {
      setLanguage(effectiveMsgLang);
    }

    const staticMatch = matchStaticResponse(userMsg, effectiveMsgLang, lastResolvedIntentRef.current, lastAudioPlayedRef.current);
    if (staticMatch) {
      lastResolvedIntentRef.current = staticMatch.id;
      lastAudioPlayedRef.current = staticMatch.audioUrl;
      setLastResolvedIntent(staticMatch.id);
      setLastAudioPlayed(staticMatch.audioUrl);
      setMessages((prev) => [...prev, { role: 'ade', text: staticMatch.text }]);
      speakFemaleVoice(staticMatch.text, staticMatch.lang, staticMatch.id, staticMatch.audioUrl);
      return;
    }

    // 2. SI NO COINCIDE: CONTINÚA CON EL FLUJO DINÁMICO RESPETANDO EL LÍMITE DE 4 TURNOS
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          lang: effectiveMsgLang,
          sessionToken,
          isVoiceTurn: isVoice,
          lastResolvedIntent: lastResolvedIntentRef.current,
          lastAudioPlayed: lastAudioPlayedRef.current
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          if (data.intentKey) {
            lastResolvedIntentRef.current = data.intentKey;
            setLastResolvedIntent(data.intentKey);
          }
          if (data.cachedAudioUrl) {
            lastAudioPlayedRef.current = data.cachedAudioUrl;
            setLastAudioPlayed(data.cachedAudioUrl);
          }
          setMessages((prev) => [...prev, { role: 'ade', text: data.reply }]);

          // Actualizar estado freemium
          if (typeof data.turnsRemaining === 'number') {
            setTurnsRemaining(data.turnsRemaining);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('ade_turns_remaining', String(data.turnsRemaining));
              } catch (e) {}
            }
          }
          if (data.limitReached) {
            setIsLimitReached(true);
          }

          // Reproducir respuesta de ADE (Solo voz si el usuario habló o si vino audio local pregrabado en caché)
          const isReplyEnglish = isLikelyEnglish(data.reply) || effectiveMsgLang === 'en';
          if (isVoice || data.cachedAudioUrl) {
            speakFemaleVoice(data.reply, isReplyEnglish ? 'en' : 'es', data.intentKey, data.cachedAudioUrl);
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ade',
          text:
            effectiveMsgLang === 'en'
              ? 'At American Dream English you speak in real-time with certified live C1 teachers. Tell me, what would you like to achieve today?'
              : 'En American Dream English aprendes con docentes C1 en vivo y seguimiento personalizado. ¡Haz clic en "Matricúlate" para asegurar tu cupo!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchAvatar = () => {
    // Si el usuario estaba arrastrando, no ejecutar el clic
    if (isDraggingRef.current) return;

    // Si ADE ya está hablando, detener la voz al presionar el avatar
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    // Si es la PRIMERA VEZ que el usuario interactúa, saludar obligatoriamente en inglés nativo
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ade_first_interaction_done', 'true');
        }
      } catch (e) {}
      setLanguage('en');
      setMessages((prev) => [...prev, { role: 'ade', text: FIRST_GREETING_TEXT }]);
      speakFemaleVoice(FIRST_GREETING_TEXT, 'en', 'en-hello', FIRST_GREETING_AUDIO);
      return;
    }

    // Reproducir bienvenida con el audio local MP3 pregrabado en ElevenLabs
    const isEn = currentLang === 'en';
    const welcomeText = isEn
      ? 'Hello and welcome to American Dream English! I am ADE, your virtual advisor and tutor. How can I help you achieve fluency today?'
      : '¡Hola! Te doy una cálida bienvenida a American Dream English. Soy ADE, tu tutora virtual, y estoy aquí para ayudarte a alcanzar la fluidez en inglés. ¿En qué te puedo asesorar hoy?';
    const welcomeAudio = isEn ? '/audio/ade/en-hello.mp3' : '/audio/ade/es-bienvenida.mp3';
    const welcomeId = isEn ? 'en-hello' : 'es-bienvenida';

    speakFemaleVoice(welcomeText, isEn ? 'en' : 'es', welcomeId, welcomeAudio);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. COMPONENTE FLOTANTE DE ADE (RESPONSIVE MÓVIL Y ESCRITORIO) */}
      {/* ========================================================= */}
      {!isChatOpen && (
        <div className="relative z-30 pt-0.5 pointer-events-auto select-none flex flex-col items-center">
          {/* Avatar de ADE: Tamaño equilibrado en móvil (80px) y escritorio (140px) */}
          <motion.div
            onClick={handleTouchAvatar}
            animate={
              isSpeaking
                ? { scale: [1, 1.025, 1], y: [0, -2, 0] }
                : { scale: 1, y: 0 }
            }
            transition={
              isSpeaking
                ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            className="relative z-10 w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-36 sm:h-36 group flex items-end justify-center cursor-pointer transition-transform duration-200 hover:scale-105 select-none"
            title={currentLang === 'en' ? 'Tap to interact with ADE' : 'Tócame para hablar conmigo'}
          >
            {/* Aura luminosa cuando está hablando */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.08, 0.95] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-emerald-400/25 rounded-full blur-xl pointer-events-none"
              />
            )}

            {/* Imagen 100% transparente sin fondo */}
            <img
              src="/images/avatar-ade.png"
              alt="ADE - Mentora Virtual Bilingüe"
              className="w-full h-full object-contain object-bottom filter drop-shadow-2xl pointer-events-none"
            />

            {/* Ecualizador activo sobre su diadema cuando habla */}
            {isSpeaking && (
              <div className="absolute top-0 right-0 flex items-center space-x-1 bg-black/90 px-2 py-0.5 rounded-full border border-emerald-400 shadow-md backdrop-blur-xs pointer-events-none">
                <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span className="text-[7.5px] font-mono text-emerald-300 font-bold uppercase hidden sm:inline">
                  Hablando
                </span>
                <div className="flex items-center space-x-0.5 ml-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Sombra de suelo difuminada */}
          <div className="w-16 sm:w-28 h-2 bg-black/25 rounded-full blur-xs -mt-1 pointer-events-none" />

          {/* DOCK DE ACCIONES EXCLUSIVO (Centrado, amplio, limpio y SIN botón de matrícula) */}
          <div className="mt-3 flex items-center justify-center space-x-2 w-full max-w-[280px] sm:max-w-[320px]">
            {/* Botón principal de voz: Sistema toggle de un solo clic con 4 estados */}
            <button
              type="button"
              onClick={handleToggleVoice}
              disabled={voiceState === 'processing' || (voiceState === 'speaking' && isSpeaking)}
              className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center space-x-2 text-xs font-bold shadow-lg transition-all cursor-pointer border select-none ${
                voiceState === 'listening'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-red-500/50 ring-2 ring-red-400 animate-pulse border-white/40'
                  : voiceState === 'processing'
                  ? 'bg-slate-800 text-amber-300 border-slate-700 shadow-slate-900/40 cursor-wait'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-emerald-300 border-emerald-500/40 shadow-emerald-900/30'
                  : 'bg-gradient-to-r from-blue-700 via-navy-900 to-blue-600 hover:from-blue-800 hover:to-navy-950 text-white shadow-blue-900/40 hover:shadow-blue-800/60 border-white/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
              title={
                voiceState === 'listening'
                  ? (currentLang === 'en' ? 'Click to stop and send' : 'Clic para parar y enviar')
                  : voiceState === 'speaking'
                  ? (currentLang === 'en' ? 'ADE is speaking...' : 'ADE está hablando...')
                  : voiceState === 'processing'
                  ? (currentLang === 'en' ? 'Thinking...' : 'Pensando...')
                  : (currentLang === 'en' ? 'Click to talk with ADE' : 'Clic para hablar con ADE')
              }
            >
              {voiceState === 'listening' ? (
                <>
                  <span className="relative flex h-2.5 w-2.5 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span className="font-extrabold tracking-tight">
                    {currentLang === 'en' ? '🔴 Listening... Click to stop' : '🔴 Te escucho... Clic para parar'}
                  </span>
                </>
              ) : voiceState === 'processing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="font-semibold text-slate-200">
                    {currentLang === 'en' ? 'Thinking...' : 'Pensando...'}
                  </span>
                </>
              ) : voiceState === 'speaking' ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-300">
                    {currentLang === 'en' ? 'ADE is speaking...' : 'ADE está hablando...'}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-bold tracking-tight">
                    {currentLang === 'en' ? '🎙️ Talk with ADE' : '🎙️ Hablar con ADE'}
                  </span>
                </>
              )}
            </button>

            {/* Icono discreto de burbuja de chat para quien prefiera escribir */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
              title={currentLang === 'en' ? 'Open text chat' : 'Abrir chat de texto'}
              aria-label="Abrir chat de texto"
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Pill animado de transcripción en tiempo real cuando escucha */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              className="mt-2 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full text-[10.5px] font-bold tracking-tight shadow-lg border border-white/40 flex items-center space-x-1.5 max-w-[290px] animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-white shrink-0" />
              <span className="truncate">
                {listeningTranscript
                  ? `"${listeningTranscript}"`
                  : currentLang === 'en'
                  ? 'Listening... say "Hello" or ask ADE'
                  : 'Escuchando... di "Hola" o haz una pregunta'}
              </span>
            </motion.div>
          )}

          {/* Mensaje de aviso o diagnóstico de micrófono */}
          {voiceStatusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-[10.5px] shadow-lg border border-amber-300 max-w-[300px] text-center"
            >
              {voiceStatusMessage}
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VENTANA DE CHAT DEDICADA (BOTTOM SHEET EN MÓVIL / POP EN PC) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop oscuro para móviles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                stopSpeaking();
                setIsChatOpen(false);
              }}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:left-7 sm:bottom-6 w-full sm:w-[380px] h-[84vh] sm:h-[560px] max-h-[88vh] bg-white border-t sm:border-2 border-slate-300 shadow-2xl rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Barra de agarre para móviles */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 sm:hidden" />

              {/* Header del Chat con Avatar de ADE */}
              <div className="px-3.5 py-2.5 sm:p-3 bg-gradient-to-r from-navy-900 via-navy-950 to-blue-950 text-white flex items-center justify-between border-b border-navy-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white border border-blue-400/40 p-0.5 flex-shrink-0 relative">
                    <img
                      src="/images/avatar-ade.png"
                      alt="ADE"
                      className="w-full h-full object-contain object-bottom"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full"></span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-extrabold text-xs sm:text-xs text-white">ADE • Admisiones y Tutoría</h4>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[8.5px] font-bold">
                        {isSpeaking ? 'Hablando' : 'En Línea'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      American Dream English • Turbo & Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handleResetSession}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    title={currentLang === 'en' ? 'Restart practice' : 'Reiniciar práctica'}
                    aria-label="Reiniciar práctica"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="p-1.5 text-amber-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                      title="Silenciar voz"
                    >
                      <VolumeX className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setIsChatOpen(false);
                    }}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    aria-label="Cerrar chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Banner informativo elegante y enlace a matrícula */}
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-700">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Tutoría Bilingüe en Vivo • American Dream English</span>
                </div>
                <a
                  href="/matricula"
                  className="text-red-600 hover:text-red-700 font-extrabold hover:underline flex items-center space-x-0.5"
                >
                  <span>Matricularme</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Mensajes del Chat */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>

                    {m.role === 'ade' && (
                      <div className="mt-1 flex items-center space-x-2 text-[9.5px]">
                        <button
                          type="button"
                          onClick={() => speakFemaleVoice(m.text, 'en')}
                          className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Escuchar en Inglés</span>
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => speakFemaleVoice(m.text, 'es')}
                          className="inline-flex items-center space-x-1 text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Español</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Tarjeta de Conversión cuando se llega al límite de 4 turnos */}
                {isLimitReached && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-br from-amber-50 to-red-50 border border-amber-200 rounded-xl text-center space-y-2"
                  >
                    <div className="flex items-center justify-center space-x-1 text-amber-800 font-extrabold text-xs">
                      <GraduationCap className="w-4 h-4 text-red-600" />
                      <span>¡Paso a seguir para hablar fluido!</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">
                      Para continuar practicando con ADE sin límites y entrar a clases en directo con docentes C1/C2, formaliza tu matrícula hoy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <a
                        href="/matricula"
                        className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black rounded-lg shadow-md transition-all text-center flex items-center justify-center space-x-1"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-amber-200" />
                        <span>Matricularme en el Campus</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleResetSession}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        title="Reiniciar práctica"
                      >
                        <RotateCcw className="w-3 h-3 text-blue-600" />
                        <span>Reiniciar</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {isLoading && (
                  <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200 w-fit">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>ADE está procesando tu respuesta...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Accesos rápidos precargados a temas institucionales (CERO CONSUMO) */}
              <div className="px-2.5 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase flex-shrink-0">
                  Temas:
                </span>
                {[
                  { label: '🎓 Matrícula y Cupos', query: '¿Cómo me matriculo?' },
                  { label: '💰 Precios y Pagos', query: '¿Cuánto cuesta la mensualidad?' },
                  { label: '💻 Campus Virtual', query: '¿Cómo es el campus virtual?' },
                  { label: '✨ Metodología en Vivo', query: '¿Cómo es la metodología?' },
                  { label: '📚 Tienda y E-books', query: '¿Qué tienen en la tienda de ebooks?' },
                  { label: '⏰ Horarios de Clases', query: '¿Cuáles son los horarios?' },
                  { label: '📍 Sede y Ubicación', query: '¿Dónde están ubicados?' },
                  { label: '📜 Certificación MCER', query: '¿Qué certificación y resolución tienen?' },
                  { label: '🔑 Portal del Estudiante', query: '¿Cómo ingresar al portal del estudiante?' }
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(q.query, false)}
                    disabled={isLoading}
                    className="text-[9.5px] px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer font-medium flex-shrink-0"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Input con microfonito y botón de envío */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputText, false);
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 pb-safe"
              >
                <button
                  type="button"
                  onClick={startVoiceInput}
                  disabled={isTranscribing}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
                    isTranscribing
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : isListening
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                  title={isTranscribing ? 'Procesando tu voz...' : isListening ? 'Detener micrófono' : 'Presiona para hablar'}
                >
                  {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={isListening && listeningTranscript ? listeningTranscript : inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? (currentLang === 'en' ? 'Listening to your voice...' : 'Escuchando tu voz...')
                      : currentLang === 'en'
                      ? 'Ask ADE about Live Campus, Store or enroll...'
                      : 'Pregúntale a ADE por el Campus en Vivo, Tienda...'
                  }
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm sm:text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FloatingADECompanion() {
  return (
    <ADEErrorBoundary>
      <FloatingADECompanionInner />
    </ADEErrorBoundary>
  );
}
