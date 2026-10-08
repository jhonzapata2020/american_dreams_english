'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Video, 
  ExternalLink, 
  Download, 
  Calendar, 
  CheckCircle2, 
  UploadCloud, 
  Headphones, 
  X, 
  Send, 
  Play, 
  Pause, 
  FileText, 
  Mic, 
  Film, 
  Clock, 
  MessageSquare, 
  User, 
  Search,
  CheckCircle,
  FileCheck,
  AlertCircle,
  BookOpen,
  HelpCircle,
  CornerDownRight
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'
import { getLevelConfig, LevelConfiguration } from '../../../../data/levelConfig'

interface CourseDetailProps {
  params?: { id: string }
}

interface RecordedSession {
  id: string
  lessonNumber: number
  title: string
  date: string
  duration: string
  teacher: string
  videoUrl: string
  thumbnailUrl: string
  topics: string[]
}

interface StudyMaterial {
  id: string
  title: string
  type: 'pdf' | 'audio'
  size: string
  downloadUrl: string
  description: string
  audioSrc?: string
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  points: number
  status: 'pending' | 'submitted' | 'graded'
  score?: string
  feedback?: string
}

interface ForumQuestion {
  id: string
  studentName: string
  studentAvatar: string
  date: string
  question: string
  reply?: {
    teacherName: string
    date: string
    response: string
  }
}

