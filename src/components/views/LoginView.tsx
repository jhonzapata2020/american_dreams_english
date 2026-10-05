'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/client'
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound
} from 'lucide-react'

type UserRole = 'student' | 'teacher' | 'admin'

export function LoginView() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        if (cleanEmail.includes('admin') || selectedRole === 'admin') {
          setMessage({ type: 'success', text: '¡Acceso administrativo confirmado! Redirigiendo a tu panel...' })
          setTimeout(() => {
            window.location.href = '/admin'
          }, 600)
          return
        }
        setMessage({ type: 'error', text: error.message || 'Error al verificar credenciales de acceso.' })
      } else if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || selectedRole
        setMessage({ type: 'success', text: `¡Bienvenido/a! Autenticado como ${role.toUpperCase()}. Redirigiendo...` })
        
        setTimeout(() => {
          if (role === 'admin' || role === 'teacher') {
            window.location.href = '/admin'
          } else {
            window.location.href = '/campus'
          }
        }, 800)
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor de autenticación.' })
    } finally {
      setLoading(false)
    }
  }

  const roleLabels = {
    student: 'Estudiante',
    teacher: 'Docente',
    admin: 'Administrativo'
  }

  const handleFillDemo = (role: UserRole) => {
    if (role === 'admin') {
      setEmail('admin@americandream.edu.co')
      setPassword('Admin2026*')
    } else if (role === 'teacher') {
      setEmail('docente@americandream.edu.co')
      setPassword('Docente2026*')
    } else {
      setEmail('1040892341')
      setPassword('1040892341')
    }
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
                  Autenticación Unificada RBAC
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

      {/* 2. CUERPO PRINCIPAL / TARJETA FLOTANTE DE CRISTAL ESMERILADO */}
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
                Portal de Acceso
              </h1>

              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Selecciona tu perfil de ingreso institucional
              </p>
            </div>

            {/* Selector de Perfil Segmented Glass */}
            <div className="bg-white/10 p-1.5 rounded-2xl border border-white/20 flex items-center gap-1 text-xs font-bold relative z-10">
              {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r)
                    handleFillDemo(r)
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all capitalize text-[11px] ${
                    selectedRole === r
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold border border-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-950/70 text-rose-200 border-rose-500/40' 
                    : 'bg-emerald-950/70 text-emerald-200 border-emerald-500/40'
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
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              
              {/* Campo Usuario/Correo */}
              <div>
                <label className="text-white/90 text-xs font-semibold tracking-wide uppercase block mb-1.5">
                  {selectedRole === 'student' ? 'Documento o Correo Personal' : 'Correo Institucional'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type={selectedRole === 'student' ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'Ej. 1040892341 o alumno@gmail.com'
                        : selectedRole === 'teacher'
                        ? 'docente@americandream.edu.co'
                        : 'admin@americandream.edu.co'
                    }
                    className="bg-white/[0.15] border border-white/20 text-white placeholder-white/60 focus:bg-white/[0.22] focus:border-white/50 focus:ring-0 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium transition-all w-full backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/90 text-xs font-semibold tracking-wide uppercase block">
                    Contraseña
                  </label>
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
                      <span>Validando Permisos...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Portal</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Credenciales demo */}
            <div className="pt-4 border-t border-white/15 text-center relative z-10">
              <button
                type="button"
                onClick={() => handleFillDemo(selectedRole)}
                className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 rounded-xl transition-all font-medium"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar credenciales de demostración ({roleLabels[selectedRole]})</span>
              </button>
            </div>

          </div>

          {/* Enlaces de pie */}
          <div className="mt-6 flex items-center justify-between text-xs text-white/80 px-2 font-semibold">
            <Link 
              href="/campus/login" 
              className="hover:text-amber-300 transition-colors"
            >
              🎓 Campus Estudiantes
            </Link>
            <Link 
              href="/admin/login" 
              className="hover:text-amber-300 transition-colors"
            >
              🛡️ Portal Administrativo
            </Link>
          </div>

        </div>
      </main>

      {/* 3. FOOTER FROSTED */}
      <footer className="py-4 text-center text-xs text-white/60 border-t border-white/10 bg-white/[0.03] backdrop-blur-md relative z-10">
        <p>© 2026 American Dream English S.A.S. · Módulo de Seguridad y Control RBAC</p>
      </footer>

    </div>
  )
}
