'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getCourseBySlug, COURSES_DATA } from '../../../data/coursesData'
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Users, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Play,
  HelpCircle,
  BookOpen,
  MessageCircle
} from 'lucide-react'
import { useCurrency } from '../../../context/CurrencyContext'

export default function CourseDetailPage() {
  const params = useParams()
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string) || 'adultos'
  const course = getCourseBySlug(rawSlug) || COURSES_DATA[0]

  // Acordeones interactivos (abiertos/cerrados por defecto)
  const [openObjectives, setOpenObjectives] = useState(true)
  const [openModules, setOpenModules] = useState(true)
  const [openFaq, setOpenFaq] = useState(false)
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null)

  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(activeFaqIdx === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-36 md:pb-16 text-slate-900">
      
      {/* 1. TOP BAR / NAVEGACIÓN DE REGRESO */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Ver todos los programas</span>
          </Link>

          <span className="text-[11px] font-extrabold text-crimson-600 uppercase tracking-wider">
            Detalle del Programa
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">

        {/* 2. HEADER VISUAL: MINIATURA/BANNER REPRESENTATIVO CON BADGE DE NIVEL */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-navy-950">
          <div className="relative h-48 sm:h-64 w-full">
            <img
              src={course.videoThumbnail || '/teacher-anthony.jpg'}
              alt={course.title}
              className="w-full h-full object-cover object-top opacity-60 mix-blend-luminosity hover:opacity-75 transition-opacity"
            />
            {/* Gradiente cinemático */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

            {/* Badge de Nivel & Formato superior */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-white bg-crimson-600/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{course.badge}</span>
              </span>

              <span className="text-[10px] font-extrabold text-navy-900 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                Certificación MCER
              </span>
            </div>

            {/* Título y Subtítulo sobre el header visual */}
            <div className="absolute bottom-3 left-4 right-4">
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                {course.title}
              </h1>
              <p className="text-xs text-slate-200 font-medium line-clamp-2 mt-1">
                {course.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 3. FICHA TÉCNICA RÁPIDA (GRID 2x2 TÁCTIL) */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* Card 1: Duración */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Duración
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {course.durationWeeks} semanas
              </span>
            </div>
          </div>

          {/* Card 2: Horarios */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Horarios
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Flexibles 24/7
              </span>
            </div>
          </div>

          {/* Card 3: Clases */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Clases
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                En vivo / Presencial
              </span>
            </div>
          </div>

          {/* Card 4: Certificado */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Certificado
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Oficial Incluido
              </span>
            </div>
          </div>

        </div>

        {/* 4. ACORDEONES COLAPSABLES INTERACTIVOS */}
        <div className="space-y-3">
          
          {/* ACORDEÓN 1: ¿QUÉ VAS A APRENDER? */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setOpenObjectives(!openObjectives)}
              className="w-full p-4 text-left font-black text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-crimson-600 flex items-center justify-center text-sm font-black">
                  🎯
                </span>
                <span>¿Qué vas a aprender?</span>
              </div>
              {openObjectives ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {openObjectives && (
              <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-slate-100 bg-slate-50/50">
                {course.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{obj}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACORDEÓN 2: TEMARIO POR MÓDULOS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setOpenModules(!openModules)}
              className="w-full p-4 text-left font-black text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black">
                  📚
                </span>
                <span>Temario por Módulos</span>
              </div>
              {openModules ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {openModules && (
              <div className="px-4 pb-4 pt-2 space-y-3 border-t border-slate-100 bg-slate-50/50">
                {course.modules.map((mod) => (
                  <div 
                    key={mod.number} 
                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-3xs space-y-1"
                  >
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {mod.number}
                      </span>
                      <span>{mod.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-medium pl-6 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACORDEÓN 3: PREGUNTAS FRECUENTES */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setOpenFaq(!openFaq)}
              className="w-full p-4 text-left font-black text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">
                  ❓
                </span>
                <span>Preguntas Frecuentes</span>
              </div>
              {openFaq ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {openFaq && (
              <div className="px-4 pb-4 pt-2 space-y-2.5 border-t border-slate-100 bg-slate-50/50">
                {course.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <h5 className="text-xs font-black text-slate-900 flex items-start gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h5>
                    <p className="text-[11px] text-slate-600 font-medium pl-5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. BARRA FIJA INFERIOR DE CONVERSIÓN (STICKY BOTTOM ACTION BAR)           */}
      {/* Fijada sobre el MobileBottomNav en móvil (bottom-16) y relativa en desktop */}
      {/* ========================================================================= */}
      <aside 
        aria-label="Acción de inscripción rápida"
        className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 p-3 shadow-[0_-6px_16px_rgba(0,0,0,0.08)] md:relative md:bottom-0 md:mt-8 md:rounded-2xl md:max-w-3xl md:mx-auto"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          
          {/* LADO IZQUIERDO: PRECIO TOTAL O VALOR DE RESERVA */}
          <div className="text-left pl-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block leading-none">
              Reserva de cupo desde
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatCop(course.reservationFeeCop)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                COP
              </span>
            </div>
          </div>

          {/* LADO DERECHO: BOTÓN ROJO GRANDE DE MATRÍCULA DIRECTA */}
          <Link
            href={`/matricula?curso=${course.slug}`}
            className="min-h-[48px] px-5 sm:px-8 bg-crimson-600 hover:bg-crimson-700 active:scale-[0.98] text-white font-black rounded-xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap"
          >
            <span>INSCRIBIRME AHORA</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

        </div>
      </aside>

    </div>
  )
}
