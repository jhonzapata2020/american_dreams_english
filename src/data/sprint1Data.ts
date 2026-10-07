import { DonationTier, BusinessSegment, ScholarshipRecipient, CohortMetrics } from '../types';

export const COHORT_METRICS_ES: CohortMetrics = {
  totalActiveScholars: 64,
  totalFundedHours: 3840,
  completionRate: '92%',
  certifiedStudentsMCER: 48,
};

export const COHORT_METRICS_EN: CohortMetrics = {
  totalActiveScholars: 64,
  totalFundedHours: 3840,
  completionRate: '92%',
  certifiedStudentsMCER: 48,
};

export const COHORT_METRICS = COHORT_METRICS_ES;

export const DONATION_TIERS_ES: DonationTier[] = [
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

export const DONATION_TIERS_EN: DonationTier[] = [
  {
    id: 'tier-1',
    usdAmount: 35,
    copAmount: 140000,
    title: 'Digital Access & Materials',
    subtitle: 'Starter Level',
    impactDescription: 'Funds 1 month of access to the digital audio platform, virtual textbooks, and educational licenses for 1 student in Urabá.',
  },
  {
    id: 'tier-2',
    usdAmount: 50,
    copAmount: 200000,
    title: 'Monthly Partial Scholarship',
    subtitle: 'Direct Support',
    impactDescription: 'Covers 50% of on-campus tuition and dedicated faculty mentorship for a student in Urabá.',
    recommended: true,
    badge: 'Most Popular'
  },
  {
    id: 'tier-3',
    usdAmount: 250,
    copAmount: 1000000,
    title: 'Full Cycle Sponsorship',
    subtitle: '120 Certified Hours',
    impactDescription: 'Sponsors 1 complete CEFR level (A1, A2, B1, or B2) including conversational speech labs and study materials.',
  },
  {
    id: 'tier-4',
    usdAmount: 1500,
    copAmount: 6000000,
    title: 'Complete Bilingual Scholarship',
    subtitle: 'A1 to B2 Pathway',
    impactDescription: 'Full scholarship from foundation to B2 career certification, enabling global employment opportunities.',
    badge: 'Transformative Impact'
  }
];

export const DONATION_TIERS = DONATION_TIERS_ES;

export const BUSINESS_SEGMENTS_ES: BusinessSegment[] = [
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

export const BUSINESS_SEGMENTS_EN: BusinessSegment[] = [
  {
    id: 'seg-1',
    number: '01',
    title: 'Grants & International Scholarship Fund',
    subtitle: 'Direct Social Impact in Urabá',
    description: 'Fundraising and international cooperation alliances to sponsor talented youth in Turbo, Antioquia.',
    badge: 'Social Responsibility',
    features: [
      'Public audit with unique anonymized scholar ID',
      'Tax-deductible donation certificates',
      'Quarterly CEFR pedagogical progress reports',
      'Alliances with international cooperation & inclusion agencies'
    ],
    ctaText: 'Donate to Scholarship Fund',
    ctaAction: 'donate',
    gradientBg: 'from-navy-900 to-navy-800',
    iconName: 'HeartHandshake'
  },
  {
    id: 'seg-2',
    number: '02',
    title: 'Digital Infoproducts Store',
    subtitle: 'Learn at Your Own Pace 24/7',
    description: 'Interactive e-books, phonetics guides, and exclusive 4K masterclasses produced by CEFR-certified bilingual faculty.',
    badge: '100% Digital',
    features: [
      'Masterclasses in ultra-clear 4K resolution',
      'Instant download of e-books in PDF/EPUB',
      'Downloadable phonetic pronunciation audio tracks',
      'Lifetime access from any device'
    ],
    ctaText: 'Explore Digital Courses',
    ctaAction: 'catalog',
    gradientBg: 'from-blue-900 to-indigo-900',
    iconName: 'BookOpen'
  },
  {
    id: 'seg-3',
    number: '03',
    title: 'Live Virtual Classes',
    subtitle: 'Small Cohorts (Max. 12 Students)',
    description: 'Live interactive classrooms guided in real-time by teachers via Zoom, Microsoft Teams, and Google Meet with a 100% conversational focus.',
    badge: 'Live Interactive',
    features: [
      'Maximum 12 students per cohort for genuine speaking practice',
      'Flexible weekday and weekend schedules',
      'Mock job interviews in professional English',
      'Class recordings available on-demand for 30 days'
    ],
    ctaText: 'View Live Schedules',
    ctaAction: 'live',
    gradientBg: 'from-indigo-950 to-slate-900',
    iconName: 'Video'
  },
  {
    id: 'seg-4',
    number: '04',
    title: 'On-Campus Classes & Urabá Campus',
    subtitle: 'Direct Transit from Apartadó, Currulao and the Region',
    description: '12 years of established on-campus excellence. Climate-controlled classrooms and direct transit for students from Apartadó, Currulao, and nearby towns.',
    badge: '12-Year Track Record',
    features: [
      'Fast transit access from Apartadó, Currulao, and Urabá',
      'Official Education Ministry Resolution No. 2471',
      '"Pisingo de Oro" Civic & Educational Excellence Award',
      'Global Virtual Campus with 24/7 online access'
    ],
    ctaText: 'Explore On-Campus Headquarters',
    ctaAction: 'campus',
    gradientBg: 'from-slate-900 to-navy-950',
    iconName: 'Building2'
  }
];

export const BUSINESS_SEGMENTS = BUSINESS_SEGMENTS_ES;

export const SCHOLARSHIP_RECIPIENTS_ES: ScholarshipRecipient[] = [
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

export const SCHOLARSHIP_RECIPIENTS_EN: ScholarshipRecipient[] = [
  {
    id: 'bec-101',
    anonymizedCode: 'Scholar #URB-101',
    programCategory: 'Urabá Bilingual & Talent Initiative',
    currentCycle: 'B1 Pre-Intermedio',
    accumulatedHours: 95,
    targetHours: 120,
    location: 'District of Turbo, Antioquia',
    impactAchievementQuote: 'English has opened doors for me to qualify for international commerce and logistics job selection in Urabá.',
    academicStatus: 'En curso'
  },
  {
    id: 'bec-102',
    anonymizedCode: 'Scholar #URB-102',
    programCategory: 'Urabá Bilingual & Talent Initiative',
    currentCycle: 'A2 Elemental',
    accumulatedHours: 60,
    targetHours: 120,
    location: 'District of Turbo, Antioquia',
    impactAchievementQuote: 'Thanks to the scholarship fund, I can practice pronunciation daily and advance toward my academic goals.',
    academicStatus: 'En curso'
  },
  {
    id: 'bec-103',
    anonymizedCode: 'Scholar #URB-103',
    programCategory: 'Urabá Bilingual & Talent Initiative',
    currentCycle: 'B2 Intermedio Alto',
    accumulatedHours: 118,
    targetHours: 120,
    location: 'District of Turbo, Antioquia',
    impactAchievementQuote: 'I am just a few hours away from B2 career certification. The faculty mentorship has been truly vital.',
    academicStatus: 'En certificación'
  }
];

export const SCHOLARSHIP_RECIPIENTS = SCHOLARSHIP_RECIPIENTS_ES;

export function getBusinessSegments(lang: 'es' | 'en' = 'es'): BusinessSegment[] {
  return lang === 'en' ? BUSINESS_SEGMENTS_EN : BUSINESS_SEGMENTS_ES;
}

export function getDonationTiers(lang: 'es' | 'en' = 'es'): DonationTier[] {
  return lang === 'en' ? DONATION_TIERS_EN : DONATION_TIERS_ES;
}

export function getScholarshipRecipients(lang: 'es' | 'en' = 'es'): ScholarshipRecipient[] {
  return lang === 'en' ? SCHOLARSHIP_RECIPIENTS_EN : SCHOLARSHIP_RECIPIENTS_ES;
}

export function getCohortMetrics(lang: 'es' | 'en' = 'es'): CohortMetrics {
  return lang === 'en' ? COHORT_METRICS_EN : COHORT_METRICS_ES;
}
