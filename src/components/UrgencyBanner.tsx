import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Clock } from 'lucide-react';

interface UrgencyBannerProps {
  onOpenAction: () => void;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ onOpenAction }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-navy-900 to-red-600 text-white py-2.5 px-4 font-sans relative shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        <div className="flex items-center space-x-2.5 mx-auto lg:mx-0">
          <span className="bg-amber-400 text-navy-950 font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider animate-pulse flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-navy-950" /> Oferta Especial Urabá
          </span>
          <p className="font-extrabold text-white text-center sm:text-left">
            🚨 ¡Aprende inglés hoy! <span className="text-amber-300">2x1 en Matrícula + Beca Social Parcial</span> por tiempo limitado.
          </p>
        </div>

        <div className="flex items-center space-x-4 mx-auto lg:mx-0">
          
          {/* Countdown timer */}
          <div className="hidden sm:flex items-center space-x-1 font-mono text-xs bg-black/30 px-3 py-1 rounded-full border border-white/20">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-amber-300">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={onOpenAction}
            className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-black px-4 py-1.5 rounded-full shadow-md text-xs transition-all flex items-center space-x-1 group"
          >
            <span>Inscríbete Ya</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white p-1 focus:outline-none"
            title="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
