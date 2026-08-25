import React, { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Still frame for a reel, used by every grid and list tile.
 *
 * Renders a <video> seeked to a fraction of a second rather than an ImageKit
 * still, for three reasons:
 *
 *  1. Uploads are stored with no file extension (`storage.service.js` passes a
 *     bare uuid as fileName), so ImageKit's `/ik-thumbnail.jpg` path has no
 *     video extension to key off.
 *  2. Server-side thumbnail generation consumes Video Processing Units, which
 *     are metered on every ImageKit plan including free — a grid of tiles
 *     would burn through them on each page view.
 *  3. `preload="metadata"` plus a `#t=` media fragment makes the browser fetch
 *     only headers and the single frame it needs, so this stays cheap.
 *
 * Falls back to a branded placeholder instead of a broken-image icon if the
 * source cannot be decoded.
 */
export default function ReelThumb({ src, className, seconds = 0.1, children }) {
  const [failed, setFailed] = useState(false)

  return (
    <>
      {failed || !src ? (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 grid place-items-center bg-gradient-to-br from-cream-100 to-cream-200',
            className,
          )}
        >
          <UtensilsCrossed
            className="size-7 text-cream-600/45"
            strokeWidth={1.5}
          />
        </div>
      ) : (
        <video
          // Decorative: every tile carries a visible text label alongside it.
          aria-hidden="true"
          tabIndex={-1}
          className={cn('absolute inset-0 size-full object-cover', className)}
          src={`${src}#t=${seconds}`}
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </>
  )
}
