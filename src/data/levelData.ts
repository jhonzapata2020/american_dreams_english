import { StudyMaterial } from './studyMaterials'

export interface LevelRecordedSession {
  id: string
  lessonNumber: number
  title: string
  date: string
  duration: string
  teacher: string
  videoUrl: string
  thumbnailUrl: string
  topics: string[]
  level: string
  status?: 'published' | 'draft'
}

export interface LevelAssignment {
  id: string
  title: string
  dueDate: string
  points: number
  status: 'pending' | 'submitted' | 'graded'
  score?: string
  feedback?: string
}

export interface LevelStudentSubmission {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  studentAvatar?: string
  assignmentTitle: string
  assignmentType: 'audio' | 'pdf' | 'text'
  submissionDate: string
  dueDate: string
  fileUrl?: string
  audioUrl?: string
  textContent?: string
  status: 'pending' | 'graded'
  grade?: number
  maxGrade: number
  feedback?: string
  gradedAt?: string
}

export interface EnrolledStudent {
  name: string
  code: string
  doc: string
  email: string
  progress: number
  avg: string
  status: 'Activo' | 'Al día' | 'Pendiente'
}

export const INITIAL_RECORDINGS_BY_LEVEL: Record<string, LevelRecordedSession[]> = {
  a1: [
    {
      id: 'rec-a1-04',
      lessonNumber: 4,
      title: 'Clase 04: Present Simple vs Continuous & Flap-T Pronunciation',
      date: '06 de Octubre, 2026',
      duration: '1h 20m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      topics: ['Present Simple', 'Present Continuous', 'Reglas fonéticas', 'Ejercicios de sala'],
      level: 'a1',
      status: 'published'
    },
    {
      id: 'rec-a1-03',
      lessonNumber: 3,
      title: 'Clase 03: Describing Jobs, Daily Habits & Third Person -s Rule',
      date: '02 de Octubre, 2026',
      duration: '1h 15m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
      topics: ['Regla de la 3ra Persona (-s / -es)', 'Profesiones', 'Entrevistas Simuladas'],
      level: 'a1',
      status: 'published'
    },
    {
      id: 'rec-a1-02',
      lessonNumber: 2,
      title: 'Clase 02: Subject Pronouns, Possessives & Numbers in Real Life',
      date: '28 de Septiembre, 2026',
      duration: '1h 25m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      topics: ['Pronombres Personales', 'Adjetivos Posesivos', 'Listening Fonético'],
      level: 'a1',
      status: 'published'
    },
    {
      id: 'rec-a1-01',
      lessonNumber: 1,
      title: 'Clase 01: Inducción al Curso, Metodología 4 Días & Alfabeto Fonético',
      date: '24 de Septiembre, 2026',
      duration: '1h 10m',
      teacher: 'Lic. Carlos Méndez',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      topics: ['Bienvenida', 'Uso de Teams', 'Descarga de Materiales'],
      level: 'a1',
      status: 'published'
    }
  ],
  a2: [
    {
      id: 'rec-a2-04',
      lessonNumber: 4,
      title: 'Clase 04: Travel Planning, Booking Flights & Future Going to',
      date: '07 de Octubre, 2026',
      duration: '1h 20m',
      teacher: 'Teacher Sarah Miller',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600',
      topics: ['Future Going to', 'Aeropuertos y Vuelos', 'Preguntas con Where & When'],
      level: 'a2',
      status: 'published'
    },
    {
      id: 'rec-a2-03',
      lessonNumber: 3,
      title: 'Clase 03: Irregular Verbs Mastery & Connected Speech in Real Contexts',
      date: '03 de Octubre, 2026',
      duration: '1h 18m',
      teacher: 'Teacher Sarah Miller',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      topics: ['50 Verbos Irregulares Clave', 'Enlaces fonéticos', 'Comprensión auditiva'],
      level: 'a2',
      status: 'published'
    },
    {
      id: 'rec-a2-02',
      lessonNumber: 2,
      title: 'Clase 02: Talking about Past Vacations, Food & Life Experiences',
      date: '29 de Septiembre, 2026',
      duration: '1h 22m',
      teacher: 'Teacher Sarah Miller',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600',
      topics: ['Past Simple Narrativas', 'Adjetivos de Comida y Lugares', 'Diálogos en pareja'],
      level: 'a2',
      status: 'published'
    },
    {
      id: 'rec-a2-01',
      lessonNumber: 1,
      title: 'Clase 01: Past Simple Regular Verbs: -ed Pronunciation Rules (/t/, /d/, /id/)',
      date: '25 de Septiembre, 2026',
      duration: '1h 15m',
      teacher: 'Teacher Sarah Miller',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
      topics: ['Fonética de terminación -ed', 'Verbos Regulares', 'Línea de tiempo en pasado'],
      level: 'a2',
      status: 'published'
    }
  ],
  b1: [
    {
      id: 'rec-b1-04',
      lessonNumber: 4,
      title: 'Clase 04: Real-World Problem Solving & Professional Small Talk',
      date: '08 de Octubre, 2026',
      duration: '1h 25m',
      teacher: 'Teacher Chris (Nativo)',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
      topics: ['Small Talk Corporativo', 'Manejo de conflictos', 'Vocabulario B1 laboral'],
      level: 'b1',
      status: 'published'
    },
    {
      id: 'rec-b1-03',
      lessonNumber: 3,
      title: 'Clase 03: Job Interview Simulation: Strengths, Weaknesses & STAR Method',
      date: '04 de Octubre, 2026',
      duration: '1h 20m',
      teacher: 'Teacher Chris (Nativo)',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      topics: ['Método STAR', 'Respuestas de impacto en inglés', 'Fluidez sin titubeos'],
      level: 'b1',
      status: 'published'
    },
    {
      id: 'rec-b1-02',
      lessonNumber: 2,
      title: 'Clase 02: Modal Verbs of Deduction & Speculation in Daily Contexts',
      date: '30 de Septiembre, 2026',
      duration: '1h 15m',
      teacher: 'Teacher Chris (Nativo)',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
      topics: ['Must, Might, Can’t have', 'Especulación lógica', 'Listening intermedio B1'],
      level: 'b1',
      status: 'published'
    },
    {
      id: 'rec-b1-01',
      lessonNumber: 1,
      title: 'Clase 01: Present Perfect vs Past Simple: Fluid Narrative Transitions',
      date: '26 de Septiembre, 2026',
      duration: '1h 18m',
      teacher: 'Teacher Chris (Nativo)',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600',
      topics: ['Present Perfect nuances', 'Since vs For', 'Transiciones discursivas'],
      level: 'b1',
      status: 'published'
    }
  ],
  b2: [
    {
      id: 'rec-b2-04',
      lessonNumber: 4,
      title: 'Clase 04: Executive Pitching, High-Stakes Negotiation & Persuasion',
      date: '09 de Octubre, 2026',
      duration: '1h 30m',
      teacher: 'Dra. Elena Córdoba',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600',
      topics: ['Pitch ejecutivos', 'Técnicas de negociación', 'Estructuras de cierre'],
      level: 'b2',
      status: 'published'
    },
    {
      id: 'rec-b2-03',
      lessonNumber: 3,
      title: 'Clase 03: Nuanced Academic & Corporate Debate: Avoiding Fallacies',
      date: '05 de Octubre, 2026',
      duration: '1h 25m',
      teacher: 'Dra. Elena Córdoba',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
      topics: ['Debate formal B2/C1', 'Argumentación sólida', 'Conectores avanzados'],
      level: 'b2',
      status: 'published'
    },
    {
      id: 'rec-b2-02',
      lessonNumber: 2,
      title: 'Clase 02: Mixed Conditionals & Advanced Subjunctive in Professional Scenarios',
      date: '01 de Octubre, 2026',
      duration: '1h 22m',
      teacher: 'Dra. Elena Córdoba',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
      topics: ['Condicionales Mixtos', 'Subjuntivo en inglés', 'Casos de estudio'],
      level: 'b2',
      status: 'published'
    },
    {
      id: 'rec-b2-01',
      lessonNumber: 1,
      title: 'Clase 01: Advanced Phrasal Verbs in Global Business & Accent Polish',
      date: '27 de Septiembre, 2026',
      duration: '1h 20m',
      teacher: 'Dra. Elena Córdoba',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=600',
      topics: ['Phrasal verbs de negocios', 'Pulido de entonación', 'Fluidez C1 target'],
      level: 'b2',
      status: 'published'
    }
  ]
}

