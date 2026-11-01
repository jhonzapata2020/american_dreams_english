'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Clock, 
  Smartphone, 
  Monitor, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  MessageCircle, 
  Download, 
  Bell, 
  BellRing, 
  Sparkles, 
  Eye, 
  Flame, 
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Compass,
  ArrowUpRight,
  Layers,
  HelpCircle,
  Zap
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { 
  playLeadChimeSound, 
  triggerLeadDesktopNotification 
} from '../../lib/marketingTelemetry'

interface AnalyticsPayload {
  success: boolean
  isConfigured: boolean
  measurementId: string
  propertyId?: string
  period?: string
  missingCredentials?: string[]
  message?: string
  setupGuide?: {
    step1: string
    step2: string
    step3: string
  }
  analyticsData: {
    realtimeActiveUsers: number
    totalUsers: number
    totalSessions: number
    totalPageViews: number
    avgDurationSeconds: number
    conversions: number
    bounceRate: number
    topPages: Array<{ path: string; title: string; views: number; users: number }>
    acquisitionChannels: Array<{ channel: string; sessions: number; users: number }>
    devices: Array<{ category: string; users: number }>
  } | null
  leadsData: {
    source: string
    totalLeads: number
    leadsToday: number
    recentLeads: Array<{
      id: string
      first_name?: string
      last_name?: string
      email?: string
      phone?: string
      audience?: string
      created_at?: string
      status?: string
    }>
    realConversionRate?: number
  }
}

interface MarketingMetricsViewProps {
  onOpenLeadsTab?: () => void
}

