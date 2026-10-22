'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { createClient } from '../../../utils/supabase/client'
import { 
  DollarSign, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building2, 
  FileText, 
  Download, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Check,
  X,
  CreditCard,
  Send,
  Calendar,
  Printer,
  TrendingUp,
  Percent,
  Cpu,
  Info,
  GraduationCap,
  BookOpen,
  Award,
  Wallet,
  Landmark,
  QrCode,
  Shield,
  Copy,
  Bell,
  Volume2,
  VolumeX,
  Share2,
  TableProperties,
  SlidersHorizontal
} from 'lucide-react'

// Tipos de datos
export interface TransactionItem {
  id: string
  student_name: string
  student_email: string
  student_doc?: string
  concept_type: 'matricula' | 'mensualidad' | 'digital'
  concept_name: string
  wompi_reference: string
  wompi_status: 'APPROVED' | 'PENDING' | 'DECLINED'
  amount_cop: number
  corplex_percentage: number // 0.50 | 0.10
  corplex_commission_cop: number
  american_dream_net_cop: number
  corplex_settled: boolean
  settlement_id?: string
  created_at: string
}

export interface SettlementRecord {
  id: string
  period_label: string
  settled_at: string
  transactions_count: number
  total_gross_cop: number
  total_corplex_payout_cop: number
  total_american_dream_cop: number
  bank_reference: string
  payment_method: string
  authorized_by: string
  notes?: string
  status: 'COMPLETED'
}

// Datos iniciales de transacciones Wompi aprobadas
const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-001',
    student_name: 'Valeria Morales Montoya',
    student_email: 'valeria.morales@americandream.edu.co',
    student_doc: '1.040.892.341',
    concept_type: 'matricula',
    concept_name: 'Matrícula Oficial y Reserva de Cupo (2026-I)',
    wompi_reference: 'WOMPI-ADE-849201',
    wompi_status: 'APPROVED',
    amount_cop: 50000,
    corplex_percentage: 0.50,
    corplex_commission_cop: 25000,
    american_dream_net_cop: 25000,
    corplex_settled: false,
    created_at: '2026-10-04T10:15:00-05:00'
  },
  {
    id: 'tx-002',
    student_name: 'Juan Carlos Higuita Ruiz',
    student_email: 'juan.higuita@gmail.com',
    student_doc: '1.038.712.990',
    concept_type: 'mensualidad',
    concept_name: 'Mensualidad Programa Jóvenes y Adultos',
    wompi_reference: 'WOMPI-ADE-849202',
    wompi_status: 'APPROVED',
    amount_cop: 200000,
    corplex_percentage: 0.10,
    corplex_commission_cop: 20000,
    american_dream_net_cop: 180000,
    corplex_settled: false,
    created_at: '2026-10-04T11:30:00-05:00'
  },
  {
    id: 'tx-003',
    student_name: 'María Camila Toro Gómez',
    student_email: 'camilatoro@outlook.com',
    student_doc: '1.040.119.452',
    concept_type: 'matricula',
    concept_name: 'Matrícula Oficial y Reserva de Cupo (2026-I)',
    wompi_reference: 'WOMPI-ADE-849203',
    wompi_status: 'APPROVED',
    amount_cop: 50000,
    corplex_percentage: 0.50,
    corplex_commission_cop: 25000,
    american_dream_net_cop: 25000,
    corplex_settled: false,
    created_at: '2026-10-03T15:45:00-05:00'
  },
  {
    id: 'tx-004',
    student_name: 'Esteban Darío Mendoza',
    student_email: 'esteban.mendoza@gmail.com',
    student_doc: '1.041.558.120',
    concept_type: 'digital',
    concept_name: 'Masterclass Entrevistas Bilingües + E-Book Pack',
    wompi_reference: 'WOMPI-ADE-849204',
    wompi_status: 'APPROVED',
    amount_cop: 85000,
    corplex_percentage: 0.10,
    corplex_commission_cop: 8500,
    american_dream_net_cop: 76500,
    corplex_settled: false,
    created_at: '2026-10-03T18:20:00-05:00'
  },
  {
    id: 'tx-005',
    student_name: 'Luciana Restrepo Cano (Padre: Mario)',
    student_email: 'mario.restrepo@gmail.com',
    student_doc: '1.037.994.218',
    concept_type: 'mensualidad',
    concept_name: 'Mensualidad Programa Niños (Hasta 12 años)',
    wompi_reference: 'WOMPI-ADE-849205',
    wompi_status: 'APPROVED',
    amount_cop: 150000,
    corplex_percentage: 0.10,
    corplex_commission_cop: 15000,
    american_dream_net_cop: 135000,
    corplex_settled: false,
    created_at: '2026-10-02T14:10:00-05:00'
  },
  {
    id: 'tx-006',
    student_name: 'Santiago Arango Palacio',
    student_email: 'santiago.arango@gmail.com',
    student_doc: '1.042.880.111',
    concept_type: 'matricula',
    concept_name: 'Matrícula Oficial y Reserva de Cupo (2026-I)',
    wompi_reference: 'WOMPI-ADE-849206',
    wompi_status: 'APPROVED',
    amount_cop: 50000,
    corplex_percentage: 0.50,
    corplex_commission_cop: 25000,
    american_dream_net_cop: 25000,
    corplex_settled: false,
    created_at: '2026-10-01T09:40:00-05:00'
  }
]

// Histórico de liquidaciones anteriores
const INITIAL_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'SETTLE-2026-002',
    period_label: 'Corte Quincenal · Septiembre 16 al 30 de 2026',
    settled_at: '2026-09-30T17:00:00-05:00',
    transactions_count: 14,
    total_gross_cop: 2150000,
    total_corplex_payout_cop: 395000,
    total_american_dream_cop: 1755000,
    bank_reference: 'BANC-TR-9984102',
    payment_method: 'Transferencia Bancolombia NIT 902.061.373-5',
    authorized_by: 'Anthony Zapata (Director Académico)',
    notes: 'Liquidación conforme a la cláusula de operación tecnológica del fondo educativo.',
    status: 'COMPLETED'
  },
  {
    id: 'SETTLE-2026-001',
    period_label: 'Corte Quincenal · Septiembre 01 al 15 de 2026',
    settled_at: '2026-09-15T16:30:00-05:00',
    transactions_count: 11,
    total_gross_cop: 1650000,
    total_corplex_payout_cop: 310000,
    total_american_dream_cop: 1340000,
    bank_reference: 'BANC-TR-9821455',
    payment_method: 'Transferencia Bancolombia NIT 902.061.373-5',
    authorized_by: 'Anthony Zapata (Director Académico)',
    notes: 'Primer corte de admisiones ciclo formativo especial.',
    status: 'COMPLETED'
  }
]

