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
  ArrowLeft,
  Sparkles
} from 'lucide-react'

export function LoginView() {
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
        setMessage({ type: 'error', text: error.message || 'Error al verificar credenciales de acceso.' })
      } else if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || 'student'
        setMessage({ type: 'success', text: `¡Bienvenido/a! Autenticado como ${role.toUpperCase()}. Redirigiendo a tu portal...` })
        
        setTimeout(() => {
          if (role === 'admin') {
            window.location.href = '/dashboard/admin'
          } else if (role === 'teacher') {
            window.location.href = '/dashboard/teacher'
          } else {
            window.location.href = '/dashboard/student'
          }
        }, 1000)
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor de autenticación.' })
    } finally {
      setLoading(false)
    }
  }

  const navigateToRole = (rolePath: string) => {
    window.location.href = rolePath
  }

  return (
    <div className="min-h-screen bg-[#070D18] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      
      {/* GLOW DECORATIONS (AMBIENT LIGHTS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-crimson-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* TOP NAV BAR LINK */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 py-2">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </a>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Plataforma Segura SSL</span>
        </div>
      </header>

      {/* LOGIN CARD MAIN SECTION */}
      <main className="flex-1 flex items-center justify-center py-8 z-10">
        <div className="max-w-md w-full bg-[#0F1C2E]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 transition-all duration-300">
          
          {/* BRANDING: OFFICIAL LOGO REPLACEMENT */}
          <div className="text-center space-y-3">
            <a href="/" className="inline-block group">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-20 sm:h-24 w-auto mx-auto object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Portal de Acceso Unificado</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Ingresa tus credenciales o selecciona tu perfil</p>
            </div>
          </div>

          {/* NOTIFICATION MESSAGE */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border animate-fadeIn ${
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@americandream.edu.co"
                  className="w-full bg-[#08101C] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#08101C] border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-crimson-950/60 hover:shadow-crimson-600/30 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Autenticando...' : 'Ingresar al Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* ACCESO RÁPIDO POR ROL (RBAC) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Acceso Directo por Rol (RBAC)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Auto-redirección
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => navigateToRole('/dashboard/admin')}
                className="p-3 bg-[#08101C] hover:bg-slate-800/80 border border-slate-800 hover:border-crimson-500/60 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer shadow-sm hover:shadow-md hover:shadow-crimson-950/40"
              >
                <div className="p-1.5 rounded-xl bg-crimson-500/10 text-crimson-400 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Admin</span>
              </button>

              {/* Teacher Button */}
              <button
                type="button"
                onClick={() => navigateToRole('/dashboard/teacher')}
                className="p-3 bg-[#08101C] hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-950/40"
              >
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Docente</span>
              </button>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => navigateToRole('/dashboard/student')}
                className="p-3 bg-[#08101C] hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer shadow-sm hover:shadow-md hover:shadow-emerald-950/40"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Estudiante</span>
              </button>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full text-center z-10 py-2">
        <p className="text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} American Dream English S.A.S. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  )
}
