import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Heart, Play, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import api from '@/lib/api'
import { compactNumber } from '@/lib/format'
import { ikThumb } from '@/lib/imagekit'
import { cn } from '@/lib/utils'

/**
 * Browse surface.
 *
 * Reuses the exact same `GET /api/food` payload the feed consumes — no new
 * endpoint — laid out as a bento grid so the desktop layout has a real
 * multi-column browse page rather than a stretched phone column. Search is
 * client-side over `name` and `description`, debounced at 300ms.
 */
const Discover = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    api
      .get('/api/food')
      .then((response) => setItems(response.data.foods ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) =>
      `${item.name ?? ''} ${item.description ?? ''}`.toLowerCase().includes(term),
    )
  }, [items, debouncedQuery])

  const clear = useCallback(() => setQuery(''), [])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-8 lg:pt-12">
      <header className="mb-7">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-primary/10 text-primary">
            <Compass className="size-[18px]" strokeWidth={2.2} />
          </span>
          <h1 className="font-display text-[1.9rem] font-bold tracking-tight text-foreground">
            Discover
          </h1>
        </div>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Every dish on Zingr, in one place.
        </p>

        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes…"
            aria-label="Search dishes"
            className="pl-11 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <BentoSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState hasQuery={Boolean(debouncedQuery.trim())} onClear={clear} />
      ) : (
        <>
          {debouncedQuery.trim() && (
            <p className="mb-4 text-[13.5px] font-medium text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for “
              {debouncedQuery.trim()}”
            </p>
          )}

          <ul className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {filtered.map((item, index) => (
              <DiscoverTile key={item._id} item={item} index={index} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

/**
 * Bento rhythm: every 7th tile spans two columns and two rows, so the grid
 * breaks up rather than reading as a uniform contact sheet.
 */
const DiscoverTile = React.memo(function DiscoverTile({ item, index }) {
  const featured = index % 7 === 0

  return (
    <li
      className={cn(
        featured && 'sm:col-span-2 sm:row-span-2',
      )}
    >
      <Link
        to={`/user-partner-profile/${item.foodPartner}`}
        className={cn(
          'group relative block h-full w-full overflow-hidden rounded-[var(--radius-md)] bg-muted',
          'aspect-[3/4] transition-all duration-300',
          featured && 'sm:aspect-auto sm:h-full',
          'hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        <img
          src={ikThumb(item.video, { width: featured ? 640 : 320 })}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-3/5 scrim-bottom" aria-hidden="true" />

        {/* play glyph — appears on hover, always present on touch */}
        <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <Play className="size-3.5 fill-white text-white" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <p
            className={cn(
              'line-clamp-2 font-bold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]',
              featured ? 'text-[16px] sm:text-[18px]' : 'text-[13.5px]',
            )}
          >
            {item.name || 'Untitled dish'}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-[11.5px] font-semibold text-white/80">
            <Heart className="size-3 fill-brand-500 text-brand-500" />
            {compactNumber(item.likeCount)}
          </p>
        </div>
      </Link>
    </li>
  )
})

function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'aspect-[3/4] rounded-[var(--radius-md)]',
            index === 0 && 'sm:col-span-2 sm:row-span-2 sm:aspect-auto',
          )}
        />
      ))}
    </div>
  )
}

function EmptyState({ hasQuery, onClear }) {
  return (
    <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border py-20 text-center">
      <div className="grid size-14 place-items-center rounded-[var(--radius-md)] bg-muted text-muted-foreground">
        <Search className="size-6" strokeWidth={1.75} />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-foreground">
        {hasQuery ? 'No dishes match that search' : 'Nothing to discover yet'}
      </p>
      <p className="mt-1.5 max-w-xs text-[13.5px] text-muted-foreground">
        {hasQuery
          ? 'Try a different dish name or ingredient.'
          : 'Once restaurants post reels, they will show up here.'}
      </p>
      {hasQuery && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-[13.5px] font-semibold text-primary underline-offset-4 hover:underline"
        >
          Clear search
        </button>
      )}
    </div>
  )
}

export default Discover
