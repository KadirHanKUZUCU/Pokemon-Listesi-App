import axios from "axios";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

import "./CardStyle.css";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => {
        setPokemonList(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getPokemonDetails = (pokemonUrl) => {
    axios
      .get(pokemonUrl)
      .then((response) => {
        const pokemon = {
          name: response.data.name,
          id: response.data.id,
          type: response.data.types.map((type) => type.type.name).join(", "),
          weight: response.data.weight,
          stat: response.data.stats.map((stat) => stat.stat.name).join(", "),
          image: response.data.sprites.front_default,
          abilities: response.data.abilities
            .map((ability) => ability.ability.name)
            .join(", "),
        };
        setSelectedPokemon(pokemon);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid md={5}>
            <h1 className="title">Pokemon Listesi</h1>
          </Grid>
          <Grid md={7} mt={2}>
            <input
              className="searchBar"
              type="text"
              placeholder="Pokemon Ara..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={8}>
            <ul>
              {filteredPokemonList.map((pokemon) => (
                <li className="pokemonList" key={pokemon.name}>
                  <Grid container spacing={2}>
                    <Grid md={4}>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          pokemon.url.split("/")[6]
                        }.png`}
                        alt={pokemon.name}
                      />
                    </Grid>
                    <Grid md={4}>{pokemon.name}</Grid>
                    <Grid md={4}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => getPokemonDetails(pokemon.url)}
                      >
                        Detaylar
                      </Button>
                    </Grid>
                  </Grid>
                </li>
              ))}
            </ul>
          </Grid>
          <Grid xs={4}>
            {selectedPokemon && (
              <div>
                <img src={selectedPokemon.image} alt={selectedPokemon.name} />
                <h2>
                  <Button
                    variant="contained"
                    color="warning"
                    className="pokeIdBtn"
                  >
                    {selectedPokemon.name}
                  </Button>
                </h2>
                <p>ID:{selectedPokemon.id}</p>
                <p>Type: {selectedPokemon.type}</p>
                <p>Abilities: {selectedPokemon.abilities}</p>
                <p>Stats: {selectedPokemon.stat} </p>
                <p>Weight: {selectedPokemon.weight} lbs</p>
              </div>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
