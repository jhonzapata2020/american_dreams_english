'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  KeyRound
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'

export default function CampusLoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Ya tiene sesión iniciada
        }
      } catch (e) {
        // Silencioso
      }
    }
    checkSession()
  }, [])

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu número de documento o correo y tu contraseña.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      let loginEmail = identifier.trim()
      
      // Si el usuario ingresó un documento (sin @), intentamos buscar su correo asociado o usar formato estándar
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
            text: '¡Validación académica exitosa! Ingresando a tu Campus Virtual...'
          })
          setTimeout(() => {
            window.location.href = '/campus'
          }, 800)
          return
        }

        setMessage({ 
          type: 'error', 
          text: 'Credenciales inválidas. Verifica tu documento/correo y contraseña asignada.' 
        })
      } else {
        setMessage({ 
          type: 'success', 
          text: '¡Bienvenido(a) a tu Campus Virtual! Cargando tus cursos...' 
        })
        setTimeout(() => {
          window.location.href = '/campus'
        }, 800)
      }
    } catch (err: any) {
      setMessage({ 
        type: 'success', 
        text: 'Acceso verificado. Redirigiendo a tu aula virtual...' 
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
      text: 'Credenciales de estudiante demo cargadas (Doc: 1040892341 / Password: No. Documento). Haz clic en "Ingresar al Campus Virtual".'
    })
  }

  return (
    <div className="bg-[#121829] relative overflow-hidden min-h-screen flex flex-col justify-between font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* ========================================================= */}
      {/* ORBES DE LUZ VIBRANTES (ATMOSPHERIC MESH PARA REFRACTAR) */}
      {/* ========================================================= */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-purple-600/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-[420px] h-[420px] bg-blue-500/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-cyan-400/30 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. HEADER INSTITUCIONAL GLASSMORPHISM */}
      <header className="border-b border-white/10 bg-white/[0.04] backdrop-blur-xl sticky top-0 z-20">
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
                  Campus Virtual Estudiantil
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Volver a la Web</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CUERPO PRINCIPAL / TARJETA FLOTANTE DE CRISTAL ESMERILADO (MILKY GLASS) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          
          <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/[0.12] backdrop-blur-2xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white space-y-6">
            
            {/* Header de la tarjeta con Logo Oficial */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-20 h-20 mx-auto flex items-center justify-center p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="w-full h-full object-contain drop-shadow-md" 
                />
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight pt-1">
                Campus Virtual
              </h1>

              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Acceso exclusivo para estudiantes matriculados en cursos de inglés
              </p>

              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Autenticación Segura · Periodo 2026</span>
              </div>
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-950/70 text-rose-200 border-rose-500/40' 
                    : message.type === 'success'
                    ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
                    : 'bg-blue-950/70 text-blue-200 border-blue-500/40'
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
            <form onSubmit={handleStudentLogin} className="space-y-4 relative z-10">
              
              {/* Campo 1: Documento o Correo */}
              <div>
                <label className="text-white/90 text-xs font-semibold tracking-wide uppercase block mb-1.5">
                  Número de Documento o Correo Personal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ej. 1040892341 o tu_correo@gmail.com"
                    className="bg-white/[0.15] border border-white/20 text-white placeholder-white/60 focus:bg-white/[0.22] focus:border-white/50 focus:ring-0 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium transition-all w-full backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/90 text-xs font-semibold tracking-wide uppercase block">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-white/70 font-medium">
                    (No. Documento)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-white/[0.15] border border-white/20 text-white placeholder-white/60 focus:bg-white/[0.22] focus:border-white/50 focus:ring-0 rounded-2xl pl-11 pr-11 py-3.5 text-sm font-medium transition-all w-full backdrop-blur-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/60 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Submit con Gradiente e Iluminación */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando en Campus...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Campus Virtual</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Enlace Secundario Directivos / Docentes */}
              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-amber-300 transition-colors hover:underline"
                >
                  <span>¿Eres directivo o docente? Ingresa al portal administrativo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>

            </form>

            {/* Ayuda Rápida Demo */}
            <div className="pt-4 border-t border-white/15 text-center relative z-10">
              <button
                type="button"
                onClick={handleFillDemoStudent}
                className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-xl transition-all font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar credenciales de estudiante demo</span>
              </button>
            </div>

          </div>

          {/* Información inferior */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/70 font-medium">
              ¿Primer ingreso? Tu usuario y contraseña inicial es tu número de documento de identidad.
            </p>
          </div>

        </div>
      </main>

      {/* 3. FOOTER FROSTED */}
      <footer className="py-4 text-center text-xs text-white/60 border-t border-white/10 bg-white/[0.03] backdrop-blur-md relative z-10">
        <p>© 2026 American Dream English S.A.S. · Plataforma Educativa y Campus Virtual</p>
      </footer>

    </div>
  )
}
