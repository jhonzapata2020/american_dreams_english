import React from 'react';
import { X, MessageCircle, Send, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  defaultMessage,
}) => {
  if (!isOpen) return null;

  const phone = '573101234567'; // Numero oficial ficticio para demostracion
  const initialMsg = defaultMessage || '¡Hola American Dreams Turbo! Quisiera más información sobre los programas de inglés conversacional y el campus virtual.';

  const handleSend = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 relative">
        
        {/* Top Header WhatsApp styling */}
        <div className="bg-emerald-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-600 rounded-full text-white shadow-inner">
              <MessageCircle className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Atención Inmediata WhatsApp</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sede Turbo: Respuesta en minutos
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed">
            <div className="font-bold text-slate-900 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Sede Presencial & Admisiones Turbo
            </div>
            <span>
              Atención directa para matrículas, alianzas de cooperación internacional en Urabá y soporte técnico del Campus Virtual.
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Selecciona tu consulta rápida:
            </span>

            <button
              onClick={() => handleSend(initialMsg)}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs font-medium text-slate-800 flex items-center justify-between group"
            >
              <span>"Quiero información sobre horarios y matrículas en Turbo"</span>
              <Send className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleSend('¡Hola! Represento a una institución/empresa en Urabá y me interesa una alianza de formación bilingüe o propuesta de cooperación.')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs font-medium text-slate-800 flex items-center justify-between group"
            >
              <span>"Alianzas institucionales o Convenios de empresa"</span>
              <Send className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleSend('¡Hola! Soy estudiante presencial y necesito ayuda con el Campus Virtual para subir mi reto de voz semanal.')}
              className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs font-medium text-slate-800 flex items-center justify-between group"
            >
              <span>"Soporte del Campus Virtual para estudiantes"</span>
              <Send className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => handleSend(initialMsg)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp Web / App</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
