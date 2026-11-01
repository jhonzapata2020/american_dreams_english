'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  BookOpen,
  Briefcase,
  TrendingUp,
  Award
} from 'lucide-react';
import { Currency, DonationFrequency } from '../types';
import { getDonationTiers } from '../data/sprint1Data';
import { DonationModal } from './DonationModal';
import { formatMoney } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface DonationCardProps {
  initialCurrency?: Currency;
  forcedTierId?: string;
}

interface TierVisualMeta {
  colorBar: string;
  selectedRing: string;
  badge?: { text: string; className: string };
  icon: React.ComponentType<{ className?: string }>;
  copFormatted: string;
  usdFormatted: string;
}

// Configuración exacta a los colores y estilo del ejemplo gráfico de referencia:
// Tarjeta 1: Barra Amarilla/Oro (#F5A623)
// Tarjeta 2: Barra Azul/Gris pizarra (#2563EB / #6C7A89)
// Tarjeta 3: Barra Verde hoja (#4CAF50)
// Tarjeta 4: Barra Cyan/Turquesa (#00BCD4)
const TIER_VISUALS: Record<string, TierVisualMeta> = {
  'tier-1': {
    colorBar: 'bg-[#F5A623]',
    selectedRing: 'ring-2 ring-[#F5A623] shadow-[0_24px_48px_-12px_rgba(245,166,35,0.3)]',
    icon: TrendingUp,
    copFormatted: '$140.000 COP',
    usdFormatted: '$35 USD',
  },
  'tier-2': {
    colorBar: 'bg-[#2563EB]',
    selectedRing: 'ring-2 ring-[#2563EB] shadow-[0_24px_48px_-12px_rgba(37,99,235,0.3)]',
    badge: {
      text: 'MÁS ELEGIDO',
      className: 'bg-blue-600 text-white',
    },
    icon: Briefcase,
    copFormatted: '$200.000 COP',
    usdFormatted: '$50 USD',
  },
  'tier-3': {
    colorBar: 'bg-[#4CAF50]',
    selectedRing: 'ring-2 ring-[#4CAF50] shadow-[0_24px_48px_-12px_rgba(76,175,80,0.3)]',
    icon: Award,
    copFormatted: "$1'000.000 COP",
    usdFormatted: '$250 USD',
  },
  'tier-4': {
    colorBar: 'bg-[#00BCD4]',
    selectedRing: 'ring-2 ring-[#00BCD4] shadow-[0_24px_48px_-12px_rgba(0,188,212,0.3)]',
    badge: {
      text: 'IMPACTO TOTAL',
      className: 'bg-cyan-600 text-white',
    },
    icon: BookOpen,
    copFormatted: "$6'000.000 COP",
    usdFormatted: '$1,500 USD',
  },
};

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
    <div id="donaciones" className="max-w-6xl mx-auto px-4 py-12 font-sans">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <motion.span 
          initial={{ opacity: 0, y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs"
        >
          <Heart className="w-3.5 h-3.5 fill-blue-600 text-blue-600" /> {t.donation.badge}
        </motion.span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.donation.title}
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          {t.donation.subtitle}
        </p>
      </div>

      {/* LIENZO DE FONDO GRIS-AZULADO (EXACTO AL COLOR DE FONDO DE LA REFERENCIA UI) */}
      <div className="bg-[#ECEFF3] rounded-[40px] p-6 sm:p-10 shadow-lg border border-slate-200/60">
        
        {/* SELECTORES SUPERIORES (FRECUENCIA & MONEDA) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-sm">
          
          {/* Frecuencia */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.donation.frequencyLabel}
            </span>
            <div className="bg-slate-100 p-1 rounded-xl inline-flex items-center text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-white shadow-sm text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.donation.monthly}
              </button>
              <button
                type="button"
                onClick={() => setFrequency('one_time')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  frequency === 'one_time'
                    ? 'bg-white shadow-sm text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.donation.oneTime}
              </button>
            </div>
          </div>

          {/* Moneda */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.donation.currencyLabel}
            </span>
            <div className="bg-slate-100 p-1 rounded-xl inline-flex items-center text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white shadow-sm text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD / EUR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('COP')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  currency === 'COP'
                    ? 'bg-white shadow-sm text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                COP (Colombia)
              </button>
            </div>
          </div>

        </div>

        {/* 4 TARJETAS SQUIRCLE IDÉNTICAS AL DISEÑO DE REFERENCIA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-8">
          {tiers.map((tier) => {
            const meta = TIER_VISUALS[tier.id] || {
              colorBar: 'bg-[#F5A623]',
              selectedRing: 'ring-2 ring-blue-600 shadow-xl',
              icon: BookOpen,
              copFormatted: `$${tier.copAmount.toLocaleString('es-CO')} COP`,
              usdFormatted: `$${tier.usdAmount} USD`,
            };

            const IconComponent = meta.icon;
            const isSelected = selectedTierId === tier.id && !customAmount;
            const displayPrice = isUSD ? meta.usdFormatted : meta.copFormatted;

            return (
              <div
                key={tier.id}
                onClick={() => { setSelectedTierId(tier.id); setCustomAmount(''); }}
                className={`relative bg-white rounded-[32px] p-7 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? `-translate-y-2.5 scale-[1.02] ${meta.selectedRing}`
                    : 'shadow-[0_16px_36px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.1)]'
                }`}
              >
                {/* Cabecera idéntica a la referencia:
                    A la izquierda: Nombre de la sección/diseño en mayúsculas ("DESIGN" en referencia).
                    A la derecha: Icono limpio outline sin marcos. */}
                <div>
                  {meta.badge && (
                    <div className="mb-2">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${meta.badge.className}`}>
                        {meta.badge.text}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-bold tracking-widest text-slate-700 uppercase line-clamp-1">
                      {tier.title}
                    </span>
                    <IconComponent className="w-6 h-6 text-slate-600 stroke-[1.6] shrink-0" />
                  </div>

                  {/* Monto claro y balanceado */}
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5" suppressHydrationWarning>
                    {isMounted ? displayPrice : meta.copFormatted}
                  </div>

                  {/* Texto de descripción idéntico en estilo, tono y proporción a las líneas del ejemplo */}
                  <p className="text-xs text-slate-400 leading-relaxed font-normal min-h-[72px]">
                    {tier.impactDescription}
                  </p>
                </div>

                {/* Franja de color sólida al fondo:
                    Idéntica a la barra gruesa horizontal del pie de la referencia visual */}
                <div className="mt-6 pt-1">
                  <div className={`w-full h-3 rounded-[3px] ${meta.colorBar}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* VALOR PERSONALIZADO */}
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-sm">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            {t.donation.customAmountLabel}
          </div>
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">{currency}:</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t.donation.customAmountPlaceholder}
              className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 w-full sm:w-48 transition-shadow"
            />
          </div>
        </div>

        {/* BOTÓN Y RESUMEN DE APORTE */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider mb-0.5">
              {language === 'en' ? 'Selected Contribution:' : 'Aporte Seleccionado:'}
            </span>
            <h4 className="text-lg font-black text-slate-900">
              {selectedTier && !customAmount 
                ? selectedTier.title 
                : (language === 'en' ? 'Custom Donation' : 'Donación Personalizada')}
            </h4>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {language === 'en' ? 'Amount: ' : 'Monto: '}
              <strong className="text-emerald-700 font-extrabold" suppressHydrationWarning>
                {formatMoney(baseAmount, currency)}
              </strong> 
              {' '}({frequency === 'monthly' ? t.donation.monthly : t.donation.oneTime})
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-base font-bold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <Heart className="w-4 h-4 fill-white/20" />
            <span suppressHydrationWarning>
              {language === 'en' 
                ? `Proceed to Donate ${formatMoney(baseAmount, currency)}` 
                : `Proceder a Donar ${formatMoney(baseAmount, currency)}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* TRANSPARENCIA & AUDITORÍA TRIBUTARIA */}
        <div className="bg-white/80 border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="leading-snug">
              {language === 'en' 
                ? 'Each donation automatically issues a tax certificate and grants access to the Public Scholar Audit Dashboard.'
                : 'Cada donación emite automáticamente un Certificado Tributario de Donación y da acceso al Dashboard de Auditoría Pública de Becados.'}
            </span>
          </div>
          <span className="text-slate-800 font-bold flex items-center gap-1 shrink-0">
            <Lock className="w-3.5 h-3.5 text-slate-700" /> {language === 'en' ? '256-bit SSL Encryption' : 'Encriptación 256-bit SSL'}
          </span>
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
