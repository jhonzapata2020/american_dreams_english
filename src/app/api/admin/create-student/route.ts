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

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = fullName.trim()

    // 1. Verificar si ya existe un perfil registrado con este correo
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle()

    let userId = existingProfile?.id

    if (!userId) {
      // Intentar crear el usuario en Supabase Auth con Service Role
      const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: 'TempPassword2026*',
        email_confirm: true,
        user_metadata: { full_name: cleanName, role: 'student' }
      })

      if (authUser?.user?.id) {
        userId = authUser.user.id
      } else {
        userId = crypto.randomUUID()
      }
    }

    // 2. Insertar / Actualizar registro en public.profiles
    const profilePayload: any = {
      id: userId,
      full_name: cleanName,
      email: cleanEmail,
      role: 'student',
      municipality: municipality || 'Turbo',
      origin_location: municipality || 'Turbo',
      academic_level: mcerLevel || 'A1'
    }

    let { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    // Fallback si alguna columna no existe en el esquema de la base de datos
    if (profileError) {
      console.warn('Upsert inicial reportó advertencia en profiles:', profileError.message)
      const fallbackPayload: any = {
        id: userId,
        full_name: cleanName,
        email: cleanEmail,
        role: 'student',
        origin_location: municipality || 'Turbo'
      }
      const { error: retryError } = await supabaseAdmin
        .from('profiles')
        .upsert(fallbackPayload, { onConflict: 'id' })

      if (retryError) {
        console.error('Error en upsert fallback profiles:', retryError)
        // Intentar insert simple por si upsert tiene restricciones
        const { error: insertErr } = await supabaseAdmin
          .from('profiles')
          .insert([fallbackPayload])

        if (insertErr && !insertErr.message?.toLowerCase().includes('duplicate')) {
          return NextResponse.json(
            { error: insertErr.message || 'No se pudo guardar el perfil del estudiante.' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        id: userId,
        full_name: cleanName,
        email: cleanEmail,
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
