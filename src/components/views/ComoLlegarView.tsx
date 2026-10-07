'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Navigation, 
  Compass, 
  ArrowLeft, 
  Clock, 
  Phone, 
  Bus, 
  Car, 
  Bike, 
  Check, 
  Copy, 
  ExternalLink, 
  MessageSquare, 
  Building2, 
  School, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  HelpCircle,
  GraduationCap,
  ChevronRight,
  Wifi,
  Wind,
  Coffee,
  CarFront
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { SoftSwitch3D } from '../ui/SoftSwitch3D'

type RegionTab = 'apartado' | 'turbo' | 'currulao' | 'necocli' | 'vehicle'

export function ComoLlegarView() {
  const { language, setLanguage, t } = useLanguage()
  const [selectedRoute, setSelectedRoute] = useState<RegionTab>('apartado')
  const [copied, setCopied] = useState(false)

  // Coordenadas satelitales oficiales exactas
  const coordsDMS = "8°05'30.37\"N 76°42'31.78\"W"
  const coordsDecimal = "8.091769,-76.708828"

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordsDecimal}`
  const wazeUrl = `https://waze.com/ul?ll=${coordsDecimal}&navigate=yes`
  const whatsappUrl = 'https://wa.me/573124567890?text=Hola,%20quisiera%20indicaciones%20para%20llegar%20a%20la%20sede%20de%20American%20Dream%20English%20en%20la%20Vereda%20Casanova,%20Turbo'

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(coordsDMS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const routesData = {
    apartado: {
      origin: language === 'en' ? 'From Apartadó / Carepa / Chigorodó' : 'Desde Apartadó / Carepa / Chigorodó',
      badge: language === 'en' ? 'Regional Transit · Urabá Sur' : 'Transporte Intermunicipal · Urabá Sur',
      time: language === 'en' ? '30 - 40 min (~30 km)' : '30 - 40 min (~30 km)',
      transportType: language === 'en' ? 'Regional Buses (Cootransuroccidente / Sotragolfo)' : 'Buses Intermunicipales (Cootransuroccidente, Sotragolfo, Cootransur)',
      steps: language === 'en' ? [
        'Take any regional bus or van from the transport terminal or national highway heading to Turbo.',
        'Inform the driver or assistant to stop at "Vereda Casanova (Km 1.5)", right 500 meters after the UNAD University turnoff.',
        'The American Dream English campus is situated right on the main paved highway with large institutional signage on your right.'
      ] : [
        'Aborda cualquier bus o microbús intermunicipal en la terminal o sobre la Troncal Nacional con destino a Turbo.',
        'Indica al conductor o auxiliar que te deje en la "Vereda Casanova (Km 1.5)", exactamente 500 metros después de la entrada a la UNAD.',
        'La sede de American Dream English se encuentra sobre el margen derecho de la vía nacional pavimentada, con señalización institucional visible.'
      ]
    },
    turbo: {
      origin: language === 'en' ? 'From Downtown Turbo / Port Area' : 'Desde Turbo Centro / Muelle Turístico',
      badge: language === 'en' ? 'Urban Transit · 5 min' : 'Transporte Urbano · 5 min',
      time: language === 'en' ? '5 - 7 min (2.5 km)' : '5 - 7 min (2.5 km)',
      transportType: language === 'en' ? 'Mototaxi / Urban Taxi / Local Bus' : 'Mototaxi ($3.000 - $4.000) / Taxi Urbano / Colectivo',
      steps: language === 'en' ? [
        'Head out through Carrera 14 or Calle 100 toward the National Highway (direction Apartadó).',
        'Pass the Francisco Valderrama Hospital area and continue approximately 1.5 km.',
        'Stop at Vereda Casanova. The campus is on your left before reaching the UNAD junction.'
      ] : [
        'Sal por la Carrera 14 o Calle 100 en dirección a la Troncal Nacional rumbo a Apartadó.',
        'Pasa el sector del Hospital Francisco Valderrama y avanza aproximadamente 1.5 kilómetros.',
        'Pide la parada en la Vereda Casanova. La sede estará sobre tu costado izquierdo antes de llegar al cruce de la UNAD.'
      ]
    },
    currulao: {
      origin: language === 'en' ? 'From Currulao / El Tres / Nueva Colonia' : 'Desde Currulao / El Tres / Nueva Colonia',
      badge: language === 'en' ? 'Direct Highway Access' : 'Acceso Directo por Troncal',
      time: language === 'en' ? '12 - 18 min (~15 km)' : '12 - 18 min (~15 km)',
      transportType: language === 'en' ? 'Intermunicipal Bus / Motorcycle' : 'Microbús Intermunicipal / Moto',
      steps: language === 'en' ? [
        'Take the national highway towards Turbo.',
        'Pass the industrial and banana logistics hubs.',
        'Stop at Vereda Casanova (Km 1.5), directly across the highway from the main campus.'
      ] : [
        'Toma la Troncal Nacional en dirección hacia Turbo.',
        'Pasa los sectores industriales y agrobananeros de la zona.',
        'Bájate en la Vereda Casanova (Km 1.5), justo al frente de las instalaciones principales de la institución.'
      ]
    },
    necocli: {
      origin: language === 'en' ? 'From Necoclí / San Juan / Arboletes' : 'Desde Necoclí / San Juan de Urabá / Arboletes',
      badge: language === 'en' ? 'Northern Coastal Route' : 'Ruta Costera Norte',
      time: language === 'en' ? '45 - 60 min' : '45 - 60 min',
      transportType: language === 'en' ? 'Intermunicipal Bus via Turbo' : 'Buses de Transporte Costero vía Turbo',
      steps: language === 'en' ? [
        'Arrive at the central transport station or main entrance of Turbo.',
        'Take the highway exit toward Apartadó for 1.5 km.',
        'Arrive at Vereda Casanova (American Dream English Campus).'
      ] : [
        'Llega a la entrada principal o terminal de transportes de Turbo.',
        'Toma el enlace hacia la Troncal Nacional rumbo a Apartadó durante 1.5 km.',
        'Llegas directamente a la Vereda Casanova (Sede American Dream English).'
      ]
    },
    vehicle: {
      origin: language === 'en' ? 'By Private Car or Motorcycle' : 'En Auto Particular o Motocicleta',
      badge: language === 'en' ? 'Free Secure Parking' : 'Parqueadero Privado Gratis',
      time: language === 'en' ? 'Direct Highway Transit' : 'Acceso 100% Pavimentado',
      transportType: language === 'en' ? 'GPS Turn-by-Turn Navigation' : 'Navegación GPS asistida por Google Maps / Waze',
      steps: language === 'en' ? [
        'Enter coordinates 8.091769, -76.708828 into Google Maps or Waze.',
        'Drive along the paved national highway to Km 1.5 (Vereda Casanova).',
        'Park inside our private, gated, and surveillance-monitored student parking lot for free.'
      ] : [
        'Ingresa las coordenadas 8.091769, -76.708828 en tu aplicación de Google Maps o Waze.',
        'Conduce sobre la Troncal Nacional pavimentada hasta el Km 1.5 (Vereda Casanova).',
        'Ingresa directamente al parqueadero privado, vigilado y totalmente gratuito dentro de nuestras instalaciones.'
      ]
    }
  }

  const currentRoute = routesData[selectedRoute]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#002B49] selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER                                             */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-2xs h-16 sm:h-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#002B49] transition-colors bg-slate-100/80 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" />
            <span>{language === 'en' ? 'Back to Home' : 'Volver al Inicio'}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Logo oficial miniatura */}
            <Link href="/" className="hidden sm:flex items-center gap-2">
              <img 
                src="/images/logo.png" 
                alt="American Dream English" 
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Switch de Idioma */}
            <div className="flex items-center px-2 py-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs">
              <SoftSwitch3D
                checked={language === 'en'}
                onChange={(isEn) => setLanguage(isEn ? 'en' : 'es')}
                leftLabel="ES"
                rightLabel="EN"
                size="sm"
                ariaLabel="Toggle language"
              />
            </div>

            {/* Botón CTA Campus */}
            <Link 
              href="/campus/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#002B49] text-white hover:bg-[#001f35] px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.campusVirtual}</span>
              <span className="sm:hidden">Campus</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO PRINCIPAL DE GEOLOCALIZACIÓN                      */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-br from-[#002B49] via-[#083556] to-[#0D1B2A] text-white py-12 sm:py-20 relative overflow-hidden">
        
        {/* Luces de fondo ambientales */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>{language === 'en' ? 'Official Campus Geolocation & Navigation' : 'Georreferenciación & Navegación Satelital Oficial'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'en' 
                ? 'How to Get to American Dream English' 
                : '¿Cómo Llegar a American Dream English?'}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
              {language === 'en'
                ? 'Strategically located at Km 1.5 on the paved National Highway in Vereda Casanova, Turbo — just 500 meters from UNAD University and close to Francisco Valderrama Hospital.'
                : 'Ubicados estratégicamente sobre la Troncal Nacional Km 1.5 en la Vereda Casanova, Turbo — a solo 500 metros de la UNAD y cerca al Hospital Francisco Valderrama.'}
            </p>

            {/* Quick GPS Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyCoords}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-white transition-all shadow-sm active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">{language === 'en' ? 'Coordinates copied!' : '¡Coordenadas copiadas!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-300" />
                    <span>GPS: {coordsDMS}</span>
                  </>
                )}
              </button>

              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-2xl text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Ground Elevation: 7.83 m' : 'Elevación: 7.83 m s.n.m.'}</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. EXPERIENCIA INTERACTIVA: RUTAS & MAPA SATELITAL        */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUMNA IZQUIERDA: SELECTOR DE RUTAS & DETALLES (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Box selector de origen */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  {language === 'en' ? 'Step 1: Select Your Origin Point' : 'Paso 1: Selecciona Tu Punto de Origen'}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'en' ? 'Custom Route Instructions' : 'Instrucciones Personalizadas de Ruta'}
                </h3>
              </div>

              {/* Tabs de Origen */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                
                <button
                  type="button"
                  onClick={() => setSelectedRoute('apartado')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoute === 'apartado'
                      ? 'bg-[#002B49] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Bus className="w-4 h-4 shrink-0" />
                  <span>Urabá Sur</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoute('turbo')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoute === 'turbo'
                      ? 'bg-[#002B49] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Bike className="w-4 h-4 shrink-0" />
                  <span>Turbo Centro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoute('currulao')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoute === 'currulao'
                      ? 'bg-[#002B49] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <CarFront className="w-4 h-4 shrink-0" />
                  <span>Currulao / El Tres</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoute('necocli')}
                  className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoute === 'necocli'
                      ? 'bg-[#002B49] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Bus className="w-4 h-4 shrink-0" />
                  <span>Necoclí / Norte</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoute('vehicle')}
                  className={`col-span-2 sm:col-span-2 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    selectedRoute === 'vehicle'
                      ? 'bg-[#002B49] text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>{language === 'en' ? 'Private Car / Moto' : 'Auto Particular o Moto'}</span>
                </button>

              </div>

              {/* Card de la Ruta Activa */}
              <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/60 border border-blue-100 rounded-3xl p-5 sm:p-6 space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                      {currentRoute.badge}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#002B49]">
                      {currentRoute.origin}
                    </h4>
                  </div>
                  <span className="text-xs font-bold bg-white text-blue-900 px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
                    ⏱️ {currentRoute.time}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-semibold space-y-1">
                  <span className="text-slate-500 font-bold block">{language === 'en' ? 'Recommended Transit:' : 'Transporte sugerido:'}</span>
                  <p className="text-slate-900 font-extrabold">{currentRoute.transportType}</p>
                </div>

                {/* Pasos de llegada */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    {language === 'en' ? 'Step-by-step route directions:' : 'Indicaciones paso a paso:'}
                  </span>
                  
                  <div className="space-y-2.5">
                    {currentRoute.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                        <span className="w-6 h-6 rounded-full bg-[#002B49] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-2xs">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Puntos de Referencia Clave */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  {language === 'en' ? 'Visual Landmarks & Surrounding Points:' : 'Puntos de Referencia Visual:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">UNAD Turbo</strong>
                      <span className="text-slate-500 font-medium">{language === 'en' ? 'A 500m walking distance' : 'A 500 metros sobre la vía'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">Hospital Valderrama</strong>
                      <span className="text-slate-500 font-medium">{language === 'en' ? '1.2 km towards town center' : 'A 1.2 km hacia el casco urbano'}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Botones de Acción de Navegación */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? 'Launch Real-Time GPS Directions:' : 'Lanzar Navegación GPS en Vivo:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs active:scale-95 group"
                >
                  <Navigation className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>{language === 'en' ? 'Directions in Google Maps' : 'Iniciar en Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#33CCFF] hover:bg-[#20bce6] text-slate-950 font-extrabold px-5 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs active:scale-95"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>{language === 'en' ? 'Navigate with Waze' : 'Navegar con Waze'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'en' ? 'Ask Reception for Route Help via WhatsApp' : 'Solicitar Ayuda de Ruta a Recepción por WhatsApp'}</span>
              </a>
            </div>

          </div>

          {/* COLUMNA DERECHA: MAPA SATELITAL HD & FICHA TÉCNICA (6 COLS) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Mapa Satelital HD Embebido */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-md flex flex-col justify-between relative overflow-hidden h-[480px] sm:h-[540px]">
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
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
                <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs text-[#002B49]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
                    <div>
                      <h6 className="font-black text-slate-900 text-xs sm:text-sm leading-tight">
                        American Dream English
                      </h6>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        Km 1.5 Vía Nacional · Vereda Casanova
                      </span>
                    </div>
                  </div>

                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition-colors shrink-0 shadow-sm"
                  >
                    {language === 'en' ? 'Start GPS' : 'Ruta GPS'}
                  </a>
                </div>

                {/* Floating Bottom Info Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold">
                      UNAD: 500m | Hospital: 1.2km
                    </span>
                  </div>
                  <span className="font-mono text-amber-300 text-[11px] bg-white/10 px-2.5 py-1 rounded-xl">
                    GPS: {coordsDMS}
                  </span>
                </div>

              </div>

            </div>

            {/* Amenities & Servicios de la Sede Casanova */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? 'Campus Amenities & Student Services:' : 'Servicios e Instalaciones de la Sede:'}
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 font-bold text-slate-800">
                  <Wind className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{language === 'en' ? 'Air-Conditioned Rooms' : 'Aulas Climatizadas'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 font-bold text-slate-800">
                  <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'en' ? 'High-Speed Fiber WiFi' : 'Zona WiFi Fibra Óptica'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 font-bold text-slate-800">
                  <Car className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{language === 'en' ? 'Free Secure Parking' : 'Parqueadero Vigilado'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 font-bold text-slate-800">
                  <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{language === 'en' ? 'Bilingual Lounge Hub' : 'Cafetería & Coworking'}</span>
                </div>

              </div>

              {/* Horarios de Recepción Presencial */}
              <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start gap-3 text-xs">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-slate-900 block font-black">
                    {language === 'en' ? 'Campus Attention & Class Hours:' : 'Horarios de Atención en Sede:'}
                  </strong>
                  <p className="text-slate-600 font-medium">
                    {language === 'en' ? 'Monday - Friday: 8:00 AM - 12:00 PM & 2:00 PM - 6:00 PM' : 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM'}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {language === 'en' ? 'Saturdays: 8:00 AM - 1:00 PM (Continuous)' : 'Sábados: 8:00 AM - 1:00 PM (Jornada Continua)'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* ========================================================= */}
      {/* 4. FOOTER SIMPLE                                          */}
      {/* ========================================================= */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            American Dream English S.A.S. · Resolución Oficial Secretaría de Educación 2471
          </p>
          <p className="text-slate-400">
            Km 1.5 Vía Nacional, Vereda Casanova, Turbo, Antioquia · Urabá Colombiano
          </p>
        </div>
      </footer>

    </div>
  )
}
