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
  Sparkles, 
  Headphones, 
  X, 
  Send, 
  Play, 
  Pause, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Mic, 
  Film, 
  Clock, 
  Lock, 
  CheckCircle,
  FileCheck,
  Award
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'
import { getLevelConfig, LevelConfiguration } from '../../../../data/levelConfig'

interface CourseDetailProps {
  params?: { id: string }
}

interface RecordedLesson {
  id: string
  title: string
  date: string
  duration: string
  teacher: string
  videoUrl: string
  thumbnailUrl: string
}

interface TaskItem {
  id: string
  title: string
  type: 'speaking' | 'writing' | 'quiz'
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  score?: string
  feedback?: {
    teacherName: string
    comment: string
    tip?: string
  }
}

export default function AulaVirtualPage({ params }: CourseDetailProps) {
  const courseId = params?.id || 'a1'
  const supabase = createClient()

  // Nivel y metadatos dinámicos
  const [cfg, setCfg] = useState<LevelConfiguration>(getLevelConfig(courseId))
  const [progressPercent, setProgressPercent] = useState(68)

  // Toggle del Hero: En Vivo vs Grabadas
  const [heroView, setHeroView] = useState<'live' | 'recorded'>('live')
  const [selectedVideo, setSelectedVideo] = useState<RecordedLesson | null>(null)

  // Reproductor de Audio
  const [playingAudio, setPlayingAudio] = useState(false)

  // Módulos colapsables (Ruta de Aprendizaje)
  const [openModuleId, setOpenModuleId] = useState<string>('mod-1')

  // Modal de Entrega de Tarea
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [studentComment, setStudentComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Tarea activa demo
  const [currentTask, setCurrentTask] = useState<TaskItem>({
    id: 'task-speaking-1',
    title: 'Speaking Task: Graba un audio de 1 minuto describiendo tu rutina diaria',
    type: 'speaking',
    dueDate: '12 de Octubre, 11:59 PM',
    status: 'pending'
  })

  // Grabaciones On-Demand
  const recordedLessons: RecordedLesson[] = [
    {
      id: 'rec-1',
      title: 'Sesión 04: Present Simple vs. Continuous & Flap-T Pronunciation',
      date: '06 Octubre, 2026',
      duration: '45 min',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'rec-2',
      title: 'Sesión 03: Describing Jobs, Daily Habits & Third Person -s Rule',
      date: '02 Octubre, 2026',
      duration: '42 min',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'rec-3',
      title: 'Sesión 02: Subject Pronouns, Possessives & Numbers in Real Life',
      date: '28 Septiembre, 2026',
      duration: '50 min',
      teacher: cfg.teacherName,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
    }
  ]

  // Carga de configuración dinámica
  useEffect(() => {
    async function loadCourseContext() {
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
      } catch (e) {
        // Fallback
      }
    }

    loadCourseContext()
  }, [courseId])

  const handleOpenTask = (task: TaskItem) => {
    setActiveTaskModal(task)
    setUploadFileName('')
    setStudentComment('')
    setSubmitSuccess(false)
  }

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName) return
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setCurrentTask(prev => ({
        ...prev,
        status: 'submitted'
      }))
    }, 900)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20 selection:bg-amber-400 selection:text-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. ENCABEZADO LIMPIO Y DIRECTO (ESTILO COURSERA / DUOLINGO)               */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link 
              href="/campus" 
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center shrink-0"
              title="Volver a Mis Cursos"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {cfg.levelBadge}
                </span>
                <span className="text-xs text-slate-400 font-semibold">• Cohorte 2026</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                English Level {cfg.shortLevel.replace('A', '1 - A').replace('B', '2 - B').replace('C', '3 - C')}
              </h1>
            </div>
          </div>

          {/* Barra de Progreso Simple y Limpia */}
          <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-slate-200">
            <div className="flex-1 sm:w-36 text-right">
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-slate-600">
                <span className="text-slate-400 sm:hidden">Tu Progreso:</span>
                <span className="text-[#0B1B3D] font-extrabold">{progressPercent}% completado</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENEDOR PRINCIPAL CON ESPACIOS AMPLIOS                              */}
      {/* ========================================================================= */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">

        {/* ======================================================================= */}
        {/* TARJETA DE ACCIÓN RÁPIDA (HERO CARD EN VIVO / ON-DEMAND)                */}
        {/* ======================================================================= */}
        <section className="bg-[#0B1B3D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Fondo sutil */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Toggle de Vistas Simple */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="inline-flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setHeroView('live')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    heroView === 'live'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>En Vivo (Teams)</span>
                </button>

                <button
                  onClick={() => setHeroView('recorded')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    heroView === 'recorded'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Clases Grabadas</span>
                </button>
              </div>

              <span className="hidden sm:inline-flex text-xs text-slate-400 font-medium">
                Docente: <strong className="text-white ml-1">{cfg.teacherName}</strong>
              </span>
            </div>

            {/* VISTA 1: CLASE EN VIVO */}
            {heroView === 'live' ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                <div className="space-y-2 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Próxima Sesión Sincrónica
                  </span>
                  
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {cfg.liveClassTopic}
                  </h2>

                  <div className="flex items-center gap-2 text-slate-300 text-xs font-medium pt-1">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{cfg.nextLiveClass} • 7:00 PM (UTC-5) • Microsoft Teams</span>
                  </div>
                </div>

                <a
                  href="https://teams.microsoft.com/l/meetup-join/american-dream-class"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-lg hover:shadow-amber-400/20 transition-all active:scale-[0.98] shrink-0 group"
                >
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                  <span>Unirse a Clase en Vivo</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            ) : (
              /* VISTA 2: CLASES GRABADAS */
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recordedLessons.map((rec) => (
                    <div 
                      key={rec.id}
                      onClick={() => setSelectedVideo(rec)}
                      className="bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-amber-400/60 rounded-2xl p-3.5 space-y-3 cursor-pointer transition-all group"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                          <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                          {rec.duration}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-amber-300 font-bold block">{rec.date}</span>
                        <h3 className="font-extrabold text-xs text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                          {rec.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ======================================================================= */}
        {/* RUTA DE APRENDIZAJE SECUENCIAL (ESTILO DUOLINGO / COURSERA)             */}
        {/* ======================================================================= */}
        <section className="space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Ruta de Aprendizaje
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Paso a paso hacia tu fluidez
            </span>
          </div>

          {/* ===================================================================== */}
          {/* MÓDULO 1: EN FOCO (ABIERTO POR DEFECTO - 3 ACCIONES CLAVE)            */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600/30 shadow-md overflow-hidden transition-all">
            
            {/* Header del Módulo Activo */}
            <div 
              onClick={() => setOpenModuleId(openModuleId === 'mod-1' ? '' : 'mod-1')}
              className="p-5 sm:p-6 bg-gradient-to-r from-indigo-50/70 via-white to-white cursor-pointer flex items-center justify-between gap-4 border-b border-indigo-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#0B1B3D] text-amber-400 font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                  01
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Módulo en Curso
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {cfg.unit1Title.replace(' (175 pts)', '')}
                  </h3>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    {cfg.unit1Desc}
                  </p>
                </div>
              </div>

              <button className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                {openModuleId === 'mod-1' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {/* Contenido del Módulo 1: 3 ACCIONES LIMPIAS CON ICONOS GRANDES */}
            {openModuleId === 'mod-1' && (
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* 1. AUDIO LAB CON REPRODUCTOR TÁCTIL */}
                <div className="bg-purple-50/60 hover:bg-purple-50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Laboratorio de Audio
                        </span>
                        <span className="text-xs text-slate-400 font-medium">8.7 MB • MP3 Nativo</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        Listening Lab: Morning Routines & The Schwa Sound
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Entrena el oído con hablantes nativos antes de tu clase en vivo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => setPlayingAudio(!playingAudio)}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-sm ${
                        playingAudio 
                          ? 'bg-purple-700 text-white animate-pulse' 
                          : 'bg-white hover:bg-purple-600 hover:text-white text-purple-700 border border-purple-300'
                      }`}
                    >
                      {playingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{playingAudio ? 'Pausar Audio' : 'Escuchar Audio'}</span>
                    </button>

                    <a 
                      href="#" 
                      download 
                      className="p-3 rounded-2xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors"
                      title="Descargar MP3"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 2. GUÍA DE PRÁCTICA (DESCARGA LIMPIA) */}
                <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          Guía Didáctica Oficial
                        </span>
                        <span className="text-xs text-slate-400 font-medium">2.4 MB • PDF</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {cfg.unit1GrammarGuide}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Ejercicios prácticos paso a paso y tablas de conjugación visual.
                      </p>
                    </div>
                  </div>

                  <a
                    href="#"
                    download
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-300 font-black px-6 py-3 rounded-2xl text-xs transition-all shadow-sm active:scale-95 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Guía PDF</span>
                  </a>
                </div>

                {/* 3. TAREA ACTIVA (ESTADO CLARO Y BOTÓN DESTACADO) */}
                <div className="bg-amber-50/70 hover:bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                          Actividad Evaluativa
                        </span>
                        <span className="text-xs text-amber-800 font-bold">
                          Fecha límite: {currentTask.dueDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {currentTask.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {currentTask.status === 'submitted' ? (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Entregado para calificación
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Pendiente de envío
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenTask(currentTask)}
                    className="inline-flex items-center justify-center gap-2 bg-[#0B1B3D] hover:bg-[#001f35] text-white font-black px-7 py-3.5 rounded-2xl text-xs transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>{currentTask.status === 'submitted' ? 'Ver Entrega' : 'Entregar Tarea'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* ===================================================================== */}
          {/* MÓDULO 2: PLEGADO COMPACTO                                            */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div 
              onClick={() => setOpenModuleId(openModuleId === 'mod-2' ? '' : 'mod-2')}
              className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 font-black text-base flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Siguiente Módulo
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                    {cfg.unit2Title.replace(' (175 pts)', '')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    3 Recursos de estudio • 1 Actividad Oral
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">Desbloqueado</span>
                {openModuleId === 'mod-2' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </div>

            {openModuleId === 'mod-2' && (
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 space-y-3">
                <p className="font-medium">{cfg.unit2Desc}</p>
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Descargar Guía 02</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* MÓDULO 3: EVALUACIÓN FINAL MCER (COMPACTO)                            */}
          {/* ===================================================================== */}
          <div className="bg-white/80 rounded-3xl border border-slate-200 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 font-black text-base flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Evaluación Final & Certificación
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                  Examen Integrador de Cierre MCER {cfg.shortLevel}
                </h3>
                <p className="text-xs text-slate-400">
                  Apertura programada al completar los módulos 1 y 2.
                </p>
              </div>
            </div>

            <div className="p-2 text-slate-300">
              <Lock className="w-5 h-5" />
            </div>
          </div>

        </section>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL DE ENTREGA DE TAREAS (TÁCTIL Y LIMPIO)                           */}
      {/* ========================================================================= */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setActiveTaskModal(null)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 z-10 space-y-5">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Entrega de Actividad
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {activeTaskModal.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTaskModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 text-xs">
              
              {/* Drag and drop limpio */}
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0B1B3D] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-white group">
                <input 
                  type="file" 
                  onChange={(e) => e.target.files?.[0] && setUploadFileName(e.target.files[0].name)}
                  accept=".mp3,.wav,.pdf,.docx"
                  className="hidden" 
                />
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0B1B3D] group-hover:scale-110 transition-all mb-1.5" />
                <strong className="text-slate-800 text-xs block">
                  {uploadFileName ? uploadFileName : 'Selecciona o arrastra tu audio o documento'}
                </strong>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Formatos: MP3, WAV, PDF o Word (Máx 25 MB)
                </span>
              </label>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Comentario para el profesor (Opcional):</label>
                <textarea 
                  rows={2}
                  value={studentComment}
                  onChange={(e) => setStudentComment(e.target.value)}
                  placeholder="Escribe un mensaje o duda sobre tu actividad..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:ring-2 focus:ring-[#0B1B3D] text-xs"
                />
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Tu tarea ha sido enviada exitosamente al docente!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFileName}
                  className="bg-[#0B1B3D] hover:bg-[#001f35] disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Entrega'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL DE REPRODUCCIÓN DE VIDEO ON-DEMAND                                */}
      {/* ========================================================================= */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedVideo(null)} />

          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col">
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <h3 className="font-extrabold text-sm truncate">{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} className="p-1 rounded text-slate-400 hover:text-white">
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

    </div>
  )
}
