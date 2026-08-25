import { useEffect, useState } from 'react'

/**
 * Debounce a fast-changing value — search and filter inputs settle at ~300ms
 * before the list re-filters.
 */
export default function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