export const INITIAL_ASSIGNMENTS_BY_LEVEL: Record<string, LevelAssignment[]> = {
  a1: [
    {
      id: 'task-a1-1',
      title: 'Actividad Oral 1: Grabación de Audio - Presentación Personal (1 min)',
      dueDate: 'Hasta el 16 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-a1-2',
      title: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia (Present Simple)',
      dueDate: 'Hasta el 22 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-a1-3',
      title: 'Listening Quiz 1: Sonidos Vocálicos y Schwa en Contexto Cotidiano',
      dueDate: 'Hasta el 28 de Octubre · 11:59 PM',
      points: 75,
      status: 'pending'
    }
  ],
  a2: [
    {
      id: 'task-a2-1',
      title: 'Actividad Oral 2: Audio - Mi Mejor Viaje y Anécdota en Pasado (2 min)',
      dueDate: 'Hasta el 18 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-a2-2',
      title: 'Taller Escrito 2: Role-Play de Reservación en Hotel y Reclamos de Vuelo',
      dueDate: 'Hasta el 24 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-a2-3',
      title: 'Listening Quiz 2: Pronunciación de Verbos en -ed (/t/, /d/, /id/)',
      dueDate: 'Hasta el 30 de Octubre · 11:59 PM',
      points: 75,
      status: 'pending'
    }
  ],
  b1: [
    {
      id: 'task-b1-1',
      title: 'Actividad Oral 3: Video/Audio - Simulación de Entrevista de Trabajo (STAR Method)',
      dueDate: 'Hasta el 20 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-b1-2',
      title: 'Taller Escrito 3: Carta de Presentación y Email Corporativo Formal en Inglés',
      dueDate: 'Hasta el 26 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-b1-3',
      title: 'Listening Quiz 3: Comprensión de Habla Rápida y Reducciones Nativas en Entrevistas',
      dueDate: 'Hasta el 31 de Octubre · 11:59 PM',
      points: 75,
      status: 'pending'
    }
  ],
  b2: [
    {
      id: 'task-b2-1',
      title: 'Actividad Oral 4: Grabación Ejecutiva - Pitch de Negocios y Persuasión en Inglés',
      dueDate: 'Hasta el 21 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-b2-2',
      title: 'Taller Escrito 4: Ensayo Argumentativo y Caso Empresarial de Negociación',
      dueDate: 'Hasta el 27 de Octubre · 11:59 PM',
      points: 100,
      status: 'pending'
    },
    {
      id: 'task-b2-3',
      title: 'Listening Quiz 4: Análisis de Debate Internacional y Modismos de Negocios',
      dueDate: 'Hasta el 31 de Octubre · 11:59 PM',
      points: 75,
      status: 'pending'
    }
  ]
}

