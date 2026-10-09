'use client'

import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Detect pathname on client
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
      const handleLocationChange = () => setCurrentPath(window.location.pathname)
      window.addEventListener('popstate', handleLocationChange)
    }

    // Check auth status
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

  const visitorItems = [
    { label: 'Inicio', href: '/', icon: Home, isExternal: false },
    { label: 'Cursos', href: '/cursos', icon: BookOpen, isExternal: false },
    { label: 'Tienda', href: '/tienda', icon: ShoppingBag, isExternal: false },
    { label: 'WhatsApp', href: whatsappVisitorUrl, icon: MessageCircle, isExternal: true, highlight: true },
    { label: 'Entrar', href: '/login', icon: LogIn, isExternal: false },
  ]

  const studentItems = [
    { label: 'Inicio', href: '/', icon: Home, isExternal: false },
    { label: 'Aula', href: '/dashboard/aula', icon: GraduationCap, isExternal: false },
    { label: 'Progreso', href: '/dashboard/progreso', icon: TrendingUp, isExternal: false },
    { label: 'WhatsApp', href: whatsappStudentUrl, icon: MessageCircle, isExternal: true, highlight: true },
    { label: 'Perfil', href: '/dashboard/perfil', icon: User, isExternal: false },
  ]

  const navItems = isAuthenticated ? studentItems : visitorItems

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/'
    return currentPath.startsWith(href)
  }

  return (
    <nav 
      aria-label="Navegación inferior móvil"
      className="fixed bottom-0 left-0 right-0 z-50 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden transition-colors select-none"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('whatsapp_click', {
                    source: 'mobile_bottom_nav',
                    role: isAuthenticated ? 'student' : 'visitor',
                    label: item.label
                  })
                }}
                className="flex flex-col items-center justify-center py-1 px-0.5 text-center group active:scale-[0.95] select-none transition-transform"
                title={item.label}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  item.highlight ? 'text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2.25]" />
                  {item.highlight && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                  item.highlight ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {item.label}
                </span>
              </a>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center py-1 px-0.5 text-center group active:scale-[0.95] select-none transition-transform"
              title={item.label}
            >
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                active 
                  ? 'text-crimson-600 dark:text-crimson-500 bg-red-50/80 dark:bg-red-950/40 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
              }`}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight transition-colors ${
                active 
                  ? 'font-extrabold text-crimson-600 dark:text-crimson-500' 
                  : 'font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
