import React, { memo } from 'react'
import { Bookmark, Heart, Play } from 'lucide-react'

import ReelThumb from '@/components/reels/ReelThumb'
import { compactNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Grid of a partner's reels.
 *
 * The originals rendered a raw <video> per tile with no poster, no preload
 * hint and no playsInline — N videos all fetching at once. These are ImageKit
 * still frames instead, so the grid costs a handful of small images.
 */
function ReelGrid({ items = [], onSelect, emptyMessage = 'No reels posted yet.' }) {
  if (items.length === 0) {
    return (
      <p className="rounded-[var(--radius-md)] border border-dashed border-border py-14 text-center text-[14px] text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-3 gap-1.5 sm:gap-2.5 lg:grid-cols-4">
      {items.map((item) => (
        <ReelTile key={item._id} item={item} onSelect={onSelect} />
      ))}
    </ul>
  )
}

const ReelTile = memo(function ReelTile({ item, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(item)}
        className={cn(
          'group relative block aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-sm)] bg-muted',
          'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        <ReelThumb
          src={item.video}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/2 scrim-bottom" aria-hidden="true" />

        <span className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <Play className="size-3 fill-white text-white" />
        </span>

        <span className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-2 text-[11px] font-bold text-white">
          <span className="flex items-center gap-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            <Heart className="size-3 fill-current" />
            {compactNumber(item.likeCount)}
          </span>
          <span className="flex items-center gap-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            <Bookmark className="size-3 fill-current" />
            {compactNumber(item.savesCount)}
          </span>
        </span>
      </button>
    </li>
  )
})

export default memo(ReelGrid)
