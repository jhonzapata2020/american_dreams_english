'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  Globe2, 
  Loader2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Check,
  Calendar,
  HelpCircle,
  UserCheck
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

// Estructura de programas académicos
interface AcademicProgram {
  id: string
  title: string
  targetAudience: 'niños' | 'adultos'
  periodType: 'mensual' | 'semestral' | 'anual'
  periodLabel: string
  priceCop: number
  priceUsd: number
  description: string
  badge: string
  popular?: boolean
}

// Costos base institucionales
const MATRICULA_BASE_COP = 50000
const MATRICULA_BASE_USD = 13
const ADDON_EBOOK_MASTERCLASS_COP = 55000
const ADDON_EBOOK_MASTERCLASS_USD = 14

// Catálogo formal de programas académicos
const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-ninos-mensual',
    title: 'Programa Niños (Hasta 12 Años)',
    targetAudience: 'niños',
    periodType: 'mensual',
    periodLabel: 'Mensualidad (4 Semanas)',
    priceCop: 150000,
    priceUsd: 38,
    description: 'Metodología lúdica e interactiva, canciones, historias y fonética natural para niños y niñas.',
    badge: 'Kids & Junior',
  },
  {
    id: 'prog-adultos-mensual',
    title: 'Jóvenes y Adultos • Plan Mensual',
    targetAudience: 'adultos',
    periodType: 'mensual',
    periodLabel: 'Mensualidad (4 Semanas)',
    priceCop: 200000,
    priceUsd: 50,
    description: 'Inmersión conversacional, laboratorios fonéticos y preparación progresiva según el marco MCER (A1 a B2).',
    badge: 'Plan Mensual',
    popular: true,
  },
  {
    id: 'prog-adultos-semestre',
    title: 'Jóvenes y Adultos • Semestre Intensivo',
    targetAudience: 'adultos',
    periodType: 'semestral',
    periodLabel: 'Semestre (6 Meses / 120 Horas)',
    priceCop: 1200000,
    priceUsd: 300,
    description: 'Ciclo intensivo completo de 1 nivel MCER con acceso ilimitado a laboratorios y tutorías 1 a 1.',
    badge: 'Más Elegido',
  },
  {
    id: 'prog-adultos-anual',
    title: 'Jóvenes y Adultos • Anualidad Completa',
    targetAudience: 'adultos',
    periodType: 'anual',
    periodLabel: 'Año Académico Completo (12 Meses)',
    priceCop: 2400000,
    priceUsd: 600,
    description: 'De principiante a bilingüe certificado B2 con garantía laboral y preparación de exámenes internacionales.',
    badge: 'Mayor Ahorro',
  }
]

const COUNTRY_CODES = [
  { code: '+57', flag: '🇨🇴', label: 'Colombia (+57)' },
  { code: '+1', flag: '🇺🇸', label: 'Estados Unidos (+1)' },
  { code: '+52', flag: '🇲🇽', label: 'México (+52)' },
  { code: '+34', flag: '🇪🇸', label: 'España (+34)' },
  { code: '+507', flag: '🇵🇦', label: 'Panamá (+507)' },
  { code: '+593', flag: '🇪🇨', label: 'Ecuador (+593)' },
  { code: '+56', flag: '🇨🇱', label: 'Chile (+56)' },
  { code: '+51', flag: '🇵🇪', label: 'Perú (+51)' },
]

