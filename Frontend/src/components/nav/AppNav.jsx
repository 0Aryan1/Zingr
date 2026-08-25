import React, { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import Wordmark from '@/components/brand/Wordmark'
import ZingrMark from '@/components/brand/ZingrMark'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

/**
 * One nav, three presentations:
 *   < 768px  fixed bottom tab bar
 *   768px+   fixed 76px icon rail on the left
 *   1024px+  fixed 244px sidebar with labels and wordmark
 *
 * Replaces BottomNav + PartnerBottomNav, which duplicated ~25 lines of logout
 * logic differing only in the endpoint.
 *
 * Props:
 * - items: [{ to, label, icon: LucideIcon, end?: boolean }]
 * - logoutPath: '/api/auth/user/logout' | '/api/auth/food-partner/logout'
 * - surface: 'reels' | 'commerce' — controls the chrome treatment
 */
export default function AppNav({ items, logoutPath, surface = 'commerce' }) {
  const [signingOut, setSigningOut] = useState(false)
  const onReels = surface === 'reels'

  const handleLogout = useCallback(async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await api.get(logoutPath)
    } catch {
      // Sign out locally even if the API call fails — same as before.
    } finally {
      sessionStorage.clear()
      localStorage.clear()
      // Full reload so no cached React state survives the session change.
      window.location.href = '/register'
    }
  }, [logoutPath, signingOut])

  return (
    <>
      {/* ---------------- mobile: bottom tab bar ---------------- */}
      <nav
        aria-label="Primary"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 md:hidden',
          'safe-b border-t',
          onReels
            ? 'glass border-white/10'
            : 'border-border bg-card/92 backdrop-blur-xl',
        )}
      >
        <ul className="flex items-stretch justify-around px-2 pt-1.5 pb-1.5">
          {items.map((item) => (
            <li key={item.to} className="flex-1">
              <TabLink item={item} onReels={onReels} />
            </li>
          ))}
          <li className="flex-1">
            <TabButton
              icon={LogOut}
              label="Logout"
              onClick={handleLogout}
              disabled={signingOut}
              onReels={onReels}
            />
          </li>
        </ul>
      </nav>

      {/* ---------------- tablet + desktop: left rail / sidebar ---------------- */}
      <nav
        aria-label="Primary"
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden flex-col md:flex',
          'w-[var(--sidebar-rail)] lg:w-[var(--sidebar-width)]',
          'border-r px-3 py-5 lg:px-4',
          onReels
            ? 'border-white/10 bg-ink-950/95 backdrop-blur-xl'
            : 'border-border bg-card',
        )}
      >
        <div className="mb-8 flex items-center justify-center px-1 lg:justify-start">
          <ZingrMark className="size-9 lg:hidden" />
          <Wordmark className="hidden text-2xl lg:inline-flex" />
        </div>

        <ul className="flex flex-1 flex-col gap-1.5">
          {items.map((item) => (
            <li key={item.to}>
              <RailLink item={item} onReels={onReels} />
            </li>
          ))}
        </ul>

        <RailButton
          icon={LogOut}
          label="Logout"
          onClick={handleLogout}
          disabled={signingOut}
          onReels={onReels}
        />
      </nav>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* mobile tab                                                          */
/* ------------------------------------------------------------------ */

const tabBase =
  'group flex h-full w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] px-1 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring'

function TabLink({ item, onReels }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          tabBase,
          isActive
            ? 'text-primary'
            : onReels
              ? 'text-white/60'
              : 'text-muted-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className="size-[22px] transition-transform duration-200 group-active:scale-90"
            strokeWidth={isActive ? 2.4 : 1.9}
            fill={isActive && item.fillWhenActive ? 'currentColor' : 'none'}
          />
          <span className="text-[10.5px] font-semibold leading-none tracking-tight">
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  )
}

function TabButton({ icon: Icon, label, onReels, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        tabBase,
        onReels ? 'text-white/60' : 'text-muted-foreground',
        'hover:text-foreground disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <Icon className="size-[22px]" strokeWidth={1.9} />
      <span className="text-[10.5px] font-semibold leading-none tracking-tight">
        {label}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* rail / sidebar item                                                 */
/* ------------------------------------------------------------------ */

const railBase =
  'group relative flex items-center gap-3.5 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring justify-center lg:justify-start'

function RailLink({ item, onReels }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={item.label}
      className={({ isActive }) =>
        cn(
          railBase,
          isActive
            ? 'bg-primary/12 text-primary'
            : cn(
                onReels ? 'text-white/70' : 'text-muted-foreground',
                'hover:bg-secondary hover:text-foreground',
              ),
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* active marker, visible on the collapsed rail where labels aren't */}
          <span
            className={cn(
              'absolute left-0 h-6 w-[3px] rounded-r-full bg-primary transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden="true"
          />
          <Icon
            className="size-[22px] shrink-0 transition-transform duration-200 group-hover:scale-110"
            strokeWidth={isActive ? 2.4 : 1.9}
            fill={isActive && item.fillWhenActive ? 'currentColor' : 'none'}
          />
          <span className="hidden lg:inline">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function RailButton({ icon: Icon, label, onReels, ...props }) {
  return (
    <button
      type="button"
      title={label}
      className={cn(
        railBase,
        onReels ? 'text-white/70' : 'text-muted-foreground',
        'hover:bg-secondary hover:text-foreground disabled:opacity-50',
      )}
      {...props}
    >
      <Icon className="size-[22px] shrink-0" strokeWidth={1.9} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  )
}
