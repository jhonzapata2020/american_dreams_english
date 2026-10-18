import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/admin'

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient()

    let studentsData: any[] = []
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

      if (!error && data) {
        studentsData = data
      } else if (error) {
        console.warn('Aviso Supabase en GET /api/admin/students:', error.message)
      }
    } catch (e: any) {
      console.warn('Conexión con Supabase no disponible en GET /api/admin/students:', e.message)
    }

    return NextResponse.json({
      success: true,
      students: studentsData
    })

  } catch (err: any) {
    console.error('Error no controlado en GET /api/admin/students:', err)
    return NextResponse.json({
      success: true,
      students: []
    })
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

    const supabaseAdmin = createAdminClient()

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
