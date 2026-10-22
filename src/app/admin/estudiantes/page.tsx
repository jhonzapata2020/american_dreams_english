'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { createClient } from '../../../utils/supabase/client'
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  KeyRound, 
  Copy, 
  Check, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  Mail, 
  Phone, 
  BookOpen, 
  Sparkles,
  MessageSquare,
  Award,
  ChevronRight,
  Pencil
} from 'lucide-react'
import { StudentsCrudTable, StudentRecord } from '../../../components/dashboard/StudentsCrudTable'

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-000',
    full_name: 'Edward John',
    email: 'lawson@example.com',
    document_type: 'C.C.',
    document_number: '1040892341',
    phone: '(252) 555-0126',
    mcer_level: 'A1',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
    municipality: 'Turbo (Urabá)',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-04T09:00:00-05:00'
  },
  {
    id: 'stu-001',
    full_name: 'Valeria Morales Montoya',
    email: 'valeria.morales@americandream.edu.co',
    document_type: 'C.C.',
    document_number: '1040892342',
    phone: '+57 312 456 7890',
    mcer_level: 'A1',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
    municipality: 'Turbo (Urabá)',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-04T09:00:00-05:00'
  },
  {
    id: 'stu-002',
    full_name: 'Juan Carlos Higuita Ruiz',
    email: 'juan.higuita@gmail.com',
    document_type: 'C.C.',
    document_number: '1038712990',
    phone: '+57 310 882 1934',
    mcer_level: 'A2',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE',
    municipality: 'Apartadó',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-04T10:30:00-05:00'
  },
  {
    id: 'stu-003',
    full_name: 'María Camila Toro Gómez',
    email: 'camilatoro@outlook.com',
    document_type: 'T.I.',
    document_number: '1040119452',
    phone: '+57 314 901 2288',
    mcer_level: 'A2',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE',
    municipality: 'Carepa',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-03T15:00:00-05:00'
  },
  {
    id: 'stu-004',
    full_name: 'Darlene Robertson',
    email: 'alma.lawson@example.com',
    document_type: 'C.C.',
    document_number: '1040552190',
    phone: '(252) 555-0126',
    mcer_level: 'A1',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
    municipality: 'Turbo (Urabá)',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-02T11:20:00-05:00'
  },
  {
    id: 'stu-005',
    full_name: 'Annette Black',
    email: 'bill.sanders@example.com',
    document_type: 'T.I.',
    document_number: '1040991823',
    phone: '(252) 555-0126',
    mcer_level: 'A2',
    course_name: 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE',
    municipality: 'Apartadó',
    status: 'paused',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-01T14:10:00-05:00'
  },
  {
    id: 'stu-006',
    full_name: 'Ronald Richards',
    email: 'weaver@example.com',
    document_type: 'C.C.',
    document_number: '1040223841',
    phone: '(252) 555-0126',
    mcer_level: 'B1',
    course_name: 'ENGLISH LEVEL 3 - INTERMEDIATE',
    municipality: 'Carepa',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-09-28T16:00:00-05:00'
  },
  {
    id: 'stu-007',
    full_name: 'Ralph Edwards',
    email: 'simmons@example.com',
    document_type: 'C.C.',
    document_number: '1039871234',
    phone: '(252) 555-0126',
    mcer_level: 'B1',
    course_name: 'ENGLISH LEVEL 3 - INTERMEDIATE',
    municipality: 'Chigorodó',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-09-25T08:30:00-05:00'
  },
  {
    id: 'stu-008',
    full_name: 'Courtney Henry',
    email: 'felicia.reid@example.com',
    document_type: 'C.C.',
    document_number: '1038992110',
    phone: '(252) 555-0126',
    mcer_level: 'B2',
    course_name: 'ENGLISH LEVEL 4 - UPPER INTERMEDIATE',
    municipality: 'Virtual',
    status: 'completed',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-09-20T10:00:00-05:00'
  }
]

