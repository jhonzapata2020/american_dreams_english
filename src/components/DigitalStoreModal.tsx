import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  MessageCircle,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { Currency } from '../types';
import { createClient } from '../utils/supabase/client';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SoftSwitch3D } from './ui/SoftSwitch3D';
import { getWhatsAppUrl } from '../config/contact';

export interface Product {
  id: string;
  title: string;
  category: 'ebooks' | 'masterclass' | 'audios' | string;
  formatBadge: string;
  usdPrice: number;
  copPrice: number;
  description: string;
  thumbnail: string;
  active?: boolean;
  mcerLevel?: string;
  deliveryMode?: string;
}

// Cache en memoria para renderizado instantáneo (0ms)
let cachedProducts: Product[] | null = null;

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Masterclass 4K: Fonética y Pronunciación Nativa',
    category: 'masterclass',
    formatBadge: 'Video 4K',
    mcerLevel: 'A1 - B2 Todos los niveles',
    deliveryMode: 'Acceso Campus',
    usdPrice: 19,
    copPrice: 75000,
    description: 'Aprende los 44 fonemas del inglés con explicaciones en video 4K de docentes bilingües certificados.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    title: 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo',
    category: 'ebooks',
    formatBadge: 'E-book PDF',
    mcerLevel: 'B1 - B2 Intermedio',
    deliveryMode: 'Descarga Inmediata',
    usdPrice: 12,
    copPrice: 48000,
    description: 'Guía con vocabulario clave para entrevistas, logística comercial y comercio en puertos internacionales.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    title: 'Pack Completo A1-A2: Guías + Audios de Inmersión',
    category: 'audios',
    formatBadge: 'Audios + PDF',
    mcerLevel: 'A1 - A2 Principiante',
    deliveryMode: 'Descarga Inmediata',
    usdPrice: 29,
    copPrice: 115000,
    description: 'Más de 50 archivos de audio fonético descargables para entrenar el oído desde el celular.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    active: true
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    title: 'Guía Rápida de Conectores y Fluidez B1-B2',
    category: 'ebooks',
    formatBadge: 'E-book PDF',
    mcerLevel: 'B1 - B2 Intermedio',
    deliveryMode: 'Descarga Inmediata',
    usdPrice: 9,
    copPrice: 36000,
    description: 'Resumen estructurado de conectores gramaticales para desenvolverte en debates y entrevistas.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400',
    active: true
  }
];

const I18N = {
  es: {
    modalTitle: 'Cursos Digitales & Recursos de Inglés',
    modalSubtitle: 'Masterclasses en video 4K, guías interactivas y audios fonéticos',
    currencyLabel: 'Moneda:',
    allCategories: 'Todos los Cursos',
    masterclassCategory: 'Masterclasses 4K',
    ebooksCategory: 'E-books en PDF',
    audiosCategory: 'Audios Fonéticos',
    loading: 'Cargando catálogo de cursos digitales...',
    officialPrice: 'Precio Oficial:',
    buyNow: 'Adquirir vía WhatsApp',
    buyNowAria: 'Adquirir vía WhatsApp',
    customizeOrder: 'Personalizar datos',
    backToCatalog: '← Volver al Catálogo de Productos',
    checkoutTitle: 'Adquisición Asistida Inmediata',
    checkoutSubtitle: 'Envío de enlaces de descarga y credenciales de acceso vía WhatsApp oficial',
    fullNameLabel: 'Nombre Completo (Opcional)',
    fullNamePlaceholder: 'Ej. Andrés Felipe',
    emailLabel: 'Correo Electrónico (para respaldo de descarga)',
    emailPlaceholder: 'andres@correo.com',
    paymentNotice: 'Pasarelas automáticas en mantenimiento preventivo. Tu pedido es atendido y entregado de inmediato por el equipo académico vía WhatsApp.',
    confirmWhatsApp: 'Adquirir vía WhatsApp Oficial →',
    directWhatsAppBadge: 'Atención Inmediata',
    closeAria: 'Cerrar ventana de cursos digitales',
    currencyAria: 'Alternar moneda (COP / USD)',
    defaultMcer: 'A1 - B2 Todos los niveles',
    defaultDelivery: 'Descarga Inmediata',
  },
  en: {
    modalTitle: 'Digital Courses & Learning Resources',
    modalSubtitle: '4K Video Masterclasses, Interactive Guides & Audio Labs',
    currencyLabel: 'Currency:',
    allCategories: 'All Courses',
    masterclassCategory: '4K Masterclasses',
    ebooksCategory: 'PDF E-Books',
    audiosCategory: 'Phonetic Audios',
    loading: 'Loading digital courses catalog...',
    officialPrice: 'Official Price:',
    buyNow: 'Order via WhatsApp',
    buyNowAria: 'Order via WhatsApp',
    customizeOrder: 'Customize details',
    backToCatalog: '← Back to Products Catalog',
    checkoutTitle: 'Instant Assisted Purchase',
    checkoutSubtitle: 'Direct delivery of download links & credentials via official WhatsApp',
    fullNameLabel: 'Full Name (Optional)',
    fullNamePlaceholder: 'E.g., John Doe',
    emailLabel: 'Email Address (for download backup)',
    emailPlaceholder: 'john@example.com',
    paymentNotice: 'Automatic gateways undergoing maintenance. Your order is processed and delivered immediately by our academic team via WhatsApp.',
    confirmWhatsApp: 'Order via Official WhatsApp →',
    directWhatsAppBadge: 'Immediate Assistance',
    closeAria: 'Close digital courses dialog',
    currencyAria: 'Toggle currency (COP / USD)',
    defaultMcer: 'A1 - B2 All Levels',
    defaultDelivery: 'Instant Download',
  }
};

