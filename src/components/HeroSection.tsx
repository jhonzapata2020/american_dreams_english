import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  GraduationCap,
  Bot,
  Mic,
  Headphones,
  Lock,
  MessageSquare
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDonation: () => void;
  onExplorePrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDonation,
  onExplorePrograms,
}) => {
  const [targetAudience, setTargetAudience] = useState<'self' | 'child' | 'donor'>('self');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onOpenDonation();
    }, 1500);
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100/70 pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 font-sans">
      
      <div className="max-w-7xl mx-auto">
        
        {/* TOP INSTITUTIONAL ACCREDITATION ROW */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-navy-900 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Res. Oficial 2471/2022 (Sec. Educación de Turbo)</span>
          </div>

          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-800 shadow-2xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Galardón "Pisingo de Oro" por Labor Educativa</span>
          </div>

          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-900 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Niveles A1 a C1 Certificados (MCER)</span>
          </div>

        </div>

        {/* 3-COLUMN HERO GRID (OPEN ENGLISH STRUCTURE + AMERICAN DREAM POWER) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 1. LEFT VISUAL: TEACHER & AI TUTOR SHOWCASE (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center relative order-2 lg:order-1">
            <div className="relative w-full max-w-xs space-y-4">
              
              {/* AI Tutor Card Showcase */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-3 transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold p-0.5 shadow-sm">
                    <Bot className="w-8 h-8" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                    Jenny, Tutora IA 24/7
                  </span>
                  <h4 className="font-extrabold text-navy-900 text-xs mt-1">Inteligencia Artificial</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Práctica por WhatsApp & Web</p>
                </div>
              </div>

              {/* Main Instructor Image Frame */}
              <div className="relative bg-gradient-to-b from-blue-600 to-navy-900 rounded-3xl p-4 text-white text-center shadow-xl overflow-hidden group">
                
                <div className="absolute top-2 right-2 bg-amber-400 text-navy-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Nativo MCER
                </div>

                <div className="my-2 relative flex justify-center">
                  <div className="w-28 h-28 rounded-full bg-white/10 p-1 border-2 border-amber-300 shadow-inner flex items-center justify-center">
                    <Headphones className="w-16 h-16 text-amber-300" />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                    Teacher Chris & Equipo
                  </span>
                  <h5 className="font-extrabold text-sm text-white">Profesores Bilingües</h5>
                  <p className="text-[11px] text-slate-200 font-medium">Clases ilimitadas en vivo</p>
                </div>
              </div>

              {/* Pronunciation Lab Badge */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md flex items-center space-x-3 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 flex-shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-navy-900 text-xs">Laboratorio de Voz 4K</h5>
                  <p className="text-[10px] text-slate-500 font-medium">Feedback fonético en vivo</p>
                </div>
              </div>

            </div>
          </div>

          {/* 2. CENTER COLUMN: HIGH-IMPACT HEADLINE & BULLET POINTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6 text-left order-1 lg:order-2">
            
            {/* Tagline Box */}
            <div className="inline-block border-2 border-amber-500/80 bg-amber-50 px-3.5 py-1 rounded-xl shadow-2xs">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                Cumple tu meta y accede a mejores oportunidades
              </span>
            </div>

            {/* Giant Punchy Title (Open English Style) */}
            <h1 className="text-4xl sm:text-5xl font-black text-navy-900 leading-tight tracking-tight">
              Logra la fluidez en inglés con <br />
              <span className="text-blue-700">American Dream English</span>
            </h1>

            {/* Feature Bullets (Checkmarks) */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-start space-x-3 text-slate-800 font-bold text-sm sm:text-base">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>Clases en <strong>VIVO TODOS los días</strong> con docentes nativos</span>
              </div>

              <div className="flex items-start space-x-3 text-slate-800 font-bold text-sm sm:text-base">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>Tutora con <strong>Inteligencia Artificial 24/7</strong> (Jenny IA)</span>
              </div>

              <div className="flex items-start space-x-3 text-slate-800 font-bold text-sm sm:text-base">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span>Certificación oficial <strong>MCER (A1 a C1)</strong> con la Sec. de Educación</span>
              </div>

              <div className="flex items-start space-x-3 text-slate-800 font-bold text-sm sm:text-base">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="text-red-700">Fondo de Becas Auditado: Tu matrícula subsidia a 1 joven de Urabá</span>
              </div>

            </div>

            {/* Quick Action Link */}
            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={onExplorePrograms}
                className="text-navy-900 hover:text-blue-700 font-extrabold text-sm underline flex items-center gap-1 group"
              >
                <span>Conocer todos los planes y horarios</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* 3. RIGHT COLUMN: EMBEDDED HIGH-CONVERTING LEAD & DONATION CARD (4 COLS) */}
          <div className="lg:col-span-4 order-3">
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl relative">
              
              {/* Promo Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-[11px] font-black px-4 py-0.5 rounded-full uppercase tracking-wider shadow">
                Oferta Limitada 2026
              </div>

              <div className="text-center mt-2 mb-4">
                <h3 className="text-xl font-black text-navy-900">
                  Aprende Inglés con una <span className="text-blue-700">Oferta Especial</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Inscripción inmediata o solicitud de Beca Social
                </p>
              </div>

              {/* Segment Toggle Tabs (Para mí / Para mi hijo / Quiero Becar) */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold mb-4 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTargetAudience('self')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    targetAudience === 'self'
                      ? 'bg-white text-navy-900 shadow-sm border border-slate-200 font-extrabold'
                      : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  Para mí
                </button>
                <button
                  type="button"
                  onClick={() => setTargetAudience('child')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    targetAudience === 'child'
                      ? 'bg-white text-navy-900 shadow-sm border border-slate-200 font-extrabold'
                      : 'text-slate-500 hover:text-navy-900'
                  }`}
                >
                  Para mi hijo/a
                </button>
                <button
                  type="button"
                  onClick={() => setTargetAudience('donor')}
                  className={`flex-1 py-2 text-center rounded-lg transition-all ${
                    targetAudience === 'donor'
                      ? 'bg-red-600 text-white shadow-sm font-extrabold'
                      : 'text-red-700 hover:text-red-900'
                  }`}
                >
                  Donar Beca
                </button>
              </div>

              {/* Lead Form */}
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-navy-900 text-base">¡Solicitud Recibida!</h4>
                  <p className="text-xs text-slate-600">
                    Un asesor pedagógico de la sede Turbo se comunicará contigo vía WhatsApp en menos de 15 minutos.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-3">
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ej. Juan"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Apellido *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej. Pérez"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Correo electrónico *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@correo.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 123 4567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* HIGH-CONVERTING ORANGE/CRIMSON GRADIENT CTA BUTTON (OPEN ENGLISH STYLE) */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-700 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wide flex items-center justify-center space-x-2 group mt-2"
                  >
                    <span>{targetAudience === 'donor' ? 'Comenzar Donación de Beca' : 'Comienza Ahora'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-[10px] text-slate-400 text-center space-y-1 pt-1">
                    <p>* Requerido para otorgar la oferta especial de matrícula.</p>
                    <p className="flex items-center justify-center gap-1 font-semibold text-slate-500">
                      <Lock className="w-3 h-3 text-slate-400" /> Información protegida por Ley Habeas Data
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
