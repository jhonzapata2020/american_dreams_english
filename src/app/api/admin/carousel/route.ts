import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../utils/supabase/admin';
import fs from 'fs';
import path from 'path';

export interface CarouselItem {
  id: string;
  type: 'image' | 'video';
  media_url: string;
  title: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

const FALLBACK_PATH = path.join(process.cwd(), 'src/data/carouselFallback.json');

function readFallback(): CarouselItem[] {
  try {
    if (fs.existsSync(FALLBACK_PATH)) {
      return JSON.parse(fs.readFileSync(FALLBACK_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('[Admin Carousel API] Read error:', err);
  }
  return [];
}

function writeFallback(items: CarouselItem[]) {
  try {
    fs.writeFileSync(FALLBACK_PATH, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Admin Carousel API] Write error:', err);
  }
}

// 1. GET: Listar todos los slides (activos e inactivos)
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('carousel_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, items: data });
    }

    const fallback = readFallback();
    fallback.sort((a, b) => a.order_index - b.order_index);
    return NextResponse.json({ success: true, items: fallback });
  } catch (err) {
    console.warn('[Admin Carousel API] Using fallback:', err);
    const fallback = readFallback();
    fallback.sort((a, b) => a.order_index - b.order_index);
    return NextResponse.json({ success: true, items: fallback });
  }
}

// 2. POST: Crear un nuevo slide
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, media_url, title, order_index = 0, is_active = true } = body;

    if (!type || !media_url || !title) {
      return NextResponse.json(
        { error: 'El tipo (image/video), media_url y el título son obligatorios.' },
        { status: 400 }
      );
    }

    const cleanType = type === 'video' ? 'video' : 'image';
    const cleanItem: CarouselItem = {
      id: `car-${Date.now()}`,
      type: cleanType,
      media_url: String(media_url).trim(),
      title: String(title).trim(),
      order_index: Number(order_index) || 0,
      is_active: Boolean(is_active),
      created_at: new Date().toISOString()
    };

    // Intentar inserción en Supabase
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('carousel_items')
        .insert([
          {
            type: cleanItem.type,
            media_url: cleanItem.media_url,
            title: cleanItem.title,
            order_index: cleanItem.order_index,
            is_active: cleanItem.is_active
          }
        ])
        .select()
        .single();

      if (!error && data) {
        cleanItem.id = data.id;
      }
    } catch (sbErr) {
      console.warn('[Admin Carousel API] Supabase insert fallback:', sbErr);
    }

    // Mantener sincronizado el fallback local
    const fallback = readFallback();
    fallback.push(cleanItem);
    fallback.sort((a, b) => a.order_index - b.order_index);
    writeFallback(fallback);

    return NextResponse.json({ success: true, item: cleanItem }, { status: 201 });
  } catch (err: any) {
    console.error('[Admin Carousel API] POST error:', err);
    return NextResponse.json({ error: err.message || 'Error al crear slide' }, { status: 500 });
  }
}

// 3. PUT: Actualizar estado o reordenar
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_active, order_index, title } = body;

    if (!id) {
      return NextResponse.json({ error: 'El id del slide es obligatorio.' }, { status: 400 });
    }

    // Actualizar en Supabase si es posible
    try {
      const supabase = createAdminClient();
      const updatePayload: any = {};
      if (typeof is_active === 'boolean') updatePayload.is_active = is_active;
      if (typeof order_index === 'number') updatePayload.order_index = order_index;
      if (typeof title === 'string') updatePayload.title = title.trim();

      await supabase
        .from('carousel_items')
        .update(updatePayload)
        .eq('id', id);
    } catch (sbErr) {
      console.warn('[Admin Carousel API] Supabase update fallback:', sbErr);
    }

    // Actualizar en fallback local
    const fallback = readFallback();
    const itemIndex = fallback.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      if (typeof is_active === 'boolean') fallback[itemIndex].is_active = is_active;
      if (typeof order_index === 'number') fallback[itemIndex].order_index = order_index;
      if (typeof title === 'string') fallback[itemIndex].title = title.trim();
      fallback.sort((a, b) => a.order_index - b.order_index);
      writeFallback(fallback);
      return NextResponse.json({ success: true, item: fallback[itemIndex] });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Admin Carousel API] PUT error:', err);
    return NextResponse.json({ error: err.message || 'Error al actualizar slide' }, { status: 500 });
  }
}

// 4. DELETE: Eliminar un slide
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'El id del slide es obligatorio.' }, { status: 400 });
    }

    // Eliminar en Supabase si es posible
    try {
      const supabase = createAdminClient();
      await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);
    } catch (sbErr) {
      console.warn('[Admin Carousel API] Supabase delete fallback:', sbErr);
    }

    // Eliminar en fallback local
    const fallback = readFallback();
    const filtered = fallback.filter(item => item.id !== id);
    writeFallback(filtered);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('[Admin Carousel API] DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Error al eliminar slide' }, { status: 500 });
  }
}
