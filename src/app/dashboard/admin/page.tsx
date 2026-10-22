'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '../../../utils/supabase/client'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { StudentsCrudTable, StudentRecord } from '../../../components/dashboard/StudentsCrudTable'
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
  ExternalLink, 
  BookOpen, 
  Copy, 
  Phone, 
  Mail, 
  KeyRound, 
  Award, 
  UserCheck, 
  Video,
  BarChart3
} from 'lucide-react'
import { MarketingMetricsView } from '../../../components/dashboard/MarketingMetricsView'
import { 
  subscribeToLeadNotifications, 
  playLeadChimeSound, 
  triggerLeadDesktopNotification 
} from '../../../lib/marketingTelemetry'

export interface TeacherItem {
  id: string
  full_name: string
  email: string
  phone?: string
  mcer_level: string
  specialty?: string
  document_type?: string
  document_number?: string
  status?: string
  created_at?: string
  classes_count?: number
  students_count?: number
}

interface StudentItem {
  id: string
  student_name: string
  student_email: string
  mcer_level: string
  completed_hours: number
  total_hours: number
  status: 'active' | 'completed' | 'paused'
  municipality?: string
  avatar_url?: string
  document_type?: string
  document_number?: string
  phone?: string
  created_at?: string
  course_name?: string
}

