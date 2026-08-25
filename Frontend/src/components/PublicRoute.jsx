import React from 'react'
import { Navigate } from 'react-router-dom'

import Splash from '@/components/feedback/Splash'
import { useAuth } from '@/context/AuthContext'

/**
 * Auth-page guard: bounce an already-signed-in visitor to their home surface.
 * Same redirect targets as before, now reading from AuthContext.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userType, userId, loading } = useAuth()

  if (loading) {
    return <Splash />
  }

  if (isAuthenticated) {
    if (userType === 'user') return <Navigate to="/" replace />
    if (userType === 'foodPartner') {
      return <Navigate to={`/food-partner/${userId}`} replace />
    }
  }

  return children
}

export default PublicRoute
