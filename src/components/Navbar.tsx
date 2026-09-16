import React, { useState } from 'react';
import { 
  GraduationCap, 
  Heart, 
  Menu, 
  X, 
  UserCheck
} from 'lucide-react';
import { Currency } from '../types';

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
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 h-18 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8">
        
        {/* BLOQUE IZQUIERDO: LOGO UNIFICADO (En una sola línea) */}
        <a href="#" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#0F2537] flex items-center justify-center text-white group-hover:bg-navy-800 transition-colors shadow-2xs">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
              AMERICAN DREAM
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
              ENGLISH
            </span>
          </div>
        </a>

        {/* BLOQUE CENTRAL: NAVEGACIÓN LIMPIA (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
            Programas
          </a>
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
            Cursos Digitales
          </a>
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">
            Clases en Vivo
          </a>
          <a href="#donaciones" className="hover:text-[#0F2537] transition-colors flex items-center gap-1.5 font-semibold text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Fondo de Becas
          </a>
        </nav>

        {/* BLOQUE DERECHO: ACCIONES Y CTAs */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          
          {/* Toggle de Moneda minimalista */}
          <div className="bg-slate-100 p-0.5 rounded-lg text-xs font-semibold flex items-center">
            <button
              onClick={() => onCurrencyChange('COP')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedCurrency === 'COP'
                  ? 'bg-white text-[#0F2537] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              COP
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedCurrency === 'USD'
                  ? 'bg-white text-[#0F2537] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              USD
            </button>
          </div>

          {/* Botón Portal Estudiante */}
          <button
            onClick={onOpenStudentPortal}
            className="text-slate-700 hover:text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-slate-500" />
            <span>Portal Estudiante</span>
          </button>

          {/* Botón Donar Beca (Crimson Red) */}
          <button
            onClick={onOpenDonationModal}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2 transition"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span>Donar Beca</span>
          </button>

        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={onOpenDonationModal}
            className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full"
          >
            Donar Beca
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
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
            <a href="#donaciones" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-indigo-700 font-semibold">
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
