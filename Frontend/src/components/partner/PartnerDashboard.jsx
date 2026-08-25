import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Clapperboard,
  Heart,
  MapPin,
  Plus,
  Trophy,
  Upload,
} from 'lucide-react'

import ReelGrid from '@/components/partner/ReelGrid'
import ReelLightbox from '@/components/partner/ReelLightbox'
import Sparkbars from '@/components/partner/Sparkbars'
import { BrandAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import ReelThumb from '@/components/reels/ReelThumb'
import { compactNumber, sumBy } from '@/lib/format'

/**
 * Partner dashboard at `/food-partner/:id`.
 *
 * Desktop-first — partners are far more likely to be on a laptop. Every
 * number here is derived from the reels the API returns; the schema's
 * `totalMeals` / `customersServed` fields are never written by any backend
 * code and would always read 0, so they aren't shown.
 */
export default function PartnerDashboard({ id }) {
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxItem, setLightboxItem] = useState(null)

  useEffect(() => {
    let active = true

    api
      .get(`/api/food-partner/${id}`)
      .then((response) => {
        if (!active) return
        setProfile(response.data.foodPartner)
        setVideos(response.data.foodPartner.foodItems ?? [])
      })
      .catch(() => {
        // Handle error silently
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const stats = useMemo(() => {
    const likes = videos.map((video) => video.likeCount ?? 0)
    const saves = videos.map((video) => video.savesCount ?? 0)
    const topReel = videos.reduce(
      (best, video) => ((video.likeCount ?? 0) > (best?.likeCount ?? -1) ? video : best),
      null,
    )
    return {
      reels: videos.length,
      likes: sumBy(videos, 'likeCount'),
      saves: sumBy(videos, 'savesCount'),
      likeSeries: likes,
      saveSeries: saves,
      reelSeries: videos.map(() => 1),
      topReel,
    }
  }, [videos])

  const closeLightbox = useCallback((open) => {
    if (!open) setLightboxItem(null)
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-6 sm:px-8 lg:pt-10">
      {/* ---------------- header ---------------- */}
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <BrandAvatar name={profile?.name} className="size-14 shrink-0 lg:size-16" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Dashboard
            </p>
            <h1 className="font-display mt-0.5 text-[1.6rem] font-bold leading-tight tracking-tight text-foreground lg:text-[2rem]">
              {profile?.name ?? 'Your restaurant'}
            </h1>
            {profile?.address && (
              <p className="mt-1.5 flex items-start gap-1.5 text-[13.5px] leading-snug text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                {profile.address}
              </p>
            )}
          </div>
        </div>

        <Button asChild size="lg">
          <Link to="/create-food">
            <Plus className="size-4" />
            Upload a reel
          </Link>
        </Button>
      </header>

      {/* ---------------- stat cards ---------------- */}
      <section className="mt-8 grid gap-3.5 sm:grid-cols-3" aria-label="Performance">
        <StatCard
          icon={Clapperboard}
          tone="brand"
          value={stats.reels}
          label="Reels posted"
          series={stats.reelSeries}
          caption="One bar per reel"
        />
        <StatCard
          icon={Heart}
          tone="brand"
          value={stats.likes}
          label="Likes earned"
          series={stats.likeSeries}
          caption="Likes across your reels"
        />
        <StatCard
          icon={Bookmark}
          tone="amber"
          value={stats.saves}
          label="Saves"
          series={stats.saveSeries}
          caption="Saves across your reels"
        />
      </section>

      {/* ---------------- top performer ---------------- */}
      {stats.topReel && stats.reels > 1 && (
        <section className="mt-8 flex items-center gap-4 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 p-4">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-amber-100">
            <ReelThumb src={stats.topReel.video} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-amber-600">
              <Trophy className="size-3.5" />
              Best performing reel
            </p>
            <p className="mt-1 truncate text-[15px] font-bold text-foreground">
              {stats.topReel.name || 'Untitled dish'}
            </p>
            <p className="mt-0.5 text-[13px] text-cream-700">
              {compactNumber(stats.topReel.likeCount)} likes ·{' '}
              {compactNumber(stats.topReel.savesCount)} saves
            </p>
          </div>
        </section>
      )}

      {/* ---------------- reels ---------------- */}
      <section className="mt-9" aria-label="Your reels">
        <h2 className="mb-4 text-[15px] font-bold text-foreground">Your reels</h2>

        {videos.length === 0 ? (
          <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border py-16 text-center">
            <div className="grid size-14 place-items-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
              <Upload className="size-6" strokeWidth={1.75} />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-foreground">No reels yet</p>
            <p className="mt-1.5 max-w-xs text-[13.5px] text-muted-foreground">
              Post your first dish and it starts showing up in the feed straight away.
            </p>
            <Button asChild className="mt-5">
              <Link to="/create-food">
                <Plus className="size-4" />
                Upload a reel
              </Link>
            </Button>
          </div>
        ) : (
          <ReelGrid items={videos} onSelect={setLightboxItem} />
        )}
      </section>

      <ReelLightbox item={lightboxItem} onOpenChange={closeLightbox} />
    </div>
  )
}

/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, tone, value, label, series, caption }) {
  const tones = {
    brand: 'bg-primary/10 text-primary',
    amber: 'bg-amber-100 text-amber-600',
  }

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center gap-2.5">
        <span className={`grid size-8 place-items-center rounded-[var(--radius-sm)] ${tones[tone]}`}>
          <Icon className="size-4" strokeWidth={2.2} />
        </span>
        <span className="text-[12.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>

      <p className="stat-numerals mt-3 text-[2.25rem] font-bold leading-none text-foreground">
        {compactNumber(value)}
      </p>

      <div className="mt-4">
        <Sparkbars values={series} tone={tone} />
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">{caption}</p>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-6 sm:px-8 lg:pt-10">
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-full lg:size-16" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-2/5" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>

      <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-[168px] rounded-[var(--radius-lg)]" />
        ))}
      </div>

      <Skeleton className="mt-9 h-5 w-28" />
      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2.5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4] rounded-[var(--radius-sm)]" />
        ))}
      </div>
    </div>
  )
}
