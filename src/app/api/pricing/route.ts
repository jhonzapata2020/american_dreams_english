import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../utils/supabase/admin';
import { getFallbackPricing } from '../../../lib/academicPricing';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'academic_pricing')
      .maybeSingle();

    if (!error && data?.value) {
      return NextResponse.json({ success: true, pricing: data.value });
    }
  } catch (err) {
    console.warn('[API Pricing] Using local fallback:', err);
  }

  const fallback = getFallbackPricing();
  return NextResponse.json({ success: true, pricing: fallback });
}
