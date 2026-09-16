import React, { useState } from 'react';
import { 
  GraduationCap, 
  Heart, 
  Menu, 
  X, 
  MapPin,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 font-sans shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand: AMERICAN DREAM ENGLISH */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="bg-navy-900 text-white p-2.5 rounded-xl shadow-sm group-hover:bg-navy-800 transition-colors">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-navy-900 font-sans">
                  AMERICAN DREAM
                </span>
                <span className="text-xs font-black text-crimson-600 uppercase tracking-widest bg-crimson-50 px-1.5 py-0.5 rounded border border-crimson-100">
                  ENGLISH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-crimson-600" /> Turbo, Urabá
              </p>
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Programas
            </a>
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Cursos Digitales
            </a>
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Clases en Vivo
            </a>
            <a href="#donaciones" className="hover:text-navy-900 transition-colors text-indigo-700 font-bold">
              Fondo de Becas
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Currency Selector */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-200">
              <button
                onClick={() => onCurrencyChange('COP')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCurrency === 'COP'
                    ? 'bg-white text-navy-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                COP
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCurrency === 'USD'
                    ? 'bg-white text-navy-900 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD
              </button>
            </div>

            {/* Portal Estudiante (Outline Button) */}
            <button
              onClick={onOpenStudentPortal}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:border-navy-900 hover:text-navy-900 transition-all flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Portal Estudiante</span>
            </button>

            {/* Donar Beca CTA Button (Crimson #DC2626) */}
            <button
              onClick={onOpenDonationModal}
              className="bg-crimson-600 hover:bg-crimson-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 group"
            >
              <Heart className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform" />
              <span>Donar Beca</span>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenDonationModal}
              className="bg-crimson-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Donar Beca
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-navy-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-700">
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">
              Programas Académicos
            </a>
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">
              Cursos Digitales
            </a>
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">
              Clases en Vivo
            </a>
            <a href="#donaciones" onClick={() => setMobileMenuOpen(false)} className="py-2 text-indigo-700 font-bold">
              Fondo de Becas
            </a>
          </nav>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-bold">Moneda Preferida:</span>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                onClick={() => onCurrencyChange('COP')}
                className={`px-3 py-1 rounded-lg ${selectedCurrency === 'COP' ? 'bg-white text-navy-900 shadow-2xs' : 'text-slate-500'}`}
              >
                COP
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 rounded-lg ${selectedCurrency === 'USD' ? 'bg-white text-navy-900 shadow-2xs' : 'text-slate-500'}`}
              >
                USD
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenStudentPortal(); }}
              className="w-full py-3 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 text-center"
            >
              Portal Estudiante
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDonationModal(); }}
              className="w-full py-3 rounded-xl text-xs font-bold bg-crimson-600 text-white text-center shadow-sm"
            >
              Donar Beca Ahora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
