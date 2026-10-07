'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Mic, 
  HelpCircle,
  RotateCcw,
  Check
} from 'lucide-react'

export default function LessonDetailPage() {
  const params = useParams()
  const lessonId = params?.lessonId || 'lesson-14'

  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [completed, setCompleted] = useState(false)

  const lessonData = {
    title: 'Lesson 14: Talking About the Past',
    unit: 'Unit 3: Memories & Experiences',
    audioDuration: '2:45 min',
    speakingPhrase: '“Last weekend I visited Turbo and had an amazing seafood lunch by the beach.”',
    quizQuestion: 'Choose the correct form of the past verb: "Yesterday, she ______ (go) to the bilingual library."',
    quizOptions: [
      { id: 1, text: 'goes', isCorrect: false },
      { id: 2, text: 'went', isCorrect: true },
      { id: 3, text: 'gone', isCorrect: false },
      { id: 4, text: 'goed', isCorrect: false },
    ]
  }

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 md:pb-12 text-slate-900">
      
      {/* 1. TOP APP BAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link
            href="/dashboard/aula"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Volver al Aula</span>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-navy-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            {lessonData.unit}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-4">

        {/* Título de la Lección */}
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-crimson-600 uppercase tracking-wider">
            Lección Activa
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {lessonData.title}
          </h1>
        </div>

        {/* REPRODUCTOR DE AUDIO / LISTENING INTERACTIVO */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Laboratorio Fonético Nativo</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {lessonData.audioDuration}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-12 h-12 rounded-full bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white flex items-center justify-center shadow-md flex-shrink-0 transition-transform"
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>{isPlayingAudio ? 'Reproduciendo audio...' : 'Audio nativo listo'}</span>
                <span>0:45 / 2:45</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`bg-crimson-600 h-full rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'w-2/5 animate-pulse' : 'w-0'
                  }`} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRÁCTICA DE SPEAKING Y FONÉTICA */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-amber-600" />
            <span>Repite y Graba tu Pronunciación</span>
          </span>

          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-amber-950 text-xs sm:text-sm font-semibold leading-relaxed">
            {lessonData.speakingPhrase}
          </div>

          <button
            type="button"
            className="w-full min-h-[44px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Mic className="w-4 h-4 text-crimson-600" />
            <span>Pulsar para Grabar Audio (IA Jenny Simulator)</span>
          </button>
        </div>

        {/* QUIZ RÁPIDO DE EVALUACIÓN */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Desafío de Gramática</span>
            </span>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              +50 ADE Points
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
            {lessonData.quizQuestion}
          </p>

          <div className="space-y-2 pt-1">
            {lessonData.quizOptions.map((opt) => {
              const isSelected = selectedAnswer === opt.id
              let optStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'

              if (isSelected && !isAnswerChecked) {
                optStyle = 'bg-navy-900 text-white border-navy-900 font-black'
              } else if (isAnswerChecked) {
                if (opt.isCorrect) {
                  optStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black'
                } else if (isSelected && !opt.isCorrect) {
                  optStyle = 'bg-red-100 text-red-900 border-red-300 font-bold'
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    if (!isAnswerChecked) setSelectedAnswer(opt.id)
                  }}
                  className={`w-full min-h-[44px] p-3 rounded-xl border text-xs text-left flex items-center justify-between transition-all active:scale-[0.99] ${optStyle}`}
                >
                  <span>{opt.text}</span>
                  {isAnswerChecked && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {!isAnswerChecked ? (
            <button
              type="button"
              disabled={selectedAnswer === null}
              onClick={handleCheckAnswer}
              className="w-full min-h-[44px] bg-navy-900 hover:bg-navy-950 disabled:opacity-50 text-white text-xs font-black py-2.5 rounded-xl transition-all"
            >
              Comprobar Respuesta
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>¡Excelente respuesta! Has sumado +50 ADE Points.</span>
            </div>
          )}
        </div>

      </main>

      {/* BARRA INFERIOR DE FINALIZACIÓN Y RETORNO */}
      <footer className="fixed bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg md:relative md:bottom-0 md:mt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/dashboard/aula"
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Lección Anterior
          </Link>

          <Link
            href="/dashboard/aula"
            className="min-h-[48px] px-6 bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 uppercase tracking-wider transition-all"
          >
            <span>Completar y Continuar</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </footer>

    </div>
  )
}
