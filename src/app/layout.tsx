import React from 'react'
import Script from 'next/script'
import '../index.css'
import { Metadata, Viewport } from 'next'
import { CurrencyProvider } from '../context/CurrencyContext'
import { LanguageProvider } from '../context/LanguageContext'
import { ThemeProvider } from '../context/ThemeContext'
import { PricingProvider } from '../context/PricingContext'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://americandreamenglish.com'
const gaId = process.env.NEXT_PUBLIC_GA_ID

export const viewport: Viewport = {
  themeColor: '#002B49',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'American Dream English | Academia de Inglés en Urabá & Online',
    template: '%s | American Dream English',
  },
  description: 'Aprende inglés conversacional con docentes certificados C1/C2 y tutoría interactiva. Sede oficial en Turbo, Urabá y modalidad virtual global. Res. SED 2471.',
  keywords: [
    'American Dream English',
    'Inglés Urabá',
    'Clases de inglés Turbo',
    'Cursos de inglés Apartadó',
    'Inglés online Colombia',
    'Certificación MCER',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ADE App',
  },
  icons: {
    icon: [
      { url: '/logo-american-dream.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo-american-dream.png',
    apple: '/logo-american-dream.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: siteUrl,
    siteName: 'American Dream English',
    title: 'American Dream English | Academia de Inglés en Urabá & Online',
    description: 'Aprende inglés conversacional con docentes certificados C1/C2 y tutoría interactiva. Sede oficial en Turbo, Urabá y modalidad virtual global. Res. SED 2471.',
    images: [
      {
        url: '/images/campus/ade-banner-oficial.png',
        width: 1200,
        height: 630,
        alt: 'American Dream English - Campus Oficial Urabá',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'American Dream English | Academia de Inglés en Urabá & Online',
    description: 'Aprende inglés conversacional con docentes certificados C1/C2 y tutoría interactiva. Sede oficial en Turbo, Urabá y modalidad virtual global. Res. SED 2471.',
    images: ['/images/campus/ade-banner-oficial.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/logo-american-dream.png" />
        <link rel="shortcut icon" type="image/png" href="/logo-american-dream.png" />
        <link rel="apple-touch-icon" href="/logo-american-dream.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#002B49" />
        
        {/* Google Analytics 4 (Carga optimizada sin impacto en rendimiento) */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Script Oficial de Wompi Colombia para Pasarela de Pagos Global */}
        <Script
          strategy="afterInteractive"
          src="https://checkout.wompi.co/widget.js"
        />

        {/* Anti-FOUC (Cero Parpadeo): Inicialización de Modo Oscuro/Claro */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('ade_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof document !== 'undefined') {
                  var cookies = document.cookie.split(';');
                  for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf('=');
                    var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                    if (name.indexOf('sb-') === 0 && name.indexOf('auth-token') > -1) {
                      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;';
                      document.cookie = name + '=; Path=/; Domain=' + window.location.hostname + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;';
                      document.cookie = name + '=; Path=/; Domain=.' + window.location.hostname + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;';
                    }
                  }
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0" suppressHydrationWarning>
        <ThemeProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <PricingProvider>
                {children}
                <MobileBottomNav />
              </PricingProvider>
            </LanguageProvider>
          </CurrencyProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('Service Worker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
