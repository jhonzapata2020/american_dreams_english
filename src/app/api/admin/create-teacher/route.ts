import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/admin'

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

    const supabaseAdmin = createAdminClient()

    // Contraseña inicial: la especificada por el Director, o la cédula (si >= 6 chars), o predeterminada institucional
    const initialPassword = (password && password.trim().length >= 6)
      ? password.trim()
      : (cleanDoc.length >= 6 ? cleanDoc : 'Docente2026*')

    let userId: string | null = null

    // 1. Verificar si ya existe perfil registrado con este correo
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (existingProfile?.id) {
      const existingId: string = existingProfile.id
      userId = existingId
      try {
        await supabaseAdmin.auth.admin.updateUserById(existingId, { 
          password: initialPassword,
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
      } catch (authUpdateErr: any) {
        console.warn('Aviso al actualizar auth de docente existente:', authUpdateErr?.message)
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
      } else if (authError) {
        // Si el usuario ya está registrado en auth.users, buscamos su ID
        if (authError.message?.toLowerCase().includes('already')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
          const matchedUser = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail)
          if (matchedUser?.id) {
            const matchedId: string = matchedUser.id
            userId = matchedId
            await supabaseAdmin.auth.admin.updateUserById(matchedId, { 
              password: initialPassword,
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
          } else {
            return NextResponse.json(
              { error: `El correo ${cleanEmail} ya se encuentra registrado en el sistema de autenticación.` },
              { status: 400 }
            )
          }
        } else {
          console.error('Error de Supabase Auth al registrar docente:', authError)
          return NextResponse.json(
            { error: `Error de autenticación al crear el docente: ${authError.message}` },
            { status: 400 }
          )
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo generar un identificador de usuario válido para el docente.' },
        { status: 500 }
      )
    }

    // 3. Insertar / Actualizar en public.profiles con columnas reales de la base de datos
    const profilePayload: any = {
      id: userId,
      full_name: cleanName,
      email: cleanEmail,
      role: 'teacher',
      document_type: documentType || 'C.C.',
      document_number: cleanDoc || null,
      phone: phone || null,
      mcer_level: assignedLevel,
      origin_location: 'American Dream English Faculty',
      updated_at: new Date().toISOString()
    }

    const { data: savedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()
      .single()

    if (profileError) {
      console.error('Error al insertar perfil en Supabase (profiles):', profileError)
      return NextResponse.json(
        { error: `Error en la base de datos al guardar perfil de docente: ${profileError.message}` },
        { status: 500 }
      )
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
        createdAt: savedProfile?.created_at || new Date().toISOString()
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
