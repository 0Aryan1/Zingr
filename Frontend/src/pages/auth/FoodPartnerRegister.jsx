import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '@/components/auth/AuthLayout'
import AuthSubmit from '@/components/auth/AuthSubmit'
import FloatingField from '@/components/auth/FloatingField'
import FormAlert from '@/components/auth/FormAlert'
import RoleSwitch from '@/components/auth/RoleSwitch'
import {
  runValidators,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from '@/components/auth/validators'
import { useAuth } from '@/context/AuthContext'
import api, { errorMessage } from '@/lib/api'

const RULES = {
  businessName: (value) => validateRequired(value, 'Business name'),
  contactName: (value) => validateRequired(value, 'Contact name'),
  phone: validatePhone,
  email: validateEmail,
  password: (value) => validatePassword(value, { min: 6 }),
  address: (value) => validateRequired(value, 'Address'),
}

const FoodPartnerRegister = () => {
  const navigate = useNavigate()
  const { markSignedIn } = useAuth()

  const [values, setValues] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
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
    setTouched(Object.fromEntries(Object.keys(RULES).map((key) => [key, true])))
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      const response = await api.post('/api/auth/food-partner/register', {
        name: values.businessName,
        contactName: values.contactName,
        phone: values.phone,
        email: values.email,
        password: values.password,
        address: values.address,
      })
      markSignedIn('foodPartner', response.data?.foodPartner?._id)
      // Redirect to create food page after successful registration
      navigate('/create-food')
    } catch (error) {
      // Previously a silent .catch(() => {}) — the form just did nothing.
      setFormError(errorMessage(error, 'We could not create that account.'))
      setPending(false)
    }
  }

  return (
    <AuthLayout
      wide
      title="List your restaurant"
      subtitle="Upload a reel, reach hungry people scrolling nearby."
      footer={
        <>
          Already a partner?{' '}
          <Link
            to="/food-partner/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RoleSwitch active="partner" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormAlert message={formError} />

        <FloatingField
          label="Business name"
          name="businessName"
          autoComplete="organization"
          value={values.businessName}
          onChange={setField('businessName')}
          onBlur={handleBlur('businessName')}
          error={errors.businessName}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            label="Contact name"
            name="contactName"
            autoComplete="name"
            value={values.contactName}
            onChange={setField('contactName')}
            onBlur={handleBlur('contactName')}
            error={errors.contactName}
            required
          />
          <FloatingField
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={setField('phone')}
            onBlur={handleBlur('phone')}
            error={errors.phone}
            required
          />
        </div>

        <FloatingField
          label="Business email"
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
          autoComplete="new-password"
          value={values.password}
          onChange={setField('password')}
          onBlur={handleBlur('password')}
          error={errors.password}
          required
        />

        <FloatingField
          label="Address"
          name="address"
          autoComplete="street-address"
          value={values.address}
          onChange={setField('address')}
          onBlur={handleBlur('address')}
          error={errors.address}
          hint="A full address helps customers find you faster."
          required
        />

        <AuthSubmit pending={pending} pendingLabel="Setting up your kitchen…">
          Create partner account
        </AuthSubmit>
      </form>
    </AuthLayout>
  )
}

export default FoodPartnerRegister
