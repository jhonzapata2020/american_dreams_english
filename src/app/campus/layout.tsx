import React from 'react'
import { AdminAuditBanner } from '../../components/campus/AdminAuditBanner'

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminAuditBanner />
      {children}
    </>
  )
}
