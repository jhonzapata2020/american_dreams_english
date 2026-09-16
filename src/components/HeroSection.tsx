import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Award,
  Headphones,
  UserCheck
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDonation: () => void;
  onExplorePrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDonation,
  onExplorePrograms,
}) => {
  const [audience, setAudience] = useState<'self' | 'child'>('self');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onExplorePrograms();
    }, 1500);
  };

  return (
    <section className="bg-white py-8 lg:py-12 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* COLUMNA 1: ELEMENTO HUMANO & AUTORIDAD (4 COLS - lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-sm">
            
            {/* Main Instructor Photo Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                alt="Teacher Anthony - Director Académico"
                className="w-full h-[360px] object-cover object-top"
              />

              {/* Gradient Overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Bottom Left */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-lg flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-900 text-xs">Teacher Anthony & Equipo</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Docentes Certificados C1/C2 MCER</p>
                </div>
              </div>
            </div>

            {/* Overlay Circular Secondary Badge Top Right */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-2xl shadow-xl border-2 border-white flex items-center space-x-2 text-xs font-black animate-pulse">
              <UserCheck className="w-4 h-4 text-white" />
              <span>Tutoría 1 a 1</span>
            </div>

          </div>
        </div>

        {/* COLUMNA 2: LA PROMESA CENTRAL (4 COLS - lg:col-span-4 flex flex-col justify-center) */}
        <div className="lg:col-span-4 flex flex-col justify-center text-left space-y-5">
          
          {/* Eyebrow tag */}
          <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3.5 py-1 rounded-full border border-orange-200 w-fit">
            Cumple tu meta y accede a mejores oportunidades
          </span>

          {/* H1 Headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Logra la <span className="text-orange-600">fluidez en inglés</span> con <span className="text-[#1E3A8A]">American Dream</span>
          </h1>

          {/* Direct Benefit Bullets */}
          <div className="space-y-3 pt-1 text-sm font-bold text-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>Clases en VIVO e Ilimitadas (Online & Presencial Urabá)</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>Docentes Bilingües Certificados C1/C2</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>Metodología Conversacional Práctica</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span className="text-orange-700">Fondo de Becas para Jóvenes de Urabá</span>
            </div>
          </div>

        </div>

        {/* COLUMNA 3: FORMULARIO FLOTANTE DE CONVERSIÓN (4 COLS - lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-4">
            
            {/* Form Title */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Aprende inglés con una <span className="text-[#1E3A8A]">Oferta Especial</span>
              </h3>
            </div>

            {/* Audience Switch Pills */}
            <div className="bg-slate-100 p-1 rounded-full flex items-center text-xs font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => setAudience('self')}
                className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                  audience === 'self'
                    ? 'bg-white text-navy-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Para mí
              </button>
              <button
                type="button"
                onClick={() => setAudience('child')}
                className={`flex-1 py-1.5 text-center rounded-full transition-all ${
                  audience === 'child'
                    ? 'bg-white text-navy-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Para mi hijo/a
              </button>
            </div>

            {/* Form Content */}
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-navy-900 text-sm">¡Inscripción Iniciada!</h4>
                <p className="text-xs text-slate-600">Un asesor pedagógico te contactará en breve por WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nombre"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Apellido *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Apellido"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Correo electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Massive Bright Orange CTA Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-3.5 rounded-full shadow-lg w-full text-base tracking-wide transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center space-x-2"
                >
                  <span>Comienza ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[10px] text-slate-400 text-center font-medium pt-1">
                  * Información protegida por Ley de Habeas Data
                </p>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
