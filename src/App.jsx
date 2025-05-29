import { useState } from 'react';
import axios from 'axios';

function App() {
  //const [pokemon, setPokemon] = useState([null]);
  const [pokemons, setPokemons] = useState([]);
  //const [input, setInput] = useState('');

  const buscarPokemonsAleatorios = async () => {
    const novosPokemons = [];

    for (let i = 0; i< 3; i++) {
      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numeroAleatorio}`);
        const data = response.data;

        // Para cada uma das 3 primeiras habilidades, buscar o detalhe power
        const habilidadesDetalhadas = await Promise.all(
          data.moves.slice(0, 3).map(async (movimento) => {
            const moveResponse = await axios.get(movimento.move.url);
            return {
              nome: movimento.move.name,
              power: moveResponse.data.power,
            };
          })
        );
        
        novosPokemons.push({
          nome: data.name,
          imagem: data.sprites.front_default,
          habilidades: habilidadesDetalhadas,
        });
    } catch (err) {
      console.log('Erro ao buscar Pokémon:', err)
    }
  }

  setPokemons(novosPokemons);
};

  // const buscarPokemon = async () => {
  //   if (!input) return;

  //   try {
  //     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`);
      
  //     setPokemon({
  //       name: response.data.name,
  //       image: response.data.sprites.front_default,
  //       types: response.data.types.map(t => t.type.name).join(', ')
  //     });

  //   } catch (error) {
  //     alert('Pokémon não encontrado!');
  //     setPokemon(null);
  //   }
  // };

  // return (
  //   <div style={{ textAlign: 'center', marginTop: '50px' }}>
  //     <h1>Buscar Pokémon</h1>
  //     <input
  //       type="text"
  //       value={input}
  //       onChange={(e) => setInput(e.target.value)}
  //       placeholder="Digite o Nome ou número"
  //       style={{ padding: '0.5rem', fontSize: '1rem' }}
  //     />
  //     <button onClick={buscarPokemon} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
  //       Buscar
  //     </button>

  //     {pokemon && (
  //       <div style={{ marginTop: '2rem' }}>
  //         <h2>{pokemon.name}</h2>
  //         <img src={pokemon.image} alt={pokemon.name} />
  //         <p>Tipo(s): {pokemon.types}</p>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>Monte seu time Pokémon</h1>
      <button onClick={buscarPokemonsAleatorios} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Buscar 3 Pokémons
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {pokemons.map((poke, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '1rem', width: '200px' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{poke.nome}</h3>
            <img src={poke.imagem} alt={poke.nome} />
            <p><strong>Golpes:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {poke.habilidades.map((golpe, i) => (
                <li key={i} style={{ textTransform: 'capitalize' }}>
                  {golpe.nome} — Poder: {golpe.power ?? 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
