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
  images?: string[]
  features?: string[]
  rating?: number
  reviewsCount?: number
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

export function resolveProductThumbnail(item: {
  image_url?: string | null
  thumbnail?: string | null
  title?: string | null
  name?: string | null
  category?: string | null
  type?: string | null
}): string {
  const currentImg = item.thumbnail || item.image_url
  const title = (item.title || item.name || '').toLowerCase()
  const cat = (item.category || '').toLowerCase()

  // Si tiene la imagen personalizada local de turismo, entrevistas o mensualidad:
  if (title.includes('turismo') || title.includes('gestores') || title.includes('santa marta')) {
    return '/images/guia-turismo-cover.jpg'
  }
  if (title.includes('entrevista') || title.includes('job interview') || title.includes('masterclass: entrevista')) {
    return '/images/masterclass-entrevistas-cover.jpg'
  }
  if (title.includes('mensualidad') || title.includes('jóvenes') || title.includes('jovenes')) {
    return '/images/mensualidad-jovenes-cover.jpg'
  }

  // Si tiene una imagen configurada específica que no sea el fallback genérico de la camiseta:
  if (currentImg && currentImg.trim() !== '' && currentImg !== '/images/camiseta-oficial-ade.png') {
    return currentImg
  }

  // Si expresamente es la camiseta o uniforme:
  if (title.includes('camiseta') || title.includes('t-shirt') || title.includes('shirt') || title.includes('uniforme') || cat === 'uniformes') {
    return '/images/camiseta-oficial-ade.png'
  }

  // Si es un Hoodie / Buzo / Saco / Merch:
  if (title.includes('hoodie') || title.includes('saco') || title.includes('buzo') || title.includes('merch') || cat === 'merch') {
    return 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'
  }

  // Si es Masterclass / Video:
  if (title.includes('masterclass') || title.includes('video') || cat === 'masterclass') {
    return '/images/masterclass-entrevistas-cover.jpg'
  }

  // Si son Audios / Listening / MP3:
  if (title.includes('audio') || title.includes('listening') || title.includes('mp3') || cat === 'audios') {
    return 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Gramática:
  if (title.includes('gramática') || title.includes('gramatica') || title.includes('grammar')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Phrasal Verbs / Vocabulario:
  if (title.includes('phrasal') || title.includes('verbs') || title.includes('vocabulario') || title.includes('vocabulary')) {
    return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Negocios / Business:
  if (title.includes('negocios') || title.includes('business') || title.includes('comercio') || title.includes('profesional')) {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Historias / Stories:
  if (title.includes('historia') || title.includes('historias') || title.includes('cuentos') || title.includes('reading') || title.includes('relato')) {
    return 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Pronunciación:
  if (title.includes('pronunciación') || title.includes('pronunciacion') || title.includes('pronunciation') || title.includes('fonética') || title.includes('fonetica')) {
    return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600'
  }

  // Si es E-Book de Viajeros / Supervivencia:
  if (title.includes('viajero') || title.includes('viaje') || title.includes('travel') || title.includes('aeropuerto')) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'
  }

  // Si es Conectores / Guías / Libros / Ebooks en general:
  if (cat === 'ebooks' || cat === 'libros' || title.includes('ebook') || title.includes('libro') || title.includes('guía') || title.includes('guia') || title.includes('book') || title.includes('student')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
  }

  // Si es un Curso / Mensualidad / Semestre / Programa / Presencial / Virtual:
  if (title.includes('curso') || title.includes('mensualidad') || title.includes('semestre') || title.includes('programa') || title.includes('b1') || title.includes('b2') || title.includes('a1') || title.includes('a2') || title.includes('clase') || cat === 'presencial' || cat === 'virtual') {
    return '/images/mensualidad-jovenes-cover.jpg'
  }

  // Default educativo
  return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
}

/**
 * Retorna una galería de múltiples imágenes en alta definición para el producto
 */
export function resolveProductImages(product: Partial<StoreProduct>): string[] {
  if (product.images && product.images.length > 1) {
    return product.images
  }

  const title = (product.title || '').toLowerCase()
  const cat = (product.category || '').toLowerCase()

  // 1. Guía Bilingüe para Gestores de Turismo (Santa Marta / Cruceros / Caribe)
  if (title.includes('turismo') || title.includes('gestores') || title.includes('santa marta')) {
    return [
      '/images/guia-turismo-cover.jpg',
      '/images/guia-turismo-interior.jpg',
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 2. Masterclass: Entrevistas de Trabajo y Negocios en Inglés
  if (title.includes('entrevista') || title.includes('job interview') || title.includes('entrevistas')) {
    return [
      '/images/masterclass-entrevistas-cover.jpg',
      '/images/masterclass-entrevistas-interior.jpg',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 3. Mensualidad Jóvenes y Adultos / Programas Presenciales o Virtuales
  if (title.includes('mensualidad') || title.includes('jóvenes') || title.includes('jovenes') || title.includes('adultos') || title.includes('semestre')) {
    return [
      '/images/mensualidad-jovenes-cover.jpg',
      '/images/mensualidad-jovenes-campus.jpg',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 4. Camiseta Oficial ADE
  if (title.includes('camiseta') || title.includes('t-shirt') || cat === 'uniformes') {
    return [
      '/images/camiseta-oficial-ade.png',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 5. Hoodie Bilingüe American Dream English
  if (title.includes('hoodie') || title.includes('saco') || title.includes('buzo') || cat === 'merch') {
    return [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 6. E-Books / Guías generales
  if (cat === 'ebooks' || cat === 'libros' || title.includes('guia') || title.includes('guía') || title.includes('ebook') || title.includes('libro')) {
    const thumb = resolveProductThumbnail(product)
    return [
      thumb,
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // 7. Masterclasses / Video Packs
  if (cat === 'masterclass' || cat === 'audios' || title.includes('masterclass') || title.includes('video')) {
    return [
      '/images/masterclass-entrevistas-cover.jpg',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000'
    ]
  }

  // Default educativo de alta resolución
  const defaultThumb = resolveProductThumbnail(product)
  return [
    defaultThumb,
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000'
  ]
}

/**
 * Retorna las características clave detalladas para el producto
 */
export function resolveProductFeatures(product: Partial<StoreProduct>): string[] {
  if (product.features && product.features.length > 0) {
    return product.features
  }

  const title = (product.title || '').toLowerCase()
  const cat = (product.category || '').toLowerCase()

  if (title.includes('turismo') || title.includes('gestores') || title.includes('santa marta')) {
    return [
      'Manual bilingüe especializado con más de 80 diálogos reales de atención turística y protocolos de crucero',
      'Glosario técnico de hospitalidad: hotelería, aeropuertos, transporte marítimo, restaurantes y primeros auxilios',
      'Guión de resolución de quejas y negociación en inglés con acento nativo claro y cordial',
      'Pack de audios fonéticos descargables (MP3 320kbps) para entrenar pronunciación y oído en el celular',
      'Edición digital en PDF de alta fidelidad, 100% imprimible y optimizada para Smartphone, Tablet y PC'
    ]
  }

  if (title.includes('entrevista') || title.includes('job interview') || title.includes('entrevistas')) {
    return [
      'Taller intensivo en video 4K con simulación 1-a-1 de las 30 preguntas trampa más comunes en empresas multinacionales',
      'Estructura STAR (Situation, Task, Action, Result) explicada con ejemplos bilingües aprobados por reclutadores',
      'Plantillas editables de Elevator Pitch de 60 segundos y guion estratégico de negociación salarial en dólares',
      'Workbook digital descargable con ejercicios prácticos y preguntas de práctica con respuestas comentadas',
      'Acceso vitalicio ilimitado desde tu cuenta del Campus Virtual American Dream English'
    ]
  }

  if (title.includes('mensualidad') || title.includes('jóvenes') || title.includes('jovenes') || title.includes('adultos')) {
    return [
      'Clases sincrónicas en vivo por Microsoft Teams con docentes bilingües certificados y profesores nativos',
      'Grupos reducidos de máximo 15 estudiantes para garantizar participación oral y corrección fonética en cada clase',
      'Acceso 24/7 a la plataforma Campus Virtual con grabaciones completas, biblioteca digital y laboratorios de audio',
      'Material pedagógico oficial incluido (Student Workbook digital + guías prácticas semanales de inmersión)',
      'Certificación oficial por niveles MCER (A1 a B2) con aval pedagógico y Registro Institucional Res. 2471 SED'
    ]
  }

  if (title.includes('gramática') || title.includes('grammar')) {
    return [
      '120 lecciones prácticas explicadas de forma visual y directa sin tecnicismos innecesarios',
      'Tablas comparativas de tiempos verbales (Present Perfect vs Past Simple, Conditionals, Modals)',
      'Más de 400 ejercicios prácticos con hoja de respuestas y explicaciones paso a paso',
      'Formato PDF interactivo para rellenar desde la Tablet o imprimir en alta resolución',
      'Acceso permanente con derecho a futuras actualizaciones pedagógicas'
    ]
  }

  if (title.includes('phrasal') || title.includes('verbs')) {
    return [
      'Los 500 verbos compuestos más frecuentes del inglés cotidiano agrupados por partículas y contexto de uso',
      'Trucos mnemotécnicos y ejemplos de conversaciones reales en series y películas para memorizar sin esfuerzo',
      'Flashcards imprimibles y digitales para repaso rápido desde el smartphone',
      'Pruebas cortas de autoevaluación para medir tu retención semanal',
      'Descarga inmediata al correo tras confirmar el pago con Wompi'
    ]
  }

  if (title.includes('camiseta') || title.includes('t-shirt') || cat === 'uniformes') {
    return [
      'Confección en 100% algodón peinado premium (180 gr/m²), ultra suave al tacto y fresco para el clima cálido',
      'Estampado en serigrafía de alta densidad con el escudo oficial de American Dream English',
      'Costuras reforzadas en hombros y cuello para máxima durabilidad tras múltiples lavadas',
      'Disponible en tallas unisex: S, M, L, XL, XXL con horma estándar nacional',
      'Envío nacional asegurado a tu domicilio con guía de rastreo Servientrega o Interrapidísimo'
    ]
  }

  if (title.includes('hoodie') || title.includes('saco') || cat === 'merch') {
    return [
      'Tejido de algodón perchado pesado (280 gr/m²) con forro interior térmico ultra suave',
      'Escudo institucional bordado con hilo de alta precisión y bolsillo delantero tipo canguro',
      'Capota doble tela con cordón de ajuste grueso y ojales metálicos inoxidables',
      'Diseño exclusivo de la colección oficial 2026 de American Dream English',
      'Despacho inmediato a toda Colombia con empaque de regalo institucional'
    ]
  }

  // Default educativo
  return [
    'Material pedagógico diseñado y respaldado por la Dirección Académica de American Dream English',
    'Enfoque 100% práctico y orientado a la fluidez comunicativa real',
    'Compatible con cualquier dispositivo móvil, tablet o computador',
    'Garantía de satisfacción y soporte académico directo por WhatsApp',
    'Entrega inmediata tras la confirmación de tu compra'
  ]
}

/**
 * Retorna las especificaciones técnicas estructuradas para el producto
 */
export function resolveProductSpecs(product: Partial<StoreProduct>): { label: string; value: string }[] {
  const isDigital = product.type === 'digital'
  const title = (product.title || '').toLowerCase()
  const cat = (product.category || '').toLowerCase()

  if (title.includes('turismo') || title.includes('gestores')) {
    return [
      { label: 'Formato', value: 'E-Book PDF Interactivo + Audios MP3' },
      { label: 'Idioma', value: 'Bilingüe (Español / Inglés Técnico)' },
      { label: 'Nivel recomendado', value: 'A2 a B2 (Principiante a Intermedio Alto)' },
      { label: 'Páginas / Contenido', value: '148 páginas + 42 audios fonéticos' },
      { label: 'Entrega', value: 'Descarga Inmediata al Correo Electrónico' },
      { label: 'Licencia', value: 'Uso personal vitalicio sin caducidad' }
    ]
  }

  if (title.includes('entrevista') || title.includes('job interview')) {
    return [
      { label: 'Formato', value: 'Masterclass en Video 4K + Workbook PDF' },
      { label: 'Duración', value: '3 horas de entrenamiento intensivo' },
      { label: 'Idioma', value: 'Inglés con soporte y explicaciones en Español' },
      { label: 'Nivel recomendado', value: 'B1 a B2 (Pre-intermedio a Avanzado)' },
      { label: 'Certificación', value: 'Certificado de Asistencia Business English' },
      { label: 'Plataforma', value: 'Campus Virtual 24/7 de American Dream English' }
    ]
  }

  if (title.includes('mensualidad') || title.includes('jóvenes') || title.includes('jovenes')) {
    return [
      { label: 'Modalidad', value: 'Presencial (Sedes Urabá) o Virtual Sincrónico (Teams)' },
      { label: 'Intensidad horaria', value: '8 a 16 horas académicas al mes' },
      { label: 'Niveles', value: 'A1, A2, B1 o B2 según prueba de nivelación' },
      { label: 'Docentes', value: 'Profesores Titulares Bilingües y Tutores Nativos' },
      { label: 'Material de estudio', value: 'Guías semanales + Campus Virtual incluido' },
      { label: 'Registro Oficial', value: 'Resolución 2471 Secretaría de Educación' }
    ]
  }

  if (isDigital) {
    return [
      { label: 'Formato de entrega', value: 'Descarga Digital Inmediata (PDF / MP3)' },
      { label: 'Compatibilidad', value: 'iOS, Android, Windows, macOS, Kindle' },
      { label: 'Idioma', value: 'Inglés con explicaciones en Español' },
      { label: 'Imprimible', value: 'Sí, optimizado a 300 DPI alta resolución' },
      { label: 'Soporte', value: 'Línea de consultas académica por WhatsApp' },
      { label: 'Garantía', value: '100% Garantía de Satisfacción American Dreams' }
    ]
  }

  return [
    { label: 'Tipo de producto', value: 'Artículo Físico Oficial ADE' },
    { label: 'Material', value: 'Algodón peinado premium de alta densidad' },
    { label: 'Cobertura de envío', value: 'Toda Colombia (urbano y regional)' },
    { label: 'Tiempo de entrega', value: '2 a 4 días hábiles con guía Servientrega' },
    { label: 'Garantía', value: 'Cambio de talla gratuito en los primeros 15 días' },
    { label: 'Autenticidad', value: '100% Producto Oficial American Dream English' }
  ]
}


