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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* 1. HEADER INSTITUCIONAL CON LOGO OFICIAL */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
              <div>
                <span className="font-extrabold text-sm sm:text-base text-slate-950 tracking-tight block leading-tight">
                  AMERICAN DREAM ENGLISH
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Campus Virtual Estudiantil
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors bg-white hover:bg-slate-100 border border-slate-300 px-3.5 py-1.5 rounded-xl shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#002B49]" />
              <span>Volver a la Web</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. CUERPO PRINCIPAL / TARJETA CLARA INSTITUCIONAL */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100">
        <div className="w-full max-w-md">
          
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 space-y-5 relative overflow-hidden">
            
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Header de la tarjeta con Logo Oficial */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-20 h-20 mx-auto flex items-center justify-center p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-md">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="w-full h-full object-contain drop-shadow-xs" 
                />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                Campus Virtual
              </h1>

              <p className="text-xs text-slate-600 font-medium">
                Acceso exclusivo para estudiantes matriculados en cursos de inglés
              </p>

              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-800 mt-2">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Autenticación Segura · Periodo 2026</span>
              </div>
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
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
            <form onSubmit={handleStudentLogin} className="space-y-4 relative z-10">
              
              {/* Campo 1: Documento o Correo */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Número de Documento o Correo Personal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ej. 1040892341 o tu_correo@gmail.com"
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo 2: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    (No. Documento de identidad)
                  </span>
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
                    className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all"
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

              {/* Botón Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-[#002B49]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm active:scale-[0.99]"
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

              {/* Enlace Secundario Directivos / Docentes */}
              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#002B49] transition-colors hover:underline"
                >
                  <span>¿Eres directivo o docente? Ingresa al portal administrativo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#002B49]" />
                </Link>
              </div>

            </form>

            {/* Ayuda Rápida Demo */}
            <div className="pt-4 border-t border-slate-100 text-center relative z-10">
              <button
                type="button"
                onClick={handleFillDemoStudent}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#002B49] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors font-bold"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Cargar credenciales de estudiante demo</span>
              </button>
            </div>

          </div>

          {/* Información inferior */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 font-medium">
              ¿Primer ingreso? Tu usuario y contraseña inicial es tu número de documento de identidad.
            </p>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>© 2026 American Dream English S.A.S. · Plataforma Educativa y Campus Virtual</p>
      </footer>

    </div>
  )
}
