import React, { useState } from 'react';
import { Currency } from '../types';
import { Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-2xs font-sans h-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
        
        {/* LOGO OFICIAL POSICIONADO INDEPENDIENTE (NO EXPANDE LA ALTURA DEL NAVBAR) */}
        <a 
          href="#" 
          className="absolute left-4 sm:left-6 top-1 sm:top-0.5 z-20 group inline-block focus:outline-none"
          title="American Dream English"
        >
          <img 
            src="/logo-american-dream.png" 
            alt="American Dream English" 
            className="h-16 sm:h-20 md:h-22 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* CONTENEDOR DE NAVEGACIÓN Y ACCIONES CON DESPLAZAMIENTO A LA DERECHA */}
        <div className="flex items-center justify-between w-full pl-20 sm:pl-28 md:pl-32">
          
          {/* ENLACES CENTRALES */}
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
            <a 
              href="#donaciones" 
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('donaciones');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-red-600 font-bold hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Fondo de Becas
            </a>
          </nav>

          {/* CONTROLES Y ACCIONES (LADO DERECHO) */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            
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

            {/* Portal Estudiante */}
            <button 
              onClick={onOpenStudentPortal} 
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0F2537] px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              Portal Estudiante
            </button>

            {/* Donar Beca CTA */}
            <button 
              onClick={onOpenDonationModal} 
              className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              Donar Beca
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-slate-50">
              Programas
            </a>
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-slate-50">
              Cursos Digitales
            </a>
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-1.5 border-b border-slate-50">
              Clases en Vivo
            </a>
            <a href="#donaciones" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-red-600 font-semibold">
              Fondo de Becas
            </a>
          </nav>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">Moneda:</span>
            <div className="bg-slate-100 p-0.5 rounded-lg text-xs font-semibold flex items-center">
              <button
                onClick={() => onCurrencyChange('COP')}
                className={`px-3 py-1 rounded-md ${selectedCurrency === 'COP' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'}`}
              >
                COP
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 rounded-md ${selectedCurrency === 'USD' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500'}`}
              >
                USD
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenStudentPortal(); }}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 text-center"
            >
              Portal Estudiante
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDonationModal(); }}
              className="w-full py-2.5 rounded-full text-xs font-bold bg-red-600 text-white text-center shadow-sm"
            >
              Donar Beca Ahora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
