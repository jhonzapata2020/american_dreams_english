import React, { useState } from 'react';
import { Phone, MessageCircle, UserCheck, Award, ShieldCheck } from 'lucide-react';

interface TopSubheaderProps {
  onOpenStudentPortal: () => void;
}

export const TopSubheader: React.FC<TopSubheaderProps> = ({ onOpenStudentPortal }) => {
  const [activeTab, setActiveTab] = useState<'adultos' | 'jovenes' | 'empresas' | 'becas'>('adultos');

  return (
    <div className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 h-auto sm:h-10 py-1.5 sm:py-0">
        
        {/* Left Segment Tabs (Open English Style) */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('adultos')}
            className={`px-3 py-1 rounded-t-md transition-all ${
              activeTab === 'adultos'
                ? 'bg-white text-navy-900 border-t-2 border-red-600 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Adultos
          </button>
          <button
            onClick={() => setActiveTab('jovenes')}
            className={`px-3 py-1 rounded-t-md transition-all ${
              activeTab === 'jovenes'
                ? 'bg-white text-navy-900 border-t-2 border-red-600 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Niños y Jóvenes
          </button>
          <button
            onClick={() => setActiveTab('empresas')}
            className={`px-3 py-1 rounded-t-md transition-all ${
              activeTab === 'empresas'
                ? 'bg-white text-navy-900 border-t-2 border-red-600 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Empresas B2B
          </button>
          <button
            onClick={() => setActiveTab('becas')}
            className={`px-3 py-1 rounded-t-md transition-all ${
              activeTab === 'becas'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 font-extrabold shadow-sm'
                : 'text-indigo-700 font-bold hover:text-navy-900'
            }`}
          >
            Fondo de Becas Urabá
          </button>
        </div>

        {/* Right Info & Contact Controls */}
        <div className="flex items-center space-x-4 text-[11px]">
          
          <a 
            href="https://wa.me/573000000000" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Directo</span>
          </a>

          <div className="flex items-center gap-1 text-slate-800 font-bold bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
            <Phone className="w-3 h-3 text-red-600" />
            <span className="text-navy-900">+57 (604) 827-2471</span>
          </div>

          <a
            href="/login"
            className="flex items-center gap-1 text-navy-900 hover:text-red-600 font-extrabold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-navy-900" />
            <span>Portales RBAC (Login)</span>
          </a>

        </div>

      </div>
    </div>
  );
};
