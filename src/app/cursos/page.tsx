'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  COURSE_CATEGORIES, 
  CourseCategory, 
  COURSES_DATA, 
  CourseProgram 
} from '../../data/coursesData'
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  BookOpen,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'

export default function CursosPage() {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('Todos')
  const { currency, formatPrice } = useCurrency()

  const filteredCourses = selectedCategory === 'Todos'
    ? COURSES_DATA
    : COURSES_DATA.filter((course) => course.category === selectedCategory)

  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. ENCABEZADO COMPACTO & APP BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-crimson-600">
                American Dream English
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Nuestros Programas
              </h1>
            </div>
            <div className="flex items-center gap-1 bg-red-50 text-crimson-700 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MCER</span>
            </div>
          </div>

          {/* FILTRO RÁPIDO POR CHIPS HORIZONTALES DESLIZABLES */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth">
            {COURSE_CATEGORIES.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    active
                      ? 'bg-navy-900 text-white shadow-sm ring-2 ring-navy-900/10'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{category}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. LISTADO DE TARJETAS VERTICALES DE PROGRAMAS */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {filteredCourses.map((course) => {
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Badge superior de nivel / formato */}
              <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-navy-900 bg-navy-50 border border-navy-200/60 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-navy-900" />
                  <span>{course.badge}</span>
                </span>
                {course.popular && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                    ★ Más Solicitado
                  </span>
                )}
              </div>

              {/* Contenido principal de la tarjeta */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {course.shortDescription}
                  </p>
                </div>

                {/* Viñetas cortas (Máximo 3 puntos clave) */}
                <div className="space-y-2 py-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {course.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Precio visible destacado */}
                <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Mensualidad Formativa
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {formatCop(course.monthlyFeeCop)}
                      </span>
                      <span className="text-xs font-bold text-slate-500">/ mes</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                      Matrícula: {formatCop(course.reservationFeeCop)}
                    </span>
                  </div>
                </div>

                {/* BOTONERA INFERIOR (MÍNIMO 48px DE ALTURA PARA EXPERIENCIA MÓVIL ÓPTIMA) */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  
                  {/* Botón Secundario: Ver Programa */}
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="min-h-[48px] w-full border-2 border-slate-300 hover:border-slate-400 active:scale-[0.99] bg-white hover:bg-slate-50 text-slate-800 font-extrabold rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider transition-all text-center"
                  >
                    <span>Ver Programa</span>
                  </Link>

                  {/* Botón Primario Institucional: Inscribirme */}
                  <Link
                    href={`/matricula?curso=${course.slug}`}
                    className="min-h-[48px] w-full bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider transition-all text-center"
                  >
                    <span>Inscribirme</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                </div>

              </div>
            </div>
          )
        })}

        {filteredCourses.length === 0 && (
          <div className="bg-white p-8 rounded-2xl text-center space-y-3 border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">
              No hay programas en esta categoría en este momento.
            </p>
            <button
              onClick={() => setSelectedCategory('Todos')}
              className="text-xs font-extrabold text-crimson-600 underline"
            >
              Ver todos los programas
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
