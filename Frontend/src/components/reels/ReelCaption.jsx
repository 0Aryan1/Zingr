import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Store } from 'lucide-react'

import { cn } from '@/lib/utils'

const CLAMP_AT = 110

/**
 * Dish name, restaurant chip and description.
 *
 * `food.name` exists on the model but was never rendered anywhere before —
 * the old overlay showed only the two-line-clamped description.
 */
export default function ReelCaption({ item, partner, className }) {
  const [expanded, setExpanded] = useState(false)
  const description = item.description ?? ''
  const isLong = description.length > CLAMP_AT

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {item.foodPartner && (
        <Link
          to={`/user-partner-profile/${item.foodPartner}`}
          className="inline-flex w-fit items-center gap-1.5 rounded-full glass border border-white/15 px-2.5 py-1 text-[12px] font-bold text-white transition-colors hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white"
        >
          <Store className="size-3.5" strokeWidth={2.2} />
          {partner?.name ?? 'View restaurant'}
        </Link>
      )}

      {item.name && (
        <h2 className="text-[17px] font-extrabold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
          {item.name}
        </h2>
      )}

      {description && (
        <div>
          <p
            className={cn(
              'text-[14px] leading-snug text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]',
              !expanded && 'line-clamp-2',
            )}
          >
            {description}
          </p>
          {/* Outside the clamped paragraph — inside it, the toggle gets
              clipped along with the overflowing text. */}
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-0.5 text-[13px] font-bold text-white/60 underline-offset-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
