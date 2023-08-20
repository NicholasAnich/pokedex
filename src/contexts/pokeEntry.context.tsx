import { useState, createContext, useEffect } from 'react';
import { Props } from '../interfaces/context.interfaces';
import axios from 'axios';
import { PokeEvolutionNameAndTrigger } from '../interfaces/pokemon.interfaces';

export const PokeEntryContext = createContext({
  pokeEntry: [],
});

// * GET POKEMON SPECIES
export async function getSpecies(name: string) {
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
  const species = await axios.get(speciesURL);
  const speciesResponse = await species.data;

  return speciesResponse;
}

// * GET POKEMON IMAGES
export async function getPokeImages(evolutions: any) {
  const evolutionURL = `https://pokeapi.co/api/v2/pokemon/${evolutions}/`;
  const evolutionImage = await axios.get(evolutionURL);
  const evolutionImageResponse = await evolutionImage.data;
  const evolutionImageURL = evolutionImageResponse.sprites.front_default;
  return evolutionImageURL;
}

// *GET CURRENT POKEMON
export async function getCurrentPokemonInfo(pokemonName: any) {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const pokemonInfo = await axios.get(pokemonUrl);
  const pokeResponse = await pokemonInfo.data;
  const pokeObject = {
    abilities: pokeResponse.abilities,
    types: pokeResponse.types,
    weight: pokeResponse.weight,
    height: pokeResponse.height,
    sprite: pokeResponse.sprites.front_default,
    gif: pokeResponse.sprites.versions['generation-v']['black-white'].animated[
      'front_default'
    ],
  };
  return pokeObject;
}

// *RECURSIVLY GET EVOLUTION CHAIN INFO
export function evolutionHelperRecursion(evolutionArray: any) {
  const { species, evolves_to, evolution_details } = evolutionArray;
  // console.log(species);

  let pokeInfo = [
    {
      name: species.name,
      item: evolution_details[0]?.item?.name,
      held_item: evolution_details[0]?.held_item?.name,
      trigger: evolution_details[0]?.trigger?.name,
      triggerLevel: evolution_details[0]?.min_level,
      id: species.url.slice(-5).replace(/\D/g, '').replaceAll('/', ''),
    },
  ];

  const evolutions = evolves_to.reduce((accumulator, currentValue) => {
    console.log(currentValue);
    return [
      ...accumulator,
      // {
      //   name: currentValue.species.name,
      //   item: currentValue.evolution_details[0]?.item,
      //   trigger: currentValue.evolution_details[0]?.trigger,
      //   triggerLevel: currentValue.evolution_details[0]?.min_level,
      //   // image: getPokeImages(currentValue.species.name),
      // },
      ...evolutionHelperRecursion(currentValue),
    ];
  }, pokeInfo);

  console.log(evolutions);
  return evolutions;
}

// *GET POKEMON EVOLUTIONS
export async function getEvolutions(url: string) {
  const evolutionsURL = await axios.get(url);
  const evolutionsResponse = await evolutionsURL.data;
  const evolutionsChain = await evolutionsResponse.chain;
  // console.log(evolutionsResponse);
  // const evolutions = [];
  // let current = evolutionsChain.species.name;
  // evolutions.push({ name: current });
  // console.log(current, evolutions);

  // for (let i = 0; i < evolutionsChain.evolves_to.length; i++) {
  //   const poke = evolutionsChain.evolves_to[i];
  //   console.log(poke);
  // }

  // console.log(evolutionsChain);

  return evolutionsChain;
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeName, setPokeName] = useState('bulbasaur');
  const [pokeEntry, setPokeEntry] = useState({});

  useEffect(() => {
    async function getPokeEntry() {
      const species = await getSpecies(pokeName);
      // console.log({ species });
      const evolutionChainData = await getEvolutions(
        species.evolution_chain.url
      );
      // console.log(evolutionChainData);
      const currentPokemonData = await getCurrentPokemonInfo(species.name);

      const evolutions = [
        { name: species.name, image: currentPokemonData.sprite },
        ...evolutionHelperRecursion(evolutionChainData),
      ];

      // TODO: images can be accessed by id with the following url https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokeID}.png
      const pokeEntryObject = {
        name: species.name,
        description: species.flavor_text_entries[1].flavor_text,
        sprite: currentPokemonData.sprite,
        gif: currentPokemonData.gif,
        color: species.color.name,
        height: currentPokemonData.height,
        weight: currentPokemonData.weight,
        types: currentPokemonData.types,
        abilities: currentPokemonData.abilities,
        shape: species.shape.name,
        lengendary: species.is_legendary,
        mythical: species.is_mythical,
        evolves_from: species.evolves_from_species,
        evolution_chain: evolutions,
      };
      setPokeEntry(pokeEntryObject);
    }
    if (pokeName !== '') {
      getPokeEntry();
    }
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
