import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  FilmIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from 'lucide-react'

import FormAlert from '@/components/auth/FormAlert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import api, { errorMessage } from '@/lib/api'
import { fileSize } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Vercel serverless functions reject request bodies over 4.5 MB with
 * FUNCTION_PAYLOAD_TOO_LARGE, and the API runs as one. Larger videos were
 * already failing — silently, part-way through the upload — so the limit is
 * enforced here instead, before the user waits.
 *
 * Lifting it properly means uploading straight from the browser to ImageKit
 * with signed auth params from the backend, bypassing the function entirely.
 */
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024
const MAX_UPLOAD_LABEL = '4.5 MB'

const CreateFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  // File and its preview URL move together, so there's no effect syncing one
  // piece of state off another.
  const [video, setVideo] = useState(null) // { file, url } | null
  const [fileError, setFileError] = useState('')
  const [formError, setFormError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(null)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef(null)

  const navigate = useNavigate()
  const { userId } = useAuth()

  // Release the previous blob URL whenever it is replaced or the page unmounts.
  useEffect(() => {
    const url = video?.url
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [video])

  const clearVideo = useCallback(() => {
    setVideo(null)
    setFileError('')
  }, [])

  const acceptFile = useCallback((file, verb) => {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setFileError(`Please ${verb} a valid video file.`)
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setFileError(
        `That video is ${fileSize(file.size)}. The upload limit is ${MAX_UPLOAD_LABEL} — please trim it or export at a lower quality.`,
      )
      return
    }
    setFileError('')
    setVideo({ file, url: URL.createObjectURL(file) })
  }, [])

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) {
      clearVideo()
      return
    }
    acceptFile(file, 'select')
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    acceptFile(e.dataTransfer?.files?.[0], 'drop')
  }

  const openFileDialog = () => fileInputRef.current?.click()

  const uploading = progress !== null && !done

  const onSubmit = async (e) => {
    e.preventDefault()
    if (uploading) return

    setFormError('')
    setProgress(0)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('video', video.file)

    try {
      await api.post('/api/food', formData, {
        // The original had no progress feedback at all — submitting a large
        // video looked identical to doing nothing.
        onUploadProgress: (event) => {
          if (!event.total) return
          setProgress(Math.round((event.loaded / event.total) * 100))
        },
      })

      setDone(true)
      // Previously redirected to "/", a user-only route, which bounced the
      // partner straight into the 403 screen.
      navigate(userId ? `/food-partner/${userId}` : '/create-food')
    } catch (error) {
      // The original had no try/catch — a failed upload threw an unhandled
      // rejection and the form sat there.
      setFormError(errorMessage(error, 'Upload failed. Please try again.'))
      setProgress(null)
    }
  }

  const isDisabled = useMemo(
    () => !name.trim() || !video || uploading,
    [name, video, uploading],
  )

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 pb-12 pt-6 sm:px-8 lg:pt-10">
      <header className="mb-7">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          New reel
        </p>
        <h1 className="font-display mt-1 text-[1.75rem] font-bold tracking-tight text-foreground lg:text-[2.15rem]">
          Post a dish
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Upload a short vertical video, name the dish, and it goes straight into the feed.
        </p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <FormAlert message={formError} />

        {/* ---------------- dropzone ---------------- */}
        <div className="flex flex-col gap-2.5">
          <label htmlFor="foodVideo" className="text-[13.5px] font-semibold text-foreground">
            Food video
          </label>

          <input
            id="foodVideo"
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="video/*"
            onChange={onFileChange}
          />

          <div
            role="button"
            tabIndex={0}
            aria-describedby="video-hint"
            onClick={openFileDialog}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openFileDialog()
              }
            }}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            className={cn(
              'group grid cursor-pointer place-items-center rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-12 text-center',
              'transition-all duration-200 outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              dragging
                ? 'border-primary bg-primary/6 scale-[1.01]'
                : 'border-border bg-card hover:border-primary/50 hover:bg-secondary',
            )}
          >
            <span
              className={cn(
                'grid size-14 place-items-center rounded-[var(--radius-md)] transition-colors duration-200',
                dragging
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-primary group-hover:bg-primary/15',
              )}
            >
              <UploadCloud className="size-6" strokeWidth={2} />
            </span>

            <p className="mt-4 text-[15px] font-semibold text-foreground">
              {dragging ? 'Drop it here' : 'Click to upload'}
              {!dragging && (
                <span className="font-medium text-muted-foreground"> or drag and drop</span>
              )}
            </p>
            <p id="video-hint" className="mt-1 text-[13px] text-muted-foreground">
              MP4, WebM or MOV · vertical 9:16 · up to {MAX_UPLOAD_LABEL}
            </p>
          </div>

          {fileError && (
            <p
              role="alert"
              className="flex items-center gap-1.5 text-[13px] font-medium text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              {fileError}
            </p>
          )}

          {video && (
            <div
              aria-live="polite"
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-card p-3"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-secondary text-muted-foreground">
                <FilmIcon className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-foreground">
                  {video.file.name}
                </p>
                <p className="text-[12.5px] text-muted-foreground">
                  {fileSize(video.file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openFileDialog}
                disabled={uploading}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove video"
                disabled={uploading}
                onClick={clearVideo}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* ---------------- preview ---------------- */}
        {video && (
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-ink-950">
            <video
              className="aspect-[9/16] w-full object-cover"
              src={video.url}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        )}

        {/* ---------------- fields ---------------- */}
        <div className="flex flex-col gap-2">
          <label htmlFor="foodName" className="text-[13.5px] font-semibold text-foreground">
            Dish name
          </label>
          <Input
            id="foodName"
            type="text"
            placeholder="e.g. Spicy Paneer Wrap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="foodDesc" className="text-[13.5px] font-semibold text-foreground">
            Description
            <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="foodDesc"
            rows={4}
            placeholder="Ingredients, taste, spice level — what makes people want it."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-y rounded-[var(--radius-sm)] border border-input bg-card px-3.5 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
          />
        </div>

        {/* ---------------- upload progress ---------------- */}
        {progress !== null && (
          <div className="flex flex-col gap-2" aria-live="polite">
            <div className="flex items-center justify-between text-[13px] font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                {done ? (
                  <>
                    <CheckCircle2 className="size-4 text-success" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Loader2 className="size-4 animate-spin text-primary" />
                    Uploading…
                  </>
                )}
              </span>
              <span className="tabular-nums text-muted-foreground">{progress}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-300 ease-out',
                  done ? 'bg-success' : 'bg-gradient-to-r from-brand-500 to-amber-400',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button type="submit" size="lg" disabled={isDisabled} className="w-full sm:w-auto sm:self-start">
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading…
            </>
          ) : (
            'Publish reel'
          )}
        </Button>
      </form>
    </div>
  )
}

export default CreateFood
