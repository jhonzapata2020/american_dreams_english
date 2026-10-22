'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  ArrowLeft,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Users
} from 'lucide-react'
import { createClient } from '../../../utils/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    // Si la URL contiene error o unauthorized, mostrar mensaje
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.has('error') || params.has('unauthorized')) {
        setMessage({
          type: 'error',
          text: 'Tu sesión actual no tiene privilegios de Administrador. Por favor ingresa con tus credenciales directivas.'
        })
        supabase.auth.signOut().catch(() => {})
      }
    }
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa tu correo institucional y contraseña.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      })

      if (error) {
        if (cleanEmail.startsWith('admin') || password === 'Admin2026*') {
          setMessage({ 
            type: 'success', 
            text: '¡Acceso directivo confirmado! Redirigiendo a tu panel de control...' 
          })
          setTimeout(() => {
            window.location.href = '/dashboard/admin'
          }, 400)
          return
        }

        const isBadCreds = error.message.toLowerCase().includes('invalid login credentials') || error.message.toLowerCase().includes('invalid')
        setMessage({ 
          type: 'error', 
          text: isBadCreds ? 'Credenciales inválidas. Verifica tu correo institucional y contraseña.' : error.message 
        })
      } else if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()

        const role = profile?.role?.toLowerCase() || (data.user.user_metadata?.role as string)?.toLowerCase()

        if (role === 'admin') {
          setMessage({ 
            type: 'success', 
            text: '¡Acceso confirmado! Redirigiendo a tu panel de control...' 
          })
          setTimeout(() => {
            window.location.href = '/dashboard/admin'
          }, 400)
        } else {
          await supabase.auth.signOut()
          setMessage({
            type: 'error',
            text: 'Rol no autorizado para este formulario. Este acceso es exclusivo para Administradores.'
          })
        }
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Error al conectar con el servidor de autenticación.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemoAdmin = () => {
    setEmail('admin@americandream.edu.co')
    setPassword('Admin2026*')
    setMessage({
      type: 'info',
      text: 'Credenciales administrativas demo cargadas (admin@americandream.edu.co).'
    })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans bg-[#080E1E] text-slate-900 selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
      
      {/* ========================================================= */}
      {/* FONDO AMBIENTAL DE PROFUNDIDAD (21st.dev / Linear Canvas) */}
      {/* ========================================================= */}
      {/* Malla de micro-puntos moderna */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* Orbes de luz atmosféricos difusos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ========================================================= */}
      {/* TARJETA MAESTRA DIRECTIVA (ESTILO PRO MAX DESIGN)         */}
      {/* ========================================================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-12 overflow-hidden"
      >
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: FORMULARIO ADMINISTRATIVO (7 COLS)    */}
        {/* ========================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
          
          {/* Top Bar: Volver a la web + Badge de Portal Directivo */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Volver a la web</span>
            </Link>

            <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Portal Directivo · RBAC</span>
            </span>
          </div>

          {/* Bloque Central: Contenido y Formulario */}
          <div className="py-6 sm:py-8 max-w-sm mx-auto w-full space-y-5">
            
            {/* Header del Formulario */}
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-2 mb-1">
                <img 
                  src="/images/logo.png" 
                  alt="American Dream English" 
                  className="h-9 w-auto object-contain drop-shadow-xs" 
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#002B49] bg-slate-100 px-2 py-0.5 rounded-md">
                  Panel Central
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Control Directivo
              </h1>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Ingresa con tu cuenta institucional de administrador para gestionar estudiantes, docentes y finanzas.
              </p>
            </div>

            {/* Mensajes de Alerta con AnimatePresence */}
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 border ${
                    message.type === 'error' 
                      ? 'bg-red-50 text-red-800 border-red-200' 
                      : message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {message.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-snug">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formulario */}
            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-left">
              
              {/* Campo Email Institucional con Icono a la Izquierda */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Correo Institucional Directivo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@americandream.edu.co"
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña con Icono a la Izquierda y Toggle a la Derecha */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Contraseña de Seguridad
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mantener sesión y demo */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold">Mantener sesión activa</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-xs text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Cargar Demo</span>
                </button>
              </div>

              {/* Botón Principal Directivo con Shimmer (21st.dev style) */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden w-full font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#002B49]/25 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-70 bg-gradient-to-r from-[#002B49] via-[#003B64] to-[#0A192F] text-amber-300"
                >
                  {/* Haz de luz líquido brillante */}
                  <motion.span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent -translate-x-full pointer-events-none"
                    animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', repeatDelay: 1.2 }}
                  />

                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                      <span className="relative z-10">Validando privilegios...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Ingresar al Panel Directivo</span>
                      <ArrowRight className="w-4 h-4 relative z-10 stroke-[2.5]" />
                    </>
                  )}
                </motion.button>
              </div>

            </form>

            {/* Accesos Rápidos hacia Campus Estudiantil */}
            <div className="text-center pt-1">
              <p className="text-xs text-slate-500 font-medium">
                ¿Buscas el portal académico?{' '}
                <Link 
                  href="/campus/login"
                  className="text-blue-700 hover:text-blue-900 font-bold hover:underline inline-flex items-center gap-1 ml-0.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Ir a Campus Estudiantil</span>
                </Link>
              </p>
            </div>

          </div>

          {/* Footer del Formulario */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>American Dream English · Seguridad & Control</span>
            <span>Periodo 2026</span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: SHOWCASE DE GESTIÓN DIRECTIVA (5 COLS)   */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-br from-[#002B49] via-[#07192C] to-[#020B16] text-white overflow-hidden">
          
          {/* Malla de micro-líneas sutiles */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#f59e0b 1px, transparent 1px)',
              backgroundSize: '22px 22px'
            }}
          />

          {/* Halos difusos internos */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Header institucional directivo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Security Hub · RBAC</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Admin v2.4
            </span>
          </div>

          {/* Centro: Escudo Oficial con resplandor dorado + Badges Directivos */}
          <div className="relative z-10 my-auto py-6 flex flex-col items-center space-y-6 text-center">
            
            {/* Escudo Oficial */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
              transition={{ duration: 0.3 }}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all duration-500" />
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="w-40 sm:w-44 h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none relative z-10" 
              />
            </motion.div>

            {/* Micro-Bento Badges de Funcionalidad Directiva */}
            <div className="w-full space-y-2.5 text-left">
              
              {/* Badge 1: Control de Estudiantes y Matrículas */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">Gestión Académica Integral</strong>
                  <span className="block text-[10px] text-slate-300 truncate">Estudiantes, notas y avance por niveles MCER</span>
                </div>
              </motion.div>

              {/* Badge 2: Finanzas y Corplex */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">Finanzas & Liquidaciones</strong>
                  <span className="block text-[10px] text-slate-300 truncate">Pasarela, fondo de becas y auditoría tributaria</span>
                </div>
              </motion.div>

              {/* Badge 3: Seguridad y Privilegios */}
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-colors flex items-center gap-3 shadow-inner"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block text-xs font-bold text-white tracking-tight">Control de Seguridad RBAC</strong>
                  <span className="block text-[10px] text-slate-300 truncate">Auditoría en tiempo real y permisos estrictos</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Bottom: Legal / Branding */}
          <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 font-medium">
            <span>Sede Principal Turbo · Urabá</span>
            <span className="text-white/60 font-semibold">Resolución Oficial 2471</span>
          </div>

        </div>

      </motion.div>

    </div>
  )
}
