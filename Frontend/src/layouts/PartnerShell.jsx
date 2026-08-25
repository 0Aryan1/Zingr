import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutGrid, Upload } from 'lucide-react'

import AppNav from '@/components/nav/AppNav'
import Splash from '@/components/feedback/Splash'
import { useAuth } from '@/context/AuthContext'

/**
 * Partner surface. Desktop-first — partners are far more likely to be on a
 * laptop uploading footage than on a phone.
 *
 * The old PartnerBottomNav had no route back to the dashboard, so once a
 * partner reached /create-food the only way back was the browser's back
 * button. The Dashboard entry fixes that.
 */
export default function PartnerShell() {
  const { userId } = useAuth()

  const navItems = [
    { to: `/food-partner/${userId ?? ''}`, label: 'Dashboard', icon: LayoutGrid, end: true },
    { to: '/create-food', label: 'Upload', icon: Upload },
  ]

  return (
    <div data-surface="commerce" className="min-h-dvh bg-background text-foreground">
      <AppNav
        items={navItems}
        logoutPath="/api/auth/food-partner/logout"
        surface="commerce"
      />

      <main className="min-h-dvh pb-[calc(env(safe-area-inset-bottom,0px)+72px)] md:pb-0 md:pl-[var(--sidebar-rail)] lg:pl-[var(--sidebar-width)]">
        <Suspense fallback={<Splash />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
