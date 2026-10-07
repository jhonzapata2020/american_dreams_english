'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Video, 
  Headphones, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Eye,
  Search
} from 'lucide-react'

interface DigitalAsset {
  id: string
  title: string
  category: string
  type: 'PDF' | 'Audio MP3' | 'Video Pack'
  fileSize: string
  downloadUrl: string
  thumbnail: string
  acquiredDate: string
}

export default function BibliotecaPage() {
  const [filterType, setFilterType] = useState<'all' | 'PDF' | 'Audio MP3' | 'Video Pack'>('all')

  const assets: DigitalAsset[] = [
    {
      id: 'ast-1',
      title: 'Masterclass 4K: Fonética y Pronunciación Nativa',
      category: 'Masterclass Video',
      type: 'Video Pack',
      fileSize: '1.2 GB · 4K',
      downloadUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      acquiredDate: '02 Octubre, 2026'
    },
    {
      id: 'ast-2',
      title: 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo',
      category: 'E-Book Interactivo',
      type: 'PDF',
      fileSize: '14.5 MB',
      downloadUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      acquiredDate: '15 Septiembre, 2026'
    },
    {
      id: 'ast-3',
      title: 'Pack Completo A1-A2: 50 Audios de Inmersión + Guías',
      category: 'Laboratorio de Audios',
      type: 'Audio MP3',
      fileSize: '185 MB · 50 Pistas',
      downloadUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600',
      acquiredDate: '15 Septiembre, 2026'
    },
    {
      id: 'ast-4',
      title: 'Guía Rápida de Conectores y Fluidez B1-B2',
      category: 'Guía Pedagógica',
      type: 'PDF',
      fileSize: '4.8 MB',
      downloadUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
      acquiredDate: '05 Agosto, 2026'
    }
  ]

  const filteredAssets = filterType === 'all'
    ? assets
    : assets.filter(a => a.type === filterType)

  const handleOpenAsset = (asset: DigitalAsset) => {
    alert(`Abriendo visor seguro de "${asset.title}" (${asset.type}). Acceso verificado con tu matrícula ADE.`)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-12 text-slate-900">
      
      {/* 1. TOP APP BAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-3xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Volver a My ADE</span>
            </Link>

            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
              Biblioteca Digital
            </span>
          </div>

          {/* Filtro Rápido por Tipo de Recurso */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {(['all', 'PDF', 'Audio MP3', 'Video Pack'] as const).map((type) => {
              const active = filterType === type
              const label = type === 'all' ? 'Todos los recursos' : type

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all active:scale-95 ${
                    active
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Portada Miniatura */}
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={asset.thumbnail}
                    alt={asset.title}
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Badge de tipo de archivo */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-navy-950/90 text-white backdrop-blur-md shadow-xs">
                      {asset.type === 'PDF' && <FileText className="w-3 h-3 text-red-400" />}
                      {asset.type === 'Audio MP3' && <Headphones className="w-3 h-3 text-amber-400" />}
                      {asset.type === 'Video Pack' && <Video className="w-3 h-3 text-blue-400" />}
                      <span>{asset.type}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2 right-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {asset.fileSize}
                  </div>
                </div>

                {/* Info del Recurso */}
                <div className="p-4 space-y-1 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {asset.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
                    {asset.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Adquirido el {asset.acquiredDate}
                  </p>
                </div>
              </div>

              {/* Botón Táctil Ancho de Descarga o Visualización */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenAsset(asset)}
                  className="w-full min-h-[44px] bg-navy-900 hover:bg-navy-950 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-md shadow-navy-900/20 flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver / Descargar Recurso</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Banner de Tienda para adquirir más recursos */}
        <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/70 rounded-2xl flex items-center justify-between gap-3">
          <div className="text-left space-y-0.5">
            <h4 className="text-xs font-black text-slate-900">¿Buscas más material de estudio?</h4>
            <p className="text-[11px] text-slate-600 font-medium">Explora libros oficiales, audios y masterclasses en la Tienda ADE.</p>
          </div>
          <Link
            href="/tienda"
            className="min-h-[40px] px-4 bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-black rounded-xl flex items-center gap-1 flex-shrink-0 transition-all"
          >
            <span>Ir a Tienda</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </main>

    </div>
  )
}
