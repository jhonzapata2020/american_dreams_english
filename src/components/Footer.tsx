'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Mail, 
  Heart, 
  Lock, 
  Phone, 
  ShieldCheck,
  ArrowUp,
  Sparkles,
  ExternalLink,
  Code2,
  Building2,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../config/contact';

interface FooterProps {
  onOpenDonation: () => void;
  onOpenLocation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonation, onOpenLocation }) => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const corplexWhatsAppUrl = getWhatsAppUrl(
    'Hola CORPLEX SOLUTIONS, vi la plataforma de American Dream English y me gustaría solicitar una asesoría para el desarrollo de software y plataforma para mi empresa / institución.'
  );

  return (
    <footer className="relative bg-[#030712] text-slate-300 pt-16 sm:pt-20 pb-12 font-sans text-xs overflow-hidden border-t border-slate-800/80">
      
      {/* MOTIONSITE.AI AMBIENT GLOW ORB (LUZ LÍQUIDA EN FONDO) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-b from-blue-600/15 via-red-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP LASER DIVIDER LINE */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 via-amber-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP INSTITUTIONAL & REPUTATIONAL BANNER (ARCHITECTURAL GLASS) */}
        <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl mb-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 group">
          {/* Shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest font-black text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Resolución Oficial 2471
                </span>
                <span className="text-[10px] text-slate-400">· Sede Turbo, Urabá</span>
              </div>
              <h4 className="font-black text-white text-base sm:text-lg tracking-tight">
                {t.footer.certified}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {t.footer.resolution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenDonation}
              className="flex-1 lg:flex-none bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-red-600/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>{t.nav.enroll}</span>
            </motion.button>
          </div>
        </div>

        {/* 4 COLUMNS FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-14">
          
          {/* Col 1: Institutional Legal Alliance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-2 rounded-xl text-slate-950 shadow-sm">
                <GraduationCap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  AMERICAN DREAM
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  English Institute · Sede Urabá
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-xs">
              <strong>American Dream English S.A.S.</strong><br />
              NIT 901.182.137-9 · Institución de Formación para el Trabajo y el Desarrollo Humano.
            </p>
            
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-slate-300">
              <p className="text-slate-400 leading-relaxed">
                Campus y sistema digital administrado en alianza tecnológica con <strong>CORPLEX SOLUTIONS S.A.S.</strong>
              </p>
            </div>
          </div>

          {/* Col 2: Business Units */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>{t.footer.businessUnitsTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><a href="#donaciones" className="hover:text-white transition-colors">{t.footer.businessUnit1}</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">{t.footer.businessUnit2}</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">{t.footer.businessUnit3}</a></li>
              <li>
                <button 
                  type="button" 
                  onClick={onOpenLocation} 
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.businessUnit4}
                </button>
              </li>
              <li><a href="/tienda" className="hover:text-amber-400 transition-colors">Tienda Digital de Infoproductos</a></li>
            </ul>
          </div>

          {/* Col 3: Physical Address & Contact */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{t.footer.locationTitle}</span>
            </h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <button 
                  type="button" 
                  onClick={onOpenLocation}
                  className="flex items-start gap-2.5 text-left hover:text-white transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span><strong>{t.footer.hqLabel}</strong> {t.footer.hqValue} <span className="text-amber-400 text-[10px] underline ml-1">({language === 'en' ? 'View Map' : 'Ver Mapa'})</span></span>
                </button>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+57 (604) 827-2471 / +57 312 745 9728</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>info@americandreamenglish.edu.co</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparency & Security */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{language === 'en' ? 'Transparency & Security' : 'Transparencia & Seguridad'}</span>
            </h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              {language === 'en' 
                ? 'All donations grant tax-deductible certificates under national and international legislation.'
                : 'Todas las donaciones emiten un Certificado Tributario deducible de impuestos bajo la legislación colombiana e internacional.'}
            </p>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-slate-300 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{language === 'en' ? '256-bit SSL Encryption • Data Privacy' : 'Encriptación 256-bit SSL • Pasarelas Wompi'}</span>
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* STRATEGIC ENTERPRISE BADGE: CORPLEX SOLUTIONS S.A.S. (CLIENT MAGNET) */}
        {/* ==================================================================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 group">
          {/* Shimmer laser beam across the card */}
          <motion.span
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full pointer-events-none"
            animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 2 }}
          />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-black tracking-wider text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  Arquitectura & Ingeniería de Software
                </span>
                <span className="text-[10px] text-slate-400">NIT 902.061.373-5</span>
              </div>
              <h5 className="font-extrabold text-white text-sm sm:text-base mt-1">
                Plataforma Diseñada y Desarrollada por CORPLEX SOLUTIONS S.A.S.
              </h5>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                Infraestructura EdTech de alta concurrencia, pagos Wompi, telemetría y campus virtual para instituciones y empresas.
              </p>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={corplexWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/30 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contratar Desarrollo / Consultoría</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>

        {/* BOTTOM COPYRIGHT & RETURN TO CROWN (TOP) */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <div className="flex flex-wrap gap-4 items-center">
            <a href="/campus/docente" className="hover:text-amber-400 font-bold text-slate-300 transition-colors flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Teacher Portal' : 'Portal Docente'}</span>
            </a>
            <a href="/admin/login" className="hover:text-amber-400 font-bold text-slate-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>{language === 'en' ? 'Admin Portal' : 'Acceso Administrativo'}</span>
            </a>
            <a href="/campus/login" className="hover:text-amber-400 text-slate-400 transition-colors">{t.nav.campusVirtual}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.habeasData}</a>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 American Dream English S.A.S. · {t.footer.rights}</span>

            {/* RETURN TO CROWN BUTTON */}
            <motion.button
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
              title="Volver arriba"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Subir</span>
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
};
