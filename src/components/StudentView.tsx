import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Award, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  Headphones,
  UserCheck,
  Check
} from 'lucide-react';
import { Challenge, Submission } from '../types';
import { createSynthesizedAudioUrl } from '../utils/audioHelper';

interface StudentViewProps {
  challenge: Challenge;
  submissions: Submission[];
  onNewSubmission: (submission: Submission) => void;
  onOpenWhatsApp: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  challenge,
  submissions,
  onNewSubmission,
  onOpenWhatsApp,
}) => {
  // Recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Filter submissions belonging to demo student or active list
  const mySubmissions = submissions;

  // Real Microphone Recording Start
  const startRecording = async () => {
    setMicErrorMessage(null);
    setAudioBlobUrl(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('El navegador no soporta captura de audio nativa.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      setMicErrorMessage('No se pudo acceder al micrófono. Puedes usar el botón discreto de "Simular grabación de prueba" abajo.');
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Synthetic Fallback Recording for Demos
  const handleSimulateRecording = () => {
    setMicErrorMessage(null);
    if (isRecording) stopRecording();
    
    // Generate synthetic audible WAV audio URL
    const syntheticUrl = createSynthesizedAudioUrl(4);
    setAudioBlobUrl(syntheticUrl);
    setRecordingSeconds(38);
  };

  // Reset Recording
  const handleResetRecording = () => {
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    setIsPlayingRecorded(false);
  };

  // Play/Pause Recorded Audio
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current || !audioBlobUrl) return;
    if (isPlayingRecorded) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  // Submit Homework
  const handleSubmitRecording = () => {
    if (!audioBlobUrl) return;

    const newSub: Submission = {
      id: 'sub-' + Date.now(),
      challengeId: challenge.id,
      studentId: 'std-1',
      studentName: 'Carlos Restrepo (Demo)',
      studentLevel: 'A2',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      audioUrl: audioBlobUrl,
      durationSeconds: recordingSeconds || 35,
      submittedAt: 'Hace un momento',
      status: 'pending',
      isSimulated: !mediaRecorderRef.current
    };

    onNewSubmission(newSub);
    setSubmissionSuccess(true);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);

    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 4000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* Top Banner Mobile-First */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Headphones className="w-4 h-4" />
              <span>Campus Virtual • Laboratorio de Voz Semanal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Vista del Estudiante (Mobile-First)
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Sede Turbo, Antioquia • Nivel A2 Funcional
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              CR
            </div>
            <div>
              <span className="font-bold text-white block">Carlos Restrepo</span>
              <span className="text-slate-400">Entrega Sábados</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION TOAST */}
      {submissionSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            <div>
              <strong className="block text-sm">¡Audio enviado con éxito al profesor!</strong>
              <span className="text-xs text-emerald-100">
                Tu entrega quedó registrada en estado "Pendiente". El profesor la evaluará el fin de semana.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CHALLENGE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
            Reto Semanal Activo • Nivel {challenge.targetLevel}
          </span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> {challenge.dueDate}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            {challenge.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        {/* Prompt phrase box */}
        <div className="bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
            Frase Guía de Ejemplo:
          </span>
          <p className="text-sm font-semibold text-indigo-950 italic">
            {challenge.promptText}
          </p>
        </div>

        {/* Phonetic Tips Checklist */}
        <div className="space-y-2 bg-emerald-50/60 border border-emerald-200/80 p-4 rounded-xl">
          <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Consejos Fonéticos para tu Audio:
          </span>
          <ul className="space-y-1.5 text-xs text-emerald-950">
            {challenge.phoneticTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------------------------------------------- */}
        {/* AUDIO RECORDER INTERFACE */}
        {/* ---------------------------------------------------- */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-6 shadow-inner relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Mic className="w-4 h-4 text-emerald-400" /> Grabadora Nativa de Voz
            </span>
            <span className="text-xs text-slate-400">
              Tiempo máximo: 60 seg
            </span>
          </div>

          {/* Error Message if Mic Permission Denied */}
          {micErrorMessage && (
            <div className="bg-amber-900/60 border border-amber-600 text-amber-200 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{micErrorMessage}</span>
            </div>
          )}

          {/* Display Timer & Wave animation */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="font-mono text-4xl font-black tracking-wider text-emerald-400">
              {formatTimer(recordingSeconds)}
            </div>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center space-x-1.5 h-10">
              {isRecording ? (
                <>
                  <div className="w-2 bg-emerald-500 rounded-full h-4 animate-audio-bar-1" />
                  <div className="w-2 bg-emerald-400 rounded-full h-8 animate-audio-bar-2" />
                  <div className="w-2 bg-indigo-400 rounded-full h-10 animate-audio-bar-3" />
                  <div className="w-2 bg-emerald-500 rounded-full h-6 animate-audio-bar-4" />
                  <div className="w-2 bg-emerald-400 rounded-full h-9 animate-audio-bar-5" />
                  <div className="w-2 bg-indigo-500 rounded-full h-5 animate-audio-bar-2" />
                  <div className="w-2 bg-emerald-500 rounded-full h-7 animate-audio-bar-1" />
                </>
              ) : (
                <span className="text-xs text-slate-500">
                  {audioBlobUrl ? 'Audio preparado para escuchar o enviar' : 'Haz clic en Grabar para iniciar tu práctica'}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            
            {/* RECORD BUTTON */}
            {!isRecording && !audioBlobUrl && (
              <button
                onClick={startRecording}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm"
              >
                <Mic className="w-5 h-5" />
                <span>Iniciar Grabación Real</span>
              </button>
            )}

            {/* STOP RECORDING */}
            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg animate-pulse transition-all flex items-center space-x-2 text-sm"
              >
                <Square className="w-5 h-5 fill-white" />
                <span>Detener Grabación</span>
              </button>
            )}

            {/* PLAY RECORDED AUDIO */}
            {audioBlobUrl && (
              <>
                <audio
                  ref={audioPlayerRef}
                  src={audioBlobUrl}
                  onEnded={() => setIsPlayingRecorded(false)}
                  className="hidden"
                />

                <button
                  onClick={togglePlayAudio}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl transition-all flex items-center space-x-2 text-sm"
                >
                  {isPlayingRecorded ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Reproducir Audio</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetRecording}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl transition-all text-xs flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a grabar</span>
                </button>

                <button
                  onClick={handleSubmitRecording}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar al Profesor</span>
                </button>
              </>
            )}

          </div>

          {/* DISCREET SIMULATION FALLBACK BUTTON FOR DEMOS */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleSimulateRecording}
              className="text-xs text-slate-400 hover:text-amber-300 underline font-medium transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simular grabación de prueba (para demostraciones sin micrófono)</span>
            </button>
          </div>

        </div>

      </div>

      {/* SUBMISSION HISTORY & TEACHER FEEDBACK CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Historial de Entregas & Retroalimentación
            </h3>
            <p className="text-xs text-slate-500">
              Audios enviados y correcciones de pronunciación para el salón presencial.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
            {mySubmissions.length} Entregas
          </span>
        </div>

        <div className="space-y-4">
          {mySubmissions.map((sub) => (
            <div
              key={sub.id}
              className={`p-5 rounded-2xl border transition-all ${
                sub.status === 'reviewed'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={sub.studentAvatar}
                    alt={sub.studentName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sub.studentName}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Enviado: {sub.submittedAt} • Duración: {sub.durationSeconds}s
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 ${
                    sub.status === 'reviewed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {sub.status === 'reviewed' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Revisado por Profesor</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pendiente de Revisión</span>
                    </>
                  )}
                </span>
              </div>

              {/* Audio Playback for History */}
              <div className="my-3 bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Audio grabado por el estudiante</span>
                </div>
                <audio controls src={sub.audioUrl} className="h-8 max-w-[200px] sm:max-w-xs" />
              </div>

              {/* TEACHER FEEDBACK BREAKDOWN IF REVIEWED */}
              {sub.status === 'reviewed' && sub.feedback && (
                <div className="mt-4 bg-white border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">
                        {sub.feedback.teacherName}
                      </span>
                    </div>
                    <div className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                      Calificación: {sub.feedback.score} / {sub.feedback.maxScore}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                      Retroalimentación de Pronunciación & Fluidez:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{sub.feedback.pronunciationNotes}"
                    </p>
                  </div>

                  <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-lg text-xs text-indigo-900">
                    <strong className="block font-bold text-indigo-950 mb-0.5">
                      📌 Tarea de Refuerzo para la Clase Presencial del Sábado:
                    </strong>
                    <span>{sub.feedback.classroomNotes}</span>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
