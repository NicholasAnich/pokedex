import { useState, useEffect, createContext, ReactNode } from 'react';
import { PokeData } from '../interfaces/pokemon.interfaces';
import axios from 'axios';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

interface Props {
  children?: ReactNode;
}

export const PokedexContext = createContext({
  pokedex: [],
  pokeData: [],
});

export function PokedexProvider({ children }: Props) {
  const [pokedex, setPokedex] = useState([]);
  const [pokeData, setPokeData] = useState<PokeData[]>([]);

  useEffect(() => {
    async function getAllMonsters() {
      const { data } = await axios
        .get(`${baseUrl}?limit=151&offset=0`)
        .catch((err) => console.error(err));
      const pokemons = data.results;
      setPokedex(pokemons);
      return data.results;
    }

    async function getPokeInfo() {
      const pokemons = await getAllMonsters();
      let pokeInfo = [];
      for (const { name } of pokemons) {
        const { data } = await axios.get(`${baseUrl}/${name}`);
        const pokeGif =
          data.sprites.versions['generation-v']['black-white'].animated[
            'front_default'
          ];
        const pokeImg = data.sprites.other['official-artwork']['front_default'];
        const pokeAltImg = data.sprites.other.home['front_default'];

        const pokeObject = {
          id: data.id,
          name: data.name,
          weight: data.weight,
          pokeGif: pokeGif,
          pokeImg: pokeImg,
          pokeAltImg: pokeAltImg,
          types: data.types,
          stats: data.stats,
        };
        pokeInfo.push(pokeObject);
      }
      setPokeData(pokeInfo);
    }
    getAllMonsters();
    getPokeInfo();
  }, []);

  const value = {
    pokedex,
    pokeData,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
