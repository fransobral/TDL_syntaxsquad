/*const get = require('node-fetch');

const url = 'https://api.themoviedb.org/3/search/movie?query=cars&include_adult=true&language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGM2ZmI1OWY3YzcxZDI5ODA1MTM2ZmUzNDI4MTI4MiIsInN1YiI6IjY1NDdlZWI1ZmQ0ZjgwMDEwMWI2NjQ2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4WyKoXflFM4maKB0N3BE6H6pIb12dGRiXnkmZ5-y2Qg'
  }
};

get(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
*/
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
          throw new Error(`Error al obtener la información de la película. Código de estado: ${movieResponse.status}`);
        }
  
        const movieData = await movieResponse.json();
        return movieData;
      } else {
        throw new Error('No se encontraron resultados para la película.');
      }
    } catch (error) {
      throw new Error(`Error en la búsqueda de la película: ${error.message}`);
    }
  }
  
  const apiKey = '08c6fb59f7c71d29805136fe34281282'; // Reemplaza con tu clave de API válida de TMDb
  const movieName = 'cars'; // Reemplaza con el nombre de la película que deseas buscar
  
  searchMovieByName(apiKey, movieName)
    .then((movieInfo) => {
      console.log('Información de la película:', movieInfo);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  