import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Volume2, 
  Award, 
  Send, 
  Filter, 
  User, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Check, 
  Star,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Submission, TeacherFeedback } from '../types';

interface TeacherViewProps {
  submissions: Submission[];
  onUpdateFeedback: (submissionId: string, feedback: TeacherFeedback) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  submissions,
  onUpdateFeedback,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('pending');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    submissions.find(s => s.status === 'pending')?.id || submissions[0]?.id || null
  );

  // Form states for selected submission
  const [score, setScore] = useState<number>(4.5);
  const [pronunciationNotes, setPronunciationNotes] = useState<string>('');
  const [classroomNotes, setClassroomNotes] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Filtered list
  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'pending') return sub.status === 'pending';
    if (filter === 'reviewed') return sub.status === 'reviewed';
    return true;
  });

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  // Stats
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const reviewedCount = submissions.filter((s) => s.status === 'reviewed').length;

  const handleSelectSubmission = (sub: Submission) => {
    setSelectedSubmissionId(sub.id);
    setScore(sub.feedback?.score || 4.5);
    setPronunciationNotes(sub.feedback?.pronunciationNotes || '');
    setClassroomNotes(sub.feedback?.classroomNotes || '');
    setSuccessNotice(null);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionId) return;

    const feedbackObj: TeacherFeedback = {
      score,
      maxScore: 5.0,
      pronunciationNotes: pronunciationNotes || 'Buen esfuerzo oral. Practica la entonación final.',
      classroomNotes: classroomNotes || 'Reforzar fluidez en el ejercicio de inicio del sábado.',
      reviewedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      teacherName: 'Prof. Jhonathan Miller (Docente Turbo)'
    };

    onUpdateFeedback(selectedSubmissionId, feedbackObj);
    setSuccessNotice(`Retroalimentación enviada correctamente a ${selectedSubmission?.studentName}`);

    setTimeout(() => {
      setSuccessNotice(null);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* Teacher Top Header */}
      <div className="bg-gradient-to-r from-navy-900 via-brand-indigo to-blue-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Campus Virtual • Panel de Evaluación Docente</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Bandeja de Revisión Semanal
            </h1>
            <p className="text-xs text-blue-200 mt-1">
              Prof. Jhonathan Miller • Instituto American Dreams Turbo, Antioquia
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold text-white block">Evaluación de Fin de Semana</span>
              <span className="text-slate-400">Refuerzo Presencial</span>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Entregas</span>
            <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pendientes</span>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Revisadas</span>
            <div className="text-2xl font-black text-emerald-600">{reviewedCount}</div>
          </div>
        </div>

      </div>

      {/* SUCCESS TOAST */}
      {successNotice && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center space-x-3 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-200" />
          <span className="text-sm font-bold">{successNotice}</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SUBMISSION LIST WITH FILTERS (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filtrar Entregas
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilter('all')}
                className={`py-1.5 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todas ({totalCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`py-1.5 rounded-lg transition-all ${
                  filter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pendientes ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('reviewed')}
                className={`py-1.5 rounded-lg transition-all ${
                  filter === 'reviewed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Revisadas ({reviewedCount})
              </button>
            </div>
          </div>

          {/* Submissions Cards */}
          <div className="space-y-3">
            {filteredSubmissions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                No hay entregas en esta categoría.
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = sub.id === selectedSubmissionId;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{sub.studentName}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Nivel {sub.studentLevel} • {sub.submittedAt}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          sub.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status === 'reviewed' ? 'Revisado' : 'Pendiente'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> Audio: {sub.durationSeconds}s
                      </span>
                      {sub.status === 'reviewed' && sub.feedback && (
                        <span className="font-bold text-emerald-700">
                          Puntaje: {sub.feedback.score}/5.0
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: EVALUATION WORKSPACE FOR SELECTED SUBMISSION (7 cols) */}
        <div className="lg:col-span-7">
          {selectedSubmission ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
              
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedSubmission.studentAvatar}
                    alt={selectedSubmission.studentName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedSubmission.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Estudiante Presencial Turbo • Nivel {selectedSubmission.studentLevel}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedSubmission.status === 'reviewed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {selectedSubmission.status === 'reviewed' ? 'Revisado' : 'Pendiente por Evaluar'}
                </span>
              </div>

              {/* AUDIO PLAYER */}
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-4 h-4 text-emerald-400" /> Reproductor del Audio del Alumno
                  </span>
                  <span>Duración: {selectedSubmission.durationSeconds} seg</span>
                </div>

                <audio controls src={selectedSubmission.audioUrl} className="w-full h-10 rounded-lg" />
              </div>

              {/* FEEDBACK FORM */}
              <form onSubmit={handleSaveFeedback} className="space-y-4">
                
                {/* Score Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Calificación de Fluidez & Pronunciación (1.0 a 5.0)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={score}
                      onChange={(e) => setScore(parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <span className="bg-indigo-600 text-white font-extrabold text-base px-3 py-1 rounded-xl min-w-[55px] text-center shadow-md">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Pronunciation Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Observaciones Fonéticas & Pronunciación:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pronunciationNotes}
                    onChange={(e) => setPronunciationNotes(e.target.value)}
                    placeholder="Ej. Buena entonación general. Recomiendo suavizar la pronunciación de las consonantes al final de las palabras en..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Classroom Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Nota de Refuerzo para el Salón Presencial (Sábado):
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={classroomNotes}
                    onChange={(e) => setClassroomNotes(e.target.value)}
                    placeholder="Ej. Practicar en el calentamiento de clase el trabalenguas de vocales..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Guardar & Enviar Retroalimentación</span>
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Selecciona una entrega de la izquierda para evaluar.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
