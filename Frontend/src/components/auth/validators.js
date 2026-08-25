/**
 * Client-side validation for the auth forms.
 *
 * The backend accepts email + password only (bcrypt, httpOnly cookie); there
 * is no OTP, phone verification, or password-reset route, so nothing here
 * promises a flow the API can't honour.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(value) {
  const email = (value ?? '').trim()
  if (!email) return 'Email is required.'
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address.'
  return ''
}

export function validatePassword(value, { min = 6 } = {}) {
  const password = value ?? ''
  if (!password) return 'Password is required.'
  if (password.length < min) return `Use at least ${min} characters.`
  return ''
}

export function validateRequired(value, label) {
  if (!(value ?? '').trim()) return `${label} is required.`
  return ''
}

export function validatePhone(value) {
  const phone = (value ?? '').trim()
  if (!phone) return 'Phone number is required.'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return 'Enter a valid phone number.'
  return ''
}

/** Rough strength read for the signup meter: 0–3. */
export function passwordStrength(value) {
  const password = value ?? ''
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

/** Run a field->validator map, returning only the fields that failed. */
export function runValidators(values, rules) {
  const errors = {}
  Object.entries(rules).forEach(([field, rule]) => {
    const message = rule(values[field], values)
    if (message) errors[field] = message
  })
  return errors
}
