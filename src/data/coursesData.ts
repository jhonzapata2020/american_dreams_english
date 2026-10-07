export interface CourseModule {
  number: string | number
  title: string
  description: string
}

export interface CourseFAQ {
  question: string
  answer: string
}

export interface CourseProgram {
  id: string
  slug: string
  category: 'Adultos' | 'Niños' | 'Intensivo' | 'Empresas'
  title: string
  badge: string
  shortDescription: string
  bullets: string[]
  monthlyFeeCop: number
  monthlyFeeUsd: number
  reservationFeeCop: number
  durationWeeks: number
  hoursTotal: number
  schedule: string
  modality: string
  certificate: string
  videoThumbnail?: string
  objectives: string[]
  modules: CourseModule[]
  faqs: CourseFAQ[]
  popular?: boolean
}

export const COURSE_CATEGORIES = ['Todos', 'Adultos', 'Niños', 'Intensivo', 'Empresas'] as const
export type CourseCategory = typeof COURSE_CATEGORIES[number]

export const COURSES_DATA: CourseProgram[] = [
  {
    id: 'prog-adultos',
    slug: 'adultos',
    category: 'Adultos',
    title: 'Inglés para Jóvenes y Adultos',
    badge: 'A1 – B2 · Presencial / Online',
    shortDescription: 'Inmersión conversacional, laboratorios fonéticos y preparación progresiva MCER (A1 a B2) para el mundo real y laboral.',
    bullets: [
      'Duración: 16 a 24 semanas por nivel (120 hrs certificadas)',
      'Metodología: 100% conversacional & laboratorios de pronunciación',
      'Certificación: Diploma oficial avalado bajo marco MCER'
    ],
    monthlyFeeCop: 200000,
    monthlyFeeUsd: 50,
    reservationFeeCop: 50000,
    durationWeeks: 24,
    hoursTotal: 120,
    schedule: 'Flexibles (Mañana, Tarde, Noche y Sábados)',
    modality: 'En vivo (Teams/Zoom) o Presencial (Sede Urabá)',
    certificate: 'Certificación Oficial MCER Incluida',
    videoThumbnail: '/teacher-anthony.jpg',
    popular: true,
    objectives: [
      'Fluidez conversacional desde la primera semana para situaciones cotidianas y profesionales.',
      'Dominio de estructuras gramaticales prácticas sin memorización abstracta ni reglas complejas.',
      'Entrenamiento fonético con retroalimentación en tiempo real para eliminar acento cerrado.',
      'Preparación integral para entrevistas laborales en inglés y evaluaciones internacionales.'
    ],
    modules: [
      {
        number: '1',
        title: 'Módulo 1: Fundamentos y Fluidez Inicial (A1)',
        description: 'Rompiendo el hielo, rutinas diarias, expresiones esenciales, números, presentaciones personales y base fonética.'
      },
      {
        number: '2',
        title: 'Módulo 2: Comunicación Cotidiana y Social (A2)',
        description: 'Expresión fluida de vivencias pasadas y planes futuros, viajes, aeropuertos, compras y resolución de situaciones diarias.'
      },
      {
        number: '3',
        title: 'Módulo 3: Conversación Independiente y Debates (B1)',
        description: 'Defensa de opiniones, debates de temas de actualidad, redacción de correos formales y comprensión de hablantes nativos.'
      },
      {
        number: '4',
        title: 'Módulo 4: Inglés Profesional de Alto Impacto (B2)',
        description: 'Negociaciones, presentaciones de negocios, simulacro de entrevistas laborales en multinacionales y preparación para certificación.'
      }
    ],
    faqs: [
      {
        question: '¿Necesito tener conocimientos previos para empezar?',
        answer: 'No es necesario. Realizamos un test de nivelación formativo sin costo para ubicarte exactamente en el grupo que corresponde a tu nivel.'
      },
      {
        question: '¿Puedo alternar entre clases virtuales y presenciales?',
        answer: 'Sí. Disponemos de modelo híbrido flexible que te permite tomar clases en vivo por Microsoft Teams o asistir a nuestra sede física en Urabá.'
      },
      {
        question: '¿Qué formas de pago están disponibles?',
        answer: 'Puedes pagar tu matrícula ($50.000 COP) o la mensualidad completa a través de Wompi de forma 100% segura con Nequi, Bancolombia, Tarjeta de Crédito o PSE.'
      }
    ]
  },
  {
    id: 'prog-ninos',
    slug: 'ninos',
    category: 'Niños',
    title: 'Kids & Teens: Inglés Dinámico',
    badge: 'Kids & Junior · Presencial / Virtual',
    shortDescription: 'Metodología lúdica, canciones, cuentos y fonética intuitiva diseñada especialmente para niños y adolescentes (5 a 14 años).',
    bullets: [
      'Duración: Ciclos escolares semestrales (16 semanas)',
      'Metodología: Aprendizaje lúdico, dinámicas interactivas y juegos',
      'Certificación: Certificado de suficiencia por niveles infantiles'
    ],
    monthlyFeeCop: 150000,
    monthlyFeeUsd: 38,
    reservationFeeCop: 50000,
    durationWeeks: 16,
    hoursTotal: 80,
    schedule: 'Jornada Tarde y Sábados en la Mañana',
    modality: 'Grupos Reducidos (Máx. 10 alumnos) · Presencial / Virtual',
    certificate: 'Certificado Junior ADE Incluido',
    videoThumbnail: '/teacher-anthony.jpg',
    popular: false,
    objectives: [
      'Adquisición natural del idioma mediante inmersión lúdica y sin estrés.',
      'Desarrollo de pronunciación y oído fonético agudo desde temprana edad.',
      'Vocabulario amplio sobre familia, pasatiempos, escuela y naturaleza.',
      'Seguridad y desinhibición para comunicarse en público en inglés.'
    ],
    modules: [
      {
        number: '1',
        title: 'Módulo 1: Sound Discovery & Phonics Magic',
        description: 'Sonidos del alfabeto, reconocimiento fonético, colores, números, animales y canciones interactivas.'
      },
      {
        number: '2',
        title: 'Módulo 2: My World & Daily Adventures',
        description: 'La familia, la casa, la escuela, comidas favoritas y formación de oraciones sencillas espontáneas.'
      },
      {
        number: '3',
        title: 'Módulo 3: Storytelling & Creative Projects',
        description: 'Cuentos ilustrados, dramatizaciones, juegos de rol y creación de proyectos artísticos en inglés.'
      },
      {
        number: '4',
        title: 'Módulo 4: Junior Fluent Speaker',
        description: 'Conversaciones guiadas entre compañeros, pequeñas exposiciones y lectura comprensiva inicial.'
      }
    ],
    faqs: [
      {
        question: '¿A partir de qué edad pueden ingresar los niños?',
        answer: 'Recibimos estudiantes desde los 5 años hasta los 14 años, agrupados rigurosamente por edades y etapas cognitivas afines.'
      },
      {
        question: '¿Cómo puedo hacer seguimiento al avance de mi hijo?',
        answer: 'Entregamos boletines periódicos de progreso formativo y organizamos una clase abierta semestral donde los padres observan las dinámicas.'
      },
      {
        question: '¿El material didáctico está incluido?',
        answer: 'Sí. Todos los recursos digitales, guías pedagógicas descargables y audios están incluidos con la matrícula del estudiante.'
      }
    ]
  },
  {
    id: 'prog-intensivo',
    slug: 'intensivo',
    category: 'Intensivo',
    title: 'Programa Intensivo Conversacional',
    badge: 'Avanza 2x Más Rápido · Inmersión Total',
    shortDescription: 'Bootcamp intensivo diario para profesionales y estudiantes que necesitan alcanzar fluidez laboral en tiempo récord.',
    bullets: [
      'Duración: 10 semanas de alta inmersión (15 hrs/semana)',
      'Metodología: Enfoque inmersivo rápido & tutorías 1-a-1 de refuerzo',
      'Certificación: Certificación laboral B2 Fast Track'
    ],
    monthlyFeeCop: 320000,
    monthlyFeeUsd: 80,
    reservationFeeCop: 50000,
    durationWeeks: 10,
    hoursTotal: 150,
    schedule: 'Lunes a Viernes (Mañana 6:00 AM o Noche 7:00 PM)',
    modality: 'Virtual en Vivo (Microsoft Teams) + Laboratorio 24/7',
    certificate: 'Certificado Intensivo B2 Fast-Track',
    videoThumbnail: '/teacher-anthony.jpg',
    popular: true,
    objectives: [
      'Superar el bloqueo al hablar y pensar directamente en inglés sin traducir.',
      'Incorporar más de 3.500 vocablos y giros idiomáticos de uso frecuente.',
      'Manejar debates y discusiones espontáneas con fluidez y naturalidad.',
      'Superar exitosamente pruebas de ingreso a empleos bilingües y call centers.'
    ],
    modules: [
      {
        number: '1',
        title: 'Semana 1-3: Desbloqueo y Reflejo Fonético',
        description: 'Automatización de respuestas inmediatas, eliminación del filtro de traducción mental y agilidad auditiva.'
      },
      {
        number: '2',
        title: 'Semana 4-6: Diálogos de Alta Velocidad',
        description: 'Simulación de situaciones complejas, improvisación conversacional y estructuras idiomáticas avanzadas.'
      },
      {
        number: '3',
        title: 'Semana 7-8: Argumentación y Debates',
        description: 'Defensa de posturas críticas, retórica, presentaciones ejecutivas y manejo de preguntas difíciles.'
      },
      {
        number: '4',
        title: 'Semana 9-10: Simulacro de Contratación y Certificación',
        description: 'Entrevistas de trabajo reales grabadas en video, evaluación final de competencia MCER y diploma.'
      }
    ],
    faqs: [
      {
        question: '¿Cuántas horas diarias debo dedicarle?',
        answer: 'El programa consta de 2 horas diarias de clase en vivo sincrónica más 30 minutos de laboratorio fonético en la plataforma.'
      },
      {
        question: '¿Qué pasa si falto a una sesión?',
        answer: 'Todas las clases quedan grabadas en alta definición en tu Campus Virtual con acceso inmediato durante todo el curso.'
      },
      {
        question: '¿Incluye acceso al simulador de IA Jenny?',
        answer: 'Sí. Cuentas con acceso ilimitado a nuestro tutor virtual de inteligencia artificial para practicar tu pronunciación las 24 horas.'
      }
    ]
  },
  {
    id: 'prog-empresas',
    slug: 'empresas',
    category: 'Empresas',
    title: 'English for Business & Corporativo',
    badge: 'B2 – C1 · B2B / Equipos Corporativos',
    shortDescription: 'Capacitación empresarial a la medida para directivos, ejecutivos y equipos que lideran proyectos y clientes internacionales.',
    bullets: [
      'Duración: 12 semanas modular por proyectos corporativos',
      'Metodología: Casos de negocio reales, emails, juntas y pitches',
      'Certificación: Certificación Ejecutiva ADE + Reporte de KPIs'
    ],
    monthlyFeeCop: 280000,
    monthlyFeeUsd: 70,
    reservationFeeCop: 50000,
    durationWeeks: 12,
    hoursTotal: 96,
    schedule: 'Horarios Personalizados adaptados al turno laboral',
    modality: 'In-Company (Sede Empresa) o Virtual Teams Empresarial',
    certificate: 'Certificado de Competencia Corporativa B2/C1',
    videoThumbnail: '/teacher-anthony.jpg',
    popular: false,
    objectives: [
      'Liderar videoconferencias y negociaciones internacionales con total seguridad.',
      'Redactar correos ejecutivos, cotizaciones y reportes financieros sin errores.',
      'Elaborar y presentar pitches comerciales persuasivos ante inversores globales.',
      'Dominar el vocabulario técnico específico del sector de tu empresa.'
    ],
    modules: [
      {
        number: '1',
        title: 'Módulo 1: Corporate Communication & Email Etiquette',
        description: 'Redacción de correos de alto nivel, solicitudes formales, networking internacional y etiqueta empresarial.'
      },
      {
        number: '2',
        title: 'Módulo 2: Meetings & High-Stakes Negotiations',
        description: 'Moderación de reuniones, manejo de objeciones comerciales y cierre de acuerdos internacionales.'
      },
      {
        number: '3',
        title: 'Módulo 3: Financial & Technical Vocabulary',
        description: 'Análisis de presupuestos, lectura de balances, reportes de analítica y terminología especializada.'
      },
      {
        number: '4',
        title: 'Módulo 4: Executive Leadership & Pitch Deck',
        description: 'Liderazgo de equipos bilingües, discursos motivacionales y defensa de proyectos corporativos.'
      }
    ],
    faqs: [
      {
        question: '¿Expiden factura electrónica para empresas?',
        answer: 'Sí. American Dream English S.A.S. emite factura electrónica con RUT y validez fiscal ante la DIAN para deducción de renta.'
      },
      {
        question: '¿Realizan prueba diagnóstica al personal?',
        answer: 'Efectuamos un examen diagnóstico gratuito a todos los colaboradores para armar grupos homogéneos por nivel de competencia.'
      },
      {
        question: '¿Recibe la empresa reportes de asistencia y desempeño?',
        answer: 'Sí. El área de Talento Humano recibe informes mensuales con métricas de asistencia, evaluaciones y avance de cada colaborador.'
      }
    ]
  }
]

export function getCourseBySlug(slug: string): CourseProgram | undefined {
  const cleanSlug = slug.toLowerCase().trim()
  return COURSES_DATA.find((c) => 
    c.slug.toLowerCase() === cleanSlug || 
    c.id.toLowerCase() === cleanSlug ||
    c.id.replace('prog-', '').toLowerCase() === cleanSlug
  ) || COURSES_DATA[0]
}
