import { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import { PokedexContext } from './contexts/pokedex.context';
import './app.styles.scss';

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
    const { name, id } = pokemon;
    const animatedImage =
      pokemon.sprites.versions['generation-v']['black-white'].animated[
        'front_default'
      ];
    const type = pokemon.types.map((type) => {
      const { name } = type.type;
      return (
        <li key={name} className={`type type-${name}`}>
          {name}
        </li>
      );
    });
    return (
      <div className='pokemon' key={id}>
        <img className='pokeImage' src={animatedImage} alt={name} />
        <div className='info-snippet'>
          <h2 className='pokeName'>{name}</h2>
          {id < 10 && <span>#00{id}</span>}
          {id >= 10 && id <= 99 && <span>#0{id}</span>}
          {id > 99 && <span>#{id}</span>}
          <ul>{type}</ul>
        </div>
      </div>
    );
  });
  return (
    <div className='App'>
      <h1>Pokedex</h1>
      <div className='pokemon-container'>{mapPokemon}</div>
    </div>
  );
}

export default App;
