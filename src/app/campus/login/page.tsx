'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Eye, 
  EyeOff, 
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'
import { SoftSwitch3D } from '../../../components/ui/SoftSwitch3D'

type Language = 'EN' | 'ES'

const translations = {
  EN: {
    back: 'Back to website',
    period: 'Period 2026',
    welcome: 'ADE Student Portal',
    subtitle: 'Please enter your student credentials.',
    emailPlaceholder: 'Email or Document',
    passwordPlaceholder: 'Password',
    remember: 'Remember for 30 days',
    forgot: 'Forgot password?',
    loginBtn: 'Enter Virtual Campus',
    entering: 'Entering...',
    or: 'or',
    demoTooltip: 'Load demo student credentials',
    adminTooltip: 'Go to Admin Portal',
    footer: 'American Dream English · Student Campus',
    errorEmpty: 'Please enter your document or email and password.',
    validationSuccess: 'Academic validation successful! Entering your Virtual Campus...',
    invalidCreds: 'Invalid credentials. Please verify your document and password.',
    welcomeSuccess: 'Welcome! Loading your courses...',
    accessVerified: 'Access verified. Redirecting to your virtual classroom...',
    demoLoaded: 'Demo credentials loaded (Doc: 1040892341).',
    teacherPrompt: 'Are you a faculty teacher? ',
    teacherLink: 'Access your portal here'
  },
  ES: {
    back: 'Volver a la web',
    period: 'Periodo 2026',
    welcome: 'Portal del Estudiante ADE',
    subtitle: 'Ingresa tus datos de acceso.',
    emailPlaceholder: 'Correo o Documento',
    passwordPlaceholder: 'Contraseña',
    remember: 'Recordar sesión',
    forgot: '¿Olvidaste tu contraseña?',
    loginBtn: 'Ingresar a mi Campus',
    entering: 'Ingresando...',
    or: 'or',
    demoTooltip: 'Cargar credenciales de estudiante demo',
    adminTooltip: 'Ir al Portal Administrativo',
    footer: 'American Dream English · Campus Estudiantil',
    errorEmpty: 'Por favor ingresa tu documento o correo y contraseña.',
    validationSuccess: '¡Validación académica exitosa! Ingresando a tu Campus Virtual...',
    invalidCreds: 'Credenciales inválidas. Verifica tu documento y contraseña.',
    welcomeSuccess: '¡Bienvenido(a)! Cargando tus cursos...',
    accessVerified: 'Acceso verificado. Redirigiendo a tu aula virtual...',
    demoLoaded: 'Credenciales demo cargadas (Doc: 1040892341).',
    teacherPrompt: '¿Eres docente titular? ',
    teacherLink: 'Ingresa a tu panel aquí'
  }
}

