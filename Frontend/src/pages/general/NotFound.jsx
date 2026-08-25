import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

import Wordmark from '@/components/brand/Wordmark'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div
      data-surface="commerce"
      className="grid min-h-dvh place-items-center bg-background px-6 py-16"
    >
      <div className="w-full max-w-md text-center">
        <Wordmark className="text-2xl" />

        <p className="stat-numerals mt-8 text-[5.5rem] leading-none text-foreground/12">
          404
        </p>

        <h1 className="font-display -mt-2 text-2xl font-bold tracking-tight text-foreground">
          Nothing on this plate
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          The page you're after doesn't exist, or it moved somewhere tastier.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button asChild>
            <Link to="/">
              <Compass className="size-4" />
              Back to the feed
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
