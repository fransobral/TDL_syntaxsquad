import { Request, Response } from 'express';
import { RequestInfo } from 'undici-types';
import { QueryResult } from 'pg';
import { pool } from '../DataBase';

const API_KEY = '08c6fb59f7c71d29805136fe34281282';

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}

async function getMovieGenres(movieId: number): Promise<number[]> {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Error al obtener los géneros de la película ${movieId}. Código de estado: ${response.status}`);
        }

        const data = await response.json();

        // Obtener los IDs de géneros de la película
        const genres: number[] = data.genres.map((genre: any) => genre.id);

        return genres;
    } catch (error) {
        throw new Error(`Error al obtener los géneros de la película ${movieId}: ${error}`);
    }
}


interface Actor {
    id: number;
    name: string;

}
interface Gender {
    id: number;
    name: string;
}

async function getActorsByMovie(movieId: number): Promise<Actor[]> {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Error al obtener los actores de la película ${movieId}. Código de estado: ${response.status}`);
        }

        const data = await response.json();


        const actors: Actor[] = data.cast.map((actor: any) => ({
            id: actor.id,
            name: actor.name,

        }));

        return actors;
    } catch (error) {
        throw new Error(`Error al obtener los actores de la película ${movieId}: ${error}`);
    }
}


async function getFavoriteGenres(movieIds: number[]): Promise<number[]> {
    try {
        const promises = movieIds.map(movieId => getMovieGenres(movieId));
        const genresArrays = await Promise.all(promises);

        const genres = Array.from(new Set(genresArrays.reduce((acc, val) => acc.concat(val), [])));

        return genres;
    } catch (error) {
        throw new Error(`Error al obtener géneros de las películas favoritas: ${error}`);
    }
}


async function getFavoriteActors(movieIds: number[]): Promise<number[]> {
    try {
        const promises = movieIds.map(movieId => getActorsByMovie(movieId));
        const actorsArrays = await Promise.all(promises);


        const actors = actorsArrays.reduce((acc, val) => {
            val.forEach(actor => {
                if (!acc.find(a => a.id === actor.id)) {
                    acc.push(actor);
                }
            });
            return acc;
        }, []);

        return actors.map(actor => actor.id);
    } catch (error) {
        throw new Error(`Error al obtener actores de las películas favoritas: ${error}`);
    }
}


interface Movie {
    id: number;
    title: string;
    genre_ids: number[];
    actorMatch: any;
    genders: Gender[];
    actors: Actor[];
    overview: string;
    release_date: Date;
}

async function getMoviesByYear(year: number): Promise<Movie[]> {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}`
        );

        if (!response.ok) {
            throw new Error(`Error al obtener las películas del año ${year}. Código de estado: ${response.status}`);
        }

        const data = await response.json();

        const movies: Movie[] = data.results.map((movie: Movie) => ({
            id: movie.id,
            title: movie.title,
            genre_ids: movie.genre_ids,
            overview: movie.overview,
            release_date: movie.release_date
        }));

        return movies;
    } catch (error) {
        throw new Error(`Error al obtener las películas del año ${year}: ${error}`);
    }
}


async function obtenerGeneroPorId(id: number): Promise<Gender> {
    const url = new URL(`https://api.themoviedb.org/3/genre/${id}?api_key=${API_KEY}`);
    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        let gender: Gender = {
            id: data.id,
            name: data.name
        }
        return gender;
    } catch (error) {
        console.error(`Error al obtener el género con ID ${id}:`, error);
        throw error;
    }
}


async function obtenerGenerosPorIds(ids: number[]): Promise<Gender[]> {
    try {
        const fetchPromises = ids.map(id => obtenerGeneroPorId(id));
        const genres = await Promise.all(fetchPromises);
        return genres;
    } catch (error) {
        console.error('Error al obtener los géneros:', error);
        throw error;
    }
}



// Función para obtener sugerencias de películas
async function getSuggestedMovies(movieIds: number[]): Promise<Movie[]> {
    const favoriteGenres = await getFavoriteGenres(movieIds);
    const favoriteActors = await getFavoriteActors(movieIds);


    const suggestions: Movie[] = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1900 && suggestions.length < 10; year--) {
        try {

            let movies = await getMoviesByYear(year);
            movies = movies.filter(movie => !movieIds.includes(movie.id));

            for (let movie of movies) {
                if (suggestions.length >= 10) {
                    break;
                }
                const matchedGenres = movie.genre_ids.some(genre => favoriteGenres.includes(genre));
                let matchedActors: boolean = false;
                if (!matchedGenres) {

                    const movieActors = await getActorsByMovie(movie.id);

                    let actor = movieActors.find(actor => favoriteActors.includes(actor.id));
                    matchedActors = actor !== undefined;
                    movie.actorMatch = actor;
                }
                if (matchedGenres || matchedActors) {
                    movie.genders = await obtenerGenerosPorIds(movie.genre_ids);
                    suggestions.push(movie);
                }
            }
        } catch (error) {
            console.error(`Error al obtener películas del año ${year}: ${error}`);

        }
    }

    return suggestions;
}

