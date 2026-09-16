import React, { useState } from 'react';
import { 
  GraduationCap, 
  Globe, 
  Heart, 
  Menu, 
  X, 
  Award, 
  ShieldCheck, 
  Sparkles,
  Building2
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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm font-sans">
      
      {/* Top Banner Legal & Alliance */}
      <div className="bg-navy-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" /> Res. 2471/2022 Sec. Educación Turbo
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Alianza Tecnológica: <strong className="text-white">AMERICAN DREAM ENGLISH S.A.S. & CORPLEX SOLUTIONS S.A.S.</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3 font-semibold text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Certificado MCER (A1-C1)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="bg-navy-900 text-white p-2.5 rounded-xl shadow-md group-hover:bg-navy-800 transition-colors">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-navy-900 font-sans">
                  AMERICAN DREAM
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  ENGLISH
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> S.A.S. • Turbo, Urabá & CORPLEX SOLUTIONS
              </p>
            </div>
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Programas
            </a>
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Cursos Digitales
            </a>
            <a href="#segmentos" className="hover:text-navy-900 transition-colors">
              Clases en Vivo
            </a>
            <a href="#donaciones" className="hover:text-navy-900 transition-colors text-indigo-700 font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> Becas e Impacto
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
                    ? 'bg-white text-navy-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                COP ($)
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCurrency === 'USD'
                    ? 'bg-white text-navy-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Student Portal Button (Outline) */}
            <button
              onClick={onOpenStudentPortal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white transition-all shadow-sm"
            >
              Portal Estudiante
            </button>

            {/* DONAR BECA CTA BUTTON (Red Flag #DC2626) */}
            <button
              onClick={onOpenDonationModal}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 group"
            >
              <Heart className="w-4 h-4 fill-white/20 group-hover:scale-110 transition-transform" />
              <span>Donar Beca</span>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenDonationModal}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              Donar
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
              Cursos Digitales 4K
            </a>
            <a href="#segmentos" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-100">
              Clases en Vivo (Zoom/Teams)
            </a>
            <a href="#donaciones" onClick={() => setMobileMenuOpen(false)} className="py-2 text-indigo-700 font-bold">
              Becas e Impacto Social
            </a>
          </nav>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-bold">Moneda Preferida:</span>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                onClick={() => onCurrencyChange('COP')}
                className={`px-3 py-1 rounded-lg ${selectedCurrency === 'COP' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
              >
                COP
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-3 py-1 rounded-lg ${selectedCurrency === 'USD' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500'}`}
              >
                USD
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenStudentPortal(); }}
              className="w-full py-3 rounded-xl text-xs font-bold border-2 border-navy-900 text-navy-900 text-center"
            >
              Portal Estudiante
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDonationModal(); }}
              className="w-full py-3 rounded-xl text-xs font-bold bg-red-600 text-white text-center shadow-md"
            >
              Donar Beca Ahora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
