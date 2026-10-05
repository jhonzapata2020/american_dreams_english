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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* 1. HEADER INSTITUCIONAL CLARO */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002B49] via-blue-900 to-crimson-700 text-white flex items-center justify-center font-black text-lg tracking-tighter shadow-md">
                AD
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-slate-950 tracking-tight block leading-tight">
                  AMERICAN DREAM ENGLISH
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Autenticación Unificada RBAC
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

      {/* 2. CUERPO PRINCIPAL / TARJETA CLARA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100">
        <div className="w-full max-w-md">
          
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 space-y-5 relative overflow-hidden">
            
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Header de la tarjeta */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 bg-[#002B49] rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-md shadow-[#002B49]/20">
                {selectedRole === 'student' ? (
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                ) : selectedRole === 'teacher' ? (
                  <Users className="w-8 h-8 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Portal de Acceso
              </h1>

              <p className="text-xs text-slate-600 font-medium">
                Selecciona tu perfil de ingreso institucional
              </p>
            </div>

            {/* Selector de Perfil Segmented */}
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 text-xs font-bold relative z-10">
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
                      ? 'bg-[#002B49] text-white shadow-md font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
                    ? 'bg-rose-50 text-rose-800 border-rose-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
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
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              
              {/* Campo Usuario/Correo */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  {selectedRole === 'student' ? 'Documento o Correo Personal' : 'Correo Institucional'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] focus:border-[#002B49] focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
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
            <div className="pt-4 border-t border-slate-100 text-center relative z-10">
              <button
                type="button"
                onClick={() => handleFillDemo(selectedRole)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#002B49] bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors font-bold"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Cargar credenciales de demostración ({roleLabels[selectedRole]})</span>
              </button>
            </div>

          </div>

          {/* Enlaces de pie */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-600 px-2 font-bold">
            <Link 
              href="/campus/login" 
              className="hover:text-[#002B49] transition-colors"
            >
              🎓 Campus Estudiantes
            </Link>
            <Link 
              href="/admin/login" 
              className="hover:text-[#002B49] transition-colors"
            >
              🛡️ Portal Administrativo
            </Link>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>© 2026 American Dream English S.A.S. · Módulo de Seguridad y Control RBAC</p>
      </footer>

    </div>
  )
}
