import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PokedexProvider } from './contexts/pokedex.context';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PokedexProvider>
      <App />
    </PokedexProvider>
  </React.StrictMode>
);
