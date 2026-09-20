import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Package, Users, GraduationCap, ArrowRight } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-crimson-600/20 text-crimson-400 rounded-full text-xs font-bold border border-crimson-500/30 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Rol Autorizado: Administrador</span>
            </div>
            <h1 className="text-3xl font-black">Panel de Administración General</h1>
            <p className="text-sm text-slate-400 mt-1">
              American Dream English S.A.S. - Gestión RBAC y productos institucionales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
            >
              Ver Sitio Público
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Gestión de Productos */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-crimson-500 transition-all group">
            <div>
              <div className="p-3 bg-crimson-600/20 text-crimson-500 rounded-2xl w-fit mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-2">Catálogo de Productos & Planes</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Administra los precios en COP y USD, y activa o desactiva productos dinámicos en la tienda pública.
              </p>
            </div>

            <Link
              href="/dashboard/admin/products"
              className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Gestionar Productos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Docentes & Clases */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between opacity-80">
            <div>
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-2">Cuerpo Docente & Aulas</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Asignación de profesores certificados a los horarios virtuales y presenciales en Turbo, Urabá.
              </p>
            </div>
            <Link
              href="/dashboard/teacher"
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Vista Docentes</span>
            </Link>
          </div>

          {/* Card 3: Fondo de Becas & Estudiantes */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between opacity-80">
            <div>
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl w-fit mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-2">Becarios & Estudiantes</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Seguimiento de horas acumuladas, niveles MCER (A1-C1) y estudiantes subvencionados.
              </p>
            </div>
            <Link
              href="/dashboard/student"
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Vista Estudiante</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
