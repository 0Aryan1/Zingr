import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Bookmark, Compass, Home } from 'lucide-react'

import AppNav from '@/components/nav/AppNav'
import Splash from '@/components/feedback/Splash'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/saved', label: 'Saved', icon: Bookmark, fillWhenActive: true },
]

/** Routes that render video get the near-black reels surface. */
const REELS_ROUTES = new Set(['/', '/saved'])

export default function AppShell() {
  const { pathname } = useLocation()
  const surface = REELS_ROUTES.has(pathname) ? 'reels' : 'commerce'

  return (
    <div
      data-surface={surface}
      className="min-h-dvh bg-background text-foreground"
    >
      <AppNav
        items={NAV_ITEMS}
        logoutPath="/api/auth/user/logout"
        surface={surface}
      />

      <main
        className={cn(
          'min-h-dvh md:pl-[var(--sidebar-rail)] lg:pl-[var(--sidebar-width)]',
          // The reels feed sits *under* the translucent mobile tab bar on
          // purpose; commerce pages need to clear it.
          surface === 'commerce' && 'pb-[calc(env(safe-area-inset-bottom,0px)+72px)] md:pb-0',
        )}
      >
        <Suspense fallback={<Splash surface={surface} />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
