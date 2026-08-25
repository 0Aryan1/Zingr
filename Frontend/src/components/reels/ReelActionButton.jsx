import React from 'react'

import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * One control in the reel action rail: a circular glass button with a count
 * underneath. Counts use compact notation and are clamped at zero — the
 * backend `$inc`s without a transaction or unique index, so a drifted count
 * can be negative.
 */
export default function ReelActionButton({
  icon: Icon,
  label,
  count,
  active,
  activeClassName = 'text-brand-500',
  iconClassName,
  showCount = true,
  onClick,
  className,
  ...props
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={active === undefined ? undefined : active}
        className={cn(
          'group relative grid size-12 place-items-center rounded-full',
          'glass border border-white/15 text-white',
          'transition-all duration-200 ease-[var(--ease-out-soft)]',
          'hover:scale-105 hover:bg-black/45 active:scale-90',
          'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          active && activeClassName,
          className,
        )}
        {...props}
      >
        <Icon
          className={cn('size-[22px] transition-transform duration-200', iconClassName)}
          strokeWidth={2}
          fill={active ? 'currentColor' : 'none'}
        />
      </button>

      {showCount && (
        <span className="text-[11.5px] font-bold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
          {compactNumber(count)}
        </span>
      )}
    </div>
  )
}
