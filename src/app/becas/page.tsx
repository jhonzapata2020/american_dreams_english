'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Gift, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Check, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Loader2,
  Copy,
  ChevronRight
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { trackEvent } from '../../lib/analytics'

type StepNumber = 1 | 2 | 3 | 4 // 4 = Confirmación final

export default function BecasPage() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  
  // Paso 1: Datos Básicos
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Turbo')

  // Paso 2: Perfil Socioeconómico y Motivación
  const [occupation, setOccupation] = useState<'Estudiante' | 'Trabajador' | 'Desempleado' | 'Emprendedor'>('Estudiante')
  const [incomeRange, setIncomeRange] = useState<'Menos de 1 SMMLV' | '1 a 2 SMMLV' | 'Más de 2 SMMLV'>('Menos de 1 SMMLV')
  const [motivation, setMotivation] = useState('')

  // Paso 3: Compromiso y Disponibilidad
  const [modality, setModality] = useState<'Online (Microsoft Teams)' | 'Presencial (Sede Urabá)'>('Online (Microsoft Teams)')
  const [commitmentAccepted, setCommitmentAccepted] = useState(true)

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [copiedTicket, setCopiedTicket] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-llenar datos si hay sesión en Supabase
  useEffect(() => {
    async function loadUser() {
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
            setFullName(profile.full_name || profile.name || '')
            setEmail(profile.email || session.user.email || '')
            setPhone(profile.phone || '')
          }
        }
      } catch (err) {
        // Fallback silencioso
      }
    }
    loadUser()
  }, [])

  // Validaciones por paso
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorMessage('Por favor completa todos tus datos personales.')
        return
      }
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (currentStep === 2) {
      if (!motivation.trim() || motivation.length < 15) {
        setErrorMessage('Por favor cuéntanos brevemente por qué necesitas la beca (mínimo 15 caracteres).')
        return
      }
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (currentStep === 3) {
      if (!commitmentAccepted) {
        setErrorMessage('Debes aceptar el compromiso de dedicar mínimo 5 horas semanales a tu formación.')
        return
      }
      handleSubmitApplication()
    }
  }

  const handlePrevStep = () => {
    setErrorMessage(null)
    if (currentStep > 1 && currentStep <= 3) {
      setCurrentStep((currentStep - 1) as StepNumber)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Envío final
  const handleSubmitApplication = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    const generatedTicket = `ADE-BECA-${Date.now().toString().slice(-6)}`
    setTicketId(generatedTicket)

    try {
      const supabase = createClient()
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      await supabase.from('leads').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email.trim(),
          phone: phone.trim(),
          audience: 'solicitud_beca',
          details: JSON.stringify({
            ticket_id: generatedTicket,
            city,
            occupation,
            income_range: incomeRange,
            motivation,
            modality,
            weekly_commitment: '5_horas_minimo',
            status: 'postulacion_radicada'
          })
        }
      ])

      trackEvent('scholarship_application', {
        ticketId: generatedTicket,
        city,
        occupation,
        incomeRange,
        modality,
        fullName,
        email
      })
    } catch (err) {
      console.warn('Aviso: Registro previo de lead beca:', err)
    } finally {
      setIsSubmitting(false)
      setCurrentStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCopyTicket = () => {
    if (ticketId && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(ticketId)
      setCopiedTicket(true)
      setTimeout(() => setCopiedTicket(false), 2000)
    }
  }

  const whatsappMessage = `¡Hola American Dream English! 🎓\nAcabo de radicar mi postulación al Fondo de Becas.\n\n*Ticket:* ${ticketId}\n*Nombre:* ${fullName}\n*Ciudad:* ${city}\n*Modalidad:* ${modality}\n*Motivo:* ${motivation}\n\nAdjunto este mensaje para validar mi postulación oficial.`
  const whatsappUrl = `https://wa.me/573207105618?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. HEADER COMPACTO & BARRA DE PROGRESO DEL WIZARD */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Inicio</span>
            </Link>

            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Fondo de Becas Urabá
            </span>
          </div>

          {/* Título & Subtítulo */}
          <div className="pt-2 text-left space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Fondo de Becas ADE
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Tu futuro comienza con una oportunidad.
            </p>
          </div>

          {/* Barra de progreso interactiva (Pasos 1 a 3) */}
          {currentStep <= 3 && (
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-black">
                <span className="text-slate-500">
                  {currentStep === 1 && 'Paso 1: Datos Básicos'}
                  {currentStep === 2 && 'Paso 2: Perfil Socioeconómico'}
                  {currentStep === 3 && 'Paso 3: Compromiso & Modalidad'}
                </span>
                <span className="text-emerald-700 font-extrabold">{currentStep} de 3</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-5">
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold text-center animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 1 — DATOS BÁSICOS                                                    */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left animate-fadeIn">
            
            <div className="space-y-1 pb-1 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                Paso 1 — Datos de Contacto
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ingresa tus datos reales para contactarte en caso de preselección.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombres y Apellidos completos *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Valeria Morales Montoya"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de WhatsApp (Notificaciones de beca) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ciudad o Municipio de Residencia *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Turbo, Apartadó, Carepa, Necoclí, etc."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Botón Siguiente Paso */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* PASO 2 — PERFIL SOCIOECONÓMICO Y MOTIVACIÓN                                */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left animate-fadeIn">
            
            <div className="space-y-1 pb-1 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                Paso 2 — Perfil Socioeconómico
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Cuéntanos sobre tu situación actual y aspiraciones.
              </p>
            </div>

            {/* Ocupación actual (Chips rápidos) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Ocupación Actual *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Estudiante', 'Trabajador', 'Desempleado', 'Emprendedor'] as const).map((occ) => {
                  const active = occupation === occ
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccupation(occ)}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        active
                          ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{occ}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Rango de ingresos familiares */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Rango de Ingresos Familiares Mensuales *
              </label>
              <div className="space-y-2">
                {(['Menos de 1 SMMLV', '1 a 2 SMMLV', 'Más de 2 SMMLV'] as const).map((range) => {
                  const active = incomeRange === range
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setIncomeRange(range)}
                      className={`w-full min-h-[44px] p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all active:scale-[0.99] ${
                        active
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{range}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        active ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                      }`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Motivación con contador de caracteres */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  ¿Por qué necesitas la beca y cuál es tu meta? *
                </label>
                <span className={`text-[10px] font-bold ${
                  motivation.length > 280 ? 'text-red-600' : 'text-slate-400'
                }`}>
                  {motivation.length}/300
                </span>
              </div>
              <textarea
                required
                maxLength={300}
                rows={3}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Cuéntanos cómo aprender inglés transformará tu futuro laboral o académico..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            {/* Botonera inferior */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                className="min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all"
              >
                <span>← Anterior</span>
              </button>
              <button
                type="submit"
                className="min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-1.5 uppercase tracking-wider transition-all"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* PASO 3 — COMPROMISO Y DISPONIBILIDAD                                      */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <form onSubmit={handleNextStep} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 text-left animate-fadeIn">
            
            <div className="space-y-1 pb-1 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                Paso 3 — Compromiso Académico
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Selecciona la modalidad y confirma tu disponibilidad horaria.
              </p>
            </div>

            {/* Modalidad de Interés */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Modalidad de Interés *
              </label>
              <div className="space-y-2">
                {(['Online (Microsoft Teams)', 'Presencial (Sede Urabá)'] as const).map((mod) => {
                  const active = modality === mod
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setModality(mod)}
                      className={`w-full min-h-[48px] p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all active:scale-[0.99] ${
                        active
                          ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{mod.includes('Online') ? '🌐' : '🏫'}</span>
                        <span>{mod}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        active ? 'border-amber-400 bg-amber-400 text-navy-950' : 'border-slate-300'
                      }`}>
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Checkbox táctil grande de compromiso */}
            <div 
              onClick={() => setCommitmentAccepted(!commitmentAccepted)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                commitmentAccepted
                  ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                commitmentAccepted ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300'
              }`}>
                {commitmentAccepted && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <div className="space-y-0.5 text-xs text-slate-800">
                <span className="font-black text-slate-900 block">
                  Compromiso de Asistencia y Aprovechamiento *
                </span>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Me comprometo a dedicar <strong>mínimo 5 horas a la semana</strong> a mis clases sincrónicas y prácticas en la plataforma para mantener mi beneficio de beca.
                </p>
              </div>
            </div>

            {/* Botonera final */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all"
              >
                <span>← Anterior</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-1.5 uppercase tracking-wider transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Solicitud</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* ========================================================================= */}
        {/* PASO 4 — CONFIRMACIÓN FINAL Y RADICACIÓN EN WHATSAPP                       */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-fadeIn">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ¡Postulación Radicada con Éxito!
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2">
                Gracias, {fullName.split(' ')[0]}
              </h2>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                Tu solicitud ha sido registrada en el sistema de evaluación del Fondo de Becas ADE.
              </p>
            </div>

            {/* Ticket de Seguimiento */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Tu Código Único de Seguimiento
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg font-black text-navy-900 tracking-wider">
                  {ticketId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 active:scale-90 transition-transform"
                  title="Copiar ticket"
                >
                  {copiedTicket ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón Acción Prioritaria: Radicar en WhatsApp */}
            <div className="space-y-2.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('whatsapp_click', {
                    source: 'scholarship_ticket_radication',
                    ticketId,
                    city,
                    modality
                  })
                }}
                className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.25]" />
                <span>Radicar por WhatsApp Oficial</span>
              </a>

              <Link
                href="/"
                className="inline-block text-xs font-bold text-slate-500 hover:text-slate-800 py-2"
              >
                Volver a la página de inicio
              </Link>
            </div>

          </div>
        )}

      </main>

    </div>
  )
}
