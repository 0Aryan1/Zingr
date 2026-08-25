import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Clapperboard } from 'lucide-react'

import ReelItem from '@/components/reels/ReelItem'
import ReelSideRail from '@/components/reels/ReelSideRail'
import { cn } from '@/lib/utils'

/**
 * Reusable feed for vertical reels.
 *
 * Props (unchanged from the original, plus optional additions):
 * - items: Array of video items { _id, name, video, description, likeCount,
 *          savesCount, foodPartner }
 * - onLike: (item) => void | Promise<void>
 * - onSave: (item) => void | Promise<void>
 * - emptyMessage: string
 * - onShare: (item) => void                     [optional]
 * - savedIds / likedIds: Set of food ids        [optional]
 * - restoreKey: sessionStorage key for position [optional]
 *
 * Virtualised with react-virtuoso: `GET /api/food` has no pagination and
 * returns every food document, so the old implementation mounted one <video>
 * per row in the database. Only a small window exists at a time now, and
 * reels outside the active window carry no video source at all.
 */
const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  onShare,
  emptyMessage = 'No videos yet.',
  savedIds,
  likedIds,
  restoreKey,
}) => {
  const virtuosoRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(() => readRestoredIndex(restoreKey))
  const [muted, setMuted] = useState(true)

  const activeItem = items[activeIndex] ?? items[0] ?? null

  /* ---- persist position by index (Virtuoso owns the scroller) ---- */
  useEffect(() => {
    if (!restoreKey) return
    if (items.length === 0) return
    sessionStorage.setItem(restoreKey, String(activeIndex))
  }, [activeIndex, items.length, restoreKey])

  /* ---- keyboard + wheel navigation (desktop affordances) ---- */
  const scrollToIndex = useCallback((index) => {
    virtuosoRef.current?.scrollToIndex({ index, align: 'start', behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handleKey = (event) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (event.key === 'ArrowDown' || event.key === 'j') {
        event.preventDefault()
        scrollToIndex(Math.min(activeIndex + 1, items.length - 1))
      } else if (event.key === 'ArrowUp' || event.key === 'k') {
        event.preventDefault()
        scrollToIndex(Math.max(activeIndex - 1, 0))
      } else if (event.key === 'm') {
        setMuted((v) => !v)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex, items.length, scrollToIndex])

  /* ---- stable callbacks: these cross the virtualised boundary ---- */
  const handleVisible = useCallback(
    (id) => {
      const index = items.findIndex((item) => item._id === id)
      if (index >= 0) setActiveIndex(index)
    },
    [items],
  )

  const toggleMute = useCallback(() => setMuted((v) => !v), [])

  const handleShare = useCallback(
    (item) => {
      if (onShare) {
        onShare(item)
        return
      }
      const url = `${window.location.origin}/user-partner-profile/${item.foodPartner}`
      if (navigator.share) {
        navigator.share({ title: item.name || 'Zingr', url }).catch(() => {})
      } else {
        navigator.clipboard?.writeText(url).catch(() => {})
      }
    },
    [onShare],
  )

  const suggestions = useMemo(
    () => items.filter((_, index) => index !== activeIndex).slice(0, 4),
    [items, activeIndex],
  )

  const itemContent = useCallback(
    (index, item) => (
      <ReelItem
        item={item}
        // keep the neighbours warm so the next reel starts instantly
        active={Math.abs(index - activeIndex) <= 1}
        muted={muted}
        onToggleMute={toggleMute}
        liked={likedIds?.has(item._id) ?? false}
        saved={savedIds?.has(item._id) ?? false}
        onLike={onLike}
        onSave={onSave}
        onShare={handleShare}
        onVisible={handleVisible}
      />
    ),
    [activeIndex, muted, toggleMute, likedIds, savedIds, onLike, onSave, handleShare, handleVisible],
  )

  if (items.length === 0) {
    return (
      <div className="reels-page grid h-dvh place-items-center px-6">
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-white/5 text-white/40">
            <Clapperboard className="size-7" strokeWidth={1.75} />
          </div>
          <p className="mt-5 text-[15px] font-medium text-white/60">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reels-page flex h-dvh w-full justify-center overflow-hidden">
      {/* From tablet up the feed is a centred column, never a stretched
          vertical video filling a wide viewport. */}
      <div className="relative h-full w-full md:max-w-[var(--reel-column)]">
        <Virtuoso
          ref={virtuosoRef}
          data={items}
          className={cn(
            // `.reels-feed` is kept as the scroller's marker class: it has been
            // the feed's identity since before the redesign.
            'reels-feed no-scrollbar h-full w-full',
          )}
          style={{ height: '100%' }}
          computeItemKey={(_, item) => item._id}
          initialTopMostItemIndex={activeIndex}
          // one extra screen of overscan in each direction, no more
          increaseViewportBy={{ top: 400, bottom: 400 }}
          itemContent={itemContent}
          components={{ Item: SnapItem }}
          scrollerRef={applySnapScrolling}
        />
      </div>

      <ReelSideRail
        item={activeItem}
        liked={activeItem ? (likedIds?.has(activeItem._id) ?? false) : false}
        saved={activeItem ? (savedIds?.has(activeItem._id) ?? false) : false}
        onLike={onLike}
        onSave={onSave}
        onShare={handleShare}
        suggestions={suggestions}
      />
    </div>
  )
}

/** Every row is exactly one scroller-height, so snapping lands on one reel. */
function SnapItem({ children, ...props }) {
  return (
    <div {...props} className="h-dvh snap-start snap-always">
      {children}
    </div>
  )
}

function applySnapScrolling(element) {
  if (element instanceof HTMLElement) {
    element.style.scrollSnapType = 'y mandatory'
    element.style.overscrollBehaviorY = 'contain'
    element.style.webkitOverflowScrolling = 'touch'
  }
}

function readRestoredIndex(key) {
  if (!key) return 0
  const stored = Number.parseInt(sessionStorage.getItem(key) ?? '', 10)
  return Number.isFinite(stored) && stored >= 0 ? stored : 0
}

export default ReelFeed
