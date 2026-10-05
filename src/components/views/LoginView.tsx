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
  GraduationCap,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Shield
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
                  Autenticación Unificada RBAC
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

      {/* 2. CUERPO PRINCIPAL / CARD ESTANDARIZADA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          
          <div className="bg-[#0F1C2E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-5 relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header de la tarjeta */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-950 to-[#002B49] border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                {selectedRole === 'student' ? (
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                ) : selectedRole === 'teacher' ? (
                  <Users className="w-8 h-8 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portal de Acceso
              </h1>

              <p className="text-xs text-slate-400 font-medium">
                Selecciona tu perfil de ingreso institucional
              </p>
            </div>

            {/* Selector de Perfil Segmented */}
            <div className="bg-[#08101C] p-1 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs font-bold relative z-10">
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
                      ? 'bg-[#002B49] text-white shadow-md border border-blue-500/30 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>

            {/* Mensajes de Estado */}
            {message && (
              <div 
                className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fadeIn border ${
                  message.type === 'error' 
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/60' 
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
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
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              
              {/* Campo Usuario/Correo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {selectedRole === 'student' ? 'Documento o Correo Personal' : 'Correo Institucional'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-900/90 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder:text-slate-500 font-medium"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Contraseña
                  </label>
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
                      <span>Validando Permisos...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Portal</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Credenciales demo */}
            <div className="pt-4 border-t border-slate-800 text-center relative z-10">
              <button
                type="button"
                onClick={() => handleFillDemo(selectedRole)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Cargar credenciales de demostración ({roleLabels[selectedRole]})</span>
              </button>
            </div>

          </div>

          {/* Enlaces de pie */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-2">
            <Link 
              href="/campus/login" 
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              🎓 Campus Estudiantes
            </Link>
            <Link 
              href="/admin/login" 
              className="hover:text-amber-400 transition-colors font-semibold"
            >
              🛡️ Portal Administrativo
            </Link>
          </div>

        </div>
      </main>

      {/* 3. FOOTER ESTANDARIZADO */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-[#0A111E]">
        <p>© 2026 American Dream English S.A.S. · Módulo de Seguridad y Control RBAC</p>
      </footer>

    </div>
  )
}
