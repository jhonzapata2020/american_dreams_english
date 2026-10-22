'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle, 
  CheckCircle2, 
  GraduationCap,
  Sparkles,
  Bot,
  Award,
  ShieldCheck
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'
import { SoftSwitch3D } from '../../../components/ui/SoftSwitch3D'

type Language = 'EN' | 'ES'

const translations = {
  EN: {
    back: 'Back to website',
    period: 'Period 2026',
    welcomeStudent: 'ADE Student Portal',
    welcomeTeacher: 'ADE Faculty Portal',
    subtitleStudent: 'Enter your institutional access credentials.',
    subtitleTeacher: 'Enter your faculty or certified tutor credentials.',
    emailPlaceholderStudent: 'Email or Document ID (C.C.)',
    emailPlaceholderTeacher: 'Institutional Email or Document ID',
    passwordPlaceholder: 'Password',
    remember: 'Remember session',
    forgot: 'Forgot password?',
    loginBtnStudent: 'Enter Virtual Campus',
    loginBtnTeacher: 'Enter Faculty Portal',
    entering: 'Authenticating...',
    adminLink: 'Administrative / Admin Access',
    footerStudent: 'American Dream English · Student Campus',
    footerTeacher: 'American Dream English · Faculty Campus',
    errorEmpty: 'Please enter your document or email and password.',
    welcomeSuccess: 'Welcome! Accessing your virtual classroom...',
    invalidCreds: 'Invalid credentials. Please verify your document and password.',
    teacherPrompt: 'Are you a faculty teacher? ',
    teacherLink: 'Access Faculty Portal here',
    studentPrompt: 'Are you a student? ',
    studentLink: 'Access Student Portal here',
    studentTab: 'Student',
    teacherTab: 'Faculty Teacher',
    badge1Title: 'AI Voice Tutor 24/7',
    badge1Desc: 'Daily speaking practice',
    badge2Title: 'CEFR Official Levels',
    badge2Desc: 'Structured A1 to B2 framework',
    badge3Title: 'Supervised & Certified',
    badge3Desc: 'Official Turbo Resolution 2471'
  },
  ES: {
    back: 'Volver a la web',
    period: 'Periodo 2026',
    welcomeStudent: 'Portal del Estudiante ADE',
    welcomeTeacher: 'Portal del Docente ADE',
    subtitleStudent: 'Ingresa tus datos de acceso institucional.',
    subtitleTeacher: 'Ingresa tus credenciales de docente titular o tutor.',
    emailPlaceholderStudent: 'Correo o Documento (C.C.)',
    emailPlaceholderTeacher: 'Correo institucional o Documento (C.C.)',
    passwordPlaceholder: 'Contraseña',
    remember: 'Recordar sesión',
    forgot: '¿Olvidaste tu contraseña?',
    loginBtnStudent: 'Ingresar a mi Campus',
    loginBtnTeacher: 'Ingresar al Portal Docente',
    entering: 'Autenticando...',
    adminLink: 'Ingreso Directivo / Admin',
    footerStudent: 'American Dream English · Campus Estudiantil',
    footerTeacher: 'American Dream English · Portal Docente Titular',
    errorEmpty: 'Por favor ingresa tu documento o correo y contraseña.',
    welcomeSuccess: '¡Bienvenido(a)! Accediendo a tu aula virtual...',
    invalidCreds: 'Credenciales inválidas. Verifica tu documento y contraseña.',
    teacherPrompt: '¿Eres docente titular? ',
    teacherLink: 'Ingresa a tu panel aquí',
    studentPrompt: '¿Eres estudiante? ',
    studentLink: 'Ingresa al portal estudiantil aquí',
    studentTab: 'Estudiante',
    teacherTab: 'Docente Titular',
    badge1Title: 'Simulador Tutor IA 24/7',
    badge1Desc: 'Práctica conversacional activa',
    badge2Title: 'Niveles Oficiales MCER',
    badge2Desc: 'Estructura formal A1 a B2',
    badge3Title: 'Supervisión y Aval',
    badge3Desc: 'Resolución Distrital Turbo 2471'
  }
}

