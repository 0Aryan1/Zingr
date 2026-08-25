import React, { useId } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import AuthHero from '@/components/auth/AuthHero'
import Wordmark from '@/components/brand/Wordmark'

/**
 * Split-screen on desktop, stacked on mobile.
 *
 * The card content is keyed on pathname so moving between the role picker,
 * login, and register animates as steps rather than hard-cutting.
 */
export default function AuthLayout({ title, subtitle, children, footer, wide = false }) {
  const { pathname } = useLocation()
  const baseId = useId()
  const titleId = `${baseId}-title`
  const subtitleId = `${baseId}-subtitle`

  return (
    <div data-surface="commerce" className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* --- hero: pinned panel on desktop, compact band on mobile --- */}
      <AuthHero className="hidden lg:sticky lg:top-0 lg:block lg:h-dvh" />

      <div className="relative overflow-hidden bg-ink-950 px-6 pb-9 pt-10 text-white safe-t lg:hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute -left-16 -top-20 size-72 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="absolute -right-12 top-6 size-56 rounded-full bg-amber-400/30 blur-3xl" />
        </div>
        <div className="relative">
          <Wordmark className="text-2xl" />
          <h2 className="font-display mt-3 text-[1.65rem] font-black leading-[1.1] tracking-tight">
            Watch it. Crave it.{' '}
            <span className="bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
              Order it.
            </span>
          </h2>
        </div>
      </div>

      {/* --- auth card --- */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={
              wide
                ? 'w-full max-w-[560px]'
                : 'w-full max-w-[440px]'
            }
          >
            <div
              // The pre-redesign auth cards carried role="region" +
              // aria-labelledby pointing at their heading; keep that here now
              // that the header lives in the shared layout.
              role="region"
              aria-labelledby={titleId}
              aria-describedby={subtitle ? subtitleId : undefined}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8"
            >
              <header className="mb-6">
                <h1
                  id={titleId}
                  className="font-display text-[1.75rem] font-bold leading-tight tracking-tight text-foreground"
                >
                  {title}
                </h1>
                {subtitle && (
                  // mt-2.5 rather than mt-2: 8px sits optically tight under a
                  // 28px display serif with its larger cap height.
                  <p
                    id={subtitleId}
                    className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground"
                  >
                    {subtitle}
                  </p>
                )}
              </header>

              {children}
            </div>

            {footer && (
              <div className="mt-5 text-center text-[14px] text-muted-foreground">
                {footer}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
