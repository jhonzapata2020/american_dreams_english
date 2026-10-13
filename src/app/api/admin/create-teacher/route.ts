import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      fullName, 
      email, 
      phone, 
      documentType, 
      documentId, 
      mcerLevel, 
      specialty,
      password 
    } = body

    const cleanEmail = email ? email.trim().toLowerCase() : ''
    const cleanDoc = documentId ? documentId.toString().trim() : ''
    const cleanName = fullName ? fullName.trim() : ''
    const assignedLevel = mcerLevel ? mcerLevel.toUpperCase() : 'A1'
    const cleanSpecialty = specialty ? specialty.trim() : `Docente Titular Nivel ${assignedLevel}`

    if (!cleanName || !cleanEmail) {
      return NextResponse.json(
        { error: 'El nombre completo y el correo electrónico del docente son obligatorios.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjnmpkoezeyhjhrzkw.supabase.co'
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

    // Contraseña inicial: la especificada por el Director, o la cédula, o predeterminada institucional
    const initialPassword = password?.trim() || (cleanDoc.length >= 6 ? cleanDoc : 'Docente2026*')

    let userId = `tch-${Date.now()}`
    let isPersistedInAuth = false

    try {
      // 1. Verificar si ya existe perfil registrado con este correo
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (existingProfile?.id) {
        userId = existingProfile.id
        try {
          await supabaseAdmin.auth.admin.updateUserById(userId, { 
            password: initialPassword,
            user_metadata: {
              role: 'teacher',
              full_name: cleanName,
              mcer_level: assignedLevel,
              specialty: cleanSpecialty
            }
          })
          isPersistedInAuth = true
        } catch (authUpdateErr) {
          console.warn('Aviso al actualizar auth de docente existente:', authUpdateErr)
        }
      } else {
        // 2. Crear usuario nuevo en Supabase Auth con Service Role (email pre-confirmado)
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: initialPassword,
          email_confirm: true,
          user_metadata: {
            role: 'teacher',
            full_name: cleanName,
            document_type: documentType || 'C.C.',
            document_id: cleanDoc,
            phone: phone || '',
            mcer_level: assignedLevel,
            specialty: cleanSpecialty
          }
        })

        if (authUser?.user?.id) {
          userId = authUser.user.id
          isPersistedInAuth = true
        } else if (authError && authError.message?.toLowerCase().includes('already')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
          const matchedUser = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail)
          if (matchedUser) {
            userId = matchedUser.id
            await supabaseAdmin.auth.admin.updateUserById(userId, { 
              password: initialPassword,
              user_metadata: { role: 'teacher', full_name: cleanName }
            })
            isPersistedInAuth = true
          }
        }
      }

      // 3. Insertar / Actualizar en public.profiles con rol 'teacher'
      const profilePayload: any = {
        id: userId,
        full_name: cleanName,
        email: cleanEmail,
        role: 'teacher',
        document_type: documentType || 'C.C.',
        document_number: cleanDoc || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        phone: phone || '',
        mcer_level: assignedLevel,
        academic_level: assignedLevel,
        origin_location: 'American Dream English Faculty',
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })

      if (profileError) {
        console.warn('Advertencia al insertar perfil en Supabase:', profileError.message)
      }

    } catch (dbErr: any) {
      console.warn('Operación Supabase degradada a respuesta local:', dbErr?.message)
    }

    const whatsappMessage = encodeURIComponent(
      `🏛️ *AMERICAN DREAM ENGLISH — ACCESO DOCENTE TITULAR*\n\n` +
      `Estimado(a) *${cleanName}*,\n` +
      `Tu cuenta docente ha sido habilitada por la Dirección Académica.\n\n` +
      `🔗 *Portal de Acceso:* https://americandreamenglish.com/login\n` +
      `📧 *Usuario:* ${cleanEmail}\n` +
      `🔑 *Contraseña Inicial:* ${initialPassword}\n` +
      `📚 *Nivel Asignado:* ${assignedLevel}\n\n` +
      `Al iniciar sesión ingresarás directamente al panel de control de tu aula, Teams y calificaciones.`
    )

    return NextResponse.json({
      success: true,
      teacher: {
        id: userId,
        fullName: cleanName,
        email: cleanEmail,
        phone: phone || '',
        documentType: documentType || 'C.C.',
        documentId: cleanDoc,
        mcerLevel: assignedLevel,
        specialty: cleanSpecialty,
        initialPassword: initialPassword,
        role: 'teacher',
        whatsappMessage: whatsappMessage,
        createdAt: new Date().toISOString()
      }
    })

  } catch (err: any) {
    console.error('Error al crear docente:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno al registrar el docente.' },
      { status: 500 }
    )
  }
}
