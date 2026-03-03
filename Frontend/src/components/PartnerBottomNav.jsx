import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/bottom-nav.css'
import API_URL from '../config/api'

function PartnerBottomNav() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Call logout API endpoint for food partner
      await axios.get(`${API_URL}/api/auth/food-partner/logout`, { withCredentials: true })
      
      // Clear any stored data
      sessionStorage.clear()
      localStorage.clear()
      
      // Redirect to login/register page
      navigate('/register')
    } catch {
      // Still redirect even if API fails
      sessionStorage.clear()
      localStorage.clear()
      navigate('/register')
    }
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner">
        <NavLink to="/create-food" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* plus/create icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Create</span>
        </NavLink>

        <button onClick={handleLogout} className="bottom-nav__item" aria-label="Logout">
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* logout icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default PartnerBottomNav
