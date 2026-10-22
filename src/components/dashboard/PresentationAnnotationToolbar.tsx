'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Maximize2, 
  Minimize2, 
  MousePointer, 
  Sparkles, 
  Pen, 
  RotateCcw, 
  Trash2, 
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

type ToolMode = 'navigate' | 'laser' | 'pen'

interface Point {
  x: number
  y: number
  time?: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
  isLaser?: boolean
}

export const PresentationAnnotationToolbar: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [toolMode, setToolMode] = useState<ToolMode>('navigate')
  const [selectedColor, setSelectedColor] = useState('#FF3B30')
  const [strokeWidth, setStrokeWidth] = useState<'fino' | 'med'>('fino')
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentStrokeRef = useRef<Stroke | null>(null)
  const laserTrailRef = useRef<Point[]>([])
  const animFrameIdRef = useRef<number | null>(null)
  const isMouseDownRef = useRef(false)

  const colors = [
    { id: 'red', hex: '#FF3B30', name: 'Rojo Láser' },
    { id: 'yellow', hex: '#FFCC00', name: 'Amarillo' },
    { id: 'cyan', hex: '#00C7BE', name: 'Cian' },
    { id: 'blue', hex: '#0A84FF', name: 'Azul' },
    { id: 'white', hex: '#FFFFFF', name: 'Blanco' }
  ]

  const activeWidth = strokeWidth === 'fino' ? 3.5 : 6.5

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement)
      setIsFullscreen(active)
      if (active) {
        setIsOpen(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Canvas size sync
  const updateCanvasSize = useCallback(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }, [])

  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  // Redraw canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    // Render persistent pen strokes
    strokesRef.current.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Glowing aura
      ctx.shadowColor = stroke.color
      ctx.shadowBlur = stroke.isLaser ? 14 : 6

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        const xc = (stroke.points[i].x + stroke.points[i - 1].x) / 2
        const yc = (stroke.points[i].y + stroke.points[i - 1].y) / 2
        ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc)
      }
      ctx.stroke()
      ctx.restore()
    })

    // Render current in-progress stroke
    if (currentStrokeRef.current && currentStrokeRef.current.points.length >= 2) {
      const stroke = currentStrokeRef.current
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = stroke.color
      ctx.shadowBlur = stroke.isLaser ? 16 : 8

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        const xc = (stroke.points[i].x + stroke.points[i - 1].x) / 2
        const yc = (stroke.points[i].y + stroke.points[i - 1].y) / 2
        ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc)
      }
      ctx.stroke()
      ctx.restore()
    }

    // Render fading laser pointer trail
    if (laserTrailRef.current.length > 0) {
      const now = Date.now()
      // Filter out points older than 1200ms
      laserTrailRef.current = laserTrailRef.current.filter((p) => now - (p.time || 0) < 1200)

      if (laserTrailRef.current.length > 1) {
        ctx.save()
        for (let i = 1; i < laserTrailRef.current.length; i++) {
          const p1 = laserTrailRef.current[i - 1]
          const p2 = laserTrailRef.current[i]
          const age = now - (p2.time || now)
          const opacity = Math.max(0, 1 - age / 1200)

          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 59, 48, ${opacity})`
          ctx.lineWidth = 4 * opacity + 1
          ctx.lineCap = 'round'
          ctx.shadowColor = '#FF3B30'
          ctx.shadowBlur = 14 * opacity

          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Glowing laser dot at the latest point
      const lastPoint = laserTrailRef.current[laserTrailRef.current.length - 1]
      if (lastPoint && toolMode === 'laser') {
        ctx.save()
        // Outer glow
        const gradient = ctx.createRadialGradient(lastPoint.x, lastPoint.y, 2, lastPoint.x, lastPoint.y, 16)
        gradient.addColorStop(0, '#FFFFFF')
        gradient.addColorStop(0.3, '#FF3B30')
        gradient.addColorStop(1, 'rgba(255, 59, 48, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(lastPoint.x, lastPoint.y, 16, 0, Math.PI * 2)
        ctx.fill()

        // White core
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(lastPoint.x, lastPoint.y, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }
  }, [toolMode])

  // Animation frame loop for smooth laser fading
  useEffect(() => {
    let active = true
    const loop = () => {
      renderCanvas()
      if (active) {
        animFrameIdRef.current = requestAnimationFrame(loop)
      }
    }
    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [renderCanvas])

  // Mouse event handlers for drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode === 'navigate') return
    isMouseDownRef.current = true
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    currentStrokeRef.current = {
      points: [{ x, y, time: Date.now() }],
      color: selectedColor,
      width: activeWidth,
      isLaser: toolMode === 'laser'
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = Date.now()

    // Record laser trail point
    if (toolMode === 'laser') {
      laserTrailRef.current.push({ x, y, time: now })
    }

    if (!isMouseDownRef.current || !currentStrokeRef.current) return
    currentStrokeRef.current.points.push({ x, y, time: now })
  }

  const handleMouseUp = () => {
    if (isMouseDownRef.current && currentStrokeRef.current) {
      if (toolMode === 'pen') {
        // Persist pen stroke
        strokesRef.current.push(currentStrokeRef.current)
      }
      currentStrokeRef.current = null
    }
    isMouseDownRef.current = false
  }

  const handleUndo = () => {
    strokesRef.current.pop()
    renderCanvas()
  }

  const handleClear = () => {
    strokesRef.current = []
    laserTrailRef.current = []
    renderCanvas()
  }

  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
        setIsOpen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.warn('Fullscreen toggle not supported or blocked:', err)
      // Fallback: toggle presentation mode inside page
      setIsOpen(!isOpen)
    }
  }

  return (
    <>
      {/* 1. TOP TRIGGER BUTTON (MOUNTED IN HEADER) */}
      <div className="inline-flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={toggleFullscreen}
          className={`px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
            isFullscreen
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
          }`}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Presentar en pantalla completa con herramientas de láser y dibujo'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Salir Pantalla Completa</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Expandir Pantalla</span>
              <span className="sm:hidden">Presentar</span>
            </>
          )}
        </motion.button>

        {/* Small launcher to open toolbar even if not in native fullscreen */}
        {!isFullscreen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isOpen 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title="Herramientas de Láser y Marcación"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
          </motion.button>
        )}
      </div>

      {/* 2. FULLSCREEN TRANSPARENT CANVAS OVERLAY */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`fixed inset-0 z-[99990] transition-opacity duration-150 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${toolMode === 'navigate' ? 'pointer-events-none' : 'cursor-crosshair'}`}
        style={{
          width: '100vw',
          height: '100vh',
          touchAction: 'none'
        }}
      />

      {/* 3. FLOATING PRESENTATION TOOLBAR (BOTTOM-RIGHT EXACTLY LIKE PSP SCREENSHOT) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="fixed bottom-5 right-5 z-[99999] select-none pointer-events-auto"
          >
            <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-slate-950/92 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,59,48,0.25)] rounded-2xl text-white">
              
              {/* Mode: Navegar */}
              <button
                type="button"
                onClick={() => setToolMode('navigate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'navigate'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Modo interactivo (permite hacer clic en la plataforma)"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Navegar</span>
              </button>

              {/* Mode: Láser (Glowing Coral/Red Pill) */}
              <button
                type="button"
                onClick={() => setToolMode('laser')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'laser'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/40 ring-1 ring-red-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Puntero láser con estela luminosa"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Láser</span>
              </button>

              {/* Mode: Lápiz */}
              <button
                type="button"
                onClick={() => setToolMode('pen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'pen'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md ring-1 ring-blue-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Lápiz para anotaciones libres y flechas"
              >
                <Pen className="w-3.5 h-3.5" />
                <span>Lápiz</span>
              </button>

              <div className="h-5 w-px bg-white/15 mx-0.5" />

              {/* Color Picker Dots */}
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                      selectedColor === c.hex
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-125'
                        : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="h-5 w-px bg-white/15 mx-0.5" />

              {/* Thickness: Fino / Med */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setStrokeWidth('fino')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    strokeWidth === 'fino' ? 'bg-white text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Fino
                </button>
                <button
                  type="button"
                  onClick={() => setStrokeWidth('med')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    strokeWidth === 'med' ? 'bg-white text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Med
                </button>
              </div>

              <div className="h-5 w-px bg-white/15 mx-0.5" />

              {/* Undo Button */}
              <button
                type="button"
                onClick={handleUndo}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Deshacer último trazo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Clear / Trash Button */}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                title="Borrar todos los trazos"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Toolbar */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setToolMode('navigate')
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer ml-1"
                title="Ocultar barra de herramientas"
              >
                <X className="w-3.5 h-3.5" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
