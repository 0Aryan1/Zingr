import React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

/**
 * Segmented diner/partner switch. Replaces the "Switch: User • Food partner"
 * text link pair the register pages carried.
 */
export default function RoleSwitch({ active, className }) {
  const options = [
    { key: 'user', label: 'I’m a diner', to: '/user/register' },
    { key: 'partner', label: 'I’m a restaurant', to: '/food-partner/register' },
  ]

  return (
    <div
      className={cn(
        'mb-6 grid grid-cols-2 gap-1 rounded-[var(--radius-md)] bg-secondary p-1',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.key === active
        return (
          <Link
            key={option.key}
            to={option.to}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-[var(--radius-sm)] px-3 py-2 text-center text-[13px] font-semibold transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-card text-foreground shadow-[var(--shadow-soft)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
