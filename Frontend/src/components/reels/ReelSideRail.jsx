import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Share2 } from 'lucide-react'

import LikeButton from '@/components/reels/LikeButton'
import ReelActionButton from '@/components/reels/ReelActionButton'
import SaveButton from '@/components/reels/SaveButton'
import { BrandAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { usePartner } from '@/hooks/usePartner'
import { compactNumber } from '@/lib/format'
import { ikThumb } from '@/lib/imagekit'

/**
 * Desktop-only rail beside the reel column — the Instagram-web pattern where
 * chrome that overlays the video on a phone gets its own space on a wide
 * screen. Reflects the currently in-view reel.
 */
export default function ReelSideRail({
  item,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  suggestions = [],
}) {
  const partner = usePartner(item?.foodPartner)

  if (!item) return null

  return (
    <aside className="hidden w-[var(--rail-width)] shrink-0 flex-col gap-5 py-8 pr-8 lg:flex">
      {/* --- restaurant --- */}
      <div className="rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-5">
        <div className="flex items-center gap-3">
          <BrandAvatar name={partner?.name ?? '?'} className="size-12" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-white">
              {partner?.name ?? 'Loading…'}
            </p>
            {partner?.address && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-white/55">
                <MapPin className="size-3 shrink-0" />
                {partner.address}
              </p>
            )}
          </div>
        </div>

        {item.name && (
          <p className="mt-4 text-[15px] font-bold leading-snug text-white">{item.name}</p>
        )}
        {item.description && (
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/65">
            {item.description}
          </p>
        )}

        {item.foodPartner && (
          <Button asChild className="mt-5 w-full">
            <Link to={`/user-partner-profile/${item.foodPartner}`}>
              Visit restaurant
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* --- actions --- */}
      <div className="flex items-start justify-around rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 px-4 py-5">
        <LikeButton liked={liked} count={item.likeCount} onClick={() => onLike?.(item)} />
        <SaveButton saved={saved} count={item.savesCount} onClick={() => onSave?.(item)} />
        <ReelActionButton
          icon={Share2}
          label="Share"
          showCount={false}
          onClick={() => onShare?.(item)}
        />
      </div>

      {/* --- more from the feed --- */}
      {suggestions.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-white/10 bg-ink-900 p-5">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-white/45">
            More on Zingr
          </h3>
          <ul className="mt-3.5 flex flex-col gap-3">
            {suggestions.map((suggestion) => (
              <li key={suggestion._id}>
                <Link
                  to={`/user-partner-profile/${suggestion.foodPartner}`}
                  className="group flex items-center gap-3 rounded-[var(--radius-sm)] p-1 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white"
                >
                  <img
                    src={ikThumb(suggestion.video, { width: 120 })}
                    alt=""
                    loading="lazy"
                    className="size-12 shrink-0 rounded-[var(--radius-sm)] object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-white">
                      {suggestion.name || 'Untitled dish'}
                    </span>
                    <span className="block text-[12px] text-white/45">
                      {compactNumber(suggestion.likeCount)} likes
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
