import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Award, 
  Clock, 
  Users, 
  Building2, 
  ShieldCheck,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

interface PresencialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresencialModal: React.FC<PresencialModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      'Hola American Dream English, me interesa agendar una visita a la Sede Presencial en Turbo para conocer los programas y matricularme.'
    );
    window.open(`https://wa.me/573127459728?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-crimson-600 rounded-xl text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Ficha Técnica • Sede Presencial Turbo</h3>
              <p className="text-xs text-slate-300">12 años de trayectoria forming líderes bilingües en Urabá</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-700">
          
          {/* Key Accreditation Badges Banner */}
          <div className="bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-amber-900">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Resolución 2471 de 2022 (Sec. Educación Turbo)</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Galardón "Pisingo de Oro" a la Labor Educativa</span>
            </div>
          </div>

          {/* Location & Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Physical Location Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-navy-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-crimson-600" /> Ubicación & Contacto
              </h4>

              <div className="space-y-2 text-xs">
                <p>
                  <strong>Acceso Regional Urabá:</strong><br />
                  Sede física en Calle 103 # 13-36, B. Buenos Aires. De fácil llegada en transporte público directo desde <strong>Apartadó, Currulao, Necoclí, Carepa y Chigorodó</strong>.
                </p>
                <p>
                  <strong>Teléfono / WhatsApp Admisiones:</strong><br />
                  <span className="text-navy-900 font-bold">+57 312 745 9728</span>
                </p>
                <p>
                  <strong>Instalaciones:</strong><br />
                  Aulas climatizadas, laboratorio de audio y campus virtual global.
                </p>
              </div>
            </div>

            {/* Program Levels & Hours */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-extrabold text-navy-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" /> Programas & Horarios
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <strong>Programas Disponibles:</strong>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    <li>Niños (3 - 12 años)</li>
                    <li>Adolescentes (13 - 17 años)</li>
                    <li>Adultos (18+ años)</li>
                  </ul>
                </div>

                <p className="pt-1">
                  <strong>Jornadas Presenciales:</strong><br />
                  Tarde: 2:30 PM - 4:00 PM / 4:00 PM - 6:00 PM<br />
                  Sábados Semi-personalizados: 8:00 AM - 12:00 PM
                </p>
              </div>
            </div>

          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Agendar Visita a la Sede o Matricularme por WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
