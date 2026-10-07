'use client'

import React, { useState } from 'react'
import { 
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
  Layers,
  Sparkles,
  School
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

type RouteTab = 'apartado' | 'turbo' | 'vehicle'

export const LocationSection: React.FC = () => {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<RouteTab>('apartado')
  const [copied, setCopied] = useState(false)

  // Coordenadas oficiales exactas extraídas de geolocalización satelital
  const coordsDMS = "8°05'30.37\"N 76°42'31.78\"W"
  const coordsDecimal = "8.091769,-76.708828"
  
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordsDecimal}`
  const wazeUrl = `https://waze.com/ul?ll=${coordsDecimal}&navigate=yes`
  const whatsappUrl = 'https://wa.me/573124567890?text=Hola,%20quisiera%20indicaciones%20para%20llegar%20a%20la%20sede%20de%20American%20Dream%20English%20en%20Turbo'

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsDMS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="sede-presencial" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO PRINCIPAL DE SECCIÓN */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#002B49] text-xs font-black px-4 py-1.5 rounded-full shadow-2xs">
            <Compass className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <span>{t.location.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {t.location.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            {t.location.subtitle}
          </p>
        </div>

        {/* CONTENEDOR MAESTRO DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: EXPERIENCIA DE RUTA & DATOS (6 COLS)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Badge de Dirección Física & Coordenadas */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      {t.location.addressLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      {t.location.addressValue}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {t.location.addressSub}
                    </span>
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

              {/* Selector Interactivo de Rutas ("Cómo Llegar") */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    {t.location.routesTitle}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {t.location.elevationLabel}: <strong className="text-slate-700">{t.location.elevationValue}</strong>
                  </span>
                </div>

                {/* Tabs de Selección */}
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

                {/* Detalle de la Ruta Activa */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 transition-all">
                  {activeTab === 'apartado' && (
                    <div className="space-y-2 animate-fadeIn">
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
                    <div className="space-y-2 animate-fadeIn">
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
                    <div className="space-y-2 animate-fadeIn">
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

              {/* Puntos de Referencia Clave (Landmarks) */}
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
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-slate-900 block">
                    {t.location.hoursLabel}
                  </span>
                  <p className="text-slate-600 font-medium">• {t.location.hoursWeekday}</p>
                  <p className="text-slate-600 font-medium">• {t.location.hoursSaturday}</p>
                  <p className="text-emerald-700 font-bold">• {t.location.hoursVirtual}</p>
                </div>
              </div>

            </div>

            {/* BOTONES DE NAVEGACIÓN EN VIVO (GOOGLE MAPS, WAZE & WHATSAPP) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
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

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: MAPA INTERACTIVO GEO-SITUADO (6 COLS)     */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-lg flex flex-col justify-between relative overflow-hidden group">
            
            <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
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

              {/* Floating Badge sobre el mapa interactivo */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-[#002B49]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
                  <div>
                    <h6 className="font-black text-slate-900 text-xs">
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
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-lg transition-colors shrink-0"
                >
                  {language === 'en' ? 'Navigate' : 'Ruta'}
                </a>
              </div>

              {/* Floating Bottom Card: Referencias Satelitales */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">
                    {language === 'en' ? 'UNAD: 500m | Hospital: 1.2km' : 'UNAD: 500m | Hospital: 1.2km'}
                  </span>
                </div>
                <span className="font-mono text-amber-300 text-[10px] bg-white/10 px-2 py-0.5 rounded">
                  GPS: {coordsDMS}
                </span>
              </div>

            </div>

            {/* Micro footer debajo del mapa */}
            <div className="pt-3 px-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Free private parking inside facilities' : 'Parqueadero privado gratuito vigilado dentro de la sede'}</span>
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
    </section>
  )
}
