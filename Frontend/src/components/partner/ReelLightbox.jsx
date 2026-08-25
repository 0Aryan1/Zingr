import React, { useCallback, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Bookmark, Heart, Play, Volume2, VolumeX, X } from 'lucide-react'

import { compactNumber } from '@/lib/format'
import { ikVideo } from '@/lib/imagekit'

/** Plays a single reel from the grid, phone-shaped, on a dimmed backdrop. */
export default function ReelLightbox({ item, onOpenChange }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  /**
   * Start playback once the element actually has data, not when `item`
   * changes — at that point the new source hasn't loaded and play() rejects.
   * `muted` is forced on the DOM node first: an unmuted autoplay attempt is
   * refused outright by every browser.
   */
  const startPlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }, [])

  const handleOpenChange = useCallback(
    (open) => {
      // Reset here rather than in an effect: the keyed <video> remounts per
      // reel, so a fresh element always starts paused.
      if (!open) setPlaying(false)
      onOpenChange?.(open)
    },
    [onOpenChange],
  )

  return (
    <Dialog.Root open={Boolean(item)} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[92dvh] w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[var(--radius-lg)] bg-ink-950 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{item?.name || 'Reel'}</Dialog.Title>

          {item && (
            <>
              <div className="relative aspect-[9/16] w-full bg-black">
                <video
                  // Remount per reel so a new source never inherits the
                  // previous element's playback state.
                  key={item._id}
                  ref={videoRef}
                  className="size-full object-cover"
                  src={ikVideo(item.video)}
                  muted={muted}
                  playsInline
                  loop
                  preload="metadata"
                  controls={false}
                  onLoadedData={startPlayback}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />

                {/* Tap surface + explicit play affordance. Without this, a
                    refused autoplay left a frozen first frame and no way to
                    start the video at all. */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause' : 'Play'}
                  className="absolute inset-0 z-10 grid place-items-center focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  {!playing && (
                    <span className="grid size-16 place-items-center rounded-full bg-black/45 backdrop-blur-md transition-transform duration-200 hover:scale-105">
                      <Play className="size-7 fill-white text-white" />
                    </span>
                  )}
                </button>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 scrim-bottom" />

                <button
                  type="button"
                  onClick={() => setMuted((v) => !v)}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className="absolute bottom-3 right-3 z-20 grid size-10 place-items-center rounded-full glass border border-white/15 text-white transition-transform hover:scale-105 active:scale-90"
                >
                  {muted ? <VolumeX className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
                </button>

                <div className="absolute inset-x-0 bottom-0 p-4 pr-16">
                  {item.name && (
                    <p className="text-[16px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                      {item.name}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3.5 text-[12px] font-bold text-white/85">
                    <span className="flex items-center gap-1">
                      <Heart className="size-3.5 fill-brand-500 text-brand-500" />
                      {compactNumber(item.likeCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="size-3.5 fill-amber-300 text-amber-300" />
                      {compactNumber(item.savesCount)}
                    </span>
                  </div>
                </div>
              </div>

              {item.description && (
                <p className="max-h-28 overflow-y-auto border-t border-white/10 p-4 text-[13.5px] leading-relaxed text-white/70">
                  {item.description}
                </p>
              )}
            </>
          )}

          <Dialog.Close
            className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full glass border border-white/15 text-white transition-transform hover:scale-105 active:scale-90 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
