import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '@/components/auth/AuthLayout'
import AuthSubmit from '@/components/auth/AuthSubmit'
import FloatingField from '@/components/auth/FloatingField'
import FormAlert from '@/components/auth/FormAlert'
import { runValidators, validateEmail, validatePassword } from '@/components/auth/validators'
import { useAuth } from '@/context/AuthContext'
import api, { errorMessage } from '@/lib/api'

const RULES = {
  email: validateEmail,
  password: (value) => validatePassword(value, { min: 1 }),
}

const UserLogin = () => {
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)

  const setField = (name) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Only re-validate live once the field has been blurred once.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: RULES[name](value) }))
    }
  }

  const handleBlur = (name) => (event) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: RULES[name](event.target.value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const nextErrors = runValidators(values, RULES)
    setErrors(nextErrors)
    setTouched({ email: true, password: true })
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      await api.post('/api/auth/user/login', {
        email: values.email,
        password: values.password,
      })
      // Confirm the browser actually kept the session cookie before
      // routing onward. Trusting the response body alone meant a
      // blocked cookie looked like success and broke on refresh.
      const session = await refresh({ force: true })
      if (!session.isAuthenticated) {
        setFormError(
          'Your account is ready, but this browser did not keep you signed in. Check that cookies are enabled for this site, then try signing in.',
        )
        setPending(false)
        return
      }
      navigate('/') // Redirect to home after login
    } catch (error) {
      setFormError(errorMessage(error, 'Invalid email or password.'))
      setPending(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where your cravings left off."
      footer={
        <>
          New here?{' '}
          <Link
            to="/user/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormAlert message={formError} />

        <FloatingField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={setField('email')}
          onBlur={handleBlur('email')}
          error={errors.email}
          required
        />

        <FloatingField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={setField('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          required
        />

        <AuthSubmit pending={pending} pendingLabel="Signing you in…">
          Sign in
        </AuthSubmit>
      </form>

      <p className="mt-6 border-t border-border pt-5 text-center text-[13.5px] text-muted-foreground">
        Running a restaurant?{' '}
        <Link
          to="/food-partner/login"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Partner sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default UserLogin
