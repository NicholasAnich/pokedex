import { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import { PokedexContext } from './contexts/pokedex.context';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

function App() {
  const { pokedex } = useContext(PokedexContext);
  const [pokeData, setPokeData] = useState([]);

  useEffect(() => {
    async function getPokeInfo() {
      let pokeInfo = [];
      for (const { name } of pokedex) {
        const { data } = await axios.get(`${baseUrl}/${name}`);
        pokeInfo.push(data);
      }
      setPokeData(pokeInfo);
    }
    getPokeInfo();
  }, [pokedex]);

  const mapPokemon = pokeData.map((pokemon) => {
    const { name } = pokemon;
    const animatedImage =
      pokemon.sprites.versions['generation-v']['black-white'].animated[
        'front_default'
      ];
    return (
      <Fragment>
        <h2>{name}</h2>
        <img src={animatedImage} alt={name} />
      </Fragment>
    );
  });
  return (
    <div className='App'>
      <h1>Pokedex</h1>
      {mapPokemon}
    </div>
  );
}

export default App;