export const INITIAL_SUBMISSIONS_BY_LEVEL: Record<string, LevelStudentSubmission[]> = {
  a1: [
    {
      id: 'sub-a1-01',
      studentId: 'stu-valeria-01',
      studentName: 'Valeria Morales Montoya',
      studentCode: 'ADE-2026-0894',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assignmentTitle: 'Actividad Oral 1: Grabación de Audio - Presentación Personal (1 min)',
      assignmentType: 'audio',
      submissionDate: '07 de Octubre, 10:42 PM',
      dueDate: '16 de Octubre, 11:59 PM',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      textContent: 'Hello Teacher! My name is Valeria. I am from Colombia. I am studying English at American Dream. I like learning new words and practicing pronunciation every day.',
      status: 'pending',
      maxGrade: 5.0
    },
    {
      id: 'sub-a1-02',
      studentId: 'stu-mateo-02',
      studentName: 'Mateo Restrepo Gómez',
      studentCode: 'ADE-2026-0912',
      assignmentTitle: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
      assignmentType: 'pdf',
      submissionDate: '06 de Octubre, 04:15 PM',
      dueDate: '12 de Octubre, 11:59 PM',
      fileUrl: '#',
      textContent: 'Every morning I wake up at 6:00 AM. I have breakfast with my family. My sister works in a hospital and my brother studies engineering...',
      status: 'pending',
      maxGrade: 5.0
    },
    {
      id: 'sub-a1-03',
      studentId: 'stu-camila-03',
      studentName: 'Camila Andrea Torres',
      studentCode: 'ADE-2026-0781',
      assignmentTitle: 'Taller Escrito 1: Redacción de Rutina Diaria y Familia',
      assignmentType: 'text',
      submissionDate: '04 de Octubre, 08:30 PM',
      dueDate: '12 de Octubre, 11:59 PM',
      textContent: 'I get up at 7:00 AM. I drink coffee and read articles. My mother teaches mathematics. We always have dinner together at 8:00 PM.',
      status: 'graded',
      grade: 4.8,
      maxGrade: 5.0,
      feedback: '¡Excelente estructura gramatical y uso del presente simple! Cuidado con la tercera persona en verbos irregulares.',
      gradedAt: '05 de Octubre, 09:12 AM'
    }
  ],
  a2: [
    {
      id: 'sub-a2-01',
      studentId: 'stu-juandavid-01',
      studentName: 'Juan David Higuita',
      studentCode: 'ADE-2026-1023',
      assignmentTitle: 'Actividad Oral 2: Audio - Mi Mejor Viaje y Anécdota en Pasado (2 min)',
      assignmentType: 'audio',
      submissionDate: '08 de Octubre, 03:15 PM',
      dueDate: '18 de Octubre, 11:59 PM',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      textContent: 'Last year I travelled to Santa Marta with my best friends. We visited Tayrona National Park, swam in the ocean and ate delicious seafood...',
      status: 'pending',
      maxGrade: 5.0
    },
    {
      id: 'sub-a2-02',
      studentId: 'stu-laura-02',
      studentName: 'Laura Sofía Gómez',
      studentCode: 'ADE-2026-1045',
      assignmentTitle: 'Taller Escrito 2: Role-Play de Reservación en Hotel y Reclamos de Vuelo',
      assignmentType: 'pdf',
      submissionDate: '07 de Octubre, 06:40 PM',
      dueDate: '24 de Octubre, 11:59 PM',
      fileUrl: '#',
      textContent: 'Good morning, I would like to check in. I booked a double room with ocean view two weeks ago under the name of Laura Gomez...',
      status: 'graded',
      grade: 4.9,
      maxGrade: 5.0,
      feedback: '¡Gran precisión en el uso de fórmulas de cortesía y preguntas indirectas! Excelente trabajo.',
      gradedAt: '08 de Octubre, 11:20 AM'
    }
  ],
  b1: [
    {
      id: 'sub-b1-01',
      studentId: 'stu-andres-01',
      studentName: 'Andrés Felipe Morales',
      studentCode: 'ADE-2026-2011',
      assignmentTitle: 'Actividad Oral 3: Video/Audio - Simulación de Entrevista de Trabajo (STAR Method)',
      assignmentType: 'audio',
      submissionDate: '09 de Octubre, 05:22 PM',
      dueDate: '20 de Octubre, 11:59 PM',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      textContent: 'When I faced a critical deadline at my previous logistics position, I reorganized the schedule and coordinated with three overseas partners...',
      status: 'pending',
      maxGrade: 5.0
    },
    {
      id: 'sub-b1-02',
      studentId: 'stu-valentina-02',
      studentName: 'Valentina Ríos Echeverry',
      studentCode: 'ADE-2026-2034',
      assignmentTitle: 'Taller Escrito 3: Carta de Presentación y Email Corporativo Formal en Inglés',
      assignmentType: 'pdf',
      submissionDate: '06 de Octubre, 07:15 PM',
      dueDate: '26 de Octubre, 11:59 PM',
      fileUrl: '#',
      textContent: 'Dear Hiring Manager, I am writing to express my strong interest in the Bilingual Project Coordinator position at your global firm...',
      status: 'graded',
      grade: 4.8,
      maxGrade: 5.0,
      feedback: 'Vocabulario muy profesional y tono impecable. Revisa la puntuación en oraciones compuestas.',
      gradedAt: '07 de Octubre, 02:40 PM'
    }
  ],
  b2: [
    {
      id: 'sub-b2-01',
      studentId: 'stu-ricardo-01',
      studentName: 'Dr. Ricardo Montoya',
      studentCode: 'ADE-2026-3015',
      assignmentTitle: 'Actividad Oral 4: Grabación Ejecutiva - Pitch de Negocios y Persuasión en Inglés',
      assignmentType: 'audio',
      submissionDate: '08 de Octubre, 09:10 PM',
      dueDate: '21 de Octubre, 11:59 PM',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      textContent: 'Esteemed board members, our strategic proposal targets the international maritime expansion in Uraba, projecting a 35% efficiency boost...',
      status: 'pending',
      maxGrade: 5.0
    },
    {
      id: 'sub-b2-02',
      studentId: 'stu-claudia-02',
      studentName: 'Ing. Claudia Vélez',
      studentCode: 'ADE-2026-3042',
      assignmentTitle: 'Taller Escrito 4: Ensayo Argumentativo y Caso Empresarial de Negociación',
      assignmentType: 'pdf',
      submissionDate: '07 de Octubre, 11:30 AM',
      dueDate: '27 de Octubre, 11:59 PM',
      fileUrl: '#',
      textContent: 'In contemporary multilateral negotiations, stakeholder alignment demands not merely consensus but rigorous risk assessment...',
      status: 'graded',
      grade: 5.0,
      maxGrade: 5.0,
      feedback: 'Nivel C1 indiscutible. Estructuras complejas, subjuntivo y condicionales mixtos dominados a la perfección.',
      gradedAt: '08 de Octubre, 08:15 AM'
    }
  ]
}

