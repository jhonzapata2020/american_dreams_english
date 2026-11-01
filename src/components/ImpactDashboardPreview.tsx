'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Heart, 
  Lock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { InformativeCardsGrid } from './InformativeCardsGrid';

interface ImpactDashboardPreviewProps {
  onOpenDonation: () => void;
}

export const ImpactDashboardPreview: React.FC<ImpactDashboardPreviewProps> = ({
  onOpenDonation,
}) => {
  const { language, t } = useLanguage();

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

        {/* CUADRÍCULA 3x3: 9 CARDS INFORMATIVAS MINIMALISTAS CON PESTAÑA CROMÁTICA SUPERIOR */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                {language === 'en' ? 'Pillars of Academic Quality & Regional Commitment:' : 'Pilares de Calidad Académica & Compromiso Regional:'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en' ? 'Standards, ethics, and methodology applied across our Urabá campus.' : 'Estándares, ética pedagógica y metodología aplicados en nuestro campus de Urabá.'}
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 shrink-0">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> {language === 'en' ? 'Verified Institutional Framework' : 'Marco Institucional Certificado SED 2471'}
            </span>
          </div>

          <InformativeCardsGrid />
        </div>

      </div>
    </section>
  );
};
