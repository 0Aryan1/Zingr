import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Heart, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react'

import LikeButton from '@/components/reels/LikeButton'
import ReelActionButton from '@/components/reels/ReelActionButton'
import ReelCaption from '@/components/reels/ReelCaption'
import SaveButton from '@/components/reels/SaveButton'
import { usePartner } from '@/hooks/usePartner'
import { ikVideo } from '@/lib/imagekit'
import { cn } from '@/lib/utils'

/**
 * One reel.
 *
 * Playback is driven by an IntersectionObserver on the video element (>=60%
 * visible plays, anything less pauses) — the same rule the original feed
 * used, kept because it's correct and doesn't depend on scroll maths.
 *
 * `active` is owned by the feed and gates the video *source*: reels outside
 * the active window render poster-only, so scrolling never leaves a trail of
 * buffering <video> elements behind.
 */
function ReelItem({
  item,
  active,
  muted,
  onToggleMute,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
  onVisible,
  showActions = true,
  showCaption = true,
  className,
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const lastTapRef = useRef(0)
  const burstTimer = useRef(null)

  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showBurst, setShowBurst] = useState(false)

  const partner = usePartner(active ? item.foodPartner : null)

  const source = active ? ikVideo(item.video) : undefined

  /* ---- autoplay / pause on visibility ---- */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.6
          if (isVisible) {
            onVisible?.(item._id)
            if (!video.paused) return
            video.play().catch(() => {
              /* ignore autoplay rejections */
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [item._id, onVisible])

  /* ---- release the buffer when the reel leaves the active window ---- */
  useEffect(() => {
    const video = videoRef.current
    if (!video || active) return
    video.pause()
    video.removeAttribute('src')
    video.load()
    setReady(false)
    setPaused(false)
  }, [active])

  useEffect(() => () => clearTimeout(burstTimer.current), [])

  const celebrate = useCallback(() => {
    setShowBurst(true)
    clearTimeout(burstTimer.current)
    burstTimer.current = setTimeout(() => setShowBurst(false), 900)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
  }, [])

  /** Single tap toggles playback; a second tap inside 280ms likes instead. */
  const handleSurfaceClick = useCallback(() => {
    const now = Date.now()
    if (now - lastTapRef.current < 280) {
      lastTapRef.current = 0
      celebrate()
      if (!liked) onLike?.(item)
      return
    }
    lastTapRef.current = now
    setTimeout(() => {
      if (lastTapRef.current === now) {
        lastTapRef.current = 0
        togglePlay()
      }
    }, 280)
  }, [celebrate, item, liked, onLike, togglePlay])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center',
        className,
      )}
      role="listitem"
      aria-label={item.name || 'Food reel'}
    >
      {/* video stage — full-bleed on mobile, a capped phone-shaped column above */}
      <div
        className={cn(
          // Mobile: full-bleed. md+: a phone-shaped column whose height is
          // derived from its width, capped so it never exceeds the viewport.
          'relative h-full w-full overflow-hidden bg-ink-950',
          'md:h-auto md:aspect-[9/16] md:max-h-[calc(100dvh-3rem)]',
          'md:rounded-[var(--radius-lg)] md:border md:border-white/10 md:shadow-2xl',
        )}
      >
        {/* Shimmer under the video so there is never a flash of flat black.
            A server-generated LQIP would be nicer, but these uploads have no
            file extension for ImageKit's thumbnail path to key off — see
            lib/imagekit.js. */}
        {!ready && <div className="absolute inset-0 shimmer opacity-40" aria-hidden="true" />}

        <video
          ref={videoRef}
          className={cn(
            'relative size-full object-cover transition-opacity duration-500',
            ready ? 'opacity-100' : 'opacity-0',
          )}
          src={source}
          muted={muted}
          playsInline
          loop
          preload={active ? 'auto' : 'none'}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setPaused(false)}
        />

        {/* click/tap surface: single tap play-pause, double tap like */}
        <button
          type="button"
          onClick={handleSurfaceClick}
          aria-label="Play or pause. Double tap to like."
          className="absolute inset-0 z-10 cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 scrim-top" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 scrim-bottom" aria-hidden="true" />

        {/* paused indicator */}
        {paused && (
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-black/45 backdrop-blur-md">
              <Play className="size-7 fill-white text-white" />
            </span>
          </div>
        )}

        {/* double-tap heart */}
        {showBurst && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
            <Heart
              className="size-28 fill-brand-500 text-brand-500 drop-shadow-[0_8px_28px_rgba(255,59,78,0.55)] animate-[var(--animate-heart-drop)]"
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* mute toggle — the feed was permanently muted with no way to hear it */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute right-3 top-3 z-30 grid size-10 place-items-center rounded-full glass border border-white/15 text-white transition-all duration-200 hover:scale-105 hover:bg-black/50 active:scale-90 focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? <VolumeX className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
        </button>

        {/* caption — inside the frame on mobile/tablet */}
        {showCaption && (
          <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-[calc(env(safe-area-inset-bottom,0px)+84px)] pr-[76px] md:pb-6 lg:hidden">
            <ReelCaption item={item} partner={partner} />
          </div>
        )}

        {/* action rail — overlaid on mobile/tablet, moved to the side rail on desktop */}
        {showActions && (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+96px)] right-3 z-30 flex flex-col items-center gap-4 md:bottom-6 lg:hidden">
            <LikeButton
              liked={liked}
              count={item.likeCount}
              onClick={() => {
                if (!liked) celebrate()
                onLike?.(item)
              }}
            />
            <SaveButton saved={saved} count={item.savesCount} onClick={() => onSave?.(item)} />
            <ReelActionButton
              icon={Share2}
              label="Share"
              showCount={false}
              onClick={() => onShare?.(item)}
            />
            <ReelActionButton
              icon={paused ? Play : Pause}
              label={paused ? 'Play' : 'Pause'}
              showCount={false}
              onClick={togglePlay}
              className="md:hidden"
            />
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Memoised so scrolling doesn't re-render every mounted reel. Only the fields
 * the item actually renders are compared.
 */
export default memo(ReelItem, (prev, next) => {
  return (
    prev.item._id === next.item._id &&
    prev.item.likeCount === next.item.likeCount &&
    prev.item.savesCount === next.item.savesCount &&
    prev.active === next.active &&
    prev.muted === next.muted &&
    prev.liked === next.liked &&
    prev.saved === next.saved &&
    prev.showActions === next.showActions &&
    prev.showCaption === next.showCaption
  )
})
