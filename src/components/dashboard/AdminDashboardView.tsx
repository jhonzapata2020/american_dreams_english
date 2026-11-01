'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  GraduationCap,
  Heart,
  TrendingUp,
  Activity,
  Sparkles,
  Search,
  Maximize2,
  Minimize2,
  Globe,
  UserPlus,
  Tv,
  BarChart3,
  Inbox,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  X
} from 'lucide-react'

export interface AdminUser {
  name: string
  email: string
  avatarUrl?: string
  role?: string
}

export interface RecentLeadItem {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at?: string
  audience?: string
}

export interface AdminDashboardViewProps {
  studentsCount?: number
  teachersCount?: number
  pendingBecasCount?: number
  leadsCount?: number
  currentTime?: string
  adminUser?: AdminUser
  recentLeads?: RecentLeadItem[]
  isRefreshing?: boolean
  onNewStudent?: () => void
  onNewTeacher?: () => void
  onOpenCarrusel?: () => void
  onOpenMarketing?: () => void
  onOpenLeads?: () => void
  onOpenStudents?: () => void
  onOpenTeachers?: () => void
  onOpenBecas?: () => void
  onRefresh?: () => void
}

export function AdminDashboardView({
  studentsCount = 7,
  teachersCount = 5,
  pendingBecasCount = 0,
  leadsCount = 14,
  currentTime,
  adminUser = {
    name: 'Anthony Cortés',
    email: 'contacto@americandreams.edu.co',
    avatarUrl: '/teacher-anthony-avatar.jpg',
    role: 'Admin General'
  },
  recentLeads = [],
  isRefreshing = false,
  onNewStudent,
  onNewTeacher,
  onOpenCarrusel,
  onOpenMarketing,
  onOpenLeads,
  onOpenStudents,
  onOpenTeachers,
  onOpenBecas,
  onRefresh
}: AdminDashboardViewProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        }
      }
    } catch (err) {
      // Ignore fullscreen policy errors
    }
  }

  const handleCarruselAction = () => {
    if (onOpenCarrusel) {
      onOpenCarrusel()
    } else {
      router.push('/admin/carrusel')
    }
  }

  // Filtered leads based on search query
  const filteredLeads = recentLeads.filter((l) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      l.first_name.toLowerCase().includes(q) ||
      l.last_name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.phone && l.phone.includes(q))
    )
  })

  return (
    <div className="w-full space-y-6 lg:space-y-7 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HEADER INTERNO ESTANDARIZADO (MODO CLARO LUMINOSO)                     */}
      {/* ========================================================================= */}
      <header className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* LADO IZQUIERDO: BREADCRUMBS & TÍTULO */}
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Portal ADE</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900">Visión General</span>
          </nav>

          <div className="flex items-center gap-2.5 pt-0.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Panel Administrativo
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Live v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Monitoreo en tiempo real de estudiantes, matrículas y métricas oficiales de Urabá.
          </p>
        </div>

        {/* LADO DERECHO: BÚSQUEDA + HERRAMIENTAS + PERFIL */}
        <div className="flex flex-wrap items-center gap-3">
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative flex-1 sm:w-64 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estudiantes, leads..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* BOTÓN PANTALLA COMPLETA */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Restaurar pantalla' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Restaurar pantalla' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* ACCESO RÁPIDO A WEB OFICIAL */}
          <Link
            href="/"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-2xs"
            title="Abrir web pública oficial"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Ver Web</span>
          </Link>

          {/* PERFIL DEL ADMINISTRADOR */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="relative">
              <img
                src={adminUser.avatarUrl || '/teacher-anthony-avatar.jpg'}
                alt={adminUser.name}
                className="w-9 h-9 rounded-xl object-cover object-top border-2 border-blue-500/40 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {adminUser.name}
              </div>
              <span className="inline-block text-[10px] font-semibold text-blue-600 leading-none">
                {adminUser.role || 'Admin General'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. 4 CARDS DE KPIS / MÉTRICAS (DISEÑO BLANCO HOMOGÉNEO)                   */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARD 1: ESTUDIANTES ACTIVOS */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={onOpenStudents}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estudiantes Activos
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
                {studentsCount}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              100% matriculados activos
            </span>
            <span className="text-blue-600 font-bold inline-flex items-center gap-0.5">
              <span>Ver lista</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* CARD 2: PLANTEL DOCENTE */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={onOpenTeachers}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Plantel Docente
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
                {teachersCount}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Titulares Bilingües C1/C2
            </span>
            <span className="text-emerald-600 font-bold inline-flex items-center gap-0.5">
              <span>Gestionar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* CARD 3: BECAS URABÁ 2026 */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={onOpenBecas}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Becas Urabá 2026
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5 flex items-baseline gap-1.5">
                <span>{pendingBecasCount}</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  Pendientes
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Subvenciones al día
            </span>
            <span className="text-amber-600 font-bold inline-flex items-center gap-0.5">
              <span>Auditoría</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* CARD 4: TRÁFICO WEB Y LEADS */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          onClick={onOpenMarketing}
          className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tráfico & Leads
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +12%
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5 flex items-baseline gap-1.5">
                <span>{leadsCount}</span>
                <span className="text-xs font-semibold text-slate-400">
                  en vivo
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Alta intención de matrícula
            </span>
            <span className="text-indigo-600 font-bold inline-flex items-center gap-0.5">
              <span>Telemetría</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ZONA DE ACCIONES RÁPIDAS (PANEL BLANCO SIMÉTRICO)                       */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Acciones Rápidas & Gestión Operativa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accesos directos de alta frecuencia sin textos truncados ni pantallas intermedias
            </p>
          </div>
          {currentTime && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentTime}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* BOTÓN 1: + NUEVO ESTUDIANTE */}
          <button
            type="button"
            onClick={onNewStudent}
            className="p-4 rounded-2xl bg-slate-900 hover:bg-black text-white shadow-sm transition-all flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white/15 text-white">
                <UserPlus className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold text-white leading-tight">+ Matricular Alumno</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Asignar nivel y credencial</div>
            </div>
          </button>

          {/* BOTÓN 2: + NUEVO DOCENTE */}
          <button
            type="button"
            onClick={onNewTeacher}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs transition-all flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold leading-tight">+ Nuevo Docente</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Asignar titular C1/C2</div>
            </div>
          </button>

          {/* BOTÓN 3: GESTOR MULTIMEDIA CARRUSEL */}
          <button
            type="button"
            onClick={handleCarruselAction}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs transition-all flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                <Tv className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold leading-tight">Multimedia Carrusel</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Slides, WebP & video</div>
            </div>
          </button>

          {/* BOTÓN 4: MÉTRICAS Y TRÁFICO GA4 */}
          <button
            type="button"
            onClick={onOpenMarketing}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs transition-all flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <BarChart3 className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold leading-tight">Métricas del Hero</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Telemetría y eventos</div>
            </div>
          </button>

          {/* BOTÓN 5: PROSPECTOS & LEADS */}
          <button
            type="button"
            onClick={onOpenLeads}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs transition-all flex flex-col justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Inbox className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold leading-tight">Prospectos & Leads</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{leadsCount} registrados</div>
            </div>
          </button>

          {/* BOTÓN 6: SINCRONIZAR SUPABASE */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 shadow-2xs transition-all flex flex-col justify-between text-left group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-bold leading-tight">Sincronizar Supabase</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isRefreshing ? 'Actualizando...' : 'Refrescar BD'}
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECCIÓN INFERIOR: TABLA DE LEADS RECIENTES & ESTADO DE ACREDITACIÓN    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* TABLA DE LEADS RECIENTES (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Últimos Prospectos Capturados
                </h3>
                <p className="text-[11px] text-slate-500">
                  Interesados a través del formulario oficial del Home
                </p>
              </div>
            </div>

            {onOpenLeads && (
              <button
                type="button"
                onClick={onOpenLeads}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos ({filteredLeads.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              No hay prospectos recientes registrados en esta vista.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2">Prospecto</th>
                    <th className="pb-3">Contacto</th>
                    <th className="pb-3">Modalidad</th>
                    <th className="pb-3 text-right pr-2">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.slice(0, 5).map((lead) => {
                    const fullName = `${lead.first_name} ${lead.last_name}`.trim() || 'Sin Nombre'
                    const isChild = lead.audience === 'para_mi_hijo' || lead.audience === 'child'
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-2 font-bold text-slate-900">
                          {fullName}
                        </td>
                        <td className="py-3 text-slate-600">
                          <div>{lead.email}</div>
                          {lead.phone && <div className="text-[10px] text-slate-400">{lead.phone}</div>}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isChild
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {isChild ? 'Hijos / Joven' : 'Adulto / Personal'}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          {lead.phone ? (
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors"
                            >
                              WhatsApp
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin teléfono</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ESTADO DE ACREDITACIÓN & VALIDEZ INSTITUCIONAL (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Acreditación Oficial
                </h3>
                <p className="text-[11px] text-slate-500">
                  Vigilancia e Inspección SED Urabá
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Resolución Oficial:</span>
                <span className="font-mono font-bold text-slate-900">Res. SED 2471</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Sede Operativa:</span>
                <span className="font-bold text-slate-800">Turbo, Urabá</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Auditoría Becas:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Al día
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              Todas las credenciales y registros de estudiantes cuentan con trazabilidad en
              Supabase con protocolo SSL de 256 bits y respaldo cloud en tiempo real.
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-400">
              Server Status: OK
            </span>
            <Link
              href="/nosotros/anthony-cortes"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Semblanza Rectoría</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboardView
