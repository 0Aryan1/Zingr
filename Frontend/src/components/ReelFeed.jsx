import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Clapperboard } from 'lucide-react'

import ReelItem from '@/components/reels/ReelItem'
import ReelSideRail from '@/components/reels/ReelSideRail'

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
 * Rendered as a plain scroll-snap list rather than a virtualised one.
 * Virtualisation was tried and removed: with each row exactly one viewport
 * tall, react-virtuoso reserved the full scroll height but rendered zero
 * items, leaving the feed blank. The performance goal it was there for —
 * not holding dozens of <video> elements open — is met instead by gating the
 * video `src` to the active reel and its immediate neighbours, so at most
 * three videos ever hold a source.
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
  const scrollerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(() => readRestoredIndex(restoreKey))
  const [muted, setMuted] = useState(true)
  const hasRestored = useRef(false)

  /**
   * A stored index can outlive the feed it came from — a partner deletes
   * reels, or the restore key holds a value from an older build. Pointing
   * Virtuoso past the end renders an empty scroller, which reads to the user
   * as "no videos", so the index is always clamped to what actually exists.
   */
  const safeIndex = items.length > 0 ? Math.min(activeIndex, items.length - 1) : 0
  const activeItem = items[safeIndex] ?? null

  /* ---- persist position by index ---- */
  useEffect(() => {
    if (!restoreKey) return
    if (items.length === 0) return
    sessionStorage.setItem(restoreKey, String(safeIndex))
  }, [safeIndex, items.length, restoreKey])

  /* ---- keyboard + wheel navigation (desktop affordances) ---- */
  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    const scroller = scrollerRef.current
    if (!scroller) return
    // Every row is exactly one scroller-height, so the offset is exact.
    scroller.scrollTo({ top: index * scroller.clientHeight, behavior })
  }, [])

  /* ---- restore the saved reel once, on first paint with items ---- */
  useLayoutEffect(() => {
    if (hasRestored.current) return
    if (items.length === 0) return
    hasRestored.current = true
    if (safeIndex > 0) scrollToIndex(safeIndex, 'auto')
  }, [items.length, safeIndex, scrollToIndex])

  useEffect(() => {
    const handleKey = (event) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (event.key === 'ArrowDown' || event.key === 'j') {
        event.preventDefault()
        scrollToIndex(Math.min(safeIndex + 1, items.length - 1))
      } else if (event.key === 'ArrowUp' || event.key === 'k') {
        event.preventDefault()
        scrollToIndex(Math.max(safeIndex - 1, 0))
      } else if (event.key === 'm') {
        setMuted((v) => !v)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [safeIndex, items.length, scrollToIndex])

  /* ---- stable callbacks shared by every row ---- */
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
    () => items.filter((_, index) => index !== safeIndex).slice(0, 4),
    [items, safeIndex],
  )

  const itemContent = useCallback(
    (index, item) => (
      <ReelItem
        item={item}
        // keep the neighbours warm so the next reel starts instantly
        active={Math.abs(index - safeIndex) <= 1}
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
    [safeIndex, muted, toggleMute, likedIds, savedIds, onLike, onSave, handleShare, handleVisible],
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
        <div
          ref={scrollerRef}
          // `.reels-feed` is kept as the scroller's marker class: it has been
          // the feed's identity since before the redesign.
          className="reels-feed no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
          role="list"
        >
          {items.map((item, index) => (
            <div key={item._id} className="h-full snap-start snap-always">
              {itemContent(index, item)}
            </div>
          ))}
        </div>
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

function readRestoredIndex(key) {
  if (!key) return 0
  const stored = Number.parseInt(sessionStorage.getItem(key) ?? '', 10)
  return Number.isFinite(stored) && stored >= 0 ? stored : 0
}

export default ReelFeed
