'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  Video, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Play, 
  Volume2, 
  Send, 
  Award, 
  Sparkles, 
  LogOut, 
  User, 
  Users, 
  BookOpen, 
  ChevronRight, 
  Paperclip, 
  X, 
  Eye, 
  HelpCircle,
  RefreshCw,
  Check,
  Calendar,
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'
import { StudentProfileData } from '../../../components/campus/StudentProfileModal'

// Tipos de Grabación
export interface TeacherRecordedSession {
  id: string
  lessonNumber: number
  title: string
  date: string
  duration: string
  videoUrl: string
  thumbnailUrl: string
  topics: string[]
  level: string
  status: 'published' | 'draft'
}

// Tipos de Tarea Entregada
export interface StudentSubmission {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  studentAvatar?: string
  assignmentTitle: string
  assignmentType: 'audio' | 'pdf' | 'text'
  submissionDate: string
  dueDate: string
  fileUrl?: string
  audioUrl?: string
  textContent?: string
  status: 'pending' | 'graded'
  grade?: number // Escala 0.0 - 5.0
  maxGrade: number
  feedback?: string
  gradedAt?: string
}

// Datos iniciales de grabaciones
const INITIAL_RECORDINGS: TeacherRecordedSession[] = [
  {
    id: 'rec-04',
    lessonNumber: 4,
    title: 'Clase 04: Present Simple vs Continuous & Flap-T Pronunciation',
    date: '06 de Octubre, 2026',
    duration: '1h 20m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    topics: ['Present Simple', 'Present Continuous', 'Reglas fonéticas', 'Ejercicios de sala'],
    level: 'A1',
    status: 'published'
  },
  {
    id: 'rec-03',
    lessonNumber: 3,
    title: 'Clase 03: Describing Jobs, Daily Habits & Third Person -s Rule',
    date: '02 de Octubre, 2026',
    duration: '1h 15m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    topics: ['Regla de la 3ra Persona (-s / -es)', 'Profesiones', 'Entrevistas Simuladas'],
    level: 'A1',
    status: 'published'
  },
  {
    id: 'rec-02',
    lessonNumber: 2,
    title: 'Clase 02: Subject Pronouns, Possessives & Numbers in Real Life',
    date: '28 de Septiembre, 2026',
    duration: '1h 25m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    topics: ['Pronombres Personales', 'Adjetivos Posesivos', 'Listening Fonético'],
    level: 'A1',
    status: 'published'
  },
  {
    id: 'rec-01',
    lessonNumber: 1,
    title: 'Clase 01: Inducción al Curso, Metodología 4 Días & Alfabeto Fonético',
    date: '24 de Septiembre, 2026',
    duration: '1h 10m',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    topics: ['Bienvenida', 'Uso de Teams', 'Descarga de Materiales'],
    level: 'A1',
    status: 'published'
  }
]

// Datos iniciales de entregas de estudiantes
const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-01',
    studentId: 'stu-valeria-01',
    studentName: 'Valeria Morales Montoya',
    studentCode: 'ADE-2026-0894',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignmentTitle: 'Actividad Oral 1: Grabación de Audio - Presentación Personal (1 min)',
    assignmentType: 'audio',
    submissionDate: '07 de Octubre, 10:42 PM',
    dueDate: '16 de Octubre, 11:59 PM',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    textContent: 'Hello Teacher! My name is Valeria. I am from Colombia. I am studying English at American Dream. I like learning new words and practicing pronunciation every day.',
    status: 'pending',
    maxGrade: 5.0
  },
  {
    id: 'sub-02',
    studentId: 'stu-mateo-02',
    studentName: 'Mateo Restrepo Gómez',
    studentCode: 'ADE-2026-0912',
    assignmentTitle: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
    assignmentType: 'pdf',
    submissionDate: '06 de Octubre, 04:15 PM',
    dueDate: '12 de Octubre, 11:59 PM',
    fileUrl: '#',
    textContent: 'Every morning I wake up at 6:00 AM. I have breakfast with my family. My sister works in a hospital and my brother studies engineering...',
    status: 'pending',
    maxGrade: 5.0
  },
  {
    id: 'sub-03',
    studentId: 'stu-camila-03',
    studentName: 'Camila Andrea Torres',
    studentCode: 'ADE-2026-0781',
    assignmentTitle: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
    assignmentType: 'text',
    submissionDate: '04 de Octubre, 08:30 PM',
    dueDate: '12 de Octubre, 11:59 PM',
    textContent: 'I get up at 7:00 AM. I drink coffee and read articles. My mother teaches mathematics. We always have dinner together at 8:00 PM.',
    status: 'graded',
    grade: 4.8,
    maxGrade: 5.0,
    feedback: '¡Excelente estructura gramatical y uso del presente simple! Cuidado con la tercera persona en verbos irregulares.',
    gradedAt: '05 de Octubre, 09:12 AM'
  },
  {
    id: 'sub-04',
    studentId: 'stu-daniel-04',
    studentName: 'Daniel Felipe Castro',
    studentCode: 'ADE-2026-0845',
    assignmentTitle: 'Taller Práctico 2: Role-Play Escrito y Preguntas en Pasado',
    assignmentType: 'pdf',
    submissionDate: '08 de Octubre, 02:20 PM',
    dueDate: '22 de Octubre, 11:59 PM',
    fileUrl: '#',
    textContent: 'Dialogue at the hotel check-in: Good afternoon, I have a reservation for three nights under the name of Daniel Castro...',
    status: 'pending',
    maxGrade: 5.0
  }
]

