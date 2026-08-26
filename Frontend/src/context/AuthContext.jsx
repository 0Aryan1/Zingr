import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import api from '@/lib/api'

/**
 * Single source of truth for `GET /api/auth/check`.
 *
 * ProtectedRoute and PublicRoute each ran a byte-identical copy of this
 * effect keyed on `location.pathname`, so the request re-fired on *every*
 * navigation and flashed a full-screen "Loading..." each time. Same endpoint,
 * same response handling — just hoisted, cached, and refreshable on demand.
 *
 * There is deliberately no "mark signed in" shortcut. Trusting a login
 * response body meant the app reported a session the browser had never
 * stored: on any device that blocks the auth cookie, registration appeared to
 * succeed and then collapsed on the first refresh. Sessions are only ever
 * confirmed by asking the server.
 */
const AuthContext = createContext(null)

const SIGNED_OUT = {
  isAuthenticated: false,
  userType: null,
  userId: null,
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(SIGNED_OUT)
  const [loading, setLoading] = useState(true)
  const inFlight = useRef(null)

  const refresh = useCallback(async ({ force = false } = {}) => {
    // Collapse concurrent callers (two guards mounting at once) into one
    // request. `force` opts out: a check issued right after login must not be
    // answered by a request that was already in flight before the cookie
    // existed, or it would report the old signed-out state.
    if (inFlight.current && !force) return inFlight.current

    const request = (async () => {
      try {
        const response = await api.get('/api/auth/check')
        if (response.data.authenticated) {
          const next = {
            isAuthenticated: true,
            userType: response.data.userType,
            userId: response.data.userId,
          }
          setAuth(next)
          return next
        }
        setAuth(SIGNED_OUT)
        return SIGNED_OUT
      } catch {
        setAuth(SIGNED_OUT)
        return SIGNED_OUT
      } finally {
        setLoading(false)
        inFlight.current = null
      }
    })()

    inFlight.current = request
    return request
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ ...auth, loading, refresh }),
    [auth, loading, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}

export default AuthContext
