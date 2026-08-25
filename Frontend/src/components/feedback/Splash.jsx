import React from 'react'

import Wordmark from '@/components/brand/Wordmark'
import { cn } from '@/lib/utils'

/**
 * Full-screen boot state. Replaces the inline-styled `Loading...` text that
 * both route guards rendered.
 */
export default function Splash({ surface = 'commerce', className }) {
  return (
    <div
      data-surface={surface}
      className={cn(
        'grid min-h-dvh w-full place-items-center bg-background px-6',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5">
        <Wordmark className="text-3xl" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[var(--animate-shimmer)] rounded-full bg-gradient-to-r from-brand-500 to-amber-400" />
        </div>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  )
}
