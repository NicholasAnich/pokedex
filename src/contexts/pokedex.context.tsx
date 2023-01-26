import { useState, useEffect, createContext, ReactNode } from 'react';
import axios from 'axios';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

interface Props {
  children?: ReactNode;
}

export const PokedexContext = createContext({
  pokedex: [],
});

export function PokedexProvider({ children }: Props) {
  const [pokedex, setPokedex] = useState([]);

  useEffect(() => {
    async function getAllMonsters() {
      try {
        const { data } = await axios.get(`${baseUrl}?limit=151&offset=0`);
        const pokemons = data.results;
        setPokedex(pokemons);
      } catch (err) {
        console.log(err);
      }
    }
    getAllMonsters();
  }, []);

  const value = {
    pokedex,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
