'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Tv,
  Sparkles,
  MessageCircle,
  Radio,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


interface CampusSlide {
  id: string | number;
  src: string;
  type?: 'image' | 'video';
  category: string;
  title: string;
  description: string;
  tag: string;
}

function getEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url;

  // YouTube watch?v= or youtu.be
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

const SLIDES_BY_LANG: Record<'es' | 'en', CampusSlide[]> = {
  es: [
    {
      id: 1,
      src: '/images/campus/ade-banner-oficial.png',
      category: 'Sede Oficial',
      tag: 'COMUNIDAD ADE',
      title: 'American Dream English',
      description: 'Metodología conversacional acelerada para soñadores bilingües.'
    },
    {
      id: 2,
      src: '/images/campus/ade-estudiantes-salon-1.jpg',
      category: 'Aulas Dinámicas',
      tag: 'PRÁCTICA ACTIVA',
      title: 'Clases Prácticas y Participativas',
      description: 'Práctica guiada en grupos reducidos con retroalimentación en vivo.'
    },
    {
      id: 3,
      src: '/images/campus/ade-estudiantes-grupo-amigas.jpg',
      category: 'Comunidad Bilingüe',
      tag: 'EXPERIENCIA REAL',
      title: 'Un Ambiente que Inspira Confianza',
      description: 'Estudiantes reales superando el miedo a hablar y ganando fluidez natural.'
    },
    {
      id: 4,
      src: '/images/campus/ade-estudiantes-vr-inmersion.jpg',
      category: 'Innovación VR',
      tag: 'INMERSIÓN VR',
      title: 'Laboratorio de Realidad Virtual',
      description: 'Simulaciones inmersivas de aeropuertos, viajes y entrevistas en EE.UU.'
    },
    {
      id: 5,
      src: '/images/campus/ade-estudiantes-salon-2.png',
      category: 'Instalaciones',
      tag: 'INFRAESTRUCTURA',
      title: 'Espacios de Alto Rendimiento',
      description: 'Ambientes diseñados para aprender con total enfoque y comodidad.'
    },
    {
      id: 6,
      src: '/images/campus/ade-estudiantes-american-dream.png',
      category: 'Orgullo ADE',
      tag: 'NUEVA GENERACIÓN',
      title: 'Soñadoras Bilingües',
      description: 'Jóvenes construyendo su futuro bilingüe con confianza.'
    }
  ],
  en: [
    {
      id: 1,
      src: '/images/campus/ade-banner-oficial.png',
      category: 'Official Campus',
      tag: 'ADE COMMUNITY',
      title: 'American Dream English',
      description: 'Accelerated conversational methodology for bilingual dreamers.'
    },
    {
      id: 2,
      src: '/images/campus/ade-estudiantes-salon-1.jpg',
      category: 'Interactive Rooms',
      tag: 'ACTIVE PRACTICE',
      title: 'Dynamic Participatory Classes',
      description: 'Guided practice in small groups with real-time feedback.'
    },
    {
      id: 3,
      src: '/images/campus/ade-estudiantes-grupo-amigas.jpg',
      category: 'Bilingual Community',
      tag: 'REAL EXPERIENCE',
      title: 'An Inspiring Safe Environment',
      description: 'Real students overcoming speaking fear and gaining natural fluency.'
    },
    {
      id: 4,
      src: '/images/campus/ade-estudiantes-vr-inmersion.jpg',
      category: 'VR Innovation',
      tag: 'VR IMMERSION',
      title: 'Virtual Reality Laboratory',
      description: 'Simulating US travel, airport navigation, and job interviews in VR.'
    },
    {
      id: 5,
      src: '/images/campus/ade-estudiantes-salon-2.png',
      category: 'Facilities',
      tag: 'CAMPUS SPACES',
      title: 'High-Performance Facilities',
      description: 'Designed for deep focus, comfort, and interactive engagement.'
    },
    {
      id: 6,
      src: '/images/campus/ade-estudiantes-american-dream.png',
      category: 'ADE Pride',
      tag: 'NEW GENERATION',
      title: 'Bilingual Dreamers',
      description: 'Young talents building an international future with real spoken English.'
    }
  ]
};

