import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FALLBACK_USD_COP = 4050

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 43200 }, // 12 horas en segundos
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`External API responded with status ${res.status}`)
    }

    const data = await res.json()
    const rate = data?.rates?.COP

    if (typeof rate === 'number' && rate > 0) {
      return NextResponse.json(
        {
          success: true,
          base: 'USD',
          target: 'COP',
          rate: Math.round(rate * 100) / 100,
          lastUpdated: data?.time_last_update_utc || new Date().toISOString(),
          source: 'open.er-api.com',
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
          },
        }
      )
    }

    throw new Error('Invalid rate received from currency API')
  } catch (err: any) {
    console.warn('[Currency API Fallback] Error fetching live TRM, using fallback rate:', err?.message)
    return NextResponse.json(
      {
        success: false,
        base: 'USD',
        target: 'COP',
        rate: FALLBACK_USD_COP,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        warning: 'Fallback exchange rate applied',
      },
      { status: 200 }
    )
  }
}
