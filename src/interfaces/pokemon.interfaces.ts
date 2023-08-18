export interface PokeData {
  id: number;
  name: string;
  weight: number;
  pokeGif: string;
  pokeImg: string;
  pokeAltImg: string;
  types: { type: { name: string } }[];
  stats: [];
}

export interface PokeEvolution {
  evolutionName: string;
  trigger: { name: string };
  item?: { name: string };
}

export interface PokeEvolutionNameAndTrigger {
  name: string;
  triggerLevel?: number | null;
  triggerName: string | null;
  item?: string;
}
