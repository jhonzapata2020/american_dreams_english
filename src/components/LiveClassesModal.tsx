'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Video, 
  Clock, 
  Users, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { getWhatsAppUrl } from '../config/contact';

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
    time: '6:00 PM - 7:30 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 9,
    totalSeats: 30,
    instructor: 'Teacher Sarah Miller',
    instructorRole: 'Docente Certificada C1/C2'
  },
  {
    id: 'sch-4',
    level: 'B1',
    levelName: 'Intermedio / Umbral',
    days: 'Lunes y Miércoles',
    time: '8:30 PM - 10:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 7,
    totalSeats: 30,
    instructor: 'Teacher Chris',
    instructorRole: 'Profesor Nativo C2'
  },
  {
    id: 'sch-5',
    level: 'B2',
    levelName: 'Intermedio Alto / Profesional',
    days: 'Sábados Intensivos',
    time: '2:00 PM - 6:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 14,
    totalSeats: 30,
    instructor: 'Dra. Elena Córdoba',
    instructorRole: 'Lingüista Aplicada C2'
  },
  {
    id: 'sch-6',
    level: 'B2',
    levelName: 'Intermedio Alto / Profesional',
    days: 'Martes y Jueves',
    time: '7:30 PM - 9:00 PM (COL)',
    platform: 'Microsoft Teams',
    availableSeats: 11,
    totalSeats: 30,
    instructor: 'Teacher Anthony & Team',
    instructorRole: 'Director Académico ADE'
  }
];

const LEVEL_TABS = [
  { id: 'A1', label: 'Nivel A1', sub: 'Principiante' },
  { id: 'A2', label: 'Nivel A2', sub: 'Elemental' },
  { id: 'B1', label: 'Nivel B1', sub: 'Intermedio' },
  { id: 'B2', label: 'Nivel B2', sub: 'Avanzado' },
] as const;

