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
  X
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
  const [toolMode, setToolMode] = useState<ToolMode>('laser')
  const [selectedColor, setSelectedColor] = useState('#FF3B30')
  const [strokeWidth, setStrokeWidth] = useState<'fino' | 'med'>('fino')
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const strokesRef = useRef<Stroke[]>([])
  const currentStrokeRef = useRef<Stroke | null>(null)
  const mousePosRef = useRef<{ x: number; y: number; visible: boolean }>({ x: -100, y: -100, visible: false })
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

  // Canvas size sync with HiDPI support
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

  // Redraw canvas: renders persistent strokes + in-progress stroke + PowerPoint laser dot
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    // 1. Render all persistent strokes (both laser drawings and pen drawings)
    strokesRef.current.forEach((stroke) => {
      if (stroke.points.length === 0) return

      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Glowing aura
      ctx.shadowColor = stroke.color
      ctx.shadowBlur = stroke.isLaser ? 14 : 6

      if (stroke.points.length === 1) {
        ctx.fillStyle = stroke.color
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          const xc = (stroke.points[i].x + stroke.points[i - 1].x) / 2
          const yc = (stroke.points[i].y + stroke.points[i - 1].y) / 2
          ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc)
        }
        ctx.stroke()
      }
      ctx.restore()
    })

    // 2. Render current in-progress stroke while mouse is pressed down
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      const stroke = currentStrokeRef.current
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = stroke.color
      ctx.shadowBlur = stroke.isLaser ? 16 : 8

      if (stroke.points.length === 1) {
        ctx.fillStyle = stroke.color
        ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.width / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          const xc = (stroke.points[i].x + stroke.points[i - 1].x) / 2
          const yc = (stroke.points[i].y + stroke.points[i - 1].y) / 2
          ctx.quadraticCurveTo(stroke.points[i - 1].x, stroke.points[i - 1].y, xc, yc)
        }
        ctx.stroke()
      }
      ctx.restore()
    }

    // 3. Render PowerPoint / Teams style Laser Pointer Dot (only visible when in laser mode)
    // NO trailing curves when just moving freely. Just the crisp, glowing red laser dot!
    if (toolMode === 'laser' && mousePosRef.current.visible) {
      const { x: lx, y: ly } = mousePosRef.current
      ctx.save()

      // Soft luminous outer halo
      const outerGrad = ctx.createRadialGradient(lx, ly, 1, lx, ly, 20)
      outerGrad.addColorStop(0, 'rgba(255, 59, 48, 0.85)')
      outerGrad.addColorStop(0.35, 'rgba(255, 59, 48, 0.35)')
      outerGrad.addColorStop(1, 'rgba(255, 59, 48, 0)')

      ctx.fillStyle = outerGrad
      ctx.beginPath()
      ctx.arc(lx, ly, 20, 0, Math.PI * 2)
      ctx.fill()

      // Intense laser red core
      ctx.shadowColor = '#FF3B30'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#FF3B30'
      ctx.beginPath()
      ctx.arc(lx, ly, 5.5, 0, Math.PI * 2)
      ctx.fill()

      // Hot white center spot
      ctx.shadowBlur = 0
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(lx, ly, 2.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }, [toolMode])

  // Continuous animation frame loop to render laser position & strokes ultra smoothly
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

  // Coordinate helper for both Mouse & Touch events
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      }
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
    return null
  }

  // Pointer Down: Start drawing stroke (works in both laser and pen mode)
  const handleStart = (coords: { x: number; y: number } | null) => {
    if (toolMode === 'navigate' || !coords) return
    isMouseDownRef.current = true
    mousePosRef.current = { x: coords.x, y: coords.y, visible: true }

    currentStrokeRef.current = {
      points: [{ x: coords.x, y: coords.y, time: Date.now() }],
      color: toolMode === 'laser' ? '#FF3B30' : selectedColor,
      width: activeWidth,
      isLaser: toolMode === 'laser'
    }
    renderCanvas()
  }

  // Pointer Move:
  // - If mouse is NOT pressed down: just moves the PowerPoint laser pointer dot (NO trails left behind)
  // - If mouse IS pressed down: records drawing trajectory
  const handleMove = (coords: { x: number; y: number } | null) => {
    if (!coords) return
    mousePosRef.current = { x: coords.x, y: coords.y, visible: true }

    if (isMouseDownRef.current && currentStrokeRef.current) {
      currentStrokeRef.current.points.push({ x: coords.x, y: coords.y, time: Date.now() })
    }
  }

  // Pointer Up: Persist the drawing stroke permanently on screen!
  const handleEnd = () => {
    if (isMouseDownRef.current && currentStrokeRef.current) {
      if (currentStrokeRef.current.points.length === 1) {
        const p = currentStrokeRef.current.points[0]
        currentStrokeRef.current.points.push({ x: p.x + 0.5, y: p.y + 0.5, time: p.time })
      }
      strokesRef.current.push(currentStrokeRef.current)
      currentStrokeRef.current = null
    }
    isMouseDownRef.current = false
    renderCanvas()
  }

  const handleMouseLeave = () => {
    mousePosRef.current.visible = false
    handleEnd()
  }

  // Undo last stroke (Ctrl + Z or Undo button)
  const handleUndo = useCallback(() => {
    strokesRef.current.pop()
    renderCanvas()
  }, [renderCanvas])

  // Clear all annotations
  const handleClear = useCallback(() => {
    strokesRef.current = []
    currentStrokeRef.current = null
    renderCanvas()
  }, [renderCanvas])

  // Global keyboard shortcuts (Ctrl+Z to undo, Esc to exit or close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        handleUndo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo])

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
      setIsOpen(!isOpen)
    }
  }

  return (
    <>
      {/* 1. BOTÓN SUPERIOR EN HEADER (EXPANDIR PANTALLA) */}
      <div className="inline-flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={toggleFullscreen}
          className={`px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
            isFullscreen
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
          }`}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Presentar en pantalla completa con puntero láser PowerPoint y anotaciones'}
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

        {/* Botón rápido para abrir/cerrar barra sin forzar fullscreen si se desea */}
        {!isFullscreen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isOpen 
                ? 'bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-400/20' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="Abrir barra de puntero láser y anotaciones"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
          </motion.button>
        )}
      </div>

      {/* 2. LIENZO TRANSPARENTE ULTRA-FLUIDO */}
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => handleStart(getCoordinates(e))}
        onMouseMove={(e) => handleMove(getCoordinates(e))}
        onMouseUp={handleEnd}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => handleStart(getCoordinates(e))}
        onTouchMove={(e) => handleMove(getCoordinates(e))}
        onTouchEnd={handleEnd}
        className={`fixed inset-0 z-[99990] transition-opacity duration-150 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${
          toolMode === 'navigate' 
            ? 'pointer-events-none' 
            : toolMode === 'laser' 
            ? 'cursor-none' 
            : 'cursor-crosshair'
        }`}
        style={{
          width: '100vw',
          height: '100vh',
          touchAction: 'none'
        }}
      />

      {/* 3. CÁPSULA FLOTANTE DE PRESENTACIÓN (EXACTA AL SCREENSHOT PSP) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="fixed bottom-5 right-5 z-[99999] select-none pointer-events-auto"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-slate-950/92 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,59,48,0.25)] rounded-2xl text-white">
              
              {/* Botón Navegar */}
              <button
                type="button"
                onClick={() => setToolMode('navigate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'navigate'
                    ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Modo interactivo: interactúa con clics, scrolls y botones del dashboard"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Navegar</span>
              </button>

              {/* Botón Láser PowerPoint */}
              <button
                type="button"
                onClick={() => setToolMode('laser')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'laser'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/40 ring-1 ring-red-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Láser PowerPoint: mueve libre para señalar sin estelas. Presiona y arrastra para dibujar figuras permanentes."
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Láser</span>
              </button>

              {/* Botón Lápiz */}
              <button
                type="button"
                onClick={() => setToolMode('pen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  toolMode === 'pen'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md ring-1 ring-blue-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Lápiz libre con selector de color"
              >
                <Pen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lápiz</span>
              </button>

              <div className="h-5 w-px bg-white/15 mx-0.5" />

              {/* Selector de Color */}
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

              {/* Selector de Grosor: Fino / Med */}
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

              {/* Botón Deshacer (Undo) */}
              <button
                type="button"
                onClick={handleUndo}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Deshacer último trazo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Botón Limpiar Todo (Trash) */}
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                title="Borrar todas las marcas y figuras"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setToolMode('navigate')
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer ml-0.5"
                title="Cerrar barra de herramientas"
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
