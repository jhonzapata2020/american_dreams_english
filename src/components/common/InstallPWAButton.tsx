'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react'
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
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [showGenericModal, setShowGenericModal] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Detectar si ya está corriendo en modo Standalone (App instalada)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      setIsStandalone(isStandaloneMode)
    }

    checkStandalone()

    // 2. Detectar iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(isAppleDevice)

    // 3. Capturar evento nativo `beforeinstallprompt` (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // 4. Capturar evento `appinstalled`
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      trackEvent('pwa_installed_success', { platform: isAppleDevice ? 'ios' : 'android_desktop' })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Ocultar automáticamente si el usuario ya está dentro de la App PWA
  if (isStandalone || isInstalled) {
    return null
  }

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault()

    trackEvent('pwa_install_click', {
      variant,
      platform: isIOS ? 'ios' : deferredPrompt ? 'android_chrome' : 'other_browser'
    })

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice
        trackEvent('pwa_prompt_choice', { outcome: choiceResult.outcome })
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null)
        }
      } catch (err) {
        console.warn('Error al invocar prompt de instalación PWA:', err)
      }
    } else if (isIOS) {
      setShowIOSModal(true)
    } else {
      setShowGenericModal(true)
    }
  }

  // Estilos según variante
  const renderTrigger = () => {
    if (variant === 'navbar') {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-crimson-600 dark:hover:bg-crimson-600 dark:hover:text-white text-xs font-black rounded-xl shadow-xs active:scale-[0.96] select-none transition-all ${className}`}
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
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <span>Instala la App ADE</span>
                <span className="text-[10px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded-full font-bold">Rápida y Liviana</span>
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">Accede a tus clases y progreso con un solo toque</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="min-h-[38px] px-4 bg-crimson-600 hover:bg-crimson-700 active:scale-[0.96] text-white font-black text-xs rounded-xl shadow-sm uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all select-none"
          >
            <span>Instalar</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      )
    }

    if (variant === 'card') {
      return (
        <div 
          onClick={handleInstallClick}
          className={`cursor-pointer p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs hover:border-crimson-500 hover:shadow-md transition-all active:scale-[0.98] select-none flex items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-crimson-600 dark:text-crimson-400 flex items-center justify-center text-xl">
              📱
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Instalar App Móvil</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acceso instantáneo sin descargas pesadas</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      )
    }

    // Default 'button'
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className={`min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-crimson-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] select-none transition-all ${className}`}
      >
        <Smartphone className="w-4 h-4 stroke-[2.5]" />
        <span>📲 Instalar App</span>
      </button>
    )
  }

  return (
    <>
      {renderTrigger()}

      {/* ========================================================================= */}
      {/* MODAL / BOTTOM-SHEET PARA IPHONE (SAFARI iOS)                             */}
      {/* ========================================================================= */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 space-y-5 animate-slideUp"
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/50 text-crimson-600 dark:text-crimson-400 flex items-center justify-center text-xl">
                  🍎
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Instalar en iPhone / iPad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sigue estos 2 sencillos pasos en Safari
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pasos ilustrados */}
            <div className="space-y-3 pt-1">
              
              {/* Paso 1 */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Share className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    1. Toca el botón Compartir
                  </span>
                  En la barra inferior de Safari, presiona el icono de compartir (<span className="font-bold">⎋</span>).
                </div>
              </div>

              {/* Paso 2 */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <PlusSquare className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    2. "Agregar a Inicio"
                  </span>
                  Desplaza hacia abajo y selecciona <span className="font-bold">"Agregar a la pantalla de inicio"</span>.
                </div>
              </div>

            </div>

            {/* Botón de cierre */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full min-h-[48px] bg-crimson-600 hover:bg-crimson-700 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/20 transition-all select-none"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL PARA OTROS NAVEGADORES (GENERIC GUIDE)                              */}
      {/* ========================================================================= */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-crimson-600 mx-auto flex items-center justify-center text-2xl">
              📲
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Instalar American Dream English
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Abre el menú de tu navegador (⋮) y selecciona <strong className="text-slate-800 dark:text-slate-200">"Instalar aplicación"</strong> o <strong className="text-slate-800 dark:text-slate-200">"Agregar a la pantalla principal"</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGenericModal(false)}
              className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all select-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
