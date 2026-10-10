import { createClient } from '../../../../utils/supabase/server'
import Link from 'next/link'
import React from 'react'

export default async function StudentDashboardLayout({
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
          <h2 className="text-xl font-black text-white">Acceso Estudiantil Requerido</h2>
          <p className="text-xs text-slate-300">Debes iniciar sesión para consultar tu panel y métricas de progreso.</p>
          <div className="pt-2">
            <Link
              href="/campus/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Ingresar a mi Campus
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
