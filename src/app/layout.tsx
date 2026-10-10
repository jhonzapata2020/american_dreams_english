import React from 'react'
import '../index.css'
import { Metadata, Viewport } from 'next'
import { CurrencyProvider } from '../context/CurrencyContext'
import { LanguageProvider } from '../context/LanguageContext'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'

export const viewport: Viewport = {
  themeColor: '#C8102E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'American Dream English S.A.S. - Plataforma Bilingüe',
  description: 'Plataforma educativa con control de acceso por roles, catálogo dinámico e impacto social.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ADE App',
  },
  icons: {
    icon: [
      { url: '/logo-american-dream.png', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/logo-american-dream.png',
    apple: '/logo-american-dream.png',
  },
  openGraph: {
    title: 'American Dream English Institute',
    description: 'Plataforma Bilingüe Global & Fondo de Becas Urabá',
    images: ['/logo-american-dream.png'],
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#C8102E" />
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
        <CurrencyProvider>
          <LanguageProvider>
            {children}
            <MobileBottomNav />
          </LanguageProvider>
        </CurrencyProvider>
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
