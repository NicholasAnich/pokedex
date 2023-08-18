import { useState, createContext, useEffect } from 'react';
import { Props } from '../interfaces/context.interfaces';
import axios from 'axios';
import { PokeEvolutionNameAndTrigger } from '../interfaces/pokemon.interfaces';

export const PokeEntryContext = createContext({
  pokeEntry: [],
});

export async function getSpecies(name: string) {
  const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;
  const species = await axios.get(speciesURL);
  const speciesResponse = await species.data;

  return speciesResponse;
}

// *GET POKEMON EVOLUTION NAMES AND TRIGGERS
export function evolutionHelperRecursion(evolutionArray: []) {
  const { species, evolves_to, evolution_details } = evolutionArray;
  // console.log({ evolution_details });

  if (!evolves_to.length) {
    return [];
  }
  const evolutions = evolves_to.reduce((accumulator, currentValue) => {
    console.log('current:', currentValue.evolution_details);
    return [
      ...accumulator,
      {
        name: currentValue.species.name,
        item: currentValue.evolution_details[0]?.item,
        trigger: currentValue.evolution_details[0]?.trigger,
        triggerLevel: currentValue.evolution_details[0]?.min_level,
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
  // console.log('RESPONSE:', evolutionsResponse);
  return evolutionChain;

  // const evolutions = await getEvolutionNames(currentEvolution, [
  //   {
  //     name: evolutionsResponse.chain.species.name || '',
  //     triggerLevel: null,
  //     triggerName: null,
  //   },
  // ]);

  // return evolutions;
}

export async function getEvolutionNames(
  evolution: any,
  evolutions: PokeEvolutionNameAndTrigger[]
) {
  const evolutionName = evolution.species.name;
  const evolutionTriggerName = evolution.evolution_details[0].trigger.name;
  const evolutionLevel = evolution.evolution_details[0].min_level;
  const evolutionItem = evolution.evolution_details[0].item;
  const evolutionTree = evolution;
  // console.log('TREE:', evolutionTree);

  const pokeObject = {
    name: evolutionName,
    triggerLevel: evolutionLevel,
    triggerName: evolutionTriggerName,
    item: evolutionItem,
  };

  evolutions.push(pokeObject);
  // console.log(evolutionItem);
  // console.log(evolution);

  if (evolution.evolves_to.length > 0) {
    const evolutions = await evolution.evolves_to;
    // console.log('EVOLVE CONTEXT', evolutions);
    const nextEvolution = await evolution.evolves_to[0];
    await getEvolutionNames(nextEvolution, evolutions);
  }
  // console.log({ evolutions });
  return evolutions;
}

// * GET POKEMON IMAGES
export async function getPokeImages(evolutions: PokeEvolutionNameAndTrigger[]) {
  const pokeImages = await evolutions.map(async (evolution) => {
    const evolutionURL = `https://pokeapi.co/api/v2/pokemon/${evolution.name}/`;
    const evolutionImage = await axios.get(evolutionURL);
    const evolutionImageResponse = await evolutionImage.data;
    const evolutionImageURL = evolutionImageResponse.sprites.front_default;
    return evolutionImageURL;
  });

  return pokeImages;
}

export function PokeEntryProvider({ children }: Props) {
  const [pokeName, setPokeName] = useState('bulbasaur');
  const [pokeEntry, setPokeEntry] = useState([]);

  useEffect(() => {
    async function getPokeEntry() {
      const species = await getSpecies(pokeName);
      const evolutionChainData = await getEvolutions(
        species.evolution_chain.url
      );
      const evolutions = [
        { name: evolutionChainData.species.name },
        ...evolutionHelperRecursion(evolutionChainData),
      ];
      console.log(evolutions);

      // const pokeImages = await Promise.all(await getPokeImages(evolutions));
      // console.log(pokeImages);
      // console.log(evolutions);
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
