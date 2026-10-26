'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  Home, 
  Compass, 
  MessageCircle, 
  ShieldCheck, 
  Sun, 
  Moon, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Award, 
  ChevronRight,
  ExternalLink,
  HelpCircle,
  RotateCcw
} from 'lucide-react'

export const IsometricNotFound: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [activeTile, setActiveTile] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.pathname)
    }
  }, [])

  // Parallax subtle tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 20
    const y = (e.clientY / innerHeight - 0.5) * 15
    setMouseOffset({ x, y })
  }

  const isDark = theme === 'dark'

  // Quick navigation destinations
  const popularLinks = [
    { label: 'Cursos de Inglés', href: '/cursos', tag: 'Programas' },
    { label: 'Campus Virtual', href: '/campus/login', tag: 'Alumnos' },
    { label: 'Matrícula en Línea', href: '/matricula', tag: 'Wompi' },
    { label: 'Plataforma PSP', href: '/dashboard/admin/liquidaciones', tag: 'Gestión' },
    { label: 'Ubicación Turbo, Urabá', href: '/como-llegar', tag: 'Sede' }
  ]

  const filteredLinks = popularLinks.filter((link) =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`min-h-screen transition-colors duration-500 relative flex flex-col font-sans select-none overflow-x-hidden ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* 1. TOP LUXURY HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19]/80 border-slate-800/80' : 'bg-white/80 border-slate-200/80 shadow-2xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 p-0.5 shadow-md flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-blue-800 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-base sm:text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AMERICAN DREAMS
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                  <Award className="w-3 h-3 text-amber-500" /> 12 Años
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
                Instituto de Idiomas • Turbo, Urabá Antioqueño
              </p>
            </div>
          </Link>

          {/* Center Blueprint Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shadow-2xs">
            <div className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-cyan-400' : 'bg-blue-600'}`} />
            <span className={isDark ? 'text-cyan-400' : 'text-blue-700'}>
              ERROR_CODE: 404_PAGE_NOT_FOUND
            </span>
          </div>

          {/* Right Actions: Theme Switcher & Direct Home */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle (Light / Dark as requested) */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
              }`}
              title={isDark ? 'Cambiar a Modo Claro (Estilo Institucional)' : 'Cambiar a Modo Oscuro (Estilo DISPEL Blueprint)'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-slate-200">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Modo Blueprint</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Volver a Inicio</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. MAIN ISOMETRIC 3D STAGE (DISPEL ARCHITECTURAL WIREFRAME BLUEPRINT) */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute pointer-events-none w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(99,102,241,0.2) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(99,102,241,0.2) 60%, transparent 100%)'
          }}
        />

        {/* 3D Isometric Viewport Container with Dynamic Parallax */}
        <div 
          className="w-full max-w-5xl mx-auto relative flex flex-col items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mouseOffset.y * 0.15}deg) rotateY(${mouseOffset.x * 0.2}deg)`
          }}
        >
          {/* THE ISOMETRIC SVG BLUEPRINT */}
          <svg
            viewBox="0 0 1100 680"
            className="w-full h-auto max-w-4xl select-none filter drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients for Extrusions */}
              {/* Light Theme Gradients */}
              <linearGradient id="light4Top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>
              <linearGradient id="light4Front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <linearGradient id="light4Side" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* Dark / DISPEL Theme Gradients */}
              <linearGradient id="dark4Top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="dark4Front" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="dark4Side" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Glowing Rim / Line Filters */}
              <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* A. ISOMETRIC FLOOR BLUEPRINT GRID */}
            <g 
              stroke={isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(37, 99, 235, 0.18)'} 
              strokeWidth="1.2"
              fill="none"
            >
              {/* Perspective Diagonals (Axis +30 deg & -30 deg) */}
              {[-300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300].map((x, i) => (
                <line 
                  key={`iso-diag-1-${i}`}
                  x1={x} 
                  y1="50" 
                  x2={x + 700} 
                  y2="650" 
                  strokeDasharray={i % 3 === 0 ? '4 4' : 'none'}
                  strokeOpacity={i % 3 === 0 ? '0.45' : '0.2'}
                />
              ))}

              {[-300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300].map((x, i) => (
                <line 
                  key={`iso-diag-2-${i}`}
                  x1={x} 
                  y1="50" 
                  x2={x - 700} 
                  y2="650" 
                  strokeDasharray={i % 4 === 0 ? '6 4' : 'none'}
                  strokeOpacity={i % 4 === 0 ? '0.45' : '0.2'}
                />
              ))}

              {/* Technical Horizon & Elevation Lines */}
              <line x1="80" y1="120" x2="1020" y2="120" strokeDasharray="3 3" strokeOpacity="0.25" />
              <line x1="80" y1="580" x2="1020" y2="580" strokeDasharray="3 3" strokeOpacity="0.25" />

              {/* Technical Grid Blueprint Coordinates */}
              <text x="90" y="140" fill={isDark ? '#38BDF8' : '#2563EB'} fontSize="9" fontFamily="monospace" opacity="0.6">
                [GRID_REF: ADE_404_ISOMETRIC_V2]
              </text>
              <text x="890" y="140" fill={isDark ? '#38BDF8' : '#2563EB'} fontSize="9" fontFamily="monospace" opacity="0.6">
                [AXIS: 30° / ELEVATION: 120px]
              </text>
              <text x="90" y="565" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace" opacity="0.5">
                X: -40.400  Y: +00.000  Z: +404.000
              </text>
              <text x="840" y="565" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="9" fontFamily="monospace" opacity="0.5">
                STATUS: UNMAPPED_COORDINATE
              </text>
            </g>

            {/* B. THE 3D ISOMETRIC 404 EXTRUSION */}
            <g id="isometric-404-group">
              
              {/* ==================== 1. FIRST '4' ==================== */}
              <g id="first-four">
                {/* Floor Shadow for first '4' */}
                <polygon 
                  points="210,480 340,405 380,428 250,503" 
                  fill={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.12)'} 
                />
                
                {/* Side Face (Depth/Shadow) */}
                <polygon 
                  points="340,320 380,343 380,428 340,405" 
                  fill={isDark ? 'url(#dark4Side)' : 'url(#light4Side)'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.2"
                />
                <polygon 
                  points="250,418 290,441 290,466 250,443" 
                  fill={isDark ? 'url(#dark4Side)' : 'url(#light4Side)'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.2"
                />

                {/* Front Face of '4' */}
                <polygon 
                  points="
                    250,210 290,233 290,325 340,320 340,405 290,408 290,443 250,420 
                    250,385 210,362 210,315 250,292
                  " 
                  fill={isDark ? 'url(#dark4Front)' : 'url(#light4Front)'}
                  stroke={isDark ? '#E2E8F0' : '#334155'}
                  strokeWidth="1.5"
                />

                {/* Inner Cutout Hole of '4' */}
                <polygon 
                  points="250,300 270,312 270,360 250,350" 
                  fill={isDark ? '#020617' : '#475569'}
                  stroke={isDark ? '#38BDF8' : '#1E293B'}
                  strokeWidth="1"
                />

                {/* Top Faces (Lightest surface reflecting light) */}
                <polygon 
                  points="250,210 290,187 330,210 290,233" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />
                <polygon 
                  points="300,297 340,274 380,297 340,320" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />
                <polygon 
                  points="210,315 250,292 290,315 250,338" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />

                {/* Architectural Blueprint Accent lines on '4' */}
                <line x1="250" y1="210" x2="250" y2="420" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="340" y1="320" x2="340" y2="405" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="1" opacity="0.8" />
              </g>


              {/* ==================== 2. CENTER '0' ==================== */}
              <g id="center-zero">
                {/* Floor Shadow for '0' */}
                <ellipse 
                  cx="530" 
                  cy="435" 
                  rx="95" 
                  ry="55" 
                  fill={isDark ? 'rgba(0,0,0,0.55)' : 'rgba(15,23,42,0.13)'} 
                />

                {/* Outer Curved Cylinder Side Shadow */}
                <path 
                  d="M 445,290 C 445,340 500,380 565,380 C 630,380 685,340 685,290 L 685,410 C 685,460 630,500 565,500 C 500,500 445,460 445,410 Z"
                  fill={isDark ? 'url(#dark4Side)' : 'url(#light4Side)'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.5"
                />

                {/* Outer Curved Cylinder Front Body */}
                <path 
                  d="M 445,290 C 445,335 490,370 545,370 L 545,490 C 490,490 445,455 445,410 Z"
                  fill={isDark ? 'url(#dark4Front)' : 'url(#light4Front)'}
                  stroke={isDark ? '#E2E8F0' : '#334155'}
                  strokeWidth="1.5"
                />

                {/* Center Core Hollow Cutout (Inner Depth) */}
                <ellipse 
                  cx="565" 
                  cy="390" 
                  rx="35" 
                  ry="20" 
                  fill={isDark ? '#020617' : '#334155'} 
                  stroke={isDark ? '#38BDF8' : '#1E293B'}
                  strokeWidth="1.2"
                />
                <path 
                  d="M 530,270 L 530,390 C 530,402 545,410 565,410 L 565,290 Z" 
                  fill={isDark ? '#000000' : '#1E293B'} 
                  opacity="0.8"
                />

                {/* Top Rim of '0' (Light reflective ellipse) */}
                <ellipse 
                  cx="565" 
                  cy="270" 
                  rx="120" 
                  ry="70" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="2"
                />

                {/* Top Hollow Ellipse */}
                <ellipse 
                  cx="565" 
                  cy="270" 
                  rx="45" 
                  ry="26" 
                  fill={isDark ? '#0B0F19' : '#CBD5E1'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.5"
                />

                {/* Vertical Blueprint Technical Guideline through center */}
                <line x1="565" y1="170" x2="565" y2="470" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7" />
              </g>


              {/* ==================== 3. SECOND '4' ==================== */}
              <g id="second-four">
                {/* Floor Shadow for second '4' */}
                <polygon 
                  points="680,360 810,285 850,308 720,383" 
                  fill={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.12)'} 
                />

                {/* Side Face (Depth/Shadow) */}
                <polygon 
                  points="810,200 850,223 850,308 810,285" 
                  fill={isDark ? 'url(#dark4Side)' : 'url(#light4Side)'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.2"
                />
                <polygon 
                  points="720,298 760,321 760,346 720,323" 
                  fill={isDark ? 'url(#dark4Side)' : 'url(#light4Side)'}
                  stroke={isDark ? '#38BDF8' : '#1E3A8A'}
                  strokeWidth="1.2"
                />

                {/* Front Face of second '4' */}
                <polygon 
                  points="
                    720,90 760,113 760,205 810,200 810,285 760,288 760,323 720,300 
                    720,265 680,242 680,195 720,172
                  " 
                  fill={isDark ? 'url(#dark4Front)' : 'url(#light4Front)'}
                  stroke={isDark ? '#E2E8F0' : '#334155'}
                  strokeWidth="1.5"
                />

                {/* Inner Cutout Hole */}
                <polygon 
                  points="720,180 740,192 740,240 720,230" 
                  fill={isDark ? '#020617' : '#475569'}
                  stroke={isDark ? '#38BDF8' : '#1E293B'}
                  strokeWidth="1"
                />

                {/* Top Faces */}
                <polygon 
                  points="720,90 760,67 800,90 760,113" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />
                <polygon 
                  points="770,177 810,154 850,177 810,200" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />
                <polygon 
                  points="680,195 720,172 760,195 720,218" 
                  fill={isDark ? 'url(#dark4Top)' : 'url(#light4Top)'}
                  stroke={isDark ? '#FFFFFF' : '#475569'}
                  strokeWidth="1.5"
                />

                {/* Architectural Blueprint Accent lines on second '4' */}
                <line x1="720" y1="90" x2="720" y2="300" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="810" y1="200" x2="810" y2="285" stroke={isDark ? '#38BDF8' : '#2563EB'} strokeWidth="1" opacity="0.8" />
              </g>

            </g>


            {/* C. THREE ISOMETRIC FLOATING TILES (DISPEL STYLE IN FRONT OF 404) */}
            {/* Tile 1: Left Tile (American Dreams Logo / Inicio) */}
            <g 
              id="iso-tile-1"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setActiveTile(1)}
              onMouseLeave={() => setActiveTile(null)}
              onClick={() => window.location.href = '/'}
              transform={activeTile === 1 ? 'translate(0, -12)' : 'translate(0, 0)'}
            >
              {/* Tile Shadow on floor */}
              <polygon 
                points="460,540 560,482 660,540 560,598" 
                fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.2)'} 
                filter="url(#neonGlowCyan)"
              />
              
              {/* Tile Extrusion Sides (Left & Right 3D Thickness) */}
              <polygon 
                points="460,520 560,578 560,590 460,532" 
                fill={isDark ? '#0F172A' : '#64748B'} 
                stroke={isDark ? '#38BDF8' : '#1E40AF'} 
                strokeWidth="1.2"
              />
              <polygon 
                points="560,578 660,520 660,532 560,590" 
                fill={isDark ? '#020617' : '#475569'} 
                stroke={isDark ? '#38BDF8' : '#1E40AF'} 
                strokeWidth="1.2"
              />

              {/* Tile Top Face (Isometric Rhombus) */}
              <polygon 
                points="460,520 560,462 660,520 560,578" 
                fill={isDark ? (activeTile === 1 ? '#1E293B' : '#0F172A') : (activeTile === 1 ? '#FFFFFF' : '#F1F5F9')}
                stroke={activeTile === 1 ? (isDark ? '#38BDF8' : '#2563EB') : (isDark ? '#334155' : '#CBD5E1')}
                strokeWidth={activeTile === 1 ? '2.5' : '1.5'}
              />

              {/* Tile Icon Emblem (American Dreams Logo inside Circle) */}
              <ellipse 
                cx="560" 
                cy="520" 
                rx="24" 
                ry="14" 
                fill={activeTile === 1 ? '#2563EB' : (isDark ? '#1E293B' : '#E2E8F0')}
                stroke={isDark ? '#38BDF8' : '#2563EB'}
                strokeWidth="1.5"
              />
              {/* Star / Graduation Icon Center */}
              <polygon 
                points="560,512 564,518 570,519 566,523 567,529 560,526 553,529 554,523 550,519 556,518" 
                fill={activeTile === 1 ? '#FFFFFF' : '#F59E0B'} 
              />
            </g>


            {/* Tile 2: Center-Right Tile (Campus Virtual / Student Portal) */}
            <g 
              id="iso-tile-2"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setActiveTile(2)}
              onMouseLeave={() => setActiveTile(null)}
              onClick={() => window.location.href = '/campus/login'}
              transform={activeTile === 2 ? 'translate(0, -12)' : 'translate(0, 0)'}
            >
              {/* Tile Shadow */}
              <polygon 
                points="580,470 680,412 780,470 680,528" 
                fill={isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.2)'} 
                filter="url(#neonGlowBlue)"
              />

              {/* Tile Thickness */}
              <polygon 
                points="580,450 680,508 680,520 580,462" 
                fill={isDark ? '#0F172A' : '#64748B'} 
                stroke={isDark ? '#818CF8' : '#4338CA'} 
                strokeWidth="1.2"
              />
              <polygon 
                points="680,508 780,450 780,462 680,520" 
                fill={isDark ? '#020617' : '#475569'} 
                stroke={isDark ? '#818CF8' : '#4338CA'} 
                strokeWidth="1.2"
              />

              {/* Tile Top Face */}
              <polygon 
                points="580,450 680,392 780,450 680,508" 
                fill={isDark ? (activeTile === 2 ? '#1E293B' : '#0F172A') : (activeTile === 2 ? '#FFFFFF' : '#F1F5F9')}
                stroke={activeTile === 2 ? '#818CF8' : (isDark ? '#334155' : '#CBD5E1')}
                strokeWidth={activeTile === 2 ? '2.5' : '1.5'}
              />

              {/* Shield Icon Emblem */}
              <ellipse 
                cx="680" 
                cy="450" 
                rx="24" 
                ry="14" 
                fill={activeTile === 2 ? '#4F46E5' : (isDark ? '#1E293B' : '#E2E8F0')}
                stroke={isDark ? '#818CF8' : '#4F46E5'}
                strokeWidth="1.5"
              />
              <path 
                d="M 673,445 L 680,442 L 687,445 C 687,453 680,457 680,457 C 680,457 673,453 673,445 Z" 
                fill={activeTile === 2 ? '#FFFFFF' : '#818CF8'} 
              />
            </g>


            {/* Tile 3: Far-Right Tile (Explorar Cursos / WhatsApp Directo) */}
            <g 
              id="iso-tile-3"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setActiveTile(3)}
              onMouseLeave={() => setActiveTile(null)}
              onClick={() => window.location.href = '/cursos'}
              transform={activeTile === 3 ? 'translate(0, -12)' : 'translate(0, 0)'}
            >
              {/* Tile Shadow */}
              <polygon 
                points="700,400 800,342 900,400 800,458" 
                fill={isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)'} 
              />

              {/* Tile Thickness */}
              <polygon 
                points="700,380 800,438 800,450 700,392" 
                fill={isDark ? '#0F172A' : '#64748B'} 
                stroke={isDark ? '#34D399' : '#047857'} 
                strokeWidth="1.2"
              />
              <polygon 
                points="800,438 900,380 900,392 800,450" 
                fill={isDark ? '#020617' : '#475569'} 
                stroke={isDark ? '#34D399' : '#047857'} 
                strokeWidth="1.2"
              />

              {/* Tile Top Face */}
              <polygon 
                points="700,380 800,322 900,380 800,438" 
                fill={isDark ? (activeTile === 3 ? '#1E293B' : '#0F172A') : (activeTile === 3 ? '#FFFFFF' : '#F1F5F9')}
                stroke={activeTile === 3 ? '#34D399' : (isDark ? '#334155' : '#CBD5E1')}
                strokeWidth={activeTile === 3 ? '2.5' : '1.5'}
              />

              {/* Compass / Search Emblem */}
              <ellipse 
                cx="800" 
                cy="380" 
                rx="24" 
                ry="14" 
                fill={activeTile === 3 ? '#10B981' : (isDark ? '#1E293B' : '#E2E8F0')}
                stroke={isDark ? '#34D399' : '#10B981'}
                strokeWidth="1.5"
              />
              <circle cx="800" cy="380" r="4" fill={activeTile === 3 ? '#FFFFFF' : '#34D399'} />
            </g>

          </svg>
        </div>


        {/* 3. INTERACTIVE PLATFORM BUTTONS (CORRESPONDING TO THE 3 ISOMETRIC TILES) */}
        <div className="w-full max-w-4xl mx-auto -mt-6 sm:-mt-10 z-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            
            {/* Action 1: Inicio */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveTile(1)}
              onMouseLeave={() => setActiveTile(null)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                activeTile === 1
                  ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/20'
                  : isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-white/90 border-slate-200/90 hover:border-blue-300 shadow-2xs'
              }`}
            >
              <Link href="/" className="block">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-600 flex items-center justify-center font-bold">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold">
                    TILE 01
                  </span>
                </div>
                <h3 className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Volver al Inicio
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Regresa a la página principal y conoce nuestra oferta académica en Turbo.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <span>Ir a Inicio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>

            {/* Action 2: Campus Virtual */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveTile(2)}
              onMouseLeave={() => setActiveTile(null)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                activeTile === 2
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-white/90 border-slate-200/90 hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <Link href="/campus/login" className="block">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/15 text-indigo-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 font-bold">
                    TILE 02
                  </span>
                </div>
                <h3 className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Campus Virtual
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Inicia sesión en tus clases, mira tus calificaciones y materiales de estudio.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                  <span>Acceso Estudiantes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>

            {/* Action 3: Explorar Cursos / Asesoría WhatsApp */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setActiveTile(3)}
              onMouseLeave={() => setActiveTile(null)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                activeTile === 3
                  ? 'bg-emerald-600/10 border-emerald-500 shadow-lg shadow-emerald-500/20'
                  : isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-white/90 border-slate-200/90 hover:border-emerald-300 shadow-2xs'
              }`}
            >
              <Link href="/cursos" className="block">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/15 text-emerald-600 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                    TILE 03
                  </span>
                </div>
                <h3 className={`font-black text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Explorar Cursos
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Encuentra el nivel ideal para ti: niños, jóvenes, adultos y preparación TOEFL.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span>Ver Oferta Académica</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>

          </div>
        </div>


        {/* 4. SMART SEARCH & URL DIAGNOSIS */}
        <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-10">
          
          {/* URL Diagnosis Card */}
          {currentUrl && (
            <div className={`mb-4 px-4 py-2.5 rounded-xl border text-xs flex items-center justify-between font-mono ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-2xs'
            }`}>
              <div className="flex items-center gap-2 truncate">
                <span className="text-rose-500 font-bold">Ruta no encontrada:</span>
                <span className="truncate underline">{currentUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="hover:text-blue-600 flex items-center gap-1 text-[11px] font-sans font-bold shrink-0 ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Volver atrás</span>
              </button>
            </div>
          )}

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué estabas buscando? (ej. Cursos, Matrícula, Campus, Pagos...)"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium border transition-all outline-none ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 ring-1 focus:ring-cyan-500/20' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 ring-1 focus:ring-blue-500/20 shadow-2xs'
              }`}
            />
          </div>

          {/* Search Quick Suggestions */}
          {searchQuery && (
            <div className={`mt-2 p-2 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              {filteredLinks.length > 0 ? (
                <div className="space-y-1">
                  {filteredLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                        isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        <span>{link.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600">
                        {link.tag}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center py-3 text-xs text-slate-400">
                  No encontramos resultados directos. Puedes consultar directamente por WhatsApp abajo.
                </p>
              )}
            </div>
          )}

        </div>

      </main>

      {/* 5. FOOTER WITH CORPLEX SOLUTIONS SAS BADGE & DIRECT WHATSAPP */}
      <footer className={`py-6 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19] border-slate-800/80 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} American Dreams English. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/573127459728?text=Hola%20Anthony,%20vengo%20de%20la%20p%C3%A1gina%20web%20de%20American%20Dream%20English%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-500 font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>Soporte por WhatsApp</span>
            </a>

            <span className="text-slate-300">|</span>

            <span className="text-[11px] font-mono">
              Designed with precision by CORPLEX Solutions SAS
            </span>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/573127459728?text=Hola%20Anthony,%20vengo%20de%20la%20p%C3%A1gina%20web%20de%20American%20Dream%20English%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer"
        title="¿Te perdiste? Escríbenos directamente a WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">¿Necesitas ayuda? Escríbenos</span>
      </a>

    </div>
  )
}
