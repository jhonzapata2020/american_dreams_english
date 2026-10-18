'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Sparkles,
  Volume2,
  ChevronLeft,
  Menu,
  ChevronRight,
  GraduationCap,
  Award,
  Settings,
  KeyRound,
  LogOut,
  MessageCircle,
  Home,
  Eye
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'
import { getWhatsAppUrl } from '../../../../config/contact'
import { getLevelConfig, LevelConfiguration } from '../../../../data/levelConfig'
import { StudentProfileModal, StudentProfileData } from '../../../../components/campus/StudentProfileModal'
import { StudentAvatarMenu } from '../../../../components/campus/StudentAvatarMenu'
import { AcademicForum } from '../../../../components/campus/AcademicForum'
import { StudyMaterial, INITIAL_MATERIALS_BY_LEVEL, formatAudioStreamUrl } from '../../../../data/studyMaterials'
import { 
  INITIAL_RECORDINGS_BY_LEVEL, 
  INITIAL_ASSIGNMENTS_BY_LEVEL,
  INITIAL_SUBMISSIONS_BY_LEVEL,
  LevelRecordedSession,
  LevelAssignment
} from '../../../../data/levelData'

interface CourseDetailProps {
  params?: { id: string }
}

export type RecordedSession = LevelRecordedSession
export type Assignment = LevelAssignment

// Tipos de Clase Sincrónica en Vivo (Supabase live_classes)
export interface StudentLiveClass {
  id: string
  level_code: string
  title: string
  teams_meeting_url: string
  scheduled_at: string
  duration_minutes: number
  is_active: boolean
}

// Generador de sesiones de respaldo para la semana en curso
function getDefaultLiveClasses(levelCode: string): StudentLiveClass[] {
  const lvl = levelCode.toUpperCase()
  const now = new Date()
  const currentDayOfWeek = now.getDay()
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + distanceToMonday)
  monday.setHours(19, 0, 0, 0)

  const topics = [
    `Grammar Foundations & Sentence Structure (${lvl})`,
    `Listening Lab & Phonetics - Accent Polish (${lvl})`,
    `Conversational Workshop & Interactive Drills (${lvl})`,
    `Speaking Real-Life Interaction & Evaluation (${lvl})`
  ]

  return topics.map((topic, idx) => {
    const sDate = new Date(monday)
    sDate.setDate(monday.getDate() + idx)
    return {
      id: `default-${lvl.toLowerCase()}-${idx + 1}`,
      level_code: lvl,
      title: topic,
      teams_meeting_url: 'https://teams.microsoft.com/l/meetup-join/american-dream-class',
      scheduled_at: sDate.toISOString(),
      duration_minutes: 90,
      is_active: idx === 2
    }
  })
}

// Formateador elegante de fecha en español (ej: "Hoy Miércoles, 14 Oct")
function formatClassDateLabel(isoString: string) {
  const dt = new Date(isoString)
  if (isNaN(dt.getTime())) return 'Fecha programada'
  
  const today = new Date()
  const isTodayDate = dt.toDateString() === today.toDateString()
  
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const isTomorrowDate = dt.toDateString() === tomorrow.toDateString()

  const weekday = dt.toLocaleDateString('es-CO', { weekday: 'long' })
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  const dayNum = dt.getDate()
  const monthName = dt.toLocaleDateString('es-CO', { month: 'short' })

  if (isTodayDate) {
    return `Hoy ${capitalizedWeekday} (${dayNum} ${monthName})`
  }
  if (isTomorrowDate) {
    return `Mañana ${capitalizedWeekday} (${dayNum} ${monthName})`
  }
  return `${capitalizedWeekday}, ${dayNum} ${monthName}`
}

