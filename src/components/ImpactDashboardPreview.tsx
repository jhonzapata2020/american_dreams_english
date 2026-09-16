import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  Clock, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import { SCHOLARSHIP_RECIPIENTS } from '../data/sprint1Data';

interface ImpactDashboardPreviewProps {
  onOpenDonation: () => void;
}

export const ImpactDashboardPreview: React.FC<ImpactDashboardPreviewProps> = ({
  onOpenDonation,
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparencia & Auditoría Pública</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
              Dashboard Auditado de Becados en Urabá
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Cada donante recibe un código único de seguimiento para verificar en tiempo real el progreso pedagógico, la asistencia presencial y las horas certificadas de su estudiante asignado.
            </p>
          </div>

          <button
            onClick={onOpenDonation}
            className="bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-6 py-3 rounded-xl shadow-md glow-crimson transition-all text-xs flex items-center space-x-2 flex-shrink-0"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span>Patrocinar a un Becario</span>
          </button>
        </div>

        {/* RECIPIENT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCHOLARSHIP_RECIPIENTS.map((rec) => {
            const progressPercent = Math.round((rec.accumulatedHours / rec.targetHours) * 100);

            return (
              <div
                key={rec.id}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 clean-card-shadow space-y-4 hover:border-navy-900 transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-navy-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      ID Auditado: {rec.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                      {rec.status}
                    </span>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={rec.photoUrl}
                      alt={rec.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-navy-900/20"
                    />
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-base">{rec.name}</h3>
                      <p className="text-xs text-crimson-600 font-bold bg-crimson-50 px-2 py-0.5 rounded inline-block mt-0.5">
                        {rec.vulnerabilityCondition}
                      </p>
                    </div>
                  </div>

                  {/* Location & Cycle */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Sede / Ubicación:</span>
                      <span className="font-bold text-navy-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-crimson-600" /> {rec.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                      <span className="text-slate-500 font-semibold">Nivel MCER Actual:</span>
                      <span className="font-extrabold text-navy-900">{rec.currentCycle}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Horas Completadas:</span>
                      <span className="text-navy-900 font-mono">{rec.accumulatedHours} / {rec.targetHours} Hrs ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-navy-900 to-crimson-600 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-slate-600 italic mt-4 bg-white p-3 rounded-xl border border-slate-200">
                    "{rec.testimonialSnippet}"
                  </p>

                </div>

                <div className="pt-4 border-t border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Certificado Tributario de Donación Emitido al Padrino
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
