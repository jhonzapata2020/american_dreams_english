'use client'

import React, { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  Users,
  Shield
} from 'lucide-react'

export function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        setMessage({ type: 'error', text: error.message || 'Error al autenticar credenciales.' })
      } else if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || 'student'
        setMessage({ type: 'success', text: `¡Bienvenido! Rol identificado: ${role.toUpperCase()}. Redireccionando a tu portal...` })
        
        setTimeout(() => {
          if (role === 'admin') {
            window.location.href = '/dashboard/admin'
          } else if (role === 'teacher') {
            window.location.href = '/dashboard/teacher'
          } else {
            window.location.href = '/dashboard/student'
          }
        }, 1200)
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servicio de autenticación.' })
    } finally {
      setLoading(false)
    }
  }

  const navigateToRole = (rolePath: string) => {
    window.location.href = rolePath
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* BRANDING LOGO & TITLE */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 bg-crimson-600/20 text-crimson-500 rounded-2xl mb-1 border border-crimson-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">American Dream English</h1>
          <p className="text-xs text-slate-400">Portal de Acceso Unificado (Admin, Docente, Estudiante)</p>
        </div>

        {/* NOTIFICACIONES */}
        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border animate-fadeIn ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* FORMULARIO DE LOGIN CON SUPABASE AUTH */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico Registrado</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@americandream.edu.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-crimson-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-crimson-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-crimson-950/50 cursor-pointer"
          >
            <span>{loading ? 'Verificando Rol...' : 'Ingresar al Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SELECCIÓN DIRECTA DE ENTORNO POR ROL (RBAC) */}
        <div className="pt-5 border-t border-slate-800 space-y-3">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">
            O selecciona tu Entorno por Rol (Flujo RBAC):
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            
            {/* Rol Admin */}
            <button
              type="button"
              onClick={() => navigateToRole('/dashboard/admin')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-crimson-500/50 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer"
            >
              <Shield className="w-5 h-5 text-crimson-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Admin</span>
            </button>

            {/* Rol Docente */}
            <button
              type="button"
              onClick={() => navigateToRole('/dashboard/teacher')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer"
            >
              <Users className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Docente</span>
            </button>

            {/* Rol Estudiante */}
            <button
              type="button"
              onClick={() => navigateToRole('/dashboard/student')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all group cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Estudiante</span>
            </button>

          </div>
        </div>

        {/* REGRESO AL SITIO PÚBLICO */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors underline"
          >
            ← Volver a la Página Principal
          </a>
        </div>

      </div>
    </div>
  )
}
