const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * Compact count for stat badges and action rails: 12400 → "12.4K".
 *
 * Counts are clamped at zero on purpose. The backend `$inc`s `likeCount` /
 * `savesCount` without a transaction or a unique index on (user, food), so
 * a drifted count can legitimately be negative — never render that.
 */
export function compactNumber(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '0'
  return compactFormatter.format(n)
}

/** Sum a numeric field across a list, ignoring missing/NaN entries. */
export function sumBy(items, key) {
  if (!Array.isArray(items)) return 0
  return items.reduce((total, item) => {
    const n = Number(item?.[key])
    return total + (Number.isFinite(n) && n > 0 ? n : 0)
  }, 0)
}

/** Up-to-two-letter initials for the generated partner avatar. */
export function initials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Deterministic hue from a string, so a given restaurant always gets the same
 * avatar colour across sessions.
 *
 * Capped at 42deg (reds through orange, stopping short of yellow) because the
 * avatar carries white initials — yellow at a readable lightness doesn't hold
 * enough contrast against them.
 */
export function hueFromString(value) {
  const str = String(value ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 42
}

/** Human file size for the upload chip. */
export function fileSize(bytes) {
  const n = Number(bytes)
  if (!Number.isFinite(n) || n <= 0) return '0 MB'
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
