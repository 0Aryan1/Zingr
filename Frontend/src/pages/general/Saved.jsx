import React, { useCallback, useEffect, useMemo, useState } from 'react'

import ReelFeed from '@/components/ReelFeed'
import ReelFeedSkeleton from '@/components/reels/ReelFeedSkeleton'
import api from '@/lib/api'

const Saved = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/food/save')
      .then((response) => {
        // The endpoint returns save wrappers, not food docs — unwrap `.food`.
        const savedFoods = response.data.savedFoods.map((item) => ({
          _id: item.food._id,
          name: item.food.name,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          foodPartner: item.food.foodPartner,
        }))
        setVideos(savedFoods)
      })
      .catch(() => {
        setVideos([]) // Set empty array if no saved videos
      })
      .finally(() => setLoading(false))
  }, [])

  /**
   * Unsaving now removes the reel from the list. It used to stay on screen
   * with only the count decremented, which read as though nothing happened.
   */
  const removeSaved = useCallback(async (item) => {
    const snapshot = item
    setVideos((prev) => prev.filter((video) => video._id !== item._id))

    try {
      await api.post('/api/food/save', { foodId: item._id })
    } catch {
      // Put it back where it was if the toggle didn't land.
      setVideos((prev) =>
        prev.some((video) => video._id === snapshot._id) ? prev : [...prev, snapshot],
      )
    }
  }, [])

  // Everything on this page is, by definition, saved.
  const savedIds = useMemo(
    () => new Set(videos.map((video) => video._id)),
    [videos],
  )

  if (loading) return <ReelFeedSkeleton />

  return (
    <ReelFeed
      items={videos}
      onSave={removeSaved}
      savedIds={savedIds}
      emptyMessage="Nothing saved yet. Tap the bookmark on a reel to keep it here."
    />
  )
}

export default Saved
