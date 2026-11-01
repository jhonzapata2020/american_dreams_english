import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../utils/supabase/admin';
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

function getFallbackItems(): CarouselItem[] {
  try {
    const filePath = path.join(process.cwd(), 'src/data/carouselFallback.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[API Carousel] Error reading fallback file:', err);
  }
  return [];
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('carousel_items')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, items: data });
    }

    // Si la tabla no está creada aún o está vacía, usamos el fallback local
    const fallback = getFallbackItems().filter(item => item.is_active);
    fallback.sort((a, b) => a.order_index - b.order_index);
    return NextResponse.json({ success: true, items: fallback });
  } catch (err) {
    console.warn('[API Carousel] Using fallback due to error:', err);
    const fallback = getFallbackItems().filter(item => item.is_active);
    fallback.sort((a, b) => a.order_index - b.order_index);
    return NextResponse.json({ success: true, items: fallback });
  }
}
