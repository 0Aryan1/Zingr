import React, { useEffect, useRef, useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion'
import { ikVideo } from '@/lib/imagekit'
import { cn } from '@/lib/utils'

/**
 * Restaurant hero: the partner's most recent reel, autoplaying muted on loop
 * with click-to-unmute. Falls back to a static poster when the visitor has
 * asked for reduced motion.
 */
export default function PartnerHero({ item, className }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [reducedMotion, item?._id])

  if (!item) return null

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    // Starting muted is what makes autoplay legal; this hands sound back.
    const next = !muted
    video.muted = next
    setMuted(next)
    if (!next && video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const startPlayback = () => {
    const video = videoRef.current
    if (!video) return
    video.play().then(() => setPlaying(true)).catch(() => {})
  }

  return (
    <div
      className={cn(
        'relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 sm:aspect-[16/10]',
        className,
      )}
    >
      {!ready && <div className="shimmer absolute inset-0 opacity-40" aria-hidden="true" />}

      <video
        ref={videoRef}
        className={cn(
          'relative size-full object-cover transition-opacity duration-500',
          ready ? 'opacity-100' : 'opacity-0',
        )}
        // Under reduced motion the source still loads, seeked to a frame, so
        // the hero shows the dish as a still instead of going blank — it just
        // never autoplays.
        src={
          reducedMotion
            ? `${ikVideo(item.video, { width: 960 })}#t=0.1`
            : ikVideo(item.video, { width: 960 })
        }
        muted={muted}
        playsInline
        loop
        preload="metadata"
        onLoadedData={() => setReady(true)}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 scrim-bottom" aria-hidden="true" />

      {!playing && (
        <button
          type="button"
          onClick={startPlayback}
          aria-label="Play reel"
          className="absolute inset-0 grid place-items-center focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <span className="grid size-16 place-items-center rounded-full bg-black/45 backdrop-blur-md transition-transform duration-200 hover:scale-105">
            <Play className="size-7 fill-white text-white" />
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full glass border border-white/15 text-white transition-all duration-200 hover:scale-105 hover:bg-black/50 active:scale-90 focus-visible:ring-2 focus-visible:ring-white"
      >
        {muted ? <VolumeX className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
      </button>

      {item.name && (
        <p className="absolute bottom-4 left-4 right-16 truncate text-[15px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {item.name}
        </p>
      )}
    </div>
  )
}
