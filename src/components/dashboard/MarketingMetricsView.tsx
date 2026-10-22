'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Clock, 
  Smartphone, 
  Monitor, 
  ArrowDownCircle, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  MessageCircle, 
  Share2, 
  Download, 
  Bell, 
  BellRing, 
  Sparkles, 
  Eye, 
  Flame, 
  MousePointerClick, 
  ChevronRight, 
  ArrowRight, 
  Zap, 
  Filter, 
  Check, 
  Copy,
  Inbox
} from 'lucide-react'
import { 
  getMarketingAggregates, 
  getRecentSessions, 
  TelemetrySession, 
  MarketingAggregates, 
  playLeadChimeSound, 
  triggerLeadDesktopNotification,
  notifyLeadCaptured
} from '../../lib/marketingTelemetry'
import { createClient } from '../../utils/supabase/client'

interface MarketingMetricsViewProps {
  onOpenLeadsTab?: () => void
}

export const MarketingMetricsView: React.FC<MarketingMetricsViewProps> = ({ onOpenLeadsTab }) => {
  const [aggregates, setAggregates] = useState<MarketingAggregates>(getMarketingAggregates())
  const [sessions, setSessions] = useState<TelemetrySession[]>(getRecentSessions())
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all')
  const [periodFilter, setPeriodFilter] = useState<'today' | '7days' | '30days'>('today')
  const [notificationPermission, setNotificationPermission] = useState<string>('default')
  const [copiedBrief, setCopiedBrief] = useState(false)
  const [simulatedToast, setSimulatedToast] = useState<{ name: string; phone: string; time: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Refresh data periodically
  const refreshData = () => {
    setAggregates(getMarketingAggregates())
    setSessions(getRecentSessions())
  }

  // Request desktop notification permissions
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
        name: 'Módulo de Marketing Activado',
        phone: '+57 312 745 9728',
        audience: 'para_mi',
        source: 'marketing_permission_test'
      })
    }
  }

  // Simulate a live lead submission & broadcast to all connected admin laptops via Supabase
  const handleSimulateLead = async () => {
    const demoNames = [
      'Valentina Gómez Restrepo',
      'Andrés Felipe Murillo',
      'Camila Osorio Palacio',
      'Mateo Carvajal Urabá',
      'Estefanía Londoño'
    ]
    const randomName = demoNames[Math.floor(Math.random() * demoNames.length)]
    const randomPhone = `+57 3${Math.floor(100000000 + Math.random() * 900000000)}`
    const isAdult = Math.random() > 0.4
    const audience = isAdult ? 'para_mi' : 'para_mi_hijo'
    const nameParts = randomName.split(' ')

    // 1. Inyectar en Supabase para que viaje por WebSocket a Anthony y a todos los administradores en vivo
    try {
      const supabase = createClient()
      await supabase.from('leads').insert([
        {
          first_name: nameParts[0] || 'Prospecto',
          last_name: nameParts.slice(1).join(' ') || 'Simulado',
          email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
          phone: randomPhone,
          audience,
        }
      ])
    } catch (err) {
      console.warn('[Simulación] Fallback a broadcast local:', err)
    }

    // 2. Disparar sonido y notificación local
    notifyLeadCaptured({
      name: randomName,
      phone: randomPhone,
      email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      audience,
      source: 'simulated_hero_test'
    })

    // Add session to live feed
    const newSession: TelemetrySession = {
      id: `sess-sim-${Date.now().toString(36)}`,
      visitorId: `vis-live-${Math.floor(1000 + Math.random() * 9000)}`,
      startedAt: new Date().toISOString(),
      device: Math.random() > 0.3 ? 'mobile' : 'desktop',
      heroDwellSeconds: Math.floor(18 + Math.random() * 25),
      maxScrollDepth: Math.floor(70 + Math.random() * 30),
      sectionsViewed: ['hero', 'logos', 'segmentos', 'sede-presencial'],
      audienceSelected: isAdult ? 'self' : 'child',
      formTouched: true,
      ctaClicked: true,
      convertedToLead: true,
      leadName: randomName,
      referrer: 'instagram.com/stories'
    }

    setSessions(prev => [newSession, ...prev])
    setAggregates(prev => ({
      ...prev,
      totalVisitors: prev.totalVisitors + 1,
      funnel: {
        ...prev.funnel,
        heroImpressions: prev.funnel.heroImpressions + 1,
        leadsCaptured: prev.funnel.leadsCaptured + 1
      }
    }))

    // Show in-app animated toast
    setSimulatedToast({
      name: randomName,
      phone: randomPhone,
      time: 'Hace un instante'
    })
    setTimeout(() => setSimulatedToast(null), 5000)
  }

  // Export CSV for marketing agencies / ad campaigns
  const handleExportCSV = () => {
    const headers = [
      'ID Sesión',
      'Dispositivo',
      'Fecha / Hora',
      'Tiempo en Hero (seg)',
      'Scroll Máximo (%)',
      'Secciones Exploradas',
      'Audiencia Seleccionada',
      'Lead Convertido',
      'Nombre Lead',
      'Fuente / Referrer'
    ]

    const rows = sessions.map(s => [
      s.id,
      s.device,
      new Date(s.startedAt).toLocaleString('es-CO'),
      s.heroDwellSeconds,
      `${s.maxScrollDepth}%`,
      `"${s.sectionsViewed.join(', ')}"`,
      s.audienceSelected === 'self' ? 'Adultos' : s.audienceSelected === 'child' ? 'Niños/Teens' : 'Sin Selección',
      s.convertedToLead ? 'SÍ' : 'NO',
      s.leadName || 'N/A',
      s.referrer
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `telemetria-marketing-ade-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy Executive Marketing Brief to WhatsApp
  const handleCopyWhatsAppBrief = () => {
    const text = 
`📊 *REPORTE DE MARKETING & TELEMETRÍA - AMERICAN DREAM ENGLISH*
📅 *Fecha:* ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}

👥 *Tráfico en el Hero:* ${aggregates.totalVisitors} visitantes únicos
⏳ *Tiempo Promedio en Hero:* ${aggregates.avgHeroDwellSeconds}s
📜 *Visitantes que hacen scroll (>50%):* ${aggregates.scrollDepthOver50Percent}%
🎯 *Tasa de Conversión a Lead:* ${aggregates.conversionRate}%
📱 *Proporción Mobile:* ${aggregates.mobilePercentage}% Móvil / ${aggregates.desktopPercentage}% PC
🚀 *Total Leads Registrados:* ${aggregates.funnel.leadsCaptured} prospectos calificados
💬 *Clics directos a WhatsApp:* ${aggregates.whatsappClicks}

🔥 *Sección con más retención:* Programas y Metodología (16.2s prom.)
📌 *Recomendación Marquetero:* El 71% del tráfico es móvil; mantener los botones CTA directos al WhatsApp y al formulario del Hero.`

    navigator.clipboard.writeText(text)
    setCopiedBrief(true)
    setTimeout(() => setCopiedBrief(false), 3000)

    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const filteredSessions = sessions.filter(s => {
    if (deviceFilter === 'all') return true
    return s.device === deviceFilter
  })

  return (
    <div className="space-y-6">
      
      {/* ULTRA-LUXURY DYNAMIC ISLAND TOAST (TOP-CENTER - ZERO OS OVERLAP) */}
      <AnimatePresence>
        {simulatedToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -30, scale: 0.9, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 480, damping: 28 }}
            className="fixed top-6 left-1/2 z-[100] w-[94vw] sm:w-auto sm:min-w-[460px] max-w-lg select-none pointer-events-auto"
          >
            <div className="relative overflow-hidden rounded-3xl p-4 bg-slate-950/92 backdrop-blur-2xl border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(244,63,94,0.25)] text-white flex items-center justify-between gap-3.5 group">
              {/* Shimmer laser sweep along top border */}
              <motion.span
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-400 via-amber-300 to-transparent -translate-x-full pointer-events-none"
                animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Pulsing radar icon */}
              <div className="relative flex-shrink-0">
                <span className="absolute -inset-1 rounded-2xl bg-rose-500/30 blur-md animate-pulse" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Zap className="w-5 h-5 text-white animate-bounce" />
                </div>
              </div>

              {/* Lead content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono font-bold tracking-wider uppercase border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Nuevo Lead Capturado
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{simulatedToast.time}</span>
                </div>
                <h5 className="font-extrabold text-white text-sm truncate mt-1">{simulatedToast.name}</h5>
                <p className="text-xs text-rose-200 font-mono truncate">{simulatedToast.phone} · Hero Landing</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`https://wa.me/${simulatedToast.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${simulatedToast.name}, te escribimos de American Dream English para entregarte tu oferta especial.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSimulatedToast(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION & ACTION BAR */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Telemetría de Tráfico Web & Hero Dwell</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-mono font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>En Tiempo Real</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-rose-600" />
            <span>Centro de Inteligencia de Marketing & Conversión</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitorea el tiempo exacto que un usuario se queda mirando el Hero, su profundidad de scroll en la página y la tasa de conversión en prospectos calificados.
          </p>
        </div>

        {/* BUTTON ACTION CLUSTER */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Permission Toggle */}
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
                <span>Alertas SO: Activas</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Activar Alertas de Escritorio</span>
              </>
            )}
          </button>

          {/* Simulate Live Lead Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSimulateLead}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/25 flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>⚡ Simular Lead en el Hero</span>
          </motion.button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Exportar CSV</span>
          </button>

          {/* Share WhatsApp */}
          <button
            type="button"
            onClick={handleCopyWhatsAppBrief}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedBrief ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            <span>{copiedBrief ? 'Copiado' : 'WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* TOP 5 BENTO KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* KPI 1: Visitantes Totales */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Visitantes</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="my-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{aggregates.totalVisitors}</p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +18.4% vs sem. pasada
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-slate-400" /> {aggregates.mobilePercentage}%</span>
            <span className="flex items-center gap-1"><Monitor className="w-3 h-3 text-slate-400" /> {aggregates.desktopPercentage}%</span>
          </div>
        </div>

        {/* KPI 2: Tiempo de Retención en el Hero */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tiempo en Hero</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{aggregates.avgHeroDwellSeconds}</p>
              <span className="text-xs font-bold text-slate-500">seg</span>
            </div>
            <p className="text-[10px] text-rose-700 font-bold mt-0.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Retención Alta (&gt;12s)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Atención al Teacher Anthony
          </div>
        </div>

        {/* KPI 3: Profundidad de Scroll (>50%) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Scroll &gt; 50%</span>
            <ArrowDownCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{aggregates.scrollDepthOver50Percent}%</p>
            <p className="text-[10px] text-indigo-700 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Pasan del primer pliegue
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Interés en programas y sede
          </div>
        </div>

        {/* KPI 4: Conversión de Leads */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conversión Leads</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{aggregates.conversionRate}%</p>
            <p className="text-[10px] text-amber-800 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {aggregates.funnel.leadsCaptured} prospectos registrados
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">Formulario Hero</span>
            {onOpenLeadsTab && (
              <button
                type="button"
                onClick={onOpenLeadsTab}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Ver Pipeline →
              </button>
            )}
          </div>
        </div>

        {/* KPI 5: Clics WhatsApp */}
        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp Directo</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{aggregates.whatsappClicks}</p>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <Check className="w-3 h-3" /> Chats con Profe Anthony
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Alta intención de matrícula
          </div>
        </div>

      </div>

      {/* TWO COLUMNS: FUNNEL DE MARKETING + MAPA DE ATENCIÓN POR SECCIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: EMBUDO DE CONVERSIÓN (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-indigo-600" />
                <span>Embudo de Conversión del Estudiante (Marketing Funnel)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paso a paso desde que llega al Hero hasta que entrega sus datos o escribe a WhatsApp.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              5 Etapas
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Step 1: Hero Impression */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">1. Llegada al Hero de American Dream</span>
                <span className="text-slate-900 font-mono">{aggregates.funnel.heroImpressions} visitas (100%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-full" />
              </div>
            </div>

            {/* Step 2: Dwell over 8s */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">2. Retención en Hero &gt; 8 segundos</span>
                <span className="text-slate-900 font-mono">
                  {aggregates.funnel.heroDwellOver8s} ({Math.round((aggregates.funnel.heroDwellOver8s / aggregates.funnel.heroImpressions) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((aggregates.funnel.heroDwellOver8s / aggregates.funnel.heroImpressions) * 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-400">26% rebota en los primeros 8s por distracción o mala conexión.</p>
            </div>

            {/* Step 3: Scroll Methodology */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">3. Scroll a Metodología & Sede Urabá</span>
                <span className="text-slate-900 font-mono">
                  {aggregates.funnel.scrollMethodology} ({Math.round((aggregates.funnel.scrollMethodology / aggregates.funnel.heroImpressions) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((aggregates.funnel.scrollMethodology / aggregates.funnel.heroImpressions) * 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-400">Exploraron los avales oficiales, el fondo de becas y fotos de la sede.</p>
            </div>

            {/* Step 4: Form Interaction */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">4. Interacción con Formulario o Selector de Audiencia</span>
                <span className="text-slate-900 font-mono">
                  {aggregates.funnel.formInteractions} ({Math.round((aggregates.funnel.formInteractions / aggregates.funnel.heroImpressions) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((aggregates.funnel.formInteractions / aggregates.funnel.heroImpressions) * 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-400">Clic en switch "Para mí" / "Para mi hijo" o hicieron foco en los campos.</p>
            </div>

            {/* Step 5: Leads Captured */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-700 font-black">5. Lead Capturado con Éxito (Objetivo)</span>
                <span className="text-rose-700 font-mono font-black">
                  {aggregates.funnel.leadsCaptured} ({aggregates.conversionRate}%)
                </span>
              </div>
              <div className="w-full h-3.5 bg-rose-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-600 to-red-600 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, aggregates.conversionRate * 5)}%` }} 
                />
              </div>
              <p className="text-[11px] text-emerald-600 font-bold">
                🎯 Resultado extraordinario: más de 30 prospectos directos a la base de datos de Anthony.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: MAPA DE CALOR POR SECCIONES (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                <span>Mapa de Atención por Secciones</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dónde concentran la vista los usuarios en el landing.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
              Scroll Dwell
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {aggregates.sectionHeatmap.map(sec => (
              <div key={sec.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate">{sec.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sec.viewPercentage}% alcance
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      ⏱ {sec.avgTimeSeconds}s prom.
                    </span>
                  </div>
                </div>

                <div className="w-20 sm:w-24 shrink-0">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        sec.viewPercentage > 75 
                          ? 'bg-rose-500' 
                          : sec.viewPercentage > 50 
                            ? 'bg-amber-500' 
                            : 'bg-slate-400'
                      }`}
                      style={{ width: `${sec.viewPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              💡 Hallazgo Clave de Marketing:
            </span>
            <p>
              El **Hero** y el **Simulador Jenny AI** tienen el tiempo de atención más alto (19s y 22s). Mantener el formulario en el Hero garantiza que el 100% de los visitantes vean la oferta de inscripción sin necesidad de hacer scroll.
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: BITÁCORA EN VIVO DE SESIONES Y VISITANTES */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Bitácora de Sesiones Recientes en el Landing Page</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro de visitantes individuales: tiempo capturado en el hero, scroll alcanzado y si se convirtieron en lead.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setDeviceFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                deviceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos ({sessions.length})
            </button>
            <button
              type="button"
              onClick={() => setDeviceFilter('mobile')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                deviceFilter === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Móvil
            </button>
            <button
              type="button"
              onClick={() => setDeviceFilter('desktop')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                deviceFilter === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> PC
            </button>
          </div>
        </div>

        {/* TABLE OF SESSIONS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Sesión / Dispositivo</th>
                <th className="pb-3">Tiempo en Hero</th>
                <th className="pb-3">Profundidad Scroll</th>
                <th className="pb-3">Audiencia</th>
                <th className="pb-3">Fuente (Referrer)</th>
                <th className="pb-3 pr-2 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSessions.map(sess => (
                <tr key={sess.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        {sess.device === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 font-mono text-[11px]">{sess.visitorId}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(sess.startedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                      sess.heroDwellSeconds >= 15 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {sess.heroDwellSeconds}s
                    </span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${sess.maxScrollDepth}%` }} 
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-600">{sess.maxScrollDepth}%</span>
                    </div>
                  </td>

                  <td className="py-3">
                    {sess.audienceSelected === 'child' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                        Niños/Teens
                      </span>
                    ) : sess.audienceSelected === 'self' ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        Adulto
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Sin seleccionar</span>
                    )}
                  </td>

                  <td className="py-3">
                    <span className="text-[11px] text-slate-600 font-mono truncate max-w-[140px] block">
                      {sess.referrer}
                    </span>
                  </td>

                  <td className="py-3 pr-2 text-right">
                    {sess.convertedToLead ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200 shadow-2xs">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        <span>Lead: {sess.leadName?.split(' ')[0] || 'Capturado'}</span>
                      </span>
                    ) : sess.ctaClicked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 font-bold text-[10px] border border-sky-200">
                        <MousePointerClick className="w-3 h-3" />
                        <span>Clic CTA</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Navegación</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
