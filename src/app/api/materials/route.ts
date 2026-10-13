import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://grfjnmpkoezeyhjhrzkw.supabase.co'
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_0N0XR9pwO_83Y_t75aie1g_ajIRgD1O'

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const levelParam = (searchParams.get('level') || searchParams.get('level_code') || '').toUpperCase()

    const supabaseAdmin = getSupabaseAdmin()
    let query = supabaseAdmin.from('course_materials').select('*').order('created_at', { ascending: false })

    if (levelParam) {
      query = query.eq('level_code', levelParam)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Aviso Supabase GET /api/materials:', error.message)
      return NextResponse.json({ success: true, materials: [] })
    }

    return NextResponse.json({
      success: true,
      materials: data || []
    })
  } catch (err: any) {
    console.error('Error en GET /api/materials:', err)
    return NextResponse.json({ success: true, materials: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      file_url,
      downloadUrl,
      level,
      level_code
    } = body

    if (!title) {
      return NextResponse.json({ error: 'El título del material es obligatorio.' }, { status: 400 })
    }

    const finalLevelCode = (level_code || level || 'A1').toString().toUpperCase()
    const finalFileUrl = (file_url || downloadUrl || 'https://american-dreams-platform.vercel.app').trim()

    const supabaseAdmin = getSupabaseAdmin()

    // Note: resource_type has a database check constraint, so we insert without it or null
    const { data, error } = await supabaseAdmin
      .from('course_materials')
      .insert([
        {
          level_code: finalLevelCode,
          title: title.trim(),
          file_url: finalFileUrl
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error insertando material en Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, material: data })
  } catch (err: any) {
    console.error('Error en POST /api/materials:', err)
    return NextResponse.json({ error: err.message || 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, file_url, downloadUrl } = body

    if (!id && !title) {
      return NextResponse.json({ error: 'ID o título requerido para actualizar.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const updatePayload: Record<string, any> = {}

    if (title) updatePayload.title = title.trim()
    if (file_url || downloadUrl) updatePayload.file_url = (file_url || downloadUrl).trim()

    let query = supabaseAdmin.from('course_materials').update(updatePayload)
    if (id) {
      query = query.eq('id', id)
    } else {
      query = query.eq('title', title.trim())
    }

    const { data, error } = await query.select()

    if (error) {
      console.error('Error actualizando material:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: data })
  } catch (err: any) {
    console.error('Error en PUT /api/materials:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de material requerido.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from('course_materials').delete().eq('id', id)

    if (error) {
      console.error('Error eliminando material:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error en DELETE /api/materials:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