export const INITIAL_STUDENTS_BY_LEVEL: Record<string, EnrolledStudent[]> = {
  a1: [
    { name: 'Valeria Morales Montoya', code: 'ADE-2026-0894', doc: 'C.C. 1.040.892.341', email: 'estudiante@americandream.edu.co', progress: 68, avg: '4.8 / 5.0', status: 'Activo' },
    { name: 'Mateo Restrepo Gómez', code: 'ADE-2026-0912', doc: 'C.C. 1.035.712.940', email: 'mateo.restrepo@americandream.edu.co', progress: 55, avg: '4.5 / 5.0', status: 'Al día' },
    { name: 'Camila Andrea Torres', code: 'ADE-2026-0781', doc: 'C.C. 1.152.441.802', email: 'camila.torres@americandream.edu.co', progress: 82, avg: '4.9 / 5.0', status: 'Activo' },
    { name: 'Daniel Felipe Castro', code: 'ADE-2026-0845', doc: 'C.C. 1.020.914.331', email: 'daniel.castro@americandream.edu.co', progress: 40, avg: '4.2 / 5.0', status: 'Pendiente' },
    { name: 'Sara Sofía Henao', code: 'ADE-2026-0901', doc: 'C.C. 1.017.653.229', email: 'sara.henao@americandream.edu.co', progress: 75, avg: '4.7 / 5.0', status: 'Al día' }
  ],
  a2: [
    { name: 'Juan David Higuita', code: 'ADE-2026-1023', doc: 'C.C. 1.038.452.190', email: 'juan.higuita@americandream.edu.co', progress: 60, avg: '4.6 / 5.0', status: 'Activo' },
    { name: 'Laura Sofía Gómez', code: 'ADE-2026-1045', doc: 'C.C. 1.045.671.344', email: 'laura.gomez@americandream.edu.co', progress: 78, avg: '4.9 / 5.0', status: 'Al día' },
    { name: 'Carlos Andrés Pineda', code: 'ADE-2026-1088', doc: 'C.C. 1.128.903.211', email: 'carlos.pineda@americandream.edu.co', progress: 50, avg: '4.3 / 5.0', status: 'Pendiente' },
    { name: 'Mariana Roldán Vélez', code: 'ADE-2026-1102', doc: 'C.C. 1.026.890.155', email: 'mariana.roldan@americandream.edu.co', progress: 85, avg: '5.0 / 5.0', status: 'Activo' }
  ],
  b1: [
    { name: 'Andrés Felipe Morales', code: 'ADE-2026-2011', doc: 'C.C. 1.042.339.812', email: 'andres.morales@americandream.edu.co', progress: 70, avg: '4.7 / 5.0', status: 'Activo' },
    { name: 'Valentina Ríos Echeverry', code: 'ADE-2026-2034', doc: 'C.C. 1.152.880.443', email: 'valentina.rios@americandream.edu.co', progress: 90, avg: '4.9 / 5.0', status: 'Al día' },
    { name: 'Alejandro Correa Muñoz', code: 'ADE-2026-2059', doc: 'C.C. 1.037.210.984', email: 'alejandro.correa@americandream.edu.co', progress: 65, avg: '4.4 / 5.0', status: 'Al día' },
    { name: 'Tatiana Marín Soto', code: 'ADE-2026-2077', doc: 'C.C. 1.020.450.711', email: 'tatiana.marin@americandream.edu.co', progress: 80, avg: '4.8 / 5.0', status: 'Activo' }
  ],
  b2: [
    { name: 'Dr. Ricardo Montoya', code: 'ADE-2026-3015', doc: 'C.C. 71.345.890', email: 'ricardo.montoya@americandream.edu.co', progress: 92, avg: '5.0 / 5.0', status: 'Activo' },
    { name: 'Ing. Claudia Vélez', code: 'ADE-2026-3042', doc: 'C.C. 43.890.123', email: 'claudia.velez@americandream.edu.co', progress: 88, avg: '4.9 / 5.0', status: 'Al día' },
    { name: 'Santiago Uribe Londoño', code: 'ADE-2026-3066', doc: 'C.C. 1.035.882.119', email: 'santiago.uribe@americandream.edu.co', progress: 75, avg: '4.6 / 5.0', status: 'Al día' },
    { name: 'Manuela Zapata Arango', code: 'ADE-2026-3091', doc: 'C.C. 1.040.667.234', email: 'manuela.zapata@americandream.edu.co', progress: 84, avg: '4.8 / 5.0', status: 'Activo' }
  ]
}
