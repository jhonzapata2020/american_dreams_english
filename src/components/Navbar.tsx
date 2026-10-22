'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Currency } from '../types';
import { Menu, X, GraduationCap, Globe, MapPin } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs font-sans h-16 sm:h-20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
        
        {/* LOGO OFICIAL CON MICROINTERACCIÓN DE HOVER */}
        <motion.a 
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          href="/" 
          className="absolute left-2.5 min-[380px]:left-3.5 sm:left-6 top-2 sm:top-1.5 z-20 group inline-flex items-center focus:outline-none flex-shrink-0"
          title="American Dream English"
        >
          <img 
            src="/logo-american-dream.png" 
            alt="American Dream English" 
            className="h-[58px] min-[380px]:h-[62px] sm:h-[54px] md:h-[63px] lg:h-[63px] xl:h-[68px] w-auto object-contain filter drop-shadow-md transition-transform duration-300"
          />
        </motion.a>

        {/* CONTENEDOR DE NAVEGACIÓN Y ACCIONES */}
        <div className="flex items-center justify-between w-full pl-20 min-[380px]:pl-24 sm:pl-[72px] md:pl-[84px] lg:pl-[92px]">
          
          {/* ENLACES CENTRALES (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600">
            <button 
              type="button"
              onClick={onOpenProgramas}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              {t.nav.programs}
            </button>
            <button 
              type="button"
              onClick={onOpenCursosDigitales}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              {t.nav.digitalCourses}
            </button>
            <button 
              type="button"
              onClick={onOpenClasesEnVivo}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              {t.nav.liveClasses}
            </button>
            <motion.a 
              whileHover={{ y: -1 }}
              href="/como-llegar"
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer inline-flex items-center gap-1.5 text-slate-600 hover:text-red-700 font-semibold"
            >
              <MapPin className="w-4 h-4 text-red-600" />
              <span>{language === 'en' ? 'Location / Map' : 'Cómo llegar'}</span>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              href="/tienda"
              className="hover:text-[#0F2537] transition-all focus:outline-none cursor-pointer inline-flex items-center gap-1.5 font-bold text-slate-800 bg-amber-50/90 hover:bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-2xs"
            >
              <span className="text-xs">🛒</span>
              <span>Tienda</span>
            </motion.a>
          </nav>

          {/* CONTROLES Y ACCIONES (LADO DERECHO) */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            
            {/* SELECTOR DE IDIOMA NEUMÓRFICO SOFT 3D [ ES | EN ] */}
            <div className="flex items-center px-1.5 sm:px-2 py-1 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-2xs">
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
              className="inline-flex lg:hidden items-center gap-1 text-[11px] sm:text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer"
              title="¿Cómo llegar a la Sede Presencial?"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="max-[380px]:hidden">{language === 'en' ? 'Location' : 'Cómo llegar'}</span>
            </motion.a>

            {/* BOTÓN CAMPUS VIRTUAL INSTITUCIONAL (Desktop / Tablet) */}
            <motion.a 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              href="/campus/login"
              onClick={handleGoToCampus}
              className="hidden md:inline-flex text-xs sm:text-sm font-bold bg-[#002B49] text-white hover:bg-[#001f35] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>{t.nav.campusVirtual}</span>
            </motion.a>

            {/* Inscribirme / Matricúlate CTA Button con Spring Physics y Shimmer 21st.dev */}
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              href="/matricula"
              onClick={handleMatricularme}
              className="relative overflow-hidden hidden sm:inline-flex text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-shadow items-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer whitespace-nowrap"
            >
              {/* Haz de luz líquido brillante */}
              <motion.span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full pointer-events-none"
                animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1.5 }}
              />
              <span className="relative z-10">{t.nav.enroll}</span>
            </motion.a>

            {/* Mobile App Menu Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-xl bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>

          </div>

        </div>

      </div>

      {/* Mobile App Drawer Navigation con Cortina Animada AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-4 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.nav.navigationMenu}</span>
              
              <div className="flex items-center px-1.5 py-0.5 bg-slate-50 rounded-xl border border-slate-200">
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
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors"
              >
                <span>{t.nav.academicPrograms}</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); if (onOpenCursosDigitales) onOpenCursosDigitales(); }} 
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors"
              >
                <span>{t.nav.digitalCourses4k}</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); if (onOpenClasesEnVivo) onOpenClasesEnVivo(); }} 
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full transition-colors"
              >
                <span>{t.nav.liveClassesTitle}</span>
                <span className="text-xs text-slate-400">→</span>
              </button>
              <a 
                href="/como-llegar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-red-50/70 hover:bg-red-100/80 border border-red-200/70 flex items-center justify-between text-left w-full text-red-950 font-bold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{language === 'en' ? '📍 How to Get There (Campus Map)' : '📍 ¿Cómo Llegar? (Mapa y Sede)'}</span>
                </span>
                <span className="text-xs text-red-700 font-bold">→</span>
              </a>
              <a 
                href="/tienda"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 flex items-center justify-between text-left w-full text-amber-950 font-bold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>🛒</span>
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
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>{t.nav.enroll}</span>
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.98 }}
                href="/campus/login"
                onClick={handleGoToCampus}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-white" />
                <span>{t.nav.campusVirtual}</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
