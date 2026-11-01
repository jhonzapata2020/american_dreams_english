import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { createAdminClient } from '../../../../utils/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Endpoint de Servidor Protegido para Google Analytics 4 Data API y Leads de Supabase.
 * Nunca expone credenciales ni claves privadas al cliente.
 */
export async function GET(request: Request) {
  try {
    // 1. Verificación de Seguridad y Autorización (Admin Only)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')?.trim()

    const supabaseAdmin = createAdminClient()

    if (token) {
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
      if (userError || !user) {
        return NextResponse.json(
          { error: 'No autorizado. Sesión inválida o expirada.' },
          { status: 401 }
        )
      }

      // Validar rol de administrador en tabla profiles
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json(
          { error: 'Acceso restringido. Se requieren privilegios de Administrador General.' },
          { status: 403 }
        )
      }
    }

    // 2. Parámetros de Consulta (Filtro de Rango de Fechas)
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7days' // 'today' | '7days' | '30days'

    let startDate = '7daysAgo'
    if (period === 'today') startDate = 'today'
    if (period === '30days') startDate = '30daysAgo'

    // 3. Consulta de Leads Reales desde Supabase
    let realLeadsCount = 0
    let realLeadsList: any[] = []
    let realLeadsToday = 0

    try {
      const todayISO = new Date().toISOString().split('T')[0]
      const { data: leads, error: leadsErr } = await supabaseAdmin
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (!leadsErr && leads) {
        realLeadsList = leads
        realLeadsCount = leads.length
        realLeadsToday = leads.filter(l => l.created_at && l.created_at.startsWith(todayISO)).length
      }
    } catch (dbErr) {
      console.warn('[Analytics API] Advertencia al leer leads de Supabase:', dbErr)
    }

    // 4. Verificación de Credenciales de Google Cloud Service Account
    const propertyId = process.env.GA_PROPERTY_ID?.trim()
    const clientEmail = process.env.GA_CLIENT_EMAIL?.trim()
    let privateKey = process.env.GA_PRIVATE_KEY?.trim()

    // Corregir escapes de saltos de línea si vienen de variables en línea de Vercel/.env
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n')
    }

    const missingConfig: string[] = []
    if (!propertyId) missingConfig.push('GA_PROPERTY_ID')
    if (!clientEmail) missingConfig.push('GA_CLIENT_EMAIL')
    if (!privateKey) missingConfig.push('GA_PRIVATE_KEY')

    // Si faltan credenciales, devolvemos un diagnóstico preciso sin inventar datos falsos
    if (missingConfig.length > 0) {
      return NextResponse.json({
        success: true,
        isConfigured: false,
        measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-R8W15WYSD6',
        missingCredentials: missingConfig,
        message: 'Faltan credenciales de Google Cloud Service Account para consultar la Google Analytics Data API.',
        setupGuide: {
          step1: 'Crear Service Account en Google Cloud Console y habilitar Google Analytics Data API.',
          step2: 'Dar acceso de Lectura (Viewer) al correo del Service Account en Google Analytics.',
          step3: 'Configurar GA_PROPERTY_ID, GA_CLIENT_EMAIL y GA_PRIVATE_KEY en .env.local y Vercel.'
        },
        leadsData: {
          source: 'Supabase (Base de Datos Oficial)',
          totalLeads: realLeadsCount,
          leadsToday: realLeadsToday,
          recentLeads: realLeadsList.slice(0, 10)
        },
        analyticsData: null
      })
    }

    // 5. Instanciar Cliente de Google Analytics Data API
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })

    // 6. Consultar Reporte General (Visitas, Usuarios, Sesiones, Duración, Conversiones)
    const [reportResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'conversions' },
        { name: 'bounceRate' }
      ],
    })

    // 7. Consultar Páginas Más Visitadas
    const [topPagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      limit: 10,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
    })

    // 8. Consultar Canales de Adquisición de Tráfico
    const [acquisitionResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    })

    // 9. Consultar Dispositivos (Móvil vs Desktop)
    const [devicesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }]
    })

    // 10. Consultar Usuarios Activos en Tiempo Real (Últimos 30 min)
    let realtimeActiveUsers = 0
    try {
      const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }]
      })
      realtimeActiveUsers = Number(realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || 0)
    } catch (realtimeErr) {
      console.warn('[Analytics API] Realtime Report opcional no disponible:', realtimeErr)
    }

    // Formatear métricas principales
    const mainRow = reportResponse.rows?.[0]?.metricValues || []
    const totalUsers = Number(mainRow[0]?.value || 0)
    const totalSessions = Number(mainRow[1]?.value || 0)
    const totalPageViews = Number(mainRow[2]?.value || 0)
    const avgDurationSeconds = Math.round(Number(mainRow[3]?.value || 0))
    const conversions = Number(mainRow[4]?.value || 0)
    const bounceRate = Math.round(Number(mainRow[5]?.value || 0) * 100) / 100

    // Formatear Top Páginas
    const topPages = (topPagesResponse.rows || []).map(row => ({
      path: row.dimensionValues?.[0]?.value || '/',
      title: row.dimensionValues?.[1]?.value || 'Página',
      views: Number(row.metricValues?.[0]?.value || 0),
      users: Number(row.metricValues?.[1]?.value || 0),
    }))

    // Formatear Canales
    const acquisitionChannels = (acquisitionResponse.rows || []).map(row => ({
      channel: row.dimensionValues?.[0]?.value || 'Direct',
      sessions: Number(row.metricValues?.[0]?.value || 0),
      users: Number(row.metricValues?.[1]?.value || 0),
    }))

    // Formatear Dispositivos
    const devices = (devicesResponse.rows || []).map(row => ({
      category: row.dimensionValues?.[0]?.value || 'desktop',
      users: Number(row.metricValues?.[0]?.value || 0),
    }))

    return NextResponse.json({
      success: true,
      isConfigured: true,
      measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-R8W15WYSD6',
      propertyId,
      period,
      analyticsData: {
        realtimeActiveUsers,
        totalUsers,
        totalSessions,
        totalPageViews,
        avgDurationSeconds,
        conversions,
        bounceRate,
        topPages,
        acquisitionChannels,
        devices
      },
      leadsData: {
        source: 'Supabase (Base de Datos Oficial)',
        totalLeads: realLeadsCount,
        leadsToday: realLeadsToday,
        recentLeads: realLeadsList.slice(0, 10),
        realConversionRate: totalUsers > 0 ? (Math.round((realLeadsCount / totalUsers) * 1000) / 10) : 0
      }
    })

  } catch (error: any) {
    console.error('[API Admin Analytics] Error al consultar Google Analytics Data API:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Error interno al consultar Google Analytics Data API.',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
