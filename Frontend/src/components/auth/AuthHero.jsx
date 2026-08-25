import React from 'react'
import { Heart, Play, Sparkles, Star } from 'lucide-react'

import Wordmark from '@/components/brand/Wordmark'
import { cn } from '@/lib/utils'

/**
 * The hero half of the auth split-screen.
 *
 * A looping montage of real reels isn't sourceable here — reel URLs are
 * per-partner and there are no seeded assets — so the hero is an animated
 * warm mesh gradient behind a bento collage of abstract reel tiles. Reads as
 * food-video without shipping placeholder stock photography.
 *
 * All motion runs on CSS keyframes, so the global prefers-reduced-motion
 * kill-switch in theme.css disables it.
 */
export default function AuthHero({ className }) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-ink-950 text-white',
        className,
      )}
    >
      {/* animated warm mesh */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 size-[36rem] rounded-full bg-brand-500/35 blur-[110px] motion-safe:animate-[drift-a_18s_ease-in-out_infinite]" />
        <div className="absolute -bottom-32 -right-20 size-[32rem] rounded-full bg-amber-400/30 blur-[110px] motion-safe:animate-[drift-b_22s_ease-in-out_infinite]" />
        <div className="absolute left-1/3 top-1/3 size-[24rem] rounded-full bg-brand-700/35 blur-[100px] motion-safe:animate-[drift-c_26s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(10,10,10,0.55)_75%)]" />
      </div>

      <style>{`
        @keyframes drift-a { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(6%,8%,0) scale(1.12)} }
        @keyframes drift-b { 0%,100%{transform:translate3d(0,0,0) scale(1.05)} 50%{transform:translate3d(-8%,-6%,0) scale(0.95)} }
        @keyframes drift-c { 0%,100%{transform:translate3d(0,0,0) scale(0.95)} 50%{transform:translate3d(10%,-10%,0) scale(1.15)} }
      `}</style>

      <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 lg:p-12 xl:p-16">
        <Wordmark className="shrink-0 text-3xl lg:text-4xl" />

        {/* bento collage of reel tiles */}
        <div
          aria-hidden="true"
          className="my-8 grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-3 lg:my-10 lg:gap-4"
          // Absorbs whatever vertical space is left between the wordmark and
          // the tagline, so the copy is never pushed off a short viewport.
          style={{ minHeight: '200px', maxHeight: '520px' }}
        >
          <ReelTile
            className="col-span-2 row-span-2"
            from="from-brand-500/85"
            to="to-brand-700/70"
            delay="0ms"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">
                <Heart className="size-3 fill-current" /> 2.4K
              </span>
            }
          />
          <ReelTile
            className="row-span-2"
            from="from-amber-300/85"
            to="to-amber-500/70"
            delay="140ms"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">
                <Star className="size-3 fill-current" /> Top
              </span>
            }
          />
          <ReelTile
            className="row-span-2"
            from="from-amber-400/80"
            to="to-brand-500/65"
            delay="280ms"
          />
          <ReelTile
            className="col-span-2 row-span-2"
            from="from-brand-600/80"
            to="to-amber-400/60"
            delay="420ms"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[10px] font-bold backdrop-blur-sm">
                <Sparkles className="size-3" /> New
              </span>
            }
          />
        </div>

        <div className="max-w-md shrink-0">
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,3rem)] font-black leading-[1.05] tracking-tight">
            Watch it.
            <br />
            Crave it.
            <br />
            <span className="bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
              Order it.
            </span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Endless food reels from kitchens near you. Tap a dish, meet the
            restaurant, skip the guesswork.
          </p>
        </div>
      </div>
    </div>
  )
}

function ReelTile({ className, from, to, delay, badge }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-md)] border border-white/12',
        'bg-gradient-to-br shadow-lg',
        from,
        to,
        'motion-safe:animate-[var(--animate-float-in)]',
        className,
      )}
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_55%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-9 place-items-center rounded-full bg-black/25 backdrop-blur-sm">
          <Play className="size-4 fill-white text-white" />
        </span>
      </div>
      {badge && <div className="absolute bottom-2 left-2">{badge}</div>}
    </div>
  )
}
