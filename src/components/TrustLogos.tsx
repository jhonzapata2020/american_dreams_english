import React from 'react';
import { Award, ShieldCheck, CheckCircle2, GraduationCap, Building2 } from 'lucide-react';

export const TrustLogos: React.FC = () => {
  return (
    <section className="bg-slate-50 border-b border-slate-100 py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-around gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
          
          <div className="flex items-center space-x-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <ShieldCheck className="w-5 h-5 text-navy-900" />
            <span className="text-navy-900 font-extrabold">Secretaría de Educación Turbo</span>
          </div>

          <div className="flex items-center space-x-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-slate-800">Resolución Oficial 2471/2022</span>
          </div>

          <div className="flex items-center space-x-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span className="text-slate-800">Marco Común Europeo (MCER)</span>
          </div>

          <div className="flex items-center space-x-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <Building2 className="w-5 h-5 text-indigo-700" />
            <span className="text-slate-800">Alcaldía Distrital de Turbo</span>
          </div>

          <div className="flex items-center space-x-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
            <CheckCircle2 className="w-5 h-5 text-crimson-600" />
            <span className="text-slate-800">Galardón Pisingo de Oro</span>
          </div>

        </div>
      </div>
    </section>
  );
};
