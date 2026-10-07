'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const ComoLlegarView = dynamic(
  () => import('../../components/views/ComoLlegarView').then((m) => m.ComoLlegarView),
  { ssr: false }
)

export default function ComoLlegarPage() {
  return <ComoLlegarView />
}
