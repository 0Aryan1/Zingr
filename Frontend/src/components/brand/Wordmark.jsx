import React from 'react'

import { cn } from '@/lib/utils'

/**
 * The Zingr wordmark. Fraunces is reserved for exactly this, the auth hero
 * headline, and large stat numerals — never body or dense UI.
 */
export default function Wordmark({ className, showDot = true, ...props }) {
  return (
    <span
      className={cn(
        'font-display inline-flex select-none items-baseline font-black tracking-tight',
        className,
      )}
      {...props}
    >
      <span className="bg-gradient-to-br from-brand-500 to-amber-400 bg-clip-text text-transparent">
        Zingr
      </span>
      {showDot && (
        <span className="ml-0.5 inline-block size-[0.22em] translate-y-[-0.05em] rounded-full bg-amber-400" />
      )}
    </span>
  )
}
