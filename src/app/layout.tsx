import React from 'react'
import '../index.css'

export const metadata = {
  title: 'American Dream English S.A.S. - Plataforma Bilingüe',
  description: 'Plataforma educativa con control de acceso por roles, catálogo dinámico e impacto social.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