function resolveProductBadges(prod: Product, isEn: boolean) {
  // 1. Nivel MCER
  let mcer = prod.mcerLevel;
  if (!mcer) {
    const t = prod.title.toLowerCase();
    if (t.includes('b1') || t.includes('b2')) {
      mcer = isEn ? 'B1 - B2 Intermediate' : 'B1 - B2 Intermedio';
    } else if (t.includes('a1') || t.includes('a2')) {
      mcer = isEn ? 'A1 - A2 Beginner' : 'A1 - A2 Principiante';
    } else {
      mcer = isEn ? 'A1 - B2 All Levels' : 'A1 - B2 Todos los niveles';
    }
  }

  // 2. Modo de Entrega
  let delivery = prod.deliveryMode;
  if (!delivery) {
    delivery = prod.category === 'masterclass' 
      ? (isEn ? 'Campus Access' : 'Acceso Campus') 
      : (isEn ? 'Instant Download' : 'Descarga Inmediata');
  }

  // 3. Formato
  let format = prod.formatBadge;
  if (!format) {
    if (prod.category === 'ebooks') format = 'E-book PDF';
    else if (prod.category === 'masterclass') format = isEn ? 'Video 4K / Workshop' : 'Taller / Video 4K';
    else if (prod.category === 'audios') format = 'Audios + PDF';
    else format = 'Digital';
  }

  return { mcer, delivery, format };
}

interface DigitalStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency;
}

