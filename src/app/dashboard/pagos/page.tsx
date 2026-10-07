'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  ArrowRight,
  Receipt,
  AlertCircle
} from 'lucide-react'

export default function PagosPage() {
  const invoices = [
    {
      id: 'REC-2026-0941',
      concept: 'Mensualidad Formativa B1 - Octubre 2026',
      amount: '$200.000 COP',
      date: '02/10/2026',
      status: 'paid',
      method: 'Wompi PSE / Bancolombia'
    },
    {
      id: 'REC-2026-0812',
      concept: 'Matrícula Institucional & Material Digital',
      amount: '$50.000 COP',
      date: '15/09/2026',
      status: 'paid',
      method: 'Wompi Nequi'
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

          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            Estado de Cuenta
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-4">

        {/* PRÓXIMO PAGO CARD */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Próxima Mensualidad
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Al día
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">$200.000 COP</h2>
              <p className="text-xs text-slate-500 font-medium">Vencimiento: 02 de Noviembre, 2026</p>
            </div>

            <Link
              href="/matricula"
              className="min-h-[44px] px-5 bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all"
            >
              <span>Pagar Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* HISTORIAL DE RECIBOS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Historial de Facturación
          </h3>

          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <div 
                key={inv.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{inv.id}</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Pagado
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">{inv.concept}</p>
                  <p className="text-[10px] text-slate-400">{inv.date} · {inv.method}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-slate-900 block">{inv.amount}</span>
                  <button
                    type="button"
                    onClick={() => alert(`Descargando comprobante oficial ${inv.id}`)}
                    className="text-[10px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Recibo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  )
}
