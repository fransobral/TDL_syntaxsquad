import React, { useState } from "react";

const MovieApp = () => {
  const [searchMovie, setSearchMovie] = useState<string>('');
  const [listMovie, setListMovie] = useState<string[]>([]);

  const handleAddMovie = () => {
    // lógica para agregar películas a la lista si es necesario
  };

  const handleSearchClick = async () => {
    // llamada a la función para obtener películas de la base de datos
    try {
      const movies = await fetchMovies(searchMovie);
      setListMovie(movies);
    } catch (error) {
      console.error("Error al obtener películas:", error);
    }
  };

  return (
    <div>
      <h1>MovieApp - Search Movie</h1>
      <input
        type="text"
        value={searchMovie}
        onChange={(e) => setSearchMovie(e.target.value)}
        placeholder="Movie"
      />
      <button id="btnBuscarPelis" onClick={handleSearchClick}>
        Buscar
      </button>
    </div>
  );
};

//  fetchMovies es una función que obtiene películas de la base de datos
const fetchMovies = async (query: string): Promise<string[]> => {
  //   implementar la lógica para obtener películas de la base de datos
  return ['Película 1', 'Película 2', 'Película 3'];
};

export default MovieApp;