export default function AulaVirtualPage({ params }: CourseDetailProps) {
  const courseId = params?.id || 'a1'
  const supabase = createClient()

  // Configuración de Nivel (A1, A2, B1, B2, C1)
  const [cfg, setCfg] = useState<LevelConfiguration>(getLevelConfig(courseId))

  // Pestañas funcionales de trabajo
  const [activeTab, setActiveTab] = useState<'cronograma' | 'materiales' | 'grabadas' | 'foro' | 'tareas'>('cronograma')

  // Reproductor de Audio
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)

  // Reproductor de Video Grabado
  const [selectedVideo, setSelectedVideo] = useState<RecordedSession | null>(null)

  // Modal de Entrega de Tarea
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [studentComment, setStudentComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Estado del Foro de Dudas
  const [newQuestionText, setNewQuestionText] = useState('')
  const [forumList, setForumList] = useState<ForumQuestion[]>([
    {
      id: 'fq-1',
      studentName: 'Valeria Morales',
      studentAvatar: 'VM',
      date: 'Ayer, 04:15 PM',
      question: 'Profesor, ¿en la 3ra persona del singular con verbos terminados en consonante + y (como study) siempre cambia a -ies?',
      reply: {
        teacherName: cfg.teacherName,
        date: 'Ayer, 05:30 PM',
        response: 'Correcto Valeria. Si antes de la Y hay una consonante cambia a -ies (study -> studies). Si hay una vocal solo se agrega S (play -> plays).'
      }
    },
    {
      id: 'fq-2',
      studentName: 'Andrés Felipe Gómez',
      studentAvatar: 'AG',
      date: '05 de Octubre, 10:20 AM',
      question: '¿Dónde puedo encontrar los audios complementarios para practicar la pronunciación de la Flap-T?',
      reply: {
        teacherName: cfg.teacherName,
        date: '05 de Octubre, 11:00 AM',
        response: 'Hola Andrés. Están disponibles directamente en la pestaña "Material de Estudio" bajo el nombre Audio Lab 01.'
      }
    }
  ])

  // Cronograma semanal de 4 clases
  const weeklySchedule = [
    { day: 'Lunes', time: '7:00 PM - 8:30 PM', topic: 'Grammar Foundations & Sentence Structure', status: 'completed' },
    { day: 'Martes', time: '7:00 PM - 8:30 PM', topic: 'Listening Lab & Phonetics (Schwa & Reductions)', status: 'completed' },
    { day: 'Miércoles (HOY)', time: '7:00 PM - 8:30 PM', topic: cfg.liveClassTopic, status: 'active' },
    { day: 'Jueves', time: '7:00 PM - 8:30 PM', topic: 'Speaking Workshop & Real-Life Interaction', status: 'upcoming' }
  ]

  // Material de Estudio Directo
  const studyMaterials: StudyMaterial[] = [
    {
      id: 'mat-1',
      title: `${cfg.unit1GrammarGuide} (PDF)`,
      type: 'pdf',
      size: '2.4 MB',
      downloadUrl: '#',
      description: 'Guía oficial con explicaciones, tablas y 25 ejercicios para resolver esta semana.'
    },
    {
      id: 'mat-2',
      title: 'Audio Lab 01: Morning Routine & Daily Conversations (MP3)',
      type: 'audio',
      size: '8.7 MB',
      downloadUrl: '#',
      description: 'Pistas fonéticas de práctica con hablantes nativos para entrenar el oído.'
    },
    {
      id: 'mat-3',
      title: `${cfg.unit2GrammarGuide} (PDF)`,
      type: 'pdf',
      size: '3.1 MB',
      downloadUrl: '#',
      description: 'Material complementario para las sesiones de conversación y vocabulario laboral.'
    },
    {
      id: 'mat-4',
      title: 'Audio Lab 02: Coffee Shop, Airport & Travel Dialogues (MP3)',
      type: 'audio',
      size: '9.4 MB',
      downloadUrl: '#',
      description: 'Diálogos reales para situaciones de viaje y atención al público.'
    }
  ]

  // Clases Grabadas On-Demand
  const recordedSessions: RecordedSession[] = [
    {
      id: 'rec-04',
      lessonNumber: 4,
      title: 'Clase 04: Present Simple vs Continuous & Flap-T Pronunciation',
      date: '06 de Octubre, 2026',
      duration: '1h 20m',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      topics: ['Present Simple', 'Present Continuous', 'Reglas fonéticas', 'Ejercicios de sala']
    },
    {
      id: 'rec-03',
      lessonNumber: 3,
      title: 'Clase 03: Describing Jobs, Daily Habits & Third Person -s Rule',
      date: '02 de Octubre, 2026',
      duration: '1h 15m',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
      topics: ['Regla de la 3ra Persona (-s / -es)', 'Profesiones', 'Entrevistas Simuladas']
    },
    {
      id: 'rec-02',
      lessonNumber: 2,
      title: 'Clase 02: Subject Pronouns, Possessives & Numbers in Real Life',
      date: '28 de Septiembre, 2026',
      duration: '1h 25m',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      topics: ['Pronombres Personales', 'Adjetivos Posesivos', 'Listening Fonético']
    },
    {
      id: 'rec-01',
      lessonNumber: 1,
      title: 'Clase 01: Inducción al Curso, Metodología 4 Días & Alfabeto Fonético',
      date: '24 de Septiembre, 2026',
      duration: '1h 10m',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      topics: ['Bienvenida', 'Uso de Teams', 'Descarga de Materiales']
    }
  ]

  // Lista de Tareas y Actividades
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'task-1',
      title: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
      dueDate: '12 de Octubre, 11:59 PM',
      points: 75,
      status: 'graded',
      score: '4.8 / 5.0 (72 pts)',
      feedback: 'Buen uso de conectores y presente simple. Repasar tercera persona (she watches / he goes).'
    },
    {
      id: 'task-2',
      title: 'Actividad Oral 1: Grabación de Audio - Presentación Personal (1 min)',
      dueDate: '16 de Octubre, 11:59 PM',
      points: 100,
      status: 'submitted'
    },
    {
      id: 'task-3',
      title: 'Taller Práctico 2: Role-Play Escrito y Preguntas en Pasado',
      dueDate: '22 de Octubre, 11:59 PM',
      points: 75,
      status: 'pending'
    },
    {
      id: 'task-4',
      title: 'Evaluación Final MCER: Quiz en Línea & Entrevista Oral',
      dueDate: '31 de Octubre, 11:59 PM',
      points: 125,
      status: 'pending'
    }
  ])

  // Carga reactiva de datos según el nivel del estudiante
  useEffect(() => {
    async function loadLevel() {
      try {
        let levelKey = courseId
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('ade_student_level') || localStorage.getItem('student_level')
          if (stored && courseId === 'a1') levelKey = stored
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profile?.mcer_level && courseId === 'a1') {
            levelKey = profile.mcer_level
          }
        }

        const resolved = getLevelConfig(levelKey)
        setCfg(resolved)
      } catch (e) {}
    }
    loadLevel()
  }, [courseId])

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestionText.trim()) return

    const newQ: ForumQuestion = {
      id: `fq-${Date.now()}`,
      studentName: 'Estudiante Activo',
      studentAvatar: 'EA',
      date: 'Hace un momento',
      question: newQuestionText.trim()
    }

    setForumList([newQ, ...forumList])
    setNewQuestionText('')
  }

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName || !selectedTask) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setAssignments(prev => prev.map(a => a.id === selectedTask.id ? { ...a, status: 'submitted' } : a))
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased pb-16 selection:bg-[#0B1B3D] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE TRABAJO (100% DIRECTA Y SIN MARKETING)                */}
      {/* ========================================================================= */}
      <header className="bg-[#0B1B3D] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/campus" 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors flex items-center justify-center shrink-0"
              title="Volver a mis cursos"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  {cfg.code}
                </span>
                <span className="text-xs text-slate-300 font-medium">{cfg.levelBadge}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                {cfg.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-300">
            <span>Docente: <strong className="text-white">{cfg.teacherName}</strong></span>
          </div>

        </div>

        {/* PESTAÑAS DE TRABAJO FUNCIONALES */}
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 overflow-x-auto text-xs font-bold border-t border-white/10 pt-1">
          <button
            onClick={() => setActiveTab('cronograma')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cronograma'
                ? 'bg-slate-100 text-[#0B1B3D] border-amber-400 font-black'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. Cronograma & Clases en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('materiales')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'materiales'
                ? 'bg-slate-100 text-[#0B1B3D] border-amber-400 font-black'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Material de Estudio (PDF / Audios)</span>
          </button>

          <button
            onClick={() => setActiveTab('grabadas')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'grabadas'
                ? 'bg-slate-100 text-[#0B1B3D] border-amber-400 font-black'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>3. Clases Grabadas ({recordedSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('foro')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'foro'
                ? 'bg-slate-100 text-[#0B1B3D] border-amber-400 font-black'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>4. Foro de Dudas ({forumList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tareas')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tareas'
                ? 'bg-slate-100 text-[#0B1B3D] border-amber-400 font-black'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. Tareas & Entregas</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL POR PESTAÑAS (100% UTILITARIO)                      */}
      {/* ========================================================================= */}
      <main className="max-w-5xl mx-auto px-4 pt-6">

        {/* ======================================================================= */}
        {/* PESTAÑA 1: CRONOGRAMA & ACCESO A CLASES EN VIVO                         */}
        {/* ======================================================================= */}
        {activeTab === 'cronograma' && (
          <div className="space-y-6">
            
            {/* TARJETA DE ENLACE DE ACCESO ACTIVO */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                    Sala Sincrónica Activa
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {cfg.liveClassTopic}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {cfg.nextLiveClass} • Horario: 7:00 PM a 8:30 PM (UTC-5) • Docente: {cfg.teacherName}
                </p>
              </div>

              <a
                href="https://teams.microsoft.com/l/meetup-join/american-dream-class"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-7 py-3.5 rounded-xl text-sm shadow-md transition-all shrink-0 active:scale-95"
              >
                <Video className="w-5 h-5" />
                <span>Entrar a la Clase en Teams</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* CRONOGRAMA DE 4 DÍAS A LA SEMANA */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Cronograma de Sesiones (4 Días a la Semana)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Horario de clases sincrónicas en vivo programadas para esta semana.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  Lunes a Jueves
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weeklySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      item.status === 'active'
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : item.status === 'completed'
                        ? 'bg-slate-50 border-slate-200 opacity-80'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-slate-900">{item.day}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">({item.time})</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{item.topic}</p>
                    </div>

                    <div>
                      {item.status === 'active' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                          Hoy en Vivo
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          Dictada
                        </span>
                      )}
                      {item.status === 'upcoming' && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Próxima
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* PESTAÑA 2: MATERIAL DE ESTUDIO (PDFs & AUDIOS MP3)                      */}
        {/* ======================================================================= */}
        {activeTab === 'materiales' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Descarga de Guías de Aprendizaje y Pistas de Audio
              </h3>
              <p className="text-xs text-slate-500">
                Materiales obligatorios para estudio previo y posterior a cada clase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        mat.type === 'pdf' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {mat.type === 'pdf' ? 'DOCUMENTO PDF' : 'AUDIO MP3'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{mat.size}</span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900">{mat.title}</h4>
                    <p className="text-xs text-slate-500">{mat.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {mat.type === 'audio' && (
                      <button
                        onClick={() => setPlayingAudioId(playingAudioId === mat.id ? null : mat.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          playingAudioId === mat.id
                            ? 'bg-purple-700 text-white animate-pulse'
                            : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        {playingAudioId === mat.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{playingAudioId === mat.id ? 'Pausar Reproducción' : 'Reproducir Audio'}</span>
                      </button>
                    )}

                    <a
                      href={mat.downloadUrl}
                      download
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* PESTAÑA 3: CLASES GRABADAS (REPOSITORIO ON-DEMAND)                      */}
        {/* ======================================================================= */}
        {activeTab === 'grabadas' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Repositorio de Clases Grabadas (Teams)
                </h3>
                <p className="text-xs text-slate-500">
                  Consulta las sesiones anteriores si faltaste a una clase o deseas repasar.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                {recordedSessions.length} Grabaciones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recordedSessions.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div 
                    onClick={() => setSelectedVideo(rec)}
                    className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 cursor-pointer group flex items-center justify-center"
                  >
                    <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                      {rec.duration}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rec.date}</span>
                      <span>Docente: {rec.teacher}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{rec.title}</h4>
                  </div>

                  <button
                    onClick={() => setSelectedVideo(rec)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Ver Grabación</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* PESTAÑA 4: FORO DE DUDAS Y PREGUNTAS AL DOCENTE                         */}
        {/* ======================================================================= */}
        {activeTab === 'foro' && (
          <div className="space-y-5">
            
            {/* FORMULARIO DIRECTO PARA DEJAR DUDAS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Hacer una Pregunta Académica al Docente
              </h3>
              <form onSubmit={handleSendQuestion} className="space-y-3">
                <textarea
                  rows={2}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Escribe tu duda sobre gramática, pronunciación o actividades del curso..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-2 focus:ring-[#0B1B3D]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newQuestionText.trim()}
                    className="bg-[#0B1B3D] hover:bg-[#001f35] disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Publicar Pregunta</span>
                  </button>
                </div>
              </form>
            </div>

            {/* LISTA DE PREGUNTAS Y RESPUESTAS DEL FORO */}
            <div className="space-y-3">
              {forumList.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.studentAvatar}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-slate-900">{item.studentName}</strong>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-700">{item.question}</p>
                    </div>
                  </div>

                  {item.reply && (
                    <div className="ml-6 pl-3 border-l-2 border-amber-400 bg-amber-50/50 p-3 rounded-r-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-amber-700" />
                        <strong className="text-xs text-amber-950 font-bold">{item.reply.teacherName} (Docente)</strong>
                        <span className="text-[10px] text-amber-700">{item.reply.date}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium">{item.reply.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* PESTAÑA 5: TAREAS & ENTREGAS                                            */}
        {/* ======================================================================= */}
        {activeTab === 'tareas' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Tareas y Actividades Calificables
              </h3>
              <p className="text-xs text-slate-500">
                Consulta los plazos y adjunta tus archivos de solución.
              </p>
            </div>

            <div className="space-y-3">
              {assignments.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      {task.status === 'graded' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Calificado: {task.score}
                        </span>
                      )}
                      {task.status === 'submitted' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          Entregado (En Revisión)
                        </span>
                      )}
                      {task.status === 'pending' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          Pendiente
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500">Ponderación: {task.points} pts</span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900">{task.title}</h4>
                    <p className="text-xs text-slate-500">Fecha límite: <strong>{task.dueDate}</strong></p>

                    {task.feedback && (
                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
                        <strong>Retroalimentación Docente:</strong> {task.feedback}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTask(task)
                      setUploadFileName('')
                      setStudentComment('')
                      setSubmitSuccess(false)
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                      task.status === 'pending'
                        ? 'bg-[#0B1B3D] text-white hover:bg-[#001f35]'
                        : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {task.status === 'pending' ? 'Adjuntar Solución' : 'Ver Detalles'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL DE ENTREGA DE TAREA                                                 */}
      {/* ========================================================================= */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedTask(null)} />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 z-10 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Entrega de Actividad</span>
                <h3 className="font-black text-sm text-slate-900 mt-0.5">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-3 text-xs">
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0B1B3D] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-white group">
                <input 
                  type="file" 
                  onChange={(e) => e.target.files?.[0] && setUploadFileName(e.target.files[0].name)}
                  accept=".pdf,.mp3,.wav,.docx"
                  className="hidden" 
                />
                <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-[#0B1B3D] mb-1" />
                <span className="font-bold text-slate-800">{uploadFileName || 'Selecciona tu archivo de solución'}</span>
                <span className="text-[10px] text-slate-400">Formatos: PDF, MP3, DOCX (Máx 25 MB)</span>
              </label>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Comentario para el docente (Opcional):</label>
                <textarea
                  rows={2}
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  placeholder="Escribe alguna nota sobre tu entrega..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-xs focus:bg-white focus:ring-2 focus:ring-[#0B1B3D]"
                />
              </div>

              {submitSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Tarea guardada y enviada correctamente!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFileName}
                  className="bg-[#0B1B3D] hover:bg-[#001f35] disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg"
                >
                  {isSubmitting ? 'Guardando...' : 'Confirmar Envío'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE REPRODUCCIÓN DE VIDEO ON-DEMAND                                  */}
      {/* ========================================================================= */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedVideo(null)} />

          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col">
            <div className="p-3 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <h3 className="font-bold text-xs truncate">{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video controls className="w-full h-full" poster={selectedVideo.thumbnailUrl}>
                <source src={selectedVideo.videoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
