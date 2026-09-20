'use client'

import React, { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { Shield, Lock, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Error al iniciar sesión' })
    } else {
      setMessage({ type: 'success', text: 'Sesión iniciada correctamente. Redireccionando...' })
      window.location.href = '/dashboard/student'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-crimson-600/20 text-crimson-500 rounded-2xl mb-2 border border-crimson-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">American Dream English</h1>
          <p className="text-xs text-slate-400">Sistema de Autenticación RBAC (Admin, Docente, Estudiante)</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@americandream.edu.co"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-crimson-600"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-crimson-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-crimson-900/30"
          >
            <span>{loading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 text-center space-y-2">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Accesos Rápidos a Dashboards (RBAC):</p>
          <div className="flex justify-center gap-2 text-xs font-semibold">
            <a
              href="/dashboard/admin"
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Admin Panel
            </a>
            <a
              href="/dashboard/teacher"
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Docente
            </a>
            <a
              href="/dashboard/student"
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Estudiante
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
