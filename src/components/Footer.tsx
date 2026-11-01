'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck,
  ArrowUp,
  ArrowRight,
  ExternalLink,
  Code2,
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
    <footer className="relative bg-[#030712] text-slate-300 pt-14 sm:pt-16 pb-12 font-sans text-xs overflow-hidden border-t border-slate-800/80">
      
      {/* AMBIENT GLOW ORB (LUZ LÍQUIDA EN FONDO) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-b from-blue-600/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP DIVIDER LINE */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 via-indigo-400/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* BANNER INSTITUCIONAL RESOLUCIÓN 2471 */}
        <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/10 p-5 sm:p-7 rounded-2xl sm:rounded-3xl mb-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5 group">
          {/* Shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 shrink-0">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
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

          {/* Botón Matricúlate Azul Corporativo */}
          <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenDonation}
              className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>{t.nav.enroll}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>

        {/* 4 COLUMNAS DE ENLACES E INFORMACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
          
          {/* Col 1: Información Legal de la Institución */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-2 rounded-xl text-slate-950 shadow-sm">
                <GraduationCap className="w-5 h-5 text-blue-600" />
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
            
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-300">
              <p className="text-slate-400 leading-relaxed">
                Campus y sistema digital administrado en alianza tecnológica con <strong>CORPLEX SOLUTIONS S.A.S.</strong>
              </p>
            </div>
          </div>

          {/* Col 2: Unidades de Negocio (Sin enlaces duplicados) */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{t.footer.businessUnitsTitle}</span>
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a
                  href="/becas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{t.footer.businessUnit1}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a href="/tienda" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>{t.footer.businessUnit2}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a href="/clases-en-vivo" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>{t.footer.businessUnit3}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              </li>
              <li>
                <a href="/sede-uraba" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>{t.footer.businessUnit4}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sede Presencial & Contacto */}
          <div>
            <h4 className="font-extrabold text-white text-sm mb-4 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{t.footer.locationTitle}</span>
            </h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a 
                  href="/sede-uraba" 
                  className="flex items-start gap-2.5 text-left hover:text-white transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>
                    <strong>{t.footer.hqLabel}</strong> {t.footer.hqValue} 
                    <span className="text-amber-400 text-[10px] underline ml-1">({language === 'en' ? 'View Map' : 'Ver Mapa'})</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+57 312 745 9728</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="break-all">info@americandreamenglish.edu.co</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparencia & Seguridad */}
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
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-300 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{language === 'en' ? '256-bit SSL Encryption • Data Privacy' : 'Encriptación 256-bit SSL • Pasarelas Wompi'}</span>
            </div>
          </div>

        </div>

        {/* BARRA ELEGANTE Y SUTIL: CRÉDITO TECNOLÓGICO CORPLEX SOLUTIONS */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 sm:p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <p className="text-[11px] leading-tight">
              Plataforma & Campus Virtual desarrollado por <strong className="text-white font-semibold">CORPLEX SOLUTIONS S.A.S.</strong>
              <span className="hidden md:inline text-slate-500 ml-1.5">· Infraestructura EdTech de alta concurrencia</span>
            </p>
          </div>

          <a
            href={corplexWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white border border-white/10 transition-colors text-[11px] font-medium shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consultoría EdTech</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

        {/* PIE DE PÁGINA: ACCESOS DIRECTOS & COPYRIGHT */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <div className="flex flex-wrap gap-4 items-center">
            <a href="/campus/docente" className="hover:text-amber-400 font-bold text-slate-300 transition-colors flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Teacher Portal' : 'Portal Docente'}</span>
            </a>
            <a href="/admin/login" className="hover:text-blue-400 font-bold text-slate-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'Admin Portal' : 'Acceso Administrativo'}</span>
            </a>
            <a href="/campus/login" className="hover:text-blue-400 text-slate-400 transition-colors">{t.nav.campusVirtual}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t.footer.habeasData}</a>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 American Dream English S.A.S. · {t.footer.rights}</span>

            {/* BOTÓN VOLVER ARRIBA */}
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
