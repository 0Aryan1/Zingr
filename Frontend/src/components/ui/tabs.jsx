import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex w-full items-center gap-1 border-b border-border',
        className,
      )}
      {...props}
    />
  )
})

const TabsTrigger = React.forwardRef(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative inline-flex flex-1 items-center justify-center gap-2 px-4 pb-3 pt-2.5 text-sm font-semibold',
        'text-muted-foreground transition-colors outline-none',
        'hover:text-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-[var(--radius-sm)]',
        'data-[state=active]:text-foreground',
        // brand underline that sits on top of the list border
        "after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity after:content-['']",
        'data-[state=active]:after:opacity-100',
        className,
      )}
      {...props}
    />
  )
})

const TabsContent = React.forwardRef(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-6 outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'data-[state=active]:animate-[var(--animate-float-in)]',
        className,
      )}
      {...props}
    />
  )
})

export { Tabs, TabsList, TabsTrigger, TabsContent }
