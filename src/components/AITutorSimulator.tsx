import React, { useState } from 'react';
import { Bot, Mic, Volume2, CheckCircle2, RefreshCw, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AITutorSimulator: React.FC = () => {
  const { language, t } = useLanguage();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSuccess, setRecordedSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scenarios = [
    {
      id: 1,
      topic: language === 'en' ? 'Maritime Logistics Job Interview in Turbo' : 'Entrevista de Trabajo Marítimo en Turbo',
      aiQuestion: 'Welcome! Could you please introduce yourself and tell me why you want to work at the Turbo International Port?',
      translation: language === 'en' 
        ? 'Welcome! Could you please introduce yourself and tell me why you want to work at the Turbo International Port?'
        : '¡Bienvenido! ¿Podrías presentarte y decirme por qué deseas trabajar en el Puerto Internacional de Turbo?',
      expectedPhrase: 'Hello, my name is Yurleidis and I want to contribute to commercial logistics.',
      difficulty: language === 'en' ? 'Level B1 (Intermediate)' : 'Nivel B1 (Intermedio)',
    },
    {
      id: 2,
      topic: language === 'en' ? 'International Customer Support' : 'Atención al Cliente Internacional',
      aiQuestion: 'Good morning! How may I assist you with your course registration today?',
      translation: language === 'en'
        ? 'Good morning! How may I assist you with your course registration today?'
        : '¡Buenos días! ¿Cómo puedo ayudarte con tu registro de curso el día de hoy?',
      expectedPhrase: 'Good morning! I would like to apply for the Urabá bilingüe scholarship.',
      difficulty: language === 'en' ? 'Level A2 (Elementary)' : 'Nivel A2 (Elemental)',
    }
  ];

  const current = scenarios[currentScenario];

  const handleSimulateSpeech = () => {
    setIsRecording(true);
    setRecordedSuccess(false);
    setTimeout(() => {
      setIsRecording(false);
      setRecordedSuccess(true);
    }, 2000);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(current.aiQuestion);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Bot className="w-4 h-4 text-emerald-600" /> {t.aiSimulator.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
            {t.aiSimulator.title}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t.aiSimulator.subtitle}
          </p>
        </div>

        {/* INTERACTIVE SIMULATOR CONTAINER */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* LEFT PANEL: AI CHAT AVATAR */}
          <div className="md:col-span-5 bg-navy-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-navy-950 flex items-center justify-center font-bold shadow-lg">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Jenny AI Tutor</h3>
                  <span className="text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                    {t.aiSimulator.onlineStatus}
                  </span>
                </div>
              </div>

              <div className="bg-navy-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-[11px] text-amber-400 font-bold block uppercase tracking-wider">
                  {t.aiSimulator.practiceScenario}
                </span>
                <p className="text-xs text-slate-200 font-semibold">{current.topic}</p>
                <span className="text-[10px] text-slate-400 font-mono bg-navy-950 px-2 py-0.5 rounded inline-block">
                  {current.difficulty}
                </span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => {
                  setCurrentScenario((prev) => (prev + 1) % scenarios.length);
                  setRecordedSuccess(false);
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.aiSimulator.changeScenario}</span>
              </button>
            </div>

          </div>

          {/* RIGHT PANEL: LIVE INTERACTION & VOICE SIMULATION */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* AI Speech Bubble */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> {t.aiSimulator.jennyQuestion}
                </span>
                <button
                  onClick={handlePlayAudio}
                  className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-red-600' : ''}`} />
                  <span>{t.aiSimulator.listenAudio}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-sm font-extrabold text-navy-900 leading-relaxed">
                  "{current.aiQuestion}"
                </p>
                <p className="text-xs text-slate-500 italic">
                  {t.aiSimulator.translationLabel} {current.translation}
                </p>
              </div>
            </div>

            {/* User Response Action */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                {t.aiSimulator.suggestedResponse}
              </label>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium italic">
                "{current.expectedPhrase}"
              </div>

              {/* Mic Simulation Button */}
              <button
                type="button"
                onClick={handleSimulateSpeech}
                disabled={isRecording}
                className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : recordedSuccess
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-navy-900 hover:bg-navy-800 text-white shadow-md'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>
                  {isRecording
                    ? t.aiSimulator.listening
                    : recordedSuccess
                    ? t.aiSimulator.approvedFeedback
                    : t.aiSimulator.pressToSpeak}
                </span>
              </button>

              {recordedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center space-x-3 animate-fadeIn text-xs text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">{t.aiSimulator.aiFeedbackTitle}</strong>
                    <span>{t.aiSimulator.aiFeedbackDesc}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="text-[11px] text-slate-400 text-center font-medium">
              {t.aiSimulator.bottomNote}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
