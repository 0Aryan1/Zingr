import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import '../styles/bottom-nav.css'
import API_URL from '../config/api'

const BottomNav = () => {
  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await axios.get(`${API_URL}/api/auth/user/logout`, { withCredentials: true })
      
      // Clear any stored data
      sessionStorage.clear()
      localStorage.clear()
      
      // Small delay to ensure cookie clearing is processed by browser
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force a full page reload to clear any cached state and ensure cookie is checked
      window.location.href = '/register'
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear storage and redirect even if API fails
      sessionStorage.clear()
      localStorage.clear()
      window.location.href = '/register'
    }
  }

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav__inner">
        <NavLink to="/" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink to="/saved" end className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav__icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
            </svg>
          </span>
          <span className="bottom-nav__label">Saved</span>
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

export default BottomNav