export default function CampusStoriesCarousel({ showADE = true }: { showADE?: boolean } = {}) {
  const { language } = useLanguage();
  const currentLang = language === 'en' ? 'en' : 'es';
  const defaultSlides = SLIDES_BY_LANG[currentLang];

  const [slides, setSlides] = useState<CampusSlide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch dynamic items from carousel_items API
  useEffect(() => {
    let isCancelled = false;

    async function loadCarouselItems() {
      try {
        const res = await fetch('/api/carousel', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: CampusSlide[] = data.items.map((it: any) => ({
            id: it.id,
            src: it.media_url,
            type: it.type === 'video' ? 'video' : 'image',
            category: it.type === 'video'
              ? (currentLang === 'en' ? 'Featured Video' : 'Video Destacado')
              : (currentLang === 'en' ? 'Campus ADE' : 'Campus Oficial'),
            tag: it.type === 'video' ? 'MULTIMEDIA' : 'CAMPUS LIVE',
            title: it.title,
            description: it.type === 'video'
              ? (currentLang === 'en' ? 'Interactive video immersion & speaking training' : 'Inmersión lingüística y fluidez conversacional en video')
              : (currentLang === 'en' ? 'Accelerated conversational methodology for bilingual dreamers.' : 'Metodología conversacional acelerada para soñadores bilingües.')
          }));
          setSlides(mapped);
          setCurrentIndex(0);
        }
      } catch (err) {
        // Keep fallback on error
      }
    }

    loadCarouselItems();

    return () => {
      isCancelled = true;
    };
  }, [currentLang]);

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsManuallyPaused(true);
    } else {
      setIsPlaying(true);
      setIsManuallyPaused(false);
    }
  };

  useEffect(() => {
    const syncFullscreenState = () => {
      if (document.fullscreenElement === carouselRef.current) {
        setIsExpanded(true);
      } else if (!document.fullscreenElement) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded && !document.fullscreenElement) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  // Auto-advance slides every 5.5s
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleExpanded = async () => {
    if (isExpanded) {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen().catch(() => setIsExpanded(false));
      } else {
        setIsExpanded(false);
      }
      return;
    }

    const carousel = carouselRef.current;
    if (carousel?.requestFullscreen) {
      try {
        await carousel.requestFullscreen();
        return;
      } catch {
        // Use the fixed-position fallback if browser fullscreen is unavailable.
      }
    }

    setIsExpanded(true);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      ref={carouselRef}
      className={isExpanded
        ? 'fixed inset-0 z-[100] flex h-dvh w-screen flex-col gap-3 overflow-y-auto bg-slate-950 p-3 sm:p-5'
        : 'w-full max-w-[400px] sm:max-w-[430px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 bg-slate-950 flex flex-col mx-auto'}
    >
      {/* ========================================================= */}
      {/* 1. MONITOR DE ESTUDIO / TELEVISOR 16:10 CON BORDES 90°    */}
      {/* ========================================================= */}
      <div className={`w-full overflow-hidden bg-slate-950 select-none ${isExpanded ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
        
        {/* Header del televisor */}
        <div className="relative z-20 shrink-0 px-3 pt-2 pb-1.5 bg-gradient-to-b from-black/40 via-black/10 to-transparent">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 bg-red-600"></span>
              </span>
              <span className="text-[9.5px] font-mono font-bold tracking-wider text-white uppercase drop-shadow-sm">
                CAMPUS LIVE • CANAL ADE
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-[9.5px] font-mono text-white/90 drop-shadow-sm">
              <span className="text-white font-bold">{currentIndex + 1}</span>
              <span className="text-white/50">/</span>
              <span>{slides.length}</span>
              <button
                type="button"
                onClick={togglePlayPause}
                className="p-0.5 hover:text-white transition-colors text-white/80 cursor-pointer"
                title={isPlaying ? (currentLang === 'en' ? 'Pause' : 'Pausar') : (currentLang === 'en' ? 'Play' : 'Reproducir')}
                aria-label={isPlaying ? (currentLang === 'en' ? 'Pause' : 'Pausar') : (currentLang === 'en' ? 'Play' : 'Reproducir')}
              >
                {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              </button>
              <button
                type="button"
                onClick={toggleExpanded}
                className="p-1 hover:text-white transition-colors text-white/80"
                title={isExpanded
                  ? (currentLang === 'en' ? 'Restore normal size' : 'Volver a tamaño normal')
                  : (currentLang === 'en' ? 'Expand to full screen' : 'Expandir a pantalla completa')}
                aria-label={isExpanded
                  ? (currentLang === 'en' ? 'Restore normal size' : 'Volver a tamaño normal')
                  : (currentLang === 'en' ? 'Expand to full screen' : 'Expandir a pantalla completa')}
                aria-pressed={isExpanded}
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Segmented Story Bars (Esquinas 90°) */}
          <div className="flex space-x-1">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className="h-[2px] flex-1 bg-white/25 overflow-hidden cursor-pointer relative rounded-none hover:bg-white/45 transition-colors"
                title={`Ver: ${slide.title}`}
                aria-label={`Ver diapositiva ${idx + 1}`}
              >
                {idx === currentIndex && (
                  <motion.div
                    className="h-full bg-white rounded-none shadow-xs"
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : '100%' }}
                    transition={{
                      duration: isPlaying ? 5.5 : 0,
                      ease: 'linear'
                    }}
                    key={`${currentIndex}-${isPlaying}`}
                  />
                )}
                {idx < currentIndex && (
                  <div className="h-full w-full bg-white/80 rounded-none" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pantalla compacta horizontal max-h-[280px] sm:max-h-[300px] */}
        <div 
          className={`relative w-full overflow-hidden bg-slate-900 flex items-center justify-center group ${isExpanded ? 'min-h-0 flex-1' : 'aspect-[16/10] max-h-[280px] sm:max-h-[300px]'}`}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => {
            if (!isManuallyPaused) {
              setIsPlaying(true);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {currentSlide.type === 'video' ? (
                <div className="relative z-10 w-full h-full flex items-center justify-center bg-black">
                  <iframe
                    src={getEmbedUrl(currentSlide.src)}
                    title={currentSlide.title}
                    className="w-full h-full aspect-video border-0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  {/* Fondo ambiental desenfocado que rellena la pantalla armónicamente */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-35 transition-all duration-500 pointer-events-none"
                    style={{ backgroundImage: `url(${currentSlide.src})` }}
                  />

                  {/* Imagen completa sin recortes (cabezas, rostros y composición 100% visibles) */}
                  <img
                    src={currentSlide.src}
                    alt={currentSlide.title}
                    className="relative z-10 w-full h-full object-contain p-0.5"
                    loading="lazy"
                  />
                </>
              )}

              {/* Viñeta inferior suave */}
              <div className="absolute bottom-0 inset-x-0 h-16 z-10 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Flechas de navegación */}
          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: 'rgba(0,0,0,0.85)' }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-none bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-xs cursor-pointer"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: 'rgba(0,0,0,0.85)' }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-none bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-xs cursor-pointer"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Títulos y tags */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-2.5 pt-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-left">
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-none bg-black/40 backdrop-blur-md border border-white/20 text-white text-[8.5px] font-mono uppercase tracking-wider">
                <span className="w-1 h-1 bg-red-500 rounded-none"></span>
                {currentSlide.tag}
              </span>
              <span className="text-[9.5px] text-white/80 font-medium drop-shadow-sm">
                • {currentSlide.category}
              </span>
            </div>

            <h4 className="text-white font-bold text-xs sm:text-[13px] leading-snug drop-shadow-md line-clamp-1">
              {currentSlide.title}
            </h4>

            <p className="text-white/85 text-[10px] leading-tight line-clamp-1 mt-0.5 font-normal drop-shadow-sm">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Marco inferior estilizado (Chin) */}
        <div className="relative z-20 bg-slate-900 border-t border-slate-800 py-1 px-3 flex items-center justify-between text-[8.5px] font-mono text-slate-400 select-none">
          <div className="flex items-center space-x-1 text-slate-300 font-medium tracking-wider">
            <Tv className="w-2.5 h-2.5 text-red-500" />
            <span>AMERICAN DREAM ENGLISH</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-emerald-400 rounded-none shadow-[0_0_4px_#34d399]"></span>
            <span className="text-[8px] uppercase tracking-wider text-slate-400">CANAL TURBO</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CINTILLO INFORMATIVO DE SEDE Y METODOLOGÍA (ELEGANTE)  */}
      {/* ========================================================= */}
      <div className="w-full bg-slate-900 border-t border-slate-800/80 py-1.5 px-3 flex items-center justify-between text-left select-none">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
              {currentLang === 'en' ? 'Live Interactive Campus' : 'Sede Oficial Turbo • Urabá'}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              {currentLang === 'en' ? 'Bilingual Tutoring with ADE' : 'Res. SED 2471 • Bilingüe C1/C2'}
            </div>
          </div>
        </div>

        <a
          href="https://wa.me/573127459728?text=Hola%20Anthony,%20vengo%20de%20la%20p%C3%A1gina%20web%20de%20American%20Dream%20English%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos."
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-bold transition-colors flex items-center space-x-1 cursor-pointer flex-shrink-0"
        >
          <MessageCircle className="w-3 h-3" />
          <span>WhatsApp</span>
        </a>
      </div>


    </div>
  );
}
