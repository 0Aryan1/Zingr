import React, { useEffect, useRef, useState } from 'react'
import { Bookmark } from 'lucide-react'

import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Bookmark with the fill animation. Unlike the heart, saved state *can* be
 * restored on load — `GET /api/food/save` returns the user's saved items —
 * so `saved` is hydrated by the page, not just toggled locally.
 */
export default function SaveButton({ saved, count, onClick, label = 'Save' }) {
  const [animating, setAnimating] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleClick = (event) => {
    setAnimating(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAnimating(false), 470)
    onClick?.(event)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? `Remove from ${label.toLowerCase()}d` : label}
        aria-pressed={saved}
        className={cn(
          'group relative grid size-12 place-items-center overflow-hidden rounded-full',
          'glass border border-white/15 transition-all duration-200 ease-[var(--ease-out-soft)]',
          'hover:scale-105 hover:bg-black/45 active:scale-90',
          'focus-visible:ring-2 focus-visible:ring-white',
          saved ? 'text-amber-300' : 'text-white',
        )}
      >
        {/* amber wash sweeping up behind the icon as it fills */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-0 bg-amber-400/25 transition-transform duration-[450ms] ease-[var(--ease-out-soft)]',
            saved ? 'translate-y-0' : 'translate-y-full',
          )}
        />

        <Bookmark
          className={cn(
            'relative size-[22px]',
            animating && 'animate-[var(--animate-bookmark-fill)]',
          )}
          strokeWidth={2}
          fill={saved ? 'currentColor' : 'none'}
        />
      </button>

      <span className="text-[11.5px] font-bold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
        {compactNumber(count)}
      </span>
    </div>
  )
}
