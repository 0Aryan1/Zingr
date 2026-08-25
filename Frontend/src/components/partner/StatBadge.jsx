import React from 'react'

import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Social-proof stat. Amber is the trust colour in this palette — the same
 * visual weight Zomato and Blinkit give ratings and delivery guarantees.
 *
 * Every number rendered here is derived client-side from data the API already
 * returns (reel count, summed likes, summed saves). The schema's `totalMeals`
 * and `customersServed` fields are never written by any backend code, so they
 * are permanently zero and are deliberately not shown.
 */
export default function StatBadge({ icon: Icon, value, label, tone = 'amber', className }) {
  const tones = {
    amber: 'bg-amber-100 text-amber-600',
    brand: 'bg-primary/10 text-primary',
    muted: 'bg-muted text-muted-foreground',
  }

  return (
    <div
      className={cn(
        // Stacked in narrow grid cells, side-by-side once there's room —
        // three of these sit in a row on a 375px viewport.
        'flex min-w-0 flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card px-3 py-3',
        'sm:flex-row sm:items-center sm:gap-3 sm:px-3.5',
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] sm:size-9',
            tones[tone],
          )}
        >
          <Icon className="size-4 sm:size-[18px]" strokeWidth={2.2} />
        </span>
      )}
      <div className="min-w-0">
        <p className="stat-numerals text-[1.2rem] font-bold leading-none text-foreground sm:text-[1.35rem]">
          {compactNumber(value)}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground sm:text-[12px]">
          {label}
        </p>
      </div>
    </div>
  )
}
