import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import AccessDenied from '@/components/AccessDenied'
import Splash from '@/components/feedback/Splash'
import { useAuth } from '@/context/AuthContext'

/**
 * Route guard. Behaviour is unchanged from the original — unauthenticated
 * users go to /user/login carrying `state.from`, role mismatches get a 403 —
 * but the `GET /api/auth/check` call now comes from AuthContext instead of a
 * per-navigation effect.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userType, userId, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Splash surface={requiredRole === 'user' ? 'reels' : 'commerce'} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />
  }

  if (requiredRole === 'user' && userType === 'foodPartner') {
    return (
      <AccessDenied
        message="This page is part of the Zingr feed for diners. You're signed in as a food partner."
        homeTo={`/food-partner/${userId}`}
        homeLabel="Go to dashboard"
      />
    )
  }

  if (requiredRole === 'foodPartner' && userType === 'user') {
    return (
      <AccessDenied
        message="This page is for food partners only. You're signed in as a diner."
        homeTo="/"
        homeLabel="Back to feed"
      />
    )
  }

  return children
}

export default ProtectedRoute
