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

        const movies: Movie[] = data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            genre_ids: movie.genre_ids

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
        // const response: QueryResult = await pool.query('select * from user_movie');
        const favoriteMoviesIds = [19761, 753342, 84958, 475557];
        let recommendations = await getSuggestedMovies(favoriteMoviesIds);
        return res.status(200).json(recommendations);
    } catch (error) {
        return printError(error, res);
    }
}

// getSuggestedMovies(favoriteMoviesIds).then(suggestedMovies => {
//     const util = require('util')
//     console.log('Películas sugeridas:', util.inspect(suggestedMovies, false, null, true /* enable colors */))
// });