'use client'

import React from 'react'
import { Wifi } from 'lucide-react'

export interface InteractiveCard3DProps {
  cardNumber: string
  cardHolder: string
  expDate: string
  cvc: string
  isFlipped: boolean
  isProcessing?: boolean
  className?: string
}

export const getCardBrand = (number: string): 'visa' | 'mastercard' | 'amex' | 'generic' => {
  const clean = number.replace(/\D/g, '')
  if (/^4/.test(clean)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard'
  if (/^3[47]/.test(clean)) return 'amex'
  return 'generic'
}

export const InteractiveCard3D: React.FC<InteractiveCard3DProps> = ({
  cardNumber,
  cardHolder,
  expDate,
  cvc,
  isFlipped,
  isProcessing = false,
  className = '',
}) => {
  const brand = getCardBrand(cardNumber)

  // Formateador visual del número (rellena con bullets si está incompleto)
  const formatDisplayNumber = () => {
    const clean = cardNumber.replace(/\D/g, '').slice(0, 16)
    const padded = clean.padEnd(16, '•')
    return `${padded.slice(0, 4)}  ${padded.slice(4, 8)}  ${padded.slice(8, 12)}  ${padded.slice(12, 16)}`
  }

  const displayHolder = (cardHolder.trim() || 'NOMBRE TITULAR').toUpperCase()
  const displayExp = expDate.trim() || 'MM/AA'
  const displayCvc = cvc.replace(/\D/g, '').slice(0, 4) || '•••'

  return (
    <div className={`group w-full max-w-[360px] sm:max-w-[400px] aspect-[1.586/1] mx-auto select-none [perspective:1000px] transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      
      {/* Estilos de vibración háptica y halo de iluminación */}
      <style jsx>{`
        @keyframes subtleVibrate {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-1.5px, 1px) rotate(-0.5deg); }
          40% { transform: translate(1.5px, -1px) rotate(0.5deg); }
          60% { transform: translate(-1px, -1.5px) rotate(-0.3deg); }
          80% { transform: translate(1px, 1.5px) rotate(0.3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 35px rgba(59, 130, 246, 0.7), 0 0 70px rgba(37, 99, 235, 0.5), inset 0 0 25px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 60px rgba(59, 130, 246, 0.95), 0 0 110px rgba(147, 197, 253, 0.8), inset 0 0 35px rgba(255, 255, 255, 0.9);
          }
        }
        .card-vibrating {
          animation: subtleVibrate 0.18s ease-in-out infinite, pulseGlow 1.2s ease-in-out infinite alternate !important;
        }
      `}</style>

      {/* 3D Flipping Container */}
      <div
        className={`relative w-full h-full rounded-2xl sm:rounded-3xl transition-all duration-700 [transform-style:preserve-3d] shadow-[0_20px_40px_-15px_rgba(30,64,175,0.35),0_0_20px_rgba(59,130,246,0.15)] group-hover:shadow-[0_25px_55px_-10px_rgba(30,64,175,0.55),0_0_35px_rgba(59,130,246,0.4)] ${
          isProcessing ? 'card-vibrating ring-4 ring-blue-400/80' : ''
        } ${
          isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
        }`}
      >
        
        {/* ========================================================= */}
        {/* CARA FRONTAL (FRONT VIEW)                                 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between [backface-visibility:hidden] overflow-hidden border border-white/50 bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#3B82F6] text-slate-900 shadow-inner group-hover:border-white/80 transition-colors">
          
          {/* Destello de luz / Hover Sheen Sweep */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none -skew-x-25" />
          
          {/* Textura sutil de micro-líneas diagonales y brillo */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #002B49 0, #002B49 1px, transparent 0, transparent 8px)'
            }}
          />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Fila 1: Chip EMV Metálico & Contactless + Logo American Dream */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Chip EMV */}
              <div className="w-11 h-8 sm:w-12 sm:h-9 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 rounded-lg p-1 border border-amber-600/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
                <div className="w-full h-[1px] bg-amber-700/30 my-auto" />
                <div className="w-[1px] h-full bg-amber-700/30 absolute left-1/3 top-0" />
                <div className="w-[1px] h-full bg-amber-700/30 absolute right-1/3 top-0" />
              </div>

              {/* Símbolo Contactless NFC */}
              <Wifi className="w-5 h-5 text-slate-700/70 rotate-90" />
            </div>

            {/* Branding Institucional */}
            <div className="text-right">
              <span className="font-black text-xs sm:text-sm tracking-widest text-[#002B49] block">
                AMERICAN DREAM
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-900/70 block">
                PREMIER ACADEMIC
              </span>
            </div>
          </div>

          {/* Fila 2: Número de Tarjeta en Alto Relieve */}
          <div className="relative z-10 py-2">
            <div className="font-mono text-lg sm:text-2xl font-bold tracking-wider text-slate-900 drop-shadow-xs whitespace-nowrap">
              {formatDisplayNumber()}
            </div>
          </div>

          {/* Fila 3: Titular, Expiración y Franquicia */}
          <div className="relative z-10 flex items-end justify-between text-slate-900">
            
            <div className="flex gap-6 sm:gap-8 min-w-0">
              {/* Cardholder */}
              <div className="min-w-0">
                <span className="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                  CARDHOLDER
                </span>
                <span className="block text-xs sm:text-sm font-extrabold tracking-wide truncate max-w-[150px] sm:max-w-[180px]">
                  {displayHolder}
                </span>
              </div>

              {/* Expires */}
              <div>
                <span className="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                  EXPIRES
                </span>
                <span className="block text-xs sm:text-sm font-mono font-extrabold tracking-wide">
                  {displayExp}
                </span>
              </div>
            </div>

            {/* Badge Franquicia */}
            <div className="shrink-0 pl-2">
              {brand === 'visa' && (
                <span className="font-black italic text-xl sm:text-2xl text-blue-900 tracking-tighter drop-shadow-2xs">
                  VISA
                </span>
              )}
              {brand === 'mastercard' && (
                <div className="flex items-center -space-x-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-600/90 shadow-2xs" />
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/90 shadow-2xs" />
                </div>
              )}
              {brand === 'amex' && (
                <span className="font-black text-xs sm:text-sm bg-blue-900 text-white px-2 py-1 rounded shadow-2xs">
                  AMEX
                </span>
              )}
              {brand === 'generic' && (
                <span className="font-bold text-[11px] sm:text-xs text-slate-700 bg-white/50 px-2 py-0.5 rounded border border-white/60">
                  DEBIT / CREDIT
                </span>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* CARA TRASERA (BACK VIEW - ROTADA 180 DEG)                 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl py-5 sm:py-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden border border-white/50 bg-gradient-to-br from-[#CBD5E1] via-[#94A3B8] to-[#475569] text-slate-900 shadow-inner group-hover:border-white/80 transition-colors">
          
          {/* Destello de luz / Hover Sheen Sweep */}
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none -skew-x-25" />
          
          {/* Banda Magnética Superior */}
          <div className="w-full h-10 sm:h-12 bg-slate-950 shadow-inner my-1" />

          {/* Banda de Firma y Cuadro CVC */}
          <div className="px-5 sm:px-6 space-y-1 relative z-10">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-200 uppercase tracking-wider">
              <span>Authorized Signature</span>
              <span>CVC / CVV</span>
            </div>

            <div className="flex items-center">
              {/* Línea de firma tramada */}
              <div 
                className="flex-1 h-9 sm:h-10 bg-white rounded-l-md border border-slate-300 shadow-inner"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #F1F5F9 0, #F1F5F9 4px, #FFFFFF 4px, #FFFFFF 8px)'
                }}
              />
              {/* Recuadro de CVC */}
              <div className="w-14 sm:w-16 h-9 sm:h-10 bg-slate-100 border-y border-r border-slate-300 rounded-r-md flex items-center justify-center font-mono font-black text-sm sm:text-base text-slate-900 tracking-widest shadow-inner">
                {displayCvc}
              </div>
            </div>
          </div>

          {/* Texto Legal & Microprint */}
          <div className="px-5 sm:px-6 flex items-center justify-between text-[8px] sm:text-[9px] text-slate-200/90 font-medium leading-tight">
            <p className="max-w-[240px]">
              This card is property of American Dream English Academic Platform. Valid for tuition and education services.
            </p>
            <div className="font-bold text-white text-[10px]">
              {brand.toUpperCase()}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