export const MarketingMetricsView: React.FC<MarketingMetricsViewProps> = ({ onOpenLeadsTab }) => {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [periodFilter, setPeriodFilter] = useState<'today' | '7days' | '30days'>('7days')
  const [notificationPermission, setNotificationPermission] = useState<string>('default')
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false)

  // 1. Inicializar permisos de notificaciones de escritorio
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // 2. Cargar datos desde el endpoint seguro del servidor /api/admin/analytics
  const fetchAnalytics = async (period: 'today' | '7days' | '30days') => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const headers: HeadersInit = {}
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        headers,
        cache: 'no-store'
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.error || `Error del servidor HTTP ${res.status}`)
      }

      const result: AnalyticsPayload = await res.json()
      setData(result)
    } catch (err: any) {
      console.error('[MarketingMetricsView] Error al cargar analíticas:', err)
      setError(err.message || 'No fue posible consultar las métricas del servidor.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(periodFilter)
  }, [periodFilter])

  // Solicitar permiso de notificaciones
  const handleRequestNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones de escritorio.')
      return
    }
    const perm = await Notification.requestPermission()
    setNotificationPermission(perm)
    if (perm === 'granted') {
      playLeadChimeSound()
      triggerLeadDesktopNotification({
        name: 'Módulo de Marketing Conectado',
        phone: '+57 312 745 9728',
        audience: 'para_mi',
        source: 'marketing_permission_test'
      })
    }
  }

  // Exportar leads reales en formato CSV
  const handleExportLeadsCSV = () => {
    if (!data?.leadsData?.recentLeads?.length) {
      alert('No hay leads para exportar.')
      return
    }

    const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Audiencia', 'Fecha Registro']
    const rows = data.leadsData.recentLeads.map(l => [
      l.id,
      `"${l.first_name || ''}"`,
      `"${l.last_name || ''}"`,
      l.email || '',
      l.phone || '',
      l.audience || 'General',
      l.created_at ? new Date(l.created_at).toLocaleString('es-CO') : ''
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `leads-oficiales-ade-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Formateador de segundos a mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Analytics 4 & Supabase CRM</span>
            </span>

            {data?.isConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-mono font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>API Conectada · {data.measurementId}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-mono font-bold border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Rastreo Activo ({data?.measurementId || 'G-R8W15WYSD6'}) · API en Espera</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-red-600" />
            <span>Centro de Métricas & Inteligencia de Tráfico</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Visualiza los datos oficiales de navegación de los visitantes en la web y la tasa de conversión en prospectos matriculables.
          </p>
        </div>

        {/* ACCIONES Y FILTRO DE FECHAS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Rango de Fechas */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPeriodFilter('today')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                periodFilter === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setPeriodFilter('7days')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                periodFilter === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Días
            </button>
            <button
              type="button"
              onClick={() => setPeriodFilter('30days')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                periodFilter === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Días
            </button>
          </div>

          {/* Botón Refrescar */}
          <button
            type="button"
            onClick={() => fetchAnalytics(periodFilter)}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Botón Permisos de Notificación */}
          <button
            type="button"
            onClick={handleRequestNotifications}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              notificationPermission === 'granted'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <>
                <BellRing className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Alertas SO: Activas</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Alertas de Escritorio</span>
              </>
            )}
          </button>

          {/* Exportar CSV */}
          <button
            type="button"
            onClick={handleExportLeadsCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Leads CSV</span>
          </button>
        </div>
      </div>

      {/* ESTADO DE ERROR (SI OCURRE) */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">No se pudieron obtener las métricas:</p>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* BANNER INFORMATIVO: CUANDO FALTAN CREDENCIALES DE GOOGLE CLOUD SERVICE ACCOUNT */}
      {!loading && data && !data.isConfigured && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-400/30">
                  Rastreo Google Activo ({data.measurementId})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase border border-amber-400/30">
                  Lectura API Requiere Credencial
                </span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Google Analytics 4 está recibiendo los datos reales
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                El tag oficial de medición está instalado y funcionando. Para que este panel pueda leer y dibujar las visitas en tiempo real desde los servidores de Google, solo se requiere autorizar una Cuenta de Servicio de Google Cloud.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Ver en Google Analytics</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>¿Cómo activar la API?</span>
                {showSetupGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* GUÍA DE CONFIGURACIÓN EXPANDIBLE */}
          <AnimatePresence>
            {showSetupGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-5 border-t border-white/10 text-xs text-slate-300 space-y-3"
              >
                <p className="font-bold text-white text-sm">
                  Pasos para que este dashboard consulte Google Analytics Data API:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">1</span>
                    <h5 className="font-bold text-white">Google Cloud Console</h5>
                    <p className="text-[11px] text-slate-400">
                      Habilita <strong>Google Analytics Data API</strong> y crea una <em>Service Account</em> con clave JSON.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">2</span>
                    <h5 className="font-bold text-white">Permiso en Analytics</h5>
                    <p className="text-[11px] text-slate-400">
                      En analytics.google.com &gt; Administrar &gt; Accesos, añade el correo de la Service Account como <strong>Lector</strong>.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-black inline-flex items-center justify-center mb-1">3</span>
                    <h5 className="font-bold text-white">Variables en Vercel/.env</h5>
                    <p className="text-[11px] text-slate-400">
                      Configura <code>GA_PROPERTY_ID</code>, <code>GA_CLIENT_EMAIL</code> y <code>GA_PRIVATE_KEY</code>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SECCIÓN PRINCIPAL: MÉTRICAS DE GOOGLE ANALYTICS 4 (CUANDO ESTÁ ACTIVO)  */}
      {/* ========================================================================= */}
      {data?.isConfigured && data.analyticsData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Tráfico Oficial Google Analytics 4 ({periodFilter.toUpperCase()})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Propiedad ID: {data.propertyId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* KPI 1: Usuarios Activos en Tiempo Real */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Tiempo Real</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {data.analyticsData.realtimeActiveUsers}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Usuarios activos últimos 30 min
              </p>
            </div>

            {/* KPI 2: Total Usuarios Únicos */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Visitantes Únicos</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {data.analyticsData.totalUsers.toLocaleString('es-CO')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Personas que navegaron la web
              </p>
            </div>

            {/* KPI 3: Sesiones */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Sesiones</span>
                <Eye className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {data.analyticsData.totalSessions.toLocaleString('es-CO')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Visitas completas registradas
              </p>
            </div>

            {/* KPI 4: Vistas de Página */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Vistas de Página</span>
                <FileText className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {data.analyticsData.totalPageViews.toLocaleString('es-CO')}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Pantallas vistas en total
              </p>
            </div>

            {/* KPI 5: Duración Promedio */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Tiempo Promedio</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatDuration(data.analyticsData.avgDurationSeconds)}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Retención de sesión
              </p>
            </div>
          </div>

          {/* TABLAS DE TOP PÁGINAS Y CANALES DE ADQUISICIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Páginas */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Páginas Más Visitadas (Google Analytics)</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-bold uppercase">Vistas</span>
              </div>

              <div className="space-y-2.5">
                {data.analyticsData.topPages.length > 0 ? (
                  data.analyticsData.topPages.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-xs">
                      <div className="min-w-0 pr-3">
                        <p className="font-bold text-slate-900 truncate">{page.title || page.path}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{page.path}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 text-sm">{page.views.toLocaleString('es-CO')}</span>
                        <span className="text-[10px] text-slate-400 block">{page.users} usuarios</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Sin datos de páginas en este período.</p>
                )}
              </div>
            </div>

            {/* Canales de Adquisición */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Canales de Tráfico (Adquisición)</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-bold uppercase">Sesiones</span>
              </div>

              <div className="space-y-2.5">
                {data.analyticsData.acquisitionChannels.length > 0 ? (
                  data.analyticsData.acquisitionChannels.map((ch, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-xs">
                      <div className="font-bold text-slate-900">
                        <span>{ch.channel}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 text-sm">{ch.sessions.toLocaleString('es-CO')}</span>
                        <span className="text-[10px] text-slate-400 block">{ch.users} usuarios</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Sin datos de canales en este período.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECCIÓN INDEPENDIENTE: LEADS REALES DE SUPABASE (100% DATOS AUTÉNTICOS) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CRM Oficial Supabase
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Registro verificado en base de datos
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <span>Prospectos Registrados (Leads Reales)</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onOpenLeadsTab}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Pipeline Completo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tarjetas Resumen de Leads */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Leads Históricos
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
              {data?.leadsData?.totalLeads || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Personas interesadas en matricularse
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Leads Capturados Hoy
            </span>
            <span className="text-3xl font-black text-emerald-600 tracking-tight mt-1 block">
              {data?.leadsData?.leadsToday || 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Nuevos contactos en las últimas 24 horas
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tasa de Conversión Real
            </span>
            <span className="text-3xl font-black text-blue-600 tracking-tight mt-1 block">
              {data?.leadsData?.realConversionRate ? `${data.leadsData.realConversionRate}%` : (data?.isConfigured ? '0%' : 'En espera de GA4')}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Leads frente a visitantes únicos de GA4
            </span>
          </div>
        </div>

        {/* Listado de Últimos Leads Reales */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Últimos Contactos Registrados en la Plataforma:
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
            {data?.leadsData?.recentLeads && data.leadsData.recentLeads.length > 0 ? (
              data.leadsData.recentLeads.slice(0, 6).map((lead) => {
                const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Prospecto'
                const phoneClean = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : ''
                const dateStr = lead.created_at ? new Date(lead.created_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'Reciente'

                return (
                  <div key={lead.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-slate-900 text-xs truncate">{fullName}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.audience === 'para_mi_hijo'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {lead.audience === 'para_mi_hijo' ? 'Niños & Teens' : 'Jóvenes / Adulto'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                          {lead.email || 'Sin correo'} · {lead.phone || 'Sin cel'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono">{dateStr}</span>
                      {phoneClean && (
                        <a
                          href={`https://wa.me/57${phoneClean.startsWith('57') ? phoneClean.slice(2) : phoneClean}?text=${encodeURIComponent(`Hola ${fullName}, te contactamos de American Dream English para asesorarte en tu programa de inglés.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay prospectos registrados aún en la base de datos.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
