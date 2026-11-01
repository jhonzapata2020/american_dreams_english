import React, { useEffect, useState } from 'react';
import { 
  X, 
  MapPin, 
  Award, 
  Clock, 
  GraduationCap, 
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  Video,
  CheckCircle2,
  Compass,
  Bookmark,
  Check,
  ChevronRight
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/contact';

interface PresencialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AcademicProgram {
  id: string;
  title: string;
  badge: string;
  category: string;
  tags: string[];
  metricLabel: string;
  metricValue: string;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  shadowColor: string;
  tagColor: string;
  whatsappMessage: string;
}

const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: 'kids-teens',
    title: 'Kids & Teens',
    category: 'American Dream • Urabá',
    badge: 'Inmersión Temprana',
    tags: ['3 a 16 años', '4-6 hrs/sem', 'Lúdico & Práctico'],
    metricLabel: 'Intensidad Semanal',
    metricValue: '4 a 6 horas',
    description: 'Enfoque lúdico y comunicativo con inmersión temprana, clubes de conversación, fonética interactiva y proyectos creativos.',
    highlights: [
      'Aulas climatizadas y dinámicas lúdicas',
      'Clubes semanales de conversación guiada',
      'Desarrollo de confianza y pronunciación nativa'
    ],
    icon: Sparkles,
    gradient: 'from-violet-500 via-purple-500 to-indigo-600',
    shadowColor: 'shadow-purple-500/20 group-hover:shadow-purple-500/35',
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
    whatsappMessage: 'Hola American Dream English, me interesa solicitar el Plan de Estudios detallado y costos del programa Kids & Teens (3 a 16 años).'
  },
  {
    id: 'jovenes-adultos',
    title: 'Jóvenes y Adultos',
    category: 'American Dream • Formación Laboral',
    badge: 'Fluidez & Empleo',
    tags: ['Nivel A1 a C1', '4-8 hrs/sem', 'Enfoque Profesional'],
    metricLabel: 'Certificación Oficial',
    metricValue: 'Nivel A1 a C1',
    description: 'Inglés para el trabajo, negocios y fluidez real. Formación intensiva con simulacros de entrevistas, presentaciones y exámenes internacionales.',
    highlights: [
      'Inglés para negocios y oportunidades laborales',
      'Metodología comunicativa acelerada',
      'Preparación para certificación B2 / C1'
    ],
    icon: GraduationCap,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    shadowColor: 'shadow-blue-500/20 group-hover:shadow-blue-500/35',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    whatsappMessage: 'Hola American Dream English, deseo solicitar el Plan de Estudios y horarios del programa para Jóvenes y Adultos (Niveles A1 a C1).'
  },
  {
    id: 'virtual-masterclass',
    title: 'Clases Virtuales & Masterclasses',
    category: 'American Dream • Campus Global',
    badge: 'Flexibilidad Total',
    tags: ['100% Online', 'Campus 24/7', 'Clases en Vivo'],
    metricLabel: 'Disponibilidad',
    metricValue: 'Acceso 24/7',
    description: 'Flexibilidad total con plataforma interactiva. Clases en vivo sincrónicas, grabaciones en 4K y acompañamiento docente continuo.',
    highlights: [
      'Sesiones en vivo con docentes titulares C1/C2',
      'Acceso ilimitado al campus y guías descargables',
      'Masterclasses fonéticas y eventos interactivos'
    ],
    icon: Video,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    shadowColor: 'shadow-emerald-500/20 group-hover:shadow-emerald-500/35',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    whatsappMessage: 'Hola American Dream English, me interesa solicitar el Plan de Estudios de Clases Virtuales en Vivo y Masterclasses interactivas.'
  }
];

