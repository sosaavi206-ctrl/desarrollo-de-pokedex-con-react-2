import { Backpack as BackpackIcon, X } from 'lucide-react'
import { formatId, formatName } from '@/lib/pokeapi'
import { removeFromBackpack, type Trainer } from '@/lib/trainer-store'
import { TypeBadge } from './type-badge'

export function Backpack({ trainer, onSelect }: { trainer: Trainer | null; onSelect: (id: number) => void }) {
  return (
    <section aria-labelledby="backpack-heading" className="rounded-2xl border-2 border-secondary bg-card p-4 shadow-[4px_4px_0_var(--color-secondary)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="backpack-heading" className="flex items-center gap-2 text-lg font-bold">
          <BackpackIcon className="size-5 text-primary" aria-hidden="true" />
          Mochila
        </h2>
        {trainer && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-mono text-xs font-bold text-accent-foreground">
            {trainer.backpack.length}
          </span>
        )}
      </div>

      {!trainer ? (
        <p className="text-sm text-muted-foreground">Selecciona un entrenador para ver su mochila.</p>
      ) : trainer.backpack.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          La mochila de {trainer.name} está vacía. Busca un Pokémon y guárdalo aquí.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {[...trainer.backpack].reverse().map((p) => (
            <li key={p.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className="flex w-full flex-col items-center rounded-xl bg-muted p-2 pt-3 text-center transition-colors hover:bg-accent/40"
              >
                {p.sprite ? (
                  <img src={p.sprite} alt="" width={72} height={72} className="size-18 object-contain [image-rendering:pixelated]" />
                ) : (
                  <span className="size-18" />
                )}
                <span className="font-mono text-[10px] text-muted-foreground">{formatId(p.id)}</span>
                <span className="w-full truncate text-sm font-semibold">{formatName(p.name)}</span>
                <span className="mt-1 flex flex-wrap justify-center gap-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} small />
                  ))}
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeFromBackpack(trainer.id, p.id)}
                aria-label={`Liberar a ${formatName(p.name)}`}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-card text-muted-foreground opacity-100 shadow-sm transition hover:bg-destructive hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
