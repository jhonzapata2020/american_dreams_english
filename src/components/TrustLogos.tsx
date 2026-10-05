'use client'

import React, { useState } from 'react'
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
      { label: 'Registro Nacional:', value: 'SIET (Ministerio de Educación Nacional)' },
      { label: 'Institución Titular:', value: 'American Dream English S.A.S. (NIT 901.182.137-9)' },
      { label: 'Certificado Otorgado:', value: 'Certificado de Aptitud Ocupacional en Idioma Inglés' }
    ]
  },
  {
    id: 'mcer-cefr',
    title: 'Marco Común Europeo de Referencia (MCER / CEFR)',
    shortLabel: 'Marco Común Europeo (MCER)',
    icon: GraduationCap,
    iconColor: 'text-emerald-600',
    tag: 'Estándar Internacional',
    subtitle: 'Matriz Curricular Homologada para Competencia Bilingüe Global',
    description: 'Nuestros planes de estudio están alineados con el estándar internacional del Marco Común Europeo (Common European Framework of Reference for Languages), asegurando una progresión medible desde niveles principiantes hasta el dominio profesional del idioma.',
    levelsTable: [
      { level: 'A1', name: 'Principiante / Acceso', hours: '120 Horas', description: 'Comprensión de frases cotidianas, vocabulario esencial, saludos, rutinas diarias y expresiones familiares.' },
      { level: 'A2', name: 'Plataforma / Básico', hours: '140 Horas', description: 'Conversación en pasado y futuro, compras, viajes, descripciones del entorno y comunicación en situaciones directas.' },
      { level: 'B1', name: 'Intermedio / Umbral', hours: '160 Horas', description: 'Independencia comunicativa, narración de experiencias, viajes, justificación de opiniones y redacción estructurada.' },
      { level: 'B2', name: 'Intermedio Alto / Avanzado', hours: '180 Horas', description: 'Fluidez y espontaneidad con hablantes nativos, entrevistas laborales técnicas, negociación y argumentación compleja.' }
    ]
  },
  {
    id: 'alcaldia-turbo',
    title: 'Alcaldía Distrital de Turbo · Distrito Especial',
    shortLabel: 'Alcaldía Distrital de Turbo',
    icon: Building2,
    iconColor: 'text-indigo-700',
    tag: 'Alianza Regional Urabá',
    subtitle: 'Fomento del Bilingüismo para el Desarrollo Portuario y Social',
    description: 'Reconocimiento del programa de American Dream English como motor estratégico en la formación de capital humano bilingüe para los proyectos de infraestructura, comercio exterior y desarrollo logístico de la región de Urabá (Puerto Antioquia y Puerto Pisisi).',
    details: [
      { label: 'Territorio:', value: 'Distrito Especial Portuario y Ecoturístico de Turbo' },
      { label: 'Enfoque de Impacto:', value: 'Formación para el empleo, turismo internacional y comercio portuario' },
      { label: 'Fondo de Subvenciones:', value: 'Subsidios educativos orientados a población vulnerable' }
    ]
  },
  {
    id: 'pisingo-de-oro',
    title: 'Galardón Distrital Pisingo de Oro',
    shortLabel: 'Galardón Pisingo de Oro',
    icon: CheckCircle2,
    iconColor: 'text-crimson-600',
    tag: 'Máxima Distinción Cívica',
    subtitle: 'Condecoración Oficial a la Excelencia Educativa y Social en Urabá',
    description: 'Máxima distinción al mérito cívico y educativo otorgada por el Distrito de Turbo, exaltando la excelencia y trayectoria en la formación bilingüe de la región.',
    image: '/images/pisingo-de-oro.jpg',
    details: [
      { label: 'Distinción:', value: 'Medalla de Honor "Pisingo de Oro"' },
      { label: 'Entidad Otorgante:', value: 'Distrito de Turbo · Alcaldía y Concejo Municipal' },
      { label: 'Mérito Reconocido:', value: 'Trayectoria, liderazgo pedagógico y labor social en Urabá' },
      { label: 'Simbolismo:', value: 'Insignia distrital en oro con el ave emblemática Pisingo' }
    ]
  }
]

export const TrustLogos: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<TrustItem | null>(null)

  return (
    <>
      {/* BARRA DE SELLOS / CERTIFICACIONES INTERACTIVAS */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6 px-4 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-around gap-4 sm:gap-6 text-slate-600 text-xs font-bold uppercase tracking-wider">
            
            {TRUST_ITEMS.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center space-x-2 group p-2 rounded-xl hover:bg-white hover:shadow-xs transition-all duration-200 cursor-pointer hover:text-blue-700 hover:scale-105 active:scale-[0.98] border border-transparent hover:border-slate-200"
                  title={`Haz clic para ver detalles oficiales de: ${item.title}`}
                >
                  <IconComponent className={`w-5 h-5 ${item.iconColor} transition-transform group-hover:scale-110 shrink-0`} />
                  <span className="text-slate-800 group-hover:text-blue-700 font-extrabold transition-colors">
                    {item.shortLabel}
                  </span>
                </button>
              )
            })}

          </div>
        </div>
      </section>

      {/* MODAL DE DETALLE DE CERTIFICACIÓN / AVAL INSTITUCIONAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
            
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

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
              
              {/* Fotografía Destacada (Si aplica - Galardón Pisingo de Oro) */}
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
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm"
              >
                Entendido / Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
