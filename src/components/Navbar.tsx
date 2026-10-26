'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Currency } from '../types';
import { Menu, X, GraduationCap, MapPin, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';
import { SoftSwitch3D } from './ui/SoftSwitch3D';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  selectedCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  onOpenDonationModal?: () => void;
  onOpenStudentPortal?: () => void;
  onOpenProgramas?: () => void;
  onOpenCursosDigitales?: () => void;
  onOpenClasesEnVivo?: () => void;
  onOpenLocation?: () => void;
  onMatricularme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCurrency,
  onCurrencyChange,
  onOpenDonationModal,
  onOpenStudentPortal,
  onOpenProgramas,
  onOpenCursosDigitales,
  onOpenClasesEnVivo,
  onOpenLocation,
  onMatricularme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleGoToCampus = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/campus/login';
  };

  const handleScrollToLocation = () => {
    if (onOpenLocation) {
      onOpenLocation();
    } else {
      const el = document.getElementById('sede-presencial');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMatricularme = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMatricularme) {
      onMatricularme();
    } else {
      window.location.href = '/matricula';
    }
  };

  return (
    <header className="sticky top-2.5 sm:top-3.5 z-50 w-full px-3 sm:px-6 transition-all duration-300 font-sans pointer-events-none">
      <div className="max-w-7xl mx-auto">
        
        {/* FLOATING ISLAND CAPSULE (ESTILO NAVBAR.GALLERY LUXURY MINIMAL PILL) */}
        <div className="relative bg-white/85 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.12)] rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          
          {/* Top subtle light edge */}
          <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

          {/* LEFT: LOGO OFICIAL CON MICROINTERACCIÓN 3D */}
          <div className="flex items-center gap-3">
            <motion.a 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/" 
              className="inline-flex items-center focus:outline-none flex-shrink-0"
              title="American Dream English"
            >
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-xs transition-transform duration-300"
              />
            </motion.a>

            {/* LIVE INSTITUTIONAL BADGE (Visible in desktop/tablet) */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sede Urabá & Online · Res. 2471</span>
            </div>
          </div>

          {/* CENTER: ENLACES PRINCIPALES (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-[13px] font-semibold text-slate-600">
            <button 
              type="button"
              onClick={onOpenProgramas}
              className="hover:text-slate-900 transition-colors focus:outline-none cursor-pointer py-1"
            >
              {t.nav.programs}
            </button>
            <button 
              type="button"
              onClick={onOpenCursosDigitales}
              className="hover:text-slate-900 transition-colors focus:outline-none cursor-pointer py-1"
            >
              {t.nav.digitalCourses}
            </button>
            <button 
              type="button"
              onClick={onOpenClasesEnVivo}
              className="hover:text-slate-900 transition-colors focus:outline-none cursor-pointer py-1"
            >
              {t.nav.liveClasses}
            </button>
            <motion.a 
              whileHover={{ y: -1 }}
              href="/como-llegar"
              className="hover:text-red-700 transition-colors focus:outline-none cursor-pointer inline-flex items-center gap-1 py-1"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>{language === 'en' ? 'Location' : 'Cómo llegar'}</span>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              href="/tienda"
              className="hover:text-slate-900 transition-all focus:outline-none cursor-pointer inline-flex items-center gap-1.5 font-bold text-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 px-3.5 py-1.5 rounded-full border border-amber-300/80 shadow-xs group"
              title="Tienda & Recursos Oficiales"
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-600 ring-1 ring-white animate-pulse" />
              </div>
              <span className="text-xs font-black tracking-wide text-slate-800">Tienda</span>
            </motion.a>
          </nav>

          {/* RIGHT: CONTROLES DE ACCESO & MATRÍCULA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* SELECTOR DE IDIOMA 3D [ ES | EN ] */}
            <div className="flex items-center px-1.5 py-0.5 bg-slate-100/80 rounded-full border border-slate-200/70 shadow-2xs">
              <SoftSwitch3D
                checked={language === 'en'}
                onChange={(isEn) => setLanguage(isEn ? 'en' : 'es')}
                leftLabel="ES"
                rightLabel="EN"
                size="sm"
                ariaLabel="Alternar idioma entre Español e Inglés"
              />
            </div>

            {/* BOTÓN CÓMO LLEGAR (Visible en móviles para acceso directo) */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              href="/como-llegar"
              className="inline-flex lg:hidden items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1.5 rounded-full transition-all shadow-2xs whitespace-nowrap cursor-pointer"
              title="¿Cómo llegar a la Sede Presencial?"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="max-[380px]:hidden">{language === 'en' ? 'Map' : 'Sede'}</span>
            </motion.a>

            {/* BOTÓN CAMPUS VIRTUAL INSTITUCIONAL (Desktop / Tablet) */}
            <motion.a 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              href="/campus/login"
              onClick={handleGoToCampus}
              className="hidden md:inline-flex text-xs font-bold bg-[#002B49] text-white hover:bg-[#001f35] px-3.5 py-2 rounded-full transition-all items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <GraduationCap className="w-3.5 h-3.5 text-white" />
              <span>{t.nav.campusVirtual}</span>
            </motion.a>

            {/* Inscribirme / Matricúlate CTA Button con Shimmer Beam */}
            <motion.a 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              href="/matricula"
              onClick={handleMatricularme}
              className="relative overflow-hidden hidden sm:inline-flex text-xs font-black bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 py-2 rounded-full transition-shadow items-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer whitespace-nowrap"
            >
              <motion.span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full pointer-events-none"
                animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1.5 }}
              />
              <span className="relative z-10">{t.nav.enroll}</span>
            </motion.a>

            {/* Mobile Menu Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-full bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>

          </div>

        </div>

        {/* MOBILE APP DRAWER CON CRISTAL ESMERILADO (FROSTED GLASS) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="lg:hidden pointer-events-auto mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.nav.navigationMenu}</span>
                
                <div className="flex items-center px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                  <SoftSwitch3D
                    checked={language === 'en'}
                    onChange={(isEn) => setLanguage(isEn ? 'en' : 'es')}
                    leftLabel="ES"
                    rightLabel="EN"
                    size="sm"
                    ariaLabel="Alternar idioma"
                  />
                </div>
              </div>

              <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-800">
                <button 
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onOpenProgramas) onOpenProgramas(); }} 
                  className="py-2.5 px-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors cursor-pointer"
                >
                  <span>{t.nav.academicPrograms}</span>
                  <span className="text-xs text-slate-400">→</span>
                </button>
                <button 
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onOpenCursosDigitales) onOpenCursosDigitales(); }} 
                  className="py-2.5 px-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors cursor-pointer"
                >
                  <span>{t.nav.digitalCourses4k}</span>
                  <span className="text-xs text-slate-400">→</span>
                </button>
                <button 
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onOpenClasesEnVivo) onOpenClasesEnVivo(); }} 
                  className="py-2.5 px-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors cursor-pointer"
                >
                  <span>{t.nav.liveClassesTitle}</span>
                  <span className="text-xs text-slate-400">→</span>
                </button>
                <a 
                  href="/como-llegar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-2xl bg-red-50/70 hover:bg-red-100/80 border border-red-200/70 flex items-center justify-between text-left w-full text-red-950 font-bold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{language === 'en' ? 'Location (Campus Map)' : '¿Cómo Llegar? (Mapa y Sede)'}</span>
                  </span>
                  <span className="text-xs text-red-700 font-bold">→</span>
                </a>
                <a 
                  href="/tienda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 flex items-center justify-between text-left w-full text-amber-950 font-bold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>Tienda Oficial</span>
                  </span>
                  <span className="text-xs text-amber-700 font-bold">→</span>
                </a>
              </nav>

              <div className="pt-2 flex flex-col gap-2.5">
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href="/matricula"
                  onClick={(e) => { setMobileMenuOpen(false); handleMatricularme(e); }}
                  className="w-full py-3 rounded-full text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>{t.nav.enroll}</span>
                </motion.a>
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href="/campus/login"
                  onClick={handleGoToCampus}
                  className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  <span>{t.nav.campusVirtual}</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
