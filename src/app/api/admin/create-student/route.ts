import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, municipality, mcerLevel } = body

    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'El nombre completo y el correo electrónico son obligatorios.' },
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

    // 1. Crear el usuario en Supabase Auth con Service Role
    let userId = crypto.randomUUID()

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: 'TempPassword2026*',
      email_confirm: true,
      user_metadata: { full_name: fullName.trim(), role: 'student' }
    })

    if (authUser?.user?.id) {
      userId = authUser.user.id
    } else if (authError) {
      console.warn('Advertencia al crear usuario Auth (Service Role):', authError.message)
    }

    // 2. Insertar/Actualizar registro en public.profiles
    const profilePayload: any = {
      id: userId,
      full_name: fullName.trim(),
      email: email.trim(),
      role: 'student',
      municipality: municipality || 'Turbo',
      origin_location: municipality || 'Turbo',
      academic_level: mcerLevel || 'A1'
    }

    let { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload)

    // Fallback si la columna municipality o academic_level no existe en la tabla de Supabase
    if (profileError && profileError.message?.toLowerCase().includes('column')) {
      const fallbackPayload: any = {
        id: userId,
        full_name: fullName.trim(),
        email: email.trim(),
        role: 'student',
        origin_location: municipality || 'Turbo'
      }
      const { error: retryError } = await supabaseAdmin
        .from('profiles')
        .upsert(fallbackPayload)

      if (retryError) {
        console.error('Error al guardar perfil en Supabase (fallback):', retryError)
        return NextResponse.json(
          { error: retryError.message || 'No se pudo guardar el perfil del estudiante.' },
          { status: 500 }
        )
      }
    } else if (profileError) {
      console.error('Error al guardar perfil en Supabase:', profileError)
      return NextResponse.json(
        { error: profileError.message || 'Error al registrar el perfil en la base de datos.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      student: {
        id: userId,
        full_name: fullName.trim(),
        email: email.trim(),
        role: 'student',
        municipality: municipality || 'Turbo',
        mcer_level: mcerLevel || 'A1'
      }
    })

  } catch (err: any) {
    console.error('Error no controlado en /api/admin/create-student:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
