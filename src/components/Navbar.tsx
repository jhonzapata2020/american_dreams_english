'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Currency } from '../types';
import { Menu, X, Globe, ChevronDown, GraduationCap, ArrowRight } from 'lucide-react';
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
    if (onOpenStudentPortal) {
      onOpenStudentPortal();
    } else {
      window.location.href = '/campus/login';
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

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="w-full sticky top-0 z-50">
      {/* 1. TOP ANNOUNCEMENT BAR (SERIO, INSTITUCIONAL & MINIMALISTA) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-center gap-2 select-none">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          {language === 'en'
            ? 'Official Campus Urabá & Online • Education Ministry Res. SED 2471'
            : 'Sede Oficial Urabá & Online • Aprobación Oficial Res. SED 2471'}
        </span>
      </div>

      {/* 2. CONTENEDOR PRINCIPAL DEL NAVBAR */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-colors duration-300 py-3.5 px-6 lg:px-12 font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ZONA IZQUIERDA: BRANDING (LOGO OFICIAL) */}
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="inline-flex items-center focus:outline-none flex-shrink-0 group"
              title="American Dream English"
            >
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </a>
          </div>

          {/* ZONA CENTRAL: NAVEGACIÓN UNIFICADA (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a 
              href="/programas"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
            >
              {t.nav.programs || 'Programas'}
            </a>
            <button 
              type="button"
              onClick={onOpenCursosDigitales}
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
            >
              {t.nav.digitalCourses || 'Cursos Digitales'}
            </button>
            <button 
              type="button"
              onClick={onOpenClasesEnVivo}
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
            >
              {t.nav.liveClasses || 'Clases en Vivo'}
            </button>
            <a 
              href="/tienda"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
            >
              {language === 'en' ? 'Store' : 'Tienda'}
            </a>
            <a 
              href="/nosotros/anthony-cortes"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
              title={language === 'en' ? 'About CEO Teacher Anthony Cortés' : 'Semblanza del CEO Teacher Anthony Cortés'}
            >
              {t.nav.about || (language === 'en' ? 'About' : 'Nosotros')}
            </a>
          </nav>

          {/* ZONA DERECHA: JERARQUÍA DE ACCIONES */}
          <div className="hidden lg:flex items-center gap-3">
            {/* SELECTOR DE IDIOMA MINIMALISTA */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
              aria-label={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
              title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 stroke-[1.75]" />
              <span className="uppercase tracking-wider font-bold text-slate-700">{language.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2]" />
            </button>

            {/* BOTÓN SECUNDARIO: CAMPUS VIRTUAL */}
            <a
              href="/campus/login"
              onClick={handleGoToCampus}
              className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-slate-600 stroke-[1.8]" />
              <span>{t.nav.campusVirtual || 'Campus Virtual'}</span>
            </a>

            {/* BOTÓN PRIMARIO: MATRICÚLATE */}
            <a
              href="/matricula"
              onClick={handleMatricularme}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>{t.nav.enroll || 'Matricúlate'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </a>
          </div>

          {/* VISTA MÓVIL (< lg): IDIOMA + CTA + HAMBURGUESA */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-2.5">
            {/* SELECTOR DE IDIOMA COMPACTO MÓVIL */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50/80 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              aria-label="Cambiar idioma"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
              <span className="uppercase text-[11px] font-bold">{language.toUpperCase()}</span>
            </button>

            {/* BOTÓN PRIMARIO COMPACTO MÓVIL */}
            <a
              href="/matricula"
              onClick={handleMatricularme}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-500/25 flex items-center gap-1 cursor-pointer whitespace-nowrap transition-all"
            >
              <span>{t.nav.enroll || 'Matricúlate'}</span>
            </a>

            {/* BOTÓN HAMBURGUESA MODERNO */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer focus:outline-none"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* MENÚ MÓVIL DESPLEGABLE INSTITUCIONAL */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-slate-100 mt-3 pt-3"
            >
              <div className="py-2 space-y-1 text-sm font-medium text-slate-700">
                <a
                  href="/programas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span>{t.nav.programs || 'Programas'}</span>
                  <span className="text-xs text-slate-400">→</span>
                </a>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onOpenCursosDigitales) onOpenCursosDigitales(); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span>{t.nav.digitalCourses || 'Cursos Digitales'}</span>
                  <span className="text-xs text-slate-400">→</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); if (onOpenClasesEnVivo) onOpenClasesEnVivo(); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span>{t.nav.liveClasses || 'Clases en Vivo'}</span>
                  <span className="text-xs text-slate-400">→</span>
                </button>
                <a
                  href="/tienda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span>{language === 'en' ? 'Store' : 'Tienda'}</span>
                  <span className="text-xs text-slate-400">→</span>
                </a>
                <a
                  href="/nosotros/anthony-cortes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>🎓</span>
                    <span>{language === 'en' ? 'About (Teacher Anthony)' : 'Nosotros (Teacher Anthony)'}</span>
                  </span>
                  <span className="text-xs text-slate-400">→</span>
                </a>
                <a
                  href="/como-llegar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-800 font-semibold cursor-pointer"
                >
                  <span>{language === 'en' ? 'Campus Location' : 'Sede Presencial (Cómo llegar)'}</span>
                  <span className="text-xs text-slate-400">→</span>
                </a>
              </div>

              {/* ACCIONES INFERIORES EN MÓVIL */}
              <div className="pt-3 pb-1 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="/campus/login"
                  onClick={(e) => { setMobileMenuOpen(false); handleGoToCampus(e); }}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-slate-600" />
                  <span>{t.nav.campusVirtual || 'Campus Virtual'}</span>
                </a>

                <a
                  href="/matricula"
                  onClick={(e) => { setMobileMenuOpen(false); handleMatricularme(e); }}
                  className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <span>{t.nav.enroll || 'Matricúlate'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};
