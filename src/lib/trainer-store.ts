import { useSyncExternalStore } from 'react'
import type { Pokemon } from './pokeapi'

export type SavedPokemon = {
  id: number
  name: string
  sprite: string | null
  types: string[]
  savedAt: number
}

export type Trainer = {
  id: string
  name: string
  hometown: string
  color: string
  createdAt: number
  backpack: SavedPokemon[]
}

type TrainerState = {
  trainers: Trainer[]
  activeTrainerId: string | null
}

const STORAGE_KEY = 'pokedex-trainers-v1'
const EMPTY_STATE: TrainerState = { trainers: [], activeTrainerId: null }

export const TRAINER_COLORS = ['#d62f2f', '#2f6fd6', '#2f9e5a', '#e0a21b', '#8b46c9', '#1f2937']

function readStorage(): TrainerState {
  if (typeof window === 'undefined') return EMPTY_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as TrainerState
    if (!Array.isArray(parsed.trainers)) return EMPTY_STATE
    return parsed
  } catch {
    return EMPTY_STATE
  }
}

let state: TrainerState = readStorage()
const listeners = new Set<() => void>()

function setState(updater: (prev: TrainerState) => TrainerState) {
  state = updater(state)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    state = readStorage()
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useTrainers() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => EMPTY_STATE)
  const activeTrainer = snapshot.trainers.find((t) => t.id === snapshot.activeTrainerId) ?? null
  return { trainers: snapshot.trainers, activeTrainer }
}

export function createTrainer(input: { name: string; hometown: string; color: string }) {
  const trainer: Trainer = {
    id: crypto.randomUUID(),
    name: input.name.trim().slice(0, 24),
    hometown: input.hometown.trim().slice(0, 32),
    color: input.color,
    createdAt: Date.now(),
    backpack: [],
  }
  setState((prev) => ({ trainers: [...prev.trainers, trainer], activeTrainerId: trainer.id }))
}

export function selectTrainer(id: string) {
  setState((prev) => ({ ...prev, activeTrainerId: id }))
}

export function deleteTrainer(id: string) {
  setState((prev) => {
    const trainers = prev.trainers.filter((t) => t.id !== id)
    const activeTrainerId = prev.activeTrainerId === id ? (trainers[0]?.id ?? null) : prev.activeTrainerId
    return { trainers, activeTrainerId }
  })
}

function updateTrainer(id: string, update: (trainer: Trainer) => Trainer) {
  setState((prev) => ({
    ...prev,
    trainers: prev.trainers.map((t) => (t.id === id ? update(t) : t)),
  }))
}

export function addToBackpack(trainerId: string, pokemon: Pokemon) {
  updateTrainer(trainerId, (trainer) => {
    if (trainer.backpack.some((p) => p.id === pokemon.id)) return trainer
    const saved: SavedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprite ?? pokemon.image,
      types: pokemon.types,
      savedAt: Date.now(),
    }
    return { ...trainer, backpack: [...trainer.backpack, saved] }
  })
}

export function removeFromBackpack(trainerId: string, pokemonId: number) {
  updateTrainer(trainerId, (trainer) => ({
    ...trainer,
    backpack: trainer.backpack.filter((p) => p.id !== pokemonId),
  }))
}
