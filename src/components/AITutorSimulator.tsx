'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, Volume2, CheckCircle2, RefreshCw, MessageSquare, Sparkles } from 'lucide-react';
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
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    const audio = new Audio('/audio/ade/en-practice.mp3');
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play().catch(() => setIsPlayingAudio(false));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <motion.span 
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs"
          >
            <Bot className="w-4 h-4 text-emerald-600" /> {t.aiSimulator.badge}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.aiSimulator.title}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            {t.aiSimulator.subtitle}
          </p>
        </div>

        {/* INTERACTIVE SIMULATOR CONTAINER */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all">
          
          {/* LEFT PANEL: AI CHAT AVATAR */}
          <div className="md:col-span-5 bg-[#001f35] text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-5 relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <motion.div 
                    animate={isPlayingAudio ? { scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-navy-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20"
                  >
                    <Bot className="w-7 h-7 text-slate-950" />
                  </motion.div>
                  {isPlayingAudio && (
                    <motion.span
                      className="absolute -inset-1 rounded-2xl border-2 border-emerald-400 pointer-events-none"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#001f35] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">Jenny AI Tutor</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {t.aiSimulator.onlineStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Escenario */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentScenario}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2.5 shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      {t.aiSimulator.practiceScenario}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {current.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 font-semibold leading-snug">{current.topic}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Botón Cambiar Escenario */}
            <div className="pt-6 relative z-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentScenario((prev) => (prev + 1) % scenarios.length);
                  setRecordedSuccess(false);
                }}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-slate-100 font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm active:bg-white/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.aiSimulator.changeScenario}</span>
              </motion.button>
            </div>

          </div>

          {/* RIGHT PANEL: LIVE INTERACTION & VOICE SIMULATION */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            
            {/* AI Speech Bubble */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <MessageSquare className="w-4 h-4 text-blue-600" /> {t.aiSimulator.jennyQuestion}
                </span>

                {/* Botón Escuchar Audio con animación interactiva */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio}
                  className={`font-bold flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'text-blue-700 hover:text-blue-900 bg-blue-50/90 hover:bg-blue-100/90 border-blue-200'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      {/* ONDAS DE SONIDO ANIMADAS */}
                      <div className="flex items-center gap-0.5 h-3.5">
                        {[0.5, 1, 0.6, 0.9, 0.4].map((ratio, i) => (
                          <motion.span
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: ['3px', `${Math.round(ratio * 14)}px`, '3px'] }}
                            transition={{ repeat: Infinity, duration: 0.45 + i * 0.08, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px]">Reproduciendo...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{t.aiSimulator.listenAudio}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Tarjeta de la Pregunta de la IA con Transición Fluida */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentScenario}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.22 }}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2 shadow-2xs"
                >
                  <p className="text-sm font-extrabold text-slate-900 leading-relaxed">
                    "{current.aiQuestion}"
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    {t.aiSimulator.translationLabel} {current.translation}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* User Response Action */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                {t.aiSimulator.suggestedResponse}
              </label>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentScenario}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-amber-950 font-medium italic"
                >
                  "{current.expectedPhrase}"
                </motion.div>
              </AnimatePresence>

              {/* Mic Simulation Button con Microinteracción Spring y Ondas de Pulso */}
              <div className="relative">
                {isRecording && (
                  <motion.div
                    className="absolute -inset-1 rounded-2xl border-2 border-red-500 pointer-events-none"
                    animate={{ scale: [1, 1.04, 1], opacity: [0.9, 0.2, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  />
                )}
                
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={handleSimulateSpeech}
                  disabled={isRecording}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 cursor-pointer relative z-10 ${
                    isRecording
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                      : recordedSuccess
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-[#002B49] hover:bg-[#001f35] text-white shadow-md'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <div className="flex items-center gap-1 h-4">
                        {[0.4, 0.9, 0.5, 1, 0.6].map((ratio, i) => (
                          <motion.span
                            key={i}
                            className="w-1 bg-white rounded-full"
                            animate={{ height: ['4px', `${Math.round(ratio * 16)}px`, '4px'] }}
                            transition={{ repeat: Infinity, duration: 0.4 + i * 0.08, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                      <span>{t.aiSimulator.listening}</span>
                    </>
                  ) : (
                    <>
                      <Mic className={`w-4 h-4 ${recordedSuccess ? 'text-emerald-200' : ''}`} />
                      <span>
                        {recordedSuccess
                          ? t.aiSimulator.approvedFeedback
                          : t.aiSimulator.pressToSpeak}
                      </span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Feedback animado al completar la pronunciación */}
              <AnimatePresence>
                {recordedSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.92, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-emerald-50 border border-emerald-200/90 p-4 rounded-2xl flex items-center space-x-3.5 shadow-sm text-xs text-emerald-900"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <strong className="block font-black text-emerald-950 text-xs">
                        {t.aiSimulator.aiFeedbackTitle}
                      </strong>
                      <span className="text-[11px] text-emerald-800 leading-snug">
                        {t.aiSimulator.aiFeedbackDesc}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
