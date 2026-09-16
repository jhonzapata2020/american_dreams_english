import { DonationTier, BusinessSegment, ScholarshipRecipient } from '../types';

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'tier-1',
    usdAmount: 35,
    copAmount: 140000,
    title: 'Acceso Digital & Material',
    subtitle: 'Nivel Inicial',
    impactDescription: 'Financia 1 mes de acceso a la plataforma digital de audio, libros virtuales y licencias educativas para 1 estudiante de Turbo.',
  },
  {
    id: 'tier-2',
    usdAmount: 50,
    copAmount: 200000,
    title: 'Beca Parcial Mensual',
    subtitle: 'Apoyo Directo',
    impactDescription: 'Cubre el 50% de la mensualidad presencial y el acompañamiento docente para un joven de estrato 1 o 2 en Urabá.',
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
    impactDescription: 'Transforma una vida: Beca integral desde cero hasta la certificación B2 laboral, garantizando inserción comercial en Turbo.',
    badge: 'Impacto Transformador'
  }
];

export const BUSINESS_SEGMENTS: BusinessSegment[] = [
  {
    id: 'seg-1',
    number: '01',
    title: 'Subvenciones y Fondo de Becas Internacionales',
    subtitle: 'Impacto Social Directo en Urabá',
    description: 'Recaudación de fondos y alianzas de cooperación internacional para becar a jóvenes de estratos 1 y 2, y víctimas del conflicto armado en Turbo, Antioquia.',
    badge: 'Responsabilidad Social',
    features: [
      'Auditoría pública con código único por becario',
      'Certificados tributarios de donación',
      'Informe trimestral de progreso pedagógico',
      'Alianza con ONG y organismos de cooperación'
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
    title: 'Clases Presenciales en Turbo',
    subtitle: 'Sede Principal en Urabá, Antioquia',
    description: '12 años de trayectoria presencial. Aulas climatizadas, biblioteca bilingüe y entrenamiento conversacional los sábados y domingos.',
    badge: 'Respaldo 12 Años',
    features: [
      'Resolución Oficial 2471 de la Sec. de Educación de Turbo',
      'Galardón "Pisingo de Oro" por labor educativa',
      'Aulas físicas equipadas en el centro de Turbo',
      'Laboratorio de voz semanal en el smartphone'
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
    name: 'Yurleidis Córdoba Palacios',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    vulnerabilityCondition: 'Víctima Conflicto Armado',
    currentCycle: 'B1 Pre-Intermedio',
    accumulatedHours: 95,
    targetHours: 120,
    location: 'Barrio Jesús Mora • Turbo',
    testimonialSnippet: 'El inglés me abrió puertas para trabajar en atención al cliente y aspirar a vacantes en el puerto marítimo de Turbo.',
    status: 'Activo'
  },
  {
    id: 'bec-102',
    name: 'Mateo Andrés Ramos',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    vulnerabilityCondition: 'Estrato 1-2',
    currentCycle: 'A2 Elemental',
    accumulatedHours: 60,
    targetHours: 120,
    location: 'Corregimiento El Tres • Turbo',
    testimonialSnippet: 'Gracias al padrino internacional que financió mi beca, hoy puedo practicar audios todos los días desde mi celular.',
    status: 'Activo'
  },
  {
    id: 'bec-103',
    name: 'Kelly Johanna Martínez',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    vulnerabilityCondition: 'SISBÉN A1-B4',
    currentCycle: 'B2 Intermedio Alto',
    accumulatedHours: 118,
    targetHours: 120,
    location: 'Barrio Buenos Aires • Turbo',
    testimonialSnippet: 'Estoy a pocas horas de certificar el nivel B2. El apoyo del fondo de becas cambió mi expectativa profesional.',
    status: 'En Certificación'
  }
];
