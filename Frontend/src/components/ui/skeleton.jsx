import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('shimmer rounded-[var(--radius-sm)]', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export { Skeleton }
