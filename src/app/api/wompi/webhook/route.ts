import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    let payload: any = {}

    try {
      payload = JSON.parse(rawBody)
    } catch (parseErr) {
      return NextResponse.json({ error: 'Payload JSON inválido' }, { status: 400 })
    }

    const { event, data, signature, timestamp } = payload

    // 1. Validar si es el evento transaction.updated
    if (event !== 'transaction.updated' || !data?.transaction) {
      return NextResponse.json({ message: 'Evento ignorado (no relevante para matrícula)' }, { status: 200 })
    }

    const transaction = data.transaction
    const {
      id: transactionId,
      status,
      reference,
      amount_in_cents,
      currency,
      customer_email,
      customer_data,
      payment_method_type,
      payment_method
    } = transaction

    console.log(`[Wompi Webhook] Transacción ${reference} recibida con estado: ${status}`)

    // 2. Validación opcional del checksum de eventos si existe secret
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET
    if (eventsSecret && signature?.checksum && signature?.properties) {
      try {
        const concatenatedValues = signature.properties
          .map((prop: string) => {
            const keys = prop.split('.')
            let val: any = data
            for (const k of keys) {
              val = val?.[k]
            }
            return val
          })
          .join('') + timestamp + eventsSecret

        const calculatedChecksum = crypto
          .createHash('sha256')
          .update(concatenatedValues)
          .digest('hex')

        if (calculatedChecksum !== signature.checksum) {
          console.warn('[Wompi Webhook] Advertencia: Checksum de evento no coincidió')
        }
      } catch (checksumErr) {
        console.warn('[Wompi Webhook] Error al validar checksum:', checksumErr)
      }
    }

    // 3. Procesar Transacción Aprobada (APPROVED)
    if (status === 'APPROVED') {
      const cleanEmail = (customer_email || '').trim().toLowerCase()
      const cleanDoc = (customer_data?.legal_id || customer_data?.legalId || '').toString().trim()
      const fullName = (customer_data?.full_name || customer_data?.fullName || '').trim()
      const phone = (customer_data?.phone_number || customer_data?.phoneNumber || '').trim()
      const docType = customer_data?.legal_id_type || customer_data?.legalIdType || 'C.C.'

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjmpkoezeyhjhrzkw.supabase.co'
      const serviceRoleKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      const initialPassword = cleanDoc && cleanDoc.length >= 6 ? cleanDoc : `${cleanDoc || '1040892341'}2026*`

      // A. Crear o actualizar cuenta del estudiante en Supabase Auth
      let userId: string | null = null

      if (cleanEmail) {
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id, email')
          .eq('email', cleanEmail)
          .maybeSingle()

        userId = existingProfile?.id || null

        if (!userId) {
          const { data: newAuthUser } = await supabaseAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: initialPassword,
            email_confirm: true,
            user_metadata: {
              role: 'student',
              full_name: fullName || 'Estudiante Matriculado',
              document_type: docType,
              document_id: cleanDoc,
              phone: phone,
              origin: 'wompi_checkout'
            }
          })

          if (newAuthUser?.user?.id) {
            userId = newAuthUser.user.id
          }
        }
      }

      const effectiveUserId = userId || crypto.randomUUID()

      // B. Guardar / Actualizar perfil en public.profiles
      if (cleanEmail || cleanDoc) {
        await supabaseAdmin.from('profiles').upsert(
          {
            id: effectiveUserId,
            full_name: fullName || 'Estudiante Matriculado',
            email: cleanEmail || `${cleanDoc}@americandream.edu.co`,
            role: 'student',
            document_type: docType,
            document_number: cleanDoc,
            phone: phone,
            mcer_level: 'A1',
            status: 'active'
          },
          { onConflict: 'id' }
        )
      }

      // C. Registrar Transacción en enrollments_transactions
      try {
        await supabaseAdmin.from('enrollments_transactions').upsert(
          {
            wompi_reference: reference,
            payment_status: 'APPROVED',
            student_id: effectiveUserId,
            product_id: 'ade-ing-a1',
            amount_in_cents: amount_in_cents || 5000000,
            created_at: new Date().toISOString()
          },
          { onConflict: 'wompi_reference' }
        )
      } catch (txErr) {
        console.warn('[Wompi Webhook] Nota en enrollments_transactions:', txErr)
      }

      // D. Registrar / Activar Matrícula Oficial en enrollments
      try {
        await supabaseAdmin.from('enrollments').upsert(
          {
            student_id: effectiveUserId,
            user_id: effectiveUserId,
            course_id: 'ade-ing-a1',
            course_title: 'ENGLISH LEVEL 1 - GENERAL PROGRAM',
            current_level: 'A1',
            status: 'active',
            completed_hours: 0,
            grade: 0.0,
            modality: 'virtual',
            payment_reference: reference,
            amount_paid: amount_in_cents ? amount_in_cents / 100 : 50000,
            payment_status: 'APPROVED',
            wompi_transaction_id: transactionId,
            created_at: new Date().toISOString()
          },
          { onConflict: 'student_id' }
        )
      } catch (enrollErr) {
        console.warn('[Wompi Webhook] Error registrando enrollment:', enrollErr)
      }

      // E. Actualizar lead o liquidación a estado pagado
      try {
        await supabaseAdmin
          .from('leads')
          .update({
            status: 'pagado_matriculado',
            payment_reference: reference
          })
          .eq('email', cleanEmail)
      } catch (leadErr) {
        // Silencioso
      }
    }

    // 4. Responder siempre con 200 a Wompi para confirmar recepción
    return NextResponse.json(
      {
        received: true,
        reference,
        status: status,
        processed_at: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[Wompi Webhook] Error no controlado:', error)
    // Se retorna 200 para evitar que Wompi reintente indefinidamente en fallos de formato
    return NextResponse.json({ error: error.message || 'Error en procesamiento' }, { status: 200 })
  }
}
