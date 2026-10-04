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
  HelpCircle, 
  ShieldCheck, 
  LogOut, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Bell, 
  Award, 
  Building2, 
  Laptop, 
  MessageSquare, 
  Send, 
  X, 
  RefreshCw,
  Sparkles,
  Headphones,
  Check
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

// Tipos para el campus virtual
interface StudentProfile {
  id: string
  fullName: string
  email: string
  docType: string
  docNumber: string
  currentLevel: string
  scholarshipType?: string
}

interface EnrolledCourse {
  id: string
  code: string
  title: string
  level: string
  modality: 'presencial' | 'virtual'
  completedHours: number
  totalHours: number
  accumulatedPoints: number
  maxPoints: number
  status: string
}

interface LiveClass {
  id: string
  title: string
  level: string
  scheduledAt: string
  teamsMeetingUrl: string
  teacherName: string
  status: string
}

interface CourseMaterial {
  id: string
  title: string
  type: 'pdf' | 'audio' | 'guide' | 'rubric'
  level: string
  fileSize: string
  downloadUrl: string
  description?: string
}

// Avisos de carrusel institucional
const OFFICIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    tag: 'Clase Sincrónica',
    title: 'Próxima sesión en vivo por Microsoft Teams: Laboratorio Conversacional y Fonética',
    date: 'Esta semana • Miércoles 7:00 PM',
    highlight: true
  },
  {
    id: 2,
    tag: 'Entrega Académica',
    title: 'Fecha límite para cargar la Actividad 2 de comprensión auditiva en el Campus Virtual',
    date: 'Hasta este domingo a las 11:59 PM',
    highlight: false
  },
  {
    id: 3,
    tag: 'Certificación MCER',
    title: 'Simulacros de prueba internacional disponibles en la sección de materiales de estudio',
    date: 'Evaluaciones formativas 2026',
    highlight: false
  }
]

// Materiales de estudio por nivel predeterminado
const DEFAULT_MATERIALS: CourseMaterial[] = [
  {
    id: 'mat-1',
    title: 'Guía de Aprendizaje Integrada • Unidad 1 y 2 (PDF)',
    type: 'guide',
    level: 'B1',
    fileSize: '4.2 MB',
    downloadUrl: '#',
    description: 'Estructuras gramaticales, vocabulario y ejercicios prácticos de aplicación.'
  },
  {
    id: 'mat-2',
    title: 'Laboratorio de Audios de Fonética & Reducciones Vocálicas (MP3)',
    type: 'audio',
    level: 'B1',
    fileSize: '18.5 MB',
    downloadUrl: '#',
    description: 'Ejercicios de entonación y repetición grabados por docentes bilingües C1.'
  },
  {
    id: 'mat-3',
    title: 'Taller Evaluativo y Rúbrica de Entrevistas Bilingües (PDF)',
    type: 'rubric',
    level: 'B1',
    fileSize: '1.8 MB',
    downloadUrl: '#',
    description: 'Criterios de evaluación y plantilla de preparación para simulacro laboral.'
  },
  {
    id: 'mat-4',
    title: 'Manual de Conectores Discursivos y Ensayos Académicos (PDF)',
    type: 'pdf',
    level: 'B1',
    fileSize: '2.9 MB',
    downloadUrl: '#',
    description: 'Guía de escritura formal y redacción de correos electrónicos profesionales.'
  }
]

