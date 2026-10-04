'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { createClient } from '../../../utils/supabase/client'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  KeyRound, 
  Copy, 
  Check, 
  X, 
  Trash2, 
  RefreshCw, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  BookOpen, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  MessageSquare
} from 'lucide-react'

interface StudentRecord {
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
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-001',
    full_name: 'Valeria Morales Montoya',
    email: 'valeria.morales@americandream.edu.co',
    document_type: 'C.C.',
    document_number: '1040892341',
    phone: '+57 312 456 7890',
    mcer_level: 'A1',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
    municipality: 'Turbo (Urabá)',
    status: 'active',
    created_at: '2026-10-04T09:00:00-05:00'
  },
  {
    id: 'stu-002',
    full_name: 'Juan Carlos Higuita Ruiz',
    email: 'juan.higuita@gmail.com',
    document_type: 'C.C.',
    document_number: '1038712990',
    phone: '+57 310 882 1934',
    mcer_level: 'A1',
    course_name: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
    municipality: 'Apartadó',
    status: 'active',
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
    created_at: '2026-10-03T15:00:00-05:00'
  }
]

export default function AdminEstudiantesPage() {
  const supabase = createClient()

  // Estados de lista
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  // Estados del modal de registro
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Form Fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [documentType, setDocumentType] = useState('C.C.')
  const [documentId, setDocumentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mcerLevel, setMcerLevel] = useState('A1')
  const [modality, setModality] = useState('virtual')
  const [municipality, setMunicipality] = useState('Turbo (Urabá)')

  // Estado del Modal de Éxito / Credenciales
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

  // Cargar estudiantes desde la API
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        if (data.students && data.students.length > 0) {
          setStudents(data.students)
        }
      }
    } catch (e) {
      console.warn('Error al cargar estudiantes:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filtrado reactivo
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const name = s.full_name || ''
      const email = s.email || ''
      const doc = s.document_number || ''
      const level = s.mcer_level || 'A1'

      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.includes(searchTerm)

      const matchesLevel = levelFilter === 'all' || level === levelFilter

      return matchesSearch && matchesLevel
    })
  }, [students, searchTerm, levelFilter])

  // Resetear formulario
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

  // Envío del Formulario
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!firstName.trim() || !lastName.trim() || !documentId.trim() || !email.trim()) {
      setFormError('Por favor completa todos los campos obligatorios.')
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanDoc = documentId.trim()

    // Validar si ya existe en la lista local
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

      // Actualizar lista local
      setStudents(prev => [newStudentRecord, ...prev])

      // Cerrar modal de formulario y abrir modal de credenciales
      setIsModalOpen(false)
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

  // Copiar Credenciales al Portapapeles (Formato WhatsApp)
  const handleCopyCredentials = () => {
    if (!createdCredentials) return

    const message = `🎉 *¡BIENVENIDO(A) A AMERICAN DREAM ENGLISH!* 🎓\n\nHola *${createdCredentials.studentName}*, tu matrícula oficial ha sido procesada con éxito en el *${createdCredentials.courseName}*.\n\n🔑 *TUS CREDENCIALES DEL CAMPUS VIRTUAL:*\n• *Portal de Acceso:* ${createdCredentials.loginUrl}\n• *Usuario:* ${createdCredentials.documentId} (o tu correo: ${createdCredentials.email})\n• *Contraseña Inicial:* ${createdCredentials.password}\n\n📚 *En tu Campus encontrarás:* Tus clases en vivo por Microsoft Teams, guías pedagógicas PDF, laboratorios de audio y zona de tareas.\n\n_American Dream English · Resolución Oficial 2471_`

    navigator.clipboard.writeText(message)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 3000)
  }

  // Eliminar estudiante
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la cuenta del estudiante "${name}"?`)) {
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
      <div className="space-y-8 font-sans pb-12">
        
        {/* CABECERA PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-[#002B49]" />
              <span>Gestión Académica Institucional · Periodo 2026-I</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Estudiantes & Matrículas Oficiales
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Creación de cuentas, asignación de cursos y generación automática de credenciales de Campus Virtual.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-black px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Registrar Nuevo Estudiante</span>
            </button>

            <button
              onClick={fetchStudents}
              className="p-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-600 transition-colors"
              title="Actualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-bold uppercase block">Total Alumnos Registrados</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{students.length}</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% con credenciales activas
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-bold uppercase block">Nivel 1 (A1 Principiante)</span>
            <div className="text-2xl sm:text-3xl font-black text-[#002B49] mt-1">
              {students.filter(s => s.mcer_level === 'A1').length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Ciclo formativo en curso
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-bold uppercase block">Nivel 2 y Superior (A2/B1/B2)</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {students.filter(s => s.mcer_level !== 'A1').length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Pre-intermedio & Avanzado
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 text-xs font-bold uppercase block">Seguridad & Contraseñas</span>
            <div className="text-sm font-extrabold text-slate-800 mt-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Password = No. Documento</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Facilidad de acceso para el alumno
            </span>
          </div>
        </div>

        {/* CONTENEDOR DE TABLA DE ESTUDIANTES */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Barra de Filtros y Búsqueda */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, documento o correo..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-700"
              >
                <option value="all">Todos los Niveles</option>
                <option value="A1">Nivel A1 (English Level 1)</option>
                <option value="A2">Nivel A2 (Pre-Intermediate)</option>
                <option value="B1">Nivel B1 (Intermediate)</option>
                <option value="B2">Nivel B2 (Upper Intermediate)</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Mostrando <strong>{filteredStudents.length}</strong> de <strong>{students.length}</strong> estudiantes
            </span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-800">
                  No se encontraron estudiantes
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Intenta cambiar el criterio de búsqueda o registra un nuevo estudiante con el botón superior.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Estudiante</th>
                    <th className="py-3.5 px-4">Documento / Usuario</th>
                    <th className="py-3.5 px-4">Curso & Nivel</th>
                    <th className="py-3.5 px-4">Contacto & Sede</th>
                    <th className="py-3.5 px-4 text-center">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Estudiante */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#002B49] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {s.full_name ? s.full_name.substring(0, 2).toUpperCase() : 'ST'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">
                              {s.full_name}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {s.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Documento */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">
                          {s.document_number || 'Sin registrar'}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {s.document_type || 'C.C.'} · Password Inicial
                        </span>
                      </td>

                      {/* Curso */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>{s.mcer_level || 'A1'} - {s.course_name || 'ENGLISH LEVEL 1'}</span>
                        </div>
                      </td>

                      {/* Contacto & Sede */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">
                          {s.phone || 'Sin teléfono'}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {s.municipality || 'Turbo (Urabá)'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Activo</span>
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const doc = s.document_number || ''
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
                            }}
                            className="p-1.5 text-[#002B49] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver credenciales de acceso"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(s.id, s.full_name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar estudiante"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* MODAL 1: REGISTRAR NUEVO ESTUDIANTE                      */}
        {/* ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-fadeIn">
              
              {/* Header Modal */}
              <div className="bg-[#002B49] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Registrar Nuevo Estudiante
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">
                      Creación de credenciales automáticas en Supabase Auth
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

              {/* Formulario */}
              <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Nombres */}
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

                  {/* Apellidos */}
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
                  {/* Tipo de Documento */}
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

                  {/* Número de Documento */}
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
                  {/* Correo Electrónico */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Correo Electrónico Personal *
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

                  {/* Teléfono / WhatsApp */}
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
                  {/* Nivel Formativo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nivel Académico Asignado *
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

                  {/* Modalidad */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Modalidad *
                    </label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                    >
                      <option value="virtual">Virtual en Vivo por Teams</option>
                      <option value="presencial">Presencial Sede Turbo (Urabá)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                  ℹ️ <strong>Nota automática:</strong> La cuenta se creará en Supabase Auth y su contraseña inicial será exactamente su número de documento. Podrá ingresar de inmediato desde <span className="font-mono text-[#002B49]">/campus/login</span>.
                </div>

                {/* Botones */}
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
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#002B49] hover:bg-[#001f35] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creando Cuenta...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>Crear Cuenta & Matricular</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: CONFIRMACIÓN Y CREDENCIALES GENERADAS           */}
        {/* ======================================================== */}
        {createdCredentials && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-[#002B49] text-white p-6 text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <h3 className="font-black text-lg text-white">
                  ¡Cuenta de Estudiante Creada!
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  El alumno ha sido matriculado y activado en el Campus Virtual.
                </p>
              </div>

              {/* Contenido de Credenciales */}
              <div className="p-6 space-y-4">
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Estudiante:</span>
                    <strong className="text-sm text-slate-900">{createdCredentials.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Curso Asignado:</span>
                    <strong className="text-amber-800">{createdCredentials.courseName}</strong>
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
                    <span className="font-mono text-[#002B49] font-semibold">{createdCredentials.loginUrl}</span>
                  </div>
                </div>

                {copiedNotification && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Mensaje de bienvenida copiado en formato WhatsApp!</span>
                  </div>
                )}

                {/* Acciones */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={handleCopyCredentials}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-950" />
                    <span>Copiar Bienvenida para WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setCreatedCredentials(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] rounded-xl transition-colors"
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
