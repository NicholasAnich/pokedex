import PokePreview from './components/PokePreview/PokePreview';
import Search from './components/Search/Search';
import './app.styles.scss';

function App() {
  return (
    <div className='App'>
      <h1>Pokedex</h1>
      <Search />
      <PokePreview />
    </div>
  );
}

export default App;
