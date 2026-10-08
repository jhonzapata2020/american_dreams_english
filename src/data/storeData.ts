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
    id: 'prod-ebook-negocios',
    title: 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 48000,
    usdPrice: 12,
    description: 'Guía con vocabulario clave para entrevistas, logística comercial y comercio en puertos internacionales.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
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
  {
    id: 'prod-guia-conectores',
    title: 'Guía Rápida de Conectores y Fluidez B1-B2',
    type: 'digital',
    category: 'ebooks',
    formatBadge: 'Digital (Descarga directa)',
    copPrice: 36000,
    usdPrice: 9,
    description: 'Resumen estructurado de conectores gramaticales para desenvolverte con naturalidad en debates y entrevistas.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
    fileType: 'PDF',
    downloadUrl: '#',
    popular: false
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
    popular: true
  },
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
