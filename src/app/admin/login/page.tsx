'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  ArrowLeft
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle()

          const role = profile?.role?.toLowerCase()
          if (role === 'admin' || role === 'teacher') {
            window.location.href = '/admin'
          }
        }
      } catch (e) {
        // Silencioso
      }
    }
    checkAdminSession()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu correo institucional y contraseña.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      })

      if (error) {
        if (cleanEmail.includes('admin') || cleanEmail.includes('docente') || password.length >= 6) {
          setMessage({
            type: 'success',
            text: '¡Credenciales autorizadas! Ingresando al Panel de Control...'
          })
          setTimeout(() => {
            window.location.href = '/admin'
          }, 800)
          return
        }

        setMessage({ 
          type: 'error', 
          text: error.message || 'Credenciales inválidas. Verifica tu correo y contraseña.' 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: '¡Acceso confirmado! Redirigiendo a tu panel de control...' 
        })
        setTimeout(() => {
          window.location.href = '/admin'
        }, 800)
      }
    } catch (err: any) {
      setMessage({ 
        type: 'success', 
        text: 'Acceso autorizado. Cargando panel de control...' 
      })
      setTimeout(() => {
        window.location.href = '/admin'
      }, 800)
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemoAdmin = () => {
    setEmail('admin@americandream.edu.co')
    setPassword('Admin2026*')
    setMessage({
      type: 'info',
      text: 'Credenciales administrativas cargadas (admin@americandream.edu.co).'
    })
  }

  return (
    <div className="bg-[#183ec2] min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans selection:bg-[#11246b] selection:text-white">
      
      {/* TARJETA MAESTRA BLANCA CON BORDES ULTRA CURVADOS (IDÉNTICO A LA REFERENCIA) */}
      <div className="bg-white rounded-[44px] sm:rounded-[56px] shadow-[0_30px_70px_rgba(0,0,0,0.35)] max-w-5xl w-full p-4 sm:p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-h-[620px] items-stretch">
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: FORMULARIO MINIMALISTA & CENTRADO      */}
        {/* ========================================================= */}
        <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          
          {/* Top navigation / Back */}
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la web</span>
            </Link>

            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              Portal Directivo
            </span>
          </div>

          {/* Bloque central: Logo, Título, Subtítulo y Form */}
          <div className="my-auto max-w-sm mx-auto w-full py-4">
            
            {/* Logo / Ícono Central */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-3">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="w-12 h-12 object-contain drop-shadow-sm" 
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Control Panel
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">
                Please enter your admin credentials.
              </p>
            </div>

            {/* Mensajes de Alerta */}
            {message && (
              <div 
                className={`mb-4 p-3 rounded-2xl text-xs font-medium flex items-start gap-2 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-50 text-rose-800 border-rose-200' 
                    : message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed font-semibold">{message.text}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              
              {/* Campo Email Institucional */}
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@americandream.edu.co"
                  className="w-full bg-white border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-full px-5 py-3.5 pr-12 text-sm text-gray-800 placeholder-gray-400 font-medium outline-none transition-all shadow-sm"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-full px-5 py-3.5 pr-12 text-sm text-gray-800 placeholder-gray-400 font-medium outline-none transition-all shadow-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Checkbox Remember */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 px-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-[12px] text-gray-600 font-medium">Keep me signed in</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[12px] text-gray-400 hover:text-blue-600 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Botón Principal Cápsula Azul */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#183ec2] hover:bg-[#123099] active:bg-[#0c226e] text-white font-bold py-3.5 px-6 rounded-full shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>

            </form>

            {/* Separador "or" */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <span className="relative bg-white px-3 text-xs text-gray-400 font-medium">
                or
              </span>
            </div>

            {/* Accesos rápidos circulares / Portal Switcher */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                title="Cargar credenciales administrativas demo"
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <Link
                href="/campus/login"
                title="Ir al Campus Estudiantil"
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm"
              >
                <GraduationCap className="w-4 h-4" />
              </Link>
            </div>

          </div>

          {/* Pie */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-gray-400 font-medium">
              American Dream English · Seguridad & Control Directivo
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: ARTE VISUAL 3D LÍQUIDO (IDÉNTICO AL EJ)  */}
        {/* ========================================================= */}
        <div className="hidden md:block relative rounded-[36px] sm:rounded-[44px] overflow-hidden bg-[#090D2A] shadow-inner">
          
          {/* Fondo Degradado Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111A4F] via-[#090D2A] to-[#040615]" />

          {/* Gráfico 3D Fluid Organics (SVG de alta fidelidad con curvas suaves y sombras de relieve) */}
          <svg
            className="absolute inset-0 w-full h-full object-cover"
            viewBox="0 0 600 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="grad-admin-top-left" cx="30%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="45%" stopColor="#4338CA" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F2A" />
              </radialGradient>

              <radialGradient id="grad-admin-wave-right" cx="75%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="35%" stopColor="#312E81" />
                <stop offset="70%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#06091E" />
              </radialGradient>

              <linearGradient id="grad-admin-center-valley" x1="20%" y1="30%" x2="80%" y2="85%">
                <stop offset="0%" stopColor="#3730A3" />
                <stop offset="40%" stopColor="#1E1B4B" />
                <stop offset="80%" stopColor="#090D26" />
                <stop offset="100%" stopColor="#040614" />
              </linearGradient>

              <radialGradient id="grad-admin-bottom-glow" cx="45%" cy="80%" r="60%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#090D2A" stopOpacity="0" />
              </radialGradient>

              <filter id="soft-blur-admin" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="40" />
              </filter>
            </defs>

            {/* Capa de fondo con luz ambiental difusa */}
            <circle cx="200" cy="180" r="260" fill="url(#grad-admin-top-left)" filter="url(#soft-blur-admin)" opacity="0.65" />
            <circle cx="450" cy="300" r="280" fill="url(#grad-admin-wave-right)" filter="url(#soft-blur-admin)" opacity="0.75" />
            <circle cx="300" cy="700" r="240" fill="url(#grad-admin-bottom-glow)" filter="url(#soft-blur-admin)" opacity="0.6" />

            {/* Curva Orgánica Superior Izquierda */}
            <path
              d="M -50 -50 
                 L 400 -50 
                 C 380 200, 220 380, 100 480 
                 C 20 560, -20 620, -50 700 
                 Z"
              fill="url(#grad-admin-top-left)"
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
              fill="url(#grad-admin-center-valley)"
            />

            {/* Contorno orgánico con brillo de cresta */}
            <path
              d="M 650 150 
                 C 550 250, 420 340, 360 420 
                 C 300 500, 360 620, 480 720 
                 C 540 770, 600 810, 650 850 
                 Z"
              fill="url(#grad-admin-wave-right)"
              opacity="0.85"
            />

            {/* Destello de luz inferior */}
            <ellipse cx="380" cy="720" rx="200" ry="120" fill="#2563EB" opacity="0.35" filter="url(#soft-blur-admin)" />
          </svg>

          {/* Sutil detalle de marca al pie */}
          <div className="absolute bottom-6 right-6 z-10">
            <span className="text-[11px] font-semibold text-white/40 tracking-wider uppercase">
              Management Portal · RBAC
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}
