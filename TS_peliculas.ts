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
const movieName = 'cars'; // Reemplaza con el nombre de la película que deseas buscar

/* IMPRIME EL JSON COMPLETO
searchMovieByName(apiKey, movieName).then((movieInfo) => {
    console.log('Información de la película:', movieInfo);
  })
  .catch((error) => {
    console.error('Error:', error);
  });*/

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
