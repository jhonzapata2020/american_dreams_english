'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, LayoutDashboard, ExternalLink, ArrowRight, X } from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

export function AdminAuditBanner() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // 1. Revisar estado persistente en localStorage / sessionStorage
        const localRole = typeof window !== 'undefined' 
          ? (localStorage.getItem('ade_active_role') || sessionStorage.getItem('ade_active_role'))
          : null

        // 2. Revisar cookie ade_user_role
        const hasAdminCookie = typeof document !== 'undefined' && document.cookie.includes('ade_user_role=admin')

        if (localRole === 'admin' || hasAdminCookie) {
          setIsAdmin(true)
          setAdminName('Administrador')
        }

        // 3. Validar con la sesión de Supabase Auth
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name, email')
            .eq('id', session.user.id)
            .maybeSingle()

          const role = (profile?.role || session.user.user_metadata?.role || '').toLowerCase()
          const isEmailAdmin = (session.user.email || '').toLowerCase().includes('admin')

          if (role === 'admin' || isEmailAdmin) {
            setIsAdmin(true)
            setAdminName(profile?.full_name || session.user.user_metadata?.full_name || 'Administrador')

            // Garantizar que la sesión activa se preserve como admin sin tocar la BD
            if (typeof window !== 'undefined') {
              localStorage.setItem('ade_active_role', 'admin')
              sessionStorage.setItem('ade_active_role', 'admin')
              document.cookie = 'ade_user_role=admin; path=/; max-age=86400; SameSite=Lax'
            }
          }
        }
      } catch (err) {
        console.warn('[AdminAuditBanner] Error verificando rol de administrador:', err)
      }
    }

    checkAdminStatus()
  }, [])

  if (!isAdmin || dismissed) return null

  return (
    <aside 
      aria-label="Modo Auditoría de Administrador"
      className="w-full bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-500/40 text-white px-3 sm:px-6 py-2 shadow-2xl sticky top-0 z-[100] backdrop-blur-md animate-fadeIn transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        
        {/* Identificador y Privilegios */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
          </span>
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 shrink-0">
              Modo Auditoría Admin
            </span>
            <span className="font-semibold text-slate-200 truncate hidden md:inline">
              Estás visualizando el Campus en modo auditoría con tu sesión de Administrador ({adminName || 'Admin General'})
            </span>
            <span className="font-semibold text-slate-200 truncate md:hidden">
              Vista Previa Admin activa
            </span>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold transition-all shadow-md text-xs cursor-pointer hover:shadow-indigo-500/25"
            title="Volver directamente al Dashboard de Administración"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden sm:inline">Volver al Dashboard Admin</span>
            <span className="sm:hidden">Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Ocultar barra temporalmente en esta vista"
            aria-label="Cerrar barra"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  )
}
