import { createClient } from '../../../../utils/supabase/server'
import Link from 'next/link'
import React from 'react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch {
    user = null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
            🔒
          </div>
          <h2 className="text-xl font-black text-white">Acceso Directivo Requerido</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Debes iniciar sesión con una cuenta autorizada para acceder al panel de control directivo.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
            >
              Ingresar al Portal Directivo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  let userRole = 'student'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    userRole = profile?.role?.toLowerCase() || (user.user_metadata?.role as string)?.toLowerCase() || 'student'
  } catch {
    userRole = (user.user_metadata?.role as string)?.toLowerCase() || 'student'
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
            ⛔
          </div>
          <h2 className="text-xl font-black text-white">Acceso Denegado</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu cuenta autenticada no tiene privilegios de Administrador Directivo para gestionar este módulo.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link
              href="/campus"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition"
            >
              Ir a mi Campus
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Cambiar de Cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
