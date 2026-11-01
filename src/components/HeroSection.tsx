'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../lib/analytics';
import { getWhatsAppUrl } from '../config/contact';
import { notifyLeadCaptured } from '../lib/marketingTelemetry';
import CampusStoriesCarousel from './home/CampusStoriesCarousel';
import FloatingADECompanion from './home/FloatingADECompanion';

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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getLeadWhatsAppUrl = () => {
    const audienceText = audience === 'self' ? 'Para mí' : 'Para mi hijo/a';
    const waMsg = `¡Hola Profe Anthony! 🚀 Acabo de registrarme en American Dream English.\n\n*Nombre:* ${firstName.trim()} ${lastName.trim()}\n*Teléfono:* ${phone.trim()}\n*Correo:* ${email.trim()}\n*Modalidad:* ${audienceText}\n\nQuiero recibir la oferta especial y asegurar mi cupo de matrícula.`;
    return getWhatsAppUrl(waMsg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setErrorMessage('Debes aceptar la política de tratamiento de datos personales para continuar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const audienceType = audience === 'self' ? 'para_mi' : 'para_mi_hijo';
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      audience: audienceType,
    };

    try {
      // Envío centralizado exclusivamente a través del endpoint oficial /api/leads
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && (res.status === 200 || res.status === 201) && data?.success !== false) {
        setSubmitted(true);
        notifyLeadCaptured(payload);
        trackEvent('lead_capture', {
          audience: audienceType,
          source: 'hero_form',
        });
      } else {
        setErrorMessage('No se pudo registrar la solicitud. Por favor intenta de nuevo o escríbenos a WhatsApp.');
      }
    } catch (err) {
      console.error('Error al registrar prospecto:', err);
      setErrorMessage('No se pudo registrar la solicitud. Por favor intenta de nuevo o escríbenos a WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappContextUrl = getWhatsAppUrl("Hola, quiero información sobre los cursos de ADE");

  return (
    <section className="bg-white py-2 lg:py-4 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================= */}
        {/* VISTA MÓVIL MOBILE-FIRST (Primer pliegue utilitario y rápido) */}
        {/* ========================================================= */}
        <div className="block lg:hidden space-y-4">
          
          {/* 1° y 2°: Pantalla de TV interactiva ('CAMPUS LIVE • CANAL ADE') y Avatar 3D de ADE */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto pt-0 pb-1">
            <CampusStoriesCarousel showADE={!isDesktop} />
          </div>

          {/* FORMULARIO OFICIAL DE CAPTACIÓN DE LEADS EN MÓVIL (OPEN ENGLISH STYLE) */}
          <div id="formulario-leads-movil" className="bg-white rounded-2xl shadow-xl border-2 border-red-100 p-4 sm:p-5 space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-black uppercase tracking-wide">
                ⚡ Oferta Especial Disponible
              </div>
              <h3 className="text-lg min-[380px]:text-xl font-black text-slate-900">
                {t.hero.formTitle} <span className="text-red-600">{t.hero.formOffer}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Déjanos tus datos para recibir asesoría personalizada y congelar tu precio.
              </p>
            </div>

            {/* Switch de audiencia animado: Para mí / Para mi hijo */}
            <div className="space-y-2">
              <div className="relative bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAudience('self')}
                  className={`relative z-10 flex-1 py-2 text-center rounded-lg transition-colors font-bold ${
                    audience === 'self' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {audience === 'self' && (
                    <motion.div
                      layoutId="activeAudiencePillMobile"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {t.hero.audienceSelf}
                </button>
                <button
                  type="button"
                  onClick={() => setAudience('child')}
                  className={`relative z-10 flex-1 py-2 text-center rounded-lg transition-colors font-bold ${
                    audience === 'child' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {audience === 'child' && (
                    <motion.div
                      layoutId="activeAudiencePillMobile"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {t.hero.audienceChild}
                </button>
              </div>

              {/* Indicador de contexto pedagógico con micro-animación */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={audience}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="text-[11px] font-semibold text-center text-slate-600 bg-slate-50/80 py-1 px-2.5 rounded-lg border border-slate-200/60"
                >
                  {audience === 'self' 
                    ? '🎯 Modalidad para Adultos, Jóvenes y Profesionales' 
                    : '🧸 Modalidad para Niños y Teens con Pedagogía Lúdica'}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Contenido del formulario o estado exitoso con AnimatePresence */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-navy-900 text-base">¡Registro Completado con Éxito!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {firstName ? `¡Muchas gracias, ${firstName}! ` : '¡Muchas gracias! '}Tus datos quedaron guardados en nuestro sistema. El Profe Anthony ya tiene tu solicitud y se comunicará contigo vía WhatsApp para entregarte tu oferta especial.
                  </p>
                  <div className="pt-2 space-y-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      href={getLeadWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir chat de WhatsApp (Opcional)</span>
                    </motion.a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setAcceptTerms(false);
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPhone('');
                      }}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-colors"
                    >
                      Registrar a otra persona
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center animate-fadeIn">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">{t.hero.firstName}</label>
                      <input
                        type="text"
                        required
                        autoComplete="given-name"
                        disabled={isSubmitting}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Nombre"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">{t.hero.lastName}</label>
                      <input
                        type="text"
                        required
                        autoComplete="family-name"
                        disabled={isSubmitting}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Apellido"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">{t.hero.email}</label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">{t.hero.phone}</label>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      disabled={isSubmitting}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
                    />
                  </div>

                  {/* CHECKBOX OBLIGATORIO HABEAS DATA */}
                  <div className="flex items-start gap-2 pt-1 text-left">
                    <input
                      id="habeas-data-mobile"
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <label htmlFor="habeas-data-mobile" className="text-[11px] text-slate-600 leading-tight cursor-pointer select-none font-medium">
                      Acepto la política de tratamiento de datos personales (Habeas Data) y autorizo el contacto para fines informativos y de matrícula.
                    </label>
                  </div>

                  {/* BOTÓN AZUL CORPORATIVO INSTITUCIONAL (MATCHING ADE & NAVBAR) */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !acceptTerms}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span className="text-white">{t.hero.saving || 'Guardando...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white">{t.hero.ctaButton || 'Comienza ahora'}</span>
                        <ArrowRight className="w-5 h-5 text-white stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center font-medium pt-0.5">
                    {t.hero.habeasData}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* 4°: AL FINAL: TITULAR PRINCIPAL SECUNDARIO, BENEFICIOS Y AUTORIDAD */}
          <div className="space-y-4 pt-3">
            
            {/* Eyebrow de campaña / tráfico social */}
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>{t.hero.badge || 'Abre las puertas del mundo al dominar el inglés'}</span>
              </div>

              {/* Titular contundente de conversión */}
              <h2 className="text-xl min-[380px]:text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Logra la <span className="text-red-600">fluidez en inglés</span> con American Dream English
              </h2>
            </div>

            {/* Tarjeta de autoridad y credenciales: Teacher Anthony con enlace a biografía */}
            <Link
              href="/nosotros/anthony-cortes"
              className="group bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-2xs transition-all cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <img
                  src="/teacher-anthony-avatar.jpg"
                  alt="Teacher Anthony"
                  className="w-12 h-12 rounded-full object-cover object-top border-2 border-red-600 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-red-600 transition-colors">
                    Teacher Anthony (CEO)
                  </h4>
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                    Bilingüe C1/C2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Director Académico • Conoce su semblanza y credenciales →
                </p>
              </div>
            </Link>

            {/* Beneficios directos con checks verdes */}
            <div className="space-y-2 text-xs sm:text-sm font-bold text-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>{t.hero.bullet1}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>{t.hero.bullet2}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                <span>{t.hero.bullet3}</span>
              </div>
            </div>
          </div>

          {/* Opciones y canales secundarios */}
          <div className="space-y-2.5 pt-1">
            {/* Botón WhatsApp directo de apoyo con rebote spring */}
            <motion.a
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              href={whatsappContextUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('whatsapp_click', {
                  source: 'hero_mobile_banner',
                  action: 'hablar_con_profe_anthony'
                });
              }}
              className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>¿Prefieres chatear antes de registrarte? WhatsApp</span>
            </motion.a>

            {/* Accesos rápidos: Becas y Sede Presencial con física táctil */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onOpenDonation}
                className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
              >
                🎁 Fondo de Becas
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                href="/como-llegar"
                className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs flex items-center justify-center"
              >
                📍 Sede Presencial
              </motion.a>
            </div>

            {/* Enlace para alumnos existentes */}
            <div className="text-center pt-1 pb-1">
              <a
                href="/campus/login"
                className="inline-flex items-center justify-center text-xs font-semibold text-slate-500 hover:text-navy-900 py-1 transition-colors"
              >
                <span>¿Ya eres estudiante?</span>
                <span className="text-red-600 font-bold ml-1.5 underline underline-offset-4">
                  Entrar al aula
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* VISTA ESCRITORIO (3 Columnas con formulario y foto) */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 xl:gap-6 items-stretch">
        
        {/* COLUMNA 1: LA PROMESA CENTRAL (4 COLS - lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between h-full text-left">

          <div className="space-y-4">
            {/* Eyebrow tag */}
            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-3.5 py-1 rounded-full border border-red-200 w-fit">
              {t.hero.badge}
            </span>

            {/* H1 Headline */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {t.hero.title1} <span className="text-red-600">{t.hero.titleHighlight}</span> {t.hero.title2}
            </h1>

            {/* Direct Benefit Bullets */}
            <div className="space-y-3 pt-2 text-sm font-bold text-slate-800">
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
          </div>

          {/* Botones de acción rápida: Becas & Cómo Llegar */}
          <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-slate-100/90 mt-4">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium bg-slate-100/90 hover:bg-slate-200/90 px-3.5 py-1.5 rounded-full border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <span>{t.hero.scholarshipPrompt}</span>
              <span className="text-red-600 font-bold hover:underline">{t.hero.scholarshipLink}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                if (onOpenLocation) {
                  onOpenLocation();
                } else {
                  const el = document.getElementById('sede-presencial');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-blue-700 hover:text-blue-900 transition-all font-bold bg-blue-50/90 hover:bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs cursor-pointer"
            >
              <span>📍 {t.nav.howToGetThere}</span>
            </motion.button>

            <Link
              href="/nosotros/anthony-cortes"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-red-700 transition-all font-bold bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs cursor-pointer"
            >
              <span>🎓 Teacher Anthony (CEO)</span>
              <span className="text-red-600">→</span>
            </Link>
          </div>

        </div>

        {/* COLUMNA 2: CAMPUS LIVE & STORIES + FRANJA ULTRA-COMPACTA (4 COLS - lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center self-center my-auto w-full">
          <CampusStoriesCarousel />

          {/* FRANJA ULTRA-COMPACTA (UNA SOLA LÍNEA) */}
          <div className="mt-2 w-full max-w-[400px] sm:max-w-[430px] mx-auto bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg py-2 px-3 text-white flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <span className="bg-black/30 text-amber-200 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                40% OFF
              </span>
              <p className="text-xs font-bold text-white truncate">
                Matrícula Especial • Clases en Vivo 24/7 y Materiales
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>(
                  '#primer-campo-nombre, input[name="firstName"], input[name="name"], #lead-name'
                );
                input?.focus();
              }}
              className="shrink-0 px-2.5 py-1 rounded bg-white hover:bg-orange-50 active:scale-95 text-orange-700 font-extrabold text-[11px] shadow transition-all whitespace-nowrap cursor-pointer"
            >
              Aprovechar →
            </button>
          </div>
        </div>

        {/* COLUMNA 3: FORMULARIO FLOTANTE DE CONVERSIÓN (4 COLS - lg:col-span-4) */}
        <div id="formulario-inscripcion" className="lg:col-span-4 scroll-mt-20 sm:scroll-mt-24 h-full">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-4 h-full flex flex-col justify-between">
            
            {/* Form Title */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {t.hero.formTitle} <span className="text-[#1E3A8A]">{t.hero.formOffer}</span>
              </h3>
            </div>

            {/* Audience Switch Pills */}
            <div className="space-y-2">
              <div className="relative bg-slate-100 p-1 rounded-full flex items-center text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAudience('self')}
                  className={`relative z-10 flex-1 py-2 text-center rounded-full transition-colors font-bold ${
                    audience === 'self' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {audience === 'self' && (
                    <motion.div
                      layoutId="activeAudiencePillDesktop"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {t.hero.audienceSelf}
                </button>
                <button
                  type="button"
                  onClick={() => setAudience('child')}
                  className={`relative z-10 flex-1 py-2 text-center rounded-full transition-colors font-bold ${
                    audience === 'child' ? 'text-slate-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {audience === 'child' && (
                    <motion.div
                      layoutId="activeAudiencePillDesktop"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {t.hero.audienceChild}
                </button>
              </div>
            </div>

            {/* Form Fields & State */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      {t.hero.successTitle || '¡Registro Completado con Éxito!'}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-[280px] mx-auto">
                      {t.hero.successMsg || 'Tus datos quedaron guardados. Nos comunicaremos contigo para entregarte tu oferta especial.'}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <a
                      href={getLeadWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir chat de WhatsApp (Opcional)</span>
                    </a>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setAcceptTerms(false);
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPhone('');
                      }}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs transition-colors"
                    >
                      Registrar a otra persona
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
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
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
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
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60 transition-shadow focus:bg-white"
                    />
                  </div>

                  {/* CHECKBOX OBLIGATORIO HABEAS DATA */}
                  <div className="flex items-start gap-2 pt-1 text-left">
                    <input
                      id="habeas-data-desktop"
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isSubmitting}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    />
                    <label htmlFor="habeas-data-desktop" className="text-[11px] text-slate-600 leading-tight cursor-pointer select-none font-medium">
                      Acepto la política de tratamiento de datos personales (Habeas Data) y autorizo el contacto para fines informativos y de matrícula.
                    </label>
                  </div>

                  {/* BOTÓN AZUL CORPORATIVO INSTITUCIONAL (MATCHING ADE & NAVBAR) */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !acceptTerms}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span className="text-white">{t.hero.saving}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white">{t.hero.ctaButton}</span>
                        <ArrowRight className="w-5 h-5 text-white stroke-[2.5]" />
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

                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </div>

        </div>
      </div>
      {/* Floating ADE Companion dock */} 
      <FloatingADECompanion />
    </section>
  );
};
