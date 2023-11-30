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

    async searchMoviesByActor(actorName: string): Promise<any[]> {
        try {
            const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&query=${encodeURI(actorName)}`;
            const actorData = await this.fetchFromAPI(actorUrl);

            if (actorData.results && actorData.results.length > 0) {
                const actorId = actorData.results[0].id;

                const moviesUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${this.apiKey}`;
                const moviesData = await this.fetchFromAPI(moviesUrl);

                if (moviesData.cast && moviesData.cast.length > 0) {
                    return moviesData.cast;
                } else {
                    throw new Error('No se encontraron películas para el actor especificado.');
                }
            } else {
                throw new Error('Actor no encontrado.');
            }
        } catch (error) {
            throw new Error(`Error al buscar películas por actor: ${error.message}`);
        }
    }

    async printMoviesByActor(actorName: string): Promise<void> {
        try {
            const movies = await this.searchMoviesByActor(actorName);
            console.log(`Las 10 primeras películas en las que aparece ${actorName}:`);
            const firstTenMovies = movies.slice(0, 10);
            firstTenMovies.forEach((movie, index) => {
                console.log(`${index + 1}. ${movie.title}`);
            });
            console.log('');
        } catch (error) {
            console.error(`Error: ${error.message}`);
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

    async printMoviesByYear(year: string): Promise<void> {
        try {
            const movies = await this.searchMoviesByYear(year);
            console.log(`Películas del año ${year}:`);
            movies.forEach((movie, index) => {
                console.log(`${index + 1}. ${movie.title}`);
            });
            console.log('');
        } catch (error) {
            console.error(`Error: ${error.message}`);
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

  async printTopMoviesByGenre(genreId) {
    try {
        const movies = await this.searchTopMoviesByGenre(genreId);
        console.log(`Top 10 de películas del género con ID ${genreId} según IMDB:`);
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
        });
        console.log('');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

    async searchTopMoviesByActor(actorName: string): Promise<any[]> {
    try {
        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&query=${encodeURI(actorName)}`;
        const actorData = await this.fetchFromAPI(actorUrl);

        if (actorData.results && actorData.results.length > 0) {
            const actorId = actorData.results[0].id;
            const actorMoviesUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${this.apiKey}`;
            const moviesData = await this.fetchFromAPI(actorMoviesUrl);

            if (moviesData.cast && moviesData.cast.length > 0) {
                const movies = moviesData.cast.slice(0, 10);
                const sortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
                return sortedMovies;
            } else {
                throw new Error('No se encontraron películas para el actor especificado.');
            }
        } else {
            throw new Error('Actor no encontrado.');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return []; // Devolver un array vacío en caso de error
    }
}

    
    async printTopMoviesByActor(actorName: string): Promise<void> {
        try {
            const movies = await this.searchTopMoviesByActor(actorName);
            console.log(`Top 10 de películas de ${actorName} ordenadas por rating:`);
            movies.forEach((movie, index) => {
                console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
            });
            console.log('');
        } catch (error) {
            console.error(`Error: ${error.message}`);
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

    async printTopMoviesByNationality(nationality: string): Promise<void> {
    try {
        const movies = await this.searchTopMoviesByNationality(nationality);
        console.log(`Top 10 de películas de nacionalidad ${nationality} ordenadas por rating:`);
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
        });
        console.log('');
    } catch (error) {
        console.error(`Error: ${error.message}`);
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

    async printTopMoviesByYear(year: string): Promise<void> {
    try {
        const movies = await this.searchTopMoviesByYear(year);
        console.log(`Top 10 de películas del año ${year} ordenadas por rating:`);
        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} - Rating: ${movie.vote_average}`);
        });
        console.log('');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
  
}

const movieDB = new MovieDB('08c6fb59f7c71d29805136fe34281282');

const año = "2019"
// Buscar películas del año 2019
movieDB.printMoviesByYear(año)

// Buscar peliculas en las que actue Will Smith
const actor = 'Will Smith';
movieDB.printMoviesByActor(actor)

const genreIdCienciaFiccion = 878;
movieDB.printTopMoviesByGenre(genreIdCienciaFiccion)
      
movieDB.printTopMoviesByActor(actor)

const nationality = 'US';
movieDB.printTopMoviesByNationality(nationality)

movieDB.printTopMoviesByYear(año)