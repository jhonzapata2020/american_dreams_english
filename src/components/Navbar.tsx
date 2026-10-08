import React, { useState } from 'react';
import { Currency } from '../types';
import { Menu, X, GraduationCap, Globe } from 'lucide-react';
import { SoftSwitch3D } from './ui/SoftSwitch3D';
import { useLanguage } from '../context/LanguageContext';
import { InstallPWAButton } from './common/InstallPWAButton';

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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-2xs font-sans h-16 sm:h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
        
        {/* LOGO OFICIAL */}
        <a 
          href="/" 
          className="relative sm:absolute left-0 sm:left-6 top-0 sm:top-0.5 z-20 group inline-flex items-center focus:outline-none flex-shrink-0"
          title="American Dream English"
        >
          <img 
            src="/logo-american-dream.png" 
            alt="American Dream English" 
            className="h-12 sm:h-20 md:h-22 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* CONTENEDOR DE NAVEGACIÓN Y ACCIONES */}
        <div className="flex items-center justify-between w-full pl-0 sm:pl-28 md:pl-32">
          
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
            <button 
              type="button"
              onClick={handleScrollToLocation}
              className="hover:text-[#0F2537] transition-all focus:outline-none cursor-pointer inline-flex items-center gap-1.5 font-bold text-blue-700 bg-blue-50/90 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200/70 shadow-2xs hover:scale-105 active:scale-95"
            >
              <span className="text-xs">📍</span>
              <span>{t.nav.howToGetThere}</span>
            </button>
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

            {/* BOTÓN INSTALAR APP PWA (Universal) */}
            <InstallPWAButton variant="navbar" />

            {/* BOTÓN CAMPUS VIRTUAL INSTITUCIONAL (Desktop / Tablet) */}
            <a 
              href="/campus/login"
              onClick={handleGoToCampus}
              className="hidden md:inline-flex text-xs sm:text-sm font-bold bg-[#002B49] text-white hover:bg-[#001f35] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>{t.nav.campusVirtual}</span>
            </a>

            {/* Inscribirme / Matricúlate CTA Button estilo UNAD (Desktop / Tablet) */}
            <a 
              href="/matricula"
              onClick={handleMatricularme}
              className="hidden sm:inline-flex text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>{t.nav.enroll}</span>
            </a>

            {/* Mobile App Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg bg-slate-50 border border-slate-200 active:scale-95 transition-transform"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile App Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-4 animate-fadeIn shadow-xl">
          
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

          <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-800">
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenProgramas) onOpenProgramas(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>{t.nav.academicPrograms}</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenCursosDigitales) onOpenCursosDigitales(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>{t.nav.digitalCourses4k}</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenClasesEnVivo) onOpenClasesEnVivo(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>{t.nav.liveClassesTitle}</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); handleScrollToLocation(); }} 
              className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 flex items-center justify-between text-left w-full text-blue-900 font-bold"
            >
              <span className="flex items-center gap-2">
                <span>📍</span>
                <span>{t.nav.howToGetThere}</span>
              </span>
              <span className="text-xs text-blue-600 font-bold">→</span>
            </button>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="/matricula"
              onClick={(e) => { setMobileMenuOpen(false); handleMatricularme(e); }}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t.nav.enroll}</span>
            </a>
            <a
              href="/campus/login"
              onClick={handleGoToCampus}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>{t.nav.campusVirtual}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
