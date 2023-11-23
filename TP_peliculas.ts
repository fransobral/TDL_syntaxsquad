import fetch from 'node-fetch';

class MovieDB {
    apiKey = "08c6fb59f7c71d29805136fe34281282";
    constructor(apiKey:string) {
        this.apiKey = apiKey;
    }

    async fetchFromAPI(url) {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Error en la búsqueda de películas. Código de estado: ${response.status}`);
        }
        return await response.json();
    }

    async searchMovieByName(movieName) {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURI(movieName)}`;
        const searchData = await this.fetchFromAPI(searchUrl);

        if (searchData.results && searchData.results.length > 0) {
        const firstMovie = searchData.results[0];
        const movieId = firstMovie.id;

        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`;
        return await this.fetchFromAPI(movieUrl);
        } else {
        throw new Error('No se encontraron resultados para la película.');
        }
    }

    async searchMoviesByActor(actorName) {
        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&query=${encodeURI(actorName)}`;
        const actorData = await this.fetchFromAPI(actorUrl);

        if (actorData.results && actorData.results.length > 0) {
        return actorData.results[0].known_for;
        } else {
        throw new Error('No se encontraron películas para el actor especificado.');
        }
    }

    async searchMoviesByYear(year) {
        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&primary_release_year=${year}`;
        const yearData = await this.fetchFromAPI(yearUrl);

        if (yearData.results && yearData.results.length > 0) {
        return yearData.results;
        } else {
        throw new Error('No se encontraron películas para el año especificado.');
        }
    }

    async searchMoviesByNationality(nationality) {
        const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&region=${nationality}`;
        const nationalityData = await this.fetchFromAPI(nationalityUrl);

        if (nationalityData.results && nationalityData.results.length > 0) {
        return nationalityData.results;
        } else {
        throw new Error('No se encontraron películas para la nacionalidad especificada.');
        }
    }

    async searchMoviesByGenre(genreId) {
        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}`;
        const genreData = await this.fetchFromAPI(genreUrl);

        if (genreData.results && genreData.results.length > 0) {
        return genreData.results;
        } else {
        throw new Error('No se encontraron películas para el género especificado.');
        }
    }

    async searchMovieByFName(movieName) {
      try {
        // Paso 1: Buscar la película por nombre
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURI(movieName)}`;
        const searchResponse = await fetch(searchUrl);
    
        if (!searchResponse.ok) {
          throw new Error(`Error en la búsqueda de películas. Código de estado: ${searchResponse.status}`);
        }
    
        const searchData = await searchResponse.json();
    
        // Paso 2: Obtener información detallada de la primera película encontrada
        if (searchData.results && searchData.results.length > 0) {
          const firstMovie = searchData.results[0];
          const movieId = firstMovie.id;
    
          const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}`;
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
}

const movieDB = new MovieDB('08c6fb59f7c71d29805136fe34281282');

const año = "2019"

// Buscar películas del año 2019
movieDB.searchMoviesByYear(año)
  .then(movies => {
    console.log(``);
    console.log(`20 peliculas del año ${año}:`);
    // Imprimir las primeras 20 películas
    for (let i = 0; i < 20; i++) {
      console.log(`${i+1}. ${movies[i].title}`);
    }
    console.log(``);
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
  });

// Buscar 3 peliculas en las que actue Brad Pitt
const actor = 'Brad Pitt';

movieDB.searchMoviesByActor(actor)
  .then(movies => {
    console.log(``);
    console.log(`Las películas en las que aparece ${actor} son:`);
    // Imprimir las primeras 3 películas
    for (let i = 0; i < 3; i++) {
      console.log(`${i+1}. ${movies[i].title}`);
    }
    console.log(``);
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
  });



 // const movieDB = new MovieDB('08c6fb59f7c71d29805136fe34281282');
//  adult:false
//  backdrop_path:'/r0kZNywAeN6Ar75rxDqLlTP5RiJ.jpg'
//  genre_ids:(3) [80, 53, 18]
//  id:475557
//  original_language:'en'
//  original_title:'Joker'
//  overview:
//  'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.'
//  popularity:92.884
//  poster_path:'/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'
//  release_date:'2019-10-01'
//  title:'Joker'
//  video:false
//  vote_average:8.165
//  vote_count:23667
const filmName = "Joker";
  // Buscar peli por nombre
movieDB.searchMovieByFName(filmName)
.then(movies => {
  console.log(``);
  console.log(`Pelicula: ${filmName}`);
     
  console.log(`${movies[0] }`);
  }  
)
.catch(error => {
  console.error(`Error: ${error.message}`);
});


