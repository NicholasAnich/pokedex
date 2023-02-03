import { useState, createContext, useEffect } from 'react';
import { Props } from '../interfaces/context.interfaces';
import axios from 'axios';

export const PokeEntryContext = createContext({
  pokeEntry: [],
});

export async function getSpecies(name: string) {
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
  const species = await axios.get(speciesURL);
  const speciesResponse = await species.data;
  return speciesResponse;
}

export async function getEvolutions(url: string) {
  const evolutions = await axios.get(url);
  const evolutionsResponse = await evolutions.data;
  return evolutionsResponse;
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeName, setPokeName] = useState('bulbasaur');
  const [pokeEntry, setPokeEntry] = useState([]);

  useEffect(() => {
    async function getPokeEntry() {
      const species = await getSpecies(pokeName);
      const evolutions = await getEvolutions(species.evolution_chain.url);
      console.log(evolutions);
    }
    getPokeEntry();
  }, [pokeName]);
  // console.log(pokeEntry);

  const value = {
    pokeEntry,
    setPokeName,
  };

  return (
    <PokeEntryContext.Provider value={value}>
      {children}
    </PokeEntryContext.Provider>
  );
}
