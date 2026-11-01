import fs from 'fs';
import path from 'path';

export interface PricingPlan {
  matricula: number;
  mensualidad: number;
}

export interface AcademicPricingData {
  presencial: {
    ninos: PricingPlan;
    adultos: PricingPlan;
    becaElegible: boolean;
  };
  virtual: {
    ninos: PricingPlan;
    adultos: PricingPlan;
    becaElegible: boolean;
  };
  becados: {
    ninos: PricingPlan;
    adultos: PricingPlan;
    porcentajeSubvencion: number;
  };
  subvencionesInfo: {
    aplicaPara: string;
    titulo: string;
    descripcion: string;
    requisito: string;
  };
  updatedAt: string;
}

export function getFallbackPricing(): AcademicPricingData {
  try {
    const filePath = path.join(process.cwd(), 'src/data/pricingFallback.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[Pricing] Error reading fallback file:', err);
  }
  return {
    presencial: {
      ninos: { matricula: 50000, mensualidad: 150000 },
      adultos: { matricula: 50000, mensualidad: 200000 },
      becaElegible: true
    },
    virtual: {
      ninos: { matricula: 50000, mensualidad: 250000 },
      adultos: { matricula: 50000, mensualidad: 300000 },
      becaElegible: false
    },
    becados: {
      ninos: { matricula: 25000, mensualidad: 75000 },
      adultos: { matricula: 25000, mensualidad: 100000 },
      porcentajeSubvencion: 50
    },
    subvencionesInfo: {
      aplicaPara: 'Sede Presencial Turbo - Urabá (Exclusivo)',
      titulo: 'Subvenciones y Becas Sociales Comunitarias',
      descripcion: 'El Fondo de Becas ADE está destinado con estricto sentido ético exclusivamente a niños, jóvenes y adultos de bajos recursos de la región de Urabá que asisten presencialmente a nuestras instalaciones físicas.',
      requisito: 'Residencia en Urabá, estrato 1 o 2 / SISBÉN A o B y modalidad presencial.'
    },
    updatedAt: new Date().toISOString()
  };
}
