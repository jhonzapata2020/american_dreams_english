import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Receipt, 
  DollarSign, 
  CheckCircle2
} from 'lucide-react';
import { Currency, DonationFrequency, PaymentProvider } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  frequency: DonationFrequency;
  tierTitle: string;
  baseAmount: number;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  currency,
  frequency,
  tierTitle,
  baseAmount,
}) => {
  const [coversFee, setCoversFee] = useState<boolean>(true);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

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

  const isUSD = currency === 'USD' || currency === 'EUR';
  const feeAmount = coversFee ? baseAmount * 0.035 : 0;
  const totalAmount = baseAmount + feeAmount;

  const formatMoney = (amount: number, curr: Currency) => {
    if (curr === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`;
    }
    if (curr === 'EUR') {
      return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} EUR`;
    }
    return `$${Math.round(amount).toLocaleString('es-CO')} COP`;
  };

  const handleProcessPayment = (provider: PaymentProvider, e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) {
      alert('Por favor completa tu Nombre y Correo Electrónico.');
      return;
    }
    setActiveGateway(provider);
    setTimeout(() => {
      setPaymentSuccess(true);
      setActiveGateway(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-fadeIn font-sans">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600 rounded-xl text-white shadow-sm">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Completar Donación de Impacto</h3>
              <p className="text-xs text-slate-300">
                {tierTitle} • <strong className="text-amber-400">{formatMoney(baseAmount, currency)}</strong> ({frequency === 'monthly' ? 'Mensual' : 'Única'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {paymentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-black text-navy-900">¡Muchas Gracias por tu Donación!</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Tu aporte por <strong className="text-navy-900">{formatMoney(totalAmount, currency)}</strong> ha sido procesado con éxito. Hemos enviado la confirmación y el <strong>Certificado Tributario de Donación</strong> a <strong>{donorEmail}</strong>.
              </p>
              <button
                onClick={onClose}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
              >
                Cerrar y Volver a la Plataforma
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* DONOR INFORMATION FORM */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                  1. Datos del Donante / Organización
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Ej. Dr. Roberto Gómez"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="roberto@empresa.org"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Empresa u ONG (Opcional)</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Ej. Fundación Urabá Bilingüe"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                  />
                </div>
              </div>

              {/* GATEWAY FEE COVERAGE CHECKBOX (+3.5%) */}
              <div className="bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="modalCoverFeeCheckbox"
                  checked={coversFee}
                  onChange={(e) => setCoversFee(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="modalCoverFeeCheckbox" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
                  <strong className="text-navy-900">Cubrir la tarifa de procesamiento de pasarela (+3.5%): </strong>
                  Adiciona <strong className="text-red-700">{formatMoney(feeAmount, currency)}</strong> para asegurar que el 100% de tu contribución neta llegue al estudiante beneficiario.
                </label>
              </div>

              {/* PAYMENT GATEWAY SELECTION SECTION */}
              <div className="space-y-4 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                      2. Pasarela de Pago Segura ({currency})
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isUSD ? 'Procesamiento en USD / EUR para donantes internacionales.' : 'Procesamiento en COP con medios locales en Colombia.'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-bold">Total a Procesar:</span>
                    <span className="text-lg font-black text-red-600">
                      {formatMoney(totalAmount, currency)}
                    </span>
                  </div>
                </div>

                {/* GATEWAY BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  
                  {isUSD ? (
                    <>
                      {/* STRIPE CHECKOUT */}
                      <button
                        type="button"
                        disabled={activeGateway === 'stripe'}
                        onClick={(e) => handleProcessPayment('stripe', e)}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                      >
                        <CreditCard className="w-4 h-4 text-indigo-200" />
                        <span>{activeGateway === 'stripe' ? 'Procesando Stripe...' : 'Donar con Stripe (Tarjeta USD)'}</span>
                      </button>

                      {/* PAYPAL CHECKOUT */}
                      <button
                        type="button"
                        disabled={activeGateway === 'paypal'}
                        onClick={(e) => handleProcessPayment('paypal', e)}
                        className="bg-amber-400 hover:bg-amber-500 text-navy-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                      >
                        <DollarSign className="w-4 h-4 text-navy-900" />
                        <span>{activeGateway === 'paypal' ? 'Conectando PayPal...' : 'Donar con PayPal'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* REDEBAN (COP) */}
                      <button
                        type="button"
                        disabled={activeGateway === 'redeban'}
                        onClick={(e) => handleProcessPayment('redeban', e)}
                        className="bg-navy-900 hover:bg-navy-950 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                      >
                        <Receipt className="w-4 h-4 text-amber-400" />
                        <span>{activeGateway === 'redeban' ? 'Procesando Redeban...' : 'Donar con Redeban (Tarjetas COP)'}</span>
                      </button>

                      {/* WOMPI / PSE (COP) */}
                      <button
                        type="button"
                        disabled={activeGateway === 'wompi'}
                        onClick={(e) => handleProcessPayment('wompi', e)}
                        className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
                      >
                        <CreditCard className="w-4 h-4 text-white" />
                        <span>{activeGateway === 'wompi' ? 'Conectando Wompi...' : 'Donar con Wompi (PSE / Nequi)'}</span>
                      </button>
                    </>
                  )}

                </div>
              </div>

            </form>
          )}

          {/* TRANSPARENCY FOOTNOTE */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Certificado Tributario deducible de impuestos automático + Acceso a Auditoría.
              </span>
            </div>
            <span className="text-navy-900 font-bold flex items-center gap-1 flex-shrink-0">
              <Lock className="w-3 h-3 text-navy-900" /> 256-bit SSL
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
