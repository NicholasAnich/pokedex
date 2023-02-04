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

export async function getEvolutionNames(evolution: any, evolutions: string[]) {
  const evolutionName = evolution.species.name;
  // console.log(evolution);
  evolutions.push(evolutionName);
  console.log(evolutionName);
  if (evolution.evolves_to.length > 0) {
    const nextEvolution = await evolution.evolves_to[0];
    await getEvolutionNames(nextEvolution, evolutions);
  }
  console.log(evolutions);
}

export async function getEvolutions(url: string) {
  const evolutionsURL = await axios.get(url);
  const evolutionsResponse = await evolutionsURL.data;
  let currentEvolution = evolutionsResponse.chain.evolves_to[0];
  const evolutions = await getEvolutionNames(currentEvolution, []);

  console.log(currentEvolution);
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeName, setPokeName] = useState('bulbasaur');
  const [pokeEntry, setPokeEntry] = useState([]);

  useEffect(() => {
    async function getPokeEntry() {
      const species = await getSpecies(pokeName);
      const evolutions = await getEvolutions(species.evolution_chain.url);
      // console.log(species);
    }
    getPokeEntry();
  }, [pokeName]);

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
