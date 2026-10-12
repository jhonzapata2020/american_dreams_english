'use client'

import React, { useEffect } from 'react'

export default function TeacherDashboardPage() {
  useEffect(() => {
    window.location.replace('/campus/docente')
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1528] flex flex-col items-center justify-center text-white p-4">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-slate-300">Cargando Portal Docente Titular...</p>
    </div>
  )
}
