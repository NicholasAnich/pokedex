import { useContext, useState } from 'react';
import { PokeEntryContext } from '../../contexts/pokeEntry.context';
import clsx from 'clsx';
import styles from './pokeEntry.module.scss';

export default function PokeEntry() {
  const pokeEntry = useContext(PokeEntryContext);
  const {
    name,
    description,
    sprite,
    gif,
    color,
    height,
    weight,
    types,
    abilities,
    shape,
    lengendary,
    mythical,
    evolves_from,
    evolution_chain,
  } = pokeEntry.pokeEntry;

  const abilitiesMapped = abilities?.map((ability) => {
    return <div key={ability.ability.name}>{ability.ability.name}</div>;
  });

  // todo: Figure out evolutions bug where it can access all pokemon in chain AND access image

  const weightKilograms = weight * 0.1;
  const weightPounds = Number((weight * 2.205 * 0.1).toFixed(2));
  const heightMeters = Number((height * 0.1).toFixed(1));
  const heightFeet = Number((heightMeters * 3.281).toFixed(2));
  // TODO: images can be accessed by id with the following url https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokeID}.png

  // console.log(evolution_chain);
  const evolutionsMap = evolution_chain.map((evolution) => {
    // console.log(evolution);
    // console.log(evolution);
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`;
    // console.log(imgUrl);
    return (
      <div key={evolution.name}>
        <img src={imgUrl} alt={evolution.name} />
        <span>trigger level {evolution.triggerLevel}</span>
      </div>
    );
  });
  return (
    <div className={styles.pokeContainer}>
      <div>{name}</div>
      <img src={gif} alt={name} />
      <div>{description}</div>
      <div>{abilitiesMapped}</div>
      <div>
        {heightMeters} m ({heightFeet} ft)
      </div>
      <div>
        {weightKilograms} kg ({weightPounds} lbs)
      </div>
      <div>{evolutionsMap}</div>
    </div>
  );
}
