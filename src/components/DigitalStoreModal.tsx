import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Video, 
  Headphones, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Currency, PaymentProvider } from '../types';

interface Product {
  id: string;
  title: string;
  category: 'ebooks' | 'masterclass' | 'audios';
  formatBadge: string;
  formatIcon: 'video' | 'pdf' | 'audio';
  usdPrice: number;
  copPrice: number;
  description: string;
  thumbnail: string;
}

const DIGITAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Masterclass 4K: Fonética y Pronunciación Nativa',
    category: 'masterclass',
    formatBadge: 'Video 4K',
    formatIcon: 'video',
    usdPrice: 19,
    copPrice: 75000,
    description: 'Aprende los 44 fonemas del inglés con explicaciones en video 4K de docentes bilingües certificados.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-2',
    title: 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo',
    category: 'ebooks',
    formatBadge: 'PDF Interactivo',
    formatIcon: 'pdf',
    usdPrice: 12,
    copPrice: 48000,
    description: 'Guía con vocabulario clave para entrevistas, logística comercial y comercio en puertos internacionales.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-3',
    title: 'Pack Completo A1-A2: Guías + Audios de Inmersión',
    category: 'audios',
    formatBadge: 'Audios + PDF',
    formatIcon: 'audio',
    usdPrice: 29,
    copPrice: 115000,
    description: 'Más de 50 archivos de audio fonético descargables para entrenar el oído desde el celular.',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-4',
    title: 'Guía Rápida de Conectores y Fluidez B1-B2',
    category: 'ebooks',
    formatBadge: 'PDF Descargable',
    formatIcon: 'pdf',
    usdPrice: 9,
    copPrice: 36000,
    description: 'Resumen estructurado de conectores gramaticales para desenvolverte en debates y entrevistas.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400'
  }
];

interface DigitalStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
}

export const DigitalStoreModal: React.FC<DigitalStoreModalProps> = ({
  isOpen,
  onClose,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ebooks' | 'masterclass' | 'audios'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<boolean>(false);
  
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<PaymentProvider>('wompi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = DIGITAL_PRODUCTS.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const isUSD = currency === 'USD' || currency === 'EUR';

  const formatPrice = (prod: Product) => {
    if (isUSD) {
      return `$${prod.usdPrice} USD`;
    }
    return `$${prod.copPrice.toLocaleString('es-CO')} COP`;
  };

  const handleStartCheckout = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutStep(true);
    setPurchaseSuccess(false);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Tienda de Infoproductos Digitales 4K</h3>
              <p className="text-xs text-slate-300">Aprende a tu propio ritmo con descarga inmediata</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {checkoutStep && selectedProduct ? (
            /* CHECKOUT STEP VIEW */
            <div className="space-y-6 max-w-xl mx-auto py-4">
              
              <button
                onClick={() => setCheckoutStep(false)}
                className="text-xs font-bold text-navy-900 hover:underline flex items-center gap-1"
              >
                ← Volver al Catálogo de Productos
              </button>

              {purchaseSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 animate-fadeIn">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-black text-navy-900">¡Compra Realizada con Éxito!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hemos enviado el enlace de descarga directa de <strong>{selectedProduct.title}</strong> al correo electrónico <strong>{buyerEmail}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setCheckoutStep(false);
                      setSelectedProduct(null);
                    }}
                    className="bg-navy-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                  >
                    Seguir Explorando Productos
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-4 border-b border-slate-200 pb-4">
                    <img
                      src={selectedProduct.thumbnail}
                      alt={selectedProduct.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {selectedProduct.formatBadge}
                      </span>
                      <h4 className="font-extrabold text-navy-900 text-sm mt-1">{selectedProduct.title}</h4>
                      <p className="text-xs font-black text-crimson-600">{formatPrice(selectedProduct)}</p>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmPurchase} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Ej. Andrés Felipe"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico (para envío de link) *</label>
                      <input
                        type="email"
                        required
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="andres@correo.com"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pasarela de Pago Segura</label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        {isUSD ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedGateway('stripe')}
                              className={`p-3 rounded-xl border transition-all text-center ${
                                selectedGateway === 'stripe' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              Stripe (USD)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedGateway('paypal')}
                              className={`p-3 rounded-xl border transition-all text-center ${
                                selectedGateway === 'paypal' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              PayPal (USD)
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedGateway('wompi')}
                              className={`p-3 rounded-xl border transition-all text-center ${
                                selectedGateway === 'wompi' ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              Wompi (PSE / Nequi)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedGateway('redeban')}
                              className={`p-3 rounded-xl border transition-all text-center ${
                                selectedGateway === 'redeban' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-700 border-slate-300'
                              }`}
                            >
                              Redeban (Tarjetas COP)
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 mt-4"
                    >
                      <span>{isProcessing ? 'Procesando Pago Seguro...' : `Pagar ${formatPrice(selectedProduct)}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ) : (
            /* CATALOG GRID VIEW */
            <>
              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === 'all'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos los Productos
                </button>
                <button
                  onClick={() => setActiveCategory('masterclass')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === 'masterclass'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Masterclasses 4K
                </button>
                <button
                  onClick={() => setActiveCategory('ebooks')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === 'ebooks'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  E-books en PDF
                </button>
                <button
                  onClick={() => setActiveCategory('audios')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === 'audios'
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Audios Fonéticos
                </button>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-navy-900 transition-all group"
                  >
                    <div>
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={prod.thumbnail}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 bg-navy-900 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                          {prod.formatBadge}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-extrabold text-navy-900 text-sm leading-snug">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-200/60 mt-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Precio Oficial:</span>
                        <span className="text-lg font-black text-crimson-600">
                          {formatPrice(prod)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartCheckout(prod)}
                        className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center space-x-1.5"
                      >
                        <span>Comprar Ahora</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
