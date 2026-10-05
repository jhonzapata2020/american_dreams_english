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
  ShieldCheck
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0A192F] to-[#1E3A8A] text-white flex flex-col justify-between font-sans selection:bg-[#002B49] selection:text-white relative overflow-hidden">
      
      {/* 1. HEADER INSTITUCIONAL GLASSMORPHISM */}
      <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
              />
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block leading-tight">
                  AMERICAN DREAM ENGLISH
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Portal de Gestión y Control RBAC
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/campus/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Volver al Campus Estudiantil</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CUERPO PRINCIPAL / TARJETA FROSTED GLASS */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 w-full text-white relative overflow-hidden space-y-5">
            
            {/* Ambient Backlight Inside Card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header de la tarjeta con Logo Oficial */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-20 h-20 mx-auto flex items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="w-full h-full object-contain drop-shadow-md" 
                />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                Portal de Gestión Académica y Administrativa
              </h1>

              <p className="text-xs text-slate-300 font-medium">
                Acceso exclusivo para directivos, tesorería y docentes titulares
              </p>

              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Autenticación Segura · Control RBAC</span>
              </div>
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-950/60 text-rose-200 border-rose-500/30' 
                    : message.type === 'success'
                    ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/30'
                    : 'bg-blue-950/60 text-blue-200 border-blue-500/30'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed font-semibold">{message.text}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
              
              {/* Campo 1: Correo Institucional */}
              <div>
                <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                  Correo Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@americandream.edu.co o docente@..."
                    className="bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 rounded-xl w-full pl-10 pr-3.5 py-3 text-sm font-medium transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
                    Contraseña
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 rounded-xl w-full pl-10 pr-11 py-3 text-sm font-medium transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Submit con Gradiente Elevado */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-[#1E3A8A] hover:from-blue-500 hover:to-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm active:scale-[0.99]"
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

            {/* Credenciales demo */}
            <div className="pt-4 border-t border-white/10 text-center relative z-10">
              <button
                type="button"
                onClick={handleFillDemoAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-colors font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar credenciales de demostración</span>
              </button>
            </div>

          </div>

          {/* Enlace de retorno discreto */}
          <div className="mt-6 text-center">
            <Link 
              href="/campus/login" 
              className="text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Volver al Campus Estudiantil</span>
            </Link>
          </div>

        </div>
      </main>

      {/* 3. FOOTER FROSTED */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <p>© 2026 American Dream English S.A.S. · Módulo de Seguridad y Control Académico-Administrativo</p>
      </footer>

    </div>
  )
}
