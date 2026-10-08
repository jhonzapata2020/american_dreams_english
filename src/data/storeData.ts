export interface StoreProduct {
  id: string
  title: string
  type: 'digital' | 'fisico'
  category: 'ebooks' | 'masterclass' | 'audios' | 'libros' | 'uniformes' | 'merch'
  formatBadge: string
  copPrice: number
  usdPrice: number
  description: string
  thumbnail: string
  fileType?: 'PDF' | 'Audio MP3' | 'Video Pack' | 'Físico'
  downloadUrl?: string
  popular?: boolean
}

export const STORE_SEGMENTS = [
  { id: 'todos', label: 'Todos' },
  { id: 'digital', label: 'Digital (E-books / Audio)' },
  { id: 'fisico', label: 'Físico (Libros / Uniformes / Merch)' }
] as const

export type StoreSegmentId = typeof STORE_SEGMENTS[number]['id']

export const STORE_PRODUCTS: StoreProduct[] = [
  // =========================================================================
  // 📚 E-BOOKS DIGITALES (BESTSELLERS DE APRENDIZAJE)
  // =========================================================================
  {
    id: 'prod-ebook-gramatica-uso',
    title: 'E-Book: Gramática Práctica en Uso — De Cero a B2',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 45000,
    usdPrice: 11,
    description: 'Guía definitiva con más de 120 lecciones visuales, tablas de tiempos verbales y ejercicios prácticos con respuestas comentadas.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: true
  },
  {
    id: 'prod-ebook-phrasal-verbs',
    title: 'E-Book: 500 Phrasal Verbs Imprescindibles para Hablar como Nativo',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 39000,
    usdPrice: 10,
    description: 'Domina los verbos frasales más usados en el inglés cotidiano con ejemplos reales de conversación y trucos mnemotécnicos.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: true
  },
  {
    id: 'prod-ebook-negocios',
    title: 'E-Book: Inglés Práctico para Negocios y Comercio Internacional',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 49000,
    usdPrice: 12,
    description: 'Vocabulario profesional, plantillas de correos ejecutivos y simulación de entrevistas de trabajo en empresas multinacionales.',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
  },
  {
    id: 'prod-ebook-historias-cortas',
    title: 'E-Book: Historias Cortas en Inglés para Principiantes (A2-B1)',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 32000,
    usdPrice: 8,
    description: '15 relatos entretenidos con glosario bilingüe integrado en cada página para aumentar vocabulario y fluidez lectora sin frustración.',
    thumbnail: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: true
  },
  {
    id: 'prod-ebook-pronunciacion',
    title: 'E-Book: Pronunciación Americana y Reducciones Nativas',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 42000,
    usdPrice: 10,
    description: 'Manual fonético para dominar el sonido Schwa, la Flap T, ritmo acentual y contracciones del inglés estadounidense real.',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
  },
  {
    id: 'prod-ebook-viajeros',
    title: 'E-Book: Inglés de Supervivencia para Viajeros y Aeropuertos',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 35000,
    usdPrice: 9,
    description: 'Guía de bolsillo con diálogos reales para aduanas, migración, hoteles, restaurantes, transporte y situaciones de emergencia.',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
  },
  {
    id: 'prod-guia-conectores',
    title: 'Guía Rápida de Conectores y Fluidez B1-B2',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 36000,
    usdPrice: 9,
    description: 'Estructuras y conectores avanzados para argumentar, debatir y redactar con fluidez profesional sin traducir mentalmente.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
  },

  // =========================================================================
  // 🎥 PACKS DE AUDIO Y MASTERCLASS DIGITALES
  // =========================================================================
  {
    id: 'prod-mc-fonetica',
    title: 'Masterclass 4K: Fonética y Pronunciación Nativa',
    type: 'digital',
    category: 'masterclass',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 75000,
    usdPrice: 19,
    description: 'Aprende los 44 fonemas del inglés con explicaciones en video 4K de docentes bilingües certificados.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    fileType: 'Video Pack',
    downloadUrl: '#',
    popular: true
  },
  {
    id: 'prod-pack-audios',
    title: 'Pack Completo A1-A2: 50 Audios de Inmersión + Guías',
    type: 'digital',
    category: 'audios',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 115000,
    usdPrice: 29,
    description: 'Más de 50 archivos de audio fonético con hablantes nativos para entrenar el oído desde el celular.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
    fileType: 'Audio MP3',
    downloadUrl: '#',
    popular: true
  },

  // =========================================================================
  // 👕 FÍSICO: ROPA OFICIAL, MERCHANDISING Y LIBROS IMPRESOS
  // =========================================================================
  {
    id: 'prod-camiseta-oficial-ade',
    title: 'Camiseta Oficial ADE',
    type: 'fisico',
    category: 'uniformes',
    formatBadge: 'FÍSICO (ENVÍO NACIONAL)',
    copPrice: 55000,
    usdPrice: 14,
    description: 'Camiseta 100% algodón, cuello redondo, color negro con el escudo oficial de American Dream English estampado al frente.',
    thumbnail: '/images/camiseta-oficial-ade.png',
    fileType: 'Físico',
    popular: true
  },
  {
    id: 'prod-libro-fisico-1',
    title: 'Libro Oficial ADE Student Book - Nivel 1 (A1)',
    type: 'fisico',
    category: 'libros',
    formatBadge: 'Físico (Envío nacional)',
    copPrice: 95000,
    usdPrice: 24,
    description: 'Libro de trabajo a todo color con código QR para audios interactivos y ejercicios prácticos.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    fileType: 'Físico',
    popular: false
  },
  {
    id: 'prod-hoodie-ade',
    title: 'Hoodie Bilingüe American Dream English - Edición 2026',
    type: 'fisico',
    category: 'merch',
    formatBadge: 'Físico (Envío nacional)',
    copPrice: 120000,
    usdPrice: 30,
    description: 'Saco con capota de algodón perchado de alta calidad con el escudo bordado y lema institucional.',
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    fileType: 'Físico',
    popular: false
  }
]
