import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Heart, 
  Users, 
  Clock, 
  Award, 
  CheckCircle2, 
  GraduationCap,
  UserCheck,
  Lock
} from 'lucide-react';
import { SCHOLARSHIP_RECIPIENTS, COHORT_METRICS } from '../data/sprint1Data';

interface ImpactDashboardPreviewProps {
  onOpenDonation: () => void;
}

export const ImpactDashboardPreview: React.FC<ImpactDashboardPreviewProps> = ({
  onOpenDonation,
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DEL COMPONENTE */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transparencia & Cumplimiento Ley 1581 (Habeas Data)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
              Fondo de Becas & Transparencia Académica
            </h2>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              Seguimiento al avance pedagógico de nuestros becarios en Urabá bajo estándares del Marco Común Europeo (MCER). Datos anonimizados en cumplimiento de la Ley 1581 de 2012 de Protección de Datos Personales.
            </p>
          </div>

          <button
            onClick={onOpenDonation}
            className="bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center space-x-2 flex-shrink-0"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span>Patrocinar a un Becario</span>
          </button>
        </div>

        {/* BLOQUE SUPERIOR: MÉTRICAS CONSOLIDADAS DE IMPACTO (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estudiantes Beneficiados</span>
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900">
              {COHORT_METRICS.totalActiveScholars} <span className="text-crimson-600 text-xl">+</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Becarios activos en formación</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Horas Impartidas</span>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900">
              {COHORT_METRICS.totalFundedHours.toLocaleString()} <span className="text-emerald-600 text-xl">Hrs</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Horas de clase financiadas</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retención & Asistencia</span>
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900">
              {COHORT_METRICS.completionRate}
            </div>
            <p className="text-xs text-slate-500 font-medium">Tasa de permanencia académica</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificaciones Otorgadas</span>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900">
              {COHORT_METRICS.certifiedStudentsMCER}
            </div>
            <p className="text-xs text-slate-500 font-medium">Estudiantes certificados MCER</p>
          </div>

        </div>

        {/* BLOQUE INFERIOR: TARJETAS DE PROGRESO ACADÉMICO ANONIMIZADAS */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              Auditoría en Vivo por Becario Anonimizado:
            </h3>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Identidad protegida según Ley 1581
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCHOLARSHIP_RECIPIENTS.map((rec) => {
              const progressPercent = Math.round((rec.accumulatedHours / rec.targetHours) * 100);

              return (
                <div
                  key={rec.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    
                    {/* Header de Tarjeta */}
                    <div className="flex items-center justify-between">
                      <span className="bg-navy-900 text-white text-[11px] font-extrabold px-3 py-1 rounded-full font-mono">
                        {rec.anonymizedCode}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                        {rec.academicStatus}
                      </span>
                    </div>

                    {/* Avatar Abstracto & Categoría Unificada */}
                    <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-navy-900 text-amber-400 flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-navy-900 block">
                          {rec.programCategory}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-crimson-600" /> {rec.location}
                        </span>
                      </div>
                    </div>

                    {/* Progreso Académico MCER */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="text-slate-500">Nivel MCER:</span>
                        <span className="text-navy-900 font-extrabold">{rec.currentCycle}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Horas Completadas:</span>
                          <span className="font-mono text-navy-900">{rec.accumulatedHours} / {rec.targetHours} Hrs ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-navy-900 h-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Testimonio de Meta Profesional (Sin condiciones personales) */}
                    <p className="text-xs text-slate-600 italic bg-white p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                      "{rec.impactAchievementQuote}"
                    </p>

                  </div>

                  {/* Footer de Tarjeta */}
                  <div className="pt-3 border-t border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Auditoría de asistencia y notas certificada por American Dream English S.A.S.
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
