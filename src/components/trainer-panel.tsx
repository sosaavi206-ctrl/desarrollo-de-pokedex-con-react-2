import { useState, type FormEvent } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createTrainer, deleteTrainer, selectTrainer, TRAINER_COLORS, type Trainer } from '@/lib/trainer-store'
import { cn } from '@/lib/utils'
import { TrainerAvatar } from './trainer-avatar'

export function TrainerPanel({ trainers, activeTrainer }: { trainers: Trainer[]; activeTrainer: Trainer | null }) {
  const [showForm, setShowForm] = useState(false)
  const formOpen = showForm || trainers.length === 0

  return (
    <section aria-labelledby="trainers-heading" className="rounded-2xl border-2 border-secondary bg-card p-4 shadow-[4px_4px_0_var(--color-secondary)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="trainers-heading" className="text-lg font-bold">
          Entrenadores
        </h2>
        {trainers.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm((v) => !v)} aria-expanded={formOpen}>
            {formOpen ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {formOpen ? 'Cerrar' : 'Nuevo'}
          </Button>
        )}
      </div>

      {trainers.length > 0 && (
        <ul className="flex flex-col gap-2">
          {trainers.map((trainer) => {
            const active = trainer.id === activeTrainer?.id
            return (
              <li key={trainer.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectTrainer(trainer.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-xl border-2 p-2 text-left transition-colors',
                    active ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:border-border',
                  )}
                >
                  <TrainerAvatar trainer={trainer} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold">{trainer.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {trainer.hometown || 'Sin región'} · {trainer.backpack.length} Pokémon
                    </span>
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Eliminar a ${trainer.name}`}
                  onClick={() => {
                    if (window.confirm(`¿Eliminar el perfil de ${trainer.name} y su mochila?`)) deleteTrainer(trainer.id)
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {formOpen && <TrainerForm onCreated={() => setShowForm(false)} hasTrainers={trainers.length > 0} />}
    </section>
  )
}

function TrainerForm({ onCreated, hasTrainers }: { onCreated: () => void; hasTrainers: boolean }) {
  const [name, setName] = useState('')
  const [hometown, setHometown] = useState('')
  const [color, setColor] = useState(TRAINER_COLORS[0])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    createTrainer({ name, hometown, color })
    setName('')
    setHometown('')
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3', hasTrainers && 'mt-4 border-t-2 border-dashed pt-4')}>
      {!hasTrainers && (
        <p className="text-sm text-muted-foreground">Crea tu primer perfil para empezar a llenar tu mochila.</p>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trainer-name" className="text-sm font-medium">
          Nombre del entrenador
        </label>
        <input
          id="trainer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          required
          placeholder="Ash Ketchum"
          className="h-10 rounded-lg border-2 border-input bg-background px-3 outline-none focus-visible:border-primary"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="trainer-hometown" className="text-sm font-medium">
          Región o pueblo <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="trainer-hometown"
          value={hometown}
          onChange={(e) => setHometown(e.target.value)}
          maxLength={32}
          placeholder="Pueblo Paleta"
          className="h-10 rounded-lg border-2 border-input bg-background px-3 outline-none focus-visible:border-primary"
        />
      </div>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Color del perfil</legend>
        <div className="flex gap-2">
          {TRAINER_COLORS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input type="radio" name="trainer-color" value={c} checked={color === c} onChange={() => setColor(c)} className="peer sr-only" />
              <span className="sr-only">Color {c}</span>
              <span
                aria-hidden="true"
                className="block size-8 rounded-full border-2 border-white ring-2 ring-transparent transition peer-checked:ring-secondary peer-focus-visible:ring-primary"
                style={{ backgroundColor: c }}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" size="lg" className="h-10" disabled={!name.trim()}>
        Crear perfil
      </Button>
    </form>
  )
}