export default function MatriculaPage() {
  // Estado de programas y modalidades
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prog-adultos-mensual')
  const [modality, setModality] = useState<'presencial' | 'virtual'>('presencial')
  
  // Opciones de cobro y addons
  const [paymentMode, setPaymentMode] = useState<'full' | 'matricula_only'>('full')
  const [includeAddon, setIncludeAddon] = useState<boolean>(false)

  // Datos del estudiante
  const [fullName, setFullName] = useState<string>('')
  const [docType, setDocType] = useState<string>('CC')
  const [docNumber, setDocNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phonePrefix, setPhonePrefix] = useState<string>('+57')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('Turbo')
  const [acceptHabeas, setAcceptHabeas] = useState<boolean>(true)

  // Estados de pasarela y UI
  const [wompiLoaded, setWompiLoaded] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [transactionRef, setTransactionRef] = useState<string>('')

  // Programa seleccionado
  const selectedProgram = ACADEMIC_PROGRAMS.find((p) => p.id === selectedProgramId) || ACADEMIC_PROGRAMS[1]

  // Cálculo de liquidación
  const academicTuitionAmount = MATRICULA_BASE_COP
  const academicPeriodAmount = paymentMode === 'full' ? selectedProgram.priceCop : 0
  const addonAmount = includeAddon ? ADDON_EBOOK_MASTERCLASS_COP : 0
  const totalAmountToPay = academicTuitionAmount + academicPeriodAmount + addonAmount
  const totalUsdEquivalent = Math.round(totalAmountToPay / 4000)

  // Formateador de dinero en COP
  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Iniciar Pasarela de Pago Wompi
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validaciones básicas
    if (!fullName.trim()) {
      setErrorMessage('Por favor ingresa tus Nombres y Apellidos completos.')
      return
    }
    if (!docNumber.trim()) {
      setErrorMessage('Por favor ingresa tu Número de Identificación.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.')
      return
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Por favor ingresa tu número de WhatsApp para enviarte las credenciales.')
      return
    }
    if (!acceptHabeas) {
      setErrorMessage('Debes aceptar la autorización de tratamiento de datos personales.')
      return
    }

    setIsProcessing(true)
    const reference = `ADE-MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setTransactionRef(reference)

    // Registrar intención de matrícula en Supabase
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
          phone: `${phonePrefix} ${phoneNumber.trim()}`,
          audience: 'matricula_academica',
          details: JSON.stringify({
            doc_type: docType,
            doc_number: docNumber,
            program_id: selectedProgram.id,
            program_title: selectedProgram.title,
            payment_mode: paymentMode,
            matricula_cop: MATRICULA_BASE_COP,
            program_period_cop: selectedProgram.priceCop,
            include_addon: includeAddon,
            total_liquidated_cop: totalAmountToPay,
            modality: modality,
            city: city,
            reference: reference
          })
        }
      ])
    } catch (dbErr) {
      console.warn('Registro de lead:', dbErr)
    }

    // Inicializar Wompi Widget oficial
    if (typeof window !== 'undefined' && (window as any).WidgetCheckout) {
      try {
        const checkout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents: totalAmountToPay * 100,
          reference: reference,
          publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePzhSGeVe9HAUr1jiBmYH8',
          redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
          customerData: {
            email: email.trim(),
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            phoneNumberPrefix: phonePrefix,
            legalId: docNumber.trim(),
            legalIdType: docType
          }
        })

        checkout.open(function (result: any) {
          const transaction = result?.transaction
          console.log('Resultado de transacción Wompi:', transaction)
          setIsProcessing(false)
          if (transaction?.status === 'APPROVED' || transaction?.status === 'PENDING') {
            setPaymentSuccess(true)
          }
        })
      } catch (widgetErr) {
        console.error('Error al abrir checkout Wompi:', widgetErr)
        setIsProcessing(false)
        setErrorMessage('No se pudo abrir la pasarela de Wompi. Verifica tu conexión o intenta nuevamente.')
      }
    } else {
      // Simulación de respuesta en caso de bloqueo de scripts o entorno de prueba
      setTimeout(() => {
        setIsProcessing(false)
        setPaymentSuccess(true)
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* Script oficial Wompi Widget */}
      <Script
        src="https://checkout.wompi.co/widget.js"
        strategy="lazyOnload"
        onLoad={() => setWompiLoaded(true)}
      />

      {/* HEADER DE MATRÍCULA Y CHECKOUT SEGURO */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo Oficial y Enlace de Retorno */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="group flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              title="Volver a la página principal"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Volver al inicio</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <Link href="/" className="inline-flex items-center">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Sello de Seguridad SSL 256-Bit */}
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Proceso de Matrícula Seguro (SSL 256-bit)</span>
            <span className="sm:hidden">Pago Seguro 256-bit</span>
          </div>

        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Banner de Encabezado */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#002B49] border border-blue-200 rounded-full text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4 text-[#002B49]" />
            <span>Matrícula Académica Oficial • Periodo Vigente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Matrícula y Registro de Estudiantes en <span className="text-[#002B49]">American Dream</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Formaliza tu ingreso institucional y elige tu plan formativo con acompañamiento docente y certificación internacional MCER.
          </p>
        </div>

        {paymentSuccess ? (
          /* PANTALLA DE ÉXITO Y CONFIRMACIÓN */
          <div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">¡Matrícula Formalizada con Éxito!</h2>
              <p className="text-sm text-slate-600">
                Bienvenido/a a <strong>American Dream English</strong>. Se ha generado tu recibo de matrícula con el código de referencia:
              </p>
              <div className="inline-block bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl font-mono text-xs font-bold text-slate-800 mt-2">
                {transactionRef}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-2.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Estudiante:</span>
                <span className="font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Programa Formativo:</span>
                <span className="font-bold">{selectedProgram.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modalidad:</span>
                <span className="font-bold capitalize">{modality === 'presencial' ? 'Presencial (Sede Turbo)' : 'Virtual en Vivo (Zoom/Teams)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modalidad de Pago:</span>
                <span className="font-bold">{paymentMode === 'full' ? 'Matrícula + Periodo Académico' : 'Solo Reserva y Matrícula'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Liquidado:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{formatCop(totalAmountToPay)} COP</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/573105001234?text=Hola%20American%20Dream,%20acabo%20de%20formalizar%20mi%20matr%C3%ADcula%20para%20el%20programa%20${encodeURIComponent(selectedProgram.title)}%20con%20referencia%20${transactionRef}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar por WhatsApp con Secretaría</span>
              </a>

              <Link
                href="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-colors text-center"
              >
                Volver al Portal
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULARIO Y RESUMEN EN 2 COLUMNAS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: PROGRAMAS, DATOS Y PASARELA (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              <form onSubmit={handleInitiatePayment} className="space-y-6">
                
                {/* 1. SELECCIÓN DE PROGRAMAS FORMATIVOS REALES */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                        1
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Selecciona tu Programa Académico
                      </h2>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">Planes de Estudio</span>
                  </div>

                  {/* Listado de Programas Académicos */}
                  <div className="space-y-2.5">
                    {ACADEMIC_PROGRAMS.map((prog) => {
                      const isSelected = prog.id === selectedProgramId
                      return (
                        <div
                          key={prog.id}
                          onClick={() => setSelectedProgramId(prog.id)}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'border-[#002B49] bg-blue-50/40 ring-1 ring-[#002B49]/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <input
                              type="radio"
                              name="selectedProgram"
                              checked={isSelected}
                              onChange={() => setSelectedProgramId(prog.id)}
                              className="mt-1 text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                  {prog.title}
                                </h3>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                                  prog.popular 
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {prog.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {prog.description}
                              </p>
                              <div className="mt-2 flex items-center gap-2 text-[10px] font-medium text-slate-600">
                                <span className="inline-block px-2 py-0.5 bg-slate-100 rounded">
                                  {prog.periodLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Precio del Plan */}
                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-xs sm:text-sm text-[#002B49]">
                              {formatCop(prog.priceCop)}
                            </div>
                            <div className="text-[10px] font-medium text-slate-400">
                              ~ ${prog.priceUsd} USD
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Switch de Modalidad */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Modalidad de Estudio
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setModality('presencial')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          modality === 'presencial'
                            ? 'border-[#002B49] bg-blue-50/50 text-[#002B49] font-bold ring-1 ring-[#002B49]/30'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 shrink-0 text-slate-500" />
                        <div>
                          <div className="text-xs font-bold">Presencial Urabá</div>
                          <div className="text-[10px] text-slate-400 font-normal">Sede Turbo, Antioquia</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModality('virtual')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          modality === 'virtual'
                            ? 'border-[#002B49] bg-blue-50/50 text-[#002B49] font-bold ring-1 ring-[#002B49]/30'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Globe2 className="w-4 h-4 shrink-0 text-slate-500" />
                        <div>
                          <div className="text-xs font-bold">Virtual en Vivo</div>
                          <div className="text-[10px] text-slate-400 font-normal">Zoom / Teams en Tiempo Real</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 2. SELECTOR DE PAGO INICIAL FLEXIBLE */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Opciones de Pago Inicial para Matrícula
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Opción A: Matrícula + Periodo Completo */}
                      <div
                        onClick={() => setPaymentMode('full')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMode === 'full'
                            ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="paymentMode"
                            checked={paymentMode === 'full'}
                            onChange={() => setPaymentMode('full')}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-600"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Matrícula + Periodo Completo
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Paga los derechos de matrícula ($50.000) más el valor del plan elegido.
                            </div>
                            <div className="mt-1 font-mono font-bold text-xs text-emerald-800">
                              {formatCop(MATRICULA_BASE_COP + selectedProgram.priceCop)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Opción B: Solo Reserva y Derechos de Matrícula */}
                      <div
                        onClick={() => setPaymentMode('matricula_only')}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMode === 'matricula_only'
                            ? 'border-[#002B49] bg-blue-50/40 ring-1 ring-[#002B49]/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="paymentMode"
                            checked={paymentMode === 'matricula_only'}
                            onChange={() => setPaymentMode('matricula_only')}
                            className="mt-0.5 text-[#002B49] focus:ring-[#002B49]"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              Solo Reserva de Cupo Oficial
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Abona únicamente los derechos de matrícula. La mensualidad la pagas al iniciar clases.
                            </div>
                            <div className="mt-1 font-mono font-bold text-xs text-[#002B49]">
                              {formatCop(MATRICULA_BASE_COP)}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. MATERIAL COMPLEMENTARIO OPCIONAL (ADD-ON) */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      includeAddon
                        ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-400/40'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60'
                    }`}>
                      <input
                        type="checkbox"
                        checked={includeAddon}
                        onChange={(e) => setIncludeAddon(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Añadir Guía E-Book Digital & Masterclass de Entrevistas Bilingües
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-900 shrink-0">
                            +{formatCop(ADDON_EBOOK_MASTERCLASS_COP)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Incluye el E-Book interactivo descargable y la Masterclass en video 4K con acceso de por vida.
                        </p>
                      </div>
                    </label>
                  </div>

                </div>

                {/* 2. DATOS DEL ESTUDIANTE */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">
                      Datos del Estudiante para el Registro Académico
                    </h2>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* Nombres y Apellidos */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombres y Apellidos Completos *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Carlos Andrés Gómez Zapata"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                      />
                    </div>

                    {/* Documento de Identidad */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tipo Doc. *
                        </label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all cursor-pointer font-medium"
                        >
                          <option value="CC">C.C. Cédula</option>
                          <option value="TI">T.I. Identidad (Menores)</option>
                          <option value="CE">C.E. Extranjería</option>
                          <option value="PP">Pasaporte</option>
                          <option value="NIT">NIT</option>
                        </select>
                      </div>

                      <div className="sm:col-span-8">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Número de Identificación *
                        </label>
                        <input
                          type="text"
                          required
                          value={docNumber}
                          onChange={(e) => setDocNumber(e.target.value)}
                          placeholder="Ej. 1045123456"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Correo y WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="estudiante@correo.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <div className="flex gap-1.5">
                          <select
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 font-medium shrink-0 cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="310 000 0000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ciudad */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ciudad / Municipio de Residencia
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej. Turbo, Apartadó, Carepa, Necoclí, Medellín..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] transition-all"
                      />
                    </div>

                    {/* Habeas Data Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 text-[11px] leading-relaxed">
                        <input
                          type="checkbox"
                          checked={acceptHabeas}
                          onChange={(e) => setAcceptHabeas(e.target.checked)}
                          className="mt-0.5 rounded text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                        />
                        <span>
                          Autorizo a American Dream English a tratar mis datos para el proceso de matrícula, emisión de credenciales del Campus Virtual y contacto académico de acuerdo con la Ley 1581 de 2012.
                        </span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* 3. PASARELA DE PAGO POWERED BY WOMPI */}
                <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">
                          Método de Pago Seguro
                        </h2>
                        <p className="text-[10px] text-slate-400 font-semibold">Procesado con cifrado bancario de Wompi Bancolombia</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-black text-[#002B49] tracking-wider uppercase px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                      WOMPI BANCOLOMBIA
                    </span>
                  </div>

                  {/* Canales de Pago Disponibles en Wompi */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    
                    {/* Botón Bancolombia */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-[11px]">
                        BC
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">Bancolombia</span>
                      <span className="text-[9px] text-slate-400">Transferencia</span>
                    </div>

                    {/* PSE */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-black text-[11px]">
                        PSE
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">PSE</span>
                      <span className="text-[9px] text-slate-400">Todos los bancos</span>
                    </div>

                    {/* Nequi */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-black text-[11px]">
                        NQ
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">Nequi</span>
                      <span className="text-[9px] text-slate-400">Débito directo</span>
                    </div>

                    {/* Tarjetas */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col items-center justify-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">Tarjetas</span>
                      <span className="text-[9px] text-slate-400">Visa / Mastercard</span>
                    </div>

                  </div>

                  {/* BOTÓN CTA PRINCIPAL DE PAGO SEGURO */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#002B49] hover:bg-[#001f35] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                          <span>Conectando con Wompi...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Pagar {formatCop(totalAmountToPay)} COP de forma segura</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center font-medium mt-2">
                      🔒 Tu información bancaria es procesada directamente por Wompi Bancolombia bajo protocolos SSL de alta seguridad.
                    </p>
                  </div>

                </div>

              </form>

            </div>

            {/* COLUMNA DERECHA: RESUMEN DE MATRÍCULA Y LIQUIDACIÓN FORMAL (5 COLS - STICKY) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
                
                {/* Cabecera del resumen */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#002B49]" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Resumen de Matrícula
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                    Periodo 2026
                  </span>
                </div>

                {/* Programa y Modalidad Elegida */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-medium">Programa Formativo:</div>
                  <div className="font-extrabold text-slate-900 text-sm leading-snug">
                    {selectedProgram.title}
                  </div>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                      {modality === 'presencial' ? 'Sede Presencial Turbo' : 'Virtual en Vivo'}
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                      {selectedProgram.periodLabel}
                    </span>
                  </div>
                </div>

                {/* Desglose de Liquidación Formal */}
                <div className="border-t border-b border-slate-200/80 py-3.5 space-y-2.5 text-xs">
                  
                  {/* Matrícula Base Obligatoria */}
                  <div className="flex justify-between text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#002B49]" />
                      <span>Matrícula General (Derechos Base):</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatCop(MATRICULA_BASE_COP)}</span>
                  </div>

                  {/* Periodo Académico */}
                  <div className="flex justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{selectedProgram.periodLabel}:</span>
                    </div>
                    {paymentMode === 'full' ? (
                      <span className="font-mono font-bold text-slate-900">{formatCop(selectedProgram.priceCop)}</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
                        Pagas al iniciar ({formatCop(selectedProgram.priceCop)})
                      </span>
                    )}
                  </div>

                  {/* Material Opcional si está marcado */}
                  {includeAddon && (
                    <div className="flex justify-between text-amber-900 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>E-Book & Masterclass (Opcional):</span>
                      </div>
                      <span className="font-mono font-bold">{formatCop(ADDON_EBOOK_MASTERCLASS_COP)}</span>
                    </div>
                  )}

                  {/* Plataforma & Tutorías */}
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Campus Virtual & Laboratorio Fonético:</span>
                    <span className="font-semibold text-emerald-700">Incluido (Gratis)</span>
                  </div>

                  {/* TOTAL LIQUIDADO A PAGAR HOY */}
                  <div className="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="font-black text-slate-900 text-sm">Total Liquidado a Pagar:</span>
                      <div className="text-[10px] text-slate-400">
                        {paymentMode === 'full' ? 'Matrícula + Periodo Completo' : 'Pago de Reserva de Cupo'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-xl text-[#002B49]">
                        {formatCop(totalAmountToPay)} COP
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        ~ ${totalUsdEquivalent} USD
                      </div>
                    </div>
                  </div>

                </div>

                {/* Beneficios Incluidos */}
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    ¿Qué garantiza tu matrícula oficial?
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Reserva oficial de cupo en grupos reducidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Acceso 24/7 a audios y contenidos del Campus Virtual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Certificación oficial alineada con el marco MCER</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tutorías de acompañamiento 1 a 1</span>
                    </li>
                  </ul>
                </div>

                {/* Sellos de Confianza y Soporte WhatsApp */}
                <div className="pt-2 border-t border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pagos procesados directamente por Wompi Bancolombia</span>
                  </div>

                  <a
                    href="https://wa.me/573105001234?text=Hola%20American%20Dream,%20tengo%20una%20pregunta%20sobre%20el%20pago%20de%20mi%20matr%C3%ADcula"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl py-2.5 px-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>¿Dudas para pagar? Escríbenos por WhatsApp</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER DISCRETO */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} American Dream English • Instituto de Idiomas Turbo, Urabá Antioqueño</p>
          <p className="text-[10px]">
            Todos los pagos son administrados a través de la infraestructura autorizada de Wompi de Bancolombia S.A.
          </p>
        </div>
      </footer>

    </div>
  )
}
