import React from 'react';
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Mail, 
  Heart, 
  Building2,
  Lock,
  Phone,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onOpenDonation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonation }) => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-900 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP INSTITUTIONAL BANNER */}
        <div className="bg-navy-900 border border-slate-800 p-6 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-crimson-600 text-white rounded-xl shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">
                Resolución Oficial 2471 del 28 de Octubre de 2022
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Secretaría de Educación y Cultura del Distrito de Turbo, Antioquia. Galardón "Pisingo de Oro" a la Labor Educativa.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDonation}
            className="bg-crimson-600 hover:bg-crimson-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs flex items-center space-x-2 flex-shrink-0"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span>Donar a Fondo de Becas</span>
          </button>
        </div>

        {/* 4 COLUMNS FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Institutional Legal Alliance */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-1.5 rounded-lg text-navy-950">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-black text-white text-base tracking-tight">
                AMERICAN DREAM ENGLISH
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed">
              <strong>American Dream English S.A.S.</strong> — NIT 901.182.137-9
            </p>
            
            <p className="text-slate-400 leading-relaxed pt-1">
              Plataforma desarrollada y operada en alianza tecnológica por <strong className="text-white">CORPLEX SOLUTIONS S.A.S.</strong> (NIT 902.061.373-5).
            </p>
          </div>

          {/* Col 2: Business Units */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Unidades de Negocio</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#donaciones" className="hover:text-white transition-colors">1. Subvenciones & Fondo de Becas</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">2. Tienda de Infoproductos 4K</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">3. Clases Virtuales en Vivo</a></li>
              <li><a href="#segmentos" className="hover:text-white transition-colors">4. Clases Presenciales Sede Turbo</a></li>
            </ul>
          </div>

          {/* Col 3: Physical Address & Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Sede Presencial & Registro</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-crimson-500 flex-shrink-0 mt-0.5" />
                <span><strong>Sede:</strong> Calle 103 # 13-36, B. Buenos Aires, Turbo, Antioquia.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+57 (604) 827-2471</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>donaciones@americandreamenglish.edu.co</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparency & Security */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Transparencia & Seguridad</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Todas las donaciones emiten un Certificado Tributario deducible de impuestos bajo la legislación colombiana e internacional.
            </p>
            <div className="p-3 bg-navy-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Encriptación 256-bit SSL • Habeas Data</span>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} American Dream English S.A.S. & Corplex Solutions S.A.S. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="/login" className="hover:text-amber-400 font-bold text-slate-300 transition-colors">Portales & Acceso RBAC</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Transparencia de Fondos</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
