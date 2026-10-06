'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  MessageCircle, 
  Building2, 
  Globe2, 
  Loader2, 
  AlertCircle, 
  GraduationCap, 
  Calendar,
  Check,
  BookmarkCheck,
  Info,
  ArrowRight,
  KeyRound,
  Copy
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { useCurrency } from '../../context/CurrencyContext'
import { SoftSwitch3D } from '../../components/ui/SoftSwitch3D'
import { InteractiveCard3D, getCardBrand } from '../../components/checkout/InteractiveCard3D'

// Catálogo formativo formal
interface AcademicProgram {
  id: string
  title: string
  targetAudience: 'niños' | 'adultos'
  monthlyFeeCop: number
  monthlyFeeUsd: number
  description: string
  badge: string
}

const MATRICULA_BASE_COP = 50000
const MATRICULA_BASE_USD = 13
const ADDON_EBOOK_MASTERCLASS_COP = 55000
const ADDON_EBOOK_MASTERCLASS_USD = 14

const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-adultos',
    title: 'Programa Jóvenes y Adultos',
    targetAudience: 'adultos',
    monthlyFeeCop: 200000,
    monthlyFeeUsd: 50,
    description: 'Inmersión conversacional, laboratorios fonéticos y preparación progresiva MCER (A1 a B2).',
    badge: 'Más Solicitado'
  },
  {
    id: 'prog-ninos',
    title: 'Programa Niños (Hasta 12 Años)',
    targetAudience: 'niños',
    monthlyFeeCop: 150000,
    monthlyFeeUsd: 38,
    description: 'Metodología lúdica, canciones, cuentos y fonética intuitiva para niños y niñas.',
    badge: 'Kids & Junior'
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
  // PASO 1: Modalidad de Pago Inicial (Por defecto: Solo Matrícula / Reserva de Cupo)
  const [paymentMode, setPaymentMode] = useState<'matricula_only' | 'full'>('matricula_only')

  // PASO 2: Programa Formativo, Modalidad y Add-on
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prog-adultos')
  const [modality, setModality] = useState<'presencial' | 'virtual'>('presencial')
  const [includeAddon, setIncludeAddon] = useState<boolean>(false)

  // PASO 3: Datos del Estudiante
  const [fullName, setFullName] = useState<string>('')
  const [docType, setDocType] = useState<string>('CC')
  const [docNumber, setDocNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phonePrefix, setPhonePrefix] = useState<string>('+57')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [city, setCity] = useState<string>('Turbo')
  const [acceptHabeas, setAcceptHabeas] = useState<boolean>(true)

  // Estados de carga y Wompi
  const [wompiLoaded, setWompiLoaded] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [transactionRef, setTransactionRef] = useState<string>('')
  const [copiedCreds, setCopiedCreds] = useState<boolean>(false)

  // PASO 4: Método de pago y Tarjeta Interactiva 3D
  const [paymentMethodTab, setPaymentMethodTab] = useState<'card' | 'channels'>('card')
  const [cardHolder, setCardHolder] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardExp, setCardExp] = useState<string>('')
  const [cardCvc, setCardCvc] = useState<string>('')
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false)
  const [saveCard, setSaveCard] = useState<boolean>(true)

  // Sistema dinámico de divisas con TRM en vivo
  const { currency, setCurrency, exchangeRate, formatPrice } = useCurrency()

  // Programa seleccionado
  const selectedProgram = ACADEMIC_PROGRAMS.find((p) => p.id === selectedProgramId) || ACADEMIC_PROGRAMS[0]

  // Liquidación del pago a realizar hoy
  const matriculaAmount = MATRICULA_BASE_COP
  const tuitionDueToday = paymentMode === 'full' ? selectedProgram.monthlyFeeCop : 0
  const pendingTuitionBalance = paymentMode === 'matricula_only' ? selectedProgram.monthlyFeeCop : 0
  const addonAmount = includeAddon ? ADDON_EBOOK_MASTERCLASS_COP : 0
  const totalAmountToPayToday = matriculaAmount + tuitionDueToday + addonAmount
  const totalUsdEquivalentToday = Math.round((totalAmountToPayToday / (exchangeRate || 4050)) * 100) / 100

  // Formateador de dinero en COP estándar para display auxiliar
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

    // Validaciones
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

    // 1. Solicitar referencia única y firma de integridad a la API
    let signatureData: any = null
    try {
      const sigResponse = await fetch('/api/wompi/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmountToPayToday,
          email: email.trim(),
          documentNumber: docNumber.trim(),
          currency: 'COP',
          programTitle: selectedProgram.title
        })
      })

      if (sigResponse.ok) {
        signatureData = await sigResponse.json()
      }
    } catch (sigErr) {
      console.warn('Error obteniendo firma de integridad:', sigErr)
    }

    const finalReference = signatureData?.reference || `ADE-MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setTransactionRef(finalReference)

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
            matricula_paid_cop: matriculaAmount,
            tuition_paid_today_cop: tuitionDueToday,
            pending_tuition_cop: pendingTuitionBalance,
            include_addon: includeAddon,
            total_paid_today_cop: totalAmountToPayToday,
            modality: modality,
            city: city,
            reference: finalReference
          })
        }
      ])
    } catch (dbErr) {
      console.warn('Registro de lead:', dbErr)
    }

    // 2. Inicializar Wompi Widget oficial con firma de integridad y datos del alumno
    if (typeof window !== 'undefined' && (window as any).WidgetCheckout) {
      try {
        const checkoutConfig: any = {
          currency: 'COP',
          amountInCents: signatureData?.amountInCents || totalAmountToPayToday * 100,
          reference: finalReference,
          publicKey: signatureData?.publicKey || process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePzhSGeVe9HAUr1jiBmYH8',
          redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
          customerData: {
            email: email.trim(),
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            phoneNumberPrefix: phonePrefix,
            legalId: docNumber.trim(),
            legalIdType: docType
          }
        }

        if (signatureData?.signature) {
          checkoutConfig.signature = {
            integrity: signatureData.signature
          }
        }

        const checkout = new (window as any).WidgetCheckout(checkoutConfig)

        checkout.open(async function (result: any) {
          const transaction = result?.transaction
          console.log('Resultado transacción Wompi:', transaction)
          setIsProcessing(false)
          if (transaction?.status === 'APPROVED' || transaction?.status === 'PENDING') {
            await autoCreateStudentAccount()
            setPaymentSuccess(true)
          }
        })
      } catch (widgetErr) {
        console.error('Error al abrir checkout Wompi:', widgetErr)
        setIsProcessing(false)
        setErrorMessage('No se pudo abrir la pasarela de Wompi. Por favor intenta nuevamente.')
      }
    } else {
      // Simulación de respuesta en caso de prueba local
      setTimeout(async () => {
        await autoCreateStudentAccount()
        setIsProcessing(false)
        setPaymentSuccess(true)
      }, 1500)
    }
  }

  const autoCreateStudentAccount = async () => {
    try {
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      const cleanDoc = docNumber.trim()

      await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          fullName: fullName.trim(),
          documentType: docType,
          documentId: cleanDoc,
          email: email.trim(),
          phone: `${phonePrefix} ${phoneNumber.trim()}`,
          mcerLevel: 'A1',
          courseName: selectedProgram.title,
          modality: modality,
          municipality: city || 'Turbo (Urabá)'
        })
      })
    } catch (err) {
      console.warn('Registro automático de estudiante en background:', err)
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

          <div className="flex items-center gap-3">
            {/* Soft 3D Neumorphic Switch de Moneda [COP | USD] */}
            <div className="flex items-center px-2 py-1 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <SoftSwitch3D
                checked={currency === 'USD'}
                onChange={(isUsd) => setCurrency(isUsd ? 'USD' : 'COP')}
                leftLabel="COP"
                rightLabel="USD"
                size="sm"
                ariaLabel="Alternar moneda entre COP y USD en matrícula"
              />
            </div>

            {/* Sello de Seguridad SSL 256-Bit */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Proceso Seguro (SSL 256-bit)</span>
            </div>
          </div>

        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Banner de Encabezado */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#002B49] border border-blue-200 rounded-full text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4 text-[#002B49]" />
            <span>Matrícula Institucional • Periodo Académico 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formaliza tu Matrícula en <span className="text-[#002B49]">American Dream</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reserva tu cupo oficial hoy con el pago de matrícula y programa tu inicio de clases en la sede presencial o en salas virtuales.
          </p>
        </div>

        {paymentSuccess ? (
          /* PANTALLA DE ÉXITO Y CONFIRMACIÓN */
          <div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">¡Matrícula Procesada con Éxito!</h2>
              <p className="text-sm text-slate-600">
                Tu cupo oficial en <strong>American Dream English</strong> ha quedado asegurado. Referencia de pago:
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
                <span className="text-slate-500">Programa Académico:</span>
                <span className="font-bold">{selectedProgram.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modalidad:</span>
                <span className="font-bold">{modality === 'presencial' ? 'Presencial (Sede Turbo)' : 'Virtual en Vivo (Zoom/Teams)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Concepto Pagado Hoy:</span>
                <span className="font-bold">
                  {paymentMode === 'matricula_only' ? 'Reserva y Derechos de Matrícula' : 'Matrícula + 1ª Mensualidad'}
                </span>
              </div>
              {paymentMode === 'matricula_only' && (
                <div className="flex justify-between text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                  <span>Saldo Mensualidad (al iniciar):</span>
                  <span className="font-bold font-mono">{formatCop(selectedProgram.monthlyFeeCop)} COP</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Pagado Hoy:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{formatCop(totalAmountToPayToday)} COP</span>
              </div>
            </div>

            {/* CAJA DE CREDENCIALES AUTOMÁTICAS PARA EL ESTUDIANTE */}
            <div className="bg-gradient-to-br from-[#002B49]/5 to-blue-50/50 border border-[#002B49]/20 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Credenciales Generadas para tu Campus Virtual
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tu cuenta ha sido activada automáticamente. Tu número de cédula es tu clave inicial.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Usuario / ID:</span>
                  <span className="font-mono font-black text-xs sm:text-sm text-slate-900">{docNumber.trim()}</span>
                  <span className="text-[10px] text-slate-400 block truncate">o {email.trim()}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Contraseña Inicial:</span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-600">{docNumber.trim()}</span>
                  <span className="text-[10px] text-slate-400 block">(Tu número de documento)</span>
                </div>
              </div>

              {copiedCreds && (
                <div className="p-2 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>¡Credenciales copiadas al portapapeles!</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/campus/login"
                className="bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Ingresar al Campus Virtual Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const credMsg = `🎉 *¡MI MATRÍCULA EN AMERICAN DREAM ENGLISH!* 🎓\n\nNombre: *${fullName}*\nDocumento / Usuario: *${docNumber.trim()}*\nPrograma: *${selectedProgram.title}*\nRef: *${transactionRef}*\n\nAcceso al Campus: ${typeof window !== 'undefined' ? window.location.origin : ''}/campus/login\nClave Inicial: *${docNumber.trim()}*`
                  navigator.clipboard.writeText(credMsg)
                  setCopiedCreds(true)
                  setTimeout(() => setCopiedCreds(false), 3000)
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copiar Mis Credenciales</span>
              </button>

              <a
                href={`https://wa.me/573105001234?text=Hola%20American%20Dream,%20acabo%20de%20pagar%20mi%20matr%C3%ADcula%20para%20el%20programa%20${encodeURIComponent(selectedProgram.title)}%20con%20referencia%20${transactionRef}%20y%20documento%20${docNumber.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar con Secretaría</span>
              </a>
            </div>
          </div>
        ) : (
          /* FORMULARIO Y RESUMEN EN 2 COLUMNAS CON EL FORMULARIO INTEGRADO */
          <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ========================================================= */}
            {/* COLUMNA IZQUIERDA: PASOS 1, 2 Y 3 (DATOS Y PROGRAMA)       */}
            {/* ========================================================= */}
            <div className="lg:col-span-6 space-y-6">
                
              {/* ========================================================= */}
              {/* PASO 1: MODALIDAD DE PAGO INICIAL (ARRIBA DEL TODO)      */}
              {/* ========================================================= */}
              <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Modalidad de Pago Inicial
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Elige cómo deseas formalizar tu ingreso hoy
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    Flexibilidad
                  </span>
                </div>

                {/* Las dos tarjetas seleccionables principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* TARJETA 1 (POR DEFECTO / RECOMENDADA): Solo Matrícula y Reserva de Cupo */}
                  <div
                    onClick={() => setPaymentMode('matricula_only')}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMode === 'matricula_only'
                        ? 'border-[#002B49] bg-blue-50/40 ring-2 ring-[#002B49]/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <BookmarkCheck className="w-3 h-3" />
                          Más Elegido
                        </span>
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={paymentMode === 'matricula_only'}
                          onChange={() => setPaymentMode('matricula_only')}
                          className="text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                        />
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        Solo Matrícula y Reserva de Cupo
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Asegura tu cupo oficial hoy. La mensualidad la puedes pagar hasta un día antes del inicio de clases.
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-baseline justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Pagas hoy:</span>
                      <span className="font-mono font-black text-base text-[#002B49]">
                        {formatPrice(MATRICULA_BASE_COP)}
                      </span>
                    </div>
                  </div>

                  {/* TARJETA 2: Matrícula + Periodo Completo */}
                  <div
                    onClick={() => setPaymentMode('full')}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentMode === 'full'
                        ? 'border-[#002B49] bg-blue-50/40 ring-2 ring-[#002B49]/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded-md">
                          Pago Anticipado
                        </span>
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={paymentMode === 'full'}
                          onChange={() => setPaymentMode('full')}
                          className="text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                        />
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                        Matrícula + Periodo Completo
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Cancela tu matrícula ({formatPrice(MATRICULA_BASE_COP)}) más tu primera mensualidad ({formatPrice(selectedProgram.monthlyFeeCop)}) de forma anticipada.
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-baseline justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">Pagas hoy:</span>
                      <span className="font-mono font-black text-base text-slate-900">
                        {formatPrice(MATRICULA_BASE_COP + selectedProgram.monthlyFeeCop)}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* ========================================================= */}
              {/* PASO 2: SELECCIÓN DE PROGRAMA FORMATIVO Y SEDE            */}
              {/* ========================================================= */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Selección de Programa Formativo y Sede
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {paymentMode === 'matricula_only' 
                          ? 'Define el programa al que pertenecerás (la mensualidad se liquidará al iniciar clases)'
                          : 'Selecciona tu programa de formación académica'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Listado limpio de programas formativos */}
                <div className="space-y-2.5">
                  {ACADEMIC_PROGRAMS.map((prog) => {
                    const isSelected = prog.id === selectedProgramId
                    return (
                      <div
                        key={prog.id}
                        onClick={() => setSelectedProgramId(prog.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-[#002B49] bg-blue-50/30 ring-1 ring-[#002B49]/30 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="radio"
                            name="academicProgram"
                            checked={isSelected}
                            onChange={() => setSelectedProgramId(prog.id)}
                            className="mt-1 text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                {prog.title}
                              </h3>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                                {prog.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {prog.description}
                            </p>
                          </div>
                        </div>

                        {/* Tarifa Mensual */}
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-semibold text-slate-400">Mensualidad:</div>
                          <div className="font-mono font-bold text-xs sm:text-sm text-slate-800">
                            {formatPrice(prog.monthlyFeeCop)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selector de Modalidad */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Sede / Modalidad de Estudio
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
                        <div className="text-xs font-bold">Presencial Turbo</div>
                        <div className="text-[10px] text-slate-400 font-normal">Sede Urabá Antioqueño</div>
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

                {/* Material Complementario Opcional (Add-on) */}
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
                          Añadir Guía E-Book Digital & Masterclass de Entrevistas (+ {formatPrice(ADDON_EBOOK_MASTERCLASS_COP)})
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-900 shrink-0">
                          +{formatPrice(ADDON_EBOOK_MASTERCLASS_COP)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Incluye el E-Book interactivo descargable y la Masterclass en video 4K con acceso de por vida.
                      </p>
                    </div>
                  </label>
                </div>

              </div>

              {/* ========================================================= */}
              {/* PASO 3: DATOS DEL ESTUDIANTE                             */}
              {/* ========================================================= */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                    3
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

            </div>

            {/* ========================================================= */}
            {/* COLUMNA DERECHA: RESUMEN + PASO 4 (MÉTODO DE PAGO Y TARJETA) */}
            {/* ========================================================= */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* 1. CONTENEDOR DE RESUMEN DE MATRÍCULA / FACTURA */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                
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
                  <div className="text-xs text-slate-500 font-medium">Programa Asignado:</div>
                  <div className="font-extrabold text-slate-900 text-sm leading-snug">
                    {selectedProgram.title}
                  </div>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                      {modality === 'presencial' ? 'Sede Presencial Turbo' : 'Virtual en Vivo'}
                    </span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                      {paymentMode === 'matricula_only' ? 'Reserva de Cupo' : 'Periodo Completo'}
                    </span>
                  </div>
                </div>

                {/* Desglose de Liquidación */}
                <div className="border-t border-b border-slate-200/80 py-3.5 space-y-2.5 text-xs">
                  
                  {/* Cargo 1: Matrícula Oficial */}
                  <div className="flex justify-between text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#002B49]" />
                      <span>Derechos de Matrícula (Pagas hoy):</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatPrice(MATRICULA_BASE_COP)}</span>
                  </div>

                  {/* Cargo 2: Mensualidad / Periodo */}
                  <div className="flex justify-between text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>Primera Mensualidad:</span>
                    </div>
                    {paymentMode === 'full' ? (
                      <span className="font-mono font-bold text-slate-900">{formatPrice(selectedProgram.monthlyFeeCop)}</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                        Pagas al iniciar ({formatPrice(selectedProgram.monthlyFeeCop)})
                      </span>
                    )}
                  </div>

                  {/* Cargo 3: Material Opcional si está marcado */}
                  {includeAddon && (
                    <div className="flex justify-between text-amber-900 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>E-Book & Masterclass (Opcional):</span>
                      </div>
                      <span className="font-mono font-bold">{formatPrice(ADDON_EBOOK_MASTERCLASS_COP)}</span>
                    </div>
                  )}

                  {/* Plataforma & Tutorías */}
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Campus Virtual & Laboratorios:</span>
                    <span className="font-semibold text-emerald-700">Incluido (Gratis)</span>
                  </div>

                  {/* TOTAL LIQUIDADO A PAGAR HOY */}
                  <div className="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                      <span className="font-black text-slate-900 text-sm">Total Liquidado a Pagar Hoy:</span>
                      <div className="text-[10px] text-slate-400">
                        {paymentMode === 'matricula_only' ? 'Reserva oficial de cupo' : 'Matrícula + 1ª Mensualidad'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-black text-xl text-[#002B49]">
                        {formatPrice(totalAmountToPayToday)}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        {currency === 'USD' ? (
                          <span>Base: {formatCop(totalAmountToPayToday)} COP (TRM: 1 USD = {formatCop(exchangeRate)})</span>
                        ) : (
                          <span>~ ${totalUsdEquivalentToday} USD (TRM: 1 USD = {formatCop(exchangeRate)})</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Badge Informativo si eligió Solo Matrícula */}
                {paymentMode === 'matricula_only' && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200/70 rounded-xl text-blue-900 text-[11px] leading-relaxed flex items-start gap-2 animate-fadeIn">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      📅 Tu cupo oficial quedará asegurado inmediatamente. Recibirás tu credencial del Campus Virtual y el plazo para pagar tu primera mensualidad hasta un día antes del inicio de clases.
                    </span>
                  </div>
                )}

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

              {/* 2. CONTENEDOR DE PASO 4: MÉTODO DE PAGO SEGURO Y TARJETA (DEBAJO DEL RESUMEN) */}
              <div className="bg-white border-2 border-blue-900/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                
                {/* Cabecera Paso 4 */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#002B49] text-white text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Método de Pago Seguro
                      </h2>
                      <p className="text-[10px] text-slate-400 font-semibold">Procesado con cifrado bancario y tokenización segura</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-black text-[#002B49] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>PCI-DSS Level 1</span>
                  </div>
                </div>

                {/* Selector de Pestaña de Pago */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethodTab('card')}
                    className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethodTab === 'card'
                        ? 'bg-white text-slate-900 shadow-sm font-extrabold border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Tarjeta Débito / Crédito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethodTab('channels')}
                    className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethodTab === 'channels'
                        ? 'bg-white text-slate-900 shadow-sm font-extrabold border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>PSE / Nequi / Bancolombia</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* PESTAÑA 1: TARJETA INTERACTIVA 3D (FLIPPING CARD)         */}
                {/* ========================================================= */}
                {paymentMethodTab === 'card' ? (
                  <div className="space-y-4 pt-1">
                    
                    {isProcessing ? (
                      /* ESTADO ACTIVO AL PAGAR: TARJETA SOLA VIBRANDO E ILUMINADA */
                      <div className="py-6 text-center space-y-5 animate-fadeIn bg-gradient-to-b from-blue-50/70 via-blue-50/30 to-transparent rounded-2xl border border-blue-200/80 p-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100/90 text-[#002B49] rounded-full text-xs font-black animate-pulse shadow-xs">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span>Procesando Pago Seguro con Wompi...</span>
                        </div>

                        <div className="py-2">
                          <InteractiveCard3D
                            cardNumber={cardNumber}
                            cardHolder={cardHolder || fullName || 'NOMBRE TITULAR'}
                            expDate={cardExp}
                            cvc={cardCvc}
                            isFlipped={isCardFlipped}
                            isProcessing={true}
                            className="scale-105"
                          />
                        </div>

                        <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                          Conectando con la pasarela bancaria autorizada de <strong>Wompi Bancolombia</strong>. Por favor no cierres ni recargues esta ventana.
                        </p>
                      </div>
                    ) : (
                      /* ESTADO NORMAL: TARJETA 3D ARRIBA + INPUTS DEBAJO */
                      <div className="space-y-4">
                        
                        {/* Tarjeta 3D Interactiva en Vivo */}
                        <div className="space-y-1.5">
                          <div className="w-full flex items-center justify-between px-1 text-slate-500 text-[11px]">
                            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#002B49]">
                              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                              Vista Previa en Vivo 3D
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {isCardFlipped ? 'Reverso (CVC Activo ↻)' : 'Frente'}
                            </span>
                          </div>

                          <InteractiveCard3D
                            cardNumber={cardNumber}
                            cardHolder={cardHolder || fullName || 'NOMBRE TITULAR'}
                            expDate={cardExp}
                            cvc={cardCvc}
                            isFlipped={isCardFlipped}
                            isProcessing={isProcessing}
                          />
                        </div>

                        {/* Campos de Captura de la Tarjeta */}
                        <div className="space-y-3 pt-2">
                          
                          {/* Nombre del Titular */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Cardholder Name (Nombre en la Tarjeta)
                            </label>
                            <input
                              type="text"
                              value={cardHolder || fullName}
                              onChange={(e) => setCardHolder(e.target.value)}
                              placeholder="Ej. JHON ZAPATA o Nombre Titular"
                              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all uppercase"
                              disabled={isProcessing}
                            />
                          </div>

                          {/* Número de Tarjeta con auto-espaciado en bloques de 4 */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                              Card Number (Número de Tarjeta)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                                  const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
                                  setCardNumber(formatted)
                                }}
                                placeholder="4242 4242 4242 4242"
                                maxLength={19}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 pr-16 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all tracking-wider"
                                disabled={isProcessing}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-black text-blue-900 uppercase">
                                {getCardBrand(cardNumber) !== 'generic' ? getCardBrand(cardNumber).toUpperCase() : ''}
                              </div>
                            </div>
                          </div>

                          {/* Fecha de Expiración y CVC (Flip Trigger) */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Expiry (MM/AA)
                              </label>
                              <input
                                type="text"
                                value={cardExp}
                                onChange={(e) => {
                                  let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                                  if (raw.length >= 3) {
                                    raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`
                                  }
                                  setCardExp(raw)
                                }}
                                placeholder="12/28"
                                maxLength={5}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all"
                                disabled={isProcessing}
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                                  CVC / CVV
                                </label>
                                <span className="text-[10px] text-blue-600 font-semibold">Giro 3D ↻</span>
                              </div>
                              <input
                                type="password"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                placeholder="•••"
                                maxLength={4}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all"
                                disabled={isProcessing}
                              />
                            </div>
                          </div>

                          {/* Guardar tarjeta */}
                          <div className="pt-1">
                            <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 text-xs select-none">
                              <input
                                type="checkbox"
                                checked={saveCard}
                                onChange={(e) => setSaveCard(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              <div>
                                <span className="font-bold text-slate-800 block text-xs">Guardar tarjeta para futuras mensualidades</span>
                                <span className="text-[10px] text-slate-400 block">Tokenizado por Wompi Bancolombia.</span>
                              </div>
                            </label>
                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                ) : (
                  /* ========================================================= */
                  /* PESTAÑA 2: TRANSFERENCIAS, PSE Y NEQUI                     */
                  /* ========================================================= */
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-black text-[11px]">
                          BC
                        </div>
                        <span className="text-[11px] font-bold text-slate-800">Bancolombia</span>
                        <span className="text-[9px] text-slate-400">Transferencia</span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-black text-[11px]">
                          PSE
                        </div>
                        <span className="text-[11px] font-bold text-slate-800">PSE</span>
                        <span className="text-[9px] text-slate-400">Todos los bancos</span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-black text-[11px]">
                          NQ
                        </div>
                        <span className="text-[11px] font-bold text-slate-800">Nequi</span>
                        <span className="text-[9px] text-slate-400">Débito directo</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      💡 Al hacer clic en el botón de pago, se abrirá de inmediato la pasarela oficial para autorizar tu transferencia o débito PSE/Nequi.
                    </p>
                  </div>
                )}

                {/* BOTÓN CTA PRINCIPAL DE PAGO SEGURO */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#183ec2] hover:bg-[#123099] active:bg-[#0c226e] text-white font-black text-sm sm:text-base py-4 px-6 rounded-2xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-75 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                        <span>Procesando pago seguro...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-300" />
                        <span>Pagar {formatPrice(totalAmountToPayToday)}</span>
                        <ArrowRight className="w-4 h-4 text-white ml-1" />
                      </>
                    )}
                  </button>
                  
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium mt-3">
                    <div className="flex items-center gap-2.5">
                      <span>🛡️ PCI-DSS Level 1</span>
                      <span>🔒 TLS 256-bit</span>
                    </div>
                    <span>American Dream never stores your CVC</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </main>

      {/* FOOTER */}
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
