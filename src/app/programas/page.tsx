'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Video, 
  MapPin, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  MessageCircle, 
  ArrowUpRight, 
  Compass, 
  ChevronDown, 
  Check, 
  FileText,
  Star,
  Calendar,
  Languages,
  BadgeCheck,
  DollarSign,
  Building2,
  Laptop,
  HeartHandshake
} from 'lucide-react';
import { CONTACT_CONFIG, getWhatsAppUrl } from '../../config/contact';
import { useAcademicPricing } from '../../context/PricingContext';

interface AcademicProgram {
  id: string;
  category: string;
  title: string;
  englishTitle: string;
  summary: string;
  badge?: string;
  accentColor: string;
  specs: {
    ages: string;
    intensity: string;
    duration: string;
    modality: string;
    levels: string;
  };
  features: string[];
  outcomes: string[];
  whatsappMessage: string;
}

const PROGRAMS: AcademicProgram[] = [
  {
    id: 'kids-teens',
    category: 'Formación Infantil & Juvenil',
    title: 'Kids & Teens Inmersión Temprana',
    englishTitle: 'Early Immersion & Phonetics',
    badge: 'Inmersión Lúdica',
    accentColor: 'border-t-4 border-t-purple-600',
    summary: 'Metodología comunicativa natural diseñada para el desarrollo fonético, la pronunciación sin acento y la confianza conversacional desde temprana edad.',
    specs: {
      ages: '3 a 16 años (segmentados por edad)',
      intensity: '4 a 6 horas semanales',
      duration: 'Ciclos semestrales progresivos',
      modality: 'Presencial Campestre o Virtual',
      levels: 'Pre-A1 hasta B1 (MCER)'
    },
    features: [
      'Aulas lúdicas climatizadas con material audiovisual interactivo',
      'Clubes semanales de conversación con docentes nativos/bilingües C1',
      'Desarrollo de habilidades de lectura crítica y pensamiento en inglés',
      'Reporte semestral de evolución cognitiva y fonética para padres'
    ],
    outcomes: [
      'Pronunciación natural y superación del temor al hablar',
      'Vocabulario contextualizado de más de 1.800 palabras',
      'Preparación integral para estándares de colegios bilingües'
    ],
    whatsappMessage: 'Hola American Dream English, solicito asesoría detallada y plan de estudios para el programa Kids & Teens (3 a 16 años).'
  },
  {
    id: 'jovenes-adultos',
    category: 'Formación Superior & Laboral',
    title: 'Inglés para Jóvenes y Adultos',
    englishTitle: 'English for Life & Global Careers',
    badge: 'Más Demandado',
    accentColor: 'border-t-4 border-t-blue-600',
    summary: 'Programa intensivo de fluidez y comunicación profesional. Diseñado para universitarios, profesionales y emprendedores que necesitan el idioma para crecer.',
    specs: {
      ages: '17 años en adelante',
      intensity: '4 a 8 horas semanales (horarios flexibles)',
      duration: '4 a 6 semestres según nivel inicial',
      modality: 'Presencial Campus Turbo o Virtual',
      levels: 'A1 Principiante hasta C1 Fluidez Avanzada'
    },
    features: [
      'Simulacros de entrevistas laborales y presentaciones de negocios',
      'Laboratorio fonético y técnicas de pensamiento directo en inglés',
      'Horarios nocturnos y sabatinos adaptados a personas que trabajan',
      'Certificación académica oficial con aval Secretaría de Educación (Res. 2471)'
    ],
    outcomes: [
      'Fluidez comunicativa real en reuniones de trabajo y viajes',
      'Dominio de correos, contratos y negociación corporativa',
      'Acreditación oficial MCER válida para ascensos y posgrados'
    ],
    whatsappMessage: 'Hola American Dream English, deseo recibir la malla curricular, horarios y costos del programa para Jóvenes y Adultos (A1 a C1).'
  },
  {
    id: 'virtual-masterclasses',
    category: 'Educación 100% Remota',
    title: 'Clases Virtuales en Vivo & Masterclasses',
    englishTitle: 'Live Synchronous & 24/7 Campus',
    badge: 'Flexibilidad Total',
    accentColor: 'border-t-4 border-t-emerald-600',
    summary: 'Aprende desde cualquier lugar del país con docentes en vivo, tutorías individuales y acceso ilimitado a nuestra plataforma con lecciones en 4K.',
    specs: {
      ages: 'Todas las edades (programas segmentados)',
      intensity: 'Sesiones sincrónicas + campus 24/7',
      duration: 'Avanza a tu propio ritmo con hitos medibles',
      modality: '100% Online síncrono y asíncrono',
      levels: 'A1, A2, B1, B2 y C1'
    },
    features: [
      'Clases en vivo transmitidas con docentes titulares C1/C2',
      'Grabaciones en 4K disponibles de por vida en la biblioteca digital',
      'Masterclasses fonéticas semanales con enfoque práctico',
      'Talleres de conversación guiados en grupos reducidos'
    ],
    outcomes: [
      'Total independencia geográfica sin sacrificar rigor pedagógico',
      'Feedback personalizado del docente en cada sesión',
      'Certificado digital verificable mediante código QR institucional'
    ],
    whatsappMessage: 'Hola American Dream English, me interesa el programa de Clases Virtuales en Vivo y Masterclasses 100% Online.'
  }
];

