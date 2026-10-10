import { createClient } from '../../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role?.toLowerCase() || (user.user_metadata?.role as string)?.toLowerCase()

  if (role !== 'admin') {
    redirect('/campus')
  }

  return <>{children}</>
}
