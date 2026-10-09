'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

export type Language = 'es' | 'en'

export interface TranslationSchema {
  nav: {
    programs: string
    digitalCourses: string
    liveClasses: string
    campusVirtual: string
    enroll: string
    navigationMenu: string
    academicPrograms: string
    digitalCourses4k: string
    liveClassesTitle: string
    howToGetThere: string
  }
  hero: {
    badge: string
    title1: string
    titleHighlight: string
    title2: string
    bullet1: string
    bullet2: string
    bullet3: string
    bullet4: string
    scholarshipPrompt: string
    scholarshipLink: string
    teacherName: string
    teacherRole: string
    oneOnOne: string
    formTitle: string
    formOffer: string
    audienceSelf: string
    audienceChild: string
    firstName: string
    lastName: string
    email: string
    phone: string
    ctaButton: string
    saving: string
    habeasData: string
    scholarshipApply: string
    successTitle: string
    successMsg: string
  }
  trust: {
    clickToView: string
  }
  segments: {
    badge: string
    title: string
    subtitle: string
    segmentPrefix: string
    kidsTitle: string
    kidsTag: string
    kidsDesc: string
    kidsCta: string
    adultsTitle: string
    adultsTag: string
    adultsDesc: string
    adultsCta: string
    digitalTitle: string
    digitalTag: string
    digitalDesc: string
    digitalCta: string
    liveTitle: string
    liveTag: string
    liveDesc: string
    liveCta: string
  }
  aiSimulator: {
    badge: string
    title: string
    subtitle: string
    onlineStatus: string
    practiceScenario: string
    changeScenario: string
    jennyQuestion: string
    listenAudio: string
    translationLabel: string
    suggestedResponse: string
    pressToSpeak: string
    listening: string
    approvedFeedback: string
    aiFeedbackTitle: string
    aiFeedbackDesc: string
    bottomNote: string
  }
  donation: {
    badge: string
    title: string
    subtitle: string
    frequencyLabel: string
    monthly: string
    oneTime: string
    currencyLabel: string
    selectTierLabel: string
    customAmountLabel: string
    customAmountPlaceholder: string
    ctaButton: string
    processing: string
    secureNotice: string
  }
  impact: {
    badge: string
    title: string
    subtitle: string
    ctaButton: string
    metricScholars: string
    metricScholarsSub: string
    metricHours: string
    metricHoursSub: string
    metricRetention: string
    metricRetentionSub: string
    metricCerts: string
    metricCertsSub: string
    activeStatus: string
    certifyingStatus: string
    graduatedStatus: string
    hoursCompleted: string
    academicProgress: string
  }
  location: {
    badge: string
    title: string
    subtitle: string
    addressLabel: string
    addressValue: string
    addressSub: string
    coordsLabel: string
    coordsValue: string
    elevationLabel: string
    elevationValue: string
    landmarksTitle: string
    landmarkUnad: string
    landmarkHospital: string
    landmarkHighway: string
    routesTitle: string
    tabApartado: string
    tabApartadoTime: string
    tabApartadoDesc: string
    tabTurbo: string
    tabTurboTime: string
    tabTurboDesc: string
    tabVehicle: string
    tabVehicleTime: string
    tabVehicleDesc: string
    hoursLabel: string
    hoursWeekday: string
    hoursSaturday: string
    hoursVirtual: string
    phoneLabel: string
    phoneValue: string
    phoneSub: string
    openMaps: string
    openWaze: string
    chatWhatsapp: string
    copyCoords: string
    copied: string
    facilitiesTitle: string
    facility1: string
    facility2: string
    facility3: string
    facility4: string
  }
  footer: {
    certified: string
    resolution: string
    enrollBtn: string
    developedBy: string
    businessUnitsTitle: string
    businessUnit1: string
    businessUnit2: string
    businessUnit3: string
    businessUnit4: string
    locationTitle: string
    hqLabel: string
    hqValue: string
    quickLinks: string
    legal: string
    privacy: string
    terms: string
    habeasData: string
    rights: string
  }
}

