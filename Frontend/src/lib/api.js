import axios from 'axios'
import API_URL from '../config/api'

/**
 * Shared axios instance. Auth is an httpOnly `token` cookie, so every request
 * must send credentials — this is what `withCredentials: true` was doing by
 * hand at ~13 call sites.
 *
 * Paths passed to this client are relative: `api.get('/api/food')`.
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

/** Pull a human-readable message off an axios error, with a sane fallback. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection.'
  return fallback
}

export { API_URL }
export default api
