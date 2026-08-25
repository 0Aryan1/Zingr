import React, { useId } from 'react'

import { cn } from '@/lib/utils'

/**
 * Per-reel distribution, not a trend line.
 *
 * A sparkline implies change over time, and there is no time-series data to
 * draw one from — the food model has no `timestamps`, so reels carry no
 * `createdAt` and there is no daily/weekly stats endpoint. What *is* real is
 * how a metric is spread across a partner's reels, so that's what this shows:
 * one bar per reel, newest last, in the order the API returns them.
 */
export default function Sparkbars({ values = [], tone = 'brand', className }) {
  const gradientId = useId()

  if (values.length === 0) {
    return <div className={cn('h-8', className)} aria-hidden="true" />
  }

  const max = Math.max(...values, 1)
  const shown = values.slice(-24)

  // Fixed viewBox width so bar geometry stays consistent whether a partner
  // has 2 reels or 24 — only the pitch between bars changes.
  const VIEW_W = 100
  const pitch = VIEW_W / shown.length
  const barWidth = Math.max(pitch * 0.62, 0.8)

  const colors = {
    brand: ['var(--color-brand-500)', 'var(--color-brand-300)'],
    amber: ['var(--color-amber-400)', 'var(--color-amber-200)'],
  }[tone]

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} 32`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full', className)}
      role="img"
      aria-label={`Distribution across ${shown.length} reels`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>

      {shown.map((value, index) => {
        // Floor at 2 so a zero-value reel still reads as a bar, not a gap.
        const height = Math.max((value / max) * 30, 2)
        return (
          <rect
            key={index}
            x={index * pitch}
            y={32 - height}
            width={barWidth}
            height={height}
            rx={0.6}
            fill={`url(#${gradientId})`}
            opacity={0.4 + (value / max) * 0.6}
          />
        )
      })}
    </svg>
  )
}
