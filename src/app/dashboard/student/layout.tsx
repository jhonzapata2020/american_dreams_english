import { createClient } from '../../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard/student')
  }

  return <>{children}</>
}
