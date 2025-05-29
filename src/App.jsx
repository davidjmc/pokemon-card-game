import { useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState([null]);
  const [input, setInput] = useState('');

  const buscarPokemon = async () => {
    if (!input) return;

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
      
      setPokemon({
        name: response.data.name,
        image: response.data.sprites.front_default,
        types: response.data.types.map(t => t.type.name).join(', ')
      });

    } catch (error) {
      alert('Pokémon não encontrado!');
      setPokemon(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Buscar Pokémon</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite o Nome ou número"
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={buscarPokemon} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Buscar
      </button>

      {pokemon && (
        <div style={{ marginTop: '2rem' }}>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
          <p>Tipo(s): {pokemon.types}</p>
        </div>
      )}
    </div>
  );
}

export default App;
