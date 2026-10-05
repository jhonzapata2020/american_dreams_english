'use client'

import React, { useState } from 'react'
import { 
  Lock, 
  CreditCard, 
  User, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { InteractiveCard3D, getCardBrand } from './InteractiveCard3D'
import { useCurrency } from '../../context/CurrencyContext'

export interface CreditCardCheckoutFormProps {
  totalAmountCop: number
  itemTitle: string
  itemSubtitle?: string
  isProcessing?: boolean
  onSubmit: (cardData: {
    cardNumber: string
    cardHolder: string
    expDate: string
    cvc: string
    brand: string
  }) => void
  initialCardHolder?: string
  className?: string
}

export const CreditCardCheckoutForm: React.FC<CreditCardCheckoutFormProps> = ({
  totalAmountCop,
  itemTitle,
  itemSubtitle,
  isProcessing = false,
  onSubmit,
  initialCardHolder = '',
  className = '',
}) => {
  const { formatPrice, currency, exchangeRate } = useCurrency()

  const [cardHolder, setCardHolder] = useState<string>(initialCardHolder)
  const [cardNumber, setCardNumber] = useState<string>('')
  const [expDate, setExpDate] = useState<string>('')
  const [cvc, setCvc] = useState<string>('')
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [saveCard, setSaveCard] = useState<boolean>(true)

  // Formateador automático del número de tarjeta en bloques de 4
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  // Formateador automático de fecha de expiración (MM/AA)
  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`
    }
    setExpDate(raw)
  }

  // CVC max 4 dígitos
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvc(raw)
  }

  const brand = getCardBrand(cardNumber)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardHolder,
      expDate,
      cvc,
      brand,
    })
  }

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 ${className}`}>
      
      {/* Header del Checkout Split-Screen */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Payment details
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Enter your card to complete the transaction safely.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>PCI-DSS Level 1</span>
        </div>
      </div>

      {/* Grid 2 Columnas Split-Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: TARJETA 3D INTERACTIVA Y RESUMEN       */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6 flex flex-col items-center">
          
          {/* Tarjeta 3D con Flip automático */}
          <div className="w-full">
            <InteractiveCard3D
              cardNumber={cardNumber}
              cardHolder={cardHolder || initialCardHolder}
              expDate={expDate}
              cvc={cvc}
              isFlipped={isFlipped}
            />
          </div>

          {/* Tarjeta de Resumen de Orden (YOUR ORDER) */}
          <div className="w-full max-w-[360px] sm:max-w-[400px] bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-xs space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              YOUR ORDER
            </span>

            <div className="flex justify-between items-start text-slate-800 font-medium">
              <div>
                <span className="font-bold text-slate-900 block">{itemTitle}</span>
                {itemSubtitle && (
                  <span className="text-[11px] text-slate-500 block">{itemSubtitle}</span>
                )}
              </div>
              <span className="font-mono font-bold text-slate-900 shrink-0 pl-2">
                {formatPrice(totalAmountCop)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Priority Campus Delivery:</span>
              <span className="font-bold text-emerald-600">Included</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax (IVA 0% Ed.):</span>
              <span className="font-mono font-semibold">$0.00</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Total due today:
              </span>
              <div className="text-right">
                <span className="font-mono font-black text-base sm:text-lg text-blue-900 block">
                  {formatPrice(totalAmountCop)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currency === 'USD' ? `TRM: 1 USD = $${exchangeRate.toLocaleString()} COP` : 'Cifrado SSL bancario'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: FORMULARIO DE PAGO                       */}
        {/* ========================================================= */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo 1: Cardholder Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cardholder Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="A. HASIB o Tu Nombre"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all"
                  disabled={isProcessing}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Campo 2: Card Number */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pl-10 pr-16 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all tracking-wider"
                  disabled={isProcessing}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                
                {/* Brand Badge inside input */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="font-extrabold text-[10px] text-blue-900 uppercase">
                    {brand !== 'generic' ? brand.toUpperCase() : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Fila 2 Columnas: Expiry Date & CVC */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Expiry Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={handleExpDateChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all"
                    disabled={isProcessing}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* CVC (Flip Trigger on Focus) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    CVC
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">back of card</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={cvc}
                    onChange={handleCvcChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder-slate-400 outline-none transition-all"
                    disabled={isProcessing}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>

            {/* Checkbox: Save card for next time */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 text-xs leading-tight select-none">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Save this card for next time</span>
                  <span className="text-[10px] text-slate-400 block">Stored securely by tokenization, never by raw storage.</span>
                </div>
              </label>
            </div>

            {/* Botón Principal Cápsula Azul */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#183ec2] hover:bg-[#123099] active:bg-[#0c226e] text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                    <span>Processing transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Pay {formatPrice(totalAmountCop)}</span>
                    <ArrowRight className="w-4 h-4 text-white ml-1" />
                  </>
                )}
              </button>
            </div>

            {/* Microprint de Seguridad y Confianza */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <div className="flex items-center gap-3">
                <span>🛡️ PCI-DSS Level 1</span>
                <span>🔒 256-bit TLS</span>
              </div>
              <span>American Dream never stores your CVC</span>
            </div>

          </form>
        </div>

      </div>

    </div>
  )
}
