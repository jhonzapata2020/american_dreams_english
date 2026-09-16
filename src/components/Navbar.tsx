import React, { useState } from 'react';
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
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        
        {/* Logo Oficial con Escudo Interestatal */}
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src="/logo-american-dream.png" 
            alt="American Dream English" 
            className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:inline-block text-lg font-black tracking-tight text-[#0F2537]">
            AMERICAN DREAM <span className="text-red-600 font-extrabold text-xs align-super">ENGLISH</span>
          </span>
        </a>

        {/* Enlaces Centrales */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">Programas</a>
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">Cursos Digitales</a>
          <a href="#segmentos" className="hover:text-[#0F2537] transition-colors">Clases en Vivo</a>
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

        {/* Controles y Acciones */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Toggle Moneda Minimal */}
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
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            Donar Beca
          </button>

        </div>

      </div>
    </header>
  );
};
