export interface StudyMaterial {
  id: string
  title: string
  type: 'pdf' | 'audio'
  size: string
  downloadUrl: string
  description: string
  audioSrc?: string
  unitTag?: string
  createdAt?: string
}

export const INITIAL_MATERIALS_BY_LEVEL: Record<string, StudyMaterial[]> = {
  a1: [
    {
      id: 'mat-a1-1',
      title: 'Ficha Resumen 01: Present Simple vs Continuous & Flap-T Pronunciation (PDF)',
      type: 'pdf',
      size: '2.4 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Guía oficial con explicaciones, tablas comparativas y 25 ejercicios para resolver en clase.',
      unitTag: 'Unidad 1 · Gramática y Reglas'
    },
    {
      id: 'mat-a1-2',
      title: 'Audio Lab 01: Morning Routine & Native Daily Conversations (MP3)',
      type: 'audio',
      size: '8.7 MB',
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      description: 'Pistas fonéticas de práctica con hablantes nativos para entrenar el oído y la entonación.',
      unitTag: 'Laboratorio Fonético'
    },
    {
      id: 'mat-a1-3',
      title: 'Guía Didáctica 02: Social Interaction, Airport Navigation & Basic Questions (PDF)',
      type: 'pdf',
      size: '3.1 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Material complementario para las sesiones de conversación, interacción en cafeterías y viajes.',
      unitTag: 'Unidad 2 · Vocabulario Práctico'
    },
    {
      id: 'mat-a1-4',
      title: 'Audio Lab 02: Coffee Shop, Airport & Travel Dialogues (MP3)',
      type: 'audio',
      size: '9.4 MB',
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      description: 'Diálogos reales para situaciones de viaje, pedidos de comida y atención en mostradores.',
      unitTag: 'Laboratorio Fonético'
    }
  ],
  a2: [
    {
      id: 'mat-a2-1',
      title: 'Ficha Resumen: Past Simple Irregular Verbs & Time Expressions (PDF)',
      type: 'pdf',
      size: '2.8 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Lista completa de verbos irregulares de alta frecuencia y patrones fonéticos en pasado.',
      unitTag: 'Unidad 1 · Gramática en Pasado'
    },
    {
      id: 'mat-a2-2',
      title: 'Audio Lab 03: Past Tense Narratives & Connected Speech in Real Life (MP3)',
      type: 'audio',
      size: '8.9 MB',
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      description: 'Historias narradas a velocidad natural para identificar enlaces de pronunciación.',
      unitTag: 'Laboratorio Fonético'
    },
    {
      id: 'mat-a2-3',
      title: 'Guía Didáctica: Travel Dialogues, Future Tenses & Modal Verbs (PDF)',
      type: 'pdf',
      size: '3.4 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Guía de role-play para aeropuerto, hotel y compra de tiquetes.',
      unitTag: 'Unidad 2 · Viajes y Planes'
    }
  ],
  b1: [
    {
      id: 'mat-b1-1',
      title: 'Ficha Resumen: Present Perfect Continuous & Modal Auxiliary Verbs (PDF)',
      type: 'pdf',
      size: '3.2 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Diferenciación de tiempos complejos y estructuras de deducción/posibilidad.',
      unitTag: 'Unidad 1 · Gramática Intermedia'
    },
    {
      id: 'mat-b1-2',
      title: 'Audio Lab 04: Job Interview Simulation & Idiomatic Expressions (MP3)',
      type: 'audio',
      size: '10.5 MB',
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      description: 'Respuestas estratégicas para preguntas difíciles de entrevista en inglés.',
      unitTag: 'Laboratorio Profesional'
    },
    {
      id: 'mat-b1-3',
      title: 'Guía Didáctica: Professional Communication & Business Case Studies (PDF)',
      type: 'pdf',
      size: '3.8 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Plantillas de emails de negocios y reportes ejecutivos.',
      unitTag: 'Unidad 2 · Negocios y Casos'
    }
  ],
  b2: [
    {
      id: 'mat-b2-1',
      title: 'Ficha Resumen: Mixed Conditionals & Advanced Subjunctive Structures (PDF)',
      type: 'pdf',
      size: '3.5 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Condicionales mixtos y matices argumentativos para debates formales.',
      unitTag: 'Unidad 1 · Gramática Avanzada'
    },
    {
      id: 'mat-b2-2',
      title: 'Audio Lab 05: High-Stakes Business Debate & Accent Reduction (MP3)',
      type: 'audio',
      size: '11.2 MB',
      downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      description: 'Debate corporativo con diferentes acentos de habla inglesa y reducción de muletillas.',
      unitTag: 'Laboratorio Ejecutivo'
    },
    {
      id: 'mat-b2-3',
      title: 'Guía Didáctica: Executive Pitching & High-Level Negotiation Strategies (PDF)',
      type: 'pdf',
      size: '4.1 MB',
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'Estructura de presentaciones de ventas de alto impacto en entornos globales.',
      unitTag: 'Unidad 2 · Negociación Global'
    }
  ]
}

/**
 * Convierte enlaces compartidos de Google Drive o Dropbox a URLs directas de stream/reproducción
 */
export function formatAudioStreamUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()

  // Google Drive: https://drive.google.com/file/d/FILE_ID/view... o ?id=FILE_ID
  const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${driveMatch[1]}`
  }

  // Dropbox: dl=0 -> raw=1 para streaming directo
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1')
  }

  return trimmed
}
