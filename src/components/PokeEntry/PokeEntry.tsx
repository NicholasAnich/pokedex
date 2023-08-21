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

  const weightKilograms = weight * 0.1;
  const weightPounds = Number((weight * 2.205 * 0.1).toFixed(2));
  const heightMeters = Number((height * 0.1).toFixed(1));
  const heightFeet = Number((heightMeters * 3.281).toFixed(2));

  //*images can be accessed by id with the following url https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokeID}.png
  const evolutionsMap = evolution_chain?.map((evolution) => {
    const { item } = evolution;
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`;
    const itemUsed = item ? item : '';
    let capitilizedItemName;

    if (item !== undefined) {
      const pokeItem = item.split('-');
      let stringArr: string[] = [];
      const name = pokeItem.forEach((i) => {
        const letter = i.charAt(0).toUpperCase();
        const subStrings = i.slice(1);
        const newString = letter.concat(subStrings);
        stringArr.push(newString);
      });
      capitilizedItemName = stringArr.join(' ');
    }

    return (
      <div className={styles.evolution} key={evolution.name}>
        <img src={imgUrl} alt={evolution.name} />
        <div>
          <span>
            {evolution.trigger} {evolution.triggerLevel}
          </span>
          <span>{capitilizedItemName ? capitilizedItemName : ''}</span>
        </div>
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
      <div className={styles.evolutionsContainer}>{evolutionsMap}</div>
    </div>
  );
}
