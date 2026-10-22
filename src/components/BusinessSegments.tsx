'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  BookOpen, 
  Video, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { getBusinessSegments } from '../data/sprint1Data';
import { DigitalStoreModal } from './DigitalStoreModal';
import { LiveClassesModal } from './LiveClassesModal';
import { PresencialModal } from './PresencialModal';
import { Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BusinessSegmentsProps {
  currency?: Currency;
  onSelectAction?: (action: 'donate' | 'catalog' | 'live' | 'campus') => void;
  onPreselectTier2?: () => void;
  onOpenDigitalStore?: () => void;
  onOpenLiveClasses?: () => void;
  onOpenPresencial?: () => void;
}

interface SegmentCardProps {
  seg: any;
  onCardClick: (action: any) => void;
  getIcon: (iconName: string) => React.ReactNode;
  segmentPrefix: string;
}

const SegmentCard: React.FC<SegmentCardProps> = ({ seg, onCardClick, getIcon, segmentPrefix }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onMouseMove={handleMouseMove}
      className="relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300/80 transition-all flex flex-col justify-between group overflow-hidden cursor-default"
    >
      {/* Spotlight Radial Glow 21st.dev style */}
      <div
        className="absolute -inset-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl z-0"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(30, 64, 175, 0.07), transparent 75%)`
        }}
      />

      <div className="relative z-10">
        {/* Card Top Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.4 }}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs group-hover:scale-105 group-hover:bg-blue-50/50 transition-all"
            >
              {getIcon(seg.iconName)}
            </motion.div>
            <span className="text-xs font-black text-slate-400 font-mono">
              {segmentPrefix} {seg.number}
            </span>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100/80 text-navy-900 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200/60 transition-colors">
            {seg.badge}
          </span>
        </div>

        <h3 className="text-2xl font-black text-navy-900 mb-1 tracking-tight">
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
          {seg.features.map((feat: string, idx: number) => (
            <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Action Button con microinteracción física */}
      <div className="pt-4 border-t border-slate-100 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCardClick(seg.ctaAction)}
          className={`w-full font-bold py-3.5 px-5 rounded-xl transition-shadow flex items-center justify-center space-x-2 text-sm cursor-pointer shadow-sm ${
            seg.ctaAction === 'donate'
              ? 'bg-crimson-600 text-white hover:bg-crimson-700 shadow-crimson-600/20'
              : 'bg-[#002B49] text-white hover:bg-[#001f35]'
          }`}
        >
          <span>{seg.ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const BusinessSegments: React.FC<BusinessSegmentsProps> = ({
  currency = 'COP',
  onSelectAction,
  onPreselectTier2,
  onOpenDigitalStore,
  onOpenLiveClasses,
  onOpenPresencial,
}) => {
  const { language, t } = useLanguage();
  const segments = getBusinessSegments(language);
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
      if (onOpenDigitalStore) onOpenDigitalStore(); else setDigitalStoreOpen(true);
    } else if (action === 'live') {
      if (onOpenLiveClasses) onOpenLiveClasses(); else setLiveClassesOpen(true);
    } else if (action === 'campus') {
      if (onOpenPresencial) onOpenPresencial(); else setPresencialOpen(true);
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
            <motion.span 
              initial={{ opacity: 0, y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-navy-900 uppercase tracking-widest bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-2xs"
            >
              {t.segments.badge}
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              {t.segments.title}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              {t.segments.subtitle}
            </p>
          </div>

          {/* 4 SEGMENTS GRID CON SPOTLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {segments.map((seg) => (
              <SegmentCard
                key={seg.id}
                seg={seg}
                onCardClick={handleCardClick}
                getIcon={getIcon}
                segmentPrefix={t.segments.segmentPrefix}
              />
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
