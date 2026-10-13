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
  ArrowUpRight,
  Headphones,
  Download,
  Pause,
  Music,
  FolderPlus,
  UploadCloud
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
  const [activeTab, setActiveTab] = useState<'recordings' | 'materials' | 'grading' | 'forum' | 'students'>('recordings')

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

      // Sincronizar en Supabase si la tabla classes existe
      try {
        await supabase
          .from('classes')
          .update({
            title: recordingForm.title,
            meeting_link: recordingForm.videoUrl,
            status: 'completed'
          })
          .eq('title', recordingForm.title)
      } catch (e) {
        console.warn('Nota Supabase classes update:', e)
      }

      showNotification(`¡Clase grabada de ${activeLevel.toUpperCase()} actualizada con éxito!`)
    } else {
      // Crear nueva
      const newRec: TeacherRecordedSession = {
        id: `rec-${activeLevel}-${Date.now()}`,
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

      // Insertar en Supabase tabla 'classes'
      try {
        await supabase
          .from('classes')
          .insert([{
            title: newRec.title,
            meeting_link: newRec.videoUrl,
            status: 'completed',
            location: 'Microsoft Teams',
            scheduled_at: new Date().toISOString()
          }])
      } catch (e) {
        console.warn('Nota Supabase classes insert:', e)
      }

      showNotification(`¡Nueva grabación de Teams publicada en el aula de ${activeLevel.toUpperCase()}!`)
    }

    setShowRecordingModal(false)
  }

  const handleDeleteRecording = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta grabación? Los alumnos ya no podrán verla en su aula.')) {
      const updated = recordings.filter(r => r.id !== id)
      setRecordings(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_recordings_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_recordings_updated', { detail: { level: activeLevel } }))
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

  const handleDeleteMaterial = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso didáctico? Los estudiantes ya no podrán descargarlo ni escucharlo en su aula.')) {
      const updated = materials.filter(m => m.id !== id)
      setMaterials(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`ade_teacher_materials_${activeLevel}`, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('ade_materials_updated', { detail: { level: activeLevel } }))
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
          const fileExt = selectedPdfFile.name.split('.').pop() || 'pdf'
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

      // Sincronizar en Supabase tabla course_materials
      try {
        await supabase
          .from('course_materials')
          .update({
            title: materialForm.title.trim(),
            file_url: finalDownloadUrl,
            type: materialForm.type,
            description: materialForm.description.trim()
          })
          .eq('title', materialForm.title.trim())
      } catch (e) {
        console.warn('Nota Supabase course_materials update:', e)
      }

      showNotification('¡Recurso didáctico actualizado y sincronizado!')
    } else {
      const newMaterial: TeacherStudyMaterial = {
        id: `mat-${activeLevel}-${Date.now()}`,
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

      // Insertar en Supabase tabla course_materials
      try {
        await supabase
          .from('course_materials')
          .insert([{
            title: newMaterial.title,
            file_url: finalDownloadUrl,
            type: newMaterial.type,
            description: newMaterial.description
          }])
      } catch (e) {
        console.warn('Nota Supabase course_materials insert:', e)
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

          <div className="px-4 sm:px-8 space-y-5">
          
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
                title={`Abrir vista de estudiante para el nivel ${activeLevel.toUpperCase()}`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver Aula {activeLevel.toUpperCase()}</span>
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
                  {LEVEL_CONFIGURATIONS[activeLevel]?.title || `English Level ${activeLevel.toUpperCase()}`} ({activeLevel.toUpperCase()}) - Periodo 2026-I
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>{recordings.length}</strong> Clases Subidas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-purple-400" />
                <span><strong>{materials.length}</strong> Recursos Didácticos</span>
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

          {/* TRANSICIÓN DE ONDA ORGÁNICA CONTINUA */}
          <div className="w-full overflow-hidden leading-none -mb-1 select-none pointer-events-none">
            <svg 
              viewBox="0 0 1440 100" 
              preserveAspectRatio="none" 
              className="w-full h-10 sm:h-14 text-white fill-current block"
            >
              <path d="M0,0 C320,85 520,95 760,50 C1020,10 1240,75 1440,85 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* 2. SUPERFICIE BLANCA CONTINUA UNIFICADA (BG-WHITE)                      */}
        {/* ======================================================================= */}
        <main className="w-full bg-white text-slate-800 flex-1 p-5 sm:p-7 md:p-8 space-y-6">
          
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

            {/* Tab 2: Recursos & Guías Didácticas */}
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                activeTab === 'materials'
                  ? 'bg-[#002B49] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-4 h-4 text-purple-400" />
              <span>Recursos & Guías Didácticas</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                activeTab === 'materials' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {materials.length}
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
                  onClick={handleOpenNewMaterialModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#002B49] hover:bg-[#001f35] text-white rounded-2xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Subir Nuevo Recurso</span>
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
          {activeTab === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Estudiantes Matriculados en {LEVEL_CONFIGURATIONS[activeLevel]?.title || activeLevel.toUpperCase()} (Periodo 2026-I)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Seguimiento individual de avance y estado de actividades para {activeLevel.toUpperCase()}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(INITIAL_STUDENTS_BY_LEVEL[activeLevel] || INITIAL_STUDENTS_BY_LEVEL.a1).map((st, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#002B49] text-amber-400 font-bold text-xs flex items-center justify-center">
                          {st.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
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

                    <div className="text-[11px] text-slate-500 font-medium space-y-1">
                      <div className="flex justify-between">
                        <span>Documento:</span>
                        <strong className="text-slate-700">{st.doc}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Correo:</span>
                        <span className="text-slate-600 truncate max-w-[170px]" title={st.email}>{st.email}</span>
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
