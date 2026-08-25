import React, { useId, useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Floating-label field with an inline error slot.
 *
 * Controlled — `value` decides whether the label floats, so it stays floated
 * for browser-autofilled values too (a CSS-only `:placeholder-shown` approach
 * misses those).
 */
export default function FloatingField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete,
  inputMode,
  required,
  className,
  ...props
}) {
  const generatedId = useId()
  const id = props.id ?? `${name}-${generatedId}`
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && revealed ? 'text' : type

  const floated = value !== undefined && value !== null && String(value).length > 0

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          placeholder=" "
          className={cn(
            'peer h-14 w-full rounded-[var(--radius-sm)] border bg-card px-3.5 pt-5 pb-1.5 text-[15px] font-medium text-foreground',
            'transition-all duration-200 outline-none',
            'focus-visible:ring-4',
            isPassword && 'pr-12',
            error
              ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15'
              : 'border-input focus-visible:border-ring focus-visible:ring-ring/15',
          )}
          {...props}
        />

        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute left-3.5 origin-left select-none font-medium',
            'transition-all duration-200 ease-[var(--ease-out-soft)]',
            floated
              ? 'top-2 text-[11px] tracking-wide'
              : 'top-1/2 -translate-y-1/2 text-[15px]',
            // focus always wins, whether or not there's a value yet
            'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:tracking-wide',
            error
              ? 'text-destructive'
              : 'text-muted-foreground peer-focus:text-primary',
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            {revealed ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          className="flex items-center gap-1.5 pl-0.5 text-[12.5px] font-medium text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="pl-0.5 text-[12.5px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
