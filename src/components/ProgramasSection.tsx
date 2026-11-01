'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Award, 
  Clock, 
  GraduationCap, 
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  Video,
  Check,
  Compass,
  Bookmark,
  ChevronRight,
  BookOpen,
  Users
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/contact';

interface AcademicProgram {
  id: string;
  title: string;
  category: string;
  badge: string;
  tags: string[];
  metricLabel: string;
  metricValue: string;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  shadowColor: string;
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
    whatsappMessage: 'Hola American Dream English, me interesa solicitar el Plan de Estudios detallado y costos del programa Kids & Teens (3 a 16 años).'
  },
  {
    id: 'jovenes-adultos',
    title: 'Jóvenes y Adultos',
    category: 'American Dream • Formación Laboral',
    badge: 'Fluidez & Empleo',
    tags: ['Nivel A1 a C1', '4-8 hrs/sem', 'Enfoque Profesional'],
    metricLabel: 'Certificación Oficial',
    metricValue: 'Nivel A1 a C1 (MCER)',
    description: 'Inglés para el trabajo, negocios y fluidez real. Formación intensiva con simulacros de entrevistas, presentaciones y exámenes internacionales.',
    highlights: [
      'Inglés para negocios y oportunidades laborales',
      'Metodología comunicativa acelerada',
      'Preparación para certificación B2 / C1'
    ],
    icon: GraduationCap,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    shadowColor: 'shadow-blue-500/20 group-hover:shadow-blue-500/35',
    whatsappMessage: 'Hola American Dream English, deseo solicitar el Plan de Estudios y horarios del programa para Jóvenes y Adultos (Niveles A1 a C1).'
  },
  {
    id: 'virtual-masterclass',
    title: 'Clases Virtuales & Masterclasses',
    category: 'American Dream • Campus Global',
    badge: 'Flexibilidad Total',
    tags: ['100% Online', 'Campus 24/7', 'Clases en Vivo'],
    metricLabel: 'Disponibilidad',
    metricValue: 'Acceso 24/7 Campus',
    description: 'Flexibilidad total con plataforma interactiva. Clases en vivo sincrónicas, grabaciones en 4K y acompañamiento docente continuo.',
    highlights: [
      'Sesiones en vivo con docentes titulares C1/C2',
      'Acceso ilimitado al campus y guías descargables',
      'Masterclasses fonéticas y eventos interactivos'
    ],
    icon: Video,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    shadowColor: 'shadow-emerald-500/20 group-hover:shadow-emerald-500/35',
    whatsappMessage: 'Hola American Dream English, me interesa solicitar el Plan de Estudios de Clases Virtuales en Vivo y Masterclasses interactivas.'
  }
];

export const ProgramasSection: React.FC = () => {
  const [savedPrograms, setSavedPrograms] = useState<Record<string, boolean>>({
    'kids-teens': false,
    'jovenes-adultos': true,
    'virtual-masterclass': false,
  });

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPrograms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleProgramWhatsApp = (program: AcademicProgram) => {
    window.open(getWhatsAppUrl(program.whatsappMessage), '_blank');
  };

  const handleGeneralWhatsApp = () => {
    const message = 'Hola American Dream English, quiero comunicarme con un asesor académico para conocer los programas y opciones de matrícula.';
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <section 
      id="programas" 
      className="relative py-20 lg:py-28 bg-[#f8fafc] text-slate-800 border-b border-slate-200/80 overflow-hidden font-sans scroll-mt-20"
      aria-labelledby="section-programas-title"
    >
      {/* Fondo ambiental sutil con iluminación orgánica */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. ENCABEZADO DE SECCIÓN PRINCIPAL                                        */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-700">
              Oferta Académica Oficial 2026
            </span>
          </div>

          <h2 
            id="section-programas-title" 
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Programas Académicos Oficiales
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Formando líderes bilingües en Urabá • Certificación con aval institucional ante la Secretaría de Educación y estándares del Marco Común Europeo.
          </p>

          {/* BADGES FLOTANTES DE AVALES INSTITUCIONALES */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs text-slate-700 font-semibold">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Resolución SED 2471 de 2022</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reconocimiento a la Excelencia Educativa</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs text-slate-700 font-semibold">
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Niveles MCER A1 a C1</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. GRID DE CARDS 3D FLOTANTES (ESTILO PINTEREST / @uix.vikram)             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-8 items-stretch mb-12">
          {ACADEMIC_PROGRAMS.map((prog) => {
            const Icon = prog.icon;
            const isSaved = savedPrograms[prog.id];

            return (
              <div
                key={prog.id}
                className="bg-white rounded-[32px] p-7 sm:p-8 border border-slate-100 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.07)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.14)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Resplandor superior en degradado al pasar el cursor */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${prog.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="space-y-5">
                  {/* FILA SUPERIOR: Logo/Icono 3D circular + Botón Guardar */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.gradient} text-white flex items-center justify-center shadow-lg ${prog.shadowColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleSave(prog.id, e)}
                      aria-label={`${isSaved ? 'Quitar de guardados' : 'Guardar programa'} ${prog.title}`}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-white' : 'text-slate-400'}`} />
                      <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                    </button>
                  </div>

                  {/* METADATOS Y TÍTULO */}
                  <div className="pt-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {prog.category}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                      {prog.title}
                    </h3>
                  </div>

                  {/* PÍLDORAS DE ETIQUETAS (TAGS) */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {prog.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* DESCRIPCIÓN */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                    {prog.description}
                  </p>

                  {/* LISTA DE BENEFICIOS */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    {prog.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0 border border-emerald-100">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-medium leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FILA INFERIOR: Métrica y Botón Black Pill */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {prog.metricLabel}
                    </p>
                    <p className="text-base font-extrabold text-slate-900">
                      {prog.metricValue}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProgramWhatsApp(prog)}
                    className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-slate-900/10 hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 group-hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Solicitar Plan</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. CARD ANCHA FLOTANTE: SEDE PRESENCIAL CAMPUS CAMPESTRE                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Sede Presencial Turbo • Campus Campestre
                </h4>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-100">
                  Abierto Hoy • Visitas Guiadas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Km 1.5 Vía Nacional, Vereda Casanova, Turbo • Conexión directa y transporte continuo desde Apartadó, Currulao, Necoclí y Carepa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://maps.google.com/?q=8.091769,-76.708828"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Ver en Google Maps</span>
              <ArrowUpRight className="w-4 h-4 text-slate-300" />
            </a>

            <a
              href="/como-llegar"
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Guía de Rutas</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BANNER DE ASESORÍA Y CONTACTO EN VIVO                                  */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[28px] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/15 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Asesores Académicos Disponibles
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-black">
              ¿No sabes qué nivel o programa elegir para ti o tus hijos?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Realiza una prueba diagnóstica sin costo y recibe asesoría pedagógica inmediata por WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGeneralWhatsApp}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-slate-950" />
            <span>Hablar con Admisiones</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProgramasSection;
