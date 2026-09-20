import React from 'react'
import Link from 'next/link'
import { GraduationCap, BookOpen, Award, CheckCircle } from 'lucide-react'

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Rol Autorizado: Estudiante</span>
            </div>
            <h1 className="text-3xl font-black">Portal del Estudiante & Becario</h1>
            <p className="text-sm text-slate-400 mt-1">
              American Dream English - Turbo, Antioquia & Plataforma Global.
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
          >
            Ver Sitio Público
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-emerald-400">
              <Award className="w-5 h-5" />
              Nivel MCER Actual
            </h3>
            <p className="text-xl font-black">B1 Pre-Intermedio</p>
            <p className="text-xs text-slate-400 mt-2">95 de 120 horas completadas (80%)</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-blue-400">
              <BookOpen className="w-5 h-5" />
              Materiales Habilitados
            </h3>
            <p className="text-xs text-slate-300">Audios Fonéticos & Masterclasses 4K</p>
            <p className="text-xs text-slate-400 mt-2">Acceso 24/7 disponible</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-amber-400">
              <CheckCircle className="w-5 h-5" />
              Estado de Beca
            </h3>
            <p className="text-xs text-slate-300">Beca Parcial Mensual Activa</p>
            <p className="text-xs text-slate-400 mt-2">Fondo Social Turbo, Urabá</p>
          </div>
        </div>

      </div>
    </div>
  )
}
