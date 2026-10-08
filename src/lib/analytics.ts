/**
 * American Dream English - Telemetry and Analytics Module
 * Lightweight client & SSR safe event tracker.
 */

export interface AnalyticsEventProps {
  [key: string]: string | number | boolean | null | undefined | object
}

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}

/**
 * Dispatches an analytics event across all available telemetry providers
 * (GTM / GA4 dataLayer, Meta Pixel, Custom Events, and Dev Console).
 */
export function trackEvent(eventName: string, properties: AnalyticsEventProps = {}): void {
  if (typeof window === 'undefined') {
    return
  }

  const enrichedProps = {
    ...properties,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    url: window.location.href,
  }

  // 1. Google Tag Manager / GA4 DataLayer
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...enrichedProps,
    })
  } else if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, enrichedProps)
  }

  // 2. Meta Pixel (Facebook)
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, enrichedProps)
  }

  // 3. Custom DOM Event for internal components or reactive listeners
  try {
    const customEvent = new CustomEvent('ade_event', {
      detail: {
        eventName,
        properties: enrichedProps,
      },
    })
    window.dispatchEvent(customEvent)
  } catch (e) {
    // Fallback for environments lacking CustomEvent constructor
  }

  // 4. Debug logger in development mode
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Telemetry: ${eventName}]`, enrichedProps)
  }
}

/**
 * Predefined telemetry helpers for consistent event naming
 */
export const analytics = {
  whatsappClick: (source: string, details?: Record<string, any>) => {
    trackEvent('whatsapp_click', {
      source,
      ...details,
    })
  },

  scholarshipApplication: (data: {
    ticketId: string
    occupation: string
    incomeRange: string
    modality: string
    city: string
  }) => {
    trackEvent('scholarship_application', data)
  },

  beginCheckout: (data: {
    type: 'course' | 'store_product' | 'donation' | 'matricula'
    amount: number
    currency: string
    reference?: string
    items?: Array<{ id: string; name: string; price: number; quantity?: number }>
  }) => {
    trackEvent('begin_checkout', data)
  },

  viewCourse: (courseSlug: string, courseTitle: string) => {
    trackEvent('view_course', {
      courseSlug,
      courseTitle,
    })
  },
}
