'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Award,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  BookOpen,
  Users,
  Compass,
  FileCheck,
  Phone
} from 'lucide-react'
import { CONTACT_CONFIG, getWhatsAppUrl } from '../../../config/contact'

export default function AnthonyCortesPage() {
  const directWhatsAppUrl = getWhatsAppUrl(
    'Hola Teacher Anthony, te contacto desde tu semblanza institucional en la web de American Dream English.'
  )
  const directEmailUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(
    'Contacto Institucional - Despacho Rectoría Teacher Anthony'
  )}&body=${encodeURIComponent(
    'Estimado Teacher Anthony,\n\nMe pongo en contacto contigo a través de la web oficial de American Dream English para consultar sobre:'
  )}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Bar Institucional */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Despacho de Rectoría
            </span>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-slate-400">Nosotros</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Teacher Anthony Cortés</span>
        </nav>

        {/* HERO SECTION DE BIOGRAFÍA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* FOTOGRAFÍA DE CUERPO COMPLETO Y CREDENCIALES RÁPIDAS (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 group">
              {/* Luz ambiental */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Foto de cuerpo completo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                <img
                  src="/teacher-anthony.jpg"
                  alt="Teacher Anthony Cortés - Fundador y CEO de American Dream English"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Badge flotante inferior */}
                <div className="absolute bottom-4 inset-x-4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-amber-300 font-mono font-bold">
                        Director & Fundador
                      </p>
                      <h3 className="text-lg font-black tracking-tight">Anthony Cortés</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider text-white">
                      C1 / C2 MCER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges de autoridad rápida */}
            <div className="w-full max-w-[380px] mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Lic. Educación</div>
                  <div className="text-[10px] text-slate-500 font-medium">Lenguas Modernas</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Res. SED 2471</div>
                  <div className="text-[10px] text-slate-500 font-medium">Sec. de Educación</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">+10 Años</div>
                  <div className="text-[10px] text-slate-500 font-medium">Trayectoria Docente</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sede Urabá</div>
                  <div className="text-[10px] text-slate-500 font-medium">Km 3 Vía Turbo</div>
                </div>
              </div>
            </div>
          </div>

          {/* PERFIL EJECUTIVO & SEMBLANZA (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Perfil Ejecutivo Institucional</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Teacher Anthony Cortés
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                Fundador, CEO y Director Académico General de{' '}
                <strong className="text-slate-900">American Dream English</strong>. Pionero en la
                implementación de metodologías conversacionales aceleradas e inmersión lingüística en
                la subregión de Urabá y a nivel virtual global.
              </p>
            </div>

            {/* BOTONES DE CONTACTO DIRECTO */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp Directo</span>
              </a>

              <a
                href={directEmailUrl}
                className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-slate-300" />
                <span>Enviar Correo Oficial</span>
              </a>
            </div>

            {/* CIFRAS CLAVE DE IMPACTO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-slate-900">+1.200</div>
                <div className="text-xs text-slate-500 font-medium">Estudiantes Formados</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-red-600">C1 / C2</div>
                <div className="text-xs text-slate-500 font-medium">Acreditación MCER</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-blue-600">100%</div>
                <div className="text-xs text-slate-500 font-medium">Enfoque Práctico</div>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                <div className="text-2xl font-black text-emerald-600">Res. 2471</div>
                <div className="text-xs text-slate-500 font-medium">Aval SED Oficial</div>
              </div>
            </div>

            {/* SEMBLANZA DETALLADA */}
            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-red-600" />
                  <span>Misión y Visión Educativa</span>
                </h3>
                <p>
                  Con una sólida vocación pedagógica y más de una década de experiencia en el aula,{' '}
                  <strong>Anthony Cortés</strong> creó American Dream English con el objetivo de
                  transformar de raíz el modelo tradicional de enseñanza del inglés en Colombia. Su
                  visión erradica la memorización mecánica de reglas gramaticales y promueve la
                  inmersión conversacional activa desde la primera sesión.
                </p>
                <p>
                  Convencido de que el bilingüismo es la llave para la movilidad social, el empleo
                  remoto internacional y el acceso a becas universitarias en el exterior, lidera
                  directamente el diseño curricular y la capacitación continua del equipo docente de ADE.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Credenciales Académicas y Calificaciones</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>
                      <strong>Certificación de Dominio Superior C1/C2 (MCER):</strong> Competencia
                      lingüística nativa y técnica avalada bajo los estándares internacionales del
                      Marco Común Europeo de Referencia para las Lenguas.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>
                      <strong>Licenciatura en Educación y Formación en Lenguas Modernas:</strong> Base
                      metodológica integral orientada a la neurodidáctica y facilitación del aprendizaje
                      en niños, jóvenes y profesionales adultos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>
                      <strong>Reconocimiento Oficial de la Secretaría de Educación (Res. 2471):</strong>{' '}
                      Liderazgo directivo que garantiza la validez, transparencia y formalidad de los
                      programas académicos de ADE.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>
                      <strong>Impulsor del Fondo Social de Becas Urabá:</strong> Promotor incansable
                      de subvenciones y subsidios educativos para jóvenes de escasos recursos en la
                      región bananera y el litoral caribe antioqueño.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Metodología ADE: La Fórmula Conversacional</span>
                </h3>
                <p>
                  Bajo su dirección, la academia integró laboratorios de audio y experiencias de realidad
                  virtual (VR) donde los estudiantes simulan entrevistas laborales, viajes a aeropuertos
                  internacionales y negociaciones en inglés real. Su lema es claro:{' '}
                  <em>
                    «El inglés no se memoriza para un examen; se practica para cambiar de vida.»
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA DE CONTACTO INSTITUCIONAL INFERIOR */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider">
              Canal de Comunicación Directa
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              ¿Deseas conversar sobre una alianza educativa, una beca o tu formación en inglés?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              El Teacher Anthony y el equipo directivo de American Dream English están a tu
              disposición para atender propuestas corporativas, dudas sobre certificaciones o
              matrículas institucionales.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir al WhatsApp (+57 312 745 9728)</span>
              </a>

              <a
                href={directEmailUrl}
                className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-slate-200" />
                <span>contacto@americandreams.edu.co</span>
              </a>
            </div>

            <div className="pt-4 text-xs text-slate-400 font-medium">
              Sede Presencial: Vereda Casanova, Km 3 Vía Turbo - Apartadó, Urabá, Antioquia.
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimalista Institucional */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} American Dream English. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Inicio
            </Link>
            <Link href="/becas" className="hover:text-slate-900 transition-colors">
              Fondo de Becas
            </Link>
            <Link href="/tienda" className="hover:text-slate-900 transition-colors">
              Tienda Digital
            </Link>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-bold hover:underline"
            >
              Atención WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