interface LiveClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveClassesModal: React.FC<LiveClassesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const filteredSchedules = SCHEDULES_DATA.filter(s => s.level === selectedLevel);

  const handleReserveCupo = (schedule: ClassSchedule) => {
    const message = `¡Hola Profe Anthony y equipo ADE! 🚀 Deseo reservar mi cupo para el curso en vivo:\n\n*Nivel:* ${schedule.level} (${schedule.levelName})\n*Horario:* ${schedule.days} · ${schedule.time}\n*Docente:* ${schedule.instructor}\n*Plataforma:* ${schedule.platform}\n\nPor favor confirmar disponibilidad de cupo y enlace de acceso.`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
          
          {/* Backdrop con Desenfoque Cinematográfico */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#040814]/75 backdrop-blur-md"
          />

          {/* Dialog Flotante de Alta Gama (Estilo 21st.dev / Raycast / Linear) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.55)] border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] my-auto"
          >
            
            {/* ========================================================= */}
            {/* HEADER EJECUTIVO EN VIVO                                  */}
            {/* ========================================================= */}
            <div className="bg-gradient-to-r from-[#001f35] via-[#091e36] to-[#041220] text-white p-4 sm:p-5 flex items-start sm:items-center justify-between border-b border-white/10 relative overflow-hidden">
              {/* Halos de luz ambiental */}
              <div className="absolute top-0 right-1/4 w-72 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-48 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center space-x-3.5 relative z-10">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20 shrink-0">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Aulas Sincrónicas en Vivo
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      Microsoft Teams Enterprise
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    Clases en Vivo & Tutorías Interactivas
                  </h3>
                  <p className="text-xs text-slate-300 font-medium hidden sm:block">
                    Salas con aforo máximo de 30 estudiantes · Clases 100% grabadas en tu Campus
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="relative z-10 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ========================================================= */}
            {/* BODY DEL MODAL                                            */}
            {/* ========================================================= */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 bg-slate-50/50">
              
              {/* Selector de Nivel MCER con Cápsula Deslizante LayoutId */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                    Selecciona tu Nivel Formativo:
                  </span>
                  <span className="text-[11px] text-blue-700 font-bold hidden sm:inline">
                    Estándar Marco Común Europeo (CEFR)
                  </span>
                </div>

                <div className="relative bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-2xs overflow-x-auto no-scrollbar">
                  {LEVEL_TABS.map((tab) => {
                    const isActive = selectedLevel === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedLevel(tab.id as any)}
                        className={`relative z-10 flex-1 min-w-[90px] py-2 px-3 text-center rounded-xl transition-colors cursor-pointer select-none ${
                          isActive ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900 font-semibold'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeLiveLevelPill"
                            className="absolute inset-0 bg-[#002B49] rounded-xl shadow-md -z-10"
                            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                          />
                        )}
                        <span className="block text-xs font-bold leading-tight">{tab.label}</span>
                        <span className={`block text-[9px] font-medium leading-tight ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                          {tab.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lista de Horarios con Transición Fluida */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Salas Activas para {selectedLevel}:</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Horario Oficial Colombia (GMT-5)
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedLevel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredSchedules.length === 0 ? (
                      <div className="bg-white p-8 rounded-3xl border border-slate-200/90 text-center space-y-2 shadow-2xs">
                        <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                        <h5 className="font-extrabold text-slate-800 text-sm">Próxima apertura de grupo para {selectedLevel}</h5>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Estamos consolidando el próximo grupo para este nivel. Escríbenos a WhatsApp para apartar tu lugar con prioridad.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSchedules.map((sch) => {
                          const occupiedSeats = sch.totalSeats - sch.availableSeats;
                          const percentOccupied = Math.round((occupiedSeats / sch.totalSeats) * 100);

                          return (
                            <motion.div
                              key={sch.id}
                              whileHover={{ y: -4 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl transition-all shadow-sm"
                            >
                              <div className="space-y-2.5">
                                
                                {/* Fila Superior: Plataforma y Cupos Disponibles */}
                                <div className="flex items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-50/90 px-2.5 py-1 rounded-xl border border-blue-200/70">
                                    <Video className="w-3.5 h-3.5 text-blue-600" />
                                    <span>{sch.platform}</span>
                                  </span>

                                  {/* Badge de Cupos con Pulso */}
                                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span>{sch.availableSeats} cupos libres</span>
                                  </span>
                                </div>

                                {/* Titular de Días y Horarios */}
                                <div>
                                  <h5 className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-snug">
                                    {sch.days}
                                  </h5>
                                  <span className="text-[11px] font-bold text-blue-700 block">
                                    Nivel {sch.level} · {sch.levelName}
                                  </span>
                                </div>

                                {/* Detalles de Horario y Docente */}
                                <div className="space-y-1.5 pt-0.5 text-xs">
                                  <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span className="truncate">Horario: <strong className="text-slate-900">{sch.time}</strong></span>
                                  </div>

                                  <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                                    <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <div className="min-w-0 flex-1 truncate">
                                      <span className="text-slate-900 font-bold">{sch.instructor}</span>
                                      <span className="text-[11px] text-slate-500 block truncate">{sch.instructorRole}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Barra de Ocupación de Cupos */}
                                <div className="space-y-1 pt-0.5">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>Aforo: {occupiedSeats} / {sch.totalSeats} cupos</span>
                                    <span className="text-amber-700">{percentOccupied}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full transition-all duration-500"
                                      style={{ width: `${percentOccupied}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Badge de Grabación en Campus */}
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50/90 px-2.5 py-1.5 rounded-xl border border-emerald-200/80">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Clase grabada en tu Campus Virtual</span>
                                </div>
                              </div>

                              {/* Botón de Reserva con Shimmer (21st.dev style) */}
                              <div className="pt-1">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="button"
                                  onClick={() => handleReserveCupo(sch)}
                                  className="relative overflow-hidden w-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold py-3 px-4 rounded-xl sm:rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                  {/* Haz de luz líquido */}
                                  <motion.span
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none"
                                    animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                                    transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', repeatDelay: 1 }}
                                  />

                                  <MessageCircle className="w-4 h-4 relative z-10 shrink-0" />
                                  <span className="relative z-10">Reservar Cupo por WhatsApp</span>
                                  <ArrowRight className="w-3.5 h-3.5 relative z-10 stroke-[2.5] shrink-0" />
                                </motion.button>
                              </div>

                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nota de Garantía Académica */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Todos los cursos en vivo otorgan certificación bajo el Marco Común Europeo MCER.</span>
                </div>
                <span className="font-semibold text-slate-700 shrink-0">Resolución Oficial No. 2471</span>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
