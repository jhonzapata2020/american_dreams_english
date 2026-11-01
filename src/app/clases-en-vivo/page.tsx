'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Video, 
  Clock, 
  Users, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { getWhatsAppUrl } from '../../config/contact';

interface ClassSchedule {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  levelName: string;
  days: string;
  time: string;
  platform: 'Microsoft Teams' | 'Zoom' | 'Google Meet';
  availableSeats: number;
  totalSeats: number;
  instructor: string;
  instructorRole: string;
}

const SCHEDULES_DATA: ClassSchedule[] = [
  {
    id: 'sch-1',
    level: 'A1',
    levelName: 'Principiante / Acceso',
    days: 'Lunes y Miércoles',
    time: '7:00 PM - 8:30 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 8,
    totalSeats: 30,
    instructor: 'Teacher Chris',
    instructorRole: 'Profesor Nativo C2'
  },
  {
    id: 'sch-2',
    level: 'A1',
    levelName: 'Principiante / Acceso',
    days: 'Sábados Intensivos',
    time: '8:00 AM - 12:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 12,
    totalSeats: 30,
    instructor: 'Profe. Alexander Palacios',
    instructorRole: 'Especialista en Fonética'
  },
  {
    id: 'sch-3',
    level: 'A2',
    levelName: 'Elemental / Plataforma',
    days: 'Martes y Jueves',
    time: '6:30 PM - 8:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 5,
    totalSeats: 25,
    instructor: 'Teacher Anthony',
    instructorRole: 'Director Académico C1/C2'
  },
  {
    id: 'sch-4',
    level: 'B1',
    levelName: 'Intermedio / Fluidez',
    days: 'Lunes, Miércoles y Viernes',
    time: '8:00 PM - 9:30 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 4,
    totalSeats: 20,
    instructor: 'Teacher Chris & Anthony',
    instructorRole: 'Inmersión Conversacional'
  },
  {
    id: 'sch-5',
    level: 'B2',
    levelName: 'Avanzado / Profesional',
    days: 'Sábados Especiales',
    time: '2:00 PM - 6:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 7,
    totalSeats: 18,
    instructor: 'Staff Bilingüe ADE',
    instructorRole: 'Entrevistas y Negocios'
  }
];

export default function ClasesEnVivoPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  const filtered = selectedLevel === 'ALL'
    ? SCHEDULES_DATA
    : SCHEDULES_DATA.filter((s) => s.level === selectedLevel);

  const handleWhatsApp = (schedule: ClassSchedule) => {
    const msg = `¡Hola Profe Anthony! 🚀 Quiero apartar mi cupo para las Clases en Vivo en el nivel ${schedule.level} (${schedule.days} - ${schedule.time}). ¿Cómo puedo matricularme?`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/matricula"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all"
            >
              Matricularme
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>Aulas Interactivas en Vivo 24/7</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Clases en Vivo con <span className="text-blue-600">Docentes Bilingües C1/C2</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Práctica conversacional guiada en grupos reducidos con retroalimentación instantánea, grabaciones en la nube y clubs de conversación en vivo.
          </p>
        </div>
      </div>

      {/* Main Content: Features & Schedules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        
        {/* Value Proposition Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Grupos Reducidos</h4>
              <p className="text-xs text-slate-500 mt-0.5">Máximo 15-20 alumnos para garantizar participación activa.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Grabaciones 24/7</h4>
              <p className="text-xs text-slate-500 mt-0.5">Accede a las repeticiones en tu Campus Virtual en cualquier momento.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Simulaciones Reales</h4>
              <p className="text-xs text-slate-500 mt-0.5">Aeropuertos, entrevistas laborales y vida cotidiana en EE.UU.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Acreditación Oficial</h4>
              <p className="text-xs text-slate-500 mt-0.5">Certificación con aval legal Ministerio Res. SED 2471.</p>
            </div>
          </div>
        </div>

        {/* Schedule Filter Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Horarios y Grupos Disponibles</h2>
              <p className="text-xs text-slate-500 mt-0.5">Elige el nivel y horario que mejor se adapte a tu rutina diaria.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200/80 shadow-2xs self-start sm:self-auto overflow-x-auto">
              {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lvl === 'ALL' ? 'Todos los niveles' : `Nivel ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs border border-blue-200/60">
                      Nivel {item.level} · {item.levelName}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.availableSeats} cupos libres
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{item.days}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1">
                    <p className="text-xs font-bold text-slate-800">{item.instructor}</p>
                    <p className="text-[11px] text-slate-400">{item.instructorRole} • {item.platform}</p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWhatsApp(item)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Apartar Cupo</span>
                  </button>

                  <Link
                    href="/matricula"
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Inscribirme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
