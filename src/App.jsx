import { useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

  const buscarPokemonsAleatorios = async () => {
    const novosPokemons = [];

    for (let i = 0; i < 3; i++) {
      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${numeroAleatorio}`);
        const data = response.data;

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
        console.log('Erro ao buscar Pokémon:', err);
      }
    }

    setPokemons(novosPokemons);
    setSelecionado(null);
  };

  const escolherPokemon = (poke) => {
    setSelecionado(poke);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>Monte seu time Pokémon</h1>
      <button onClick={buscarPokemonsAleatorios} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        Buscar 3 Pokémons
      </button>

      {selecionado && (
        <div
          style={{
            border: '2px solid #4caf50',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '2rem',
            width: '220px',
            margin: '0 auto',
          }}
        >
          <h2>Pokémon Escolhido para a Batalha</h2>
          <h3 style={{ textTransform: 'capitalize' }}>{selecionado.nome}</h3>
          <img src={selecionado.imagem} alt={selecionado.nome} />
          <p>
            <strong>Golpes:</strong>
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {selecionado.habilidades.map((golpe, i) => (
              <li key={i} style={{ textTransform: 'capitalize' }}>
                {golpe.nome} — Poder: {golpe.power ?? 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {pokemons.map((poke, index) => (
          <div
            key={index}
            onClick={() => escolherPokemon(poke)}
            style={{
              cursor: 'pointer',
              border: selecionado === poke ? '3px solid #4caf50' : '1px solid #ccc',
              borderRadius: '10px',
              padding: '1rem',
              width: '200px',
              boxShadow: selecionado === poke ? '0 0 10px 3px #4caf50' : 'none',
              transition: 'box-shadow 0.3s ease, border 0.3s ease',
            }}
            title="Clique para escolher"
          >
            <h3 style={{ textTransform: 'capitalize' }}>{poke.nome}</h3>
            <img src={poke.imagem} alt={poke.nome} />
            <p>
              <strong>Golpes:</strong>
            </p>
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
