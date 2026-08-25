import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'

/**
 * Form-level error banner.
 *
 * Before the redesign there was no error primitive anywhere in the app:
 * UserLogin/UserRegister had no try/catch at all (a wrong password threw an
 * unhandled rejection and the page simply sat there), FoodPartnerLogin used a
 * native alert(), and FoodPartnerRegister swallowed errors silently.
 */
export default function FormAlert({ message }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          key="form-alert"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 4 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-destructive/25 bg-destructive/8 px-3.5 py-3 text-[13.5px] font-medium leading-snug text-destructive"
          >
            <AlertCircle className="mt-px size-4 shrink-0" />
            {message}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
