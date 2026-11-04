import type { Trainer } from '@/lib/trainer-store'
import { TrainerAvatar } from './trainer-avatar'

export function AppHeader({ activeTrainer }: { activeTrainer: Trainer | null }) {
  return (
    <header className="border-b-4 border-secondary bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="relative flex size-11 items-center justify-center rounded-full border-4 border-secondary bg-sky-300 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.15)]"
          >
            <span className="absolute top-1.5 left-2 size-2.5 rounded-full bg-white/80" />
          </span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-3 rounded-full border-2 border-secondary bg-red-400" />
            <span className="size-3 rounded-full border-2 border-secondary bg-accent" />
            <span className="size-3 rounded-full border-2 border-secondary bg-green-400" />
          </div>
          <h1 className="ml-1 text-xl font-extrabold tracking-tight sm:text-2xl">Pokédex</h1>
        </div>

        {activeTrainer ? (
          <div className="flex items-center gap-2 rounded-full bg-secondary/25 py-1 pr-4 pl-1">
            <TrainerAvatar trainer={activeTrainer} size="sm" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">Entrenador</span>
              <span className="max-w-32 truncate text-sm font-semibold">{activeTrainer.name}</span>
            </div>
          </div>
        ) : (
          <span className="text-sm font-medium opacity-90">Sin entrenador activo</span>
        )}
      </div>
    </header>
  )
}
