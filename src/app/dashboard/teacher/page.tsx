import React from 'react'
import Link from 'next/link'
import { Users, BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react'

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30 mb-2">
              <Users className="w-4 h-4" />
              <span>Rol Autorizado: Docente / Admin</span>
            </div>
            <h1 className="text-3xl font-black">Portal Docente</h1>
            <p className="text-sm text-slate-400 mt-1">
              American Dream English - Gestión de clases sincrónicas y avance pedagógico MCER.
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
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Próxima Clase Sincrónica
            </h3>
            <p className="text-xs text-slate-300">Nivel B1 - Fonética Avanzada & Conversación</p>
            <p className="text-xs text-slate-400 mt-2">Hoy, 6:00 PM (12 Estudiantes inscritos)</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Recursos de Clase
            </h3>
            <p className="text-xs text-slate-300">Masterclasses 4K & E-Books asignados</p>
            <p className="text-xs text-slate-400 mt-2">Módulo 3: Comercio Marítimo y Logística</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Horas Registradas
            </h3>
            <p className="text-xs text-slate-300">120 Horas en el ciclo de Urabá</p>
            <p className="text-xs text-slate-400 mt-2">92% de asistencia en promedio</p>
          </div>
        </div>

      </div>
    </div>
  )
}
