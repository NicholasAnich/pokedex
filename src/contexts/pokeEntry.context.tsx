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

// *GET POKEMON EVOLUTION NAMES AND TRIGGERS
export function evolutionHelperRecursion(evolutionArray: any) {
  const { species, evolves_to, evolution_details } = evolutionArray;
  if (!evolves_to || !evolves_to.length) {
    return [];
  }
  const evolutions = evolves_to.reduce((accumulator, currentValue) => {
    return [
      ...accumulator,
      {
        name: currentValue.species.name,
        item: currentValue.evolution_details[0]?.item,
        trigger: currentValue.evolution_details[0]?.trigger,
        triggerLevel: currentValue.evolution_details[0]?.min_level,
        image: getPokeImages(currentValue.species.name),
      },
      ...evolutionHelperRecursion(currentValue),
    ];
  }, []);

  return evolutions;
}

export async function getEvolutions(url: string) {
  const evolutionsURL = await axios.get(url);
  const evolutionsResponse = await evolutionsURL.data;
  const evolutionChain = await evolutionsResponse.chain;

  return evolutionChain;
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeName, setPokeName] = useState('');
  const [pokeEntry, setPokeEntry] = useState({});

  useEffect(() => {
    async function getPokeEntry() {
      const species = await getSpecies(pokeName);
      const evolutionChainData = await getEvolutions(
        species.evolution_chain.url
      );
      const currentPokemonData = await getCurrentPokemonInfo(species.name);

      const evolutions = [
        // { name: species.name, image: currentPokemonData.sprite },
        ...evolutionHelperRecursion(evolutionChainData),
      ];
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
  console.log(pokeEntry);

  return (
    <PokeEntryContext.Provider value={value}>
      {children}
    </PokeEntryContext.Provider>
  );
}
