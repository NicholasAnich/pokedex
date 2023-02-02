import { useState } from 'react';
import styles from './search.module.scss';

export default function Search() {
  const [pokeName, setPokeName] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPokeName(event.target.value);
  }

  return (
    <div className={styles.searchContainer}>
      <input type='text' value={pokeName} onChange={handleChange} />
    </div>
  );
}
