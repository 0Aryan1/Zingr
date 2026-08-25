import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-12 w-full rounded-[var(--radius-sm)] border border-input bg-card px-3.5 text-[15px] text-foreground transition-all duration-200 outline-none',
        'placeholder:text-muted-foreground/70',
        'focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
})

export { Input }
