'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  KeyRound, 
  LogOut, 
  GraduationCap, 
  Award, 
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Camera
} from 'lucide-react'
import { StudentProfileData } from './StudentProfileModal'

interface StudentAvatarMenuProps {
  student: StudentProfileData
  onOpenEditProfile: (initialTab?: 'info' | 'security') => void
  onLogout: () => void
  onOpenCert?: () => void
  variant?: 'header' | 'card'
}

export const StudentAvatarMenu: React.FC<StudentAvatarMenuProps> = ({
  student,
  onOpenEditProfile,
  onLogout,
  onOpenCert,
  variant = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = student.fullName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD'

  if (variant === 'card') {
    return (
      <div className="relative group">
        <div className="relative inline-block mx-auto mb-3">
          {student.avatarUrl ? (
            <img 
              src={student.avatarUrl} 
              alt={student.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md mx-auto"
            />
          ) : (
            <div className="w-16 h-16 bg-white rounded-2xl text-[#002B49] flex items-center justify-center font-black text-xl mx-auto shadow-md border-2 border-amber-400">
              {initials}
            </div>
          )}

          {/* Botón táctil para editar perfil sobre el avatar */}
          <button
            type="button"
            onClick={() => onOpenEditProfile('info')}
            className="absolute -bottom-1.5 -right-1.5 bg-amber-400 hover:bg-amber-500 text-[#002B49] p-1.5 rounded-xl shadow-md border-2 border-[#002B49] transition-transform hover:scale-110"
            title="Editar foto y perfil"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="font-extrabold text-base text-white leading-tight">
          {student.fullName}
        </h3>

        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onOpenEditProfile('info')}
            className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-white/20 transition-colors"
          >
            <Settings className="w-3 h-3" />
            <span>Editar Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenEditProfile('security')}
            className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-white/20 transition-colors"
            title="Cambiar Contraseña"
          >
            <KeyRound className="w-3 h-3" />
            <span>Contraseña</span>
          </button>
        </div>
      </div>
    )
  }

  // Header Variant (Floating Pill / Dropdown Menu)
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      
      {/* Botón disparador del avatar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group focus:outline-none focus:ring-2 focus:ring-[#002B49]/30"
        aria-expanded={isOpen}
      >
        <div className="relative shrink-0">
          {student.avatarUrl ? (
            <img 
              src={student.avatarUrl} 
              alt={student.fullName}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-amber-400 shadow-2xs"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs border border-amber-400/60">
              {initials}
            </div>
          )}
          {/* Indicador en línea verde */}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-2xs" />
        </div>

        <div className="hidden sm:block text-left">
          <div className="text-xs font-black text-slate-800 leading-tight group-hover:text-[#002B49] flex items-center gap-1">
            <span className="truncate max-w-[120px]">{student.fullName.split(' ')[0]}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
              {student.currentLevel}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium block">Estudiante</span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegable Flotante */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl shadow-2xl bg-white border border-slate-200 z-50 animate-fadeIn overflow-hidden">
          
          {/* Cabecera del Menú */}
          <div className="bg-[#002B49] text-white p-4">
            <div className="flex items-center gap-3">
              {student.avatarUrl ? (
                <img 
                  src={student.avatarUrl} 
                  alt={student.fullName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white text-[#002B49] flex items-center justify-center font-black text-lg shrink-0 border-2 border-amber-400">
                  {initials}
                </div>
              )}

              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-white truncate">
                  {student.fullName}
                </h4>
                <p className="text-[11px] text-slate-300 truncate">
                  {student.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Nivel {student.currentLevel}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    {student.studentCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones del Menú */}
          <div className="p-2 text-xs divide-y divide-slate-100">
            
            <div className="py-1 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onOpenEditProfile('info')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-[#002B49] hover:bg-slate-50 rounded-xl transition-colors font-semibold text-left"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <strong className="block leading-tight">Editar Perfil & Foto</strong>
                  <span className="text-[10px] text-slate-400 font-normal">Nombre, teléfono y avatar</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onOpenEditProfile('security')
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-[#002B49] hover:bg-slate-50 rounded-xl transition-colors font-semibold text-left"
              >
                <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex-1">
                  <strong className="block leading-tight">Cambiar Contraseña</strong>
                  <span className="text-[10px] text-slate-400 font-normal">Seguridad de acceso al campus</span>
                </div>
              </button>
            </div>

            <div className="py-1 space-y-1">
              <Link
                href="/campus"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-[#002B49] hover:bg-slate-50 rounded-xl transition-colors font-semibold"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mis Cursos Matriculados</span>
              </Link>

              {onOpenCert && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    onOpenCert()
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-[#002B49] hover:bg-slate-50 rounded-xl transition-colors font-semibold text-left"
                >
                  <Award className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Certificado de Matrícula</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onLogout()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-bold text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
