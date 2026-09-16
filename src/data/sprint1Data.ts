import { DonationTier, BusinessSegment, ScholarshipRecipient, CohortMetrics } from '../types';

export const COHORT_METRICS: CohortMetrics = {
  totalActiveScholars: 64,
  totalFundedHours: 3840,
  completionRate: '92%',
  certifiedStudentsMCER: 48,
};

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'tier-1',
    usdAmount: 35,
    copAmount: 140000,
    title: 'Acceso Digital & Material',
    subtitle: 'Nivel Inicial',
    impactDescription: 'Financia 1 mes de acceso a la plataforma digital de audio, libros virtuales y licencias educativas para 1 estudiante de Urabá.',
  },
  {
    id: 'tier-2',
    usdAmount: 50,
    copAmount: 200000,
    title: 'Beca Parcial Mensual',
    subtitle: 'Apoyo Directo',
    impactDescription: 'Cubre el 50% de la mensualidad presencial y el acompañamiento docente para un estudiante en Urabá.',
    recommended: true,
    badge: 'Más Elegido'
  },
  {
    id: 'tier-3',
    usdAmount: 250,
    copAmount: 1000000,
    title: 'Patrocinio Ciclo Completo',
    subtitle: '120 Horas Certificadas',
    impactDescription: 'Patrocina 1 nivel completo del MCER (A1, A2, B1 o B2) incluyendo laboratorios conversacionales y materiales físicos.',
  },
  {
    id: 'tier-4',
    usdAmount: 1500,
    copAmount: 6000000,
    title: 'Beca Total Bilingüe',
    subtitle: 'Programa A1 a B2',
    impactDescription: 'Transformación integral: Beca completa desde nivel inicial hasta la certificación B2 laboral, garantizando inserción comercial.',
    badge: 'Impacto Transformador'
  }
];

export const BUSINESS_SEGMENTS: BusinessSegment[] = [
  {
    id: 'seg-1',
    number: '01',
    title: 'Subvenciones y Fondo de Becas Internacionales',
    subtitle: 'Impacto Social Directo en Urabá',
    description: 'Recaudación de fondos y alianzas de cooperación internacional para becar a jóvenes con talento en Turbo, Antioquia.',
    badge: 'Responsabilidad Social',
    features: [
      'Auditoría pública con código único anonimizado por becario',
      'Certificados tributarios de donación deducibles',
      'Informe trimestral de progreso pedagógico MCER',
      'Alianza con organismos de cooperación e inclusión'
    ],
    ctaText: 'Donar a Fondo de Becas',
    ctaAction: 'donate',
    gradientBg: 'from-navy-900 to-navy-800',
    iconName: 'HeartHandshake'
  },
  {
    id: 'seg-2',
    number: '02',
    title: 'Tienda de Infoproductos Digitales',
    subtitle: 'Aprende a tu Propio Ritmo 24/7',
    description: 'E-books interactivos, guías de fonética y Masterclasses exclusivas en video 4K producidas por docentes bilingües certificados bajo el MCER.',
    badge: '100% Digital',
    features: [
      'Masterclasses en resolución 4K',
      'Descarga inmediata de E-books en PDF/EPUB',
      'Audios fonéticos de pronunciación descargables',
      'Acceso de por vida desde cualquier dispositivo'
    ],
    ctaText: 'Explorar Cursos Digitales',
    ctaAction: 'catalog',
    gradientBg: 'from-blue-900 to-indigo-900',
    iconName: 'BookOpen'
  },
  {
    id: 'seg-3',
    number: '03',
    title: 'Clases Virtuales en Vivo',
    subtitle: 'Grupos Reducidos (Máx. 12 Alumnos)',
    description: 'Aulas sincrónicas interactivas guiadas por profesores en tiempo real a través de Zoom, Microsoft Teams y Google Meet con enfoque 100% conversacional.',
    badge: 'Sincrónico Interactivo',
    features: [
      'Máximo 12 estudiantes por sala para interacción real',
      'Horarios flexibles entre semana y fines de semana',
      'Simulacros de entrevistas de trabajo en inglés',
      'Grabaciones de clase disponibles por 30 días'
    ],
    ctaText: 'Ver Horarios en Vivo',
    ctaAction: 'live',
    gradientBg: 'from-indigo-950 to-slate-900',
    iconName: 'Video'
  },
  {
    id: 'seg-4',
    number: '04',
    title: 'Clases Presenciales & Sede Urabá',
    subtitle: 'Acceso en Transporte Público desde Apartadó, Currulao y la Región',
    description: '12 años de trayectoria presencial. Aulas climatizadas y transporte público directo para estudiantes de Apartadó, Currulao y municipios vecinos.',
    badge: 'Respaldo 12 Años',
    features: [
      'Acceso rápido en transporte público desde Apartadó, Currulao y Urabá',
      'Resolución Oficial 2471 de la Sec. de Educación',
      'Galardón "Pisingo de Oro" a la Excelencia',
      'Plataforma Virtual Global con clases en línea 24/7'
    ],
    ctaText: 'Conocer Sede Presencial',
    ctaAction: 'campus',
    gradientBg: 'from-slate-900 to-navy-950',
    iconName: 'Building2'
  }
];

export const SCHOLARSHIP_RECIPIENTS: ScholarshipRecipient[] = [
  {
    id: 'bec-101',
    anonymizedCode: 'Becario #URB-101',
    programCategory: 'Programa Talento & Bilingüismo Urabá',
    currentCycle: 'B1 Pre-Intermedio',
    accumulatedHours: 95,
    targetHours: 120,
    location: 'Distrito de Turbo, Antioquia',
    impactAchievementQuote: 'El inglés me ha abierto puertas para calificar a procesos de selección en operaciones de comercio internacional en Urabá.',
    academicStatus: 'En curso'
  },
  {
    id: 'bec-102',
    anonymizedCode: 'Becario #URB-102',
    programCategory: 'Programa Talento & Bilingüismo Urabá',
    currentCycle: 'A2 Elemental',
    accumulatedHours: 60,
    targetHours: 120,
    location: 'Distrito de Turbo, Antioquia',
    impactAchievementQuote: 'Gracias al fondo de becas puedo practicar audios de pronunciación diariamente y avanzar en mis metas académicas.',
    academicStatus: 'En curso'
  },
  {
    id: 'bec-103',
    anonymizedCode: 'Becario #URB-103',
    programCategory: 'Programa Talento & Bilingüismo Urabá',
    currentCycle: 'B2 Intermedio Alto',
    accumulatedHours: 118,
    targetHours: 120,
    location: 'Distrito de Turbo, Antioquia',
    impactAchievementQuote: 'Estoy a pocas horas de certificar el nivel B2 laboral. El acompañamiento pedagógico ha sido determinante.',
    academicStatus: 'En certificación'
  }
];
