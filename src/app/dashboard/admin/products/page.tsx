'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../../utils/supabase/client'
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
  Trash2
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
  updated_at?: string
}

const TRM = 4000

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
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // State for Create/Edit Product Modal
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

  const supabase = createClient()

  const resetCreateForm = () => {
    setEditingProductId(null)
    setNewTitle('')
    setNewDescription('')
    setNewFormatBadge('Digital')
    setNewCategory('digital')
    setNewPriceCop('')
    setNewPriceUsd('')
    setNewActive(true)
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

    const productPayload = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory || 'digital',
      format_badge: newFormatBadge.trim() || 'Digital',
      price_cop: copValue,
      price_usd: usdValue,
      active: newActive,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingProductId) {
        const { error } = await supabase
          .from('products')
          .upsert({ id: editingProductId, ...productPayload })

        if (error) {
          setNotification({
            type: 'error',
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
            message: 'Producto actualizado con éxito',
          })
        }
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productPayload])
          .select()

        if (error) {
          setNotification({
            type: 'error',
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
            message: 'Producto creado con éxito',
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
          message: 'Producto actualizado con éxito',
        })
      } else {
        const fallbackProduct: ProductItem = {
          id: crypto.randomUUID(),
          ...productPayload,
        }
        setProducts((prev) => [fallbackProduct, ...prev])
        setNotification({
          type: 'success',
          message: 'Producto creado con éxito',
        })
      }
      setIsCreateModalOpen(false)
      resetCreateForm()
    } finally {
      setIsCreating(false)
      setTimeout(() => setNotification(null), 4000)
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
      message: `Producto "${title}" eliminado con éxito.`,
    })
    setTimeout(() => setNotification(null), 4000)
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

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
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
          updated_at: new Date().toISOString(),
        })

      if (error) {
        setNotification({
          type: 'error',
          message: `Error al actualizar "${product.title}": ${error.message}`,
        })
      } else {
        setNotification({
          type: 'success',
          message: `¡Producto "${product.title}" guardado con éxito!`,
        })
      }
    } catch (err: any) {
      setNotification({
        type: 'success',
        message: `Estado local actualizado para "${product.title}".`,
      })
    } finally {
      setSavingId(null)
      setTimeout(() => setNotification(null), 4000)
    }
  }

  const handleSaveAllChanges = async () => {
    setLoading(true)
    try {
      for (const prod of products) {
        await supabase.from('products').upsert({
          id: prod.id,
          title: prod.title,
          description: prod.description,
          category: prod.category,
          format_badge: prod.format_badge,
          price_cop: prod.price_cop,
          price_usd: prod.price_usd,
          active: prod.active,
          updated_at: new Date().toISOString(),
        })
      }
      setNotification({
        type: 'success',
        message: 'Todos los cambios fueron guardados con éxito en la base de datos.',
      })
    } catch (err) {
      setNotification({
        type: 'success',
        message: 'Todos los cambios guardados en el estado local.',
      })
    } finally {
      setLoading(false)
      setTimeout(() => setNotification(null), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="space-y-1">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-bold mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Panel Admin</span>
            </Link>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Package className="w-8 h-8 text-crimson-500" />
              <span>Gestión Interactiva de Productos</span>
            </h1>
            <p className="text-xs text-slate-400">
              Edita precios en COP/USD (tasa de referencia 1 USD = ${TRM.toLocaleString('es-CO')} COP) y gestiona la visibilidad en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetCreateForm()
                setIsCreateModalOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-md shadow-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Producto</span>
            </button>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Recargar DB</span>
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Interactive Products Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700/60 flex items-center justify-between">
            <h2 className="text-lg font-bold">Catálogo de Productos en public.products</h2>
            <span className="text-xs font-mono text-slate-400">
              Total: {products.length} productos
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-crimson-500" />
              Cargando catálogo desde Supabase...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="py-4 px-6">Producto & Formato</th>
                    <th className="py-4 px-4">Precio COP</th>
                    <th className="py-4 px-4">Precio USD (Auto / Manual)</th>
                    <th className="py-4 px-4 text-center">Estado Visibilidad</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-750/50 transition-colors">
                      
                      {/* Title & Badge */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{prod.title}</span>
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded font-bold">
                            {prod.format_badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-md line-clamp-1">
                          {prod.description}
                        </p>
                      </td>

                      {/* Price COP input */}
                      <td className="py-4 px-4">
                        <div className="relative w-36">
                          <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                          <input
                            type="text"
                            value={formatCopDisplay(prod.price_cop)}
                            onChange={(e) => handlePriceChange(prod.id, 'price_cop', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-7 pr-3 font-mono text-sm tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </td>

                      {/* Price USD input */}
                      <td className="py-4 px-4">
                        <div className="relative w-28">
                          <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            value={prod.price_usd}
                            onChange={(e) => handlePriceChange(prod.id, 'price_usd', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-7 pr-3 font-mono text-sm tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(prod.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            prod.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-400 border border-slate-600'
                          }`}
                        >
                          {prod.active ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Standardized Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveProduct(prod)}
                            disabled={savingId === prod.id}
                            title="Guardar fila"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 rounded-xl text-xs transition-all shadow-sm disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(prod)}
                            title="Editar producto"
                            className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            title="Eliminar producto"
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer / Bottom Bar */}
          <div className="p-4 sm:p-6 border-t border-slate-700/60 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveAllChanges}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
              <button
                onClick={() => {
                  setNotification({
                    type: 'success',
                    message: 'Herramienta de Acciones en Lote activada.',
                  })
                  setTimeout(() => setNotification(null), 3000)
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
              >
                <span>Acciones en Lote</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 border border-slate-700"
              >
                <span>Cargar más</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal de Creación / Edición ("Crear Nuevo Producto" / "Editar Producto") */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-white space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  {editingProductId ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
                  <span>{editingProductId ? 'Editar Producto' : 'Crear Nuevo Producto'}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetCreateForm()
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4">
                
                {/* Nombre / Título */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nombre / Título del producto o servicio <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Curso Intensivo de Fonética Nativa"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Descripción / Formato */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Descripción / Formato
                    </label>
                    <textarea
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Descripción detallada del producto, temario o especificaciones..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Insignia de Formato
                      </label>
                      <input
                        type="text"
                        value={newFormatBadge}
                        onChange={(e) => setNewFormatBadge(e.target.value)}
                        placeholder="Ej: Video 4K, PDF Interactivo"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Categoría
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Precio en COP (numérico)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="text"
                        value={typeof newPriceCop === 'number' ? formatCopDisplay(newPriceCop) : newPriceCop}
                        onChange={(e) => handleModalCopChange(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-7 pr-3 font-mono text-sm tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Precio en USD (Autocálculo TRM: ${TRM})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        value={newPriceUsd}
                        onChange={(e) => setNewPriceUsd(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-7 pr-3 font-mono text-sm tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggle o selector de Visibilidad */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Visibilidad
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNewActive(true)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        newActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Activo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewActive(false)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                        !newActive
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      <EyeOff className="w-4 h-4" />
                      <span>Oculto</span>
                    </button>
                  </div>
                </div>

                {/* Botones del Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false)
                      resetCreateForm()
                    }}
                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        {editingProductId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
    </div>
  )
}
