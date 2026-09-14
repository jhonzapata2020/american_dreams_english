import { Challenge, Submission, Program, Student } from '../types';
import { createSynthesizedAudioUrl } from '../utils/audioHelper';

export const CURRENT_CHALLENGE: Challenge = {
  id: 'chal-2026-wk37',
  title: 'Reto 37: Presentación Personal & Vocabulario Comercial en el Golfo de Urabá',
  targetLevel: 'A2',
  weeklyTopic: 'Turismo, Comercio Marítimo y Vida Diaria en Turbo',
  dueDate: 'Próximo Sábado 11:59 PM (Antes de la clase presencial)',
  description: 'Imagina que trabajas en el puerto o en atención al visitante en Turbo. Graba una breve presentación oral de 30 a 60 segundos introduciendo tu nombre, ocupación y recomendando 2 lugares o actividades imperdibles en Urabá.',
  promptText: '"Hello! My name is... I am a student at American Dreams English in Turbo. When you visit Urabá, you must explore..."',
  phoneticTips: [
    'Conecta "must explore" pronunciando /mʌst ɪkˈsplɔːr/ sin pausar entre palabras.',
    'Recuerda la entonación ascendente al enumerar: "the beach ↗, the mangroves ↗, and the local food ↘".',
    'Presta atención a la V labiodental en "visit" /ˈvɪz.ɪt/ y "view" /vjuː/.'
  ],
  samplePhrase: 'Hello team! I live in Turbo, Antioquia. I strongly recommend visiting our port boardwalk and trying the fresh seafood!'
};

