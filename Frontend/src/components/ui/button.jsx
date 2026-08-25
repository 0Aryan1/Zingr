import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-glow-brand)] hover:brightness-110 hover:-translate-y-px',
        accent:
          'bg-accent text-accent-foreground shadow-[var(--shadow-glow-amber)] hover:brightness-105 hover:-translate-y-px',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-muted',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary',
        ghost: 'text-foreground hover:bg-secondary',
        glass:
          'glass text-white border border-white/15 hover:bg-black/45',
        destructive:
          'bg-destructive text-destructive-foreground hover:brightness-110',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13px] rounded-[var(--radius-sm)]',
        default: 'h-11 px-5',
        lg: 'h-13 px-7 text-base',
        icon: 'size-11 p-0',
        'icon-sm': 'size-9 p-0 rounded-[var(--radius-sm)]',
        pill: 'h-10 px-5 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
})

export { Button, buttonVariants }
