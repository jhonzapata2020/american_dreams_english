'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Play, 
  Video, 
  Headphones, 
  Mic, 
  FileEdit, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Award, 
  Clock, 
  BookOpen,
  ArrowRight
} from 'lucide-react'

type ContentType = 'video' | 'listening' | 'speaking' | 'quiz'
type LessonStatus = 'completed' | 'in_progress' | 'locked'

interface Lesson {
  id: string
  number: number
  title: string
  duration: string
  type: ContentType
  status: LessonStatus
  score?: string
}

interface Unit {
  id: string
  unitNumber: number
  title: string
  description: string
  completedCount: number
  totalCount: number
  lessons: Lesson[]
}

const COURSE_UNITS: Unit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'Unit 1: Introductions & Daily Habits',
    description: 'Bases de pronunciación, rutinas, números y estructuras de presentación personal.',
    completedCount: 5,
    totalCount: 5,
    lessons: [
      { id: 'les-1', number: 1, title: 'Alphabet & Phonics Foundations', duration: '15 min', type: 'video', status: 'completed', score: '100%' },
      { id: 'les-2', number: 2, title: 'Greetings & Formal Introductions', duration: '20 min', type: 'speaking', status: 'completed', score: '95%' },
      { id: 'les-3', number: 3, title: 'Numbers, Time & Schedules', duration: '15 min', type: 'listening', status: 'completed', score: '100%' },
      { id: 'les-4', number: 4, title: 'Present Simple: Daily Routines', duration: '25 min', type: 'video', status: 'completed', score: '90%' },
      { id: 'les-5', number: 5, title: 'Unit 1 Mastery Quiz', duration: '20 min', type: 'quiz', status: 'completed', score: '4.9/5.0' },
    ]
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'Unit 2: City Life & Social Interactions',
    description: 'Navegación urbana, pedir direcciones, comida, restaurantes y compras cotidianas.',
    completedCount: 5,
    totalCount: 5,
    lessons: [
      { id: 'les-6', number: 6, title: 'Places in the City & Directions', duration: '18 min', type: 'video', status: 'completed', score: '100%' },
      { id: 'les-7', number: 7, title: 'At the Restaurant: Ordering Food', duration: '22 min', type: 'speaking', status: 'completed', score: '92%' },
      { id: 'les-8', number: 8, title: 'Listening to City Commutes (Podcast)', duration: '15 min', type: 'listening', status: 'completed', score: '88%' },
      { id: 'les-9', number: 9, title: 'Countable & Uncountable Nouns', duration: '20 min', type: 'video', status: 'completed', score: '96%' },
      { id: 'les-10', number: 10, title: 'Unit 2 Practical Evaluation', duration: '25 min', type: 'quiz', status: 'completed', score: '4.7/5.0' },
    ]
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'Unit 3: Memories, Stories & Past Experiences',
    description: 'Simple Past, biografías, viajes pasados y narración de anécdotas fluidas.',
    completedCount: 3,
    totalCount: 5,
    lessons: [
      { id: 'les-11', number: 11, title: 'Regular vs. Irregular Past Verbs', duration: '25 min', type: 'video', status: 'completed', score: '94%' },
      { id: 'les-12', number: 12, title: 'Storytelling: My Best Vacation Ever', duration: '30 min', type: 'speaking', status: 'completed', score: '90%' },
      { id: 'les-13', number: 13, title: 'Audio Lab: Famous Historical Events', duration: '20 min', type: 'listening', status: 'completed', score: '95%' },
      { id: 'lesson-14', number: 14, title: 'Talking About the Past in Detail', duration: '25 min', type: 'speaking', status: 'in_progress' },
      { id: 'les-15', number: 15, title: 'Unit 3 Past Tense Challenge', duration: '20 min', type: 'quiz', status: 'locked' },
    ]
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'Unit 4: Future Plans, Dreams & Career',
    description: 'Be going to, Will, entrevistas laborales, metas personales y proyección profesional.',
    completedCount: 0,
    totalCount: 5,
    lessons: [
      { id: 'les-16', number: 16, title: 'Future Plans: Going to vs. Will', duration: '20 min', type: 'video', status: 'locked' },
      { id: 'les-17', number: 17, title: 'Job Interview Simulation 1', duration: '35 min', type: 'speaking', status: 'locked' },
      { id: 'les-18', number: 18, title: 'Listening: Tech Startup Pitches', duration: '20 min', type: 'listening', status: 'locked' },
      { id: 'les-19', number: 19, title: 'Formal Emails & Proposals', duration: '25 min', type: 'video', status: 'locked' },
      { id: 'les-20', number: 20, title: 'Final Level B1 Certification Exam', duration: '45 min', type: 'quiz', status: 'locked' },
    ]
  }
]