const FAQS = [
  {
    q: '¿Cómo sé en qué nivel debo comenzar?',
    a: 'Realizamos una prueba diagnóstica comunicativa sin costo. Un docente evaluará tus competencias de comprensión y expresión oral para ubicarte exactamente en el módulo correspondiente, evitando que repitas lo que ya dominas.'
  },
  {
    q: '¿Los programas cuentan con certificación oficial?',
    a: 'Sí. American Dream English opera con la Resolución Oficial 2471 de 2022 emitida por la Secretaría de Educación, alineada con el Marco Común Europeo de Referencia para las Lenguas (MCER). Tu certificado tiene validez legal, curricular y laboral.'
  },
  {
    q: '¿Dónde está ubicada la sede presencial campestre?',
    a: 'Nuestro campus campestre está situado en el Km 1.5 Vía Nacional, Vereda Casanova, en Turbo, Antioquia. Es de fácil acceso sobre la troncal principal, con transporte frecuente cada 10 minutos desde Apartadó, Currulao, Necoclí y Carepa.'
  },
  {
    q: '¿Qué facilidades de pago o becas ofrecen?',
    a: 'Ofrecemos planes de financiación directa sin intereses, convenios empresariales, descuentos por grupos familiares y el programa social de Becas de Excelencia en alianza con patrocinadores privados.'
  }
];