// Uso de la función getSuggestedMovies con una lista de IDs de películas favoritas



export const getRecommendedMovies = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = parseInt(req.params.userId);
        const responseUser: QueryResult = await pool.query('SELECT * FROM users where id = $1', [userId]);

        if ((responseUser.rowCount ?? 0) === 0) {
            return res.status(200).json({ mensaje: "El usuario: " + userId + " no se encuentra registrado en la base de datos" });
        }
        const response: QueryResult = await pool.query('SELECT movie_id FROM public.user_movie WHERE user_id=$1', [userId]);

        if ((response.rowCount ?? 0) > 0) {
            const favoriteMoviesIds = response.rows.map(x => x.movie_id);

            let recommendations = await getSuggestedMovies(favoriteMoviesIds);

            const transformedRecommendations = recommendations.map(movie => {
                const genders = movie.genre_ids.map(genreId => {
                    const foundGenre = movie.genders.find(genre => genre.id === genreId);
                    return foundGenre ? foundGenre.name : '';
                });
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    genders
                };
            });

            const actorsByMovieId: { [key: number]: Actor[]; } = await getActorsByMovies(recommendations);

            const transformedMoviesWithActors = transformedRecommendations.map(movie => {
                const actors = actorsByMovieId[movie.id] || []; // Obtener los actores para la película actual o un array vacío si no hay información
                const movieActors = actors.map(x => x.name);
                return {
                    ...movie,
                    movieActors,
                };
            });

            return res.status(200).json(transformedMoviesWithActors);
        } else {
            const result = await getTopMoviesForEachGenre();
            return res.status(200).json(result);
        }

    } catch (error) {
        return printError(error, res);
    }

    async function getActorsByMovies(recommendations: Movie[]) {
        const promises = recommendations.map(x => x.id).map(movieId => getActorsByMovie(movieId));
        const actorsArrays = await Promise.all(promises);

        const actorsByMovieId: { [key: number]: Actor[]; } = {};

        recommendations.forEach((movie, index) => {
            const movieId = movie.id;
            actorsByMovieId[movieId] = actorsArrays[index];
        });
        return actorsByMovieId;
    }
}

// Obtener las dos películas más populares por género sin repetir películas y limitando a 2 por género
async function getTopMoviesByGenre(genreId: number, moviesAlreadyAdded: number[]): Promise<any> {
    const response = await fetch(`http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres=${genreId}&api_key=${API_KEY}`);
    const data = await response.json();

    const topMovies = data.results.filter((movie: { id: number; }) => !moviesAlreadyAdded.includes(movie.id)).slice(0, 2);

    topMovies.forEach((movie: { id: number; }) => moviesAlreadyAdded.push(movie.id));

    return topMovies;
}

