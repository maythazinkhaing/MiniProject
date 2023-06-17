import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../view/Card";
import LoadingSpinner from "../view/spinner";
import URL from "../utils/constants";

function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [nextUrl, setNextUrl] = useState(URL);
  const [previousUrl, setpreviousUrl] = useState("");
  const [radioCheck, setRadioCheck] = useState("id");

  const handleFetch = async (url) => {
    setisLoaded(false);
    await axios.get(url).then((result) => {
      getPokemons(result.data.results);
      setNextUrl(result.data.next);
      setpreviousUrl(result.data.previous);
      setisLoaded(true);
    });
  };

  const getPokemons = async (data) => {
    data.map(async (item) => {
      const result = await axios.get(item.url);

      const state = (pokemonData) => {
        pokemonData = [...pokemonData, result.data];
        if (radioCheck === "id") {
          pokemonData.sort((a, b) => a.id - b.id);
        } else {
          pokemonData.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
        return pokemonData;
      };

      setPokemonData(state);
    });
  };

  //sort Pokemon
  const sortPokemonByName = () => {
    pokemonData.sort((a, b) => (a.name < b.name ? -1 : 1));
    setPokemonData(pokemonData);
  };

  const sortPokemonById = () => {
    pokemonData.sort((a, b) => a.id - b.id);
    setPokemonData(pokemonData);
  };

  //handlePageChange
  const handlePageChange = (isNext) => {
    setPokemonData([]);
    if (isNext) {
      handleFetch(nextUrl);
    } else {
      handleFetch(previousUrl);
    }
  };

  const handleChange = (event) => {
    setRadioCheck(event.target.value);
  };

  useEffect(() => {
    handleFetch(nextUrl);
  }, []);

  return (
    <div>
      <div className="header">
        <h3>All the Pokemon!</h3>
        <div className="radioButton form-check">
          <label>
            <input
              type="radio"
              value="name"
              name="choose"
              id="name"
              onChange={handleChange}
              checked={radioCheck === "name"}
              onClick={sortPokemonByName}
            />{" "}
            Sort Name
          </label>
          <label>
            <input
              type="radio"
              value="id"
              name="choose"
              id="id"
              onChange={handleChange}
              checked={radioCheck === "id"}
              onClick={sortPokemonById}
            />
            Sort ID
          </label>
        </div>
      </div>
      <div className="gridLayout">
        {isLoaded &&
          pokemonData.map((item) => {
            return (
              <Card
                key={item.id}
                name={item.name}
                image={item.sprites.front_default}
              />
            );
          })}

        {!isLoaded && pokemonData.length === 0 && <LoadingSpinner />}
        {isLoaded && pokemonData.length === 0 && <>{"No Pokemon"}</>}
      </div>
      {isLoaded && pokemonData.length > 0 && (
        <div className="Pagination_container">
          <span
            className={`pageButton ${previousUrl == null ? "inactive" : ""}`}
            onClick={() => handlePageChange(false)}
          >
            Previous 12
          </span>

          <span
            className={`pageButton ${nextUrl == null ? "inactive" : ""}`}
            onClick={() => handlePageChange(true)}
          >
            Next 12
          </span>
        </div>
      )}
    </div>
  );
}

export default Home;