export default function ProgramasPage() {
  const { pricing, formatCop } = useAcademicPricing();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const generalWhatsAppUrl = getWhatsAppUrl(
    'Hola American Dream English, estoy visitando la página de Programas Académicos y deseo agendar una prueba de nivel o recibir asesoría con un asesor de admisiones.'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER INSTITUCIONAL                                               */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio</span>
            </Link>

            <span className="hidden sm:inline-block h-5 w-px bg-slate-200" />

            <Link href="/" className="hidden sm:inline-flex items-center gap-2">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>Aprobado Res. SED 2471 • MCER A1-C1</span>
            </div>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 hover:shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hablar con Admisiones</span>
            </a>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO PRINCIPAL: TIPOGRAFÍA DE IMPACTO & AUTORIDAD INSTITUCIONAL         */}
      {/* ========================================================================= */}
      <section className="relative bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80 overflow-hidden">
        {/* Luces sutiles de fondo arquitectónicas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-blue-50/60 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[300px] bg-gradient-to-t from-red-50/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Eyebrow Institucional */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-black tracking-wide uppercase">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Oferta Académica Oficial 2026 • Urabá & Online</span>
          </div>

          {/* Gran Titular con la Tipografía Fuerte del Home */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Programas Académicos Oficiales de <span className="text-red-600">American Dream English</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Formación bilingüe con validez oficial, docentes titulados con competencia C1/C2 y una metodología conversacional orientada al éxito académico y laboral.
          </p>

          {/* Franja de Acreditaciones Oficiales */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-xl shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Resolución SED 2471 de 2022</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Reconocimiento a la Excelencia Educativa</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-xl shadow-2xs">
              <Languages className="w-4 h-4 text-blue-600" />
              <span>Marco Común Europeo (Niveles A1 a C1)</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATÁLOGO EN PROFUNDIDAD: TARJETAS MODERNAS CON FICHA TÉCNICA CLARA      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Nuestros Tres Ejes Formativos
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Elige el programa adaptado a tu edad, horario y metas de dominio comunicativo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PROGRAMS.map((prog) => {
            const programWaUrl = getWhatsAppUrl(prog.whatsappMessage);

            return (
              <div 
                key={prog.id}
                className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden ${prog.accentColor}`}
              >
                {/* Cuerpo de la tarjeta */}
                <div className="p-6 sm:p-7 space-y-6">
                  
                  {/* Encabezado y Categoría */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        {prog.category}
                      </span>
                      {prog.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {prog.badge}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      {prog.englishTitle}
                    </p>
                  </div>

                  {/* Resumen Pedagógico */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prog.summary}
                  </p>

                  {/* Ficha Técnica Estructurada (Limpia, Sin Saturación de Píldoras) */}
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-500 font-medium">Edad sugerida:</span>
                      <span className="font-bold text-slate-900">{prog.specs.ages}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-500 font-medium">Intensidad horaria:</span>
                      <span className="font-bold text-slate-900">{prog.specs.intensity}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-slate-500 font-medium">Modalidad:</span>
                      <span className="font-bold text-slate-900">{prog.specs.modality}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Niveles abarcados:</span>
                      <span className="font-bold text-blue-700">{prog.specs.levels}</span>
                    </div>
                  </div>

                  {/* Lo que incluye el programa */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Características Principales:
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {prog.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resultados esperados */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Resultados de Aprendizaje:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {prog.outcomes.map((outc, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-2 text-slate-700">
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-snug font-medium">{outc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer de la tarjeta con botón de acción */}
                <div className="p-6 bg-slate-50/80 border-t border-slate-100 mt-2">
                  <a
                    href={programWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 hover:shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Solicitar Plan de Estudios</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3.5 SECCIÓN DE TARIFAS Y MATRÍCULAS DINÁMICAS (SINCRONIZADAS CON ADMIN)    */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wide">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inversión Académica Oficial 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tarifas Claras y Transparentes
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Precios regulados y actualizados en tiempo real según la modalidad de estudio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* PLAN 1: PRESENCIAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Modalidad Presencial</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Campus Campestre Casanova (Turbo)</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Matrícula Semestral:</span>
                    <span className="font-black text-slate-900">{formatCop(pricing.presencial.adultos.matricula)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Jóvenes/Adultos:</span>
                    <span className="font-black text-blue-700">{formatCop(pricing.presencial.adultos.mensualidad)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Niños:</span>
                    <span className="font-black text-blue-700">{formatCop(pricing.presencial.ninos.mensualidad)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/matricula?modalidad=presencial"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-sm active:scale-95"
              >
                Matricularme Presencial
              </Link>
            </div>

            {/* PLAN 2: VIRTUAL */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-indigo-500 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                24/7 Global
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Modalidad Virtual Teams</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Clases en vivo y acceso 24/7</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Matrícula Virtual:</span>
                    <span className="font-black text-slate-900">{formatCop(pricing.virtual.adultos.matricula)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Jóvenes/Adultos:</span>
                    <span className="font-black text-indigo-700">{formatCop(pricing.virtual.adultos.mensualidad)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Niños:</span>
                    <span className="font-black text-indigo-700">{formatCop(pricing.virtual.ninos.mensualidad)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/matricula?modalidad=virtual"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-sm active:scale-95"
              >
                Matricularme Virtual
              </Link>
            </div>

            {/* PLAN 3: BECAS & SUBVENCIONES */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Fondo de Becas Urabá</h3>
                    <p className="text-[11px] text-rose-600 font-bold">Subvención Exclusiva Presencial</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[10px] text-amber-900 leading-relaxed font-medium">
                    🏛️ <strong>Criterio Ético:</strong> Subsidios dirigidos exclusivamente a estudiantes de escasos recursos de Urabá que asistan presencialmente a la sede física.
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Matrícula Becada:</span>
                    <span className="font-black text-slate-900">{formatCop(pricing.becados.adultos.matricula)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Jóvenes/Adultos:</span>
                    <span className="font-black text-rose-600">{formatCop(pricing.becados.adultos.mensualidad)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-600">Mensualidad Niños:</span>
                    <span className="font-black text-rose-600">{formatCop(pricing.becados.ninos.mensualidad)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/becas"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-sm active:scale-95"
              >
                Postularme al Fondo de Becas
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SEDE PRESENCIAL TURBO: CAMPUS CAMPESTRE & LOGÍSTICA DE TRANSPORTE       */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Campus Campestre Oficial Turbo</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Aprende en un Entorno Campestre Diseñado para la Concentración
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Nuestra sede campestre en Turbo cuenta con instalaciones climatizadas, espacios verdes para clubes de conversación al aire libre y total seguridad para niños, jóvenes y adultos.
                </p>

                <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      📍
                    </div>
                    <div>
                      <strong className="text-slate-900">Ubicación exacta:</strong> Km 1.5 Vía Nacional, Vereda Casanova, Turbo, Antioquia.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      🚌
                    </div>
                    <div>
                      <strong className="text-slate-900">Transporte frecuente:</strong> Rutas de buses y colectivos cada 10 minutos desde Apartadó, Currulao, Necoclí y Carepa con parada justo frente a la sede.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      🕒
                    </div>
                    <div>
                      <strong className="text-slate-900">Horarios de atención presencial:</strong> Lunes a Viernes de 8:00 AM a 6:00 PM • Sábados de 8:00 AM a 2:00 PM.
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="https://maps.google.com/?q=8.091769,-76.708828"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                  >
                    <span>Abrir en Google Maps</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300" />
                  </a>

                  <Link
                    href="/como-llegar"
                    className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200 transition-all flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-slate-500" />
                    <span>Ver Guía de Rutas del Urabá</span>
                  </Link>
                </div>

              </div>

              {/* Columna Lateral con resumen de contacto */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-lg">
                    ADE
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Admisiones Campus Turbo
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Atención inmediata por WhatsApp
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <p>
                    Agenda tu visita al campus para conocer las aulas, conversar con el director académico Teacher Anthony y tomar la prueba de nivelación gratuita.
                  </p>
                  <p className="font-semibold text-slate-900">
                    📞 Línea de atención: +57 312 745 9728
                  </p>
                </div>

                <a
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Agendar Visita al Campus</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PREGUNTAS FRECUENTES SOBRE MATRÍCULAS (ACORDEÓN ROBUSTO)                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-600 text-sm">
            Resolvemos tus dudas sobre requisitos, fechas de inicio y metodología.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BANNER DE CIERRE INSTITUCIONAL                                         */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Matrículas Abiertas para el Ciclo 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Da el Primer Paso Hacia Tu Fluidez en Inglés Hoy Mismo
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Nuestros asesores pedagógicos están listos para guiarte en la elección del programa ideal según tus horarios y metas.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-slate-950" />
              <span>Hablar con un Asesor de Admisiones</span>
            </a>

            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Volver a la Página Principal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Mínimo */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        <p>© 2026 American Dream English • Sede Oficial Turbo, Urabá, Antioquia • Res. SED 2471</p>
      </footer>

    </div>
  );
}