// Obtener las dos películas principales por género para todos los géneros sin repeticiones
async function getTopMoviesForEachGenre() {
    try {
        let genres = [
            { id: 35, name: "Comedy" },
            { id: 53, name: "Thriller" },
            { id: 10751, name: "Family" },
            { id: 28, name: "Action" },
            { id: 12, name: "Adventure" }
        ];

        let moviesAdded: number[] = [];
        let results: any[] = [];

        for (const genre of genres) {
            const topMovies = await getTopMoviesByGenre(genre.id, moviesAdded);

            results.push({ genre: genre.name, topMovies });
        }
       // console.log("results", results)
        const enrichResult = await enrichMoviesWithDetails(results);

        return enrichResult;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function enrichMoviesWithDetails(movies: any[]): Promise<any[]> {
    const enrichedMovies = [];

    const fetchMovieDetails = async (movie: { id: number; }) => {
        const movieDetailsPromise = getMovieDetails(movie.id);
        // const actorsPromise = getActorsForMovie(movie.id);

        const [movieDetails] = await Promise.all([movieDetailsPromise]);

        return movieDetails;
    };

    for (const genreMovies of movies) {
        if (genreMovies) {
            const moviesPromises = genreMovies.topMovies.map((movie: { id: number; }) => fetchMovieDetails(movie));
            const moviesDetails = await Promise.all(moviesPromises);
            enrichedMovies.push(...moviesDetails);
        }
    }

    return enrichedMovies;
}
// Función para obtener los actores de una película por su ID
async function getActorsForMovie(movieId: number): Promise<any> {
    const response = await fetch(`http://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
    const data = await response.json();
    return data.cast.map((actor: any) => actor.name);
}

// Función para obtener detalles adicionales de una película por su ID
async function getMovieDetails(movieId: number): Promise<any> {
    const response = await fetch(`http://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const data = await response.json();
    const genres = data.genres.map((genre: any) => genre.name);

    const actors = await getActorsForMovie(movieId);

    return {
        id: data.id,
        title: data.title,
        overview: data.overview,
        release_date: data.release_date,
        genres: genres,
        movieActors: actors
    };
}



//----------------------------------------
//RECOMENDADOR 2

export const getRecommendationsByYears = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = parseInt(req.params.userId);

        const responseUser: QueryResult = await pool.query('SELECT * FROM users where id = $1', [userId]);

        if ((responseUser.rowCount ?? 0) === 0) {
            return res.status(200).json({ mensaje: "El usuario: " + userId + " no se encuentra registrado en la base de datos" });
        }
        const response: QueryResult = await pool.query('SELECT movie_id FROM public.user_movie WHERE user_id=$1', [userId]);

        if ((response.rowCount ?? 0) > 0) {

            const resultRec = await recomendacionPorAnioDeFavoritos(response.rows.map(x => x.movie_id));
            return res.status(200).json(resultRec);
        } else {
            const result = await getTopMoviesForEachGenre();
            return res.status(200).json(result);
        }

    }
    catch (error) {
        return printError(error, res);
    }
}


interface MovieYear {
    id: number;
    year: number;
}
interface Recommendation {
    year: number;
    recoCount: number;
}

async function fetchMovies(year: number, recoCount: number): Promise<Movie[]> {
    const response = await fetch(
        `http://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&sort_by=popularity.desc&primary_release_year=${year}`
    );

    if (!response.ok) {
        console.error(`No se pudo obtener películas para el año ${year}.`);
        return [];
    }

    const data = await response.json();
    const movies: Movie[] = data.results.slice(0, recoCount);
    return movies;
}

async function recommendMovies(recommendations: Recommendation[]): Promise<any> {
    try {
        const promises = recommendations.map(({ year, recoCount }) =>
            fetchMovies(year, recoCount)
        );

        const movieLists = await Promise.all(promises);

        return movieLists.flat();
    } catch (error) {
        console.error('Hubo un error al obtener las recomendaciones de películas:', error);
    }

}

async function getMoviesInfoParallel(ids: number[]): Promise<Array<MovieYear>> {
    try {
        const movieInfoPromises = ids.map((id) => getMovieInfo(id));
        const moviesInfo = await Promise.all(movieInfoPromises);
        return moviesInfo;
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener información de películas en paralelo:', error);
        throw error;
    }
}
async function getMovieInfo(movieId: number): Promise<MovieYear> {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error al obtener información de la película con ID ${movieId}`);
        }
        const movieData = await response.json();
        const { id, release_date } = movieData;

        // Extraer el año de la fecha de lanzamiento
        const releaseYear = (release_date && new Date(release_date).getFullYear()) || null;

        return { id, year: releaseYear };
    } catch (error) {
        // Manejo de errores
        console.error(`Error al obtener información de la película con ID ${movieId}:`, error);
        throw error;
    }
}

async function recomendacionPorAnioDeFavoritos(ids: number[]): Promise<any[]> {

    const favoriteMovies = await getMoviesInfoParallel(ids);

    const yearsMap = favoriteMovies.reduce((acc: { [key: number]: number }, movie: MovieYear) => {
        acc[movie.year] = (acc[movie.year] || 0) + 1;
        return acc;
    }, {});

    const totalFavoriteMovies = favoriteMovies.length;
    const percentages: { [key: number]: number } = {};
  
    for (const year in yearsMap) {
        percentages[year] = (yearsMap[year] / totalFavoriteMovies) * 100;
    }
  
    const totalMovies = 10; // Total de películas recomendadas
  


    const movieCounts: Recommendation[] = [];

    for (const yearKey in percentages) {
        if (percentages.hasOwnProperty(yearKey)) {
            const percentage = percentages[yearKey];
            const Recommendation = Math.trunc((percentage * totalMovies) / 100);
            movieCounts.push({ year: Number(yearKey), recoCount: Recommendation });
        }

    }


    // Encontrar la película con el recocount más alto 
    let maxCountMovie = movieCounts[0].recoCount;
    let maxIndex: number = 0;
    for (let i = 1; i < movieCounts.length; i++) {
        if (movieCounts[i].recoCount > maxCountMovie) {
            maxCountMovie = movieCounts[i].recoCount;
            maxIndex = i;
        }
    }

    // Calculando la suma total actual de las recomendaciones
    const totalCurrentRecommendations = movieCounts.reduce((total, movie) => total + movie.recoCount, 0);

    const diff = 10 - totalCurrentRecommendations;
    movieCounts[maxIndex].recoCount += diff;

    const result = await recommendMovies(movieCounts);

    const moviesWithDetails = await Promise.all(result.map((x: { id: any; }) => x.id).map(async (movieId: number) => {
        try {
            const movieDetails = await getMovieDetails(movieId);
            return movieDetails;
        } catch (error) {
            console.error(`Error obteniendo detalles para la película con ID ${movieId}: ${error}`);
            return null;
        }
    }));

    // console.log("Recommendation final: ");
    // console.log(moviesWithDetails);
    return moviesWithDetails;
    //peliculas del año orden por puntuacion


}

