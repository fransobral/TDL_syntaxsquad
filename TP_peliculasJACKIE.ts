import fetch from 'node-fetch';
class Movie {
  public title: string;
  public genres: string[];
  public actors: string[];

  constructor(title: string, genres: string[], actors: string[]) {
      this.title = title;
      this.genres = genres;
      this.actors = actors;
  }
}


class MovieDB {
    apiKey = "08c6fb59f7c71d29805136fe34281282";
    movieDatabase: Movie[] = [];  

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

    

    async searchMoviesByYear(year) {
        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&primary_release_year=${year}`;
        const yearData = await this.fetchFromAPI(yearUrl);

        if (yearData.results && yearData.results.length > 0) {
        return yearData.results;
        } else {
        throw new Error('No se encontraron películas para el año especificado.');
        }
    }

 

  async searchMoviesByYear_JO(year: number): Promise<void> {
    try {
        const yearMovies = await this.fetchFromAPI(`https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&primary_release_year=${year}`);
        
        if (yearMovies.results && yearMovies.results.length > 0) {
            for (const movieData of yearMovies.results) {
                const movie = new Movie(movieData.title, movieData.genres, movieData.actors);
                this.movieDatabase.push(movie);
            }
        }
    } catch (error) {
        console.error(`Error al buscar películas del año ${year}: ${error.message}`);
    }
}



}


class MovieRecommender {
  private movieDatabase: Movie[];

  constructor(movieDatabase: Movie[]) {
      this.movieDatabase = movieDatabase;
  }

  public recommendMovies(userFavorites: Movie[]): Movie[] | undefined {
      const recommendedMovies: Movie[] = [];
      let count = 0; 
      if (userFavorites.length === 0) { 
          for (const movie of this.movieDatabase) {
              if (count >= 10) {
                  break; 
              }
              recommendedMovies.push(movie);    
              count++;
          }
      } else {  
          for (const userMovie of userFavorites) {
              if (count >= 10) {
                  break; 
              }
// usar el metodo movieDB.searchMoviesByYear(año) , los años comienzan desde el 2023 hasta el 1000    
//esta guardado en movieDatabase 

              for (const movie of this.movieDatabase) {      
               
                  const similarGenres = userMovie.genres.some(genre => movie.genres.includes(genre));


                  // Verificamos la similitud de actores
                  const similarActors = userMovie.actors.some(actor => movie.actors.includes(actor));

               
                  if ((similarGenres || similarActors) && !userFavorites.includes(movie)) {
                      recommendedMovies.push(movie);
                      count++; 5
                      break;
                  }
              }
          }
      }
      console.log(`${recommendedMovies}`);
     return recommendedMovies.length > 0 ? recommendedMovies : undefined;
  }
}





// Crear una base de datos de películas (ejemplo)
const movieDatabase: Movie[] = [
  new Movie("Pelicula 1", ["Drama", "Accion"], ["BRAD PITT", "ANGELINA"]),
  new Movie("Pelicula 2", ["Drama"], ["ANGELINA"]),
  new Movie("Pelicula 3", ["Drama"], ["ANGELINA"]),
  new Movie("Pelicula 4", ["TERROR"], ["ANGELINA"]),

];



const recommender = new MovieRecommender(movieDatabase);


const userFavorites: Movie[] = [
  new Movie("FAVORITA 1", ["Terror", "Scifi"], ["BRAD PITT"]),
  new Movie("FAVORITA 2", ["Drama"], ["ANGELINA"]),
  new Movie("FAVORITA 3", ["Drama"], ["ANGELINA"]),

];


const recommendedMovies = recommender.recommendMovies(userFavorites);

if (recommendedMovies.length > 0) {
  // Mostrar las películas recomendadas
  console.log("Películas recomendadas:");
  for (const movie of recommendedMovies) {
      console.log(movie.title);
  }
} else {
  console.log("No se han encontrado recomendaciones.");
}
















const movieDB = new MovieDB('08c6fb59f7c71d29805136fe34281282');
///// AGREGUE ESTO

//----------------
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