export default function TeacherCampusPage() {
  const supabase = createClient()

  // Estado del docente
  const [teacherName, setTeacherName] = useState('Lic. Carlos Méndez')
  const [teacherEmail, setTeacherEmail] = useState('carlos.mendez@americandream.edu.co')
  const [activeLevel, setActiveLevel] = useState<'a1' | 'a2' | 'b1' | 'b2'>('a1')
  const [activeTab, setActiveTab] = useState<'recordings' | 'grading' | 'forum' | 'students'>('recordings')

  // Módulo 1: Grabaciones
  const [recordings, setRecordings] = useState<TeacherRecordedSession[]>(INITIAL_RECORDINGS)
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [editingRecording, setEditingRecording] = useState<TeacherRecordedSession | null>(null)
  const [recordingForm, setRecordingForm] = useState({
    title: '',
    lessonNumber: 5,
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    duration: '1h 15m',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    topicsText: 'Gramática, Vocabulario, Práctica Oral'
  })

  // Módulo 2: Calificaciones
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS)
  const [gradingFilter, setGradingFilter] = useState<'all' | 'pending' | 'graded'>('all')
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null)
  const [gradeInput, setGradeInput] = useState<string>('5.0')
  const [feedbackInput, setFeedbackInput] = useState<string>('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Módulo 3: Foro Docente
  const [forumPosts, setForumPosts] = useState<any[]>([])
  const [forumLoading, setForumLoading] = useState(false)
  const [forumFilter, setForumFilter] = useState<'all' | 'unanswered'>('all')
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null)
  const [teacherReplyText, setTeacherReplyText] = useState('')
  const [isSubmittingForumReply, setIsSubmittingForumReply] = useState(false)

  // Notificaciones y alertas
  const [bannerNotice, setBannerNotice] = useState<string | null>(null)

  // Cargar sesión del docente si existe en Supabase
  useEffect(() => {
    async function loadTeacherProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profile?.full_name) {
            setTeacherName(profile.full_name)
          } else if (session.user.user_metadata?.full_name) {
            setTeacherName(session.user.user_metadata.full_name)
          }
          if (session.user.email) {
            setTeacherEmail(session.user.email)
          }
        }

        // Cargar grabaciones guardadas en localStorage si existen
        if (typeof window !== 'undefined') {
          const savedRecs = localStorage.getItem(`ade_teacher_recordings_${activeLevel}`)
          if (savedRecs) {
            try {
              setRecordings(JSON.parse(savedRecs))
            } catch (e) {}
          }

          const savedSubs = localStorage.getItem(`ade_teacher_submissions_${activeLevel}`)
          if (savedSubs) {
            try {
              setSubmissions(JSON.parse(savedSubs))
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Error loading teacher profile:', err)
      }
    }
    loadTeacherProfile()
  }, [activeLevel])

  // Cargar consultas del foro desde Supabase
  const loadForumQuestions = async () => {
    setForumLoading(true)
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*, forum_replies(*)')
        .eq('course_id', activeLevel)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setForumPosts(data)
      }
    } catch (err) {
      console.warn('Error fetching forum questions:', err)
    } finally {
      setForumLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'forum') {
      loadForumQuestions()
    }
  }, [activeTab, activeLevel])

  // =========================================================================
  // HANDLERS: GESTIÓN DE GRABACIONES
  // =========================================================================
  const handleOpenNewRecordingModal = () => {
    setEditingRecording(null)
    setRecordingForm({
      title: '',
      lessonNumber: recordings.length + 1,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      duration: '1h 15m',
      videoUrl: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      topicsText: 'Gramática, Vocabulario, Práctica Oral'
    })
    setShowRecordingModal(true)
  }

  const handleEditRecording = (rec: TeacherRecordedSession) => {
    setEditingRecording(rec)
    setRecordingForm({
      title: rec.title,
      lessonNumber: rec.lessonNumber,
      date: rec.date,
      duration: rec.duration,
      videoUrl: rec.videoUrl,
      thumbnailUrl: rec.thumbnailUrl,
      topicsText: rec.topics.join(', ')
    })
    setShowRecordingModal(true)
  }

  const handleSaveRecording = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recordingForm.title.trim() || !recordingForm.videoUrl.trim()) return

    const topicsArray = recordingForm.topicsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    if (editingRecording) {
      // Actualizar existente
      const updated = recordings.map(r => {
        if (r.id === editingRecording.id) {
          return {
            ...r,
            title: recordingForm.title,
            lessonNumber: Number(recordingForm.lessonNumber),
            date: recordingForm.date,
            duration: recordingForm.duration,
            videoUrl: recordingForm.videoUrl,
            thumbnailUrl: recordingForm.thumbnailUrl,
            topics: topicsArray
          }
        }
        return r
      })
      setRecordings(updated)
      localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
      showNotification('¡Clase grabada actualizada con éxito!')
    } else {
      // Crear nueva
      const newRec: TeacherRecordedSession = {
        id: `rec-${Date.now()}`,
        lessonNumber: Number(recordingForm.lessonNumber),
        title: recordingForm.title,
        date: recordingForm.date,
        duration: recordingForm.duration,
        videoUrl: recordingForm.videoUrl,
        thumbnailUrl: recordingForm.thumbnailUrl,
        topics: topicsArray,
        level: activeLevel.toUpperCase(),
        status: 'published'
      }
      const updated = [newRec, ...recordings]
      setRecordings(updated)
      localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
      showNotification('¡Nueva grabación de Teams publicada en el aula del estudiante!')
    }

    setShowRecordingModal(false)
  }

  const handleDeleteRecording = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta grabación? Los alumnos ya no podrán verla en su aula.')) {
      const updated = recordings.filter(r => r.id !== id)
      setRecordings(updated)
      localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
      showNotification('Grabación eliminada del catálogo.')
    }
  }

  // =========================================================================
  // HANDLERS: REVISIÓN DE CALIFICACIONES
  // =========================================================================
  const handleOpenGradingModal = (sub: StudentSubmission) => {
    setGradingSubmission(sub)
    setGradeInput(sub.grade ? sub.grade.toFixed(1) : '4.5')
    setFeedbackInput(sub.feedback || 'Excelente trabajo. Sigue practicando la fluidez y la entonación en preguntas abiertas.')
    setIsPlayingAudio(false)
  }

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gradingSubmission) return

    const numGrade = parseFloat(gradeInput)
    if (isNaN(numGrade) || numGrade < 0 || numGrade > 5.0) {
      alert('Por favor ingresa una calificación válida entre 0.0 y 5.0')
      return
    }

    const updated = submissions.map(s => {
      if (s.id === gradingSubmission.id) {
        return {
          ...s,
          status: 'graded' as const,
          grade: numGrade,
          feedback: feedbackInput.trim(),
          gradedAt: new Date().toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }
      }
      return s
    })

    setSubmissions(updated)
    localStorage.setItem(`ade_teacher_submissions_${activeLevel}`, JSON.stringify(updated))
    setGradingSubmission(null)
    showNotification(`¡Calificación de ${numGrade.toFixed(1)} guardada para ${gradingSubmission.studentName}!`)
  }

  // =========================================================================
  // HANDLERS: RESPUESTAS EN EL FORO
  // =========================================================================
  const handleSendTeacherForumReply = async (postId: string) => {
    if (!teacherReplyText.trim()) return
    setIsSubmittingForumReply(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const { data: inserted, error } = await supabase
        .from('forum_replies')
        .insert([
          {
            post_id: postId,
            user_id: session?.user?.id || null,
            author_name: teacherName,
            author_role: 'teacher',
            author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            content: teacherReplyText.trim()
          }
        ])
        .select()
        .single()

      if (!error && inserted) {
        setForumPosts(forumPosts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              forum_replies: [...(p.forum_replies || []), inserted]
            }
          }
          return p
        }))
        setTeacherReplyText('')
        setReplyingToPostId(null)
        showNotification('¡Respuesta oficial del docente enviada al estudiante!')
      } else {
        showNotification('Respuesta registrada en la base de datos.')
        setTeacherReplyText('')
        setReplyingToPostId(null)
      }
    } catch (err) {
      console.error('Error reply:', err)
    } finally {
      setIsSubmittingForumReply(false)
    }
  }

  const showNotification = (msg: string) => {
    setBannerNotice(msg)
    setTimeout(() => setBannerNotice(null), 4000)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
    try {
      localStorage.clear()
      sessionStorage.clear()
      document.cookie = 'ade_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC'
    } catch (e) {}
    window.location.replace('/login')
  }

  // Filtrado de Tareas
  const filteredSubmissions = submissions.filter(s => {
    if (gradingFilter === 'pending') return s.status === 'pending'
    if (gradingFilter === 'graded') return s.status === 'graded'
    return true
  })

  // Conteo de pendientes
  const pendingGradingCount = submissions.filter(s => s.status === 'pending').length
  const unansweredForumCount = forumPosts.filter(p => !p.forum_replies || p.forum_replies.length === 0).length

  return (
    <div className="min-h-screen bg-[#F0F3F7] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900 pb-16 sm:py-6 sm:px-4 items-center justify-start">
      
      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL AMPLIO (MAX-W-6XL) CON ESQUINAS REDONDEADAS TIPO APP */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto bg-[#0B1528] rounded-t-[36px] sm:rounded-[40px] overflow-hidden shadow-2xl border border-slate-700/40 flex flex-col flex-1">

        {/* ======================================================================= */}
        {/* 1. CABECERA SUPERIOR OSCURA (NAVY #0B1528)                            */}
        {/* ======================================================================= */}
        <header className="w-full bg-[#0B1528] border-b border-white/10 pt-6 pb-6 px-4 sm:px-6">
          <div className="w-full space-y-5">
          
          {/* Fila 1: Logo Institucional + Saludo Docente + Acciones Rápidas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Bloque Izquierdo: Logo Oficial + Saludo Docente */}
            <div className="flex items-center gap-3.5">
              <Link href="/" className="shrink-0 group flex items-center">
                <img 
                  src="/logo-american-dream.png" 
                  alt="American Dream English" 
                  className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform" 
                />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Portal Exclusivo Docente
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {teacherName}
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {teacherEmail} · Docente Titular American Dream English
                </p>
              </div>
            </div>

            {/* Bloque Derecho: Selector de Nivel + Enlace al Aula Estudiante + Salir */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Selector de Nivel Activo */}
              <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 backdrop-blur-md">
                {(['a1', 'a2', 'b1', 'b2'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                      activeLevel === lvl
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lvl.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Botón Ver Aula Estudiante */}
              <Link
                href={`/campus/curso/${activeLevel}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors"
                title="Abrir vista de estudiante para este nivel"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Aula Alumno</span>
              </Link>

              {/* Salir */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Cerrar Sesión Segura"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>

            </div>

          </div>

          {/* Fila 2: Indicador del Grupo Activo & Métricas Rápidas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 font-medium">Grupo Activo:</span>
                <strong className="text-white ml-1.5 font-extrabold uppercase">
                  English Level 1 ({activeLevel.toUpperCase()}) - Periodo 2026-I
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>{recordings.length}</strong> Clases Subidas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span><strong className={pendingGradingCount > 0 ? 'text-amber-400' : 'text-slate-300'}>{pendingGradingCount}</strong> Tareas Pendientes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>{unansweredForumCount}</strong> Consultas Foro</span>
              </div>
            </div>
          </div>

          {/* Banner de Notificación Toast */}
          {bannerNotice && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bannerNotice}</span>
            </div>
          )}

        </div>
      </header>

      {/* ======================================================================= */}
      {/* 2. CONTENEDOR CURVO CONTINUO UNIFICADO (BG-WHITE)                       */}
      {/* ======================================================================= */}
      <main className="w-full flex-1">
        <div className="bg-white text-slate-800 rounded-t-[32px] md:rounded-t-[40px] shadow-2xl p-5 sm:p-7 md:p-8 space-y-6">
          
          {/* =================================================================== */}
          {/* PESTAÑAS TIPO PÍLDORA FLOTANTE (TEACHER PILL TABS)                  */}
          {/* =================================================================== */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pb-4 border-b border-slate-200">
            
            {/* Tab 1: Clases Grabadas */}
            <button
              onClick={() => setActiveTab('recordings')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'recordings'
                  ? 'bg-[#002B49] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>Gestión Clases Grabadas</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                activeTab === 'recordings' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {recordings.length}
              </span>
            </button>

            {/* Tab 2: Calificaciones & Tareas */}
            <button
              onClick={() => setActiveTab('grading')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'grading'
                  ? 'bg-[#002B49] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Calificar Tareas</span>
              {pendingGradingCount > 0 && (
                <span className="text-[10px] px-2 py-0.2 rounded-full font-black bg-amber-400 text-slate-950 animate-pulse">
                  {pendingGradingCount} por calificar
                </span>
              )}
            </button>

            {/* Tab 3: Dudas en Foro */}
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'forum'
                  ? 'bg-[#002B49] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Atención de Foro</span>
              {unansweredForumCount > 0 && (
                <span className="text-[10px] px-2 py-0.2 rounded-full font-black bg-emerald-500 text-white">
                  {unansweredForumCount} sin responder
                </span>
              )}
            </button>

            {/* Tab 4: Estudiantes Matriculados */}
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'students'
                  ? 'bg-[#002B49] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Estudiantes Matriculados</span>
            </button>

          </div>

          {/* =================================================================== */}
          {/* SECCIÓN 1: GESTIÓN DE CLASES GRABADAS (TEAMS / ONEDRIVE)            */}
          {/* =================================================================== */}
          {activeTab === 'recordings' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Barra de Acciones de Grabaciones */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Historial de Clases Grabadas · {activeLevel.toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Sube y administra los enlaces de Microsoft Teams, OneDrive o Stream que ven los estudiantes.
                  </p>
                </div>

                <button
                  onClick={handleOpenNewRecordingModal}
                  className="bg-[#002B49] hover:bg-[#001f35] active:scale-95 text-white font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Cargar Nueva Grabación</span>
                </button>
              </div>

              {/* Grid de Tarjetas de Grabaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {recordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* Thumbnail con Badge de Duración */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={rec.thumbnailUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 bg-[#002B49]/90 text-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl backdrop-blur-sm border border-amber-400/30">
                        Clase {rec.lessonNumber.toString().padStart(2, '0')}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {rec.duration}
                        </span>
                        <span className="text-[11px] text-slate-300">
                          {rec.date}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                          {rec.title}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {rec.topics.map((t, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={rec.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#002B49] hover:underline"
                        >
                          <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Probar Enlace</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditRecording(rec)}
                            className="p-2 text-slate-600 hover:text-[#002B49] hover:bg-slate-100 rounded-xl transition-colors"
                            title="Editar grabación"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecording(rec.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Eliminar grabación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* SECCIÓN 2: REVISIÓN DE TAREAS Y CALIFICACIONES                      */}
          {/* =================================================================== */}
          {activeTab === 'grading' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header con Filtros */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Bandeja de Entregas y Calificaciones
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Revisa las grabaciones de audio, talleres en PDF y envía retroalimentación formativa personalizada.
                  </p>
                </div>

                {/* Filtro de Estado */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => setGradingFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      gradingFilter === 'all' ? 'bg-[#002B49] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Todas ({submissions.length})
                  </button>
                  <button
                    onClick={() => setGradingFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      gradingFilter === 'pending' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Pendientes ({pendingGradingCount})
                  </button>
                  <button
                    onClick={() => setGradingFilter('graded')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      gradingFilter === 'graded' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Calificadas
                  </button>
                </div>
              </div>

              {/* Lista de Entregas */}
              <div className="space-y-3.5">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium space-y-2">
                    <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-500" />
                    <p className="text-slate-700 font-bold">No hay entregas pendientes con este filtro.</p>
                    <p>¡Buen trabajo! Todas las tareas de los alumnos están al día.</p>
                  </div>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const isPending = sub.status === 'pending'
                    return (
                      <div
                        key={sub.id}
                        className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isPending 
                            ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Datos del Alumno y Tarea */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {sub.studentAvatar ? (
                              <img src={sub.studentAvatar} alt={sub.studentName} className="w-full h-full object-cover" />
                            ) : (
                              <span>{sub.studentName.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                                {sub.studentName}
                              </strong>
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.2 rounded-md">
                                {sub.studentCode}
                              </span>
                              {sub.assignmentType === 'audio' && (
                                <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.2 rounded-md flex items-center gap-1">
                                  <Volume2 className="w-3 h-3" /> Audio Grabado
                                </span>
                              )}
                              {sub.assignmentType === 'pdf' && (
                                <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.2 rounded-md flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Documento PDF
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-700 font-semibold">
                              {sub.assignmentTitle}
                            </p>

                            <p className="text-[11px] text-slate-400 font-medium">
                              Entregado el: {sub.submissionDate} · Límite: {sub.dueDate}
                            </p>
                          </div>
                        </div>

                        {/* Estado y Botón Calificar */}
                        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                          {isPending ? (
                            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-xl border border-amber-300">
                              Pendiente
                            </span>
                          ) : (
                            <div className="text-right">
                              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-xl border border-emerald-300 inline-block">
                                Nota: {sub.grade?.toFixed(1)} / 5.0
                              </span>
                              <p className="text-[10px] text-slate-400 mt-0.5">Calificado {sub.gradedAt}</p>
                            </div>
                          )}

                          <button
                            onClick={() => handleOpenGradingModal(sub)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                              isPending
                                ? 'bg-[#002B49] text-white hover:bg-[#001f35]'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isPending ? 'Revisar y Calificar' : 'Editar Nota'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* SECCIÓN 3: ATENCIÓN DE DUDAS EN EL FORO                             */}
          {/* =================================================================== */}
          {activeTab === 'forum' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Foro */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Consultas del Foro Académico · {activeLevel.toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Preguntas formuladas por los estudiantes. Responde directamente con tu rol docente.
                  </p>
                </div>

                <button
                  onClick={loadForumQuestions}
                  disabled={forumLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${forumLoading ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Preguntas</span>
                </button>
              </div>

              {/* Listado de Preguntas de los Estudiantes */}
              {forumLoading ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-medium space-y-2">
                  <RefreshCw className="w-7 h-7 animate-spin mx-auto text-[#002B49]" />
                  <p className="font-bold">Cargando consultas de Supabase PostgreSQL...</p>
                </div>
              ) : forumPosts.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium space-y-2">
                  <MessageSquare className="w-9 h-9 mx-auto text-slate-300" />
                  <p className="text-slate-700 font-bold">No hay consultas de estudiantes registradas en este nivel.</p>
                  <p className="text-[11px]">Las dudas publicadas por los estudiantes aparecerán aquí para tu respuesta.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {forumPosts.map((post) => {
                    const isReplying = replyingToPostId === post.id
                    const repliesCount = post.forum_replies?.length || 0

                    return (
                      <div
                        key={post.id}
                        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                      >
                        {/* Cabecera del post */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                            {post.author_avatar?.startsWith('http') ? (
                              <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{post.author_name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || 'ST'}</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                                {post.author_name}
                              </strong>
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.2 rounded-md">
                                🎓 Estudiante
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(post.created_at).toLocaleDateString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed whitespace-pre-wrap">
                              {post.content}
                            </p>

                            {/* Imagen adjunta en la duda */}
                            {post.image_url && (
                              <div className="pt-2">
                                <a href={post.image_url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-2xl overflow-hidden border border-slate-200 max-w-xs sm:max-w-sm">
                                  <img src={post.image_url} alt="Captura duda" className="max-h-48 w-auto object-cover" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Respuestas Existentes */}
                        {post.forum_replies && post.forum_replies.length > 0 && (
                          <div className="ml-4 sm:ml-12 pl-3 border-l-2 border-slate-200 space-y-2.5 pt-1">
                            {post.forum_replies.map((reply: any) => {
                              const isTeacherReply = reply.author_role === 'teacher'
                              return (
                                <div 
                                  key={reply.id}
                                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                                    isTeacherReply 
                                      ? 'bg-amber-50/80 border border-amber-200 text-amber-950 font-medium' 
                                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <strong className="font-extrabold">{reply.author_name}</strong>
                                    {isTeacherReply && (
                                      <span className="bg-amber-200 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded">
                                        👨‍🏫 Docente Titular
                                      </span>
                                    )}
                                  </div>
                                  <p className="leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Botón y Formulario de Respuesta del Docente */}
                        <div className="pt-2">
                          {isReplying ? (
                            <div className="ml-4 sm:ml-12 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>Respuesta Oficial del Docente:</span>
                                <button
                                  type="button"
                                  onClick={() => setReplyingToPostId(null)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <textarea
                                rows={3}
                                value={teacherReplyText}
                                onChange={(e) => setTeacherReplyText(e.target.value)}
                                placeholder="Escribe tu aclaración o explicación académica para el estudiante..."
                                className="w-full p-3 bg-white border border-slate-300 focus:border-[#002B49] rounded-xl text-xs text-slate-800 font-medium outline-none shadow-2xs resize-none"
                              />

                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setReplyingToPostId(null)}
                                  className="px-3 py-1.5 text-xs text-slate-600 font-bold hover:bg-slate-200 rounded-xl"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  disabled={isSubmittingForumReply || !teacherReplyText.trim()}
                                  onClick={() => handleSendTeacherForumReply(post.id)}
                                  className="bg-[#002B49] hover:bg-[#001f35] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                >
                                  <Send className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Publicar Respuesta Docente</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setReplyingToPostId(post.id)
                                setTeacherReplyText('')
                              }}
                              className="ml-4 sm:ml-12 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#002B49] hover:bg-[#001f35] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
                            >
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                              <span>Responder como Docente</span>
                            </button>
                          )}
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}

            </div>
          )}

          {/* =================================================================== */}
          {/* SECCIÓN 4: ESTUDIANTES MATRICULADOS                                 */}
          {/* =================================================================== */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Estudiantes Matriculados en {activeLevel.toUpperCase()} (Periodo 2026-I)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Seguimiento individual de avance y estado de actividades.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Valeria Morales Montoya', code: 'ADE-2026-0894', doc: 'C.C. 1.040.892.341', progress: 68, avg: '4.8 / 5.0' },
                  { name: 'Mateo Restrepo Gómez', code: 'ADE-2026-0912', doc: 'C.C. 1.035.712.940', progress: 55, avg: '4.5 / 5.0' },
                  { name: 'Camila Andrea Torres', code: 'ADE-2026-0781', doc: 'C.C. 1.152.441.802', progress: 82, avg: '4.9 / 5.0' },
                  { name: 'Daniel Felipe Castro', code: 'ADE-2026-0845', doc: 'C.C. 1.020.914.331', progress: 40, avg: '4.2 / 5.0' },
                  { name: 'Sara Sofía Henao', code: 'ADE-2026-0901', doc: 'C.C. 1.017.653.229', progress: 75, avg: '4.7 / 5.0' }
                ].map((st, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#002B49] text-amber-400 font-bold text-xs flex items-center justify-center">
                        {st.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="overflow-hidden">
                        <strong className="text-xs font-bold text-slate-900 block truncate">{st.name}</strong>
                        <span className="text-[10px] font-mono text-slate-400">{st.code}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Progreso Curso:</span>
                        <strong className="text-slate-800 font-bold">{st.progress}%</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${st.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                        <span>Promedio Acumulado:</span>
                        <strong className="text-emerald-700 font-bold">{st.avg}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: CARGAR / EDITAR GRABACIÓN DE TEAMS                            */}
      {/* ======================================================================= */}
      {showRecordingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-800 border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingRecording ? 'Editar Grabación de Clase' : 'Cargar Nueva Grabación (Teams / OneDrive)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Nivel {activeLevel.toUpperCase()} · Periodo 2026-I</p>
                </div>
              </div>

              <button
                onClick={() => setShowRecordingModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecording} className="space-y-4 text-xs font-bold">
              
              <div>
                <label className="text-slate-700 block mb-1">Título de la Sesión</label>
                <input
                  type="text"
                  required
                  value={recordingForm.title}
                  onChange={(e) => setRecordingForm({ ...recordingForm, title: e.target.value })}
                  placeholder="Ej: Clase 05: Past Simple - Regular & Irregular Verbs"
                  className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Número de Clase</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={recordingForm.lessonNumber}
                    onChange={(e) => setRecordingForm({ ...recordingForm, lessonNumber: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Duración Estimada</label>
                  <input
                    type="text"
                    required
                    value={recordingForm.duration}
                    onChange={(e) => setRecordingForm({ ...recordingForm, duration: e.target.value })}
                    placeholder="Ej: 1h 20m"
                    className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Enlace de Grabación (Teams, OneDrive, Stream, YouTube, MP4)</label>
                <input
                  type="url"
                  required
                  value={recordingForm.videoUrl}
                  onChange={(e) => setRecordingForm({ ...recordingForm, videoUrl: e.target.value })}
                  placeholder="https://americandream.sharepoint.com/... o https://..."
                  className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Temas Clave / Tags (separados por coma)</label>
                <input
                  type="text"
                  value={recordingForm.topicsText}
                  onChange={(e) => setRecordingForm({ ...recordingForm, topicsText: e.target.value })}
                  placeholder="Pasado simple, Fonética, Entrevistas"
                  className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRecordingModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001f35] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{editingRecording ? 'Guardar Cambios' : 'Publicar Grabación'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: REVISIÓN DE TAREA Y CALIFICADOR CON AUDIO/PDF                  */}
      {/* ======================================================================= */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-800 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Cabecera del Calificador */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#002B49] text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Evaluación y Retroalimentación Docente
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Alumno: <strong className="text-slate-800">{gradingSubmission.studentName}</strong> ({gradingSubmission.studentCode})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha de la Entrega */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-slate-900 font-extrabold text-sm">
                  {gradingSubmission.assignmentTitle}
                </strong>
                <span className="text-[11px] text-slate-500 font-medium">
                  Fecha de envío: {gradingSubmission.submissionDate}
                </span>
              </div>

              {/* Si es entrega de AUDIO */}
              {gradingSubmission.assignmentType === 'audio' && gradingSubmission.audioUrl && (
                <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-purple-600" />
                      Grabación de Audio del Estudiante (MP3):
                    </span>
                  </div>
                  
                  <audio 
                    controls 
                    className="w-full h-10 rounded-lg outline-none"
                    src={gradingSubmission.audioUrl}
                  >
                    Tu navegador no soporta el reproductor de audio.
                  </audio>
                </div>
              )}

              {/* Texto entregado por el alumno */}
              {gradingSubmission.textContent && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-600 block">Texto / Transcripción enviada por el alumno:</span>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 italic leading-relaxed">
                    "{gradingSubmission.textContent}"
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de Calificación */}
            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs font-bold">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-800 block mb-1">Calificación Numérica (0.0 a 5.0)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.0"
                      max="5.0"
                      required
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full p-3 border-2 border-[#002B49] rounded-xl outline-none font-black text-base text-slate-900 bg-amber-50/40"
                    />
                    <span className="text-slate-500 font-extrabold text-sm">/ 5.0</span>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Aprobado: &ge; 3.0 · Excelente: &ge; 4.5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-800 block mb-1">
                  Comentario Pedagógico & Retroalimentación (Feedback)
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Escribe comentarios pedagógicos sobre la pronunciación, tiempos verbales o vocabulario para guiar el aprendizaje del alumno..."
                  className="w-full p-3.5 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001f35] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Guardar Nota y Enviar Retroalimentación</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}
