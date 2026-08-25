import React, { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'

import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Heart with the burst micro-interaction: the icon scales through an
 * overshoot while a ring pings outward and six particles fan out.
 *
 * `liked` is session-local. `GET /api/food` carries no per-user like flag and
 * there is no "my likes" endpoint, so the filled state cannot be restored on
 * reload — see the redesign notes.
 */
export default function LikeButton({ liked, count, onClick, label = 'Like' }) {
  const [bursting, setBursting] = useState(false)
  const timer = useRef(null)
  const previousCount = useRef(count)
  const [popping, setPopping] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (count !== previousCount.current) {
      previousCount.current = count
      setPopping(true)
      const id = setTimeout(() => setPopping(false), 340)
      return () => clearTimeout(id)
    }
    return undefined
  }, [count])

  const handleClick = (event) => {
    // Only celebrate on the like, not the unlike.
    if (!liked) {
      setBursting(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setBursting(false), 620)
    }
    onClick?.(event)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-pressed={liked}
        className={cn(
          'group relative grid size-12 place-items-center rounded-full',
          'glass border border-white/15 transition-all duration-200 ease-[var(--ease-out-soft)]',
          'hover:scale-105 hover:bg-black/45 active:scale-90',
          'focus-visible:ring-2 focus-visible:ring-white',
          liked ? 'text-brand-500' : 'text-white',
        )}
      >
        {/* expanding ring */}
        {bursting && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-brand-500 animate-[var(--animate-heart-ping)]"
          />
        )}

        {/* particles */}
        {bursting && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <span
                key={angle}
                className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-brand-400"
                style={{
                  animation: 'particle-fly 600ms var(--ease-out-soft) forwards',
                  ['--angle']: `${angle}deg`,
                }}
              />
            ))}
          </span>
        )}

        <Heart
          className={cn(
            'relative size-[22px]',
            bursting && 'animate-[var(--animate-heart-burst)]',
          )}
          strokeWidth={2}
          fill={liked ? 'currentColor' : 'none'}
        />
      </button>

      <span
        className={cn(
          'text-[11.5px] font-bold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]',
          popping && 'animate-[var(--animate-count-pop)]',
        )}
      >
        {compactNumber(count)}
      </span>

      <style>{`
        @keyframes particle-fly {
          0%   { transform: translate(-50%,-50%) rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-50%) rotate(var(--angle)) translateY(-26px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
