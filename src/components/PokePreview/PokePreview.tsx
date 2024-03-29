import { useContext } from 'react';
import { PokedexContext } from '../../contexts/pokedex.context';
import { PokeEntryContext } from '../../contexts/pokeEntry.context';
import PokeEntry from '../PokeEntry/PokeEntry';
import clsx from 'clsx';
import styles from './pokemonPreview.module.scss';

export default function PokePreview() {
  const { pokeData } = useContext(PokedexContext);
  const { setPokeName } = useContext(PokeEntryContext);

  function handlePokeName(name: string) {
    setPokeName(name);
  }

  const mapPokemon = pokeData.map((pokemon) => {
    const { id, name, pokeGif, pokeAltImg, pokeImg, stats, types, weight } =
      pokemon;
    const type = types.map((type) => {
      const { name } = type.type;
      const typeList = clsx(styles.type, styles[`type-${name}`]);
      return (
        <li key={name} className={typeList}>
          {name}
        </li>
      );
    });
    return (
      <div
        className={styles.pokemon}
        key={id}
        onClick={() => handlePokeName(name)}
      >
        <img className={styles.pokeImage} src={pokeImg} alt={name} />
        <div className={styles['info-snippet']}>
          <h2 className={styles.pokeName}>{name}</h2>
          {id < 10 && <span>#00{id}</span>}
          {id >= 10 && id <= 99 && <span>#0{id}</span>}
          {id > 99 && <span>#{id}</span>}
          <ul>{type}</ul>
        </div>
      </div>
    );
  });

  return <div className={styles.pokeContainer}>{mapPokemon}</div>;
}
