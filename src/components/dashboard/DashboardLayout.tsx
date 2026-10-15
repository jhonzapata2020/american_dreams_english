'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  ChevronLeft,
  Inbox,
  Receipt,
  DollarSign,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react'

export type UserRole = 'admin' | 'teacher' | 'student'

interface NavItem {
  id?: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  iconBg?: string
  iconColor?: string
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

  // ESTADOS DEL SIDEBAR RETRÁCTIL & RESIZABLE (ESTILO VISUAL STUDIO CODE)
  const [sidebarWidth, setSidebarWidth] = useState<number>(270)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const isCollapsed = sidebarWidth <= 95

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

  // Cargar ancho preferido guardado en localStorage (evitar estados aplastados intermedios)
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem('ade_sidebar_width')
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10)
        if (!isNaN(parsed)) {
          if (parsed <= 95) {
            setSidebarWidth(76)
          } else {
            setSidebarWidth(Math.min(380, Math.max(260, parsed)))
          }
        }
      }
    } catch (e) {}
  }, [])

  // Control del arrastre (Drag Resize estilo Visual Studio Code)
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const toggleCollapse = () => {
    if (isCollapsed) {
      setSidebarWidth(270)
      try { localStorage.setItem('ade_sidebar_width', '270') } catch (e) {}
    } else {
      setSidebarWidth(76)
      try { localStorage.setItem('ade_sidebar_width', '76') } catch (e) {}
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return
      const asideRect = sidebarRef.current.getBoundingClientRect()
      const newWidth = e.clientX - asideRect.left

      // Snap inteligente: si se arrastra hacia la izquierda (< 210px), se compacta limpiamente a sólo iconos (76px)
      if (newWidth < 210) {
        setSidebarWidth(76)
        try { localStorage.setItem('ade_sidebar_width', '76') } catch (e) {}
      } else {
        // En modo expandido, el ancho mínimo es 260px para que ningún texto se corte con puntos suspensivos
        const clamped = Math.min(380, Math.max(260, newWidth))
        setSidebarWidth(clamped)
        try { localStorage.setItem('ade_sidebar_width', String(clamped)) } catch (e) {}
      }
    }

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', stopResizing)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {}
      if (userRole === 'admin') {
        window.location.replace('/admin/login')
      } else {
        window.location.replace('/campus/login')
      }
    }
  }

  // Navigation Items con paleta de iconos llamativos y estilizados
  const navItemsByRole: Record<UserRole, NavItem[]> = {
    admin: [
      { id: 'overview', label: 'Visión General', href: '/dashboard/admin', icon: LayoutDashboard, iconBg: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
      { id: 'leads', label: 'Prospectos & Leads', href: '/dashboard/admin', icon: Inbox, badge: 'Nuevo', iconBg: 'bg-indigo-50 text-indigo-600', iconColor: 'text-indigo-600' },
      { id: 'estudiantes', label: 'Estudiantes & Matrículas', href: '/admin/estudiantes', icon: Users, badge: 'Prioritario', iconBg: 'bg-emerald-50 text-emerald-600', iconColor: 'text-emerald-600' },
      { id: 'docentes', label: 'Equipo Docente & Tutores', href: '/dashboard/admin', icon: GraduationCap, badge: 'Facultad', iconBg: 'bg-sky-50 text-sky-600', iconColor: 'text-sky-600' },
      { id: 'products', label: 'Catálogo Cursos & Aulas', href: '/dashboard/admin/products', icon: Package, iconBg: 'bg-purple-50 text-purple-600', iconColor: 'text-purple-600' },
      { id: 'liquidaciones', label: 'Liquidaciones CORPLEX', href: '/admin/liquidaciones', icon: Receipt, badge: 'Finanzas', iconBg: 'bg-teal-50 text-teal-600', iconColor: 'text-teal-600' },
      { id: 'becas', label: 'Postulaciones Becas Urabá', href: '/dashboard/admin', icon: Award, iconBg: 'bg-amber-50 text-amber-600', iconColor: 'text-amber-600' },
      { id: 'donaciones', label: 'Fondos & Donaciones', href: '/dashboard/admin', icon: Heart, iconBg: 'bg-rose-50 text-rose-600', iconColor: 'text-rose-600' }
    ],
    teacher: [
      { label: 'Portal Docente Titular', href: '/campus/docente', icon: Video, iconBg: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
      { label: 'Recursos & Guías', href: '/campus/docente', icon: CheckSquare, iconBg: 'bg-indigo-50 text-indigo-600', iconColor: 'text-indigo-600' },
      { label: 'Mi Perfil Docente', href: '/campus/docente', icon: User, iconBg: 'bg-emerald-50 text-emerald-600', iconColor: 'text-emerald-600' }
    ],
    student: [
      { label: 'Mi Aula Virtual', href: '/dashboard/student', icon: BookOpen, iconBg: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
      { label: 'Progreso MCER', href: '/dashboard/student', icon: Award, iconBg: 'bg-amber-50 text-amber-600', iconColor: 'text-amber-600' },
      { label: 'Horas Acumuladas', href: '/dashboard/student', icon: Clock, iconBg: 'bg-teal-50 text-teal-600', iconColor: 'text-teal-600' }
    ]
  }

  const currentNavItems = navItemsByRole[userRole] || navItemsByRole.admin

  const roleStyles: Record<UserRole, { badgeBg: string; badgeText: string; border: string; label: string }> = {
    admin: {
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      border: 'border-blue-200',
      label: 'Admin General'
    },
    teacher: {
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700',
      border: 'border-indigo-200',
      label: 'Docente Titular'
    },
    student: {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Estudiante Becario'
    }
  }

  const roleBadgeInfo = roleStyles[userRole]

  return (
    // LIENZO CLARO Y ESCULPIDO (NEUMORPHIC SOFT 3D CANVAS)
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#EDF2F7] text-slate-800 font-sans p-0 sm:p-3 md:p-5 flex items-center justify-center overflow-hidden z-0 select-none">
      
      {/* UNIFIED CANVAS FRAME (Card 3D Flotante Gigante) */}
      <div className="w-full max-w-[1600px] h-full sm:max-h-[96vh] bg-[#FAFBFD] rounded-none sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12),0_0_1px_1px_rgba(255,255,255,1),inset_0_2px_1px_rgba(255,255,255,1)] border-0 sm:border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2.5">
            <button 
              type="button" 
              onClick={() => onTabChange && onTabChange('overview')}
              className="inline-flex items-center text-left cursor-pointer p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs active:scale-95 transition-transform"
            >
              <img 
                src="/logo-american-dream.png" 
                alt="American Dream English" 
                className="h-9 w-auto object-contain filter drop-shadow-sm" 
              />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs font-black text-slate-900 tracking-tight leading-none truncate">American Dream</h1>
              <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
                {roleBadgeInfo.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 active:scale-95 transition-transform cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* BACKDROP OVERLAY CUANDO EL DRAWER MÓVIL ESTÁ ABIERTO */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200 animate-fadeIn"
            aria-hidden="true"
          />
        )}

        {/* SIDEBAR RETRÁCTIL & RESIZABLE ESTILO VISUAL STUDIO CODE (LIGHT SOFT 3D) */}
        <aside
          ref={sidebarRef}
          style={{ width: mobileMenuOpen ? '290px' : `${sidebarWidth}px` }}
          className={`fixed lg:relative top-0 left-0 z-50 lg:z-30 h-full max-w-[85vw] lg:max-w-none bg-[#F3F6FA] text-slate-800 flex flex-col justify-between shrink-0 transition-all ${
            isResizing ? 'transition-none' : 'duration-200'
          } lg:translate-x-0 overflow-visible relative border-r border-slate-200/80 shadow-[8px_0_25px_rgba(0,0,0,0.12)] lg:shadow-[4px_0_15px_rgba(0,0,0,0.02)] ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* HEADER DEL SIDEBAR: LOGO + TOGGLE RÁPIDO */}
          <div className="p-4 border-b border-slate-200/70 flex flex-col justify-between shrink-0">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
              
              {/* Logo en modo Expandido vs Colapsado */}
              {isCollapsed ? (
                <button
                  type="button"
                  onClick={() => onTabChange && onTabChange('overview')}
                  title="American Dream English"
                  className="w-12 h-12 rounded-2xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] border border-slate-200/80 flex items-center justify-center p-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <img 
                    src="/logo-american-dream.png" 
                    alt="ADE" 
                    className="w-full h-full object-contain drop-shadow-xs" 
                  />
                </button>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    type="button"
                    onClick={() => onTabChange && onTabChange('overview')}
                    title="Visión General"
                    className="w-11 h-11 rounded-2xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] border border-slate-200/80 flex items-center justify-center p-1.5 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img 
                      src="/logo-american-dream.png" 
                      alt="American Dream English" 
                      className="w-full h-full object-contain drop-shadow-xs" 
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xs font-black text-slate-900 tracking-tight truncate leading-tight">
                      AMERICAN DREAM
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      Sede Urabá · Admin
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de alternar colapso (un clic en Desktop) */}
              <button
                type="button"
                onClick={toggleCollapse}
                title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar a sólo iconos'}
                className="hidden lg:flex w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-blue-600 items-center justify-center border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>

              {/* Botón para cerrar drawer en Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                title="Cerrar menú"
                className="lg:hidden w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge de rol (sólo visible si expandido) */}
            {!isCollapsed && (
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full border shadow-2xs ${roleBadgeInfo.badgeBg} ${roleBadgeInfo.badgeText} ${roleBadgeInfo.border}`}>
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>{roleBadgeInfo.label}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">v2.4 Live</span>
              </div>
            )}
          </div>

          {/* LISTA DE ENLACES DE NAVEGACIÓN */}
          <div className="p-3 space-y-1.5 overflow-y-auto overflow-x-hidden no-scrollbar flex-1 min-h-0">
            {!isCollapsed && (
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-2">
                Navegación Principal
              </p>
            )}

            <nav className="space-y-1.5">
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
                    className={`group relative flex items-center ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                    } rounded-2xl transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_0_rgba(203,213,225,0.7)] border border-slate-200/90 font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:shadow-2xs font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Cápsula del Icono 3D Llamativo */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-[0_4px_10px_rgba(37,99,235,0.35)]'
                          : `${item.iconBg || 'bg-slate-100 text-slate-600'} group-hover:bg-blue-50 group-hover:text-blue-600 border border-slate-200/50 shadow-2xs`
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Texto de la opción (sólo si no está colapsado) */}
                      {!isCollapsed && (
                        <span className="text-xs truncate tracking-tight">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Badge numérico o etiqueta (sólo expandido) */}
                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md font-mono ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60' 
                              : 'bg-slate-200/70 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </div>
                    )}

                    {/* TOOLTIP FLOTANTE EN MODO COLAPSADO (ESTILO VS CODE) */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 bg-blue-500 text-white rounded text-[10px] font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* FOOTER DEL SIDEBAR: PERFIL DE USUARIO Y CIERRE DE SESIÓN */}
          <div className="p-3 border-t border-slate-200/70 bg-[#EAF0F6] shrink-0">
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-2">
                {/* Avatar Compacto con Tooltip */}
                <div 
                  className="group relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-md cursor-default"
                >
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                  <div className="absolute left-full ml-3 px-3 py-1 rounded-xl bg-slate-900 text-white text-[11px] whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <p className="font-bold">{userName || 'Administrador'}</p>
                    <p className="text-[10px] text-slate-300">{userEmail}</p>
                  </div>
                </div>

                {/* Botón Logout Compacto */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Cerrar Sesión"
                  className="group relative w-10 h-10 rounded-2xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Cerrar Sesión
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/90 p-2.5 rounded-2xl flex items-center justify-between gap-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {userName ? userName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{userName || 'Administrador'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{userEmail || 'admin@americandream.edu.co'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* LÍNEA DIVISORIA ARRASTRABLE (ESTILO VISUAL STUDIO CODE) */}
          <div
            onMouseDown={startResizing}
            onDoubleClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center absolute top-0 -right-1 w-2.5 h-full cursor-col-resize z-50 select-none group hover:bg-blue-500/20 active:bg-blue-600/30 transition-colors"
            title="Arrastra para redimensionar o doble clic para alternar sólo iconos"
          >
            {/* Línea vertical sutil */}
            <div className={`w-[2px] h-full transition-colors ${isResizing ? 'bg-blue-600' : 'bg-slate-200/80 group-hover:bg-blue-500'}`} />
            {/* Micro-tirador central */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center transition-opacity pointer-events-none ${
              isResizing ? 'opacity-100 ring-2 ring-blue-400' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL DE CONTENIDO (SE EXPANDE FLUIDAMENTE AL CONTRAER EL SIDEBAR) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFBFD] p-3 sm:p-5 md:p-6 pb-24 lg:pb-6 overflow-y-auto overflow-x-hidden no-scrollbar h-full">
          
          {/* TOP BREADCRUMB & STATUS BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/70 mb-4 shrink-0">
            
            {/* BREADCRUMB CON ESTILO NEUMÓRFICO SUAVE */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar py-0.5">
              <a href="https://americandreamenglish.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1 shrink-0">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Inicio</span>
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-600 font-medium shrink-0">Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-900 capitalize font-extrabold truncate">{title || roleBadgeInfo.label}</span>
            </div>

            {/* STATUS BADGES CLAROS */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200/80 font-bold text-[10px] sm:text-[11px] shadow-2xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>SSL 256-bit</span>
              </div>

              <a
                href="https://americandreamenglish.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 font-bold rounded-xl text-xs transition-colors border border-slate-200/90 shadow-2xs flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xs:inline">Sitio Público</span>
                <span className="xs:hidden">Web</span>
              </a>
            </div>

          </div>

          {/* CONTENIDO DE LA PÁGINA */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>

        {/* ========================================================================= */}
        {/* EXECUTIVE MOBILE BOTTOM NAVIGATION (THUMBS-FIRST CON ACCESO RÁPIDO)        */}
        {/* ========================================================================= */}
        <nav 
          aria-label="Navegación móvil"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(0.4rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {/* 1. Resumen / Overview */}
            <button
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange('overview')
                else router.push('/dashboard/admin')
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'overview' || (!activeTab && pathname === '/dashboard/admin')
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                activeTab === 'overview' || (!activeTab && pathname === '/dashboard/admin')
                  ? 'bg-blue-50 text-blue-600 shadow-2xs scale-105'
                  : 'text-slate-500'
              }`}>
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Resumen</span>
            </button>

            {/* 2. Estudiantes */}
            <button
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange('estudiantes')
                else router.push('/admin/estudiantes')
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'estudiantes' || pathname === '/admin/estudiantes'
                  ? 'text-emerald-700 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                activeTab === 'estudiantes' || pathname === '/admin/estudiantes'
                  ? 'bg-emerald-50 text-emerald-700 shadow-2xs scale-105'
                  : 'text-slate-500'
              }`}>
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Alumnos</span>
            </button>

            {/* 3. Docentes */}
            <button
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange('docentes')
                else router.push('/dashboard/admin')
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'docentes'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                activeTab === 'docentes'
                  ? 'bg-blue-50 text-blue-600 shadow-2xs scale-105'
                  : 'text-slate-500'
              }`}>
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Docentes</span>
            </button>

            {/* 4. Leads / Prospectos */}
            <button
              type="button"
              onClick={() => {
                if (onTabChange) onTabChange('leads')
                else router.push('/dashboard/admin')
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                activeTab === 'leads'
                  ? 'text-indigo-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                activeTab === 'leads'
                  ? 'bg-indigo-50 text-indigo-600 shadow-2xs scale-105'
                  : 'text-slate-500'
              }`}>
                <Inbox className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Leads</span>
            </button>

            {/* 5. Más (Abre el drawer lateral con el resto de módulos: Becas, Liquidaciones, Donaciones, Tienda) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                ['becas', 'donaciones', 'products', 'liquidaciones'].includes(activeTab || '')
                  ? 'text-purple-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-transform ${
                ['becas', 'donaciones', 'products', 'liquidaciones'].includes(activeTab || '')
                  ? 'bg-purple-50 text-purple-600 shadow-2xs scale-105'
                  : 'text-slate-500'
              }`}>
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Más</span>
            </button>
          </div>
        </nav>

      </div>

    </div>
  )
}
