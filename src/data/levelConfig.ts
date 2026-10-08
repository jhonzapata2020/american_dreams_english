export interface LevelConfiguration {
  id: string
  code: string
  title: string
  shortLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  levelBadge: string
  credits: number
  programName: string
  teacherName: string
  unit1Title: string
  unit2Title: string
  unit1Desc: string
  unit2Desc: string
  unit1GrammarGuide: string
  unit2GrammarGuide: string
  nextLiveClass: string
  liveClassTopic: string
}

export const LEVEL_CONFIGURATIONS: Record<string, LevelConfiguration> = {
  a1: {
    id: 'a1',
    code: 'ADE-ING101',
    title: 'ENGLISH LEVEL 1 (A1) - GENERAL PROGRAM',
    shortLevel: 'A1',
    levelBadge: 'A1 Principiante',
    credits: 3,
    programName: 'Programa de Inglés Jóvenes y Adultos',
    teacherName: 'Lic. Carlos Méndez',
    unit1Title: 'Unidad 1: Foundations, Daily Routine & Present Simple (175 pts)',
    unit2Title: 'Unidad 2: Listening, Social Interaction & Real-Life (175 pts)',
    unit1Desc: 'Estructuras básicas, sujeto, verbo to be, presente simple y adjetivos cotidianos.',
    unit2Desc: 'Interacción en cafeterías, transportes, direcciones y presentaciones personales.',
    unit1GrammarGuide: 'Ficha Resumen: Present Simple vs. Continuous & Third Person -s Rule',
    unit2GrammarGuide: 'Guía Didáctica: Social Interaction, Airport Navigation & Basic Questions',
    nextLiveClass: 'Miércoles 7:00 PM',
    liveClassTopic: 'Clase Sincrónica: Daily Routine, Adverbs of Frequency & Phonetics'
  },
  a2: {
    id: 'a2',
    code: 'ADE-ING102',
    title: 'ENGLISH LEVEL 2 (A2) - ELEMENTARY PROGRAM',
    shortLevel: 'A2',
    levelBadge: 'A2 Elemental',
    credits: 3,
    programName: 'Programa de Inglés Jóvenes y Adultos',
    teacherName: 'Teacher Sarah Miller',
    unit1Title: 'Unidad 1: Past Simple, Memories & Storytelling (175 pts)',
    unit2Title: 'Unidad 2: Travel, Airport Navigation & Future Plans (175 pts)',
    unit1Desc: 'Verbos regulares e irregulares en pasado, estructuras temporales y anécdotas personales.',
    unit2Desc: 'Planes a futuro (going to / will), reservaciones hoteleras y compras en el extranjero.',
    unit1GrammarGuide: 'Ficha Resumen: Past Simple Irregular Verbs & Time Expressions',
    unit2GrammarGuide: 'Guía Didáctica: Travel Dialogues, Future Tenses & Modal Verbs',
    nextLiveClass: 'Martes 6:00 PM',
    liveClassTopic: 'Clase Sincrónica: Past Tense Narratives & Connected Speech in Real Life'
  },
  b1: {
    id: 'b1',
    code: 'ADE-ING201',
    title: 'ENGLISH LEVEL 3 (B1) - PRE-INTERMEDIATE PROGRAM',
    shortLevel: 'B1',
    levelBadge: 'B1 Pre-Intermedio',
    credits: 3,
    programName: 'Programa de Inglés Avanzado y Negocios',
    teacherName: 'Teacher Chris (Nativo)',
    unit1Title: 'Unidad 1: Complex Tenses, Modals & Narrative Flow (175 pts)',
    unit2Title: 'Unidad 2: Job Interviews & Real-World Problem Solving (175 pts)',
    unit1Desc: 'Present Perfect vs. Past Simple, verbos modales de obligación y deducción.',
    unit2Desc: 'Simulaciones de entrevistas laborales, redacción de correos formales y argumentación.',
    unit1GrammarGuide: 'Ficha Resumen: Present Perfect Continuous & Modal Auxiliary Verbs',
    unit2GrammarGuide: 'Guía Didáctica: Professional Communication & Business Case Studies',
    nextLiveClass: 'Lunes 8:30 PM',
    liveClassTopic: 'Clase Sincrónica: Job Interview Mastery & American Idiomatic Expressions'
  },
  b2: {
    id: 'b2',
    code: 'ADE-ING202',
    title: 'ENGLISH LEVEL 4 (B2) - UPPER INTERMEDIATE',
    shortLevel: 'B2',
    levelBadge: 'B2 Intermedio Alto',
    credits: 3,
    programName: 'Programa de Inglés Corporativo y Fluidez',
    teacherName: 'Dra. Elena Córdoba',
    unit1Title: 'Unidad 1: Advanced Phrasal Verbs & Nuanced Debates (175 pts)',
    unit2Title: 'Unidad 2: Business Fluency & International Presentations (175 pts)',
    unit1Desc: 'Phrasal verbs separables e inseparables, condicionales mixtos y debates formales.',
    unit2Desc: 'Negociación internacional, oratoria ejecutiva y análisis crítico de noticias.',
    unit1GrammarGuide: 'Ficha Resumen: Mixed Conditionals & Advanced Subjunctive Structures',
    unit2GrammarGuide: 'Guía Didáctica: Executive Pitching & High-Level Negotiation Strategies',
    nextLiveClass: 'Sábados 2:00 PM',
    liveClassTopic: 'Clase Sincrónica: High-Stakes Business Debate & Accent Reduction'
  },
  c1: {
    id: 'c1',
    code: 'ADE-ING301',
    title: 'ENGLISH LEVEL 5 (C1) - ADVANCED MASTERY',
    shortLevel: 'C1',
    levelBadge: 'C1 Avanzado',
    credits: 4,
    programName: 'Programa de Maestría Bilingüe y Certificación',
    teacherName: 'Teacher Chris & Team',
    unit1Title: 'Unidad 1: Academic Discourse & Nuanced Expression (175 pts)',
    unit2Title: 'Unidad 2: Professional Mastery & Native Debate (175 pts)',
    unit1Desc: 'Inversión sintáctica, colocaciones idiomáticas nativas y redacción académica.',
    unit2Desc: 'Dominio de registros formales e informales, modismos y análisis de textos complejos.',
    unit1GrammarGuide: 'Ficha Resumen: C1 Advanced Inversion & Lexical Chunks',
    unit2GrammarGuide: 'Guía Didáctica: Academic Synthesis & Native Speed Fluency Lab',
    nextLiveClass: 'Viernes 7:00 PM',
    liveClassTopic: 'Clase Sincrónica: Academic Discourse, Debate & Native Mastery'
  }
}

export function getLevelConfig(rawLevel?: string): LevelConfiguration {
  const norm = (rawLevel || 'a1').toLowerCase().trim()
  if (norm.includes('c1') || norm.includes('avanzado') || norm.includes('level 5') || norm.includes('nivel 5')) {
    return LEVEL_CONFIGURATIONS.c1
  }
  if (norm.includes('b2') || norm.includes('intermedio alto') || norm.includes('level 4') || norm.includes('nivel 4')) {
    return LEVEL_CONFIGURATIONS.b2
  }
  if (norm.includes('b1') || norm.includes('pre-intermedio') || norm.includes('intermedio') || norm.includes('level 3') || norm.includes('nivel 3')) {
    return LEVEL_CONFIGURATIONS.b1
  }
  if (norm.includes('a2') || norm.includes('elemental') || norm.includes('level 2') || norm.includes('nivel 2')) {
    return LEVEL_CONFIGURATIONS.a2
  }
  return LEVEL_CONFIGURATIONS.a1
}
