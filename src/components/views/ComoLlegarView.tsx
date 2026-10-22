'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  HelpCircle,
  GraduationCap,
  ChevronRight,
  Wifi,
  Wind,
  Coffee,
  CarFront,
  Radio,
  ArrowRight
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { SoftSwitch3D } from '../ui/SoftSwitch3D'
import { getWhatsAppUrl } from '../../config/contact'

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
  const whatsappUrl = getWhatsAppUrl('Hola American Dream English, quisiera indicaciones para llegar a la sede física en la Vereda Casanova, Turbo.')

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
        'Inform the driver or assistant to stop at "Vereda Casanova (Km 1.5)", exactly between the Casanova entrance and the gas station.',
        'The American Dream English campus is situated on the right roadway heading from Turbo to Apartadó (on your left arriving from Apartadó), with large visible institutional signage.'
      ] : [
        'Aborda cualquier bus o microbús intermunicipal en la terminal o sobre la Troncal Nacional con destino a Turbo.',
        'Indica al conductor o auxiliar que te deje en la "Vereda Casanova (Km 1.5)", exactamente entre la entrada a Casanova y la bomba de gasolina.',
        'La sede de American Dream English se encuentra ubicada sobre la calzada derecha saliendo de Turbo hacia Apartadó (sobre el costado izquierdo a tu llegada desde Apartadó), con señalización institucional visible.'
      ]
    },
    turbo: {
      origin: language === 'en' ? 'From Downtown Turbo / Port Area' : 'Desde Turbo Centro / Muelle Turístico',
      badge: language === 'en' ? 'Urban Transit · 5 min' : 'Transporte Urbano · 5 min',
      time: language === 'en' ? '5 - 7 min (2.5 km)' : '5 - 7 min (2.5 km)',
      transportType: language === 'en' ? 'Mototaxi / Urban Taxi / Local Bus' : 'Mototaxi ($3.000 - $4.000) / Taxi Urbano / Colectivo',
      steps: language === 'en' ? [
        'Head out through Carrera 14 or Calle 100 toward the National Highway (direction Apartadó).',
        'Pass the Francisco Valderrama Hospital area (1.2 km) and continue heading towards Apartadó.',
        'Stop at Vereda Casanova (Km 1.5): the campus is directly on your right roadway, right between the gas station and the Vereda Casanova entrance.'
      ] : [
        'Sal por la Carrera 14 o Calle 100 en dirección a la Troncal Nacional rumbo a Apartadó.',
        'Pasa el sector del Hospital Francisco Valderrama (1.2 km) y avanza por la vía nacional hacia Apartadó.',
        'Pide la parada en la Vereda Casanova (Km 1.5): la sede está ubicada sobre la calzada derecha, exactamente entre la bomba de gasolina y la entrada a Casanova.'
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#002B49] selection:text-white pb-16">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER (Móvil intacto / Desktop redistribuido)     */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-2xs h-16 sm:h-18">
        {/* VISTA MÓVIL: Intacta, no modificada */}
        <div className="md:hidden max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#002B49] transition-colors bg-slate-100/80 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" />
            <span>{language === 'en' ? 'Back to Home' : 'Volver al Inicio'}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Logo oficial */}
            <Link href="/" className="flex items-center group">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-11 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
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
              <span>Campus</span>
            </Link>
          </div>
        </div>

        {/* VISTA DESKTOP: Redistribución balanceada y profesional */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 lg:px-8 h-full items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Logo Institucional (hace navegación a inicio) */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus:outline-none"
            title={language === 'en' ? 'Back to Home' : 'Ir al Inicio'}
          >
            <img 
              src="/logo-american-dream.png" 
              alt="American Dream English" 
              className="h-12 lg:h-13 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#002B49] tracking-tight leading-none">
                American Dream English
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {language === 'en' ? 'Official Campus · Urabá' : 'Sede Presencial · Urabá'}
              </span>
            </div>
          </Link>

          {/* Centro: Badge contextual de Georreferenciación y Vía Nacional */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs text-slate-600 font-semibold shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" />
            <span className="font-extrabold text-[#002B49]">
              {language === 'en' ? 'Campus & Geolocation' : 'Georreferenciación & Sede'}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold text-[11px]">
              {language === 'en' ? 'Turbo - Apartadó Km 1.5' : 'Troncal Turbo - Apartadó Km 1.5'}
            </span>
          </div>

          {/* Lado Derecho: Idioma + WhatsApp Asistencia + Campus Virtual */}
          <div className="flex items-center gap-3">
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

            {/* Asistencia de Rutas WhatsApp (Pantallas grandes) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-2 rounded-xl transition-all shadow-2xs active:scale-95"
              title={language === 'en' ? 'Get route guidance via WhatsApp' : 'Solicitar guía de llegada por WhatsApp'}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'Route Help' : 'WhatsApp Guía'}</span>
            </a>

            {/* Botón CTA Campus Virtual */}
            <Link 
              href="/campus/login"
              className="inline-flex items-center gap-2 text-xs font-extrabold bg-[#002B49] text-white hover:bg-[#001f35] px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{t.nav.campusVirtual}</span>
            </Link>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO PRINCIPAL: ATMOSFERA GPS & TELEMETRÍA             */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-br from-[#001f35] via-[#07243d] to-[#041220] text-white pt-10 pb-14 sm:py-16 relative overflow-hidden">
        
        {/* Grilla sutil de radar satelital */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Halos de luz ambiental */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-blue-500/25 rounded-full blur-[110px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-24 w-[480px] h-[480px] bg-red-600/20 rounded-full blur-[110px] pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          
          {/* Badge de Telemetría GPS con radar pulse */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black px-4 py-1.5 rounded-full shadow-lg"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="tracking-wide">
              {language === 'en' ? 'Official Campus Geolocation & Satellite GPS' : 'Georreferenciación & Telemetría Satelital Oficial'}
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-slate-300 text-[11px] font-mono hidden sm:inline">Troncal Km 1.5</span>
          </motion.div>

          {/* Titular Principal con Entrada Fluida */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'en' 
                ? 'How to Get to American Dream English' 
                : '¿Cómo Llegar a American Dream English?'}
            </h1>

            <p className="text-slate-200 text-xs sm:text-base leading-relaxed font-medium max-w-3xl">
              {language === 'en'
                ? 'Strategically located along the National Highway at Km 1.5, on the right roadway heading from Turbo towards Apartadó — between the gas station and the Vereda Casanova entrance.'
                : 'Ubicados estratégicamente sobre la Troncal Nacional Km 1.5, en la calzada derecha saliendo de Turbo hacia Apartadó — entre la bomba de gasolina y la entrada a la Vereda Casanova.'}
            </p>
          </motion.div>

          {/* Quick GPS Bar & Tiempos de Estimación en Vivo */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyCoords}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-sans font-extrabold">{language === 'en' ? 'Coordinates copied!' : '¡Coordenadas copiadas!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-300" />
                  <span>GPS: {coordsDMS}</span>
                </>
              )}
            </motion.button>

            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-2xl text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Ground Elevation: 7.83 m' : 'Elevación: 7.83 m s.n.m.'}</span>
            </span>

            {/* Chips de Tiempos Estimados (ETAs) */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-2xl backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Turbo: <strong className="text-white">~5 min</strong></span>
              <span className="text-white/20">·</span>
              <span>Currulao: <strong className="text-white">~15 min</strong></span>
              <span className="text-white/20">·</span>
              <span>Apartadó: <strong className="text-white">~35 min</strong></span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MAPA SATELITAL HD DE ALTA GAMA (21st.dev Style)        */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        
        {/* BLOQUE DEL MAPA PRINCIPAL EN LA PARTE SUPERIOR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] space-y-4 overflow-hidden"
        >
          
          {/* Header del Mapa con Enlace de GPS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/20 shrink-0 border border-white/30">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {language === 'en' ? 'Interactive Campus Map (Live GPS)' : 'Mapa Satelital Interactivo de la Sede'}
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    En Servicio
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'en' 
                    ? 'Km 1.5 Turbo National Highway · Right lane heading to Apartadó (Between the gas station & Casanova entrance)' 
                    : 'Km 1.5 Vía Nacional Turbo · Calzada derecha hacia Apartadó (Entre la bomba y la entrada a Casanova)'}
                </p>
              </div>
            </div>

            {/* Acciones Rápidas de Navegación GPS */}
            <div className="flex flex-wrap items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#002B49] hover:bg-[#001f35] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#33CCFF] hover:bg-[#20bce6] text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-slate-950" />
                <span>Waze</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden min-[480px]:inline">WhatsApp Recepción</span>
                <span className="min-[480px]:hidden">WhatsApp</span>
              </motion.a>
            </div>
          </div>

          {/* Iframe del Mapa con HUD y Pin Dinámico */}
          <div className="relative w-full h-[370px] sm:h-[460px] lg:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-900 group">
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

            {/* Radar Center Pin Effect (Superpuesto en el mapa) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-red-500/30" />
                <span className="animate-pulse absolute inline-flex h-12 w-12 rounded-full bg-red-600/40" />
                <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Floating Top Badge de Sede Oficial */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-200/90 flex items-center justify-between gap-3 text-xs text-[#002B49]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 font-black">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <strong className="font-black text-slate-900 text-xs sm:text-sm leading-tight block">
                    American Dream English
                  </strong>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    Km 1.5 Vía Nacional · Vereda Casanova
                  </span>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl transition-colors shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'en' ? 'Start GPS' : 'Ruta GPS'}</span>
                <Navigation className="w-3 h-3" />
              </motion.a>
            </motion.div>

            {/* Floating Bottom Info Card con datos de orientación */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/20 text-white flex flex-wrap items-center justify-between gap-2 text-xs shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  {language === 'en' ? 'Between Gas Station & Casanova · Right lane towards Apartadó' : 'Entre la bomba y entrada Casanova · Calzada derecha hacia Apartadó'}
                </span>
              </div>
              <span className="font-mono text-amber-300 text-[11px] bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
                GPS: {coordsDMS}
              </span>
            </div>
          </div>

        </motion.div>

        {/* ========================================================= */}
        {/* 4. GUIA PASO A PASO & PUNTOS DE REFERENCIA                */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: SELECTOR DE RUTAS & DETALLES (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">
                  {language === 'en' ? 'Step-by-Step Navigation Guide' : 'Guía de Llegada Asistida'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {language === 'en' ? 'Select Your Origin Point' : 'Selecciona Tu Punto de Origen:'}
                </h3>
              </div>

              {/* Tabs de Origen con Cápsula Deslizante (LayoutId) */}
              <div className="relative bg-slate-100 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-bold">
                
                {[
                  { id: 'apartado', label: 'Urabá Sur', icon: Bus },
                  { id: 'turbo', label: 'Turbo Centro', icon: Bike },
                  { id: 'currulao', label: 'Currulao', icon: CarFront },
                  { id: 'necocli', label: 'Necoclí / Norte', icon: Bus },
                  { id: 'vehicle', label: language === 'en' ? 'Car / Moto' : 'Auto o Moto', icon: Car, wide: true },
                ].map((item) => {
                  const isActive = selectedRoute === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRoute(item.id as RegionTab)}
                      className={`relative z-10 py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                        item.wide ? 'col-span-2 sm:col-span-2' : ''
                      } ${
                        isActive ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeComoLlegarRoutePill"
                          className="absolute inset-0 bg-[#002B49] rounded-xl shadow-md -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

              </div>

              {/* Card de la Ruta Activa con Transición Suave AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedRoute}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 border border-blue-100/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm"
                >
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100/80 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                        {currentRoute.badge}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-[#002B49]">
                        {currentRoute.origin}
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold bg-white text-blue-900 px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
                      ⏱️ {currentRoute.time}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-semibold space-y-1">
                    <span className="text-slate-500 font-bold block">{language === 'en' ? 'Recommended Transit:' : 'Transporte sugerido:'}</span>
                    <p className="text-slate-900 font-black text-sm">{currentRoute.transportType}</p>
                  </div>

                  {/* Pasos de llegada con Timeline Conectado */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                      {language === 'en' ? 'Step-by-step route directions:' : 'Indicaciones paso a paso:'}
                    </span>
                    
                    <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-blue-200">
                      {currentRoute.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-700 font-medium relative">
                          <span className="w-6 h-6 rounded-full bg-[#002B49] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm border border-white/40 z-10">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

              {/* Puntos de Referencia Clave con Microinteracciones */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  {language === 'en' ? 'Visual Landmarks & Surrounding Points:' : 'Puntos de Referencia Visual:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <motion.div 
                    whileHover={{ y: -3, borderColor: '#f59e0b' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 flex items-center gap-3 transition-colors shadow-2xs"
                  >
                    <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 shadow-2xs">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">
                        {language === 'en' ? 'Gas Station & Casanova Turnoff' : 'Entre la Bomba y Entrada a Casanova'}
                      </strong>
                      <span className="text-slate-500 font-medium text-[11px] leading-tight block">
                        {language === 'en' ? 'Right roadway exiting Turbo towards Apartadó' : 'Calzada derecha saliendo de Turbo hacia Apartadó'}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -3, borderColor: '#ef4444' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 flex items-center gap-3 transition-colors shadow-2xs"
                  >
                    <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0 shadow-2xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block font-bold text-slate-900">Hospital Valderrama</strong>
                      <span className="text-slate-500 font-medium text-[11px] leading-tight block">
                        {language === 'en' ? '1.2 km towards town center' : 'A 1.2 km hacia el casco urbano'}
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>

          </div>

          {/* COLUMNA DERECHA: AMENITIES & HORARIOS (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Amenities & Servicios de la Sede Casanova */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md space-y-5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? 'Campus Amenities & Student Services:' : 'Servicios e Instalaciones de la Sede:'}
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {[
                  { icon: Wind, label: language === 'en' ? 'Air-Conditioned Rooms' : 'Aulas Climatizadas', color: 'text-blue-600' },
                  { icon: Wifi, label: language === 'en' ? 'High-Speed Fiber WiFi' : 'Zona WiFi Fibra', color: 'text-emerald-600' },
                  { icon: Car, label: language === 'en' ? 'Free Secure Parking' : 'Parqueadero Vigilado', color: 'text-indigo-600' },
                  { icon: Coffee, label: language === 'en' ? 'Bilingual Lounge Hub' : 'Cafetería & Coworking', color: 'text-amber-600' },
                ].map((amenity, idx) => {
                  const Icon = amenity.icon;
                  return (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="p-3 bg-slate-50/90 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center gap-2.5 font-bold text-slate-800 transition-colors cursor-default shadow-2xs"
                    >
                      <Icon className={`w-4 h-4 ${amenity.color} shrink-0`} />
                      <span className="leading-tight">{amenity.label}</span>
                    </motion.div>
                  );
                })}

              </div>

              {/* Horarios de Recepción Presencial con Estado en Vivo */}
              <div className="p-4 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 rounded-2xl border border-blue-100 flex items-start gap-3 text-xs">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 block font-black">
                      {language === 'en' ? 'Campus Attention & Class Hours:' : 'Horarios de Atención en Sede:'}
                    </strong>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Abierto
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    {language === 'en' ? 'Monday - Friday: 8:00 AM - 12:00 PM & 2:00 PM - 6:00 PM' : 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM'}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {language === 'en' ? 'Saturdays: 8:00 AM - 1:00 PM (Continuous)' : 'Sábados: 8:00 AM - 1:00 PM (Jornada Continua)'}
                  </p>
                </div>
              </div>

              {/* Botón WhatsApp de Ayuda con Shimmer Liquid Beam (21st.dev style) */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black px-5 py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 transition-all text-xs cursor-pointer"
              >
                {/* Rayo de luz continuo */}
                <motion.span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none"
                  animate={{ transform: ['translateX(-100%)', 'translateX(200%)'] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', repeatDelay: 1 }}
                />

                <MessageSquare className="w-4 h-4 relative z-10 shrink-0" />
                <span className="relative z-10">{language === 'en' ? 'Ask Reception for Route Help' : 'Solicitar Ayuda a Recepción por WhatsApp'}</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 stroke-[2.5] shrink-0" />
              </motion.a>

            </div>

          </div>

        </div>

      </main>

      {/* ========================================================= */}
      {/* 5. FOOTER SIMPLE                                          */}
      {/* ========================================================= */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-medium mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            American Dream English S.A.S. · Resolución Oficial Secretaría de Educación 2471
          </p>
          <p className="text-slate-400 text-[11px]">
            Sede Física: Km 1.5 Troncal Nacional, Vereda Casanova, Turbo, Antioquia · NIT 901.182.137-9
          </p>
        </div>
      </footer>

    </div>
  )
}
