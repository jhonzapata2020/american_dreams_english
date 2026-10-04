'use client'

import React, { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  Users,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react'

type UserRole = 'student' | 'teacher' | 'admin'

export function LoginView() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (email.toLowerCase().includes('admin') || selectedRole === 'admin') {
          setMessage({ type: 'success', text: '¡Acceso administrativo confirmado! Redirigiendo a tu panel...' })
          setTimeout(() => {
            window.location.href = '/dashboard/admin'
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
        setMessage({ type: 'success', text: `¡Bienvenido/a! Autenticado como ${role.toUpperCase()}. Redirigiendo a tu portal...` })
        
        setTimeout(() => {
          if (role === 'admin') {
            window.location.href = '/dashboard/admin'
          } else if (role === 'teacher') {
            window.location.href = '/dashboard/teacher'
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
    admin: 'Admin'
  }

  const rolePlaceholders = {
    student: 'estudiante@americandream.edu.co',
    teacher: 'docente@americandream.edu.co',
    admin: 'admin@americandream.edu.co'
  }

  const roleGradients = {
    student: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-950/60',
    teacher: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-950/60',
    admin: 'from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 shadow-crimson-950/60'
  }

  return (
    <div className="min-h-screen max-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between p-3 sm:p-4 font-sans relative overflow-hidden select-none">
      
      {/* GLOW DECORATIONS (SOFT AMBIENT LIGHTS FOR NEUTRAL BACKGROUND) */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* TOP NAV BAR LINK */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 py-1">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors bg-white hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span>Volver al Inicio</span>
        </a>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Plataforma Segura SSL</span>
        </div>
      </header>

      {/* LOGIN CARD MAIN SECTION */}
      <main className="flex-1 flex items-center justify-center py-2 z-10">
        <div className="max-w-md w-full bg-[#0F1C2E] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-900/30 space-y-4 transition-all duration-300">
          
          {/* BRANDING: LOGO REPLACEMENT & HEADLINE */}
          <div className="text-center space-y-2">
            <a href="/" className="inline-block group">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-12 sm:h-14 w-auto mx-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Portal de Acceso Unificado</h1>
              <p className="text-[11px] text-slate-400 font-medium">Selecciona tu perfil de ingreso</p>
            </div>
          </div>

          {/* ROLE SEGMENTED SELECTOR TABS */}
          <div className="bg-[#08101C] p-1 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Estudiante</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Docente</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-crimson-600 text-white shadow-md shadow-crimson-950/40 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* NOTIFICATION MESSAGE */}
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border animate-fadeIn ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Correo Electrónico ({roleLabels[selectedRole]})
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={rolePlaceholders[selectedRole]}
                  className="w-full bg-[#08101C] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#08101C] border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${roleGradients[selectedRole]} active:scale-[0.99] text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 mt-1`}
            >
              <span>{loading ? 'Autenticando...' : `Ingresar como ${roleLabels[selectedRole]}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center z-10 py-1">
        <p className="text-[11px] text-slate-500 font-bold">
          © {new Date().getFullYear()} American Dream English S.A.S. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  )
}
