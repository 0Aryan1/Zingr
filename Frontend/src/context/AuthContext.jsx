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

  const refresh = useCallback(async () => {
    // Collapse concurrent callers (two guards mounting at once) into one request.
    if (inFlight.current) return inFlight.current

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

  /** Called after a successful login/register so guards see the new session. */
  const markSignedIn = useCallback((userType, userId) => {
    setAuth({ isAuthenticated: true, userType, userId })
    setLoading(false)
  }, [])

  const value = useMemo(
    () => ({ ...auth, loading, refresh, markSignedIn }),
    [auth, loading, refresh, markSignedIn],
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
