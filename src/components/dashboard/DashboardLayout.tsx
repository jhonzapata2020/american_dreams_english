'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../utils/supabase/client'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  GraduationCap, 
  Heart, 
  Video, 
  CheckSquare, 
  User, 
  BookOpen, 
  Award, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Menu, 
  X,
  ChevronRight,
  Inbox
} from 'lucide-react'

export type UserRole = 'admin' | 'teacher' | 'student'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  currentRole?: UserRole
  activeTab?: string
  title?: string
}

export function DashboardLayout({
  children,
  currentRole: propRole,
  activeTab,
  title
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>(propRole || 'admin')
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [loadingUser, setLoadingUser] = useState<boolean>(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [currentHash, setCurrentHash] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash)
    }

    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [pathname])

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setUserEmail(user.email || '')
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', user.id)
            .single()

          if (profile) {
            if (profile.full_name) setUserName(profile.full_name)
            if (profile.role && !propRole) {
              const mappedRole = profile.role.toLowerCase() as UserRole
              if (['admin', 'teacher', 'student'].includes(mappedRole)) {
                setUserRole(mappedRole)
              }
            }
          }
          if (!userName) {
            setUserName(user.email?.split('@')[0] || 'Usuario ADE')
          }
        } else {
          setUserName('Usuario Pruebas')
          setUserEmail('admin@americandream.edu.co')
        }
      } catch (err) {
        console.error('Error al cargar la sesión del usuario:', err)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUserProfile()
  }, [propRole])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      router.push('/login')
    }
  }

  // Define navigation options by role
  const navItemsByRole: Record<UserRole, NavItem[]> = {
    admin: [
      { label: 'Visión General', href: '/dashboard/admin', icon: LayoutDashboard },
      { label: 'Prospectos & Leads', href: '/dashboard/admin#leads', icon: Inbox, badge: 'Nuevo' },
      { label: 'Estudiantes & Matrículas', href: '/dashboard/admin#estudiantes', icon: Users, badge: 'Prioritario' },
      { label: 'Catálogo Cursos & Aulas', href: '/dashboard/admin/products', icon: Package },
      { label: 'Postulaciones Becas Urabá', href: '/dashboard/admin#becas', icon: GraduationCap },
      { label: 'Fondos & Donaciones', href: '/dashboard/admin#donaciones', icon: Heart }
    ],
    teacher: [
      { label: 'Mis Clases Sincrónicas', href: '/dashboard/teacher', icon: Video },
      { label: 'Registro de Asistencia', href: '/dashboard/teacher#asistencia', icon: CheckSquare },
      { label: 'Mi Perfil Docente', href: '/dashboard/teacher#perfil', icon: User }
    ],
    student: [
      { label: 'Mi Aula Virtual', href: '/dashboard/student', icon: BookOpen },
      { label: 'Progreso MCER', href: '/dashboard/student#progreso', icon: Award },
      { label: 'Horas Acumuladas', href: '/dashboard/student#horas', icon: Clock }
    ]
  }

  const currentNavItems = navItemsByRole[userRole] || navItemsByRole.admin

  const roleStyles: Record<UserRole, { badgeBg: string; badgeText: string; border: string; label: string }> = {
    admin: {
      badgeBg: 'bg-white/10',
      badgeText: 'text-slate-200',
      border: 'border-white/15',
      label: 'Admin General'
    },
    teacher: {
      badgeBg: 'bg-white/10',
      badgeText: 'text-slate-200',
      border: 'border-white/15',
      label: 'Docente Titular'
    },
    student: {
      badgeBg: 'bg-white/10',
      badgeText: 'text-slate-200',
      border: 'border-white/15',
      label: 'Estudiante Becario'
    }
  }

  const roleBadgeInfo = roleStyles[userRole]

  return (
    // 1. MARCO CONTENEDOR FLOTANTE (App Canvas Unificado Inspirado en eProduct)
    <div className="min-h-screen bg-slate-100/90 text-slate-800 font-sans p-2 sm:p-6 md:p-8 flex items-center justify-center">
      
      {/* UNIFIED CANVAS FRAME (Sidebar + Main Content Inside Single Frame) */}
      <div className="w-full max-w-[1550px] min-h-[90vh] bg-white rounded-[32px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-[#0c1322] text-white border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-9 w-auto object-contain" 
              />
            </Link>
            <div>
              <h1 className="text-xs font-black text-white">American Dream</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
                {roleBadgeInfo.label}
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white rounded-xl bg-white/10 border border-white/20"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 2. SIDEBAR INTEGRADO EN AZUL MARINO NOCHE PROFUNDO (#0c1322) */}
        <aside
          className={`fixed lg:relative top-0 left-0 z-30 w-72 min-h-full bg-[#0c1322] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* LOGO INSTITUCIONAL ORIGINAL (ESCUDO ROJO, AZUL Y BLANCO) */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800/80">
              <Link href="/" className="mb-3 block hover:scale-105 transition-transform">
                <img 
                  src="/logo-american-dream.png" 
                  alt="American Dream English" 
                  className="h-16 w-auto object-contain drop-shadow-md mx-auto" 
                />
              </Link>
              <h2 className="text-sm font-black text-white tracking-wide">
                AMERICAN DREAM ENGLISH
              </h2>
              <p className="text-[11px] text-slate-400 mb-3 font-medium">Plataforma Bilingüe Sede Urabá</p>

              {loadingUser ? (
                <div className="h-6 w-28 bg-slate-800 rounded-full animate-pulse" />
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border shadow-sm ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{roleBadgeInfo.label}</span>
                </span>
              )}
            </div>

            {/* NAVIGATION LINKS WITH PROMINENT WHITE TAB FOR ACTIVE ITEM */}
            <nav className="space-y-2 pr-0 lg:-mr-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Navegación Principal
              </p>

              {currentNavItems.map((item) => {
                const Icon = item.icon
                const [itemPath, itemHash] = item.href.split('#')
                const formattedItemHash = itemHash ? `#${itemHash}` : ''

                let isActive = false

                if (activeTab === item.label) {
                  isActive = true
                } else if (formattedItemHash) {
                  isActive = pathname === itemPath && currentHash === formattedItemHash
                } else {
                  isActive = pathname === itemPath && (!currentHash || currentHash === '#')
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 rounded-l-2xl shadow-md lg:rounded-r-none relative font-extrabold text-sm'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white rounded-xl mr-4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                        isActive ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* SIDEBAR FOOTER: USER CARD & LOGOUT */}
          <div className="p-4 border-t border-slate-800/80 bg-[#090e1a] space-y-3">
            
            {/* USER INFO CARD */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                {loadingUser ? (
                  <div className="space-y-1.5 animate-pulse">
                    <div className="h-3.5 bg-slate-800 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-800 rounded w-1/2" />
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-white truncate">{userName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                  </>
                )}
              </div>

              <button
                onClick={handleSignOut}
                title="Cerrar Sesión"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-medium">
              © 2026 American Dream English S.A.S.
            </p>
          </div>

        </aside>

        {/* 3. ÁREA PRINCIPAL DE CONTENIDO (Panel Blanco Derecha) */}
        <div className="flex-1 flex flex-col min-w-0 bg-white p-4 sm:p-8 md:p-10 overflow-y-auto">
          
          {/* TOP BREADCRUMB & STATUS BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Inicio</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 capitalize font-bold">{title || roleBadgeInfo.label}</span>
            </div>

            {/* STATUS BADGES */}
            <div className="flex items-center gap-3 text-xs">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium text-[11px]">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>SSL 256-bit Encriptado</span>
              </div>

              <Link
                href="/"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl text-xs transition-colors border border-slate-200 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Ver Sitio Público</span>
              </Link>
            </div>

          </div>

          {/* PAGE CONTENT (STUDENT CRUD & BENTO MODULES) */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>

      </div>

    </div>
  )
}