export default function CampusLoginPage() {
  const [lang, setLang] = useState<Language>('ES')
  const [roleMode, setRoleMode] = useState<'student' | 'teacher'>('student')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const supabase = createClient()
  const t = translations[lang]

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('campus_login_lang') as Language
      if (savedLang === 'EN' || savedLang === 'ES') {
        setLang(savedLang)
      }
    } catch (e) {
      // Silencioso
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('role') === 'teacher' || params.get('mode') === 'teacher' || params.get('mode') === 'docente') {
        setRoleMode('teacher')
      }
      if (params.has('error') || params.has('unauthorized')) {
        setMessage({
          type: 'error',
          text: 'Sesión no autorizada o expirada. Por favor ingresa tus credenciales.'
        })
        supabase.auth.signOut().catch(() => {})
      }
    }
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang)
    try {
      localStorage.setItem('campus_login_lang', newLang)
    } catch (e) {
      // Silencioso
    }
  }

  const handleToggleRoleMode = (targetRole: 'student' | 'teacher') => {
    setRoleMode(targetRole)
    setMessage(null)
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password.trim()) {
      setMessage({ type: 'error', text: t.errorEmpty })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      let loginEmail = identifier.trim().toLowerCase()
      
      // Si el usuario ingresó su número de documento sin '@'
      if (!loginEmail.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('document_number', loginEmail)
          .maybeSingle()

        if (profile?.email) {
          loginEmail = profile.email
        } else {
          loginEmail = `${loginEmail}@americandream.edu.co`
        }
      }

      let { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password
      })

      if (error) {
        const isBadCreds = error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('invalid')
        setMessage({ 
          type: 'error', 
          text: isBadCreds ? t.invalidCreds : error.message 
        })
      } else if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()

        const isTeacherEmail = loginEmail.startsWith('docente') || loginEmail.includes('teacher')
        const role = profile?.role || data.user.user_metadata?.role || (isTeacherEmail ? 'teacher' : 'student')

        if (role === 'teacher') {
          setMessage({ 
            type: 'success', 
            text: '¡Acceso docente confirmado! Redirigiendo a tu aula...' 
          })
          setTimeout(() => {
            window.location.href = '/campus/docente'
          }, 350)
          return
        }

        if (role === 'admin') {
          setMessage({ 
            type: 'success', 
            text: '¡Acceso directivo confirmado! Redirigiendo...' 
          })
          setTimeout(() => {
            window.location.href = '/dashboard/admin'
          }, 350)
          return
        }

        // Estudiante
        if (profile) {
          localStorage.setItem('ade_student_profile', JSON.stringify({
            id: profile.id,
            fullName: profile.full_name || profile.name || data.user.user_metadata?.full_name || '',
            email: profile.email || data.user.email || '',
            phone: profile.phone || data.user.user_metadata?.phone || '',
            avatarUrl: profile.avatar_url || data.user.user_metadata?.avatar_url || '',
            docType: profile.document_type || 'C.C.',
            docNumber: profile.document_number || '',
            currentLevel: (profile.mcer_level || 'A1').toUpperCase().slice(0, 2),
            programName: 'Programa de Inglés Jóvenes y Adultos',
            studentCode: profile.document_number ? `ADE-2026-${profile.document_number.slice(-4)}` : 'ADE-2026-REG',
            status: 'Matriculado Regular'
          }))
        }

        setMessage({ 
          type: 'success', 
          text: t.welcomeSuccess 
        })
        const rawLevel = (profile?.mcer_level || data.user.user_metadata?.mcer_level || 'a1').toLowerCase()
        const studentLevel = ['a1', 'a2', 'b1', 'b2'].includes(rawLevel) ? rawLevel : 'a1'
        setTimeout(() => {
          window.location.href = `/campus/curso/${studentLevel}`
        }, 300)
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || t.invalidCreds 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans bg-[#0B132B] text-slate-900 selection:bg-blue-600 selection:text-white overflow-hidden">
      
      {/* ========================================================= */}
      {/* FONDO AMBIENTAL DE PROFUNDIDAD (21st.dev / Linear Canvas) */}
      {/* ========================================================= */}
      {/* Malla de micro-puntos moderna */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Orbes de luz atmosféricos difusos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* ========================================================= */}
      {/* TARJETA MAESTRA FLOTANTE (ESTILO PRO MAX DESIGN)          */}
      {/* ========================================================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-12 overflow-hidden"
      >
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: FORMULARIO DE ACCESO (7 COLS)         */}
        {/* ========================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
          
          {/* Top Bar: Volver a la web + Idioma + Periodo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>{t.back}</span>
            </Link>

            <div className="flex items-center gap-2.5">
              {/* Switch Neumórfico de Idioma */}
              <div className="px-1.5 py-0.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
                <SoftSwitch3D
                  checked={lang === 'ES'}
                  onChange={(isEs) => handleLanguageChange(isEs ? 'ES' : 'EN')}
                  leftLabel="EN"
                  rightLabel="ES"
                  size="sm"
                  ariaLabel="Toggle language"
                />
              </div>

              {/* Badge Periodo */}
              <span className="text-[10px] font-black tracking-wider uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {t.period}
              </span>
            </div>
          </div>

          {/* Bloque Central: Contenido y Formulario */}
          <div className="py-6 sm:py-8 max-w-sm mx-auto w-full space-y-5">
            
            {/* Segmented Role Switch con Cápsula Deslizante LayoutId */}
            <div className="relative bg-slate-100/90 p-1 rounded-2xl flex items-center text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleRoleMode('student')}
                className={`relative z-10 flex-1 py-2 text-center rounded-xl transition-colors font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleMode === 'student' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {roleMode === 'student' && (
                  <motion.div
                    layoutId="activeCampusRolePill"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <User className="w-3.5 h-3.5" />
                <span>{t.studentTab}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleRoleMode('teacher')}
                className={`relative z-10 flex-1 py-2 text-center rounded-xl transition-colors font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleMode === 'teacher' ? 'text-white font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {roleMode === 'teacher' && (
                  <motion.div
                    layoutId="activeCampusRolePill"
                    className="absolute inset-0 bg-[#002B49] rounded-xl shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.teacherTab}</span>
              </button>
            </div>

            {/* Titular con Transición Fluida */}
            <AnimatePresence mode="wait">
              <motion.div
                key={roleMode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="space-y-1 text-left"
              >
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {roleMode === 'teacher' ? t.welcomeTeacher : t.welcomeStudent}
                </h1>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  {roleMode === 'teacher' ? t.subtitleTeacher : t.subtitleStudent}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mensaje de Feedback / Error */}
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 border ${
                    message.type === 'error' 
                      ? 'bg-red-50 text-red-800 border-red-200' 
                      : message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {message.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-snug">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulario */}
            <form onSubmit={handleStudentLogin} className="space-y-3.5 text-left">
              
              {/* Campo Usuario / Documento con Icono a la Izquierda */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  {roleMode === 'teacher' ? 'Docente (Email o C.C.)' : 'Estudiante (Email o C.C.)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {roleMode === 'teacher' ? (
                      <GraduationCap className="w-4 h-4 text-amber-500" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={roleMode === 'teacher' ? t.emailPlaceholderTeacher : t.emailPlaceholderStudent}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña con Icono a la Izquierda y Toggle a la Derecha */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  {t.passwordPlaceholder}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Recordar Sesión & Olvido */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold">{t.remember}</span>
                </label>

                <a 
                  href="https://wa.me/573104567890?text=Hola,%20necesito%20ayuda%20para%20recuperar%20mi%20contrase%C3%B1a%20de%20ADE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline"
                >
                  {t.forgot}
                </a>
              </div>

              {/* Botón Principal de Acceso con Shimmer (21st.dev style) */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className={`relative overflow-hidden w-full font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-70 ${
                    roleMode === 'teacher'
                      ? 'bg-gradient-to-r from-[#002B49] via-[#002B49] to-[#001728] text-amber-300 shadow-[#002B49]/20'
                      : 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 text-white shadow-blue-600/25'
                  }`}
                >
                  {/* Haz de luz líquido brillante */}
                  <motion.span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full pointer-events-none"
                    animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', repeatDelay: 1.2 }}
                  />

                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="relative z-10">{t.entering}</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">
                        {roleMode === 'teacher' ? t.loginBtnTeacher : t.loginBtnStudent}
                      </span>
                      <ArrowRight className="w-4 h-4 relative z-10 stroke-[2.5]" />
                    </>
                  )}
                </motion.button>
              </div>

            </form>

            {/* Enlace para Docente / Estudiante */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-500 font-medium">
                {roleMode === 'student' ? (
                  <>
                    {t.teacherPrompt}
                    <button 
                      type="button"
                      onClick={() => handleToggleRoleMode('teacher')} 
                      className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer ml-1"
                    >
                      {t.teacherLink}
                    </button>
                  </>
                ) : (
                  <>
                    {t.studentPrompt}
                    <button 
                      type="button"
                      onClick={() => handleToggleRoleMode('student')} 
                      className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer ml-1"
                    >
                      {t.studentLink}
                    </button>
                  </>
                )}
              </p>
            </div>

          </div>

          {/* Footer del Formulario */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 transition-colors font-semibold"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.adminLink}</span>
            </Link>

            <span className="hidden sm:inline">
              {roleMode === 'teacher' ? t.footerTeacher : t.footerStudent}
            </span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: SHOWCASE ACADÉMICO EDTECH (5 COLS)       */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-br from-[#001f35] via-[#091728] to-[#040913] text-white overflow-hidden">
          
          {/* Malla de micro-líneas sutiles */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Halo difuso interno */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Header institucional */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Campus Digital 4K</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              v2.4
            </span>
          </div>

          {/* Centro: Escudo Oficial con relieve y resplandor + Badges */}
          <div className="relative z-10 my-auto py-6 flex flex-col items-center space-y-6 text-center">
            
            {/* Escudo Oficial con halo suave */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl group-hover:bg-blue-400/40 transition-all duration-500" />
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="w-40 sm:w-44 h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none relative z-10" 
              />
            </motion.div>

            {/* Micro-Bento Badges con Microinteracciones */}
            <div className="w-full space-y-2.5 text-left">
              
              {/* Badge 1: Tutor IA */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">{t.badge1Title}</strong>
                  <span className="block text-[10px] text-slate-300 truncate">{t.badge1Desc}</span>
                </div>
              </motion.div>

              {/* Badge 2: Niveles MCER */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">{t.badge2Title}</strong>
                  <span className="block text-[10px] text-slate-300 truncate">{t.badge2Desc}</span>
                </div>
              </motion.div>

              {/* Badge 3: Acreditación Oficial */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">{t.badge3Title}</strong>
                  <span className="block text-[10px] text-slate-300 truncate">{t.badge3Desc}</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Bottom: Legal / Branding */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 font-medium">
            <span>Distrito de Turbo · Urabá</span>
            <span className="text-white/60 font-semibold">Resolución 2471/2022</span>
          </div>

        </div>

      </motion.div>

    </div>
  )
}
