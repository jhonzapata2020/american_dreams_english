'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { createClient } from '../../../utils/supabase/client'
import { 
  Tv, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  UploadCloud,
  CheckCircle2,
  Film,
  ChevronRight
} from 'lucide-react'

export interface CarouselItem {
  id: string
  type: 'image' | 'video'
  media_url: string
  title: string
  order_index: number
  is_active: boolean
  created_at: string
}

// Compresión WebP en el cliente al 90%
async function compressImageToWebP(file: File, quality = 0.90): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Ajustar resolución máxima si es excesivamente grande
      let width = img.width
      let height = img.height
      const maxDim = 1920
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context not available'))

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, originalSize, compressedSize: blob.size })
          } else {
            reject(new Error('Fallo al comprimir a WebP'))
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => reject(new Error('Error al cargar la imagen'))
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

// Extractor de embed URL para YouTube y Vimeo
function resolveVideoEmbed(url: string): { embedUrl: string; thumbnail?: string; provider: 'youtube' | 'vimeo' | 'other' } {
  const clean = url.trim()
  
  // YouTube matchers
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      provider: 'youtube'
    }
  }

  // Vimeo matchers
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/)
  if (vimeoMatch && vimeoMatch[3]) {
    const videoId = vimeoMatch[3]
    return {
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=0`,
      provider: 'vimeo'
    }
  }

  return { embedUrl: clean, provider: 'other' }
}

export default function AdminCarruselPage() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form State
  const [contentType, setContentType] = useState<'image' | 'video'>('image')
  const [title, setTitle] = useState('')
  const [orderIndex, setOrderIndex] = useState<number>(0)
  
  // Image State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{ original: number; compressed: number } | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)

  // Video State
  const [videoInput, setVideoInput] = useState('')

  const supabase = createClient()

  const loadCarouselItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/carousel', { cache: 'no-store' })
      const data = await res.json()
      if (data?.items) {
        setItems(data.items)
      }
    } catch (err) {
      console.error('Error al cargar items del carrusel:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCarouselItems()
  }, [])

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Manejador de selección de imagen con compresión automática
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    try {
      const { blob, originalSize, compressedSize } = await compressImageToWebP(file, 0.90)
      setCompressedBlob(blob)
      setCompressionStats({ original: originalSize, compressed: compressedSize })
      const previewUrl = URL.createObjectURL(blob)
      setImagePreview(previewUrl)
    } catch (err) {
      console.error('Error comprimiendo a WebP:', err)
      showToast('Error al comprimir imagen. Verifica el formato.', 'error')
    }
  }

  // Toggle Activar / Desactivar
  const handleToggleActive = async (item: CarouselItem) => {
    const updatedStatus = !item.is_active
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: updatedStatus } : i))

    try {
      const res = await fetch('/api/admin/carousel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_active: updatedStatus })
      })
      if (res.ok) {
        showToast(updatedStatus ? 'Slide activado en el Home' : 'Slide desactivado')
      }
    } catch {
      showToast('Error al actualizar estado del slide', 'error')
    }
  }

  // Reordenar ascendente / descendente
  const handleMoveOrder = async (item: CarouselItem, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(i => i.id === item.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const targetItem = items[targetIndex]
    const newItems = [...items]
    newItems[currentIndex] = { ...targetItem, order_index: item.order_index }
    newItems[targetIndex] = { ...item, order_index: targetItem.order_index }
    newItems.sort((a, b) => a.order_index - b.order_index)
    setItems(newItems)

    try {
      await Promise.all([
        fetch('/api/admin/carousel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, order_index: targetItem.order_index })
        }),
        fetch('/api/admin/carousel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetItem.id, order_index: item.order_index })
        })
      ])
      showToast('Orden del carrusel actualizado')
    } catch {
      showToast('Error al actualizar el orden', 'error')
    }
  }

  // Eliminar slide
  const handleDeleteItem = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este slide del carrusel?')) return

    setItems(prev => prev.filter(i => i.id !== id))
    try {
      const res = await fetch(`/api/admin/carousel?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        showToast('Slide eliminado correctamente')
      }
    } catch {
      showToast('Error al eliminar slide', 'error')
    }
  }

  // Submit Modal
  const handleSubmitSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Por favor ingresa un título descriptivo.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      let finalMediaUrl = ''

      if (contentType === 'image') {
        if (!compressedBlob) {
          showToast('Por favor selecciona una imagen para el slide.', 'error')
          setIsSubmitting(false)
          return
        }

        // Subir a Supabase Storage bucket 'carousel-media'
        const fileName = `slide-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`
        const { error: uploadError } = await supabase.storage
          .from('carousel-media')
          .upload(fileName, compressedBlob, {
            contentType: 'image/webp',
            upsert: true
          })

        if (uploadError) {
          console.error('Error al subir imagen a Supabase Storage:', uploadError)
          showToast(`Error al subir imagen: ${uploadError.message || 'Fallo de red'}`, 'error')
          setIsSubmitting(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('carousel-media')
          .getPublicUrl(fileName)
        finalMediaUrl = publicUrl
      } else {
        // Video de YouTube / Vimeo
        if (!videoInput.trim()) {
          showToast('Ingresa la URL o ID del video de YouTube o Vimeo.', 'error')
          setIsSubmitting(false)
          return
        }
        const { embedUrl } = resolveVideoEmbed(videoInput)
        finalMediaUrl = embedUrl
      }

      // Enviar al endpoint oficial de administración
      const res = await fetch('/api/admin/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          media_url: finalMediaUrl,
          title: title.trim(),
          order_index: Number(orderIndex) || items.length,
          is_active: true
        })
      })

      if (res.ok) {
        showToast('¡Slide multimedia agregado con éxito!')
        setIsModalOpen(false)
        setTitle('')
        setSelectedFile(null)
        setImagePreview(null)
        setCompressedBlob(null)
        setCompressionStats(null)
        setVideoInput('')
        loadCarouselItems()
      } else {
        showToast('Error al registrar el slide en el servidor', 'error')
      }
    } catch (err: any) {
      console.error('Error guardando slide:', err)
      showToast(err.message || 'Error al guardar slide', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeCount = items.filter(i => i.is_active).length
  const imageCount = items.filter(i => i.type === 'image').length
  const videoCount = items.filter(i => i.type === 'video').length

  return (
    <DashboardLayout title="Multimedia Carrusel" currentRole="admin">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* 1. HEADER ESTANDARIZADO DE CARRUSEL                       */}
        {/* ========================================================= */}
        <header className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/dashboard/admin" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-900">Multimedia Carrusel</span>
            </nav>
            <div className="flex items-center gap-2.5 pt-0.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Gestor de Multimedia Carrusel
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black uppercase tracking-wider">
                Home 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Administra las imágenes WebP optimizadas y videos de YouTube/Vimeo que se proyectan en el home.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setOrderIndex(items.length)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Agregar Slide Multimedia</span>
          </button>
        </header>

        {/* ========================================================= */}
        {/* 2. 4 CARDS DE MÉTRICAS (DISEÑO BLANCO HOMOGÉNEO)          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Slides</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Tv className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{items.length}</div>
            <span className="text-xs text-slate-500 mt-1 font-medium">En rotación</span>
          </div>

          <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Activos en Vivo</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-2">{activeCount}</div>
            <span className="text-xs text-slate-500 mt-1 font-medium">Proyectados en Home</span>
          </div>

          <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Imágenes WebP</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-600 mt-2">{imageCount}</div>
            <span className="text-xs text-slate-500 mt-1 font-medium">Comprimidas al 90%</span>
          </div>

          <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Videos Embed</span>
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-600 mt-2">{videoCount}</div>
            <span className="text-xs text-slate-500 mt-1 font-medium">YouTube / Vimeo</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LISTADO DE SLIDES CON VISTA PREVIA Y CONTROLES            */}
        {/* ========================================================= */}
        {loading ? (
          <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#002B49]" />
            <p className="text-xs font-bold text-slate-500">Cargando slides del carrusel...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <Tv className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-base font-bold text-slate-800">No hay slides registrados</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Presiona el botón "Agregar Slide Multimedia" para publicar tu primera imagen optimizada o video.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {items.map((slide, index) => {
                const videoData = slide.type === 'video' ? resolveVideoEmbed(slide.media_url) : null
                return (
                  <div
                    key={slide.id}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                      slide.is_active ? 'bg-white hover:bg-slate-50/70' : 'bg-slate-50/60 opacity-60'
                    }`}
                  >
                    {/* Izquierda: Preview + Info */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      {/* Posición en el orden */}
                      <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-black shrink-0">
                        #{index + 1}
                      </span>

                      {/* Miniatura del contenido */}
                      <div className="relative w-24 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                        {slide.type === 'video' ? (
                          videoData?.thumbnail ? (
                            <img src={videoData.thumbnail} alt={slide.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-400">
                              <Film className="w-6 h-6" />
                            </div>
                          )
                        ) : (
                          <img
                            src={slide.media_url}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/campus/ade-banner-oficial.png'
                            }}
                          />
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-black uppercase px-1 rounded">
                          {slide.type}
                        </span>
                      </div>

                      {/* Título y metadatos */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slide.type === 'video' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {slide.type === 'video' ? 'Video Player' : 'WebP Imagen'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slide.is_active 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {slide.is_active ? 'Activo' : 'Pausado'}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {slide.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                          {slide.media_url}
                        </p>
                      </div>
                    </div>

                    {/* Derecha: Botones de orden y acciones */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Subir orden */}
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(slide, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Subir posición"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Bajar orden */}
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(slide, 'down')}
                        disabled={index === items.length - 1}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Bajar posición"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Toggle Activar/Pausar */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          slide.is_active 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={slide.is_active ? 'Desactivar del home' : 'Activar en el home'}
                      >
                        {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(slide.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Eliminar slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL PARA AGREGAR CONTENIDO (IMAGEN O VIDEO)             */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
              <div className="absolute inset-0 cursor-pointer" onClick={() => !isSubmitting && setIsModalOpen(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden"
              >
                {/* Header del Modal */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Agregar Slide Multimedia</h3>
                      <p className="text-[11px] text-slate-500">Publica en el carrusel interactivo del Home</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitSlide} className="space-y-4 text-left">
                  {/* Selector de Tipo: Imagen vs Video */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Tipo de Contenido Multimedia
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setContentType('image')}
                        className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          contentType === 'image'
                            ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Imagen (WebP 90%)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContentType('video')}
                        className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          contentType === 'video'
                            ? 'bg-[#002B49] text-white border-[#002B49] shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <VideoIcon className="w-4 h-4" />
                        <span>Video (YouTube/Vimeo)</span>
                      </button>
                    </div>
                  </div>

                  {/* Campo Título */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      Título o Pie de Foto del Slide *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Sede Oficial Turbo • Laboratorio VR de Inmersión"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  {/* Sección condicional: Imagen con Compresión WebP */}
                  {contentType === 'image' ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Fotografía (Compresión automática WebP 90%)
                      </label>
                      <label className="border-2 border-dashed border-slate-300 hover:border-[#002B49] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                        <UploadCloud className="w-7 h-7 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {selectedFile ? selectedFile.name : 'Haz clic para seleccionar imagen (PNG, JPG, WebP)'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Se optimizará a WebP al 90% antes de subir a Supabase Storage
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Estadísticas de compresión */}
                      {compressionStats && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Optimizado a WebP</span>
                          </div>
                          <span>
                            {(compressionStats.original / 1024).toFixed(0)} KB → {(compressionStats.compressed / 1024).toFixed(0)} KB ({Math.round((1 - compressionStats.compressed / compressionStats.original) * 100)}% ahorro)
                          </span>
                        </div>
                      )}

                      {/* Previsualización de la imagen */}
                      {imagePreview && (
                        <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Sección condicional: Video YouTube / Vimeo */
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        URL o ID de Video (YouTube o Vimeo)
                      </label>
                      <input
                        type="text"
                        required
                        value={videoInput}
                        onChange={(e) => setVideoInput(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                      />
                      <p className="text-[10px] text-slate-400 leading-tight">
                        El video se reproduce mediante un embed ligero y responsivo sin saturar almacenamiento en la base de datos.
                      </p>

                      {/* Previsualización del video si la URL es válida */}
                      {videoInput.trim() && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-950">
                          <iframe
                            src={resolveVideoEmbed(videoInput).embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            title="Video Preview"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botón de Confirmación */}
                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#002B49] via-[#003B64] to-[#0A192F] text-amber-300 font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Guardar Slide</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Notificación Toast flotante */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border flex items-center gap-2 ${
                toastMessage.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}
