import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      audience = 'para_mi' 
    } = body

    const cleanFirstName = (first_name || '').trim()
    const cleanLastName = (last_name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPhone = (phone || '').trim()
    const cleanAudience = (audience || 'para_mi').trim()

    if (!cleanFirstName || !cleanEmail || !cleanPhone) {
      return NextResponse.json(
        { error: 'El nombre, correo electrónico y teléfono son obligatorios.' },
        { status: 400 }
      )
    }

    // 1. Guardar en Base de Datos Supabase (tabla leads)
    const supabaseAdmin = createAdminClient()

    const { data: leadData, error: dbError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          first_name: cleanFirstName,
          last_name: cleanLastName,
          email: cleanEmail,
          phone: cleanPhone,
          audience: cleanAudience,
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error('[API Leads] Error al insertar en Supabase:', dbError)
      return NextResponse.json(
        { error: 'No se pudo guardar el prospecto en la base de datos.' },
        { status: 500 }
      )
    }

    // 2. Disparar Notificación a WhatsApp de Anthony vía Meta Cloud API
    const whatsappToken = process.env.WHATSAPP_API_TOKEN
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID
    const targetPhone = process.env.WHATSAPP_NOTIFY_NUMBER || '573127459728'
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME

    let whatsappSent = false
    let whatsappError = null

    if (whatsappToken && whatsappPhoneId) {
      try {
        const audienceLabel = cleanAudience === 'para_mi_hijo' ? 'Para mi hijo/a' : 'Para mí (Adulto)'
        const fullName = `${cleanFirstName} ${cleanLastName}`.trim()

        let payload: any

        if (templateName) {
          // Envío con Plantilla aprobada de Meta
          payload = {
            messaging_product: 'whatsapp',
            to: targetPhone,
            type: 'template',
            template: {
              name: templateName,
              language: { code: 'es' },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: fullName },
                    { type: 'text', text: cleanPhone },
                    { type: 'text', text: cleanEmail },
                    { type: 'text', text: audienceLabel },
                  ],
                },
              ],
            },
          }
        } else {
          // Envío como mensaje de texto directo (útil en sandbox o ventana activa de 24h)
          const textMessage = `🚀 *¡NUEVO LEAD REGISTRADO EN AMERICAN DREAM ENGLISH!*\n\n` +
            `👤 *Nombre:* ${fullName}\n` +
            `📱 *WhatsApp:* ${cleanPhone}\n` +
            `✉️ *Correo:* ${cleanEmail}\n` +
            `🎯 *Modalidad:* ${audienceLabel}\n\n` +
            `👉 *Iniciar conversación:* https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}`

          payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: targetPhone,
            type: 'text',
            text: {
              preview_url: true,
              body: textMessage,
            },
          }
        }

        const metaResponse = await fetch(
          `https://graph.facebook.com/v20.0/${whatsappPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${whatsappToken}`,
            },
            body: JSON.stringify(payload),
          }
        )

        const metaResult = await metaResponse.json()

        if (metaResponse.ok) {
          whatsappSent = true
          console.log('[API Leads] Notificación WhatsApp enviada exitosamente a Anthony:', metaResult)
        } else {
          whatsappError = metaResult
          console.warn('[API Leads] Meta API devolvió advertencia/error:', metaResult)
        }
      } catch (err: any) {
        console.error('[API Leads] Excepción al invocar WhatsApp Meta API:', err)
        whatsappError = err.message
      }
    } else {
      console.log('[API Leads] Meta WhatsApp API no configurada aún en .env.local (WHATSAPP_API_TOKEN / WHATSAPP_PHONE_ID). Lead guardado exitosamente en base de datos.')
    }

    return NextResponse.json({
      success: true,
      lead: leadData,
      whatsappNotification: {
        attempted: Boolean(whatsappToken && whatsappPhoneId),
        sent: whatsappSent,
        error: whatsappError,
      },
    })
  } catch (error: any) {
    console.error('[API Leads] Error inesperado en el endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor procesando el prospecto.' },
      { status: 500 }
    )
  }
}
