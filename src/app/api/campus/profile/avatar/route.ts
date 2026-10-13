import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjnmpkoezeyhjhrzkw.supabase.co'
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const existingAvatarUrl = formData.get('avatarUrl') as string | null
    const userId = (formData.get('userId') as string | null) || ''
    const email = ((formData.get('email') as string | null) || '').toLowerCase().trim()
    const fullName = (formData.get('fullName') as string | null) || ''
    const phone = (formData.get('phone') as string | null) || ''
    const docNumber = (formData.get('docNumber') as string | null) || ''

    const supabaseAdmin = getSupabaseAdmin()
    let resolvedAvatarUrl = existingAvatarUrl || ''

    // 1. Si se envía un archivo de imagen (WebP optimizado u otro formato)
    if (file && file.size > 0) {
      // A. Garantizar que el bucket 'avatars' exista en Supabase Storage
      try {
        const { data: buckets } = await supabaseAdmin.storage.listBuckets()
        const exists = buckets?.some(b => b.id === 'avatars' || b.name === 'avatars')
        if (!exists) {
          await supabaseAdmin.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          })
        }
      } catch (bucketErr) {
        console.warn('Aviso comprobando bucket avatars en Storage:', bucketErr)
      }

      // B. Preparar buffer y nombre único para el archivo
      const buffer = Buffer.from(await file.arrayBuffer())
      const safeId = (userId || email || docNumber || 'user').replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `avatar-${safeId}-${Date.now()}.webp`

      // C. Subir a Supabase Storage con Service Role (bypass total de RLS)
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('avatars')
        .upload(fileName, buffer, {
          contentType: file.type || 'image/webp',
          upsert: true
        })

      if (uploadErr) {
        console.warn('Error subiendo a bucket avatars, probando fallback a forum-attachments:', uploadErr.message)
        // Fallback al bucket forum-attachments
        const { data: fbData, error: fbErr } = await supabaseAdmin.storage
          .from('forum-attachments')
          .upload(`avatars/${fileName}`, buffer, {
            contentType: file.type || 'image/webp',
            upsert: true
          })

        if (!fbErr && fbData?.path) {
          const { data: pubData } = supabaseAdmin.storage
            .from('forum-attachments')
            .getPublicUrl(fbData.path)
          resolvedAvatarUrl = pubData.publicUrl
        } else {
          return NextResponse.json(
            { error: `Error en almacenamiento: ${uploadErr.message}` },
            { status: 500 }
          )
        }
      } else if (uploadData?.path) {
        const { data: pubData } = supabaseAdmin.storage
          .from('avatars')
          .getPublicUrl(uploadData.path)
        resolvedAvatarUrl = pubData.publicUrl
      }
    }

    // 2. Persistir en la tabla public.profiles de Supabase
    try {
      const isUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
      const cleanDoc = docNumber.replace(/\./g, '').trim()

      const updateData: any = {
        avatar_url: resolvedAvatarUrl,
        updated_at: new Date().toISOString()
      }
      if (fullName.trim()) updateData.full_name = fullName.trim()
      if (phone.trim()) updateData.phone = phone.trim()

      // Si es UUID válido en Auth
      if (isUUID) {
        await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('id', userId)

        try {
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: {
              avatar_url: resolvedAvatarUrl,
              full_name: fullName.trim() || undefined,
              phone: phone.trim() || undefined
            }
          })
        } catch (e) {}
      }

      // Actualizar por email
      if (email) {
        await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('email', email)
      }

      // Actualizar por número de documento
      if (docNumber) {
        await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .or(`document_number.eq.${docNumber},document_number.eq.${cleanDoc}`)
      }

      // Si es el usuario demo oficial de Valeria Morales, asegurar upsert con UUID reservado
      if (docNumber.includes('1040892341') || email.includes('valeria.morales') || email.includes('estudiante@americandream')) {
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: 'a1111111-1111-1111-1111-111111111111',
            role: 'student',
            full_name: fullName.trim() || 'Valeria Morales Montoya',
            document_type: 'C.C.',
            document_number: '1.040.892.341',
            phone: phone.trim() || '+57 300 892 3410',
            email: 'valeria.morales@americandream.edu.co',
            mcer_level: 'A1 Principiante',
            avatar_url: resolvedAvatarUrl,
            origin_location: 'Turbo, Antioquia',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
      }
    } catch (dbErr: any) {
      console.warn('Aviso actualizando profiles con avatar_url:', dbErr?.message)
    }

    return NextResponse.json({
      success: true,
      avatarUrl: resolvedAvatarUrl
    })

  } catch (err: any) {
    console.error('Error no controlado en POST /api/campus/profile/avatar:', err)
    return NextResponse.json(
      { error: err.message || 'Error interno procesando el avatar' },
      { status: 500 }
    )
  }
}
