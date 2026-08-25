import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Clapperboard,
  Heart,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
} from 'lucide-react'

import PartnerHero from '@/components/partner/PartnerHero'
import ReelGrid from '@/components/partner/ReelGrid'
import ReelLightbox from '@/components/partner/ReelLightbox'
import StatBadge from '@/components/partner/StatBadge'
import { BrandAvatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { sumBy } from '@/lib/format'
import { ikThumb } from '@/lib/imagekit'
import { cn } from '@/lib/utils'

/**
 * One restaurant page, two variants.
 *
 * `PartnerProfile` (owner) and `User-PartnerProfile` (public) were separate
 * near-identical files — same request, same markup — differing only in a back
 * button and a commented-out stats block.
 *
 * Tabs are Reels / Menu / About. There is deliberately no Reviews tab: the
 * backend has no rating field and no review model, so it would have nothing
 * behind it.
 */
export default function PartnerProfileView({ id, variant = 'public' }) {
  const navigate = useNavigate()
  const isOwner = variant === 'owner'

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

  /**
   * Social proof, derived from what the API actually returns. The schema's
   * `totalMeals` / `customersServed` are never written by any backend code,
   * so they are permanently 0 and are not surfaced.
   */
  const stats = useMemo(
    () => ({
      reels: videos.length,
      likes: sumBy(videos, 'likeCount'),
      saves: sumBy(videos, 'savesCount'),
    }),
    [videos],
  )

  const closeLightbox = useCallback((open) => {
    if (!open) setLightboxItem(null)
  }, [])

  if (loading) return <PartnerProfileSkeleton isOwner={isOwner} />

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
      {!isOwner && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-5 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      )}

      <div className="lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-10">
        {/* ---------------- info sidebar (sticky on desktop) ---------------- */}
        <aside className="lg:sticky lg:top-10">
          <div className="flex items-start gap-4">
            <BrandAvatar name={profile?.name} className="size-16 shrink-0 lg:size-20" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[1.6rem] font-bold leading-tight tracking-tight text-foreground lg:text-[1.85rem]">
                {profile?.name ?? 'Restaurant'}
              </h1>
              {profile?.address && (
                <p className="mt-1.5 flex items-start gap-1.5 text-[13.5px] leading-snug text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  {profile.address}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5 lg:grid-cols-1">
            <StatBadge icon={Clapperboard} value={stats.reels} label="Reels" tone="brand" />
            <StatBadge icon={Heart} value={stats.likes} label="Likes earned" tone="amber" />
            <StatBadge icon={Bookmark} value={stats.saves} label="Saves" tone="amber" />
          </div>

          {/* desktop actions — the mobile equivalents live in the sticky bar */}
          <div className="mt-5 hidden flex-col gap-2.5 lg:flex">
            {isOwner ? (
              <Button asChild>
                <Link to="/create-food">
                  <Plus className="size-4" />
                  Upload a reel
                </Link>
              </Button>
            ) : (
              profile?.phone && (
                <Button asChild>
                  <a href={`tel:${profile.phone}`}>
                    <Phone className="size-4" />
                    Call restaurant
                  </a>
                </Button>
              )
            )}
          </div>
        </aside>

        {/* ---------------- tabbed content ---------------- */}
        <div className="mt-8 lg:mt-0">
          {videos.length > 0 && <PartnerHero item={videos[0]} className="mb-8" />}

          <Tabs defaultValue="reels">
            <TabsList>
              <TabsTrigger value="reels">Reels</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="reels">
              <ReelGrid
                items={videos}
                onSelect={setLightboxItem}
                emptyMessage={
                  isOwner
                    ? 'You have not posted a reel yet. Upload one to get started.'
                    : 'This restaurant has not posted any reels yet.'
                }
              />
            </TabsContent>

            <TabsContent value="menu">
              <MenuList items={videos} onSelect={setLightboxItem} />
            </TabsContent>

            <TabsContent value="about">
              <AboutPanel profile={profile} isOwner={isOwner} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ---------------- mobile sticky CTA ---------------- */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+62px)] z-40 border-t border-border bg-card/95 px-5 py-3 backdrop-blur-xl lg:hidden">
        {isOwner ? (
          <Button asChild className="w-full">
            <Link to="/create-food">
              <Plus className="size-4" />
              Upload a reel
            </Link>
          </Button>
        ) : profile?.phone ? (
          <Button asChild className="w-full">
            <a href={`tel:${profile.phone}`}>
              <Phone className="size-4" />
              Call {profile.name}
            </a>
          </Button>
        ) : (
          <p className="text-center text-[13px] text-muted-foreground">
            {profile?.address ?? 'Contact details unavailable'}
          </p>
        )}
      </div>

      <ReelLightbox item={lightboxItem} onOpenChange={closeLightbox} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Menu — the partner's dishes by name. There is no price field on the
   food model, so this lists dishes without prices.                    */
/* ------------------------------------------------------------------ */

function MenuList({ items, onSelect }) {
  if (items.length === 0) {
    return (
      <p className="rounded-[var(--radius-md)] border border-dashed border-border py-14 text-center text-[14px] text-muted-foreground">
        No dishes listed yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
      {items.map((item) => (
        <li key={item._id}>
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className="flex w-full items-center gap-4 p-3.5 text-left transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <img
              src={ikThumb(item.video, { width: 160 })}
              alt=""
              loading="lazy"
              className="size-16 shrink-0 rounded-[var(--radius-sm)] object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-foreground">
                {item.name || 'Untitled dish'}
              </span>
              {item.description && (
                <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[12px] font-bold text-muted-foreground">
              <Heart className="size-3.5 fill-brand-500 text-brand-500" />
              {item.likeCount ?? 0}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */

function AboutPanel({ profile, isOwner }) {
  const rows = [
    profile?.address && { icon: MapPin, label: 'Address', value: profile.address },
    profile?.phone && { icon: Phone, label: 'Phone', value: profile.phone },
    profile?.contactName && { icon: User, label: 'Contact', value: profile.contactName },
    // Only the owner sees their own email — it isn't a public detail.
    isOwner && profile?.email && { icon: Mail, label: 'Email', value: profile.email },
  ].filter(Boolean)

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-md)] border border-dashed border-border py-14 text-center text-[14px] text-muted-foreground">
        No contact details on file.
      </p>
    )
  }

  return (
    <dl className="flex flex-col divide-y divide-border overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3.5 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-muted text-muted-foreground">
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <dt className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-0.5 break-words text-[14.5px] font-medium text-foreground">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------------ */

function PartnerProfileSkeleton({ isOwner }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
      {!isOwner && <Skeleton className="mb-5 h-8 w-20" />}
      <div className="lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
        <div>
          <div className="flex items-start gap-4">
            <Skeleton className="size-16 rounded-full lg:size-20" />
            <div className="flex-1 space-y-2.5 pt-1">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2.5 lg:grid-cols-1">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-[62px] rounded-[var(--radius-md)]" />
            ))}
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <Skeleton className="aspect-[4/5] w-full rounded-[var(--radius-lg)] sm:aspect-[16/10]" />
          <Skeleton className="mt-8 h-11 w-full" />
          <div className="mt-6 grid grid-cols-3 gap-1.5 sm:gap-2.5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn('aspect-[3/4] rounded-[var(--radius-sm)]')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
