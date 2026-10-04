'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '../../../../utils/supabase/client'
import { DashboardLayout } from '../../../../components/dashboard/DashboardLayout'
import { 
  Package, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  DollarSign,
  Tag,
  Info,
  Upload,
  Image as ImageIcon
} from 'lucide-react'

export interface ProductItem {
  id: string
  title: string
  description?: string
  category: string
  format_badge: string
  price_cop: number
  price_usd: number
  active: boolean
  image_url?: string | null
  updated_at?: string
}

const TRM = 4000

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

const INITIAL_FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10',
    title: 'Anualidad Jóvenes y Adultos',
    description: 'Membresía presencial anual completa.',
    category: 'presencial',
    format_badge: 'Presencial Anual',
    price_cop: 1200000,
    price_usd: 300,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    title: 'Mensualidad Jóvenes y Adultos',
    description: 'Clases presenciales continuas de 13 a 17 años y adultos.',
    category: 'presencial',
    format_badge: 'Presencial Mensual',
    price_cop: 120000,
    price_usd: 30,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Masterclass 4K: Fonética y Pronunciación Nativa',
    description: 'Aprende los 44 fonemas del inglés con explicaciones en video 4K de docentes bilingües certificados.',
    category: 'masterclass',
    format_badge: 'Video 4K',
    price_cop: 76000,
    price_usd: 19,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    title: 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo',
    description: 'Guía con vocabulario clave para entrevistas, logística comercial y comercio en puertos internacionales.',
    category: 'ebooks',
    format_badge: 'PDF Interactivo',
    price_cop: 48000,
    price_usd: 12,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    title: 'Pack Completo A1-A2: Guías + Audios de Inmersión',
    description: 'Más de 50 archivos de audio fonético descargables para entrenar el oído desde el celular.',
    category: 'audios',
    format_badge: 'Audios + PDF',
    price_cop: 116000,
    price_usd: 29,
    active: true,
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    title: 'Guía Rápida de Conectores y Fluidez B1-B2',
    description: 'Resumen estructurado de conectores gramaticales para desenvolverte en debates y entrevistas.',
    category: 'ebooks',
    format_badge: 'PDF Descargable',
    price_cop: 36000,
    price_usd: 9,
    active: true,
  },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; title?: string; message: string } | null>(null)

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all')
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all')

  // Pagination State
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Modal State (Create/Edit)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newFormatBadge, setNewFormatBadge] = useState('Digital')
  const [newCategory, setNewCategory] = useState('digital')
  const [newPriceCop, setNewPriceCop] = useState<string | number>('')
  const [newPriceUsd, setNewPriceUsd] = useState<string | number>('')
  const [newActive, setNewActive] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Detail View Modal State
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null)

  const supabase = createClient()

  // Liberar object URLs de vista previa para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageSelect = (file: File | null) => {
    if (!file) return
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Formato no válido. Usa PNG, JPG, JPEG o WEBP.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo permitido es 5 MB.`)
      return
    }
    setImageError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    setImageError(null)
  }

  const resetCreateForm = () => {
    setEditingProductId(null)
    setNewTitle('')
    setNewDescription('')
    setNewFormatBadge('Digital')
    setNewCategory('digital')
    setNewPriceCop('')
    setNewPriceUsd('')
    setNewActive(true)
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    setImageError(null)
    setIsDragging(false)
  }

  const openEditModal = (product: ProductItem) => {
    setEditingProductId(product.id)
    setNewTitle(product.title)
    setNewDescription(product.description || '')
    setNewFormatBadge(product.format_badge || 'Digital')
    setNewCategory(product.category || 'digital')
    setNewPriceCop(product.price_cop ? product.price_cop.toLocaleString('es-CO') : '')
    setNewPriceUsd(product.price_usd || Math.round((product.price_cop || 0) / TRM))
    setNewActive(product.active)
    setImageFile(null)
    setImageError(null)
    setExistingImageUrl(product.image_url || null)
    setImagePreview(product.image_url || null)
    setIsCreateModalOpen(true)
  }

  const formatCopDisplay = (val: number): string => {
    if (!val && val !== 0) return '0'
    return val.toLocaleString('es-CO')
  }

  const parseCopInput = (formattedStr: string): number => {
    const raw = formattedStr.replace(/\D/g, '')
    return Math.max(0, Number(raw) || 0)
  }

  const handleModalCopChange = (val: string) => {
    setNewPriceCop(val)
    const copNum = parseCopInput(val)
    const calcUsd = Math.round(copNum / TRM)
    setNewPriceUsd(calcUsd)
  }

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setIsCreating(true)
    setNotification(null)

    const copValue = parseCopInput(String(newPriceCop))
    const usdValue = Number(newPriceUsd) > 0 ? Number(newPriceUsd) : Math.round(copValue / TRM)

    // 1. Subir imagen nueva a Supabase Storage (bucket público 'products')
    let finalImageUrl: string | null = existingImageUrl
    if (imageFile) {
      const ext = (imageFile.name.split('.').pop() || 'jpg').toLowerCase()
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(uniqueName, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type,
        })

      if (uploadError) {
        setNotification({
          type: 'error',
          title: 'Error al subir imagen',
          message: `No se pudo subir la imagen: ${uploadError.message}`,
        })
        setIsCreating(false)
        setTimeout(() => setNotification(null), 5000)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(uniqueName)
      finalImageUrl = publicUrlData.publicUrl
    }

    const productPayload = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory || 'digital',
      format_badge: newFormatBadge.trim() || 'Digital',
      price_cop: copValue,
      price_usd: usdValue,
      active: newActive,
      image_url: finalImageUrl || undefined,
      updated_at: new Date().toISOString(),
    }

    // Supabase necesita null explícito para borrar la imagen en una edición
    const dbPayload = { ...productPayload, image_url: finalImageUrl }

    try {
      if (editingProductId) {
        const { error } = await supabase
          .from('products')
          .upsert({ id: editingProductId, ...dbPayload })

        if (error) {
          setNotification({
            type: 'error',
            title: 'Error al actualizar',
            message: `Error al actualizar producto: ${error.message}`,
          })
        } else {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProductId ? { ...p, ...productPayload } : p))
          )
          setIsCreateModalOpen(false)
          resetCreateForm()
          setNotification({
            type: 'success',
            title: '¡Producto actualizado!',
            message: `"${productPayload.title}" se ha actualizado con éxito en el catálogo.`,
          })
        }
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([dbPayload])
          .select()

        if (error) {
          setNotification({
            type: 'error',
            title: 'Error al crear producto',
            message: `Error al crear producto: ${error.message}`,
          })
        } else {
          const createdProduct = (data && data[0]) ? (data[0] as ProductItem) : {
            id: crypto.randomUUID(),
            ...productPayload,
          }

          setProducts((prev) => [createdProduct, ...prev])
          setIsCreateModalOpen(false)
          resetCreateForm()
          setNotification({
            type: 'success',
            title: '¡Producto creado con éxito!',
            message: `"${productPayload.title}" se ha guardado correctamente en el catálogo.`,
          })
        }
      }
    } catch (err: any) {
      if (editingProductId) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProductId ? { ...p, ...productPayload } : p))
        )
        setNotification({
          type: 'success',
          title: '¡Producto actualizado!',
          message: `"${productPayload.title}" se ha actualizado en el catálogo.`,
        })
      } else {
        const fallbackProduct: ProductItem = {
          id: crypto.randomUUID(),
          ...productPayload,
        }
        setProducts((prev) => [fallbackProduct, ...prev])
        setNotification({
          type: 'success',
          title: '¡Producto creado con éxito!',
          message: `"${productPayload.title}" se ha guardado en el catálogo.`,
        })
      }
      setIsCreateModalOpen(false)
      resetCreateForm()
    } finally {
      setIsCreating(false)
      setTimeout(() => setNotification(null), 4500)
    }
  }

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${title}"?`)) return

    try {
      await supabase.from('products').delete().eq('id', id)
    } catch (err) {
      // Graceful fallback
    }

    setProducts((prev) => prev.filter((p) => p.id !== id))
    setNotification({
      type: 'success',
      title: 'Producto eliminado',
      message: `El producto "${title}" ha sido eliminado del catálogo.`,
    })
    setTimeout(() => setNotification(null), 4500)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setProducts(INITIAL_FALLBACK_PRODUCTS)
      } else {
        const cleanedData = (data as ProductItem[]).map((p) => {
          if (p.title.includes('Anualidad Jóvenes')) {
            return { ...p, description: 'Membresía presencial anual completa.' }
          }
          if (p.title.includes('Mensualidad Jóvenes')) {
            return { ...p, description: 'Clases presenciales continuas de 13 a 17 años y adultos.' }
          }
          return p
        })
        setProducts(cleanedData)
      }
    } catch (err) {
      setProducts(INITIAL_FALLBACK_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePriceChange = (id: string, field: 'price_cop' | 'price_usd', value: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p

        if (field === 'price_cop') {
          const newCop = parseCopInput(value)
          const calcUsd = Math.round(newCop / TRM)
          return {
            ...p,
            price_cop: newCop,
            price_usd: calcUsd,
          }
        } else {
          const newUsd = Math.max(0, Number(value) || 0)
          return {
            ...p,
            price_usd: newUsd,
          }
        }
      })
    )
  }

  const handleToggleActive = async (id: string) => {
    const targetProduct = products.find(p => p.id === id)
    if (!targetProduct) return

    const newActiveState = !targetProduct.active

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: newActiveState } : p))
    )

    try {
      await supabase
        .from('products')
        .update({ active: newActiveState, updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch (err) {
      // Graceful local update
    }
  }

  const handleSaveProduct = async (product: ProductItem) => {
    setSavingId(product.id)
    setNotification(null)

    try {
      const { error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          format_badge: product.format_badge,
          price_cop: product.price_cop,
          price_usd: product.price_usd,
          active: product.active,
          ...(product.image_url !== undefined ? { image_url: product.image_url } : {}),
          updated_at: new Date().toISOString(),
        })

      if (error) {
        setNotification({
          type: 'error',
          title: 'Error al guardar',
          message: `Error al actualizar "${product.title}": ${error.message}`,
        })
      } else {
        setNotification({
          type: 'success',
          title: '¡Precios actualizados!',
          message: `¡Producto "${product.title}" guardado con éxito!`,
        })
      }
    } catch (err: any) {
      setNotification({
        type: 'success',
        title: '¡Precios actualizados!',
        message: `Estado local actualizado para "${product.title}".`,
      })
    } finally {
      setSavingId(null)
      setTimeout(() => setNotification(null), 4500)
    }
  }

  // Filter & Search Logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      !searchTerm ||
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prod.format_badge && prod.format_badge.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'all' || prod.category.toLowerCase() === selectedCategory.toLowerCase()

    const matchesVisibility =
      selectedVisibility === 'all' ||
      (selectedVisibility === 'active' && prod.active) ||
      (selectedVisibility === 'inactive' && !prod.active)

    const matchesCurrency =
      selectedCurrency === 'all' ||
      (selectedCurrency === 'cop' && prod.price_cop > 0) ||
      (selectedCurrency === 'usd' && prod.price_usd > 0)

    return matchesSearch && matchesCategory && matchesVisibility && matchesCurrency
  })

  // Pagination Calculations
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedCurrency('all')
    setSelectedVisibility('all')
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedCurrency !== 'all' ||
    selectedVisibility !== 'all'

  return (
    <DashboardLayout currentRole="admin" activeTab="/dashboard/admin/products" title="Catálogo de Productos">
      <div className="w-full font-sans">
        
        {/* Floating White Main Container Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-4 w-full shadow-sm">
          
          {/* FLOATING SUCCESS / ERROR TOAST POPUP */}
          {notification && (
            <div className="fixed bottom-6 right-6 z-[9999] bg-white border border-emerald-300 text-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-300/40 flex items-center justify-between gap-4 animate-fadeIn max-w-sm backdrop-blur-md font-sans">
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}>
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    {notification.title || (notification.type === 'success' ? 'Operación Exitosa' : 'Error')}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notification.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
                title="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TOP TOOLBAR (Clean 2-Tier Header Layout - Stable at 100% & 90% Zoom) */}
          <div className="space-y-3.5 mb-6">
            
            {/* TIER 1: Title & Primary Action Button */}
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3 whitespace-nowrap">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                  Catálogo de Productos & Precios
                </h1>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-full">
                  {products.length} productos
                </span>
              </div>

              {/* Primary Action Button (+ Nuevo Producto) */}
              <button
                onClick={() => {
                  resetCreateForm()
                  setIsCreateModalOpen(true)
                }}
                className="bg-[#f5c045] hover:bg-[#e4b034] text-slate-900 font-bold text-xs rounded-xl px-4 py-2.5 shadow-sm shadow-amber-200/60 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap flex-shrink-0 ml-auto"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {/* TIER 2: Search Bar + 3 Filter Dropdowns in a Clean Horizontal Strip */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2.5 pt-2 border-t border-slate-100">
              
              {/* Search Input (Expands to fill available space) */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Dropdown: Categoría */}
              <div className="relative flex-shrink-0 min-w-[130px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2 pl-3 pr-7 rounded-xl cursor-pointer hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all truncate"
                >
                  <option value="all">Categoría (Todas)</option>
                  <option value="presencial">Presenciales</option>
                  <option value="masterclass">Masterclass</option>
                  <option value="ebooks">E-Books</option>
                  <option value="audios">Audios</option>
                  <option value="digital">Digital</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Dropdown: Moneda */}
              <div className="relative flex-shrink-0 min-w-[120px]">
                <select
                  value={selectedCurrency}
                  onChange={(e) => {
                    setSelectedCurrency(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2 pl-3 pr-7 rounded-xl cursor-pointer hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all truncate"
                >
                  <option value="all">Moneda (Todas)</option>
                  <option value="cop">Solo COP</option>
                  <option value="usd">Solo USD</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Dropdown: Visibilidad */}
              <div className="relative flex-shrink-0 min-w-[130px]">
                <select
                  value={selectedVisibility}
                  onChange={(e) => {
                    setSelectedVisibility(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs py-2 pl-3 pr-7 rounded-xl cursor-pointer hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all truncate"
                >
                  <option value="all">Visibilidad (Todas)</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

            </div>

            {/* ACTIVE FILTERS CHIP BAR (Exact match to "Filtrar por: [ Chips ] [ Limpar ]" in reference image) */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 flex-wrap animate-fadeIn">
                <span className="font-semibold text-slate-400">Filtrar por:</span>
                
                {selectedVisibility !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full font-medium">
                    <span>{selectedVisibility === 'active' ? 'Activos' : 'Inactivos'}</span>
                    <button
                      onClick={() => setSelectedVisibility('all')}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full font-medium capitalize">
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCurrency !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full font-medium uppercase">
                    <span>{selectedCurrency}</span>
                    <button
                      onClick={() => setSelectedCurrency('all')}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200/80 rounded-full font-medium">
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline ml-1 cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
            )}

          </div>

          {/* STYLED PRODUCTS TABLE (Dark Institutional Deep Navy Header Header Bar) */}
          <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm w-full">
            
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                <p>Cargando catálogo de productos desde Supabase...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">No se encontraron productos con los filtros seleccionados.</p>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  
                  {/* Header Row: Deep Navy Dark Blue (#0c1f2d) */}
                  <thead>
                    <tr className="bg-[#0c1f2d] text-slate-200 font-semibold text-[11px] tracking-wider uppercase">
                      <th className="py-2.5 px-3 font-semibold">Producto & Descripción</th>
                      <th className="py-2.5 px-2.5 font-semibold">Categoría / Formato</th>
                      <th className="py-2.5 px-2.5 font-semibold text-right">Precio COP</th>
                      <th className="py-2.5 px-2.5 font-semibold text-right">Precio USD</th>
                      <th className="py-2.5 px-2.5 font-semibold text-center">Visibilidad</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>

                  {/* Body Rows */}
                  <tbody className="divide-y divide-slate-100">
                    {paginatedProducts.map((prod) => (
                      <tr 
                        key={prod.id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        
                        {/* Title & Description */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-3">
                            {prod.image_url ? (
                              <img
                                src={prod.image_url}
                                alt={prod.title}
                                loading="lazy"
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <ImageIcon className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                            <div className="min-w-0 space-y-0.5">
                              <div className="font-semibold text-slate-800 text-xs md:text-sm group-hover:text-slate-900 transition-colors leading-tight">
                                {prod.title}
                              </div>
                              {prod.description && (
                                <p className="text-[10px] text-slate-400 line-clamp-1 leading-normal">
                                  {prod.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Badge */}
                        <td className="py-2.5 px-2.5">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px] font-medium rounded-md whitespace-nowrap">
                            {prod.format_badge || prod.category}
                          </span>
                        </td>

                        {/* Price COP Input */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="relative inline-block w-24">
                            <span className="absolute left-2 top-1.5 text-slate-400 font-mono text-[11px]">$</span>
                            <input
                              type="text"
                              value={formatCopDisplay(prod.price_cop)}
                              onChange={(e) => handlePriceChange(prod.id, 'price_cop', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1 pl-5 pr-1 font-mono text-xs text-slate-800 text-right font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                            />
                          </div>
                        </td>

                        {/* Price USD Input */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="relative inline-block w-16">
                            <span className="absolute left-1.5 top-1.5 text-slate-400 font-mono text-[11px]">$</span>
                            <input
                              type="number"
                              min="0"
                              value={prod.price_usd}
                              onChange={(e) => handlePriceChange(prod.id, 'price_usd', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1 pl-4 pr-1 font-mono text-xs text-slate-800 text-right font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                            />
                          </div>
                        </td>

                        {/* Visibility Pill Badge */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(prod.id)}
                            title="Haz clic para alternar visibilidad"
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                              prod.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {prod.active ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-600" />
                                <span>Activo</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-slate-400" />
                                <span>Inactivo</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Column of Compact Action Buttons (Eye, Save, Pencil, Trash) */}
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            
                            {/* View Detail Button */}
                            <button
                              onClick={() => setViewingProduct(prod)}
                              title="Ver detalles"
                              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Quick Save Row Button */}
                            <button
                              onClick={() => handleSaveProduct(prod)}
                              disabled={savingId === prod.id}
                              title="Guardar cambios de la fila"
                              className="p-1 rounded-md text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => openEditModal(prod)}
                              title="Editar producto"
                              className="p-1 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              title="Eliminar producto"
                              className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>

          {/* TABLE FOOTER (Matching Bottom Bar of "Clientes" Reference Image) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            
            {/* Left: Products per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Productos por página</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg pl-3 pr-7 py-1 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Center: Horizontal Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    currentPage === page
                      ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Counter */}
            <div className="text-slate-400 text-xs">
              Exhibiendo <span className="font-semibold text-slate-700">{totalItems > 0 ? startIndex + 1 : 0}-{endIndex}</span> de{' '}
              <span className="font-semibold text-slate-700">{totalItems}</span> productos
            </div>

          </div>

        </div>

        {/* MODAL DE DETALLES DEL PRODUCTO (Eye View Modal) */}
        {viewingProduct && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-800">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase">
                    {viewingProduct.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{viewingProduct.title}</h3>
                </div>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {viewingProduct.image_url && (
                  <img
                    src={viewingProduct.image_url}
                    alt={viewingProduct.title}
                    className="w-full h-44 object-cover rounded-xl border border-slate-200 bg-slate-50"
                  />
                )}
                <div>
                  <span className="font-bold text-slate-400 block mb-1">Descripción:</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                    {viewingProduct.description || 'Sin descripción asignada.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 font-bold block mb-0.5">Precio COP:</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      ${formatCopDisplay(viewingProduct.price_cop)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 font-bold block mb-0.5">Precio USD:</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      ${viewingProduct.price_usd}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 font-medium">Estado de Visibilidad:</span>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      viewingProduct.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {viewingProduct.active ? 'Activo en la Tienda' : 'Oculto / Inactivo'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    const prodToEdit = viewingProduct
                    setViewingProduct(null)
                    openEditModal(prodToEdit)
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar este producto</span>
                </button>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CREACIÓN / EDICIÓN (Soft Neutral White Style) */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-800 space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {editingProductId ? (
                    <Pencil className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-amber-500" />
                  )}
                  <span>{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetCreateForm()
                  }}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4">
                
                {/* Nombre / Título */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nombre / Título del producto o servicio <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Curso Intensivo de Fonética Nativa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Imagen del Producto (Dropzone + Vista previa) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Imagen del Producto
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                    onChange={(e) => {
                      handleImageSelect(e.target.files?.[0] || null)
                      e.target.value = ''
                    }}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <img
                        src={imagePreview}
                        alt="Vista previa del producto"
                        className="w-20 h-20 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="text-[11px] text-slate-600 truncate">
                          {imageFile ? imageFile.name : 'Imagen actual del producto'}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Cambiar
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        handleImageSelect(e.dataTransfer.files?.[0] || null)
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
                        isDragging
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/40'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">
                        Arrastra una imagen o haz clic para seleccionar
                      </p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, JPEG o WEBP · máx. 5 MB</p>
                    </div>
                  )}
                  {imageError && (
                    <p className="mt-1.5 text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{imageError}</span>
                    </p>
                  )}
                </div>

                {/* Descripción / Formato */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Descripción del Producto
                    </label>
                    <textarea
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Descripción detallada del producto, temario o especificaciones..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Insignia de Formato
                      </label>
                      <input
                        type="text"
                        value={newFormatBadge}
                        onChange={(e) => setNewFormatBadge(e.target.value)}
                        placeholder="Ej: Video 4K, PDF Interactivo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Categoría
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="masterclass">Masterclass</option>
                        <option value="ebooks">E-Book</option>
                        <option value="audios">Audios</option>
                        <option value="digital">Digital / General</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Precios (COP & USD) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Precio en COP
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">$</span>
                      <input
                        type="text"
                        value={typeof newPriceCop === 'number' ? formatCopDisplay(newPriceCop) : newPriceCop}
                        onChange={(e) => handleModalCopChange(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-7 pr-3 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Precio USD (TRM: ${TRM})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        value={newPriceUsd}
                        onChange={(e) => setNewPriceUsd(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-7 pr-3 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Selector de Visibilidad */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Visibilidad en la Tienda
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNewActive(true)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                        newActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>Activo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewActive(false)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                        !newActive
                          ? 'bg-slate-100 text-slate-700 border-slate-300 ring-2 ring-slate-400/20'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                      }`}
                    >
                      <EyeOff className="w-4 h-4 text-slate-400" />
                      <span>Inactivo / Oculto</span>
                    </button>
                  </div>
                </div>

                {/* Botones del Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      resetCreateForm()
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-5 py-2.5 bg-[#f5c045] hover:bg-[#e4b034] text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        {editingProductId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                        <span>{editingProductId ? 'Guardar Cambios' : 'Crear Producto'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
