import React from 'react';
import { 
  Award, 
  Mic, 
  Users, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  Smartphone, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  Anchor, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Building2,
  HeartHandshake,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { PROGRAMS } from '../data/mockData';

interface LandingPageProps {
  onGoToCampus: () => void;
  onOpenWhatsApp: (msg?: string) => void;
  onOpenPlacementTest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToCampus,
  onOpenWhatsApp,
  onOpenPlacementTest,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-indigo-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Abstract background light circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-400/40 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-amber-300 mb-8 backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>12 Años de Trayectoria Formativa en Turbo, Antioquia</span>
            <span className="bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">Urabá</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Líderes Bilingües para el <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Desarrollo de Urabá</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                Unimos la solidez de nuestras clases presenciales con un laboratorio de audio digital mobile-first. Formamos a niños, jóvenes y profesionales para las oportunidades globales y el puerto de Turbo.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                <button
                  onClick={onGoToCampus}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-xl shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center space-x-3 text-base group"
                >
                  <Smartphone className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                  <span>Ingresar al Campus Virtual</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenPlacementTest}
                  className="bg-indigo-600/90 hover:bg-indigo-600 text-white border border-indigo-400/40 font-bold px-6 py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Test Nivelación (3 Min.)</span>
                </button>

                <button
                  onClick={() => onOpenWhatsApp()}
                  className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-5 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Consulta WhatsApp</span>
                </button>

              </div>

              {/* Quick Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">12+</div>
                  <div className="text-xs text-slate-400 font-medium">Años en Turbo</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">2,500+</div>
                  <div className="text-xs text-slate-400 font-medium">Egresados Bilingües</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Metodología Blended</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Laboratorio de Audio Semanal</h4>
                      <p className="text-xs text-emerald-400 font-medium">Estudiante: María Camila • A2 Turbo</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-emerald-500/30">
                    En Tiempo Real
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Reto Oral Activo:</span>
                    <span className="text-slate-300 font-mono">00:42 / 01:00</span>
                  </div>
                  
                  {/* Fake Audio Wave Animation */}
                  <div className="flex items-center justify-center space-x-1.5 h-12 bg-slate-900 rounded-lg px-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full h-4 animate-audio-bar-1" />
                    <div className="w-1.5 bg-emerald-400 rounded-full h-8 animate-audio-bar-2" />
                    <div className="w-1.5 bg-indigo-400 rounded-full h-10 animate-audio-bar-3" />
                    <div className="w-1.5 bg-emerald-500 rounded-full h-6 animate-audio-bar-4" />
                    <div className="w-1.5 bg-emerald-400 rounded-full h-9 animate-audio-bar-5" />
                    <div className="w-1.5 bg-indigo-500 rounded-full h-5 animate-audio-bar-2" />
                    <div className="w-1.5 bg-emerald-500 rounded-full h-7 animate-audio-bar-1" />
                  </div>

                  <p className="text-xs text-slate-300 italic">
                    "Hello teacher! I recommend visiting the port boardwalk in Turbo because..."
                  </p>
                </div>

                <div className="bg-indigo-950/60 border border-indigo-800/50 p-3.5 rounded-xl flex items-start space-x-3 text-xs text-indigo-200">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Feedback del Docente el Fin de Semana:</strong>
                    <span>Puntaje: 4.8/5.0 — "Excelente entonación en la bienvenida al cliente."</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. BLENDED LEARNING METHODOLOGY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Innovación Educativa en Urabá
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ¿Cómo funciona nuestra Metodología Híbrida?
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Combinamos lo mejor de dos mundos: la interacción social en nuestras aulas presenciales de Turbo con el entrenamiento oral individual desde el celular entre semana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all space-y-4 relative group">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Clase Presencial el Fin de Semana</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sesiones inmersivas los sábados o domingos en Turbo. Práctica situacional, roleplay en equipo y aclaración de conceptos en un entorno motivador.
              </p>
              <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <Users className="w-4 h-4" /> Grupos reducidos y dinámicos
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all space-y-4 relative group border-indigo-300 ring-2 ring-indigo-500/10">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Grabación Oral entre Semana (Celular)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                El estudiante recibe un reto semanal. Graba sus audios de voz directamente desde su smartphone sin importar la hora o el lugar.
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Mic className="w-4 h-4" /> Web Recorder fácil de usar
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all space-y-4 relative group">
              <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Retroalimentación & Refuerzo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Los profesores evalúan la pronunciación y envían correcciones personalizadas para ser trabajadas y pulidas en la siguiente clase presencial.
              </p>
              <div className="pt-2 text-xs font-semibold text-navy-900 flex items-center gap-1">
                <Award className="w-4 h-4" /> Corrección fonética directa
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onGoToCampus}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm"
            >
              <span>Ver Demostración del Campus de Voz</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. ACADEMIC PROGRAMS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Formación Integral
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Nuestros Programas Académicos en Turbo
            </h2>
            <p className="text-slate-600 text-base">
              Rutas de aprendizaje estructuradas desde la infancia hasta la preparación profesional para el comercio y el puerto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROGRAMS.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
                      {prog.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{prog.levelRange}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{prog.title}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">{prog.targetAudience}</p>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {prog.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 italic">{prog.schedule}</span>
                  <button
                    onClick={() => onOpenWhatsApp(`Hola! Deseo inscribirme o recibir asesoría para el programa: ${prog.title}`)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <span>Inscribirme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INSTITUTIONAL & INTERNATIONAL COOPERATION SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Alianzas Estratégicas & Impacto Social</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Impulsando la Competitividad Internacional de Urabá
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Durante 12 años, <strong>American Dreams English</strong> ha servido como motor de desarrollo socioeconómico en Turbo, preparando a la población local para los retos del comercio marítimo, el turismo ecológico y las oportunidades laborales de la región.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Cooperación Internacional y Subvenciones</h4>
                    <p className="text-xs text-slate-300">
                      Plataforma lista para proyectos de bilingüismo financiados por ONG, alcaldías y organismos de desarrollo regional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-600/30 text-emerald-400 rounded-lg">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Alineado al Desarrollo Portuario de Turbo</h4>
                    <p className="text-xs text-slate-300">
                      Capacitación técnica en inglés marítimo, logístico y comercial para personal operativo y administrativo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenWhatsApp('Hola! Represento a una entidad institucional / ONG / Empresa y quisiera agendar una reunión formal para alianzas en Urabá.')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Proponer Alianza Institucional</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700 p-8 rounded-2xl space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-700 pb-4">
                Carta de Presentación Formal
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Ubicación Estratégica:</strong> Turbo, Antioquia — Corazón del Golfo de Urabá.
                </p>
                <p>
                  <strong className="text-white">Capacidad Instalada:</strong> Aulas climatizadas, biblioteca de recursos en inglés, docentes altamente calificados y plataforma digital propia accesible desde cualquier celular.
                </p>
                <p>
                  <strong className="text-white">Metodología Comprobada:</strong> Enfoque Blended Learning con retroalimentación semanal individual auditada por métricas de pronunciación.
                </p>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Sede Principal</span>
                  <span className="text-sm font-bold text-white">Turbo, Antioquia • Calle Principal</span>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-navy-950 text-slate-400 pt-16 pb-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                <span className="font-extrabold text-white text-base">AMERICAN DREAMS</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Institución líder en la enseñanza del idioma inglés en Turbo, Antioquia. 12 años transformando vidas a través de la educación bilingüe de calidad.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Navegación</h4>
              <ul className="space-y-2">
                <li><button onClick={onGoToCampus} className="hover:text-white transition-colors">Campus Virtual</button></li>
                <li><button onClick={onOpenPlacementTest} className="hover:text-white transition-colors">Test de Nivelación</button></li>
                <li><a href="#programas" onClick={() => onOpenWhatsApp()} className="hover:text-white transition-colors">Programas Académicos</a></li>
                <li><a href="#contacto" onClick={() => onOpenWhatsApp()} className="hover:text-white transition-colors">Contacto Admisiones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Ubicación y Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Turbo, Antioquia - Región de Urabá</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>+57 310 123 4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>contacto@americandreamsturbo.edu.co</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Atención Directa</h4>
              <p className="mb-3 leading-relaxed">
                Escríbenos directamente a WhatsApp para resolver dudas de inscripciones o solicitar una clase de prueba gratuita.
              </p>
              <button
                onClick={() => onOpenWhatsApp()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Turbo</span>
              </button>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-6 text-center text-slate-500">
            <p>© {new Date().getFullYear()} American Dreams English - Turbo, Antioquia. Todos los derechos reservados.</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