export const PresencialModal: React.FC<PresencialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [savedPrograms, setSavedPrograms] = useState<Record<string, boolean>>({
    'kids-teens': false,
    'jovenes-adultos': true,
    'virtual-masterclass': false,
  });

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPrograms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProgramWhatsApp = (program: AcademicProgram) => {
    window.open(getWhatsAppUrl(program.whatsappMessage), '_blank');
  };

  const handleGeneralWhatsApp = () => {
    const message = 'Hola American Dream English, quiero comunicarme con un asesor académico para conocer los programas y opciones de matrícula.';
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="programas-modal-title"
    >
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container: Canvas Moderno Blanco / Off-White */}
      <div className="relative w-full max-w-5xl bg-[#f8fafc] text-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* ========================================================================= */}
        {/* 1. HEADER MODERNO BLANCO CON TÍTULO OFICIAL & AVALES                      */}
        {/* ========================================================================= */}
        <div className="bg-white px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Oferta Académica 2026
                </span>
              </div>
              <h2 id="programas-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                Programas Académicos Oficiales
              </h2>
              <p className="text-xs text-slate-500 font-medium truncate">
                Formando líderes bilingües en Urabá • Certificación con aval institucional
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de programas"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FRANJA DE AVALES INSTITUCIONALES (BADGES FLOTANTES BLANCOS) */}
        <div className="bg-slate-50/90 border-b border-slate-200/60 px-6 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200/70 text-slate-700 font-semibold text-[11px] sm:text-xs shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Resolución 2471 de 2022 (Secretaría de Educación)</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200/70 text-slate-700 font-semibold text-[11px] sm:text-xs shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Reconocimiento a la Excelencia Educativa</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CONTENIDO PRINCIPAL SCROLLABLE (GRID DE CARDS 3D FLOTANTES)            */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7 flex-1 text-slate-700">
          
          {/* GRID DE CARDS ESTILO PINTEREST / DRIBBBLE 3D */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACADEMIC_PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              const isSaved = savedPrograms[prog.id];

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-[28px] p-6 border border-slate-100/90 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_26px_50px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Sutil resplandor superior en hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${prog.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="space-y-4">
                    {/* FILA SUPERIOR: Logo/Icono circular 3D + Botón Guardar / Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${prog.gradient} text-white flex items-center justify-center shadow-lg ${prog.shadowColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleSave(prog.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSaved 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                            : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : 'text-slate-400'}`} />
                        <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                      </button>
                    </div>

                    {/* METADATOS Y TÍTULO PRINCIPAL */}
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {prog.category}
                      </p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 leading-snug">
                        {prog.title}
                      </h3>
                    </div>

                    {/* CAPSULES / TAGS MODERNOS ESTILO PINTEREST */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {prog.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {prog.description}
                    </p>

                    {/* PUNTOS CLAVE / BENEFICIOS */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {prog.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-600">
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0 border border-emerald-100">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-[11px] font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FILA INFERIOR ESTILO REFERENCIA: Métrica a la izquierda + Botón Black Pill a la derecha */}
                  <div className="pt-5 mt-5 border-t border-slate-100/80 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {prog.metricLabel}
                      </p>
                      <p className="text-sm font-extrabold text-slate-900">
                        {prog.metricValue}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleProgramWhatsApp(prog)}
                      className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 group-hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Solicitar Plan</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 3. SEDE FÍSICA: CARD BLANCA FLOTANTE CON ACCIÓN DIRECTA                   */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-[26px] p-5 sm:p-6 border border-slate-100 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    Sede Presencial Turbo (Campus Campestre)
                  </h4>
                  <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                    Abierto Hoy
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Km 1.5 Vía Nacional, Vereda Casanova, Turbo • Conexión Apartadó, Currulao, Necoclí y Carepa.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto shrink-0">
              <a
                href="https://maps.google.com/?q=8.091769,-76.708828"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Ver en Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
              </a>

              <a
                href="/como-llegar"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>Guía de Rutas</span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. FOOTER INFERIOR BLANCO ELEGANTE CON ASESORÍA WHATSAPP                  */}
        {/* ========================================================================= */}
        <div className="bg-white border-t border-slate-100 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-slate-500 font-medium">
              ¿Deseas asesoría personalizada para elegir tu nivel? Estamos en línea.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneralWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hablar con Admisiones</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PresencialModal;
