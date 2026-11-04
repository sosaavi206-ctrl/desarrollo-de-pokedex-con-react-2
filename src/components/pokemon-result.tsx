import useSWR from 'swr'
import { ChevronLeft, ChevronRight, Check, Loader2, PackagePlus, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  fetchPokemon,
  formatId,
  formatName,
  MAX_POKEMON_ID,
  PokemonNotFoundError,
  STAT_LABELS,
  TYPE_COLORS,
  type Pokemon,
} from '@/lib/pokeapi'
import { addToBackpack, type Trainer } from '@/lib/trainer-store'
import { TypeBadge } from './type-badge'

type Props = {
  query: string
  activeTrainer: Trainer | null
  onNavigate: (id: number) => void
}

export function PokemonResult({ query, activeTrainer, onNavigate }: Props) {
  const { data, error, isLoading } = useSWR(['pokemon', query], ([, q]) => fetchPokemon(q), {
    revalidateOnFocus: false,
    shouldRetryOnError: (err) => !(err instanceof PokemonNotFoundError),
    keepPreviousData: true,
  })

  if (error && !isLoading) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-lg font-semibold">{error.message}</p>
        <p className="text-sm text-muted-foreground">Revisa la ortografía o busca por número del 1 al {MAX_POKEMON_ID}.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-24 text-muted-foreground" aria-live="polite">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        Buscando en la Pokédex...
      </div>
    )
  }

  return <PokemonCard pokemon={data} loading={isLoading} activeTrainer={activeTrainer} onNavigate={onNavigate} />
}

function PokemonCard({
  pokemon,
  loading,
  activeTrainer,
  onNavigate,
}: {
  pokemon: Pokemon
  loading: boolean
  activeTrainer: Trainer | null
  onNavigate: (id: number) => void
}) {
  const mainColor = TYPE_COLORS[pokemon.types[0]] ?? '#888'
  const inBackpack = activeTrainer?.backpack.some((p) => p.id === pokemon.id) ?? false

  return (
    <article
      aria-busy={loading}
      className="overflow-hidden rounded-2xl border-2 border-secondary bg-card shadow-[4px_4px_0_var(--color-secondary)] transition-opacity data-[loading=true]:opacity-60"
      data-loading={loading}
    >
      <div className="relative flex flex-col items-center px-6 pt-6 pb-4" style={{ backgroundColor: `${mainColor}22` }}>
        <div className="flex w-full items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            aria-label="Pokémon anterior"
            disabled={pokemon.id <= 1}
            onClick={() => onNavigate(pokemon.id - 1)}
            className="bg-card"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <span className="font-mono text-sm font-bold text-muted-foreground">{formatId(pokemon.id)}</span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Pokémon siguiente"
            disabled={pokemon.id >= MAX_POKEMON_ID}
            onClick={() => onNavigate(pokemon.id + 1)}
            className="bg-card"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={`Ilustración oficial de ${formatName(pokemon.name)}`}
            width={240}
            height={240}
            className="size-52 object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.18)] sm:size-60"
          />
        ) : (
          <div className="flex size-52 items-center justify-center text-muted-foreground">Sin imagen</div>
        )}
        <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{formatName(pokemon.name)}</h3>
        <div className="mt-2 flex gap-2">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <Fact label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} />
            <Fact label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
            <Fact label="Exp. base" value={pokemon.baseExperience ?? '—'} />
          </dl>
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Habilidades</h4>
            <ul className="flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <li key={a} className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium">
                  {formatName(a)}
                </li>
              ))}
            </ul>
          </div>
          <BackpackAction pokemon={pokemon} activeTrainer={activeTrainer} inBackpack={inBackpack} />
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estadísticas base</h4>
          <ul className="flex flex-col gap-2">
            {pokemon.stats.map((s) => (
              <li key={s.name} className="grid grid-cols-[80px_36px_1fr] items-center gap-2 text-sm">
                <span className="text-muted-foreground">{STAT_LABELS[s.name] ?? s.name}</span>
                <span className="font-mono font-bold">{s.value}</span>
                <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${Math.min(100, (s.value / 180) * 100)}%`, backgroundColor: mainColor }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted px-2 py-2">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-bold">{value}</dd>
    </div>
  )
}

function BackpackAction({
  pokemon,
  activeTrainer,
  inBackpack,
}: {
  pokemon: Pokemon
  activeTrainer: Trainer | null
  inBackpack: boolean
}) {
  if (!activeTrainer) {
    return (
      <p className="rounded-lg border-2 border-dashed border-border p-3 text-sm text-muted-foreground">
        Crea o selecciona un perfil de entrenador para guardar Pokémon en su mochila.
      </p>
    )
  }

  if (inBackpack) {
    return (
      <Button size="lg" variant="secondary" disabled className="h-11 w-full">
        <Check aria-hidden="true" />
        Ya está en la mochila de {activeTrainer.name}
      </Button>
    )
  }

  return (
    <Button size="lg" className="h-11 w-full" onClick={() => addToBackpack(activeTrainer.id, pokemon)}>
      <PackagePlus aria-hidden="true" />
      Guardar en la mochila
    </Button>
  )
}
