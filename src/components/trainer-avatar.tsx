import type { Trainer } from '@/lib/trainer-store'
import { cn } from '@/lib/utils'

export function TrainerAvatar({ trainer, size = 'md' }: { trainer: Pick<Trainer, 'name' | 'color'>; size?: 'sm' | 'md' }) {
  const initials = trainer.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-white',
        size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm',
      )}
      style={{ backgroundColor: trainer.color }}
    >
      {initials || '?'}
    </span>
  )
}
