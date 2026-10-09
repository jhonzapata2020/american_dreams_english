'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  ExternalLink, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  LogOut, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  Building2, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { getLevelConfig } from '../../data/levelConfig'
import { StudentProfileModal, StudentProfileData } from '../../components/campus/StudentProfileModal'
import { StudentAvatarMenu } from '../../components/campus/StudentAvatarMenu'


interface EnrolledCourse {
  id: string
  code: string
  title: string
  level: string
  modality: string
  progress: number
  accumulatedPoints: number
  maxPoints: number
  credits: number
  teacherName: string
  nextLiveClass: string
}

// Avisos de carrusel institucional estilo UNAD
const OFFICIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    tag: 'Encuentro Sincrónico',
    title: 'Próxima clase en vivo por Microsoft Teams: Conversación y Laboratorio Fonético',
    date: 'Esta semana • Miércoles 7:00 PM',
    highlight: true
  },
  {
    id: 2,
    tag: 'Evaluación Formativa',
    title: 'Fecha de cierre para el Taller 1 de gramática y vocabulario fundamental en el Aula Virtual',
    date: 'Hasta este domingo a las 11:59 PM',
    highlight: false
  },
  {
    id: 3,
    tag: 'Certificación Oficial',
    title: 'Recuerda consultar la rúbrica de ponderación MCER para tu nivel formativo',
    date: 'Periodo Académico 2026',
    highlight: false
  }
]

