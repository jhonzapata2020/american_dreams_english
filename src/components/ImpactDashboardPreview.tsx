'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Heart, 
  Users, 
  Clock, 
  Award, 
  GraduationCap, 
  UserCheck, 
  Lock 
} from 'lucide-react';
import { getScholarshipRecipients, getCohortMetrics } from '../data/sprint1Data';
import { useLanguage } from '../context/LanguageContext';

interface ImpactDashboardPreviewProps {
  onOpenDonation: () => void;
}

export const ImpactDashboardPreview: React.FC<ImpactDashboardPreviewProps> = ({
  onOpenDonation,
}) => {
  const { language, t } = useLanguage();
  const recipients = getScholarshipRecipients(language);
  const metrics = getCohortMetrics(language);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DEL COMPONENTE */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.impact.badge}</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              {t.impact.title}
            </h2>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              {t.impact.subtitle}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenDonation}
            className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-md transition-all text-xs flex items-center space-x-2 flex-shrink-0 cursor-pointer"
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none"
              animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', repeatDelay: 1.5 }}
            />
            <Heart className="w-4 h-4 fill-white/20 relative z-10" />
            <span className="relative z-10">{t.impact.ctaButton}</span>
          </motion.button>
        </div>

        {/* BLOQUE SUPERIOR: MÉTRICAS CONSOLIDADAS DE IMPACTO (4 CARDS CON SPRING HOVER) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.impact.metricScholars}</span>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900 tracking-tight">
              {metrics.totalActiveScholars} <span className="text-red-600 text-xl font-black">+</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.impact.metricScholarsSub}</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.impact.metricHours}</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900 tracking-tight">
              {metrics.totalFundedHours.toLocaleString()} <span className="text-emerald-600 text-xl font-bold">Hrs</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.impact.metricHoursSub}</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.impact.metricRetention}</span>
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900 tracking-tight">
              {metrics.completionRate}
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.impact.metricRetentionSub}</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-default"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.impact.metricCerts}</span>
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900 tracking-tight">
              {metrics.certifiedStudentsMCER}
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.impact.metricCertsSub}</p>
          </motion.div>

        </div>

        {/* BLOQUE INFERIOR: TARJETAS DE PROGRESO ACADÉMICO ANONIMIZADAS */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              {language === 'en' ? 'Live Audit by Anonymized Scholar:' : 'Auditoría en Vivo por Becario Anonimizado:'}
            </h3>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> {language === 'en' ? 'Identity protected under privacy regulations' : 'Identidad protegida según Ley 1581'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipients.map((rec) => {
              const progressPercent = Math.round((rec.accumulatedHours / rec.targetHours) * 100);

              return (
                <motion.div
                  key={rec.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    
                    {/* Header de Tarjeta */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#002B49] text-white text-[11px] font-extrabold px-3 py-1 rounded-full font-mono">
                        {rec.anonymizedCode}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                        {rec.academicStatus === 'En curso' ? t.impact.activeStatus : t.impact.certifyingStatus}
                      </span>
                    </div>

                    {/* Avatar Abstracto & Categoría Unificada */}
                    <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-[#002B49] text-amber-400 flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-navy-900 block">
                          {rec.programCategory}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600" /> {rec.location}
                        </span>
                      </div>
                    </div>

                    {/* Progreso Académico MCER */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="text-slate-500">{language === 'en' ? 'CEFR Level:' : 'Nivel MCER:'}</span>
                        <span className="text-[#002B49] font-extrabold">{rec.currentCycle}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>{t.impact.hoursCompleted}</span>
                          <span className="font-mono text-navy-900">{rec.accumulatedHours} / {rec.targetHours} Hrs ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="bg-[#002B49] h-full rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Testimonio de Meta Profesional */}
                    <p className="text-xs text-slate-600 italic bg-white p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed shadow-2xs">
                      "{rec.impactAchievementQuote}"
                    </p>

                  </div>

                  {/* Footer de Tarjeta */}
                  <div className="pt-3 border-t border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {language === 'en' ? 'Attendance and grades verified by American Dream English S.A.S.' : 'Auditoría de asistencia y notas certificada por American Dream English S.A.S.'}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
