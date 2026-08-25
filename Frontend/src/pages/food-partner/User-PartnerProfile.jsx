import React from 'react'
import { useParams } from 'react-router-dom'

import PartnerProfileView from '@/components/partner/PartnerProfileView'

/** Public storefront: `/user-partner-profile/:id`. */
const UserPartnerProfile = () => {
  const { id } = useParams()
  // Keyed on id so navigating between restaurants remounts with fresh state
  // instead of resetting it from inside an effect.
  return <PartnerProfileView key={id} id={id} variant="public" />
}

export default UserPartnerProfile
