import React from 'react'
import '../index.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'American Dream English S.A.S. - Plataforma Bilingüe',
  description: 'Plataforma educativa con control de acceso por roles, catálogo dinámico e impacto social.',
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
        <link rel="icon" type="image/png" href="/logo-american-dream.png" />
        <link rel="shortcut icon" type="image/png" href="/logo-american-dream.png" />
        <link rel="apple-touch-icon" href="/logo-american-dream.png" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
