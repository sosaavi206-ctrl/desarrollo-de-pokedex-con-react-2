import { TYPE_COLORS, TYPE_LABELS } from '@/lib/pokeapi'
import { cn } from '@/lib/utils'

export function TypeBadge({ type, small }: { type: string; small?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold text-white uppercase tracking-wide',
        small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      )}
      style={{ backgroundColor: TYPE_COLORS[type] ?? '#777' }}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  )
}
