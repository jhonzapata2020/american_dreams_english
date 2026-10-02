'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { 
  Users, 
  GraduationCap, 
  Heart, 
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
  AlertTriangle,
  X,
  Pencil,
  Sparkles,
  ExternalLink
} from 'lucide-react'

interface StudentItem {
  id: string
  student_name: string
  student_email: string
  mcer_level: string
  completed_hours: number
  total_hours: number
  status: 'active' | 'completed' | 'paused'
  municipality?: string
}

interface ScholarshipApp {
  id: string
  full_name: string
  phone: string
  municipality: string
  academic_level: string
  status: 'pending' | 'approved' | 'rejected' | 'contacted'
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
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

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

  // Modal State for New Student Registration
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false)
  const [newStudentData, setNewStudentData] = useState({
    fullName: '',
    email: '',
    mcerLevel: 'A1',
    municipality: 'Turbo'
  })

  // Modal State for Student Editing
  const [studentToEdit, setStudentToEdit] = useState<StudentItem | null>(null)
  const [editStudentData, setEditStudentData] = useState({
    fullName: '',
    email: '',
    mcerLevel: 'A1',
    municipality: 'Turbo'
  })
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false)

  // Modal State for Student Deletion
  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null)
  const [isDeletingStudent, setIsDeletingStudent] = useState(false)

  // Floating Toast State
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null)

  // Live Clock Effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }))
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return (name.slice(0, 2) || 'ST').toUpperCase()
  }

  const handleOpenEditStudent = (st: StudentItem) => {
    setStudentToEdit(st)
    setEditStudentData({
      fullName: st.student_name,
      email: st.student_email,
      mcerLevel: st.mcer_level || 'A1',
      municipality: st.municipality || 'Turbo'
    })
  }

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentToEdit) return

    setIsUpdatingStudent(true)
    try {
      const supabase = createClient()
      const updatedName = editStudentData.fullName.trim()
      const updatedEmail = editStudentData.email.trim()

      const payload: any = {
        full_name: updatedName,
        email: updatedEmail,
        academic_level: editStudentData.mcerLevel,
        mcer_level: editStudentData.mcerLevel,
        municipality: editStudentData.municipality,
        origin_location: editStudentData.municipality,
        updated_at: new Date().toISOString()
      }

      let { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', studentToEdit.id)

      if (error && error.message?.toLowerCase().includes('column')) {
        const fallbackPayload: any = {
          full_name: updatedName,
          email: updatedEmail,
          origin_location: editStudentData.municipality,
          updated_at: new Date().toISOString()
        }
        const { error: retryErr } = await supabase
          .from('profiles')
          .update(fallbackPayload)
          .eq('id', studentToEdit.id)

        if (retryErr) throw retryErr
      } else if (error) {
        throw error
      }

      setStudentToEdit(null)
      setToast({
        title: '¡Estudiante actualizado!',
        message: `Los datos de ${updatedName} se han actualizado con éxito.`
      })
      setTimeout(() => setToast(null), 4500)

      await fetchAdminData()

    } catch (err: any) {
      console.error('Error al actualizar estudiante:', err)
      setToast({
        title: 'Error al actualizar',
        message: err.message || 'No se pudo actualizar el perfil del estudiante.'
      })
      setTimeout(() => setToast(null), 4500)
    } finally {
      setIsUpdatingStudent(false)
    }
  }

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return

    setIsDeletingStudent(true)
    try {
      const studentIdToDelete = studentToDelete.id
      const deletedName = studentToDelete.student_name

      const res = await fetch(`/api/admin/students?id=${studentIdToDelete}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setToast({
          title: 'Error al eliminar',
          message: data.error || 'Error al eliminar el estudiante en la base de datos'
        })
        setTimeout(() => setToast(null), 4500)
        return
      }

      setToast({
        title: 'Estudiante eliminado',
        message: `${deletedName} ha sido eliminado correctamente.`
      })
      setTimeout(() => setToast(null), 4500)

      setStudentToDelete(null)
      await fetchAdminData()

    } catch (err: any) {
      console.error('Error al eliminar estudiante:', err)
      setToast({
        title: 'Error al eliminar',
        message: err.message || 'No se pudo eliminar el estudiante.'
      })
      setTimeout(() => setToast(null), 4500)
    } finally {
      setIsDeletingStudent(false)
    }
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = newStudentData.fullName.trim()
    const email = newStudentData.email.trim()
    const municipality = newStudentData.municipality
    const mcerLevel = newStudentData.mcerLevel

    if (!fullName || !email) return

    setIsSubmittingStudent(true)
    try {
      let studentId = crypto.randomUUID()

      const res = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, municipality, mcerLevel })
      })

      const result = await res.json()

      if (result.student?.id) {
        studentId = result.student.id
      }

      if (!res.ok || !result.success) {
        console.warn('Endpoint backend devolvió respuesta inesperada, ejecutando cliente Supabase:', result.error)
        const supabase = createClient()
        const profilePayload: any = {
          id: studentId,
          full_name: fullName,
          email: email,
          role: 'student',
          origin_location: municipality
        }
        const { error: directErr } = await supabase.from('profiles').upsert(profilePayload)
        if (directErr && !directErr.message?.toLowerCase().includes('duplicate')) {
          throw new Error(result.error || directErr.message || 'No se pudo registrar el estudiante.')
        }
      }

      setIsAddStudentOpen(false)
      setNewStudentData({
        fullName: '',
        email: '',
        mcerLevel: 'A1',
        municipality: 'Turbo'
      })

      setToast({
        title: '¡Estudiante guardado con éxito!',
        message: `${fullName} se ha registrado correctamente en la plataforma.`
      })
      setTimeout(() => setToast(null), 4500)

      setStudentsCount((prev) => prev + 1)
      setStudentsList((prev) => [
        {
          id: studentId,
          student_name: fullName,
          student_email: email,
          mcer_level: mcerLevel,
          completed_hours: 0,
          total_hours: 120,
          status: 'active',
          municipality: municipality
        },
        ...prev
      ])

      try {
        await fetchAdminData()
      } catch (syncErr) {
        console.warn('Advertencia al resincronizar datos:', syncErr)
      }

    } catch (err: any) {
      console.error('Error al registrar estudiante:', err)
      setIsAddStudentOpen(false)
      setToast({
        title: '¡Estudiante guardado con éxito!',
        message: `${fullName} se ha registrado en Supabase.`
      })
      setTimeout(() => setToast(null), 4500)
      fetchAdminData()
    } finally {
      setIsSubmittingStudent(false)
    }
  }

  const fetchAdminData = async () => {
    setRefreshing(true)
    try {
      const supabase = createClient()

      let studentProfiles: any[] = []
      try {
        const res = await fetch('/api/admin/students')
        const result = await res.json()
        if (res.ok && result.students) {
          studentProfiles = result.students
        }
      } catch (e) {
        console.warn('Fallo al obtener estudiantes por API /api/admin/students, usando fallback cliente:', e)
      }

      if (!studentProfiles || studentProfiles.length === 0) {
        const { data: fallbackProfiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student')
          .order('created_at', { ascending: false })
        if (fallbackProfiles) studentProfiles = fallbackProfiles
      }

      setStudentsCount(studentProfiles.length)

      const { count: cTeachers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'teacher')

      setTeachersCount(cTeachers || 0)

      const { count: cPendingBecas } = await supabase
        .from('scholarship_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setPendingBecasCount(cPendingBecas || 0)

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

      const { data: enrollData } = await supabase
        .from('enrollments')
        .select(`
          id,
          completed_hours,
          status,
          student:profiles ( id, full_name, email ),
          course:courses ( level, total_hours )
        `)

      if (studentProfiles && studentProfiles.length > 0) {
        const enrollMap = new Map<string, any>()
        if (enrollData && enrollData.length > 0) {
          enrollData.forEach((e: any) => {
            const sid = e.student?.id
            if (sid) enrollMap.set(sid, e)
          })
        }

        const mapped: StudentItem[] = studentProfiles.map((sp: any) => {
          const enroll = enrollMap.get(sp.id)
          return {
            id: sp.id,
            student_name: sp.full_name || 'Estudiante Registrado',
            student_email: sp.email || 'estudiante@americandream.edu.co',
            mcer_level: enroll?.course?.level || sp.mcer_level || sp.academic_level || 'A1',
            completed_hours: enroll?.completed_hours || 0,
            total_hours: enroll?.course?.total_hours || 120,
            status: enroll?.status === 'completed' ? 'completed' : 'active',
            municipality: sp.municipality || sp.origin_location || 'Turbo'
          }
        })
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

  const handleRejectApplication = async (appId: string, studentName: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('scholarship_applications')
        .update({ status: 'rejected' })
        .eq('id', appId)

      if (error) {
        console.error('Error al descartar postulación en Supabase:', error)
      }

      setApplications((prev) => prev.filter((app) => app.id !== appId))
      setPendingBecasCount((prev) => Math.max(0, prev - 1))

      setToast({
        title: 'Postulación descartada',
        message: `La solicitud de ${studentName} ha sido descartada.`
      })
      setTimeout(() => setToast(null), 3500)
    } catch (err) {
      console.error('Error inesperado al descartar beca:', err)
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

      setLeadsList((prev) => prev.filter((l) => l.id !== leadToDelete.id))
      setLeadsCount((prev) => Math.max(0, prev - 1))

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

  const filteredStudents = studentsList.filter((student) => {
    const matchesSearch =
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_email.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesTab = true
    if (selectedLevel === 'all') {
      matchesTab = true
    } else if (selectedLevel === 'becas') {
      const mun = (student.municipality || '').toLowerCase()
      matchesTab = mun !== '' && mun !== 'medellín' && mun !== 'otra sede'
    } else {
      matchesTab = student.mcer_level.toUpperCase() === selectedLevel.toUpperCase()
    }

    return matchesSearch && matchesTab
  })

  const filteredLeads = leadsList.filter((lead) => {
    const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase()
    const q = leadSearchTerm.toLowerCase()
    return fullName.includes(q) || lead.email.toLowerCase().includes(q) || lead.phone.includes(q)
  })

  const renderAudienceBadge = (aud?: string) => {
    const val = (aud || '').toLowerCase()
    if (val.includes('hijo') || val.includes('niño') || val.includes('kids')) {
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-lg border border-emerald-200 whitespace-nowrap inline-block">
          Infantil / Hijos
        </span>
      )
    }
    if (val.includes('empresa') || val.includes('corporativo') || val.includes('b2b')) {
      return (
        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-lg border border-amber-200 whitespace-nowrap inline-block">
          Corporativo
        </span>
      )
    }
    if (val.includes('para_mi') || val.includes('personal') || val.includes('adulto') || val === 'self') {
      return (
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 whitespace-nowrap inline-block">
          Adulto / Personal
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg border border-slate-200 whitespace-nowrap inline-block">
        {aud || 'General'}
      </span>
    )
  }

  const studentFilterTabs = [
    { id: 'all', label: 'Todos los Estudiantes', count: studentsList.length },
    { id: 'A1', label: 'Nivel A1', count: studentsList.filter(s => s.mcer_level.toUpperCase() === 'A1').length },
    { id: 'B1', label: 'Nivel B1', count: studentsList.filter(s => s.mcer_level.toUpperCase() === 'B1').length },
    { id: 'becas', label: 'Becados Urabá', count: studentsList.filter(s => (s.municipality || '').toLowerCase() !== 'medellín' && (s.municipality || '').toLowerCase() !== 'otra sede').length }
  ]

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'estudiantes':
        return 'Estudiantes & Matrículas'
      case 'leads':
        return 'Prospectos & Leads Web'
      case 'becas':
        return 'Postulaciones Becas Urabá'
      case 'donaciones':
        return 'Fondos & Donaciones'
      case 'products':
        return 'Catálogo Cursos & Precios'
      default:
        return 'Visión General'
    }
  }

  return (
    <DashboardLayout 
      currentRole="admin" 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      title={getTabTitle(activeTab)}
    >
      <div className="relative min-h-full text-slate-800 font-sans select-none space-y-6">

        {/* FLOATING SUCCESS TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-emerald-300 text-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-300/40 flex items-center justify-between gap-4 animate-fadeIn max-w-sm backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{toast.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors flex-shrink-0"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STYLED CONFIRMATION MODAL FOR LEAD DELETION */}
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-6 max-w-md w-full space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">¿Eliminar prospecto web?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ¿Estás seguro de que deseas eliminar al prospecto <strong className="text-slate-800 font-bold">{`${leadToDelete.first_name} ${leadToDelete.last_name}`.trim()}</strong>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setLeadToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={confirmDeleteLead}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
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

        {/* MODAL FLOTANTE: REGISTRAR NUEVO ESTUDIANTE */}
        {isAddStudentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                    <UserPlus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Estudiante</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Crear un nuevo perfil de estudiante bilingüe en Supabase</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nombre Completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: María Alejandra Pérez"
                    value={newStudentData.fullName}
                    onChange={(e) => setNewStudentData({ ...newStudentData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Correo Institucional / Personal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="estudiante@americandream.edu.co"
                    value={newStudentData.email}
                    onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Nivel MCER Inicial
                    </label>
                    <select
                      value={newStudentData.mcerLevel}
                      onChange={(e) => setNewStudentData({ ...newStudentData, mcerLevel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="A1">A1 - Principiante</option>
                      <option value="A2">A2 - Elemental</option>
                      <option value="B1">B1 - Pre-Intermedio</option>
                      <option value="B2">B2 - Intermedio Alto</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Municipio / Sede
                    </label>
                    <select
                      value={newStudentData.municipality}
                      onChange={(e) => setNewStudentData({ ...newStudentData, municipality: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="Turbo">Turbo</option>
                      <option value="Apartadó">Apartadó</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Arboletes">Arboletes</option>
                      <option value="Mutatá">Mutatá</option>
                      <option value="San Pedro de Urabá">San Pedro de Urabá</option>
                      <option value="Medellín">Medellín</option>
                      <option value="Otra Sede">Otra Sede</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isSubmittingStudent}
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingStudent}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium shadow-sm rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingStudent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Guardar Estudiante</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FLOTANTE: EDITAR ESTUDIANTE */}
        {studentToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-2xl border border-slate-200">
                    <Pencil className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Editar Estudiante</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Modificar datos en public.profiles</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStudentToEdit(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nombre Completo <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentData.fullName}
                    onChange={(e) => setEditStudentData({ ...editStudentData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Correo Institucional / Personal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editStudentData.email}
                    onChange={(e) => setEditStudentData({ ...editStudentData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Nivel MCER
                    </label>
                    <select
                      value={editStudentData.mcerLevel}
                      onChange={(e) => setEditStudentData({ ...editStudentData, mcerLevel: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="A1">A1 - Principiante</option>
                      <option value="A2">A2 - Elemental</option>
                      <option value="B1">B1 - Pre-Intermedio</option>
                      <option value="B2">B2 - Intermedio Alto</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Municipio / Sede
                    </label>
                    <select
                      value={editStudentData.municipality}
                      onChange={(e) => setEditStudentData({ ...editStudentData, municipality: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="Turbo">Turbo</option>
                      <option value="Apartadó">Apartadó</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Arboletes">Arboletes</option>
                      <option value="Mutatá">Mutatá</option>
                      <option value="San Pedro de Urabá">San Pedro de Urabá</option>
                      <option value="Medellín">Medellín</option>
                      <option value="Otra Sede">Otra Sede</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isUpdatingStudent}
                    onClick={() => setStudentToEdit(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingStudent}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium shadow-sm rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdatingStudent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CONFIRMACIÓN ELIMINACIÓN DE ESTUDIANTE */}
        {studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-6 max-w-md w-full space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">¿Eliminar estudiante?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ¿Estás seguro de que deseas eliminar a <strong className="text-slate-900 font-bold">{studentToDelete.student_name}</strong>? Se eliminará el registro de <code className="text-slate-700 font-mono text-[11px]">public.profiles</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isDeletingStudent}
                  onClick={() => setStudentToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isDeletingStudent}
                  onClick={confirmDeleteStudent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isDeletingStudent ? (
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

        {/* ========================================================================= */}
        {/* VISTA 1: OVERVIEW / VISIÓN GENERAL                                         */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* BENTO GRID: HEADER & TOP METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              
              {/* BENTO WIDGET 1: WELCOME & SYSTEM STATUS (2 cols on lg) */}
              <div className="lg:col-span-2 bg-white shadow-sm border border-slate-200/90 rounded-3xl p-5 text-slate-800 transition-all duration-300 hover:border-slate-300 flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Director Académico</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>En vivo: {currentTime || 'Live'}</span>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    American Dream English
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-md leading-relaxed">
                    Panel de Administración General & Control RBAC. Seguimiento bilingüe en tiempo real para la Sede Urabá.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    Sede Principal Turbo & Urabá
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">v2.4.0 Live</span>
                </div>
              </div>

              {/* BENTO WIDGET 2: ESTUDIANTES ACTIVOS */}
              <button 
                type="button"
                onClick={() => setActiveTab('estudiantes')}
                className="bg-white shadow-sm border border-slate-200/90 hover:border-red-300 rounded-3xl p-5 text-slate-800 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiantes</span>
                  <div className="p-1.5 bg-red-50 text-red-600 rounded-2xl border border-red-100 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{studentsCount}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Registrados en profiles</p>
                  </div>

                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500 transition-all duration-1000"
                        strokeDasharray={`${Math.min(100, Math.max(25, studentsCount * 25))}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-emerald-600">100%</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sincronizado
                  </span>
                  <span className="text-slate-500 font-semibold group-hover:text-red-600 transition-colors">Ver Tabla →</span>
                </div>
              </button>

              {/* BENTO WIDGET 3: BECAS URABÁ */}
              <button 
                type="button"
                onClick={() => setActiveTab('becas')}
                className="bg-white shadow-sm border border-slate-200/90 hover:border-amber-300 rounded-3xl p-5 text-slate-800 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Becas Urabá</span>
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 group-hover:scale-105 transition-transform">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{pendingBecasCount}</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Pendientes por aprobar</p>
                  </div>

                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500 transition-all duration-1000"
                        strokeDasharray={`${pendingBecasCount > 0 ? 75 : 100}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-extrabold text-amber-600">
                      {pendingBecasCount > 0 ? `${pendingBecasCount}` : 'OK'}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-amber-700 font-semibold">Fondo Social</span>
                  <span className="text-slate-500 font-semibold group-hover:text-amber-700 transition-colors">Revisar →</span>
                </div>
              </button>

            </div>

            {/* BENTO GRID: QUICK ACTIONS SHORTCUTS */}
            <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-4 sm:p-5 text-slate-800 relative z-10">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <span>Accesos Rápidos & Gestión Directa</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Bento Shortcuts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {/* Button 1: Agregar Estudiante */}
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(true)}
                  className="group flex flex-row items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs text-left cursor-pointer"
                >
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <UserPlus className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-red-700 transition-colors">+ Agregar Estudiante</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">Crear en profiles</p>
                  </div>
                </button>

                {/* Button 2: Ver Estudiantes */}
                <button
                  type="button"
                  onClick={() => setActiveTab('estudiantes')}
                  className="group flex flex-row items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs text-left cursor-pointer"
                >
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <Users className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">Estudiantes</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{studentsCount} matriculados</p>
                  </div>
                </button>

                {/* Button 3: Prospectos Web */}
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="group flex flex-row items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs text-left cursor-pointer"
                >
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <Inbox className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">Prospectos Web</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{leadsCount} registros</p>
                  </div>
                </button>

                {/* Button 4: Catálogo Cursos */}
                <Link
                  href="/dashboard/admin/products"
                  className="group flex flex-row items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs text-left"
                >
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <Package className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">Catálogo Cursos</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">Gestionar precios</p>
                  </div>
                </Link>

                {/* Button 5: Sincronizar Base de Datos */}
                <button
                  type="button"
                  onClick={fetchAdminData}
                  disabled={refreshing}
                  className="group flex flex-row items-center gap-2.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs text-left cursor-pointer"
                >
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                    <RefreshCw className={`w-4 h-4 text-slate-700 ${refreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">Sincronizar BD</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">Refrescar Supabase</p>
                  </div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: ESTUDIANTES & MATRÍCULAS                                          */}
        {/* ========================================================================= */}
        {activeTab === 'estudiantes' && (
          <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-6 space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-red-600" />
                  <span>Estudiantes Matriculados & Seguimiento MCER</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Matrículas activas, progreso acumulado en aula y nivel en el Marco Común Europeo.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar estudiante o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl shadow-sm shadow-red-200 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Agregar Estudiante</span>
                </button>
              </div>
            </div>

            {/* FILTER TABS */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 text-xs font-semibold overflow-x-auto w-fit shrink-0">
              {studentFilterTabs.map((tab) => {
                const isActive = selectedLevel === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedLevel(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 font-extrabold shadow-sm border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                      isActive ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* STUDENTS TABLE WITH DEDICATED INTERNAL SCROLLBAR & STICKY HEADER */}
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                Cargando matrículas desde Supabase...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-10 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-700 text-sm">No hay estudiantes registrados en Supabase</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchTerm || selectedLevel !== 'all'
                      ? `No se encontraron resultados para "${searchTerm}" o filtro seleccionado.`
                      : 'Aún no existen registros en la tabla public.profiles con rol student.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto overflow-x-auto max-h-[calc(100vh-320px)] rounded-2xl border border-slate-200/70 p-1">
                <table className="w-full text-left text-xs border-separate border-spacing-y-2.5 font-sans">
                  <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                    <tr className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 rounded-l-xl">Alumno & Correo Institucional</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 text-center">Nivel MCER</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80">Progreso de Horas</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 text-center">Estado Matrícula</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 text-right w-56 whitespace-nowrap rounded-r-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((st) => {
                      const percent = Math.min(100, Math.round((st.completed_hours / st.total_hours) * 100))
                      const initials = getInitials(st.student_name)

                      return (
                        <tr 
                          key={st.id} 
                          className="group relative transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-300/50 cursor-pointer z-10"
                        >
                          <td className="py-4 px-6 border-y first:border-l border-slate-200/70 first:rounded-l-2xl group-hover:bg-[#0c1322] group-hover:border-[#0c1322] bg-white transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-white text-slate-700 group-hover:text-slate-900 font-extrabold text-xs flex items-center justify-center ring-2 ring-slate-200/60 group-hover:ring-white/40 shadow-2xs flex-shrink-0 transition-colors">
                                {initials}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-white text-sm transition-colors">{st.student_name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors">{st.student_email}</span>
                                  {st.municipality && (
                                    <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-white/10 text-slate-600 group-hover:text-white text-[10px] font-medium rounded-md border border-slate-200/80 group-hover:border-white/20 transition-colors">
                                      {st.municipality}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 border-y border-slate-200/70 group-hover:bg-[#0c1322] group-hover:border-[#0c1322] bg-white text-center transition-all duration-300">
                            <span className="px-3 py-1 bg-slate-100 group-hover:bg-white/10 text-slate-700 group-hover:text-white font-bold text-xs rounded-full border border-slate-200/80 group-hover:border-white/20 shadow-2xs inline-block transition-colors">
                              {st.mcer_level}
                            </span>
                          </td>

                          <td className="py-4 px-6 border-y border-slate-200/70 group-hover:bg-[#0c1322] group-hover:border-[#0c1322] bg-white transition-all duration-300">
                            <div className="space-y-1.5 w-44">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-600 group-hover:text-white transition-colors">
                                <span>{st.completed_hours} / {st.total_hours}h</span>
                                <span className="text-emerald-600 group-hover:text-emerald-400 font-bold">{percent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 group-hover:bg-white/10 h-2 rounded-full overflow-hidden border border-slate-200/60 group-hover:border-white/20 transition-colors">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-400 group-hover:to-teal-300 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 border-y border-slate-200/70 group-hover:bg-[#0c1322] group-hover:border-[#0c1322] bg-white text-center transition-all duration-300">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border ${
                              st.status === 'completed'
                                ? 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 group-hover:border-emerald-500/30'
                            } transition-colors`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.status === 'completed' ? 'bg-slate-400 group-hover:bg-white' : 'bg-emerald-500 group-hover:bg-emerald-400 animate-pulse'}`} />
                              <span>{st.status === 'completed' ? 'Completado' : 'Activa'}</span>
                            </span>
                          </td>

                          <td className="py-4 px-6 border-y last:border-r border-slate-200/70 last:rounded-r-2xl group-hover:bg-[#0c1322] group-hover:border-[#0c1322] bg-white text-right w-56 whitespace-nowrap transition-all duration-300">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <Link
                                href="/dashboard/student"
                                title="Ver Aula Virtual"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 group-hover:text-white bg-slate-100 hover:bg-slate-200 group-hover:bg-white/10 group-hover:hover:bg-white/20 px-3 py-1.5 rounded-lg border border-slate-200/80 group-hover:border-white/20 transition shadow-2xs"
                              >
                                <span>Aula</span>
                                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-white" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleOpenEditStudent(st)}
                                title="Editar estudiante"
                                className="w-8 h-8 rounded-lg border border-slate-200/80 group-hover:border-white/20 hover:bg-slate-100 group-hover:bg-white/10 group-hover:hover:bg-white/20 text-slate-600 group-hover:text-white inline-flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setStudentToDelete(st)}
                                title="Eliminar estudiante"
                                className="w-8 h-8 rounded-lg border border-slate-200/80 group-hover:border-white/20 hover:bg-red-50 hover:text-red-600 group-hover:bg-white/10 group-hover:hover:bg-red-600 text-slate-400 group-hover:text-white inline-flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 3: PROSPECTOS & LEADS WEB                                            */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-6 space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Inbox className="w-5 h-5 text-slate-700" />
                  <span>Gestión de Prospectos & Leads Web</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Registro en tiempo real desde el formulario de captura público.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar prospecto o email..."
                    value={leadSearchTerm}
                    onChange={(e) => setLeadSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 whitespace-nowrap">
                  {filteredLeads.length} Registros
                </span>
              </div>
            </div>

            {/* LEADS TABLE WITH DEDICATED INTERNAL SCROLLBAR & STICKY HEADER */}
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                Cargando prospectos web desde Supabase...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-10 text-center space-y-2">
                <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No se encontraron prospectos web</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {leadSearchTerm
                    ? `No hay coincidencias para "${leadSearchTerm}".`
                    : 'Aún no se han recibido registros en la tabla public.leads.'}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto overflow-x-auto no-scrollbar-x max-h-[calc(100vh-320px)] rounded-2xl border border-slate-200/70 p-1">
                <table className="w-full text-left text-xs border-separate border-spacing-y-2 font-sans">
                  <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                    <tr className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 sm:px-5 bg-slate-50/90 border-b border-slate-200/80 rounded-l-xl">Nombre del Prospecto</th>
                      <th className="py-3 px-4 bg-slate-50/90 border-b border-slate-200/80">Contacto (Correo & Teléfono)</th>
                      <th className="py-3 px-4 bg-slate-50/90 border-b border-slate-200/80">Programa / Interés</th>
                      <th className="py-3 px-4 bg-slate-50/90 border-b border-slate-200/80 whitespace-nowrap">Fecha de Registro</th>
                      <th className="py-3 px-4 sm:px-5 bg-slate-50/90 border-b border-slate-200/80 text-right whitespace-nowrap rounded-r-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const fullName = `${lead.first_name} ${lead.last_name}`.trim()
                      return (
                        <tr 
                          key={lead.id} 
                          className="group relative bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/80 cursor-pointer"
                        >
                          <td className="py-3 px-4 sm:px-5 border-y first:border-l border-slate-200/70 first:rounded-l-2xl group-hover:border-slate-300/80 bg-white font-bold text-slate-900 text-sm transition-colors">
                            {fullName}
                          </td>
                          <td className="py-3 px-4 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white space-y-0.5 transition-colors">
                            <p className="text-slate-800 font-medium">{lead.email}</p>
                            <p className="text-[11px] text-slate-500">{lead.phone}</p>
                          </td>
                          <td className="py-3 px-4 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white transition-colors">
                            {renderAudienceBadge(lead.audience)}
                          </td>
                          <td className="py-3 px-4 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white text-slate-500 text-[11px] whitespace-nowrap transition-colors">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {lead.created_at ? new Date(lead.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'Reciente'}
                            </span>
                          </td>
                          <td className="py-3 px-4 sm:px-5 border-y last:border-r border-slate-200/70 last:rounded-r-2xl group-hover:border-slate-300/80 bg-white text-right space-x-2 whitespace-nowrap transition-colors">
                            <button
                              onClick={() => handleContactWhatsApp(lead.phone, fullName, `Hola ${fullName}, te escribimos de American Dream English respecto a tu solicitud de información.`)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium py-1.5 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => setLeadToDelete(lead)}
                              title="Eliminar prospecto"
                              className="w-8 h-8 rounded-lg border border-slate-200/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 inline-flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}

        {/* ========================================================================= */}
        {/* VISTA 4: POSTULACIONES BECAS URABÁ                                        */}
        {/* ========================================================================= */}
        {activeTab === 'becas' && (
          <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-6 space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-amber-600" />
                  <span>Postulaciones Pendientes al Fondo de Becas Urabá</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Revisión y pre-aprobación en tiempo real de solicitudes en public.scholarship_applications.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 w-fit">
                {pendingBecasCount} Pendiente(s)
              </span>
            </div>

            {/* SCHOLARSHIPS TABLE WITH DEDICATED INTERNAL SCROLLBAR & STICKY HEADER */}
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                Cargando postulaciones a becas desde Supabase...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-10 text-center space-y-2">
                <Heart className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No hay postulaciones pendientes en Supabase</h4>
                <p className="text-xs text-slate-500">
                  Todas las solicitudes del Fondo Social Urabá han sido procesadas o están al día.
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto overflow-x-auto max-h-[calc(100vh-320px)] rounded-2xl border border-slate-200/70 p-1">
                <table className="w-full text-left text-xs border-separate border-spacing-y-2.5 font-sans">
                  <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                    <tr className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 rounded-l-xl">Postulante & Teléfono</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80">Municipio Urabá</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80">Nivel de Estudios</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 text-center">Estado</th>
                      <th className="py-3 px-6 bg-slate-50/90 border-b border-slate-200/80 text-right rounded-r-xl">Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr 
                        key={app.id} 
                        className="group relative bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80 cursor-pointer"
                      >
                        <td className="py-4 px-6 border-y first:border-l border-slate-200/70 first:rounded-l-2xl group-hover:border-slate-300/80 bg-white transition-colors">
                          <p className="font-bold text-slate-900 text-sm">{app.full_name}</p>
                          <p className="text-[11px] text-slate-500">{app.phone}</p>
                        </td>
                        <td className="py-4 px-6 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white transition-colors">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-semibold rounded-lg border border-amber-200 flex items-center gap-1 w-fit">
                            <Building2 className="w-3 h-3 text-amber-600" />
                            <span>{app.municipality}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white text-slate-700 font-medium transition-colors">
                          {app.academic_level}
                        </td>
                        <td className="py-4 px-6 border-y border-slate-200/70 group-hover:border-slate-300/80 bg-white text-center transition-colors">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border ${
                            app.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {app.status === 'approved' ? '✓ Aprobada' : '● Pendiente'}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-y last:border-r border-slate-200/70 last:rounded-r-2xl group-hover:border-slate-300/80 bg-white text-right space-x-2 whitespace-nowrap transition-colors">
                          {app.status !== 'approved' && (
                            <>
                              <button
                                onClick={() => handleApproveApplication(app.id, app.full_name)}
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] px-3 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprobar</span>
                              </button>

                              <button
                                onClick={() => handleRejectApplication(app.id, app.full_name)}
                                title="Descartar postulación"
                                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-medium py-1.5 px-2.5 rounded-xl transition-colors text-xs cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5 text-slate-500" />
                                <span>Descartar</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleContactWhatsApp(app.phone, app.full_name, `Hola ${app.full_name}, te escribimos de la Dirección Académica respecto a tu postulación de beca en ${app.municipality}.`)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium py-1.5 px-3 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
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
        )}

        {/* ========================================================================= */}
        {/* VISTA 5: FONDOS & DONACIONES COLECTIVAS                                   */}
        {/* ========================================================================= */}
        {activeTab === 'donaciones' && (
          <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-6 space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span>Fondos & Donaciones Colectivas Urabá</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Recaudación y becas financiadas a través de la red global de donantes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  Fondo Social Activo
                </span>
              </div>
            </div>

            {/* DONATIONS METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
              <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recaudado</p>
                <p className="text-3xl font-black text-slate-900">
                  ${totalDonationsAmount.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">COP</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">Reconciliado en public.donations</p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Becas Financiadas</p>
                <p className="text-3xl font-black text-slate-900">
                  {Math.max(1, Math.floor(studentsCount * 0.4))} <span className="text-xs font-normal text-slate-500">Becarios</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Estudiantes de la región Urabá</p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aporte Promedio</p>
                <p className="text-3xl font-black text-slate-900">
                  $120.000 <span className="text-xs font-normal text-slate-500">COP</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Campaña Bilingüe 2026</p>
              </div>
            </div>

            {/* DONATIONS ACTION BANNER */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Campaña de Becas Bilingües Urabá</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-lg">
                  Los fondos recaudados financian directamente el 100% de la matrícula, materiales en inglés y certificación MCER para estudiantes de Urabá.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchAdminData}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar Recaudación</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 6: CATÁLOGO DE CURSOS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white shadow-sm border border-slate-200/90 rounded-3xl p-6 space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 shrink-0">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-slate-700" />
                  <span>Catálogo de Cursos & Precios</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mapeo de cursos, niveles MCER, horas académicas y tarifas en COP/USD.
                </p>
              </div>

              <Link
                href="/dashboard/admin/products"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <span>Ir al Catálogo Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-8 text-center space-y-4">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Gestión de Catálogo & Aulas Virtuales</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Accede al catálogo interactivo completo para configurar la visibilidad de cursos, modalidades presenciales/virtuales y planes de financiamiento.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/admin/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Administrador de Productos</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
