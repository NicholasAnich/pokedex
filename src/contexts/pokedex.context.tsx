import { useState, useEffect, createContext, ReactNode } from 'react';
import { PokeData } from '../interfaces/pokemon.interfaces';
import { Props } from '../interfaces/context.interfaces';
import axios from 'axios';

const baseUrl = 'https://pokeapi.co/api/v2';

export async function getAllMonsters() {
  const allMonsters = await axios.get(`${baseUrl}/pokemon?limit=151&offset=0`);
  return allMonsters.data.results;
}

export async function getPokeInfo() {
  const pokemons = await getAllMonsters();
  let pokeInfo = [];

  for (const { name } of pokemons) {
    const { data } = await axios.get(`${baseUrl}/pokemon/${name}`);
    const pokeGif =
      data.sprites.versions['generation-v']['black-white'].animated[
        'front_default'
      ];
    const pokeImg = data.sprites.other['official-artwork']['front_default'];
    const pokeAltImg = data.sprites.other.home['front_default'];

    const pokeObject: PokeData = {
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

  return pokeInfo;
}

export async function getPokeSpecies(name = 'bulbasaur') {
  const speciesURL = `${baseUrl}/pokemon-species/${name}`;
  const { data } = await axios.get(speciesURL);
}

export const PokedexContext = createContext({
  pokeData: [
    {
      id: 0,
      name: '',
      weight: 0,
      pokeGif: '',
      pokeImg: '',
      pokeAltImg: '',
      types: [{ type: { name: '' } }],
      stats: [],
    },
  ],
});

export function PokedexProvider({ children }: Props) {
  const [pokeData, setPokeData] = useState<PokeData[]>([]);

  useEffect(() => {
    async function getDetails() {
      const pokemon = await getPokeInfo();
      setPokeData(pokemon);
    }

    getAllMonsters();
    getDetails();
  }, []);

  const value = {
    pokeData,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
