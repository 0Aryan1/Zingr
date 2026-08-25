import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Store, Utensils } from 'lucide-react'

import AuthLayout from '@/components/auth/AuthLayout'

const OPTIONS = [
  {
    to: '/user/register',
    icon: Utensils,
    title: 'I’m here to eat',
    body: 'Scroll food reels, save the ones you want, find the kitchen behind them.',
    tone: 'primary',
  },
  {
    to: '/food-partner/register',
    icon: Store,
    title: 'I run a restaurant',
    body: 'Post reels of your dishes and put them in front of people already hungry.',
    tone: 'accent',
  },
]

const ChooseRegister = () => {
  return (
    <AuthLayout
      title="Join Zingr"
      subtitle="Pick the side of the table you're on."
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
      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ to, icon: Icon, title, body, tone }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={
                tone === 'primary'
                  ? 'grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-primary/10 text-primary'
                  : 'grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-amber-100 text-amber-600'
              }
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-foreground">{title}</span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-muted-foreground">
                {body}
              </span>
            </span>

            <ArrowRight className="mt-3 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </AuthLayout>
  )
}

export default ChooseRegister
