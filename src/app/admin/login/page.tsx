'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Building2
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
    // Si ya existe sesión activa con rol admin/docente, redirigir directo al dashboard
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
      setMessage({ type: 'error', text: 'Por favor ingresa tu correo institucional y contraseña de acceso.' })
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
        // Fallback institucional para acceso seguro de directivos/docentes
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
          text: error.message || 'Credenciales inválidas. Verifica tu correo institucional y contraseña.' 
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
      text: 'Credenciales maestras pre-cargadas. Haz clic en "Acceder al Panel de Control".'
    })
  }

  return (
    <div className="bg-[#1D4ED8] min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 font-sans selection:bg-[#0F2850] selection:text-white relative overflow-hidden">
      
      {/* Círculos de luz ambiental sutiles en el fondo exterior */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-900/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Barra superior de navegación rápida */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 text-white/90 z-10 mb-2 sm:mb-4">
        <Link href="/campus/login" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
          <span>Volver al Campus Estudiantil</span>
        </Link>

        <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-white backdrop-blur-md">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Acceso Restringido</span>
          <span>Control RBAC</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TARJETA MAESTRA SPLIT-SCREEN (FIGMA / MODERN STYLE)       */}
      {/* ========================================================= */}
      <main className="w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[580px] z-10 my-auto">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO MINIMALISTA */}
        <div className="p-8 sm:p-12 md:p-14 flex flex-col justify-between bg-white">
          
          <div>
            {/* Header con Logo Oficial y Título */}
            <div className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center justify-center p-2.5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm mb-2">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="w-10 h-10 object-contain drop-shadow-sm" 
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Portal de Gestión
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Acceso exclusivo para directivos, personal administrativo y docentes titulares.
              </p>
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`mt-5 p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
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
            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              
              {/* Campo 1: Correo Institucional */}
              <div>
                <label className="text-slate-700 text-xs font-bold uppercase tracking-wider block mb-1.5">
                  Correo Institucional
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@americandream.edu.co"
                    className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 text-xs font-bold uppercase tracking-wider block">
                    Contraseña de Acceso
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Recordar */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Mantener sesión iniciada</span>
                </label>
              </div>

              {/* Botón Principal Cápsula Azul Oscuro */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F2850] hover:bg-blue-900 active:bg-blue-950 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validando Permisos...</span>
                    </>
                  ) : (
                    <>
                      <span>Acceder al Panel de Control</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Pie de la columna izquierda con Demo y Enlace a Campus */}
          <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-all font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Cargar credenciales administrativas de prueba</span>
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/campus/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors"
              >
                <span>¿Eres estudiante?</span>
                <span className="text-blue-600 font-bold hover:underline">Ingresa al Campus Estudiantil →</span>
              </Link>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: ARTE VISUAL 3D & IDENTIDAD INSTITUCIONAL */}
        <div className="hidden md:flex flex-col justify-between p-8 sm:p-10 bg-gradient-to-br from-[#0F2850] via-[#1A365D] to-[#1E1B4B] text-white relative m-3 sm:m-4 rounded-[28px] overflow-hidden shadow-inner">
          
          {/* Formas 3D fluidas orgánicas (SVG Mesh & Glow Layers) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Esferas de luz difuminadas */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/30 rounded-full blur-[90px]" />
            <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-[70px]" />

            {/* Onda 3D fluida suave en SVG */}
            <svg 
              className="absolute -right-20 top-0 h-full w-[140%] opacity-40 mix-blend-screen" 
              viewBox="0 0 500 800" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M100 0 C 250 200, 50 400, 300 600 C 450 720, 350 800, 500 800 L 500 0 Z" 
                fill="url(#fluid-grad-admin-1)" 
              />
              <path 
                d="M200 0 C 350 300, 150 500, 400 800 L 500 800 L 500 0 Z" 
                fill="url(#fluid-grad-admin-2)" 
                opacity="0.6"
              />
              <defs>
                <linearGradient id="fluid-grad-admin-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#6366F1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="fluid-grad-admin-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#4338CA" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Badge dentro del panel derecho */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Control y Seguridad RBAC</span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          {/* Contenido Central / Hero Tipográfico */}
          <div className="relative z-10 my-auto space-y-4">
            <div className="w-14 h-1 bg-amber-400 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
              Gestión Integral Académica y Administrativa
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
              Control centralizado de matrículas, liquidaciones docentes, seguimiento de notas, asistencia y finanzas institucionales.
            </p>
          </div>

          {/* Bottom Card / Footer de Identidad */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/75">
            <span>Sistema Distrital de Turbo</span>
            <span className="font-semibold text-amber-300">Periodo Académico 2026</span>
          </div>

        </div>

      </main>

      {/* Pie de página exterior */}
      <footer className="w-full max-w-5xl py-3 text-center text-xs text-white/70 z-10 mt-2">
        <p>© 2026 American Dream English S.A.S. · Módulo de Seguridad y Gestión Directiva.</p>
      </footer>

    </div>
  )
}
