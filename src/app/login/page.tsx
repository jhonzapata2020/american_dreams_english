'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const CampusLoginPage = dynamic(() => import('../campus/login/page'), { ssr: false })

export default function LoginPage() {
  return <CampusLoginPage />
}


