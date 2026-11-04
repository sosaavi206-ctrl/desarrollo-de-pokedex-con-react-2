export const MAX_POKEMON_ID = 1025

export type Pokemon = {
  id: number
  name: string
  height: number
  weight: number
  baseExperience: number | null
  types: string[]
  abilities: string[]
  stats: { name: string; value: number }[]
  image: string | null
  sprite: string | null
}

type ApiPokemon = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { slot: number; type: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}

export class PokemonNotFoundError extends Error {
  constructor(query: string) {
    super(`No encontramos ningún Pokémon con "${query}".`)
    this.name = 'PokemonNotFoundError'
  }
}

export function normalizeQuery(raw: string) {
  const value = raw.trim().toLowerCase().replace(/^#/, '')
  if (/^\d+$/.test(value)) return String(Number(value))
  return value.replace(/\s+/g, '-')
}

export async function fetchPokemon(query: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`)
  if (res.status === 404) throw new PokemonNotFoundError(query)
  if (!res.ok) throw new Error('La PokéAPI no respondió. Inténtalo de nuevo.')
  const data: ApiPokemon = await res.json()

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
    sprite: data.sprites.front_default,
  }
}

export function formatName(name: string) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatId(id: number) {
  return `#${String(id).padStart(4, '0')}`
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

export const TYPE_LABELS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
}

export const TYPE_COLORS: Record<string, string> = {
  normal: '#9a9a7a',
  fire: '#e8742c',
  water: '#4f86e0',
  electric: '#e9bc1d',
  grass: '#5fae45',
  ice: '#6dc4c4',
  fighting: '#b8342b',
  poison: '#9441a0',
  ground: '#cfa94f',
  flying: '#8f7fe0',
  psychic: '#e9557d',
  bug: '#98a821',
  rock: '#ae9638',
  ghost: '#6a5594',
  dragon: '#6a3cf0',
  dark: '#6a5446',
  steel: '#9a9abb',
  fairy: '#e08fb0',
}
