import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";

import Card from "../view/Card";
import LoadingSpinner from "../view/spinner";

function Home() {
  const PAGINATION = 12;
  const URL = `https://pokeapi.co/api/v2/pokemon?limit=` + PAGINATION;

  const [pokemonData, setPokemonData] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [nextUrl, setNextUrl] = useState(URL);
  const [previousUrl, setpreviousUrl] = useState("");
  const [isChangedPage, setIsChangedPage] = useState(false);

  // todo: Pagination
  //const [pageCount, setPageCount] = useState(1);
  //const [currentPage, setcurrentPage] = useState(0);

  const handleFetch = async (url) => {
    if (isChangedPage) {
      setPokemonData([]);
    }
    setisLoaded(false);
    await axios.get(url).then((result) => {
      getPokemons(result.data.results);
      setNextUrl(result.data.next);
      setpreviousUrl(result.data.previous);
      setisLoaded(true);
    });

    //setPageCount(body.data.count / PAGINATION);
  };

  const getPokemons = async (data) => {
    data.map(async (item) => {
      const result = await axios.get(item.url);
      setPokemonData((state) => {
        return [...state, result.data];
      });
    });
  };

  const handlePageChange = (isNext) => {
    setIsChangedPage(true);
    if (isNext) {
      handleFetch(nextUrl);
    } else {
      handleFetch(previousUrl);
    }
  };

  useEffect(() => {
    setIsChangedPage(false);
    handleFetch(nextUrl);
  }, []);

  return (
    <div>
      <h3>{"All the Pokemon!"}</h3>
      <div className="gridLayout">
        {isLoaded &&
          pokemonData.map((item, index) => {
            return (
              <Card
                key={index}
                name={item.name}
                image={item.sprites.front_default}
              />
            );
          })}

        {isLoaded && pokemonData.length == 0 && <LoadingSpinner />}
        {!isLoaded && pokemonData.length == 0 && <>{"No Pokemon"}</>}
      </div>
      {isLoaded && pokemonData.length > 0 && (
        <div className="Pagination_container">
          <span onClick={() => handlePageChange(false)}>Previous 12</span>
          <span onClick={() => handlePageChange(true)}>Next 12</span>
        </div>
      )}
    </div>
  );
}

export default Home;
