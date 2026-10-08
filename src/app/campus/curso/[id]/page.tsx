'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  ExternalLink, 
  FileText, 
  Download, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileUp, 
  ArrowLeft, 
  Sparkles, 
  Headphones, 
  Check, 
  X, 
  Send,
  MessageSquare,
  ShieldCheck,
  User,
  Info,
  Play,
  Pause,
  Volume2,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  AlertCircle,
  Eye,
  FileAudio,
  FileCheck,
  Tv,
  CheckCircle,
  HelpCircle,
  Film
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'

import { getLevelConfig } from '../../../../data/levelConfig'

interface CourseDetailProps {
  params?: { id: string }
}

// =========================================================================
// MODELOS DE DATOS LMS 2.0 (ARQUITECTURA POR MOMENTOS - ESTILO UNAD)
// =========================================================================

interface RecordedClass {
  id: string
  title: string
  date: string
  duration: string
  teacher: string
  videoUrl: string
  thumbnailUrl: string
  topics: string[]
}

interface LearningResource {
  id: string
  title: string
  type: 'pdf' | 'audio' | 'guide' | 'rubric'
  fileSize: string
  downloadUrl: string
  audioSrc?: string
  description: string
}

interface ActivityTask {
  id: string
  title: string
  unitName: string
  moment: 'inicial' | 'intermedio' | 'final'
  weightPoints: number
  dueDate: string
  status: 'graded' | 'submitted' | 'pending'
  score?: string // ej: "4.8 / 5.0"
  scorePoints?: number
  submittedFileName?: string
  submissionDate?: string
  studentComments?: string
  teacherFeedback?: {
    teacherName: string
    teacherAvatar?: string
    feedbackDate: string
    comment: string
    badgeNote: string
    phoneticTip?: string
  }
}

interface MomentSection {
  id: 'momento-inicial' | 'momento-intermedio' | 'momento-final'
  title: string
  subtitle: string
  weightPoints: number
  earnedPoints: number
  badgeText: string
  isOpenDefault: boolean
}

