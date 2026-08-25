import React from 'react'

/** Shimmer stand-in for the reel column while the first fetch resolves. */
export default function ReelFeedSkeleton() {
  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden">
      <div className="relative h-full w-full lg:max-w-[var(--reel-column)]">
        <div className="relative h-full w-full overflow-hidden bg-ink-950 md:mx-auto md:my-6 md:h-[calc(100dvh-3rem)] md:w-auto md:aspect-[9/16] md:rounded-[var(--radius-lg)] md:border md:border-white/8">
          <div className="shimmer absolute inset-0 opacity-40" />

          {/* caption block */}
          <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 pb-24 pr-20 md:pb-8">
            <div className="shimmer h-6 w-32 rounded-full opacity-50" />
            <div className="shimmer h-4 w-3/5 rounded opacity-40" />
            <div className="shimmer h-3.5 w-4/5 rounded opacity-30" />
          </div>

          {/* action rail */}
          <div className="absolute bottom-24 right-3 flex flex-col gap-5 md:bottom-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div className="shimmer size-12 rounded-full opacity-50" />
                <div className="shimmer h-2.5 w-6 rounded opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* side rail */}
      <aside className="hidden w-[var(--rail-width)] shrink-0 flex-col gap-5 py-8 pr-8 lg:flex">
        <div className="shimmer h-56 rounded-[var(--radius-lg)] opacity-40" />
        <div className="shimmer h-24 rounded-[var(--radius-lg)] opacity-30" />
        <div className="shimmer h-64 rounded-[var(--radius-lg)] opacity-20" />
      </aside>
    </div>
  )
}
