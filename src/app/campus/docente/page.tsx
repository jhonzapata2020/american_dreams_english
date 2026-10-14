'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  ArrowUpRight,
  Headphones,
  Download,
  Pause,
  Music,
  FolderPlus,
  UploadCloud,
  LayoutGrid,
  List,
  ArrowUpDown,
  MessageCircle,
  Mail
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'
import { StudentProfileData } from '../../../components/campus/StudentProfileModal'
import { StudyMaterial as TeacherStudyMaterial, INITIAL_MATERIALS_BY_LEVEL, formatAudioStreamUrl } from '../../../data/studyMaterials'
import { LEVEL_CONFIGURATIONS } from '../../../data/levelConfig'
import { 
  INITIAL_RECORDINGS_BY_LEVEL, 
  INITIAL_SUBMISSIONS_BY_LEVEL, 
  INITIAL_STUDENTS_BY_LEVEL,
  LevelRecordedSession,
  LevelStudentSubmission,
  EnrolledStudent
} from '../../../data/levelData'

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
  teacher?: string
}

// Tipos de Clase Sincrónica en Vivo (Microsoft Teams)
export interface TeacherLiveClass {
  id: string
  level_code: string
  title: string
  teams_meeting_url: string
  scheduled_at: string
  duration_minutes: number
  is_active: boolean
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

// Datos iniciales de grabaciones y entregas por defecto (A1)
const INITIAL_RECORDINGS: TeacherRecordedSession[] = INITIAL_RECORDINGS_BY_LEVEL.a1 as unknown as TeacherRecordedSession[]
const INITIAL_SUBMISSIONS: StudentSubmission[] = INITIAL_SUBMISSIONS_BY_LEVEL.a1


export default function TeacherCampusPage() {
  const supabase = createClient()

  // Estado del docente
  const [teacherName, setTeacherName] = useState('Lic. Carlos Méndez')
  const [teacherEmail, setTeacherEmail] = useState('carlos.mendez@americandream.edu.co')
  const [activeLevel, setActiveLevel] = useState<'a1' | 'a2' | 'b1' | 'b2'>('a1')
  const [activeTab, setActiveTab] = useState<'live' | 'recordings' | 'materials' | 'grading' | 'forum' | 'students'>('live')

  // Módulo 0: Sala Teams & Cronograma en Vivo
  const [liveClasses, setLiveClasses] = useState<TeacherLiveClass[]>([])
  const [generalTeamsUrl, setGeneralTeamsUrl] = useState('https://teams.microsoft.com/l/meetup-join/american-dream-class')
  const [savingTeamsUrl, setSavingTeamsUrl] = useState(false)
  const [showLiveClassModal, setShowLiveClassModal] = useState(false)
  const [editingLiveClass, setEditingLiveClass] = useState<TeacherLiveClass | null>(null)
  const [liveClassForm, setLiveClassForm] = useState({
    title: '',
    teamsMeetingUrl: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '19:00',
    durationMinutes: 90,
    isActive: true
  })

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

  // Módulo: Recursos & Guías Didácticas
  const [materials, setMaterials] = useState<TeacherStudyMaterial[]>(INITIAL_MATERIALS_BY_LEVEL.a1)
  const [materialTypeFilter, setMaterialTypeFilter] = useState<'all' | 'pdf' | 'audio'>('all')
  const [materialSearchQuery, setMaterialSearchQuery] = useState('')
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<TeacherStudyMaterial | null>(null)
  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'audio',
    size: '2.5 MB',
    downloadUrl: '',
    audioSrc: '',
    description: '',
    unitTag: 'Unidad 1 · Gramática y Reglas'
  })
  const [pdfSourceMode, setPdfSourceMode] = useState<'file' | 'url'>('file')
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null)
  const [pdfUploadLoading, setPdfUploadLoading] = useState(false)
  const [showCloudGuide, setShowCloudGuide] = useState(false)
  const [previewingAudioId, setPreviewingAudioId] = useState<string | null>(null)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

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

  // Módulo 4: Gestión de Estudiantes Matriculados & Seguimiento Pedagógico
  const [studentViewMode, setStudentViewMode] = useState<'list' | 'grid'>('list')
  const [studentSearch, setStudentSearch] = useState('')
  const [studentSort, setStudentSort] = useState<'alpha-asc' | 'alpha-desc' | 'progress-desc' | 'progress-asc' | 'grade-desc'>('alpha-asc')
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'Activo' | 'Al día' | 'Pendiente'>('all')
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<EnrolledStudent | null>(null)
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({})
  const [currentNoteInput, setCurrentNoteInput] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // Cargar avatares oficiales desde Supabase para los estudiantes
  const [studentCloudAvatars, setStudentCloudAvatars] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadStudentAvatars() {
      try {
        const res = await fetch('/api/admin/students')
        if (res.ok) {
          const data = await res.json()
          if (data?.students && Array.isArray(data.students)) {
            const map: Record<string, string> = {}
            data.students.forEach((s: any) => {
              if (s.avatar_url) {
                if (s.email) map[s.email.toLowerCase()] = s.avatar_url
                if (s.document_number) {
                  map[s.document_number] = s.avatar_url
                  map[s.document_number.replace(/\./g, '')] = s.avatar_url
                }
              }
            })
            setStudentCloudAvatars(map)
          }
        }
      } catch (e) {}
    }
    loadStudentAvatars()
  }, [])

  const handleOpenStudentDetail = (st: EnrolledStudent) => {
    setSelectedStudentDetail(st)
    setCurrentNoteInput(studentNotes[st.code] || '')
  }

  const handleSaveStudentNote = (studentCode: string) => {
    setSavingNote(true)
    const updated = { ...studentNotes, [studentCode]: currentNoteInput.trim() }
    setStudentNotes(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ade_teacher_student_notes', JSON.stringify(updated))
    }
    setTimeout(() => {
      setSavingNote(false)
      showNotification('¡Observación pedagógica guardada con éxito!')
    }, 300)
  }

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
          } else {
            setTeacherName(LEVEL_CONFIGURATIONS[activeLevel]?.teacherName || 'Docente Titular')
          }
          if (session.user.email) {
            setTeacherEmail(session.user.email)
          }
        } else {
          setTeacherName(LEVEL_CONFIGURATIONS[activeLevel]?.teacherName || 'Docente Titular')
        }

        // Cargar grabaciones guardadas en localStorage para este nivel específico
        if (typeof window !== 'undefined') {
          const savedRecs = localStorage.getItem(`ade_teacher_recordings_${activeLevel}`)
          if (savedRecs) {
            try {
              const parsed = JSON.parse(savedRecs)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setRecordings(parsed)
              } else {
                const fallback = (INITIAL_RECORDINGS_BY_LEVEL[activeLevel] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as TeacherRecordedSession[]
                setRecordings(fallback)
                localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(fallback))
              }
            } catch (e) {
              const fallback = (INITIAL_RECORDINGS_BY_LEVEL[activeLevel] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as TeacherRecordedSession[]
              setRecordings(fallback)
            }
          } else {
            const fallback = (INITIAL_RECORDINGS_BY_LEVEL[activeLevel] || INITIAL_RECORDINGS_BY_LEVEL.a1) as unknown as TeacherRecordedSession[]
            setRecordings(fallback)
            localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(fallback))
          }

          // Cargar entregas de estudiantes para este nivel específico
          const savedSubs = localStorage.getItem(`ade_teacher_submissions_${activeLevel}`)
          if (savedSubs) {
            try {
              const parsed = JSON.parse(savedSubs)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSubmissions(parsed)
              } else {
                const fallback = INITIAL_SUBMISSIONS_BY_LEVEL[activeLevel] || INITIAL_SUBMISSIONS_BY_LEVEL.a1
                setSubmissions(fallback)
                localStorage.setItem(`ade_teacher_submissions_${activeLevel}`, JSON.stringify(fallback))
              }
            } catch (e) {
              const fallback = INITIAL_SUBMISSIONS_BY_LEVEL[activeLevel] || INITIAL_SUBMISSIONS_BY_LEVEL.a1
              setSubmissions(fallback)
            }
          } else {
            const fallback = INITIAL_SUBMISSIONS_BY_LEVEL[activeLevel] || INITIAL_SUBMISSIONS_BY_LEVEL.a1
            setSubmissions(fallback)
            localStorage.setItem(`ade_teacher_submissions_${activeLevel}`, JSON.stringify(fallback))
          }

          // Cargar materiales didácticos guardados en localStorage para este nivel específico
          const savedMaterials = localStorage.getItem(`ade_teacher_materials_${activeLevel}`)
          if (savedMaterials) {
            try {
              const parsed = JSON.parse(savedMaterials)
              if (Array.isArray(parsed) && parsed.length > 0) {
                setMaterials(parsed)
              } else {
                const fallback = INITIAL_MATERIALS_BY_LEVEL[activeLevel] || INITIAL_MATERIALS_BY_LEVEL.a1
                setMaterials(fallback)
                localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(fallback))
              }
            } catch (e) {
              const fallback = INITIAL_MATERIALS_BY_LEVEL[activeLevel] || INITIAL_MATERIALS_BY_LEVEL.a1
              setMaterials(fallback)
            }
          } else {
            const fallback = INITIAL_MATERIALS_BY_LEVEL[activeLevel] || INITIAL_MATERIALS_BY_LEVEL.a1
            setMaterials(fallback)
            localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(fallback))
          }

          // Cargar clases y grabaciones reales desde Supabase vía API
          try {
            const resClasses = await fetch(`/api/classes?level=${activeLevel}`)
            const dataClasses = await resClasses.json()
            if (dataClasses?.classes && dataClasses.classes.length > 0) {
              const mappedDbClasses: TeacherRecordedSession[] = dataClasses.classes.map((c: any, idx: number) => ({
                id: c.id,
                lessonNumber: dataClasses.classes.length - idx,
                title: c.title,
                date: new Date(c.scheduled_at || c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
                duration: '1h 15m',
                teacher: teacherName || 'Prof. Anthony Zapata',
                videoUrl: c.meeting_link,
                thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
                topics: ['Sesión en vivo Teams', 'Grabación oficial'],
                level: activeLevel.toUpperCase(),
                status: 'published'
              }))
              setRecordings(mappedDbClasses)
              localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(mappedDbClasses))
            }
          } catch (e) {
            console.warn('Nota fetch /api/classes:', e)
          }

          // Cargar materiales y guías reales desde Supabase vía API
          try {
            const resMats = await fetch(`/api/materials?level=${activeLevel}`)
            const dataMats = await resMats.json()
            if (dataMats?.materials && dataMats.materials.length > 0) {
              const mappedDbMats: TeacherStudyMaterial[] = dataMats.materials.map((m: any) => ({
                id: m.id,
                title: m.title,
                type: (m.file_url?.toLowerCase().endsWith('.mp3') || m.file_url?.toLowerCase().includes('audio') ? 'audio' : 'pdf') as 'pdf' | 'audio',
                size: '2.5 MB',
                downloadUrl: m.file_url,
                audioSrc: m.file_url,
                description: `Material oficial del nivel ${activeLevel.toUpperCase()}`,
                unitTag: `Unidad · Nivel ${activeLevel.toUpperCase()}`,
                createdAt: new Date(m.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
              }))
              setMaterials(mappedDbMats)
              localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(mappedDbMats))
            }
          } catch (e) {
            console.warn('Nota fetch /api/materials:', e)
          }

          // Cargar clases en vivo y enlace de Teams desde Supabase vía API
          try {
            const resLive = await fetch(`/api/live-classes?level=${activeLevel}`)
            const dataLive = await resLive.json()
            if (dataLive?.classes && dataLive.classes.length > 0) {
              setLiveClasses(dataLive.classes)
              const activeC = dataLive.classes.find((c: any) => c.is_active) || dataLive.classes[0]
              if (activeC?.teams_meeting_url) {
                setGeneralTeamsUrl(activeC.teams_meeting_url)
              }
              localStorage.setItem(`ade_live_classes_${activeLevel}`, JSON.stringify(dataLive.classes))
            }
          } catch (e) {
            console.warn('Nota fetch /api/live-classes:', e)
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
  // HANDLERS: GESTIÓN DE SALA TEAMS Y CLASES EN VIVO (CRONOGRAMA)
  // =========================================================================
  const handleSaveGeneralTeamsUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!generalTeamsUrl.trim()) return
    setSavingTeamsUrl(true)
    try {
      await fetch('/api/live-classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level_code: activeLevel,
          teams_meeting_url: generalTeamsUrl.trim(),
          updateAllUrlsForLevel: true
        })
      })

      const updated = liveClasses.map(c => ({ ...c, teams_meeting_url: generalTeamsUrl.trim() }))
      setLiveClasses(updated)
      localStorage.setItem(`ade_live_classes_${activeLevel}`, JSON.stringify(updated))
      localStorage.setItem(`ade_teams_url_${activeLevel}`, generalTeamsUrl.trim())
      window.dispatchEvent(new CustomEvent('ade_live_classes_updated', { detail: { level: activeLevel } }))
      showNotification(`¡Enlace oficial de Teams guardado y sincronizado para ${activeLevel.toUpperCase()}!`)
    } catch (e) {
      console.warn('Nota guardado teams URL:', e)
      showNotification('Enlace guardado en caché local.')
    } finally {
      setSavingTeamsUrl(false)
    }
  }

  const handleOpenNewLiveClassModal = () => {
    setEditingLiveClass(null)
    const today = new Date().toISOString().split('T')[0]
    setLiveClassForm({
      title: '',
      teamsMeetingUrl: generalTeamsUrl || 'https://teams.microsoft.com',
      scheduledDate: today,
      scheduledTime: '19:00',
      durationMinutes: 90,
      isActive: true
    })
    setShowLiveClassModal(true)
  }

  const handleEditLiveClass = (item: TeacherLiveClass) => {
    setEditingLiveClass(item)
    const dt = new Date(item.scheduled_at)
    const dateStr = !isNaN(dt.getTime()) ? dt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    const timeStr = !isNaN(dt.getTime()) ? dt.toTimeString().substring(0, 5) : '19:00'

    setLiveClassForm({
      title: item.title,
      teamsMeetingUrl: item.teams_meeting_url || generalTeamsUrl,
      scheduledDate: dateStr,
      scheduledTime: timeStr,
      durationMinutes: item.duration_minutes || 90,
      isActive: item.is_active
    })
    setShowLiveClassModal(true)
  }

  const handleSaveLiveClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!liveClassForm.title.trim()) return

    const combinedDateTime = new Date(`${liveClassForm.scheduledDate}T${liveClassForm.scheduledTime}:00`).toISOString()
    const meetingUrl = liveClassForm.teamsMeetingUrl.trim() || generalTeamsUrl.trim() || 'https://teams.microsoft.com'

    if (editingLiveClass) {
      try {
        await fetch('/api/live-classes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingLiveClass.id.startsWith('default-') ? undefined : editingLiveClass.id,
            level_code: activeLevel,
            title: liveClassForm.title.trim(),
            teams_meeting_url: meetingUrl,
            scheduled_at: combinedDateTime,
            duration_minutes: liveClassForm.durationMinutes,
            is_active: liveClassForm.isActive
          })
        })
      } catch (err) {
        console.warn('Nota update live class:', err)
      }

      const updated = liveClasses.map(c => {
        if (c.id === editingLiveClass.id) {
          return {
            ...c,
            title: liveClassForm.title.trim(),
            teams_meeting_url: meetingUrl,
            scheduled_at: combinedDateTime,
            duration_minutes: liveClassForm.durationMinutes,
            is_active: liveClassForm.isActive
          }
        }
        if (liveClassForm.isActive) {
          return { ...c, is_active: false }
        }
        return c
      })
      setLiveClasses(updated)
      localStorage.setItem(`ade_live_classes_${activeLevel}`, JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('ade_live_classes_updated', { detail: { level: activeLevel } }))
      showNotification(`¡Sesión sincrónica de ${activeLevel.toUpperCase()} actualizada!`)
    } else {
      let savedId = `live-${activeLevel}-${Date.now()}`
      try {
        const res = await fetch('/api/live-classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level_code: activeLevel,
            title: liveClassForm.title.trim(),
            teams_meeting_url: meetingUrl,
            scheduled_at: combinedDateTime,
            duration_minutes: liveClassForm.durationMinutes,
            is_active: liveClassForm.isActive
          })
        })
        const data = await res.json()
        if (data?.liveClass?.id) {
          savedId = data.liveClass.id
        }
      } catch (err) {
        console.warn('Nota insert live class:', err)
      }

      const newSession: TeacherLiveClass = {
        id: savedId,
        level_code: activeLevel.toUpperCase(),
        title: liveClassForm.title.trim(),
        teams_meeting_url: meetingUrl,
        scheduled_at: combinedDateTime,
        duration_minutes: liveClassForm.durationMinutes,
        is_active: liveClassForm.isActive
      }

      const updated = liveClassForm.isActive
        ? [newSession, ...liveClasses.map(c => ({ ...c, is_active: false }))]
        : [...liveClasses, newSession]

      setLiveClasses(updated)
      localStorage.setItem(`ade_live_classes_${activeLevel}`, JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('ade_live_classes_updated', { detail: { level: activeLevel } }))
      showNotification(`¡Nueva sesión en vivo programada para ${activeLevel.toUpperCase()}!`)
    }

    setShowLiveClassModal(false)
  }

  const handleDeleteLiveClass = async (id: string) => {
    if (confirm('¿Deseas eliminar esta sesión en vivo del cronograma?')) {
      const updated = liveClasses.filter(c => c.id !== id)
      setLiveClasses(updated)
      localStorage.setItem(`ade_live_classes_${activeLevel}`, JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('ade_live_classes_updated', { detail: { level: activeLevel } }))

      try {
        if (!id.startsWith('default-') && !id.startsWith('live-')) {
          await fetch(`/api/live-classes?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        }
      } catch (err) {
        console.warn('Nota delete live class:', err)
      }
      showNotification('Sesión eliminada del cronograma.')
    }
  }

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

  const handleSaveRecording = async (e: React.FormEvent) => {
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_recordings_updated', { detail: { level: activeLevel } }))
      }

      // Sincronizar en Supabase vía API Classes
      try {
        await fetch('/api/classes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingRecording.id.startsWith('rec-') ? undefined : editingRecording.id,
            title: recordingForm.title,
            videoUrl: recordingForm.videoUrl,
            status: 'completed'
          })
        })
      } catch (e) {
        console.warn('Nota Supabase classes update:', e)
      }

      showNotification(`¡Clase grabada de ${activeLevel.toUpperCase()} actualizada con éxito!`)
    } else {
      // Crear nueva en Supabase vía API Classes
      let savedId = `rec-${activeLevel}-${Date.now()}`
      try {
        const res = await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: recordingForm.title,
            videoUrl: recordingForm.videoUrl,
            level: activeLevel,
            status: 'completed'
          })
        })
        const resData = await res.json()
        if (resData?.class?.id) {
          savedId = resData.class.id
        }
      } catch (e) {
        console.warn('Nota Supabase classes insert:', e)
      }

      const newRec: TeacherRecordedSession = {
        id: savedId,
        lessonNumber: Number(recordingForm.lessonNumber),
        title: recordingForm.title,
        date: recordingForm.date,
        duration: recordingForm.duration,
        teacher: teacherName,
        videoUrl: recordingForm.videoUrl,
        thumbnailUrl: recordingForm.thumbnailUrl,
        topics: topicsArray,
        level: activeLevel.toUpperCase(),
        status: 'published'
      }
      const updated = [newRec, ...recordings]
      setRecordings(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_recordings_updated', { detail: { level: activeLevel } }))
      }

      showNotification(`¡Nueva grabación de Teams publicada en el aula de ${activeLevel.toUpperCase()}!`)
    }

    setShowRecordingModal(false)
  }

  const handleDeleteRecording = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta grabación? Los alumnos ya no podrán verla en su aula.')) {
      const updated = recordings.filter(r => r.id !== id)
      setRecordings(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_recordings_updated', { detail: { level: activeLevel } }))
      }

      // Eliminar de Supabase vía API Classes
      try {
        if (!id.startsWith('rec-')) {
          await fetch(`/api/classes?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        }
      } catch (e) {
        console.warn('Error al eliminar clase en Supabase:', e)
      }

      showNotification(`Grabación eliminada del catálogo de ${activeLevel.toUpperCase()}.`)
    }
  }

  // =========================================================================
  // HANDLERS: GESTIÓN DE RECURSOS & GUÍAS DIDÁCTICAS
  // =========================================================================
  const handleOpenNewMaterialModal = () => {
    setEditingMaterial(null)
    setSelectedPdfFile(null)
    setPdfSourceMode('file')
    setShowCloudGuide(false)
    setMaterialForm({
      title: '',
      type: 'pdf',
      size: '2.5 MB',
      downloadUrl: '',
      audioSrc: '',
      description: '',
      unitTag: activeLevel === 'a1' ? 'Unidad 1 · Gramática y Reglas' : `Unidad 1 · Nivel ${activeLevel.toUpperCase()}`
    })
    setShowMaterialModal(true)
  }

  const handleEditMaterial = (mat: TeacherStudyMaterial) => {
    setEditingMaterial(mat)
    setSelectedPdfFile(null)
    setPdfSourceMode('url')
    setShowCloudGuide(false)
    setMaterialForm({
      title: mat.title,
      type: mat.type,
      size: mat.size,
      downloadUrl: mat.downloadUrl,
      audioSrc: mat.audioSrc || (mat.type === 'audio' ? mat.downloadUrl : ''),
      description: mat.description,
      unitTag: mat.unitTag || 'Recurso General'
    })
    setShowMaterialModal(true)
  }

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar extensión
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo en formato PDF (.pdf).')
      return
    }

    // Validar tamaño (máximo 5 MB para carga directa)
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      alert(`El archivo seleccionado pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El límite máximo para subir directo desde el computador es de 5 MB.\n\nPara archivos mayores a 5 MB, por favor súbelo a Google Drive o OneDrive y pega el enlace en la pestaña "Enlace Web / Drive".`)
      return
    }

    const sizeText = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    setSelectedPdfFile(file)
    const cleanTitle = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')
    setMaterialForm(prev => ({
      ...prev,
      title: prev.title.trim() ? prev.title : cleanTitle,
      size: sizeText
    }))
  }

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso didáctico? Los estudiantes ya no podrán descargarlo ni escucharlo en su aula.')) {
      const updated = materials.filter(m => m.id !== id)
      setMaterials(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_materials_updated', { detail: { level: activeLevel } }))
      }

      // Eliminar de Supabase vía API Materials
      try {
        if (!id.startsWith('mat-')) {
          await fetch(`/api/materials?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        }
      } catch (e) {
        console.warn('Error al eliminar material en Supabase:', e)
      }

      showNotification('Recurso didáctico eliminado con éxito.')
      if (previewingAudioId === id) {
        if (previewAudioRef.current) previewAudioRef.current.pause()
        setPreviewingAudioId(null)
      }
    }
  }

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materialForm.title.trim()) return

    let finalDownloadUrl = materialForm.downloadUrl.trim()
    let finalAudioSrc = materialForm.audioSrc.trim()

    // 1. Si es PDF y subió archivo desde el PC
    if (materialForm.type === 'pdf') {
      if (pdfSourceMode === 'file' && selectedPdfFile) {
        setPdfUploadLoading(true)
        try {
          const safeName = selectedPdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const storagePath = `guides/${activeLevel}/${Date.now()}-${safeName}`
          
          // Intentar subir a Supabase Storage bucket 'materials'
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('materials')
            .upload(storagePath, selectedPdfFile, {
              cacheControl: '3600',
              upsert: true
            })

          if (!uploadErr && uploadData) {
            const { data: pubUrlData } = supabase.storage
              .from('materials')
              .getPublicUrl(storagePath)
            if (pubUrlData?.publicUrl) {
              finalDownloadUrl = pubUrlData.publicUrl
            }
          } else {
            console.warn('Aviso Supabase Storage:', uploadErr?.message)
            finalDownloadUrl = URL.createObjectURL(selectedPdfFile)
          }
        } catch (err) {
          console.warn('Fallback carga local:', err)
          finalDownloadUrl = URL.createObjectURL(selectedPdfFile)
        } finally {
          setPdfUploadLoading(false)
        }
      } else if (!finalDownloadUrl) {
        finalDownloadUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    } else {
      // 2. Si es Audio, formatear URL de Google Drive / Dropbox para stream directo
      const formattedStream = formatAudioStreamUrl(finalAudioSrc || finalDownloadUrl)
      finalAudioSrc = formattedStream
      if (!finalDownloadUrl) {
        finalDownloadUrl = formattedStream
      }
    }

    if (editingMaterial) {
      const updated = materials.map(m => {
        if (m.id === editingMaterial.id) {
          return {
            ...m,
            title: materialForm.title.trim(),
            type: materialForm.type,
            size: materialForm.size.trim() || (materialForm.type === 'pdf' ? '2.5 MB' : '8.5 MB'),
            downloadUrl: finalDownloadUrl,
            audioSrc: materialForm.type === 'audio' ? finalAudioSrc : undefined,
            description: materialForm.description.trim(),
            unitTag: materialForm.unitTag.trim()
          }
        }
        return m
      })
      setMaterials(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_materials_updated', { detail: { level: activeLevel } }))
      }

      // Sincronizar en Supabase vía API Materials
      try {
        await fetch('/api/materials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMaterial.id.startsWith('mat-') ? undefined : editingMaterial.id,
            title: materialForm.title.trim(),
            file_url: finalDownloadUrl
          })
        })
      } catch (e) {
        console.warn('Nota Supabase materials update:', e)
      }

      showNotification('¡Recurso didáctico actualizado y sincronizado!')
    } else {
      // Crear nuevo en Supabase vía API Materials
      let savedId = `mat-${activeLevel}-${Date.now()}`
      try {
        const res = await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: materialForm.title.trim(),
            file_url: finalDownloadUrl,
            level: activeLevel
          })
        })
        const resData = await res.json()
        if (resData?.material?.id) {
          savedId = resData.material.id
        }
      } catch (e) {
        console.warn('Nota Supabase materials insert:', e)
      }

      const newMaterial: TeacherStudyMaterial = {
        id: savedId,
        title: materialForm.title.trim(),
        type: materialForm.type,
        size: materialForm.size.trim() || (materialForm.type === 'pdf' ? '2.5 MB' : '8.5 MB'),
        downloadUrl: finalDownloadUrl,
        audioSrc: materialForm.type === 'audio' ? finalAudioSrc : undefined,
        description: materialForm.description.trim(),
        unitTag: materialForm.unitTag.trim(),
        createdAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      }
      const updated = [newMaterial, ...materials]
      setMaterials(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_materials_updated', { detail: { level: activeLevel } }))
      }

      showNotification('¡Nuevo recurso didáctico publicado en el aula de los estudiantes!')
    }

    setShowMaterialModal(false)
  }

  const handleToggleAudioPreview = (mat: TeacherStudyMaterial) => {
    if (previewingAudioId === mat.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
      }
      setPreviewingAudioId(null)
    } else {
      setPreviewingAudioId(mat.id)
      if (previewAudioRef.current) {
        const src = mat.audioSrc || mat.downloadUrl
        previewAudioRef.current.src = src
        previewAudioRef.current.play().catch(() => {})
      }
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

  // Filtrado y Conteo de Recursos Didácticos
  const filteredMaterials = materials.filter(m => {
    if (materialTypeFilter === 'pdf' && m.type !== 'pdf') return false
    if (materialTypeFilter === 'audio' && m.type !== 'audio') return false
    if (materialSearchQuery.trim()) {
      const q = materialSearchQuery.toLowerCase()
      const inTitle = m.title.toLowerCase().includes(q)
      const inDesc = m.description.toLowerCase().includes(q)
      const inTag = m.unitTag?.toLowerCase().includes(q) || false
      if (!inTitle && !inDesc && !inTag) return false
    }
    return true
  })
  const pdfMaterialsCount = materials.filter(m => m.type === 'pdf').length
  const audioMaterialsCount = materials.filter(m => m.type === 'audio').length

  // Configuración de las pestañas 3D con luces neón inferiores proyectadas (solo botón activo)
  const teacherTabs = [
    {
      id: 'live',
      label: 'Sala Teams',
      icon: Video,
      neonColor: '#6366F1', // Teams Tech Indigo Neón
      glowColor: 'rgba(99, 102, 241, 0.45)',
      lightPoolColor: 'rgba(99, 102, 241, 0.20)',
      badge: liveClasses.length > 0 ? liveClasses.length : undefined,
      isLive: true,
    },
    {
      id: 'recordings',
      label: 'Clases Grabadas',
      icon: Video,
      neonColor: '#F59E0B', // Ámbar / Oro Cálido
      glowColor: 'rgba(245, 158, 11, 0.45)',
      lightPoolColor: 'rgba(245, 158, 11, 0.20)',
      badge: recordings.length > 0 ? recordings.length : undefined,
      isLive: false,
    },
    {
      id: 'materials',
      label: 'Recursos & Guías',
      icon: Headphones,
      neonColor: '#A855F7', // Violeta / Púrpura Real
      glowColor: 'rgba(168, 85, 247, 0.45)',
      lightPoolColor: 'rgba(168, 85, 247, 0.20)',
      badge: materials.length > 0 ? materials.length : undefined,
      isLive: false,
    },
    {
      id: 'grading',
      label: 'Calificar Tareas',
      icon: FileText,
      neonColor: '#3B82F6', // Azul Cobalto Eléctrico
      glowColor: 'rgba(59, 130, 246, 0.45)',
      lightPoolColor: 'rgba(59, 130, 246, 0.20)',
      badge: pendingGradingCount > 0 ? pendingGradingCount : undefined,
      badgePulse: pendingGradingCount > 0,
      isLive: false,
    },
    {
      id: 'forum',
      label: 'Foro de Dudas',
      icon: MessageSquare,
      neonColor: '#06B6D4', // Cian Neón / Turquesa
      glowColor: 'rgba(6, 182, 212, 0.45)',
      lightPoolColor: 'rgba(6, 182, 212, 0.20)',
      badge: unansweredForumCount > 0 ? unansweredForumCount : undefined,
      isLive: false,
    },
    {
      id: 'students',
      label: 'Estudiantes',
      icon: Users,
      neonColor: '#F43F5E', // Coral Neón / Rosa
      glowColor: 'rgba(244, 63, 94, 0.45)',
      lightPoolColor: 'rgba(244, 63, 94, 0.20)',
      badge: (INITIAL_STUDENTS_BY_LEVEL[activeLevel] || INITIAL_STUDENTS_BY_LEVEL.a1).length,
      isLive: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0B1528] sm:bg-[#F0F3F7] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900 pb-16 sm:py-6 sm:px-4 items-center justify-start">
      
      {/* ========================================================================= */}
      {/* CONTENEDOR PRINCIPAL AMPLIO (MAX-W-6XL) CON ESQUINAS REDONDEADAS TIPO APP */}
      {/* ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto bg-[#0B1528] rounded-none sm:rounded-[40px] overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border sm:border-slate-700/40 flex flex-col flex-1">

        {/* ======================================================================= */}
        {/* 1. CABECERA SUPERIOR OSCURA (NAVY #0B1528)                            */}
        {/* ======================================================================= */}
        <header className="w-full bg-[#0B1528] text-white pt-3 sm:pt-6 relative">
          
          {/* Muesca Superior Elegante (Top App Notch Curve - Solo Desktop/Tablet) */}
          <div className="hidden sm:flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          <div className="px-4 sm:px-8 space-y-3 sm:space-y-4">
          
          {/* Fila 1: Logo Institucional + Saludo Docente + Selector de Nivel Evolucionado + Acciones */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            
            {/* Bloque Izquierdo: Logo Oficial + Saludo Docente */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <Link href="/" className="shrink-0 group flex flex-col items-center relative py-1 cursor-pointer" title="Ir al Inicio">
                  {/* Logo Institucional con Levitación y Resplandor 3D */}
                  <img 
                    src="/logo-american-dream.png" 
                    alt="American Dream English" 
                    className="h-9 sm:h-14 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:drop-shadow-[0_16px_25px_rgba(245,158,11,0.35)] transition-all duration-300 ease-out" 
                  />
                  {/* Sombra de piso elíptica que responde dinámicamente a la flotación */}
                  <div className="w-4/5 h-1.5 sm:h-2 bg-black/60 rounded-full blur-[3px] sm:blur-[4px] mt-0.5 group-hover:scale-75 group-hover:opacity-40 group-hover:blur-[6px] transition-all duration-300 pointer-events-none" />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                      Portal Docente
                    </span>
                    <span className="hidden sm:inline-flex font-mono text-[10px] font-bold uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                      Periodo 2026-I
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Online</span>
                  </div>
                  <h1 className="text-base sm:text-2xl font-black text-white tracking-tight truncate">
                    {teacherName}
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate hidden sm:block">
                    {teacherEmail} · Docente Titular American Dream English
                  </p>
                </div>
              </div>

              {/* Botón Salir Móvil (visible solo en pantallas pequeñas arriba a la derecha) */}
              <button
                type="button"
                onClick={handleLogout}
                className="sm:hidden inline-flex items-center justify-center p-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Cerrar Sesión Segura"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Bloque Derecho: Selector de Nivel Evolucionado (Dark Glass Capsule) + Ver Aula + Salir */}
            <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 sm:hidden">Nivel del Aula:</span>
              
              {/* Selector de Nivel Evolucionado (Dark Glass Segmented Capsule) */}
              <div className="flex items-center bg-slate-900/70 p-1 rounded-2xl border border-white/15 backdrop-blur-md shadow-inner gap-1">
                {(['a1', 'a2', 'b1', 'b2'] as const).map((lvl) => {
                  const isActive = activeLevel === lvl
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveLevel(lvl)}
                      className={`relative px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase transition-all duration-200 cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_2px_12px_rgba(251,191,36,0.4)] scale-102 ring-1 ring-amber-300/70'
                          : 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
                      }`}
                      title={`Cambiar a Nivel ${lvl.toUpperCase()}`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  )
                })}
              </div>

              {/* Botón Ver Aula Estudiante (Oculto en móvil) */}
              <Link
                href={`/campus/curso/${activeLevel}?from=docente`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-amber-400/40 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                title={`Abrir vista de estudiante para el nivel ${activeLevel.toUpperCase()}`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Aula {activeLevel.toUpperCase()}</span>
              </Link>

              {/* Salir Desktop */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Cerrar Sesión Segura"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>

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

          {/* TRANSICIÓN DE ONDA ORGÁNICA CONTINUA */}
          <div className="w-full overflow-hidden leading-none -mb-1 select-none pointer-events-none">
            <svg 
              viewBox="0 0 1440 100" 
              preserveAspectRatio="none" 
              className="w-full h-6 sm:h-14 text-white fill-current block"
            >
              <path d="M0,0 C320,85 520,95 760,50 C1020,10 1240,75 1440,85 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* 2. SUPERFICIE BLANCA CONTINUA UNIFICADA (BG-WHITE)                      */}
        {/* ======================================================================= */}
        <main className="w-full bg-white text-slate-800 flex-1 p-3.5 sm:p-7 md:p-8 space-y-4 sm:space-y-6">
          
          {/* =================================================================== */}
          {/* PESTAÑAS 3D FLOTANTES CON LUCES NEÓN INFERIORES (STUDIO LIGHT BAR)  */}
          {/* =================================================================== */}
          <div className="w-full bg-gradient-to-b from-slate-100/90 via-slate-50/70 to-white rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 border border-slate-200/90 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] relative overflow-visible">
            <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar scroll-smooth pt-1.5 pb-5 px-1">
              <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 shrink-0">
                {teacherTabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  const IconComp = tab.icon

                  return (
                    <div key={tab.id} className="relative group shrink-0">
                      {/* 1. LUZ PROYECTADA ABAJO (ÚNICAMENTE EN EL BOTÓN ACTIVO / SELECCIONADO, MENOS INTENSA) */}
                      {isActive && (
                        <>
                          {/* Proyección difusa de luz sobre el suelo blanco */}
                          <div 
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full blur-md pointer-events-none transition-all duration-300 opacity-55"
                            style={{
                              backgroundColor: tab.neonColor,
                              boxShadow: `0 4px 12px 2px ${tab.glowColor}`,
                            }}
                          />

                          {/* Núcleo de luz tenue */}
                          <div 
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 rounded-full blur-[0.6px] pointer-events-none transition-all duration-300 opacity-60"
                            style={{
                              backgroundColor: '#FFFFFF',
                              boxShadow: `0 0 4px 1px ${tab.neonColor}`,
                            }}
                          />

                          {/* Difusión ambiental sutil */}
                          <div 
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-2 rounded-full blur-lg pointer-events-none transition-all duration-300 opacity-20"
                            style={{
                              backgroundColor: tab.lightPoolColor,
                            }}
                          />
                        </>
                      )}

                      {/* 2. CÁPSULA PÍLDORA 3D FLOTANTE */}
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none whitespace-nowrap ${
                          isActive
                            ? 'bg-gradient-to-b from-[#1C2744] via-[#101A30] to-[#080D1A] text-white -translate-y-0.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.8),0_6px_14px_-2px_rgba(0,0,0,0.35)] ring-1'
                            : 'bg-gradient-to-b from-[#162035] via-[#0E1626] to-[#0A0F1D] text-slate-400 hover:text-slate-200 hover:-translate-y-0.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.7),0_4px_8px_-2px_rgba(0,0,0,0.3)] border-t border-white/10'
                        }`}
                        style={{
                          borderColor: isActive ? `${tab.neonColor}60` : undefined,
                        }}
                      >
                        {/* Indicador pulsante en vivo para Sala Teams */}
                        {tab.isLive && (
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            <span 
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{ backgroundColor: tab.neonColor }}
                            />
                            <span 
                              className="relative inline-flex rounded-full h-1.5 w-1.5"
                              style={{ backgroundColor: tab.neonColor }}
                            />
                          </span>
                        )}

                        {/* Icono con resplandor suave solo si está activo */}
                        <IconComp 
                          className="w-3.5 h-3.5 shrink-0 transition-all duration-300"
                          style={{
                            color: isActive ? tab.neonColor : undefined,
                            filter: isActive ? `drop-shadow(0 0 2.5px ${tab.neonColor}60)` : undefined
                          }}
                        />

                        {/* Nombre de la pestaña */}
                        <span className="tracking-tight">{tab.label}</span>

                        {/* Badge numérico integrado */}
                        {tab.badge !== undefined && (
                          <span 
                            className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold transition-all ${
                              tab.badgePulse ? 'animate-pulse' : ''
                            }`}
                            style={{
                              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                              color: isActive ? '#FFFFFF' : '#94A3B8',
                              border: isActive ? `1px solid ${tab.neonColor}40` : '1px solid rgba(255,255,255,0.06)',
                              boxShadow: isActive ? `0 0 4px ${tab.neonColor}30` : undefined
                            }}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SECCIÓN 0: SALA TEAMS & CRONOGRAMA EN VIVO                          */}
          {/* =================================================================== */}
          {activeTab === 'live' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Tarjeta Destacada: Configuración Enlace de Teams (Estilo 3D Blanco Flotante Neumorphic con Logo Oficial) */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAFBFD] to-[#F1F4F9] text-slate-900 p-6 sm:p-7 rounded-3xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_12px_24px_-8px_rgba(91,95,199,0.18),inset_0_2px_1px_rgba(255,255,255,1),inset_0_-4px_0_rgba(226,232,240,0.85)] space-y-5">
                
                {/* Resplandores ambientales de fondo suaves */}
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#5B5FC7]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-indigo-100/40 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Contenedor del Logo 3D Oficial de Teams y Textos */}
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                    {/* Icono 3D de Teams flotante idéntico a la imagen de referencia */}
                    <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-slate-50 to-[#EDF2F7] p-3 sm:p-3.5 shadow-[0_12px_24px_rgba(91,95,199,0.18),0_4px_8px_rgba(0,0,0,0.06),inset_0_2px_1px_rgba(255,255,255,1),inset_0_-3px_0_rgba(203,213,225,0.7)] border border-slate-200/70 flex items-center justify-center group hover:-translate-y-1 transition-transform duration-300">
                      <Image 
                        src="/images/microsoft-teams.svg" 
                        alt="Microsoft Teams Logo" 
                        width={56} 
                        height={56} 
                        className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#5B5FC7] bg-[#5B5FC7]/10 border border-[#5B5FC7]/20 px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                          Microsoft Teams · Sala Sincrónica {activeLevel.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <span>Enlace Maestro de Microsoft Teams</span>
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-[#5B5FC7]/10 text-[#5B5FC7] border border-[#5B5FC7]/20 font-mono font-bold">
                          {activeLevel.toUpperCase()}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
                        El botón de Teams en el aula del estudiante redirigirá automáticamente a esta reunión para todas las sesiones sincrónicas programadas de {activeLevel.toUpperCase()}.
                      </p>
                    </div>
                  </div>

                  {/* BOTÓN 1: PROBAR SALA EN TEAMS (Estilo 3D flotante blanco con icono Teams) */}
                  <a
                    href={generalTeamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#4F52B2] border border-slate-200/90 text-xs font-bold transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-2px_0_rgba(226,232,240,0.8)] hover:shadow-[0_8px_20px_rgba(91,95,199,0.2),inset_0_1.5px_1px_rgba(255,255,255,1)] hover:-translate-y-0.5 active:translate-y-0.5 shrink-0 self-start md:self-center cursor-pointer select-none"
                  >
                    <Image 
                      src="/images/microsoft-teams.svg" 
                      alt="Teams" 
                      width={18} 
                      height={18} 
                      className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" 
                    />
                    <span>Probar Sala en Teams</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4F52B2] transition-colors ml-0.5" />
                  </a>
                </div>

                {/* Formulario de guardado rápido de URL de Teams con Input Inset 3D */}
                <form onSubmit={handleSaveGeneralTeamsUrl} className="relative z-10 pt-1 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Image 
                        src="/images/microsoft-teams.svg" 
                        alt="Teams" 
                        width={18} 
                        height={18} 
                        className="w-4 h-4 object-contain opacity-80 group-focus-within:opacity-100 transition-opacity" 
                      />
                    </div>
                    <input
                      type="url"
                      required
                      value={generalTeamsUrl}
                      onChange={(e) => setGeneralTeamsUrl(e.target.value)}
                      placeholder="https://teams.microsoft.com/l/meetup-join/..."
                      className="w-full bg-[#F8FAFC] border border-slate-300/80 focus:border-[#5B5FC7] focus:bg-white text-slate-900 placeholder-slate-400 rounded-2xl pl-11 pr-24 py-3.5 text-xs sm:text-sm font-mono outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-4 focus:ring-[#5B5FC7]/15 focus:shadow-[0_0_15px_rgba(91,95,199,0.15)] transition-all"
                    />
                    {/* Indicador de formato en el input */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B5FC7] bg-[#5B5FC7]/10 px-2.5 py-0.5 rounded-md border border-[#5B5FC7]/20">
                        Teams URL
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN 2: GUARDAR Y PUBLICAR EN AULA (3D Teams Indigo con relieve y brillo superior) */}
                  <button
                    type="submit"
                    disabled={savingTeamsUrl}
                    className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-b from-[#5B5FC7] via-[#4F52B2] to-[#3B429F] hover:from-[#6A6ED6] hover:via-[#595CBF] hover:to-[#4549A8] text-white font-black text-xs sm:text-sm tracking-wide border-t border-white/40 border-b border-indigo-950/60 shadow-[0_10px_24px_rgba(79,70,229,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4),inset_0_-3px_0_rgba(30,35,80,0.4)] hover:shadow-[0_14px_30px_rgba(91,95,199,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-300 shrink-0 cursor-pointer select-none disabled:opacity-60"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {savingTeamsUrl ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Check className="w-4 h-4 text-white group-hover:scale-110 transition-transform drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                    )}
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Guardar y Publicar en Aula</span>
                  </button>
                </form>
              </div>

              {/* Barra de Acciones del Cronograma */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Cronograma de Clases en Vivo de la Semana ({activeLevel.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Programa los temas, fechas y horarios de las sesiones sincrónicas que verán los estudiantes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewLiveClassModal}
                  className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-b from-[#1C2744] via-[#101A30] to-[#080D1A] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.8),0_10px_20px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 hover:ring-emerald-400/50 hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_12px_24px_-4px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 group select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-tight font-extrabold">Programar Nueva Clase en Vivo</span>
                </button>
              </div>

              {/* Lista de Sesiones Programadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {liveClasses.map((item) => {
                  const dt = new Date(item.scheduled_at)
                  const isValidDate = !isNaN(dt.getTime())
                  const dayName = isValidDate ? dt.toLocaleDateString('es-ES', { weekday: 'long' }) : 'Día'
                  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
                  const dateFormatted = isValidDate ? dt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''
                  const timeFormatted = isValidDate ? dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''

                  const now = new Date()
                  const isPast = isValidDate && dt.getTime() + (item.duration_minutes || 90) * 60000 < now.getTime()
                  const isToday = isValidDate && dt.toDateString() === now.toDateString()

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-3xl p-5 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
                        item.is_active || isToday
                          ? 'border-emerald-400 ring-2 ring-emerald-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#002B49] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                              {capitalizedDay} {dateFormatted}
                            </span>
                            <span className="text-xs text-slate-500 font-mono font-bold">
                              {timeFormatted} ({item.duration_minutes || 90}m)
                            </span>
                          </div>

                          <div>
                            {item.is_active ? (
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Sala Activa
                              </span>
                            ) : isPast ? (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                Dictada
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                Programada
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono truncate">
                          <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.teams_meeting_url || generalTeamsUrl}</span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <a
                          href={item.teams_meeting_url || generalTeamsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Entrar a Teams</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditLiveClass(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar sesión"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLiveClass(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )}

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
                  type="button"
                  onClick={handleOpenNewRecordingModal}
                  className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-b from-[#1C2744] via-[#101A30] to-[#080D1A] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.8),0_10px_20px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 hover:ring-amber-400/50 hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_12px_24px_-4px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 group select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-tight font-extrabold">Cargar Nueva Grabación</span>
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
          {/* SECCIÓN: GESTIÓN DE RECURSOS Y GUÍAS DIDÁCTICAS                     */}
          {/* =================================================================== */}
          {activeTab === 'materials' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Barra de Acciones de Recursos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Biblioteca de Recursos y Guías Didácticas · {activeLevel.toUpperCase()}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Sube y gestiona fichas PDF, hojas de trabajo y audios fonéticos MP3 sincronizados en vivo con los alumnos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewMaterialModal}
                  className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-b from-[#1C2744] via-[#101A30] to-[#080D1A] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.8),0_10px_20px_-4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 hover:ring-purple-400/50 hover:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_12px_24px_-4px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 group select-none"
                >
                  <div className="w-5 h-5 rounded-full bg-purple-400/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-400 group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-tight font-extrabold">Subir Nuevo Recurso</span>
                </button>
              </div>

              {/* Filtros por tipo y búsqueda */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                {/* Selector de Tipo */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setMaterialTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      materialTypeFilter === 'all'
                        ? 'bg-[#002B49] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Todos ({materials.length})
                  </button>
                  <button
                    onClick={() => setMaterialTypeFilter('pdf')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      materialTypeFilter === 'pdf'
                        ? 'bg-blue-600 text-white font-black'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Guías PDF ({pdfMaterialsCount})</span>
                  </button>
                  <button
                    onClick={() => setMaterialTypeFilter('audio')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      materialTypeFilter === 'audio'
                        ? 'bg-purple-600 text-white font-black'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audios MP3 ({audioMaterialsCount})</span>
                  </button>
                </div>

                {/* Input de Búsqueda */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={materialSearchQuery}
                    onChange={(e) => setMaterialSearchQuery(e.target.value)}
                    placeholder="Buscar por tema o título..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#002B49] bg-slate-50 focus:bg-white transition-all text-slate-800"
                  />
                  {materialSearchQuery && (
                    <button
                      onClick={() => setMaterialSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de Tarjetas de Recursos Didácticos */}
              {filteredMaterials.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-400 space-y-3">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-slate-700 font-bold text-sm">No se encontraron materiales para este filtro.</p>
                  <p className="text-xs">Sube guías didácticas o audios para que los estudiantes de {activeLevel.toUpperCase()} puedan estudiar.</p>
                  <button
                    onClick={handleOpenNewMaterialModal}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-sm hover:bg-amber-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Subir Primer Recurso</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMaterials.map((mat) => {
                    const isAudio = mat.type === 'audio'
                    const isPlaying = previewingAudioId === mat.id

                    return (
                      <div
                        key={mat.id}
                        className={`bg-white border rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all ${
                          isAudio ? 'border-purple-200/90 hover:border-purple-300' : 'border-blue-200/90 hover:border-blue-300'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isAudio 
                                  ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                                  : 'bg-blue-100 text-blue-900 border border-blue-200'
                              }`}>
                                {isAudio ? <Headphones className="w-3 h-3 text-purple-700" /> : <FileText className="w-3 h-3 text-blue-700" />}
                                <span>{isAudio ? 'AUDIO LAB MP3' : 'GUÍA DIDÁCTICA PDF'}</span>
                              </span>

                              {mat.unitTag && (
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                  {mat.unitTag}
                                </span>
                              )}
                            </div>

                            <span className="text-xs text-slate-400 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                              {mat.size}
                            </span>
                          </div>

                          {/* Título & Descripción */}
                          <div>
                            <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                              {mat.title}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {mat.description}
                            </p>
                          </div>

                          {/* Reproductor de audio preview (si es audio) */}
                          {isAudio && (
                            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleAudioPreview(mat)}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xs ${
                                    isPlaying 
                                      ? 'bg-purple-700 text-white animate-pulse' 
                                      : 'bg-purple-200 text-purple-900 hover:bg-purple-300'
                                  }`}
                                  title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                                >
                                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                </button>
                                <div>
                                  <span className="text-xs font-black text-purple-950 block">
                                    {isPlaying ? 'Reproduciendo vista previa...' : 'Vista previa de audio'}
                                  </span>
                                  <span className="text-[10px] text-purple-700 font-medium">
                                    {mat.audioSrc || mat.downloadUrl}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-1 rounded-lg">
                                MP3
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Barra de Acciones Inferior */}
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                          {/* Enlace de Descarga / Ver Archivo */}
                          <a
                            href={mat.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
                            <span>Descargar / Abrir</span>
                          </a>

                          {/* Botones de Edición y Eliminación */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditMaterial(mat)}
                              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                              title="Editar este material"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(mat.id)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Eliminar este material"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

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
          {/* =================================================================== */}
          {/* SECCIÓN 4: ESTUDIANTES MATRICULADOS & CONTROL DE ASISTENCIA         */}
          {/* =================================================================== */}
          {activeTab === 'students' && (() => {
            const baseStudents: EnrolledStudent[] = INITIAL_STUDENTS_BY_LEVEL[activeLevel] || INITIAL_STUDENTS_BY_LEVEL.a1
            const processedStudents = baseStudents
              .filter(st => {
                if (studentSearch.trim()) {
                  const query = studentSearch.toLowerCase().trim()
                  const matchesName = st.name.toLowerCase().includes(query)
                  const matchesDoc = st.doc.toLowerCase().includes(query)
                  const matchesCode = st.code.toLowerCase().includes(query)
                  const matchesEmail = st.email.toLowerCase().includes(query)
                  if (!matchesName && !matchesDoc && !matchesCode && !matchesEmail) return false
                }
                if (studentStatusFilter !== 'all') {
                  if (st.status !== studentStatusFilter) return false
                }
                return true
              })
              .sort((a, b) => {
                if (studentSort === 'alpha-asc') {
                  return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                }
                if (studentSort === 'alpha-desc') {
                  return b.name.localeCompare(a.name, 'es', { sensitivity: 'base' })
                }
                if (studentSort === 'progress-desc') {
                  return b.progress - a.progress
                }
                if (studentSort === 'progress-asc') {
                  return a.progress - b.progress
                }
                if (studentSort === 'grade-desc') {
                  const gradeA = parseFloat(a.avg) || 0
                  const gradeB = parseFloat(b.avg) || 0
                  return gradeB - gradeA
                }
                return 0
              })

            const countActivos = baseStudents.filter(s => s.status === 'Activo').length
            const countAlDia = baseStudents.filter(s => s.status === 'Al día').length
            const countPendientes = baseStudents.filter(s => s.status === 'Pendiente').length

            const handleExportAttendance = () => {
              const headers = ['N°', 'Nombre Completo', 'Código', 'Documento', 'Correo', 'Teléfono', 'Progreso', 'Promedio', 'Estado']
              const rows = processedStudents.map((s, idx) => [
                idx + 1,
                `"${s.name}"`,
                `"${s.code}"`,
                `"${s.doc}"`,
                `"${s.email}"`,
                `"${s.phone || 'N/A'}"`,
                `"${s.progress}%"`,
                `"${s.avg}"`,
                `"${s.status}"`
              ])
              const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
                [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', encodedUri)
              link.setAttribute('download', `Planilla_Estudiantes_${activeLevel.toUpperCase()}_2026.csv`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              showNotification('¡Planilla de asistencia descargada en formato Excel/CSV!')
            }

            return (
              <div className="space-y-5 animate-fadeIn">
                
                {/* 1. Tarjeta de Cabecera y Resumen de Matrícula */}
                <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Estudiantes Matriculados en {LEVEL_CONFIGURATIONS[activeLevel]?.title || activeLevel.toUpperCase()}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Periodo 2026-I · Lista indexada para seguimiento pedagógico, calificaciones y pase de asistencia.
                    </p>
                  </div>

                  {/* Botón de Exportar Planilla para el Profesor */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <button
                      type="button"
                      onClick={handleExportAttendance}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                      title="Descargar lista oficial de estudiantes en Excel/CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Planilla de Asistencia (Excel)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Barra de Herramientas: Buscador, Orden Alfabético, Filtros y Selector de Vista (Dual Toggle) */}
                <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    
                    {/* Buscador Rápido por Nombre, Doc, Código o Correo */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Buscar por nombre, documento o código ADE..."
                        className="w-full pl-9 pr-8 py-2 border border-slate-200 focus:border-[#002B49] rounded-xl text-xs font-medium text-slate-900 outline-none bg-slate-50/50 focus:bg-white transition-all"
                      />
                      {studentSearch && (
                        <button
                          type="button"
                          onClick={() => setStudentSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Selector de Orden Alfabético y Métricas */}
                    <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Ordenar:</span>
                        <select
                          value={studentSort}
                          onChange={(e: any) => setStudentSort(e.target.value)}
                          className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                        >
                          <option value="alpha-asc">🔤 Nombre (A - Z)</option>
                          <option value="alpha-desc">🔤 Nombre (Z - A)</option>
                          <option value="progress-desc">📈 Mayor Progreso (%)</option>
                          <option value="progress-asc">⚠️ Menor Progreso (Riesgo)</option>
                          <option value="grade-desc">⭐ Mejor Promedio</option>
                        </select>
                      </div>

                      {/* CONMUTADOR DUAL DE VISTA: BOTÓN 4 CUADRITOS (GRID) Y BOTÓN RAYITAS (LIST) */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {/* Botón 4 Cuadritos (Cards Grid) */}
                        <button
                          type="button"
                          onClick={() => setStudentViewMode('grid')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            studentViewMode === 'grid'
                              ? 'bg-[#002B49] text-amber-400 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Vista en Tarjetas"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Tarjetas</span>
                        </button>

                        {/* Botón Rayitas (Lista / Tabla) */}
                        <button
                          type="button"
                          onClick={() => setStudentViewMode('list')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            studentViewMode === 'list'
                              ? 'bg-[#002B49] text-amber-400 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Vista en Lista / Planilla"
                        >
                          <List className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Lista</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Píldoras de Filtro Rápido por Estado */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Filtrar:</span>
                    
                    <button
                      type="button"
                      onClick={() => setStudentStatusFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        studentStatusFilter === 'all'
                          ? 'bg-[#002B49] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Todos ({baseStudents.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatusFilter('Activo')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        studentStatusFilter === 'Activo'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                      }`}
                    >
                      ● Activos ({countActivos})
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatusFilter('Al día')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        studentStatusFilter === 'Al día'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
                      }`}
                    >
                      ● Al día ({countAlDia})
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentStatusFilter('Pendiente')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        studentStatusFilter === 'Pendiente'
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                      }`}
                    >
                      ● Pendientes ({countPendientes})
                    </button>
                  </div>

                </div>

                {/* 3. VISTA EN LISTA / TABLA ACADÉMICA (IDEAL PARA 30-40+ ALUMNOS EN PANTALLA) */}
                {studentViewMode === 'list' && (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="py-3 px-3 w-10 text-center font-mono">#</th>
                            <th className="py-3 px-4">Estudiante</th>
                            <th className="py-3 px-4">Identificación</th>
                            <th className="py-3 px-4">Correo Institucional</th>
                            <th className="py-3 px-4 text-center">Progreso</th>
                            <th className="py-3 px-4 text-center">Promedio</th>
                            <th className="py-3 px-4 text-center">Estado</th>
                            <th className="py-3 px-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {processedStudents.length > 0 ? (
                            processedStudents.map((st, idx) => (
                              <tr 
                                key={st.code || idx}
                                className="hover:bg-slate-50/80 transition-colors group"
                              >
                                {/* Número de orden alfabético */}
                                <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 text-[11px]">
                                  {idx + 1}
                                </td>

                                {/* Nombre y Código */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">
                                    {(() => {
                                      const avatarSrc = st.avatarUrl || studentCloudAvatars[st.email?.toLowerCase()] || studentCloudAvatars[st.doc] || studentCloudAvatars[st.doc?.replace(/\./g, '')]
                                      return (
                                        <div className="w-8 h-8 rounded-xl bg-[#002B49] text-amber-400 font-bold text-[11px] flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200">
                                          {avatarSrc ? (
                                            <img src={avatarSrc} alt={st.name} className="w-full h-full object-cover" />
                                          ) : (
                                            st.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                                          )}
                                        </div>
                                      )
                                    })()}
                                    <div className="min-w-0">
                                      <strong className="text-xs font-black text-slate-900 block truncate group-hover:text-blue-900 transition-colors">
                                        {st.name}
                                      </strong>
                                      <span className="text-[10px] font-mono text-slate-400 block">
                                        {st.code}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Documento */}
                                <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                                  {st.doc}
                                </td>

                                {/* Correo */}
                                <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                                  <a 
                                    href={`mailto:${st.email}`}
                                    className="hover:text-blue-700 hover:underline truncate block max-w-[190px]"
                                    title={st.email}
                                  >
                                    {st.email}
                                  </a>
                                </td>

                                {/* Progreso */}
                                <td className="py-3 px-4 text-center">
                                  <div className="inline-flex flex-col items-center gap-1 w-24">
                                    <span className="text-[11px] font-bold text-slate-800">{st.progress}%</span>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${
                                          st.progress >= 75 ? 'bg-emerald-500' :
                                          st.progress >= 50 ? 'bg-amber-400' :
                                          'bg-rose-500'
                                        }`} 
                                        style={{ width: `${st.progress}%` }} 
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Promedio */}
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-slate-100 text-slate-800">
                                    {st.avg}
                                  </span>
                                </td>

                                {/* Estado */}
                                <td className="py-3 px-4 text-center">
                                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                    st.status === 'Activo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    st.status === 'Al día' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                    'bg-amber-100 text-amber-800 border border-amber-200'
                                  }`}>
                                    {st.status}
                                  </span>
                                </td>

                                {/* Acciones del Docente */}
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1">
                                    {/* Contacto WhatsApp */}
                                    <a
                                      href={`https://wa.me/${(st.phone || '573000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${st.name}, te escribe tu docente de American Dream English para hacer seguimiento a tu avance en el nivel ${activeLevel.toUpperCase()}.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                      title="Escribir por WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>

                                    {/* Contacto Correo */}
                                    <a
                                      href={`mailto:${st.email}?subject=${encodeURIComponent(`Seguimiento Académico ADE Nivel ${activeLevel.toUpperCase()}`)}`}
                                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                      title="Enviar correo"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                    </a>

                                    {/* Ver Ficha Pedagógica */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenStudentDetail(st)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#002B49] hover:bg-[#001f35] text-amber-400 rounded-lg text-[11px] font-bold shadow-2xs transition-all ml-1 cursor-pointer"
                                      title="Ver ficha académica y observaciones pedagógicas"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Ficha</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-xs text-slate-400 font-medium">
                                No se encontraron estudiantes que coincidan con la búsqueda.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. VISTA EN TARJETAS (CARDS GRID) */}
                {studentViewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                    {processedStudents.length > 0 ? (
                      processedStudents.map((st, i) => (
                        <div 
                          key={st.code || i} 
                          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {(() => {
                                  const avatarSrc = st.avatarUrl || studentCloudAvatars[st.email?.toLowerCase()] || studentCloudAvatars[st.doc] || studentCloudAvatars[st.doc?.replace(/\./g, '')]
                                  return (
                                    <div className="w-10 h-10 rounded-2xl bg-[#002B49] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200">
                                      {avatarSrc ? (
                                        <img src={avatarSrc} alt={st.name} className="w-full h-full object-cover" />
                                      ) : (
                                        st.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                                      )}
                                    </div>
                                  )
                                })()}
                                <div className="overflow-hidden">
                                  <strong className="text-xs font-bold text-slate-900 block truncate">{st.name}</strong>
                                  <span className="text-[10px] font-mono text-slate-400">{st.code}</span>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                st.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' :
                                st.status === 'Al día' ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {st.status}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500 font-medium space-y-1 mt-3">
                              <div className="flex justify-between">
                                <span>Documento:</span>
                                <strong className="text-slate-700">{st.doc}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Correo:</span>
                                <span className="text-slate-600 truncate max-w-[170px]" title={st.email}>{st.email}</span>
                              </div>
                              {st.phone && (
                                <div className="flex justify-between">
                                  <span>Teléfono:</span>
                                  <span className="text-slate-600 font-mono text-[10px]">{st.phone}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5 pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
                              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                                <span>Progreso Curso:</span>
                                <strong className="text-slate-800 font-bold">{st.progress}%</strong>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    st.progress >= 75 ? 'bg-emerald-500' :
                                    st.progress >= 50 ? 'bg-amber-400' :
                                    'bg-rose-500'
                                  }`} 
                                  style={{ width: `${st.progress}%` }} 
                                />
                              </div>
                              <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                                <span>Promedio Acumulado:</span>
                                <strong className="text-emerald-700 font-bold">{st.avg}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Acciones al pie de la tarjeta */}
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <a
                                href={`https://wa.me/${(st.phone || '573000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${st.name}, te escribe tu docente de American Dream English respecto a tu proceso en el nivel ${activeLevel.toUpperCase()}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold border border-emerald-200/60 transition-all"
                                title="Enviar mensaje de WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>

                              <a
                                href={`mailto:${st.email}`}
                                className="p-1.5 rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all"
                                title="Enviar correo institucional"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenStudentDetail(st)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-[#002B49] hover:bg-[#001f35] text-amber-400 rounded-xl text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ver Ficha</span>
                            </button>
                          </div>

                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center text-xs text-slate-400 font-medium bg-white rounded-3xl border border-slate-200">
                        No se encontraron estudiantes que coincidan con los criterios de búsqueda.
                      </div>
                    )}
                  </div>
                )}

              </div>
            )
          })()}

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

      {/* ======================================================================= */}
      {/* MODAL 3: SUBIR / EDITAR RECURSO DIDÁCTICO (PDF O AUDIO MP3)             */}
      {/* ======================================================================= */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 text-slate-800 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                  materialForm.type === 'audio' ? 'bg-purple-600' : 'bg-[#002B49]'
                }`}>
                  {materialForm.type === 'audio' ? <Headphones className="w-5 h-5 text-purple-200" /> : <FileText className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingMaterial ? 'Editar Recurso Didáctico' : 'Subir Nuevo Recurso Didáctico'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Nivel {activeLevel.toUpperCase()} · Periodo 2026-I</p>
                </div>
              </div>

              <button
                onClick={() => setShowMaterialModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs font-bold">
              
              {/* Selector de Tipo: PDF vs Audio */}
              <div>
                <label className="text-slate-700 block mb-1.5">Tipo de Recurso</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMaterialForm({ ...materialForm, type: 'pdf', size: materialForm.size.includes('MB') ? materialForm.size : '2.5 MB' })}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-black ${
                      materialForm.type === 'pdf'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Guía Didáctica (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMaterialForm({ ...materialForm, type: 'audio', size: materialForm.size.includes('MB') ? materialForm.size : '8.5 MB' })}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-black ${
                      materialForm.type === 'audio'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Headphones className="w-4 h-4" />
                    <span>Audio Lab (MP3)</span>
                  </button>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="text-slate-700 block mb-1">Título del Material</label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder={materialForm.type === 'audio' ? 'Ej: Audio Lab 05: Airport Dialogues & Fast Speech (MP3)' : 'Ej: Guía Práctica 04: Present Perfect & Time Prepositions (PDF)'}
                  className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium text-slate-900"
                />
              </div>

              {/* Unidad / Tag y Tamaño */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Unidad o Etiqueta Temática</label>
                  <input
                    type="text"
                    required
                    value={materialForm.unitTag}
                    onChange={(e) => setMaterialForm({ ...materialForm, unitTag: e.target.value })}
                    placeholder="Ej: Unidad 1 · Gramática"
                    className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Tamaño Estimado del Archivo</label>
                  <input
                    type="text"
                    required
                    value={materialForm.size}
                    onChange={(e) => setMaterialForm({ ...materialForm, size: e.target.value })}
                    placeholder="Ej: 3.4 MB"
                    className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* SECCIÓN ESPECÍFICA SEGÚN TIPO: PDF (CARGA DESDE PC O ENLACE) VS AUDIO (DRIVE / ONEDRIVE) */}
              {materialForm.type === 'pdf' ? (
                <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-800 block text-xs font-bold">
                      Origen de la Guía PDF
                    </label>
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPdfSourceMode('file')}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all ${
                          pdfSourceMode === 'file' 
                            ? 'bg-blue-600 text-white shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        📁 Cargar desde mi PC
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfSourceMode('url')}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all ${
                          pdfSourceMode === 'url' 
                            ? 'bg-blue-600 text-white shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        🔗 Enlace Web / Drive
                      </button>
                    </div>
                  </div>

                  {pdfSourceMode === 'file' ? (
                    <div>
                      <label 
                        htmlFor="pdf-file-upload" 
                        className="cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center group shadow-2xs"
                      >
                        <input
                          id="pdf-file-upload"
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfFileSelect}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        {selectedPdfFile ? (
                          <div>
                            <span className="text-xs font-black text-blue-900 block truncate max-w-xs">
                              ✓ {selectedPdfFile.name}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              {(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB · Listo para publicar
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="text-xs font-black text-slate-800 block">
                              Haz clic para seleccionar el PDF de tu computador
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold block">
                              Archivos .pdf de hasta 5 MB
                            </span>
                            <span className="text-[9.5px] text-blue-600 font-medium block">
                              💡 Si pesa más de 5 MB, súbelo a Google Drive / OneDrive y usa la pestaña "Enlace Web / Drive"
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-700 block text-xs font-bold">
                          Enlace a la Guía PDF (Google Drive, OneDrive o enlace directo)
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Sin límite (Recomendado &gt; 5 MB)
                        </span>
                      </div>
                      <input
                        type="url"
                        value={materialForm.downloadUrl}
                        onChange={(e) => setMaterialForm({ ...materialForm, downloadUrl: e.target.value })}
                        placeholder="https://drive.google.com/... o https://onedrive.live.com/..."
                        className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium font-mono text-slate-900 text-xs bg-white"
                      />
                      <p className="text-[10px] text-slate-500">
                        💡 Sube el archivo a Google Drive o OneDrive con acceso público ("Cualquier persona con el enlace") y pega la URL aquí.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs text-purple-950 font-black block">
                          Alojamiento en la Nube (Google Drive / OneDrive)
                        </strong>
                        <p className="text-[11px] text-purple-900/80 font-medium leading-relaxed">
                          Pega el enlace de compartir de tu audio. El reproductor del aula lo transformará automáticamente para que tus alumnos lo escuchen sin límites.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCloudGuide(!showCloudGuide)}
                      className="text-[10px] font-black text-purple-700 hover:text-purple-900 underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>{showCloudGuide ? '▲ Ocultar ayuda' : '💡 ¿Cómo sacar el enlace en Google Drive / OneDrive en 3 pasos?'}</span>
                    </button>

                    {showCloudGuide && (
                      <div className="bg-white p-3 rounded-xl border border-purple-200 text-[10px] text-slate-700 space-y-1.5 animate-fadeIn">
                        <p><strong>Paso 1:</strong> Sube tu audio (.mp3) a tu Google Drive o OneDrive.</p>
                        <p><strong>Paso 2:</strong> Clic derecho &rarr; <em>Compartir</em> &rarr; Acceso general: <em>"Cualquier persona con el enlace"</em>.</p>
                        <p><strong>Paso 3:</strong> Copia el enlace y pégalo abajo. ¡La plataforma lo reproducirá en vivo en el aula!</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-700 block mb-1">
                      Enlace de Audio (Google Drive, OneDrive, MP3 directo)
                    </label>
                    <input
                      type="url"
                      required
                      value={materialForm.audioSrc || materialForm.downloadUrl}
                      onChange={(e) => {
                        const val = e.target.value
                        setMaterialForm({ 
                          ...materialForm, 
                          audioSrc: val, 
                          downloadUrl: val 
                        })
                      }}
                      placeholder="https://drive.google.com/file/d/... o https://...audio.mp3"
                      className="w-full p-3 border border-purple-300 focus:border-purple-600 rounded-xl outline-none font-medium font-mono text-purple-950 text-xs bg-purple-50/20"
                    />
                  </div>
                </div>
              )}

              {/* Descripción Pedagógica */}
              <div>
                <label className="text-slate-700 block mb-1">
                  Descripción Pedagógica e Instrucciones para el Estudiante
                </label>
                <textarea
                  rows={3}
                  required
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  placeholder="Explica qué ejercicios resolver, o qué pista fonética escuchar antes de la sesión sincrónica..."
                  className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-xl outline-none font-medium text-slate-900 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pdfUploadLoading}
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001f35] disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{pdfUploadLoading ? 'Subiendo archivo...' : editingMaterial ? 'Guardar Cambios' : 'Publicar Recurso'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: PROGRAMAR / EDITAR CLASE EN VIVO (MICROSOFT TEAMS)           */}
      {/* =================================================================== */}
      {showLiveClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingLiveClass ? 'Editar Clase Sincrónica' : 'Programar Nueva Clase Sincrónica'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Nivel {activeLevel.toUpperCase()} · Microsoft Teams en Vivo
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveClassModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLiveClass} className="space-y-4 text-xs font-bold text-slate-700">
              
              {/* Título de la clase */}
              <div>
                <label className="text-slate-700 block mb-1">
                  Título de la Clase / Sesión <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={liveClassForm.title}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, title: e.target.value })}
                  placeholder="Ej: Masterclass: Fluidez Conversacional & Phrasal Verbs"
                  className="w-full p-3 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900 bg-white"
                />
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">
                    Fecha de la Clase <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={liveClassForm.scheduledDate}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, scheduledDate: e.target.value })}
                      className="w-full p-3 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">
                    Hora de Inicio (Hora Colombia / COT) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={liveClassForm.scheduledTime}
                      onChange={(e) => setLiveClassForm({ ...liveClassForm, scheduledTime: e.target.value })}
                      className="w-full p-3 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Duración */}
              <div>
                <label className="text-slate-700 block mb-1">
                  Duración Estimada
                </label>
                <select
                  value={liveClassForm.durationMinutes}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, durationMinutes: Number(e.target.value) })}
                  className="w-full p-3 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900 bg-white"
                >
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora (60 minutos)</option>
                  <option value={90}>1 hora y 30 minutos (90 minutos)</option>
                  <option value={120}>2 horas (120 minutos)</option>
                </select>
              </div>

              {/* Enlace de Microsoft Teams */}
              <div>
                <label className="text-slate-700 block mb-1">
                  Enlace de Reunión Microsoft Teams
                </label>
                <input
                  type="url"
                  value={liveClassForm.teamsMeetingUrl}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, teamsMeetingUrl: e.target.value })}
                  placeholder="https://teams.microsoft.com/l/meetup-join/..."
                  className="w-full p-3 border border-slate-300 focus:border-emerald-600 rounded-xl outline-none font-medium font-mono text-slate-900 text-xs bg-white"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 Si se deja igual a la sala general, todos los estudiantes accederán a la misma sala recurrente del nivel.
                </p>
              </div>

              {/* Estado Activo */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Sesión Activa en el Aula</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Visible de inmediato en el cronograma semanal del estudiante</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={liveClassForm.isActive}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLiveClassModal(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>{editingLiveClass ? 'Guardar Cambios' : 'Agendar Clase en Vivo'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: FICHA PEDAGÓGICA Y OBSERVACIONES DEL DOCENTE                  */}
      {/* =================================================================== */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scaleUp text-slate-800">
            
            {/* Cabecera del Estudiante */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {(() => {
                  const modalAvatar = selectedStudentDetail.avatarUrl || studentCloudAvatars[selectedStudentDetail.email?.toLowerCase()] || studentCloudAvatars[selectedStudentDetail.doc] || studentCloudAvatars[selectedStudentDetail.doc?.replace(/\./g, '')]
                  return (
                    <div className="w-12 h-12 rounded-2xl bg-[#002B49] text-amber-400 font-black text-sm flex items-center justify-center shadow-sm overflow-hidden ring-1 ring-slate-200">
                      {modalAvatar ? (
                        <img src={modalAvatar} alt={selectedStudentDetail.name} className="w-full h-full object-cover" />
                      ) : (
                        selectedStudentDetail.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                      )}
                    </div>
                  )
                })()}
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {selectedStudentDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {selectedStudentDetail.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">
                      Nivel {activeLevel.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedStudentDetail.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' :
                      selectedStudentDetail.status === 'Al día' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedStudentDetail.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Datos Personales y Académicos */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Documento</span>
                <strong className="text-slate-800 block">{selectedStudentDetail.doc}</strong>
                <span className="text-[10px] text-slate-400 block">{selectedStudentDetail.phone || '+57 300 000 0000'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Rendimiento</span>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Progreso:</span>
                  <strong className="text-slate-900 font-bold">{selectedStudentDetail.progress}%</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Promedio:</span>
                  <strong className="text-emerald-700 font-bold">{selectedStudentDetail.avg}</strong>
                </div>
              </div>
            </div>

            {/* Observación Pedagógica Privada del Tutor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  Bitácora Pedagógica Privada (Notas del Docente)
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Visible sólo para ti</span>
              </div>
              <textarea
                rows={3}
                value={currentNoteInput}
                onChange={(e) => setCurrentNoteInput(e.target.value)}
                placeholder="Anota observaciones de pronunciación, participación en sala Teams o áreas a reforzar para este alumno..."
                className="w-full p-3 border border-slate-300 focus:border-[#002B49] rounded-2xl outline-none font-medium text-slate-900 text-xs bg-slate-50/50 leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={savingNote}
                  onClick={() => handleSaveStudentNote(selectedStudentDetail.code)}
                  className="px-3.5 py-1.5 bg-[#002B49] hover:bg-[#001f35] text-amber-400 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingNote ? 'Guardando...' : 'Guardar Observación'}</span>
                </button>
              </div>
            </div>

            {/* Canales de Contacto Directo */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(selectedStudentDetail.phone || '573000000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${selectedStudentDetail.name}, te escribe tu docente de American Dream English para hacer seguimiento a tus actividades en el nivel ${activeLevel.toUpperCase()}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${selectedStudentDetail.email}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Correo</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reproductor de Audio Oculto para vista previa en el portal docente */}
      <audio 
        ref={previewAudioRef} 
        onEnded={() => setPreviewingAudioId(null)} 
        onError={() => setPreviewingAudioId(null)}
        className="hidden" 
      />

    </div>
  )
}
