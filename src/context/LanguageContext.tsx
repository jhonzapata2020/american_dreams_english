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
  segments: {
    badge: string
    title: string
    subtitle: string
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
    listenPrompt: string
    recordPrompt: string
    statusFeedback: string
    accuracy: string
  }
  location: {
    badge: string
    title: string
    subtitle: string
    hqTitle: string
    hqAddress: string
    hqHours: string
    virtualTitle: string
    virtualDesc: string
  }
  footer: {
    about: string
    certified: string
    resolution: string
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
      liveClassesTitle: 'Clases en Vivo'
    },
    hero: {
      badge: 'Abre las puertas del mundo al dominar el inglés',
      title1: 'Logra la',
      titleHighlight: 'fluidez en inglés',
      title2: 'con American Dream',
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
    segments: {
      badge: 'Metodología Académica Oficial',
      title: 'Programas Diseñados para Cada Etapa de tu Vida',
      subtitle: 'Desde tus primeros pasos infantiles hasta el inglés profesional y corporativo.',
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
      badge: 'Laboratorio de Inteligencia Artificial',
      title: 'Practica tu Pronunciación en Tiempo Real',
      subtitle: 'Simulador fonético con retroalimentación instantánea sobre tu entonación y acento.',
      listenPrompt: 'Escuchar Audio Modelo',
      recordPrompt: 'Presiona para Grabar tu Voz',
      statusFeedback: 'Análisis fonético acústico completado',
      accuracy: 'Precisión Fonética'
    },
    location: {
      badge: 'Sede Principal Institucional',
      title: 'Visítanos en Turbo, Urabá Antioqueño',
      subtitle: 'Instalaciones equipadas con laboratorios bilingües y aulas interactivas.',
      hqTitle: 'Sede Principal Turbo',
      hqAddress: 'Calle 100 # 13-45, Barrio Baltazar, Turbo, Antioquia',
      hqHours: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
      virtualTitle: 'Cobertura Virtual Global',
      virtualDesc: 'Acceso internacional a través de salas virtuales en vivo por Microsoft Teams y Zoom.'
    },
    footer: {
      about: 'American Dream English S.A.S. - Instituto Bilingüe comprometido con el desarrollo profesional de Urabá y Latinoamérica.',
      certified: 'Resolución Oficial Secretaría de Educación 2471',
      resolution: 'Inspección & Vigilancia Acreditada',
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
      liveClassesTitle: 'Live Classes'
    },
    hero: {
      badge: 'Open the doors of the world by mastering English',
      title1: 'Achieve',
      titleHighlight: 'English fluency',
      title2: 'with American Dream',
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
    segments: {
      badge: 'Official Academic Framework',
      title: 'Programs Designed for Every Stage of Life',
      subtitle: 'From early childhood basics to advanced professional and business English.',
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
      badge: 'Artificial Intelligence Speech Lab',
      title: 'Practice Your Pronunciation in Real Time',
      subtitle: 'Acoustic speech simulator providing instant feedback on your intonation and rhythm.',
      listenPrompt: 'Listen to Native Model',
      recordPrompt: 'Press to Record Your Voice',
      statusFeedback: 'Acoustic phonetic analysis completed',
      accuracy: 'Phonetic Accuracy'
    },
    location: {
      badge: 'Official Academic Headquarters',
      title: 'Visit Us in Turbo, Urabá Antioquia',
      subtitle: 'Modern facilities featuring bilingual phonetic labs and multimedia classrooms.',
      hqTitle: 'Main Campus Turbo',
      hqAddress: 'Calle 100 # 13-45, Barrio Baltazar, Turbo, Antioquia',
      hqHours: 'Monday to Saturday: 8:00 AM - 6:00 PM',
      virtualTitle: 'Global Virtual Reach',
      virtualDesc: 'Worldwide live learning access through Microsoft Teams and Zoom virtual rooms.'
    },
    footer: {
      about: 'American Dream English S.A.S. - Bilingual educational institute dedicated to academic and professional development in Urabá and Latin America.',
      certified: 'Official Ministry of Education Resolution 2471',
      resolution: 'Accredited Educational Quality',
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
