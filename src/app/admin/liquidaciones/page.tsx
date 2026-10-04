'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
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
  Calendar
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

// Datos iniciales demostrativos de transacciones Wompi aprobadas
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

// Histórico inicial de liquidaciones anteriores
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
  const [activeTab, setActiveTab] = useState<'pendientes' | 'historico'>('pendientes')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterConcept, setFilterConcept] = useState<'all' | 'matricula' | 'mensualidad' | 'digital'>('all')

  // Estado del Modal de Liquidación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bankRefInput, setBankRefInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [isProcessingSettlement, setIsProcessingSettlement] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null)

  // 1. Filtrado de transacciones pendientes (APPROVED y corplex_settled: false)
  const pendingTransactions = useMemo(() => {
    return transactions.filter(t => t.wompi_status === 'APPROVED' && !t.corplex_settled)
  }, [transactions])

  // 2. Cálculo en tiempo real de saldo acumulado CORPLEX
  const { saldoAcumuladoCorplex, totalRecaudadoBruto, totalMargenADE, matriculasCount, mensualidadesCount, digitalCount } = useMemo(() => {
    let corplexSum = 0
    let grossSum = 0
    let adeSum = 0
    let matCount = 0
    let mensCount = 0
    let digCount = 0

    pendingTransactions.forEach(t => {
      grossSum += t.amount_cop
      corplexSum += t.corplex_commission_cop
      adeSum += t.american_dream_net_cop

      if (t.concept_type === 'matricula') matCount++
      else if (t.concept_type === 'mensualidad') mensCount++
      else if (t.concept_type === 'digital') digCount++
    })

    return {
      saldoAcumuladoCorplex: corplexSum,
      totalRecaudadoBruto: grossSum,
      totalMargenADE: adeSum,
      matriculasCount: matCount,
      mensualidadesCount: mensCount,
      digitalCount: digCount
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

  // 3. Flujo de Ejecución de Liquidación
  const handleConfirmSettlement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pendingTransactions.length === 0) return

    setIsProcessingSettlement(true)

    try {
      // Simular / Ejecutar registro en Supabase
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
        notes: notesInput.trim() || 'Liquidación ejecutada y transferida satisfactoriamente.',
        status: 'COMPLETED'
      }

      // Marcar transacciones pendientes como liquidadas
      setTransactions(prev => prev.map(t => ({
        ...t,
        corplex_settled: true,
        settlement_id: newSettlementId
      })))

      // Agregar al histórico
      setSettlementHistory(prev => [newRecord, ...prev])

      setIsModalOpen(false)
      setBankRefInput('')
      setNotesInput('')
      
      setToastMessage({
        type: 'success',
        text: `¡Corte de liquidación ${newSettlementId} ejecutado exitosamente! Se giró ${formatCOP(saldoAcumuladoCorplex)} a CORPLEX SOLUTIONS S.A.S. El saldo pendiente quedó en $0 COP.`
      })

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
      <div className="space-y-8 font-sans pb-12">
        
        {/* CABECERA PRINCIPAL & METADATOS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-crimson-600" />
              <span>Alianza Tecnológica · CORPLEX SOLUTIONS S.A.S. (NIT 902.061.373-5)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Informe de Ingresos y Liquidación CORPLEX
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Control de ingresos Wompi Colombia, comisiones operativas y cortes de dispersión de fondos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 500)
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-xl shadow-2xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
              <span>Sincronizar Wompi</span>
            </button>

            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <span>Panel Principal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TOAST DE NOTIFICACIÓN */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-md animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{toastMessage.text}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. BANNER DESTACADO DE SALDO PENDIENTE CORPLEX           */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#002B49] via-[#0A1A2F] to-[#0F1C2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          
          {/* Decoración luminosa */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Lado Izquierdo: Saldo e Información */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Liquidación Operativa en Tiempo Real</span>
              </div>

              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider block">
                  Saldo Pendiente por Liquidar a CORPLEX:
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-1">
                  {formatCOP(saldoAcumuladoCorplex)}
                  <span className="text-xs sm:text-sm font-semibold text-emerald-400 ml-2">COP</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-slate-400 text-[11px] block font-medium">Recaudo Bruto Wompi</span>
                  <span className="text-sm font-extrabold text-white">{formatCOP(totalRecaudadoBruto)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <span className="text-slate-400 text-[11px] block font-medium">Margen American Dream</span>
                  <span className="text-sm font-extrabold text-amber-300">{formatCOP(totalMargenADE)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[11px] block font-medium">Pagos Pendientes</span>
                  <span className="text-sm font-extrabold text-emerald-300">{pendingTransactions.length} transacciones</span>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Botón de Liquidación */}
            <div className="shrink-0 flex flex-col items-start lg:items-end justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={pendingTransactions.length === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-sm group disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                <CreditCard className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
                <span>Liquidar y Registrar Transferencia a CORPLEX</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Genera acta de corte y comprobante contable digital</span>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* REGLAS DE LIQUIDACIÓN FORMAL (TARJETAS INFORMATIVAS)     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Matrículas Nuevas</span>
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">50% CORPLEX</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {matriculasCount} registradas
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Fórmula: Total Matrícula ($50.000 COP) * 0.50 = $25.000 COP / alumno.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Mensualidades Recurrentes</span>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">10% CORPLEX</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {mensualidadesCount} registradas
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Fórmula: Mensualidad Niños/Adultos * 0.10 de mantenimiento de plataforma.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Productos Digitales</span>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">10% CORPLEX</span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {digitalCount} registradas
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Fórmula: Masterclasses, Talleres y E-books * 0.10 de infraestructura.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PESTAÑAS: PAGOS PENDIENTES vs HISTÓRICO DE CORTES        */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header de pestañas y filtros */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('pendientes')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === 'pendientes'
                    ? 'bg-[#002B49] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pagos en Acumulado Actual ({pendingTransactions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('historico')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                  activeTab === 'historico'
                    ? 'bg-[#002B49] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Historial de Cortes Realizados ({settlementHistory.length})</span>
              </button>
            </div>

            {activeTab === 'pendientes' && (
              <div className="flex flex-wrap items-center gap-3">
                {/* Buscador */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar alumno, ID o ref..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#002B49]"
                  />
                </div>

                {/* Filtro de Concepto */}
                <select
                  value={filterConcept}
                  onChange={(e: any) => setFilterConcept(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
                >
                  <option value="all">Todos los Conceptos</option>
                  <option value="matricula">Solo Matrículas (50%)</option>
                  <option value="mensualidad">Solo Mensualidades (10%)</option>
                  <option value="digital">Solo Infoproductos (10%)</option>
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
                <div className="p-12 text-center text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
                  <h3 className="text-base font-extrabold text-slate-800">
                    No hay transacciones pendientes por liquidar
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Todos los pagos aprobados en Wompi han sido liquidados y transferidos a CORPLEX.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Fecha & Ref Wompi</th>
                      <th className="py-3 px-4">Estudiante / Documento</th>
                      <th className="py-3 px-4">Concepto Liquidado</th>
                      <th className="py-3 px-4 text-right">Valor Wompi</th>
                      <th className="py-3 px-4 text-center">% Comisión</th>
                      <th className="py-3 px-4 text-right">Giro CORPLEX</th>
                      <th className="py-3 px-4 text-right">Margen ADE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPendingList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Fecha & Ref */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-800">
                            {new Date(tx.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {tx.wompi_reference}
                          </span>
                        </td>

                        {/* Estudiante */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">
                            {tx.student_name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {tx.student_doc ? `Doc: ${tx.student_doc}` : tx.student_email}
                          </div>
                        </td>

                        {/* Concepto */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1 ${
                            tx.concept_type === 'matricula' 
                              ? 'bg-rose-100 text-rose-800'
                              : tx.concept_type === 'mensualidad'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.concept_type}
                          </span>
                          <p className="text-xs font-medium text-slate-700">
                            {tx.concept_name}
                          </p>
                        </td>

                        {/* Valor Wompi */}
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          {formatCOP(tx.amount_cop)}
                        </td>

                        {/* % Comisión */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            {tx.corplex_percentage * 100}%
                          </span>
                        </td>

                        {/* Giro CORPLEX */}
                        <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                          {formatCOP(tx.corplex_commission_cop)}
                        </td>

                        {/* Margen American Dream */}
                        <td className="py-3.5 px-4 text-right font-bold text-slate-600">
                          {formatCOP(tx.american_dream_net_cop)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-black text-xs text-slate-900 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={3} className="py-3.5 px-4 uppercase text-slate-600">
                        Total Liquidado en este Corte ({filteredPendingList.length} transacciones)
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-900">
                        {formatCOP(totalRecaudadoBruto)}
                      </td>
                      <td></td>
                      <td className="py-3.5 px-4 text-right text-emerald-600 text-sm">
                        {formatCOP(saldoAcumuladoCorplex)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-800">
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
                <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID de Corte / Periodo</th>
                    <th className="py-3 px-4">Fecha de Cierre</th>
                    <th className="py-3 px-4 text-center">Transacciones</th>
                    <th className="py-3 px-4 text-right">Recaudo Bruto</th>
                    <th className="py-3 px-4 text-right">Monto Girado a CORPLEX</th>
                    <th className="py-3 px-4">Referencia Bancaria</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlementHistory.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#002B49]">
                          {s.id}
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {s.period_label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(s.settled_at).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {s.transactions_count} pagos
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700">
                        {formatCOP(s.total_gross_cop)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm">
                        {formatCOP(s.total_corplex_payout_cop)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {s.bank_reference}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Transferido</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Descargando comprobante de liquidación ${s.id} en formato PDF...`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B49] hover:text-amber-600 transition-colors bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>Acta PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODAL: CIERRE DE LIQUIDACIÓN Y CONFIRMACIÓN              */}
        {/* ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
              
              {/* Header Modal */}
              <div className="bg-[#002B49] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Cierre de Liquidación · CORPLEX SOLUTIONS S.A.S.
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">
                      NIT 902.061.373-5 · Alianza Operativa Tecnológica
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido Modal */}
              <form onSubmit={handleConfirmSettlement} className="p-6 space-y-5">
                
                {/* Resumen Financiero */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Transacciones a liquidar:</span>
                    <strong className="text-slate-900">{pendingTransactions.length} pagos aprobados</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Recaudo Bruto Wompi:</span>
                    <strong className="text-slate-900">{formatCOP(totalRecaudadoBruto)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Margen Retenido American Dream:</span>
                    <strong className="text-amber-700">{formatCOP(totalMargenADE)}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-extrabold text-[#002B49]">Total Exacto a Girar a CORPLEX:</span>
                    <span className="text-lg font-black text-emerald-600">{formatCOP(saldoAcumuladoCorplex)}</span>
                  </div>
                </div>

                {/* Input Comprobante Bancario */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número de Comprobante / Referencia Bancolombia
                  </label>
                  <input
                    type="text"
                    required
                    value={bankRefInput}
                    onChange={(e) => setBankRefInput(e.target.value)}
                    placeholder="Ej. BANC-TR-2026-981240 o comprobante ACH"
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900 font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Referencia del comprobante emitido desde la cuenta bancaria de American Dream.
                  </span>
                </div>

                {/* Input Notas */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Notas u Observaciones Contables (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Ej. Corte correspondiente a la primera quincena de matrículas y mensualidades."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#002B49] text-slate-900"
                  />
                </div>

                {/* Botones de Acción */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    disabled={isProcessingSettlement}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessingSettlement}
                    className="px-5 py-2.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-[0.98]"
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

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
