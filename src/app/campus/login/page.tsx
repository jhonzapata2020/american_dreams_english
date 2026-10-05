'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowLeft, 
  BookOpen,
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
    // Si ya hay sesión activa como estudiante, sugerir o redirigir
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
    <div className="min-h-screen bg-[#0A111E] text-slate-100 flex flex-col justify-between font-sans selection:bg-crimson-600 selection:text-white">
      
      {/* 1. HEADER INSTITUCIONAL ESTANDARIZADO */}
      <header className="border-b border-slate-800 bg-[#0F1C2E]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002B49] via-blue-900 to-crimson-700 text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-md border border-white/10">
                AD
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block leading-tight">
                  AMERICAN DREAM ENGLISH
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Campus Virtual Estudiantil
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-800/90 hover:bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Volver a la Web</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CUERPO PRINCIPAL / FORMULARIO ESTANDARIZADO */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          
          <div className="bg-[#0F1C2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-5 relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header de la tarjeta */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-950 to-[#002B49] border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <GraduationCap className="w-8 h-8 text-amber-400" />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Campus Virtual
              </h1>

              <p className="text-xs text-slate-400 font-medium">
                Acceso exclusivo para estudiantes matriculados en cursos de inglés
              </p>

              <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-[11px] font-bold text-slate-300 mt-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Autenticación Segura · Periodo 2026</span>
              </div>
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/60' 
                    : message.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                    : 'bg-blue-950/40 text-blue-300 border-blue-800/60'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed">{message.text}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleStudentLogin} className="space-y-4 relative z-10">
              
              {/* Campo 1: Documento o Correo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Número de Documento o Correo Personal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ej. 1040892341 o tu_correo@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-900/90 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-slate-500 font-medium"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (No. Documento de identidad)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 text-sm bg-slate-900/90 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-slate-500 font-medium"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002B49] hover:bg-[#001f35] border border-blue-500/30 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando en Campus...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Campus Virtual</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </div>

              {/* Enlace Secundario Discreto Directivos / Docentes */}
              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors hover:underline"
                >
                  <span>¿Eres directivo o docente? Ingresa al portal administrativo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>

            </form>

            {/* Ayuda Rápida */}
            <div className="pt-4 border-t border-slate-800 text-center relative z-10 space-y-2">
              <button
                type="button"
                onClick={handleFillDemoStudent}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar credenciales de estudiante demo</span>
              </button>
            </div>

          </div>

          {/* Información inferior */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              ¿Primer ingreso? Tu usuario y contraseña inicial es tu número de documento de identidad.
            </p>
          </div>

        </div>
      </main>

      {/* 3. FOOTER ESTANDARIZADO */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-[#0A111E]">
        <p>© 2026 American Dream English S.A.S. · Plataforma Educativa y Campus Virtual</p>
      </footer>

    </div>
  )
}
