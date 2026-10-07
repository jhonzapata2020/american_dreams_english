import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Award,
  Headphones,
  UserCheck,
  Loader2,
  GraduationCap,
  ShoppingBag,
  Gift,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenDonation: () => void;
  onExplorePrograms: () => void;
  onOpenLocation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDonation,
  onExplorePrograms,
  onOpenLocation,
}) => {
  const { t } = useLanguage();
  const [audience, setAudience] = useState<'self' | 'child'>('self');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const audienceType = audience === 'self' ? 'para_mi' : 'para_mi_hijo';

      const { error } = await supabase.from('leads').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          audience: audienceType,
        },
      ]);

      if (error) {
        console.error('Error al registrar prospecto:', error);
        setErrorMessage('No se pudieron enviar tus datos. Por favor intenta de nuevo.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        onExplorePrograms();
      }, 1500);
    } catch (err) {
      console.error('Error inesperado al registrar prospecto:', err);
      setErrorMessage('Ocurrió un error inesperado. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const whatsappContextUrl = "https://wa.me/573207105618?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%20de%20ADE";

  return (
    <section className="bg-white pt-4 sm:pt-8 pb-8 lg:py-14 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================= */}
        {/* VISTA MÓVIL MOBILE-FIRST (Primer pliegue utilitario y rápido) */}
        {/* ========================================================= */}
        <div className="block lg:hidden space-y-6">
          
          {/* Encabezado directo y contundente */}
          <div className="text-center sm:text-left space-y-1.5 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
              AMERICAN DREAM ENGLISH
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-snug">
              Aprende inglés. Cambia tu futuro.
            </p>
          </div>

          {/* Botonera principal con jerarquía visual clara */}
          <div className="space-y-3">
            {/* Botón primario (ancho completo, altura mínima 48px) */}
            <a
              href="/matricula"
              className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.99] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 text-base uppercase tracking-wider transition-all"
            >
              <span>EMPEZAR AHORA</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </a>

            {/* Botón secundario outline */}
            <a
              href="/cursos"
              className="w-full min-h-[48px] border-2 border-slate-300 hover:border-slate-400 active:scale-[0.99] bg-white text-slate-800 font-extrabold py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 text-sm uppercase tracking-wider transition-all"
            >
              <span>VER CURSOS</span>
            </a>

            {/* Enlace rápido para alumnos */}
            <div className="text-center pt-1">
              <a
                href="/login"
                className="inline-flex items-center justify-center text-sm font-semibold text-slate-600 hover:text-navy-900 py-1 transition-colors group"
              >
                <span>¿Ya eres estudiante?</span>
                <span className="text-crimson-600 group-hover:text-crimson-700 font-bold ml-1.5 underline underline-offset-4">
                  Entrar al aula
                </span>
              </a>
            </div>
          </div>

          {/* Sección inmediata inferior de autoidentificación rápida (4 tarjetas verticales compactas tipo botón) */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Tarjeta 1: Aprender inglés */}
              <a
                href="/matricula"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-red-50/50 active:scale-[0.98] border border-slate-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    🎓
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-red-700 transition-colors">
                      Aprender inglés
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Programas para niños y adultos</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
              </a>

              {/* Tarjeta 2: Comprar recursos */}
              <a
                href="/tienda"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-amber-50/50 active:scale-[0.98] border border-slate-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    🛒
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                      Comprar recursos
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Libros, guías y material digital</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </a>

              {/* Tarjeta 3: Solicitar beca */}
              <a
                href="/becas"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50/50 active:scale-[0.98] border border-slate-200 rounded-2xl transition-all group text-left w-full cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    🎁
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                      Solicitar beca
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Fondo de becas e impacto social</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </a>

              {/* Tarjeta 4: Hablar con ADE */}
              <a
                href={whatsappContextUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50/60 active:scale-[0.98] border border-slate-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    💬
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      Hablar con ADE
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Asesoría directa por WhatsApp</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </a>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* VISTA ESCRITORIO (3 Columnas con formulario y foto) */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA 1: ELEMENTO HUMANO & AUTORIDAD (4 COLS - lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-start relative mt-0 pt-0">
          <div className="relative w-full max-w-sm">
            
            {/* Main Instructor Photo Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="/teacher-anthony.jpg"
                alt="Teacher Anthony - Director Académico"
                className="w-full h-[480px] sm:h-[540px] md:h-[570px] object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
              />

              {/* Gradient Overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Bottom Left */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-lg flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-900 text-amber-400 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                  <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-navy-900 text-xs">{t.hero.teacherName}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.hero.teacherRole}</p>
                </div>
              </div>
            </div>

            {/* Overlay Circular Secondary Badge Top Right */}
            <div className="absolute top-3 right-3 sm:-top-3 sm:-right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-2.5 py-1 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white flex items-center space-x-1.5 text-[11px] sm:text-xs font-black">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>{t.hero.oneOnOne}</span>
            </div>

          </div>
        </div>

        {/* COLUMNA 2: LA PROMESA CENTRAL (4 COLS - lg:col-span-4 flex flex-col justify-start) */}
        <div className="lg:col-span-4 flex flex-col justify-start text-left space-y-5 mt-0 pt-0">
          
          {/* Eyebrow tag */}
          <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3.5 py-1 rounded-full border border-red-200 w-fit">
            {t.hero.badge}
          </span>

          {/* H1 Headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {t.hero.title1} <span className="text-red-600">{t.hero.titleHighlight}</span> {t.hero.title2}
          </h1>

          {/* Direct Benefit Bullets */}
          <div className="space-y-3 pt-1 text-sm font-bold text-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>{t.hero.bullet1}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>{t.hero.bullet2}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>{t.hero.bullet3}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                ✓
              </span>
              <span>{t.hero.bullet4}</span>
            </div>
          </div>

          {/* Botones de acción rápida: Becas & Cómo Llegar */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-full border border-slate-200"
            >
              <span>{t.hero.scholarshipPrompt}</span>
              <span className="text-red-600 font-bold hover:underline">{t.hero.scholarshipLink}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenLocation) {
                  onOpenLocation();
                } else {
                  const el = document.getElementById('sede-presencial');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-blue-700 hover:text-blue-900 transition-all font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>📍 {t.nav.howToGetThere}</span>
            </button>
          </div>

        </div>

        {/* COLUMNA 3: FORMULARIO FLOTANTE DE CONVERSIÓN (4 COLS - lg:col-span-4) */}
        <div id="formulario-inscripcion" className="lg:col-span-4 scroll-mt-20 sm:scroll-mt-24 mt-0 pt-0">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-4">
            
            {/* Form Title */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {t.hero.formTitle} <span className="text-[#1E3A8A]">{t.hero.formOffer}</span>
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
                {t.hero.audienceSelf}
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
                {t.hero.audienceChild}
              </button>
            </div>

            {/* Form Content */}
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-navy-900 text-sm">{t.hero.successTitle}</h4>
                <p className="text-xs text-slate-600">{t.hero.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center animate-fadeIn">
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">{t.hero.firstName}</label>
                    <input
                      id="primer-campo-nombre"
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t.hero.firstName.replace('*', '').trim()}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">{t.hero.lastName}</label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t.hero.lastName.replace('*', '').trim()}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">{t.hero.email}</label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">{t.hero.phone}</label>
                  <input
                    type="tel"
                    required
                    disabled={isSubmitting}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
                  />
                </div>

                {/* Massive Official Crimson Red CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-75 text-white font-extrabold py-3.5 rounded-full shadow-lg w-full text-base tracking-wide transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t.hero.saving}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.hero.ctaButton}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center font-medium pt-1">
                  {t.hero.habeasData}
                </p>

                {/* Enlace sutil para becas / donaciones */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onOpenDonation}
                    className="text-[11px] text-slate-500 hover:text-orange-600 transition-colors font-medium inline-flex items-center justify-center space-x-1"
                  >
                    <span>{t.hero.scholarshipApply}</span>
                  </button>
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
