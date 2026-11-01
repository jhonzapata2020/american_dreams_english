'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  BookOpen, 
  Video, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BusinessSegmentsProps {
  currency?: Currency;
  onSelectAction?: (action: 'donate' | 'catalog' | 'live' | 'campus') => void;
  onPreselectTier2?: () => void;
  onOpenDigitalStore?: () => void;
  onOpenLiveClasses?: () => void;
  onOpenPresencial?: () => void;
}

export const BusinessSegments: React.FC<BusinessSegmentsProps> = () => {
  const { t } = useLanguage();

  return (
    <section id="segmentos" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
          <motion.span 
            initial={{ opacity: 0, y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-slate-800 uppercase tracking-widest bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-2xs"
          >
            {t.segments.badge || 'Modalidades de Formación'}
          </motion.span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.segments.title || 'Aprende a Tu Ritmo, en Tu Modalidad'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {t.segments.subtitle || 'Elige la experiencia bilingüe que mejor se adapta a tus metas personales o profesionales.'}
          </p>
        </div>

        {/* 4 FINTECH SQUIRCLE CARDS (EN LÍNEA HORIZONTAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto mt-8 px-4">
          
          {/* CARD 1: Fondo de Becas Urabá (Rosa / Coral vibrante) */}
          <Link
            href="/becas"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-[180px] sm:h-[195px] rounded-[28px] p-5 sm:p-6 text-white flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-white/20 bg-gradient-to-b from-rose-500 to-pink-600 shadow-xl shadow-rose-500/30"
          >
            {/* Top ambient shine */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl w-fit backdrop-blur-md border border-white/20 shadow-xs group-hover:scale-110 transition-transform duration-200">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-white/25 transition-all">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="relative z-10 text-left">
              <h4 className="text-base font-extrabold text-white leading-tight">
                Fondo de Becas
              </h4>
              <p className="text-xs text-rose-100/90 leading-tight mt-1">
                Alianzas y subsidios para talento de Urabá
              </p>
            </div>
          </Link>

          {/* CARD 2: Tienda de Infoproductos (Cyan / Aqua Eléctrico) */}
          <Link
            href="/tienda"
            className="group relative h-[180px] sm:h-[195px] rounded-[28px] p-5 sm:p-6 text-white flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-white/20 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/30"
          >
            {/* Top ambient shine */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl w-fit backdrop-blur-md border border-white/20 shadow-xs group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-white/25 transition-all">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="relative z-10 text-left">
              <h4 className="text-base font-extrabold text-white leading-tight">
                Tienda Digital
              </h4>
              <p className="text-xs text-cyan-100/90 leading-tight mt-1">
                E-books, fonética y masterclasses 4K
              </p>
            </div>
          </Link>

          {/* CARD 3: Clases en Vivo (Azul Royal Institucional) */}
          <Link
            href="/clases-en-vivo"
            className="group relative h-[180px] sm:h-[195px] rounded-[28px] p-5 sm:p-6 text-white flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-white/20 bg-gradient-to-b from-blue-600 to-indigo-700 shadow-xl shadow-blue-600/30"
          >
            {/* Top ambient shine */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl w-fit backdrop-blur-md border border-white/20 shadow-xs group-hover:scale-110 transition-transform duration-200">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-white/25 transition-all">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="relative z-10 text-left">
              <h4 className="text-base font-extrabold text-white leading-tight">
                Clases en Vivo
              </h4>
              <p className="text-xs text-blue-100/90 leading-tight mt-1">
                Grupos reducidos y práctica con docentes
              </p>
            </div>
          </Link>

          {/* CARD 4: Sede Presencial Urabá (Naranja Cálido / Ámbar) */}
          <Link
            href="/sede-uraba"
            className="group relative h-[180px] sm:h-[195px] rounded-[28px] p-5 sm:p-6 text-white flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-white/20 bg-gradient-to-b from-amber-500 to-orange-600 shadow-xl shadow-orange-500/30"
          >
            {/* Top ambient shine */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="bg-white/20 p-2.5 rounded-2xl w-fit backdrop-blur-md border border-white/20 shadow-xs group-hover:scale-110 transition-transform duration-200">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-white/25 transition-all">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="relative z-10 text-left">
              <h4 className="text-base font-extrabold text-white leading-tight">
                Sede Presencial
              </h4>
              <p className="text-xs text-orange-100/90 leading-tight mt-1">
                Turbo • Aulas climatizadas y aval SED
              </p>
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default BusinessSegments;
