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
    async searchTopMoviesByGenre(genreId) {
      const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=vote_average.desc`;
      const genreData = await this.fetchFromAPI(genreUrl);
  
      if (genreData.results && genreData.results.length > 0) {
          return genreData.results.slice(0, 10); // Devolver solo las primeras 10 películas (top 10)
      } else {
          throw new Error('No se encontraron películas para el género especificado.');
      }
  }

  async searchTopMoviesByActor(actorName) {
    const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&query=${encodeURI(actorName)}`;
    const actorData = await this.fetchFromAPI(actorUrl);

    if (actorData.results && actorData.results.length > 0) {
        const movies = actorData.results[0].known_for.slice(0, 10);
        return movies.sort((a, b) => b.vote_average - a.vote_average); // Ordenar por rating (descendente)
    } else {
        throw new Error('No se encontraron películas para el actor especificado.');
    }
}

async searchTopMoviesByNationality(nationality) {
    const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&region=${nationality}`;
    const nationalityData = await this.fetchFromAPI(nationalityUrl);

    if (nationalityData.results && nationalityData.results.length > 0) {
        return nationalityData.results.slice(0, 10).sort((a, b) => b.vote_average - a.vote_average); // Ordenar por rating (descendente)
    } else {
        throw new Error('No se encontraron películas para la nacionalidad especificada.');
    }
}

async searchTopMoviesByYear(year) {
    const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&primary_release_year=${year}`;
    const yearData = await this.fetchFromAPI(yearUrl);

    if (yearData.results && yearData.results.length > 0) {
        return yearData.results.slice(0, 10).sort((a, b) => b.vote_average - a.vote_average); // Ordenar por rating (descendente)
    } else {
        throw new Error('No se encontraron películas para el año especificado.');
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

// Buscar 3 peliculas en las que actue Margot Robbie
const actor = 'Margot Robbie';

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

  const genreIdCienciaFiccion = 878;

  movieDB.searchTopMoviesByGenre(genreIdCienciaFiccion)
      .then(movies => {
          console.log(`Top 10 de películas de Ciencia Ficción segun IMBD:`);
          movies.forEach((movie, index) => {
              console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
          });
          console.log('');
      })
      .catch(error => {
          console.error(`Error: ${error.message}`);
      });
  
movieDB.searchTopMoviesByActor(actor)
.then(movies => {
    console.log(`Top 10 de películas de ${actor} ordenadas por rating:`);
    movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
    });
    console.log('');
})
.catch(error => {
    console.error(`Error: ${error.message}`);
});

const nationality = 'US';
movieDB.searchTopMoviesByNationality(nationality)
    .then(movies => {
        console.log(`Top 10 de películas de nacionalidad ${nationality} ordenadas por rating:`);
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
        });
        console.log('');
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });

movieDB.searchTopMoviesByYear(año)
.then(movies => {
    console.log(`Top 10 de películas del año ${año} ordenadas por rating:`);
    movies.forEach((movie, index) => {
        console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
    });
    console.log('');
})
.catch(error => {
    console.error(`Error: ${error.message}`);
});