export default function AulaVirtualPage({ params }: CourseDetailProps) {
  const courseId = params?.id || 'a1'
  const supabase = createClient()

  // Configuración de nivel dinámico (A1, A2, B1, B2, C1)
  const initialConfig = getLevelConfig(courseId)

  // Estados generales del curso
  const [loading, setLoading] = useState(false)
  const [courseLevel, setCourseLevel] = useState(initialConfig.shortLevel)
  const [courseTitle, setCourseTitle] = useState(initialConfig.title)
  const [courseCode, setCourseCode] = useState(initialConfig.code)
  const [teacherName, setTeacherName] = useState(initialConfig.teacherName)
  const [unit1Name, setUnit1Name] = useState(initialConfig.unit1Title)
  const [unit2Name, setUnit2Name] = useState(initialConfig.unit2Title)

  // Carga reactiva de nivel del estudiante
  useEffect(() => {
    async function resolveStudentLevel() {
      try {
        let levelKey = courseId
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('ade_student_level') || localStorage.getItem('student_level')
          if (stored && courseId === 'a1') {
            levelKey = stored
          }
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

        const cfg = getLevelConfig(levelKey)
        setCourseLevel(cfg.shortLevel)
        setCourseTitle(cfg.title)
        setCourseCode(cfg.code)
        setTeacherName(cfg.teacherName)
        setUnit1Name(cfg.unit1Title)
        setUnit2Name(cfg.unit2Title)
        setLiveClass(prev => ({
          ...prev,
          title: cfg.liveClassTopic,
          scheduledAt: `${cfg.nextLiveClass} • 7:00 PM - 8:30 PM (UTC-5)`,
          teacher: cfg.teacherName
        }))
      } catch (e) {
        // Fallback robusto
      }
    }

    resolveStudentLevel()
  }, [courseId])

  // =========================================================================
  // BLOQUE 1: ENCUENTROS SINCRÓNICOS & REPOSITORIO ON-DEMAND
  // =========================================================================
  const [schedulesTab, setSchedulesTab] = useState<'live' | 'ondemand'>('live')
  const [selectedRecordedVideo, setSelectedRecordedVideo] = useState<RecordedClass | null>(null)

  const [liveClass, setLiveClass] = useState({
    title: 'Clase Sincrónica: Daily Routine, Adverbs of Frequency & Phonetics',
    scheduledAt: 'Miércoles y Jueves • 7:00 PM - 8:30 PM (UTC-5)',
    teamsMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/american-dream-class',
    status: 'live', // 'live' | 'scheduled'
    teacher: 'Lic. Carlos Méndez',
    roomCapacity: '12 Estudiantes máx.',
    modality: '4 Días a la Semana (Intensivo Sincrónico)'
  })

  const [recordedClasses, setRecordedClasses] = useState<RecordedClass[]>([
    {
      id: 'rec-01',
      title: 'Sesión 04: Present Simple vs Continuous & Flap-T Pronunciation',
      date: '06 de Octubre, 2026',
      duration: '1h 25m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      topics: ['Present Simple Review', 'Contracciones Nativas', 'Sonido Flap T', 'Taller en Vivo']
    },
    {
      id: 'rec-02',
      title: 'Sesión 03: Describing Jobs, Workplaces & Third Person -s Rule',
      date: '02 de Octubre, 2026',
      duration: '1h 18m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
      topics: ['Regla de la 3ra Persona (-s / -es)', 'Profesiones', 'Entrevistas Simuladas']
    },
    {
      id: 'rec-03',
      title: 'Sesión 02: Subject Pronouns, Possessive Adjectives & Numbers 1-100',
      date: '28 de Septiembre, 2026',
      duration: '1h 30m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      topics: ['Pronombres Personales', 'Adjetivos Posesivos', 'Listening Fonético']
    },
    {
      id: 'rec-04',
      title: 'Sesión 01: Inducción al Campus, Metodología 4 Días & Alfabeto Fonético',
      date: '24 de Septiembre, 2026',
      duration: '1h 12m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      topics: ['Bienvenida Institucional', 'Uso de Teams', 'Descarga de Guías PDF']
    }
  ])

  // =========================================================================
  // BLOQUE 2: ESTRUCTURA POR MOMENTOS (ESTILO UNAD)
  // =========================================================================
  const [openMoments, setOpenMoments] = useState<{ [key: string]: boolean }>({
    'momento-inicial': true,
    'momento-intermedio': true,
    'momento-final': false
  })

  const [activeUnitTab, setActiveUnitTab] = useState<'u1' | 'u2'>('u1')

  const toggleMoment = (momentId: string) => {
    setOpenMoments(prev => ({
      ...prev,
      [momentId]: !prev[momentId]
    }))
  }

  // Reproductor de Audio Embebido
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleToggleAudio = (audioId: string) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null)
    } else {
      setPlayingAudioId(audioId)
    }
  }

  // Recursos de Estudio por Momento y Unidad
  const initialResources: LearningResource[] = [
    {
      id: 'res-init-1',
      title: 'Guía de Inducción & Metodología de Autoestudio ADE (PDF)',
      type: 'guide',
      fileSize: '1.8 MB',
      downloadUrl: '#',
      description: 'Protocolo de estudio de 4 días a la semana, uso de Microsoft Teams y rúbricas de ponderación.'
    }
  ]

  const unit1Resources: LearningResource[] = [
    {
      id: 'res-u1-1',
      title: 'Guía Didáctica 01: Foundations & Daily Routine (PDF)',
      type: 'pdf',
      fileSize: '2.4 MB',
      downloadUrl: '#',
      description: 'Guía oficial con 25 ejercicios prácticos, cuadros de conjugación y vocabulario cotidiano.'
    },
    {
      id: 'res-u1-2',
      title: 'Ficha Resumen: Present Simple vs. Present Continuous (PDF)',
      type: 'guide',
      fileSize: '1.1 MB',
      downloadUrl: '#',
      description: 'Esquema sintáctico visual con reglas de ortografía, excepciones y conectores de frecuencia.'
    },
    {
      id: 'res-u1-3',
      title: 'Listening Lab 01: Native Morning Routines & Schwa Sound (MP3)',
      type: 'audio',
      fileSize: '8.7 MB',
      downloadUrl: '#',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      description: 'Pista de audio con hablantes nativos estadounidenses para discriminación auditiva y fonética.'
    }
  ]

  const unit2Resources: LearningResource[] = [
    {
      id: 'res-u2-1',
      title: 'Guía Didáctica 02: Social Interaction, Coffee Shop & Past Simple (PDF)',
      type: 'pdf',
      fileSize: '3.1 MB',
      downloadUrl: '#',
      description: 'Estructuras para ordenar alimentos, entablar conversaciones casuales y verbos regulares/irregulares.'
    },
    {
      id: 'res-u2-2',
      title: 'Listening Lab 02: Airport & Street Directions Dialogue (MP3)',
      type: 'audio',
      fileSize: '9.4 MB',
      downloadUrl: '#',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      description: 'Diálogos de situaciones reales en aeropuertos y transporte internacional.'
    }
  ]

  const finalResources: LearningResource[] = [
    {
      id: 'res-final-1',
      title: 'Guía de Preparación para la Evaluación Integradora MCER A1 (PDF)',
      type: 'rubric',
      fileSize: '1.2 MB',
      downloadUrl: '#',
      description: 'Matriz de competencias lingüísticas evaluadas (Reading, Writing, Listening & Speaking).'
    }
  ]

  // =========================================================================
  // BLOQUE 3: GESTIÓN DE TAREAS Y MODAL TÁCTIL
  // =========================================================================
  const [tasks, setTasks] = useState<ActivityTask[]>([
    // Momento Inicial
    {
      id: 'task-init-0',
      title: 'Taller Diagnóstico 0: Reconocimiento Inicial & Placement Baseline',
      unitName: 'Momento Inicial: Reconocimiento',
      moment: 'inicial',
      weightPoints: 25,
      dueDate: 'Finalizado • 28 de Septiembre',
      status: 'graded',
      score: '5.0 / 5.0',
      scorePoints: 25,
      submittedFileName: 'taller_diagnostico_valeria_morales.pdf',
      submissionDate: '27 de Septiembre, 2026 - 06:45 PM',
      studentComments: 'Envío mi taller diagnóstico resuelto.',
      teacherFeedback: {
        teacherName: 'Lic. Carlos Méndez',
        feedbackDate: '29 de Septiembre, 2026',
        comment: 'Excelente diagnóstico inicial. Demuestras un manejo sólido del vocabulario básico y estructuras iniciales.',
        badgeNote: 'Sobresaliente (25 / 25 pts)',
        phoneticTip: 'Presta atención a la entonación de preguntas cerradas (Yes/No questions).'
      }
    },
    // Momento Intermedio - Unidad 1
    {
      id: 'task-u1-1',
      title: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia (My Daily Life)',
      unitName: 'Unidad 1: Foundations & Routine',
      moment: 'intermedio',
      weightPoints: 75,
      dueDate: '12 de Octubre, 11:59 PM',
      status: 'graded',
      score: '4.8 / 5.0',
      scorePoints: 72,
      submittedFileName: 'daily_routine_essay_valeria.pdf',
      submissionDate: '08 de Octubre, 2026 - 10:15 AM',
      studentComments: 'Profesor, adjunto la redacción solicitada usando conectores temporales y adverbs of frequency.',
      teacherFeedback: {
        teacherName: 'Lic. Carlos Méndez',
        feedbackDate: '08 de Octubre, 2026',
        comment: 'Muy buena coherencia y uso del Present Simple en 3ra persona. Gran empleo de conectores (first, then, after that).',
        badgeNote: 'Aprobado con Distinción (72 / 75 pts)'
      }
    },
    {
      id: 'task-u1-2',
      title: 'Actividad Oral 1: Grabación de Audio - Sonidos Vocálicos y Reducción Fonética',
      unitName: 'Unidad 1: Foundations & Routine',
      moment: 'intermedio',
      weightPoints: 100,
      dueDate: '16 de Octubre, 11:59 PM',
      status: 'submitted',
      score: 'En Calificación',
      scorePoints: 0,
      submittedFileName: 'vowel_sounds_speaking_task.mp3',
      submissionDate: '07 de Octubre, 2026 - 04:30 PM',
      studentComments: 'Adjunto el audio con las 10 frases del laboratorio fonético grabadas con mi micrófono.'
    },
    // Momento Intermedio - Unidad 2
    {
      id: 'task-u2-1',
      title: 'Actividad Oral 2: Grabación de Audio - Presentación Personal & Situación Real',
      unitName: 'Unidad 2: Social Interaction',
      moment: 'intermedio',
      weightPoints: 100,
      dueDate: '22 de Octubre, 11:59 PM',
      status: 'pending'
    },
    {
      id: 'task-u2-2',
      title: 'Taller Práctico 2: Role-Play Escrito y Formas del Pasado Simple',
      unitName: 'Unidad 2: Social Interaction',
      moment: 'intermedio',
      weightPoints: 75,
      dueDate: '26 de Octubre, 11:59 PM',
      status: 'pending'
    },
    // Momento Final
    {
      id: 'task-final-1',
      title: 'Evaluación Integradora Final de Nivel A1 (Quiz en Línea & Entrevista Sincrónica)',
      unitName: 'Momento Final: Cierre MCER',
      moment: 'final',
      weightPoints: 125,
      dueDate: '31 de Octubre, 11:59 PM',
      status: 'pending'
    }
  ])

  // Estado del Modal de Tarea
  const [activeTaskModal, setActiveTaskModal] = useState<ActivityTask | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [taskComments, setTaskComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const handleOpenTaskModal = (task: ActivityTask) => {
    setActiveTaskModal(task)
    setUploadFile(null)
    setUploadFileName('')
    setTaskComments(task.studentComments || '')
    setSubmissionSuccess(false)
  }

  const handleCloseTaskModal = () => {
    setActiveTaskModal(null)
    setUploadFile(null)
    setUploadFileName('')
    setSubmissionSuccess(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadFile(file)
      setUploadFileName(file.name)
    }
  }

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName && !activeTaskModal?.submittedFileName) return

    setIsSubmitting(true)
    setTimeout(() => {
      if (activeTaskModal) {
        setTasks(prev => prev.map(t => {
          if (t.id === activeTaskModal.id) {
            return {
              ...t,
              status: 'submitted',
              submittedFileName: uploadFileName || t.submittedFileName || 'actividad_entregada_ade.pdf',
              submissionDate: 'Hoy - ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
              studentComments: taskComments
            }
          }
          return t
        }))
      }
      setIsSubmitting(false)
      setSubmissionSuccess(true)
    }, 1000)
  }

  // Cálculos de Puntos y Progreso
  const totalEarnedPoints = tasks.reduce((acc, t) => acc + (t.scorePoints || 0), 0)
  const maxCoursePoints = 500
  const progressPercent = Math.round((totalEarnedPoints / maxCoursePoints) * 100)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. TOP SUBHEADER INSTITUCIONAL Y BREADCRUMB                                */}
      {/* ========================================================================= */}
      <div className="bg-[#0B1B3D] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2 text-slate-300 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/campus" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Campus Virtual</span>
            </Link>
            <span className="text-slate-500">/</span>
            <Link href="/campus/miscursos" className="hover:text-white transition-colors">
              Mis Cursos
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-amber-300 font-bold">
              {courseCode} · Aula Virtual LMS 2.0
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Ponderación: {totalEarnedPoints} / {maxCoursePoints} pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HEADER DEL CURSO CON DATOS DOCENTES Y PROGRESO                         */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1B3D] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-400 shrink-0">
              {courseLevel}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  {courseTitle}
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span>Docente: <strong className="text-slate-800">{teacherName}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">Cohorte 2026-I Activa</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Barra de Progreso Compacta */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Progreso Total</span>
                <strong className="text-xs font-black text-[#0B1B3D]">{progressPercent}% Aprobado</strong>
              </div>
              <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <Link
              href="/campus"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0B1B3D] bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2.5 rounded-xl transition-colors"
            >
              <span>Volver a Mis Cursos</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CONTENIDO PRINCIPAL DEL AULA VIRTUAL                                  */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full space-y-6">

        {/* ======================================================================= */}
        {/* BLOQUE SUPERIOR: ENCUENTROS SINCRÓNICOS (TEAMS) & REPOSITORIO ON-DEMAND */}
        {/* ======================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header del Bloque con Tabs */}
          <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-400 text-slate-950 rounded-lg">
                  <Video className="w-4 h-4" />
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Encuentros Académicos: Clases en Vivo & On-Demand
                </h2>
              </div>
              <p className="text-xs text-slate-300">
                Modelo intensivo de 4 días a la semana por Microsoft Teams con repositorio de grabaciones.
              </p>
            </div>

            {/* Selector de Pestañas Live vs On-Demand */}
            <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setSchedulesTab('live')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  schedulesTab === 'live'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Próxima Clase (Teams)</span>
              </button>

              <button
                onClick={() => setSchedulesTab('ondemand')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  schedulesTab === 'ondemand'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Clases Grabadas (On-Demand)</span>
                <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                  {recordedClasses.length}
                </span>
              </button>
            </div>
          </div>

          {/* Cuerpo del Tab Seleccionado */}
          <div className="p-5 sm:p-6">
            
            {/* TAB 1: PRÓXIMA CLASE SINCRÓNICA (TEAMS) */}
            {schedulesTab === 'live' && (
              <div className="bg-gradient-to-br from-slate-900 via-[#0B1B3D] to-indigo-950 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800 shadow-md">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Sala Activa • Conexión Directa
                      </span>
                      <span className="bg-white/10 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-white/10 font-semibold">
                        {liveClass.modality}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {liveClass.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Horario: <strong className="text-white">{liveClass.scheduledAt}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Docente: <strong className="text-white">{liveClass.teacher}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Acción Directa Teams */}
                  <div className="shrink-0 flex flex-col gap-2">
                    <a
                      href={liveClass.teamsMeetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm tracking-wide active:scale-[0.98] group"
                    >
                      <Video className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                      <span>Unirse a la Clase en Teams</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className="text-[11px] text-center text-slate-400 font-medium">
                      Cupo asegurado • Grupos reducidos (máx 12 estudiantes)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REPOSITORIO DE CLASES GRABADAS ON-DEMAND */}
            {schedulesTab === 'ondemand' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Videoteca de Sesiones Grabadas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Repasa las explicaciones y talleres en vivo las veces que lo necesites.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    4 Grabaciones Disponibles
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recordedClasses.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-4 hover:border-[#0B1B3D] transition-all flex flex-col justify-between group shadow-2xs"
                    >
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group-hover:shadow-md transition-shadow">
                          <img 
                            src={rec.thumbnailUrl} 
                            alt={rec.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity" 
                          />
                          <button
                            onClick={() => setSelectedRecordedVideo(rec)}
                            className="absolute w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          >
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </button>
                          <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {rec.duration}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {rec.date}
                            </span>
                            <span>{rec.teacher}</span>
                          </div>

                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#0B1B3D] line-clamp-1">
                            {rec.title}
                          </h4>

                          {/* Tags temáticos */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {rec.topics.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedRecordedVideo(rec)}
                        className="mt-4 w-full bg-white hover:bg-[#0B1B3D] hover:text-white text-[#0B1B3D] border border-slate-300 font-extrabold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Ver Grabación Completa</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ======================================================================= */}
        {/* BLOQUE INFORMATIVO DE ESTRUCTURA POR MOMENTOS (ESTILO UNAD)             */}
        {/* ======================================================================= */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0B1B3D] text-amber-400 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Entornos de Aprendizaje y Evaluación por Momentos
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Arquitectura de formación modular basada en los estándares de educación a distancia UNAD.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-xl">
            Total Ponderación: 500 Puntos
          </span>
        </div>

        {/* ======================================================================= */}
        {/* 1. MOMENTO INICIAL (PONDERACIÓN: 25 PTS / RECONOCIMIENTO)                 */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          
          {/* Header del Acordeón */}
          <button
            onClick={() => toggleMoment('momento-inicial')}
            className="w-full p-5 sm:p-6 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4 text-left border-b border-slate-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs shrink-0 border border-amber-300">
                01
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Momento Inicial: Reconocimiento & Diagnóstico
                  </h3>
                  <span className="bg-amber-100 text-amber-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                    Ponderación: 25 Puntos (5%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inducción a la metodología, diagnóstico inicial de nivel y familiarización con la plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                25 / 25 pts (100%)
              </span>
              {openMoments['momento-inicial'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {/* Cuerpo del Momento Inicial */}
          {openMoments['momento-inicial'] && (
            <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
              
              {/* Subsección: Recursos de Estudio */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>Recursos de Estudio y Guía de Inducción</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {initialResources.map((res) => (
                    <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {res.type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{res.fileSize}</span>
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900">{res.title}</h5>
                        <p className="text-[11px] text-slate-500">{res.description}</p>
                      </div>

                      <a
                        href={res.downloadUrl}
                        download
                        className="shrink-0 p-2.5 bg-white hover:bg-[#0B1B3D] hover:text-white text-slate-700 border border-slate-300 rounded-xl transition-colors shadow-2xs"
                        title="Descargar Guía"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsección: Actividad de Entrega */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Actividad de Evaluación Diagnóstica</span>
                </h4>

                <div className="space-y-3">
                  {tasks.filter(t => t.moment === 'inicial').map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Calificado: {task.score}
                          </span>
                          <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {task.weightPoints} Puntos
                          </span>
                        </div>

                        <h5 className="font-black text-sm text-slate-900 leading-tight">
                          {task.title}
                        </h5>

                        <p className="text-xs text-slate-500">
                          {task.dueDate} • Archivo: <span className="font-mono text-slate-700">{task.submittedFileName}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenTaskModal(task)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-4 py-2.5 rounded-xl border border-slate-300 text-xs transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Ver Retroalimentación</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ======================================================================= */}
        {/* 2. MOMENTO INTERMEDIO (PONDERACIÓN: 350 PTS / DESARROLLO DE COMPETENCIAS) */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          
          {/* Header del Acordeón */}
          <button
            onClick={() => toggleMoment('momento-intermedio')}
            className="w-full p-5 sm:p-6 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4 text-left border-b border-slate-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs shrink-0 border border-blue-300">
                02
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Momento Intermedio: Desarrollo de Competencias
                  </h3>
                  <span className="bg-blue-100 text-blue-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-blue-300">
                    Ponderación: 350 Puntos (70%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unidades temáticas de aprendizaje, laboratorios de audio fonético, guías didácticas y talleres formativos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-black text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                72 / 350 pts Acumulados
              </span>
              {openMoments['momento-intermedio'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {/* Cuerpo del Momento Intermedio */}
          {openMoments['momento-intermedio'] && (
            <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
              
              {/* Selector de Unidades Temáticas Dinámicas */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                <button
                  onClick={() => setActiveUnitTab('u1')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                    activeUnitTab === 'u1'
                      ? 'bg-[#0B1B3D] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{unit1Name}</span>
                </button>

                <button
                  onClick={() => setActiveUnitTab('u2')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                    activeUnitTab === 'u2'
                      ? 'bg-[#0B1B3D] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{unit2Name}</span>
                </button>
              </div>

              {/* CONTENIDO DE UNIDAD 1 */}
              {activeUnitTab === 'u1' && (
                <div className="space-y-6">
                  
                  {/* Recursos de Estudio Unidad 1 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-slate-500" />
                      <span>Recursos Didácticos y Laboratorio Fonético (Unidad 1)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {unit1Resources.map((res) => (
                        <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                res.type === 'audio' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {res.type === 'audio' ? 'AUDIO MP3' : 'GUÍA PDF'}
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold">{res.fileSize}</span>
                            </div>

                            <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1">{res.title}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{res.description}</p>
                          </div>

                          {/* Si es Audio: Reproductor Interactivo Embebido */}
                          {res.type === 'audio' ? (
                            <div className="bg-white border border-purple-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                              <button
                                onClick={() => handleToggleAudio(res.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-transform active:scale-95 ${
                                  playingAudioId === res.id 
                                    ? 'bg-purple-600 text-white animate-pulse' 
                                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                }`}
                              >
                                {playingAudioId === res.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                              </button>

                              <div className="flex-1 text-[11px] font-semibold text-slate-700 truncate">
                                {playingAudioId === res.id ? (
                                  <span className="text-purple-700 flex items-center gap-1 font-bold">
                                    <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                                    Reproduciendo Audio Nativo...
                                  </span>
                                ) : (
                                  <span>Escuchar pronunciación</span>
                                )}
                              </div>

                              <a
                                href={res.downloadUrl}
                                download
                                className="p-1.5 text-slate-400 hover:text-slate-700"
                                title="Descargar MP3"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ) : (
                            <a
                              href={res.downloadUrl}
                              download
                              className="w-full bg-white hover:bg-[#0B1B3D] hover:text-white text-slate-800 border border-slate-300 font-extrabold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar Documento</span>
                            </a>
                          )}

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actividades de Entrega Unidad 1 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Actividades de Entrega & Evaluación (Unidad 1)</span>
                    </h4>

                    <div className="space-y-3">
                      {tasks.filter(t => t.id === 'task-u1-1' || t.id === 'task-u1-2').map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex flex-wrap items-center gap-2">
                              {task.status === 'graded' && (
                                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Calificado: {task.score}
                                </span>
                              )}
                              {task.status === 'submitted' && (
                                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Entregado (En Revisión)
                                </span>
                              )}
                              {task.status === 'pending' && (
                                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Pendiente de Entrega
                                </span>
                              )}

                              <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {task.weightPoints} Puntos
                              </span>
                            </div>

                            <h5 className="font-black text-sm text-slate-900 leading-tight">
                              {task.title}
                            </h5>

                            <p className="text-xs text-slate-500">
                              Fecha Límite: <strong>{task.dueDate}</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleOpenTaskModal(task)}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-black px-5 py-3 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98] ${
                              task.status === 'graded'
                                ? 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-300'
                                : task.status === 'submitted'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-[#0B1B3D] hover:bg-[#001f35] text-white'
                            }`}
                          >
                            {task.status === 'graded' ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-slate-600" />
                                <span>Ver Calificación</span>
                              </>
                            ) : task.status === 'submitted' ? (
                              <>
                                <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                                <span>Ver Archivo Entregado</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-4 h-4 text-amber-400" />
                                <span>Adjuntar Solución</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* CONTENIDO DE UNIDAD 2 */}
              {activeUnitTab === 'u2' && (
                <div className="space-y-6">
                  
                  {/* Recursos de Estudio Unidad 2 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-slate-500" />
                      <span>Recursos Didácticos y Laboratorio Fonético (Unidad 2)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unit2Resources.map((res) => (
                        <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                res.type === 'audio' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {res.type === 'audio' ? 'AUDIO MP3' : 'GUÍA PDF'}
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold">{res.fileSize}</span>
                            </div>

                            <h5 className="font-extrabold text-xs text-slate-900">{res.title}</h5>
                            <p className="text-[11px] text-slate-500">{res.description}</p>
                          </div>

                          <a
                            href={res.downloadUrl}
                            download
                            className="w-full bg-white hover:bg-[#0B1B3D] hover:text-white text-slate-800 border border-slate-300 font-extrabold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar Material</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actividades de Entrega Unidad 2 */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Actividades de Entrega (Unidad 2)</span>
                    </h4>

                    <div className="space-y-3">
                      {tasks.filter(t => t.id === 'task-u2-1' || t.id === 'task-u2-2').map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Pendiente de Entrega
                              </span>

                              <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {task.weightPoints} Puntos
                              </span>
                            </div>

                            <h5 className="font-black text-sm text-slate-900 leading-tight">
                              {task.title}
                            </h5>

                            <p className="text-xs text-slate-500">
                              Fecha Límite: <strong>{task.dueDate}</strong>
                            </p>
                          </div>

                          <button
                            onClick={() => handleOpenTaskModal(task)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1B3D] hover:bg-[#001f35] text-white font-black px-5 py-3 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
                          >
                            <UploadCloud className="w-4 h-4 text-amber-400" />
                            <span>Adjuntar Solución</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ======================================================================= */}
        {/* 3. MOMENTO FINAL (PONDERACIÓN: 125 PTS / EVALUACIÓN DE CIERRE)            */}
        {/* ======================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          
          {/* Header del Acordeón */}
          <button
            onClick={() => toggleMoment('momento-final')}
            className="w-full p-5 sm:p-6 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-4 text-left border-b border-slate-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-xs shrink-0 border border-purple-300">
                03
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Momento Final: Evaluación Integradora y Cierre MCER
                  </h3>
                  <span className="bg-purple-100 text-purple-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-purple-300">
                    Ponderación: 125 Puntos (25%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Examen final de certificación de nivel MCER y entrevista oral de suficiencia comunicativa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                Apertura: 25 de Octubre
              </span>
              {openMoments['momento-final'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {/* Cuerpo del Momento Final */}
          {openMoments['momento-final'] && (
            <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
              
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Guía y Matriz de Evaluación Final</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {finalResources.map((res) => (
                    <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {res.type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">{res.fileSize}</span>
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900">{res.title}</h5>
                        <p className="text-[11px] text-slate-500">{res.description}</p>
                      </div>

                      <a
                        href={res.downloadUrl}
                        download
                        className="shrink-0 p-2.5 bg-white hover:bg-[#0B1B3D] hover:text-white text-slate-700 border border-slate-300 rounded-xl transition-colors shadow-2xs"
                        title="Descargar Rúbrica"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Examen de Cierre</span>
                </h4>

                {tasks.filter(t => t.moment === 'final').map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Próxima Apertura
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {task.weightPoints} Puntos
                        </span>
                      </div>

                      <h5 className="font-black text-sm text-slate-900 leading-tight">
                        {task.title}
                      </h5>

                      <p className="text-xs text-slate-500">
                        Disponible a partir del <strong>25 de Octubre, 08:00 AM</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenTaskModal(task)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black px-5 py-3 rounded-xl text-xs transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span>Consultar Instrucciones</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL TÁCTIL / DRAWER DE GESTIÓN Y ADJUNTAR TAREAS                     */}
      {/* ========================================================================= */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          
          <div className="absolute inset-0" onClick={handleCloseTaskModal} />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
            
            {/* Header del Modal */}
            <div className="bg-[#0B1B3D] text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    {activeTaskModal.unitName}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Ponderación: {activeTaskModal.weightPoints} Pts
                  </span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                  {activeTaskModal.title}
                </h3>
              </div>

              <button
                onClick={handleCloseTaskModal}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Card de Estado de Entrega */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de la Entrega:</span>
                  <div>
                    {activeTaskModal.status === 'graded' && (
                      <span className="inline-flex items-center gap-1.5 font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Calificado ({activeTaskModal.score})
                      </span>
                    )}
                    {activeTaskModal.status === 'submitted' && (
                      <span className="inline-flex items-center gap-1.5 font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        Entregado para Calificación
                      </span>
                    )}
                    {activeTaskModal.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 font-black text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Sin Entregar
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Fecha Límite:</span>
                    <strong>{activeTaskModal.dueDate}</strong>
                  </div>
                  {activeTaskModal.submissionDate && (
                    <div>
                      <span className="text-slate-400 block">Fecha de Envío:</span>
                      <strong>{activeTaskModal.submissionDate}</strong>
                    </div>
                  )}
                </div>

                {activeTaskModal.submittedFileName && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-mono text-slate-800 truncate font-semibold">
                        {activeTaskModal.submittedFileName}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Guardado
                    </span>
                  </div>
                )}
              </div>

              {/* RETROALIMENTACIÓN CUALITATIVA DEL DOCENTE (SI ESTÁ CALIFICADO) */}
              {activeTaskModal.teacherFeedback && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0B1B3D] text-amber-400 flex items-center justify-center font-bold text-xs">
                        CM
                      </div>
                      <div>
                        <strong className="block text-slate-900 text-xs">{activeTaskModal.teacherFeedback.teacherName}</strong>
                        <span className="text-[10px] text-slate-500">Docente Titular ADE • {activeTaskModal.teacherFeedback.feedbackDate}</span>
                      </div>
                    </div>

                    <span className="bg-emerald-600 text-white font-black text-[11px] px-2.5 py-1 rounded-lg shadow-xs">
                      {activeTaskModal.teacherFeedback.badgeNote}
                    </span>
                  </div>

                  <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80 text-slate-800 leading-relaxed space-y-2">
                    <p className="font-medium">{activeTaskModal.teacherFeedback.comment}</p>
                    {activeTaskModal.teacherFeedback.phoneticTip && (
                      <div className="bg-amber-100/70 p-2 rounded-lg text-amber-900 flex items-start gap-1.5 font-semibold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                        <span><strong>Tip Fonético:</strong> {activeTaskModal.teacherFeedback.phoneticTip}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORMULARIO DE ADJUNTAR ARCHIVO (SI ESTÁ PENDIENTE O DESEA REENTREGAR) */}
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">
                    {activeTaskModal.status === 'graded' ? 'Archivo Entregado:' : 'Adjuntar Archivo de Solución (PDF, MP3, DOCX):'}
                  </label>

                  {/* Drag and Drop Area */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-[#0B1B3D] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 hover:bg-white group">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      accept=".pdf,.mp3,.wav,.docx,.zip"
                      className="hidden" 
                    />
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#0B1B3D] group-hover:scale-110 transition-all mb-2" />
                    <span className="font-bold text-slate-800 block text-xs">
                      {uploadFileName ? uploadFileName : 'Haz clic para seleccionar o arrastra tu archivo aquí'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Formatos admitidos: Documentos PDF, Audios MP3/WAV o Word (Máx 25 MB)
                    </span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Comentarios para el Docente (Opcional):
                  </label>
                  <textarea
                    rows={3}
                    value={taskComments}
                    onChange={(e) => setTaskComments(e.target.value)}
                    placeholder="Escribe aquí cualquier aclaración o duda sobre tu taller..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#0B1B3D] focus:bg-white outline-hidden transition-all"
                  />
                </div>

                {submissionSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>¡Tu actividad ha sido guardada y enviada al docente exitosamente!</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseTaskModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cerrar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || (!uploadFileName && !activeTaskModal.submittedFileName)}
                    className="bg-[#0B1B3D] hover:bg-[#001f35] disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Guardando Entrega...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Confirmar y Enviar Solución</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL DE REPRODUCCIÓN DE CLASES GRABADAS (ON-DEMAND)                   */}
      {/* ========================================================================= */}
      {selectedRecordedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setSelectedRecordedVideo(null)} />

          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]">
            
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2 truncate">
                <Film className="w-4 h-4 text-amber-400 shrink-0" />
                <h3 className="font-black text-sm text-white truncate">
                  {selectedRecordedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordedVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Reproductor de Video Simulado */}
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative group">
                <video 
                  controls 
                  className="w-full h-full"
                  poster={selectedRecordedVideo.thumbnailUrl}
                >
                  <source src={selectedRecordedVideo.videoUrl} type="video/mp4" />
                  Tu navegador no soporta reproducción de video HTML5.
                </video>
              </div>

              <div className="text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Dictada el {selectedRecordedVideo.date} por <strong>{selectedRecordedVideo.teacher}</strong></span>
                  <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                    Duración: {selectedRecordedVideo.duration}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-200">Temas Desarrollados en esta Sesión:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecordedVideo.topics.map((top, idx) => (
                    <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-xl">
                      ✓ {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. FOOTER DEL AULA VIRTUAL                                                */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Campus Virtual American Dream English · Acreditación MCER & Formación 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://wa.me/573127459728" target="_blank" rel="noopener noreferrer" className="hover:text-[#0B1B3D] transition-colors">
              Mesa de Ayuda WhatsApp
            </a>
            <span>•</span>
            <Link href="/campus" className="hover:text-[#0B1B3D] transition-colors">
              Panel Principal
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
