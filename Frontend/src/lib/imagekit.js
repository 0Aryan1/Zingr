/**
 * ImageKit delivery helpers.
 *
 * The backend stores bare upload URLs (`https://ik.imagekit.io/<id>/<uuid>`)
 * with no transformation applied, so videos are served at original resolution
 * and bitrate. ImageKit accepts query-string transforms, which means we can
 * request format-optimised, width-appropriate assets purely client-side —
 * no backend change required.
 *
 * Reference: `tr` accepts comma-separated params.
 *   f-auto  → best format the browser accepts
 *   q-auto  → adaptive quality
 *   w-<n>   → resize width
 *   so-<s>  → "start offset": grab a still frame at <s> seconds (poster)
 *   bl-<n>  → blur, for the low-quality placeholder
 */

const IK_HOST = 'ik.imagekit.io'

function isImageKit(url) {
  return typeof url === 'string' && url.includes(IK_HOST)
}

/** Append `tr` params without clobbering an existing query string. */
function withTransform(url, tr) {
  if (!isImageKit(url)) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}tr=${tr}`
}

/**
 * Video source sized for the surface it plays on.
 * Reels never render wider than ~480 CSS px, so 720 covers 1.5x DPR.
 */
export function ikVideo(url, { width = 720 } = {}) {
  return withTransform(url, `f-auto,q-auto,w-${width}`)
}

/**
 * Sharp poster frame — the first frame of the video, used as the `poster`
 * attribute so a reel shows food instead of black while it buffers.
 */
export function ikPoster(url, { width = 480, second = 1 } = {}) {
  return withTransform(url, `so-${second},f-auto,q-70,w-${width}`)
}

/**
 * Blurred low-quality placeholder. Tiny payload, renders instantly, and sits
 * under the sharp poster so there is never a flash of empty black.
 */
export function ikBlurPlaceholder(url, { second = 1 } = {}) {
  return withTransform(url, `so-${second},f-auto,q-20,w-64,bl-12`)
}

/** Grid/thumbnail still, for discover tiles and the partner reel grid. */
export function ikThumb(url, { width = 320, second = 1 } = {}) {
  return withTransform(url, `so-${second},f-auto,q-70,w-${width}`)
}
