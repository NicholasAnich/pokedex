import PokePreview from './components/PokePreview/PokePreview';
import PokeEntry from './components/PokeEntry/PokeEntry';
import Search from './components/Search/Search';
import './app.styles.scss';

function App() {
  return (
    <div className='App'>
      <h1>Pokedex</h1>
      <Search />
      <PokeEntry />
      <PokePreview />
    </div>
  );
}

export default App;
