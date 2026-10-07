'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Award, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Sparkles
} from 'lucide-react'

export default function CertificadosPage() {
  const certificates = [
    {
      id: 'CERT-ADE-A1-8894',
      level: 'A1 - Beginner Level',
      hours: '120 Horas MCER',
      issueDate: 'Mayo 2026',
      status: 'issued',
      grade: '4.9 / 5.0'
    },
    {
      id: 'CERT-ADE-A2-9214',
      level: 'A2 - Elementary Level',
      hours: '120 Horas MCER',
      issueDate: 'Septiembre 2026',
      status: 'issued',
      grade: '4.8 / 5.0'
    },
    {
      id: 'CERT-ADE-B1-PEND',
      level: 'B1 - Intermediate Level',
      hours: '120 Horas MCER',
      issueDate: 'En Cursado (82% completado)',
      status: 'in_progress',
      grade: 'Proyectado 4.8'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. TOP APP BAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Volver a My ADE</span>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
            Diplomas MCER
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-4">

        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    cert.status === 'issued' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Award className="w-5 h-5 stroke-[2.25]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{cert.level}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{cert.hours} · {cert.issueDate}</p>
                  </div>
                </div>

                {cert.status === 'issued' ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ✓ Aprobado ({cert.grade})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    En Cursado
                  </span>
                )}
              </div>

              {cert.status === 'issued' && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    ID: {cert.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => alert(`Descargando certificado oficial ${cert.id} con código de verificación QR.`)}
                    className="min-h-[38px] px-3.5 bg-navy-900 hover:bg-navy-950 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </main>

    </div>
  )
}
