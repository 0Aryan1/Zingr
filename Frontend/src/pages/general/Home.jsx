import React, { useCallback, useEffect, useRef, useState } from 'react'

import ReelFeed from '@/components/ReelFeed'
import ReelFeedSkeleton from '@/components/reels/ReelFeedSkeleton'
import api from '@/lib/api'

const RESTORE_KEY = 'homeScrollPosition'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [savedIds, setSavedIds] = useState(() => new Set())

  useEffect(() => {
    api
      .get('/api/food')
      .then((response) => {
        setVideos(response.data.foods)
      })
      .catch(() => {
        /* noop: optionally handle error */
      })
      .finally(() => setLoading(false))
  }, [])

  // Hydrate saved state so bookmarks render filled on load. There is no
  // equivalent for likes — the feed carries no per-user like flag and there
  // is no "my likes" endpoint — so liked state stays session-local.
  useEffect(() => {
    api
      .get('/api/food/save')
      .then((response) => {
        const ids = (response.data.savedFoods ?? [])
          .map((entry) => entry?.food?._id)
          .filter(Boolean)
        setSavedIds(new Set(ids))
      })
      .catch(() => {
        /* saved state simply stays empty */
      })
  }, [])

  // Read the current sets without closing over them, so the toggle callbacks
  // stay referentially stable across the virtualised list.
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
      // The endpoint is a toggle and never returns the new count, so reconcile
      // against which branch the server actually took.
      const serverLiked = Boolean(response.data.like)
      if (serverLiked === wasLiked) {
        applyCount(setVideos, item._id, 'likeCount', serverLiked ? 1 : -1)
        setLikedIds((prev) => setId(prev, item._id, serverLiked))
      }
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
      const serverSaved = Boolean(response.data.save)
      if (serverSaved === wasSaved) {
        applyCount(setVideos, item._id, 'savesCount', serverSaved ? 1 : -1)
        setSavedIds((prev) => setId(prev, item._id, serverSaved))
      }
    } catch {
      applyCount(setVideos, item._id, 'savesCount', -delta)
      setSavedIds((prev) => setId(prev, item._id, wasSaved))
    }
  }, [savedIdsRef])

  if (loading) return <ReelFeedSkeleton />

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
