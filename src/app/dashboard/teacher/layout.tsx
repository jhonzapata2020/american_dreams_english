import { createClient } from '../../../../utils/supabase/server'
import Link from 'next/link'
import React from 'react'

export default async function TeacherDashboardLayout({
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
          <h2 className="text-xl font-black text-white">Acceso Docente Requerido</h2>
          <p className="text-xs text-slate-300">Debes iniciar sesión con una cuenta de docente titular.</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  let role = (user.user_metadata?.role as string)?.toLowerCase() || 'student'
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.role) role = profile.role.toLowerCase()
  } catch {}

  if (role !== 'teacher' && role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
          <h2 className="text-xl font-black text-rose-400">Acceso Restringido</h2>
          <p className="text-xs text-slate-300">Este módulo es exclusivo para Docentes Titulares.</p>
          <div className="pt-2">
            <Link
              href="/campus"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition"
            >
              Volver a mi Campus
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
