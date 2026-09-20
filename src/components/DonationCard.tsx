import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { Currency, DonationFrequency } from '../types';
import { DONATION_TIERS } from '../data/sprint1Data';
import { DonationModal } from './DonationModal';
import { formatCOPK, formatMoney } from '../utils/formatters';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (forcedTierId) {
      setSelectedTierId(forcedTierId);
      setCustomAmount('');
    }
  }, [forcedTierId]);

  const selectedTier = DONATION_TIERS.find(t => t.id === selectedTierId);
  
  // Calculate base amount
  const isUSD = currency === 'USD' || currency === 'EUR';
  const baseAmount = customAmount 
    ? parseFloat(customAmount) || 0 
    : isUSD 
      ? (selectedTier?.usdAmount || 50) 
      : (selectedTier?.copAmount || 200000);

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
          Cada aporte financia directamente la educación bilingüe presencial y digital de jóvenes en la Región de Urabá (Apartadó, Turbo, Currulao y municipios aledaños) y nuestra plataforma virtual global.
        </p>
      </div>

      {/* MAIN DONATION CARD CONTAINER */}
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
                  : `$${formatCOPK(tier.copAmount)}k COP`;

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
                      <div className="text-2xl font-black mb-2" suppressHydrationWarning>
                        {isMounted ? displayPrice : `$${formatCOPK(tier.copAmount)}k COP`}
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

          {/* ACTION BUTTON & SUMMARY BAR */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Aporte Seleccionado:</span>
              <h4 className="text-lg font-black text-navy-900">
                {selectedTier && !customAmount ? selectedTier.title : 'Donación Personalizada'}
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                Monto: <strong className="text-red-600" suppressHydrationWarning>{formatMoney(baseAmount, currency)}</strong> ({frequency === 'monthly' ? 'Recurrente Mensual' : 'Aporte Único'})
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2.5 text-sm w-full sm:w-auto"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span suppressHydrationWarning>Proceder a Donar {formatMoney(baseAmount, currency)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* TRANSPARENCY & AUDIT FOOTNOTE */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                Cada donación emite automáticamente un <strong className="text-navy-900">Certificado Tributario de Donación</strong> y da acceso al Dashboard de Auditoría Pública de Becados.
              </span>
            </div>
            <span className="text-navy-900 font-bold flex items-center gap-1 flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-navy-900" /> Encriptación 256-bit SSL
            </span>
          </div>

        </div>

      </div>

      {/* DONATION CHECKOUT MODAL */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={currency}
        frequency={frequency}
        tierTitle={selectedTier && !customAmount ? selectedTier.title : 'Donación Personalizada'}
        baseAmount={baseAmount}
      />

    </div>
  );
};
