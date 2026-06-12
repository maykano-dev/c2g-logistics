'use client'

import { markAllAsRead } from './actions'
import { useTransition } from 'react'

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => startTransition(() => { markAllAsRead() })}
      disabled={isPending}
      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Marking...' : 'Mark all as read'}
    </button>
  )
}