export default function AulaMovilPage() {
  const [openUnits, setOpenUnits] = useState<{ [key: string]: boolean }>({
    'unit-3': true, // Unidad activa abierta por defecto
    'unit-2': false,
    'unit-1': false,
    'unit-4': false,
  })

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }))
  }

  // Renderizador de Chip de tipo de contenido
  const renderTypeBadge = (type: ContentType) => {
    switch (type) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            <Video className="w-3 h-3" />
            <span>Video</span>
          </span>
        )
      case 'listening':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
            <Headphones className="w-3 h-3" />
            <span>Listening</span>
          </span>
        )
      case 'speaking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            <Mic className="w-3 h-3" />
            <span>Speaking</span>
          </span>
        )
      case 'quiz':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
            <FileEdit className="w-3 h-3" />
            <span>Quiz</span>
          </span>
        )
    }
  }

  const totalCompleted = COURSE_UNITS.reduce((acc, u) => acc + u.completedCount, 0)
  const totalLessons = COURSE_UNITS.reduce((acc, u) => acc + u.totalCount, 0)
  const progressPercent = Math.round((totalCompleted / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. TOP APP BAR CON NAVEGACIÓN */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Volver a My ADE</span>
            </Link>

            <span className="text-[11px] font-black uppercase tracking-wider text-crimson-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
              Aula Virtual B1
            </span>
          </div>

          {/* Resumen de Progreso del Curso */}
          <div className="mt-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/90 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-800">ENGLISH LEVEL B1 - GENERAL</span>
              <span className="text-crimson-600">{progressPercent}% Completado</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-crimson-600 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. LISTADO MODULAR VERTICAL DE UNIDADES Y LECCIONES */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-3.5">
        {COURSE_UNITS.map((unit) => {
          const isOpen = openUnits[unit.id]
          const isUnitCompleted = unit.completedCount === unit.totalCount
          const isUnitInProgress = unit.completedCount > 0 && !isUnitCompleted

          return (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              {/* Encabezado Acordeón de la Unidad */}
              <button
                type="button"
                onClick={() => toggleUnit(unit.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Unidad {unit.unitNumber}
                    </span>
                    {isUnitCompleted && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ Unidad Completada
                      </span>
                    )}
                    {isUnitInProgress && (
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        En Progreso
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                    {unit.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {unit.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {unit.completedCount}/{unit.totalCount}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Lista de Lecciones de la Unidad */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-3 space-y-2">
                  {unit.lessons.map((lesson) => {
                    return (
                      <div
                        key={lesson.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                          lesson.status === 'in_progress'
                            ? 'bg-blue-50/70 border-blue-300 shadow-sm ring-2 ring-blue-500/20'
                            : lesson.status === 'completed'
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-100/70 border-slate-200/60 opacity-60'
                        }`}
                      >
                        {/* Lado izquierdo: Estado + Título + Chips */}
                        <div className="flex items-start space-x-3">
                          
                          {/* Icono de Estado */}
                          <div className="pt-0.5 flex-shrink-0">
                            {lesson.status === 'completed' && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                            {lesson.status === 'in_progress' && (
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black animate-pulse">
                                🔵
                              </div>
                            )}
                            {lesson.status === 'locked' && (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>

                          <div className="space-y-1 text-left">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {renderTypeBadge(lesson.type)}
                              <span className="text-[10px] font-bold text-slate-400">
                                ⏱️ {lesson.duration}
                              </span>
                              {lesson.score && (
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  Nota: {lesson.score}
                                </span>
                              )}
                            </div>

                            <h4 className={`text-xs sm:text-sm font-black leading-snug ${
                              lesson.status === 'locked' ? 'text-slate-500' : 'text-slate-900'
                            }`}>
                              {lesson.title}
                            </h4>
                          </div>

                        </div>

                        {/* Lado derecho: Botón de Acción Táctil */}
                        <div className="flex-shrink-0">
                          {lesson.status === 'in_progress' && (
                            <Link
                              href={`/dashboard/aula/${lesson.id}`}
                              className="min-h-[44px] px-4 bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1 uppercase tracking-wider transition-all"
                            >
                              <span>Entrar</span>
                              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                            </Link>
                          )}

                          {lesson.status === 'completed' && (
                            <Link
                              href={`/dashboard/aula/${lesson.id}`}
                              className="min-h-[40px] px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                            >
                              <span>Repasar</span>
                            </Link>
                          )}

                          {lesson.status === 'locked' && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 px-2 py-1 rounded-md">
                              Bloqueado
                            </span>
                          )}
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </main>

    </div>
  )
}
