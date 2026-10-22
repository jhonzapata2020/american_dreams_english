'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  STORE_PRODUCTS, 
  STORE_SEGMENTS, 
  StoreProduct, 
  StoreSegmentId,
  resolveProductThumbnail,
  resolveProductImages
} from '../../data/storeData'
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Download, 
  Truck, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  MessageCircle, 
  Loader2,
  Eye,
  Star,
  Check,
  Zap
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { trackEvent } from '../../lib/analytics'
import { getWhatsAppUrl } from '../../config/contact'
import { ProductDetailModal } from '../../components/store/ProductDetailModal'
import { storeAudio } from '../../utils/storeAudio'

interface CartItem {
  product: StoreProduct
  quantity: number
  selectedSize?: string
}

export default function TiendaPage() {
  const [activeSegment, setActiveSegment] = useState<StoreSegmentId>('todos')
  const [products, setProducts] = useState<StoreProduct[]>(STORE_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  
  // Product Detail Modal state
  const [selectedModalProduct, setSelectedModalProduct] = useState<StoreProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Checkout data
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M')
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [transactionRef, setTransactionRef] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const hasPhysicalItems = cart.some(c => c.product.type === 'fisico')
  const hasApparelItems = cart.some(c => 
    c.product.category === 'uniformes' || 
    c.product.category === 'merch' || 
    c.product.title.toLowerCase().includes('camiseta') || 
    c.product.title.toLowerCase().includes('hoodie') ||
    c.product.title.toLowerCase().includes('polo')
  )

  // Cargar usuario autenticado y productos de Supabase
  useEffect(() => {
    async function loadUserAndProducts() {
      try {
        const supabase = createClient()
        
        // 1. Cargar usuario
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profile) {
            setFullName(profile.full_name || profile.name || '')
            setEmail(profile.email || session.user.email || '')
            setPhone(profile.phone || '')
            if (profile.origin_location || profile.municipality) {
              setShippingCity(profile.origin_location || profile.municipality || '')
            }
          }
        }

        // 2. Cargar productos activos desde Supabase
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })

        if (!error && dbProducts && dbProducts.length > 0) {
          const mapped: StoreProduct[] = dbProducts.map((p: any) => ({
            id: p.id,
            title: p.title || p.name,
            type: p.category === 'presencial' || p.category === 'uniformes' || p.category === 'libros' || p.category === 'merch' ? 'fisico' : 'digital',
            category: p.category || (p.title?.toLowerCase().includes('ebook') ? 'ebooks' : 'uniformes'),
            formatBadge: p.format_badge || (p.category === 'uniformes' ? 'FÍSICO (ENVÍO NACIONAL)' : 'Digital (Descarga directa)'),
            copPrice: p.price_cop || 0,
            usdPrice: p.price_usd || Math.round((p.price_cop || 0) / 4000),
            description: p.description || '',
            thumbnail: resolveProductThumbnail(p),
            images: resolveProductImages(p),
            fileType: p.file_type || (p.category === 'uniformes' || p.category === 'libros' ? 'Físico' : 'PDF'),
            popular: !!p.popular
          }))

          const existingIds = new Set(mapped.map(m => m.id))
          const merged = [...mapped, ...STORE_PRODUCTS.filter(sp => !existingIds.has(sp.id))]
          setProducts(merged)
        }
      } catch (err) {
        console.warn('Fallback silencioso catálogo:', err)
      }
    }
    loadUserAndProducts()
  }, [])

  const filteredProducts = activeSegment === 'todos'
    ? products
    : products.filter(p => p.type === activeSegment)

  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Manejo del Carrito con sonido y animación háptica
  const triggerCartBounce = () => {
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 500)
  }

  const addToCart = (product: StoreProduct, qty: number = 1, size?: string) => {
    storeAudio.playAddToCart()
    triggerCartBounce()

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty, selectedSize: size || item.selectedSize }
            : item
        )
      }
      return [...prev, { product, quantity: qty, selectedSize: size }]
    })
  }

  const handleOpenProductModal = (product: StoreProduct) => {
    setSelectedModalProduct(product)
    setIsModalOpen(true)
  }

  const handleBuyNowFromModal = (product: StoreProduct, qty: number = 1, size?: string) => {
    addToCart(product, qty, size)
    setIsModalOpen(false)
    setIsDrawerOpen(true)
    storeAudio.playDrawerOpen()
  }

  const updateQuantity = (productId: string, delta: number) => {
    storeAudio.playPop()
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const removeFromCart = (productId: string) => {
    storeAudio.playPop()
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmountCop = cart.reduce((sum, item) => sum + item.product.copPrice * item.quantity, 0)

  // Iniciar Pago con Wompi
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Por favor completa tu nombre, correo y WhatsApp.')
      return
    }

    if (hasPhysicalItems && (!shippingAddress.trim() || !shippingCity.trim())) {
      setErrorMessage('Por favor ingresa la dirección de entrega y ciudad para el despacho físico.')
      return
    }

    setIsProcessing(true)

    try {
      const sigResponse = await fetch('/api/wompi/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmountCop,
          email: email.trim(),
          documentNumber: '1000000000',
          currency: 'COP',
          programTitle: `Tienda ADE: ${cart.map(c => c.product.title).join(', ')}`
        })
      })

      const sigJson = await sigResponse.json()
      const ref = sigJson?.reference || `ADE-SHOP-${Date.now()}`
      setTransactionRef(ref)

      const wompiPublicKey = (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || sigJson?.publicKey || '').trim()

      trackEvent('begin_checkout', {
        type: 'store_product',
        amount: totalAmountCop,
        currency: 'COP',
        reference: ref,
        items: cart.map(c => ({ id: c.product.id, name: c.product.title, price: c.product.copPrice, quantity: c.quantity })),
        shipping: hasPhysicalItems ? { address: shippingAddress, city: shippingCity, size: hasApparelItems ? selectedSize : null } : null
      })

      if (typeof window !== 'undefined' && (window as any).WidgetCheckout && wompiPublicKey) {
        const checkout = new (window as any).WidgetCheckout({
          currency: 'COP',
          amountInCents: totalAmountCop * 100,
          reference: ref,
          publicKey: wompiPublicKey,
          redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
          customerData: {
            email: email.trim(),
            fullName: fullName.trim(),
            phoneNumber: phone.trim(),
            phoneNumberPrefix: '+57',
            legalId: '1000000000',
            legalIdType: 'CC'
          }
        })

        checkout.open((result: any) => {
          setIsProcessing(false)
          const transaction = result.transaction
          if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'PENDING')) {
            storeAudio.playSuccess()
            setPurchaseSuccess(true)
          }
        })
      } else {
        // Fallback WhatsApp directo si Wompi no está cargado
        trackEvent('whatsapp_click', {
          source: 'tienda_checkout_fallback',
          amount: totalAmountCop,
          itemsCount: totalItemsCount
        })
        const physicalDetails = hasPhysicalItems
          ? `\n📍 Dirección de Envío: ${shippingAddress}, ${shippingCity}${hasApparelItems ? `\n👕 Talla: ${selectedSize}` : ''}`
          : ''
        const message = `¡Hola Anthony / ADE! Acabo de gestionar mi pedido en la tienda:\n${cart.map(c => `• ${c.product.title} (x${c.quantity}) - ${formatCop(c.product.copPrice * c.quantity)}`).join('\n')}\nTotal: ${formatCop(totalAmountCop)}\nCliente: ${fullName}\nCorreo: ${email}\nTeléfono: ${phone}${physicalDetails}\nReferencia: ${ref}`
        window.open(getWhatsAppUrl(message), '_blank')
        setIsProcessing(false)
        storeAudio.playSuccess()
        setPurchaseSuccess(true)
      }
    } catch (err: any) {
      console.error('Error al procesar compra:', err)
      setIsProcessing(false)
      setErrorMessage(err.message || 'Error al conectar con la pasarela de pago.')
    }
  }

  const handleNotifyAnthonyWhatsApp = () => {
    const physicalDetails = hasPhysicalItems
      ? `\n📍 Dirección de Despacho: ${shippingAddress}, ${shippingCity}${hasApparelItems ? `\n👕 Talla seleccionada: ${selectedSize}` : ''}`
      : ''
    const message = `¡Hola Anthony! Acabo de realizar el pago de mi compra en la tienda ADE:\n\n• Referencia: ${transactionRef}\n• Total Pagado: ${formatCop(totalAmountCop)} COP\n• Cliente: ${fullName}\n• Correo: ${email}\n• WhatsApp: ${phone}${physicalDetails}\n\nPor favor confírmame el despacho y radicación de mi pedido.`
    window.open(getWhatsAppUrl(message), '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans pb-32 md:pb-20 text-slate-900">
      
      {/* Script oficial de Wompi */}
      <Script 
        src="https://checkout.wompi.co/widget.js" 
        strategy="lazyOnload" 
      />

      {/* ========================================================================= */}
      {/* 1. TOP LUXURY APP BAR & SEGMENTADOR SUPERIOR TÁCTIL                       */}
      {/* ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          
          {/* Fila superior: Volver al inicio, Logo Central y Carrito de Lujo */}
          <div className="flex items-center justify-between">
            
            {/* Botón Volver al inicio */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-slate-950 rounded-2xl text-xs font-black tracking-wide active:scale-95 transition-all select-none border border-slate-200/60 shadow-2xs group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Inicio</span>
            </Link>

            {/* Logo Central de American Dream */}
            <Link href="/" className="inline-flex items-center group">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-11 sm:h-13 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
            </Link>

            {/* BOTÓN DEL CARRITO REDISEÑADO CON ACABADO GLASS LUXURY & BADGE RESORTADO */}
            <motion.button
              type="button"
              animate={cartBounce ? { scale: [1, 1.15, 0.95, 1.05, 1] } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              onClick={() => {
                storeAudio.playDrawerOpen()
                setIsDrawerOpen(true)
              }}
              className="relative min-h-[44px] px-3.5 sm:px-4 py-2 bg-white hover:bg-slate-50 active:scale-95 rounded-2xl transition-all flex items-center gap-2.5 select-none border border-slate-200/90 shadow-sm hover:shadow-md cursor-pointer group"
              aria-label="Abrir carrito de compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:text-blue-600 transition-colors" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[11px] font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  Carrito
                </span>
                {totalAmountCop > 0 ? (
                  <span className="text-[10px] font-extrabold text-emerald-600 font-mono mt-0.5">
                    {formatCop(totalAmountCop)}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                    Vacío
                  </span>
                )}
              </div>

              {totalItemsCount > 0 && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping sm:hidden" />
              )}
            </motion.button>

          </div>

          {/* Título de la tienda */}
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-crimson-600 block">
                American Dream English
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Tienda & Recursos Oficiales
              </h1>
            </div>
            <span className="text-xs font-semibold text-slate-500 hidden md:block">
              Despachos nacionales y descargas digitales seguras con Wompi
            </span>
          </div>

          {/* PILLS SEGMENTADORAS TÁCTILES */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth">
            {STORE_SEGMENTS.map((seg) => {
              const active = activeSegment === seg.id
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => {
                    setActiveSegment(seg.id)
                    storeAudio.playPop()
                  }}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/15'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950 border border-slate-200/70 shadow-2xs'
                  }`}
                >
                  <span>{seg.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. GRID DE PRODUCTOS ELEGANTE (CARDS AMPLIAS CON MULTI-IMAGEN & QUICK VIEW) */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-7">
        
        {/* BANNER DE CONFIANZA Y GARANTÍAS E-COMMERCE */}
        <div className="mb-7 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Acceso Inmediato</h4>
              <p className="text-[10px] text-slate-500 font-medium">Descarga directa a tu correo</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Garantía ADE Oficial</h4>
              <p className="text-[10px] text-slate-500 font-medium">Res. 2471 Sec. Educación</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Pagos Wompi 100%</h4>
              <p className="text-[10px] text-slate-500 font-medium">Bancolombia, Nequi y PSE</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <MessageCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 leading-tight">Soporte WhatsApp</h4>
              <p className="text-[10px] text-slate-500 font-medium">Atención y asesoría 24/7</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.map((prod) => {
            const inCart = cart.find(c => c.product.id === prod.id)
            const prodImages = resolveProductImages(prod)

            return (
              <motion.div
                key={prod.id}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                onClick={() => handleOpenProductModal(prod)}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)] transition-all overflow-hidden flex flex-col justify-between group cursor-pointer text-left"
              >
                <div>
                  
                  {/* Contenedor Visual de Alta Calidad con Aspect Ratio 4:3 */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={prodImages[0] || prod.thumbnail}
                      alt={prod.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Overlay sutil al hacer hover con botón "Ver Fotos y Detalles" */}
                    <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-slate-950 text-xs font-black rounded-2xl shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Fotos y Detalles</span>
                      </span>
                    </div>
                    
                    {/* Badge de formato superior izquierdo */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl backdrop-blur-md shadow-md ${
                        prod.type === 'digital'
                          ? 'bg-blue-600/95 text-white'
                          : 'bg-amber-600/95 text-white'
                      }`}>
                        {prod.type === 'digital' ? (
                          <Download className="w-3 h-3" />
                        ) : (
                          <Truck className="w-3 h-3" />
                        )}
                        <span>{prod.formatBadge}</span>
                      </span>
                    </div>

                    {/* Badge de Bestseller / Popular */}
                    {prod.popular && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-slate-950" />
                          <span>Popular</span>
                        </span>
                      </div>
                    )}

                    {/* Mini indicador de fotos disponibles */}
                    {prodImages.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                        📸 {prodImages.length} fotos
                      </div>
                    )}
                  </div>

                  {/* Cuerpo Informativo */}
                  <div className="p-5 space-y-2 text-left">
                    
                    {/* Calificación de Estrellas */}
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">4.9</span>
                    </div>

                    <h2 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {prod.title}
                    </h2>
                    
                    <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Precios y Botones de Acción */}
                <div className="p-5 pt-0 space-y-3.5">
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                        Precio Oficial
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                          {formatCop(prod.copPrice)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          (~${prod.usdPrice} USD)
                        </span>
                      </div>
                    </div>

                    {inCart && (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {inCart.quantity} en carrito
                      </span>
                    )}
                  </div>

                  {/* Botón Táctil de Compra Rápida */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(prod, 1)
                    }}
                    className="w-full min-h-[46px] bg-gradient-to-r from-red-600 to-crimson-600 hover:from-red-700 hover:to-crimson-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 uppercase tracking-wider transition-all cursor-pointer group/btn"
                  >
                    <Plus className="w-4 h-4 stroke-[3] group-hover/btn:rotate-90 transition-transform" />
                    <span>{inCart ? 'Agregar Otro (+1)' : 'Comprar / Agregar'}</span>
                  </button>
                </div>

              </motion.div>
            )
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. BARRA FIJA INFERIOR DE COMPRA (STICKY CART ACTION BAR)                 */}
      {/* ========================================================================= */}
      {totalItemsCount > 0 && (
        <aside 
          aria-label="Barra de compra activa"
          className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-slate-950/92 backdrop-blur-2xl border border-white/20 p-3 sm:p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] text-white animate-slideUp"
        >
          <div className="flex items-center justify-between gap-3">
            
            {/* Lado izquierdo: Resumen */}
            <div className="text-left pl-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block leading-none">
                {totalItemsCount} {totalItemsCount === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {formatCop(totalAmountCop)}
                </span>
                <span className="text-[11px] font-bold text-slate-400">COP</span>
              </div>
            </div>

            {/* Lado derecho: Botón Pagar */}
            <button
              type="button"
              onClick={() => {
                storeAudio.playDrawerOpen()
                setIsDrawerOpen(true)
              }}
              className="min-h-[46px] px-6 sm:px-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-red-600/40 flex items-center gap-2 uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer"
            >
              <span>PAGAR AHORA</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 4. DRAWER MODAL DE CHECKOUT ÁGIL CON WOMPI & WHATSAPP                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDrawerOpen(false)
                if (purchaseSuccess) {
                  setPurchaseSuccess(false)
                  setCart([])
                }
              }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            />

            {/* Drawer Window */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden z-10 text-slate-900"
            >
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {purchaseSuccess ? '¡Pedido Confirmado!' : `Tu Carrito (${totalItemsCount})`}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Pago seguro cifrado por Wompi Bancolombia
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false)
                    if (purchaseSuccess) {
                      setPurchaseSuccess(false)
                      setCart([])
                    }
                  }}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                
                {purchaseSuccess ? (
                  /* PANTALLA DE ÉXITO */
                  <div className="py-6 space-y-4 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-900">
                        ¡Tu compra ha sido exitosa!
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Hemos recibido tu orden y registrado los datos de entrega.
                      </p>
                      <div className="inline-block bg-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700 mt-2">
                        Ref: {transactionRef}
                      </div>
                    </div>

                    {hasPhysicalItems && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                          <Truck className="w-4 h-4 text-amber-700" />
                          <span>Despacho de Producto Físico</span>
                        </div>
                        <p className="text-xs text-amber-800">
                          <strong>Dirección:</strong> {shippingAddress}, {shippingCity}
                        </p>
                        {hasApparelItems && (
                          <p className="text-xs text-amber-800">
                            <strong>Talla solicitada:</strong> {selectedSize}
                          </p>
                        )}
                        <p className="text-[11px] text-amber-700">
                          Anthony y el equipo de ADE prepararán tu envío para despacho nacional o entrega en sede.
                        </p>
                      </div>
                    )}

                    {!hasPhysicalItems && (
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200/80 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
                          <Download className="w-4 h-4 text-blue-700" />
                          <span>Recursos Digitales Listos</span>
                        </div>
                        <p className="text-xs text-blue-800">
                          Tus E-Books y audios han sido activados en tu cuenta. Puedes acceder a ellos desde tu Biblioteca Digital.
                        </p>
                        <Link
                          href="/dashboard/biblioteca"
                          className="inline-flex items-center gap-1 text-xs font-black text-blue-700 underline pt-1"
                        >
                          Ir a mi Biblioteca Digital →
                        </Link>
                      </div>
                    )}

                    {/* Botón de Notificación a Anthony por WhatsApp */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleNotifyAnthonyWhatsApp}
                        className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-3 px-4 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Notificar a Anthony por WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsDrawerOpen(false)
                          setPurchaseSuccess(false)
                          setCart([])
                        }}
                        className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Seguir Explorando la Tienda
                      </button>
                    </div>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Tu carrito está vacío.</p>
                    <p className="text-xs text-slate-400">Selecciona algún E-Book, Masterclass o producto físico para comenzar.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div 
                          key={item.product.id}
                          className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 text-left">
                            <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                              {item.product.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-slate-600">
                                {formatCop(item.product.copPrice * item.quantity)}
                              </span>
                              {item.selectedSize && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">
                                  Talla: {item.selectedSize}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Control de cantidad */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:scale-95 cursor-pointer hover:bg-slate-100"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold active:scale-95 cursor-pointer hover:bg-slate-100"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Formulario de Checkout Rápido */}
                    <form onSubmit={handleProceedToPayment} className="pt-3 border-t border-slate-100 space-y-3">
                      <span className="text-xs font-black text-slate-900 block text-left">
                        Datos de Facturación y Entrega
                      </span>

                      {errorMessage && (
                        <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl font-medium text-center">
                          {errorMessage}
                        </div>
                      )}

                      <div className="space-y-2 text-left">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nombres y Apellidos completos *"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Correo electrónico *"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="WhatsApp / Teléfono (+57 300 000 0000) *"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />

                        {/* CAMPOS ADICIONALES PARA PRODUCTOS FÍSICOS */}
                        {hasPhysicalItems && (
                          <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2.5 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                              <Truck className="w-3.5 h-3.5 text-amber-700" />
                              <span>Datos para Envío Físico (Nacional o Sede)</span>
                            </div>

                            <input
                              type="text"
                              required
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              placeholder="Dirección completa (Calle, Carrera, Barrio, Apto/Casa) *"
                              className="w-full p-2.5 bg-white border border-amber-300/80 rounded-xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />

                            <input
                              type="text"
                              required
                              value={shippingCity}
                              onChange={(e) => setShippingCity(e.target.value)}
                              placeholder="Ciudad / Municipio (ej. Apartadó, Turbo, Medellín, Bogotá) *"
                              className="w-full p-2.5 bg-white border border-amber-300/80 rounded-xl text-base md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />

                            {/* Selector de Talla para Camiseta / Hoodie */}
                            {hasApparelItems && (
                              <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-amber-900">
                                  Selecciona tu Talla de Prenda:
                                </label>
                                <div className="flex gap-2">
                                  {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                                    <button
                                      key={sz}
                                      type="button"
                                      onClick={() => setSelectedSize(sz)}
                                      className={`flex-1 py-1.5 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                                        selectedSize === sz
                                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Resumen Total */}
                      <div className="p-3.5 bg-slate-100 rounded-2xl flex items-center justify-between text-xs font-black">
                        <span>Total a Pagar:</span>
                        <span className="text-base sm:text-lg text-red-600">
                          {formatCop(totalAmountCop)} COP
                        </span>
                      </div>

                      {/* Botón de Pago con Wompi */}
                      <button
                        type="submit"
                        disabled={isProcessing || cart.length === 0}
                        className="w-full min-h-[48px] bg-gradient-to-r from-red-600 to-crimson-600 hover:from-red-700 hover:to-crimson-700 active:scale-[0.99] disabled:opacity-50 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Conectando Pasarela...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pagar con Wompi / Bancolombia / PSE</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. MODAL DE DETALLE DE PRODUCTO MULTI-IMAGEN (SHOWCASE INMERSIVO)          */}
      {/* ========================================================================= */}
      <ProductDetailModal
        product={selectedModalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(prod, qty, size) => addToCart(prod, qty, size)}
        onBuyNow={(prod, qty, size) => handleBuyNowFromModal(prod, qty, size)}
      />

    </div>
  )
}
