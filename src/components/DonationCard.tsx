'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { Currency, DonationFrequency } from '../types';
import { getDonationTiers } from '../data/sprint1Data';
import { DonationModal } from './DonationModal';
import { formatCOPK, formatMoney } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface DonationCardProps {
  initialCurrency?: Currency;
  forcedTierId?: string;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  initialCurrency = 'COP',
  forcedTierId
}) => {
  const { language, t } = useLanguage();
  const tiers = getDonationTiers(language);

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

  const selectedTier = tiers.find(t => t.id === selectedTierId);
  
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
        <motion.span 
          initial={{ opacity: 0, y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs"
        >
          <Heart className="w-3.5 h-3.5 fill-red-600" /> {t.donation.badge}
        </motion.span>
        <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
          {t.donation.title}
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          {t.donation.subtitle}
        </p>
      </div>

      {/* MAIN DONATION CARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* TOP TOGGLE BAR (FREQUENCY & CURRENCY) */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Frequency Toggle con Cápsula Deslizante LayoutId */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.donation.frequencyLabel}</span>
            <div className="relative bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-2xs text-xs font-bold">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`relative z-10 px-4 py-2 rounded-lg transition-colors font-bold cursor-pointer ${
                  frequency === 'monthly' ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {frequency === 'monthly' && (
                  <motion.div
                    layoutId="activeDonationFreqPill"
                    className="absolute inset-0 bg-red-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {t.donation.monthly}
              </button>
              <button
                type="button"
                onClick={() => setFrequency('one_time')}
                className={`relative z-10 px-4 py-2 rounded-lg transition-colors font-bold cursor-pointer ${
                  frequency === 'one_time' ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {frequency === 'one_time' && (
                  <motion.div
                    layoutId="activeDonationFreqPill"
                    className="absolute inset-0 bg-[#002B49] rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {t.donation.oneTime}
              </button>
            </div>
          </div>

          {/* Currency Toggle con Cápsula Deslizante LayoutId */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.donation.currencyLabel}</span>
            <div className="relative bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-2xs text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`relative z-10 px-3.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer ${
                  currency === 'USD' ? 'text-white font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {currency === 'USD' && (
                  <motion.div
                    layoutId="activeDonationCurrencyPill"
                    className="absolute inset-0 bg-[#002B49] rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                USD / EUR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('COP')}
                className={`relative z-10 px-3.5 py-1.5 rounded-lg transition-colors font-bold cursor-pointer ${
                  currency === 'COP' ? 'text-white font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {currency === 'COP' && (
                  <motion.div
                    layoutId="activeDonationCurrencyPill"
                    className="absolute inset-0 bg-[#002B49] rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
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
              {t.donation.selectTierLabel}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id && !customAmount;
                const displayPrice = isUSD 
                  ? `$${tier.usdAmount} USD` 
                  : `$${formatCOPK(tier.copAmount)}k COP`;

                return (
                  <motion.div
                    key={tier.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedTierId(tier.id); setCustomAmount(''); }}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#002B49] text-white border-red-600 shadow-xl'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-md'
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
                      <div className="text-2xl font-black mb-2 tracking-tight" suppressHydrationWarning>
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
                      <span className={isSelected ? 'text-red-400 font-extrabold' : 'text-slate-700'}>
                        {isSelected ? (language === 'en' ? 'Selected' : 'Seleccionado') : (language === 'en' ? 'Select Tier' : 'Elegir Nivel')}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400 translate-x-0.5' : 'text-slate-400'}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CUSTOM AMOUNT OPTION */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-700">
              {t.donation.customAmountLabel}
            </div>
            <div className="w-full sm:w-auto flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">{currency}:</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder={t.donation.customAmountPlaceholder}
                className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 w-full sm:w-48 transition-shadow"
              />
            </div>
          </div>

          {/* ACTION BUTTON & SUMMARY BAR CON SHIMMER 21st.dev */}
          <div className="bg-slate-50 border border-slate-200/90 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
                {language === 'en' ? 'Selected Contribution:' : 'Aporte Seleccionado:'}
              </span>
              <h4 className="text-lg font-black text-navy-900">
                {selectedTier && !customAmount 
                  ? selectedTier.title 
                  : (language === 'en' ? 'Custom Donation' : 'Donación Personalizada')}
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                {language === 'en' ? 'Amount: ' : 'Monto: '}
                <strong className="text-red-600" suppressHydrationWarning>{formatMoney(baseAmount, currency)}</strong> 
                {' '}({frequency === 'monthly' ? t.donation.monthly : t.donation.oneTime})
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2.5 text-sm w-full sm:w-auto cursor-pointer"
            >
              {/* Haz de luz Shimmer sweep */}
              <motion.span
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none"
                animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                transition={{ repeat: Infinity, duration: 2.7, ease: 'easeInOut', repeatDelay: 1.2 }}
              />

              <Heart className="w-4 h-4 fill-white/20 relative z-10" />
              <span className="relative z-10" suppressHydrationWarning>
                {language === 'en' ? `Proceed to Donate ${formatMoney(baseAmount, currency)}` : `Proceder a Donar ${formatMoney(baseAmount, currency)}`}
              </span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>

          {/* TRANSPARENCY & AUDIT FOOTNOTE */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                {language === 'en' 
                  ? 'Each donation automatically issues a tax certificate and grants access to the Public Scholar Audit Dashboard.'
                  : 'Cada donación emite automáticamente un Certificado Tributario de Donación y da acceso al Dashboard de Auditoría Pública de Becados.'}
              </span>
            </div>
            <span className="text-navy-900 font-bold flex items-center gap-1 flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-navy-900" /> {language === 'en' ? '256-bit SSL Encryption' : 'Encriptación 256-bit SSL'}
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
        tierTitle={selectedTier && !customAmount ? selectedTier.title : (language === 'en' ? 'Custom Donation' : 'Donación Personalizada')}
        baseAmount={baseAmount}
      />

    </div>
  );
};
