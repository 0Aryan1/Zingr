import React from 'react'

import { cn } from '@/lib/utils'

/** Square app mark — used in the sidebar rail where the wordmark won't fit. */
export default function ZingrMark({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('size-9', className)}
      role="img"
      aria-label="Zingr"
      {...props}
    >
      <defs>
        <linearGradient id="zingr-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF3B4E" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#zingr-mark)" />
      <path
        d="M22 20h22L30 38h13"
        fill="none"
        stroke="#fff"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="45" r="4.2" fill="#fff" />
    </svg>
  )
}
