'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const LoginView = dynamic(() => import('../../components/views/LoginView').then(m => m.LoginView), { ssr: false })

export default function LoginPage() {
  return <LoginView />
}

