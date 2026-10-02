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
  id?: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  currentRole?: UserRole
  activeTab?: string
  onTabChange?: (tabId: string) => void
  title?: string
}

export function DashboardLayout({
  children,
  currentRole: propRole,
  activeTab,
  onTabChange,
  title
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>(propRole || 'admin')
  const [userName, setUserName] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [loadingUser, setLoadingUser] = useState<boolean>(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

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

  // Navigation Items by Role (Pure State or Path matching - 100% SSR Safe)
  const navItemsByRole: Record<UserRole, NavItem[]> = {
    admin: [
      { id: 'overview', label: 'Visión General', href: '/dashboard/admin', icon: LayoutDashboard },
      { id: 'leads', label: 'Prospectos & Leads', href: '/dashboard/admin', icon: Inbox, badge: 'Nuevo' },
      { id: 'estudiantes', label: 'Estudiantes & Matrículas', href: '/dashboard/admin', icon: Users, badge: 'Prioritario' },
      { id: 'products', label: 'Catálogo Cursos & Aulas', href: '/dashboard/admin/products', icon: Package },
      { id: 'becas', label: 'Postulaciones Becas Urabá', href: '/dashboard/admin', icon: GraduationCap },
      { id: 'donaciones', label: 'Fondos & Donaciones', href: '/dashboard/admin', icon: Heart }
    ],
    teacher: [
      { label: 'Mis Clases Sincrónicas', href: '/dashboard/teacher', icon: Video },
      { label: 'Registro de Asistencia', href: '/dashboard/teacher', icon: CheckSquare },
      { label: 'Mi Perfil Docente', href: '/dashboard/teacher', icon: User }
    ],
    student: [
      { label: 'Mi Aula Virtual', href: '/dashboard/student', icon: BookOpen },
      { label: 'Progreso MCER', href: '/dashboard/student', icon: Award },
      { label: 'Horas Acumuladas', href: '/dashboard/student', icon: Clock }
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
    // MARCO CONTENEDOR FLOTANTE PERSISTENTE (App Canvas Unificado)
    <div className="h-screen bg-slate-100/90 text-slate-800 font-sans p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden">
      
      {/* UNIFIED CANVAS FRAME (Fixed Full Height) */}
      <div className="w-full max-w-[1550px] h-full max-h-[94vh] bg-white rounded-[32px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <a href="https://americandreamenglish.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-9 w-auto object-contain" 
              />
            </a>
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

        {/* SIDEBAR ESTRICTAMENTE PERSISTENTE (FIJO A LA IZQUIERDA) */}
        <aside
          className={`fixed lg:relative top-0 left-0 z-30 w-72 h-full bg-slate-900 text-white flex flex-col justify-between shrink-0 transition-transform duration-300 lg:translate-x-0 overflow-hidden ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
            
            {/* LOGO INSTITUCIONAL CON CONTENEDOR DE REALCE */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800/80">
              <div className="w-full p-3 rounded-2xl bg-white/10 border border-white/15 shadow-sm flex items-center justify-center backdrop-blur-sm mb-3">
                <a href="https://americandreamenglish.com" target="_blank" rel="noopener noreferrer" className="block hover:scale-105 transition-transform">
                  <img 
                    src="/logo-american-dream.png" 
                    alt="American Dream English" 
                    className="h-16 w-auto object-contain drop-shadow-md mx-auto" 
                  />
                </a>
              </div>
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

            {/* NAVIGATION LINKS */}
            <nav className="space-y-2 pr-0 lg:-mr-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Navegación Principal
              </p>

              {currentNavItems.map((item) => {
                const Icon = item.icon

                let isActive = false
                if (activeTab && item.id) {
                  isActive = activeTab === item.id || activeTab === item.label
                } else if (activeTab === item.label) {
                  isActive = true
                } else {
                  isActive = pathname === item.href
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false)
                      if (onTabChange && item.id && item.href.startsWith('/dashboard/admin') && !item.href.includes('/products')) {
                        e.preventDefault()
                        onTabChange(item.id)
                      }
                    }}
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
          <div className="p-4 border-t border-slate-800/80 bg-[#090e1a] space-y-3 shrink-0">
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

        {/* ÁREA PRINCIPAL DE CONTENIDO */}
        <div className="flex-1 flex flex-col min-w-0 bg-white p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden h-full">
          
          {/* TOP BREADCRUMB & STATUS BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6 shrink-0">
            
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <a href="https://americandreamenglish.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Inicio</span>
              </a>
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

              <a
                href="https://americandreamenglish.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold rounded-xl text-xs transition-colors border border-slate-200 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Ver Sitio Público</span>
              </a>
            </div>

          </div>

          {/* PAGE CONTENT */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>

      </div>

    </div>
  )
}
