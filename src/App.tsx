import PokePreview from './components/PokePreview/PokePreview';
import './app.styles.scss';

function App() {
  return (
    <div className='App'>
      <h1>Pokedex</h1>
      {/* <div className='pokemon-container'>{mapPokemon}</div> */}
      <div className='pokemon-container'>
        <PokePreview />
      </div>
    </div>
  );
}

export default App;
