import React from 'react'
import { 
  MapPin, 
  Clock, 
  Phone, 
  ExternalLink, 
  MessageSquare, 
  Building2, 
  Navigation,
  ShieldCheck
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export const LocationSection: React.FC = () => {
  const { language, t } = useLanguage()
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Turbo+Antioquia+Colombia'
  const whatsappUrl = 'https://wa.me/573124567890?text=Hola,%20quisiera%20informaci%C3%B3n%20sobre%20las%20clases%20presenciales%20en%20la%20sede%20de%20Turbo'

  return (
    <section id="sede-presencial" className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO DE SECCIÓN */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#002B49]/10 border border-[#002B49]/20 text-[#002B49] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            <Building2 className="w-3.5 h-3.5 text-[#002B49]" />
            <span>{t.location.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {t.location.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {t.location.subtitle}
          </p>
        </div>

        {/* CONTENEDOR 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* COLUMNA IZQUIERDA: DATOS DE ATENCIÓN Y CONTACTO (5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Dirección Física */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-2xs border border-red-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {t.location.addressLabel}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 leading-snug">
                    {t.location.addressValue}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.location.addressSub}
                  </p>
                </div>
              </div>

              {/* Horarios de Atención */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {t.location.hoursLabel}
                  </span>
                  <div className="text-xs text-slate-700 font-semibold space-y-1">
                    <p>• {t.location.hoursWeekday}</p>
                    <p>• {t.location.hoursSaturday}</p>
                    <p className="text-emerald-700 font-bold">• {t.location.hoursVirtual}</p>
                  </div>
                </div>
              </div>

              {/* Contacto Directo */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs border border-amber-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {t.location.phoneLabel}
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {t.location.phoneValue}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.location.phoneSub}
                  </p>
                </div>
              </div>

            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold px-5 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all text-xs active:scale-[0.99] group"
              >
                <Navigation className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>{t.location.openMaps}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all text-xs active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.location.chatWhatsapp}</span>
              </a>
            </div>

          </div>

          {/* COLUMNA DERECHA: MAPA INTERACTIVO (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
              <iframe
                title="Ubicación Sede American Dream English Turbo"
                src="https://maps.google.com/maps?q=Turbo%20Antioquia%20Colombia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Floating Badge sobre el mapa */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200/80 flex items-center gap-2 text-xs font-extrabold text-[#002B49]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>📍 {language === 'en' ? 'American Dream English Official Campus · Turbo, Urabá' : 'Sede Oficial American Dream English · Turbo, Urabá'}</span>
              </div>
            </div>

            {/* Micro footer debajo del mapa */}
            <div className="pt-3 px-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Parking and direct transit on national road' : 'Parqueadero y fácil acceso vehicular sobre vía nacional'}</span>
              </span>
              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#002B49] font-bold hover:underline"
              >
                {language === 'en' ? 'Full screen ↗' : 'Ver pantalla completa ↗'}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
