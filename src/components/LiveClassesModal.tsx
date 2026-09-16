import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ClassSchedule {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  days: string;
  time: string;
  platform: 'Zoom' | 'Microsoft Teams' | 'Google Meet';
  availableSeats: number;
  totalSeats: number;
  instructor: string;
}

const SCHEDULES_DATA: ClassSchedule[] = [
  {
    id: 'sch-1',
    level: 'A1',
    days: 'Lunes y Miércoles',
    time: '7:00 PM - 8:30 PM',
    platform: 'Zoom',
    availableSeats: 3,
    totalSeats: 12,
    instructor: 'Teacher Chris (Nativo)'
  },
  {
    id: 'sch-2',
    level: 'A1',
    days: 'Sábados Intensivos',
    time: '8:00 AM - 12:00 PM',
    platform: 'Microsoft Teams',
    availableSeats: 5,
    totalSeats: 12,
    instructor: 'Profe. Alexander Palacios'
  },
  {
    id: 'sch-3',
    level: 'A2',
    days: 'Martes y Jueves',
    time: '6:00 PM - 7:30 PM',
    platform: 'Google Meet',
    availableSeats: 4,
    totalSeats: 12,
    instructor: 'Teacher Sarah Miller'
  },
  {
    id: 'sch-4',
    level: 'B1',
    days: 'Lunes y Miércoles',
    time: '8:30 PM - 10:00 PM',
    platform: 'Zoom',
    availableSeats: 2,
    totalSeats: 12,
    instructor: 'Teacher Chris (Nativo)'
  },
  {
    id: 'sch-5',
    level: 'B2',
    days: 'Sábados Intensivos',
    time: '2:00 PM - 6:00 PM',
    platform: 'Microsoft Teams',
    availableSeats: 6,
    totalSeats: 12,
    instructor: 'Dra. Elena Córdoba'
  },
  {
    id: 'sch-6',
    level: 'C1',
    days: 'Viernes Conversacional',
    time: '7:00 PM - 9:00 PM',
    platform: 'Zoom',
    availableSeats: 4,
    totalSeats: 12,
    instructor: 'Teacher Chris & Team'
  }
];

interface LiveClassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveClassesModal: React.FC<LiveClassesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('A1');
  const [reservedSchedule, setReservedSchedule] = useState<ClassSchedule | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSchedules = SCHEDULES_DATA.filter(s => s.level === selectedLevel);

  const handleReserveCupo = (schedule: ClassSchedule) => {
    setReservedSchedule(schedule);
    const message = encodeURIComponent(
      `Hola American Dream English, deseo reservar un cupo para el Nivel ${schedule.level} (${schedule.days} en horario ${schedule.time} vía ${schedule.platform}).`
    );
    window.open(`https://wa.me/573127459728?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Aulas Virtuales Sincrónicas en Vivo</h3>
              <p className="text-xs text-slate-300">Grupos reducidos con máximo 12 estudiantes por sala</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Level Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
            {(['A1', 'A2', 'B1', 'B2', 'C1'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Nivel {lvl}
              </button>
            ))}
          </div>

          {/* Schedules List */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              Horarios Disponibles para Nivel {selectedLevel}:
            </h4>

            {filteredSchedules.length === 0 ? (
              <div className="bg-slate-50 p-8 rounded-2xl text-center text-xs text-slate-500">
                No hay salas activas de momento para este nivel. Por favor escríbenos a WhatsApp para abrir un nuevo grupo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between hover:border-indigo-600 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                          Plataforma: {sch.platform}
                        </span>
                        <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {sch.availableSeats} de {sch.totalSeats} cupos disponibles
                        </span>
                      </div>

                      <h5 className="font-extrabold text-navy-900 text-base">{sch.days}</h5>
                      
                      <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Horario: <strong>{sch.time}</strong></span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>Docente: <strong>{sch.instructor}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReserveCupo(sch)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reservar Cupo por WhatsApp</span>
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
