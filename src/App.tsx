import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { PokemonSearch } from '@/components/pokemon-search'
import { PokemonResult } from '@/components/pokemon-result'
import { TrainerPanel } from '@/components/trainer-panel'
import { Backpack } from '@/components/backpack'
import { normalizeQuery } from '@/lib/pokeapi'
import { useTrainers } from '@/lib/trainer-store'

export default function App() {
  const [query, setQuery] = useState('pikachu')
  const { trainers, activeTrainer } = useTrainers()

  const search = (raw: string) => {
    const next = normalizeQuery(raw)
    if (next) setQuery(next)
  }

  return (
    <div className="min-h-dvh">
      <AppHeader activeTrainer={activeTrainer} />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:py-10">
        <section aria-labelledby="pokedex-heading" className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 id="pokedex-heading" className="sr-only">
            Buscador Pokédex
          </h2>
          <PokemonSearch onSearch={search} />
          <PokemonResult query={query} activeTrainer={activeTrainer} onNavigate={(id) => setQuery(String(id))} />
        </section>
        <aside className="flex w-full flex-col gap-4 lg:w-[380px] lg:shrink-0">
          <TrainerPanel trainers={trainers} activeTrainer={activeTrainer} />
          <Backpack trainer={activeTrainer} onSelect={(id) => setQuery(String(id))} />
        </aside>
      </main>
    </div>
  )
}
