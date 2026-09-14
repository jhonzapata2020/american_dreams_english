import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Phone, User, Target, Award } from 'lucide-react';
import { PLACEMENT_QUESTIONS } from '../data/mockData';
import { PlacementLead } from '../types';
import { saveStoredLead } from '../utils/storage';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhatsApp: (message?: string) => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  onOpenWhatsApp,
}) => {
  const [step, setStep] = useState<'info' | 'quiz' | 'result'>('info');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Superación Laboral y Puerto de Turbo');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [calculatedLevel, setCalculatedLevel] = useState<string>('A2');

  if (!isOpen) return null;

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setStep('quiz');
  };

  const handleSelectOption = (questionId: number, level: string) => {
    const newAnswers = { ...answers, [questionId]: level };
    setAnswers(newAnswers);

    if (currentQuestionIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate level majority
      const levels = Object.values(newAnswers);
      const b1Count = levels.filter(l => l === 'B1' || l === 'B2').length;
      const a2Count = levels.filter(l => l === 'A2').length;
      const levelResult = b1Count >= 2 ? 'B1 Intermedio' : a2Count >= 1 ? 'A2 Funcional' : 'A1 Inicial';
      setCalculatedLevel(levelResult);

      // Save lead locally
      const leadObj: PlacementLead = {
        id: 'lead-' + Date.now(),
        name,
        phone,
        whatsapp: phone,
        estimatedLevel: levelResult,
        goal,
        createdAt: new Date().toLocaleDateString('es-CO')
      };
      saveStoredLead(leadObj);
      setStep('result');
    }
  };

  const handleWhatsAppClaim = () => {
    const text = `¡Hola American Dreams Turbo! Realicé el Test de Nivelación en la web. Mi nombre es ${name}, mi nivel estimado fue ${calculatedLevel} y mi objetivo es ${goal}. Me gustaría recibir información de matricula.`;
    onOpenWhatsApp(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-navy-900 via-brand-indigo to-blue-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Test Diagnóstico Rápido</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Conoce tu Nivel de Inglés en 3 Minutos
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Diseñado para profesionales y estudiantes de Turbo y Urabá.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: LEAD CAPTURE */}
          {step === 'info' && (
            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tu Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Lucía Palacios"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Teléfono / WhatsApp de Contacto *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 310 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  ¿Cuál es tu principal objetivo en Turbo?
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  >
                    <option value="Superación Laboral y Puerto de Turbo">Trabajar en el Puerto / Comercio Regional</option>
                    <option value="Superar Pruebas Saber 11 / Saber Pro">Superar Pruebas Saber 11 / Saber Pro</option>
                    <option value="Perder el Miedo a Hablar Inglés">Hablar con fluidez y sin pena</option>
                    <option value="Estudios / Becas Internacionales">Becas y Cooperación Internacional</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Comenzar Preguntas Diagnósticas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tus datos están seguros. Respetamos tu privacidad.
              </p>
            </form>
          )}

          {/* STEP 2: DIAGNOSTIC QUESTIONS */}
          {step === 'quiz' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-semibold">
                <span>Pregunta {currentQuestionIndex + 1} de {PLACEMENT_QUESTIONS.length}</span>
                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-4">
                {PLACEMENT_QUESTIONS[currentQuestionIndex].question}
              </h4>

              <div className="space-y-3">
                {PLACEMENT_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(PLACEMENT_QUESTIONS[currentQuestionIndex].id, opt.level)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-sm font-medium text-slate-700 flex items-start space-x-3 group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="pt-0.5">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: RESULT & CALL TO ACTION */}
          {step === 'result' && (
            <div className="text-center py-2 space-y-4">
              <div className="inline-flex p-3 bg-emerald-100 text-emerald-700 rounded-full mb-1">
                <Award className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                ¡Diagnóstico Completado, {name}!
              </h4>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-xs uppercase tracking-wide font-bold text-slate-500 block">Nivel Estimado Sugerido</span>
                <span className="text-2xl font-black text-indigo-700 block my-1">{calculatedLevel}</span>
                <p className="text-xs text-slate-600">
                  Con nuestro método blended de clases presenciales en Turbo + laboratorio oral en celular, podrás alcanzar tu meta de <strong className="text-slate-800">{goal}</strong> en tiempo récord.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleWhatsAppClaim}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Reclamar Clase de Prueba & Info en WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-600 py-1"
                >
                  Cerrar e ir al sitio web
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
