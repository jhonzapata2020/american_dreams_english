'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Lock, 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Award
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

const DONATION_PRESETS = [
  { id: 'p1', amount: 50000, label: '$50.000 COP', impact: 'Financia 50% de la mensualidad de 1 estudiante' },
  { id: 'p2', amount: 100000, label: '$100.000 COP', impact: 'Beca mensual completa con laboratorios de audio' },
  { id: 'p3', amount: 250000, label: '$250.000 COP', impact: 'Patrocina 1 nivel MCER completo con materiales' },
  { id: 'custom', amount: 0, label: 'Otro valor', impact: 'Aporte voluntario al Fondo de Becas Urabá' }
]

export default function DonarPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('p2')
  const [customAmount, setCustomAmount] = useState<string>('')
  
  // Datos del donante
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  // Estados de pasarela
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)
  const [transactionRef, setTransactionRef] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-llenado de datos de sesión Supabase
  useEffect(() => {
    async function loadDonor() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profile) {
            setDonorName(profile.full_name || profile.name || '')
            setDonorEmail(profile.email || session.user.email || '')
            setDonorPhone(profile.phone || '')
          }
        }
      } catch (err) {
        // Fallback silencioso
      }
    }
    loadDonor()
  }, [])

  const selectedPreset = DONATION_PRESETS.find(p => p.id === selectedPresetId)
  const activeAmount = selectedPresetId === 'custom'
    ? (parseInt(customAmount.replace(/\D/g, ''), 10) || 0)
    : (selectedPreset?.amount || 100000)

  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  const handleInitiateDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (activeAmount < 10000) {
      setErrorMessage('El monto mínimo de donación es de $10.000 COP.')
      return
    }

    if (!isAnonymous && (!donorName.trim() || !donorEmail.trim())) {
      setErrorMessage('Por favor ingresa tu nombre y correo para el certificado de donación.')
      return
    }

    setIsProcessing(true)

    try {
      const finalName = isAnonymous ? 'Donante Anónimo' : donorName.trim()
      const finalEmail = isAnonymous ? 'anonimo@americandream.edu.co' : donorEmail.trim()

      const sigResponse = await fetch('/api/wompi/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          email: finalEmail,
          documentNumber: '1000000000',
          currency: 'COP',
          programTitle: `Fondo de Becas ADE: Sponsor a Dream (${formatCop(activeAmount)})`
        })
      })

      const sigJson = await sigResponse.json()
      const ref = sigJson?.reference || `ADE-DON-${Date.now()}`
      setTransactionRef(ref)

      const wompiPublicKey = (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || sigJson?.publicKey || '').trim()

      if (typeof window !== 'undefined' && (window as any).WidgetCheckout && wompiPublicKey) {
        const checkout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents: activeAmount * 100,
          reference: ref,
          publicKey: wompiPublicKey,
          redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
          customerData: {
            email: finalEmail,
            fullName: finalName,
            phoneNumber: donorPhone.trim() || '3000000000',
            phoneNumberPrefix: '+57',
            legalId: '1000000000',
            legalIdType: 'CC'
          }
        })

        checkout.open((result: any) => {
          setIsProcessing(false)
          const transaction = result.transaction
          if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'PENDING')) {
            setDonationSuccess(true)
          }
        })
      } else {
        // Fallback WhatsApp directo si Wompi no está cargado
        const message = `¡Hola ADE! Deseo realizar una donación al Fondo de Becas "Sponsor a Dream" por valor de ${formatCop(activeAmount)}.\nNombre: ${finalName}\nCorreo: ${finalEmail}`
        window.open(`https://wa.me/573207105618?text=${encodeURIComponent(message)}`, '_blank')
        setIsProcessing(false)
      }
    } catch (err: any) {
      console.error('Error al procesar donación:', err)
      setIsProcessing(false)
      setErrorMessage(err.message || 'Error al conectar con la pasarela de pago.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* Script oficial de Wompi */}
      <Script 
        src="https://checkout.wompi.co/widget.js" 
        strategy="lazyOnload" 
      />

      {/* 1. TOP APP BAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Inicio</span>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
            Sponsor a Dream
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        
        {/* ENCABEZADO Y PROPUESTA DE VALOR */}
        <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg space-y-3 text-left border border-navy-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/20 border border-rose-400/30 px-2.5 py-1 rounded-lg">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Fondo de Becas Urabá</span>
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sponsor a Dream
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Financia la formación en inglés de un joven con talento en Turbo y Urabá. Cada aporte cuenta con auditoría pública y reporte trimestral de progreso MCER.
            </p>
          </div>
        </div>

        {/* SELECTOR DE APORTES EN UN SOLO TOQUE (GRID 2x2 TÁCTIL) */}
        <form onSubmit={handleInitiateDonation} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left">
          
          <div className="space-y-1">
            <h2 className="text-sm font-black text-slate-900">
              Selecciona el Valor de tu Aporte
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Elige un monto sugerido o ingresa un valor personalizado en COP.
            </p>
          </div>

          {/* Grid 2x2 Táctil de Botones Rápidos */}
          <div className="grid grid-cols-2 gap-2.5">
            {DONATION_PRESETS.map((preset) => {
              const active = selectedPresetId === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedPresetId(preset.id)
                    if (preset.id !== 'custom') setCustomAmount('')
                  }}
                  className={`min-h-[58px] p-3 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                    active
                      ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-navy-900/10'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black">{preset.label}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      active ? 'border-amber-400 bg-amber-400 text-navy-950' : 'border-slate-300'
                    }`}>
                      {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <span className={`text-[10px] line-clamp-1 mt-0.5 ${
                    active ? 'text-slate-300 font-medium' : 'text-slate-500'
                  }`}>
                    {preset.impact}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Campo de Otro Valor */}
          {selectedPresetId === 'custom' && (
            <div className="pt-1 space-y-1 animate-fadeIn">
              <label className="block text-xs font-bold text-slate-700">
                Ingresa el valor personalizado (COP) *
              </label>
              <input
                type="number"
                min={10000}
                step={5000}
                required
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Ej. 150000"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          )}

          {/* Datos del Donante (Pre-llenados si hay sesión) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-900 block">
              Datos del Padrino / Donante
            </span>

            {errorMessage && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl font-bold text-center">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                required={!isAnonymous}
                disabled={isAnonymous}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nombre completo o Empresa"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:opacity-50"
              />
              <input
                type="email"
                required={!isAnonymous}
                disabled={isAnonymous}
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Correo electrónico (para certificado de donación)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:opacity-50"
              />
            </div>

            {/* Checkbox Donación Anónima */}
            <div 
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="flex items-center space-x-2.5 pt-1 cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                isAnonymous ? 'bg-navy-900 border-navy-900 text-white' : 'bg-white border-slate-300'
              }`}>
                {isAnonymous && <Check className="w-3 h-3" />}
              </div>
              <span className="text-xs font-bold text-slate-600">
                Deseo que mi donación sea anónima en el reporte público
              </span>
            </div>
          </div>

          {/* Resumen & Botón de Acción Directa */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center justify-between text-xs font-black">
              <span className="text-rose-950">Aporte a Procesar:</span>
              <span className="text-base text-rose-700">
                {formatCop(activeAmount)} COP
              </span>
            </div>

            {/* Botón Primario Wompi (≥48px) */}
            <button
              type="submit"
              disabled={isProcessing || activeAmount < 10000}
              className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Conectando Pasarela Wompi...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>APOYAR CON WOMPI</span>
                  <Lock className="w-3.5 h-3.5 opacity-80" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Modal / Alerta de Donación Exitosa */}
        {donationSuccess && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-black text-emerald-950">¡Gracias por transformar vidas!</h3>
            <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
              Tu aporte de {formatCop(activeAmount)} ha sido recibido con éxito. Te enviaremos el certificado de donación a tu correo.
            </p>
            <Link
              href="/"
              className="inline-block min-h-[40px] px-5 bg-emerald-600 text-white text-xs font-black rounded-xl py-2.5 shadow-sm"
            >
              Volver al Inicio
            </Link>
          </div>
        )}

      </main>

    </div>
  )
}
