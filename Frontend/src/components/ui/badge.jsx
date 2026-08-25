import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        accent: 'bg-amber-100 text-amber-600',
        success: 'bg-success/12 text-success',
        muted: 'bg-muted text-muted-foreground',
        outline: 'border border-border text-foreground',
        glass: 'glass text-white border border-white/15',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
