'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { Currency } from '../types'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  exchangeRate: number
  rateSource: string
  lastUpdated: string | null
  isLoadingRate: boolean
  formatPrice: (amountInCOP: number, options?: { showCode?: boolean; decimals?: boolean }) => string
  convertPrice: (amountInCOP: number) => {
    amount: number
    currency: Currency
    formatted: string
  }
}

const DEFAULT_RATE = 4050

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('COP')
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_RATE)
  const [rateSource, setRateSource] = useState<string>('default')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true)

  // Cargar preferencia del usuario de localStorage e inicializar tasa de cambio en vivo
  useEffect(() => {
    // 1. Preferencia local
    try {
      const saved = localStorage.getItem('american_dreams_currency') as Currency
      if (saved === 'COP' || saved === 'USD') {
        setCurrencyState(saved)
      }
    } catch (e) {
      // Silencioso en SSR
    }

    // 2. Fetch de tasa de cambio desde el endpoint interno cacheado
    let isMounted = true
    const fetchRate = async () => {
      try {
        const res = await fetch('/api/currency')
        if (res.ok) {
          const data = await res.json()
          if (isMounted && typeof data.rate === 'number' && data.rate > 0) {
            setExchangeRate(data.rate)
            setRateSource(data.source || 'api')
            setLastUpdated(data.lastUpdated || null)
          }
        }
      } catch (err) {
        console.warn('No se pudo cargar la TRM en vivo, usando tasa por defecto.', err)
      } finally {
        if (isMounted) {
          setIsLoadingRate(false)
        }
      }
    }

    fetchRate()

    return () => {
      isMounted = false
    }
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    try {
      localStorage.setItem('american_dreams_currency', newCurrency)
    } catch (e) {
      // Silencioso
    }
  }, [])

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === 'COP' ? 'USD' : 'COP'
      try {
        localStorage.setItem('american_dreams_currency', next)
      } catch (e) {
        // Silencioso
      }
      return next
    })
  }, [])

  // Formateador dinámico de precios a partir de un monto base en COP
  const formatPrice = useCallback(
    (amountInCOP: number, options?: { showCode?: boolean; decimals?: boolean }) => {
      const showCode = options?.showCode !== false
      const safeAmount = typeof amountInCOP === 'number' && !isNaN(amountInCOP) ? amountInCOP : 0

      if (currency === 'USD') {
        const usdValue = safeAmount / (exchangeRate > 0 ? exchangeRate : DEFAULT_RATE)
        const formattedUsd = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: options?.decimals ? 2 : 0,
          maximumFractionDigits: 2,
        }).format(usdValue)

        return showCode ? `${formattedUsd} USD` : formattedUsd
      }

      // Formato COP
      const formattedCop = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(safeAmount)

      return showCode ? `${formattedCop} COP` : formattedCop
    },
    [currency, exchangeRate]
  )

  const convertPrice = useCallback(
    (amountInCOP: number) => {
      const safeAmount = typeof amountInCOP === 'number' && !isNaN(amountInCOP) ? amountInCOP : 0
      if (currency === 'USD') {
        const usdValue = Math.round((safeAmount / (exchangeRate > 0 ? exchangeRate : DEFAULT_RATE)) * 100) / 100
        return {
          amount: usdValue,
          currency: 'USD' as Currency,
          formatted: formatPrice(amountInCOP),
        }
      }

      return {
        amount: safeAmount,
        currency: 'COP' as Currency,
        formatted: formatPrice(amountInCOP),
      }
    },
    [currency, exchangeRate, formatPrice]
  )

  const contextValue = useMemo(
    () => ({
      currency,
      setCurrency,
      toggleCurrency,
      exchangeRate,
      rateSource,
      lastUpdated,
      isLoadingRate,
      formatPrice,
      convertPrice,
    }),
    [currency, setCurrency, toggleCurrency, exchangeRate, rateSource, lastUpdated, isLoadingRate, formatPrice, convertPrice]
  )

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency debe ser utilizado dentro de un CurrencyProvider')
  }
  return context
}
