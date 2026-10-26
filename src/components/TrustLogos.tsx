'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  X, 
  ExternalLink,
  Check,
  Sparkles,
  BookOpen,
  FileText,
  Info
} from 'lucide-react'

export interface TrustItem {
  id: string
  title: string
  shortLabel: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  tag: string
  subtitle: string
  description: string
  image?: string
  details?: { label: string; value: string }[]
  levelsTable?: { level: string; name: string; description: string; hours: string }[]
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: 'secretaria-educacion',
    title: 'Secretaría de Educación y Cultura de Turbo',
    shortLabel: 'Secretaría de Educación Turbo',
    icon: ShieldCheck,
    iconColor: 'text-[#002B49]',
    tag: 'Supervisión & Aval Territorial',
    subtitle: 'Acreditación y Vigilancia de Calidad Educativa Institucional',
    description: 'American Dream English cuenta con el aval y supervisión oficial de la Secretaría de Educación y Cultura del Distrito de Turbo, garantizando el cumplimiento de los más altos estándares pedagógicos de la formación para el trabajo y el desarrollo humano.',
    details: [
      { label: 'Entidad de Control:', value: 'Secretaría de Educación y Cultura Distrital' },
      { label: 'Jurisdicción:', value: 'Distrito Portuario, Logístico e Industrial de Turbo (Urabá)' },
      { label: 'Cualificación Docente:', value: 'Profesores certificados en niveles C1 y C2 MCER' },
      { label: 'Ámbito de Aplicación:', value: 'Presencial (Sede Casanova) y Campus Virtual en Vivo' }
    ]
  },
  {
    id: 'resolucion-2471',
    title: 'Resolución Oficial No. 2471 del 28 de Octubre de 2022',
    shortLabel: 'Resolución Oficial 2471/2022',
    icon: Award,
    iconColor: 'text-amber-500',
    tag: 'Registro Legal SIET',
    subtitle: 'Acto Administrativo de Reconocimiento y Registro de Programas',
    description: 'Mediante la Resolución Oficial No. 2471 expedida por la autoridad educativa, se otorga el registro oficial del programa de formación en idioma inglés bajo la normatividad de la Ley 1064 de 2006 y el Decreto 1075 de 2015 del Ministerio de Educación Nacional.',
    details: [
      { label: 'Número de Acto:', value: 'Resolución 2471 del 28 de Octubre de 2022' },
      { label: 'Vigencia Legal:', value: 'Registro Activo Institucional' },
      { label: 'Registro Nacional SIET:', value: 'Ministerio de Educación Nacional de Colombia' },
      { label: 'Modalidades Autorizadas:', value: 'Educación Laboral / Formación Continua' }
    ]
  },
  {
    id: 'mcer-standard',
    title: 'Marco Común Europeo de Referencia (MCER / CEFR)',
    shortLabel: 'Acreditación Niveles MCER (A1 a B2)',
    icon: GraduationCap,
    iconColor: 'text-emerald-600',
    tag: 'Estándar Internacional CEFR',
    subtitle: 'Alineación Curricular con el Estándar Global de Idiomas',
    description: 'Nuestro plan curricular está rigurosamente estructurado siguiendo las directrices del Marco Común Europeo de Referencia para las Lenguas, asegurando que cada nivel formativo otorgue competencias comunicativas medibles y certificables internacionalmente.',
    details: [
      { label: 'Escala de Competencia:', value: 'Niveles A1 (Acceso), A2 (Plataforma), B1 (Umbral) y B2 (Avanzado)' },
      { label: 'Enfoque Pedagógico:', value: 'Comunicativo, conversacional y funcional en tiempo real' },
      { label: 'Evaluación:', value: 'Rúbricas internacionales de producción oral y comprensión auditiva' }
    ],
    levelsTable: [
      { level: 'A1', name: 'Principiante / Acceso', description: 'Comprensión de frases cotidianas y vocabulario básico.', hours: '120 Horas' },
      { level: 'A2', name: 'Elemental / Plataforma', description: 'Comunicación en tareas sencillas e información personal.', hours: '140 Horas' },
      { level: 'B1', name: 'Intermedio / Umbral', description: 'Fluidez para desenvolverse en viajes, trabajo y entornos sociales.', hours: '160 Horas' },
      { level: 'B2', name: 'Intermedio Alto / Avanzado', description: 'Argumentación técnica y conversación fluida con nativos.', hours: '180 Horas' }
    ]
  },
  {
    id: 'uraba-portuario',
    title: 'Aliado Estratégico del Ecosistema Laboral y Portuario de Urabá',
    shortLabel: 'Impacto Urabá & Sector Portuario',
    icon: Building2,
    iconColor: 'text-blue-600',
    tag: 'Desarrollo Regional',
    subtitle: 'Capacitación del Talento Humano para los Puertos de Nueva Colonia y Turbo',
    description: 'Preparamos a la juventud y a los profesionales de Urabá para los desafíos del comercio exterior, logística marítima, operaciones aduaneras y hotelería que dinamizan la transformación económica de la región.',
    details: [
      { label: 'Población Beneficiaria:', value: 'Jóvenes, trabajadores, docentes y emprendedores de Urabá' },
      { label: 'Sedes de Atención:', value: 'Distrito de Turbo, Apartadó y cobertura virtual regional' },
      { label: 'Enfoque de Impacto:', value: 'Formación para el empleo, turismo internacional y comercio portuario' },
      { label: 'Fondo de Subvenciones:', value: 'Subsidios educativos orientados a población vulnerable' }
    ]
  },
  {
    id: 'pisingo-de-oro',
    title: 'Galardón Distrital Pisingo de Oro',
    shortLabel: 'Galardón Pisingo de Oro',
    icon: Award,
    iconColor: 'text-amber-500',
    tag: 'Máxima Distinción Cívica',
    subtitle: 'Condecoración Oficial a la Excelencia Educativa y Social en Urabá',
    description: 'Máxima distinción al mérito cívico y educativo otorgada por la Alcaldía Distrital y el Concejo de Turbo a American Dream English, exaltando su sobresaliente trayectoria pedagógica, labor social y liderazgo en la formación bilingüe en Urabá.',
    image: '/images/pisingo-de-oro.jpg',
    details: [
      { label: 'Distinción:', value: 'Medalla Oficial de Honor "Pisingo de Oro"' },
      { label: 'Entidad Otorgante:', value: 'Alcaldía Mayor y Concejo Distrital de Turbo' },
      { label: 'Mérito Reconocido:', value: 'Trayectoria, liderazgo pedagógico y labor comunitaria en Urabá' },
      { label: 'Simbolismo Histórico:', value: 'Insignia distrital en honor al ave emblemática Pisingo' }
    ]
  }
]

