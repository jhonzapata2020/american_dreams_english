import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/admin'

const INITIAL_FACULTY_TEACHERS = [
  {
    id: 'tch-carlos-mendez',
    full_name: 'Lic. Carlos Méndez',
    email: 'carlos.mendez@americandream.edu.co',
    phone: '+57 312 458 9210',
    mcer_level: 'A1',
    role: 'teacher',
    specialty: 'Docente Titular A1 · Fonética & Gramática',
    document_number: '1040892301',
    status: 'active',
    students_count: 12,
    classes_count: 4,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'tch-sarah-miller',
    full_name: 'Teacher Sarah Miller',
    email: 'sarah.miller@americandream.edu.co',
    phone: '+57 314 789 2234',
    mcer_level: 'A2',
    role: 'teacher',
    specialty: 'Docente Titular A2 · Inmersión Oral & Storytelling',
    document_number: '1040892302',
    status: 'active',
    students_count: 10,
    classes_count: 4,
    created_at: '2026-01-15T08:00:00Z'
  },
  {
    id: 'tch-anthony-director',
    full_name: 'Teacher Anthony (Director)',
    email: 'anthony@americandream.edu.co',
    phone: '+57 320 894 1120',
    mcer_level: 'B1',
    role: 'teacher',
    specialty: 'Director Académico · Nivel B1/B2 & Preparación Internacional',
    document_number: '1040892300',
    status: 'active',
    students_count: 14,
    classes_count: 6,
    created_at: '2026-01-10T08:00:00Z'
  }
]

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient()

    let teachersData: any[] = []
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        teachersData = data
      }
    } catch (e: any) {
      console.warn('Conexión con Supabase no disponible en GET /api/admin/teachers:', e.message)
    }

    // Si la base de datos está vacía de docentes, combinamos con los docentes oficiales
    const finalTeachers = teachersData.length > 0 ? teachersData : INITIAL_FACULTY_TEACHERS

    return NextResponse.json({
      success: true,
      teachers: finalTeachers,
      total: finalTeachers.length
    })

  } catch (err: any) {
    console.error('Error no controlado en GET /api/admin/teachers:', err)
    return NextResponse.json({
      success: true,
      teachers: INITIAL_FACULTY_TEACHERS,
      total: INITIAL_FACULTY_TEACHERS.length
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de docente requerido' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Eliminar de public.profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)

    // Eliminar de Supabase Auth si aplica
    try {
      await supabaseAdmin.auth.admin.deleteUser(id)
    } catch (authErr) {
      console.warn('Aviso al eliminar de auth:', authErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Docente removido de la plataforma.'
    })

  } catch (err: any) {
    console.error('Error al eliminar docente:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno al eliminar docente' },
      { status: 500 }
    )
  }
}