export default function CampusVirtualPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<StudentProfile>({
    id: 'demo-student',
    fullName: 'Estudiante American Dream',
    email: 'estudiante@americandream.edu.co',
    docType: 'CC',
    docNumber: '1045234890',
    currentLevel: 'B1 Pre-Intermedio',
    scholarshipType: 'Beca Parcial Urabá'
  })

  const [courses, setCourses] = useState<EnrolledCourse[]>([
    {
      id: 'course-b1',
      code: '90002-B1',
      title: 'INGLÉS GENERAL BILINGÜE • NIVEL B1 (PRE-INTERMEDIO)',
      level: 'B1',
      modality: 'virtual',
      completedHours: 48,
      totalHours: 120,
      accumulatedPoints: 145,
      maxPoints: 500,
      status: 'active'
    },
    {
      id: 'course-lab',
      code: '90008-LAB',
      title: 'LABORATORIO DE FONÉTICA Y FLUIDEZ CONVERSACIONAL',
      level: 'B1',
      modality: 'presencial',
      completedHours: 20,
      totalHours: 40,
      accumulatedPoints: 95,
      maxPoints: 200,
      status: 'active'
    }
  ])

  const [liveClass, setLiveClass] = useState<LiveClass>({
    id: 'live-1',
    title: 'Sesión Conversacional: Debate & Simulacro de Entrevista Laboral',
    level: 'Nivel B1 / B2',
    scheduledAt: 'Miércoles, 7:00 PM (Hora Colombia)',
    teamsMeetingUrl: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_demo_american_dream',
    teacherName: 'Teacher Anthony & Equipo Académico',
    status: 'scheduled'
  })

  const [materials, setMaterials] = useState<CourseMaterial[]>(DEFAULT_MATERIALS)

  // Carrusel de avisos
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState<number>(0)

  // Modales
  const [incidentModalOpen, setIncidentModalOpen] = useState<boolean>(false)
  const [incidentDescription, setIncidentDescription] = useState<string>('')
  const [incidentSent, setIncidentSent] = useState<boolean>(false)

  const [certificatesModalOpen, setCertificatesModalOpen] = useState<boolean>(false)

  // Carga de datos de Supabase
  useEffect(() => {
    async function loadCampusData() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // 1. Obtener perfil
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profData) {
            setProfile({
              id: user.id,
              fullName: profData.full_name || user.email || 'Estudiante',
              email: user.email || '',
              docType: profData.doc_type || 'CC',
              docNumber: profData.doc_number || '1045234890',
              currentLevel: profData.level || 'B1 Pre-Intermedio',
              scholarshipType: profData.scholarship_type || 'Matrícula Oficial'
            })
          }

          // 2. Obtener clases en vivo de la tabla live_classes
          const { data: liveData } = await supabase
            .from('live_classes')
            .select('*')
            .order('scheduled_at', { ascending: true })
            .limit(1)

          if (liveData && liveData.length > 0) {
            const item = liveData[0]
            setLiveClass({
              id: item.id,
              title: item.title || 'Clase en Vivo Sincrónica',
              level: item.level || 'Nivel Activo',
              scheduledAt: new Date(item.scheduled_at).toLocaleString('es-CO', {
                dateStyle: 'full',
                timeStyle: 'short'
              }),
              teamsMeetingUrl: item.teams_meeting_url || item.meeting_link || 'https://teams.microsoft.com',
              teacherName: item.teacher_name || 'Teacher Anthony',
              status: item.status || 'scheduled'
            })
          }

          // 3. Obtener materiales de la tabla course_materials
          const { data: matData } = await supabase
            .from('course_materials')
            .select('*')
            .order('created_at', { ascending: true })

          if (matData && matData.length > 0) {
            const mappedMats: CourseMaterial[] = matData.map((m: any) => ({
              id: m.id,
              title: m.title,
              type: m.type || 'guide',
              level: m.level || 'B1',
              fileSize: m.file_size || '3.5 MB',
              downloadUrl: m.file_url || '#',
              description: m.description
            }))
            setMaterials(mappedMats)
          }
        }
      } catch (err) {
        console.warn('Campus virtual operando con catálogo base:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCampusData()
  }, [])

  // Auto-rotación del carrusel de avisos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncementIndex((prev) => (prev + 1) % OFFICIAL_ANNOUNCEMENTS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // Manejador de cierre de sesión
  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Error al cerrar sesión:', e)
    }
    window.location.href = '/login'
  }

  // Manejador de reporte de incidentes
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incidentDescription.trim()) return
    setIncidentSent(true)
    setTimeout(() => {
      setIncidentModalOpen(false)
      setIncidentSent(false)
      setIncidentDescription('')
    }, 2000)
  }

  const currentAnnouncement = OFFICIAL_ANNOUNCEMENTS[activeAnnouncementIndex]

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-sans selection:bg-[#002B49] selection:text-white flex flex-col">
      
      {/* 1. BARRA SUPERIOR DISCRETA DE ENLACES INSTITUCIONALES */}
      <div className="bg-[#001f35] text-slate-300 text-[11px] font-medium border-b border-[#002B49]/60 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200">Vida Académica</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Servicios Estudiantiles</span>
            <span className="text-slate-600">|</span>
            <a 
              href="https://wa.me/573105001234?text=Hola%20American%20Dream,%20necesito%20ayuda%20con%20el%20Campus%20Virtual" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors font-bold flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Centro de Ayuda</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Instituto de Idiomas American Dream</span>
            <span className="px-2 py-0.5 bg-blue-900/60 text-blue-200 border border-blue-700/50 rounded text-[10px] font-mono">
              Campus v2.6
            </span>
          </div>
        </div>
      </div>

      {/* 2. BANNER INSTITUCIONAL PRINCIPAL */}
      <header className="bg-gradient-to-r from-[#002B49] via-[#0B3C61] to-[#002B49] text-white shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo y Nombre Institucional */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-2 bg-white rounded-2xl shadow-md shrink-0">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  CAMPUS VIRTUAL
                </h1>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-xs font-black rounded-full uppercase">
                  UNAD Layout
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium tracking-wide mt-0.5">
                Plataforma de Aprendizaje Bilingüe • Sede Turbo & Campus Global
              </p>
            </div>
          </div>

          {/* Badge del Periodo y Estado de Conexión */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Periodo Académico</div>
              <div className="text-xs font-bold text-amber-300">Ciclo Formativo 2026 (16-04)</div>
            </div>
            <div className="p-2.5 bg-blue-950/70 border border-blue-400/30 rounded-xl flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Sesión Activa</span>
            </div>
          </div>

        </div>
      </header>

      {/* 3. CARRUSEL / BANNER HORIZONTAL DE AVISOS OFICIALES */}
      <section className="bg-white border-b border-slate-200 shadow-2xs py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold shrink-0">
              <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span>Avisos:</span>
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-2 text-xs truncate animate-fadeIn">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded text-[10px] shrink-0">
                {currentAnnouncement.tag}
              </span>
              <span className="font-semibold text-slate-800 truncate">
                {currentAnnouncement.title}
              </span>
              <span className="text-slate-400 text-[11px] hidden md:inline shrink-0">
                ({currentAnnouncement.date})
              </span>
            </div>
          </div>

          {/* Controles del Carrusel */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveAnnouncementIndex((prev) => (prev - 1 + OFFICIAL_ANNOUNCEMENTS.length) % OFFICIAL_ANNOUNCEMENTS.length)}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              title="Aviso anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {activeAnnouncementIndex + 1}/{OFFICIAL_ANNOUNCEMENTS.length}
            </span>
            <button
              onClick={() => setActiveAnnouncementIndex((prev) => (prev + 1) % OFFICIAL_ANNOUNCEMENTS.length)}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              title="Siguiente aviso"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. LAYOUT ACADÉMICO FORMAL DE 2 COLUMNAS (70% Contenidos / 30% Panel Lateral) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* COLUMNA PRINCIPAL DE CONTENIDOS (IZQUIERDA - 70% / lg:col-span-8)         */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. CARD DESTACADA: CLASE EN VIVO POR MICROSOFT TEAMS */}
            <div className="bg-white rounded-2xl border-2 border-[#464EB8]/30 shadow-sm overflow-hidden relative">
              
              {/* Barra superior de la tarjeta Teams */}
              <div className="bg-gradient-to-r from-[#464EB8] to-[#363C96] text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shrink-0 border border-white/20">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded">
                      Microsoft Teams • Aulas Virtuales
                    </span>
                    <h2 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
                      Clase en Vivo Sincrónica
                    </h2>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-400 text-slate-950 text-xs font-black rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping" />
                  <span>Enlace Oficial</span>
                </span>
              </div>

              {/* Contenido de la Clase en Teams */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {liveClass.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-[#464EB8]" />
                      <span>{liveClass.scheduledAt}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <GraduationCap className="w-4 h-4 text-[#464EB8]" />
                      <span>Docente: {liveClass.teacherName}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-[#002B49] border border-blue-200 rounded text-[11px] font-bold">
                      {liveClass.level}
                    </span>
                  </div>
                </div>

                {/* Botón de Entrada Oficial de Microsoft Teams */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <a
                    href={liveClass.teamsMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#464EB8] hover:bg-[#3b42a0] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md shadow-[#464EB8]/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Unirse a la Clase en Vivo (Teams)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <p className="text-[11px] text-slate-400 font-medium">
                    💡 Acceso libre desde tu navegador o la app de Microsoft Teams.
                  </p>
                </div>

              </div>

            </div>

            {/* 2. LISTADO DE CURSOS Y MÓDULOS MATRICULADOS (ESTILO UNAD) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              
              {/* Cabecera institucional estilo UNAD */}
              <div className="bg-[#002B49] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Campus Virtual · Mis Cursos Matriculados (Ciclo 2026)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-300">
                  {courses.length} cursos activos
                </span>
              </div>

              {/* Filas de Cursos */}
              <div className="divide-y divide-slate-100">
                {courses.map((course) => {
                  const progressPct = Math.round((course.completedHours / course.totalHours) * 100)
                  return (
                    <div key={course.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                      
                      {/* Título del Curso y Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-[#002B49] text-white text-[10px] font-mono font-bold rounded">
                              {course.code}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200">
                              M
                            </span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded border border-blue-200">
                              {course.modality === 'presencial' ? 'Presencial Turbo' : 'Virtual en Vivo'}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">
                              Nivel {course.level}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-slate-900 tracking-tight">
                            {course.title}
                          </h4>
                        </div>

                        {/* Botón de Ingreso a la Materia */}
                        <button
                          onClick={() => {
                            const el = document.getElementById('seccion-materiales')
                            if (el) el.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="bg-[#002B49] hover:bg-[#001f35] text-white font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                        >
                          <span>Entrar al Entorno</span>
                          <span>↗</span>
                        </button>
                      </div>

                      {/* Barra de Progreso y Puntaje */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <span>Progreso Académico:</span>
                            <span className="font-bold text-[#002B49]">{progressPct}%</span>
                            <span className="text-[11px] text-slate-400">({course.completedHours} de {course.totalHours} hrs)</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span>Puntos:</span>
                            <span className="text-emerald-700 font-bold">🟢 {course.accumulatedPoints}</span>
                            <span className="text-slate-400">/</span>
                            <span className="text-amber-700 font-bold">🟡 {course.maxPoints} pts</span>
                          </div>
                        </div>

                        {/* Barra gráfica */}
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#002B49] to-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Botón de Reporte de Soporte Técnico */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setIncidentModalOpen(true)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>Reportar incidente técnico en este curso</span>
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>

            {/* 3. MÓDULO: GUÍAS Y MATERIALES DE ESTUDIO */}
            <div id="seccion-materiales" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold">
                    <FileText className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Guías y Materiales de Estudio • {profile.currentLevel}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Recursos digitales y audios correspondientes a tu ciclo activo
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                  {materials.length} recursos
                </span>
              </div>

              {/* Cuadrícula de Materiales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {materials.map((mat) => (
                  <div 
                    key={mat.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mat.type === 'audio' 
                            ? 'bg-purple-100 text-purple-800' 
                            : mat.type === 'rubric' 
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {mat.type === 'audio' ? 'Audio MP3' : mat.type === 'rubric' ? 'Rúbrica' : 'Guía PDF'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{mat.fileSize}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {mat.title}
                      </h4>
                      {mat.description && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {mat.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={mat.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-white hover:bg-[#002B49] text-[#002B49] hover:text-white border border-slate-200 hover:border-[#002B49] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Material</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* BARRA LATERAL DEL ALUMNO (DERECHA - 30% / lg:col-span-4)                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* CARD 1: SESIÓN DE USUARIO */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sesión de Usuario
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>( Salir )</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Documento:</span>
                  <span className="font-mono font-bold text-slate-800">{profile.docType}: {profile.docNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IP de Conexión:</span>
                  <span className="font-mono text-slate-600">181.129.45.10 (SSL Seguro)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modalidad:</span>
                  <span className="font-bold text-emerald-700">Activo en Plataforma</span>
                </div>
              </div>
            </div>

            {/* CARD 2: PERFIL DEL ESTUDIANTE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#002B49] to-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 text-sm truncate">
                    {profile.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {profile.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold">
                    {profile.scholarshipType || 'Estudiante Matriculado'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Nivel Matriculado:</div>
                <div className="font-bold text-[#002B49] text-sm">
                  {profile.currentLevel}
                </div>
              </div>
            </div>

            {/* CARD 3: ACCESOS RÁPIDOS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-2">
                Accesos Directos
              </span>

              <div className="space-y-2">
                {/* Botón 1: Horarios y Clases */}
                <a
                  href={liveClass.teamsMeetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#002B49] hover:bg-[#001f35] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Horarios y Clases en Vivo</span>
                  </div>
                  <span>→</span>
                </a>

                {/* Botón 2: Certificados PDF */}
                <button
                  onClick={() => setCertificatesModalOpen(true)}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-between shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-900" />
                    <span>Historial y Certificados (PDF)</span>
                  </div>
                  <span>→</span>
                </button>

                {/* Botón 3: Tutoría WhatsApp */}
                <a
                  href="https://wa.me/573105001234?text=Hola%20American%20Dream,%20solicito%20tutor%C3%ADa%20acad%C3%A9mica%20personalizada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Solicitar Tutoría 1 a 1</span>
                </a>
              </div>
            </div>

            {/* CARD 4: FICHA INSTITUCIONAL FORMAL */}
            <div className="bg-[#002B49] text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Información Institucional</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed border-t border-blue-900/80 pt-3">
                <p className="font-bold text-white text-xs">
                  PROGRAMA DE FORMACIÓN BILINGÜE AMERICAN DREAM
                </p>
                <p className="text-[11px] text-slate-300">
                  Resolución Institucional No. 0482 • Secretaría de Educación de Turbo
                </p>
                <p className="text-[11px] text-slate-300">
                  Distrito Portuario de Turbo, Urabá Antioqueño
                </p>
              </div>

              <div className="pt-2 border-t border-blue-900/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Vigilado MinEducación</span>
                <span className="text-amber-400 font-bold">Registro 2026</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* MODAL: REPORTAR INCIDENTE TÉCNICO */}
      {incidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#002B49]">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Reportar Incidente Técnico</h3>
              </div>
              <button onClick={() => setIncidentModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {incidentSent ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">¡Incidente Registrado!</h4>
                <p className="text-xs text-slate-600">Ticket #TK-{Math.floor(Math.random() * 90000 + 10000)} asignado a soporte.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitIncident} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Describe el inconveniente en la plataforma:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    placeholder="Ej. No puedo abrir el enlace de Teams de la clase del miércoles o la guía de audio no carga..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIncidentModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#002B49] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Reporte</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: HISTORIAL Y CERTIFICADOS (PDF) */}
      {certificatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#002B49]">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Historial Académico & Certificaciones</h3>
              </div>
              <button onClick={() => setCertificatesModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Certificado Preliminar de Horas B1</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">En Curso</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Total horas cursadas y aprobadas: 68 horas sincrónicas y de laboratorio fonético.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => alert('Generando certificado preliminar en formato PDF...')}
                    className="w-full py-2 bg-[#002B49] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Constancia de Estudio (PDF)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCertificatesModalOpen(false)}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER DISCRETO */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} American Dream English • Campus Virtual Estudiantil</p>
          <p className="text-[10px]">
            Diseñado bajo estándares pedagógicos y arquitecturas de aprendizaje a distancia UNAD.
          </p>
        </div>
      </footer>

    </div>
  )
}