export const TrustLogos: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TrustItem | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicamos los items para que el loop infinito sea 100% fluido
  const marqueeItems = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <>
      {/* BARRA DE SELLOS / MARQUEE INFINITO TIPO 21st.dev */}
      <section 
        className="relative bg-slate-50 border-b border-slate-200/80 py-5 px-0 overflow-hidden font-sans select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Difuminados de borde tipo Stripe / Linear */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10 pointer-events-none" />

        <div className="flex w-max">
          <motion.div
            className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
            animate={{
              x: isPaused ? undefined : ['0%', '-33.333%']
            }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 25
            }}
          >
            {marqueeItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.button
                  key={`${item.id}-${index}`}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-shadow cursor-pointer shrink-0"
                  title={`Haz clic para ver detalles oficiales de: ${item.title}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-slate-900 font-extrabold text-xs tracking-tight whitespace-nowrap">
                      {item.shortLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                      {item.tag}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* MODAL DE DETALLE CON ANIMATEPRESENCE Y SPRING BOUNCE */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo Oscuro con Desenfoque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Dialog del Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="relative z-10 bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header del Modal */}
              <div className="bg-[#002B49] text-white p-5 sm:p-6 flex items-start justify-between relative">
                <div className="flex items-start gap-3.5 pr-6">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <selectedItem.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{selectedItem.tag}</span>
                    </div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {selectedItem.subtitle}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Contenido con Scroll */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
                {/* Fotografía Destacada (Si aplica) */}
                {selectedItem.image && (
                  <div className="bg-gradient-to-b from-slate-900 to-[#002B49] p-4 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center text-center">
                    <div className="relative max-w-[240px] sm:max-w-[280px] rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400/60 bg-black/20 p-2">
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.title}
                        className="w-full h-auto max-h-[320px] object-contain rounded-lg mx-auto"
                      />
                    </div>
                    <span className="text-[11px] text-amber-300 font-bold mt-2.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Medalla Oficial Distrital de Honor · Distrito de Turbo
                    </span>
                  </div>
                )}

                {/* Descripción Principal */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1.5 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-700" />
                    <span>Respaldo y Mérito Académico</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Ficha Técnica / Detalles (Si aplica) */}
                {selectedItem.details && (
                  <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#002B49]">
                      <FileText className="w-4 h-4" />
                      <span>Ficha Técnica y Legal</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {selectedItem.details.map((d, idx) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-bold text-[10px] uppercase block">{d.label}</span>
                          <span className="font-extrabold text-slate-800 mt-0.5 block">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabla de Niveles MCER (Si aplica) */}
                {selectedItem.levelsTable && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>Estructura de Niveles MCER Formativos</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Total 600 Horas
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {selectedItem.levelsTable.map((lvl) => (
                        <div key={lvl.level} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-[#002B49] text-amber-400 font-black flex items-center justify-center text-xs shrink-0">
                              {lvl.level}
                            </span>
                            <div>
                              <span className="font-extrabold text-slate-900 block">{lvl.name}</span>
                              <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">{lvl.description}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[11px] text-[#002B49] bg-blue-50 px-2 py-1 rounded self-start sm:self-auto shrink-0">
                            {lvl.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Garantía de Autenticidad */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Documento y aval verificado ante autoridades educativas</span>
                  </span>
                  <span className="font-semibold text-slate-500">Periodo Académico 2026</span>
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Entendido / Cerrar
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
