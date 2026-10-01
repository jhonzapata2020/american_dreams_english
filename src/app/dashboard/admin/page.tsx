'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Heart, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  MessageCircle, 
  Package, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  UserPlus,
  Trash2,
  Inbox,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface StudentItem {
  id: string
  student_name: string
  student_email: string
  mcer_level: string
  completed_hours: number
  total_hours: number
  status: 'active' | 'completed' | 'paused'
}

interface ScholarshipApp {
  id: string
  full_name: string
  phone: string
  municipality: string
  academic_level: string
  status: 'pending' | 'approved' | 'contacted'
  created_at?: string
}

interface WebLead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  audience: string
  created_at?: string
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Dynamic Data States (100% Supabase)
  const [studentsCount, setStudentsCount] = useState<number>(0)
  const [teachersCount, setTeachersCount] = useState<number>(0)
  const [pendingBecasCount, setPendingBecasCount] = useState<number>(0)
  const [leadsCount, setLeadsCount] = useState<number>(0)
  const [totalDonationsAmount, setTotalDonationsAmount] = useState<number>(0)

  const [studentsList, setStudentsList] = useState<StudentItem[]>([])
  const [applications, setApplications] = useState<ScholarshipApp[]>([])
  const [leadsList, setLeadsList] = useState<WebLead[]>([])

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [leadSearchTerm, setLeadSearchTerm] = useState('')

  // Modal State for Lead Deletion
  const [leadToDelete, setLeadToDelete] = useState<WebLead | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Floating Toast State
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null)

  const fetchAdminData = async () => {
    setRefreshing(true)
    try {
      const supabase = createClient()

      // 1. KPI Student Profiles Count
      const { count: cStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')

      setStudentsCount(cStudents || 0)

      // 2. KPI Teacher Profiles Count
      const { count: cTeachers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher')

      setTeachersCount(cTeachers || 0)

      // 3. KPI Pending Scholarship Applications Count
      const { count: cPendingBecas } = await supabase
        .from('scholarship_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setPendingBecasCount(cPendingBecas || 0)

      // 4. KPI Web Leads Count & Fetch List
      const { count: cLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      setLeadsCount(cLeads || 0)

      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsData && leadsData.length > 0) {
        const mappedLeads: WebLead[] = leadsData.map((l: any) => ({
          id: l.id,
          first_name: l.first_name || l.full_name || 'Prospecto',
          last_name: l.last_name || '',
          email: l.email || 'N/A',
          phone: l.phone || 'N/A',
          audience: l.audience || 'general',
          created_at: l.created_at
        }))
        setLeadsList(mappedLeads)
      } else {
        setLeadsList([])
      }

      // 5. KPI Total Donations Amount
      const { data: donData } = await supabase
        .from('donations')
        .select('amount, total_amount')
        .eq('status', 'completed')

      if (donData && donData.length > 0) {
        const sum = donData.reduce((acc, curr) => acc + Number(curr.amount || curr.total_amount || 0), 0)
        setTotalDonationsAmount(sum)
      } else {
        const { data: allDon } = await supabase.from('donations').select('amount, total_amount')
        if (allDon && allDon.length > 0) {
          const sum = allDon.reduce((acc, curr) => acc + Number(curr.amount || curr.total_amount || 0), 0)
          setTotalDonationsAmount(sum)
        } else {
          setTotalDonationsAmount(0)
        }
      }

      // 6. Tabla Becarios Urabá (Pending Applications)
      const { data: appData } = await supabase
        .from('scholarship_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (appData && appData.length > 0) {
        const mappedApps: ScholarshipApp[] = appData.map((app: any) => ({
          id: app.id,
          full_name: app.full_name || 'Postulante Urabá',
          phone: app.phone || 'N/A',
          municipality: app.municipality || app.municipio || 'Turbo',
          academic_level: app.academic_level || app.study_level || 'Bachillerato',
          status: app.status || 'pending',
          created_at: app.created_at
        }))
        setApplications(mappedApps)
      } else {
        setApplications([])
      }

      // 7. Tabla Estudiantes: Profiles with role='student' + Enrollments
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'student')

      const { data: enrollData } = await supabase
        .from('enrollments')
        .select(`
          id,
          completed_hours,
          status,
          student:profiles ( id, full_name, email ),
          course:courses ( level, total_hours )
        `)

      if (enrollData && enrollData.length > 0) {
        const mapped: StudentItem[] = enrollData.map((e: any) => ({
          id: e.id,
          student_name: e.student?.full_name || 'Estudiante Bilingüe',
          student_email: e.student?.email || 'estudiante@americandream.edu.co',
          mcer_level: e.course?.level || 'B1',
          completed_hours: e.completed_hours || 0,
          total_hours: e.course?.total_hours || 120,
          status: e.status === 'completed' ? 'completed' : 'active'
        }))
        setStudentsList(mapped)
      } else if (studentProfiles && studentProfiles.length > 0) {
        const mapped: StudentItem[] = studentProfiles.map((sp: any) => ({
          id: sp.id,
          student_name: sp.full_name || 'Estudiante Registrado',
          student_email: sp.email || 'estudiante@americandream.edu.co',
          mcer_level: 'A1',
          completed_hours: 0,
          total_hours: 120,
          status: 'active'
        }))
        setStudentsList(mapped)
      } else {
        setStudentsList([])
      }

    } catch (err) {
      console.error('Error al cargar datos desde Supabase:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleApproveApplication = async (appId: string, studentName: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('scholarship_applications')
        .update({ status: 'approved' })
        .eq('id', appId)

      if (error) {
        console.error('Error al aprobar postulación en Supabase:', error)
      }

      setApplications((prev) => prev.filter((app) => app.id !== appId))
      setPendingBecasCount((prev) => Math.max(0, prev - 1))

      setToast({
        title: '¡Postulación aprobada!',
        message: `La beca de ${studentName} ha sido aprobada con éxito.`
      })
      setTimeout(() => setToast(null), 3500)
    } catch (err) {
      console.error('Error inesperado al aprobar beca:', err)
    }
  }

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadToDelete.id)

      if (error) {
        console.error('Error al eliminar lead en Supabase:', error)
        setToast({
          title: 'Error al eliminar',
          message: error.message
        })
        setTimeout(() => setToast(null), 3500)
        return
      }

      // Update local state
      setLeadsList((prev) => prev.filter((l) => l.id !== leadToDelete.id))
      setLeadsCount((prev) => Math.max(0, prev - 1))

      // Trigger success toast
      setToast({
        title: 'Prospecto eliminado con éxito',
        message: 'El registro ha sido removido de la base de datos.'
      })
      setTimeout(() => setToast(null), 3500)

    } catch (err) {
      console.error('Error inesperado al eliminar prospecto:', err)
    } finally {
      setIsDeleting(false)
      setLeadToDelete(null)
    }
  }

  const handleContactWhatsApp = (phone: string, name: string, contextMessage?: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const targetPhone = cleanPhone.length > 10 ? cleanPhone : `57${cleanPhone}`
    const msg = encodeURIComponent(
      contextMessage || `Hola ${name}, te saludamos de la Dirección Académica de American Dream English.`
    )
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank')
  }

  // Filter students logic
  const filteredStudents = studentsList.filter((student) => {
    const matchesSearch =
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel =
      selectedLevel === 'all' || student.mcer_level.toUpperCase() === selectedLevel.toUpperCase()

    return matchesSearch && matchesLevel
  })

  // Filter leads logic
  const filteredLeads = leadsList.filter((lead) => {
    const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase()
    const q = leadSearchTerm.toLowerCase()
    return fullName.includes(q) || lead.email.toLowerCase().includes(q) || lead.phone.includes(q)
  })

  const renderAudienceBadge = (aud?: string) => {
    const val = (aud || '').toLowerCase()
    if (val.includes('hijo') || val.includes('niño') || val.includes('kids')) {
      return (
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 whitespace-nowrap inline-block">
          Infantil / Hijos
        </span>
      )
    }
    if (val.includes('empresa') || val.includes('corporativo') || val.includes('b2b')) {
      return (
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[11px] font-bold rounded-lg border border-amber-500/20 whitespace-nowrap inline-block">
          Corporativo
        </span>
      )
    }
    if (val.includes('para_mi') || val.includes('personal') || val.includes('adulto') || val === 'self') {
      return (
        <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 text-[11px] font-bold rounded-lg border border-sky-500/20 whitespace-nowrap inline-block">
          Adulto / Personal
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-[11px] font-medium rounded-lg border border-slate-700/80 whitespace-nowrap inline-block">
        {aud || 'General'}
      </span>
    )
  }

  return (
    <DashboardLayout currentRole="admin" title="Panel de Administración General">
      <div className="space-y-8 max-w-7xl mx-auto font-sans">

        {/* HEADER TOP & REFRESH */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/70 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-full text-xs font-semibold border border-indigo-500/30 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Acceso Administrador General</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Panel de Administración General</h1>
            <p className="text-xs text-slate-400 mt-1">
              Control RBAC, seguimiento de estudiantes bilingües, prospectos web, becas Urabá y pasarelas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 border border-slate-700/70"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sincronizar Base de Datos</span>
            </button>

            <Link
              href="/dashboard/admin/products"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Package className="w-4 h-4" />
              <span>Catálogo Cursos</span>
            </Link>
          </div>
        </div>

        {/* FLOATING SUCCESS TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A]/95 border border-emerald-500/50 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-fadeIn max-w-sm backdrop-blur-md">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">{toast.message}</p>
            </div>
          </div>
        )}

        {/* STYLED CONFIRMATION MODAL FOR LEAD DELETION */}
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-[#0F172A] border border-slate-800/80 shadow-2xl rounded-2xl p-6 max-w-md w-full space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">¿Eliminar prospecto web?</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    ¿Estás seguro de que deseas eliminar al prospecto <strong className="text-white font-bold">{`${leadToDelete.first_name} ${leadToDelete.last_name}`.trim()}</strong>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/70">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setLeadToDelete(null)}
                  className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl text-xs transition-colors border border-slate-700/70"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteLead}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5 KPI METRIC CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 h-36 flex flex-col justify-between">
                <div className="h-4 bg-slate-800/70 rounded w-1/2" />
                <div className="h-8 bg-slate-800/70 rounded w-2/3" />
                <div className="h-3 bg-slate-800/70 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* KPI 1: Estudiantes Activos */}
            <div className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estudiantes</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">{studentsCount}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En vivo</span>
                </span>
              </div>
            </div>

            {/* KPI 2: Docentes Titulares */}
            <div className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Docentes</span>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">{teachersCount}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Titulares
                </span>
              </div>
            </div>

            {/* KPI 3: Becas Pendientes */}
            <div className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Becas Urabá</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">{pendingBecasCount}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Pendientes
                </span>
              </div>
            </div>

            {/* KPI 4: Leads / Prospectos Web */}
            <div className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leads Web</span>
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Inbox className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">{leadsCount}</p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  public.leads
                </span>
              </div>
            </div>

            {/* KPI 5: Fondo Recaudado */}
            <div className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Donaciones</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight text-white">
                ${totalDonationsAmount.toLocaleString('es-CO')}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  COP acumulado
                </span>
              </div>
            </div>

          </div>
        )}

        {/* MÓDULO: GESTIÓN DE PROSPECTOS & LEADS WEB (public.leads) */}
        <div id="leads" className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/70 pb-5">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-400" />
                <span>Gestión de Prospectos & Leads Web</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Registro directo en tiempo real desde el formulario de captura público.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar prospecto o email..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full bg-[#0A0E1A] border border-slate-800/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <span className="px-3 py-1 bg-purple-500/15 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 whitespace-nowrap">
                {filteredLeads.length} Registros
              </span>
            </div>
          </div>

          {/* LEADS TABLE */}
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
              Cargando prospectos web desde Supabase...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="bg-[#0A0E1A]/60 border border-slate-800/70 rounded-2xl p-10 text-center space-y-2">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-slate-300 text-sm">No se encontraron prospectos web</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {leadSearchTerm
                  ? `No hay coincidencias para "${leadSearchTerm}".`
                  : 'Aún no se han recibido registros en la tabla public.leads.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/70">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-800/70">
                  <tr>
                    <th className="py-4 px-6 whitespace-nowrap">Nombre del Prospecto</th>
                    <th className="py-4 px-6 whitespace-nowrap">Contacto (Correo & Teléfono)</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-400 tracking-wider whitespace-nowrap">PERFIL / PROGRAMA</th>
                    <th className="py-4 px-6 whitespace-nowrap">Fecha de Registro</th>
                    <th className="py-4 px-6 text-right whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredLeads.map((lead) => {
                    const fullName = `${lead.first_name} ${lead.last_name}`.trim()
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-white text-sm whitespace-nowrap">
                          {fullName}
                        </td>
                        <td className="py-4 px-6 space-y-0.5 whitespace-nowrap">
                          <p className="text-slate-200 font-medium">{lead.email}</p>
                          <p className="text-[11px] text-slate-400">{lead.phone}</p>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          {renderAudienceBadge(lead.audience)}
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-[11px] whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {lead.created_at ? new Date(lead.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'Reciente'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleContactWhatsApp(lead.phone, fullName, `Hola ${fullName}, te escribimos de American Dream English respecto a tu solicitud de información.`)}
                            className="bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 font-medium py-1.5 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => setLeadToDelete(lead)}
                            title="Eliminar prospecto"
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-colors inline-flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* MÓDULO PRINCIPAL: ESTUDIANTES MATRICULADOS */}
        <div id="estudiantes" className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/70 pb-5">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Estudiantes Matriculados & Seguimiento MCER</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Matrículas activas, horas acumuladas en aula y nivel según el Marco Común Europeo.
              </p>
            </div>

            {/* SEARCH & LEVEL FILTER CONTROLS */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar estudiante o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0A0E1A] border border-slate-800/80 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Level Tabs Filter */}
              <div className="bg-[#0A0E1A] border border-slate-800/80 p-1 rounded-xl flex items-center text-xs font-bold">
                {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg transition-all uppercase text-[11px] ${
                      selectedLevel === lvl
                        ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'all' ? 'Todos' : lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STUDENTS TABLE */}
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
              Cargando matrículas desde Supabase...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-[#0A0E1A]/60 border border-slate-800/70 rounded-2xl p-10 text-center space-y-4">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-300 text-sm">No hay estudiantes registrados en Supabase</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm || selectedLevel !== 'all'
                    ? `No se encontraron resultados para "${searchTerm}" o filtro ${selectedLevel}.`
                    : 'Aún no existen registros en la tabla public.profiles con rol student.'}
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrar Primer Estudiante</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/70">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-800/70">
                  <tr>
                    <th className="py-4 px-6">Alumno & Correo Institucional</th>
                    <th className="py-4 px-6 text-center">Nivel MCER</th>
                    <th className="py-4 px-6">Progreso de Horas</th>
                    <th className="py-4 px-6 text-center">Estado Matrícula</th>
                    <th className="py-4 px-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredStudents.map((st) => {
                    const percent = Math.min(100, Math.round((st.completed_hours / st.total_hours) * 100))
                    return (
                      <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-white text-sm">{st.student_name}</p>
                          <p className="text-[11px] text-slate-400">{st.student_email}</p>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/25">
                            {st.mcer_level}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1 w-48">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                              <span>{st.completed_hours} / {st.total_hours}h</span>
                              <span className="text-emerald-400 font-bold">{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase ${
                            st.status === 'completed'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          }`}>
                            {st.status === 'completed' ? '✓ Completado' : '● Activa'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href="/dashboard/student"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700/70 transition"
                          >
                            <span>Ver Aula</span>
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* MÓDULO SECUNDARIO: ADMISIÓN / BECARIOS URABÁ */}
        <div id="becas" className="bg-[#0F172A]/90 border border-slate-800/70 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/70 pb-5">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400" />
                <span>Postulaciones Pendientes al Fondo de Becas Urabá</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Revisión y pre-aprobación en tiempo real de solicitudes registradas en public.scholarship_applications.
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-500/15 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 w-fit">
              {pendingBecasCount} Pendiente(s)
            </span>
          </div>

          {/* SCHOLARSHIPS TABLE */}
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
              Cargando postulaciones a becas desde Supabase...
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-[#0A0E1A]/60 border border-slate-800/70 rounded-2xl p-10 text-center space-y-2">
              <Heart className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-slate-300 text-sm">No hay postulaciones pendientes en Supabase</h4>
              <p className="text-xs text-slate-500">
                Todas las solicitudes del Fondo Social Urabá han sido procesadas o están al día.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/70">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-xs border-b border-slate-800/70">
                  <tr>
                    <th className="py-4 px-6">Postulante & Teléfono</th>
                    <th className="py-4 px-6">Municipio Urabá</th>
                    <th className="py-4 px-6">Nivel de Estudios</th>
                    <th className="py-4 px-6 text-center">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-white text-sm">{app.full_name}</p>
                        <p className="text-[11px] text-slate-400">{app.phone}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-slate-800/80 text-amber-300 text-[11px] font-semibold rounded-lg border border-slate-700/80 flex items-center gap-1 w-fit">
                          <Building2 className="w-3 h-3 text-amber-400" />
                          <span>{app.municipality}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-medium">
                        {app.academic_level}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                        }`}>
                          {app.status === 'approved' ? '✓ Aprobada' : '● Pendiente'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveApplication(app.id, app.full_name)}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleContactWhatsApp(app.phone, app.full_name, `Hola ${app.full_name}, te escribimos de la Dirección Académica respecto a tu postulación de beca en ${app.municipality}.`)}
                          className="bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 font-medium py-1.5 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  )
}
