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
  Film, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  CornerDownRight,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'
import { getLevelConfig, LevelConfiguration } from '../../../../data/levelConfig'
import { StudentProfileModal, StudentProfileData } from '../../../../components/campus/StudentProfileModal'
import { StudentAvatarMenu } from '../../../../components/campus/StudentAvatarMenu'
import { AcademicForum } from '../../../../components/campus/AcademicForum'


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
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([
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
  ])

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

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileInitialTab, setProfileInitialTab] = useState<'info' | 'security'>('info')
  const [student, setStudent] = useState<StudentProfileData>({
    id: 'stu-valeria-01',
    fullName: 'Valeria Morales Montoya',
    email: 'valeria.morales@americandream.edu.co',
    phone: '+57 300 892 3410',
    avatarUrl: '',
    docType: 'C.C.',
    docNumber: '1.040.892.341',
    currentLevel: 'A1',
    programName: 'Programa de Inglés Jóvenes y Adultos',
    studentCode: 'ADE-2026-0894',
    status: 'Matriculado Regular'
  })

  // Carga reactiva de datos según el nivel del estudiante
  useEffect(() => {
    async function loadLevel() {
      try {
        let levelKey = courseId
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('ade_student_level') || localStorage.getItem('student_level')
          if (stored && courseId === 'a1') levelKey = stored

          const savedProfile = localStorage.getItem('ade_student_profile')
          if (savedProfile) {
            try {
              const parsed = JSON.parse(savedProfile)
              if (parsed && parsed.fullName) {
                setStudent((prev) => ({ ...prev, ...parsed }))
              }
            } catch (e) {}
          }
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profile) {
            if (profile.mcer_level && courseId === 'a1') {
              levelKey = profile.mcer_level
            }
            setStudent((prev) => ({
              ...prev,
              id: profile.id,
              fullName: profile.full_name || profile.name || session.user?.user_metadata?.full_name || prev.fullName,
              email: profile.email || session.user?.email || prev.email,
              phone: profile.phone || session.user?.user_metadata?.phone || prev.phone,
              avatarUrl: profile.avatar_url || session.user?.user_metadata?.avatar_url || prev.avatarUrl,
              docType: profile.document_type || prev.docType,
              docNumber: profile.document_number || prev.docNumber,
              currentLevel: profile.mcer_level || prev.currentLevel
            }))
          }
        }

        const resolved = getLevelConfig(levelKey)
        setCfg(resolved)

        if (typeof window !== 'undefined') {
          const savedRecs = localStorage.getItem(`ade_teacher_recordings_${levelKey}`)
          if (savedRecs) {
            try {
              const parsed = JSON.parse(savedRecs)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setRecordedSessions(parsed)
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
    loadLevel()
  }, [courseId])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {}
    window.location.href = '/campus/login'
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
    <div className="min-h-screen bg-[#F0F3F7] text-slate-900 font-sans antialiased selection:bg-[#0B1528] selection:text-white sm:py-6 sm:px-4 flex flex-col items-center justify-start">
      
      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL AMPLIO (MAX-W-6XL) CON ESQUINAS REDONDEADAS TIPO APP */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto bg-[#0B1528] rounded-t-[36px] sm:rounded-[40px] overflow-hidden shadow-2xl border border-slate-700/40 flex flex-col flex-1">

        {/* ======================================================================= */}
        {/* 1. SECCIÓN SUPERIOR AZUL MARINO (#0B1528) CON PESTAÑAS FLOTANTES        */}
        {/* ======================================================================= */}
        <div className="w-full bg-[#0B1528] text-white pt-4 sm:pt-6 relative">
          
          {/* Muesca Superior Elegante (Top App Notch Curve) */}
          <div className="flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          {/* Barra Superior con distribución equilibrada: Izquierda (Volver + Nivel + Título) y Derecha (Estudiante + Docente) */}
          <div className="px-4 sm:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:py-6 border-b border-white/10">
              
              {/* Bloque izquierdo: Botón volver + Logo + Badge de nivel + Título ENGLISH LEVEL 1 */}
              <div className="flex items-center gap-3.5 w-full md:w-auto">
                <Link 
                  href="/campus" 
                  className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center justify-center shrink-0 backdrop-blur-md border border-white/15 shadow-sm"
                  title="Volver al Campus"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <Link href="/" className="shrink-0 hidden sm:flex items-center group">
                  <img 
                    src="/logo-american-dream.png" 
                    alt="American Dream English" 
                    className="h-10 sm:h-11 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform" 
                  />
                </Link>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono shadow-xs">
                      {cfg.code}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">{cfg.levelBadge}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-0.5">
                    {cfg.title}
                  </h1>
                </div>
              </div>

              {/* Bloque derecho: Ficha compacta de Estudiante y Docente alineada */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-xs text-slate-200 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Docente: <strong className="text-white font-bold">{cfg.teacherName}</strong></span>
                </div>

                <StudentAvatarMenu
                  student={student}
                  onOpenEditProfile={(tab) => {
                    setProfileInitialTab(tab || 'info')
                    setShowProfileModal(true)
                  }}
                  onLogout={handleLogout}
                  variant="header"
                />
              </div>

            </div>

            {/* PESTAÑAS ADAPTATIVAS (CENTRADO HORIZONTAL DE FORMA EQUILIBRADA) */}
            <div className="pt-4 pb-6 flex justify-center w-full">
              
              {/* VISTA MÓVIL: 5 Píldoras Compactas Integradas (100% Pantalla sin recortes) */}
              <div className="grid grid-cols-5 gap-1.5 sm:hidden p-1.5 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg w-full max-w-md">
                
                <button
                  onClick={() => setActiveTab('cronograma')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                    activeTab === 'cronograma'
                      ? 'bg-white text-[#0B1528] shadow-md scale-102'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">Clases</span>
                </button>

                <button
                  onClick={() => setActiveTab('materiales')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                    activeTab === 'materiales'
                      ? 'bg-white text-[#0B1528] shadow-md scale-102'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">Guías</span>
                </button>

                <button
                  onClick={() => setActiveTab('grabadas')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                    activeTab === 'grabadas'
                      ? 'bg-white text-[#0B1528] shadow-md scale-102'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">Videos</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                </button>

                <button
                  onClick={() => setActiveTab('foro')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-0.5 relative ${
                    activeTab === 'foro'
                      ? 'bg-white text-[#0B1528] shadow-md scale-102'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">Foro</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>

                <button
                  onClick={() => setActiveTab('tareas')}
                  className={`py-2 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-0.5 ${
                    activeTab === 'tareas'
                      ? 'bg-white text-[#0B1528] shadow-md scale-102'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="leading-tight text-[10px]">Tareas</span>
                </button>

              </div>

              {/* VISTA TABLET / ESCRITORIO: Píldoras Horizontales Holgadas Centradas */}
              <div className="hidden sm:inline-flex items-center justify-center flex-wrap gap-2 p-1.5 bg-white/10 rounded-full border border-white/15 backdrop-blur-xl shadow-lg">
                
                <button
                  onClick={() => setActiveTab('cronograma')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'cronograma'
                      ? 'bg-white text-[#0B1528] shadow-md scale-105'
                      : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Cronograma</span>
                </button>

                <button
                  onClick={() => setActiveTab('materiales')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'materiales'
                      ? 'bg-white text-[#0B1528] shadow-md scale-105'
                      : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Material</span>
                </button>

                <button
                  onClick={() => setActiveTab('grabadas')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'grabadas'
                      ? 'bg-white text-[#0B1528] shadow-md scale-105'
                      : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Grabadas</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'grabadas' ? 'bg-[#0B1528] text-white' : 'bg-white/20 text-white'}`}>
                    {recordedSessions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('foro')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'foro'
                      ? 'bg-white text-[#0B1528] font-black shadow-md scale-105'
                      : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Foro</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>

                <button
                  onClick={() => setActiveTab('tareas')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'tareas'
                      ? 'bg-white text-[#0B1528] font-black shadow-md scale-105'
                      : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tareas</span>
                </button>

              </div>

            </div>
          </div>

          {/* TRANSICIÓN DE ONDA ORGÁNICA CONTINUA */}
          <div className="w-full overflow-hidden leading-none -mb-1">
            <svg 
              viewBox="0 0 1440 100" 
              preserveAspectRatio="none" 
              className="w-full h-10 sm:h-14 text-white fill-current block"
            >
              <path d="M0,0 C320,85 520,95 760,50 C1020,10 1240,75 1440,85 L1440,100 L0,100 Z" />
            </svg>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* 2. SUPERFICIE BLANCA CONTINUA UNIFICADA                                 */}
        {/* ======================================================================= */}
        <div className="w-full bg-white flex-1 pb-32">
          <div className="px-4 sm:px-6 pt-3 sm:pt-5">

            {/* =================================================================== */}
            {/* PESTAÑA 1: CRONOGRAMA & ACCESO A CLASES EN VIVO                     */}
            {/* =================================================================== */}
            {activeTab === 'cronograma' && (
              <div className="space-y-6">
                
                {/* TARJETA DESTACADA DE CLASE EN VIVO */}
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-3xl p-5 sm:p-7 shadow-sm border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                        Sala Sincrónica Activa
                      </span>
                    </div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                      {cfg.liveClassTopic}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cfg.nextLiveClass} • 7:00 PM a 8:30 PM (UTC-5)</span>
                    </div>
                  </div>

                  <a
                    href="https://teams.microsoft.com/l/meetup-join/american-dream-class"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black px-7 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-emerald-500/25 transition-all shrink-0 active:scale-95"
                  >
                    <Video className="w-5 h-5" />
                    <span>Entrar a Clase en Teams</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>

                {/* CRONOGRAMA SEMANAL (4 DÍAS) */}
                <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                        Cronograma de la Semana
                      </h3>
                      <p className="text-xs text-slate-500">
                        4 sesiones sincrónicas en vivo por Microsoft Teams.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0B1528] bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                      Lunes a Jueves
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {weeklySchedule.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          item.status === 'active'
                            ? 'bg-white border-emerald-400 shadow-sm'
                            : item.status === 'completed'
                            ? 'bg-slate-100/80 border-slate-200 opacity-75'
                            : 'bg-white border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <strong className="text-xs font-black text-slate-900">{item.day}</strong>
                              <span className="text-[11px] text-slate-500 font-mono">({item.time})</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-snug">{item.topic}</p>
                          </div>

                          <div className="shrink-0">
                            {item.status === 'active' && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Hoy
                              </span>
                            )}
                            {item.status === 'completed' && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                Dictada
                              </span>
                            )}
                            {item.status === 'upcoming' && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                Próxima
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* PESTAÑA 2: MATERIAL DE ESTUDIO (PDFs & AUDIOS MP3)                  */}
            {/* =================================================================== */}
            {activeTab === 'materiales' && (
              <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-5">
                <div className="border-b border-slate-200/80 pb-3">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                    Guías de Aprendizaje y Audios Fonéticos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Materiales directos para estudiar antes y después de cada clase.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            mat.type === 'pdf' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {mat.type === 'pdf' ? 'GUÍA PDF' : 'AUDIO MP3'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono font-medium">{mat.size}</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{mat.title}</h4>
                        <p className="text-xs text-slate-500">{mat.description}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {mat.type === 'audio' && (
                          <button
                            onClick={() => setPlayingAudioId(playingAudioId === mat.id ? null : mat.id)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs ${
                              playingAudioId === mat.id
                                ? 'bg-purple-700 text-white animate-pulse'
                                : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                            }`}
                          >
                            {playingAudioId === mat.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            <span>{playingAudioId === mat.id ? 'Pausar' : 'Escuchar'}</span>
                          </button>
                        )}

                        <a
                          href={mat.downloadUrl}
                          download
                          className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* PESTAÑA 3: CLASES GRABADAS (ON-DEMAND)                              */}
            {/* =================================================================== */}
            {activeTab === 'grabadas' && (
              <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                      Videoteca de Sesiones Grabadas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Acceso a las grabaciones en la nube de Microsoft Teams.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                    {recordedSessions.length} Grabaciones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recordedSessions.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div 
                        onClick={() => setSelectedVideo(rec)}
                        className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer group flex items-center justify-center shadow-xs"
                      >
                        <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-bold px-2 py-0.5 rounded text-white">
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
                        className="w-full bg-slate-50 hover:bg-[#0B1528] hover:text-white text-[#0B1528] border border-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Ver Grabación</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* PESTAÑA 4: FORO DE DUDAS Y PREGUNTAS AL DOCENTE (COLABORATIVO)       */}
            {/* =================================================================== */}
            {activeTab === 'foro' && (
              <AcademicForum
                courseId={courseId}
                teacherName={cfg.teacherName}
                student={student}
              />
            )}

            {/* =================================================================== */}
            {/* PESTAÑA 5: TAREAS & ENTREGAS                                        */}
            {/* =================================================================== */}
            {activeTab === 'tareas' && (
              <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-5">
                <div className="border-b border-slate-200/80 pb-3">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                    Tareas y Actividades Calificables
                  </h3>
                  <p className="text-xs text-slate-500">
                    Revisa los plazos y envía tus soluciones en audio o documento.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {assignments.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2">
                          {task.status === 'graded' && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Calificado: {task.score}
                            </span>
                          )}
                          {task.status === 'submitted' && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Entregado (En Revisión)
                            </span>
                          )}
                          {task.status === 'pending' && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              Pendiente
                            </span>
                          )}
                          <span className="text-xs font-semibold text-slate-400">Puntos: {task.points}</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900">{task.title}</h4>
                        <p className="text-xs text-slate-500">Fecha límite: <strong>{task.dueDate}</strong></p>

                        {task.feedback && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium mt-2">
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
                        className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all shrink-0 shadow-xs active:scale-95 ${
                          task.status === 'pending'
                            ? 'bg-[#0B1528] text-white hover:bg-slate-900'
                            : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {task.status === 'pending' ? 'Adjuntar Solución' : 'Ver Detalles'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL TÁCTIL DE ENTREGA DE TAREA                                          */}
      {/* ========================================================================= */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedTask(null)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 z-10 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Entrega de Actividad</span>
                <h3 className="font-black text-sm text-slate-900 mt-0.5">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-3 text-xs">
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0B1528] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-white group">
                <input 
                  type="file" 
                  onChange={(e) => e.target.files?.[0] && setUploadFileName(e.target.files[0].name)}
                  accept=".pdf,.mp3,.wav,.docx"
                  className="hidden" 
                />
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0B1528] mb-1.5 transition-transform group-hover:scale-110" />
                <strong className="text-slate-800 text-xs block">{uploadFileName || 'Selecciona tu archivo de audio o documento'}</strong>
                <span className="text-[11px] text-slate-400 mt-0.5">Formatos: MP3, WAV, PDF, DOCX (Máx 25 MB)</span>
              </label>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nota para el docente (Opcional):</label>
                <textarea
                  rows={2}
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  placeholder="Escribe alguna aclaración sobre tu entrega..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-xs focus:bg-white focus:ring-2 focus:ring-[#0B1528]"
                />
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Tarea entregada correctamente!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFileName}
                  className="bg-[#0B1528] hover:bg-slate-900 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
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

          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col">
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <h3 className="font-bold text-xs truncate">{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
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

      {/* ========================================================================= */}
      {/* MODAL DE EDICIÓN DE PERFIL & SEGURIDAD                                    */}
      {/* ========================================================================= */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        student={student}
        onProfileUpdated={(updated) => setStudent(updated)}
        initialTab={profileInitialTab}
      />

    </div>
  )
}
