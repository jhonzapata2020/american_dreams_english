'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  UserPlus, 
  Users, 
  BookOpen, 
  KeyRound, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  Trash2, 
  Pencil, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Phone, 
  Mail,
  GraduationCap,
  Sparkles,
  Download
} from 'lucide-react'

export interface StudentRecord {
  id: string
  full_name: string
  email: string
  document_type?: string
  document_number?: string
  phone?: string
  mcer_level?: string
  municipality?: string
  status?: string
  created_at?: string
  course_name?: string
  avatar_url?: string
  modality?: string
}

interface StudentsCrudTableProps {
  students: StudentRecord[]
  loading?: boolean
  onRefresh?: () => void
  onOpenCreateModal: () => void
  onOpenEditModal?: (student: StudentRecord) => void
  onDeleteStudent: (id: string, name: string) => void
  onViewCredentials: (student: StudentRecord) => void
}

// Fallback high-resolution portraits matching Figma style
const CURATED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
]

const GRADIENT_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600'
]

export function StudentsCrudTable({
  students,
  loading = false,
  onRefresh,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteStudent,
  onViewCredentials
}: StudentsCrudTableProps) {
  // Filtros reactivos
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [municipalityFilter, setMunicipalityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalityFilter, setModalityFilter] = useState('all')

  // Selección múltiple
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Acordeón de fila expandida (estilo Edward John de Figma)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Notificación de copia rápida
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Helper para iniciales
  const getInitials = (name: string) => {
    if (!name) return 'ST'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  // Helper para avatar con fallback
  const getAvatarUrl = (student: StudentRecord, index: number) => {
    if (student.avatar_url && student.avatar_url.trim().length > 0) {
      return student.avatar_url
    }
    return CURATED_AVATARS[index % CURATED_AVATARS.length]
  }

  // Helper para badge de nivel
  const getLevelBadge = (level?: string) => {
    const l = (level || 'A1').toUpperCase()
    switch (l) {
      case 'A1':
        return { label: 'A1 · Beginner', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80' }
      case 'A2':
        return { label: 'A2 · Pre-Interm.', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/80' }
      case 'B1':
        return { label: 'B1 · Interm.', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' }
      case 'B2':
        return { label: 'B2 · Upper Interm.', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80' }
      default:
        return { label: `${l} · Formación`, badgeClass: 'bg-slate-50 text-slate-700 border-slate-200' }
    }
  }

  // Helper para badge de estado
  const getStatusBadge = (status?: string) => {
    const s = (status || 'active').toLowerCase()
    if (s === 'paused' || s === 'pausado') {
      return {
        label: 'Pausado',
        className: 'bg-amber-50 text-amber-700 border border-amber-200/70'
      }
    }
    if (s === 'completed' || s === 'graduado') {
      return {
        label: 'Graduado',
        className: 'bg-sky-50 text-sky-700 border border-sky-200/70'
      }
    }
    return {
      label: 'Activo',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
    }
  }

  // Lista filtrada
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const name = (s.full_name || '').toLowerCase()
      const email = (s.email || '').toLowerCase()
      const doc = (s.document_number || '')
      const mun = (s.municipality || '').toLowerCase()
      const level = (s.mcer_level || 'A1').toUpperCase()
      const status = (s.status || 'active').toLowerCase()
      const term = searchTerm.toLowerCase().trim()

      const matchesSearch = 
        !term ||
        name.includes(term) ||
        email.includes(term) ||
        doc.includes(term) ||
        mun.includes(term)

      const matchesLevel = levelFilter === 'all' || level === levelFilter.toUpperCase()

      const matchesMunicipality = 
        municipalityFilter === 'all' || 
        mun.includes(municipalityFilter.toLowerCase())

      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && (status === 'active' || status === 'activa')) ||
        (statusFilter === 'paused' && (status === 'paused' || status === 'pausado')) ||
        (statusFilter === 'completed' && (status === 'completed' || status === 'graduado'))

      return matchesSearch && matchesLevel && matchesMunicipality && matchesStatus
    })
  }, [students, searchTerm, levelFilter, municipalityFilter, statusFilter])

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize))
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStudents.slice(start, start + pageSize)
  }, [filteredStudents, currentPage, pageSize])

  // Manejo de Selección
  const isAllSelected = 
    paginatedStudents.length > 0 && 
    paginatedStudents.every(s => selectedIds.has(s.id))

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const next = new Set(selectedIds)
      paginatedStudents.forEach(s => next.delete(s.id))
      setSelectedIds(next)
    } else {
      const next = new Set(selectedIds)
      paginatedStudents.forEach(s => next.add(s.id))
      setSelectedIds(next)
    }
  }

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  // Copiar correos seleccionados
  const handleCopySelectedEmails = () => {
    const emails = students
      .filter(s => selectedIds.has(s.id) && s.email)
      .map(s => s.email)
      .join(', ')
    
    if (emails) {
      navigator.clipboard.writeText(emails)
      setCopyFeedback(`¡${selectedIds.size} correos copiados al portapapeles!`)
      setTimeout(() => setCopyFeedback(null), 3000)
    }
  }

  // Copiar Documento al Portapapeles
  const handleCopyText = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopyFeedback(`¡${label} copiado!`)
    setTimeout(() => setCopyFeedback(null), 2500)
  }

  // Generar link directo de WhatsApp con mensaje institucional
  const getWhatsAppLink = (student: StudentRecord) => {
    const rawPhone = student.phone || '3120000000'
    const cleanPhone = rawPhone.replace(/\D/g, '')
    const finalPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`
    const doc = student.document_number || 'No. Documento'
    const pwd = doc.length >= 6 ? doc : `${doc}2026*`
    const course = student.course_name || 'ENGLISH LEVEL 1 - GENERAL PROGRAM'
    const loginUrl = typeof window !== 'undefined' ? `${window.location.origin}/campus/login` : 'https://americandreams.edu.co/campus/login'

    const message = encodeURIComponent(
      `🎉 *¡HOLA ${student.full_name.toUpperCase()}!* 🎓\n\nTe damos la más cordial bienvenida a *AMERICAN DREAM ENGLISH*.\nTu matrícula en el curso *${course}* está 100% activa.\n\n🔑 *TUS DATOS DE ACCESO AL CAMPUS VIRTUAL:*\n• *Portal:* ${loginUrl}\n• *Usuario:* ${doc}\n• *Contraseña Inicial:* ${pwd}\n\n_Nos alegra acompañarte en tu ruta hacia el bilingüismo._`
    )

    return `https://wa.me/${finalPhone}?text=${message}`
  }

  return (
    <div className="space-y-5 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE ACCIONES Y FILTROS ESTILO FIGMA                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        
        {/* Fila 1: Búsqueda, Filtros y Botón Matricular */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Input de Búsqueda 3D Neumórfico Suave */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Buscar por nombre, documento o correo..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Contador de seleccionados estilo Figma */}
            {selectedIds.size > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs font-bold text-blue-700 animate-fadeIn shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{selectedIds.size} seleccionados</span>
                <button
                  type="button"
                  onClick={handleCopySelectedEmails}
                  className="ml-1 text-[11px] underline hover:text-blue-900 cursor-pointer"
                  title="Copiar correos de alumnos seleccionados"
                >
                  Copiar Correos
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-400 hover:text-slate-600 ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Botones de acción derecha */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-between sm:justify-end">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-600 hover:text-slate-900 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                title="Actualizar lista de estudiantes"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            )}

            {/* Botón Principal "+ Matricular Estudiante" estilo Figma Blue */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-100" />
              <span>+ Matricular Estudiante</span>
            </button>
          </div>
        </div>

        {/* Fila 2: Filtros desplegables "Bien Calidosos" */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filtros:</span>
          </span>

          {/* Dropdown 1: Nivel MCER */}
          <div className="relative flex-1 sm:flex-initial min-w-[130px]">
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
            >
              <option value="all">Nivel: Todos</option>
              <option value="A1">Nivel A1 · Principiante</option>
              <option value="A2">Nivel A2 · Pre-Interm.</option>
              <option value="B1">Nivel B1 · Intermedio</option>
              <option value="B2">Nivel B2 · Avanzado</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 2: Sede / Municipio Urabá */}
          <div className="relative flex-1 sm:flex-initial min-w-[130px]">
            <select
              value={municipalityFilter}
              onChange={(e) => {
                setMunicipalityFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
            >
              <option value="all">Sede: Todas</option>
              <option value="Turbo">Turbo (Principal)</option>
              <option value="Apartadó">Apartadó</option>
              <option value="Carepa">Carepa</option>
              <option value="Chigorodó">Chigorodó</option>
              <option value="Necoclí">Necoclí</option>
              <option value="Virtual">Virtual Teams</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dropdown 3: Estado Académico */}
          <div className="relative flex-1 sm:flex-initial min-w-[120px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors"
            >
              <option value="all">Estado: Todos</option>
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Graduado</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Botón para limpiar filtros si hay alguno activo */}
          {(searchTerm || levelFilter !== 'all' || municipalityFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setLevelFilter('all')
                setMunicipalityFilter('all')
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors ml-auto cursor-pointer"
            >
              Restablecer Filtros
            </button>
          )}

        </div>

      </div>

      {/* Notificación de feedback de copia */}
      {copyFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TABLA PRINCIPAL DE ESTUDIANTES (LOOK FIGMA TEAM LIST)                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-xs">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-blue-600" />
            <span className="font-bold text-slate-700">Sincronizando estudiantes desde Supabase...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              No se encontraron estudiantes
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No hay alumnos que coincidan con los filtros seleccionados o el término de búsqueda actual.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setLevelFilter('all')
                setMunicipalityFilter('all')
                setStatusFilter('all')
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Limpiar filtros de búsqueda
            </button>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* VISTA MÓVIL OPTIMIZADA: TARJETAS SOFT 3D (md:hidden)                      */}
            {/* ========================================================================= */}
            <div className="md:hidden divide-y divide-slate-100 p-2.5 sm:p-3 space-y-3">
              {paginatedStudents.map((st, idx) => {
                const isExpanded = expandedId === st.id
                const isSelected = selectedIds.has(st.id)
                const levelInfo = getLevelBadge(st.mcer_level)
                const statusInfo = getStatusBadge(st.status)
                const avatarUrl = getAvatarUrl(st, idx)
                const initials = getInitials(st.full_name)
                const gradientClass = GRADIENT_COLORS[idx % GRADIENT_COLORS.length]

                return (
                  <div 
                    key={st.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                      isExpanded 
                        ? 'border-blue-300 ring-2 ring-blue-500/10' 
                        : isSelected 
                          ? 'border-blue-200 bg-blue-50/20' 
                          : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Encabezado de la Tarjeta Móvil */}
                    <div className="p-3.5 space-y-3">
                      <div className="flex items-start justify-between gap-2.5">
                        
                        {/* Avatar + Datos Principales */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Checkbox de Selección */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectOne(st.id, e as any)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                            aria-label={`Seleccionar ${st.full_name}`}
                          />

                          {/* Avatar */}
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-2xs">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={st.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} text-white font-black text-xs flex items-center justify-center`}>
                              {initials}
                            </div>
                          </div>

                          {/* Nombre e Identificación */}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-slate-900 text-xs truncate leading-tight">
                              {st.full_name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                              {st.document_type || 'C.C.'} {st.document_number || 'S/D'}
                            </p>
                          </div>
                        </div>

                        {/* Pills de Estado y Nivel */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${levelInfo.badgeClass}`}>
                            {levelInfo.label.split('·')[0].trim()}
                          </span>
                        </div>
                      </div>

                      {/* Datos del Curso y Sede */}
                      <div className="bg-slate-50/80 rounded-xl p-2.5 space-y-1.5 text-[11px] border border-slate-100">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Programa:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[190px]">{st.course_name || 'Inglés General Urabá'}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Sede / Ubicación:</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {st.municipality || 'Turbo (Urabá)'}
                          </span>
                        </div>
                        {st.phone && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400 font-medium">Teléfono:</span>
                            <span className="font-mono text-slate-800">{st.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Fila de Acciones Rápidas (Touch Targets Cómodos) */}
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {/* WhatsApp Directo */}
                        <a
                          href={getWhatsAppLink(st)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 transition-colors active:scale-95"
                          title="Enviar credenciales por WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
                        </a>

                        {/* Ver Credenciales */}
                        <button
                          type="button"
                          onClick={() => onViewCredentials(st)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors active:scale-95 cursor-pointer"
                          title="Ver credenciales"
                        >
                          <KeyRound className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-bold mt-0.5">Accesos</span>
                        </button>

                        {/* Editar */}
                        {onOpenEditModal && (
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(st)}
                            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors active:scale-95 cursor-pointer"
                            title="Editar estudiante"
                          >
                            <Pencil className="w-4 h-4 text-slate-600" />
                            <span className="text-[10px] font-bold mt-0.5">Editar</span>
                          </button>
                        )}

                        {/* Toggle Más Detalles (Acordeón) */}
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : st.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-colors active:scale-95 cursor-pointer ${
                            isExpanded 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title="Ver más información"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span className="text-[10px] font-bold mt-0.5">{isExpanded ? 'Menos' : 'Detalles'}</span>
                        </button>
                      </div>

                      {/* Acordeón de Detalles Desplegado en Móvil */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-100 space-y-2.5 animate-fadeIn">
                          <div className="bg-blue-50/50 rounded-xl p-3 space-y-2 border border-blue-100 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-[11px]">Email Oficial:</span>
                              <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[180px]">{st.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-[11px]">Contraseña Inicial:</span>
                              <span className="font-mono font-bold text-blue-700 text-[11px]">{st.document_number || 'S/D'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-[11px]">Docente Titular:</span>
                              <span className="font-semibold text-slate-800 text-[11px]">Lic. Carlos Méndez</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 text-[11px]">Matrícula:</span>
                              <span className="text-slate-700 text-[11px]">
                                {st.created_at ? new Date(st.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026-I'}
                              </span>
                            </div>
                          </div>

                          {/* Botón de eliminación en móvil */}
                          <div className="flex items-center justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => onDeleteStudent(st.id, st.full_name)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar Matrícula</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )
              })}
            </div>

            {/* ========================================================================= */}
            {/* VISTA DESKTOP: TABLA COMPLETA DE 8 COLUMNAS (hidden md:block)             */}
            {/* ========================================================================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
              
              {/* Encabezados de Tabla estilo Figma Team List */}
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  {/* Checkbox Header */}
                  <th className="py-4 pl-5 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>

                  {/* Expand Chevron Space */}
                  <th className="py-4 px-1 w-8"></th>

                  {/* Columns */}
                  <th className="py-4 px-3 text-slate-700 font-extrabold">Nombre</th>
                  <th className="py-4 px-3 text-slate-700 font-extrabold">Nivel MCER</th>
                  <th className="py-4 px-3 text-slate-700 font-extrabold">Programa / Curso</th>
                  <th className="py-4 px-3 text-slate-700 font-extrabold">Correo Electrónico</th>
                  <th className="py-4 px-3 text-slate-700 font-extrabold">Teléfono</th>
                  <th className="py-4 px-3 text-slate-700 font-extrabold text-center">Estado</th>
                  <th className="py-4 px-5 text-slate-700 font-extrabold text-right">Acciones</th>
                </tr>
              </thead>

              {/* Filas */}
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((st, idx) => {
                  const isExpanded = expandedId === st.id
                  const isSelected = selectedIds.has(st.id)
                  const levelInfo = getLevelBadge(st.mcer_level)
                  const statusInfo = getStatusBadge(st.status)
                  const avatarUrl = getAvatarUrl(st, idx)
                  const initials = getInitials(st.full_name)
                  const gradientClass = GRADIENT_COLORS[idx % GRADIENT_COLORS.length]

                  return (
                    <React.Fragment key={st.id}>
                      
                      {/* FILA PRINCIPAL DEL ESTUDIANTE */}
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : st.id)}
                        className={`group transition-all duration-200 cursor-pointer select-none ${
                          isExpanded 
                            ? 'bg-blue-50/30' 
                            : isSelected 
                              ? 'bg-blue-50/20' 
                              : 'hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        
                        {/* Checkbox */}
                        <td className="py-3.5 pl-5 pr-2 w-10" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleToggleSelectOne(st.id, e as any)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Chevron Expand / Collapse */}
                        <td className="py-3.5 px-1 w-8 text-slate-400 group-hover:text-slate-600">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedId(isExpanded ? null : st.id)
                            }}
                            className="p-1 rounded-md hover:bg-slate-200/60 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            )}
                          </button>
                        </td>

                        {/* Nombre y Avatar (Figma Style) */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-2xs">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={st.full_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback a iniciales si la imagen falla
                                    (e.target as HTMLElement).style.display = 'none'
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full bg-gradient-to-br ${gradientClass} text-white font-black text-xs flex items-center justify-center`}>
                                {initials}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <span className="font-extrabold text-slate-900 text-xs sm:text-[13px] block truncate">
                                {st.full_name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <span>{st.document_type || 'C.C.'} {st.document_number || 'S/D'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Nivel MCER (Position en Figma) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${levelInfo.badgeClass}`}>
                            {levelInfo.label}
                          </span>
                        </td>

                        {/* Programa / Curso (Department en Figma) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-slate-700 font-semibold text-xs truncate max-w-[200px] block">
                            {st.course_name || 'Inglés General Urabá'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Resolución 2471 SED
                          </span>
                        </td>

                        {/* Correo Electrónico (Email en Figma) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-slate-600 font-mono text-[11px]">
                            {st.email}
                          </span>
                        </td>

                        {/* Teléfono (Phone en Figma) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-slate-700 font-medium text-xs">
                            {st.phone || '(57) 310 000-0000'}
                          </span>
                        </td>

                        {/* Estado (Status en Figma - Pastel Pills) */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Acciones (Edit / Actions en Figma) */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center justify-end gap-1">
                            
                            {/* Ver credenciales de acceso */}
                            <button
                              type="button"
                              onClick={() => onViewCredentials(st)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Ver credenciales de acceso del campus"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Editar Estudiante */}
                            {onOpenEditModal && (
                              <button
                                type="button"
                                onClick={() => onOpenEditModal(st)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Editar datos del estudiante"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}

                            {/* Eliminar Estudiante */}
                            <button
                              type="button"
                              onClick={() => onDeleteStudent(st.id, st.full_name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar matrícula"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>

                      {/* ======================================================= */}
                      {/* ACORDEÓN EXPANDIDO (ESTILO EXACTO EDWARD JOHN EN FIGMA) */}
                      {/* ======================================================= */}
                      {isExpanded && (
                        <tr className="bg-gradient-to-b from-blue-50/40 to-slate-50/30 border-y-2 border-blue-200/80">
                          <td colSpan={9} className="p-0">
                            <div className="p-5 sm:p-6 space-y-4 animate-fadeIn">
                              
                              {/* Grid de Datos Expandidos de Figma */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                
                                {/* 1. Office Location / Sede */}
                                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                      Sede & Municipio
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800">
                                    {st.municipality || 'Turbo (Urabá)'}
                                  </p>
                                  <span className="text-[10px] text-slate-400">
                                    Subregión de Urabá · Antioquia
                                  </span>
                                </div>

                                {/* 2. Documento & Contraseña Inicial */}
                                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                                  <div className="flex items-center justify-between text-slate-400 mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        Documento / Password
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyText(st.document_number || '', 'Documento', e)}
                                      className="text-slate-400 hover:text-blue-600 transition-colors"
                                      title="Copiar Documento"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-xs font-mono font-bold text-slate-900">
                                    {st.document_type || 'C.C.'} {st.document_number || 'Sin registrar'}
                                  </p>
                                  <span className="text-[10px] text-emerald-600 font-semibold block">
                                    Password = No. Documento
                                  </span>
                                </div>

                                {/* 3. Team Mates / Docentes Asignados */}
                                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                      Equipo Docente
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800">
                                    Lic. Carlos Méndez
                                  </p>
                                  <span className="text-[10px] text-slate-400">
                                    Teacher Anthony (Director)
                                  </span>
                                </div>

                                {/* 4. Fecha de Matrícula (Birthday / Date en Figma) */}
                                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                      Fecha de Matrícula
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-800">
                                    {st.created_at ? new Date(st.created_at).toLocaleDateString('es-CO', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    }) : 'Periodo 2026-I'}
                                  </p>
                                  <span className="text-[10px] text-slate-400">
                                    Vigente hasta Diciembre 2026
                                  </span>
                                </div>

                                {/* 5. Acciones Rápidas Directas */}
                                <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-center gap-2">
                                  <a
                                    href={getWhatsAppLink(st)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Enviar WhatsApp</span>
                                  </a>

                                  <Link
                                    href="/campus"
                                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Ir a Aula Virtual</span>
                                  </Link>
                                </div>

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  )
                })}
              </tbody>

            </table>
          </div>
        </>
        )}

        {/* ========================================================================= */}
        {/* 3. PAGINACIÓN INFERIOR ESTILO FIGMA (1 - 9 of 48 < >)                     */}
        {/* ========================================================================= */}
        <div className="p-4 sm:px-6 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          
          <div>
            Mostrando{' '}
            <strong className="text-slate-800">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            -{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </strong>{' '}
            de <strong className="text-slate-800">{filteredStudents.length}</strong> estudiantes
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 mr-2">
              Página {currentPage} de {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
