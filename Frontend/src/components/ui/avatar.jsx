import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { hueFromString, initials } from '@/lib/format'

const Avatar = React.forwardRef(function Avatar({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex size-11 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
})

const AvatarImage = React.forwardRef(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
})

const AvatarFallback = React.forwardRef(function AvatarFallback(
  { className, ...props },
  ref,
) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex size-full items-center justify-center bg-muted text-sm font-bold text-foreground',
        className,
      )}
      {...props}
    />
  )
})

/**
 * There is no avatar field on the food-partner model, so the storefront
 * identity is generated: initials on a deterministic warm gradient, stable
 * per restaurant name.
 */
function BrandAvatar({ name, className, ...props }) {
  const hue = hueFromString(name)
  return (
    <Avatar className={className} {...props}>
      <AvatarFallback
        delayMs={0}
        className="font-display text-white"
        style={{
          // Lightness has to stay this low for white initials to clear 4.5:1
          // at the amber end of the hue range — a mid-lightness amber only
          // manages ~2.3:1 against white.
          background: `linear-gradient(135deg, hsl(${hue} 76% 32%), hsl(${hue + 16} 82% 26%))`,
        }}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, BrandAvatar }
