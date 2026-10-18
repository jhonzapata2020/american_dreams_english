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

    // Contraseña inicial por defecto: el mismo número de documento (mínimo 6 caracteres)
    const initialPassword = cleanDoc.length >= 6 ? cleanDoc : `${cleanDoc}2026*`

    const levelName = mcerLevel || 'A1'
    const defaultCourseTitle = courseName || (
      levelName === 'A1' ? 'ENGLISH LEVEL 1 - GENERAL PROGRAM' :
      levelName === 'A2' ? 'ENGLISH LEVEL 2 - PRE-INTERMEDIATE' :
      levelName === 'B1' ? 'ENGLISH LEVEL 3 - INTERMEDIATE' :
      'ENGLISH LEVEL 4 - UPPER INTERMEDIATE'
    )

    let userId = `stu-${Date.now()}`
    let isPersistedInSupabase = false

    try {
      // 1. Verificar si ya existe un perfil registrado con este correo
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (existingProfile?.id) {
        userId = existingProfile.id
        try {
          await supabaseAdmin.auth.admin.updateUserById(userId, { password: initialPassword })
        } catch (e) {}
      } else {
        // Crear el usuario en Supabase Auth con Service Role
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
            phone: phone || ''
          }
        })

        if (authUser?.user?.id) {
          userId = authUser.user.id
        } else if (authError && authError.message?.toLowerCase().includes('already')) {
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
          const matchedUser = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail)
          if (matchedUser) {
            userId = matchedUser.id
            await supabaseAdmin.auth.admin.updateUserById(userId, { password: initialPassword })
          }
        }
      }

      // 2. Insertar / Actualizar registro en public.profiles
      const profilePayload: any = {
        id: userId,
        full_name: cleanName,
        email: cleanEmail,
        role: 'student',
        document_type: documentType || 'C.C.',
        document_number: cleanDoc || null,
        phone: phone || null,
        mcer_level: mcerLevel || 'A1',
        origin_location: municipality || 'Turbo (Urabá)',
        updated_at: new Date().toISOString()
      }

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })

      if (profileError) {
        console.error('Error insertando perfil de estudiante en Supabase:', profileError)
        return NextResponse.json(
          { error: `Error en base de datos al guardar estudiante: ${profileError.message}` },
          { status: 500 }
        )
      }

      await supabaseAdmin
        .from('enrollments')
        .upsert({
          student_id: userId,
          user_id: userId,
          course_id: courseId || `ade-ing-${levelName.toLowerCase()}`,
          course_title: defaultCourseTitle,
          current_level: levelName,
          modality: modality || 'virtual',
          status: 'active',
          created_at: new Date().toISOString()
        }, { onConflict: 'student_id' })

      isPersistedInSupabase = true
    } catch (sbErr: any) {
      console.warn('Aviso Supabase al crear estudiante:', sbErr?.message || sbErr)
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
        status: 'active'
      },
      credentials: {
        username: cleanDoc,
        email: cleanEmail,
        document_id: cleanDoc,
        password: initialPassword,
        login_url: '/campus/login'
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
