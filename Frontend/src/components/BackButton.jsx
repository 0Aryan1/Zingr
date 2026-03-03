import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/back-button.css'

const BackButton = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <button onClick={handleBack} className="back-button" aria-label="Go back">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
    </button>
  )
}

export default BackButton
