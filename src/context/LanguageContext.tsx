'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

export type Language = 'es' | 'en'

export interface Translations {
  programs: string
  digitalCourses: string
  liveClasses: string
  campusVirtual: string
  enroll: string
  navigationMenu: string
  academicPrograms: string
  digitalCourses4k: string
  liveClassesTitle: string
}

export const DICTIONARY: Record<Language, Translations> = {
  es: {
    programs: 'Programas',
    digitalCourses: 'Cursos Digitales',
    liveClasses: 'Clases en Vivo',
    campusVirtual: 'Campus Virtual',
    enroll: 'Matricúlate',
    navigationMenu: 'Menú de Navegación',
    academicPrograms: 'Programas Académicos',
    digitalCourses4k: 'Cursos Digitales 4K',
    liveClassesTitle: 'Clases en Vivo'
  },
  en: {
    programs: 'Programs',
    digitalCourses: 'Digital Courses',
    liveClasses: 'Live Classes',
    campusVirtual: 'Virtual Campus',
    enroll: 'Enroll Now',
    navigationMenu: 'Navigation Menu',
    academicPrograms: 'Academic Programs',
    digitalCourses4k: '4K Digital Courses',
    liveClassesTitle: 'Live Classes'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('american_dreams_language') as Language
      if (saved === 'es' || saved === 'en') {
        setLanguageState(saved)
      } else {
        const campusLang = localStorage.getItem('campus_login_lang')?.toLowerCase() as Language
        if (campusLang === 'es' || campusLang === 'en') {
          setLanguageState(campusLang)
        }
      }
    } catch (e) {
      // Silencioso en SSR
    }
  }, [])

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem('american_dreams_language', newLang)
      localStorage.setItem('campus_login_lang', newLang.toUpperCase())
    } catch (e) {
      // Silencioso
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'es' ? 'en' : 'es'
      try {
        localStorage.setItem('american_dreams_language', next)
        localStorage.setItem('campus_login_lang', next.toUpperCase())
      } catch (e) {
        // Silencioso
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: DICTIONARY[language]
    }),
    [language, setLanguage, toggleLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Retornar fallback seguro en caso de renderizado fuera de provider
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: DICTIONARY['es']
    }
  }
  return context
}
