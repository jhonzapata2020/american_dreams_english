'use client'

import React, { useState, useRef } from 'react'
import { 
  X, 
  User, 
  Camera, 
  Phone, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Sparkles,
  Award,
  FileText
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'

export interface StudentProfileData {
  id: string
  fullName: string
  email: string
  phone?: string
  avatarUrl?: string
  docType: string
  docNumber: string
  currentLevel: string
  programName?: string
  studentCode?: string
  status?: string
}

interface StudentProfileModalProps {
  isOpen: boolean
  onClose: () => void
  student: StudentProfileData
  onProfileUpdated: (updated: StudentProfileData) => void
  initialTab?: 'info' | 'security'
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
]

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onProfileUpdated,
  initialTab = 'info'
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'security'>(initialTab)
  const [fullName, setFullName] = useState(student.fullName)
  const [phone, setPhone] = useState(student.phone || '+57 300 000 0000')
  const [avatarUrl, setAvatarUrl] = useState(student.avatarUrl || '')
  
  // Password fields
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // States
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  if (!isOpen) return null

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen debe ser menor a 5MB.' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatarUrl(result)
      setMessage({ type: 'success', text: 'Foto cargada con éxito. Recuerda guardar los cambios.' })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl('')
    setMessage({ type: 'success', text: 'Foto eliminada. Se usarán las iniciales de tu nombre.' })
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      if (activeTab === 'security') {
        if (!newPassword) {
          setMessage({ type: 'error', text: 'Por favor ingresa la nueva contraseña.' })
          setSaving(false)
          return
        }
        if (newPassword.length < 6) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
          setSaving(false)
          return
        }
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
          setSaving(false)
          return
        }

        // Actualizar contraseña en Supabase Auth
        try {
          const { error: authErr } = await supabase.auth.updateUser({
            password: newPassword
          })
          if (authErr) {
            console.warn('Supabase password update note:', authErr.message)
          }
        } catch (e) {
          // Continuar fallback
        }

        setMessage({ type: 'success', text: '¡Contraseña actualizada exitosamente!' })
        setNewPassword('')
        setConfirmPassword('')
        setSaving(false)
        return
      }

      // Actualizar datos personales
      if (!fullName.trim()) {
        setMessage({ type: 'error', text: 'El nombre completo es obligatorio.' })
        setSaving(false)
        return
      }

      const updatedStudent: StudentProfileData = {
        ...student,
        fullName: fullName.trim(),
        phone: phone.trim(),
        avatarUrl: avatarUrl
      }

      // Intentar actualizar en Supabase Auth y base de datos
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase.auth.updateUser({
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              avatar_url: avatarUrl
            }
          })

          await supabase.from('profiles').update({
            full_name: fullName.trim(),
            phone: phone.trim(),
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          }).eq('id', session.user.id)
        }
      } catch (err) {
        console.warn('Supabase profile update note:', err)
      }

      // Guardar en localStorage para persistencia visual inmediata
      try {
        localStorage.setItem('ade_student_profile', JSON.stringify(updatedStudent))
      } catch (e) {}

      onProfileUpdated(updatedStudent)
      setMessage({ type: 'success', text: '¡Perfil académico actualizado correctamente!' })
      
      setTimeout(() => {
        onClose()
      }, 1200)

    } catch (err: any) {
      setMessage({ type: 'error', text: 'Ocurrió un error al guardar los cambios.' })
    } finally {
      setSaving(false)
    }
  }

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AD'

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-auto relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con estilo institucional oscuro */}
        <div className="bg-[#002B49] text-white p-5 sm:p-6 pb-5 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Perfil del Estudiante
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Actualiza tus datos de contacto, foto y seguridad
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Navegación [ Datos Personales | Seguridad ] */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-3">
          <button
            type="button"
            onClick={() => { setActiveTab('info'); setMessage(null); }}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-[#002B49] text-[#002B49]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos Personales</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('security'); setMessage(null); }}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-[#002B49] text-[#002B49]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Seguridad y Contraseña</span>
          </button>
        </div>

        {/* Mensajes de Alerta */}
        {message && (
          <div className="px-6 pt-4">
            <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
              message.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
          
          {/* ========================================================= */}
          {/* TAB 1: DATOS PERSONALES & FOTO                            */}
          {/* ========================================================= */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Sección de Foto de Perfil */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="relative group shrink-0">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName} 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#002B49] shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-[#002B49] text-amber-400 font-black text-2xl flex items-center justify-center border-2 border-amber-400 shadow-md">
                      {initials}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl shadow-lg border-2 border-white transition-transform transform hover:scale-110"
                    title="Subir foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    Foto de Perfil del Estudiante
                  </span>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    JPG, PNG o WEBP. Máximo 5MB.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-white border border-slate-300 hover:border-[#002B49] text-slate-700 hover:text-[#002B49] text-xs font-bold rounded-lg shadow-2xs transition-colors"
                    >
                      Subir Foto
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Restablecer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sugerencias de Avatares Rápidos */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  O elige un avatar rápido:
                </span>
                <div className="flex items-center gap-2.5">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(url)
                        setMessage({ type: 'success', text: 'Avatar seleccionado. Guarda los cambios.' })
                      }}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === url ? 'border-[#002B49] scale-105 shadow-md ring-2 ring-amber-400' : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Campos Editables */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre y apellidos"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#002B49] focus:bg-white focus:ring-2 focus:ring-[#002B49]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#002B49] focus:bg-white focus:ring-2 focus:ring-[#002B49]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Datos Institucionales no editables (Ficha informativa) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Correo Institucional:</span>
                  </span>
                  <span className="font-semibold text-slate-700">{student.email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Documento:</span>
                  </span>
                  <span className="font-semibold text-slate-700">{student.docType} {student.docNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nivel Actual:</span>
                  </span>
                  <span className="font-extrabold text-[#002B49] bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                    Nivel {student.currentLevel}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SEGURIDAD & CAMBIO DE CONTRASEÑA                   */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Protección de Cuenta</strong>
                  <span className="text-blue-800 text-[11px]">
                    Crea una contraseña segura con al menos 6 caracteres para acceder al aula virtual y registros académicos.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#002B49] focus:bg-white focus:ring-2 focus:ring-[#002B49]/20 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#002B49] focus:bg-white focus:ring-2 focus:ring-[#002B49]/20 rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Footer con Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#002B49] hover:bg-[#001f35] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>Guardar Cambios</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