export const DigitalStoreModal: React.FC<DigitalStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currency, setCurrency, formatPrice: formatCurrencyPrice } = useCurrency();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const texts = isEn ? I18N.en : I18N.es;

  const [products, setProducts] = useState<Product[]>(cachedProducts || FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ebooks' | 'masterclass' | 'audios'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<boolean>(false);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  // Consulta dinámica optimizada con cache en memoria y fallback instantáneo
  const fetchActiveProducts = async () => {
    if (!cachedProducts && products.length === 0) {
      setLoading(true);
    }
    try {
      const supabase = createClient();
      const queryPromise = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 3500)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (!error && data && data.length > 0) {
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category || 'ebooks',
          formatBadge: item.format_badge || 'Digital 4K',
          mcerLevel: item.mcer_level,
          deliveryMode: item.delivery_mode,
          usdPrice: Number(item.price_usd) || 0,
          copPrice: Number(item.price_cop) || 0,
          description: item.description || '',
          thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
          active: item.active
        }));
        cachedProducts = mappedProducts;
        setProducts(mappedProducts);
      } else if (!cachedProducts) {
        cachedProducts = FALLBACK_PRODUCTS;
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch {
      if (!cachedProducts) {
        cachedProducts = FALLBACK_PRODUCTS;
        setProducts(FALLBACK_PRODUCTS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!cachedProducts) {
        fetchActiveProducts();
      }
    }
  }, [isOpen]);

  // Accesibilidad: Cierre con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (checkoutStep) {
          setCheckoutStep(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, checkoutStep, onClose]);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const formatPrice = (prod: Product) => {
    return formatCurrencyPrice(prod.copPrice);
  };

  const buildWhatsAppUrl = (prod: Product, name?: string, email?: string) => {
    const priceFormatted = formatPrice(prod);
    const extraName = name?.trim() ? `\n*Nombre:* ${name.trim()}` : '';
    const extraEmail = email?.trim() ? `\n*Correo de entrega:* ${email.trim()}` : '';

    const message = isEn
      ? `Hello American Dream English, I want to acquire the learning resource: "${prod.title}" for ${priceFormatted}.${extraName}${extraEmail}\n\nPlease share the payment instructions and instant access link.`
      : `Hola American Dream English, quiero adquirir el recurso: "${prod.title}" por ${priceFormatted}.${extraName}${extraEmail}\n\nPor favor envíenme los datos de pago y el enlace de acceso inmediato.`;

    return getWhatsAppUrl(message);
  };

  const handleStartCheckout = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutStep(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="digital-store-modal-title"
    >
      
      {/* Backdrop Click Listener */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Modal Container: Flex Col + Max Height 90vh */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto">
        
        {/* MODAL HEADER (Shrink-0 para no colapsar) */}
        <div className="bg-[#002B49] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#001D33] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-blue-600 rounded-xl text-white shadow-sm shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 id="digital-store-modal-title" className="font-extrabold text-base sm:text-lg text-white leading-tight">
                {texts.modalTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300">
                {texts.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={texts.closeAria}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* MODAL BODY (Scroll interno flex-1 con padding inferior pb-6) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 pr-2 pb-6">
          
          {checkoutStep && selectedProduct ? (
            /* CHECKOUT STEP VIEW: ATENCIÓN Y ENTREGA ASISTIDA POR WHATSAPP */
            <div className="space-y-5 max-w-xl mx-auto py-2">
              
              <button
                type="button"
                onClick={() => setCheckoutStep(false)}
                className="text-xs font-bold text-[#002B49] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {texts.backToCatalog}
              </button>

              <div className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4">
                
                {/* Resumen del producto seleccionado con badges */}
                <div className="flex items-center space-x-3.5 border-b border-slate-200 pb-4">
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[9.5px] font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {resolveProductBadges(selectedProduct, isEn).format}
                      </span>
                      <span className="text-[9.5px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {resolveProductBadges(selectedProduct, isEn).mcer}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{selectedProduct.title}</h4>
                    <p className="text-sm font-black text-red-600 mt-0.5">{formatPrice(selectedProduct)}</p>
                  </div>
                </div>

                {/* Formulario informativo para WhatsApp */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {texts.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder={texts.fullNamePlaceholder}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {texts.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder={texts.emailPlaceholder}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B49]"
                    />
                  </div>

                  {/* Aviso de atención directa y segura */}
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-xl flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                      {texts.paymentNotice}
                    </p>
                  </div>

                  {/* Botón directo de redirección a WhatsApp */}
                  <a
                    href={buildWhatsAppUrl(selectedProduct, buyerName, buyerEmail)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{texts.confirmWhatsApp}</span>
                  </a>
                </div>

              </div>

            </div>
          ) : (
            /* CATALOG GRID VIEW */
            <>
              {/* Category Filter Pills & Currency Switch */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === 'all'
                        ? 'bg-[#002B49] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {texts.allCategories}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('masterclass')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === 'masterclass'
                        ? 'bg-[#002B49] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {texts.masterclassCategory}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('ebooks')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === 'ebooks'
                        ? 'bg-[#002B49] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {texts.ebooksCategory}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('audios')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === 'audios'
                        ? 'bg-[#002B49] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {texts.audiosCategory}
                  </button>
                </div>

                {/* Currency Switch con soporte i18n */}
                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
                  <span className="text-[11px] font-bold text-slate-500">{texts.currencyLabel}</span>
                  <SoftSwitch3D
                    checked={currency === 'USD'}
                    onChange={(isUsd) => setCurrency(isUsd ? 'USD' : 'COP')}
                    leftLabel="COP"
                    rightLabel="USD"
                    size="sm"
                    ariaLabel={texts.currencyAria}
                  />
                </div>
              </div>

              {loading && products.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#002B49]" />
                  {texts.loading}
                </div>
              ) : (
                /* Product Cards Grid: Altura simétrica, line-clamp y ratio compacto */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
                  {filteredProducts.map((prod) => {
                    const badges = resolveProductBadges(prod, isEn);
                    return (
                      <div
                        key={prod.id}
                        className="bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#002B49] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        <div>
                          {/* Ratio compacto h-36 con badges sobre la imagen */}
                          <div className="relative h-36 aspect-video sm:aspect-auto w-full overflow-hidden shrink-0 bg-slate-900">
                            <img
                              src={prod.thumbnail}
                              alt={prod.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            
                            {/* Badge de Modo de Entrega (Arriba a la Izquierda) */}
                            <span className="absolute top-2.5 left-2.5 bg-emerald-600/95 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              <span>{badges.delivery}</span>
                            </span>

                            {/* Badge de Formato Digital (Arriba a la Derecha) */}
                            <span className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/20 shadow-sm">
                              {badges.format}
                            </span>
                          </div>

                          {/* Cuerpo de la tarjeta: Badges + Título + Descripción con line-clamp */}
                          <div className="p-4 sm:p-5 space-y-2">
                            
                            {/* Badges de nivel MCER y Formato descriptivo */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80">
                                <Award className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>{badges.mcer}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80">
                                <BookOpen className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>{badges.format}</span>
                              </span>
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                              {prod.title}
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3 min-h-[2.5rem]">
                              {prod.description}
                            </p>
                          </div>
                        </div>

                        {/* Pie de tarjeta con precio y botón de compra vía WhatsApp */}
                        <div className="p-4 sm:p-5 pt-3 flex items-center justify-between border-t border-slate-200/80 bg-white/50 shrink-0">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                              {texts.officialPrice}
                            </span>
                            <span className="text-lg font-black text-red-600 tracking-tight leading-none">
                              {formatPrice(prod)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Botón Principal: Adquirir vía WhatsApp Directo */}
                            <a
                              href={buildWhatsAppUrl(prod)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${texts.buyNowAria}: ${prod.title}`}
                              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{texts.buyNow} →</span>
                            </a>

                            {/* Botón secundario para personalizar datos si el usuario lo desea */}
                            <button
                              type="button"
                              onClick={() => handleStartCheckout(prod)}
                              className="p-2 text-slate-400 hover:text-[#002B49] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                              title={texts.customizeOrder}
                              aria-label={texts.customizeOrder}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