// Formateador de rango de horas (ej: "7:00 PM a 8:30 PM (COT)")
function formatClassTimeRange(isoString: string, durationMinutes = 90) {
  const dt = new Date(isoString)
  if (isNaN(dt.getTime())) return '7:00 PM - 8:30 PM (COT)'
  
  const endDt = new Date(dt.getTime() + durationMinutes * 60 * 1000)
  const startStr = dt.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
  const endStr = endDt.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${startStr} a ${endStr} (COT)`
}

export default function AulaVirtualPage({ params }: CourseDetailProps) {
  const courseId = (params?.id || 'a1').toLowerCase().trim()
  const supabase = createClient()

  // Configuración de Nivel (A1, A2, B1, B2, C1)
  const [cfg, setCfg] = useState<LevelConfiguration>(getLevelConfig(courseId))

  // Pestañas funcionales de trabajo
  const [activeTab, setActiveTab] = useState<'cronograma' | 'materiales' | 'grabadas' | 'foro' | 'tareas'>('cronograma')

  // Reproductor de Audio y Materiales Reactivos
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    return INITIAL_MATERIALS_BY_LEVEL[courseId] || INITIAL_MATERIALS_BY_LEVEL.a1
  })
  const [materialFilter, setMaterialFilter] = useState<'all' | 'pdf' | 'audio'>('all')
  const [audioPlaybackRate, setAudioPlaybackRate] = useState<number>(1.0)
  const studentAudioRef = useRef<HTMLAudioElement | null>(null)

  const handleToggleStudentAudio = (mat: StudyMaterial) => {
    if (playingAudioId === mat.id) {
      if (studentAudioRef.current) {
        studentAudioRef.current.pause()
      }
      setPlayingAudioId(null)
    } else {
      setPlayingAudioId(mat.id)
      if (studentAudioRef.current) {
        const src = formatAudioStreamUrl(mat.audioSrc || mat.downloadUrl)
        studentAudioRef.current.src = src
        studentAudioRef.current.playbackRate = audioPlaybackRate
        studentAudioRef.current.play().catch(() => {})
      }
    }
  }

  const handleSetSpeed = (rate: number) => {
    setAudioPlaybackRate(rate)
    if (studentAudioRef.current) {
      studentAudioRef.current.playbackRate = rate
    }
  }

  // Filtrado y conteo de recursos didácticos
  const filteredMaterials = materials.filter(m => {
    if (materialFilter === 'pdf') return m.type === 'pdf'
    if (materialFilter === 'audio') return m.type === 'audio'
    return true
  })
  const pdfCount = materials.filter(m => m.type === 'pdf').length
  const audioCount = materials.filter(m => m.type === 'audio').length

  // Reproductor de Video Grabado
  const [selectedVideo, setSelectedVideo] = useState<RecordedSession | null>(null)

  // Modal de Entrega de Tarea
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [studentComment, setStudentComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // =========================================================================
  // CLASES SINCRÓNICAS EN VIVO & CRONOGRAMA DINÁMICO (SUPABASE + RELOJ DE SISTEMA)
  // =========================================================================
  const [liveClasses, setLiveClasses] = useState<StudentLiveClass[]>(() => {
    return getDefaultLiveClasses(courseId)
  })
  const [generalTeamsUrl, setGeneralTeamsUrl] = useState('https://teams.microsoft.com/l/meetup-join/american-dream-class')
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Reloj de alta precisión (Ticker reactivo de 1 segundo para cuenta regresiva)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Clases Grabadas On-Demand específicas del nivel
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>(() => {
    return (INITIAL_RECORDINGS_BY_LEVEL[courseId] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as RecordedSession[]
  })

  // Lista de Tareas y Actividades específicas del nivel
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    return (INITIAL_ASSIGNMENTS_BY_LEVEL[courseId] || INITIAL_ASSIGNMENTS_BY_LEVEL.a1) as Assignment[]
  })

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileInitialTab, setProfileInitialTab] = useState<'info' | 'security'>('info')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [showCertModal, setShowCertModal] = useState(false)
  const [isTeacherPreview, setIsTeacherPreview] = useState(false)
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
    status: 'Matriculado Regular',
    role: 'student'
  })

  // Carga reactiva de datos según el nivel del curso
  useEffect(() => {
    async function loadLevel() {
      try {
        const levelKey = (courseId || 'a1').toLowerCase().trim()
        if (typeof window !== 'undefined') {
          // Detectar si el usuario viene de la interfaz de docente o tiene rol de profesor
          const urlParams = new URLSearchParams(window.location.search)
          const fromDocente = urlParams.get('from') === 'docente' || urlParams.get('preview') === 'teacher' || document.referrer.includes('/campus/docente')
          const isRoleTeacher = localStorage.getItem('ade_active_role') === 'teacher'
          if (fromDocente || isRoleTeacher) {
            setIsTeacherPreview(true)
          }

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
            const isTeacher = profile.role === 'teacher' || profile.role === 'admin' || profile.email?.toLowerCase().includes('docente') || profile.full_name?.toLowerCase().includes('profesor')
            if (isTeacher) {
              setIsTeacherPreview(true)
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
              currentLevel: profile.mcer_level || prev.currentLevel,
              role: profile.role || (isTeacher ? 'teacher' : 'student')
            }))
          }
        }

        // Sincronización en la nube con Supabase (recupera el avatar en cualquier computador)
        try {
          const currentStudent = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('ade_student_profile') || '{}') : {}
          const queryDoc = currentStudent?.docNumber || '1040892341'
          const queryEmail = currentStudent?.email || session?.user?.email || 'valeria.morales@americandream.edu.co'
          const queryId = session?.user?.id || currentStudent?.id || ''

          const pRes = await fetch(`/api/campus/profile?userId=${encodeURIComponent(queryId)}&email=${encodeURIComponent(queryEmail)}&doc=${encodeURIComponent(queryDoc)}`)
          if (pRes.ok) {
            const pData = await pRes.json()
            if (pData?.success && pData?.profile?.avatarUrl) {
              setStudent((prev) => {
                const merged = {
                  ...prev,
                  avatarUrl: pData.profile.avatarUrl,
                  fullName: pData.profile.fullName || prev.fullName,
                  phone: pData.profile.phone || prev.phone
                }
                try {
                  localStorage.setItem('ade_student_profile', JSON.stringify(merged))
                } catch (e) {}
                return merged
              })
            }
          }
        } catch (syncErr) {
          console.warn('Sincronización de avatar completada con caché:', syncErr)
        }

        const resolved = getLevelConfig(levelKey)
        setCfg(resolved)

        // Sincronizar dinámicamente con el docente titular real registrado en Supabase
        try {
          const { data: dbTeachers } = await supabase
            .from('profiles')
            .select('id, full_name, role, mcer_level')
            .eq('role', 'teacher')

          if (dbTeachers && dbTeachers.length > 0) {
            const currentLvl = levelKey.toUpperCase()
            const assignedTeacher = dbTeachers.find(t => t.mcer_level?.toUpperCase() === currentLvl)
              || dbTeachers.find(t => t.mcer_level?.toUpperCase() === 'ALL')
              || dbTeachers[0]

            if (assignedTeacher?.full_name) {
              setCfg(prev => ({
                ...prev,
                teacherName: assignedTeacher.full_name
              }))
            }
          }
        } catch (tErr) {
          console.warn('Aviso al sincronizar docente titular:', tErr)
        }

        if (typeof window !== 'undefined') {
          // 1. Grabaciones de Teams para este nivel
          const savedRecs = localStorage.getItem(`ade_teacher_recordings_${levelKey}`)
          if (savedRecs) {
            try {
              const parsed = JSON.parse(savedRecs)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setRecordedSessions(parsed)
              } else {
                setRecordedSessions((INITIAL_RECORDINGS_BY_LEVEL[levelKey] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as RecordedSession[])
              }
            } catch (e) {
              setRecordedSessions((INITIAL_RECORDINGS_BY_LEVEL[levelKey] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as RecordedSession[])
            }
          } else {
            setRecordedSessions((INITIAL_RECORDINGS_BY_LEVEL[levelKey] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as RecordedSession[])
          }

          // 2. Materiales Didácticos para este nivel
          const savedMaterials = localStorage.getItem(`ade_teacher_materials_${levelKey}`)
          if (savedMaterials) {
            try {
              const parsed = JSON.parse(savedMaterials)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMaterials(parsed)
              } else {
                setMaterials(INITIAL_MATERIALS_BY_LEVEL[levelKey] || INITIAL_MATERIALS_BY_LEVEL.a1)
              }
            } catch (e) {
              setMaterials(INITIAL_MATERIALS_BY_LEVEL[levelKey] || INITIAL_MATERIALS_BY_LEVEL.a1)
            }
          } else {
            setMaterials(INITIAL_MATERIALS_BY_LEVEL[levelKey] || INITIAL_MATERIALS_BY_LEVEL.a1)
          }

          // 3. Tareas y Actividades para este nivel
          const savedAssignments = localStorage.getItem(`ade_teacher_assignments_${levelKey}`)
          if (savedAssignments) {
            try {
              const parsed = JSON.parse(savedAssignments)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAssignments(parsed)
              } else {
                setAssignments((INITIAL_ASSIGNMENTS_BY_LEVEL[levelKey] || INITIAL_ASSIGNMENTS_BY_LEVEL.a1) as Assignment[])
              }
            } catch (e) {
              setAssignments((INITIAL_ASSIGNMENTS_BY_LEVEL[levelKey] || INITIAL_ASSIGNMENTS_BY_LEVEL.a1) as Assignment[])
            }
          } else {
            setAssignments((INITIAL_ASSIGNMENTS_BY_LEVEL[levelKey] || INITIAL_ASSIGNMENTS_BY_LEVEL.a1) as Assignment[])
          }

          // 4. Clases grabadas reales desde la base de datos Supabase
          try {
            const resClasses = await fetch(`/api/classes?level=${levelKey}`)
            const dataClasses = await resClasses.json()
            if (dataClasses?.classes && dataClasses.classes.length > 0) {
              const dbRecs: RecordedSession[] = dataClasses.classes.map((c: any, idx: number) => ({
                id: c.id,
                lessonNumber: dataClasses.classes.length - idx,
                title: c.title,
                date: new Date(c.scheduled_at || c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
                duration: '1h 15m',
                teacher: 'Prof. Anthony Zapata',
                videoUrl: c.meeting_link,
                thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
                topics: ['Sesión en vivo Teams', 'Grabación oficial']
              }))
              setRecordedSessions(dbRecs)
            }
          } catch (e) {
            console.warn('Nota fetch /api/classes en curso:', e)
          }

          // 5. Materiales y guías reales desde la base de datos Supabase
          try {
            const resMats = await fetch(`/api/materials?level=${levelKey}`)
            const dataMats = await resMats.json()
            if (dataMats?.materials && dataMats.materials.length > 0) {
              const dbMats: StudyMaterial[] = dataMats.materials.map((m: any) => ({
                id: m.id,
                title: m.title,
                type: (m.file_url?.toLowerCase().endsWith('.mp3') || m.file_url?.toLowerCase().includes('audio') ? 'audio' : 'pdf') as 'pdf' | 'audio',
                size: '2.5 MB',
                downloadUrl: m.file_url,
                audioSrc: m.file_url,
                description: `Material oficial del curso Nivel ${levelKey.toUpperCase()}`,
                unitTag: `Unidad · Nivel ${levelKey.toUpperCase()}`
              }))
              setMaterials(dbMats)
            }
          } catch (e) {
            console.warn('Nota fetch /api/materials en curso:', e)
          }

          // 6. Clases sincrónicas en vivo desde la base de datos Supabase vía API
          try {
            const savedLive = localStorage.getItem(`ade_live_classes_${levelKey}`)
            if (savedLive) {
              try {
                const parsed = JSON.parse(savedLive)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setLiveClasses(parsed)
                }
              } catch (e) {}
            }
            const savedTeamsUrl = localStorage.getItem(`ade_teams_url_${levelKey}`)
            if (savedTeamsUrl) {
              setGeneralTeamsUrl(savedTeamsUrl)
            }

            const resLive = await fetch(`/api/live-classes?level=${levelKey}`)
            const dataLive = await resLive.json()
            if (dataLive?.classes && Array.isArray(dataLive.classes) && dataLive.classes.length > 0) {
              setLiveClasses(dataLive.classes)
              localStorage.setItem(`ade_live_classes_${levelKey}`, JSON.stringify(dataLive.classes))
              const activeC = dataLive.classes.find((c: any) => c.is_active) || dataLive.classes[0]
              if (activeC?.teams_meeting_url) {
                setGeneralTeamsUrl(activeC.teams_meeting_url)
              }
            }
          } catch (e) {
            console.warn('Nota fetch /api/live-classes en curso:', e)
          }
        }
      } catch (e) {}
    }
    loadLevel()
  }, [courseId])

  // Sincronización en tiempo real de recursos, grabaciones y clases en vivo
  useEffect(() => {
    const handleSync = () => {
      if (typeof window !== 'undefined') {
        const levelKey = (courseId || 'a1').toLowerCase().trim()

        const savedMaterials = localStorage.getItem(`ade_teacher_materials_${levelKey}`)
        if (savedMaterials) {
          try {
            const parsed = JSON.parse(savedMaterials)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMaterials(parsed)
            }
          } catch (e) {}
        }

        const savedRecs = localStorage.getItem(`ade_teacher_recordings_${levelKey}`)
        if (savedRecs) {
          try {
            const parsed = JSON.parse(savedRecs)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRecordedSessions(parsed)
            }
          } catch (e) {}
        }

        const savedLive = localStorage.getItem(`ade_live_classes_${levelKey}`)
        if (savedLive) {
          try {
            const parsed = JSON.parse(savedLive)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLiveClasses(parsed)
            }
          } catch (e) {}
        }

        const savedTeamsUrl = localStorage.getItem(`ade_teams_url_${levelKey}`)
        if (savedTeamsUrl) {
          setGeneralTeamsUrl(savedTeamsUrl)
        }
      }
    }

    window.addEventListener('storage', handleSync)
    window.addEventListener('ade_materials_updated', handleSync)
    window.addEventListener('ade_recordings_updated', handleSync)
    window.addEventListener('ade_live_classes_updated', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('ade_materials_updated', handleSync)
      window.removeEventListener('ade_recordings_updated', handleSync)
      window.removeEventListener('ade_live_classes_updated', handleSync)
    }
  }, [courseId])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Logout error:', e)
    }
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (e) {}
    window.location.replace('/campus/login')
  }

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName || !selectedTask) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      const updatedAssignments = assignments.map(a => a.id === selectedTask.id ? { ...a, status: 'submitted' as const } : a)
      setAssignments(updatedAssignments)

      // Guardar entrega en el buzón docente para este nivel específico
      if (typeof window !== 'undefined') {
        const levelKey = (courseId || 'a1').toLowerCase().trim()
        const savedSubs = localStorage.getItem(`ade_teacher_submissions_${levelKey}`)
        let currentSubs: any[] = []
        if (savedSubs) {
          try {
            currentSubs = JSON.parse(savedSubs)
          } catch (e) {}
        } else {
          currentSubs = INITIAL_SUBMISSIONS_BY_LEVEL[levelKey] || []
        }

        const newSubmission = {
          id: `sub-${levelKey}-${Date.now()}`,
          studentId: student.id,
          studentName: student.fullName,
          studentCode: student.studentCode,
          studentAvatar: student.avatarUrl,
          assignmentTitle: selectedTask.title,
          assignmentType: 'pdf' as const,
          submissionDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          dueDate: selectedTask.dueDate,
          fileUrl: '#',
          textContent: studentComment || 'Archivo adjunto entregado por el estudiante.',
          status: 'pending' as const,
          maxGrade: 5.0
        }

        const nextSubs = [newSubmission, ...currentSubs]
        localStorage.setItem(`ade_teacher_submissions_${levelKey}`, JSON.stringify(nextSubs))
      }
    }, 800)
  }

  // =========================================================================
  // ALGORITMO DINÁMICO: CÁLCULO DE CLASES SINCRÓNICAS & CUENTA REGRESIVA
  // =========================================================================
  const sortedLiveClasses = [...liveClasses].sort((a, b) => {
    return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  })

  const nowMs = currentTime.getTime()

  // 1. Sesión que se está transmitiendo en vivo en este preciso instante
  const activeLiveClass = sortedLiveClasses.find(c => {
    const st = new Date(c.scheduled_at).getTime()
    const en = st + (c.duration_minutes || 90) * 60 * 1000
    return nowMs >= st && nowMs <= en
  })

  // 2. Próxima sesión futura más cercana a realizarse
  const nextUpcomingClass = sortedLiveClasses
    .filter(c => new Date(c.scheduled_at).getTime() > nowMs)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]

  // 3. Sesión objetivo para la tarjeta destacada y el botón 3D flotante
  // (Prioridad: En vivo ahora > Próxima más cercana > Marcada como activa > Primera disponible)
  const targetClass: StudentLiveClass | null = 
    activeLiveClass || 
    nextUpcomingClass || 
    sortedLiveClasses.find(c => c.is_active) || 
    sortedLiveClasses[0] || 
    null

  // 4. Formateo y cuenta regresiva de alta precisión (estilo digital suizo/Apple)
  let countdownState: 'live' | 'upcoming' | 'completed' = 'upcoming'
  let countdownText = ''
  let countdownLabel = 'Inicia en:'

  if (activeLiveClass) {
    countdownState = 'live'
    const diffMs = (new Date(activeLiveClass.scheduled_at).getTime() + (activeLiveClass.duration_minutes || 90) * 60 * 1000) - nowMs
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000))
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60
    countdownLabel = 'Tiempo restante:'
    countdownText = `${hrs > 0 ? `${hrs}h ` : ''}${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
  } else if (nextUpcomingClass) {
    countdownState = 'upcoming'
    const diffMs = new Date(nextUpcomingClass.scheduled_at).getTime() - nowMs
    const totalSecs = Math.max(0, Math.floor(diffMs / 1000))
    const days = Math.floor(totalSecs / 86400)
    const hrs = Math.floor((totalSecs % 86400) / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60

    if (days > 0) {
      countdownText = `${days}d ${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
    } else {
      countdownText = `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
    }
  } else {
    countdownState = 'completed'
    countdownLabel = 'Estado:'
    countdownText = 'Ciclo semanal finalizado'
  }

  // 5. Enlace inteligente de Microsoft Teams: siempre apunta a la clase activa o más cercana
  const targetTeamsMeetingUrl = 
    targetClass?.teams_meeting_url?.trim() || 
    generalTeamsUrl?.trim() || 
    'https://teams.microsoft.com/l/meetup-join/american-dream-class'

  return (
    <div className="min-h-screen bg-[#0B1528] sm:bg-[#F0F3F7] text-slate-900 font-sans antialiased selection:bg-[#0B1528] selection:text-white sm:py-6 sm:px-4 flex flex-col items-center justify-start">
      
      {/* BARRA SUPERIOR FLOTANTE: MODO VISTA PREVIA DOCENTE */}
      {isTeacherPreview && (
        <div className="w-full max-w-6xl mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-3.5 sm:px-6 py-2.5 rounded-none sm:rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fadeIn border border-amber-300 z-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-slate-950 text-amber-400 shrink-0 shadow-sm">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-mono shrink-0">
                  Vista Previa Alumno
                </span>
                <span className="text-xs font-black truncate text-slate-950">
                  {cfg.code.split('-')[1] || cfg.levelBadge} · {cfg.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-900/90 font-medium hidden sm:block truncate mt-0.5">
                Estás visualizando el aula exactamente como la ven tus alumnos matriculados.
              </p>
            </div>
          </div>

          <Link
            href="/campus/docente"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition-all hover:scale-102 shrink-0 cursor-pointer"
            title="Volver al panel administrativo de gestión docente"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Volver a Mi Portal Docente</span>
            <span className="sm:hidden">Salir Vista Previa</span>
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL AMPLIO (MAX-W-6XL) CON ESQUINAS REDONDEADAS TIPO APP */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto bg-[#0B1528] rounded-none sm:rounded-[40px] overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border sm:border-slate-700/40 flex flex-col flex-1">

        {/* ======================================================================= */}
        {/* 1. SECCIÓN SUPERIOR AZUL MARINO (#0B1528) CON NAVEGACIÓN PRO PARA MÓVIL  */}
        {/* ======================================================================= */}
        <div className="w-full bg-[#0B1528] text-white pt-2 sm:pt-6 relative">
          
          {/* Muesca Superior Elegante (Top App Notch Curve - Solo Desktop/Tablet) */}
          <div className="hidden sm:flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          {/* ===================================================================== */}
          {/* VISTA ESCRITORIO / TABLET (>= sm)                                     */}
          {/* ===================================================================== */}
          <div className="hidden sm:block px-4 sm:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 md:py-6 border-b border-white/10">
              {/* Bloque izquierdo: LOGO DE PRIMERO A LA IZQUIERDA + Nivel + Título */}
              <div className="flex items-center gap-3.5 sm:gap-4 w-full lg:w-auto">
                <Link href="/" className="shrink-0 flex items-center group p-1 rounded-2xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                  <img 
                    src="/logo-american-dream.png" 
                    alt="American Dream English" 
                    className="h-12 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform" 
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono shadow-xs">
                      {cfg.code}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-0.5 truncate">
                    {cfg.title}
                  </h1>
                </div>
              </div>

              {/* Bloque derecho: Mis Cursos / Panel Docente + Docente + Estudiante */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full lg:w-auto">
                {isTeacherPreview ? (
                  <Link 
                    href="/campus/docente" 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 transition-all shrink-0 shadow-md text-xs font-black cursor-pointer"
                    title="Regresar a mi panel de gestión docente"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-950" />
                    <span>Panel Docente</span>
                  </Link>
                ) : (
                  <Link 
                    href="/campus" 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all shrink-0 backdrop-blur-md border border-white/15 shadow-sm text-xs font-bold"
                    title="Ver catálogo y listado de Mis Cursos"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Mis Cursos</span>
                  </Link>
                )}

                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-xs text-slate-200 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Docente: <strong className="text-white font-bold">{cfg.teacherName}</strong></span>
                </div>

                <StudentAvatarMenu
                  student={student}
                  isTeacher={isTeacherPreview}
                  onOpenEditProfile={(tab) => {
                    setProfileInitialTab(tab || 'info')
                    setShowProfileModal(true)
                  }}
                  onLogout={handleLogout}
                  variant="header"
                />
              </div>
            </div>

            {/* PESTAÑAS ESCRITORIO CENTRADAS */}
            <div className="pt-4 pb-6 flex justify-center w-full">
              <div className="inline-flex items-center justify-center flex-wrap gap-2 p-1.5 bg-white/10 rounded-full border border-white/15 backdrop-blur-xl shadow-lg">
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
                  <Headphones className="w-4 h-4" />
                  <span>Recursos & Guías</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'materiales' ? 'bg-[#0B1528] text-white' : 'bg-white/20 text-white'}`}>
                    {materials.length}
                  </span>
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

          {/* ===================================================================== */}
          {/* VISTA MÓVIL DEDICADA DE MÁXIMO CONFORT UX (< sm)                       */}
          {/* ===================================================================== */}
          <div className="block sm:hidden px-3 pt-1 pb-2 space-y-2.5">
            
            {/* 1. Barra Superior Compacta Estilo App Nativa con Menú Hamburguesa */}
            <div className="flex items-center justify-between gap-2.5 pt-1">
              
              {/* Botón Menú Hamburguesa Pro (ÚNICO DISPARADOR DEL DRAWER) */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white border border-white/15 shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title="Abrir menú académico"
              >
                <Menu className="w-5 h-5 text-amber-400" />
              </button>

              {/* Título Central del Curso + Badge MCER (Elemento Informativo, no interactivo) */}
              <div className="min-w-0 flex-1 flex flex-col items-center justify-center text-center px-1 select-none pointer-events-none">
                <div className="flex items-center gap-1.5 max-w-full">
                  <span className="text-sm font-black text-white tracking-tight truncate leading-tight">
                    {cfg.title}
                  </span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono shrink-0 shadow-2xs leading-none">
                    {cfg.code.split('-')[1] || cfg.levelBadge.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium truncate mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span className="text-emerald-300 font-bold">En vivo Teams</span>
                  <span className="text-white/30">•</span>
                  <span className="truncate">{cfg.teacherName}</span>
                </div>
              </div>

              {/* Avatar del Estudiante (Abre directamente su perfil y foto) */}
              <button
                type="button"
                onClick={() => {
                  setProfileInitialTab('info')
                  setShowProfileModal(true)
                }}
                className="relative shrink-0 p-0.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 transition-all shadow-sm cursor-pointer"
                title="Editar mi perfil y foto"
              >
                {student.avatarUrl ? (
                  <img 
                    src={student.avatarUrl} 
                    alt={student.fullName}
                    className="w-9 h-9 rounded-xl object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs border border-amber-300">
                    {student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B1528] rounded-full shadow-2xs" />
              </button>

            </div>

            {/* 2. Zona de Pestañas Segregadas (100% Pantalla, NADA Cortado, Cero Scroll) */}
            <div className="pt-0.5">
              <div className="grid grid-cols-5 gap-1 p-1 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-xl shadow-lg w-full">
                
                {/* Pestaña: Clases */}
                <button
                  onClick={() => setActiveTab('cronograma')}
                  className={`py-2 px-0.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 relative select-none active:scale-95 ${
                    activeTab === 'cronograma'
                      ? 'bg-white text-[#0B1528] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'cronograma' ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="leading-tight truncate max-w-full">Clases</span>
                </button>

                {/* Pestaña: Guías */}
                <button
                  onClick={() => setActiveTab('materiales')}
                  className={`py-2 px-0.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 relative select-none active:scale-95 ${
                    activeTab === 'materiales'
                      ? 'bg-white text-[#0B1528] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'materiales' ? 'text-blue-600' : 'text-slate-300'}`} />
                    <span className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1 rounded-full leading-none py-0.5 ${
                      activeTab === 'materiales' ? 'bg-[#0B1528] text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {materials.length}
                    </span>
                  </div>
                  <span className="leading-tight truncate max-w-full">Guías</span>
                </button>

                {/* Pestaña: Videos */}
                <button
                  onClick={() => setActiveTab('grabadas')}
                  className={`py-2 px-0.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 relative select-none active:scale-95 ${
                    activeTab === 'grabadas'
                      ? 'bg-white text-[#0B1528] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Film className={`w-4 h-4 shrink-0 ${activeTab === 'grabadas' ? 'text-amber-600' : 'text-slate-300'}`} />
                    <span className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1 rounded-full leading-none py-0.5 ${
                      activeTab === 'grabadas' ? 'bg-[#0B1528] text-white' : 'bg-amber-400 text-slate-950'
                    }`}>
                      {recordedSessions.length}
                    </span>
                  </div>
                  <span className="leading-tight truncate max-w-full">Videos</span>
                </button>

                {/* Pestaña: Foro */}
                <button
                  onClick={() => setActiveTab('foro')}
                  className={`py-2 px-0.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 relative select-none active:scale-95 ${
                    activeTab === 'foro'
                      ? 'bg-white text-[#0B1528] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'foro' ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="leading-tight truncate max-w-full">Foro</span>
                </button>

                {/* Pestaña: Tareas */}
                <button
                  onClick={() => setActiveTab('tareas')}
                  className={`py-2 px-0.5 rounded-xl text-[11px] font-black transition-all flex flex-col items-center justify-center gap-1 relative select-none active:scale-95 ${
                    activeTab === 'tareas'
                      ? 'bg-white text-[#0B1528] shadow-md shadow-black/20 scale-[1.02]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'tareas' ? 'text-purple-600' : 'text-slate-300'}`} />
                    <span className={`absolute -top-1.5 -right-2 text-[9px] font-extrabold px-1 rounded-full leading-none py-0.5 ${
                      activeTab === 'tareas' ? 'bg-[#0B1528] text-white' : 'bg-purple-500 text-white'
                    }`}>
                      {assignments.length}
                    </span>
                  </div>
                  <span className="leading-tight truncate max-w-full">Tareas</span>
                </button>

              </div>
            </div>

          </div>

          {/* TRANSICIÓN DE ONDA ORGÁNICA (SOLO ESCRITORIO) */}
          <div className="hidden sm:block w-full overflow-hidden leading-none -mb-1">
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
        {/* 2. SUPERFICIE BLANCA CONTINUA UNIFICADA (TARJETA TIPO HOJA NATIVA)       */}
        {/* ======================================================================= */}
        <div className="w-full bg-white flex-1 pb-32 rounded-t-[28px] sm:rounded-none relative z-10 shadow-2xl sm:shadow-none">
          <div className="px-3.5 sm:px-6 pt-4 sm:pt-5">

            {/* =================================================================== */}
            {/* PESTAÑA 1: CRONOGRAMA & ACCESO A CLASES EN VIVO                     */}
            {/* =================================================================== */}
            {activeTab === 'cronograma' && (
              <div className="space-y-6">
                
                {/* TARJETA DESTACADA DE CLASE EN VIVO CON RELOJ DIGITAL Y ENLACE INTELIGENTE DE TEAMS */}
                <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 rounded-3xl p-5 sm:p-7 shadow-[0_14px_35px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  
                  {/* Destellos sutiles de fondo Microsoft Teams */}
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#5B5FC7]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-3 z-10 max-w-xl">
                    
                    {/* Insignias de Estado y Reloj de Cuenta Regresiva de Precisión */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {countdownState === 'live' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          Sala Sincrónica en Vivo Ahora
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200/80 text-[11px] font-black uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-[#5B5FC7] animate-ping" />
                          Próxima Clase Sincrónica (Teams)
                        </span>
                      )}

                      {/* Contador Digital Moderno (Sleek Modern Digital Clock) */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 text-white text-xs font-mono tracking-tight font-extrabold shadow-sm border border-slate-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-300 font-sans text-[11px] font-bold">
                          {countdownLabel}
                        </span>
                        <span className="text-emerald-300 tabular-nums font-black tracking-normal">
                          {countdownText}
                        </span>
                      </div>
                    </div>

                    {/* Título de la Clase más cercana o activa */}
                    <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                      {targetClass?.title || cfg.liveClassTopic}
                    </h2>

                    {/* Metadatos en tiempo real */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#5B5FC7] shrink-0" />
                        <span className="font-bold text-slate-800 capitalize">
                          {targetClass ? formatClassDateLabel(targetClass.scheduled_at) : cfg.nextLiveClass}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#5B5FC7] shrink-0" />
                        <span className="font-mono text-slate-700">
                          {targetClass ? formatClassTimeRange(targetClass.scheduled_at, targetClass.duration_minutes) : '7:00 PM a 8:30 PM (COT)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <span>•</span>
                        <span>Docente: <strong className="text-slate-700">{cfg.teacherName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* EL BOTÓN 3D DE TEAMS QUE SIEMPRE APUNTA A LA CLASE MÁS CERCANA */}
                  <a
                    href={targetTeamsMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative inline-flex items-center justify-center gap-3.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide border-t border-white/40 border-b border-indigo-950/60 shadow-[0_14px_28px_-4px_rgba(79,70,229,0.45),_0_6px_12px_-2px_rgba(79,70,229,0.3),_inset_0_1.5px_1px_rgba(255,255,255,0.4),_inset_0_-3px_0_rgba(30,35,80,0.4)] hover:shadow-[0_18px_36px_-4px_rgba(91,95,199,0.65),_0_8px_16px_-2px_rgba(91,95,199,0.45)] hover:-translate-y-0.5 active:translate-y-1 transition-all shrink-0 cursor-pointer select-none z-10 ${
                      countdownState === 'live' 
                        ? 'bg-gradient-to-b from-[#10B981] via-[#059669] to-[#047857] ring-4 ring-emerald-400/50 animate-pulse' 
                        : 'bg-gradient-to-b from-[#5B5FC7] via-[#4F52B2] to-[#3B429F] hover:from-[#6A6ED6] hover:via-[#595CBF] hover:to-[#4549A8]'
                    }`}
                  >
                    {/* Contenedor del Logo Oficial 3D de Microsoft Teams */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 p-1 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                      <Image 
                        src="/images/microsoft-teams.svg" 
                        alt="Microsoft Teams" 
                        width={24} 
                        height={24} 
                        className="w-full h-full object-contain drop-shadow" 
                      />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                        {countdownState === 'live' ? 'Entrar a Clase (SALA EN VIVO ABIERTA)' : 'Entrar a Clase en Teams'}
                      </span>
                      {targetClass && (
                        <span className="text-[10px] text-indigo-100 font-semibold opacity-95">
                          {countdownState === 'live' ? '● Transmitiendo en este momento' : `Directo a: ${targetClass.title.substring(0, 26)}...`}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-indigo-100/90 group-hover:text-white transition-colors ml-1" />
                  </a>

                </div>

                {/* CRONOGRAMA SEMANAL DINÁMICO (CALCULADO CON LA FECHA DEL SISTEMA) */}
                <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Cronograma Oficial de Clases Sincrónicas</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Sesiones programadas en vivo con tu docente en Microsoft Teams. Los estados se actualizan automáticamente según la fecha del sistema.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0B1528] bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs self-start sm:self-center">
                      Nivel {cfg.shortLevel} · Periodo Activo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {sortedLiveClasses.length > 0 ? (
                      sortedLiveClasses.map((item, idx) => {
                        const startMs = new Date(item.scheduled_at).getTime()
                        const endMs = startMs + (item.duration_minutes || 90) * 60 * 1000
                        const isLive = nowMs >= startMs && nowMs <= endMs
                        const isPast = nowMs > endMs
                        const isUpcoming = nowMs < startMs
                        const isNext = targetClass?.id === item.id && !isLive && isUpcoming

                        return (
                          <div
                            key={item.id || idx}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all relative ${
                              isLive
                                ? 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                                : isNext
                                ? 'bg-white border-blue-400 shadow-sm ring-1 ring-blue-300/40'
                                : isPast
                                ? 'bg-slate-100/70 border-slate-200 opacity-75'
                                : 'bg-white border-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <strong className="text-xs sm:text-sm font-black text-slate-900 capitalize">
                                    {formatClassDateLabel(item.scheduled_at)}
                                  </strong>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    ({formatClassTimeRange(item.scheduled_at, item.duration_minutes)})
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-slate-800 leading-snug">
                                  {item.title}
                                </p>
                                {isNext && (
                                  <div className="text-[11px] font-mono font-bold text-blue-700 flex items-center gap-1.5 pt-0.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Inicia en: {countdownText}</span>
                                  </div>
                                )}
                                {isLive && (
                                  <div className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1.5 pt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    <span>Finaliza en: {countdownText}</span>
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 flex flex-col items-end gap-2">
                                {isLive ? (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    En Vivo
                                  </span>
                                ) : isNext ? (
                                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                                    Próxima
                                  </span>
                                ) : isPast ? (
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
                                    Dictada
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                    Programada
                                  </span>
                                )}

                                <a
                                  href={item.teams_meeting_url || targetTeamsMeetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-[11px] font-bold inline-flex items-center gap-1 pt-0.5 ${
                                    isLive
                                      ? 'text-emerald-700 font-black hover:text-emerald-900 underline'
                                      : isPast
                                      ? 'text-slate-400 hover:text-slate-600'
                                      : 'text-slate-600 hover:text-blue-700'
                                  }`}
                                >
                                  <span>{isLive ? 'Unirse a sala' : 'Ver enlace'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="col-span-2 text-center py-8 text-xs text-slate-400 font-medium">
                        Cargando sesiones programadas de la semana...
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* =================================================================== */}
            {/* PESTAÑA 2: MATERIAL DE ESTUDIO (PDFs & AUDIOS MP3)                  */}
            {/* =================================================================== */}
            {activeTab === 'materiales' && (
              <div className="bg-slate-50/60 rounded-3xl p-5 sm:p-7 border border-slate-200/80 space-y-6">
                
                {/* Cabecera y Filtros */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
                        Nivel {cfg.shortLevel}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">Docente: {cfg.teacherName}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                      Biblioteca Oficial de Recursos & Audio Labs
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Guías didácticas en PDF y pistas de fonética subidas por tu docente para entrenar tu oído y prepararte para cada sesión.
                    </p>
                  </div>

                  {/* Selector de Filtro */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-center">
                    <button
                      onClick={() => setMaterialFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        materialFilter === 'all'
                          ? 'bg-[#0B1528] text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Todos ({materials.length})
                    </button>
                    <button
                      onClick={() => setMaterialFilter('pdf')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        materialFilter === 'pdf'
                          ? 'bg-blue-600 text-white font-black shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Guías PDF ({pdfCount})</span>
                    </button>
                    <button
                      onClick={() => setMaterialFilter('audio')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        materialFilter === 'audio'
                          ? 'bg-purple-600 text-white font-black shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Audio Labs ({audioCount})</span>
                    </button>
                  </div>
                </div>

                {/* Banner de Reproducción Activa (cuando el estudiante está escuchando) */}
                {playingAudioId && (() => {
                  const currentTrack = materials.find(m => m.id === playingAudioId)
                  if (!currentTrack) return null

                  return (
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-purple-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
                          <Volume2 className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase bg-purple-400/30 text-purple-200 px-2 py-0.2 rounded-full font-mono">
                              Reproduciendo ahora
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-black truncate max-w-md mt-0.5">
                            {currentTrack.title}
                          </h4>
                        </div>
                      </div>

                      {/* Controles de Velocidad Fonética & Pausa */}
                      <div className="flex items-center gap-3">
                        {/* Selector de Velocidad */}
                        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 text-[11px] font-black">
                          <span className="text-slate-300 text-[10px] px-1 hidden sm:inline">Velocidad:</span>
                          <button
                            onClick={() => handleSetSpeed(0.8)}
                            className={`px-2 py-1 rounded-lg transition-all ${
                              audioPlaybackRate === 0.8 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                            title="Velocidad lenta para escuchar pronunciación y fonética clara"
                          >
                            0.8x (Lento)
                          </button>
                          <button
                            onClick={() => handleSetSpeed(1.0)}
                            className={`px-2 py-1 rounded-lg transition-all ${
                              audioPlaybackRate === 1.0 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            1.0x (Normal)
                          </button>
                          <button
                            onClick={() => handleSetSpeed(1.2)}
                            className={`px-2 py-1 rounded-lg transition-all ${
                              audioPlaybackRate === 1.2 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            1.2x
                          </button>
                        </div>

                        {/* Botón Detener / Pausar */}
                        <button
                          onClick={() => handleToggleStudentAudio(currentTrack)}
                          className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </button>
                      </div>
                    </div>
                  )
                })()}

                {/* Grid de Tarjetas de Materiales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMaterials.map((mat) => {
                    const isAudio = mat.type === 'audio'
                    const isPlayingThis = playingAudioId === mat.id

                    return (
                      <div
                        key={mat.id}
                        className={`bg-white border rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all ${
                          isPlayingThis 
                            ? 'border-purple-400 ring-2 ring-purple-400/20' 
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isAudio ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                              }`}>
                                {isAudio ? <Headphones className="w-3 h-3 text-purple-700" /> : <FileText className="w-3 h-3 text-blue-700" />}
                                <span>{isAudio ? 'AUDIO LAB MP3' : 'GUÍA DIDÁCTICA PDF'}</span>
                              </span>

                              {mat.unitTag && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {mat.unitTag}
                                </span>
                              )}
                            </div>

                            <span className="text-xs text-slate-400 font-mono font-bold">{mat.size}</span>
                          </div>

                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{mat.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{mat.description}</p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {isAudio && (
                            <button
                              onClick={() => handleToggleStudentAudio(mat)}
                              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs ${
                                isPlayingThis
                                  ? 'bg-purple-700 text-white animate-pulse shadow-purple-500/25'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                              }`}
                            >
                              {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                              <span>{isPlayingThis ? 'Pausar Reproducción' : 'Escuchar en Aula'}</span>
                            </button>
                          )}

                          <a
                            href={mat.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                          >
                            <Download className="w-4 h-4 text-slate-600" />
                            <span>Descargar</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
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

      {/* ========================================================================= */}
      {/* MENÚ HAMBURGUESA LATERAL PRO PARA MÓVIL (OFFCANVAS DRAWER)                */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Fondo oscuro traslúcido con cierre táctil */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Panel deslizante lateral */}
          <aside className="fixed inset-y-0 left-0 w-[88%] max-w-sm bg-[#0B1528] text-white shadow-2xl z-50 flex flex-col border-r border-white/10 animate-slideRight overflow-y-auto">
            
            {/* Cabecera del Drawer */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 group cursor-pointer active:scale-95 transition-transform"
                title="Ir a la Página Principal (Home)"
              >
                <img 
                  src="/logo-american-dream.png" 
                  alt="American Dream English" 
                  className="h-9 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <span className="font-black text-xs text-white tracking-tight block leading-none group-hover:text-amber-400 transition-colors">
                    AMERICAN DREAM
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mt-0.5">
                    Campus Virtual
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha Principal del Estudiante */}
            <div className="p-4 border-b border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {student.avatarUrl ? (
                    <img 
                      src={student.avatarUrl} 
                      alt={student.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg border-2 border-amber-300 shadow-md">
                      {student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#0B1528] rounded-full shadow-xs ring-1 ring-emerald-500/50" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm text-white truncate leading-tight">
                    {student.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">
                    {student.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono shadow-2xs">
                      {student.studentCode}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Nivel {student.currentLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón rápido editar perfil */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false)
                  setProfileInitialTab('info')
                  setShowProfileModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-xs font-bold text-amber-300 border border-white/10 transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Editar Foto & Perfil</span>
              </button>
            </div>

            {/* Tarjeta del Curso Actual */}
            <div className="p-4 border-b border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Curso en Curso
              </span>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                    {cfg.code}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En vivo Teams
                  </span>
                </div>
                <h4 className="font-black text-sm text-white leading-snug">
                  {cfg.title}
                </h4>
                <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-white/10">
                  <p><strong className="text-white">Docente:</strong> {cfg.teacherName}</p>
                  <p><strong className="text-white">Horario:</strong> Lunes a Jueves · 7:00 PM</p>
                  <p><strong className="text-white">Créditos:</strong> {cfg.credits} Académicos MCER</p>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos del Menú */}
            <div className="p-4 space-y-1.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                Navegación & Servicios
              </span>

              {/* Opción Docente Exclusiva para Volver a su Portal */}
              {isTeacherPreview && (
                <Link
                  href="/campus/docente"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 active:scale-98 transition-all border border-amber-400/40 group text-left shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-black text-amber-300">
                        Volver a Mi Portal Docente
                      </span>
                      <span className="block text-[10px] text-amber-200/80">
                        Panel de tutor y gestión de notas
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-300" />
                </Link>
              )}

              {/* Mis Cursos */}
              <Link
                href="/campus"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 transition-all border border-white/10 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-white group-hover:text-amber-300">
                      Mis Cursos Matriculados
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Ver catálogo y ciclos
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </Link>

              {/* Certificado de Matrícula */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false)
                  setShowCertModal(true)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 transition-all border border-white/10 group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-purple-300">
                      Certificado de Matrícula
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Constancia oficial con firma
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </button>

              {/* Cambiar Contraseña */}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false)
                  setProfileInitialTab('security')
                  setShowProfileModal(true)
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 transition-all border border-white/10 group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-blue-300">
                      Seguridad & Contraseña
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Actualizar clave de acceso
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </button>

              {/* Soporte WhatsApp */}
              <a
                href={getWhatsAppUrl('Hola soporte de American Dream English, requiero asistencia con mi aula virtual.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-98 transition-all border border-emerald-500/30 group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-300 group-hover:text-white">
                      WhatsApp Académico
                    </span>
                    <span className="block text-[10px] text-emerald-400/80">
                      Atención docente y soporte
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-white" />
              </a>

              {/* Ir a la Página Principal (Home) */}
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-98 transition-all border border-white/10 group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-amber-300">
                      Página Principal (Home)
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      americandreamenglish.com
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </Link>
            </div>

            {/* Pie del Drawer: Cerrar Sesión */}
            <div className="p-4 border-t border-white/10 mt-auto bg-white/5">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false)
                  handleLogout()
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 active:scale-98 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión del Campus</span>
              </button>
            </div>

          </aside>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONSTANCIA OFICIAL DE MATRÍCULA                                  */}
      {/* ========================================================================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">
              Certificado Oficial de Matrícula
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Documento con firma digital institucional y código QR de verificación.
            </p>

            <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1.5">
              <p><strong>Estudiante:</strong> {student.fullName}</p>
              <p><strong>Documento:</strong> {student.docType} {student.docNumber}</p>
              <p><strong>Código:</strong> {student.studentCode}</p>
              <p><strong>Periodo:</strong> 2026-I</p>
              <p><strong>Estado:</strong> {student.status}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('Descargando Certificado de Matrícula en PDF...')
                  setShowCertModal(false)
                }}
                className="px-4 py-2 text-xs font-extrabold text-white bg-[#002B49] hover:bg-[#001f35] rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reproductor de Audio Oculto para Aula del Estudiante */}
      <audio 
        ref={studentAudioRef} 
        onEnded={() => setPlayingAudioId(null)} 
        onError={() => setPlayingAudioId(null)} 
        className="hidden" 
      />

    </div>
  )
}