export const DICTIONARY: Record<Language, TranslationSchema> = {
  es: {
    nav: {
      programs: 'Programas',
      digitalCourses: 'Cursos Digitales',
      liveClasses: 'Clases en Vivo',
      campusVirtual: 'Campus Virtual',
      enroll: 'Matricúlate',
      navigationMenu: 'Menú de Navegación',
      academicPrograms: 'Programas Académicos',
      digitalCourses4k: 'Cursos Digitales 4K',
      liveClassesTitle: 'Clases en Vivo',
      howToGetThere: 'Cómo Llegar'
    },
    hero: {
      badge: 'Abre las puertas del mundo al dominar el inglés',
      title1: 'Logra la',
      titleHighlight: 'fluidez en inglés',
      title2: 'con American Dream English',
      bullet1: 'Clases en VIVO e Ilimitadas (Online & Presencial Urabá)',
      bullet2: 'Docentes Bilingües Certificados C1/C2',
      bullet3: 'Metodología Conversacional Práctica',
      bullet4: 'Garantía de Preparación para Certificación MCER',
      scholarshipPrompt: '¿Eres estudiante de Urabá y buscas beca?',
      scholarshipLink: 'Ver Fondo Social →',
      teacherName: 'Teacher Anthony & Equipo',
      teacherRole: 'Docentes Certificados C1/C2 MCER',
      oneOnOne: 'Tutoría 1 a 1',
      formTitle: 'Aprende inglés con una',
      formOffer: 'Oferta Especial',
      audienceSelf: 'Para mí',
      audienceChild: 'Para mi hijo/a',
      firstName: 'Nombre *',
      lastName: 'Apellido *',
      email: 'Correo electrónico *',
      phone: 'Teléfono / WhatsApp *',
      ctaButton: 'Comienza ahora',
      saving: 'Guardando...',
      habeasData: '* Información protegida por Ley de Habeas Data',
      scholarshipApply: '🎓 ¿Buscas postularte al Fondo de Becas Urabá?',
      successTitle: '¡Inscripción Iniciada!',
      successMsg: 'Un asesor pedagógico te contactará en breve por WhatsApp.'
    },
    trust: {
      clickToView: 'Haz clic para ver detalles oficiales de:'
    },
    segments: {
      badge: 'Metodología Académica Oficial',
      title: 'Programas Diseñados para Cada Etapa de tu Vida',
      subtitle: 'Desde tus primeros pasos infantiles hasta el inglés profesional y corporativo.',
      segmentPrefix: 'Segmento',
      kidsTitle: 'Kids & Teens (4 a 14 años)',
      kidsTag: 'Metodología Lúdica & Fonética',
      kidsDesc: 'Inmersión temprana a través del juego, canciones y desarrollo natural del acento.',
      kidsCta: 'Ver Programa Niños',
      adultsTitle: 'Jóvenes y Adultos (A1 a B2)',
      adultsTag: 'Fluidez y Laboratorio Conversacional',
      adultsDesc: 'Aprende a comunicarte en entornos reales, laborales y prepara tus exámenes internacionales.',
      adultsCta: 'Ver Programa Adultos',
      digitalTitle: 'Cursos Digitales & Masterclasses',
      digitalTag: 'Acceso 24/7 a tu propio ritmo',
      digitalDesc: 'Audios fonéticos, guías interactivas, ebooks y contenidos descargables para repasar donde sea.',
      digitalCta: 'Explorar Tienda Digital',
      liveTitle: 'Clases en Vivo por Teams',
      liveTag: 'Interacción en tiempo real',
      liveDesc: 'Salas con cupos limitados dirigidas por profesores certificados para corregir pronunciación en vivo.',
      liveCta: 'Ver Horarios y Salas'
    },
    aiSimulator: {
      badge: 'Tecnología Exclusiva • Tutora IA Jenny 24/7',
      title: 'Prueba en Vivo a Jenny, Tu Tutora con Inteligencia Artificial',
      subtitle: 'A diferencia de las plataformas tradicionales, Jenny interactúa contigo por voz y texto sin presiones, corrigiendo tu pronunciación en tiempo real.',
      onlineStatus: 'En línea 24/7',
      practiceScenario: 'Escenario de Práctica:',
      changeScenario: 'Cambiar Escenario de Diálogo',
      jennyQuestion: 'Pregunta de Jenny:',
      listenAudio: 'Escuchar Audio',
      translationLabel: 'Traducción:',
      suggestedResponse: 'Tu Respuesta Sugerida en Inglés:',
      pressToSpeak: 'Presiona para Hablar con Jenny',
      listening: 'Escuchando tu voz...',
      approvedFeedback: '¡Pronunciación 98% Precisa (Aprobado!)',
      aiFeedbackTitle: 'Feedback de Inteligencia Artificial:',
      aiFeedbackDesc: 'Excelente entonación y acentuación.',
      bottomNote: '⚡ Disponible ilimitadamente para todos los estudiantes matriculados y becados.'
    },
    donation: {
      badge: 'Fondo de Becas & Subvenciones de Urabá',
      title: 'Transforma una Vida con tu Donación de Impacto',
      subtitle: 'Cada aporte financia directamente la educación bilingüe presencial y digital de jóvenes en la Región de Urabá (Apartadó, Turbo, Currulao y municipios aledaños) y nuestra plataforma virtual global.',
      frequencyLabel: 'Frecuencia:',
      monthly: 'Mensual (Recurrente)',
      oneTime: 'Donación Única',
      currencyLabel: 'Moneda:',
      selectTierLabel: '1. Selecciona el Nivel de Impacto Tangible (Unit Economics)',
      customAmountLabel: '2. O ingresa un monto personalizado:',
      customAmountPlaceholder: 'Ingresa monto personalizado',
      ctaButton: 'Completar Donación de Impacto',
      processing: 'Procesando...',
      secureNotice: 'Transacción segura y auditada. Cumplimiento de transparencia de donaciones.'
    },
    impact: {
      badge: 'Transparencia & Cumplimiento Ley 1581 (Habeas Data)',
      title: 'Fondo de Becas & Transparencia Académica',
      subtitle: 'Seguimiento al avance pedagógico de nuestros becarios en Urabá bajo estándares del Marco Común Europeo (MCER). Datos anonimizados en cumplimiento de la Ley 1581 de 2012 de Protección de Datos Personales.',
      ctaButton: 'Patrocinar a un Becario',
      metricScholars: 'Estudiantes Beneficiados',
      metricScholarsSub: 'Becarios activos en formación',
      metricHours: 'Horas Impartidas',
      metricHoursSub: 'Horas de clase financiadas',
      metricRetention: 'Retención & Asistencia',
      metricRetentionSub: 'Tasa de permanencia académica',
      metricCerts: 'Certificaciones Otorgadas',
      metricCertsSub: 'Estudiantes certificados en MCER',
      activeStatus: 'En curso',
      certifyingStatus: 'En certificación',
      graduatedStatus: 'Graduado',
      hoursCompleted: 'Horas completadas:',
      academicProgress: 'Progreso de Nivel:'
    },
    location: {
      badge: '📍 Sede Oficial & Georreferenciación',
      title: '¿Cómo Llegar a American Dream English?',
      subtitle: 'Ubicados estratégicamente sobre la Vía Nacional en la Vereda Casanova (Km 1.5), cerca a la UNAD y al Hospital Francisco Valderrama en Turbo, Urabá.',
      addressLabel: 'Dirección Oficial de la Sede',
      addressValue: 'Km 1,5 Vía nacional, Vereda Casanova',
      addressSub: 'Turbo, Antioquia · Urabá Colombiano (NIT 901.182.137-9)',
      coordsLabel: 'Coordenadas Satelitales GPS',
      coordsValue: '8°05\'30.37"N 76°42\'31.78"W',
      elevationLabel: 'Elevación del suelo',
      elevationValue: '7.83 m s.n.m.',
      landmarksTitle: 'Puntos de Referencia Clave',
      landmarkUnad: 'UNAD (Universidad Nacional Abierta y a Distancia) a 500 m',
      landmarkHospital: 'Hospital Francisco Valderrama a 1.2 km',
      landmarkHighway: 'Directo sobre la Vía Nacional Turbo - Apartadó',
      routesTitle: 'Elige tu Ruta de Llegada:',
      tabApartado: 'Desde Apartadó / Carepa / Chigorodó',
      tabApartadoTime: '🚗 ~35 min (30 km)',
      tabApartadoDesc: 'Toma cualquier bus o microbús intermunicipal (Cootransuroccidente / Sotragolfo) vía Turbo. Pide la parada en la Vereda Casanova (Km 1.5), justo 500m después del cruce a la UNAD antes de ingresar al casco urbano.',
      tabTurbo: 'Desde Turbo Centro / Muelle',
      tabTurboTime: '🛵 ~5 min (2.5 km)',
      tabTurboDesc: 'Salida hacia la Vía Nacional rumbo a Apartadó. Pasa el Hospital Francisco Valderrama y avanza 1.5 km hasta la Vereda Casanova. Disponible en taxi, mototaxi o colectivo urbano.',
      tabVehicle: 'En Auto Particular / Moto',
      tabVehicleTime: '🅿️ Parqueadero Gratis',
      tabVehicleDesc: 'Vía 100% pavimentada con parqueadero privado, vigilado y gratuito dentro del campus para estudiantes, padres de familia y visitantes.',
      hoursLabel: 'Horarios de Atención y Clases',
      hoursWeekday: 'Lunes a Viernes: 8:00 AM - 12:00 PM / 2:00 PM - 6:00 PM',
      hoursSaturday: 'Sábados (Jornada Continua): 8:00 AM - 1:00 PM',
      hoursVirtual: 'Campus Virtual en Vivo: Acceso 24/7',
      phoneLabel: 'Línea Telefónica y Recepción',
      phoneValue: '+57 (604) 827-2471 / +57 312 745 9728',
      phoneSub: 'Resolución Oficial de Educación No. 2471',
      openMaps: 'Abrir en Google Maps',
      openWaze: 'Navegar con Waze',
      chatWhatsapp: 'Pedir Indicaciones por WhatsApp',
      copyCoords: 'Copiar Coordenadas GPS',
      copied: '¡Copiado al portapapeles!',
      facilitiesTitle: 'Nuestras Instalaciones Incluyen:',
      facility1: 'Laboratorios de Audio y Fonética',
      facility2: 'Aulas Climatizadas y Conectividad Fibra',
      facility3: 'Parqueadero Privado Gratuito',
      facility4: 'Zona de Cafetería y Coworking Bilingüe'
    },
    footer: {
      certified: 'Resolución Oficial Secretaría de Educación 2471',
      resolution: 'Inspección & Vigilancia Acreditada',
      enrollBtn: 'Matricúlate Ahora',
      developedBy: 'Plataforma desarrollada y operada en alianza tecnológica por CORPLEX SOLUTIONS S.A.S.',
      businessUnitsTitle: 'Unidades de Negocio',
      businessUnit1: '1. Subvenciones & Fondo de Becas',
      businessUnit2: '2. Tienda de Infoproductos 4K',
      businessUnit3: '3. Clases Virtuales en Vivo',
      businessUnit4: '4. Clases Presenciales Sede Turbo',
      locationTitle: 'Sede Presencial & Registro',
      hqLabel: 'Sede:',
      hqValue: 'Km 1,5 Vía nacional, Vereda Casanova, Turbo, Antioquia.',
      quickLinks: 'Accesos Rápidos',
      legal: 'Legal & Privacidad',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      habeasData: 'Tratamiento de Datos',
      rights: 'Todos los derechos reservados.'
    }
  },
  en: {
    nav: {
      programs: 'Programs',
      digitalCourses: 'Digital Courses',
      liveClasses: 'Live Classes',
      campusVirtual: 'Virtual Campus',
      enroll: 'Enroll Now',
      navigationMenu: 'Navigation Menu',
      academicPrograms: 'Academic Programs',
      digitalCourses4k: '4K Digital Courses',
      liveClassesTitle: 'Live Classes',
      howToGetThere: 'How to Get Here'
    },
    hero: {
      badge: 'Open the doors of the world by mastering English',
      title1: 'Achieve',
      titleHighlight: 'English fluency',
      title2: 'with American Dream English',
      bullet1: 'Unlimited LIVE Classes (Online & On-Campus Urabá)',
      bullet2: 'Certified Bilingual Teachers (C1/C2 CEFR)',
      bullet3: 'Practical Conversational Methodology',
      bullet4: 'Guaranteed Preparation for CEFR Certification',
      scholarshipPrompt: 'Are you a student in Urabá looking for a scholarship?',
      scholarshipLink: 'Explore Social Fund →',
      teacherName: 'Teacher Anthony & Faculty Team',
      teacherRole: 'Certified C1/C2 CEFR Educators',
      oneOnOne: '1-on-1 Tutoring',
      formTitle: 'Learn English with a',
      formOffer: 'Special Offer',
      audienceSelf: 'For me',
      audienceChild: 'For my child',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      email: 'Email Address *',
      phone: 'Phone / WhatsApp *',
      ctaButton: 'Start Now',
      saving: 'Saving...',
      habeasData: '* Data protected under Habeas Data Privacy Laws',
      scholarshipApply: '🎓 Looking to apply for the Urabá Scholarship Fund?',
      successTitle: 'Registration Started!',
      successMsg: 'An academic advisor will contact you shortly via WhatsApp.'
    },
    trust: {
      clickToView: 'Click to view official details of:'
    },
    segments: {
      badge: 'Official Academic Framework',
      title: 'Programs Designed for Every Stage of Life',
      subtitle: 'From early childhood basics to advanced professional and business English.',
      segmentPrefix: 'Segment',
      kidsTitle: 'Kids & Teens (Ages 4 to 14)',
      kidsTag: 'Playful & Phonics Methodology',
      kidsDesc: 'Early language immersion through games, songs, and intuitive accent development.',
      kidsCta: 'View Kids Program',
      adultsTitle: 'Youth & Adults (A1 to B2)',
      adultsTag: 'Fluency & Conversational Lab',
      adultsDesc: 'Learn to communicate confidently in real-world professional environments and prepare for international exams.',
      adultsCta: 'View Adults Program',
      digitalTitle: 'Digital Courses & Masterclasses',
      digitalTag: '24/7 Self-Paced Access',
      digitalDesc: 'Phonics audios, interactive workbooks, ebooks, and downloadable content to study anywhere.',
      digitalCta: 'Explore Digital Store',
      liveTitle: 'Live Classes via Microsoft Teams',
      liveTag: 'Real-Time Dynamic Interaction',
      liveDesc: 'Small interactive cohorts led by certified professors for real-time pronunciation guidance.',
      liveCta: 'View Schedule & Rooms'
    },
    aiSimulator: {
      badge: 'Exclusive Technology • AI Tutor Jenny 24/7',
      title: 'Experience Live AI Tutoring with Jenny',
      subtitle: 'Unlike traditional platforms, Jenny interacts with you via natural voice and text without pressure, correcting pronunciation in real time.',
      onlineStatus: 'Online 24/7',
      practiceScenario: 'Practice Scenario:',
      changeScenario: 'Switch Conversation Scenario',
      jennyQuestion: "Jenny's Prompt:",
      listenAudio: 'Listen to Audio',
      translationLabel: 'Translation:',
      suggestedResponse: 'Your Suggested Response in English:',
      pressToSpeak: 'Press to Speak with Jenny',
      listening: 'Listening to your voice...',
      approvedFeedback: '98% Accurate Pronunciation (Passed!)',
      aiFeedbackTitle: 'Artificial Intelligence Feedback:',
      aiFeedbackDesc: 'Superb intonation and clear syllable stress.',
      bottomNote: '⚡ Unlimited 24/7 access for all enrolled and scholarship students.'
    },
    donation: {
      badge: 'Urabá Scholarship & Grant Fund',
      title: 'Transform a Life with Your High-Impact Donation',
      subtitle: 'Every contribution directly funds on-campus and virtual bilingual education for talented youth across the Urabá region (Apartadó, Turbo, Currulao) and worldwide.',
      frequencyLabel: 'Frequency:',
      monthly: 'Monthly (Recurring)',
      oneTime: 'One-Time Donation',
      currencyLabel: 'Currency:',
      selectTierLabel: '1. Select Your Tangible Impact Tier (Unit Economics)',
      customAmountLabel: '2. Or enter a custom donation amount:',
      customAmountPlaceholder: 'Enter custom amount',
      ctaButton: 'Complete Impact Donation',
      processing: 'Processing...',
      secureNotice: 'Secure audited transaction. Fully transparent philanthropic fund management.'
    },
    impact: {
      badge: 'Transparency & Data Protection Compliance',
      title: 'Scholarship Fund & Academic Transparency',
      subtitle: 'Pedagogical progress tracking for our Urabá scholars under Common European Framework (CEFR) standards. Anonymized data compliant with statutory privacy regulations.',
      ctaButton: 'Sponsor a Scholar',
      metricScholars: 'Benefited Scholars',
      metricScholarsSub: 'Active students in training',
      metricHours: 'Hours Delivered',
      metricHoursSub: 'Funded classroom instruction hours',
      metricRetention: 'Retention & Attendance',
      metricRetentionSub: 'Academic continuity rate',
      metricCerts: 'Certifications Awarded',
      metricCertsSub: 'Students certified in CEFR',
      activeStatus: 'In progress',
      certifyingStatus: 'In certification',
      graduatedStatus: 'Graduated',
      hoursCompleted: 'Completed hours:',
      academicProgress: 'Level Progress:'
    },
    location: {
      badge: '📍 Official Campus & GPS Navigation',
      title: 'How to Get to American Dream English?',
      subtitle: 'Strategically located along the National Highway in Vereda Casanova (Km 1.5), near UNAD University and Francisco Valderrama Hospital in Turbo, Urabá.',
      addressLabel: 'Official Campus Address',
      addressValue: 'Km 1.5 Vía nacional, Vereda Casanova',
      addressSub: 'Turbo, Antioquia · Colombian Urabá Region (NIT 901.182.137-9)',
      coordsLabel: 'Satellite GPS Coordinates',
      coordsValue: '8°05\'30.37"N 76°42\'31.78"W',
      elevationLabel: 'Ground Elevation',
      elevationValue: '7.83 m above sea level',
      landmarksTitle: 'Key Landmarks Nearby',
      landmarkUnad: 'UNAD University 500 meters away',
      landmarkHospital: 'Francisco Valderrama Hospital 1.2 km away',
      landmarkHighway: 'Directly on the paved Turbo - Apartadó National Highway',
      routesTitle: 'Choose Your Travel Route:',
      tabApartado: 'From Apartadó / Carepa / Chigorodó',
      tabApartadoTime: '🚗 ~35 min (30 km)',
      tabApartadoDesc: 'Take any regional bus toward Turbo. Request a stop at Vereda Casanova (Km 1.5), right 500m after the UNAD turnoff before entering Turbo city. The campus is directly on the main highway.',
      tabTurbo: 'From Downtown Turbo / Port Area',
      tabTurboTime: '🛵 ~5 min (2.5 km)',
      tabTurboDesc: 'Head out via the National Highway towards Apartadó. Pass the Francisco Valderrama Hospital and proceed 1.5 km to Vereda Casanova. Accessible via taxi, mototaxi, or local bus.',
      tabVehicle: 'By Private Car / Motorcycle',
      tabVehicleTime: '🅿️ Free On-Site Parking',
      tabVehicleDesc: '100% paved road access with free, secure on-campus private parking for all students, parents, and visitors.',
      hoursLabel: 'Office & Class Schedules',
      hoursWeekday: 'Monday to Friday: 8:00 AM - 12:00 PM / 2:00 PM - 6:00 PM',
      hoursSaturday: 'Saturdays: 8:00 AM - 1:00 PM',
      hoursVirtual: 'Live Virtual Campus: 24/7 Global Access',
      phoneLabel: 'Direct Phone & Front Desk',
      phoneValue: '+57 (604) 827-2471 / +57 312 745 9728',
      phoneSub: 'Official Education Resolution No. 2471',
      openMaps: 'Open in Google Maps',
      openWaze: 'Navigate with Waze',
      chatWhatsapp: 'Request Route Help via WhatsApp',
      copyCoords: 'Copy GPS Coordinates',
      copied: 'Copied to clipboard!',
      facilitiesTitle: 'Our Campus Amenities Include:',
      facility1: 'Audio & Phonetics Speech Labs',
      facility2: 'Climate-Controlled Rooms & High-Speed Fiber',
      facility3: 'Free Private On-Site Parking',
      facility4: 'Bilingual Lounge & Coworking Hub'
    },
    footer: {
      certified: 'Official Ministry of Education Resolution 2471',
      resolution: 'Accredited Educational Quality & Oversight',
      enrollBtn: 'Enroll Now',
      developedBy: 'Platform engineered and operated in technological alliance with CORPLEX SOLUTIONS S.A.S.',
      businessUnitsTitle: 'Business Units',
      businessUnit1: '1. Grants & Scholarship Fund',
      businessUnit2: '2. 4K Digital Infoproducts Store',
      businessUnit3: '3. Live Virtual Classes',
      businessUnit4: '4. On-Campus Classes Turbo HQ',
      locationTitle: 'On-Campus Headquarters & Registry',
      hqLabel: 'Campus:',
      hqValue: 'Km 1.5 Vía nacional, Vereda Casanova, Turbo, Antioquia.',
      quickLinks: 'Quick Links',
      legal: 'Legal & Compliance',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      habeasData: 'Data Protection Notice',
      rights: 'All rights reserved.'
    }
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: TranslationSchema
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('american_dreams_language') as Language
      if (saved === 'es' || saved === 'en') {
        setLanguageState(saved)
      } else {
        const campusLang = localStorage.getItem('campus_login_lang')?.toLowerCase() as Language
        if (campusLang === 'es' || campusLang === 'en') {
          setLanguageState(campusLang)
        }
      }
    } catch (e) {
      // Silencioso en SSR
    }
  }, [])

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem('american_dreams_language', newLang)
      localStorage.setItem('campus_login_lang', newLang.toUpperCase())
    } catch (e) {
      // Silencioso
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'es' ? 'en' : 'es'
      try {
        localStorage.setItem('american_dreams_language', next)
        localStorage.setItem('campus_login_lang', next.toUpperCase())
      } catch (e) {
        // Silencioso
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: DICTIONARY[language]
    }),
    [language, setLanguage, toggleLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: DICTIONARY['es']
    }
  }
  return context
}
