import React, { useCallback, useEffect, useRef, useState } from 'react'
import { WifiOff } from 'lucide-react'

import ReelFeed from '@/components/ReelFeed'
import ReelFeedSkeleton from '@/components/reels/ReelFeedSkeleton'
import api, { errorMessage } from '@/lib/api'

/**
 * Deliberately NOT the old `homeScrollPosition` key. That one held a scroll
 * offset in pixels; this holds a reel index. Reusing it meant a browser still
 * carrying a legacy value (e.g. "2436") pointed the feed at item 2436 of a
 * three-item list, which rendered an empty scroller — the feed looked like it
 * had no videos at all.
 */
const RESTORE_KEY = 'zingr:feed-index:v1'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [savedIds, setSavedIds] = useState(() => new Set())

  useEffect(() => {
    api
      .get('/api/food')
      .then((response) => {
        const foods = response.data.foods ?? []
        setVideos(foods)
        // The feed now reports this user's like/save state per reel, so the
        // heart and bookmark render filled on first paint instead of resetting
        // on every reload.
        setLikedIds(new Set(foods.filter((f) => f.isLiked).map((f) => f._id)))
        setSavedIds(new Set(foods.filter((f) => f.isSaved).map((f) => f._id)))
      })
      .catch((error) => {
        // A swallowed failure here was indistinguishable from an empty feed:
        // the user saw "No videos available" whether the request 401'd, the
        // network dropped, or there genuinely were no reels.
        setLoadError(errorMessage(error, 'Could not load the feed.'))
      })
      .finally(() => setLoading(false))
  }, [])

  // Read the current sets without closing over them, so the toggle callbacks
  // keep a stable identity across every row in the feed.
  const likedIdsRef = useLatest(likedIds)
  const savedIdsRef = useLatest(savedIds)

  /** Optimistic: bump the count now, roll back only if the request fails. */
  const likeVideo = useCallback(async (item) => {
    const wasLiked = likedIdsRef.current.has(item._id)
    const delta = wasLiked ? -1 : 1

    applyCount(setVideos, item._id, 'likeCount', delta)
    setLikedIds((prev) => toggleId(prev, item._id))

    try {
      const response = await api.post('/api/food/like', { foodId: item._id })
      // The toggle now returns the resulting state and the authoritative
      // count, so settle on those rather than trusting the optimistic guess.
      const { isLiked, likeCount } = response.data
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, likeCount } : v)),
      )
      setLikedIds((prev) => setId(prev, item._id, isLiked))
    } catch {
      applyCount(setVideos, item._id, 'likeCount', -delta)
      setLikedIds((prev) => setId(prev, item._id, wasLiked))
    }
  }, [likedIdsRef])

  const saveVideo = useCallback(async (item) => {
    const wasSaved = savedIdsRef.current.has(item._id)
    const delta = wasSaved ? -1 : 1

    applyCount(setVideos, item._id, 'savesCount', delta)
    setSavedIds((prev) => toggleId(prev, item._id))

    try {
      const response = await api.post('/api/food/save', { foodId: item._id })
      const { isSaved, savesCount } = response.data
      setVideos((prev) =>
        prev.map((v) => (v._id === item._id ? { ...v, savesCount } : v)),
      )
      setSavedIds((prev) => setId(prev, item._id, isSaved))
    } catch {
      applyCount(setVideos, item._id, 'savesCount', -delta)
      setSavedIds((prev) => setId(prev, item._id, wasSaved))
    }
  }, [savedIdsRef])

  if (loading) return <ReelFeedSkeleton />
  if (loadError) return <FeedError message={loadError} />

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      likedIds={likedIds}
      savedIds={savedIds}
      restoreKey={RESTORE_KEY}
      emptyMessage="No videos available."
    />
  )
}

/* ------------------------------------------------------------------ */

function FeedError({ message }) {
  return (
    <div className="grid h-dvh place-items-center px-6 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-white/5 text-white/40">
          <WifiOff className="size-7" strokeWidth={1.75} />
        </div>
        <p className="mt-5 text-[15px] font-semibold text-white/80">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

/**
 * Mirror a value into a ref so callbacks can read the latest one without
 * closing over it. Written in an effect, never during render.
 */
function useLatest(value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

function applyCount(setItems, id, key, delta) {
  setItems((prev) =>
    prev.map((item) =>
      item._id === id ? { ...item, [key]: Math.max((item[key] || 0) + delta, 0) } : item,
    ),
  )
}

function toggleId(set, id) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function setId(set, id, present) {
  const next = new Set(set)
  if (present) next.add(id)
  else next.delete(id)
  return next
}

export default Home
