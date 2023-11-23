// import fetch from 'node-fetch';

// const apiKey = '08c6fb59f7c71d29805136fe34281282'; // Reemplaza con tu clave de API válida de TMDb

// async function searchMovieByName(apiKey: string, movieName: string): Promise<any> {
//   try {
//     // Paso 1: Buscar la película por nombre
//     const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURI(movieName)}`;
//     const searchResponse = await fetch(searchUrl);

//     if (!searchResponse.ok) {
//       throw new Error(`Error en la búsqueda de películas. Código de estado: ${searchResponse.status}`);
//     }

//     const searchData = await searchResponse.json();

//     // Paso 2: Obtener información detallada de la primera película encontrada
//     if (searchData.results && searchData.results.length > 0) {
//       const firstMovie = searchData.results[0];
//       const movieId = firstMovie.id;

//       const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
//       const movieResponse = await fetch(movieUrl);

//       if (!movieResponse.ok) {
//         throw new Error(`Error when retrieving movie information. Status code: ${movieResponse.status}`);
//       }

//       const movieData = await movieResponse.json();
//       return movieData;
//     } else {
//       throw new Error('No results were found for the movie.');
//     }
//   } catch (error) {
//     throw new Error(`Error in the movie search.: ${error.message}`);
//   }
// }

// // Buscar películas por actor/actriz
// async function searchMoviesByActor(apiKey, actorName) {
//   try {
//     const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURI(actorName)}`;
//     const actorResponse = await fetch(actorUrl);

//     if (!actorResponse.ok) {
//       throw new Error(`Error en la búsqueda de películas por actor. Código de estado: ${actorResponse.status}`);
//     }

//     const actorData = await actorResponse.json();

//     if (actorData.results && actorData.results.length > 0) {
//       return actorData.results[0].known_for;
//     } else {
//       throw new Error('No se encontraron películas para el actor especificado.');
//     }
//   } catch (error) {
//     throw new Error(`Error en la búsqueda de películas por actor: ${error.message}`);
//   }
// }

// // Buscar películas por año
// async function searchMoviesByYear(apiKey, year) {
//   try {
//     const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}`;
//     const yearResponse = await fetch(yearUrl);

//     if (!yearResponse.ok) {
//       throw new Error(`Error en la búsqueda de películas por año. Código de estado: ${yearResponse.status}`);
//     }

//     const yearData = await yearResponse.json();

//     if (yearData.results && yearData.results.length > 0) {
//       return yearData.results;
//     } else {
//       throw new Error('No se encontraron películas para el año especificado.');
//     }
//   } catch (error) {
//     throw new Error(`Error en la búsqueda de películas por año: ${error.message}`);
//   }
// }

// // Buscar películas por nacionalidad
// async function searchMoviesByNationality(apiKey, nationality) {
//   try {
//     const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=${nationality}`;
//     const nationalityResponse = await fetch(nationalityUrl);

//     if (!nationalityResponse.ok) {
//       throw new Error(`Error en la búsqueda de películas por nacionalidad. Código de estado: ${nationalityResponse.status}`);
//     }

//     const nationalityData = await nationalityResponse.json();

//     if (nationalityData.results && nationalityData.results.length > 0) {
//       return nationalityData.results;
//     } else {
//       throw new Error('No se encontraron películas para la nacionalidad especificada.');
//     }
//   } catch (error) {
//     throw new Error(`Error en la búsqueda de películas por nacionalidad: ${error.message}`);
//   }
// }
// //Buscar pelicula por genero
// async function searchMoviesByGenre(apiKey, genreId) {
//   try {
//     // Paso 1: Obtener la lista de películas por género
//     const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
//     const genreResponse = await fetch(genreUrl);

//     if (!genreResponse.ok) {
//       throw new Error(`Error en la búsqueda de películas por género. Código de estado: ${genreResponse.status}`);
//     }

//     const genreData = await genreResponse.json();

//     // Paso 2: Retornar la lista de películas encontradas
//     if (genreData.results && genreData.results.length > 0) {
//       return genreData.results;
//     } else {
//       throw new Error('No se encontraron películas para el género especificado.');
//     }
//   } catch (error) {
//     throw new Error(`Error en la búsqueda de películas por género: ${error.message}`);
//   }
// }


// function printMovieDetails(movieInfo) {
//   const { title, release_date, budget, overview, vote_average, genres } = movieInfo;
//   const releaseYear = release_date.split('-')[0];
//   const genreNames = genres.map((genre) => genre.name).join(', ');

//   console.log('Movie Name:', title);
//   console.log('Release Year:', releaseYear);
//   console.log('Budget:', budget);
//   console.log('Description:', overview);
//   console.log('Rating:', vote_average);
//   console.log('Genre:', genreNames);
// }

// // Example usage:
// const movieName = 'Avatar'; // Reemplaza con el nombre de la película que deseas buscar

// searchMovieByName(apiKey, movieName).then((movieInfo) => {
//     printMovieDetails(movieInfo);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


// // Example usage:
// const genreId = 28; // Reemplaza con el ID del género que deseas buscar (28 es el ID para el género "Acción")
// searchMoviesByGenre(apiKey, genreId).then((movies) => {
//     console.log(`Películas del género con ID ${genreId}:`);
//     movies.forEach((movie) => {
//       console.log(`- ${movie.title} (${movie.release_date.split('-')[0]})`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// // Example usage:
// const actorName = 'Brad Pitt'; // Reemplaza con el nombre del actor que deseas buscar
// searchMoviesByActor(apiKey, actorName).then((movies) => {
//     console.log(`Películas con ${actorName}:`);
//     movies.forEach((movie) => {
//       console.log(`- ${movie.title} (${movie.release_date.split('-')[0]})`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// // Example usage:
// const nationality = 'US'; // Reemplaza con el código de país que deseas buscar
// searchMoviesByNationality(apiKey, nationality).then((movies) => {
//     console.log(`Películas de ${nationality}:`);
//     movies.forEach((movie) => {
//       console.log(`- ${movie.title} (${movie.release_date.split('-')[0]})`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


// // Example usage:
// const year = 2020; // Reemplaza con el año que deseas buscar
// searchMoviesByYear(apiKey, year).then((movies) => {
//     console.log(`Películas del año ${year}:`);
//     movies.forEach((movie) => {
//       console.log(`- ${movie.title} (${movie.release_date.split('-')[0]})`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
