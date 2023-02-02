import { useState, createContext, useEffect } from 'react';
import { Props } from '../interfaces/context.interfaces';
import axios from 'axios';

export const PokeEntryContext = createContext({
  pokeEntry: [],
});

async function getEvolutions(id = 1) {
  const evolutionURL = `https://pokeapi.co/api/v2/evolution-chain/${id}/`;
  const evolutions = await axios.get(evolutionURL);
  console.log(evolutions);
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeId, setPokeId] = useState(1);
  const [pokeEntry, setPokeEntry] = useState([]);

  useEffect(() => {
    getEvolutions(pokeId);
  }, [pokeEntry]);

  const value = {
    pokeEntry,
    setPokeId,
  };

  return (
    <PokeEntryContext.Provider value={value}>
      {children}
    </PokeEntryContext.Provider>
  );
}
