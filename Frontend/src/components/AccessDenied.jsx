import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Shared 403. ProtectedRoute previously carried two near-identical 35-line
 * inline-styled blocks that differed only in the copy.
 */
export default function AccessDenied({ message, homeTo = '/', homeLabel = 'Go home' }) {
  const navigate = useNavigate()

  return (
    <div
      data-surface="commerce"
      className="grid min-h-dvh place-items-center bg-background px-6 py-16"
    >
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-primary/10 text-primary">
          <ShieldAlert className="size-8" strokeWidth={1.75} />
        </div>

        <p className="stat-numerals mt-7 text-5xl leading-none text-foreground/25">403</p>
        <h1 className="font-display mt-3 text-2xl font-bold text-foreground">
          Access denied
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          {message}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button asChild>
            <Link to={homeTo}>{homeLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
