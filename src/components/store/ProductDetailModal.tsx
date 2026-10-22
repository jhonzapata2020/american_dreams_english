'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Star, 
  ShieldCheck, 
  Download, 
  Truck, 
  Sparkles, 
  Lock, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  ZoomIn,
  FileText,
  CreditCard,
  Layers,
  HelpCircle
} from 'lucide-react'
import { 
  StoreProduct, 
  resolveProductImages, 
  resolveProductFeatures, 
  resolveProductSpecs 
} from '../../data/storeData'
import { storeAudio } from '../../utils/storeAudio'
import { getWhatsAppUrl } from '../../config/contact'

interface ProductDetailModalProps {
  product: StoreProduct | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: StoreProduct, quantity?: number, size?: string) => void
  onBuyNow: (product: StoreProduct, quantity?: number, size?: string) => void
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M')
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'guarantee'>('features')
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false)

  // Reset states on open/change
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0)
      setQuantity(1)
      setAddedAnimation(false)
      setActiveTab('features')
      setIsLightBoxOpen(false)
      storeAudio.playPop()
    }
  }, [isOpen, product])

  // Keyboard navigation (Esc to close, Left/Right for gallery)
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightBoxOpen) {
          setIsLightBoxOpen(false)
        } else {
          onClose()
        }
      }
      if (e.key === 'ArrowRight' && product) {
        const imgs = resolveProductImages(product)
        setActiveImageIndex((prev) => (prev + 1) % imgs.length)
        storeAudio.playPop()
      }
      if (e.key === 'ArrowLeft' && product) {
        const imgs = resolveProductImages(product)
        setActiveImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length)
        storeAudio.playPop()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLightBoxOpen, product, onClose])

  if (!product) return null

  const images = resolveProductImages(product)
  const features = resolveProductFeatures(product)
  const specs = resolveProductSpecs(product)

  const isApparel = 
    product.category === 'uniformes' || 
    product.category === 'merch' || 
    product.title.toLowerCase().includes('camiseta') || 
    product.title.toLowerCase().includes('hoodie') ||
    product.title.toLowerCase().includes('polo')

  const isDigital = product.type === 'digital'

  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index)
    storeAudio.playPop()
  }

  const handleSizeClick = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    setSelectedSize(size)
    storeAudio.playPop()
  }

  const handleAdd = () => {
    onAddToCart(product, quantity, isApparel ? selectedSize : undefined)
    storeAudio.playAddToCart()
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 2000)
  }

  const handleDirectBuy = () => {
    storeAudio.playAddToCart()
    onBuyNow(product, quantity, isApparel ? selectedSize : undefined)
  }

  const whatsAppMessage = `¡Hola American Dream English! Quisiera más información sobre "${product.title}" (${formatCop(product.copPrice)}). ¿Me pueden asesorar antes de realizar la compra?`

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (isLightBoxOpen) setIsLightBoxOpen(false)
              else onClose()
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Content Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-slate-200/90 overflow-hidden z-10 my-auto text-slate-800"
          >
            {/* Close Button Top-Right */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-slate-900 hover:text-white text-slate-700 shadow-md transition-all cursor-pointer border border-slate-200/80 backdrop-blur-md"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
              
              {/* ========================================================================= */}
              {/* LEFT COLUMN: MULTI-IMAGE GALLERY WITH ZOOM & TRUST BADGES                 */}
              {/* ========================================================================= */}
              <div className="lg:col-span-6 p-4 sm:p-6 lg:p-7 bg-slate-50/80 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80">
                <div>
                  
                  {/* Badges Bar above Image */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isDigital 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25' 
                        : 'bg-amber-600 text-white shadow-sm shadow-amber-500/25'
                    }`}>
                      {isDigital ? <Download className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      <span>{product.formatBadge}</span>
                    </span>

                    {product.popular && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-amber-400 text-slate-950 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        <span>Bestseller</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700">
                      ADE Oficial
                    </span>
                  </div>

                  {/* Main High-Res Image Display with Navigation Arrows */}
                  <div 
                    onClick={() => setIsLightBoxOpen(true)}
                    className="relative aspect-4/3 w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden group cursor-zoom-in"
                  >
                    <img
                      src={images[activeImageIndex] || product.thumbnail}
                      alt={`${product.title} vista ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Zoom Icon Hint */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      <span>Ampliar foto</span>
                    </div>

                    {/* Left / Right Carousel Controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
                            storeAudio.playPop()
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4 stroke-[3]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImageIndex((prev) => (prev + 1) % images.length)
                            storeAudio.playPop()
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-all opacity-85 hover:opacity-100 hover:scale-110 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </>
                    )}

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-950/75 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-lg">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Interactive Thumbnails Row */}
                  {images.length > 1 && (
                    <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                      {images.map((imgUrl, idx) => {
                        const isActive = idx === activeImageIndex
                        return (
                          <button
                            key={`thumb-${idx}`}
                            type="button"
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                              isActive 
                                ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105 shadow-md' 
                                : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt="miniatura"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      })}
                    </div>
                  )}

                </div>

                {/* Trust Guarantee & Payment Strip */}
                <div className="mt-5 space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        Garantía Oficial American Dream English
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Contenido verificado por docentes bilingües. Resolución 2471 Secretaría de Educación.
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods Pill Strip */}
                  <div className="p-3 rounded-2xl bg-slate-100/70 border border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pago Seguro con Wompi</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Bancolombia • Nequi • PSE • Tarjetas
                    </span>
                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* RIGHT COLUMN: SPECS TABS, SIZES, ACTIONS & COMMERCE                       */}
              {/* ========================================================================= */}
              <div className="lg:col-span-6 p-4 sm:p-6 lg:p-7 flex flex-col justify-between">
                <div>
                  
                  {/* Reviews & Star Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-800">4.9 / 5.0</span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      (128 estudiantes verificados)
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-2 leading-snug tracking-tight">
                    {product.title}
                  </h2>

                  {/* Price Banner */}
                  <div className="mt-3 flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                      {formatCop(product.copPrice)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      (~${product.usdPrice} USD)
                    </span>
                    {isDigital ? (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                        ⚡ Acceso Inmediato
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        📦 Envío a toda Colombia
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 font-normal">
                    {product.description}
                  </p>

                  {/* Size Selector (If Apparel / Uniform) */}
                  {isApparel && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Selecciona tu Talla:
                        </span>
                        <span className="text-[11px] text-blue-600 font-bold">
                          Talla estándar Colombia
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeClick(size)}
                            className={`min-w-[42px] h-10 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              selectedSize === size
                                ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/30 scale-105'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* INTERACTIVE SPECS & BENEFITS TABS                                         */}
                  {/* ========================================================================= */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('features')
                          storeAudio.playPop()
                        }}
                        className={`text-xs font-black uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
                          activeTab === 'features'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-slate-400 border-transparent hover:text-slate-700'
                        }`}
                      >
                        ¿Qué incluye?
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('specs')
                          storeAudio.playPop()
                        }}
                        className={`text-xs font-black uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
                          activeTab === 'specs'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-slate-400 border-transparent hover:text-slate-700'
                        }`}
                      >
                        Ficha Técnica
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('guarantee')
                          storeAudio.playPop()
                        }}
                        className={`text-xs font-black uppercase tracking-wider pb-1 transition-all border-b-2 cursor-pointer ${
                          activeTab === 'guarantee'
                            ? 'text-blue-600 border-blue-600'
                            : 'text-slate-400 border-transparent hover:text-slate-700'
                        }`}
                      >
                        Garantía & Pagos
                      </button>
                    </div>

                    <div className="mt-3 min-h-[140px]">
                      {/* TAB 1: FEATURES & WHAT'S INCLUDED */}
                      {activeTab === 'features' && (
                        <motion.ul 
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2 text-xs text-slate-700 font-medium"
                        >
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}

                      {/* TAB 2: TECHNICAL SPECS */}
                      {activeTab === 'specs' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"
                        >
                          {specs.map((item, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                {item.label}
                              </span>
                              <span className="font-bold text-slate-800 leading-tight block mt-0.5">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {/* TAB 3: GUARANTEE & PAYMENT METHODS */}
                      {activeTab === 'guarantee' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2.5 text-xs text-slate-600"
                        >
                          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                            <span className="font-black block text-xs mb-0.5">100% Satisfacción Garantizada</span>
                            Si tienes algún inconveniente con tu descarga o material, nuestro equipo de soporte docente te atenderá de inmediato por WhatsApp.
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-blue-600" />
                              <span>Cifrado SSL 256 bits</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                              <span>Wompi Bancolombia</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Actions: Quantity + Add to Cart + Instant Buy */}
                <div className="mt-5 pt-4 border-t border-slate-200/90 space-y-3">
                  
                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Cantidad:
                    </span>
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(Math.max(1, quantity - 1))
                          storeAudio.playPop()
                        }}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                        title="Disminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(quantity + 1)
                          storeAudio.playPop()
                        }}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                        title="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Button: Agregar al Carrito */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleAdd}
                    className={`w-full min-h-[48px] rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>¡Agregado al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar al Carrito — {formatCop(product.copPrice * quantity)}</span>
                      </>
                    )}
                  </motion.button>

                  {/* Secondary Action: Comprar Directo con Wompi */}
                  <button
                    type="button"
                    onClick={handleDirectBuy}
                    className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Comprar Ahora con Wompi</span>
                  </button>

                  {/* Ask question on WhatsApp link */}
                  <a
                    href={getWhatsAppUrl(whatsAppMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-bold transition-colors pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>¿Tienes preguntas antes de pagar? Escríbenos por WhatsApp</span>
                  </a>

                </div>

              </div>

            </div>
          </motion.div>

          {/* LIGHTBOX MODAL FOR FULL-RES IMAGE PREVIEW */}
          <AnimatePresence>
            {isLightBoxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLightBoxOpen(false)}
                className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
              >
                <button
                  type="button"
                  onClick={() => setIsLightBoxOpen(false)}
                  className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-950 transition-all cursor-pointer"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  src={images[activeImageIndex] || product.thumbnail}
                  alt={product.title}
                  className="max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  )
}
