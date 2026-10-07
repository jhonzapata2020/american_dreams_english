'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Trophy, 
  Flame, 
  Play, 
  Video, 
  Clock, 
  Calendar, 
  FileText, 
  BookOpen, 
  BarChart3, 
  CreditCard, 
  Award, 
  MessageCircle, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  User
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

interface StudentData {
  id: string
  fullName: string
  firstName: string
  email: string
  currentLevel: string
  points: number
  streakDays: number
  currentLesson: {
    id: string
    title: string
    unit: string
    progressPercent: number
  }
  nextLiveClass: {
    title: string
    time: string
    teacher: string
    meetingUrl: string
  }
  pendingAssignments: {
    id: string
    title: string
    dueDate: string
    isUrgent: boolean
  }[]
}

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentData>({
    id: 'ADE-2026-0894',
    fullName: 'Valeria Morales',
    firstName: 'Valeria',
    email: 'valeria.morales@americandream.edu.co',
    currentLevel: 'Nivel B1 - Intermediate',
    points: 420,
    streakDays: 5,
    currentLesson: {
      id: 'lesson-14',
      title: 'Lesson 14: Talking About the Past',
      unit: 'Unit 3: Memories & Experiences',
      progressPercent: 72
    },
    nextLiveClass: {
      title: 'Speaking Lab: Conversación Fluida',
      time: 'Hoy · 6:00 PM',
      teacher: 'Teacher Anthony',
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/american-dream-speaking-lab'
    },
    pendingAssignments: [
      {
        id: 'task-1',
        title: 'Grammar Quiz 3: Past Continuous vs Simple Past',
        dueDate: 'Mañana, 11:59 PM',
        isUrgent: true
      },
      {
        id: 'task-2',
        title: 'Audio Recording: Mi última experiencia de viaje',
        dueDate: 'Viernes, 6:00 PM',
        isUrgent: false
      }
    ]
  })

  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          const rawName = profile?.full_name || profile?.name || session.user.user_metadata?.full_name || 'Valeria Morales'
          const firstName = rawName.split(' ')[0] || 'Estudiante'
          const level = profile?.mcer_level ? `Nivel ${profile.mcer_level} - Intermedio` : 'Nivel B1 - Intermediate'

          setStudent(prev => ({
            ...prev,
            id: `ADE-${session.user.id.substring(0, 5).toUpperCase()}`,
            fullName: rawName,
            firstName: firstName,
            email: session.user.email || prev.email,
            currentLevel: level
          }))
        }
      } catch (err) {
        console.warn('Carga con fallback estudiantil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStudentProfile()
  }, [])

  const whatsappSupportUrl = `https://wa.me/573207105618?text=${encodeURIComponent(
    `Hola ADE, soy el estudiante ${student.fullName} (ID: ${student.id}, ${student.currentLevel}) y requiero asistencia académica con mi curso.`
  )}`

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. ENCABEZADO PERSONAL Y GAMIFICACIÓN RÁPIDA */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 pt-5 pb-4 shadow-2xs sticky top-0 z-30">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Fila superior: Saludo & Nivel Badge */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Portal del Estudiante
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>¡Hola, {student.firstName}!</span>
                <span className="animate-bounce">👋</span>
              </h1>
            </div>

            {/* Badge de Nivel */}
            <div className="bg-navy-900 text-white px-3 py-1.5 rounded-xl border border-navy-800 shadow-xs text-right">
              <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider block leading-none">
                MCER
              </span>
              <span className="text-xs font-black tracking-tight whitespace-nowrap">
                {student.currentLevel}
              </span>
            </div>
          </div>

          {/* Micro-badge de Gamificación e Impacto */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            
            {/* Puntos ADE */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-black flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{student.points} ADE Points</span>
            </div>

            {/* Racha de días */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-black flex-shrink-0">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              <span>Racha: {student.streakDays} días</span>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Matrícula Activa</span>
            </div>

          </div>

        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-5">

        {/* ========================================================================= */}
        {/* 2. CARD HERO DE ACCIÓN INMEDIATA ("CONTINUAR APRENDIENDO")                 */}
        {/* Es el elemento visualmente más destacado de la pantalla                  */}
        {/* ========================================================================= */}
        <div className="relative bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-navy-800 overflow-hidden group">
          
          {/* Resplandor decorativo de fondo */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-crimson-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                Continuar Aprendiendo
              </span>
              <span className="text-xs font-bold text-slate-300">
                {student.currentLesson.unit}
              </span>
            </div>

            {/* Título de la Lección Actual */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                {student.currentLesson.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Laboratorio fonético, ejercicios de conversación y comprensión auditiva.
              </p>
            </div>

            {/* Barra de Progreso Porcentual */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Progreso de la lección</span>
                <span className="text-amber-400 font-extrabold">{student.currentLesson.progressPercent}% completado</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-crimson-600 via-red-500 to-amber-400 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${student.currentLesson.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Botón Primario de Gran Tamaño (≥ 48px de alto) */}
            <Link
              href={`/dashboard/aula/${student.currentLesson.id}`}
              className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 text-sm sm:text-base uppercase tracking-wider transition-all"
            >
              <span>CONTINUAR CLASE</span>
              <Play className="w-4 h-4 fill-white stroke-white" />
            </Link>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. GRID DE PRÓXIMA ACTIVIDAD Y TAREAS (2 TARJETAS TÁCTILES COMPACTAS)      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Tarjeta 1: Próxima clase en vivo */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  <Video className="w-3 h-3" />
                  <span>Encuentro en Vivo</span>
                </span>
                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {student.nextLiveClass.time}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">
                {student.nextLiveClass.title}
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Docente: {student.nextLiveClass.teacher}
              </p>
            </div>

            {/* Botón directo a Teams/Meet */}
            <a
              href={student.nextLiveClass.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full bg-[#002B49] hover:bg-[#001f35] active:scale-[0.98] text-white text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>Entrar a Teams</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Tarjeta 2: Tareas pendientes */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  <FileText className="w-3 h-3" />
                  <span>Asignaciones</span>
                </span>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  2 Pendientes
                </span>
              </div>
              
              <div className="space-y-1.5 pt-1">
                {student.pendingAssignments.map((task) => (
                  <div key={task.id} className="text-left border-l-2 border-amber-500 pl-2.5 py-0.5">
                    <p className="text-xs font-black text-slate-900 line-clamp-1">{task.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold">Vence: {task.dueDate}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/aula"
              className="min-h-[44px] w-full border border-slate-300 hover:border-slate-400 active:scale-[0.98] bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <span>Ver Asignaciones</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. ACCESOS RÁPIDOS MODULARES (BOTONES TÁCTILES ESTILO APP NATIVA)         */}
        {/* ========================================================================= */}
        <div className="space-y-2.5 pt-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Accesos Rápidos del Alumno
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Acceso 1: Mi Curso / Aula */}
            <Link
              href="/dashboard/aula"
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] shadow-2xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Mi Aula
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Lecciones y unidades</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Acceso 2: Mi Progreso */}
            <Link
              href="/dashboard/progreso"
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] shadow-2xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Mi Progreso
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Notas y rúbrica MCER</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Acceso 3: Mis Pagos y Facturas */}
            <Link
              href="/dashboard/pagos"
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] shadow-2xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    Mis Pagos
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Mensualidad y recibos</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Acceso 4: Mis Certificados */}
            <Link
              href="/dashboard/certificados"
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 active:scale-[0.98] shadow-2xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                    Certificados
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Diplomas oficiales</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Acceso 5: Mi Biblioteca Digital */}
            <Link
              href="/dashboard/biblioteca"
              className="col-span-2 p-3.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl border border-blue-200 hover:border-blue-300 active:scale-[0.98] shadow-2xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-blue-950 group-hover:text-blue-700 transition-colors">
                    Mi Biblioteca Digital
                  </h4>
                  <p className="text-[10px] text-blue-700/80 font-bold">E-books, audios y masterclasses descargables</p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-700 bg-white/80 px-2.5 py-1 rounded-lg border border-blue-100">
                Abrir →
              </span>
            </Link>

          </div>

          {/* Botón WhatsApp de Soporte Académico Prioritario */}
          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3.5 bg-emerald-50 hover:bg-emerald-100/80 active:scale-[0.98] rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between transition-all group mt-2"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <MessageCircle className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-emerald-950">
                  Soporte Académico ADE (WhatsApp)
                </h4>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Tutorías, dudas con tareas y asistencia técnica en vivo
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-200/60 px-2.5 py-1 rounded-lg">
              Chat Directo →
            </span>
          </a>

        </div>

      </main>

    </div>
  )
}
