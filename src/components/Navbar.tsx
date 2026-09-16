import React, { useState } from 'react';
import { Currency } from '../types';
import { Menu, X, UserCheck, Heart } from 'lucide-react';

interface NavbarProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenDonationModal: () => void;
  onOpenStudentPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCurrency,
  onCurrencyChange,
  onOpenDonationModal,
  onOpenStudentPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-2xs font-sans h-16 sm:h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
        
        {/* LOGO OFICIAL CON ESCALADO RESPONSIVO (Ajustado para App Móvil sin pisar el Hero) */}
        <a 
          href="#" 
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
            <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
              Programas
            </a>
            <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
              Cursos Digitales
            </a>
            <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
              Clases en Vivo
            </a>
          </nav>

          {/* CONTROLES Y ACCIONES (LADO DERECHO APP STYLE) */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            
            {/* Toggle compacto de moneda [COP | USD] (Desktop/Tablet) */}
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

            {/* Portal Estudiante */}
            <button 
              onClick={onOpenStudentPortal} 
              className="hidden md:inline-flex text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0F2537] px-3 py-2 rounded-lg hover:bg-slate-50 transition items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>Portal Estudiante</span>
            </button>

            {/* Inscribirme / Matricularse CTA Button */}
            <a 
              href="#segmentos"
              className="bg-[#0F2537] hover:bg-navy-800 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Matricularme</span>
            </a>

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
            <a 
              href="#segmentos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between"
            >
              <span>Programas Académicos</span>
              <span className="text-xs text-slate-400">→</span>
            </a>
            <a 
              href="#segmentos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between"
            >
              <span>Cursos Digitales 4K</span>
              <span className="text-xs text-slate-400">→</span>
            </a>
            <a 
              href="#segmentos" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between"
            >
              <span>Clases en Vivo</span>
              <span className="text-xs text-slate-400">→</span>
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenStudentPortal(); }}
              className="w-full py-3 rounded-xl text-xs font-bold text-navy-900 border-2 border-navy-900 text-center flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-navy-900" />
              <span>Acceder al Portal Estudiante</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
