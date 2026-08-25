import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * CSS handles most of the reduced-motion story via the global kill-switch in
 * theme.css. This is for the cases CSS can't reach — not autoplaying the
 * hero video, skipping JS-driven smooth scrolling.
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = (event) => setReduced(event.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
