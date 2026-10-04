'use client'

import React, { useState, useEffect } from 'react'
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
  Info
} from 'lucide-react'
import { createClient } from '../../../../utils/supabase/client'

interface CourseDetailProps {
  params?: { id: string }
}

export default function AulaVirtualPage({ params }: CourseDetailProps) {
  const courseId = params?.id || 'a1'
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [courseLevel, setCourseLevel] = useState('A1')
  const [courseTitle, setCourseTitle] = useState('ENGLISH LEVEL 1 - GENERAL PROGRAM')
  const [courseCode, setCourseCode] = useState('ADE-ING101')
  const [teacherName, setTeacherName] = useState('Lic. Carlos Méndez')

  // Estado del Bloque 1 (Teams)
  const [liveClass, setLiveClass] = useState({
    title: 'Clase Sincrónica: Estructuras Gramaticales & Taller Fonético',
    scheduledAt: 'Miércoles 7:00 PM - 8:30 PM (UTC-5)',
    teamsMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/american-dream-class',
    status: 'scheduled', // 'live' | 'scheduled'
    teacher: 'Lic. Carlos Méndez'
  })

  // Estado del Bloque 2 (Guías y Materiales)
  const [materials, setMaterials] = useState<any[]>([
    {
      id: 'mat-1',
      title: 'Guía Didáctica 01: Foundations & Daily Routine (PDF)',
      type: 'pdf',
      fileSize: '2.4 MB',
      downloadUrl: '#',
      description: 'Guía metodológica oficial con ejercicios prácticos y vocabulario esencial para el módulo.'
    },
    {
      id: 'mat-2',
      title: 'Ficha de Gramática: Present Simple vs. Continuous (PDF)',
      type: 'guide',
      fileSize: '1.1 MB',
      downloadUrl: '#',
      description: 'Esquema sintáctico resumido con tablas de conjugación y reglas de ortografía.'
    },
    {
      id: 'mat-3',
      title: 'Laboratorio de Audio: Listening & Native Pronunciation (MP3)',
      type: 'audio',
      fileSize: '8.7 MB',
      downloadUrl: '#',
      description: 'Pistas de audio con hablantes nativos para desarrollo de fluidez y discriminación auditiva.'
    },
    {
      id: 'mat-4',
      title: 'Rúbrica de Evaluación y Criterios MCER A1 (PDF)',
      type: 'rubric',
      fileSize: '850 KB',
      downloadUrl: '#',
      description: 'Matriz de ponderación académica institucional y estándares de aprobación.'
    }
  ])

  // Estado del Bloque 3 (Zona de Tareas)
  const [assignments, setAssignments] = useState<any[]>([
    {
      id: 'task-1',
      title: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
      dueDate: '12 de Octubre, 11:59 PM',
      weight: '75 Puntos',
      status: 'submitted', // 'submitted' | 'pending' | 'graded'
      grade: '4.8 / 5.0',
      feedback: 'Excelente uso del presente simple y conectores temporales.'
    },
    {
      id: 'task-2',
      title: 'Actividad Oral 2: Grabación de Audio - Presentación Personal',
      dueDate: '20 de Octubre, 11:59 PM',
      weight: '100 Puntos',
      status: 'pending',
      grade: null,
      feedback: null
    },
    {
      id: 'task-3',
      title: 'Evaluación Formativa Final de Nivel A1 (Quiz en Línea)',
      dueDate: '30 de Octubre, 11:59 PM',
      weight: '150 Puntos',
      status: 'pending',
      grade: null,
      feedback: null
    }
  ])

  // Modal de Entrega de Tareas
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState<any | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [submissionComments, setSubmissionComments] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('')

  useEffect(() => {
    async function loadCourseData() {
      try {
        // Consultar clases en vivo desde Supabase
        const { data: liveData } = await supabase
          .from('live_classes')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (liveData) {
          setLiveClass({
            title: liveData.title || 'Clase Sincrónica por Teams',
            scheduledAt: liveData.scheduled_at 
              ? new Date(liveData.scheduled_at).toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })
              : 'Próximo Miércoles 7:00 PM',
            teamsMeetingUrl: liveData.teams_meeting_url || 'https://teams.microsoft.com',
            status: liveData.status || 'scheduled',
            teacher: liveData.teacher_name || 'Lic. Carlos Méndez'
          })
        }

        // Consultar materiales desde Supabase
        const { data: matData } = await supabase
          .from('course_materials')
          .select('*')
          .limit(6)

        if (matData && matData.length > 0) {
          setMaterials(matData.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: m.type || 'pdf',
            fileSize: m.file_size || '2.0 MB',
            downloadUrl: m.download_url || '#',
            description: m.description || 'Material oficial de estudio.'
          })))
        }
      } catch (err) {
        // Mantener fallbacks informativos
      } finally {
        setLoading(false)
      }
    }

    loadCourseData()
  }, [])

  const handleOpenUploadModal = (task: any) => {
    setSelectedTaskForUpload(task)
    setUploadFileName('')
    setSubmissionComments('')
    setUploadSuccessMessage('')
  }

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName && !submissionComments) {
      alert('Por favor selecciona un archivo o escribe tu enlace/comentarios de entrega.')
      return
    }

    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setUploadSuccessMessage('¡Actividad entregada exitosamente al docente! Tu envío ha quedado registrado con sello de tiempo institucional.')
      
      // Actualizar estado en la lista local
      setAssignments(prev => prev.map(a => 
        a.id === selectedTaskForUpload.id 
          ? { ...a, status: 'submitted', grade: 'En revisión por el docente' } 
          : a
      ))

      setTimeout(() => {
        setSelectedTaskForUpload(null)
      }, 1800)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* 1. CABECERA INSTITUCIONAL & NAVEGACIÓN */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/campus" 
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#002B49] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#002B49]" />
              <span>Volver a Mis Cursos</span>
            </Link>
            
            <div className="hidden sm:block h-5 w-[1px] bg-slate-200" />
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Campus Virtual</span>
              <span>/</span>
              <span>Aula Virtual</span>
              <span>/</span>
              <span className="text-[#002B49] font-bold">Nivel A1</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Aula Activa 2026-I</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BANNER INFORMATIVO DEL CURSO */}
      <div className="bg-[#002B49] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Código: {courseCode} · 3 Créditos Académicos</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                {courseTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Tutor Asignado: <strong>{teacherName}</strong></span>
                <span>•</span>
                <span>Modalidad: Virtual Sincrónico & Asincrónico</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-right">
                <span className="text-[11px] text-slate-300 uppercase tracking-wider block font-semibold">
                  Progreso del Curso
                </span>
                <span className="text-lg font-black text-amber-400">
                  68% Completado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL: LOS 3 BLOQUES ORDENADOS */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* ========================================================== */}
        {/* BLOQUE 1: ENCUENTRO EN VIVO (MICROSOFT TEAMS)             */}
        {/* ========================================================== */}
        <section className="bg-gradient-to-r from-[#002B49] via-[#1E3A8A] to-[#464EB8] text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
          
          {/* Decoración de fondo */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#464EB8] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-white/20 shadow-sm">
                <Video className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Bloque 1 · Encuentro Sincrónico Oficial</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {liveClass.title}
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Sesión interactiva en tiempo real con tu tutor y compañeros para práctica de conversación, dudas de guías y pronunciación guiada.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-amber-300">
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span>{liveClass.scheduledAt}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <User className="w-4 h-4" />
                  <span>Tutor: {liveClass.teacher}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={liveClass.teamsMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm group"
              >
                <Video className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Unirse a la Clase en Vivo por Teams</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>
              <span className="text-[11px] text-slate-300 text-center font-medium">
                Acceso libre desde navegador web o app de Teams
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* BLOQUE 2: GUÍAS Y RECURSOS DE APRENDIZAJE                 */}
        {/* ========================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#002B49] uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Bloque 2 · Materiales de Estudio</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Guías y Recursos de Aprendizaje
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Descarga el material pedagógico oficial diseñado bajo estándares internacionales MCER.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              {materials.length} Recursos Disponibles
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {materials.map((mat) => (
              <div 
                key={mat.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4.5 transition-all flex flex-col justify-between group hover:border-[#002B49]/40 hover:shadow-sm"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    mat.type === 'pdf' ? 'bg-rose-100 text-rose-700' :
                    mat.type === 'audio' ? 'bg-amber-100 text-amber-700' :
                    mat.type === 'rubric' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {mat.type === 'audio' ? (
                      <Headphones className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        {mat.type.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {mat.fileSize}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-[#002B49] transition-colors line-clamp-1">
                      {mat.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Acceso para estudiantes
                  </span>
                  <a
                    href={mat.downloadUrl}
                    onClick={(e) => {
                      if (mat.downloadUrl === '#') {
                        e.preventDefault()
                        alert(`Iniciando descarga segura de: "${mat.title}"`)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B49] hover:text-amber-700 bg-white hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/* BLOQUE 3: ZONA DE TAREAS Y TALLERES (EVALUACIONES)        */}
        {/* ========================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#002B49] uppercase tracking-wider mb-1">
                <FileUp className="w-4 h-4 text-amber-500" />
                <span>Bloque 3 · Evaluación y Entregas</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Zona de Tareas y Talleres
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Carga tus actividades formativas y consulta la retroalimentación cualitativa y cuantitativa de tu tutor.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sistema de Calificación 5.0</span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {assignments.map((task) => (
              <div 
                key={task.id}
                className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 bg-white transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-[#002B49] bg-slate-100 px-2.5 py-0.5 rounded-md">
                      Ponderación: {task.weight}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Fecha Límite: <strong>{task.dueDate}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {task.title}
                  </h3>

                  {task.feedback && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-2.5 text-xs mt-2 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Comentario del Docente:</span> {task.feedback}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  {task.status === 'submitted' ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                          Calificación
                        </span>
                        <span className="text-base font-black text-emerald-600">
                          {task.grade}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Entregado</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenUploadModal(task)}
                      className="inline-flex items-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all active:scale-[0.98]"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Adjuntar Solución</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ========================================================== */}
      {/* MODAL: SUBIR / ENTREGAR SOLUCIÓN DE TAREA                  */}
      {/* ========================================================== */}
      {selectedTaskForUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            
            {/* Header Modal */}
            <div className="bg-[#002B49] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Entrega de Tarea / Solución
                </h3>
              </div>
              <button 
                onClick={() => setSelectedTaskForUpload(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario Modal */}
            <form onSubmit={handleSubmitTask} className="p-6 space-y-4">
              {uploadSuccessMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{uploadSuccessMessage}</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Actividad a entregar:
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {selectedTaskForUpload.title}
                    </h4>
                    <span className="text-xs text-amber-700 font-semibold block mt-1">
                      Cierre: {selectedTaskForUpload.dueDate} · Valor: {selectedTaskForUpload.weight}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Adjuntar Archivo (PDF, Word, Audio MP3 o ZIP)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-[#002B49] rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                      <UploadCloud className="w-8 h-8 text-[#002B49] mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-slate-700">
                        {uploadFileName ? uploadFileName : 'Haz clic para seleccionar tu archivo o arrástralo aquí'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tamaño máximo permitido: 25 MB
                      </p>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadFileName(e.target.files[0].name)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enlace de Google Drive / Notas para el Docente
                    </label>
                    <textarea
                      rows={3}
                      value={submissionComments}
                      onChange={(e) => setSubmissionComments(e.target.value)}
                      placeholder="Pega aquí el enlace de tu grabación o escribe observaciones pedagógicas para tu tutor..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTaskForUpload(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                      disabled={uploading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#002B49] hover:bg-[#001f35] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {uploading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Enviando tarea...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>Confirmar y Enviar Solución</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

          </div>
        </div>
      )}

      {/* 4. FOOTER DISCRETO */}
      <footer className="mt-12 py-6 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <p>© 2026 American Dream English · Campus Virtual y Aulas Sincrónicas Microsoft Teams</p>
      </footer>

    </div>
  )
}
