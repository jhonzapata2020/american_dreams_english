import React from 'react';
import { GraduationCap, Award, MessageCircle, UserCheck, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentTab: 'landing' | 'campus';
  onSelectTab: (tab: 'landing' | 'campus') => void;
  userRole: 'student' | 'teacher';
  onToggleRole: (role: 'student' | 'teacher') => void;
  onOpenWhatsApp: () => void;
  onOpenPlacementTest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onToggleRole,
  onOpenWhatsApp,
  onOpenPlacementTest,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('landing')}>
            <div className="bg-gradient-to-tr from-blue-700 to-indigo-500 p-2.5 rounded-xl shadow-md flex items-center justify-center text-white ring-2 ring-indigo-400/30">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  AMERICAN DREAMS
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> 12 Años
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Instituto de Idiomas • Turbo, Urabá Antioqueño
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onSelectTab('landing')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                currentTab === 'landing'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Sitio Institucional
            </button>

            <button
              onClick={() => onSelectTab('campus')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                currentTab === 'campus'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Campus Virtual (Audio)</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Pill Switch for Demo Role (Only visible when inside Campus or always accessible) */}
            {currentTab === 'campus' && (
              <div className="bg-slate-800/90 border border-slate-700 p-1 rounded-full flex items-center shadow-inner">
                <button
                  onClick={() => onToggleRole('student')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    userRole === 'student'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Vista Alumno
                </button>
                <button
                  onClick={() => onToggleRole('teacher')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    userRole === 'teacher'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Vista Profesor
                </button>
              </div>
            )}

            {/* Test de Nivelación Lead Button */}
            <button
              onClick={onOpenPlacementTest}
              className="hidden lg:flex items-center space-x-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Test 3 Min.</span>
            </button>

            {/* WhatsApp Contact */}
            <button
              onClick={onOpenWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span className="hidden sm:inline">Consulta WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

          </div>

        </div>

        {/* Mobile Tab bar */}
        <div className="flex md:hidden border-t border-slate-800 py-2 justify-around text-xs font-medium">
          <button
            onClick={() => onSelectTab('landing')}
            className={`py-1.5 px-3 rounded-lg ${currentTab === 'landing' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}
          >
            Sitio Web
          </button>
          <button
            onClick={() => onSelectTab('campus')}
            className={`py-1.5 px-3 rounded-lg flex items-center space-x-1 ${currentTab === 'campus' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Campus Virtual</span>
          </button>
        </div>
      </div>
    </header>
  );
};