export default function AdminEstudiantesPage() {
  const supabase = createClient()

  // Estados de lista de estudiantes
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Estados del modal de registro
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form Fields de creación
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [documentType, setDocumentType] = useState('C.C.')
  const [documentId, setDocumentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mcerLevel, setMcerLevel] = useState('A1')
  const [modality, setModality] = useState('virtual')
  const [municipality, setMunicipality] = useState('Turbo (Urabá)')

  // Estados de edición de estudiante
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFullName, setEditFullName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editMcerLevel, setEditMcerLevel] = useState('A1')
  const [editMunicipality, setEditMunicipality] = useState('Turbo (Urabá)')
  const [editStatus, setEditStatus] = useState('active')

  // Estado del Modal de Credenciales
  const [createdCredentials, setCreatedCredentials] = useState<{
    studentName: string
    username: string
    email: string
    documentId: string
    password: string
    courseName: string
    loginUrl: string
  } | null>(null)

  const [copiedNotification, setCopiedNotification] = useState(false)

  // Cargar estudiantes desde la API de Supabase
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        if (data.students && data.students.length > 0) {
          // Mapear registros de Supabase profiles
          const apiStudents: StudentRecord[] = data.students.map((sp: any) => ({
            id: sp.id,
            full_name: sp.full_name || 'Estudiante Registrado',
            email: sp.email || 'estudiante@americandream.edu.co',
            document_type: sp.document_type || 'C.C.',
            document_number: sp.document_number || '',
            phone: sp.phone || '',
            mcer_level: sp.mcer_level || sp.academic_level || 'A1',
            municipality: sp.municipality || sp.origin_location || 'Turbo (Urabá)',
            status: sp.status || 'active',
            avatar_url: sp.avatar_url,
            created_at: sp.created_at,
            course_name: sp.course_name || `ENGLISH LEVEL ${sp.mcer_level || '1'} - GENERAL PROGRAM`
          }))

          setStudents(apiStudents)
        } else {
          setStudents([])
        }
      } else {
        setStudents([])
      }
    } catch (e) {
      console.warn('Aviso al cargar estudiantes desde Supabase:', e)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Resetear y abrir modal de nuevo estudiante
  const handleOpenModal = () => {
    setFirstName('')
    setLastName('')
    setDocumentType('C.C.')
    setDocumentId('')
    setEmail('')
    setPhone('')
    setMcerLevel('A1')
    setModality('virtual')
    setMunicipality('Turbo (Urabá)')
    setFormError(null)
    setIsModalOpen(true)
  }

  // Abrir modal de edición
  const handleOpenEdit = (student: StudentRecord) => {
    setStudentToEdit(student)
    setEditFullName(student.full_name || '')
    setEditEmail(student.email || '')
    setEditPhone(student.phone || '')
    setEditMcerLevel(student.mcer_level || 'A1')
    setEditMunicipality(student.municipality || 'Turbo (Urabá)')
    setEditStatus(student.status || 'active')
  }

  // Guardar cambios de edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentToEdit) return

    setIsEditing(true)
    try {
      const courseTitle = 
        editMcerLevel === 'A1' ? 'ENGLISH LEVEL 1 - GENERAL PROGRAM' :
        editMcerLevel === 'A2' ? 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE' :
        editMcerLevel === 'B1' ? 'ENGLISH LEVEL 3 - INTERMEDIATE' :
        'ENGLISH LEVEL 4 - UPPER INTERMEDIATE'

      // Intentar actualizar en Supabase si no es demo id
      if (!studentToEdit.id.startsWith('stu-')) {
        await supabase
          .from('profiles')
          .update({
            full_name: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            mcer_level: editMcerLevel,
            academic_level: editMcerLevel,
            municipality: editMunicipality,
            origin_location: editMunicipality,
            status: editStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', studentToEdit.id)
      }

      // Actualizar estado local reactivo
      setStudents(prev => prev.map(s => {
        if (s.id === studentToEdit.id) {
          return {
            ...s,
            full_name: editFullName.trim(),
            email: editEmail.trim(),
            phone: editPhone.trim(),
            mcer_level: editMcerLevel,
            municipality: editMunicipality,
            status: editStatus,
            course_name: courseTitle
          }
        }
        return s
      }))

      setStudentToEdit(null)
    } catch (err: any) {
      console.error('Error al actualizar estudiante:', err)
    } finally {
      setIsEditing(false)
    }
  }

  // Crear estudiante en Supabase Auth y lista
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!firstName.trim() || !lastName.trim() || !documentId.trim() || !email.trim()) {
      setFormError('Por favor completa todos los campos obligatorios.')
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanDoc = documentId.trim()

    const exists = students.some(s => s.email?.toLowerCase() === cleanEmail || s.document_number === cleanDoc)
    if (exists) {
      setFormError('Ya existe un estudiante registrado con este correo o número de documento.')
      return
    }

    setIsSubmitting(true)

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      const courseTitle = 
        mcerLevel === 'A1' ? 'ENGLISH LEVEL 1 - GENERAL PROGRAM' :
        mcerLevel === 'A2' ? 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE' :
        mcerLevel === 'B1' ? 'ENGLISH LEVEL 3 - INTERMEDIATE' :
        'ENGLISH LEVEL 4 - UPPER INTERMEDIATE'

      const response = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName,
          documentType,
          documentId: cleanDoc,
          email: cleanEmail,
          phone: phone.trim(),
          mcerLevel,
          courseName: courseTitle,
          modality,
          municipality
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar al estudiante.')
      }

      const generatedPassword = cleanDoc.length >= 6 ? cleanDoc : `${cleanDoc}2026*`

      const newStudentRecord: StudentRecord = {
        id: data.student?.id || `stu-${Date.now()}`,
        full_name: fullName,
        email: cleanEmail,
        document_type: documentType,
        document_number: cleanDoc,
        phone: phone.trim(),
        mcer_level: mcerLevel,
        course_name: courseTitle,
        municipality,
        status: 'active',
        created_at: new Date().toISOString()
      }

      setStudents(prev => [newStudentRecord, ...prev])
      setIsModalOpen(false)

      // Mostrar modal de credenciales
      setCreatedCredentials({
        studentName: fullName,
        username: cleanDoc,
        email: cleanEmail,
        documentId: cleanDoc,
        password: generatedPassword,
        courseName: courseTitle,
        loginUrl: window.location.origin + '/campus/login'
      })

    } catch (err: any) {
      setFormError(err.message || 'Error al conectar con el servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ver credenciales de cualquier alumno
  const handleViewCredentials = (s: StudentRecord) => {
    const doc = s.document_number || '1040892341'
    const pwd = doc.length >= 6 ? doc : `${doc}2026*`
    setCreatedCredentials({
      studentName: s.full_name,
      username: doc,
      email: s.email,
      documentId: doc,
      password: pwd,
      courseName: s.course_name || 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
      loginUrl: window.location.origin + '/campus/login'
    })
  }

  // Copiar Credenciales en formato WhatsApp
  const handleCopyCredentials = () => {
    if (!createdCredentials) return

    const message = `🎉 *¡BIENVENIDO(A) A AMERICAN DREAM ENGLISH!* 🎓\n\nHola *${createdCredentials.studentName}*, tu matrícula oficial ha sido procesada con éxito en el *${createdCredentials.courseName}*.\n\n🔑 *TUS CREDENCIALES DEL CAMPUS VIRTUAL:*\n• *Portal de Acceso:* ${createdCredentials.loginUrl}\n• *Usuario:* ${createdCredentials.documentId} (o tu correo: ${createdCredentials.email})\n• *Contraseña Inicial:* ${createdCredentials.password}\n\n📚 *En tu Campus encontrarás:* Clases en vivo por Microsoft Teams, guías pedagógicas PDF, laboratorios de pronunciación y zona de tareas.\n\n_American Dream English · Resolución Oficial 2471_`

    navigator.clipboard.writeText(message)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 3000)
  }

  // Eliminar estudiante
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la matrícula de "${name}"?`)) {
      return
    }

    try {
      await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' })
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      setStudents(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <DashboardLayout currentRole="admin" activeTab="estudiantes">
      <div className="space-y-6 font-sans pb-12">
        
        {/* ========================================================================= */}
        {/* CABECERA PRINCIPAL ESTILO SOFT 3D NEUMORPHIC                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span className="text-blue-600 font-extrabold">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span>Gestión de Estudiantes</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 sm:gap-3">
              <span>Lista de Estudiantes</span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-black rounded-full shadow-2xs">
                {students.length} Registrados
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1">
              Control de matrículas, cursos MCER, credenciales y seguimiento por sedes de Urabá.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-100" />
              <span>+ Matricular Estudiante</span>
            </motion.button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 CARDS DE MÉTRICAS (SOFT 3D NEUMORPHIC WHITE - 2x2 on Mobile)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Matriculados</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">{students.length}</div>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Activos
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Nivel 1 (A1)</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
              {students.filter(s => (s.mcer_level || '').toUpperCase() === 'A1').length}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 block">
              Iniciación oral
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">A2 y Superior</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
              {students.filter(s => (s.mcer_level || '').toUpperCase() !== 'A1').length}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 block">
              Pre-intermedio+
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Seguridad</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[11px] sm:text-xs font-black text-slate-800 mt-2 sm:mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span>Password = Doc</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 block">
              Acceso simplificado
            </span>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* COMPONENTE DE TABLA CRUD (ESTILO EXACTO FIGMA TEAM LIST)                  */}
        {/* ========================================================================= */}
        <StudentsCrudTable
          students={students}
          loading={loading}
          onRefresh={fetchStudents}
          onOpenCreateModal={handleOpenModal}
          onOpenEditModal={handleOpenEdit}
          onDeleteStudent={handleDeleteStudent}
          onViewCredentials={handleViewCredentials}
        />

        {/* ========================================================================= */}
        {/* MODAL 1: REGISTRAR NUEVO ESTUDIANTE                                       */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-fadeIn">
              
              <div className="bg-[#002B49] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Matricular Nuevo Estudiante
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">
                      Generación de credenciales automáticas en Supabase Auth
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Valeria"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Morales Montoya"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tipo Doc. *
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                    >
                      <option value="C.C.">Cédula (C.C.)</option>
                      <option value="T.I.">Tarjeta Id. (T.I.)</option>
                      <option value="C.E.">Cédula Ext. (C.E.)</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Número de Documento (Contraseña Inicial) *
                    </label>
                    <input
                      type="text"
                      required
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      placeholder="Ej. 1040892341"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alumno@gmail.com"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 312 000 0000"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nivel Académico MCER *
                    </label>
                    <select
                      value={mcerLevel}
                      onChange={(e) => setMcerLevel(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-[#002B49]"
                    >
                      <option value="A1">Nivel 1 - Principiante (A1)</option>
                      <option value="A2">Nivel 2 - Pre-Intermedio (A2)</option>
                      <option value="B1">Nivel 3 - Intermedio (B1)</option>
                      <option value="B2">Nivel 4 - Avanzado (B2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sede / Municipio Urabá *
                    </label>
                    <select
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Turbo (Urabá)">Turbo (Sede Principal Urabá)</option>
                      <option value="Apartadó">Apartadó</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Virtual">Virtual en Vivo (Microsoft Teams)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                  ℹ️ <strong>Nota:</strong> La cuenta se creará en Supabase Auth y su contraseña inicial será exactamente su número de documento. Podrá ingresar de inmediato desde <span className="font-mono text-[#002B49]">/campus/login</span>.
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creando Cuenta...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-blue-100" />
                        <span>Crear Cuenta & Matricular</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: EDITAR ESTUDIANTE                                                */}
        {/* ========================================================================= */}
        {studentToEdit && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
              
              <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Editar Estudiante
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">
                      Modificar nivel MCER, sede o datos de contacto
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setStudentToEdit(null)}
                  className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nivel MCER
                    </label>
                    <select
                      value={editMcerLevel}
                      onChange={(e) => setEditMcerLevel(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-700"
                    >
                      <option value="A1">Nivel A1</option>
                      <option value="A2">Nivel A2</option>
                      <option value="B1">Nivel B1</option>
                      <option value="B2">Nivel B2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sede Urabá
                    </label>
                    <select
                      value={editMunicipality}
                      onChange={(e) => setEditMunicipality(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                    >
                      <option value="Turbo (Urabá)">Turbo</option>
                      <option value="Apartadó">Apartadó</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Virtual">Virtual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Estado
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                    >
                      <option value="active">Activo</option>
                      <option value="paused">Pausado</option>
                      <option value="completed">Graduado</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStudentToEdit(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                    disabled={isEditing}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isEditing}
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-[0.98]"
                  >
                    {isEditing ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CREDENCIALES DEL ESTUDIANTE & MENSAJE WHATSAPP                   */}
        {/* ========================================================================= */}
        {createdCredentials && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
              
              <div className="bg-gradient-to-r from-blue-600 to-[#002B49] text-white p-6 text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <h3 className="font-black text-lg text-white">
                  Credenciales de Campus Virtual
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Datos de acceso institucional para el alumno.
                </p>
              </div>

              <div className="p-6 space-y-4">
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Estudiante:</span>
                    <strong className="text-sm text-slate-900">{createdCredentials.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Curso Asignado:</span>
                    <strong className="text-blue-800">{createdCredentials.courseName}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 uppercase font-bold text-[10px] block">Usuario / Login:</span>
                      <span className="font-mono font-bold text-slate-900">{createdCredentials.documentId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-bold text-[10px] block">Contraseña Inicial:</span>
                      <span className="font-mono font-bold text-emerald-600">{createdCredentials.password}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Enlace de Ingreso:</span>
                    <span className="font-mono text-blue-700 font-semibold">{createdCredentials.loginUrl}</span>
                  </div>
                </div>

                {copiedNotification && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Mensaje de bienvenida copiado para WhatsApp!</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={handleCopyCredentials}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-950" />
                    <span>Copiar Bienvenida WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setCreatedCredentials(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
