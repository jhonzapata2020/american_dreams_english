'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink, 
  MessageSquare, 
  Building2, 
  Navigation, 
  ShieldCheck, 
  Compass, 
  Bus, 
  Car, 
  Bike, 
  Check, 
  Copy, 
  Sparkles, 
  School 
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { getWhatsAppUrl } from '../config/contact'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
}

type RouteTab = 'apartado' | 'turbo' | 'vehicle'

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<RouteTab>('apartado')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Coordenadas oficiales exactas satelitales
  const coordsDMS = "8°05'30.37\"N 76°42'31.78\"W"
  const coordsDecimal = "8.091769,-76.708828"
  
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordsDecimal}`
  const wazeUrl = `https://waze.com/ul?ll=${coordsDecimal}&navigate=yes`
  const whatsappUrl = getWhatsAppUrl('Hola, quisiera indicaciones para llegar a la sede de American Dream English en Turbo')

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsDMS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* ========================================================= */}
        {/* MODAL HEADER                                              */}
        {/* ========================================================= */}
        <div className="bg-[#002B49] text-white p-5 sm:p-6 flex items-center justify-between border-b border-navy-800 relative">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-md flex-shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black bg-white/10 text-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-white/15">
                  {t.location.badge}
                </span>
                <span className="text-[10px] text-slate-300 hidden sm:inline">
                  {t.location.elevationLabel}: <strong className="text-white">{t.location.elevationValue}</strong>
                </span>
              </div>
              <h3 className="font-black text-lg sm:text-2xl text-white tracking-tight mt-1">
                {t.location.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY SCROLLABLE (2 COLUMNAS)                         */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* ----------------------------------------------------- */}
            {/* COLUMNA IZQUIERDA: RUTAS, REFERENCIAS Y CONTACTO (6 COLS) */}
            {/* ----------------------------------------------------- */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                
                {/* Dirección y Coordenadas Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        {t.location.addressLabel}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {t.location.addressValue}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {t.location.addressSub}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCoords}
                    title={t.location.copyCoords}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all shadow-2xs self-stretch sm:self-auto justify-center"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">{t.location.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>GPS: {coordsDMS}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Selector de Rutas Interactivas */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      {t.location.routesTitle}
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('apartado')}
                      className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center gap-1 text-[11px] ${
                        activeTab === 'apartado'
                          ? 'bg-[#002B49] text-white shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Bus className="w-4 h-4" />
                      <span>Urabá Sur</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('turbo')}
                      className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center gap-1 text-[11px] ${
                        activeTab === 'turbo'
                          ? 'bg-[#002B49] text-white shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Turbo Centro</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('vehicle')}
                      className={`py-2 px-2 rounded-xl transition-all flex flex-col items-center gap-1 text-[11px] ${
                        activeTab === 'vehicle'
                          ? 'bg-[#002B49] text-white shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Auto / Moto</span>
                    </button>
                  </div>

                  {/* Detalle Tab Activo */}
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 transition-all">
                    {activeTab === 'apartado' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-[#002B49]">
                            {t.location.tabApartado}
                          </h5>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {t.location.tabApartadoTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {t.location.tabApartadoDesc}
                        </p>
                      </div>
                    )}

                    {activeTab === 'turbo' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-[#002B49]">
                            {t.location.tabTurbo}
                          </h5>
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {t.location.tabTurboTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {t.location.tabTurboDesc}
                        </p>
                      </div>
                    )}

                    {activeTab === 'vehicle' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-[#002B49]">
                            {t.location.tabVehicle}
                          </h5>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {t.location.tabVehicleTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {t.location.tabVehicleDesc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Puntos de Referencia Clave */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                    {t.location.landmarksTitle}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                      <School className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{t.location.landmarkUnad}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                      <Building2 className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{t.location.landmarkHospital}</span>
                    </div>
                  </div>
                </div>

                {/* Horarios & Atención */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-900 block">
                      {t.location.hoursLabel}
                    </span>
                    <p className="text-slate-600 font-medium">• {t.location.hoursWeekday}</p>
                    <p className="text-slate-600 font-medium">• {t.location.hoursSaturday}</p>
                    <p className="text-emerald-700 font-bold">• {t.location.hoursVirtual}</p>
                  </div>
                </div>

              </div>

              {/* Botones de Navegación Rápida */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs active:scale-[0.99] group"
                  >
                    <Navigation className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>{t.location.openMaps}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#33CCFF] hover:bg-[#28b8e6] text-slate-900 font-extrabold px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs active:scale-[0.99]"
                  >
                    <Compass className="w-4 h-4 text-slate-900" />
                    <span>{t.location.openWaze}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-xs active:scale-[0.99]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.location.chatWhatsapp}</span>
                </a>
              </div>

            </div>

            {/* ----------------------------------------------------- */}
            {/* COLUMNA DERECHA: MAPA INTERACTIVO GEO-SITUADO (6 COLS)  */}
            {/* ----------------------------------------------------- */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-2 sm:p-3 border border-slate-200 shadow-md flex flex-col justify-between relative overflow-hidden group min-h-[380px] lg:min-h-full">
              
              <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                <iframe
                  title="Geolocalización Sede American Dream English Turbo"
                  src="https://maps.google.com/maps?q=8.091769,-76.708828&hl=es&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-[#002B49]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                    <div>
                      <h6 className="font-black text-slate-900 text-xs leading-tight">
                        American Dream English
                      </h6>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Km 1.5 Vía Nacional · Vereda Casanova
                      </span>
                    </div>
                  </div>

                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-lg transition-colors shrink-0"
                  >
                    {language === 'en' ? 'Navigate' : 'Ruta'}
                  </a>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20 text-white flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold">
                      UNAD: 500m | Hospital: 1.2km
                    </span>
                  </div>
                  <span className="font-mono text-amber-300 bg-white/10 px-2 py-0.5 rounded">
                    GPS: {coordsDMS}
                  </span>
                </div>

              </div>

              {/* Micro footer */}
              <div className="pt-2.5 px-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'en' ? 'Free private parking inside facilities' : 'Parqueadero privado gratuito vigilado'}</span>
                </span>
                <a 
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#002B49] font-black hover:underline"
                >
                  {language === 'en' ? 'Open in Maps ↗' : 'Abrir en Maps ↗'}
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
