import React from 'react'
import { useParams } from 'react-router-dom'

import PartnerDashboard from '@/components/partner/PartnerDashboard'

/** Partner-facing dashboard: `/food-partner/:id`. */
const PartnerProfile = () => {
  const { id } = useParams()
  return <PartnerDashboard key={id} id={id} />
}

export default PartnerProfile