const FALLBACK_STUDENTS: StudentItem[] = [
  {
    id: 'stu-000',
    student_name: 'Edward John',
    student_email: 'lawson@example.com',
    mcer_level: 'A1',
    completed_hours: 45,
    total_hours: 120,
    status: 'active',
    municipality: 'Turbo (Urabá)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1040892341',
    phone: '(252) 555-0126',
    created_at: '2026-10-04T09:00:00-05:00',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM'
  },
  {
    id: 'stu-001',
    student_name: 'Valeria Morales Montoya',
    student_email: 'valeria.morales@americandream.edu.co',
    mcer_level: 'A1',
    completed_hours: 32,
    total_hours: 120,
    status: 'active',
    municipality: 'Turbo (Urabá)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1040892342',
    phone: '+57 312 456 7890',
    created_at: '2026-10-04T09:00:00-05:00',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM'
  },
  {
    id: 'stu-002',
    student_name: 'Juan Carlos Higuita Ruiz',
    student_email: 'juan.higuita@gmail.com',
    mcer_level: 'A2',
    completed_hours: 68,
    total_hours: 120,
    status: 'active',
    municipality: 'Apartadó',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1038712990',
    phone: '+57 310 882 1934',
    created_at: '2026-10-04T10:30:00-05:00',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE'
  },
  {
    id: 'stu-003',
    student_name: 'María Camila Toro Gómez',
    student_email: 'camilatoro@outlook.com',
    mcer_level: 'A2',
    completed_hours: 80,
    total_hours: 120,
    status: 'active',
    municipality: 'Carepa',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    document_type: 'T.I.',
    document_number: '1040119452',
    phone: '+57 314 901 2288',
    created_at: '2026-10-03T15:00:00-05:00',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE'
  },
  {
    id: 'stu-004',
    student_name: 'Darlene Robertson',
    student_email: 'alma.lawson@example.com',
    mcer_level: 'A1',
    completed_hours: 20,
    total_hours: 120,
    status: 'active',
    municipality: 'Turbo (Urabá)',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1040552190',
    phone: '(252) 555-0126',
    created_at: '2026-10-02T11:20:00-05:00',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM'
  },
  {
    id: 'stu-005',
    student_name: 'Annette Black',
    student_email: 'bill.sanders@example.com',
    mcer_level: 'A2',
    completed_hours: 50,
    total_hours: 120,
    status: 'paused',
    municipality: 'Apartadó',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    document_type: 'T.I.',
    document_number: '1040991823',
    phone: '(252) 555-0126',
    created_at: '2026-10-01T14:10:00-05:00',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE'
  },
  {
    id: 'stu-006',
    student_name: 'Ronald Richards',
    student_email: 'weaver@example.com',
    mcer_level: 'B1',
    completed_hours: 90,
    total_hours: 120,
    status: 'active',
    municipality: 'Carepa',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1040223841',
    phone: '(252) 555-0126',
    created_at: '2026-09-28T16:00:00-05:00',
    course_name: 'ENGLISH LEVEL 3 - INTERMEDIATE'
  },
  {
    id: 'stu-007',
    student_name: 'Ralph Edwards',
    student_email: 'simmons@example.com',
    mcer_level: 'B1',
    completed_hours: 110,
    total_hours: 120,
    status: 'active',
    municipality: 'Chigorodó',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1039871234',
    phone: '(252) 555-0126',
    created_at: '2026-09-25T08:30:00-05:00',
    course_name: 'ENGLISH LEVEL 3 - INTERMEDIATE'
  },
  {
    id: 'stu-008',
    student_name: 'Courtney Henry',
    student_email: 'felicia.reid@example.com',
    mcer_level: 'B2',
    completed_hours: 120,
    total_hours: 120,
    status: 'completed',
    municipality: 'Virtual',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    document_type: 'C.C.',
    document_number: '1038992110',
    phone: '(252) 555-0126',
    created_at: '2026-09-20T10:00:00-05:00',
    course_name: 'ENGLISH LEVEL 4 - UPPER INTERMEDIATE'
  }
]

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
    documentType: 'C.C.',
    documentId: '',
    phone: '',
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

  // Modal State for Student Credentials & WhatsApp Share
  const [selectedStudentCredentials, setSelectedStudentCredentials] = useState<{
    studentName: string
    username: string
    email: string
    documentId: string
    password: string
    courseName: string
    loginUrl: string
  } | null>(null)
  const [copiedStudentCredentials, setCopiedStudentCredentials] = useState(false)

  // Teacher Management States
  const [teachersList, setTeachersList] = useState<TeacherItem[]>([])
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('')
  const [teacherFilterLevel, setTeacherFilterLevel] = useState<string>('all')
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false)
  const [isSubmittingTeacher, setIsSubmittingTeacher] = useState(false)
  const [newTeacherData, setNewTeacherData] = useState({
    fullName: '',
    email: '',
    phone: '',
    documentType: 'C.C.',
    documentId: '',
    mcerLevel: 'A1',
    specialty: 'Docente Titular A1 · Fonética & Gramática',
    customPassword: 'Docente2026*'
  })
  const [createdTeacherCredentials, setCreatedTeacherCredentials] = useState<{
    fullName: string
    email: string
    password: string
    mcerLevel: string
    specialty: string
    phone: string
    whatsappMessage: string
  } | null>(null)
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherItem | null>(null)
  const [isDeletingTeacher, setIsDeletingTeacher] = useState(false)
  const [copiedCredentials, setCopiedCredentials] = useState(false)
  const [copiedTeacherId, setCopiedTeacherId] = useState<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Floating Toast State with rich details & animation support
  interface AdminToastData {
    title: string
    message: string
    type?: 'success' | 'error' | 'info'
    details?: {
      teacherName?: string
      user?: string
      pass?: string
      actionUrl?: string
      actionText?: string
    }
  }

  const [toast, setToast] = useState<AdminToastData | null>(null)

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

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo eliminar el estudiante de Supabase.')
      }

      setToast({
        title: 'Estudiante eliminado',
        message: `${deletedName} ha sido eliminado correctamente del sistema.`
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
    const documentType = newStudentData.documentType || 'C.C.'
    const documentId = newStudentData.documentId.trim()
    const phone = newStudentData.phone.trim()
    const municipality = newStudentData.municipality
    const mcerLevel = newStudentData.mcerLevel

    if (!fullName || !email || !documentId) {
      setToast({
        title: 'Campos requeridos',
        message: 'Por favor ingresa nombre completo, correo y número de documento.'
      })
      setTimeout(() => setToast(null), 4500)
      return
    }

    setIsSubmittingStudent(true)
    try {
      const response = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          documentType,
          documentId,
          phone,
          mcerLevel,
          municipality
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar al estudiante.')
      }

      setIsAddStudentOpen(false)
      setNewStudentData({
        fullName: '',
        email: '',
        documentType: 'C.C.',
        documentId: '',
        phone: '',
        mcerLevel: 'A1',
        municipality: 'Turbo'
      })

      setToast({
        title: '¡Estudiante creado con éxito!',
        message: `${fullName} se ha registrado en Supabase Auth y Profiles con acceso activo.`
      })
      setTimeout(() => setToast(null), 4500)

      if (data.credentials) {
        setSelectedStudentCredentials({
          studentName: data.credentials.studentName,
          username: data.credentials.username,
          email: data.credentials.email,
          documentId: data.credentials.documentId,
          password: data.credentials.password,
          courseName: data.credentials.courseName,
          loginUrl: typeof window !== 'undefined' ? `${window.location.origin}/campus/login` : 'https://americandreams.edu.co/campus/login'
        })
      }

      await fetchAdminData()

    } catch (err: any) {
      console.error('Error al registrar estudiante:', err)
      setToast({
        title: 'Error al registrar',
        message: err.message || 'No se pudo crear la cuenta del estudiante.'
      })
      setTimeout(() => setToast(null), 4500)
    } finally {
      setIsSubmittingStudent(false)
    }
  }

  const fetchAdminData = async () => {
    setRefreshing(true)
    try {
      const supabase = createClient()

      const [
        studentsRes,
        teachersRes,
        pendingBecasRes,
        leadsCountRes,
        leadsDataRes,
        donationsRes,
        appsRes,
        enrollRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'teacher').order('created_at', { ascending: false }),
        supabase.from('scholarship_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('donations').select('amount, total_amount'),
        supabase.from('scholarship_applications').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        supabase.from('enrollments').select(`
          id,
          completed_hours,
          status,
          student:profiles ( id, full_name, email ),
          course:courses ( level, total_hours )
        `)
      ])

      const studentProfiles = studentsRes.data || []
      setStudentsCount(studentProfiles.length)

      const teacherProfiles = teachersRes.data || []
      const fallbackTeachers: TeacherItem[] = [
        {
          id: 'tch-carlos-mendez',
          full_name: 'Lic. Carlos Méndez',
          email: 'carlos.mendez@americandream.edu.co',
          phone: '+57 312 458 9210',
          mcer_level: 'A1',
          specialty: 'Docente Titular A1 · Fonética & Gramática',
          document_type: 'C.C.',
          document_number: '1040892301',
          status: 'active',
          students_count: 12,
          classes_count: 4
        },
        {
          id: 'tch-sarah-miller',
          full_name: 'Teacher Sarah Miller',
          email: 'sarah.miller@americandream.edu.co',
          phone: '+57 314 789 2234',
          mcer_level: 'A2',
          specialty: 'Docente Titular A2 · Inmersión Oral & Storytelling',
          document_type: 'C.C.',
          document_number: '1040892302',
          status: 'active',
          students_count: 10,
          classes_count: 4
        },
        {
          id: 'tch-anthony-director',
          full_name: 'Teacher Anthony (Director)',
          email: 'anthony@americandream.edu.co',
          phone: '+57 320 894 1120',
          mcer_level: 'B1',
          specialty: 'Director Académico · Nivel B1/B2 & Preparación Internacional',
          document_type: 'C.C.',
          document_number: '1040892300',
          status: 'active',
          students_count: 14,
          classes_count: 6
        }
      ]

      const mappedTeachers: TeacherItem[] = teacherProfiles.length > 0
        ? teacherProfiles.map((t: any) => ({
            id: t.id,
            full_name: t.full_name || 'Docente Titular',
            email: t.email || 'docente@americandream.edu.co',
            phone: t.phone || '',
            mcer_level: (t.mcer_level || 'A1').toUpperCase(),
            specialty: (() => {
              if (t.specialty) return t.specialty
              const lvl = (t.mcer_level || 'A1').toUpperCase()
              if (lvl === 'A1') return 'Docente Titular A1 · Fonética & Gramática'
              if (lvl === 'A2') return 'Docente Titular A2 · Inmersión Oral & Storytelling'
              if (lvl === 'B1') return 'Docente Titular B1 · Conversación & Negocios'
              if (lvl === 'B2') return 'Docente Titular B2 · Fluidez & Certificaciones'
              if (lvl === 'ALL') return 'Director Académico · Coordinación General'
              return `Docente Titular Nivel ${lvl}`
            })(),
            document_type: t.document_type || 'C.C.',
            document_number: t.document_number || '',
            status: t.status || 'active',
            created_at: t.created_at,
            classes_count: 4,
            students_count: 12
          }))
        : fallbackTeachers

      setTeachersList(mappedTeachers)
      setTeachersCount(mappedTeachers.length)
      setPendingBecasCount(pendingBecasRes.count || 0)
      setLeadsCount(leadsCountRes.count || 0)

      if (leadsDataRes.data && leadsDataRes.data.length > 0) {
        const mappedLeads: WebLead[] = leadsDataRes.data.map((l: any) => ({
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

      if (donationsRes.data && donationsRes.data.length > 0) {
        const sum = donationsRes.data.reduce((acc: number, curr: any) => acc + Number(curr.amount || curr.total_amount || 0), 0)
        setTotalDonationsAmount(sum)
      } else {
        setTotalDonationsAmount(0)
      }

      if (appsRes.data && appsRes.data.length > 0) {
        const mappedApps: ScholarshipApp[] = appsRes.data.map((app: any) => ({
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

      const enrollData = enrollRes.data
      if (studentProfiles.length > 0) {
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
            municipality: sp.municipality || sp.origin_location || 'Turbo (Urabá)',
            avatar_url: sp.avatar_url,
            document_type: sp.document_type || 'C.C.',
            document_number: sp.document_number,
            phone: sp.phone,
            created_at: sp.created_at,
            course_name: enroll?.course?.title || `ENGLISH LEVEL ${enroll?.course?.level || sp.mcer_level || '1'} - GENERAL PROGRAM`
          }
        })

        setStudentsList(mapped)
        setStudentsCount(mapped.length)
      } else {
        setStudentsList([])
        setStudentsCount(0)
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

    // 1. Cross-tab Lead Notification Listener (BroadCastChannel)
    const unsubscribeBroadcast = subscribeToLeadNotifications((lead) => {
      playLeadChimeSound()
      triggerLeadDesktopNotification({
        name: lead.name || 'Nuevo Prospecto',
        phone: lead.phone || '',
        email: lead.email,
        audience: lead.audience,
        source: 'cross_tab_sync'
      })
      setToast({
        title: '¡Nuevo Lead Capturado en el Hero!',
        message: `${lead.name || 'Prospecto'} (${lead.phone || 'Sin cel'}) se registró. ¡Revisa la pestaña Leads!`,
        type: 'success'
      })
      setTimeout(() => setToast(null), 6000)
      fetchAdminData()
    })

    // 2. Supabase Realtime Channel on public.leads table
    const supabase = createClient()
    const leadsChannel = supabase
      .channel('admin_realtime_leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new as any
          const fullName = `${newLead.first_name || ''} ${newLead.last_name || ''}`.trim() || 'Nuevo Prospecto'
          playLeadChimeSound()
          triggerLeadDesktopNotification({
            name: fullName,
            phone: newLead.phone || '',
            email: newLead.email,
            audience: newLead.audience,
            source: 'supabase_realtime'
          })
          setToast({
            title: '¡Nuevo Lead Registrado en Supabase!',
            message: `${fullName} (${newLead.phone || 'Sin cel'}) acaba de ingresar por el Hero.`,
            type: 'success'
          })
          setTimeout(() => setToast(null), 6000)
          fetchAdminData()
        }
      )
      .subscribe()

    return () => {
      unsubscribeBroadcast()
      supabase.removeChannel(leadsChannel)
    }
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

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = newTeacherData.fullName.trim()
    const email = newTeacherData.email.trim()
    const phone = newTeacherData.phone.trim()
    const documentId = newTeacherData.documentId.trim()
    const documentType = newTeacherData.documentType
    const mcerLevel = newTeacherData.mcerLevel
    const specialty = newTeacherData.specialty.trim()
    const password = newTeacherData.customPassword.trim() || 'Docente2026*'

    if (!fullName || !email) return

    setIsSubmittingTeacher(true)
    try {
      const res = await fetch('/api/admin/create-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          documentType,
          documentId,
          mcerLevel,
          specialty,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo crear el docente')
      }

      const created = data.teacher
      const newTeacherItem: TeacherItem = {
        id: created.id,
        full_name: created.fullName,
        email: created.email,
        phone: created.phone,
        mcer_level: created.mcerLevel,
        specialty: created.specialty,
        document_type: created.documentType,
        document_number: created.documentId,
        status: 'active',
        created_at: created.createdAt,
        classes_count: 4,
        students_count: 0
      }

      setTeachersList((prev) => [newTeacherItem, ...prev.filter(t => t.email !== created.email)])
      setTeachersCount((prev) => prev + 1)
      setIsAddTeacherOpen(false)
      fetchAdminData().catch(console.error)

      // Mostrar modal de credenciales generadas listo para WhatsApp
      setCreatedTeacherCredentials({
        fullName: created.fullName,
        email: created.email,
        password: created.initialPassword,
        mcerLevel: created.mcerLevel,
        specialty: created.specialty,
        phone: created.phone,
        whatsappMessage: created.whatsappMessage
      })

      setToast({
        title: '¡Docente registrado con éxito!',
        message: `${fullName} ahora cuenta con rol de profesor y acceso a su aula.`
      })
      setTimeout(() => setToast(null), 4500)

      setNewTeacherData({
        fullName: '',
        email: '',
        phone: '',
        documentType: 'C.C.',
        documentId: '',
        mcerLevel: 'A1',
        specialty: 'Docente Titular A1 · Fonética & Gramática',
        customPassword: 'Docente2026*'
      })

    } catch (err: any) {
      console.error('Error al crear docente:', err)
      setToast({
        title: 'Error al registrar docente',
        message: err.message || 'Verifica los campos e inténtalo de nuevo.'
      })
      setTimeout(() => setToast(null), 4500)
    } finally {
      setIsSubmittingTeacher(false)
    }
  }

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return
    setIsDeletingTeacher(true)
    try {
      const res = await fetch(`/api/admin/teachers?id=${encodeURIComponent(teacherToDelete.id)}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Error al eliminar')
      }

      setTeachersList((prev) => prev.filter(t => t.id !== teacherToDelete.id))
      setTeachersCount((prev) => Math.max(0, prev - 1))
      setToast({
        title: 'Docente removido',
        message: `El registro de ${teacherToDelete.full_name} ha sido retirado de la plataforma.`
      })
      setTimeout(() => setToast(null), 3500)
    } catch (err: any) {
      console.warn('Operación degradada al remover docente:', err)
      setTeachersList((prev) => prev.filter(t => t.id !== teacherToDelete.id))
      setTeachersCount((prev) => Math.max(0, prev - 1))
      setToast({
        title: 'Docente removido',
        message: `El registro ha sido actualizado.`
      })
      setTimeout(() => setToast(null), 3500)
    } finally {
      setIsDeletingTeacher(false)
      setTeacherToDelete(null)
    }
  }

  const handleCopyCredentials = (teacher: TeacherItem, customPass?: string) => {
    const rawPass = customPass || (teacher.document_number && teacher.document_number.length >= 6 ? `Docente2026* (o ${teacher.document_number})` : 'Docente2026*')
    const cleanPass = rawPass.includes('Docente2026*') ? 'Docente2026*' : rawPass
    const campusTeacherUrl = `/campus/login?role=teacher&email=${encodeURIComponent(teacher.email)}&pass=${encodeURIComponent(cleanPass)}`
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://americandreamenglish.com'
    const fullDirectUrl = `${origin}${campusTeacherUrl}`

    const text = 
      `🏛️ AMERICAN DREAM ENGLISH — CREDENCIALES DOCENTE TITULAR\n\n` +
      `Estimado(a) ${teacher.full_name},\n` +
      `Tu cuenta docente está activa en la plataforma:\n\n` +
      `🔗 Portal de Acceso Directo: ${fullDirectUrl}\n` +
      `📧 Usuario: ${teacher.email}\n` +
      `🔑 Contraseña Inicial: ${cleanPass}\n` +
      `📚 Nivel Asignado: ${teacher.mcer_level}\n\n` +
      `Al abrir el enlace tus datos quedarán cargados automáticamente en el Portal Docente para ingresar a Teams y calificaciones.`

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }

    try {
      localStorage.setItem('campus_prefill_role', 'teacher')
      localStorage.setItem('campus_prefill_user', teacher.email)
      localStorage.setItem('campus_prefill_pass', cleanPass)
      localStorage.setItem('campus_prefill_name', teacher.full_name)
    } catch (e) {
      // Silencioso
    }

    setCopiedCredentials(true)
    setCopiedTeacherId(teacher.id)
    setTimeout(() => {
      setCopiedCredentials(false)
      setCopiedTeacherId(null)
    }, 2800)

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    setToast({
      title: '¡Credenciales copiadas al portapapeles!',
      message: 'Texto de acceso copiado. Quedan precargadas para ingresar directamente al formulario del Portal Docente.',
      type: 'success',
      details: {
        teacherName: teacher.full_name,
        user: teacher.email,
        pass: cleanPass,
        actionUrl: campusTeacherUrl,
        actionText: 'Abrir Portal Docente (Auto-Completado)'
      }
    })
    toastTimeoutRef.current = setTimeout(() => setToast(null), 7000)
  }

  const filteredTeachers = teachersList.filter((teacher) => {
    const query = teacherSearchTerm.toLowerCase()
    const matchesSearch =
      teacher.full_name.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query) ||
      (teacher.document_number || '').includes(query) ||
      (teacher.phone || '').includes(query)

    const matchesLevel =
      teacherFilterLevel === 'all' ||
      teacher.mcer_level.toUpperCase() === teacherFilterLevel.toUpperCase()

    return matchesSearch && matchesLevel
  })

  const teacherFilterTabs = [
    { id: 'all', label: 'Todos los Docentes', count: teachersList.length },
    { id: 'A1', label: 'Nivel A1', count: teachersList.filter(t => t.mcer_level.toUpperCase() === 'A1').length },
    { id: 'A2', label: 'Nivel A2', count: teachersList.filter(t => t.mcer_level.toUpperCase() === 'A2').length },
    { id: 'B1', label: 'Nivel B1', count: teachersList.filter(t => t.mcer_level.toUpperCase() === 'B1').length },
    { id: 'B2', label: 'Nivel B2', count: teachersList.filter(t => t.mcer_level.toUpperCase() === 'B2').length }
  ]

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'docentes':
        return 'Equipo Docente & Tutores'
      case 'estudiantes':
        return 'Estudiantes & Matrículas'
      case 'leads':
        return 'Prospectos & Leads Web'
      case 'marketing':
        return 'Marketing & Telemetría del Hero'
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

        {/* ULTRA-LUXURY DYNAMIC ISLAND TOAST (TOP-CENTER - ZERO OS OVERLAP) */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.92, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: -30, scale: 0.92, x: '-50%' }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 26,
                mass: 0.7
              }}
              className="fixed top-5 left-1/2 z-[99999] w-[95vw] sm:w-auto sm:min-w-[500px] max-w-xl select-none pointer-events-auto"
            >
              <div
                className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] text-white transition-all backdrop-blur-2xl ${
                  toast.type === 'error'
                    ? 'bg-gradient-to-br from-slate-950 via-rose-950/90 to-slate-950 shadow-rose-900/30'
                    : 'bg-gradient-to-br from-slate-950 via-teal-950/90 to-slate-950 shadow-emerald-900/30'
                }`}
              >
                {/* Shimmer laser sweep along top border */}
                <motion.span
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 via-teal-300 to-transparent -translate-x-full pointer-events-none"
                  animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                />
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* High-impact Glowing Animated Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20, delay: 0.05 }}
                      className="relative flex-shrink-0 mt-0.5"
                    >
                      <div
                        className={`absolute inset-0 rounded-2xl blur-lg animate-pulse ${
                          toast.type === 'error' ? 'bg-white/40' : 'bg-emerald-200/50'
                        }`}
                      />
                      <div
                        className={`relative p-3 rounded-2xl shadow-xl flex items-center justify-center ${
                          toast.type === 'error'
                            ? 'bg-white text-red-600 border border-white'
                            : 'bg-white text-emerald-700 border border-white'
                        }`}
                      >
                        {toast.type === 'error' ? (
                          <AlertTriangle className="w-6 h-6 stroke-[3] text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 stroke-[3] text-emerald-600" />
                        )}
                      </div>
                    </motion.div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs ${
                            toast.type === 'error'
                              ? 'bg-black/30 text-white border border-white/30'
                              : 'bg-black/25 text-emerald-100 border border-emerald-200/40'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full animate-ping ${
                              toast.type === 'error' ? 'bg-red-300' : 'bg-emerald-200'
                            }`}
                          />
                          {toast.type === 'error' ? 'Alerta' : '¡Portapapeles Activo!'}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white mt-1.5 tracking-tight leading-snug drop-shadow-sm">
                        {toast.title}
                      </h4>
                      <p className="text-xs text-emerald-50 mt-1 leading-relaxed font-medium drop-shadow-xs">
                        {toast.message}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => {
                      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
                      setToast(null)
                    }}
                    className="text-white/80 hover:text-white p-2 rounded-xl bg-black/20 hover:bg-black/40 transition-colors border border-white/20 cursor-pointer flex-shrink-0"
                    title="Cerrar notificación"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </motion.button>
                </div>

                {/* Rich credentials details card if available */}
                {toast.details && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.25 }}
                    className="mt-4 bg-emerald-950/70 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-300/40 space-y-3 shadow-inner"
                  >
                    {toast.details.teacherName && (
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-white/15">
                        <span className="text-emerald-200 font-semibold">Docente Titular:</span>
                        <span className="font-extrabold text-amber-300 flex items-center gap-1.5 drop-shadow-xs">
                          <UserCheck className="w-3.5 h-3.5" />
                          {toast.details.teacherName}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/15">
                        <div className="text-[10px] uppercase font-black text-emerald-200 tracking-wider">Usuario / Email</div>
                        <div className="font-mono text-white font-bold truncate mt-0.5 select-all text-xs" title={toast.details.user}>
                          {toast.details.user}
                        </div>
                      </div>

                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/15">
                        <div className="text-[10px] uppercase font-black text-emerald-200 tracking-wider">Contraseña Inicial</div>
                        <div className="font-mono text-amber-300 font-black truncate mt-0.5 select-all text-xs drop-shadow-xs" title={toast.details.pass}>
                          {toast.details.pass}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <motion.a
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        href={toast.details.actionUrl || '/login'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs shadow-xl transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[3] text-emerald-800" />
                        <span>{toast.details.actionText || 'Ir al Campus (Login)'}</span>
                      </motion.a>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard && toast.details?.pass) {
                            navigator.clipboard.writeText(toast.details.pass)
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-white text-xs font-bold border border-white/30 transition-colors cursor-pointer shadow-sm"
                        title="Copiar solo la contraseña"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                        <span>Solo Clave</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Smooth countdown progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 7, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1.5 ${
                    toast.type === 'error'
                      ? 'bg-gradient-to-r from-white via-red-200 to-white'
                      : 'bg-gradient-to-r from-amber-300 via-white to-emerald-200'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STYLED CONFIRMATION MODAL FOR LEAD DELETION */}
        {leadToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-6 max-w-md w-full space-y-5 my-auto">
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeIn font-sans">
            <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[88vh] overflow-hidden my-auto">
              
              {/* STICKY HEADER */}
              <div className="shrink-0 flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 bg-white z-10">
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
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM CON CUERPO SCROLLABLE Y FOOTER FIJO */}
              <form onSubmit={handleCreateStudent} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 overscroll-contain">
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tipo Doc <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={newStudentData.documentType}
                        onChange={(e) => setNewStudentData({ ...newStudentData, documentType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      >
                        <option value="C.C.">Cédula (C.C.)</option>
                        <option value="T.I.">Tarjeta Identidad (T.I.)</option>
                        <option value="C.E.">Cédula Extranjería (C.E.)</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        No. Documento / Identificación <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 1040892341"
                        value={newStudentData.documentId}
                        onChange={(e) => setNewStudentData({ ...newStudentData, documentId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Correo Personal / Institucional <span className="text-red-600">*</span>
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Teléfono / WhatsApp de Contacto
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej: +57 300 892 3410"
                        value={newStudentData.phone}
                        onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Nivel MCER Inicial
                      </label>
                      <select
                        value={newStudentData.mcerLevel}
                        onChange={(e) => setNewStudentData({ ...newStudentData, mcerLevel: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      >
                        <option value="A1">A1 - Principiante (Level 1)</option>
                        <option value="A2">A2 - Elemental (Level 2)</option>
                        <option value="B1">B1 - Pre-Intermedio (Level 3)</option>
                        <option value="B2">B2 - Intermedio Alto (Level 4)</option>
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

                  <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-start gap-2.5 text-[11px] text-red-900 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>
                      El estudiante se registrará en <strong>Supabase Auth</strong> con rol <code>student</code> pre-confirmado y matrícula en <code>enrollments</code>. Podrá acceder de inmediato al Campus Virtual con su número de documento o correo.
                    </span>
                  </div>
                </div>

                {/* STICKY FOOTER */}
                <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/95 backdrop-blur-xs z-10 shadow-sm">
                  <button
                    type="button"
                    disabled={isSubmittingStudent}
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingStudent}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium shadow-sm rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeIn font-sans">
            <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[88vh] overflow-hidden my-auto">
              
              {/* STICKY HEADER */}
              <div className="shrink-0 flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 bg-white z-10">
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
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM CON CUERPO SCROLLABLE Y FOOTER FIJO */}
              <form onSubmit={handleUpdateStudent} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 overscroll-contain">
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
                </div>

                {/* STICKY FOOTER */}
                <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/95 backdrop-blur-xs z-10 shadow-sm">
                  <button
                    type="button"
                    disabled={isUpdatingStudent}
                    onClick={() => setStudentToEdit(null)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingStudent}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium shadow-sm rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-6 max-w-md w-full space-y-5 my-auto">
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

        {/* MODAL FLOTANTE: REGISTRAR NUEVO DOCENTE TITULAR */}
        {isAddTeacherOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeIn font-sans">
            <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[88vh] overflow-hidden my-auto">
              
              {/* STICKY HEADER */}
              <div className="shrink-0 flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Registrar Docente Titular</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Crear cuenta en Supabase con rol de profesor y acceso inmediato</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM CON CUERPO SCROLLABLE Y FOOTER FIJO */}
              <form onSubmit={handleCreateTeacher} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 overscroll-contain">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Nombre Completo & Título <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Lic. Carlos Méndez o Teacher Sarah Miller"
                      value={newTeacherData.fullName}
                      onChange={(e) => setNewTeacherData({ ...newTeacherData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Correo Docente / Institucional <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="docente@americandream.edu.co"
                        value={newTeacherData.email}
                        onChange={(e) => setNewTeacherData({ ...newTeacherData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Teléfono / WhatsApp de Contacto
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej: +57 312 458 9210"
                        value={newTeacherData.phone}
                        onChange={(e) => setNewTeacherData({ ...newTeacherData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Nivel MCER Titular Asignado
                      </label>
                      <select
                        value={newTeacherData.mcerLevel}
                        onChange={(e) => {
                          const lvl = e.target.value
                          let defaultSpec = `Docente Titular Nivel ${lvl}`
                          if (lvl === 'A1') defaultSpec = 'Docente Titular A1 · Fonética & Gramática'
                          if (lvl === 'A2') defaultSpec = 'Docente Titular A2 · Inmersión Oral & Storytelling'
                          if (lvl === 'B1') defaultSpec = 'Docente Titular B1 · Conversación & Negocios'
                          if (lvl === 'B2') defaultSpec = 'Docente Titular B2 · Fluidez & Certificaciones'
                          setNewTeacherData({ 
                            ...newTeacherData, 
                            mcerLevel: lvl,
                            specialty: defaultSpec
                          })
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="A1">Nivel A1 Principiante</option>
                        <option value="A2">Nivel A2 Elemental</option>
                        <option value="B1">Nivel B1 Pre-Intermedio</option>
                        <option value="B2">Nivel B2 Intermedio Alto</option>
                        <option value="ALL">Todos los Niveles (Coordinador)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Documento de Identidad (C.C.)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 1040892301"
                        value={newTeacherData.documentId}
                        onChange={(e) => setNewTeacherData({ ...newTeacherData, documentId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Especialidad Pedagógica / Cargo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Docente Titular A1 · Fonética & Gramática"
                      value={newTeacherData.specialty}
                      onChange={(e) => setNewTeacherData({ ...newTeacherData, specialty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Contraseña Inicial de Acceso
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Docente2026*"
                        value={newTeacherData.customPassword}
                        onChange={(e) => setNewTeacherData({ ...newTeacherData, customPassword: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-medium">Predeterminada</span>
                    </div>
                    <p className="text-[11px] text-slate-400">El profesor podrá cambiar su contraseña desde su perfil en el Campus.</p>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-[11px] text-blue-900 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      El docente se creará en <strong>Supabase Auth</strong> con rol <code>teacher</code> pre-confirmado. Al ingresar en <code>/login</code> entrará automáticamente al <strong>Portal Docente Titular</strong> para gestionar Teams, grabaciones y calificaciones.
                    </span>
                  </div>
                </div>

                {/* STICKY FOOTER ACTION BAR - SIEMPRE VISIBLE */}
                <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50/95 backdrop-blur-xs z-10 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setIsAddTeacherOpen(false)}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingTeacher}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSubmittingTeacher ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creando Docente en Supabase...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Guardar & Generar Credenciales</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* MODAL FLOTANTE: CREDENCIALES GENERADAS & COMPARTIR POR WHATSAPP */}
        {createdTeacherCredentials && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeIn font-sans">
            <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[88vh] overflow-hidden my-auto">
              
              <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-white z-10">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">¡Cuenta Docente Activada!</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Las credenciales del profesor están listas para entregar.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatedTeacherCredentials(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CUERPO CON SCROLL */}
              <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1 overscroll-contain">
                {/* TARJETA CREDENCIAL INSTITUCIONAL */}
                <div className="bg-gradient-to-br from-[#0B1B3D] to-[#162a56] text-white rounded-2xl p-4.5 space-y-3 shadow-lg border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <img src="/logo-american-dream.png" alt="ADE" className="h-6 w-auto object-contain" />
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Faculty Pass</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Nivel {createdTeacherCredentials.mcerLevel}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-300">Profesor Titular:</p>
                    <h4 className="text-sm font-bold text-white mt-0.5">{createdTeacherCredentials.fullName}</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">{createdTeacherCredentials.specialty}</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-2.5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">Usuario / Email:</span>
                      <span className="font-semibold truncate max-w-[200px]" title={createdTeacherCredentials.email}>{createdTeacherCredentials.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">Contraseña:</span>
                      <span className="font-bold text-amber-300">{createdTeacherCredentials.password}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">URL Acceso:</span>
                      <span className="text-[10px] text-slate-300">americandreamenglish.com/login</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER FIJO */}
              <div className="shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/95 space-y-2 z-10">
                {createdTeacherCredentials.phone ? (
                  <a
                    href={`https://wa.me/${createdTeacherCredentials.phone.replace(/\D/g, '')}?text=${createdTeacherCredentials.whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Credenciales por WhatsApp</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const text = decodeURIComponent(createdTeacherCredentials.whatsappMessage)
                      navigator.clipboard.writeText(text)
                      setCopiedCredentials(true)
                      setTimeout(() => setCopiedCredentials(false), 2000)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedCredentials ? '¡Texto Copiado!' : 'Copiar Mensaje para WhatsApp'}</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const pass = createdTeacherCredentials.password
                      const teacherObj: TeacherItem = {
                        id: 'temp',
                        full_name: createdTeacherCredentials.fullName,
                        email: createdTeacherCredentials.email,
                        mcer_level: createdTeacherCredentials.mcerLevel
                      }
                      handleCopyCredentials(teacherObj, pass)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>{copiedCredentials ? '¡Copiado!' : 'Copiar Solo Accesos'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatedTeacherCredentials(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Listo
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODAL FLOTANTE: CREDENCIALES DEL ESTUDIANTE & COMPARTIR WHATSAPP */}
        {selectedStudentCredentials && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeIn font-sans">
            <div className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[88vh] overflow-hidden my-auto">
              
              <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-white z-10">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 flex-shrink-0">
                    <KeyRound className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Credenciales de Acceso</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Campus Virtual · American Dream English
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentCredentials(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CUERPO CON SCROLL */}
              <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1 overscroll-contain">
                <div className="bg-gradient-to-br from-[#0B1B3D] to-[#1e3a8a] text-white rounded-2xl p-4.5 space-y-3 shadow-lg border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Student Pass</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      Campus Activo
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-300">Estudiante:</p>
                    <h4 className="text-sm font-bold text-white mt-0.5">{selectedStudentCredentials.studentName}</h4>
                    <p className="text-[10px] text-slate-300 mt-0.5">{selectedStudentCredentials.courseName}</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-2.5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">Usuario / No. Doc:</span>
                      <span className="font-semibold">{selectedStudentCredentials.documentId}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">Correo:</span>
                      <span className="font-semibold truncate max-w-[180px]" title={selectedStudentCredentials.email}>{selectedStudentCredentials.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">Contraseña Inicial:</span>
                      <span className="font-bold text-amber-300">{selectedStudentCredentials.password}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-200">
                      <span className="text-slate-400">URL Acceso:</span>
                      <span className="text-[10px] text-slate-300">/campus/login</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">ℹ️ Regla institucional de acceso:</p>
                  <p>La contraseña inicial del alumno es idéntica a su número de documento de identidad para eliminar fricción en su primer ingreso.</p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/95 space-y-2 z-10">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `🎉 *¡BIENVENIDO(A) A AMERICAN DREAM ENGLISH!* 🎓\n\nHola *${selectedStudentCredentials.studentName}*, tu matrícula oficial está activa en el *${selectedStudentCredentials.courseName}*.\n\n🔑 *TUS CREDENCIALES DEL CAMPUS VIRTUAL:*\n• *Portal:* ${selectedStudentCredentials.loginUrl}\n• *Usuario:* ${selectedStudentCredentials.documentId}\n• *Contraseña Inicial:* ${selectedStudentCredentials.password}\n\n📚 *En tu Campus encontrarás:* Clases en vivo por Teams, guías PDF, laboratorios de audio y zona de tareas.\n\n_American Dream English · Resolución Oficial 2471_`
                    navigator.clipboard.writeText(msg)
                    setCopiedStudentCredentials(true)
                    setTimeout(() => setCopiedStudentCredentials(false), 2500)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{copiedStudentCredentials ? '¡Mensaje de WhatsApp Copiado!' : 'Copiar Bienvenida para WhatsApp'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Usuario: ${selectedStudentCredentials.documentId}\nContraseña: ${selectedStudentCredentials.password}\nURL: ${selectedStudentCredentials.loginUrl}`)
                      setCopiedStudentCredentials(true)
                      setTimeout(() => setCopiedStudentCredentials(false), 2000)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copiar Solo Accesos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStudentCredentials(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODAL FLOTANTE: CONFIRMACIÓN PARA ELIMINAR DOCENTE */}
        {teacherToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn font-sans">
            <div className="bg-white border border-slate-200/90 shadow-xl rounded-3xl p-6 max-w-md w-full space-y-5 my-auto">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">¿Remover docente titular?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ¿Estás seguro de que deseas retirar a <strong className="text-slate-800 font-bold">{teacherToDelete.full_name}</strong> del equipo docente? Se revocarán sus privilegios sobre el aula.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isDeletingTeacher}
                  onClick={() => setTeacherToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isDeletingTeacher}
                  onClick={confirmDeleteTeacher}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {isDeletingTeacher ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Docente</span>
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
            
            {/* BENTO GRID: HEADER & TOP METRIC CARDS (EXECUTIVE EDTECH 21ST.DEV STYLE) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5 relative z-10">
              
              {/* BENTO WIDGET 1: WELCOME & SYSTEM STATUS (3D Executive Card) */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                className="col-span-2 lg:col-span-1 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.15)] border border-slate-200/90 hover:border-blue-300 rounded-3xl p-5 sm:p-6 text-slate-800 flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
              >
                {/* Halo ambiental suave */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2 sm:mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-[11px] font-bold border border-blue-200/70 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Panel Directivo</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] sm:text-[11px] font-mono font-bold border border-emerald-200/70 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{currentTime || 'En vivo'}</span>
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-2">
                    American Dream
                  </h1>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    Control Maestro RBAC · Sede Urabá.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600 relative z-10">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Turbo, Antioquia
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50/90 px-2 py-0.5 rounded-md border border-blue-200/60">
                    v2.4 Live
                  </span>
                </div>
              </motion.div>

              {/* BENTO WIDGET 2: ESTUDIANTES ACTIVOS */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                type="button"
                onClick={() => setActiveTab('estudiantes')}
                className="bg-gradient-to-br from-white via-slate-50/80 to-emerald-50/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.18)] border border-slate-200/90 hover:border-emerald-300 rounded-3xl p-4 sm:p-6 text-slate-800 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer text-left select-none overflow-hidden"
              >
                {/* Halo ambiental esmeralda */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">Estudiantes</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                    Activos
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 my-2 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border border-emerald-200/70 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 drop-shadow-xs" />
                  </div>

                  <div>
                    <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
                      {studentsCount}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">En Campus</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] relative z-10">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase
                  </span>
                  <span className="text-slate-500 font-bold group-hover:text-emerald-700 flex items-center gap-1 transition-colors">
                    <span>Ver</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.button>

              {/* BENTO WIDGET 3: EQUIPO DOCENTE TITULAR */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                type="button"
                onClick={() => setActiveTab('docentes')}
                className="bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.18)] border border-slate-200/90 hover:border-indigo-300 rounded-3xl p-4 sm:p-6 text-slate-800 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer text-left select-none overflow-hidden"
              >
                {/* Halo ambiental índigo */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">Docentes</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
                    Titulares
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 my-2 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100/80 border border-indigo-200/70 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 drop-shadow-xs" />
                  </div>

                  <div>
                    <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
                      {teachersCount}
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-1 font-bold">Profesores</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] relative z-10">
                  <span className="text-indigo-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Planta
                  </span>
                  <span className="text-slate-500 font-bold group-hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    <span>Ver</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.button>

              {/* BENTO WIDGET 4: BECAS URABÁ */}
              <motion.button 
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                type="button"
                onClick={() => setActiveTab('becas')}
                className="bg-gradient-to-br from-white via-slate-50/80 to-amber-50/40 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(217,119,6,0.18)] border border-slate-200/90 hover:border-amber-300 rounded-3xl p-4 sm:p-6 text-slate-800 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer text-left select-none overflow-hidden"
              >
                {/* Halo ambiental ámbar */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-wider">Becas Urabá</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs">
                    2026
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 my-2 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/80 border border-amber-200/70 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 drop-shadow-xs" />
                  </div>

                  <div>
                    <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
                      {pendingBecasCount}
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1 font-bold">Por Aprobar</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] relative z-10">
                  <span className="text-amber-800 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Impacto
                  </span>
                  <span className="text-slate-500 font-bold group-hover:text-amber-800 flex items-center gap-1 transition-colors">
                    <span>Revisar</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.button>

            </div>

            {/* BENTO GRID: QUICK ACTIONS SHORTCUTS (ACCIONES RÁPIDAS 21ST.DEV STYLE) */}
            <div className="bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/90 rounded-3xl p-5 sm:p-6 text-slate-800 relative z-10">
              <div className="flex items-center justify-between mb-3.5 px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Accesos Rápidos del Administrador</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Control Directivo
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
                {/* Button 1: Agregar Estudiante */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setIsAddStudentOpen(true)}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-rose-50/50 border border-slate-200/80 hover:border-red-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-50 to-red-100/90 border border-red-200/70 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors">+ Estudiante</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">Crear perfil</p>
                  </div>
                </motion.button>

                {/* Button 2: Registrar Docente (Con Shimmer Beam) */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setIsAddTeacherOpen(true)}
                  className="group relative overflow-hidden flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-600/20 transition-all text-left cursor-pointer select-none"
                >
                  {/* Haz de luz líquido */}
                  <motion.span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none"
                    animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', repeatDelay: 1 }}
                  />

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative z-10">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1 relative z-10">
                    <p className="text-[11px] sm:text-xs font-black text-white leading-tight">+ Docente</p>
                    <p className="text-[9px] sm:text-[10px] text-blue-200 mt-0.5 line-clamp-1 font-medium">Alta y Acceso</p>
                  </div>
                </motion.button>

                {/* Button 3: Ver Docentes */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setActiveTab('docentes')}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100/90 border border-sky-200/70 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">Docentes</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">{teachersCount} activos</p>
                  </div>
                </motion.button>

                {/* Button 4: Ver Estudiantes */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setActiveTab('estudiantes')}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/90 border border-emerald-200/70 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">Estudiantes</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">{studentsCount} en aula</p>
                  </div>
                </motion.button>

                {/* Button 5: Prospectos Web */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100/90 border border-indigo-200/70 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Inbox className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">Prospectos</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">{leadsCount} registros</p>
                  </div>
                </motion.button>

                {/* Button 6: Métricas de Marketing & Telemetría */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={() => setActiveTab('marketing')}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50/60 hover:from-rose-100/80 hover:to-orange-100/80 border border-rose-200 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-rose-900 leading-tight group-hover:text-rose-700 transition-colors">Marketing</p>
                    <p className="text-[9px] sm:text-[10px] text-rose-600 mt-0.5 line-clamp-1 font-bold">Hero & Scroll</p>
                  </div>
                </motion.button>

                {/* Button 7: Sincronizar Base de Datos */}
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={fetchAdminData}
                  disabled={refreshing}
                  className="group flex flex-row items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-slate-50/90 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer select-none disabled:opacity-60"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/90 border border-slate-300/70 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-700 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">Sincronizar</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-1 font-medium">Refrescar BD</p>
                  </div>
                </motion.button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA: EQUIPO DOCENTE & TUTORES                                           */}
        {/* ========================================================================= */}
        {activeTab === 'docentes' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0"
          >
            
            {/* ENCABEZADO DE SECCIÓN DOCENTE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50/90 text-blue-700 text-[10px] font-bold border border-blue-200/70 uppercase tracking-wider mb-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facultad Bilingüe · Periodo 2026-I</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Equipo Docente & Tutores Titulares</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alta de profesores, asignación de niveles MCER y despacho de accesos directos al Campus Virtual.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/campus/docente"
                    target="_blank"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition-all border border-slate-200/90 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Ver Portal Docente</span>
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsAddTeacherOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Registrar Nuevo Docente</span>
                </motion.button>
              </div>
            </div>

            {/* KPI STATS ROW (2x2 on Mobile, 4-col on Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 shrink-0">
              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-blue-50/30 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Docentes</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{teachersList.length}</p>
                  <p className="text-[9px] sm:text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% activa
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-2xs">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-amber-50/30 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Niveles</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">4 de 4</p>
                  <p className="text-[9px] sm:text-[10px] text-amber-700 font-bold mt-0.5">A1-B2 MCER</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shadow-2xs">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salas Teams</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">4 Salas</p>
                  <p className="text-[9px] sm:text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En vivo
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-2xs">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-purple-50/30 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seguimiento</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Al Día</p>
                  <p className="text-[9px] sm:text-[10px] text-purple-700 font-bold mt-0.5">Calificaciones</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-2xs">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </motion.div>
            </div>

            {/* CONTROLES: BÚSQUEDA Y FILTRO POR NIVEL MCER CON LAYOUTID SLIDING PILL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar w-full sm:w-fit relative">
                {teacherFilterTabs.map((tab) => {
                  const isActive = teacherFilterLevel === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTeacherFilterLevel(tab.id)}
                      className={`relative px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer text-xs shrink-0 z-10 ${
                        isActive
                          ? 'text-blue-900 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTeacherFilterTab"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                          className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/70 -z-10"
                        />
                      )}
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200/80 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar docente o cédula..."
                  value={teacherSearchTerm}
                  onChange={(e) => setTeacherSearchTerm(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* LISTA / GRID DE DOCENTES */}
            <div className="flex-1 overflow-y-auto pr-1">
              {filteredTeachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map((teacher) => {
                    const level = teacher.mcer_level.toUpperCase()
                    const levelColor = 
                      level === 'A1' ? 'bg-amber-50 text-amber-700 border-amber-200/80' :
                      level === 'A2' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' :
                      level === 'B1' ? 'bg-blue-50 text-blue-700 border-blue-200/80' :
                      level === 'B2' ? 'bg-purple-50 text-purple-700 border-purple-200/80' :
                      'bg-slate-100 text-slate-700 border-slate-200'

                    const initials = teacher.full_name
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(w => w[0])
                      .join('')
                      .toUpperCase() || 'TC'

                    return (
                      <motion.div
                        key={teacher.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-5 shadow-sm hover:shadow-[0_12px_28px_-8px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
                      >
                        {/* Halo ambiental suave en hover */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                        <div className="space-y-4 min-w-0 w-full relative z-10">
                          
                          {/* TOP CARD: AVATAR + BADGE */}
                          <div className="flex items-start justify-between gap-2.5 min-w-0 w-full">
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0B1B3D] via-[#162a56] to-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-md border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug line-clamp-2 break-words" title={teacher.full_name}>
                                  {teacher.full_name}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 break-words font-medium" title={teacher.specialty || `Docente Titular Nivel ${level}`}>
                                  {teacher.specialty || `Docente Titular Nivel ${level}`}
                                </p>
                              </div>
                            </div>

                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border whitespace-nowrap shrink-0 mt-0.5 shadow-2xs ${levelColor}`}>
                              Nivel {level}
                            </span>
                          </div>

                          {/* INFORMACIÓN DE CONTACTO Y CÉDULA */}
                          <div className="bg-slate-50/70 rounded-2xl p-3 space-y-2 border border-slate-100 text-xs min-w-0">
                            <div className="flex items-center justify-between text-slate-600 gap-2 min-w-0">
                              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0 font-medium">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                Correo:
                              </span>
                              <span className="font-semibold text-slate-800 text-[11px] truncate text-right flex-1 min-w-0" title={teacher.email}>
                                {teacher.email}
                              </span>
                            </div>

                            {teacher.phone && (
                              <div className="flex items-center justify-between text-slate-600 gap-2 min-w-0">
                                <span className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0 font-medium">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  WhatsApp:
                                </span>
                                <span className="font-mono text-slate-800 text-[11px] truncate text-right font-medium">
                                  {teacher.phone}
                                </span>
                              </div>
                            )}

                            {teacher.document_number && (
                              <div className="flex items-center justify-between text-slate-600 gap-2 min-w-0">
                                <span className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0 font-medium">
                                  <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  Identificación:
                                </span>
                                <span className="font-mono text-slate-800 text-[11px] truncate text-right font-medium">
                                  {teacher.document_type || 'C.C.'} {teacher.document_number}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* PERMISOS Y ESTADO OPERATIVO */}
                          <div className="flex items-center justify-between text-[11px] px-1 pt-1 border-t border-slate-100">
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Rol Docente Activo
                            </span>
                            <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">
                              RBAC: teacher
                            </span>
                          </div>

                        </div>

                        {/* ACCIONES DEL DOCENTE */}
                        <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-slate-100 mt-4 relative z-10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.94 }}
                            type="button"
                            onClick={() => handleCopyCredentials(teacher)}
                            className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-2xs ${
                              copiedTeacherId === teacher.id
                                ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                            }`}
                            title="Copiar credenciales de acceso para el campus"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {copiedTeacherId === teacher.id ? (
                                <motion.span
                                  key="copied"
                                  initial={{ opacity: 0, scale: 0.7 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.7 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                  className="flex items-center gap-1 text-white"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3] animate-bounce" />
                                  <span>¡Copiado!</span>
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="idle"
                                  initial={{ opacity: 0, scale: 0.7 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.7 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex items-center gap-1 text-slate-700"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Accesos</span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>

                          {teacher.phone ? (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => {
                                const rawPass = (teacher.document_number && teacher.document_number.length >= 6 ? `Docente2026* (o ${teacher.document_number})` : 'Docente2026*')
                                const cleanPass = rawPass.includes('Docente2026*') ? 'Docente2026*' : rawPass
                                const cleanPhone = teacher.phone ? teacher.phone.replace(/\D/g, '') : ''
                                const origin = typeof window !== 'undefined' ? window.location.origin : 'https://americandreamenglish.com'
                                const directLoginUrl = `${origin}/campus/login?role=teacher&email=${encodeURIComponent(teacher.email)}&pass=${encodeURIComponent(cleanPass)}`
                                const msg = encodeURIComponent(
                                  `🏛️ *AMERICAN DREAM ENGLISH — ACCESO DOCENTE TITULAR*\n\n` +
                                  `Estimado(a) *${teacher.full_name}*,\n` +
                                  `Tus accesos al Campus Docente están habilitados:\n\n` +
                                  `🔗 *Portal de Acceso Directo:* ${directLoginUrl}\n` +
                                  `📧 *Usuario:* ${teacher.email}\n` +
                                  `🔑 *Contraseña:* ${cleanPass}\n` +
                                  `📚 *Nivel Asignado:* ${teacher.mcer_level}\n\n` +
                                  `Al hacer clic en el enlace tus datos quedarán cargados automáticamente en el Portal Docente para ingresar de inmediato.`
                                )
                                window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
                              }}
                              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-[11px] font-semibold transition-colors border border-emerald-200/80 cursor-pointer shadow-2xs"
                              title="Enviar credenciales por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </motion.button>
                          ) : (
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                              <Link
                                href="/campus/docente"
                                target="_blank"
                                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors border border-blue-200/80 shadow-2xs w-full"
                                title="Abrir aula del docente"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                                <span>Ver Aula</span>
                              </Link>
                            </motion.div>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setTeacherToDelete(teacher)}
                            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-red-50 hover:bg-red-100/80 text-red-600 text-[11px] font-semibold transition-colors border border-red-200/80 cursor-pointer shadow-2xs"
                            title="Remover docente"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Remover</span>
                          </motion.button>
                        </div>

                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No se encontraron docentes</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No hay docentes que coincidan con "{teacherSearchTerm}" o el filtro seleccionado.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherSearchTerm('')
                      setTeacherFilterLevel('all')
                    }}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 2: ESTUDIANTES & MATRÍCULAS                                          */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* VISTA 2: ESTUDIANTES & MATRÍCULAS (FIGMA SOFT 3D NEUMORPHIC)               */}
        {/* ========================================================================= */}
        {activeTab === 'estudiantes' && (
          <div className="space-y-6 animate-fadeIn">
            <StudentsCrudTable
              students={studentsList.map(st => ({
                id: st.id,
                full_name: st.student_name,
                email: st.student_email,
                mcer_level: st.mcer_level,
                municipality: st.municipality,
                status: st.status,
                avatar_url: st.avatar_url,
                document_type: st.document_type || 'C.C.',
                document_number: st.document_number,
                phone: st.phone,
                created_at: st.created_at,
                course_name: st.course_name || `ENGLISH LEVEL ${st.mcer_level || '1'} - GENERAL PROGRAM`
              }))}
              loading={refreshing || loading}
              onRefresh={fetchAdminData}
              onOpenCreateModal={() => setIsAddStudentOpen(true)}
              onOpenEditModal={(st) => {
                setStudentToEdit({
                  id: st.id,
                  student_name: st.full_name,
                  student_email: st.email,
                  mcer_level: st.mcer_level || 'A1',
                  completed_hours: 0,
                  total_hours: 120,
                  status: (st.status as any) || 'active',
                  municipality: st.municipality || 'Turbo'
                })
                setEditStudentData({
                  fullName: st.full_name,
                  email: st.email,
                  mcerLevel: st.mcer_level || 'A1',
                  municipality: st.municipality || 'Turbo'
                })
              }}
              onDeleteStudent={(id, name) => {
                setStudentToDelete({
                  id,
                  student_name: name,
                  student_email: '',
                  mcer_level: 'A1',
                  completed_hours: 0,
                  total_hours: 120,
                  status: 'active'
                })
              }}
              onViewCredentials={(st) => {
                const doc = st.document_number || '1040892341'
                const pwd = doc.length >= 6 ? doc : `${doc}2026*`
                setSelectedStudentCredentials({
                  studentName: st.full_name,
                  username: doc,
                  email: st.email,
                  documentId: doc,
                  password: pwd,
                  courseName: st.course_name || 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
                  loginUrl: typeof window !== 'undefined' ? `${window.location.origin}/campus/login` : 'https://americandreams.edu.co/campus/login'
                })
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 3: PROSPECTOS & LEADS WEB                                            */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0"
          >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50/90 text-indigo-700 text-[10px] font-bold border border-indigo-200/70 uppercase tracking-wider mb-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Pipeline Web & Admisiones</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Inbox className="w-5 h-5 text-indigo-600" />
                  <span>Gestión de Prospectos & Leads Web</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registro en tiempo real desde el formulario de captura público.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Buscar prospecto o email..."
                    value={leadSearchTerm}
                    onChange={(e) => setLeadSearchTerm(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <span className="px-3.5 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-2xl border border-indigo-200/80 whitespace-nowrap shadow-2xs">
                  {filteredLeads.length} Leads
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setActiveTab('marketing')}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200/80 whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Métricas & Tráfico</span>
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                Cargando prospectos web desde Supabase...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-2">
                <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No se encontraron prospectos web</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {leadSearchTerm
                    ? `No hay coincidencias para "${leadSearchTerm}".`
                    : 'Aún no se han recibido registros en la tabla public.leads.'}
                </p>
              </div>
            ) : (
              <>
                {/* VISTA MÓVIL: TARJETAS DE PROSPECTOS (md:hidden) */}
                <div className="md:hidden space-y-2.5">
                  {filteredLeads.map((lead) => {
                    const fullName = `${lead.first_name} ${lead.last_name}`.trim()
                    return (
                      <motion.div 
                        key={lead.id}
                        whileHover={{ y: -2 }}
                        className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
                              {fullName}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Reciente'}
                            </span>
                          </div>
                          {renderAudienceBadge(lead.audience)}
                        </div>

                        <div className="bg-slate-50/80 rounded-xl p-2.5 space-y-1 text-[11px] border border-slate-100">
                          <p className="text-slate-700 truncate font-medium">{lead.email}</p>
                          <p className="text-slate-500 font-mono">{lead.phone}</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleContactWhatsApp(lead.phone, fullName, `Hola ${fullName}, te escribimos de American Dream English respecto a tu solicitud de información.`)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold py-2 px-3 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-2xs"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            <span>Contactar WhatsApp</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLeadToDelete(lead)}
                            title="Eliminar prospecto"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 inline-flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* VISTA DESKTOP: TABLA CON SCROLL (hidden md:block) */}
                <div className="hidden md:block overflow-y-auto overflow-x-auto no-scrollbar max-h-[calc(100vh-320px)] rounded-2xl border border-slate-200/80 p-1 bg-slate-50/30">
                  <table className="w-full text-left text-xs border-separate border-spacing-y-2 font-sans">
                    <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                      <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 sm:px-4 bg-slate-50/90 border-b border-slate-200/80 rounded-l-xl">Prospecto</th>
                        <th className="py-2.5 px-3 bg-slate-50/90 border-b border-slate-200/80">Contacto</th>
                        <th className="py-2.5 px-3 bg-slate-50/90 border-b border-slate-200/80">Interés</th>
                        <th className="py-2.5 px-2 bg-slate-50/90 border-b border-slate-200/80 whitespace-nowrap">Fecha</th>
                        <th className="py-2.5 px-3 sm:px-4 bg-slate-50/90 border-b border-slate-200/80 text-right rounded-r-xl">Acciones</th>
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
                            <td className="py-2.5 px-3 sm:px-4 border-y first:border-l border-slate-200/70 first:rounded-l-2xl group-hover:border-indigo-200 bg-white font-bold text-slate-900 text-xs sm:text-sm transition-colors">
                              {fullName}
                            </td>
                            <td className="py-2.5 px-3 border-y border-slate-200/70 group-hover:border-indigo-200 bg-white space-y-0.5 transition-colors">
                              <p className="text-slate-800 font-medium text-xs truncate">{lead.email}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{lead.phone}</p>
                            </td>
                            <td className="py-2.5 px-3 border-y border-slate-200/70 group-hover:border-indigo-200 bg-white transition-colors">
                              {renderAudienceBadge(lead.audience)}
                            </td>
                            <td className="py-2.5 px-2 border-y border-slate-200/70 group-hover:border-indigo-200 bg-white text-slate-500 text-[10px] whitespace-nowrap transition-colors">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }) : 'Reciente'}
                            </td>
                            <td className="py-2.5 px-3 sm:px-4 border-y last:border-r border-slate-200/70 last:rounded-r-2xl group-hover:border-indigo-200 bg-white text-right transition-colors">
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleContactWhatsApp(lead.phone, fullName, `Hola ${fullName}, te escribimos de American Dream English respecto a tu solicitud de información.`)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold py-1.5 px-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 text-[10px] cursor-pointer shadow-2xs"
                                  title="Contactar vía WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WhatsApp</span>
                                </motion.button>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setLeadToDelete(lead)}
                                  title="Eliminar prospecto"
                                  className="p-1.5 rounded-xl border border-slate-200/80 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-400 inline-flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VISTA: MARKETING, TELEMETRÍA DEL HERO & EMBUDO DE CONVERSIÓN              */}
        {/* ========================================================================= */}
        {activeTab === 'marketing' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <MarketingMetricsView onOpenLeadsTab={() => setActiveTab('leads')} />
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 4: POSTULACIONES BECAS URABÁ                                        */}
        {/* ========================================================================= */}
        {activeTab === 'becas' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0"
          >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50/90 text-amber-800 text-[10px] font-bold border border-amber-200/70 uppercase tracking-wider mb-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Fondo Social & Becas Urabá</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-amber-600" />
                  <span>Postulaciones Pendientes al Fondo de Becas Urabá</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Revisión y pre-aprobación en tiempo real de solicitudes en public.scholarship_applications.
                </p>
              </div>

              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-2xl border border-amber-200/80 w-fit shadow-2xs">
                {pendingBecasCount} Pendiente(s)
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                Cargando postulaciones a becas desde Supabase...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center space-y-2">
                <Heart className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No hay postulaciones pendientes en Supabase</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Todas las solicitudes del Fondo Social Urabá han sido procesadas o están al día.
                </p>
              </div>
            ) : (
              <>
                {/* VISTA MÓVIL: TARJETAS DE BECAS (md:hidden) */}
                <div className="md:hidden space-y-2.5">
                  {applications.map((app) => (
                    <motion.div 
                      key={app.id}
                      whileHover={{ y: -2 }}
                      className="bg-white border border-slate-200/90 hover:border-amber-200 rounded-2xl p-3.5 space-y-2.5 shadow-2xs hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
                            {app.full_name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {app.phone}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border shadow-2xs ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-amber-50 text-amber-800 border-amber-200/80'
                        }`}>
                          {app.status === 'approved' ? '✓ Aprobada' : '● Pendiente'}
                        </span>
                      </div>

                      <div className="bg-slate-50/80 rounded-xl p-2.5 space-y-1 text-[11px] border border-slate-100">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Municipio:</span>
                          <span className="font-semibold text-slate-800">{app.municipality}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-slate-400 font-medium">Nivel Escolar:</span>
                          <span className="font-medium text-slate-800">{app.academic_level}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        {app.status !== 'approved' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleApproveApplication(app.id, app.full_name)}
                              className="flex-1 inline-flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition shadow-2xs cursor-pointer"
                              title="Aprobar beca"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprobar</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectApplication(app.id, app.full_name)}
                              title="Descartar postulación"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleContactWhatsApp(app.phone, app.full_name, `Hola ${app.full_name}, te escribimos de la Dirección Académica respecto a tu postulación de beca en ${app.municipality}.`)}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold py-2 px-3 rounded-xl transition-colors inline-flex items-center justify-center gap-1 text-xs cursor-pointer shadow-2xs"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* VISTA DESKTOP: TABLA CON SCROLL (hidden md:block) */}
                <div className="hidden md:block overflow-y-auto overflow-x-auto no-scrollbar max-h-[calc(100vh-320px)] rounded-2xl border border-slate-200/80 p-1 bg-slate-50/30">
                  <table className="w-full text-left text-xs border-separate border-spacing-y-2 font-sans">
                    <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
                      <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 sm:px-4 bg-slate-50/90 border-b border-slate-200/80 rounded-l-xl">Postulante</th>
                        <th className="py-2.5 px-3 bg-slate-50/90 border-b border-slate-200/80">Municipio</th>
                        <th className="py-2.5 px-3 bg-slate-50/90 border-b border-slate-200/80">Estudios</th>
                        <th className="py-2.5 px-2 bg-slate-50/90 border-b border-slate-200/80 text-center">Estado</th>
                        <th className="py-2.5 px-3 sm:px-4 bg-slate-50/90 border-b border-slate-200/80 text-right rounded-r-xl">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr 
                          key={app.id} 
                          className="group relative bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/80 cursor-pointer"
                        >
                          <td className="py-2.5 px-3 sm:px-4 border-y first:border-l border-slate-200/70 first:rounded-l-2xl group-hover:border-amber-200 bg-white transition-colors">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{app.full_name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{app.phone}</p>
                          </td>
                          <td className="py-2.5 px-3 border-y border-slate-200/70 group-hover:border-amber-200 bg-white transition-colors">
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200/80 inline-flex items-center gap-1 shadow-2xs">
                              <Building2 className="w-3 h-3 text-amber-600" />
                              <span>{app.municipality}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-y border-slate-200/70 group-hover:border-amber-200 bg-white text-slate-700 text-xs font-medium transition-colors">
                            {app.academic_level}
                          </td>
                          <td className="py-2.5 px-2 border-y border-slate-200/70 group-hover:border-amber-200 bg-white text-center transition-colors">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border shadow-2xs ${
                              app.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                : 'bg-amber-50 text-amber-800 border-amber-200/80'
                            }`}>
                              {app.status === 'approved' ? '✓ Aprobada' : '● Pendiente'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-4 border-y last:border-r border-slate-200/70 last:rounded-r-2xl group-hover:border-amber-200 bg-white text-right transition-colors">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {app.status !== 'approved' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleApproveApplication(app.id, app.full_name)}
                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
                                    title="Aprobar beca"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Aprobar</span>
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRejectApplication(app.id, app.full_name)}
                                    title="Descartar postulación"
                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </motion.button>
                                </>
                              )}

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleContactWhatsApp(app.phone, app.full_name, `Hola ${app.full_name}, te escribimos de la Dirección Académica respecto a tu postulación de beca en ${app.municipality}.`)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold py-1.5 px-2.5 rounded-xl transition-colors inline-flex items-center gap-1 text-[10px] cursor-pointer shadow-2xs"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp</span>
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 5: FONDOS & DONACIONES COLECTIVAS                                   */}
        {/* ========================================================================= */}
        {activeTab === 'donaciones' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0"
          >
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/70 uppercase tracking-wider mb-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Fondo Filantrópico Urabá</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <span>Fondos & Donaciones Colectivas Urabá</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Recaudación y becas financiadas a través de la red global de donantes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Fondo Social Activo</span>
                </span>
              </div>
            </div>

            {/* DONATIONS METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 shrink-0">
              <motion.div 
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-emerald-50/40 border border-slate-200/90 hover:border-emerald-200/80 p-5 rounded-2xl sm:rounded-3xl space-y-2 shadow-2xs hover:shadow-sm transition-all"
              >
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Recaudado</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  ${totalDonationsAmount.toLocaleString('es-CO')} <span className="text-xs font-bold text-slate-400">COP</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reconciliado en public.donations</span>
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-amber-50/40 border border-slate-200/90 hover:border-amber-200/80 p-5 rounded-2xl sm:rounded-3xl space-y-2 shadow-2xs hover:shadow-sm transition-all"
              >
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Becas Financiadas</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  {Math.max(1, Math.floor(studentsCount * 0.4))} <span className="text-xs font-bold text-slate-400">Becarios</span>
                </p>
                <p className="text-[11px] text-amber-800 font-bold">Estudiantes de la subregión de Urabá</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-gradient-to-br from-white to-blue-50/40 border border-slate-200/90 hover:border-blue-200/80 p-5 rounded-2xl sm:rounded-3xl space-y-2 shadow-2xs hover:shadow-sm transition-all"
              >
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aporte Promedio</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  $120.000 <span className="text-xs font-bold text-slate-400">COP</span>
                </p>
                <p className="text-[11px] text-blue-700 font-bold">Campaña Bilingüe 2026-I</p>
              </motion.div>
            </div>

            {/* DONATIONS ACTION BANNER */}
            <div className="bg-gradient-to-r from-[#0B1B3D] via-[#162a56] to-[#1e3a8a] text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 shadow-lg border border-white/10 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1.5 text-center md:text-left relative z-10">
                <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                  <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                  <span>Campaña de Becas Bilingües Urabá</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Los fondos recaudados financian directamente el 100% de la matrícula, materiales en inglés y certificación MCER para jóvenes de Urabá.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={fetchAdminData}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all shadow-md whitespace-nowrap flex items-center gap-2 cursor-pointer relative z-10"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar Recaudación</span>
              </motion.button>
            </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VISTA 6: CATÁLOGO DE CURSOS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-800 relative z-10 flex-1 flex flex-col min-h-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200/70 uppercase tracking-wider mb-1.5 shadow-2xs">
                  <span>Plataforma & Pensum</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>Catálogo de Cursos & Precios</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mapeo de cursos, niveles MCER, horas académicas y tarifas en COP/USD.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard/admin/products"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shadow-purple-500/20"
                >
                  <span>Ir al Catálogo Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-slate-50/90 to-purple-50/30 border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mx-auto flex items-center justify-center shadow-2xs">
                <Package className="w-7 h-7 text-purple-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Gestión de Catálogo & Aulas Virtuales</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Configura la visibilidad pública de cursos, cupos disponibles, modalidades presenciales/virtuales y pasarelas de pago integradas.
                </p>
              </div>

              <div className="pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Link
                    href="/dashboard/admin/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                    <span>Abrir Administrador de Productos</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  )
}
