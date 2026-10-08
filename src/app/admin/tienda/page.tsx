'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { createClient } from '../../../utils/supabase/client'
import { STORE_PRODUCTS, StoreProduct, resolveProductThumbnail } from '../../../data/storeData'
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Pencil, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Package, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  X,
  CreditCard,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react'

export interface StoreSaleTransaction {
  id: string
  date: string
  product_name: string
  product_id: string
  customer_name: string
  customer_email: string
  payment_method: 'Wompi - Tarjeta' | 'Wompi - Nequi' | 'Wompi - PSE' | 'Bancolombia'
  gross_amount_cop: number
  platform_fee_cop: number // 10%
  academy_net_cop: number  // 90%
  status: 'APPROVED' | 'PENDING' | 'REFUNDED'
  reference: string
}

const INITIAL_SALES_RECORDS: StoreSaleTransaction[] = [
  {
    id: 'tx-001',
    date: '2026-10-07 15:30',
    product_name: 'Camiseta Oficial ADE',
    product_id: 'prod-camiseta-oficial-ade',
    customer_name: 'Mateo Restrepo Gómez',
    customer_email: 'mateo.restrepo@gmail.com',
    payment_method: 'Wompi - Nequi',
    gross_amount_cop: 55000,
    platform_fee_cop: 5500,
    academy_net_cop: 49500,
    status: 'APPROVED',
    reference: 'ADE-SHOP-884910'
  },
  {
    id: 'tx-002',
    date: '2026-10-07 12:15',
    product_name: 'Masterclass 4K: Fonética y Pronunciación',
    product_id: 'prod-mc-fonetica',
    customer_name: 'Camila Andrea Vargas',
    customer_email: 'camila.vargas@hotmail.com',
    payment_method: 'Wompi - Tarjeta',
    gross_amount_cop: 75000,
    platform_fee_cop: 7500,
    academy_net_cop: 67500,
    status: 'APPROVED',
    reference: 'ADE-SHOP-884762'
  },
  {
    id: 'tx-003',
    date: '2026-10-06 18:40',
    product_name: 'Libro Oficial ADE Student Book - Nivel 1',
    product_id: 'prod-libro-fisico-1',
    customer_name: 'Juan David Higuita',
    customer_email: 'j.higuita@uraba.edu.co',
    payment_method: 'Wompi - PSE',
    gross_amount_cop: 95000,
    platform_fee_cop: 9500,
    academy_net_cop: 85500,
    status: 'APPROVED',
    reference: 'ADE-SHOP-883901'
  },
  {
    id: 'tx-004',
    date: '2026-10-06 10:20',
    product_name: 'Camiseta Oficial ADE',
    product_id: 'prod-camiseta-oficial-ade',
    customer_name: 'Valeria Morales Montoya',
    customer_email: 'valeria.morales@americandream.edu.co',
    payment_method: 'Wompi - Nequi',
    gross_amount_cop: 55000,
    platform_fee_cop: 5500,
    academy_net_cop: 49500,
    status: 'APPROVED',
    reference: 'ADE-SHOP-883440'
  },
  {
    id: 'tx-005',
    date: '2026-10-05 16:50',
    product_name: 'Pack Completo A1-A2: 50 Audios + Guías',
    product_id: 'prod-pack-audios',
    customer_name: 'Esteban Cárdenas',
    customer_email: 'esteban.cardenas@outlook.com',
    payment_method: 'Wompi - Tarjeta',
    gross_amount_cop: 115000,
    platform_fee_cop: 11500,
    academy_net_cop: 103500,
    status: 'APPROVED',
    reference: 'ADE-SHOP-882190'
  }
]

