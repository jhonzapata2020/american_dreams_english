import React, { useState } from 'react';
import { Currency } from '../types';
import { Menu, X, GraduationCap } from 'lucide-react';

interface NavbarProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenDonationModal: () => void;
  onOpenStudentPortal?: () => void;
  onOpenProgramas?: () => void;
  onOpenCursosDigitales?: () => void;
  onOpenClasesEnVivo?: () => void;
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
  onMatricularme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGoToCampus = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/campus/login';
  };

  const handleMatricularme = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onMatricularme) {
      onMatricularme();
    } else {
      const el = document.getElementById('registro');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onOpenProgramas) {
        onOpenProgramas();
      }
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
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              type="button"
              onClick={onOpenProgramas}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              Programas
            </button>
            <button 
              type="button"
              onClick={onOpenCursosDigitales}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              Cursos Digitales
            </button>
            <button 
              type="button"
              onClick={onOpenClasesEnVivo}
              className="hover:text-[#0F2537] transition-colors focus:outline-none cursor-pointer"
            >
              Clases en Vivo
            </button>
          </nav>

          {/* CONTROLES Y ACCIONES (LADO DERECHO) */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            
            {/* Toggle compacto de moneda [COP | USD] */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-700">
              <button 
                onClick={() => onCurrencyChange('COP')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCurrency === 'COP'
                    ? 'bg-white shadow-2xs text-[#0F2537] font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                COP
              </button>
              <button 
                onClick={() => onCurrencyChange('USD')}
                className={`px-2.5 py-1 rounded transition-all ${
                  selectedCurrency === 'USD'
                    ? 'bg-white shadow-2xs text-[#0F2537] font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD
              </button>
            </div>

            {/* BOTÓN CAMPUS VIRTUAL INSTITUCIONAL */}
            <a 
              href="/campus/login"
              onClick={handleGoToCampus}
              className="inline-flex text-xs sm:text-sm font-bold bg-[#002B49] text-white hover:bg-[#001f35] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Campus Virtual</span>
            </a>

            {/* Inscribirme / Matricúlate CTA Button estilo UNAD */}
            <button 
              type="button"
              onClick={handleMatricularme}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Matricúlate</span>
            </button>

            {/* Mobile App Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none rounded-lg bg-slate-50 border border-slate-200"
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
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Menú de Navegación</span>
            <div className="bg-slate-100 p-0.5 rounded-lg text-xs font-semibold flex items-center">
              <button
                onClick={() => onCurrencyChange('COP')}
                className={`px-3 py-1 rounded-md ${selectedCurrency === 'COP' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'}`}
              >
                COP ($)
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 rounded-md ${selectedCurrency === 'USD' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'}`}
              >
                USD ($)
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-slate-800">
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenProgramas) onOpenProgramas(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>Programas Académicos</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenCursosDigitales) onOpenCursosDigitales(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>Cursos Digitales 4K</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); if (onOpenClasesEnVivo) onOpenClasesEnVivo(); }} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left w-full"
            >
              <span>Clases en Vivo</span>
              <span className="text-xs text-slate-400">→</span>
            </button>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={(e) => { setMobileMenuOpen(false); handleMatricularme(e); }}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Matricúlate</span>
            </button>
            <a
              href="/campus/login"
              onClick={handleGoToCampus}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#002B49] hover:bg-[#001f35] text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Campus Virtual</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
