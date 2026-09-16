import React, { useState } from 'react';
import { 
  Heart, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  DollarSign,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { Currency, DonationFrequency, PaymentProvider } from '../types';
import { DONATION_TIERS } from '../data/sprint1Data';

interface DonationCardProps {
  initialCurrency?: Currency;
  forcedTierId?: string;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  initialCurrency = 'COP',
  forcedTierId
}) => {
  const [frequency, setFrequency] = useState<DonationFrequency>('monthly');
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [selectedTierId, setSelectedTierId] = useState<string>(forcedTierId || 'tier-2');
  const [customAmount, setCustomAmount] = useState<string>('');

  React.useEffect(() => {
    if (forcedTierId) {
      setSelectedTierId(forcedTierId);
      setCustomAmount('');
    }
  }, [forcedTierId]);
  const [coversFee, setCoversFee] = useState<boolean>(true);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

  const selectedTier = DONATION_TIERS.find(t => t.id === selectedTierId);
  
  // Calculate base amount
  const isUSD = currency === 'USD' || currency === 'EUR';
  const baseAmount = customAmount 
    ? parseFloat(customAmount) || 0 
    : isUSD 
      ? (selectedTier?.usdAmount || 50) 
      : (selectedTier?.copAmount || 200000);

  // Fee calculation (+3.5%)
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

  const handleProcessPayment = (provider: PaymentProvider) => {
    setActiveGateway(provider);
    setTimeout(() => {
      setPaymentSuccess(true);
      setActiveGateway(null);
    }, 1500);
  };

  return (
    <div id="donaciones" className="max-w-5xl mx-auto px-4 py-12 font-sans">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-red-600" /> Fondo de Becas & Subvenciones de Urabá
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
          Transforma una Vida con tu Donación de Impacto
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          Cada aporte financia directamente la educación bilingüe presencial y digital de jóvenes en condición de vulnerabilidad en Turbo, Antioquia.
        </p>
      </div>

      {/* MAIN DONATION CARD CONTAINER (PRACTICALLY CLEAN WHITE WITH SLATE-200 BORDER) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* TOP TOGGLE BAR (FREQUENCY & CURRENCY) */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Frequency Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Frecuencia:</span>
            <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm text-xs font-bold">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  frequency === 'monthly'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Mensual (Recurrente)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('one_time')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  frequency === 'one_time'
                    ? 'bg-navy-900 text-white shadow'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Donación Única
              </button>
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Moneda:</span>
            <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currency === 'USD' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                USD / EUR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('COP')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currency === 'COP' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                COP (Colombia)
              </button>
            </div>
          </div>

        </div>

        {/* CARD BODY */}
        <div className="p-6 sm:p-8 space-y-8 bg-white">
          
          {/* SUCCESS BANNER */}
          {paymentSuccess && (
            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-xl space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-200 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-black">¡Muchas Gracias por tu Compromiso con Turbo!</h3>
                  <p className="text-xs text-emerald-100">
                    Tu donación por {formatMoney(totalAmount, currency)} ha sido procesada con éxito. Se ha enviado el Certificado Tributario deducible de impuestos al correo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DONATION TIER LEVEL GRID */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              1. Selecciona el Nivel de Impacto Tangible (Unit Economics)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DONATION_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id && !customAmount;
                const displayPrice = isUSD 
                  ? `$${tier.usdAmount} USD` 
                  : `$${(tier.copAmount / 1000).toLocaleString()}k COP`;

                return (
                  <div
                    key={tier.id}
                    onClick={() => { setSelectedTierId(tier.id); setCustomAmount(''); }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-navy-900 text-white border-red-600 shadow-xl'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-navy-900 hover:bg-white'
                    }`}
                  >
                    {tier.badge && (
                      <span className={`absolute -top-3 right-4 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-amber-400 text-slate-900'
                      }`}>
                        {tier.badge}
                      </span>
                    )}

                    <div>
                      <span className={`text-xs font-bold block mb-1 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                        {tier.subtitle}
                      </span>
                      <div className="text-2xl font-black mb-2">
                        {displayPrice}
                      </div>
                      <h4 className="text-sm font-bold mb-2">
                        {tier.title}
                      </h4>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {tier.impactDescription}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/40 text-[11px] font-bold flex items-center justify-between">
                      <span className={isSelected ? 'text-red-400' : 'text-navy-900'}>
                        {isSelected ? 'Seleccionado' : 'Elegir Nivel'}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CUSTOM AMOUNT OPTION */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-700">
              ¿Deseas aportar un monto diferente?
            </div>
            <div className="w-full sm:w-auto flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">{currency}:</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Monto personalizado"
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 w-full sm:w-48"
              />
            </div>
          </div>

          {/* DONOR INFORMATION FORM */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              2. Datos del Donante / Organización
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo *</label>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="roberto@empresa.org"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Empresa u ONG (Opcional)</label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Ej. Fundación Urabá Bilingüe"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>
          </div>

          {/* GATEWAY FEE COVERAGE CHECKBOX (+3.5%) */}
          <div className="bg-amber-500/10 border border-amber-400/40 p-4 rounded-2xl flex items-start space-x-3">
            <input
              type="checkbox"
              id="coverFeeCheckbox"
              checked={coversFee}
              onChange={(e) => setCoversFee(e.target.checked)}
              className="mt-1 h-4 w-4 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="coverFeeCheckbox" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
              <strong className="text-navy-900">Cubrir la tarifa de procesamiento de pasarela (+3.5%): </strong>
              Adiciona <strong className="text-red-700">{formatMoney(feeAmount, currency)}</strong> para asegurar que el 100% de tu contribución neta llegue al estudiante beneficiario.
            </label>
          </div>

          {/* DYNAMIC GATEWAY SELECTION SECTION */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                  3. Pasarela de Pago Segura ({currency})
                </label>
                <p className="text-xs text-slate-500 font-medium">
                  {isUSD ? 'Procesamiento en USD / EUR para donantes internacionales.' : 'Procesamiento en COP con medios locales en Colombia.'}
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-bold">Total a Procesar:</span>
                <span className="text-xl font-black text-red-600">
                  {formatMoney(totalAmount, currency)}
                </span>
              </div>
            </div>

            {/* GATEWAY BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {isUSD ? (
                <>
                  {/* STRIPE CHECKOUT (USD/EUR) */}
                  <button
                    type="button"
                    disabled={activeGateway === 'stripe'}
                    onClick={() => handleProcessPayment('stripe')}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-3 text-sm group"
                  >
                    <CreditCard className="w-5 h-5 text-indigo-200" />
                    <span>{activeGateway === 'stripe' ? 'Procesando Stripe...' : 'Donar con Stripe (Tarjeta USD/EUR)'}</span>
                  </button>

                  {/* PAYPAL CHECKOUT (USD/EUR) */}
                  <button
                    type="button"
                    disabled={activeGateway === 'paypal'}
                    onClick={() => handleProcessPayment('paypal')}
                    className="bg-amber-400 hover:bg-amber-500 text-navy-950 font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-3 text-sm"
                  >
                    <DollarSign className="w-5 h-5 text-navy-900" />
                    <span>{activeGateway === 'paypal' ? 'Conectando PayPal...' : 'Donar con PayPal'}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* REDEBAN (COP) */}
                  <button
                    type="button"
                    disabled={activeGateway === 'redeban'}
                    onClick={() => handleProcessPayment('redeban')}
                    className="bg-navy-900 hover:bg-navy-950 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-3 text-sm"
                  >
                    <Receipt className="w-5 h-5 text-amber-400" />
                    <span>{activeGateway === 'redeban' ? 'Procesando Redeban...' : 'Donar con Redeban (Tarjetas COP)'}</span>
                  </button>

                  {/* WOMPI / PSE (COP) */}
                  <button
                    type="button"
                    disabled={activeGateway === 'wompi'}
                    onClick={() => handleProcessPayment('wompi')}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-3 text-sm"
                  >
                    <CreditCard className="w-5 h-5 text-white" />
                    <span>{activeGateway === 'wompi' ? 'Conectando Wompi...' : 'Donar con Wompi (PSE / Nequi / Bancolombia)'}</span>
                  </button>
                </>
              )}

            </div>
          </div>

          {/* TRANSPARENCY & AUDIT FOOTNOTE */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                Cada donación emite automáticamente un <strong className="text-navy-900">Certificado Tributario de Donación</strong> y da acceso al Dashboard de Auditoría Pública de Becados.
              </span>
            </div>
            <span className="text-navy-900 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-navy-900" /> Encriptación 256-bit SSL
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
