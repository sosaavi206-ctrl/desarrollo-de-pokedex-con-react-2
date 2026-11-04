import { useState, type FormEvent } from 'react'
import { Search, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MAX_POKEMON_ID } from '@/lib/pokeapi'

const SUGGESTIONS = ['pikachu', 'charizard', '25', 'gengar', '150']

export function PokemonSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(value)
  }

  const randomPokemon = () => {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1
    setValue(String(id))
    onSearch(String(id))
  }

  return (
    <div className="rounded-2xl border-2 border-secondary bg-card p-4 shadow-[4px_4px_0_var(--color-secondary)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row" role="search">
        <label htmlFor="pokemon-query" className="sr-only">
          Buscar Pokémon por nombre o número
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="pokemon-query"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nombre o número (ej. pikachu, 25)"
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-lg border-2 border-input bg-background pr-3 pl-9 text-base outline-none transition-colors focus-visible:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="lg" className="h-11 flex-1 px-5 sm:flex-none">
            Buscar
          </Button>
          <Button type="button" size="lg" variant="outline" className="h-11 px-3" onClick={randomPokemon} aria-label="Pokémon aleatorio">
            <Shuffle aria-hidden="true" />
          </Button>
        </div>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Prueba:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setValue(s)
              onSearch(s)
            }}
            className="rounded-full bg-muted px-3 py-1 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {/^\d+$/.test(s) ? `#${s}` : s}
          </button>
        ))}
      </div>
    </div>
  )
}
