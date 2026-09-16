import React, { useState } from 'react';
import { 
  HeartHandshake, 
  BookOpen, 
  Video, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { BUSINESS_SEGMENTS } from '../data/sprint1Data';
import { DigitalStoreModal } from './DigitalStoreModal';
import { LiveClassesModal } from './LiveClassesModal';
import { PresencialModal } from './PresencialModal';
import { Currency } from '../types';

interface BusinessSegmentsProps {
  currency?: Currency;
  onSelectAction?: (action: 'donate' | 'catalog' | 'live' | 'campus') => void;
  onPreselectTier2?: () => void;
}

export const BusinessSegments: React.FC<BusinessSegmentsProps> = ({
  currency = 'COP',
  onSelectAction,
  onPreselectTier2,
}) => {
  const [digitalStoreOpen, setDigitalStoreOpen] = useState(false);
  const [liveClassesOpen, setLiveClassesOpen] = useState(false);
  const [presencialOpen, setPresencialOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-7 h-7 text-crimson-600" />;
      case 'BookOpen': return <BookOpen className="w-7 h-7 text-blue-600" />;
      case 'Video': return <Video className="w-7 h-7 text-indigo-600" />;
      case 'Building2': return <Building2 className="w-7 h-7 text-navy-900" />;
      default: return <Sparkles className="w-7 h-7 text-amber-500" />;
    }
  };

  const handleCardClick = (action: 'donate' | 'catalog' | 'live' | 'campus') => {
    if (action === 'donate') {
      if (onPreselectTier2) onPreselectTier2();
      const el = document.getElementById('donaciones');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'catalog') {
      setDigitalStoreOpen(true);
    } else if (action === 'live') {
      setLiveClassesOpen(true);
    } else if (action === 'campus') {
      setPresencialOpen(true);
    }

    if (onSelectAction) {
      onSelectAction(action);
    }
  };

  return (
    <>
      <section id="segmentos" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* SECTION TITLE */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-widest bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-2xs">
              Ecosistema Educativo Integral
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
              4 Unidades de Negocio para el Desarrollo Bilingüe
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Articulamos subvenciones de impacto social con productos digitales de vanguardia y formación presencial y sincrónica.
            </p>
          </div>

          {/* 4 SEGMENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUSINESS_SEGMENTS.map((seg) => (
              <div
                key={seg.id}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform">
                        {getIcon(seg.iconName)}
                      </div>
                      <span className="text-xs font-black text-slate-400 font-mono">
                        Segmento {seg.number}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-navy-900 border border-slate-200">
                      {seg.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-navy-900 mb-1">
                    {seg.title}
                  </h3>
                  <p className="text-xs font-extrabold text-crimson-600 uppercase tracking-wider mb-4">
                    {seg.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {seg.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-8">
                    {seg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleCardClick(seg.ctaAction)}
                    className={`w-full font-bold py-3.5 px-5 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm ${
                      seg.ctaAction === 'donate'
                        ? 'bg-crimson-600 text-white hover:bg-crimson-700 shadow-sm'
                        : 'bg-navy-900 text-white hover:bg-navy-800 shadow-sm'
                    }`}
                  >
                    <span>{seg.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MODALES INTERACTIVOS */}
      <DigitalStoreModal
        isOpen={digitalStoreOpen}
        onClose={() => setDigitalStoreOpen(false)}
        currency={currency}
      />

      <LiveClassesModal
        isOpen={liveClassesOpen}
        onClose={() => setLiveClassesOpen(false)}
      />

      <PresencialModal
        isOpen={presencialOpen}
        onClose={() => setPresencialOpen(false)}
      />
    </>
  );
};
