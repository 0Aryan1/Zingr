import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '@/components/auth/AuthLayout'
import AuthSubmit from '@/components/auth/AuthSubmit'
import FloatingField from '@/components/auth/FloatingField'
import FormAlert from '@/components/auth/FormAlert'
import RoleSwitch from '@/components/auth/RoleSwitch'
import {
  passwordStrength,
  runValidators,
  validateEmail,
  validatePassword,
  validateRequired,
} from '@/components/auth/validators'
import { useAuth } from '@/context/AuthContext'
import api, { errorMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

const RULES = {
  firstName: (value) => validateRequired(value, 'First name'),
  lastName: (value) => validateRequired(value, 'Last name'),
  email: validateEmail,
  password: (value) => validatePassword(value, { min: 6 }),
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Good', 'Strong']

const UserRegister = () => {
  const navigate = useNavigate()
  const { markSignedIn } = useAuth()

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)

  const setField = (name) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
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
    setTouched({ firstName: true, lastName: true, email: true, password: true })
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      const response = await api.post('/api/auth/user/register', {
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
      })
      markSignedIn('user', response.data?.user?._id)
      navigate('/')
    } catch (error) {
      setFormError(errorMessage(error, 'We could not create that account.'))
      setPending(false)
    }
  }

  const strength = passwordStrength(values.password)

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Two minutes to set up. A lifetime of scrolling for dinner."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/user/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RoleSwitch active="user" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormAlert message={formError} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={setField('firstName')}
            onBlur={handleBlur('firstName')}
            error={errors.firstName}
            required
          />
          <FloatingField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={setField('lastName')}
            onBlur={handleBlur('lastName')}
            error={errors.lastName}
            required
          />
        </div>

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

        <div>
          <FloatingField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={setField('password')}
            onBlur={handleBlur('password')}
            error={errors.password}
            required
          />

          {values.password && !errors.password && (
            <div className="mt-2 flex items-center gap-2.5 pl-0.5">
              <div className="flex flex-1 gap-1" aria-hidden="true">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors duration-300',
                      strength >= step
                        ? strength === 3
                          ? 'bg-success'
                          : 'bg-amber-400'
                        : 'bg-border',
                    )}
                  />
                ))}
              </div>
              <span className="text-[11.5px] font-semibold text-muted-foreground">
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}
        </div>

        <AuthSubmit pending={pending} pendingLabel="Creating your account…">
          Create account
        </AuthSubmit>
      </form>
    </AuthLayout>
  )
}

export default UserRegister
