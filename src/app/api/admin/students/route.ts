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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de estudiante requerido' },
        { status: 400 }
      )
    }

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

    // 1. Eliminar matrículas asociadas si existen en enrollments para evitar restricciones de clave foránea
    try {
      await supabaseAdmin.from('enrollments').delete().eq('student_id', id)
      await supabaseAdmin.from('enrollments').delete().eq('user_id', id)
    } catch (e) {
      console.warn('Advertencia al limpiar enrollments:', e)
    }

    // 2. Eliminar de public.profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('Error al eliminar perfil de Supabase:', profileError)
      return NextResponse.json(
        { error: profileError.message || 'No se pudo eliminar el estudiante de profiles.' },
        { status: 500 }
      )
    }

    // 3. Eliminar de Supabase Auth si aplica
    try {
      await supabaseAdmin.auth.admin.deleteUser(id)
    } catch (authErr) {
      console.warn('Usuario no estaba en Auth o ya fue eliminado:', authErr)
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Error no controlado en DELETE /api/admin/students:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor al eliminar estudiante.' },
      { status: 500 }
    )
  }
}
