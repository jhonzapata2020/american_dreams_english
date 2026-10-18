import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      fullName, 
      documentType, 
      documentId, 
      email, 
      phone, 
      mcerLevel, 
      courseId, 
      courseName, 
      modality,
      municipality 
    } = body

    const cleanEmail = email ? email.trim().toLowerCase() : ''
    const cleanDoc = documentId ? documentId.toString().trim() : ''
    const cleanName = (fullName || `${firstName || ''} ${lastName || ''}`).trim()

    if (!cleanName || !cleanEmail || !cleanDoc) {
      return NextResponse.json(
        { error: 'El nombre completo, correo electrónico y número de documento son obligatorios.' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Contraseña inicial: la cédula si tiene >= 6 dígitos, o personalizada, o institucional
    const initialPassword = (body.password && body.password.trim().length >= 6)
      ? body.password.trim()
      : (cleanDoc.length >= 6 ? cleanDoc : `${cleanDoc}2026*`)

    const levelName = (mcerLevel || 'A1').toUpperCase()
    const defaultCourseTitle = courseName || (
      levelName === 'A1' ? 'ENGLISH LEVEL 1 - GENERAL PROGRAM' :
      levelName === 'A2' ? 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE' :
      levelName === 'B1' ? 'ENGLISH LEVEL 3 - INTERMEDIATE' :
      'ENGLISH LEVEL 4 - UPPER INTERMEDIATE'
    )

    const COURSE_IDS_BY_LEVEL: Record<string, string> = {
      'A1': 'b623de10-0d1e-4eb9-a285-df5e043762b8',
      'A2': '9a6fb5ea-7202-4f58-99fa-4350fff3ba53',
      'B1': 'bdac7da9-d7a8-4d25-b1a5-c66cf2671d4c',
      'B2': '09cef8f3-f0f9-4c8a-a787-520e495b8311'
    }

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
            role: 'student',
            full_name: cleanName,
            first_name: firstName || cleanName.split(' ')[0],
            last_name: lastName || cleanName.split(' ').slice(1).join(' '),
            document_type: documentType || 'C.C.',
            document_id: cleanDoc,
            phone: phone || '',
            mcer_level: levelName
          }
        })
      } catch (authUpdateErr: any) {
        console.warn('Aviso actualizando auth de estudiante existente:', authUpdateErr?.message)
      }
    } else {
      // 2. Crear usuario nuevo en Supabase Auth con Service Role (email pre-confirmado)
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: initialPassword,
        email_confirm: true,
        user_metadata: {
          role: 'student',
          full_name: cleanName,
          first_name: firstName || cleanName.split(' ')[0],
          last_name: lastName || cleanName.split(' ').slice(1).join(' '),
          document_type: documentType || 'C.C.',
          document_id: cleanDoc,
          phone: phone || '',
          mcer_level: levelName
        }
      })

      if (authUser?.user?.id) {
        userId = authUser.user.id
      } else if (authError) {
        if (authError.message?.toLowerCase().includes('already')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
          const matchedUser = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail)
          if (matchedUser?.id) {
            const matchedId: string = matchedUser.id
            userId = matchedId
            await supabaseAdmin.auth.admin.updateUserById(matchedId, { 
              password: initialPassword,
              user_metadata: { 
                role: 'student', 
                full_name: cleanName,
                document_type: documentType || 'C.C.',
                document_id: cleanDoc,
                phone: phone || '',
                mcer_level: levelName
              }
            })
          } else {
            return NextResponse.json(
              { error: `El correo ${cleanEmail} ya se encuentra registrado en el sistema de autenticación.` },
              { status: 400 }
            )
          }
        } else {
          console.error('Error de Supabase Auth al crear estudiante:', authError)
          return NextResponse.json(
            { error: `Error de autenticación al registrar estudiante: ${authError.message}` },
            { status: 400 }
          )
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No se pudo generar un identificador de usuario UUID válido para el estudiante.' },
        { status: 500 }
      )
    }

    // 3. Insertar / Actualizar registro en public.profiles con columnas reales
    const profilePayload: any = {
      id: userId,
      full_name: cleanName,
      email: cleanEmail,
      role: 'student',
      document_type: documentType || 'C.C.',
      document_number: cleanDoc || null,
      phone: phone || null,
      mcer_level: levelName,
      origin_location: municipality || 'Turbo (Urabá)',
      updated_at: new Date().toISOString()
    }

    const { data: savedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()
      .single()

    if (profileError) {
      console.error('Error insertando perfil de estudiante en Supabase:', profileError)
      return NextResponse.json(
        { error: `Error en base de datos al guardar estudiante en profiles: ${profileError.message}` },
        { status: 500 }
      )
    }

    // 4. Registrar matrícula en la tabla enrollments con UUID de curso válido
    const validCourseId = (courseId && courseId.length === 36)
      ? courseId
      : (COURSE_IDS_BY_LEVEL[levelName] || COURSE_IDS_BY_LEVEL['A1'])

    try {
      await supabaseAdmin
        .from('enrollments')
        .insert({
          student_id: userId,
          course_id: validCourseId,
          scholarship_type: 'beca_parcial',
          completed_hours: 0,
          grade: 0,
          status: 'active',
          current_level: levelName,
          created_at: new Date().toISOString()
        })
    } catch (enrollErr: any) {
      console.warn('Aviso de matrícula en enrollments:', enrollErr?.message)
    }

    return NextResponse.json({
      success: true,
      student: {
        id: userId,
        full_name: cleanName,
        email: cleanEmail,
        document_type: documentType || 'C.C.',
        document_number: cleanDoc,
        phone: phone || '',
        mcer_level: levelName,
        course_name: defaultCourseTitle,
        modality: modality || 'virtual',
        status: 'active',
        created_at: savedProfile?.created_at || new Date().toISOString()
      },
      credentials: {
        studentName: cleanName,
        username: cleanDoc,
        email: cleanEmail,
        documentId: cleanDoc,
        password: initialPassword,
        courseName: defaultCourseTitle,
        loginUrl: '/campus/login'
      }
    })

  } catch (err: any) {
    console.error('Error no controlado en /api/admin/create-student:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor al crear la cuenta del estudiante.' },
      { status: 500 }
    )
  }
}
