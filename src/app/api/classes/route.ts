import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/admin'

const COURSE_UUIDS_BY_LEVEL: Record<string, string> = {
  a1: 'b623de10-0d1e-4eb9-a285-df5e043762b8',
  a2: '9a6fb5ea-7202-4f58-99fa-4350fff3ba53',
  b1: 'bdac7da9-d7a8-4d25-b1a5-c66cf2671d4c',
  b2: '09cef8f3-f0f9-4c8a-a787-520e495b8311'
}

const DEFAULT_TEACHER_ID = '5ad0e5bc-e820-4ce6-b8be-23b1e08cfffe'

function getSupabaseAdmin() {
  return createAdminClient()
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const levelParam = (searchParams.get('level') || '').toLowerCase()
    const courseIdParam = searchParams.get('course_id')

    const supabaseAdmin = getSupabaseAdmin()
    let query = supabaseAdmin.from('classes').select('*').order('scheduled_at', { ascending: false })

    if (courseIdParam) {
      query = query.eq('course_id', courseIdParam)
    } else if (levelParam && COURSE_UUIDS_BY_LEVEL[levelParam]) {
      query = query.eq('course_id', COURSE_UUIDS_BY_LEVEL[levelParam])
    }

    const { data, error } = await query

    if (error) {
      console.warn('Aviso Supabase GET /api/classes:', error.message)
      return NextResponse.json({ success: true, classes: [] })
    }

    return NextResponse.json({
      success: true,
      classes: data || []
    })
  } catch (err: any) {
    console.error('Error en GET /api/classes:', err)
    return NextResponse.json({ success: true, classes: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      videoUrl,
      meeting_link,
      level = 'a1',
      teacherId,
      scheduledAt,
      location = 'Microsoft Teams',
      status = 'completed'
    } = body

    if (!title) {
      return NextResponse.json({ error: 'El título de la clase es obligatorio.' }, { status: 400 })
    }

    const cleanLevel = level.toString().toLowerCase()
    const courseId = COURSE_UUIDS_BY_LEVEL[cleanLevel] || COURSE_UUIDS_BY_LEVEL.a1
    const link = videoUrl || meeting_link || 'https://teams.microsoft.com'
    const finalTeacherId = teacherId || DEFAULT_TEACHER_ID

    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('classes')
      .insert([
        {
          course_id: courseId,
          teacher_id: finalTeacherId,
          title: title.trim(),
          meeting_link: link.trim(),
          location,
          status,
          scheduled_at: scheduledAt || new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error insertando clase en Supabase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, class: data })
  } catch (err: any) {
    console.error('Error en POST /api/classes:', err)
    return NextResponse.json({ error: err.message || 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, videoUrl, meeting_link, status } = body

    if (!id && !title) {
      return NextResponse.json({ error: 'ID o título requerido para actualizar.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const updatePayload: Record<string, any> = {}

    if (title) updatePayload.title = title.trim()
    if (videoUrl || meeting_link) updatePayload.meeting_link = (videoUrl || meeting_link).trim()
    if (status) updatePayload.status = status

    let query = supabaseAdmin.from('classes').update(updatePayload)
    if (id) {
      query = query.eq('id', id)
    } else {
      query = query.eq('title', title.trim())
    }

    const { data, error } = await query.select()

    if (error) {
      console.error('Error actualizando clase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: data })
  } catch (err: any) {
    console.error('Error en PUT /api/classes:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de clase requerido.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from('classes').delete().eq('id', id)

    if (error) {
      console.error('Error eliminando clase:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error en DELETE /api/classes:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
