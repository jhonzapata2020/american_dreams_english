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
import {
  chooseMediaRecorderMimeType,
  getADEAudioFormat,
  getSpeechRecognitionLocale,
  getValidTranscript,
  chooseTTSPlaybackMode,
  extractRecognitionTranscript,
  getRecognitionAction,
  selectRecognitionTranscript
} from '../../lib/adeVoiceUtils';

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
    console.warn('ADE interface diagnostic: assistant-render-error');
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Control Freemium (4 turnos gratis por visitante)
  const [sessionToken, setSessionToken] = useState<string>('');
  const [turnsRemaining, setTurnsRemaining] = useState<number>(4);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'ade' | 'user';
    text: string;
    audioUrl?: string | null;
    intentKey?: string | null;
    lang?: 'en' | 'es';
  }>>([
    {
      role: 'ade',
      text:
        currentLang === 'en'
          ? "Hello! I am ADE, your virtual admissions advisor and tutor at American Dream English. Let's practice or ask me about our Live Campus and Digital Store!"
          : "¡Hola! Soy ADE, tutora virtual y asesora de admisiones de American Dream English. ¿Te gustaría practicar en vivo o conocer nuestro Campus y Tienda Digital?",
      audioUrl: currentLang === 'en' ? '/audio/ade/en-hello.mp3' : '/audio/ade/es-bienvenida.mp3',
      intentKey: currentLang === 'en' ? 'en-hello' : 'es-bienvenida',
      lang: currentLang === 'en' ? 'en' : 'es'
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
  const hasInteractedRef = useRef(hasInteracted);
  // La bandera persistida de conversaciones anteriores no debe saltarse
  // el saludo de esta carga del componente (el historial también se reinicia).
  const hasPlayedGreetingRef = useRef(false);

  const markFirstInteraction = () => {
    hasInteractedRef.current = true;
    setHasInteracted(true);
    try {
      sessionStorage.setItem('ade_first_interaction_done', 'true');
    } catch (e) {}
  };

  useEffect(() => {
    // El flag de sesión evita repetir el saludo si el breakpoint responsive
    // desmonta y vuelve a montar el asistente durante una conversación.
    if (hasInteractedRef.current) hasPlayedGreetingRef.current = true;
  }, []);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechGenerationRef = useRef(0);
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const [blockedAudioUrl, setBlockedAudioUrl] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Reconocimiento de voz persistente y temporizador de silencio
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const shouldListenRef = useRef<boolean>(false);
  const [listeningTranscript, setListeningTranscript] = useState<string>('');
  const [voiceStatusMessage, setVoiceStatusMessage] = useState<string>('');
  const showTranscriptionFailure = (durationMs = 6000, specificReason?: string) => {
    if (specificReason === 'upstream_or_vpn') {
      setVoiceStatusMessage(
        currentLang === 'en'
          ? 'Voice service unreachable. If using a VPN (e.g. ProtonVPN), try pausing it.'
          : 'No se pudo conectar al servicio de voz. Si tienes una VPN activa (ej. ProtonVPN), desactívala para hablar.'
      );
    } else {
      setVoiceStatusMessage(
        currentLang === 'en'
          ? "I couldn't transcribe that audio. Try again or type your message."
          : 'No pude transcribir ese audio. Intenta de nuevo o escribe tu mensaje.'
      );
    }
    window.setTimeout(() => setVoiceStatusMessage(''), durationMs);
  };
  const showNoSpeechStatus = () => {
    showTranscriptionFailure(5000);
  };
  
  // Grabación por MediaRecorder y Analizador VAD (Universal para Mozilla Firefox, Safari, iOS y Android)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const vadIntervalRef = useRef<any>(null);
  const audioVADAvailableRef = useRef(false);
  const speechDetectedInRecordingRef = useRef(false);
  const discardCurrentRecordingRef = useRef(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Memoria de turno inmediato y prevención de repetición consecutiva de audios
  const [lastResolvedIntent, setLastResolvedIntent] = useState<string | null>(null);
  const [lastAudioPlayed, setLastAudioPlayed] = useState<string | null>(null);
  const lastResolvedIntentRef = useRef<string | null>(null);
  const lastAudioPlayedRef = useRef<string | null>(null);
  const lastVoiceToggleClickRef = useRef<number>(0);
  const isTransitioningToFallbackRef = useRef<boolean>(false);
  const masterTimeoutRef = useRef<any>(null);

  const clearAllVoiceTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (masterTimeoutRef.current) {
      clearTimeout(masterTimeoutRef.current);
      masterTimeoutRef.current = null;
    }
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
  };

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
    hasInteractedRef.current = false;
    hasPlayedGreetingRef.current = false;
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
            : "¡Práctica renovada! ¿Qué te gustaría practicar o consultar sobre American Dream English hoy?",
        audioUrl: currentLang === 'en' ? '/audio/ade/en-practice.mp3' : '/audio/ade/es-bienvenida.mp3',
        intentKey: currentLang === 'en' ? 'en-practice' : 'es-bienvenida',
        lang: currentLang === 'en' ? 'en' : 'es'
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
    let requestController: AbortController | null = null;
    let requestTimeout: ReturnType<typeof setTimeout> | null = null;
    try {
      stopSpeaking();
      const speechGeneration = ++speechGenerationRef.current;
      const isCurrentSpeech = () => speechGeneration === speechGenerationRef.current;
      setIsSpeaking(true);

      // Si no viene cachedAudioUrl explícito, verificar automáticamente si coincide con una ruta estática
      let finalAudioUrl = cachedAudioUrl;
      let finalIntentKey = intentKey;

      if (!finalAudioUrl) {
        // 1. Verificación directa contra el catálogo global de 34 audios locales por transcripción exacta o normalizada
        const norm = normalizeText(text);
        const directRoute = LOCAL_ADE_ROUTES.find((r) => normalizeText(r.text) === norm);
        if (directRoute) {
          finalAudioUrl = directRoute.audioUrl;
          finalIntentKey = directRoute.id;
        } else {
          // 2. Coincidencia por intención de usuario
          const detectedEnglish = isLikelyEnglish(text);
          const searchLang = detectedEnglish ? 'en' : (langToUse === 'en' && !text.match(/[¿¡áéíóúñ]/i) ? 'en' : 'es');
          const localMatch = matchStaticResponse(text, searchLang, lastResolvedIntentRef.current, lastAudioPlayedRef.current);
          if (localMatch) {
            finalAudioUrl = localMatch.audioUrl;
            finalIntentKey = localMatch.id;
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
          console.log('>>> [ADE VOICE] Playing local ADE response audio');
          setIsSpeaking(true);
          setBlockedAudioUrl(null);

          const audio = sharedAudioRef.current || new Audio();
          currentAudioRef.current = audio;
          if (audio.getAttribute('src') !== finalAudioUrl) {
            audio.src = finalAudioUrl;
          }
          audio.currentTime = 0;
          audio.onended = () => {
            if (isCurrentSpeech()) setIsSpeaking(false);
          };
          audio.onerror = (e) => {
            console.warn('>>> [ADE VOICE] Local audio playback failed');
            if (isCurrentSpeech()) setIsSpeaking(false);
          };
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('>>> [ADE VOICE] Local audio playback was blocked');
              if (isCurrentSpeech()) {
                setIsSpeaking(false);
                setBlockedAudioUrl(finalAudioUrl);
              }
            });
          }
          return;
        } catch (err) {
          console.error('>>> [ADE VOICE] Could not initialize local audio playback');
          if (isCurrentSpeech()) setIsSpeaking(false);
          return;
        }
      }

      const speakWithBrowserVoice = () => {
        if (!isCurrentSpeech()) return;
        if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
          setIsSpeaking(false);
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langToUse === 'en' ? 'en-US' : 'es-CO';
        const voice = window.speechSynthesis.getVoices().find((item) =>
          item.lang.toLowerCase().startsWith(langToUse === 'en' ? 'en' : 'es')
        );
        if (voice) utterance.voice = voice;
        utterance.onend = () => { if (isCurrentSpeech()) setIsSpeaking(false); };
        utterance.onerror = () => { if (isCurrentSpeech()) setIsSpeaking(false); };
        window.speechSynthesis.speak(utterance);
      };

      // 2. Si no es un audio estático local, sintetizar dinámicamente mediante /api/tts
      console.log('>>> [ADE VOICE] Requesting dynamic speech audio');
      try {
        const controller = new AbortController();
        requestController = controller;
        ttsAbortControllerRef.current = controller;
        requestTimeout = setTimeout(() => controller.abort(), 7000);

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

        if (requestTimeout) clearTimeout(requestTimeout);
        requestTimeout = null;
        if (ttsAbortControllerRef.current === controller) ttsAbortControllerRef.current = null;
        if (!isCurrentSpeech()) return;

        const contentType = res.headers.get('content-type') || '';

        const jsonData = res.ok && contentType.includes('application/json')
          ? await res.json().catch(() => null)
          : null;
        if (!isCurrentSpeech()) return;
        const playbackMode = chooseTTSPlaybackMode(res.ok, contentType, jsonData || undefined);

        if (playbackMode === 'browser-speech') {
          speakWithBrowserVoice();
          return;
        }

        if (playbackMode === 'cached-audio' && jsonData?.cachedAudioUrl) {
            console.log('>>> [ADE VOICE] TTS returned cached audio');
            setIsSpeaking(true);
            setBlockedAudioUrl(null);

            const audio = sharedAudioRef.current || new Audio();
            currentAudioRef.current = audio;
            audio.src = jsonData.cachedAudioUrl;
            audio.currentTime = 0;
            audio.onended = () => { if (isCurrentSpeech()) setIsSpeaking(false); };
            audio.onerror = () => { if (isCurrentSpeech()) setIsSpeaking(false); };
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn('>>> [ADE VOICE] Cached TTS audio playback was blocked');
                if (isCurrentSpeech()) {
                  setIsSpeaking(false);
                  setBlockedAudioUrl(jsonData.cachedAudioUrl);
                }
              });
            }
            return;
        }

        if (playbackMode === 'server-audio') {
          const audioBlob = await res.blob();
          if (!isCurrentSpeech()) return;
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('>>> [ADE VOICE] Dynamic TTS audio received');
          setIsSpeaking(true);
          setBlockedAudioUrl(null);

          const audio = sharedAudioRef.current || new Audio();
          currentAudioRef.current = audio;
          audio.src = audioUrl;
          audio.currentTime = 0;

          audio.onended = () => {
            if (isCurrentSpeech()) setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = () => {
            if (isCurrentSpeech()) setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('>>> [ADE VOICE] Dynamic TTS playback was blocked');
              if (isCurrentSpeech()) {
                setIsSpeaking(false);
                setBlockedAudioUrl(audioUrl);
              }
            });
          }
          return;
        }
      } catch (err) {
        if (requestTimeout) clearTimeout(requestTimeout);
        requestTimeout = null;
        if (ttsAbortControllerRef.current === requestController) ttsAbortControllerRef.current = null;
        if (isCurrentSpeech()) console.warn('>>> [ADE VOICE] Dynamic TTS request failed');
        speakWithBrowserVoice();
        return;
      }

      if (isCurrentSpeech()) setIsSpeaking(false);
    } catch (e) {
      console.error('>>> [ADE VOICE] Speech playback failed');
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechGenerationRef.current += 1;
    if (ttsAbortControllerRef.current) {
      ttsAbortControllerRef.current.abort();
      ttsAbortControllerRef.current = null;
    }
    try {
      if (currentAudioRef.current) {
        const currentSrc = currentAudioRef.current.src;
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        if (currentSrc.startsWith('blob:')) URL.revokeObjectURL(currentSrc);
        currentAudioRef.current = null;
      }
      if (sharedAudioRef.current) {
        sharedAudioRef.current.pause();
        sharedAudioRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
    setIsSpeaking(false);
    setBlockedAudioUrl(null);
  };

  // =========================================================================
  // RECONOCIMIENTO DE VOZ POR MICRÓFONO
  // =========================================================================
  // =========================================================================
  // RECONOCIMIENTO DE VOZ UNIVERSAL Y VAD (CHROME, EDGE, FIREFOX, SAFARI, MÓVIL)
  // =========================================================================
  const stopVoiceInput = () => {
    console.log('>>> [ADE STOP VOICE INPUT CALLED]');
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
      } catch (e) {
        console.warn('ADE capture diagnostic: audio-context-close-failed');
      }
      audioContextRef.current = null;
    }

    // Detener MediaRecorder (Firefox, Safari, etc.) si está grabando
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Do not let VAD reject a recording the user chose to send; it can miss quiet speech.
      discardCurrentRecordingRef.current = false;
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('ADE capture diagnostic: recorder-stop-failed');
      }
    }

    // Detener SpeechRecognition nativo si estaba activo anulando listeners para evitar disparos fantasma
    if (recognitionRef.current) {
      try {
        const rec = recognitionRef.current;
        recognitionRef.current = null;
        rec.onstart = null;
        rec.onaudiostart = null;
        rec.onsoundstart = null;
        rec.onspeechstart = null;
        rec.onspeechend = null;
        rec.onsoundend = null;
        rec.onaudioend = null;
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.stop();
      } catch (e) {
        console.warn('ADE recognition diagnostic: stop-failed');
      }
    }

    setIsListening(false);
  };

  // Motor universal para navegadores sin SpeechRecognition nativo (como Mozilla Firefox)
  const startMediaRecorderFallback = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      console.warn('ADE voice capture diagnostic: get-user-media-unavailable');
      isTransitioningToFallbackRef.current = false;
      setIsListening(false);
      setVoiceStatusMessage(
        currentLang === 'en'
          ? 'Microphone access is not supported on this browser.'
          : 'El acceso al micrófono no está disponible en este navegador.'
      );
      setTimeout(() => setVoiceStatusMessage(''), 6000);
      return;
    }

    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
      console.warn('ADE voice capture diagnostic: recorder-unavailable');
      setIsListening(false);
      setVoiceStatusMessage(currentLang === 'en'
        ? 'This browser cannot record audio for transcription.'
        : 'Este navegador no puede grabar audio para transcribirlo.');
      return;
    }
    const requestedMimeType = chooseMediaRecorderMimeType((mime) => MediaRecorder.isTypeSupported(mime));
    if (!requestedMimeType) {
      console.warn('ADE voice capture diagnostic: unsupported-format');
      setIsListening(false);
      setVoiceStatusMessage(currentLang === 'en'
        ? 'This browser cannot record a supported audio format.'
        : 'Este navegador no puede grabar un formato de audio compatible.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioVADAvailableRef.current = false;
      speechDetectedInRecordingRef.current = false;
      discardCurrentRecordingRef.current = false;

      const recorder = new MediaRecorder(stream, { mimeType: requestedMimeType });
      const mimeType = recorder.mimeType || requestedMimeType;
      if (!getADEAudioFormat(mimeType)) throw new Error('media-recorder-format-unsupported');
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        } else {
          console.info('ADE voice capture diagnostic: empty-audio-chunk');
        }
      };

      recorder.onerror = () => {
        console.warn('ADE voice capture diagnostic: recorder-error');
        discardCurrentRecordingRef.current = true;
        setIsListening(false);
        setIsTranscribing(false);
        setVoiceStatusMessage(currentLang === 'en'
          ? 'Audio capture failed. Please try again.'
          : 'Falló la captura de audio. Intenta de nuevo.');
        try {
          if (recorder.state === 'recording') recorder.stop();
        } catch {
          stream.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
          mediaRecorderRef.current = null;
          audioChunksRef.current = [];
          setIsListening(false);
          setVoiceStatusMessage(currentLang === 'en'
            ? 'Audio capture failed. Please try again.'
            : 'Falló la captura de audio. Intenta de nuevo.');
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

        if (discardCurrentRecordingRef.current) {
          discardCurrentRecordingRef.current = false;
          setIsListening(false);
          setIsTranscribing(false);
          setListeningTranscript('');
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
        console.info('ADE voice capture diagnostic: recording-stopped', { bytes: audioBlob.size });
        const recordedFormat = getADEAudioFormat(audioBlob.type || mimeType);
        if (!recordedFormat) {
          console.warn('ADE voice capture diagnostic: unsupported-recorded-mime');
          setIsListening(false);
          setIsTranscribing(false);
          setListeningTranscript('');
          setVoiceStatusMessage(currentLang === 'en'
            ? 'This browser produced an unsupported audio format. Try another browser.'
            : 'Este navegador generó un formato de audio no compatible. Prueba otro navegador.');
          return;
        }
        const maxAudioBytes = 2 * 1024 * 1024;
        if (audioBlob.size > maxAudioBytes) {
          console.warn('ADE voice capture diagnostic: audio-over-limit');
          setIsListening(false);
          setIsTranscribing(false);
          setListeningTranscript('');
          setVoiceStatusMessage(currentLang === 'en'
            ? 'That recording is too long. Please try a shorter message.'
            : 'La grabación es demasiado larga. Intenta con un mensaje más corto.');
          window.setTimeout(() => setVoiceStatusMessage(''), 5000);
          return;
        }
        if (audioBlob.size < 250) {
          console.info('ADE voice capture diagnostic: audio-empty-or-too-short');
          setIsListening(false);
          setIsTranscribing(false);
          setListeningTranscript('');
          setVoiceStatusMessage(
            currentLang === 'en'
              ? 'Audio was too short. Please try again.'
              : 'El audio fue muy breve. Intenta de nuevo.'
          );
          window.setTimeout(() => setVoiceStatusMessage(''), 4000);
          return;
        }

        setIsListening(false);
        setIsTranscribing(true);
        setListeningTranscript(
          currentLang === 'en' ? 'Transcribing your voice with ADE...' : 'Transcribiendo tu voz con ADE...'
        );

        try {
          console.log('>>> [ADE VOICE] Sending validated audio bytes to /api/stt:', audioBlob.size);
          const formData = new FormData();
          formData.append('file', audioBlob, `recording.${recordedFormat.extension}`);
          formData.append('lang', currentLang);

          const res = await fetch('/api/stt', {
            method: 'POST',
            body: formData
          });

          let data: any = null;
          try {
            data = await res.json();
          } catch {
            console.warn('ADE STT diagnostic: invalid-json-response', { status: res.status });
          }

          const text = getValidTranscript(data?.text);
          if (res.ok && text) {
            console.info('ADE STT diagnostic: transcript-received', { provider: data?.provider || 'unknown' });
            setListeningTranscript('');
            setIsTranscribing(false);
            sendMessage(text, true);
            return;
          }

          if (res.ok) {
            console.warn('ADE STT diagnostic: empty-transcription');
          } else {
            console.warn('ADE STT diagnostic: http-error', {
              status: res.status,
              category: ['stt_not_configured', 'stt_upstream_error', 'unsupported_audio_format', 'audio_too_large'].includes(data?.error)
                ? data.error
                : 'request-failed'
            });
          }
          if (res.status === 502 || res.status === 403 || data?.error === 'stt_upstream_error') {
            showTranscriptionFailure(7000, 'upstream_or_vpn');
          } else {
            showTranscriptionFailure(5000);
          }
        } catch {
          console.warn('ADE STT diagnostic: network-or-request-failure');
          showTranscriptionFailure(7000, 'upstream_or_vpn');
        } finally {
          setIsTranscribing(false);
          setListeningTranscript('');
        }
      };

      isTransitioningToFallbackRef.current = false;
      clearAllVoiceTimers();
      recorder.start(250);
      setIsListening(true);
      console.info('ADE voice capture diagnostic: recorder-started', { mimeType });
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
          audioVADAvailableRef.current = true;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
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

            // Umbral de habla calibrado para micrófonos suaves y de escritorio
            if (avg > 7) {
              speechDetectedInRecordingRef.current = true;
              lastSpeechTime = Date.now();
            } else if (speechDetectedInRecordingRef.current) {
              // Si ya habló y luego hubo más de 2.2s de silencio continuo -> detener automáticamente
              if (Date.now() - lastSpeechTime > 2200) {
                stopVoiceInput();
              }
            }
          }, 150);
        } catch {
          console.warn('ADE capture diagnostic: voice-activity-detection-unavailable');
        }
      }

      // Temporizador maestro de inactividad de 12 segundos si nadie habló
      masterTimeoutRef.current = setTimeout(() => {
        console.log('>>> [ADE VOICE] Fallback inactivity master timeout (12s) reached');
        // Submit whatever was captured: VAD may have missed a quiet voice.
        stopVoiceInput();
      }, 12000);
    } catch (err: any) {
      const errorName = typeof err?.name === 'string' ? err.name : '';
      const errorCode = typeof err?.message === 'string' ? err.message : '';
      const category = errorCode === 'media-recorder-format-unsupported' || errorName === 'NotSupportedError'
        ? 'unsupported-format'
        : errorName === 'NotAllowedError' || errorName === 'SecurityError'
        ? 'permission-denied'
        : errorName === 'NotFoundError'
        ? 'no-capture-device'
        : errorName === 'NotReadableError' || errorName === 'AbortError'
        ? 'capture-unavailable'
        : errorCode === 'media-recorder-unavailable'
        ? 'recorder-unavailable'
        : 'capture-start-failed';
      console.warn('ADE voice capture diagnostic:', category);
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      isTransitioningToFallbackRef.current = false;
      clearAllVoiceTimers();
      setIsListening(false);
      setIsTranscribing(false);
      setVoiceStatusMessage(category === 'permission-denied'
        ? currentLang === 'en' ? 'Allow microphone access to speak with ADE.' : 'Permite el acceso al micrófono para hablar con ADE.'
        : category === 'no-capture-device'
        ? currentLang === 'en' ? 'No microphone was found.' : 'No se encontró un micrófono.'
        : category === 'unsupported-format' || category === 'recorder-unavailable'
        ? currentLang === 'en' ? 'This browser cannot record a supported audio format.' : 'Este navegador no puede grabar un formato de audio compatible.'
        : currentLang === 'en' ? 'Audio capture failed. Check the microphone and try again.' : 'Falló la captura. Revisa el micrófono e intenta de nuevo.');
      setTimeout(() => setVoiceStatusMessage(''), 6000);
    }
  };

  const handoffToMediaRecorder = () => {
    if (isTransitioningToFallbackRef.current) return;
    isTransitioningToFallbackRef.current = true;
    shouldListenRef.current = false;
    clearAllVoiceTimers();
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try { recognition.abort(); } catch (e) {}
      recognitionRef.current = null;
    }
    startMediaRecorderFallback();
  };

  const startVoiceInput = () => {
    console.log('>>> [ADE START VOICE INPUT CALLED]', {
      isListening,
      isTranscribing,
      isLoading,
      currentLang
    });

    if (isTranscribing) return;

    if (isListening) {
      console.log('>>> [ADE START VOICE INPUT] Was already listening, stopping and sending captured text');
      stopVoiceInput();
      const captured = selectRecognitionTranscript(finalTranscriptRef.current, interimTranscriptRef.current);
      if (captured) {
        sendMessage(captured, true);
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setListeningTranscript('');
      }
      return;
    }

    if (typeof window === 'undefined') return;

    stopSpeaking();
    setVoiceStatusMessage('');

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      console.warn('>>> [ADE SPEECH REC NOT SUPPORTED] Using MediaRecorder fallback');
      startMediaRecorderFallback();
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onaudiostart = null;
          recognitionRef.current.onsoundstart = null;
          recognitionRef.current.onspeechstart = null;
          recognitionRef.current.onspeechend = null;
          recognitionRef.current.onsoundend = null;
          recognitionRef.current.onaudioend = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {
          console.warn('ADE recognition diagnostic: previous-instance-stop-failed');
        }
        recognitionRef.current = null;
      }

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;

      recognition.lang = getSpeechRecognitionLocale(
        currentLang,
        typeof navigator !== 'undefined' ? navigator.language : undefined
      );

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      shouldListenRef.current = true;
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setListeningTranscript('');
      setIsListening(true);

      const sendFinalTranscript = (allowInterim = true) => {
        const transcript = selectRecognitionTranscript(
          finalTranscriptRef.current,
          allowInterim ? interimTranscriptRef.current : ''
        );
        if (!transcript || !shouldListenRef.current) return false;
        shouldListenRef.current = false;
        clearAllVoiceTimers();
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setListeningTranscript('');
        stopVoiceInput();
        sendMessage(transcript, true);
        return true;
      };

      recognition.onstart = () => {
        console.info('ADE recognition diagnostic: started', { language: recognition.lang });
        setIsListening(true);
      };

      recognition.onaudiostart = () => {
        console.info('ADE recognition diagnostic: audio-capture-started');
      };

      recognition.onsoundstart = () => {
        console.info('ADE recognition diagnostic: sound-detected');
      };

      recognition.onspeechstart = () => {
        console.info('ADE recognition diagnostic: speech-started');
      };

      recognition.onspeechend = () => {
        console.info('ADE recognition diagnostic: speech-ended');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        if (event.results && event.results.length > 0) {
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              final += (final ? ' ' : '') + (item[0]?.transcript || '');
            } else {
              interim += (interim ? ' ' : '') + (item[0]?.transcript || '');
            }
          }
        }

        const combinedText = (final ? `${final} ${interim}` : interim).trim() || final.trim();
        if (combinedText) {
          finalTranscriptRef.current = final.trim() || combinedText;
          interimTranscriptRef.current = interim.trim();
          setListeningTranscript(combinedText);
          console.info('ADE recognition diagnostic: speech-received', { text: combinedText });

          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          // VAD estricto: El temporizador de silencio SOLO se activa tras detectar voz (1.8s)
          silenceTimerRef.current = setTimeout(() => {
            sendFinalTranscript(true);
          }, 1800);
        }
      };

      recognition.onerror = (event: any) => {
        const errorCode = typeof event?.error === 'string' ? event.error : 'unknown';
        console.warn('ADE recognition diagnostic: error', { category: errorCode });

        if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
          clearAllVoiceTimers();
          stopVoiceInput();
          setVoiceStatusMessage(
            currentLang === 'en'
              ? 'Microphone permission is needed to listen.'
              : 'Se necesita permiso del micrófono para escuchar.'
          );
          window.setTimeout(() => setVoiceStatusMessage(''), 6000);
          return;
        }

        if (errorCode === 'no-speech' || errorCode === 'aborted') {
          // En Windows Chrome/Edge, 'no-speech' salta por silencio breve; NO abortar la escucha
          return;
        }

        const hasTranscript = Boolean(selectRecognitionTranscript(
          finalTranscriptRef.current,
          interimTranscriptRef.current
        ));

        if (hasTranscript) {
          sendFinalTranscript(true);
          return;
        }

        if (errorCode === 'network') {
          console.warn('ADE recognition network drop, switching to MediaRecorder fallback');
          handoffToMediaRecorder();
        }
      };

      recognition.onend = () => {
        const hasTranscript = Boolean(selectRecognitionTranscript(
          finalTranscriptRef.current,
          interimTranscriptRef.current
        ));
        console.info('ADE recognition diagnostic: ended', {
          captured: finalTranscriptRef.current,
          shouldListen: shouldListenRef.current,
          fallingBack: isTransitioningToFallbackRef.current
        });

        if (isTransitioningToFallbackRef.current) {
          return;
        }

        if (sendFinalTranscript(true)) return;

        // Si el stream se cerró por pausa breve pero el usuario aún desea hablar, reanudar suavemente
        if (shouldListenRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.warn('ADE recognition restart failed, stopping listening');
            shouldListenRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognition.start();

      // Temporizador maestro de inactividad de 12 segundos SOLO si el usuario nunca llegó a hablar
      masterTimeoutRef.current = setTimeout(() => {
        if (shouldListenRef.current) {
          const hasTranscript = Boolean(selectRecognitionTranscript(
            finalTranscriptRef.current,
            interimTranscriptRef.current
          ));
          if (hasTranscript) {
            console.info('ADE recognition diagnostic: using-transcript-at-timeout');
            sendFinalTranscript(true);
          } else {
            console.info('ADE recognition diagnostic: timeout-inactivity');
            stopVoiceInput();
          }
        }
      }, 12000);

    } catch (err) {
      const errorName = typeof (err as any)?.name === 'string' ? (err as any).name : 'unknown';
      console.warn('ADE recognition diagnostic: start-failed', { category: errorName });
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

  // Toggle de un solo clic: Clic para hablar / Clic para detener con debouncing estricto
  const handleToggleVoice = () => {
    const now = Date.now();
    if (now - lastVoiceToggleClickRef.current < 350) {
      console.warn('>>> [ADE TOGGLE VOICE DEBOUNCED] Ignored rapid double-click within 350ms');
      return;
    }
    lastVoiceToggleClickRef.current = now;

    console.log('>>> [ADE TOGGLE VOICE CLICKED] Current state:', {
      voiceState,
      isListening,
      isSpeaking,
      shouldListen: shouldListenRef.current
    });

    // Si ADE está hablando, un clic detiene el sonido e inicia inmediatamente la escucha
    if (voiceState === 'speaking') {
      stopSpeaking();
      startVoiceInput();
      return;
    }

    // Si está en estado transitorio procesando, ignorar clics repetitivos
    if (voiceState === 'processing') return;

    // Si está escuchando o grabando, segundo clic detiene inmediatamente y envía
    if (voiceState === 'listening') {
      const recorderIsActive = mediaRecorderRef.current?.state === 'recording';
      const captured = selectRecognitionTranscript(finalTranscriptRef.current, interimTranscriptRef.current);
      stopVoiceInput();
      if (captured) {
        sendMessage(captured, true);
        finalTranscriptRef.current = '';
        interimTranscriptRef.current = '';
        setListeningTranscript('');
      } else if (!recorderIsActive) {
        setVoiceStatusMessage(
          currentLang === 'en'
            ? 'No voice detected. Tap to speak again.'
            : 'No detecté tu voz. Toca de nuevo para hablar.'
        );
        window.setTimeout(() => setVoiceStatusMessage(''), 4000);
      }
      return;
    }

    // Activar escucha de voz de inmediato al hacer clic en el avatar
    hasPlayedGreetingRef.current = true;
    startVoiceInput();
  };

  const playFirstGreeting = () => {
    if (hasPlayedGreetingRef.current) return;
    hasPlayedGreetingRef.current = true;
    markFirstInteraction();
    setMessages((prev) => [
      ...prev,
      {
        role: 'ade',
        text: FIRST_GREETING_TEXT,
        audioUrl: FIRST_GREETING_AUDIO,
        intentKey: 'en-hello',
        lang: 'en'
      }
    ]);
    speakFemaleVoice(FIRST_GREETING_TEXT, 'en', 'en-hello', FIRST_GREETING_AUDIO);
  };

  const sendMessage = async (textToSend: string, isVoice: boolean = false) => {
    const userMsg = textToSend.trim();
    if (!userMsg || isLoading) return;

    setVoiceStatusMessage(''); // Limpiar aviso de cuota o advertencia inmediatamente al enviar mensaje
    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);

    // Detectar si el mensaje es en inglés o español
    const detectedEnglish = isLikelyEnglish(userMsg);
    const hasSpanishHints =
      Boolean(userMsg.match(/[¿¡áéíóúñ]/i)) ||
      /\b(hablemos|hablar|espanol|español|necesito|saber|cursos?|clases?|programas?|niveles?|precio|precios|costo|costos|matricula|inscripcion|horarios?|hola|buenos|buenas|gracias|quiero|dime|hablame|campus virtual|aula virtual)\b/i.test(userMsg);
    // Si el mensaje no tiene señales claras de idioma, conservar el idioma
    // elegido para el reconocimiento en vez de forzar español por defecto.
    const effectiveMsgLang: 'en' | 'es' = hasSpanishHints
      ? 'es'
      : detectedEnglish
      ? 'en'
      : currentLang;
    if (effectiveMsgLang !== currentLang) {
      setLanguage(effectiveMsgLang);
    }

    // 1. EVALUAR PRIMERO CON matchStaticResponse (COSTO CERO - OMISIÓN 100% DE APIS EXTERNAS)
    let staticMatch = matchStaticResponse(userMsg, effectiveMsgLang, lastResolvedIntentRef.current, lastAudioPlayedRef.current);

    // Coincidencia rápida para consultas frecuentes sobre cursos o costos en español
    if (!staticMatch && effectiveMsgLang === 'es') {
      if (/\b(precio|precios|costo|costos|cuanto|valor|tarifa|matricula|mensualidad)\b/i.test(userMsg)) {
        staticMatch = {
          id: 'es-precios',
          lang: 'es',
          audioUrl: '/audio/ade/es-precios.mp3',
          text: 'Nuestros programas cuentan con facilidades de pago mensual y subsidios a través del Fondo Social. Puedes consultar todos los planes y valores actualizados en nuestra sección de Matrícula.',
          matchedTrigger: 'precios',
          cached: true
        };
      } else if (/\b(curso|cursos|clase|clases|programa|programas|nivel|niveles|saber de|saber acerca)\b/i.test(userMsg)) {
        staticMatch = {
          id: 'es-campus-virtual',
          lang: 'es',
          audioUrl: '/audio/ade/es-campus-virtual.mp3',
          text: 'En nuestro Campus Virtual ingresas a clases en directo las 24 horas por Microsoft Teams, interactuando cara a cara con docentes certificados C1 y C2 con retroalimentación inmediata.',
          matchedTrigger: 'cursos',
          cached: true
        };
      }
    }

    if (staticMatch) {
      console.log('>>> [ADE VOICE] Static route matched:', staticMatch.id, '| Audio:', staticMatch.audioUrl);
      lastResolvedIntentRef.current = staticMatch.id;
      lastAudioPlayedRef.current = staticMatch.audioUrl;
      setLastResolvedIntent(staticMatch.id);
      setLastAudioPlayed(staticMatch.audioUrl);
      setVoiceStatusMessage('');
      setMessages((prev) => [
        ...prev,
        {
          role: 'ade',
          text: staticMatch.text,
          audioUrl: staticMatch.audioUrl,
          intentKey: staticMatch.id,
          lang: staticMatch.lang
        }
      ]);
      speakFemaleVoice(staticMatch.text, staticMatch.lang, staticMatch.id, staticMatch.audioUrl);
      return;
    }

    // 2. SI NO COINCIDE: CONTINÚA CON EL FLUJO DINÁMICO CONVERSACIONAL HACIA /api/chat
    console.info('ADE conversation diagnostic: no-local-intent-match');
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
          setVoiceStatusMessage('');
          const isReplyEnglish = isLikelyEnglish(data.reply) || effectiveMsgLang === 'en';
          setMessages((prev) => [
            ...prev,
            {
              role: 'ade',
              text: data.reply,
              audioUrl: data.cachedAudioUrl || null,
              intentKey: data.intentKey || null,
              lang: isReplyEnglish ? 'en' : 'es'
            }
          ]);

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
              : 'En American Dream English aprendes con docentes C1 en vivo y seguimiento personalizado. ¡Haz clic en "Matricúlate" para asegurar tu cupo!',
          audioUrl: effectiveMsgLang === 'en' ? '/audio/ade/en-methodology.mp3' : '/audio/ade/es-metodologia.mp3',
          intentKey: effectiveMsgLang === 'en' ? 'en-methodology' : 'es-metodologia',
          lang: effectiveMsgLang
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchAvatar = () => {
    // Si el usuario estaba arrastrando, no ejecutar el clic
    if (isDraggingRef.current) return;

    // El primer toque siempre debe reproducir hello.mp3, incluso si sessionStorage
    // conserva una interacción anterior de una carga ya terminada.
    if (!hasPlayedGreetingRef.current) {
      setVoiceStatusMessage('');
      playFirstGreeting();
      return;
    }

    // No interrumpir hello.mp3 si la persona vuelve a tocar mientras suena.
    if (voiceState === 'speaking') return;

    // Mantener en móvil el mismo toggle de voz que ya usa producción.
    const isMobileLayout = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobileLayout && hasInteractedRef.current) {
      handleToggleVoice();
      return;
    }

    if (voiceState === 'processing') return;
    if (isSpeaking) {
      startVoiceInput();
      return;
    }

    handleToggleVoice();
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. COMPONENTE FLOTANTE DE ADE (CLICK-TO-TALK DIRECTO EN EL AVATAR) */}
      {/* ========================================================= */}
      {!isChatOpen && isMinimized && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 select-none pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="group flex items-center gap-2 bg-[#002B49] hover:bg-[#003B64] text-white px-3 py-2 rounded-full shadow-2xl border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title={currentLang === 'en' ? 'Open ADE Assistant' : 'Abrir tutora ADE'}
            aria-label="Abrir asistente virtual ADE"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10 shrink-0">
              <img
                src="/images/avatar-ade.png"
                alt="ADE"
                className="w-full h-full object-contain object-bottom"
              />
            </div>
            <span className="font-black text-[11px] text-amber-300">ADE</span>
            <span className="hidden sm:inline text-[11px] text-slate-200 font-semibold">Tutor</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </button>
        </motion.div>
      )}

      {!isChatOpen && !isMinimized && (
        <div className="fixed bottom-5 right-5 lg:right-6 z-50 flex flex-col items-center gap-1 select-none pointer-events-auto">
          {/* BOTÓN DISCRETO PARA MINIMIZAR/COLAPSAR ADE (EVITA SOLAPAMIENTO EN MÓVILES) */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="absolute -top-2 -right-2 z-40 w-6 h-6 rounded-full bg-slate-900/90 hover:bg-slate-950 text-slate-200 hover:text-white flex items-center justify-center shadow-lg border border-white/20 text-xs cursor-pointer transition-all hover:scale-110 active:scale-95"
            title={currentLang === 'en' ? 'Minimize ADE' : 'Minimizar asistente ADE'}
            aria-label="Minimizar ADE"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          
          {/* AVATAR DE ADE CON COMPORTAMIENTO CLICK-TO-TALK DIRECTO */}
          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={voiceState === 'processing'}
            aria-label={
              voiceState === 'listening'
                ? (currentLang === 'en' ? 'Stop listening' : 'Detener escucha')
                : (currentLang === 'en' ? 'Talk with ADE' : 'Haz clic para hablar con ADE')
            }
            className="relative group flex items-center justify-center focus:outline-none cursor-pointer select-none"
          >
            {/* TOOLTIP DISCRETO SUPERIOR EN HOVER (ESTADO IDLE) */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
              <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full shadow-lg font-medium">
                {voiceState === 'listening'
                  ? (currentLang === 'en' ? 'Click to stop & send' : 'Clic para enviar')
                  : voiceState === 'speaking'
                  ? (currentLang === 'en' ? 'ADE is speaking...' : 'ADE respondiendo...')
                  : voiceState === 'processing'
                  ? (currentLang === 'en' ? 'Thinking...' : 'Pensando...')
                  : (currentLang === 'en' ? 'Click to talk' : 'Haz clic para hablar')}
              </div>
            </div>

            {/* ONDAS SONORAS CONCÉNTRICAS (ESTADO ESCUCHANDO) */}
            {voiceState === 'listening' && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-60 pointer-events-none" />
                <span className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-ping opacity-40 [animation-delay:350ms] pointer-events-none" />
              </>
            )}

            {/* BADGE DE ESTADO ACTIVO SUPERIOR MIENTRAS ESCUCHA */}
            {voiceState === 'listening' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none">
                <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>{currentLang === 'en' ? 'Listening...' : 'Escuchando...'}</span>
                </div>
              </div>
            )}

            {/* BADGE DE ESTADO ACTIVO MIENTRAS PROCESA */}
            {voiceState === 'processing' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none">
                <div className="bg-slate-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-amber-300" />
                  <span>{currentLang === 'en' ? 'Thinking...' : 'Pensando...'}</span>
                </div>
              </div>
            )}

            {/* CONTENEDOR DEL AVATAR CON FEEDBACK VISUAL Y MOTION */}
            <motion.div
              animate={
                voiceState === 'speaking'
                  ? { scale: [1, 1.03, 1], y: [0, -2, 0] }
                  : voiceState === 'listening'
                  ? { scale: [1, 1.04, 1] }
                  : { scale: 1, y: 0 }
              }
              transition={
                voiceState === 'speaking' || voiceState === 'listening'
                  ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
                  : { duration: 0.25 }
              }
              className={`relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-end justify-center transition-all duration-200 group-hover:scale-105 ${
                voiceState === 'listening'
                  ? 'ring-4 ring-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.5)]'
                  : voiceState === 'speaking'
                  ? 'ring-4 ring-indigo-400/40 shadow-[0_0_25px_rgba(99,102,241,0.5)]'
                  : 'shadow-lg shadow-slate-900/10'
              }`}
            >
              {/* Aura luminosa cuando está hablando */}
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.08, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-indigo-400/25 rounded-full blur-xl pointer-events-none"
                />
              )}

              {/* Imagen 100% transparente sin fondo */}
              <img
                src="/images/avatar-ade.png"
                alt="ADE - Mentora Virtual Bilingüe"
                loading="eager"
                decoding="async"
                className="w-full h-full object-contain object-bottom filter drop-shadow-2xl pointer-events-none select-none"
              />

              {/* Ecualizador activo sobre diadema cuando habla */}
              {isSpeaking && (
                <div className="absolute top-0 right-0 flex items-center space-x-1 bg-black/90 px-1.5 py-0.5 rounded-full border border-indigo-400 shadow-md backdrop-blur-xs pointer-events-none">
                  <Volume2 className="w-2.5 h-2.5 text-indigo-300 animate-pulse" />
                  <span className="text-[7.5px] font-mono text-indigo-200 font-bold uppercase">
                    ADE
                  </span>
                  <div className="flex items-center space-x-0.5 ml-0.5">
                    <span className="w-0.5 h-2 bg-indigo-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-indigo-400 animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-indigo-400 animate-pulse" />
                  </div>
                </div>
              )}
            </motion.div>
          </button>

          {/* SOMBRA DE SUELO DIFUMINADA */}
          <div className="w-14 lg:w-16 h-1 bg-black/20 rounded-full blur-xs pointer-events-none" />

          {/* CONTROL COMPACTO DE TEXTO: MICRO-BOTÓN CIRCULAR BLANCO */}
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-md text-slate-600 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer mt-0.5"
            title={currentLang === 'en' ? 'Open text chat' : 'Abrir chat escrito'}
            aria-label="Abrir chat escrito"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          {/* AVISO O DIAGNÓSTICO DE MICRÓFONO */}
          {voiceStatusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1 px-2.5 py-1 bg-slate-900/95 text-slate-100 font-medium rounded-xl text-[10px] shadow-lg border border-slate-700 max-w-[200px] text-center"
            >
              <span>{voiceStatusMessage}</span>
            </motion.div>
          )}

          {/* RECUPERACIÓN SI EL NAVEGADOR BLOQUEA LA REPRODUCCIÓN AUTOMÁTICA */}
          {blockedAudioUrl && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={() => {
                const audio = sharedAudioRef.current || new Audio();
                currentAudioRef.current = audio;
                audio.src = blockedAudioUrl;
                audio.play().then(() => {
                  setIsSpeaking(true);
                  setBlockedAudioUrl(null);
                }).catch(() => console.error('ADE audio diagnostic: user-initiated-play-failed'));
              }}
              className="mt-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center space-x-1.5 cursor-pointer animate-bounce"
            >
              <Volume2 className="w-3 h-3 text-amber-300" />
              <span>🔊 Toca para escuchar</span>
            </motion.button>
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
                {voiceStatusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-bold text-[11px] leading-tight">{voiceStatusMessage}</span>
                    <button
                      type="button"
                      onClick={() => setVoiceStatusMessage('')}
                      className="text-slate-500 hover:text-slate-900 font-black ml-2 text-xs cursor-pointer flex-shrink-0"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {blockedAudioUrl && (
                  <motion.button
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="button"
                    onClick={() => {
                      const audio = sharedAudioRef.current || new Audio();
                      currentAudioRef.current = audio;
                      audio.src = blockedAudioUrl;
                      audio.play().then(() => {
                        setIsSpeaking(true);
                        setBlockedAudioUrl(null);
                      }).catch(() => console.error('ADE audio diagnostic: user-initiated-play-failed'));
                    }}
                    className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md cursor-pointer animate-pulse"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>🔊 Toca aquí para reproducir el audio de ADE</span>
                  </motion.button>
                )}
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
                          onClick={() => speakFemaleVoice(m.text, m.lang || 'es', m.intentKey || undefined, m.audioUrl || undefined)}
                          className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{m.lang === 'en' ? 'Escuchar en Inglés' : 'Escuchar audio'}</span>
                        </button>
                        {m.lang !== 'en' && (
                          <>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => speakFemaleVoice(m.text, 'en')}
                              className="inline-flex items-center space-x-1 text-slate-500 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                            >
                              <span>Inglés</span>
                            </button>
                          </>
                        )}
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
                  if (sharedAudioRef.current) {
                    try {
                      sharedAudioRef.current.load();
                    } catch (err) {}
                  }
                  sendMessage(inputText, false);
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 pb-safe"
              >
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
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

      {/* Elemento de audio compartido en el DOM para reproducción garantizada sin bloqueos de autoplay */}
      <audio
        ref={sharedAudioRef}
        src={FIRST_GREETING_AUDIO}
        preload="auto"
        className="hidden"
        onEnded={() => {
          console.log('>>> [ADE VOICE] Shared audio element ended');
          setIsSpeaking(false);
        }}
        onError={(e) => {
          console.warn('ADE audio diagnostic: shared-audio-playback-error');
          setIsSpeaking(false);
        }}
      />
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
