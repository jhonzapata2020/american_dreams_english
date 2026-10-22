'use client'

import React, { useEffect, useRef } from 'react'
import { TelemetrySession } from '../lib/marketingTelemetry'

const STORAGE_KEY = 'ade_marketing_telemetry_v1'

export const MarketingTelemetryTracker: React.FC = () => {
  const sessionRef = useRef<TelemetrySession | null>(null)
  const isHeroVisibleRef = useRef<boolean>(true)
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Initialise or restore active session
    let session: TelemetrySession
    try {
      const existing = sessionStorage.getItem('ade_active_session')
      if (existing) {
        session = JSON.parse(existing)
      } else {
        const width = window.innerWidth
        const deviceType: 'mobile' | 'tablet' | 'desktop' =
          width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'

        session = {
          id: `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          visitorId: `vis-${Math.random().toString(36).slice(2, 9)}`,
          startedAt: new Date().toISOString(),
          device: deviceType,
          heroDwellSeconds: 0,
          maxScrollDepth: 0,
          sectionsViewed: ['hero'],
          formTouched: false,
          ctaClicked: false,
          convertedToLead: false,
          referrer: document.referrer || 'direct',
        }
        sessionStorage.setItem('ade_active_session', JSON.stringify(session))
      }
    } catch (e) {
      return
    }

    sessionRef.current = session

    const persistSession = () => {
      if (!sessionRef.current) return
      try {
        sessionStorage.setItem('ade_active_session', JSON.stringify(sessionRef.current))
        const rawHistory = localStorage.getItem(STORAGE_KEY)
        const list: TelemetrySession[] = rawHistory ? JSON.parse(rawHistory) : []
        const idx = list.findIndex((s) => s.id === sessionRef.current!.id)
        if (idx >= 0) {
          list[idx] = sessionRef.current
        } else {
          list.unshift(sessionRef.current)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 150)))
      } catch (e) {}
    }

    // 2. Hero Dwell Timer (counts seconds while hero is in viewport)
    dwellTimerRef.current = setInterval(() => {
      if (isHeroVisibleRef.current && sessionRef.current) {
        sessionRef.current.heroDwellSeconds += 1
        if (sessionRef.current.heroDwellSeconds % 5 === 0) {
          persistSession()
        }
      }
    }, 1000)

    // 3. Scroll Depth & Section Detection
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sessionRef.current) return

          const scrollY = window.scrollY || window.pageYOffset
          const winHeight = window.innerHeight
          const docHeight = document.documentElement.scrollHeight
          const totalScrollable = Math.max(docHeight - winHeight, 1)
          const currentDepth = Math.min(100, Math.round((scrollY / totalScrollable) * 100))

          if (currentDepth > sessionRef.current.maxScrollDepth) {
            sessionRef.current.maxScrollDepth = currentDepth
          }

          // Check if hero is still visible (first 700px)
          isHeroVisibleRef.current = scrollY < 600

          // Check milestones
          const sections = sessionRef.current.sectionsViewed
          if (currentDepth >= 25 && !sections.includes('segmentos')) {
            sections.push('segmentos')
          }
          if (currentDepth >= 50 && !sections.includes('tutor-ai')) {
            sections.push('tutor-ai')
          }
          if (currentDepth >= 75 && !sections.includes('becas')) {
            sections.push('becas')
          }
          if (currentDepth >= 90 && !sections.includes('footer')) {
            sections.push('footer')
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 4. Custom Telemetry Listeners
    const handleAudienceChange = (e: any) => {
      if (sessionRef.current && e.detail?.audience) {
        sessionRef.current.audienceSelected = e.detail.audience
        persistSession()
      }
    }

    const handleFormTouched = () => {
      if (sessionRef.current) {
        sessionRef.current.formTouched = true
        persistSession()
      }
    }

    const handleCtaClicked = () => {
      if (sessionRef.current) {
        sessionRef.current.ctaClicked = true
        persistSession()
      }
    }

    window.addEventListener('ade_audience_change', handleAudienceChange)
    window.addEventListener('ade_form_focus', handleFormTouched)
    window.addEventListener('ade_cta_click', handleCtaClicked)

    // 5. Cleanup & Unload persistence
    const handleUnload = () => {
      persistSession()
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('ade_audience_change', handleAudienceChange)
      window.removeEventListener('ade_form_focus', handleFormTouched)
      window.removeEventListener('ade_cta_click', handleCtaClicked)
      window.removeEventListener('beforeunload', handleUnload)
      persistSession()
    }
  }, [])

  return null
}
