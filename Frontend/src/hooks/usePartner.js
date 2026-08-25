import { useEffect, useState } from 'react'

import api from '@/lib/api'

/**
 * `GET /api/food` returns `foodPartner` as a bare ObjectId string — the feed
 * response is not populated — so a reel cannot show the restaurant's name
 * without a second lookup.
 *
 * Rather than firing one request per reel, this resolves the partner for the
 * *active* reel only and caches the result module-wide, so scrolling back and
 * forth costs nothing. Concurrent callers for the same id share one request.
 */
const cache = new Map()
const inFlight = new Map()

export function getCachedPartner(id) {
  return id ? (cache.get(id) ?? null) : null
}

export function fetchPartner(id) {
  if (!id) return Promise.resolve(null)
  if (cache.has(id)) return Promise.resolve(cache.get(id))
  if (inFlight.has(id)) return inFlight.get(id)

  const request = api
    .get(`/api/food-partner/${id}`)
    .then((response) => {
      const partner = response.data?.foodPartner ?? null
      cache.set(id, partner)
      return partner
    })
    .catch(() => {
      // Cache the miss so a broken id doesn't retry on every scroll pass.
      cache.set(id, null)
      return null
    })
    .finally(() => {
      inFlight.delete(id)
    })

  inFlight.set(id, request)
  return request
}

/** Resolve one partner, returning the cached value synchronously when present. */
export function usePartner(id) {
  const [resolved, setResolved] = useState(() => ({
    id,
    partner: getCachedPartner(id),
  }))

  // Derived state: when the id changes, fall straight to the cache during
  // render rather than flashing the previous partner for a frame.
  if (resolved.id !== id) {
    setResolved({ id, partner: getCachedPartner(id) })
  }

  useEffect(() => {
    if (!id || getCachedPartner(id) !== null) return undefined

    let active = true
    fetchPartner(id).then((partner) => {
      if (active) setResolved({ id, partner })
    })
    return () => {
      active = false
    }
  }, [id])

  return resolved.id === id ? resolved.partner : null
}

export default usePartner
