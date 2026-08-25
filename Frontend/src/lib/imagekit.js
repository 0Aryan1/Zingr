/**
 * ImageKit delivery helpers.
 *
 * The backend stores bare upload URLs (`https://ik.imagekit.io/<id>/<uuid>`)
 * with no transformation applied, so videos are served at original resolution
 * and bitrate. ImageKit accepts query-string transforms, which means playback
 * can be optimised purely client-side with no backend change.
 *
 * Two constraints shape what's safe to use here:
 *
 *  - `storage.service.js` uploads with `fileName: uuid()` — a bare uuid with
 *    NO file extension. ImageKit's video-thumbnail path (`/ik-thumbnail.jpg`)
 *    keys off a recognisable video asset, so it is unreliable for these URLs.
 *  - Video transformations are metered in Video Processing Units on every
 *    plan, free included. Generating a still per grid tile burns them on each
 *    page view.
 *
 * So still frames are produced client-side by `ReelThumb` instead. The
 * thumbnail helper below is kept, in the correct documented form, for if the
 * backend later uploads with a proper `.mp4` extension.
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
 * Server-side still frame, in ImageKit's documented form:
 *   https://ik.imagekit.io/<id>/<video>.mp4/ik-thumbnail.jpg?tr=so-1,w-480
 *
 * NOT wired up by default — see the note above. `ReelThumb` handles stills.
 * Enable this only once uploads carry a video extension, and budget for the
 * VPU cost of one generation per distinct thumbnail.
 */
export function ikThumbnailUrl(url, { width = 480, second = 1 } = {}) {
  if (!isImageKit(url)) return url
  return `${url}/ik-thumbnail.jpg?tr=so-${second},w-${width}`
}