export default function LiquidacionesCorplexPage() {
  const supabase = createClient()

  // Estados principales
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS)
  const [settlementHistory, setSettlementHistory] = useState<SettlementRecord[]>(INITIAL_SETTLEMENTS)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'pendientes' | 'historico' | 'acuerdo'>('pendientes')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterConcept, setFilterConcept] = useState<'all' | 'matricula' | 'mensualidad' | 'digital'>('all')

  // Notificaciones y Sonido
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false)
  const [selectedSettlementForActa, setSelectedSettlementForActa] = useState<SettlementRecord | null>(null)

  // Formulario de Liquidación
  const [bankRefInput, setBankRefInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [isProcessingSettlement, setIsProcessingSettlement] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null)
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null)

  // Verificar soporte de permisos de notificación de escritorio en el navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // 1. Filtrado de transacciones pendientes (APPROVED y corplex_settled: false)
  const pendingTransactions = useMemo(() => {
    return transactions.filter(t => t.wompi_status === 'APPROVED' && !t.corplex_settled)
  }, [transactions])

  // 2. Cálculo en tiempo real de saldo acumulado CORPLEX con subtotales por categoría
  const { 
    saldoAcumuladoCorplex, 
    totalRecaudadoBruto, 
    totalMargenADE, 
    matriculasCount, 
    matriculasGross,
    matriculasCorplex,
    mensualidadesCount, 
    mensualidadesGross,
    mensualidadesCorplex,
    digitalCount,
    digitalGross,
    digitalCorplex
  } = useMemo(() => {
    let corplexSum = 0
    let grossSum = 0
    let adeSum = 0
    let matCount = 0
    let matGross = 0
    let matCorplex = 0
    let mensCount = 0
    let mensGross = 0
    let mensCorplex = 0
    let digCount = 0
    let digGross = 0
    let digCorplex = 0

    pendingTransactions.forEach(t => {
      grossSum += t.amount_cop
      corplexSum += t.corplex_commission_cop
      adeSum += t.american_dream_net_cop

      if (t.concept_type === 'matricula') {
        matCount++
        matGross += t.amount_cop
        matCorplex += t.corplex_commission_cop
      } else if (t.concept_type === 'mensualidad') {
        mensCount++
        mensGross += t.amount_cop
        mensCorplex += t.corplex_commission_cop
      } else if (t.concept_type === 'digital') {
        digCount++
        digGross += t.amount_cop
        digCorplex += t.corplex_commission_cop
      }
    })

    return {
      saldoAcumuladoCorplex: corplexSum,
      totalRecaudadoBruto: grossSum,
      totalMargenADE: adeSum,
      matriculasCount: matCount,
      matriculasGross: matGross,
      matriculasCorplex: matCorplex,
      mensualidadesCount: mensCount,
      mensualidadesGross: mensGross,
      mensualidadesCorplex: mensCorplex,
      digitalCount: digCount,
      digitalGross: digGross,
      digitalCorplex: digCorplex
    }
  }, [pendingTransactions])

  // Filtrado de la tabla de soporte
  const filteredPendingList = useMemo(() => {
    return pendingTransactions.filter(t => {
      const matchSearch = 
        t.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.wompi_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.student_doc && t.student_doc.includes(searchTerm))

      const matchConcept = filterConcept === 'all' || t.concept_type === filterConcept

      return matchSearch && matchConcept
    })
  }, [pendingTransactions, searchTerm, filterConcept])

  // Formateador de moneda colombiana
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  // 🔔 SINTETIZADOR DE AUDIO: Sonido de caja registradora / recaudo aprobado ("Cha-Ching")
  const playCashRegisterSound = () => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime

      // Tono 1: Campana armónica alta (987.77 Hz - B5)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(987.77, now)
      gain1.gain.setValueAtTime(0.32, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.55)

      // Tono 2: Resonancia de caja metálica (1318.51 Hz - E6)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(1318.51, now + 0.07)
      gain2.gain.setValueAtTime(0, now)
      gain2.gain.setValueAtTime(0.38, now + 0.07)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.07)
      osc2.stop(now + 0.8)

      // Tono 3: Chispa metálica "Cha-Ching" (2637 Hz - E7)
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.type = 'sine'
      osc3.frequency.setValueAtTime(2637.02, now + 0.13)
      gain3.gain.setValueAtTime(0, now)
      gain3.gain.setValueAtTime(0.28, now + 0.13)
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 1.1)
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.start(now + 0.13)
      osc3.stop(now + 1.1)
    } catch (e) {
      console.warn('AudioContext bloqueado o no permitido:', e)
    }
  }

  // 💬 NOTIFICACIÓN DE ESCRITORIO NATIVA (Globito de Windows / Mac)
  const triggerDesktopNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'wompi-recaudo'
        })
      } catch (e) {
        console.warn('Error al disparar notificación de escritorio:', e)
      }
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        setNotificationPermission(perm)
        if (perm === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          })
        }
      })
    }
  }

  // Solicitar permiso de notificaciones de escritorio explícitamente
  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      setNotificationPermission(perm)
      if (perm === 'granted') {
        playCashRegisterSound()
        triggerDesktopNotification(
          '🔔 ¡Alertas de Escritorio Activadas!',
          'Recibirás un globito y sonido en tu computadora cada vez que entre un nuevo recaudo por Wompi.'
        )
      }
    }
  }

  // ⚡ SIMULAR RECAUDO EN TIEMPO REAL (Para verificar en vivo sonido, globito y suma)
  const handleSimulatePayment = () => {
    playCashRegisterSound()

    const randomId = Math.floor(100000 + Math.random() * 900000)
    const isMatricula = Math.random() > 0.4
    const simulatedTx: TransactionItem = isMatricula ? {
      id: `tx-sim-${Date.now()}`,
      student_name: 'Camila Osorio Restrepo',
      student_email: 'camila.osorio@gmail.com',
      student_doc: '1.045.928.110',
      concept_type: 'matricula',
      concept_name: 'Matrícula Oficial y Reserva de Cupo (2026-I)',
      wompi_reference: `WOMPI-ADE-${randomId}`,
      wompi_status: 'APPROVED',
      amount_cop: 50000,
      corplex_percentage: 0.50,
      corplex_commission_cop: 25000,
      american_dream_net_cop: 25000,
      corplex_settled: false,
      created_at: new Date().toISOString()
    } : {
      id: `tx-sim-${Date.now()}`,
      student_name: 'Carlos Mario Gómez',
      student_email: 'carlos.gomez@gmail.com',
      student_doc: '1.039.441.820',
      concept_type: 'mensualidad',
      concept_name: 'Mensualidad Programa Jóvenes y Adultos',
      wompi_reference: `WOMPI-ADE-${randomId}`,
      wompi_status: 'APPROVED',
      amount_cop: 200000,
      corplex_percentage: 0.10,
      corplex_commission_cop: 20000,
      american_dream_net_cop: 180000,
      corplex_settled: false,
      created_at: new Date().toISOString()
    }

    setTransactions(prev => [simulatedTx, ...prev])

    // Disparar globito en la computadora
    triggerDesktopNotification(
      '💰 ¡Nuevo Recaudo Aprobado en Wompi!',
      `${simulatedTx.student_name} pagó ${formatCOP(simulatedTx.amount_cop)} (${simulatedTx.concept_type.toUpperCase()}). Giro a CORPLEX: ${formatCOP(simulatedTx.corplex_commission_cop)}`
    )

    // Mostrar toast en pantalla
    setToastMessage({
      type: 'success',
      text: `🔔 ¡Nuevo pago Wompi recibido en vivo! ${simulatedTx.student_name} pagó ${formatCOP(simulatedTx.amount_cop)}. Se sumaron ${formatCOP(simulatedTx.corplex_commission_cop)} a CORPLEX.`
    })

    setTimeout(() => setToastMessage(null), 6000)
  }

  // 📥 DESCARGAR REPORTE CONTABLE EN FORMATO CSV
  const handleDownloadCSV = () => {
    const headers = ['ID Transaccion', 'Fecha', 'Ref Wompi', 'Estudiante', 'Documento', 'Concepto', 'Valor Bruto COP', '% Comision CORPLEX', 'Giro CORPLEX COP', 'Margen ADE COP', 'Estado']
    const rows = transactions.map(t => [
      t.id,
      new Date(t.created_at).toISOString().split('T')[0],
      t.wompi_reference,
      `"${t.student_name}"`,
      t.student_doc || '',
      `"${t.concept_name}"`,
      t.amount_cop,
      `${t.corplex_percentage * 100}%`,
      t.corplex_commission_cop,
      t.american_dream_net_cop,
      t.corplex_settled ? 'LIQUIDADO' : 'PENDIENTE'
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Reporte_Recaudos_Liquidacion_CORPLEX_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 📲 COMPARTIR RESUMEN POR WHATSAPP
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏛️ *ESTADO FINANCIERO OFICIAL DE RECAUDOS Y LIQUIDACIÓN*\n` +
      `*AMERICAN DREAM ENGLISH & CORPLEX SOLUTIONS S.A.S.*\n` +
      `_Resolución 2471 · NIT 902.061.373-5_\n\n` +
      `📅 *Fecha de Corte:* ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}\n` +
      `💰 *Saldo Acumulado por Girar a CORPLEX:* ${formatCOP(saldoAcumuladoCorplex)}\n` +
      `📊 *Recaudo Bruto Wompi (100%):* ${formatCOP(totalRecaudadoBruto)}\n` +
      `🏛️ *Margen Institucional ADE (79.7%):* ${formatCOP(totalMargenADE)}\n` +
      `📦 *Transacciones Procesadas:* ${pendingTransactions.length} pagos aprobados\n\n` +
      `*DESGLOSE POR CLÁUSULA TECNOLÓGICA:*\n` +
      `• Matrículas (50% CORPLEX): ${matriculasCount} registradas -> ${formatCOP(matriculasCorplex)}\n` +
      `• Mensualidades (10% Servidores): ${mensualidadesCount} registradas -> ${formatCOP(mensualidadesCorplex)}\n` +
      `• Infoproductos (10% CDN): ${digitalCount} registradas -> ${formatCOP(digitalCorplex)}\n\n` +
      `🔗 *Auditoría en Línea:* https://americandreamenglish.com/admin/liquidaciones\n` +
      `_Documento confidencial con validez contable._`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  // Copiar plantilla de correo
  const handleCopyEmailTemplate = () => {
    const text = 
      `Asunto: Reporte Oficial de Recaudos y Liquidación Tecnológica - American Dream & CORPLEX SOLUTIONS S.A.S.\n\n` +
      `Estimado equipo directivo y financiero,\n\n` +
      `Adjuntamos el informe de auditoría contable correspondiente al corte de pasarela Wompi:\n\n` +
      `• Saldo pendiente por transferir a CORPLEX: ${formatCOP(saldoAcumuladoCorplex)}\n` +
      `• Recaudo Bruto Total Wompi: ${formatCOP(totalRecaudadoBruto)}\n` +
      `• Margen Institucional Retenido ADE: ${formatCOP(totalMargenADE)}\n` +
      `• Cantidad de transacciones en corte: ${pendingTransactions.length}\n\n` +
      `Cuenta Receptora: Bancolombia NIT 902.061.373-5 (CORPLEX SOLUTIONS S.A.S.)\n` +
      `El acta oficial y soporte de dispersión se encuentran auditados en plataforma.\n\n` +
      `Atentamente,\nDirección Académica y Administrativa\nAmerican Dream English`

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setToastMessage({ type: 'info', text: '✓ Plantilla de correo formal copiada al portapapeles.' })
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  // Copiar al portapapeles con feedback suave
  const handleCopyText = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedRefId(id)
      setTimeout(() => setCopiedRefId(null), 2000)
    }
  }

  // Sincronizar Wompi
  const handleSyncWompi = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      playCashRegisterSound()
      setToastMessage({
        type: 'info',
        text: `✓ Pasarela Wompi sincronizada exitosamente: ${pendingTransactions.length} transacciones validadas en tiempo real.`
      })
      setTimeout(() => setToastMessage(null), 4500)
    }, 650)
  }

  // 3. Flujo de Ejecución de Liquidación
  const handleConfirmSettlement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pendingTransactions.length === 0) return

    setIsProcessingSettlement(true)

    try {
      const newSettlementId = `SETTLE-2026-00${settlementHistory.length + 1}`
      const newRecord: SettlementRecord = {
        id: newSettlementId,
        period_label: `Corte de Liquidación · ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        settled_at: new Date().toISOString(),
        transactions_count: pendingTransactions.length,
        total_gross_cop: totalRecaudadoBruto,
        total_corplex_payout_cop: saldoAcumuladoCorplex,
        total_american_dream_cop: totalMargenADE,
        bank_reference: bankRefInput.trim() || `TR-BANC-${Date.now().toString().slice(-7)}`,
        payment_method: 'Transferencia Bancolombia (Cuenta Oficial)',
        authorized_by: 'Anthony Zapata (Director Académico)',
        notes: notesInput.trim() || 'Liquidación ejecutada y transferida conforme al acuerdo tecnológico.',
        status: 'COMPLETED'
      }

      setTransactions(prev => prev.map(t => ({
        ...t,
        corplex_settled: true,
        settlement_id: newSettlementId
      })))

      setSettlementHistory(prev => [newRecord, ...prev])

      setIsModalOpen(false)
      setBankRefInput('')
      setNotesInput('')
      
      playCashRegisterSound()
      triggerDesktopNotification(
        '✅ ¡Liquidación a CORPLEX Completada!',
        `Se ejecutó el corte ${newSettlementId} por valor de ${formatCOP(saldoAcumuladoCorplex)}. Saldo reseteado a $0 COP.`
      )

      setToastMessage({
        type: 'success',
        text: `¡Corte de liquidación ${newSettlementId} ejecutado exitosamente! Se giró ${formatCOP(saldoAcumuladoCorplex)} a CORPLEX SOLUTIONS S.A.S. El saldo pendiente quedó en $0 COP.`
      })

      // Abrir automáticamente el acta oficial generada
      setSelectedSettlementForActa(newRecord)

      setTimeout(() => {
        setToastMessage(null)
      }, 7000)

    } catch (err: any) {
      alert('Ocurrió un error al procesar la liquidación.')
    } finally {
      setIsProcessingSettlement(false)
    }
  }

  return (
    <DashboardLayout currentRole="admin" activeTab="liquidaciones">
      <div className="space-y-8 font-sans pb-16">
        
        {/* CABECERA PRINCIPAL & METADATOS DE LA ALIANZA */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Alianza Tecnológica · CORPLEX SOLUTIONS S.A.S. (NIT 902.061.373-5)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 flex-wrap">
              <span>Informe de Ingresos y Liquidación CORPLEX</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                v2.8 Live Engine
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-3xl">
              Control automatizado de recaudos por pasarela Wompi Colombia, comisiones operativas por ingeniería y actas contables descargables e imprimibles.
            </p>
          </div>

          {/* Botones de Cabecera con animaciones */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Botón Reporte Espectacular */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsExecutiveReportOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-black text-white bg-gradient-to-r from-[#002B49] to-[#0A1A2F] hover:from-[#001728] hover:to-[#002B49] border border-slate-700 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              title="Abrir reporte ejecutivo para imprimir, descargar o enviar"
            >
              <FileText className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              <span>Generar Reporte Oficial</span>
            </motion.button>

            {/* Botón Sincronizar Wompi */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSyncWompi}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Consultar transacciones recientes en Wompi API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Sincronizando...' : 'Sincronizar Wompi'}</span>
            </motion.button>

            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>Panel General</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* BARRA DE HERRAMIENTAS: NOTIFICACIONES DE ESCRITORIO, AUDIO & SIMULADOR EN VIVO */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 text-white rounded-2xl p-3.5 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md border border-slate-800 text-xs"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Motor de Recaudos Wompi Activo</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300">
              Alertas automáticas en tiempo real con globito de escritorio y timbre sonoro
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Permiso de Notificaciones de Escritorio */}
            <button
              onClick={handleRequestNotificationPermission}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Activar notificaciones en la esquina de tu computadora"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{notificationPermission === 'granted' ? 'Alertas Escritorio: Activas' : 'Activar Globito Escritorio'}</span>
            </button>

            {/* Toggle de Sonido */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playCashRegisterSound()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 cursor-pointer"
              title={soundEnabled ? 'Silenciar sonido de recaudos' : 'Activar sonido de recaudos'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{soundEnabled ? 'Sonido: Activado' : 'Sonido: Mudo'}</span>
            </button>

            {/* Probar Sonido */}
            <button
              onClick={playCashRegisterSound}
              className="px-2.5 py-1.5 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
              title="Probar sonido de caja registradora"
            >
              Probar Timbre
            </button>

            {/* Simular Recaudo Wompi */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSimulatePayment}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
              title="Simular un pago entrante por Wompi para verificar el sonido, el globito y la actualización contable"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simular Pago Wompi</span>
            </motion.button>
          </div>
        </motion.div>

        {/* TOAST DE NOTIFICACIÓN ANIMADO */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xl border ${
                toastMessage.type === 'success'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="leading-snug">{toastMessage.text}</p>
              </div>
              <button 
                onClick={() => setToastMessage(null)} 
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* 1. HERO CARD: BOLSA DE LIQUIDACIÓN OPERATIVA EN TIEMPO REAL */}
        {/* ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-gradient-to-br from-[#001728] via-[#002B49] to-[#0A1A2F] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-700/80 relative overflow-hidden"
        >
          {/* Auras y luces de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Lado Izquierdo: Saldo e Información Ejecutiva */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Liquidación Operativa en Tiempo Real
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Convenio Tecnológico Vigente
                </span>
              </div>

              <div>
                <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider block">
                  Saldo Pendiente por Liquidar a CORPLEX:
                </span>
                <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight tabular-nums drop-shadow-sm">
                    {formatCOP(saldoAcumuladoCorplex)}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    COP Pendientes
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Por concepto de ingeniería de software, arquitectura web y mantenimiento del Campus Virtual.</span>
                </p>
              </div>

              {/* 3 Métricas Financieras con contraste elevado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md shadow-inner">
                  <span className="text-slate-400 text-[11px] block font-bold uppercase tracking-wider">Recaudo Bruto Wompi</span>
                  <span className="text-base sm:text-lg font-black text-white tabular-nums block mt-0.5">{formatCOP(totalRecaudadoBruto)}</span>
                  <span className="text-[10px] text-slate-400 font-medium">100% fondos pasarela</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md shadow-inner">
                  <span className="text-slate-400 text-[11px] block font-bold uppercase tracking-wider">Margen American Dream</span>
                  <span className="text-base sm:text-lg font-black text-amber-300 tabular-nums block mt-0.5">{formatCOP(totalMargenADE)}</span>
                  <span className="text-[10px] text-amber-200/70 font-medium">79.7% retenido academia</span>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md shadow-inner">
                  <span className="text-slate-400 text-[11px] block font-bold uppercase tracking-wider">Pagos en Acumulado</span>
                  <span className="text-base sm:text-lg font-black text-emerald-300 tabular-nums block mt-0.5">{pendingTransactions.length} pagos</span>
                  <span className="text-[10px] text-emerald-200/70 font-medium">Listos para dispersión</span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Botón de Liquidación de Alto Impacto */}
            <div className="shrink-0 flex flex-col items-start lg:items-end justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                disabled={pendingTransactions.length === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transition-all text-sm group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-slate-950 stroke-[2.5] group-hover:rotate-12 transition-transform" />
                <span>Liquidar y Registrar Transferencia a CORPLEX</span>
                <ArrowRight className="w-4 h-4 ml-1 stroke-[3]" />
              </motion.button>

              <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Genera automáticamente acta de corte y comprobante oficial</span>
              </div>
            </div>

          </div>

        </motion.div>

        {/* ======================================================== */}
        {/* 2. REGLAS DE LIQUIDACIÓN FORMAL: SUB-TOTALES POR CATEGORÍA */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* MATRÍCULAS NUEVAS (50%) */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Matrículas Nuevas</span>
              </div>
              <span className="text-xs font-black text-rose-800 bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-full">
                50% CORPLEX
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {matriculasCount} registradas
              </div>
              <div className="text-sm font-bold text-rose-600 mt-0.5">
                Giro CORPLEX: {formatCOP(matriculasCorplex)}
              </div>
              <div className="text-[11px] text-slate-400">
                Recaudado Wompi: {formatCOP(matriculasGross)}
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${saldoAcumuladoCorplex > 0 ? (matriculasCorplex / saldoAcumuladoCorplex) * 100 : 0}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              <strong>Fórmula acordada:</strong> 50% de cada matrícula ($50.000 COP) = $25.000 COP / estudiante para cubrir ingeniería y alta de alumno en el campus.
            </p>
          </motion.div>

          {/* MENSUALIDADES RECURRENTES (10%) */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Mensualidades Recurrentes</span>
              </div>
              <span className="text-xs font-black text-blue-800 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
                10% CORPLEX
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {mensualidadesCount} registradas
              </div>
              <div className="text-sm font-bold text-blue-600 mt-0.5">
                Giro CORPLEX: {formatCOP(mensualidadesCorplex)}
              </div>
              <div className="text-[11px] text-slate-400">
                Recaudado Wompi: {formatCOP(mensualidadesGross)}
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${saldoAcumuladoCorplex > 0 ? (mensualidadesCorplex / saldoAcumuladoCorplex) * 100 : 0}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              <strong>Fórmula acordada:</strong> 10% mensual sobre mensualidades regulares de niños y adultos para mantenimiento y disponibilidad de servidores Teams.
            </p>
          </motion.div>

          {/* PRODUCTOS DIGITALES (10%) */}
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Productos Digitales</span>
              </div>
              <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                10% CORPLEX
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {digitalCount} registradas
              </div>
              <div className="text-sm font-bold text-amber-600 mt-0.5">
                Giro CORPLEX: {formatCOP(digitalCorplex)}
              </div>
              <div className="text-[11px] text-slate-400">
                Recaudado Wompi: {formatCOP(digitalGross)}
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${saldoAcumuladoCorplex > 0 ? (digitalCorplex / saldoAcumuladoCorplex) * 100 : 0}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              <strong>Fórmula acordada:</strong> 10% sobre ventas de talleres, masterclasses y e-books en la tienda virtual por infraestructura de almacenamiento y CDN.
            </p>
          </motion.div>

        </div>

        {/* ======================================================== */}
        {/* 3. PESTAÑAS: PAGOS PENDIENTES, HISTÓRICO Y ACUERDO        */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header de pestañas y herramientas de filtrado */}
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('pendientes')}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'pendientes'
                    ? 'bg-[#002B49] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pagos en Acumulado Actual ({pendingTransactions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('historico')}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'historico'
                    ? 'bg-[#002B49] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Historial de Cortes Realizados ({settlementHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('acuerdo')}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'acuerdo'
                    ? 'bg-[#002B49] text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Marco del Convenio</span>
              </button>
            </div>

            {activeTab === 'pendientes' && (
              <div className="flex flex-wrap items-center gap-3">
                {/* Buscador */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar alumno, ID o ref..."
                    className="w-full text-xs pl-8 pr-7 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] focus:outline-none shadow-2xs font-medium"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtro de Concepto */}
                <select
                  value={filterConcept}
                  onChange={(e: any) => setFilterConcept(e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-700 shadow-2xs focus:ring-2 focus:ring-[#002B49] focus:outline-none cursor-pointer"
                >
                  <option value="all">Todos los Conceptos</option>
                  <option value="matricula">Solo Matrículas (50% CORPLEX)</option>
                  <option value="mensualidad">Solo Mensualidades (10% CORPLEX)</option>
                  <option value="digital">Solo Infoproductos (10% CORPLEX)</option>
                </select>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* TAB 1: TABLA DE SOPORTE DE PAGOS EN ACUMULADO           */}
          {/* ======================================================== */}
          {activeTab === 'pendientes' && (
            <div className="overflow-x-auto">
              {filteredPendingList.length === 0 ? (
                <div className="p-16 text-center text-slate-500 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">
                    No hay transacciones pendientes por liquidar
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Todos los pagos aprobados en Wompi han sido liquidados y transferidos a CORPLEX SOLUTIONS S.A.S. El saldo actual está en ceros ($0 COP).
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Fecha & Ref Wompi</th>
                      <th className="py-3.5 px-4">Estudiante / Documento</th>
                      <th className="py-3.5 px-4">Concepto Liquidado</th>
                      <th className="py-3.5 px-4 text-right">Valor Bruto</th>
                      <th className="py-3.5 px-4 text-center">% CORPLEX</th>
                      <th className="py-3.5 px-4 text-right bg-emerald-50/60 font-black text-emerald-900 border-x border-emerald-100">
                        Giro CORPLEX
                      </th>
                      <th className="py-3.5 px-4 text-right">Margen ADE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPendingList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/90 transition-colors">
                        
                        {/* Fecha & Ref */}
                        <td className="py-4 px-4 font-mono">
                          <div className="font-extrabold text-slate-900 text-xs">
                            {new Date(tx.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {tx.wompi_reference}
                            </span>
                            <button
                              onClick={() => handleCopyText(tx.wompi_reference, tx.id)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              title="Copiar referencia"
                            >
                              {copiedRefId === tx.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Estudiante */}
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-xs">
                            {tx.student_name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {tx.student_doc ? `C.C. ${tx.student_doc}` : tx.student_email}
                          </div>
                        </td>

                        {/* Concepto */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 ${
                            tx.concept_type === 'matricula' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : tx.concept_type === 'mensualidad'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {tx.concept_type === 'matricula' ? 'Matrícula' : tx.concept_type === 'mensualidad' ? 'Mensualidad' : 'Digital'}
                          </span>
                          <p className="text-xs font-semibold text-slate-700 leading-snug">
                            {tx.concept_name}
                          </p>
                        </td>

                        {/* Valor Bruto */}
                        <td className="py-4 px-4 text-right font-extrabold text-slate-900 tabular-nums text-xs">
                          {formatCOP(tx.amount_cop)}
                        </td>

                        {/* % Comisión */}
                        <td className="py-4 px-4 text-center">
                          <span className="font-black text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] tabular-nums">
                            {tx.corplex_percentage * 100}%
                          </span>
                        </td>

                        {/* Giro CORPLEX */}
                        <td className="py-4 px-4 text-right font-black text-emerald-700 bg-emerald-50/60 border-x border-emerald-100 text-sm tabular-nums">
                          {formatCOP(tx.corplex_commission_cop)}
                        </td>

                        {/* Margen American Dream */}
                        <td className="py-4 px-4 text-right font-bold text-slate-600 tabular-nums text-xs">
                          {formatCOP(tx.american_dream_net_cop)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/90 font-black text-xs text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="py-4 px-4 uppercase text-slate-700 tracking-wider">
                        Total Liquidable Acumulado ({filteredPendingList.length} transacciones)
                      </td>
                      <td className="py-4 px-4 text-right text-slate-900 tabular-nums">
                        {formatCOP(totalRecaudadoBruto)}
                      </td>
                      <td></td>
                      <td className="py-4 px-4 text-right text-emerald-800 bg-emerald-100/80 border-x border-emerald-200 text-sm font-black tabular-nums">
                        {formatCOP(saldoAcumuladoCorplex)}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-800 tabular-nums">
                        {formatCOP(totalMargenADE)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: HISTORIAL DE CORTES DE LIQUIDACIÓN                */}
          {/* ======================================================== */}
          {activeTab === 'historico' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ID de Corte / Periodo</th>
                    <th className="py-3.5 px-4">Fecha de Cierre</th>
                    <th className="py-3.5 px-4 text-center">Transacciones</th>
                    <th className="py-3.5 px-4 text-right">Recaudo Bruto</th>
                    <th className="py-3.5 px-4 text-right bg-emerald-50/60 font-black text-emerald-900 border-x border-emerald-100">
                      Giro a CORPLEX
                    </th>
                    <th className="py-3.5 px-4">Referencia Bancaria</th>
                    <th className="py-3.5 px-4 text-center">Estado</th>
                    <th className="py-3.5 px-4 text-right">Comprobante Oficial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlementHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono font-black text-[#002B49] text-xs">
                          {s.id}
                        </div>
                        <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">
                          {s.period_label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {new Date(s.settled_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-mono">
                          {s.transactions_count} pagos
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-slate-700 tabular-nums">
                        {formatCOP(s.total_gross_cop)}
                      </td>

                      <td className="py-4 px-4 text-right font-black text-emerald-700 bg-emerald-50/60 border-x border-emerald-100 text-sm tabular-nums">
                        {formatCOP(s.total_corplex_payout_cop)}
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-slate-800">
                        <div className="font-bold flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-blue-600" />
                          <span>{s.bank_reference}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{s.payment_method}</span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Conciliado</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedSettlementForActa(s)}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-[#002B49] hover:text-white hover:bg-[#002B49] transition-all bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>Ver Acta Oficial</span>
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: MARCO DEL CONVENIO Y CLÁUSULAS CORPLEX            */}
          {/* ======================================================== */}
          {activeTab === 'acuerdo' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4 p-5 bg-blue-50/80 border border-blue-200 rounded-2xl">
                <ShieldCheck className="w-7 h-7 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide">
                    Convenio de Cooperación y Licenciamiento Tecnológico
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    Suscrito entre <strong>AMERICAN DREAM ENGLISH (Resolución 2471)</strong> y <strong>CORPLEX SOLUTIONS S.A.S. (NIT 902.061.373-5)</strong> para el diseño, despliegue, custodia y soporte continuo de la infraestructura digital educativa del Campus Virtual.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2 shadow-2xs">
                  <div className="text-rose-700 font-black text-sm flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Cláusula 1 · Matrículas (50%)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aplica sobre cada matrícula inicial de nuevos estudiantes ($50.000 COP). Amortiza los costos directos de desarrollo de la plataforma, integración con pasarelas de pago y configuración de usuario.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2 shadow-2xs">
                  <div className="text-blue-700 font-black text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>Cláusula 2 · Mensualidades (10%)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aplica sobre el valor neto de las pensiones y mensualidades recurrentes. Financia la disponibilidad 99.9% de servidores cloud, Teams, bases de datos Supabase y soporte técnico en vivo.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2 shadow-2xs">
                  <div className="text-amber-700 font-black text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Cláusula 3 · Infoproductos (10%)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aplica sobre productos digitales del catálogo: masterclasses, e-books y talleres especiales. Cubre costos de CDN de alta velocidad para streaming de grabaciones y almacenamiento de archivos pedagógicos.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-slate-500" />
                  <span><strong>Cuenta Bancaria Receptora:</strong> Bancolombia Ahorros / Corriente · Titular: CORPLEX SOLUTIONS S.A.S.</span>
                </div>
                <span className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 font-bold">
                  NIT: 902.061.373-5
                </span>
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL 1: EJECUTAR CORTE DE LIQUIDACIÓN                   */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
              >
                {/* Header Modal */}
                <div className="bg-gradient-to-r from-[#001728] to-[#002B49] text-white p-6 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <Receipt className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">
                        Cierre de Liquidación · CORPLEX SOLUTIONS S.A.S.
                      </h3>
                      <span className="text-xs text-emerald-300 font-bold block mt-0.5">
                        NIT 902.061.373-5 · Alianza Operativa Tecnológica
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Contenido Modal */}
                <form onSubmit={handleConfirmSettlement} className="p-6 space-y-5">
                  
                  {/* Resumen Financiero con contraste */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Transacciones a liquidar:</span>
                      <strong className="text-slate-900 font-extrabold">{pendingTransactions.length} pagos aprobados</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Recaudo Bruto Wompi (100%):</span>
                      <strong className="text-slate-900 font-extrabold tabular-nums">{formatCOP(totalRecaudadoBruto)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Margen Retenido American Dream:</span>
                      <strong className="text-amber-700 font-extrabold tabular-nums">{formatCOP(totalMargenADE)}</strong>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-black uppercase text-[#002B49]">Total Exacto a Girar a CORPLEX:</span>
                      <span className="text-xl font-black text-emerald-600 tabular-nums">{formatCOP(saldoAcumuladoCorplex)}</span>
                    </div>
                  </div>

                  {/* Input Comprobante Bancario */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Número de Comprobante / Referencia Bancolombia
                    </label>
                    <input
                      type="text"
                      required
                      value={bankRefInput}
                      onChange={(e) => setBankRefInput(e.target.value)}
                      placeholder="Ej. BANC-TR-2026-981240 o Comprobante ACH"
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900 font-mono font-bold focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Referencia del comprobante emitido desde la cuenta bancaria de American Dream.
                    </span>
                  </div>

                  {/* Input Notas */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Notas u Observaciones Contables (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Ej. Corte correspondiente a la primera quincena de matrículas y mensualidades."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* Botones de Acción */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      disabled={isProcessingSettlement}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessingSettlement}
                      className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {isProcessingSettlement ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                          <span>Liquidando y Reseteando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Confirmar Pago y Resetear Acumulado</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 2: REPORTE EJECUTIVO DE RECAUDOS (IMPRIMIR / DESCARGAR / ENVIAR) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isExecutiveReportOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-auto print:m-0 print:border-none print:shadow-none print:rounded-none"
              >
                {/* Barra de Controles superior (Oculta en Impresión) */}
                <div className="bg-[#002B49] text-white p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-700 print:hidden flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-400/20 rounded-xl text-amber-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-white">
                        Reporte Oficial de Recaudos y Liquidaciones
                      </h3>
                      <p className="text-[11px] text-slate-300">
                        Listo para imprimir en papel oficial, exportar en CSV o enviar a dirección financiera
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Imprimir Reporte (PDF)</span>
                    </button>

                    <button
                      onClick={handleDownloadCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar CSV</span>
                    </button>

                    <button
                      onClick={handleShareWhatsApp}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopyEmailTemplate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Correo</span>
                    </button>

                    <button
                      onClick={() => setIsExecutiveReportOpen(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* DOCUMENTO OFICIAL ELEGANTE (Apto para Impresión & Auditoría) */}
                <div className="p-8 sm:p-12 space-y-8 bg-white text-slate-800 print:p-6 print:space-y-6">
                  
                  {/* Encabezado Institucional Notarial */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-[#002B49]" />
                        <span className="text-xs font-black tracking-widest uppercase text-slate-500">
                          INSTITUCIÓN EDUCATIVA DE IDIOMAS
                        </span>
                      </div>
                      <h1 className="text-2xl font-black text-[#002B49] tracking-tight">
                        AMERICAN DREAM ENGLISH
                      </h1>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Resolución Oficial No. 2471 · Secretaría de Educación de Urabá · Colombia
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Campus Virtual Cloud · Plataforma de Aprendizaje Bilingüe
                      </p>
                    </div>

                    <div className="sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 sm:pr-4 border-emerald-600 pl-4 sm:pl-0">
                      <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        AUDITORÍA TECNOLÓGICA
                      </span>
                      <h2 className="text-lg font-black text-slate-900 mt-1">
                        CORPLEX SOLUTIONS S.A.S.
                      </h2>
                      <p className="text-xs font-mono font-bold text-slate-700">
                        NIT: 902.061.373-5
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Aliado Tecnológico & Desarrollador Oficial
                      </p>
                    </div>
                  </div>

                  {/* Título y Folio */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                        Estado Oficial de Recaudos y Liquidación Operativa
                      </h2>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Corte de dispersión de fondos conforme a la Cláusula de Desarrollo de Software
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Folio de Auditoría</span>
                      <strong className="text-sm font-black text-[#002B49]">ADE-CORPLEX-2026-Q4</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}
                      </span>
                    </div>
                  </div>

                  {/* Resumen Ejecutivo de 3 Bloques */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Total Recaudado Wompi</span>
                      <span className="text-xl font-black text-slate-900 tabular-nums block mt-1">{formatCOP(totalRecaudadoBruto)}</span>
                      <span className="text-[10px] text-slate-500">100% ingresos brutos pasarela</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-sm">
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">Giro a CORPLEX SOLUTIONS</span>
                      <span className="text-2xl font-black text-emerald-700 tabular-nums block mt-1">{formatCOP(saldoAcumuladoCorplex)}</span>
                      <span className="text-[10px] text-emerald-800 font-bold">Participación de desarrollo</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Margen American Dream</span>
                      <span className="text-xl font-black text-slate-900 tabular-nums block mt-1">{formatCOP(totalMargenADE)}</span>
                      <span className="text-[10px] text-slate-500">79.7% fondo institucional</span>
                    </div>
                  </div>

                  {/* Tabla Ítem por Ítem Conciliada */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center justify-between">
                      <span>Relación Detallada de Transacciones Auditadas:</span>
                      <span className="text-[11px] text-slate-500 font-normal">Pasarela: Wompi Colombia (Bancolombia S.A.)</span>
                    </h3>

                    <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-[#002B49] text-white font-extrabold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Fecha / Ref Wompi</th>
                          <th className="p-2.5">Estudiante Titular</th>
                          <th className="p-2.5">Concepto del Recaudo</th>
                          <th className="p-2.5 text-right">Monto Bruto</th>
                          <th className="p-2.5 text-center">% Corp</th>
                          <th className="p-2.5 text-right bg-emerald-700 text-white">Giro CORPLEX</th>
                          <th className="p-2.5 text-right">Margen ADE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {pendingTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono">
                              <span className="font-bold text-slate-800 block">
                                {new Date(tx.created_at).toLocaleDateString('es-CO')}
                              </span>
                              <span className="text-[10px] text-slate-400">{tx.wompi_reference}</span>
                            </td>
                            <td className="p-2.5">
                              <span className="font-bold text-slate-900 block">{tx.student_name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{tx.student_doc ? `C.C. ${tx.student_doc}` : tx.student_email}</span>
                            </td>
                            <td className="p-2.5 font-medium text-slate-700">
                              {tx.concept_name}
                            </td>
                            <td className="p-2.5 text-right font-bold text-slate-900 tabular-nums">
                              {formatCOP(tx.amount_cop)}
                            </td>
                            <td className="p-2.5 text-center font-bold text-emerald-700">
                              {tx.corplex_percentage * 100}%
                            </td>
                            <td className="p-2.5 text-right font-black text-emerald-800 bg-emerald-50/60 tabular-nums">
                              {formatCOP(tx.corplex_commission_cop)}
                            </td>
                            <td className="p-2.5 text-right font-medium text-slate-600 tabular-nums">
                              {formatCOP(tx.american_dream_net_cop)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100 font-black text-xs text-slate-900 border-t-2 border-slate-300">
                        <tr>
                          <td colSpan={3} className="p-3 uppercase">Total Consolidado ({pendingTransactions.length} pagos)</td>
                          <td className="p-3 text-right tabular-nums">{formatCOP(totalRecaudadoBruto)}</td>
                          <td></td>
                          <td className="p-3 text-right text-emerald-800 font-black bg-emerald-100 text-sm tabular-nums">
                            {formatCOP(saldoAcumuladoCorplex)}
                          </td>
                          <td className="p-3 text-right tabular-nums">{formatCOP(totalMargenADE)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Certificación Legal y Cuenta de Pago */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Certificación Contable:</strong> Se hace constar que los valores expuestos corresponden con fidelidad a las transacciones procesadas con estado <span className="font-mono text-emerald-700 font-bold">APPROVED</span> en la pasarela Wompi Colombia. El monto correspondiente a CORPLEX SOLUTIONS S.A.S. se transfiere a la cuenta oficial de <strong>Bancolombia NIT 902.061.373-5</strong> en cumplimiento del convenio de desarrollo y soporte del software.
                    </p>
                  </div>

                  {/* Bloque de Firmas */}
                  <div className="grid grid-cols-2 gap-12 pt-8 border-t-2 border-slate-300">
                    <div className="space-y-1">
                      <div className="h-12 border-b border-slate-400 flex items-end pb-1 font-mono text-xs font-bold text-slate-800">
                        Anthony Zapata — Director Académico
                      </div>
                      <span className="text-[11px] text-slate-500 block">Representante Legal · American Dream English</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-12 border-b border-slate-400 flex items-end pb-1 font-mono text-xs font-bold text-slate-800">
                        Dirección General de Operaciones
                      </div>
                      <span className="text-[11px] text-slate-500 block">Representante Legal · CORPLEX SOLUTIONS S.A.S.</span>
                    </div>
                  </div>

                  {/* Pie de Página */}
                  <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
                    Documento contable digital expedido en Urabá, Antioquia · Sistema American Dream Platform Enterprise
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODAL 3: CERTIFICADO HISTÓRICO: ACTA DE LIQUIDACIÓN      */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedSettlementForActa && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto print:m-0 print:border-none print:shadow-none"
              >
                {/* Header del Acta */}
                <div className="bg-[#002B49] text-white p-6 sm:p-8 relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2">
                        <Award className="w-3.5 h-3.5" />
                        <span>Comprobante Contable Digital Oficial</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        Acta de Liquidación & Dispersión de Fondos
                      </h2>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Alianza Operativa · American Dream English & CORPLEX SOLUTIONS S.A.S.
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedSettlementForActa(null)}
                      className="text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors print:hidden cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Cuerpo del Acta Imprimible */}
                <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs">
                  
                  {/* Ficha técnica del corte */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Número de Acta</span>
                      <strong className="font-mono text-sm text-[#002B49]">{selectedSettlementForActa.id}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fecha y Hora</span>
                      <strong className="text-slate-800 text-xs">{new Date(selectedSettlementForActa.settled_at).toLocaleDateString('es-CO')}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ref. Bancolombia</span>
                      <strong className="font-mono text-xs text-emerald-700">{selectedSettlementForActa.bank_reference}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Estado</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold text-xs">
                        <Check className="w-3.5 h-3.5" /> Pagado & Girado
                      </span>
                    </div>
                  </div>

                  {/* Entidades Partícipes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Institución Emisora:</span>
                      <strong className="text-slate-900 text-xs block mt-0.5">AMERICAN DREAM ENGLISH</strong>
                      <span className="text-[11px] text-slate-500">Resolución Oficial 2471 · Sede Urabá</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Beneficiario Tecnológico:</span>
                      <strong className="text-emerald-700 text-xs block mt-0.5">CORPLEX SOLUTIONS S.A.S.</strong>
                      <span className="text-[11px] text-slate-500">NIT 902.061.373-5 · Desarrollo & Operación</span>
                    </div>
                  </div>

                  {/* Desglose Financiero */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Desglose Liquidado del Periodo:
                    </h4>
                    <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Concepto</th>
                          <th className="p-2.5 text-center">Transacciones</th>
                          <th className="p-2.5 text-right">Recaudo Bruto Wompi</th>
                          <th className="p-2.5 text-right text-emerald-700 bg-emerald-50">Giro CORPLEX</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        <tr>
                          <td className="p-2.5 font-medium">{selectedSettlementForActa.period_label}</td>
                          <td className="p-2.5 text-center font-bold">{selectedSettlementForActa.transactions_count}</td>
                          <td className="p-2.5 text-right font-medium">{formatCOP(selectedSettlementForActa.total_gross_cop)}</td>
                          <td className="p-2.5 text-right font-black text-emerald-700 bg-emerald-50/50">
                            {formatCOP(selectedSettlementForActa.total_corplex_payout_cop)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50 font-black border-t border-slate-200 text-xs">
                        <tr>
                          <td colSpan={3} className="p-2.5 uppercase text-slate-700">Total Transferido a CORPLEX SOLUTIONS S.A.S.:</td>
                          <td className="p-2.5 text-right text-emerald-700 text-sm font-black bg-emerald-50">
                            {formatCOP(selectedSettlementForActa.total_corplex_payout_cop)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Observaciones contables */}
                  {selectedSettlementForActa.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                      <strong>Observación:</strong> {selectedSettlementForActa.notes}
                    </div>
                  )}

                  {/* Firmas y Sellos */}
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                    <div className="space-y-1">
                      <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-mono text-[10px] text-slate-500">
                        {selectedSettlementForActa.authorized_by}
                      </div>
                      <span className="text-[10px] text-slate-500 block">Autorizado por American Dream English</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-10 border-b border-slate-300 flex items-end pb-1 font-mono text-[10px] text-slate-500">
                        Representante Legal CORPLEX
                      </div>
                      <span className="text-[10px] text-slate-500 block">Recibido por CORPLEX SOLUTIONS S.A.S.</span>
                    </div>
                  </div>

                  {/* Botones de acción del Acta */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
                    <button
                      type="button"
                      onClick={() => setSelectedSettlementForActa(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cerrar
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-5 py-2 text-xs font-black text-white bg-[#002B49] hover:bg-[#001728] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir / Guardar PDF</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}
