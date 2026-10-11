'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  MessageCircle, 
  LogIn, 
  GraduationCap, 
  TrendingUp, 
  User 
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { trackEvent } from '../../lib/analytics'
import { getWhatsAppUrl } from '../../config/contact'

export function MobileBottomNav() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [selectedIdx, setSelectedIdx] = useState<number>(0)

  useEffect(() => {
    // Detectar pathname en cliente
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
      const handleLocationChange = () => setCurrentPath(window.location.pathname)
      window.addEventListener('popstate', handleLocationChange)
    }

    // Verificar sesión en Supabase
    const supabase = createClient()
    
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session?.user)
      } catch (e) {
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', () => {})
      }
    }
  }, [])

  const whatsappVisitorUrl = getWhatsAppUrl("Hola, quiero información sobre los cursos de ADE")
  const whatsappStudentUrl = getWhatsAppUrl("Hola, soy estudiante y necesito soporte")

  const visitorItems = useMemo(() => [
    { label: 'Inicio', href: '/', icon: Home, isExternal: false },
    { label: 'Cursos', href: '/cursos', icon: BookOpen, isExternal: false },
    { label: 'Tienda', href: '/tienda', icon: ShoppingBag, isExternal: false },
    { label: 'WhatsApp', href: whatsappVisitorUrl, icon: MessageCircle, isExternal: true, highlight: true },
    { label: 'Entrar', href: '/campus/login', icon: LogIn, isExternal: false },
  ], [whatsappVisitorUrl])

  const studentItems = useMemo(() => [
    { label: 'Inicio', href: '/', icon: Home, isExternal: false },
    { label: 'Aula', href: '/dashboard/aula', icon: GraduationCap, isExternal: false },
    { label: 'Progreso', href: '/dashboard/progreso', icon: TrendingUp, isExternal: false },
    { label: 'WhatsApp', href: whatsappStudentUrl, icon: MessageCircle, isExternal: true, highlight: true },
    { label: 'Perfil', href: '/dashboard/perfil', icon: User, isExternal: false },
  ], [whatsappStudentUrl])

  const navItems = isAuthenticated ? studentItems : visitorItems

  // Calcular índice activo actual según la URL
  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(item => {
      if (item.isExternal) return false
      if (item.href === '/') return currentPath === '/'
      return currentPath.startsWith(item.href)
    })
    return idx !== -1 ? idx : 0
  }, [navItems, currentPath])

  useEffect(() => {
    setSelectedIdx(activeIndex)
  }, [activeIndex])

  // Posición horizontal del centro del botón activo en porcentaje (10%, 30%, 50%, 70%, 90%)
  const activePercent = (selectedIdx * 20) + 10

  return (
    <nav 
      aria-label="Navegación inferior móvil"
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] md:hidden select-none pointer-events-auto"
    >
      <div className="relative max-w-lg mx-auto">
        
        {/* ONDA ELEVADA FLUIDA (La curva suave que sobresale arriba del botón activo) */}
        <div 
          className="absolute -top-[23px] pointer-events-none transition-all duration-300 ease-out z-10"
          style={{ 
            left: `${activePercent}%`, 
            transform: 'translateX(-50%)',
            width: '84px',
            height: '24px'
          }}
        >
          <svg 
            viewBox="0 0 84 24" 
            className="w-full h-full drop-shadow-[0_-4px_8px_rgba(0,0,0,0.05)]"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fondo de la onda blanca que empata con la barra */}
            <path 
              d="M 0 24 C 18 24, 20 0, 42 0 C 64 0, 66 24, 84 24 Z" 
              className="fill-white dark:fill-slate-900"
            />
            {/* Borde sutil superior para armonía con el borde de la barra */}
            <path 
              d="M 0 24 C 18 24, 20 0, 42 0 C 64 0, 66 24, 84 24" 
              className="stroke-slate-200/90 dark:stroke-slate-800" 
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* BARRA PRINCIPAL BLANCA ELEVADA */}
        <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.07)] h-16">
          <div className="grid grid-cols-5 h-full items-end pb-1.5 px-1 relative z-20">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const active = selectedIdx === index

              const content = (
                <div className="flex flex-col items-center justify-end h-full w-full relative">
                  
                  {/* ICONO CON EFECTO SOBRESALIENTE FLOTANTE (POPOUT) */}
                  <div 
                    className={`flex items-center justify-center transition-all duration-300 ease-out ${
                      active 
                        ? 'w-12 h-12 rounded-full -translate-y-5.5 bg-gradient-to-tr from-[#002B49] to-[#0A4B78] text-white shadow-xl shadow-[#002B49]/35 ring-4 ring-white dark:ring-slate-900 scale-105' 
                        : 'w-8 h-8 rounded-full translate-y-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    } ${
                      item.highlight && active 
                        ? 'from-emerald-600 to-teal-500 shadow-emerald-600/35' 
                        : ''
                    }`}
                  >
                    <Icon className={`transition-transform duration-200 ${
                      active ? 'w-5 h-5 stroke-[2.5]' : 'w-5 h-5 stroke-[2]'
                    }`} />
                    
                    {item.highlight && !active && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                    )}
                  </div>

                  {/* TEXTO DEBAJO */}
                  <span className={`text-[10px] tracking-tight transition-all duration-200 ${
                    active 
                      ? 'font-black text-[#002B49] dark:text-white -translate-y-1' 
                      : 'font-medium text-slate-500 dark:text-slate-400 translate-y-0'
                  }`}>
                    {item.label}
                  </span>

                </div>
              )

              if (item.isExternal) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setSelectedIdx(index)
                      trackEvent('whatsapp_click', {
                        source: 'mobile_bottom_nav',
                        role: isAuthenticated ? 'student' : 'visitor',
                        label: item.label
                      })
                    }}
                    className="flex flex-col items-center justify-end h-full py-1 text-center group active:scale-95 transition-transform"
                    title={item.label}
                  >
                    {content}
                  </a>
                )
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSelectedIdx(index)}
                  className="flex flex-col items-center justify-end h-full py-1 text-center group active:scale-95 transition-transform"
                  title={item.label}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </nav>
  )
}
