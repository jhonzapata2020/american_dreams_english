import React, { useState } from 'react';
import { 
  ArrowRight, 
  Heart, 
  CheckCircle2, 
  Lock,
  Award,
  Sparkles,
  BookOpen,
  Send
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDonation: () => void;
  onExplorePrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDonation,
  onExplorePrograms,
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [program, setProgram] = useState('Clases en Vivo');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onExplorePrograms();
    }, 1500);
  };

  return (
    <section className="relative bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100 font-sans overflow-hidden">
      
      {/* Soft background ambient gradient */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: VALUE PROPOSITION & AUTHORITY (7 COLS) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Micro-badge Superior */}
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700">
              <span className="text-amber-600 font-extrabold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Res. Oficial 2471 Turbo
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-navy-900 font-semibold">Pisingo de Oro 🏆</span>
            </div>

            {/* Headline H1 */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Domina el inglés conversacional y <br className="hidden sm:inline" />
              <span className="text-navy-900">abre tus puertas al mundo.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Programas certificados desde nivel A1 hasta C1. Aprende con clases en vivo, interactúa con tutores expertos y apoya la inclusión bilingüe en Urabá.
            </p>

            {/* DUAL MAIN CTAS */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              
              <button
                onClick={onExplorePrograms}
                className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white font-bold px-7 py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-base group"
              >
                <span>Inscribirme a Clases</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenDonation}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-crimson-600 border border-slate-200 hover:border-crimson-200 font-bold px-6 py-4 rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2 text-base group"
              >
                <Heart className="w-5 h-5 fill-crimson-600/20 text-crimson-600 group-hover:scale-105 transition-transform" />
                <span>Patrocinar un Becario</span>
              </button>

            </div>

            {/* MINIMAL SINGLE-LINE TRUST METRICS */}
            <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="text-navy-900 font-extrabold text-sm">12+ Años</span>
                <span>de Experiencia</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-navy-900 font-extrabold text-sm">+2,500</span>
                <span>Alumnos Formados</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-emerald-700 font-extrabold text-sm">Certificación</span>
                <span>MCER A1-C1</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CLEAN & ELEGANT LEAD CAPTURE CARD (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6">
              
              <div>
                <span className="text-xs font-bold text-crimson-600 uppercase tracking-wider block mb-1">
                  Atención Personalizada
                </span>
                <h3 className="text-2xl font-black text-navy-900">
                  Solicita tu Asesoría Gratis
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Te orientamos sobre el examen de nivelación y las becas disponibles.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-navy-900 text-base">¡Solicitud Registrada!</h4>
                  <p className="text-xs text-slate-600">
                    Un asesor pedagógico te contactará por WhatsApp a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. María Fernanda Córdoba"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Número de WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Programa de Interés</label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    >
                      <option value="Clases en Vivo">Clases Virtuales en Vivo (Zoom/Teams)</option>
                      <option value="Sede Turbo">Clases Presenciales Sede Turbo</option>
                      <option value="Cursos Digitales">Cursos Digitales 4K</option>
                      <option value="Fondo Becas">Solicitar Beca / Subvención</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 group"
                  >
                    <span>Solicitar Asesoría</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Tus datos están 100% protegidos
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
