import React from 'react';
import react, {createContext, useContext, useState, useEffect, Children } from 'react';

export interface PokemonCard {
    id: number;
    name: string;
    type: string;
    image: string;
    isFavorite?: boolean;
}

export interface Trainer {
    id: number;
    fullName: string;
    document: {type: string; dni: string};
    dateRegister: string;
}

interface PokemonContextType {
    entrenadores: Trainer [];
    entrenadorActivo: Trainer | null;
    mochilaActual: PokemonCard[];
    guardarPokemonEnMochila: (pokemon : PokemonCard) => void;
    registrarEntrenador: (usuario: Trainer) => void;
    seleccionarEntrenador: (usuario: Trainer) => void;
    seleccionarFavorito: (pokemonId: number) => void;
    eliminarPokemonDeMochila: (pokemonId: number) => void;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const constPokemonProvaider: React.FC<{ children: React.ReactNode}> = ({children}) => {
 const [entrenadores,setEntrenadores] = useState<Trainer[]>([]);
 const [entrenador,setEntrenadorActivo] = useState<Trainer | null >(null);
 const [mochilaActual,setmochilaActual] = useState<PokemonCard[]>([]);

//cargar de la base de datos los guardados
//funciones seleccionar y registrar

}