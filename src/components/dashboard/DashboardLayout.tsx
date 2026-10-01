'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../utils/supabase/client'
import { ShieldLogo } from '../ShieldLogo'
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
  ChevronRight
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
      badgeBg: 'bg-crimson-600/20',
      badgeText: 'text-crimson-400',
      border: 'border-crimson-500/30',
      label: 'Admin General'
    },
    teacher: {
      badgeBg: 'bg-blue-600/20',
      badgeText: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Docente Titular'
    },
    student: {
      badgeBg: 'bg-emerald-600/20',
      badgeText: 'text-emerald-400',
      border: 'border-emerald-500/30',
      label: 'Estudiante Becario'
    }
  }

  const roleBadgeInfo = roleStyles[userRole]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col lg:flex-row">
      
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <ShieldLogo className="h-9 w-auto" />
          <div>
            <h1 className="text-xs font-black text-white">American Dream</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
              {roleBadgeInfo.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800 border border-slate-700"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-30 w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* LOGO & ROLE HEADER */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
            <Link href="/" className="mb-3 block hover:scale-105 transition-transform">
              <ShieldLogo className="h-16 w-auto" />
            </Link>
            <h2 className="text-sm font-black text-white tracking-wide">
              AMERICAN DREAM ENGLISH
            </h2>
            <p className="text-[11px] text-slate-400 mb-3">Plataforma Bilingüe Sede Urabá</p>

            {loadingUser ? (
              <div className="h-6 w-28 bg-slate-800 rounded-full animate-pulse" />
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black rounded-full border shadow-sm ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{roleBadgeInfo.label}</span>
              </span>
            )}
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Navegación Principal
            </p>

            {currentNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || activeTab === item.label

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-crimson-600 text-white shadow-lg shadow-crimson-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-black rounded-md border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER: USER CARD & LOGOUT */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
          
          {/* USER INFO CARD */}
          <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-2xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              {loadingUser ? (
                <div className="space-y-1.5 animate-pulse">
                  <div className="h-3.5 bg-slate-700 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-700 rounded w-1/2" />
                </div>
              ) : (
                <>
                  <p className="text-xs font-extrabold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                </>
              )}
            </div>

            <button
              onClick={handleSignOut}
              title="Cerrar Sesión"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-medium">
            © 2026 American Dream English S.A.S.
          </p>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER BAR */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Inicio</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-300">Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white capitalize">{title || roleBadgeInfo.label}</span>
          </div>

          {/* STATUS BADGES & SITE LINK */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-bold text-[11px]">
              <Lock className="w-3 h-3" />
              <span>SSL 256-bit Encriptado</span>
            </div>

            <Link
              href="/"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Ver Sitio Público</span>
            </Link>
          </div>

        </header>

        {/* CONTAINER FOR PAGE CONTENT */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  )
}