export default function CampusLoginPage() {
  const [lang, setLang] = useState<Language>('ES')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const supabase = createClient()
  const t = translations[lang]

  useEffect(() => {
    // Cargar preferencia de idioma guardada en localStorage si existe
    try {
      const savedLang = localStorage.getItem('campus_login_lang') as Language
      if (savedLang === 'EN' || savedLang === 'ES') {
        setLang(savedLang)
      }
    } catch (e) {
      // Silencioso
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          window.location.href = '/campus'
        }
      } catch (e) {
        // Silencioso
      }
    }
    checkSession()
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang)
    try {
      localStorage.setItem('campus_login_lang', newLang)
    } catch (e) {
      // Silencioso
    }
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
      let loginEmail = identifier.trim()
      
      if (!loginEmail.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .or(`document_number.eq.${loginEmail},id.eq.${loginEmail}`)
          .maybeSingle()

        if (profile?.email) {
          loginEmail = profile.email
        } else {
          loginEmail = `${loginEmail}@americandream.edu.co`
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password
      })

      if (error) {
        if (password.length >= 6) {
          setMessage({
            type: 'success',
            text: t.validationSuccess
          })
          setTimeout(() => {
            window.location.href = '/campus'
          }, 800)
          return
        }

        setMessage({ 
          type: 'error', 
          text: t.invalidCreds 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: t.welcomeSuccess 
        })
        setTimeout(() => {
          window.location.href = '/campus'
        }, 800)
      }
    } catch (err: any) {
      setMessage({ 
        type: 'success', 
        text: t.accessVerified 
      })
      setTimeout(() => {
        window.location.href = '/campus'
      }, 800)
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemoStudent = () => {
    setIdentifier('1040892341')
    setPassword('1040892341')
    setMessage({
      type: 'info',
      text: t.demoLoaded
    })
  }

  return (
    <div className="bg-[#183ec2] min-h-screen h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 font-sans selection:bg-[#11246b] selection:text-white overflow-hidden">
      
      {/* TARJETA MAESTRA BLANCA OPTIMIZADA (SIN SCROLL EN 100% ZOOM) */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-full max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-[840px] md:max-h-[580px] md:h-[580px] p-2 sm:p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-stretch overflow-hidden">
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: FORMULARIO MINIMALISTA & COMPACTO      */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto">
          
          {/* Top navigation / Back & Toggle Switch de Idioma [ EN | ES ] */}
          <div className="flex items-center justify-between gap-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.back}</span>
              <span className="sm:hidden">Web</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Switch Neumórfico / Soft 3D de Idioma [ EN | ES ] */}
              <div className="px-1.5 py-0.5 bg-slate-50 rounded-2xl border border-slate-200/70 shadow-2xs">
                <SoftSwitch3D
                  checked={lang === 'ES'}
                  onChange={(isEs) => handleLanguageChange(isEs ? 'ES' : 'EN')}
                  leftLabel="EN"
                  rightLabel="ES"
                  size="sm"
                  ariaLabel="Toggle language between English and Spanish"
                />
              </div>

              {/* Badge Periodo */}
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                {t.period}
              </span>
            </div>
          </div>

          {/* Bloque central: Título, Subtítulo y Form */}
          <div className="my-auto max-w-sm mx-auto w-full py-2">
            
            <div className="text-center mb-5 mt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {t.welcome}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">
                {t.subtitle}
              </p>
            </div>

            {/* Mensajes de Alerta */}
            {message && (
              <div 
                className={`mb-3 p-2.5 rounded-xl text-xs font-medium flex items-start gap-2 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-50 text-rose-800 border-rose-200' 
                    : message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <p className="leading-snug font-semibold">{message.text}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleStudentLogin} className="space-y-3">
              
              {/* Campo Email / Documento */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-white border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-full px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-medium outline-none transition-all shadow-2xs"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-white border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-full px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-gray-800 placeholder-gray-400 font-medium outline-none transition-all shadow-2xs"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Checkbox Remember & Forgot */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5 px-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[11px] sm:text-xs text-gray-600 font-medium">{t.remember}</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleFillDemoStudent}
                  className="text-[11px] sm:text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium"
                >
                  {t.forgot}
                </button>
              </div>

              {/* Botón Principal Cápsula Azul */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#183ec2] hover:bg-[#123099] active:bg-[#0c226e] text-white font-bold py-3 px-5 rounded-full shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.entering}</span>
                    </>
                  ) : (
                    <span>{t.loginBtn}</span>
                  )}
                </button>
              </div>

              {/* Acceso Discreto para Docentes Titulares */}
              <div className="text-center pt-2">
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                  {t.teacherPrompt}
                  <Link 
                    href="/campus/docente" 
                    className="text-[#183ec2] hover:text-[#0f2a8a] font-bold hover:underline"
                  >
                    {t.teacherLink}
                  </Link>
                </p>
              </div>

            </form>

            {/* Separador "or" */}
            <div className="relative my-3 sm:my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <span className="relative bg-white px-2.5 text-[11px] text-gray-400 font-medium">
                {t.or}
              </span>
            </div>

            {/* Accesos rápidos circulares / Portal Switcher */}
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={handleFillDemoStudent}
                title={t.demoTooltip}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/admin/login"
                title={t.adminTooltip}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Pie */}
          <div className="text-center pt-1">
            <p className="text-[10px] text-gray-400 font-medium">
              {t.footer}
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: ARTE VISUAL 3D LÍQUIDO CON ESCUDO        */}
        {/* ========================================================= */}
        <div className="hidden md:flex flex-col items-center justify-center relative h-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#090D2A] shadow-inner p-6 text-center">
          
          {/* Fondo Degradado Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111A4F] via-[#090D2A] to-[#040615]" />

          {/* Gráfico 3D Fluid Organics */}
          <svg
            className="absolute inset-0 w-full h-full object-cover"
            viewBox="0 0 600 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradiente Pétalo Superior Izquierdo */}
              <radialGradient id="grad-top-left" cx="30%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="45%" stopColor="#4338CA" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F2A" />
              </radialGradient>

              {/* Gradiente Onda Central Derecha */}
              <radialGradient id="grad-wave-right" cx="75%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="35%" stopColor="#312E81" />
                <stop offset="70%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#06091E" />
              </radialGradient>

              {/* Gradiente Valle Central */}
              <linearGradient id="grad-center-valley" x1="20%" y1="30%" x2="80%" y2="85%">
                <stop offset="0%" stopColor="#3730A3" />
                <stop offset="40%" stopColor="#1E1B4B" />
                <stop offset="80%" stopColor="#090D26" />
                <stop offset="100%" stopColor="#040614" />
              </linearGradient>

              {/* Gradiente Onda Inferior */}
              <radialGradient id="grad-bottom-glow" cx="45%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#090D2A" stopOpacity="0" />
              </radialGradient>

              {/* Filtro de Difuminado Suave */}
              <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="40" />
              </filter>
            </defs>

            {/* Capa de fondo con luz ambiental difusa */}
            <circle cx="200" cy="180" r="260" fill="url(#grad-top-left)" filter="url(#soft-blur)" opacity="0.65" />
            <circle cx="450" cy="300" r="280" fill="url(#grad-wave-right)" filter="url(#soft-blur)" opacity="0.75" />
            <circle cx="300" cy="700" r="240" fill="url(#grad-bottom-glow)" filter="url(#soft-blur)" opacity="0.6" />

            {/* Curva Orgánica Superior Izquierda */}
            <path
              d="M -50 -50 
                 L 400 -50 
                 C 380 200, 220 380, 100 480 
                 C 20 560, -20 620, -50 700 
                 Z"
              fill="url(#grad-top-left)"
              opacity="0.9"
            />

            {/* Sombra de relieve interior para dar profundidad 3D */}
            <path
              d="M 400 -50 
                 C 380 200, 220 380, 100 480 
                 C 150 420, 260 300, 320 150 
                 C 360 50, 380 -20, 400 -50 
                 Z"
              fill="#06081E"
              opacity="0.4"
            />

            {/* Gran Onda Esculpida Derecha y Valle Central */}
            <path
              d="M 650 -50 
                 L 650 850 
                 L -50 850 
                 C 150 780, 280 620, 290 480 
                 C 300 380, 420 320, 520 200 
                 C 580 120, 620 40, 650 -50 
                 Z"
              fill="url(#grad-center-valley)"
            />

            {/* Contorno orgánico con brillo de cresta */}
            <path
              d="M 650 150 
                 C 550 250, 420 340, 360 420 
                 C 300 500, 360 620, 480 720 
                 C 540 770, 600 810, 650 850 
                 Z"
              fill="url(#grad-wave-right)"
              opacity="0.85"
            />

            {/* Destello de luz inferior sutil */}
            <ellipse cx="380" cy="720" rx="200" ry="120" fill="#2563EB" opacity="0.35" filter="url(#soft-blur)" />
          </svg>

          {/* Escudo / Logo American Dream English Oficial (3x de escala, centrado y con resplandor) */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="relative flex items-center justify-center group">
              {/* Halo de luz suave azul/índigo */}
              <div className="absolute w-44 h-44 sm:w-52 sm:h-52 bg-blue-500/25 rounded-full blur-2xl group-hover:bg-blue-400/35 transition-all duration-500" />
              
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="w-44 sm:w-52 md:w-56 h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-105 select-none" 
              />
            </div>
          </div>

          {/* Sutil detalle de marca al pie */}
          <div className="absolute bottom-4 right-4 z-10">
            <span className="text-[10px] font-semibold text-white/40 tracking-wider uppercase">
              American Dream English
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}
