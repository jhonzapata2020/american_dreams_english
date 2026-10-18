import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../utils/supabase/admin'

function getSupabaseAdmin() {
  return createAdminClient()
}

// Generador de sesiones dinámicas de la semana actual si la base de datos está vacía
function generateDefaultWeekSchedule(levelCode: string) {
  const lvl = levelCode.toUpperCase()
  const now = new Date()
  
  // Buscar el lunes de la semana actual
  const currentDayOfWeek = now.getDay() // 0 = Domingo, 1 = Lunes, ...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + distanceToMonday)
  monday.setHours(19, 0, 0, 0) // 7:00 PM

  const daysConfig = [
    { offset: 0, dayName: 'Lunes', topic: `Grammar Foundations & Sentence Structure (${lvl})` },
    { offset: 1, dayName: 'Martes', topic: `Listening Lab & Phonetics - Accent Polish (${lvl})` },
    { offset: 2, dayName: 'Miércoles', topic: `Conversational Workshop & Interactive Drills (${lvl})` },
    { offset: 3, dayName: 'Jueves', topic: `Speaking Real-Life Interaction & Evaluation (${lvl})` },
  ]

  return daysConfig.map((item, idx) => {
    const sessionDate = new Date(monday)
    sessionDate.setDate(monday.getDate() + item.offset)
    
    return {
      id: `default-${lvl.toLowerCase()}-${idx + 1}`,
      level_code: lvl,
      title: item.topic,
      teams_meeting_url: 'https://teams.microsoft.com/l/meetup-join/american-dream-class',
      scheduled_at: sessionDate.toISOString(),
      duration_minutes: 90,
      is_active: idx === 2 // Miércoles por defecto
    }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const levelParam = (searchParams.get('level') || 'A1').toUpperCase()

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('live_classes')
      .select('*')
      .eq('level_code', levelParam)
      .order('scheduled_at', { ascending: true })

    if (error) {
      console.warn('Aviso Supabase GET /api/live-classes:', error.message)
      const defaults = generateDefaultWeekSchedule(levelParam)
      return NextResponse.json({ success: true, classes: defaults, isDefault: true })
    }

    if (!data || data.length === 0) {
      const defaults = generateDefaultWeekSchedule(levelParam)
      return NextResponse.json({ success: true, classes: defaults, isDefault: true })
    }

    return NextResponse.json({
      success: true,
      classes: data,
      isDefault: false
    })
  } catch (err: any) {
    console.error('Error en GET /api/live-classes:', err)
    const defaults = generateDefaultWeekSchedule('A1')
    return NextResponse.json({ success: true, classes: defaults, isDefault: true })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      level_code = 'A1',
      title,
      teams_meeting_url,
      scheduled_at,
      duration_minutes = 90,
      is_active = false
    } = body

    if (!title || !teams_meeting_url) {
      return NextResponse.json(
        { error: 'El título de la clase y el enlace de Teams son obligatorios.' },
        { status: 400 }
      )
    }

    const cleanLevel = level_code.toString().toUpperCase()
    const cleanDate = scheduled_at ? new Date(scheduled_at).toISOString() : new Date().toISOString()

    const supabaseAdmin = getSupabaseAdmin()

    // Si se marca como activa, desactivar las demás de ese nivel
    if (is_active) {
      await supabaseAdmin
        .from('live_classes')
        .update({ is_active: false })
        .eq('level_code', cleanLevel)
    }

    const { data, error } = await supabaseAdmin
      .from('live_classes')
      .insert([
        {
          level_code: cleanLevel,
          title: title.trim(),
          teams_meeting_url: teams_meeting_url.trim(),
          scheduled_at: cleanDate,
          duration_minutes: Number(duration_minutes) || 90,
          is_active: Boolean(is_active)
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error al insertar en live_classes:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, liveClass: data })
  } catch (err: any) {
    console.error('Error en POST /api/live-classes:', err)
    return NextResponse.json({ error: err.message || 'Error interno.' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      id,
      level_code,
      title,
      teams_meeting_url,
      scheduled_at,
      duration_minutes,
      is_active,
      updateAllUrlsForLevel
    } = body

    const supabaseAdmin = getSupabaseAdmin()

    // Actualizar el enlace de Teams para todas las clases de ese nivel
    if (updateAllUrlsForLevel && level_code && teams_meeting_url) {
      const cleanLevel = level_code.toString().toUpperCase()
      const { data, error } = await supabaseAdmin
        .from('live_classes')
        .update({ teams_meeting_url: teams_meeting_url.trim() })
        .eq('level_code', cleanLevel)
        .select()

      if (error) {
        console.error('Error al actualizar enlaces de Teams para el nivel:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, updated: data })
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de clase en vivo requerido.' }, { status: 400 })
    }

    const updatePayload: Record<string, any> = {}
    if (title) updatePayload.title = title.trim()
    if (teams_meeting_url) updatePayload.teams_meeting_url = teams_meeting_url.trim()
    if (scheduled_at) updatePayload.scheduled_at = new Date(scheduled_at).toISOString()
    if (duration_minutes !== undefined) updatePayload.duration_minutes = Number(duration_minutes)
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active)

    // Si se activa, desactivar las demás del nivel
    if (is_active && level_code) {
      await supabaseAdmin
        .from('live_classes')
        .update({ is_active: false })
        .eq('level_code', level_code.toString().toUpperCase())
    }

    const { data, error } = await supabaseAdmin
      .from('live_classes')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar live_classes:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, liveClass: data })
  } catch (err: any) {
    console.error('Error en PUT /api/live-classes:', err)
    return NextResponse.json({ error: err.message || 'Error interno.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin.from('live_classes').delete().eq('id', id)

    if (error) {
      console.error('Error al eliminar clase en vivo:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error en DELETE /api/live-classes:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