export default function CampusVirtualPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const [showCertModal, setShowCertModal] = useState(false)
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileInitialTab, setProfileInitialTab] = useState<'info' | 'security'>('info')
  const [incidentText, setIncidentText] = useState('')
  const [incidentSent, setIncidentSent] = useState(false)

  // Perfil del Alumno
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

  // Cursos Matriculados dinámicos
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([
    {
      id: 'a1',
      code: 'ADE-ING101',
      title: 'ENGLISH LEVEL 1 (A1) - GENERAL PROGRAM',
      level: 'A1 Principiante',
      modality: 'Virtual en Vivo (Microsoft Teams) & Aula Virtual',
      progress: 68,
      accumulatedPoints: 120,
      maxPoints: 380,
      credits: 3,
      teacherName: 'Lic. Carlos Méndez',
      nextLiveClass: 'Miércoles 7:00 PM'
    }
  ])

  // Cargar sesión y cursos de Supabase si existen
  useEffect(() => {
    async function loadStudentData() {
      try {
        let detectedLevel = 'A1'
        if (typeof window !== 'undefined') {
          const storedLevel = localStorage.getItem('ade_student_level') || localStorage.getItem('student_level')
          if (storedLevel) detectedLevel = storedLevel

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
            const resolvedLvl = profile.mcer_level || profile.current_level || session.user.user_metadata?.course_level || detectedLevel
            detectedLevel = resolvedLvl

            setStudent((prev) => ({
              ...prev,
              id: profile.id,
              fullName: profile.full_name || profile.name || session.user?.user_metadata?.full_name || prev.fullName,
              email: profile.email || session.user?.email || prev.email,
              phone: profile.phone || session.user?.user_metadata?.phone || prev.phone,
              avatarUrl: profile.avatar_url || session.user?.user_metadata?.avatar_url || prev.avatarUrl,
              docType: profile.document_type || prev.docType,
              docNumber: profile.document_number || prev.docNumber,
              currentLevel: resolvedLvl,
              programName: 'Programa de Inglés Jóvenes y Adultos',
              studentCode: `ADE-2026-${profile.id.substring(0, 4).toUpperCase()}`,
              status: 'Matriculado Regular'
            }))
          }
        }

        // Configurar curso matriculado según el nivel del estudiante (A1, A2, B1, B2, C1)
        const cfg = getLevelConfig(detectedLevel)
        setEnrolledCourses([
          {
            id: cfg.id,
            code: cfg.code,
            title: cfg.title,
            level: cfg.levelBadge,
            modality: 'Virtual en Vivo (Microsoft Teams) & Aula Virtual',
            progress: 68,
            accumulatedPoints: 120,
            maxPoints: 380,
            credits: cfg.credits,
            teacherName: cfg.teacherName,
            nextLiveClass: cfg.nextLiveClass
          }
        ])

      } catch (err) {
        // Fallback robusto
      } finally {
        setLoading(false)
      }
    }

    loadStudentData()
  }, [])

  // Carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % OFFICIAL_ANNOUNCEMENTS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // Continuar
    }
    window.location.href = '/campus/login'
  }

  const handleSendIncident = (e: React.FormEvent) => {
    e.preventDefault()
    if (!incidentText.trim()) return
    setIncidentSent(true)
    setTimeout(() => {
      setIncidentSent(false)
      setIncidentText('')
      setShowIncidentModal(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#002B49] selection:text-white flex flex-col justify-between">
      
      {/* 1. BARRA SUPERIOR INSTITUCIONAL TIPO UNAD */}
      <div className="bg-[#001f35] text-white border-b border-slate-800 text-[11px] py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-amber-400">Campus Virtual UNAD-Style</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Periodo Académico: <strong>2026-I (Enero - Junio)</strong></span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-slate-300">
            <a href="/" className="hover:text-white transition-colors">Portal Principal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowIncidentModal(true); }} className="hover:text-amber-400 transition-colors">Mesa de Ayuda</a>
          </div>
        </div>
      </div>

      {/* 2. HEADER CON LOGOTIPO INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002B49] text-white flex items-center justify-center font-black text-lg shadow-sm">
              AD
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight block leading-tight">
                AMERICAN DREAM ENGLISH
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-amber-600 uppercase tracking-wider block">
                Plataforma de Formación y Campus Virtual
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <StudentAvatarMenu
              student={student}
              onOpenEditProfile={(tab) => {
                setProfileInitialTab(tab || 'info')
                setShowProfileModal(true)
              }}
              onLogout={handleLogout}
              onOpenCert={() => setShowCertModal(true)}
              variant="header"
            />
            
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. CARRUSEL DE COMUNICADOS INSTITUCIONALES */}
      <div className="bg-[#002B49] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              {OFFICIAL_ANNOUNCEMENTS[announcementIdx].tag}
            </span>
            <p className="text-xs font-medium text-slate-200 truncate">
              {OFFICIAL_ANNOUNCEMENTS[announcementIdx].title}{' '}
              <span className="text-amber-300 font-bold ml-1.5">
                ({OFFICIAL_ANNOUNCEMENTS[announcementIdx].date})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setAnnouncementIdx((prev) => (prev - 1 + OFFICIAL_ANNOUNCEMENTS.length) % OFFICIAL_ANNOUNCEMENTS.length)}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAnnouncementIdx((prev) => (prev + 1) % OFFICIAL_ANNOUNCEMENTS.length)}
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. CUERPO PRINCIPAL: LAYOUT FORMAL UNAD (2 COLUMNAS: 70% / 30%) */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================== */}
          {/* COLUMNA IZQUIERDA (70% - lg:col-span-8): CURSOS ACTIVOS    */}
          {/* ========================================================== */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cabecera de Sección */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#002B49] text-amber-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900">
                    Mis Cursos Matriculados
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Ciclo Formativo Vigente · Periodo 2026-I
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#002B49] bg-slate-100 px-3 py-1 rounded-lg">
                1 Curso Activo
              </span>
            </div>

            {/* Listado de Tarjetas de Cursos */}
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden border-t-4 border-t-[#002B49]"
                >
                  {/* Encabezado del curso */}
                  <div className="p-5 sm:p-6 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#002B49] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                          {course.code}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {course.credits} Créditos Académicos
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Próxima clase: <strong className="text-slate-800">{course.nextLiveClass}</strong></span>
                      </div>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {course.title}
                    </h2>
                    
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Modalidad: <span className="text-slate-700 font-semibold">{course.modality}</span> · Docente: <span className="text-slate-700 font-semibold">{course.teacherName}</span>
                    </p>

                    {/* Barra de Progreso y Puntuación */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">
                          Progreso en el Aula Virtual
                        </span>
                        <span className="text-[#002B49]">
                          {course.progress}% Completado
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-[#002B49] h-full rounded-full transition-all duration-700" 
                          style={{ width: `${course.progress}%` }} 
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Calificación Acumulada: 🟢 {course.accumulatedPoints} / 🟡 {course.maxPoints} pts
                        </span>
                        <span>Nivel MCER: {course.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer de la tarjeta con Botón de Acceso */}
                  <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                      Incluye: Clases Teams, Guías PDF, Audios y Zona de Tareas.
                    </div>

                    <Link
                      href={`/campus/curso/${course.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-black px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs tracking-wide group active:scale-[0.98]"
                    >
                      <span>Acceder al Aula Virtual</span>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Servicios y Enlaces Académicos Complementarios */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Orientación y Soporte Académico
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button 
                  onClick={() => setShowIncidentModal(true)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 group-hover:text-[#002B49]">Reportar Novedad</strong>
                    <span className="text-[11px] text-slate-500">Soporte con el aula virtual</span>
                  </div>
                </button>

                <button 
                  onClick={() => setShowCertModal(true)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
                >
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 group-hover:text-[#002B49]">Certificado Matrícula</strong>
                    <span className="text-[11px] text-slate-500">Descargar constancia oficial</span>
                  </div>
                </button>

                <a 
                  href="https://wa.me/573000000000?text=Hola,%20solicito%20soporte%20acad%C3%A9mico%20en%20Campus%20Virtual" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-start gap-2.5 group"
                >
                  <MessageSquare className="w-4 h-4 text-[#002B49] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 group-hover:text-[#002B49]">Tutoría por WhatsApp</strong>
                    <span className="text-[11px] text-slate-500">Línea directa de coordinación</span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* ========================================================== */}
          {/* COLUMNA DERECHA (30% - lg:col-span-4): FICHA ESTUDIANTE    */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* FICHA DEL ESTUDIANTE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Cabecera Ficha con Avatar Interactivo */}
              <div className="bg-[#002B49] text-white p-5 text-center relative">
                <StudentAvatarMenu
                  student={student}
                  onOpenEditProfile={(tab) => {
                    setProfileInitialTab(tab || 'info')
                    setShowProfileModal(true)
                  }}
                  onLogout={handleLogout}
                  variant="card"
                />
                <span className="inline-block mt-2 text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {student.status}
                </span>
              </div>

              {/* Detalles Académicos */}
              <div className="p-5 space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Identificación Oficial ({student.docType})
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    {student.docNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Código Estudiantil
                  </span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {student.studentCode}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Programa Académico
                  </span>
                  <span className="font-semibold text-slate-700">
                    {student.programName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    Correo Institucional
                  </span>
                  <span className="font-medium text-slate-600 truncate block">
                    {student.email}
                  </span>
                </div>

                {/* Botones de Acción */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileInitialTab('info')
                      setShowProfileModal(true)
                    }}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#002B49] bg-slate-100 hover:bg-slate-200 border border-slate-300 py-2.5 px-4 rounded-xl transition-colors shadow-2xs"
                  >
                    <User className="w-4 h-4" />
                    <span>Editar Perfil & Foto</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión Segura</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TARJETA DE SEGURIDAD Y CONEXIÓN */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-[#002B49] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sesión Cifrada SSL 256-bit</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tus accesos, entregas de actividades y asistencia a encuentros Teams están protegidos bajo las políticas académicas de American Dream English.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* 5. MODAL: CONSTANCIA DE MATRÍCULA */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">
              Certificado Oficial de Matrícula
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Documento con firma digital institucional y código QR de verificación.
            </p>

            <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5">
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

      {/* 6. MODAL: REPORTAR NOVEDAD TÉCNICA */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-[#002B49] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Mesa de Ayuda del Campus</h3>
              </div>
              <button onClick={() => setShowIncidentModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendIncident} className="p-5 space-y-4">
              {incidentSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>¡Tu novedad ha sido enviada al equipo de soporte! Ticket #TKT-2026-089</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600">
                    Describe el inconveniente con el acceso a Teams, materiales o tareas:
                  </p>
                  <textarea
                    required
                    rows={4}
                    value={incidentText}
                    onChange={(e) => setIncidentText(e.target.value)}
                    placeholder="Ej. No puedo reproducir el audio del módulo 1 o tengo dudas con la fecha de la entrega..."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowIncidentModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] rounded-xl shadow-sm"
                    >
                      Enviar Reporte
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: EDITAR PERFIL & SEGURIDAD */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        student={student}
        onProfileUpdated={(updated) => setStudent(updated)}
        initialTab={profileInitialTab}
      />

      {/* 8. FOOTER INSTITUCIONAL */}
      <footer className="mt-8 py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <p>© 2026 American Dream English · Campus Virtual e Integración Académica UNAD-Style</p>
      </footer>

    </div>
  )
}