export const INITIAL_STUDENTS: Student[] = [
  { id: 'std-1', name: 'Carlos Restrepo', level: 'A2', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', totalSubmissions: 12, averageScore: 4.6 },
  { id: 'std-2', name: 'María Camila Ortiz', level: 'B1', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', totalSubmissions: 15, averageScore: 4.8 },
  { id: 'std-3', name: 'Mateo Ramos', level: 'A1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', totalSubmissions: 6, averageScore: 4.2 },
  { id: 'std-4', name: 'Leidy Johanna Palacios', level: 'A2', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', totalSubmissions: 9, averageScore: 4.5 },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    challengeId: 'chal-2026-wk37',
    studentId: 'std-2',
    studentName: 'María Camila Ortiz',
    studentLevel: 'B1',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    audioUrl: createSynthesizedAudioUrl(5),
    durationSeconds: 38,
    submittedAt: 'Ayer, 4:15 PM',
    status: 'reviewed',
    isSimulated: true,
    feedback: {
      score: 4.8,
      maxScore: 5.0,
      pronunciationNotes: 'Excelente ritmo y entonación natural. Buen manejo del acento en "recommend" y "logistics". Se sugiere suavizar la "r" en "Urabá".',
      classroomNotes: 'Pedirle a María Camila que comparta su audio como ejemplo en el calentamiento de la clase presencial del sábado.',
      reviewedAt: 'Ayer, 7:30 PM',
      teacherName: 'Prof. Jhonathan Miller'
    }
  },
  {
    id: 'sub-102',
    challengeId: 'chal-2026-wk37',
    studentId: 'std-1',
    studentName: 'Carlos Restrepo',
    studentLevel: 'A2',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    audioUrl: createSynthesizedAudioUrl(4),
    durationSeconds: 42,
    submittedAt: 'Hoy, 9:20 AM',
    status: 'pending',
    isSimulated: true
  },
  {
    id: 'sub-103',
    challengeId: 'chal-2026-wk37',
    studentId: 'std-3',
    studentName: 'Mateo Ramos',
    studentLevel: 'A1',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    audioUrl: createSynthesizedAudioUrl(4),
    durationSeconds: 29,
    submittedAt: 'Hoy, 10:45 AM',
    status: 'pending',
    isSimulated: true
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'prog-kids',
    title: 'Kids & Juniors English',
    badge: 'Edades 6 - 13 años',
    targetAudience: 'Niños y adolescentes de Turbo',
    description: 'Desarrollo de confianza oral desde temprana edad mediante juegos fonéticos, canciones y clases interactivas con profesores nativos y bilingües.',
    schedule: 'Sábados presenciales (8:00 AM - 12:00 PM) + Audios semanales en app',
    features: [
      'Fonética práctica para pronunciación limpia',
      'Refuerzo escolar y nivelación comunicativa',
      'Materiales audiovisuales adaptados',
      'Reporte de progreso mensual a los padres'
    ],
    levelRange: 'Pre-A1 a A2',
    iconName: 'Baby'
  },
  {
    id: 'prog-adults',
    title: 'Inglés Híbrido Jóvenes y Adultos',
    badge: '12 Años de Trayectoria',
    targetAudience: 'Estudiantes universitarios, emprendedores y profesionales',
    description: 'Nuestro programa estrella de Blended Learning. Combina la inmersión conversacional del fin de semana con laboratorios semanales de voz.',
    schedule: 'Sábados o Domingos + Plataforma digital activa 24/7',
    features: [
      'Garantía oral con feedback docente personalizado',
      'Preparación para entrevistas laborales bilingües',
      'Enfoque 80% práctico y conversacional',
      'Certificación oficial por niveles MCER (A1, A2, B1, B2)'
    ],
    levelRange: 'A1 a B2 Certificado',
    iconName: 'Users'
  },
  {
    id: 'prog-trade',
    title: 'Inglés Comercial, Portuario y Turístico',
    badge: 'Impulso Urabá 2026',
    targetAudience: 'Trabajadores de comercio, agencias marítimas, hotelería y logística',
    description: 'Diseñado específicamente para las oportunidades del puerto de Turbo y el Golfo de Urabá. Vocabulario técnico y atención directa a extranjeros.',
    schedule: 'Horarios flexibles ejecutivos y grupales',
    features: [
      'Atención al cliente e inglés para negocios regionales',
      'Terminología de comercio internacional y logística',
      'Roleplay de negociaciones y servicios',
      'Convenios empresariales con descuentos de grupo'
    ],
    levelRange: 'A2 a B2 Profesional',
    iconName: 'Anchor'
  },
  {
    id: 'prog-saber',
    title: 'Entrenamiento Saber 11 / Saber Pro',
    badge: 'Alto Rendimiento',
    targetAudience: 'Estudiantes de 10°, 11° y grado universitario',
    description: 'Estrategias de comprensión lectora rápida, resolución de preguntas tipo ICFES y dominio de gramática práctica para puntajes destacados.',
    schedule: 'Intensivo fin de semana (Pre-ICFES)',
    features: [
      'Simulacros reales tipo examen de Estado',
      'Técnicas de descarte e inferencia textual',
      'Vocabulario clave recurrente en pruebas Saber',
      'Seguimiento analítico de fortalezas por competencias'
    ],
    levelRange: 'Entrenamiento Específico',
    iconName: 'GraduationCap'
  }
];

export const PLACEMENT_QUESTIONS = [
  {
    id: 1,
    question: 'How do you usually greet a foreign customer arriving at your business in Turbo?',
    options: [
      { text: '"Hello, welcome to Turbo! How can I help you today?"', level: 'B1' },
      { text: '"Good morning, my name is... nice to meet you."', level: 'A2' },
      { text: '"Hi, yes, what you want?"', level: 'A1' }
    ]
  },
  {
    id: 2,
    question: 'Complete the sentence: "If I _____ free time this weekend, I will visit the Golfo de Urabá beaches."',
    options: [
      { text: 'have', level: 'A2' },
      { text: 'will have', level: 'A1' },
      { text: 'had had', level: 'B2' }
    ]
  },
  {
    id: 3,
    question: 'Which option best describes your current main objective with English?',
    options: [
      { text: 'Conseguir un mejor trabajo o trabajar con el Puerto de Turbo / Comercio internacional.', level: 'B1' },
      { text: 'Perder el miedo a hablar y entender cuando me hacen preguntas.', level: 'A2' },
      { text: 'Empezar desde cero absoluto y construir bases sólidas.', level: 'A1' }
    ]
  }
];
