import React from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Primary auth CTA with an in-flight state — none of the forms had one. */
export default function AuthSubmit({ pending, children, pendingLabel = 'Just a moment…', className, ...props }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      aria-busy={pending || undefined}
      className={cn('mt-1 w-full', className)}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
