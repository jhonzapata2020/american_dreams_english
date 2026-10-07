'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  BarChart3, 
  Trophy, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react'

export default function ProgresoPage() {
  const skills = [
    { name: 'Speaking & Fluency', score: 85, level: 'B1+' },
    { name: 'Listening Comprehension', score: 92, level: 'B2' },
    { name: 'Grammar & Syntax', score: 78, level: 'B1' },
    { name: 'Vocabulary & Idioms', score: 88, level: 'B1+' },
    { name: 'Reading & Writing', score: 80, level: 'B1' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. TOP APP BAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Volver a My ADE</span>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Rúbrica MCER B1
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        
        {/* RESUMEN GLOBAL */}
        <div className="bg-gradient-to-br from-navy-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg space-y-4 border border-navy-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
              Desempeño Académico
            </span>
            <span className="text-xs font-bold text-slate-300">Periodo 2026</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">4.8 / 5.0</h2>
              <p className="text-xs text-slate-300 font-medium">Promedio acumulado</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">82%</span>
              <p className="text-xs text-slate-300 font-medium">Para Certificado B1</p>
            </div>
          </div>

          {/* Horas Asistidas */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="bg-white/5 p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block">Horas Sincrónicas</span>
              <span className="text-xs font-black text-white">48 / 60 Horas</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block">Prácticas en Plataforma</span>
              <span className="text-xs font-black text-white">36 Horas Lab</span>
            </div>
          </div>
        </div>

        {/* DESGLOSE POR COMPETENCIAS LINGÜÍSTICAS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Competencias Lingüísticas MCER
          </h3>

          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-navy-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {skill.level}
                    </span>
                    <span className="text-crimson-600 font-black">{skill.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-navy-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  )
}
