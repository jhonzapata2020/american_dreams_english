import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al consultar perfiles en GET /api/admin/students:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      students: data || []
    })

  } catch (err: any) {
    console.error('Error no controlado en GET /api/admin/students:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor al consultar estudiantes.' },
      { status: 500 }
    )
  }
}