export default function AdminTiendaPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'sales'>('products')
  
  // Lista de productos
  const [products, setProducts] = useState<StoreProduct[]>(STORE_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'digital' | 'fisico'>('all')

  // Estado del formulario de creación / edición
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null)
  
  // Campos del formulario
  const [formType, setFormType] = useState<'digital' | 'fisico'>('fisico')
  const [formCategory, setFormCategory] = useState<'ebooks' | 'masterclass' | 'audios' | 'libros' | 'uniformes' | 'merch'>('uniformes')
  const [formTitle, setFormTitle] = useState('')
  const [formPriceCop, setFormPriceCop] = useState<number>(55000)
  const [formDescription, setFormDescription] = useState('')
  const [formThumbnail, setFormThumbnail] = useState('/images/camiseta-oficial-ade.png')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formFileType, setFormFileType] = useState<'PDF' | 'Audio MP3' | 'Video Pack' | 'Físico'>('Físico')

  // Historial de ventas
  const [salesRecords, setSalesRecords] = useState<StoreSaleTransaction[]>(INITIAL_SALES_RECORDS)
  const [salesSearch, setSalesSearch] = useState('')

  // Cargar productos de Supabase al montar
  useEffect(() => {
    async function loadStoreData() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        // 1. Intentar cargar productos desde Supabase
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('*')
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
            fileType: p.file_type || (p.category === 'uniformes' || p.category === 'libros' ? 'Físico' : 'PDF'),
            popular: !!p.popular
          }))

          // Merge con STORE_PRODUCTS para que todos los E-Books y productos educativos aparezcan
          const existingIds = new Set(mapped.map(m => m.id))
          const merged = [...mapped, ...STORE_PRODUCTS.filter(sp => !existingIds.has(sp.id))]
          setProducts(merged)
        } else {
          // Fallback sincronizado con storeData.ts
          setProducts(STORE_PRODUCTS)
        }
      } catch (err) {
        console.warn('Fallback a catálogo local storeData.ts:', err)
        setProducts(STORE_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    loadStoreData()
  }, [])

  // Formateador de moneda en COP
  const formatCop = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Cálculos de métricas financieras
  const totalGrossSales = salesRecords.reduce((sum, tx) => tx.status === 'APPROVED' ? sum + tx.gross_amount_cop : sum, 0)
  const totalPlatformCommission = salesRecords.reduce((sum, tx) => tx.status === 'APPROVED' ? sum + tx.platform_fee_cop : sum, 0)
  const totalAcademyNet = salesRecords.reduce((sum, tx) => tx.status === 'APPROVED' ? sum + tx.academy_net_cop : sum, 0)

  // Abrir modal para crear
  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setFormType('digital')
    setFormCategory('ebooks')
    setFormTitle('')
    setFormPriceCop(45000)
    setFormDescription('')
    setFormThumbnail('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600')
    setFormIsActive(true)
    setFormFileType('PDF')
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const handleOpenEditModal = (prod: StoreProduct) => {
    setEditingProduct(prod)
    setFormType(prod.type)
    setFormCategory(prod.category)
    setFormTitle(prod.title)
    setFormPriceCop(prod.copPrice)
    setFormDescription(prod.description)
    setFormThumbnail(resolveProductThumbnail(prod))
    setFormIsActive(true)
    setFormFileType(prod.fileType || (prod.type === 'fisico' ? 'Físico' : 'PDF'))
    setIsModalOpen(true)
  }

  // Guardar producto
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim() || formPriceCop <= 0) return

    const newBadge = formType === 'fisico' ? 'FÍSICO (ENVÍO NACIONAL)' : 'Digital (Descarga directa)'
    const newUsd = Math.round(formPriceCop / 4000)
    const finalThumb = resolveProductThumbnail({
      thumbnail: formThumbnail.trim(),
      title: formTitle.trim(),
      category: formCategory,
      type: formType
    })

    const updatedItem: StoreProduct = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle.trim(),
      type: formType,
      category: formCategory,
      formatBadge: newBadge,
      copPrice: formPriceCop,
      usdPrice: newUsd,
      description: formDescription.trim(),
      thumbnail: finalThumb,
      fileType: formFileType,
      popular: editingProduct ? editingProduct.popular : true
    }

    try {
      const supabase = createClient()
      
      // Upsert en Supabase
      await supabase.from('products').upsert({
        id: updatedItem.id,
        title: updatedItem.title,
        category: updatedItem.category,
        format_badge: updatedItem.formatBadge,
        price_cop: updatedItem.copPrice,
        price_usd: updatedItem.usdPrice,
        description: updatedItem.description,
        image_url: updatedItem.thumbnail,
        active: formIsActive,
        file_type: updatedItem.fileType,
        updated_at: new Date().toISOString()
      })
    } catch (err) {
      console.warn('Guardado en estado local con fallback:', err)
    }

    // Actualizar estado local
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedItem : p))
    } else {
      setProducts(prev => [updatedItem, ...prev])
    }

    setIsModalOpen(false)
  }

  // Eliminar producto
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return

    try {
      const supabase = createClient()
      await supabase.from('products').delete().eq('id', id)
    } catch (err) {
      console.warn('Eliminado local:', err)
    }

    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // Filtrado de productos
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.type === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Filtrado de ventas
  const filteredSales = salesRecords.filter(s => {
    return s.customer_name.toLowerCase().includes(salesSearch.toLowerCase()) ||
           s.product_name.toLowerCase().includes(salesSearch.toLowerCase()) ||
           s.reference.toLowerCase().includes(salesSearch.toLowerCase())
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
        
        {/* ========================================================================= */}
        {/* 1. ENCABEZADO Y TABS DE NAVEGACIÓN SUPERIOR                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-crimson-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  Módulo de Gestión Comercial
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-bold text-slate-500">Anthony & Administración ADE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Tienda Oficial & Métricas de Ventas
              </h1>
            </div>

            {/* Botón de Acción Principal */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/tienda"
                target="_blank"
                className="min-h-[44px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Tienda Pública</span>
              </Link>
              
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="min-h-[44px] px-5 bg-crimson-600 hover:bg-crimson-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Selector de Pestañas (Tabs) */}
          <div className="flex border-b border-slate-100 gap-6 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`pb-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'border-crimson-600 text-crimson-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catálogo de Productos ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sales')}
              className={`pb-3 text-xs sm:text-sm font-black border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sales'
                  ? 'border-crimson-600 text-crimson-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ventas & Liquidación de Comisiones (10%)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PESTAÑA 1: CATÁLOGO DE PRODUCTOS (EXPERIENCIA ÁGIL)                       */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Filtros rápidos y buscador */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Buscador */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o descripción de producto..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                />
              </div>

              {/* Filtro por formato */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'digital', label: 'Digitales' },
                  { id: 'fisico', label: 'Físicos (Merch/Libros)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      categoryFilter === f.id
                        ? 'bg-navy-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Imagen con badge */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback visual si la imagen falla
                          (e.target as HTMLImageElement).src = '/logo-american-dream.png'
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-navy-900/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {product.formatBadge}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                          {product.title}
                        </h3>
                        <span className="text-xs font-mono font-black text-crimson-600 whitespace-nowrap">
                          {formatCop(product.copPrice)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Tipo: <strong className="text-slate-700 uppercase">{product.fileType || product.type}</strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                        title="Editar producto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: VENTAS & LIQUIDACIÓN DE COMISIONES (10%)                         */}
        {/* ========================================================================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            
            {/* 3 FINANCIAL SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Ventas Totales Brutas */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Ventas Totales Brutas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCop(totalGrossSales)}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {salesRecords.length} transacciones procesadas vía Wompi
                </p>
              </div>

              {/* Card 2: Ingresos ADE (90%) */}
              <div className="bg-gradient-to-br from-navy-950 to-navy-900 p-5 rounded-3xl text-white shadow-md border border-navy-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    Ingresos ADE (90%)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {formatCop(totalAcademyNet)}
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Fondos netos liquidados para la academia
                </p>
              </div>

              {/* Card 3: Comisión de Plataforma (10%) */}
              <div className="bg-gradient-to-br from-crimson-600 to-red-700 p-5 rounded-3xl text-white shadow-md shadow-red-600/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-100">
                    Comisión Plataforma (10%)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                    <Percent className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {formatCop(totalPlatformCommission)}
                </div>
                <div className="inline-flex items-center gap-1 bg-black/25 px-2.5 py-1 rounded-full text-[10px] font-black text-red-100">
                  <Sparkles className="w-3 h-3" />
                  <span>Generado por Software ADE</span>
                </div>
              </div>

            </div>

            {/* TABLA DE PRODUCTOS VENDIDOS */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Historial de Productos Vendidos
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Registro auditable con desglose automático de comisión del 10%
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    placeholder="Buscar por cliente o producto..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4">Fecha & Ref</th>
                      <th className="p-4">Producto</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Método de Pago</th>
                      <th className="p-4 text-right">Valor Bruto</th>
                      <th className="p-4 text-right">Comisión (10%)</th>
                      <th className="p-4 text-right">Neto ADE (90%)</th>
                      <th className="p-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSales.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{tx.date}</span>
                          <span className="font-mono text-[10px] text-slate-400">{tx.reference}</span>
                        </td>
                        <td className="p-4 font-extrabold text-slate-900">
                          {tx.product_name}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block">{tx.customer_name}</span>
                          <span className="text-[10px] text-slate-400">{tx.customer_email}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <CreditCard className="w-3 h-3 text-slate-500" />
                            <span>{tx.payment_method}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-black text-slate-900">
                          {formatCop(tx.gross_amount_cop)}
                        </td>
                        <td className="p-4 text-right font-mono font-black text-crimson-600">
                          {formatCop(tx.platform_fee_cop)}
                        </td>
                        <td className="p-4 text-right font-mono font-black text-emerald-700">
                          {formatCop(tx.academy_net_cop)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aprobado</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL / DRAWER DE CREACIÓN & EDICIÓN DE PRODUCTOS                         */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scaleUp">
              
              {/* Header del Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-crimson-600 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Configuración ágil para el catálogo oficial
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSaveProduct} className="space-y-4 text-left">
                
                {/* 1. Selector de formato rápido (Pills) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Formato de Entrega *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormType('digital')
                        setFormFileType('PDF')
                      }}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formType === 'digital'
                          ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Digital (Descarga directa)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormType('fisico')
                        setFormFileType('Físico')
                      }}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formType === 'fisico'
                          ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Físico (Envío nacional)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Categoría */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Categoría del Producto *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  >
                    <option value="uniformes">Uniformes / Ropa Oficial (Camisetas, Polos)</option>
                    <option value="merch">Merchandising (Hoodies, Gorras, Mugs)</option>
                    <option value="libros">Libros Físicos / Student Books</option>
                    <option value="ebooks">E-Books Digitales (PDF)</option>
                    <option value="masterclass">Masterclass / Packs de Video 4K</option>
                    <option value="audios">Packs de Audio Fonético MP3</option>
                  </select>
                </div>

                {/* 3. Nombre del producto */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ej. Camiseta Oficial ADE"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>

                {/* 4. Precio en COP */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Precio de Venta (COP) *
                    </label>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      ≈ ${(Math.round(formPriceCop / 4000))} USD
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={formPriceCop}
                    onChange={(e) => setFormPriceCop(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono font-black focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                </div>

                {/* 5. Descripción corta (Máx. 160 caracteres) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Descripción Corta *
                    </label>
                    <span className={`text-[10px] font-bold ${
                      formDescription.length > 150 ? 'text-red-600' : 'text-slate-400'
                    }`}>
                      {formDescription.length}/160
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={160}
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Camiseta 100% algodón, cuello redondo con escudo oficial..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-crimson-600 resize-none"
                  />
                </div>

                {/* 6. URL de la Imagen */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Ruta o URL de la Imagen
                  </label>
                  <input
                    type="text"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="/images/camiseta-oficial-ade.png o enlace web"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-crimson-600"
                  />
                  {formThumbnail && (
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <img 
                        src={formThumbnail} 
                        alt="Vista previa" 
                        className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-100 p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo-american-dream.png'
                        }}
                      />
                      <span className="text-[11px] text-slate-500 font-medium">Vista previa de imagen</span>
                    </div>
                  )}
                </div>

                {/* Botón de Guardado */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Guardar y Publicar en Tienda</span>
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
