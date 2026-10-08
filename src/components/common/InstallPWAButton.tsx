'use client'

import React, { useState, useEffect } from 'react'
import { Smartphone } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'

interface InstallPWAButtonProps {
  variant?: 'navbar' | 'banner' | 'card' | 'button'
  className?: string
  showText?: boolean
}

export function InstallPWAButton({
  variant = 'button',
  className = '',
  showText = true
}: InstallPWAButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Detectar si ya corre en modo Standalone PWA
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsStandalone(isStandaloneMode)

    // 2. Capturar evento nativo beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      trackEvent('pwa_installed_success', { platform: 'native' })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Visibilidad condicional estricta: Si no hay evento diferido o ya está instalada, no renderizar nada
  if (!deferredPrompt || isStandalone) {
    return null
  }

  const handleInstall = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!deferredPrompt) return

    trackEvent('pwa_install_click', { variant })

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      trackEvent('pwa_prompt_choice', { outcome })
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } catch (err) {
      console.warn('Error al invocar instalación PWA nativa:', err)
    }
  }

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleInstall}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-crimson-600 text-xs font-black rounded-xl shadow-xs active:scale-[0.96] select-none transition-all cursor-pointer ${className}`}
        title="Instalar App de American Dream English"
      >
        <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
        {showText && <span>Instalar App</span>}
      </button>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={`p-3.5 bg-gradient-to-r from-navy-900 to-navy-950 text-white rounded-2xl border border-navy-800 shadow-lg flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crimson-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm">
            📲
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-black text-white">
              Instala la App ADE
            </h4>
            <p className="text-[11px] text-slate-300 font-medium">Acceso instantáneo con un solo clic</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="min-h-[38px] px-4 bg-crimson-600 hover:bg-crimson-700 active:scale-[0.96] text-white font-black text-xs rounded-xl shadow-sm uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all select-none cursor-pointer"
        >
          <span>Instalar</span>
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className={`min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-crimson-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] select-none transition-all cursor-pointer ${className}`}
    >
      <Smartphone className="w-4 h-4 stroke-[2.5]" />
      <span>📲 Instalar App</span>
    </button>
  )
}
