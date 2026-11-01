import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../../utils/supabase/admin';
import fs from 'fs';
import path from 'path';
import { AcademicPricingData, getFallbackPricing } from '../../../../lib/academicPricing';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = getFallbackPricing();

    const updated: AcademicPricingData = {
      presencial: {
        ninos: {
          matricula: Number(body?.presencial?.ninos?.matricula) >= 0 ? Number(body.presencial.ninos.matricula) : current.presencial.ninos.matricula,
          mensualidad: Number(body?.presencial?.ninos?.mensualidad) >= 0 ? Number(body.presencial.ninos.mensualidad) : current.presencial.ninos.mensualidad,
        },
        adultos: {
          matricula: Number(body?.presencial?.adultos?.matricula) >= 0 ? Number(body.presencial.adultos.matricula) : current.presencial.adultos.matricula,
          mensualidad: Number(body?.presencial?.adultos?.mensualidad) >= 0 ? Number(body.presencial.adultos.mensualidad) : current.presencial.adultos.mensualidad,
        },
        becaElegible: true,
      },
      virtual: {
        ninos: {
          matricula: Number(body?.virtual?.ninos?.matricula) >= 0 ? Number(body.virtual.ninos.matricula) : current.virtual.ninos.matricula,
          mensualidad: Number(body?.virtual?.ninos?.mensualidad) >= 0 ? Number(body.virtual.ninos.mensualidad) : current.virtual.ninos.mensualidad,
        },
        adultos: {
          matricula: Number(body?.virtual?.adultos?.matricula) >= 0 ? Number(body.virtual.adultos.matricula) : current.virtual.adultos.matricula,
          mensualidad: Number(body?.virtual?.adultos?.mensualidad) >= 0 ? Number(body.virtual.adultos.mensualidad) : current.virtual.adultos.mensualidad,
        },
        becaElegible: false,
      },
      becados: {
        ninos: {
          matricula: Number(body?.becados?.ninos?.matricula) >= 0 ? Number(body.becados.ninos.matricula) : current.becados.ninos.matricula,
          mensualidad: Number(body?.becados?.ninos?.mensualidad) >= 0 ? Number(body.becados.ninos.mensualidad) : current.becados.ninos.mensualidad,
        },
        adultos: {
          matricula: Number(body?.becados?.adultos?.matricula) >= 0 ? Number(body.becados.adultos.matricula) : current.becados.adultos.matricula,
          mensualidad: Number(body?.becados?.adultos?.mensualidad) >= 0 ? Number(body.becados.adultos.mensualidad) : current.becados.adultos.mensualidad,
        },
        porcentajeSubvencion: Number(body?.becados?.porcentajeSubvencion) >= 0 ? Number(body.becados.porcentajeSubvencion) : current.becados.porcentajeSubvencion,
      },
      subvencionesInfo: {
        aplicaPara: body?.subvencionesInfo?.aplicaPara || current.subvencionesInfo.aplicaPara,
        titulo: body?.subvencionesInfo?.titulo || current.subvencionesInfo.titulo,
        descripcion: body?.subvencionesInfo?.descripcion || current.subvencionesInfo.descripcion,
        requisito: body?.subvencionesInfo?.requisito || current.subvencionesInfo.requisito,
      },
      updatedAt: new Date().toISOString()
    };

    // 1. Guardar en archivo local para persistencia instantánea
    try {
      const filePath = path.join(process.cwd(), 'src/data/pricingFallback.json');
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (fsErr) {
      console.error('[API Admin Pricing] Error writing file:', fsErr);
    }

    // 2. Guardar en Supabase si la tabla existe
    try {
      const supabase = createAdminClient();
      await supabase
        .from('site_settings')
        .upsert({
          key: 'academic_pricing',
          value: updated,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
    } catch (dbErr) {
      console.warn('[API Admin Pricing] Supabase upsert non-critical warning:', dbErr);
    }

    return NextResponse.json({ success: true, pricing: updated });
  } catch (err: any) {
    console.error('[API Admin Pricing] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Error guardando tarifas' }, { status: 500 });
  }
}
