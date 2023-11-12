import fetch from 'node-fetch';

async function searchMovieByName(apiKey: string, movieName: string): Promise<any> {
  try {
    // Paso 1: Buscar la película por nombre
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURI(movieName)}`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      throw new Error(`Error en la búsqueda de películas. Código de estado: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Paso 2: Obtener información detallada de la primera película encontrada
    if (searchData.results && searchData.results.length > 0) {
      const firstMovie = searchData.results[0];
      const movieId = firstMovie.id;

      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
      const movieResponse = await fetch(movieUrl);

      if (!movieResponse.ok) {
        throw new Error(`Error when retrieving movie information. Status code: ${movieResponse.status}`);
      }

      const movieData = await movieResponse.json();
      return movieData;
    } else {
      throw new Error('No results were found for the movie.');
    }
  } catch (error) {
    throw new Error(`Error in the movie search.: ${error.message}`);
  }
}

const apiKey = '08c6fb59f7c71d29805136fe34281282'; // Reemplaza con tu clave de API válida de TMDb
const movieName = 'Avatar'; // Reemplaza con el nombre de la película que deseas buscar


function printMovieDetails(movieInfo) {
  const { title, release_date, budget, overview, vote_average, genres } = movieInfo;
  const releaseYear = release_date.split('-')[0];
  const genreNames = genres.map((genre) => genre.name).join(', ');

  console.log('Movie Name:', title);
  console.log('Release Year:', releaseYear);
  console.log('Budget:', budget);
  console.log('Description:', overview);
  console.log('Rating:', vote_average);
  console.log('Genre:', genreNames);
}

// Example usage:
searchMovieByName(apiKey, movieName).then((movieInfo) => {
    printMovieDetails(movieInfo);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


async function searchMoviesByGenre(apiKey, genreId) {
  try {
    // Paso 1: Obtener la lista de películas por género
    const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
    const genreResponse = await fetch(genreUrl);

    if (!genreResponse.ok) {
      throw new Error(`Error en la búsqueda de películas por género. Código de estado: ${genreResponse.status}`);
    }

    const genreData = await genreResponse.json();

    // Paso 2: Retornar la lista de películas encontradas
    if (genreData.results && genreData.results.length > 0) {
      return genreData.results;
    } else {
      throw new Error('No se encontraron películas para el género especificado.');
    }
  } catch (error) {
    throw new Error(`Error en la búsqueda de películas por género: ${error.message}`);
  }
}

// Example usage:
const genreId = 28; // Reemplaza con el ID del género que deseas buscar (28 es el ID para el género "Acción")
searchMoviesByGenre(apiKey, genreId).then((movies) => {
    console.log(`Películas del género con ID ${genreId}:`);
    movies.forEach((movie) => {
      console.log(`- ${movie.title} (${movie.release_date.split('-')[0]})`);
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
